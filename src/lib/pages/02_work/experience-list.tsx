import { IconPencil } from "@tabler/icons-react";
import { forwardRef, Fragment } from "react";
import { cn } from "../../utils";

interface Designation {
  title: string;
  type?: string;
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
  {
    experiences: Experience[];
    className?: string;
  }
>(({ experiences, className }, ref) => {
  let currentRow = 1;

  const layout = experiences.map((exp) => {
    const headerRow = currentRow++;

    const designations = exp.designations.map((des) => {
      const titleRow = currentRow++;
      const dateRow = currentRow++;
      const descRow = currentRow++;
      let skillsRow: number | null = null;
      if (des.skills && des.skills.length > 0) {
        skillsRow = currentRow++;
      }
      return { titleRow, dateRow, descRow, skillsRow };
    });

    return { headerRow, designations };
  });

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-[6rem_1.5rem_1.5rem_1fr] auto-rows-min gap-y-1 gap-x-8 items-center",
        className,
      )}
    >
      {experiences.map((exp, expIdx) => {
        const { headerRow, designations: desLayout } = layout[expIdx];
        const firstTitleRow = desLayout[0].titleRow;
        const lastTitleRow = desLayout[desLayout.length - 1].titleRow;
        const showTimeline = desLayout.length > 1;

        return (
          <Fragment key={expIdx}>
            {/* ── vertical timeline connector ── */}
            {showTimeline && (
              <div
                className="w-0.5 h-9/10 place-self-center bg-light-d/25 flex"
                style={{
                  gridColumn: "2 / 3",
                  gridRow: `${firstTitleRow} / ${lastTitleRow + 1}`,
                }}
              />
            )}

            {/* ── company logo ── */}
            <div
              className="size-24 bg-light-d rounded-2xl place-content-center place-items-center p-3"
              style={{
                gridColumn: "1 / 2",
                gridRow: `${headerRow} / ${headerRow + 1}`,
              }}
            >
              <img src={exp.imgUrl} alt={exp.companyName} />
            </div>

            {/* ── company info ── */}
            <div
              className="flex flex-col gap-1"
              style={{
                gridColumn: "2 / -1",
                gridRow: `${headerRow} / ${headerRow + 1}`,
              }}
            >
              <h3 className="text-4xl font-width-120 font-extralight uppercase">
                {exp.companyName}
              </h3>
              <h4 className="text-base text-light-l/75 tracking-wider inline-flex gap-3 items-center">
                <span>{exp.location}</span>
                <span>.</span>
                <span className="text-light-d">{exp.totalDuration}</span>
              </h4>
            </div>

            {/* ── designations ── */}
            {exp.designations.map((des, desIdx) => {
              const { titleRow, dateRow, descRow, skillsRow } =
                desLayout[desIdx];

              return (
                <Fragment key={desIdx}>
                  {/* circle marker */}
                  <span
                    className="relative mt-4 size-6 bg-light-d rounded-full place-self-center border-3 border-dark-d after:absolute after:inset-0 after:scale-50 after:rounded-full after:bg-dark-d"
                    style={{
                      gridColumn: "2 / 3",
                      gridRow: `${titleRow} / ${titleRow + 1}`,
                    }}
                  />

                  {/* title + type */}
                  <span
                    className="flex items-end gap-3 mt-4"
                    style={{
                      gridColumn: "3 / -1",
                      gridRow: `${titleRow} / ${titleRow + 1}`,
                    }}
                  >
                    <p className="text-2xl font-width-120 font-light tracking-wide uppercase">
                      {des.title}
                    </p>
                    {des.type && (
                      <>
                        <p className="text-dark-l">.</p>
                        <p className="text-base text-dark-l">{des.type}</p>
                      </>
                    )}
                  </span>

                  {/* date range + duration */}
                  <span
                    className="flex gap-3 items-end"
                    style={{
                      gridColumn: "3 / -1",
                      gridRow: `${dateRow} / ${dateRow + 1}`,
                    }}
                  >
                    <p className="text-lg font-light">
                      {des.startDate} - {des.endDate}
                    </p>
                    <p className="text-dark-l">.</p>
                    <p className="text-dark-l text-base">{des.duration}</p>
                  </span>

                  {/* bullet descriptions */}
                  <div
                    className="grid grid-cols-subgrid gap-y-1 gap-x-1 tracking-widest font-light text-light-d py-3"
                    style={{
                      gridColumn: "3 / -1",
                      gridRow: `${descRow} / ${descRow + 1}`,
                    }}
                  >
                    {des.descriptions.map((desc, i) => (
                      <Fragment key={i}>
                        <p className="col-[1/2]">-</p>
                        <p className="col-[2/3]">{desc}</p>
                      </Fragment>
                    ))}
                  </div>

                  {/* skills */}
                  {des.skills &&
                    des.skills.length > 0 &&
                    skillsRow !== null && (
                      <div
                        className="grid grid-cols-subgrid gap-x-1 tracking-widest pb-1.5"
                        style={{
                          gridColumn: "3 / -1",
                          gridRow: `${skillsRow} / ${skillsRow + 1}`,
                        }}
                      >
                        <p className="col-[1/2] place-content-center">
                          <IconPencil className="size-6 stroke-1" />
                        </p>
                        <span className="col-[2/3] flex flex-wrap items-center gap-x-3 text-light-l/75 text-lg">
                          {des.skills.map((skill, i) => (
                            <p key={i}>
                              {skill}
                              {i < des.skills!.length - 1 ? "," : ""}
                            </p>
                          ))}
                        </span>
                      </div>
                    )}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </div>
  );
});

export default ExperienceList;
