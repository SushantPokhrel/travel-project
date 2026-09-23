import { cn } from "cn";
import { Loader2Icon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Loader2Icon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn(" animate-spin size-10", className)}
        {...props}
      />Loading...
    </div>
  );
}

export { Spinner };
