import { Fragment } from "react/jsx-runtime";
import { TextEffect } from "../../components/text-effect";
import { cn } from "../../utils";
import { forwardRef, useRef } from "react";
import { useInView } from "motion/react";
import * as m from "motion/react-m";

const ABOUT_CONTENT = [
  { cat: "call me by", desc: "Aniket Das" },
  { cat: "based in", desc: "Kolkata, WB, India" },
  { cat: "languages", desc: "English, Hindi, Bengali" },
  {
    cat: "studies",
    desc: "B.Tech in CSE at Heritage Institute of Technology, Kolkata",
  },
  { cat: "of the clock", desc: "Painting, 3D Art, Gaming, Petting my dog" },
];

const AboutMeContent = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const aboutContentRef1 = useRef<HTMLDivElement>(null);
    const aboutContentRef2 = useRef<HTMLDivElement>(null);

    const aboutContent1InView = useInView(aboutContentRef1, {
      margin: "-128px",
    });
    const aboutContent2InView = useInView(aboutContentRef2, {
      margin: "-128px",
    });

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-rows-[auto_auto_1fr] grid-cols-[1fr_auto] gap-x-8 gap-y-16",
          className,
        )}
      >
        <m.div
          initial={{ filter: "blur(6px)" }}
          whileInView={{ filter: "blur(0px)" }}
          viewport={{ amount: "all" }}
          transition={{ duration: 1 }}
          className="row-[1/2] col-[1/3] md:col-[2/3] max-w-full h-full aspect-square flex-none rounded-xl overflow-hidden after:md:backdrop-blur-none after:absolute after:-inset-1 after:backdrop-blur-2xl after:mask-t-to-50% after:mask-t-from-5%"
        >
          <img
            src="/assets/portrait/Portrait-FULL.png"
            alt="Portrait"
            draggable={false}
            loading="lazy"
            className="object-cover size-full"
          />
        </m.div>

        <div
          ref={aboutContentRef1}
          className="row-[1/2] col-[1/3] md:col-[1/2] self-end flex flex-col gap-3 p-4 md:p-0 mix-blend-screen"
        >
          <TextEffect
            as="p"
            trigger={aboutContent1InView}
            preset="default"
            per="word"
            speedReveal={4}
            className="text-2xl font-light font-width-100 self-end tracking-wide leading-snug"
          >
            I specialize in crafting interactive and motion-rich experiences
            that blend design with code, from sleek dashboards to expressive
            front-end animations.
          </TextEffect>
          <TextEffect
            as="p"
            trigger={aboutContent1InView}
            preset="default"
            per="word"
            speedReveal={3}
            delay={0.25}
            className="text-xl font-light font-width-100 self-end tracking-wide leading-snug"
          >
            My passion lies in creating design systems, exploring interaction,
            and pushing what's possible on the web.
          </TextEffect>
        </div>

        <div
          ref={aboutContentRef2}
          className="row-[2/3] col-[1/3] md:col-[1/2] grid grid-cols-[auto_1fr] auto-rows-min gap-x-8 gap-y-1"
        >
          {ABOUT_CONTENT.map((content, i) => (
            <Fragment key={i}>
              <TextEffect
                as="p"
                trigger={aboutContent2InView}
                preset="default"
                per="word"
                speedReveal={2}
                delay={i * 0.1}
                className={cn(
                  "text-sm font-light font-width-100 tracking-wide leading-snug h-full py-2 text-light-d border-b border-dark-l/25 uppercase place-content-end",
                  i === 0 && "border-t",
                )}
              >
                {content.cat}
              </TextEffect>
              <TextEffect
                as="p"
                trigger={aboutContent2InView}
                preset="default"
                per="word"
                speedReveal={2}
                delay={0.25 + i * 0.1}
                className={cn(
                  "text-lg font-light font-width-100 tracking-wide leading-snug h-full py-2 border-b border-dark-l/25 place-content-end",
                  i === 0 && "border-t",
                )}
              >
                {content.desc}
              </TextEffect>
            </Fragment>
          ))}
        </div>
      </div>
    );
  },
);

export default AboutMeContent;
