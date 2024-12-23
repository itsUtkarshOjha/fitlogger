import { CheckCircle2, Circle } from "lucide-react";

const DayStatus = ({ el }: { el: boolean }) => {
  if (el)
    return (
      <p>
        <CheckCircle2 color="white" fill="green" width={22} />
      </p>
    );
  else
    return (
      <p>
        <Circle width={16} opacity={0.4} />
      </p>
    );
};

export default DayStatus;
