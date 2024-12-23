import DayStatus from "@/components/DayStatus";
import { exerciseObject } from "@/components/tables/LastExercises";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getWeights } from "@/services/apiWeights";
import { getWorkouts } from "@/services/apiWorkouts";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Dumbbell, Gauge, Layers, Repeat } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  console.log(user?.id);
  // const queryClient = useQueryClient();
  const { isPending, data, error } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => getWorkouts(user?.id, "All"),
  });
  const { data: weightData } = useQuery({
    queryKey: ["weights"],
    queryFn: () => getWeights(user?.id, 5),
  });
  const weight = Math.round(weightData?.at(0)?.weight);
  const last15Days: string[] = [];
  const today = new Date();
  const isRecorded: boolean[] = [];
  for (let i = 0; i < 15; i++) {
    isRecorded.push(false);
  }

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    last15Days.push(date.toISOString().split("T")[0]);
  }
  last15Days.reverse();
  data?.map((el: exerciseObject) => {
    const date = el.recordedAt.split("T")[0];
    if (last15Days.indexOf(date)) {
      isRecorded[last15Days.indexOf(date)] = true;
    }
  });

  let sets = 0,
    reps = 0;
  for (let i = 0; i < data?.length; i++) {
    sets += data[i].lift_weight.length;
    data[i].reps.map((el: number) => (reps += el));
  }

  if (error) return <>Something went wrong! {error.message}</>;
  if (isPending) return <>Loading...</>;
  return (
    <>
      <SidebarTrigger className="fixed top-2 left-2 bg-gray-100 shadow-md" />
      <p className="my-4 text-4xl sm:text-5xl lg:text-5xl font-light text-gray-400">
        Hello{" "}
        <span className="font-semibold text-gray-600">{user?.firstName}</span>!
      </p>

      <div className="flex flex-col gap-2 items-center justify-center my-8 mx-auto bg-gray-100 rounded-lg py-4 px-4 w-2/3 shadow-md">
        <h3 className="font-semibold sm:text-lg text-gray-500 text-sm mb-2">
          Last 15 days
        </h3>

        <div className="grid grid-cols-5 sm:grid-cols-15 lg:gap-2">
          {isRecorded.map((el: boolean) => (
            <DayStatus el={el} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:mx-8 items-center justify-around gap-6">
        <div className="bg-red-50 p-2 rounded-lg shadow-md flex justify-between px-8">
          <p className="text-[60px] lg:text-[70px] font-[Jost] font-bold text-red-200">
            {data.length}
          </p>
          <div className="self-center flex flex-col justify-center items-center gap-2">
            <Dumbbell width={25} height={25} color="gray" />
            <h3 className="font-bold uppercase tracking-wide text-[0.6rem] lg:text-sm text-gray-600">
              Exercises
            </h3>
          </div>
        </div>
        <div className="bg-green-100 w-auto p-2 rounded-lg shadow-md flex justify-between px-8">
          <p className="text-[60px] lg:text-[70px] font-[Jost] font-bold text-green-300">
            {sets}
          </p>
          <div className="self-center flex flex-col justify-center items-center gap-4">
            <Layers width={25} height={25} color="gray" />
            <h3 className="font-bold uppercase tracking-wide text-[0.6rem] lg:text-sm text-gray-600">
              Sets
            </h3>
          </div>
        </div>
        <div className="bg-yellow-50 p-2 rounded-lg shadow-md flex justify-between px-8">
          <p className="text-[60px] lg:text-[70px] font-[Jost] font-bold text-yellow-200">
            {reps}
          </p>
          <div className="self-center flex flex-col justify-center items-center gap-2">
            <Repeat width={25} height={25} color="gray" />
            <h3 className="font-bold uppercase tracking-wide text-[0.6rem] lg:text-sm text-gray-600">
              Reps
            </h3>
          </div>
        </div>
        <div className="bg-blue-100 w-auto p-2 rounded-lg shadow-md flex justify-between px-8">
          <p className="text-[60px] lg:text-[70px] font-[Jost] font-bold text-blue-300">
            {weight > 0 ? weight : "-"}
          </p>
          <div className="self-center flex flex-col justify-center items-center gap-2">
            <Gauge width={25} height={25} color="gray" />
            <h3 className="font-bold uppercase tracking-wide text-[0.6rem] lg:text-sm text-gray-600">
              Current Weight
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
