import { useEffect, useState } from "react";
import { cn } from "../utils";

export default function Key({
  children,
  className,
  pressedState,
}: {
  children: string;
  className?: string;
  pressedState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const [_pressed, _setPressed] = useState<boolean>(false);
  const pressed = pressedState?.[0] || _pressed;
  const setPressed = pressedState?.[1] || _setPressed;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === children.toLowerCase()) {
        setPressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === children.toLowerCase()) {
        setPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [children, setPressed]);

  return (
    <button
      className={cn(
        "text-4xl font-think-loved size-24 relative perspective-normal flex-none",
        className
      )}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div
        className={cn(
          "relative size-full transform-3d transition-transform duration-100 ease-out",
          "rotate-x-20 rotate-y-0",
          pressed && "rotate-x-18 translate-y-1"
        )}
      >
        <div className="absolute top-0 left-0 size-full shadow-lg translate-z-0 border-2 border-dark-1 bg-dark-2 rounded-md" />
        <div
          className={cn(
            "absolute -top-3 left-1/10 size-8/10 border-2 border-dark-1 bg-light-1 rounded-sm flex items-center justify-center transition-transform duration-100 ease-out shadow-xl",
            "translate-z-6",
            pressed && "translate-z-1 translate-y-3"
          )}
        >
          <span className="relative text-dark-2 capitalize trim-text-caps select-none drop-shadow">
            {children}
          </span>
        </div>
      </div>
    </button>
  );
}
