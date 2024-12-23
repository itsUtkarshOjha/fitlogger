import { deleteWeight, getWeights, updateWeight } from "@/services/apiWeights";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LineChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { Edit, Trash } from "lucide-react";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

interface weightElement {
  createdAt: string;
  recordedAt: string;
  id: number;
  weight: number;
  userId: string;
}

const updateFormSchema = z.object({
  weight: z.coerce
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive()
    .lte(200, "Weight must be less than or equal to 200.")
    .gte(10, "Weight must be greater than or equal to 10."),
});

const LastWeights = () => {
  const { toast } = useToast();
  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {},
  });
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;
  const { isPending, data, error } = useQuery({
    queryKey: ["weights"],
    queryFn: () => {
      return getWeights(userId, Number(numberWeight));
    },
  });
  const [numberWeight, setNumberWeight] = useState("5");
  const { mutate } = useMutation({
    mutationFn: ({ weightId, weight }: { weightId: number; weight: number }) =>
      updateWeight({ weightId, weight }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Weight record updated successfuly.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Uh oh! Something went wrong.",
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["weights"] }),
  });
  const { mutate: mutateDelete } = useMutation({
    mutationFn: (weightId: number) => deleteWeight(weightId),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Weight record deleted successfuly.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Uh oh! Something went wrong.",
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["weights"] }),
  });
  if (isPending) return <h1 className="text-4xl">Loading...</h1>;
  if (error)
    return (
      <h3 className="Something went wrong!">
        Something went wrong! <br /> {error.message}
      </h3>
    );
  const chartData = [];
  for (const el of data) {
    // const time = parseISO(el.recordedAt).toLocaleString();
    const date = parseISO(el.recordedAt).getDate();
    const month = parseISO(el.recordedAt).getMonth();
    const year = parseISO(el.recordedAt).getFullYear();
    const time = date + "/" + month + "/" + year;
    const weight = el.weight;
    const obj = { time, weight };
    chartData.push(obj);
  }
  chartData.reverse();

  const chartConfig = {
    weight: {
      label: "Weight",
      color: "#000",
    },
  } satisfies ChartConfig;

  function handleNumberChange() {
    queryClient.invalidateQueries({ queryKey: ["weights"] });
  }

  return (
    <div className="">
      <h3 className="text-center text-gray-500 font-semibold lg:text-xl">
        Showing last{" "}
        <DropdownMenu>
          <DropdownMenuTrigger className="" asChild>
            <Button
              variant="ghost"
              className="font-semibold text-md mx-[-14px] underline"
            >
              {numberWeight}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="">
              Number of records
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={numberWeight}
              onValueChange={setNumberWeight}
              onClick={handleNumberChange}
              className="cursor-pointer"
            >
              <DropdownMenuRadioItem
                value={"5"}
                className="hover:bg-gray-100 px-3"
              >
                5
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value={"10"}
                className="hover:bg-gray-100 px-3"
              >
                10
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value={"20"}
                className="hover:bg-gray-100 px-3"
              >
                20
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        recorded weights
      </h3>
      <Card className="my-4 sm:mx-4 sm:mb-8 lg:mx-20">
        <div>
          <CardHeader className="text-center">
            <CardTitle className="text-lg sm:text-2xl text-gray-600">
              Weight Chart
            </CardTitle>
            <CardDescription className="text-[0.7rem] sm:text-sm">
              Last {numberWeight} weights
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="mt-6">
          <ChartContainer config={chartConfig} className=" mx-auto">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 0,
              }}
              className=""
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                tickFormatter={() => ""}
              />
              <YAxis
                dataKey="weight"
                tickLine={true}
                axisLine={true}
                domain={[60, 70]}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent className="" />}
              />
              <Line
                dataKey="weight"
                type="linear"
                stroke="#333"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {data.map((el: weightElement) => (
        <div
          key={el.id}
          className="grid grid-cols-[5rem_auto] sm:grid-cols-[0.3fr_0.6fr_0.3fr] grid-rows-2 sm:grid-rows-1 gap-2 items-center h-auto p-2 lg:p-6 my-2 lg:mx-8 bg-gray-50 px-2 rounded-lg shadow-lg"
        >
          <p className="text-center row-span-2 sm:row-span-1 text-3xl md:text-4xl lg:text-5xl text-nowrap font-semibold text-gray-700">
            {el.weight}{" "}
            <span className="text-base md:text-lg lg:text-xl">kgs</span>
          </p>
          <p className="font-medium row-span-2 sm:row-span-1 sm:text-center text-sm text-right mr-4 lg:text-lg">
            {parseISO(el.recordedAt).toDateString()}
          </p>
          <div className="col-span-2 sm:col-span-1 ml-auto mr-4 md:flex">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="">
                  <Edit className="md:scale-125 lg:scale-150" />
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[30rem]">
                  <DialogHeader className="">
                    <DialogTitle className="text-sm">Edit Weight</DialogTitle>
                    <DialogDescription className="">
                      Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Form {...updateForm}>
                      <form
                        onSubmit={updateForm.handleSubmit(
                          (values: z.infer<typeof updateFormSchema>) =>
                            mutate({ weight: values.weight, weightId: el.id })
                        )}
                        className="space-y-2"
                      >
                        <FormField
                          control={updateForm.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (in kgs)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter your current weight
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogClose>
                          <Button type="submit" className="mt-4 px-4 py-2">
                            Save
                          </Button>
                        </DialogClose>
                      </form>
                    </Form>
                  </DialogFooter>
                </DialogContent>
              </DialogPortal>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="scale-90 md:scale-100">
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[30rem]">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      Are you absolutely sure?
                    </DialogTitle>
                    <DialogDescription className="">
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
        </div>
      ))}
    </div>
  );
};

export default LastWeights;
