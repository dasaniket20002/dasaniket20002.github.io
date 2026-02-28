import { memo, useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../utils";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useElementSize } from "../../hooks/use-element-size";
import IconChevronDown from "../../components/svg/icon-chevron-down";
import IconChevronLeft from "../../components/svg/icon-chevron-left";
import IconChevronRight from "../../components/svg/icon-chevron-right";
import Popover from "../../components/popover";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getCalendarWeeks(year: number, month: number): CalendarWeek[] {
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const calendarStart = new Date(year, month, 1 - startOffset);
  const weeks: CalendarWeek[] = [];

  for (let w = 0; w < 6; w++) {
    const days: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(calendarStart);
      date.setDate(calendarStart.getDate() + w * 7 + d);
      days.push({ date, isCurrentMonth: date.getMonth() === month });
    }
    weeks.push({ days, weekNumber: getISOWeekNumber(days[3].date) });
  }

  return weeks;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function parseDateInput(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12 || year < 1) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  )
    return null;
  return date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const monthSlideVariants = {
  enter: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
};

const CalendarDayButton = memo(function CalendarDayButton({
  day,
  isToday,
  isSelected,
  isDisabled,
  delay,
  onSelect,
}: {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  delay: number;
  onSelect: (date: Date) => void;
}) {
  return (
    <m.button
      type="button"
      disabled={isDisabled}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isDisabled ? 0.75 : 1,
        scale: 1,
        transition: { delay, duration: 0.2 },
      }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay, duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (!isDisabled) onSelect(day.date);
      }}
      className={cn(
        "relative text-base aspect-square rounded-md tabular-nums cursor-pointer disabled:cursor-not-allowed",
        "flex items-center justify-center transition-colors duration-150",
        day.isCurrentMonth ? "text-light-d" : "text-light-l",
        isToday && !isSelected && "font-black",
        isSelected && "bg-dark-d/50 text-light-l font-black",
        !isSelected && "hover:bg-dark-l/25",
      )}
    >
      {isToday && !isSelected && (
        <span
          className={cn(
            "absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full",
            day.isCurrentMonth ? "bg-dark-1" : "bg-light-2/40",
          )}
        />
      )}
      {day.date.getDate()}
    </m.button>
  );
});

export default function DateRequest({
  className,
  inputValue,
  setInputValue,
}: {
  className?: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [direction, setDirection] = useState(0);

  const { height: contentHeight } = useElementSize(contentRef);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const calendarWeeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const navigateMonth = useCallback((delta: number) => {
    setDirection(delta);
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  }, []);

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yyyy = String(date.getFullYear());
      setInputValue(`${mm}/${dd}/${yyyy}`);
      setFocused(false);
    },
    [setInputValue],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDateInput(e.target.value);
      setInputValue(formatted);
      const parsed = parseDateInput(formatted);
      if (parsed) {
        const todayMidnight = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        if (parsed >= todayMidnight) {
          setSelectedDate(parsed);
          setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
        } else {
          setSelectedDate(null); // reject past dates
        }
      }
    },
    [setInputValue, today],
  );

  const handleInputClick = useCallback(() => setFocused(true), []);

  const handleClose = useCallback(() => {
    setFocused(false);
    if (inputValue) {
      const parsed = parseDateInput(inputValue);
      if (!parsed) {
        setInputValue("");
        setSelectedDate(null);
      }
    }
  }, [inputValue, setInputValue]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);
  const handlePrevMonth = useCallback(() => navigateMonth(-1), [navigateMonth]);
  const handleNextMonth = useCallback(() => navigateMonth(1), [navigateMonth]);
  const handleTodayClick = useCallback(
    () => handleDateSelect(new Date()),
    [handleDateSelect],
  );

  return (
    <span
      ref={anchorRef}
      className={cn(
        "relative inline-block transition-colors duration-1000 rounded-md mx-[0.5ch]",
        focused && "bg-dark-l/10",
        className,
      )}
    >
      {!inputValue && (
        <span className="absolute inset-0 pointer-events-none px-[0.5ch] font-width-90 font-bold text-dark-l/75 flex items-center">
          MM/DD/YYYY
        </span>
      )}
      <input
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleInputClick}
        value={inputValue}
        onChange={handleInputChange}
        maxLength={10}
        size={12}
        id="form-date-request"
        type="text"
        className="outline-none font-width-90 font-bold px-[0.5ch] bg-transparent placeholder:text-dark-l/75 tabular-nums"
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <IconChevronDown
          className={cn(
            "size-8 stroke-light-l transition",
            focused && "-rotate-90 stroke-dark-l",
          )}
        />
      </span>
      <span className="absolute bottom-4 left-0 right-0 h-px bg-light-d/75" />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-d/75"
      />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: focused ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-light-d"
      />

      {/* Calendar Popup */}
      <Popover open={focused} onClose={handleClose} anchorRef={anchorRef}>
        <m.div
          layout
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: focused ? contentHeight : 0,
            opacity: focused ? 1 : 0.25,
            transition: { delay: focused ? 0 : 0.25, type: "spring" },
          }}
          className="rounded-md overflow-hidden shadow-2xl bg-dark-d"
        >
          <div ref={contentRef} className="p-3 w-sm flex flex-col gap-2">
            {focused && (
              <>
                {/* Month / Year Navigation */}
                <div className="flex items-center justify-between mb-3">
                  <m.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className="p-1 rounded-md hover:bg-dark-l/25 transition-colors cursor-pointer"
                  >
                    <IconChevronLeft className="size-5 stroke-light-l" />
                  </m.button>

                  <div className="relative overflow-hidden h-6 flex-1 mx-2">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <m.span
                        key={`${viewYear}-${viewMonth}`}
                        custom={direction}
                        variants={monthSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center font-bold text-base text-light-l tracking-wider"
                      >
                        {MONTHS[viewMonth]} {viewYear}
                      </m.span>
                    </AnimatePresence>
                  </div>

                  <m.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                    className="p-1 rounded-md hover:bg-dark-l/25 transition-colors cursor-pointer"
                  >
                    <IconChevronRight className="size-5 stroke-light-l" />
                  </m.button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-px mb-1">
                  <span className="text-sm text-dark-l/75 flex items-center justify-center font-bold font-width-75">
                    Wk
                  </span>
                  {WEEKDAYS.map((day) => (
                    <span
                      key={day}
                      className="text-sm font-bold font-width-75 text-light-d text-center py-1"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <span className="block h-px bg-dark-l/50 mb-1" />

                {/* 6-Week Calendar Grid */}
                <div className="relative">
                  <AnimatePresence mode="popLayout" custom={direction}>
                    <m.div
                      key={`grid-${viewYear}-${viewMonth}`}
                      custom={direction}
                      variants={monthSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {calendarWeeks.map((week, wi) => (
                        <div
                          key={week.weekNumber}
                          className="grid grid-cols-[2rem_repeat(7,1fr)] gap-px"
                        >
                          <m.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: {
                                delay: 0.05 * wi,
                                duration: 0.2,
                              },
                            }}
                            className="text-sm text-light-d flex items-center justify-center tabular-nums"
                          >
                            {week.weekNumber}
                          </m.span>
                          {week.days.map((day, di) => (
                            <CalendarDayButton
                              key={day.date.toISOString()}
                              day={day}
                              isToday={isSameDay(day.date, today)}
                              isSelected={
                                selectedDate !== null &&
                                isSameDay(day.date, selectedDate)
                              }
                              isDisabled={day.date < today}
                              delay={0.015 * (wi * 7 + di)}
                              onSelect={handleDateSelect}
                            />
                          ))}
                        </div>
                      ))}
                    </m.div>
                  </AnimatePresence>
                </div>

                <span className="block h-px bg-dark-l/50 mt-1" />

                {/* Today Shortcut */}
                <m.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTodayClick}
                  className="w-full text-center text-sm font-bold text-light-l py-3 rounded-md hover:bg-light-d/10 transition-colors cursor-pointer"
                >
                  Today
                </m.button>
              </>
            )}
          </div>
        </m.div>
      </Popover>
    </span>
  );
}
