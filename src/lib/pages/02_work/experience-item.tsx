import {
  IconArrowForward,
  IconCalendar,
  IconExternalLink,
  IconLocation,
} from "@tabler/icons-react";
import * as m from "motion/react-m";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSpan,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "../../components/morphing-dialog";
import { cn } from "../../utils";

const ExperienceItem = ({
  className,
  triggerClassName,
  imgClassName,
  titleClassName,
  subtitleClassName,
  footerClassName,
  imgSrc,
  imgAlt,
  title,
  company,
  url,
  location,
  period,
  description,
  ...divProps
}: {
  className?: string;
  triggerClassName?: string;
  imgClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  footerClassName?: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  company: string;
  url: string;
  location: string;
  period: string;
  description: string[];
} & React.ComponentProps<"div">) => {
  return (
    <div className={cn("relative size-full flex", className)} {...divProps}>
      <MorphingDialog>
        <MorphingDialogTrigger
          className={cn(
            "group w-full grid grid-cols-[8rem_1fr_20rem] gap-x-8 gap-y-2 px-8 py-8 place-content-center rounded-lg transition-[shadow,color,border] hover:shadow-2xl border border-transparent hover:border-light-d/10",
            triggerClassName,
          )}
        >
          <MorphingDialogImage
            src={imgSrc}
            alt={imgAlt}
            className={cn(
              "col-[1/2] row-[1/2] bg-dark-l h-24 aspect-square rounded-lg place-items-center place-content-center p-4 self-center",
              imgClassName,
            )}
          />
          <MorphingDialogTitle
            className={cn(
              "row-[1/2] col-[2/3] font-black font-width-110 uppercase tracking-tight text-4xl whitespace-break-spaces text-start size-min self-center",
              titleClassName,
            )}
          >
            {title.replaceAll(" ", "\n")}
          </MorphingDialogTitle>
          <MorphingDialogSubtitle
            className={cn(
              "row-[2/3] col-[2/3] font-lowercase-height-540 font-width-110 text-start text-2xl whitespace-nowrap size-min text-light-d group-hover:text-light-l transition-colors",
              subtitleClassName,
            )}
          >
            {company}
          </MorphingDialogSubtitle>

          <div
            className={cn(
              "row-[1/3] col-[3/4] flex flex-col self-center size-min gap-4 text-lg tracking-wide text-dark-l group-hover:text-light-l transition-colors",
              footerClassName,
            )}
          >
            <MorphingDialogSpan
              identifier={"location"}
              className="w-min flex gap-3 items-center"
            >
              <IconLocation className="size-5 self-center place-self-center" />
              <p className="text-start whitespace-nowrap trim-text-caps">
                {location}
              </p>
            </MorphingDialogSpan>
            <MorphingDialogSpan
              identifier={"period"}
              className="w-min flex gap-3 items-center"
            >
              <IconCalendar className="size-5 self-center place-self-center" />
              <p className="text-start whitespace-nowrap trim-text-caps">
                {period}
              </p>
            </MorphingDialogSpan>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="p-6 pointer-events-auto grid grid-cols-[6rem_1fr_12rem] gap-x-8 gap-y-4 relative h-auto overflow-hidden rounded-xl shadow-2xl border border-dark-l/25 bg-dark-d m-4 max-w-2xl w-full">
            <MorphingDialogClose className="text-light-2" />

            <MorphingDialogImage
              src={imgSrc}
              alt={imgAlt}
              className="bg-dark-l h-24 aspect-square rounded-lg place-items-center place-content-center p-4 place-self-end self-center"
            />
            <MorphingDialogTitle className="font-black font-width-110 uppercase tracking-tight text-light-d text-3xl whitespace-pre-line text-start size-min self-center">
              {title.replaceAll(" ", "\n")}
            </MorphingDialogTitle>

            <div className="flex flex-col gap-3 self-center size-min text-light-d tracking-wider font-light text-sm">
              <MorphingDialogSpan
                identifier={"location"}
                className="w-min flex gap-3 items-center"
              >
                <IconLocation className="size-4 self-center place-self-center" />
                <p className="text-start whitespace-nowrap trim-text-caps">
                  {location}
                </p>
              </MorphingDialogSpan>
              <MorphingDialogSpan
                identifier={"period"}
                className="w-min flex gap-3 items-center"
              >
                <IconCalendar className="size-4 self-center place-self-center" />
                <p className="text-start whitespace-nowrap trim-text-caps">
                  {period}
                </p>
              </MorphingDialogSpan>
            </div>

            <MorphingDialogDescription className="col-span-full grid grid-cols-subgrid gap-y-2 tracking-wider text-light-2 text-base pr-12">
              {description.map((d, i) => (
                <m.div
                  key={i}
                  className="grid grid-cols-subgrid col-span-full"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.05 * i },
                  }}
                  exit={{ opacity: 0, y: 24 }}
                >
                  <IconArrowForward className="size-4 mt-0.5 place-self-end self-start" />
                  <p className="col-span-2">{d}</p>
                </m.div>
              ))}
              <div className="grid grid-cols-subgrid col-span-full items-center pt-6">
                <IconExternalLink className="size-4 place-self-end self-center stroke-light-d" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-thin tracking-wider w-min col-span-2"
                >
                  <MorphingDialogSubtitle className="tracking-wider text-start text-base whitespace-nowrap col-span-full size-min text-light-d place-self-center self-start trim-text-caps">
                    {company}
                  </MorphingDialogSubtitle>
                </a>
              </div>
            </MorphingDialogDescription>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </div>
  );
};

export default ExperienceItem;
