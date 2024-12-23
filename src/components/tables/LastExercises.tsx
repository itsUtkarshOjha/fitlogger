import {
  deleteWorkout,
  getWorkouts,
  updateWorkout,
} from "@/services/apiWorkouts";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface exerciseObject {
  id: number;
  userId: string;
  exercise: string;
  lift_weight: number[];
  reps: number[];
  notes?: string;
  muscleGroup?: string;
  movementType?: string;
  trainingStyle?: string;
  duration?: number;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

const notesSchema = z.object({
  notes: z.string(),
});

const LastExercises = () => {
  const [filter, setFilter] = useState("All");
  const notesForm = useForm<z.infer<typeof notesSchema>>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: "",
    },
  });
  const [exerciseOpen, setExerciseOpen] = useState<number>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: mutateDelete } = useMutation({
    mutationFn: (workoutId: number) => deleteWorkout(workoutId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exercise record deleted successfully.",
      });
    },
    onError: () =>
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Uh oh! Something went wrong.",
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: ({ workoutId, notes }: { workoutId: number; notes: string }) =>
      updateWorkout(workoutId, notes),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Notes added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed!",
        description: "Uh oh! Something went wrong.",
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["exercises"] }),
  });
  const { user } = useUser();
  const userId = user?.id;
  const { data, isPending, error } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getWorkouts(userId, filter),
  });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["exercises"] });
  }, [queryClient, filter]);
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong! {error.message}</div>;
  }

  return (
    <div className="my-3 xl:my-6">
      <div className="mb-3 xl:mb-5">
        <h3 className="text-center md:text-lg xl:text-xl font-semibold">
          Your latest exercises ({data.length})
        </h3>
        <div className="flex items-center gap-2 xl:gap-6 justify-center mt-2 xl:mt-4">
          <p className="text-sm md:text-base xl:text-lg">View by</p>
          <Select onValueChange={(e) => setFilter(e)} defaultValue={filter}>
            <SelectTrigger className="bg-white w-[80px] md:w-[100px] xl:w-[120px] scale-90 md:scale-100 xl:scale-110 opacity-70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectGroup className="">
                <SelectLabel>Muscle Group</SelectLabel>
                <SelectItem value="Chest">Chest</SelectItem>
                <SelectItem value="Triceps">Triceps</SelectItem>
                <SelectItem value="Back">Back</SelectItem>
                <SelectItem value="Biceps">Biceps</SelectItem>
                <SelectItem value="Shoulders">Shoulders</SelectItem>
                <SelectItem value="Legs">Legs</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Movement Type</SelectLabel>
                <SelectItem value="Push">Push</SelectItem>
                <SelectItem value="Pull">Pull</SelectItem>
                <SelectItem value="Compound">Compound</SelectItem>
                <SelectItem value="Isolation">Isolation</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Training Style</SelectLabel>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Flexibility">Flexibility</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {data.map((el: exerciseObject) => (
        <React.Fragment>
          <div
            key={el.id}
            className={`bg-gray-50 text-left ${exerciseOpen === el.id ? "rounded-t-xl mb-0" : "hover:bg-gray-100 shadow-lg hover:shadow-md rounded-xl mb-2"} cursor-pointer md:spac e-x-3 px-2 py-2 md:p-4 mt-4 md:mt-6 grid grid-cols-[0.7fr_0.15fr_0.15fr] lg:grid-cols-[0.55fr_0.45fr_0.05fr_0.05fr] grid-rows-[0.6fr_0.3fr_0.1fr] lg:grid-rows-1 space-y-2 justify-around items-center`}
            onClick={() => {
              if (exerciseOpen && exerciseOpen === el.id) {
                setExerciseOpen(NaN);
              } else setExerciseOpen(el.id);
            }}
          >
            <p className="font-semibold md:font-bold text-lg md:text-xl text-gray-700 col-span-3 lg:col-span-1">
              <div className="flex gap-1 mb-1">
                {el.muscleGroup && (
                  <Badge className="text-[8px] md:text-[12px] h-4 md:h-5 bg-red-400">
                    {el.muscleGroup}
                  </Badge>
                )}
                {el.movementType && (
                  <Badge className="text-[8px] md:text-[12px] h-4 md:h-5 bg-yellow-500">
                    {el.movementType}
                  </Badge>
                )}
                {el.trainingStyle && (
                  <Badge className="text-[8px] md:text-[12px] h-4 md:h-5 bg-blue-400">
                    {el.trainingStyle}
                  </Badge>
                )}
              </div>
              {el.exercise}
            </p>
            <div className="flex justify-start gap-2 lg:col-span-1 lg:row-start-1 lg:col-start-2 col-span-3 text-sm md:text-base xl:text-lg font-semibold row-start-2 text-gray-500">
              {el.lift_weight.length > 0 && (
                <p>Last set: {el.lift_weight.at(-1)} kgs</p>
              )}
              {el.reps.length > 0 && <p>Reps: {el.reps.at(-1)}</p>}
              {el.duration && (
                <p className="text-sm font-bold">
                  Duration : {el.duration} mins
                </p>
              )}
            </div>

            <HoverCard>
              <HoverCardTrigger className="row-end-4 lg:row-end-2 lg:col-start-4 ml-auto col-start-2 ">
                <Dialog>
                  <DialogTrigger className="bg-gray-200 rounded-lg">
                    <Button variant="ghost" className="">
                      <Plus height={16} width={12} />
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="sm:max-w-[30rem]">
                      <DialogHeader>
                        <DialogTitle>Add Notes</DialogTitle>
                      </DialogHeader>
                      <Form {...notesForm}>
                        <form
                          onSubmit={notesForm.handleSubmit(
                            (values: z.infer<typeof notesSchema>) =>
                              mutateUpdate({
                                workoutId: el.id,
                                notes: values.notes,
                              })
                          )}
                        >
                          <FormField
                            control={notesForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exercise</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Notes" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose>
                              <Button type="submit">Submit</Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </HoverCardTrigger>
              <HoverCardContent className="text-[12px]">
                Add Notes
              </HoverCardContent>
            </HoverCard>
            <Dialog>
              <DialogTrigger className="row-start-3 lg:row-start-1 mr-auto col-start-3 lg:col-start-5 mx-auto">
                <Button variant="destructive" className=" self-center">
                  <Trash2 />
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[30rem]">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Are you sure you want to
                      permanently delete this record?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose>
                      <Button
                        type="submit"
                        onClick={() => mutateDelete(el.id)}
                        className=" px-4 py-2"
                      >
                        Confirm
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          </div>
          {exerciseOpen === el.id && (
            <div className="bg-gray-50 text-left rounded-b-xl p-3">
              <hr className="mb-4" />
              <h4 className="font-medium text-gray-700 mb-1">More Details</h4>
              <div className="text-sm text-gray-500">
                {el.lift_weight && el.lift_weight.length > 0 && (
                  <p>
                    Weights used :{" "}
                    {el.lift_weight.map((weight) => weight + "kg ")}
                  </p>
                )}
                {el.reps && el.reps.length > 0 && (
                  <p>Reps performed : {el.reps.map((rep) => rep + " ")}</p>
                )}
                {el.notes && <p>Notes : {el.notes}</p>}
                <p>Recorded at : {parseISO(el.recordedAt).toDateString()}</p>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LastExercises;
