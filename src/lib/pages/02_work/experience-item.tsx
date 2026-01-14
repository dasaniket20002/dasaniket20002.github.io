import {
  IconArrowForward,
  IconCalendar,
  IconExternalLink,
  IconLocation,
} from "@tabler/icons-react";
import { motion, stagger } from "motion/react";
import HorizontalDivider from "../../components/horizontal-divider";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "../../components/morphing-dialog";
import TextRoll from "../../components/text-roll";
import { cn } from "../../utils";

const ExperienceItem = ({
  className,
  imgClassName,
  imgSrc,
  imgAlt,
  title,
  company,
  url,
  location,
  period,
  description,
}: {
  className?: string;
  imgClassName?: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  company: string;
  url: string;
  location: string;
  period: string;
  description: string[];
}) => {
  return (
    <MorphingDialog>
      <MorphingDialogTrigger
        className={cn(
          "group flex flex-col gap-4 rounded-xl transition-[shadow,color,border] px-3 py-3 hover:shadow-2xl border border-transparent hover:border-light-2/10",
          className
        )}
      >
        <div className="flex gap-4 items-center">
          <div
            className={cn(
              "bg-dark-1 aspect-square w-12 lg:w-16 rounded-lg place-items-center place-content-center flex-none",
              imgClassName
            )}
          >
            <MorphingDialogImage
              src={imgSrc}
              alt={imgAlt}
              className="drop-shadow-xl"
            />
          </div>
          <div>
            <MorphingDialogTitle className="font-think-loved text-xl lg:text-3xl tracking-wide whitespace-nowrap">
              {title}
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className="font-thin tracking-wider text-start text-sm lg:text-base">
              {company}
            </MorphingDialogSubtitle>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-dark-1 tracking-wide group-hover:text-light-2 transition-colors text-sm lg:text-base">
          <div className="flex gap-4 items-center">
            <span className="w-12 lg:w-16 place-items-center">
              <IconLocation className="size-4" />
            </span>
            <p>{location}</p>
          </div>
          <div className="flex gap-4 items-center">
            <span className="w-12 lg:w-16 place-items-center">
              <IconCalendar className="size-4" />
            </span>
            <p>{period}</p>
          </div>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="p-6 pointer-events-auto relative flex h-auto flex-col gap-6 overflow-hidden rounded-xl shadow-2xl border border-light-2/10 bg-dark-2 m-4 w-full sm:w-lg">
          <div className="flex gap-6 items-center">
            <div
              className={cn(
                "bg-dark-1 aspect-square w-12 lg:w-16 rounded-lg place-items-center place-content-center",
                imgClassName
              )}
            >
              <MorphingDialogImage
                src={imgSrc}
                alt={imgAlt}
                className="drop-shadow-xl"
              />
            </div>
            <div className="text-dark-1">
              <MorphingDialogTitle className="font-think-loved text-xl lg:text-3xl tracking-wide whitespace-nowrap">
                {title}
              </MorphingDialogTitle>
              <MorphingDialogSubtitle className="tracking-wide text-start text-sm lg:text-base">
                {company}
              </MorphingDialogSubtitle>
            </div>
          </div>
          <HorizontalDivider />
          <MorphingDialogDescription
            disableLayoutAnimation
            variants={{
              initial: { opacity: 0, scale: 0.8, y: 100 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.8, y: 100 },
            }}
            transition={{ delayChildren: stagger(0.5) }}
            className="grid grid-cols-[1rem_1fr] gap-x-4 gap-y-2 tracking-wider text-light-2 text-sm lg:text-base font-light lg:font-normal"
          >
            {description.map((d, i) => (
              <motion.div
                key={i}
                className="grid grid-cols-subgrid col-span-full"
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <IconArrowForward className="size-4 mt-0.5 stroke-1" />
                <p>{d}</p>
              </motion.div>
            ))}
            <div className="grid grid-cols-subgrid col-span-full items-center pt-6">
              <IconExternalLink className="size-4 stroke-1" />
              <a href={url} className="text-xs font-thin tracking-wider w-min">
                <TextRoll>{company}</TextRoll>
              </a>
            </div>
          </MorphingDialogDescription>
          <MorphingDialogClose className="text-light-2" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

export default ExperienceItem;
