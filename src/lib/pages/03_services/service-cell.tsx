import { motion, type HTMLMotionProps } from "motion/react";
import HorizontalDivider from "../../components/horizontal-divider";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "../../components/morphing-dialog";
import { cn } from "../../utils";
import { IconHandClick } from "@tabler/icons-react";

type ServiceCellProps = {
  className?: string;
  cellNum: number;
  hoverState: { isHovered: boolean; hoverCell: number };
  setHoverState: React.Dispatch<
    React.SetStateAction<{
      isHovered: boolean;
      hoverCell: number;
    }>
  >;
  title: string;
  skills: string[];
  description: string;
} & HTMLMotionProps<"div">;

const ServiceCell = ({
  className,
  cellNum,
  hoverState,
  setHoverState,
  title,
  skills,
  description,
  ...motionProps
}: ServiceCellProps) => {
  return (
    <motion.div
      {...motionProps}
      layout
      onMouseEnter={() =>
        setHoverState({ isHovered: true, hoverCell: cellNum })
      }
      onMouseLeave={() => setHoverState({ isHovered: false, hoverCell: 0 })}
      className={cn(
        "group size-full [corner-shape:squircle] rounded-4xl border border-light-2/50 flex items-center justify-center hover:z-20",
        className,
      )}
    >
      <MorphingDialog>
        <MorphingDialogTrigger className="size-full flex justify-center">
          <div className="flex flex-col justify-center gap-10">
            <MorphingDialogTitle className="font-think-loved text-xl md:text-3xl whitespace-nowrap w-min">
              {title}
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="text-dark-2 text-2xl font-medium italic text-start w-min">
              {skills.map((s, i) => (
                <p
                  key={i}
                  className="first-letter:text-3xl first-letter:font-light whitespace-nowrap"
                >
                  /&nbsp;{s}
                </p>
              ))}
            </MorphingDialogSubtitle>
          </div>
          <div className="absolute inset-0 overflow-hidden [corner-shape:squircle] rounded-4xl perspective-distant -z-1">
            <motion.span
              animate={{
                rotateX: hoverState.isHovered
                  ? hoverState.hoverCell === cellNum
                    ? "70deg"
                    : "90deg"
                  : "85deg",
                rotateZ: hoverState.isHovered
                  ? hoverState.hoverCell === cellNum
                    ? "-30deg"
                    : "-60deg"
                  : "-45deg",
              }}
              className="absolute inset-0 transform-3d origin-bottom-right bg-light-2 opacity-50"
            />
            <motion.span
              animate={{
                rotateX: hoverState.isHovered
                  ? hoverState.hoverCell === cellNum
                    ? "75deg"
                    : "90deg"
                  : "85deg",
                rotateZ: hoverState.isHovered
                  ? hoverState.hoverCell === cellNum
                    ? "-30deg"
                    : "-65deg"
                  : "-45deg",
              }}
              className="absolute inset-0 transform-3d origin-bottom-right bg-dark-1"
            />
            <motion.span
              layout
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex size-4"
            >
              <IconHandClick className="stroke-1 stroke-light-2" />
            </motion.span>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="p-6 pointer-events-auto relative aspect-square flex flex-col gap-6 [corner-shape:squircle] rounded-4xl shadow-2xl border border-dark-1 bg-light-1 m-4 w-full sm:w-lg">
            <MorphingDialogTitle className="font-think-loved text-dark-1 text-xl md:text-3xl whitespace-nowrap w-min">
              {title}
            </MorphingDialogTitle>
            <HorizontalDivider />
            <MorphingDialogSubtitle className="text-dark-2 text-2xl font-medium italic text-start w-min">
              {skills.map((s, i) => (
                <p
                  key={i}
                  className="first-letter:text-3xl first-letter:font-light whitespace-nowrap"
                >
                  /&nbsp;{s}
                </p>
              ))}
            </MorphingDialogSubtitle>
            <MorphingDialogDescription className="h-full flex flex-col gap-6">
              <p className="text-dark-1 text-base font-light italic flex-1 place-content-center">
                {description}
              </p>
              <section className="w-full h-2 flex gap-1 flex-none">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-lg border border-dark-1/10 flex-1",
                        i === cellNum - 1 && "bg-dark-1/10",
                      )}
                    />
                  ))}
              </section>
            </MorphingDialogDescription>
            <MorphingDialogClose className="text-light-2" />
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </motion.div>
  );
};

export default ServiceCell;
