import { cn } from "cn";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="">
      <Loader2Icon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("animate-spin size-10", className)}
        {...props}
      />
    </div>
  );
}

export { Spinner };
