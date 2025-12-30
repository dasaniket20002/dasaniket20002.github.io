import { forwardRef } from "react";
import { cn } from "../utils";

type ContainerProps = {
  dataBGTheme?: "light" | "dark";
  className?: string;
  children?: React.ReactNode;
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ dataBGTheme = "light", className, children }, ref) => {
    return (
      <div
        ref={ref}
        data-bg-theme={dataBGTheme}
        className={cn(
          "h-page m-page",
          dataBGTheme === "light" ? "bg-light-1" : "bg-dark-2",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
