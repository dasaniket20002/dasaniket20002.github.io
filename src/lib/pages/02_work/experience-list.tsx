import { forwardRef } from "react";
import { cn } from "../../utils";
import ExperienceCard from "./experience-card";

interface Designation {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  descriptions: string[];
  skills?: string[];
}

export interface Experience {
  companyName: string;
  imgUrl: string;
  location: string;
  totalDuration: string;
  designations: Designation[];
}

const ExperienceList = forwardRef<
  HTMLDivElement,
  { experiences: Experience[]; className?: string }
>(({ experiences, className }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-12", className)}>
    {experiences.map((exp, i) => (
      <ExperienceCard key={i} experience={exp} />
    ))}
  </div>
));

ExperienceList.displayName = "ExperienceList";

export default ExperienceList;
