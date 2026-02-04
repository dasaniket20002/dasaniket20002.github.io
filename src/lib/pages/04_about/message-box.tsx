import { IconArrowRight, IconSend } from "@tabler/icons-react";
import { motion, type HTMLMotionProps } from "motion/react";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn, PRIMARY_EMAIL } from "../../utils";

const MessageBox = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...motionProps }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [body, setBody] = useState<string>();
    const href = useMemo(
      () =>
        encodeURI(
          `mailto:${PRIMARY_EMAIL}&subject=Providing Opportunity&body=${body}`,
        ),
      [body],
    );
    useImperativeHandle(ref, () => containerRef.current!);
    return (
      <motion.div
        ref={containerRef}
        className={cn(
          "bg-light-2 px-1 h-12 rounded-full flex gap-3 items-center",
          className,
        )}
        {...motionProps}
      >
        <motion.button
          drag="x"
          dragConstraints={containerRef}
          whileTap={{ cursor: "grabbing", scale: 1.1 }}
          dragSnapToOrigin={true}
          className="bg-dark-2 h-8/10 aspect-square rounded-full"
        >
          <IconArrowRight className="size-4 stroke-light-2 place-self-center" />
        </motion.button>
        <input
          type="text"
          placeholder="Message..."
          className="text-sm font-light tracking-wide flex-1 outline-0 h-full"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <a
          aria-disabled={!body}
          href={href}
          className={cn(
            "bg-dark-2 h-8/10 aspect-square rounded-full place-content-center cursor-pointer",
            !body && "cursor-not-allowed opacity-75",
          )}
        >
          <IconSend className="size-4 stroke-light-2 place-self-center" />
        </a>
      </motion.div>
    );
  },
);

export default MessageBox;
