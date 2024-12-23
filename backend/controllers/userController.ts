// import prisma from "../DB/db.config";
// import express from "express";

// export function getUsers(req: express.Request, res: express.Response) {
//   async function value() {
//     try {
//       const users = await prisma.user.findMany();
//       res.status(200).json({
//         status: "success",
//         users,
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: "fail",
//         error,
//       });
//     }
//   }
//   value();
// }

// export function signup(req: express.Request, res: express.Response) {
//   async function action() {
//     const { name, email, password } = req.body;
//     try {
//       const user = await prisma.user.create({
//         data: {
//           name,
//           email,
//         },
//       });
//       return res.status(200).json({
//         status: "success",
//         message: "User successfully created!",
//         user,
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: "fail",
//         error,
//       });
//     }
//   }
//   action();
// }
