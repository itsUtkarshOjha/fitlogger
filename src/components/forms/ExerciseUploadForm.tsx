import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormData, postWorkout } from "@/services/apiWorkouts";
import { DialogFooter } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  exercise: z
    .string({
      required_error: "Exercise name is required.",
    })
    .min(2)
    .max(50),
  notes: z.string().max(1000).optional(),
  muscleGroup: z
    .enum(["Chest", "Biceps", "Triceps", "Back", "Shoulders", "Legs", "Core"])
    .optional(),
  movementType: z.enum(["Push", "Pull", "Compound", "Isolation"]).optional(),
  trainingStyle: z.enum(["Strength", "Cardio", "Flexibility"]).optional(),
  duration: z.coerce.number().optional(),
  lift_weight: z
    .string()
    .regex(
      /^(?!0(\.0+)?)([1-9]\d*(\.\d+)?|0\.\d*[1-9]\d*)( ([1-9]\d*(\.\d+)?|0\.\d*[1-9]\d*))*$/,
      {
        message: "Weights should only be numbers and greater than 0",
      }
    )
    .optional(),
  reps: z
    .string()
    .regex(/^[1-9]\d*( [1-9]\d*)*$/, {
      message: "Repetitions should only be numbers and greater than 0",
    })
    .optional(),
  recordedAt: z.date(),
});

const ExerciseUploadForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => postWorkout(formData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exercise logged successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Uh oh! Something went wrong.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
  const { user } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recordedAt: new Date(Date.now()),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let reps, lift_weight;
    if (values.reps) {
      if (values.reps.includes(" "))
        reps = values.reps.split(" ").map((el) => parseFloat(el));
      else {
        reps = [];
        reps.push(parseFloat(values.reps));
      }
    }
    if (values.lift_weight) {
      if (values.lift_weight.includes(" "))
        lift_weight = values.lift_weight.split(" ").map((el) => parseFloat(el));
      else {
        lift_weight = [];
        lift_weight.push(parseFloat(values.lift_weight));
      }
    }
    const recordedAt = values.recordedAt.toISOString();
    const formData = {
      ...values,
      reps,
      lift_weight,
      recordedAt,
      userId: user?.id,
    };
    mutate(formData);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3  gap-6">
        <FormField
          control={form.control}
          name="exercise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise</FormLabel>
              <FormControl>
                <Input placeholder="Bench Press" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trainingStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Style (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a training style (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Cardio">Cardio</SelectItem>
                  <SelectItem value="Flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lift_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lifted Weights (in kgs)</FormLabel>
              <FormControl>
                <Input placeholder="20 20 30" {...field} />
              </FormControl>
              <FormDescription>
                If you lifted 20kgs in the first two sets and 30kgs in the
                third, write "20 20 30"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reps</FormLabel>
              <FormControl>
                <Input placeholder="12 10 8" {...field} />
              </FormControl>
              <FormDescription>
                If you did 12, 10 and 8 reps, write "12 10 8"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (optional)</FormLabel>
              <FormControl>
                <Input placeholder="30 (minutes)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="muscleGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muscle Group (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a muscle group (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Chest">Chest</SelectItem>
                  <SelectItem value="Triceps">Triceps</SelectItem>
                  <SelectItem value="Back">Back</SelectItem>
                  <SelectItem value="Biceps">Biceps</SelectItem>
                  <SelectItem value="Shoulders">Shoulders</SelectItem>
                  <SelectItem value="Legs">Legs</SelectItem>
                  <SelectItem value="Core">Core</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="movementType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Movement Type (optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a movement type (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="Pull">Pull</SelectItem>
                  <SelectItem value="Compound">Compound</SelectItem>
                  <SelectItem value="Isolation">Isolation</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recordedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Recording date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ExerciseUploadForm;
