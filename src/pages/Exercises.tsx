import ExerciseUploadForm from "@/components/forms/ExerciseUploadForm";
import LastExercises from "@/components/tables/LastExercises";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlusCircle } from "lucide-react";

const Exercises = () => {
  return (
    <section className="my-3 xl:my-6">
      <SidebarTrigger className="fixed top-2 left-2 bg-gray-100 shadow-md" />
      <h1 className="text-2xl sm:text-3xl xl:text-4xl text-gray-600 font-bold text-center">
        Log your workouts, with ease
      </h1>
      <Dialog>
        <div className="flex justify-center">
          <DialogTrigger asChild className="mt-4 xl:mt-6">
            <Button
              variant="default"
              className="text-sm sm:text-base xl:text-lg p-3 sm:p-4 xl:p-5 bg-gray-600 rounded-full font-semibold"
            >
              <PlusCircle className="sm:scale-125 xl:scale-150" />
              Log an Exercise
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="h-screen w-1/2">
          <DialogHeader>
            <DialogTitle className="">Log an exercise</DialogTitle>
            <DialogDescription className="">
              Click submit once you're done.
            </DialogDescription>
          </DialogHeader>
          <ExerciseUploadForm />
        </DialogContent>
      </Dialog>
      <hr className="h-[3px] my-6 xl:my-8 bg-gray-800 opacity-20" />
      <LastExercises />
    </section>
  );
};

export default Exercises;
