import prisma from "../DB/db.config";
import express from "express";
import { Webhook } from "svix";

export function createUser(req: express.Request, res: express.Response) {
  async function value() {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Get the headers and body
    const headers = req.headers;
    const payload = JSON.stringify(req.body);

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      } as any) as any;
    } catch (err: any) {
      console.log("Error verifying webhook:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data;
    const eventType = evt.type;

    const email = evt.data.email_addresses[0].email_address;
    console.log(id);

    const user = await prisma.user.create({
      data: {
        id,
        name: evt.data.first_name + " " + evt.data.last_name,
        email,
        attributes: evt.data,
      },
    });

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

    return res.status(200).json({
      success: true,
      user,
      message: "User stored to the DB successfully",
    });
  }
  value();
}
