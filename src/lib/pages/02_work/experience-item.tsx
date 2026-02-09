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
    <div className={cn("relative size-full", className)} {...divProps}>
      <MorphingDialog>
        <MorphingDialogTrigger
          className={cn(
            "group w-full grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 rounded-lg transition-[shadow,color,border] hover:shadow-2xl border border-transparent hover:border-light-2/10",
            triggerClassName,
          )}
        >
          <MorphingDialogImage
            src={imgSrc}
            alt={imgAlt}
            className={cn(
              "bg-dark-1 h-8/10 aspect-square rounded-lg place-items-center place-content-center p-4 self-center",
              imgClassName,
            )}
          />
          <MorphingDialogTitle
            className={cn(
              "font-think-loved text-6xl whitespace-break-spaces text-start capitalize size-min self-center",
              titleClassName,
            )}
          >
            {title.replaceAll(" ", "\n")}
          </MorphingDialogTitle>
          <MorphingDialogSubtitle
            className={cn(
              "tracking-wider text-start text-2xl whitespace-nowrap col-span-full size-min col-start-2 text-dark-1 group-hover:text-light-2 transition-colors",
              subtitleClassName,
            )}
          >
            {company}
          </MorphingDialogSubtitle>

          <div
            className={cn(
              "col-span-full grid grid-cols-subgrid gap-y-2 py-6 text-dark-1 text-base tracking-wide group-hover:text-light-2 transition-colors",
              footerClassName,
            )}
          >
            <MorphingDialogSpan
              identifier={"location-icon"}
              className="size-min self-center place-self-center"
            >
              <IconLocation className="size-4 self-center place-self-center" />
            </MorphingDialogSpan>
            <MorphingDialogSpan
              identifier={"location"}
              className="self-center w-min"
            >
              <p className="text-start whitespace-nowrap">{location}</p>
            </MorphingDialogSpan>
            <MorphingDialogSpan
              identifier={"period-icon"}
              className="size-min self-center place-self-center"
            >
              <IconCalendar className="size-4 self-center place-self-center" />
            </MorphingDialogSpan>
            <MorphingDialogSpan
              identifier={"period"}
              className="self-center w-min"
            >
              <p className="text-start whitespace-nowrap">{period}</p>
            </MorphingDialogSpan>
          </div>
        </MorphingDialogTrigger>

        <MorphingDialogContainer>
          <MorphingDialogContent className="p-6 pointer-events-auto grid grid-cols-[auto_1fr_1fr] gap-x-8 gap-y-4 relative h-auto overflow-hidden rounded-xl shadow-2xl border border-light-2/10 bg-dark-2 m-4 w-full sm:w-2xl">
            <MorphingDialogClose className="text-light-2" />

            <MorphingDialogImage
              src={imgSrc}
              alt={imgAlt}
              className="bg-dark-1 h-8/10 aspect-square rounded-lg place-items-center place-content-center p-4 place-self-end self-center"
            />
            <MorphingDialogTitle className="font-think-loved text-light-2 text-xl md:text-3xl whitespace-pre-line text-start capitalize size-min self-center">
              {title.replaceAll(" ", "\n")}
            </MorphingDialogTitle>

            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 self-center items-center size-min py-6 text-light-2 tracking-wider font-light text-xs">
              <MorphingDialogSpan
                identifier={"location-icon"}
                className="size-min self-center place-self-center"
              >
                <IconLocation className="size-3 self-center place-self-center" />
              </MorphingDialogSpan>
              <MorphingDialogSpan
                identifier={"location"}
                className="self-center w-min"
              >
                <p className="text-start whitespace-nowrap">{location}</p>
              </MorphingDialogSpan>
              <MorphingDialogSpan
                identifier={"period-icon"}
                className="size-min self-center place-self-center"
              >
                <IconCalendar className="size-3 self-center place-self-center" />
              </MorphingDialogSpan>
              <MorphingDialogSpan
                identifier={"period"}
                className="self-center w-min"
              >
                <p className="text-start whitespace-nowrap">{period}</p>
              </MorphingDialogSpan>
            </div>

            <MorphingDialogDescription className="col-span-full grid grid-cols-subgrid gap-y-2 tracking-wider text-light-2 pr-12">
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
                <IconExternalLink className="size-4 place-self-end self-center" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-thin tracking-wider w-min col-span-2"
                >
                  <MorphingDialogSubtitle className="tracking-wider text-start text-sm whitespace-nowrap col-span-full size-min text-light-2 place-self-center self-start">
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
