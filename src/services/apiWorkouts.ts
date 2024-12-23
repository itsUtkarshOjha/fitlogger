import axios from "axios";

const API_ROUTE = "http://localhost:3000/api/v1/workout";

export interface FormData {
  reps: number[] | undefined;
  lift_weight: number[] | undefined;
  recordedAt: string;
  userId: string | undefined;
  exercise: string;
  notes?: string | undefined;
  duration?: number | undefined;
  muscleGroup?:
    | "Chest"
    | "Biceps"
    | "Triceps"
    | "Back"
    | "Shoulders"
    | "Legs"
    | "Core"
    | undefined;
  movementType?: "Push" | "Pull" | "Compound" | "Isolation" | undefined;
  trainingStyle?: "Strength" | "Cardio" | "Flexibility" | undefined;
}

export async function postWorkout(data: FormData) {
  const { data: response } = await axios({
    method: "post",
    url: `${API_ROUTE}/`,
    data,
  });
  return response.data;
}

export async function getWorkouts(
  userId: string | undefined,
  type: string | undefined
) {
  const { data: response } = await axios({
    method: "get",
    url: `${API_ROUTE}/${userId}/${type}`,
  });
  return response.exercises;
}

export async function deleteWorkout(workoutId: number) {
  const { data: response } = await axios({
    method: "delete",
    url: `${API_ROUTE}/${workoutId}`,
  });
  return response.data;
}
export async function updateWorkout(workoutId: number, notes: string) {
  const { data: response } = await axios({
    method: "patch",
    url: `${API_ROUTE}/${workoutId}`,
    data: { notes: notes },
  });
  return response.data;
}
