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
import { postWeight, WeightFormData } from "@/services/apiWeights";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  weight: z.coerce
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive()
    .lte(200, "Weight must be less than or equal to 200.")
    .gte(10, "Weight must be greater than or equal to 10."),
  recordedAt: z.date(),
});

const WeightUploadForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: WeightFormData) => postWeight(formData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Weight updated successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Success",
        description: "Exercise record deleted successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["weights"] });
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
    const recordedAt = values.recordedAt.toISOString();
    const formData = {
      ...values,
      recordedAt,
      userId: user?.id,
    };
    mutate(formData);
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Record weight</DialogTitle>
        <DialogDescription className="text-xl">
          Submit when you're done.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (in kgs)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Enter your current weight</FormDescription>
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
            <DialogClose>
              <Button disabled={isPending} type="submit">
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default WeightUploadForm;
