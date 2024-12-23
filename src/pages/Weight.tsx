import WeightUploadForm from "@/components/forms/WeightUploadForm";
import LastWeights from "@/components/tables/LastWeights";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PlusCircle } from "lucide-react";

const Weight = () => {
  return (
    <section className="my-3">
      <SidebarTrigger className="fixed top-2 left-2 bg-gray-100 shadow-md" />
      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center font-bold">
        Single place to monitor your weight
      </h1>
      <Dialog>
        <div className="flex justify-center">
          <DialogTrigger asChild className="mt-4">
            <Button
              variant="default"
              className="text-sm sm:text-base lg:text-lg px-3 lg:px-5 lg:py-6 rounded-full text-center font-semibold bg-gray-600"
            >
              <PlusCircle className="sm:scale-125 lg:scale-150" />
              Record your weight
            </Button>
          </DialogTrigger>
        </div>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <WeightUploadForm />
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <hr className="h-[3px] mt-6 mb-5 bg-gray-800 opacity-20" />

      <LastWeights />
    </section>
  );
};

export default Weight;
