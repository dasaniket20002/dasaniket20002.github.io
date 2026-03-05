import * as m from "motion/react-m";
import { forwardRef, lazy, useEffect } from "react";
import { preloadWithProgress } from "../../utils";
import Counter from "./counter";
import Message from "./message";
import MetricsDisplay from "./metrics-display";
import { useGLTF } from "@react-three/drei";
import LogoName from "../../components/ui/logo-name";

const LoaderCanvas = lazy(() => import("./loader-canvas"));

type LoaderProps = { onComplete: () => void };

useGLTF.preload("/assets/models/computers/computers_1-transformed.glb");

const PRELOAD_URLS = [
  "assets/works/blender/antigravity_cmp.png",
  "assets/works/blender/aquarium_of_life_cmp.png",
  "assets/works/blender/bathroom_unclean_cmp.png",
  "assets/works/blender/bathroom_woman_cmp.png",
  "assets/works/blender/beach_bottle_cmp.png",
  "assets/works/blender/black_hole_cmp.png",
  "assets/works/blender/burning_butterfly_cmp.png",
  "assets/works/blender/candy_cmp.png",
  "assets/works/blender/car_ruins_cmp.png",
  "assets/works/blender/cyberpunk_01_cmp.png",
  "assets/works/blender/cyberpunk_02_cmp.png",
  "assets/works/blender/data_cube_cmp.png",
  "assets/works/blender/detained_cmp.png",
  "assets/works/blender/detatched_cmp.png",
  "assets/works/blender/distort_cmp.png",
  "assets/works/blender/hallows_cmp.png",
  "assets/works/blender/hand_and_rose_cmp.png",
  "assets/works/blender/life_support_cmp.png",
  "assets/works/blender/lost_01_cmp.png",
  "assets/works/blender/lost_02_cmp.png",
  "assets/works/blender/lost_03_cmp.png",
  "assets/works/blender/omw_cmp.png",
  "assets/works/blender/piano_ruins_cmp.png",
  "assets/works/blender/sunken_cmp.png",
  "assets/works/blender/the_door_cmp.png",
];

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ onComplete }, ref) => {
    useEffect(() => {
      preloadWithProgress(PRELOAD_URLS);
    }, []);

    return (
      <>
        <m.div
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
          transition={{ duration: 1, ease: "anticipate", delay: 0.5 }}
          className="absolute z-98 w-dvw h-dvh top-0 left-0 bg-dark-d"
        ></m.div>
        <m.div
          ref={ref}
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
          transition={{ duration: 0.8, ease: "anticipate", delay: 0.25 }}
          className="relative h-dvh z-98 grid grid-cols-[4rem_1fr_1fr_4rem] grid-rows-[4rem_1fr_auto_4rem] bg-light-l"
        >
          <div className="row-[2/3] col-[2/4] md:col-[2/3] size-full flex flex-col gap-16">
            <LogoName
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "backOut" }}
              className="text-8xl text-light-d w-min self-start flex-none"
            />
            <Message className="text-light-d/50 w-full font-semibold font-width-110 text-3xl" />
          </div>

          <div className="row-[3/4] col-[2/4] md:col-[2/3] size-full flex items-end gap-3">
            <div className="size-64 flex-none rounded-lg border border-light-d/25 overflow-hidden">
              <LoaderCanvas />
            </div>
            <MetricsDisplay className="h-64 max-w-3xl" />
          </div>

          <div className="row-[2/3] md:row-[2/4] col-[3/4] relative size-full place-items-end">
            <Counter
              onComplete={onComplete}
              className="font-black font-width-125 tracking-tighter tabular-nums text-9xl text-dark-d"
            />
          </div>
        </m.div>
      </>
    );
  },
);

export default Loader;
