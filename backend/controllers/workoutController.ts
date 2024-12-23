import { Movement, Muscles, Styles } from "@prisma/client";
import prisma from "../DB/db.config";
import express from "express";

export function postWorkout(req: express.Request, res: express.Response) {
  async function values() {
    try {
      const exercise = await prisma.exercises.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send({
        status: "success",
        exercise,
      });
    } catch (error: unknown) {
      console.log(error);
      res.status(400).send({
        status: "fail",
        error,
      });
    }
  }
  values();
}

export function getWorkoutsByName(req: express.Request, res: express.Response) {
  async function values() {
    try {
      const { userId, searchString } = req.params;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user)
        return res.status(404).send({
          status: "failed",
          message: "No user found!",
        });

      // const exercise = await prisma.$queryRaw(
      //   `SELECT * FROM User WHERE SIMILARITY(lastName, '${searchString}') > 0.45;`
      // );
      const exercise =
        await prisma.$queryRaw`SELECT * FROM "Exercises" WHERE SIMILARITY(${searchString}) > 0.45`;

      console.log(exercise);
      res.status(200).send({
        status: "success",
        exercise,
      });
    } catch (error: unknown) {
      console.log(error);
      res.status(500).send({
        status: "fail",
        error,
      });
    }
  }
  values();
}

export function getWorkouts(req: express.Request, res: express.Response) {
  async function values() {
    try {
      const { userId, type } = req.params;
      const movement = ["Push", "Pull", "Compound", "Isolation"];
      const muscles = [
        "Chest",
        "Triceps",
        "Back",
        "Biceps",
        "Shoulders",
        "Legs",
        "Core",
      ];
      const styles = ["Strength", "Cardio", "Flexibility"];
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user)
        return res.status(404).send({
          status: "failed",
          message: "No user found!",
        });
      let exercises;
      if (
        !movement.includes(type) &&
        !styles.includes(type) &&
        !muscles.includes(type) &&
        type !== "All"
      ) {
        exercises =
          await prisma.$queryRaw`SELECT * FROM "Exercises" WHERE SIMILARITY("exercise", ${type}) > 0.4 LIMIT 5`;
      }
      if (type === "All") {
        exercises = await prisma.exercises.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            recordedAt: "desc",
          },
        });
      }
      if (movement.includes(type))
        exercises = await prisma.exercises.findMany({
          where: {
            OR: [
              {
                movementType: {
                  equals: type as Movement,
                },
              },
            ],
            AND: [{ userId: userId }],
          },
          orderBy: {
            recordedAt: "desc",
          },
        });
      if (muscles.includes(type))
        exercises = await prisma.exercises.findMany({
          where: {
            OR: [
              {
                muscleGroup: {
                  equals: type as Muscles,
                },
              },
            ],
            AND: [{ userId: userId }],
          },
          orderBy: {
            recordedAt: "desc",
          },
        });
      if (styles.includes(type))
        exercises = await prisma.exercises.findMany({
          where: {
            OR: [
              {
                trainingStyle: {
                  equals: type as Styles,
                },
              },
            ],
            AND: [{ userId: userId }],
          },
          orderBy: {
            recordedAt: "desc",
          },
        });
      res.status(201).send({
        status: "success",
        exercises,
      });
    } catch (error: unknown) {
      console.log(error);
      res.status(500).send({
        status: "fail",
        error,
      });
    }
  }
  values();
}

export async function updateWorkout(
  req: express.Request,
  res: express.Response
) {
  async function value() {
    try {
      const workoutId = req.params.workoutId;
      const data = req.body;
      const updatedExercise = await prisma.exercises.update({
        where: {
          id: Number(workoutId),
        },
        data: data,
      });
      return res.status(201).json({
        status: "success",
        updatedExercise,
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

export async function deleteWorkout(
  req: express.Request,
  res: express.Response
) {
  async function value() {
    try {
      const workoutId = req.params.workoutId;
      await prisma.exercises.delete({
        where: {
          id: Number(workoutId),
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
