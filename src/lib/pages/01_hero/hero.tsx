import { useRef } from "react";
import FloatingBalloon from "../../components/balloon/floating-balloon";
import FlowingMenu, { type MenuItemData } from "../../components/flowing-menu";
import ScrollVelocity from "../../components/scroll-velocity";
import { cn } from "../../utils";
import HeroCTA from "./hero-cta";
import HeroSkillsList from "./hero-skills-list";
import HeroTagLine from "./hero-tag-line";
import HeroTimeDisplay from "./hero-time-display";

const workItems: MenuItemData[] = [
  {
    image: "/assets/works/blender/aquarium_of_life_cmp.png",
    text: "Bio-Pod",
    link: "#",
  },
  {
    image: "/assets/works/blender/bathroom_woman_cmp.png",
    text: "Subject A",
    link: "#",
  },
  {
    image: "/assets/works/blender/life_support_cmp.png",
    text: "Life Support",
    link: "#",
  },
  {
    image: "/assets/works/blender/lost_03_cmp.png",
    text: "Lost",
    link: "#",
  },
  {
    image: "/assets/works/blender/sunken_cmp.png",
    text: "Sunken",
    link: "#",
  },
];

export default function Hero({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      data-bg-theme="light"
      id="top"
      className={cn(
        "h-[calc(100vh-var(--header-height))] w-full relative grid grid-cols-[8rem_1fr_1fr_8rem] grid-rows-[8rem_1fr_1fr_8rem] select-none",
        "bg-linear-to-b from-light-1 via-light-2 to-light-1",
        className,
      )}
    >
      {/* Balloon Canvas */}
      <div className="relative col-span-full row-span-full z-2 pointer-events-none mask-b-from-95%">
        <FloatingBalloon eventSource={containerRef} />
      </div>

      {/* Borders */}
      <div className="row-span-full col-span-full grid grid-cols-subgrid grid-rows-subgrid opacity-75 mask-t-from-95% mask-b-from-95% mask-l-from-95% mask-r-from-95% pointer-events-none">
        <div className="row-[1/2] col-[1/2] border-r border-b border-light-2" />
        <div className="row-[1/2] col-[4/5] border-l border-b border-light-2" />
        <div className="row-[3/4] col-[1/2] border-r border-t border-light-2" />
        <div className="row-[3/4] col-[4/5] border-l border-t border-light-2" />
      </div>

      {/* Content */}
      <div className="relative col-span-full row-span-full grid grid-cols-subgrid grid-rows-subgrid">
        <h2 className="row-[1/2] col-[1/2] text-2xl font-thin text-dark-1 tracking-wide place-self-end uppercase px-6 py-2 trim-text-caps">
          Hi!
        </h2>
        <h2 className="row-[1/2] col-[2/3] text-2xl font-thin text-dark-1 tracking-wide self-end uppercase px-6 py-2 trim-text-caps">
          I'm Aniket Das.
        </h2>
        <HeroTimeDisplay className="row-[1/2] col-[3/4] p-1 place-self-end px-2" />
        <section className="row-[1/2] col-[4/5] text-dark-1 font-light text-xs tracking-wider self-end p-1 trim-text-caps px-2">
          <p className="text-light-2">22.5744° N</p>
          <p className="text-light-2">88.3629° E</p>
          <p>KOLKATA</p>
          <p className="text-sm">INDIA</p>
        </section>

        <div className="row-[2/4] col-[2/4] bg-light-1 grid grid-rows-2 grid-cols-2 whitespace-nowrap shadow-xl">
          <HeroTagLine />
          <HeroSkillsList />
          <div className="relative w-2/3 h-full mask-r-from-50%">
            <FlowingMenu
              items={workItems}
              textColor="var(--color-dark-1)"
              bgColor="var(--color-light-1)"
              marqueeBgColor="var(--color-light-1)"
              marqueeTextColor="var(--color-dark-2)"
              borderColor="var(--color-light-2)"
            />
          </div>
          <HeroCTA />
        </div>
        <div className="col-span-full row-[4/5] flex items-end overflow-x-clip overflow-y-visible py-2 z-3">
          <ScrollVelocity
            texts={["• CREATIVE DEVELOPER"]}
            numCopies={2}
            velocity={60}
            className="text-[max(14vw,9rem)] font-black tracking-tighter trim-text-caps text-dark-1"
            parallaxClassName="overflow-visible"
          />
        </div>
      </div>
    </div>
  );
}
