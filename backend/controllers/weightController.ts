import prisma from "../DB/db.config";
import express from "express";

export function getWeights(req: express.Request, res: express.Response) {
  async function value() {
    try {
      const userId = req.params.userId;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user)
        return res.status(400).json({
          status: "failed",
          message: "No user found!",
        });
      const weights = await prisma.weights.findMany({
        take: Number(req.query.number),
        where: {
          userId: userId,
        },
        orderBy: {
          recordedAt: "desc",
        },
      });
      res.status(200).json({
        status: "success",
        weights,
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        error,
      });
    }
  }
  value();
}

export async function postWeight(req: express.Request, res: express.Response) {
  async function value() {
    try {
      const { weight, userId, recordedAt } = req.body;
      const createdWeight = await prisma.weights.create({
        data: {
          weight,
          userId,
          recordedAt,
        },
      });
      return res.status(201).json({
        status: "success",
        createdWeight,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "fail",
        error,
      });
    }
  }
  value();
}

export async function updateWeight(
  req: express.Request,
  res: express.Response
) {
  async function value() {
    try {
      const weightId = req.params.weightId;
      const { weight } = req.body;
      const updatedWeight = await prisma.weights.update({
        where: {
          id: Number(weightId),
        },
        data: {
          weight,
        },
      });
      return res.status(201).json({
        status: "success",
        updatedWeight,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "fail",
        error,
      });
    }
  }
  value();
}
export async function deleteWeight(
  req: express.Request,
  res: express.Response
) {
  async function value() {
    try {
      const weightId = req.params.weightId;
      await prisma.weights.delete({
        where: {
          id: Number(weightId),
        },
      });
      return res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "fail",
        error,
      });
    }
  }
  value();
}
