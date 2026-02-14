import { memo, useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../utils";
import { useClickOutside } from "../../hooks/use-click-outside";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";

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
  delay,
  onSelect,
}: {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  delay: number;
  onSelect: (date: Date) => void;
}) {
  return (
    <m.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay, duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(day.date)}
      className={cn(
        "relative text-base aspect-square rounded-md cursor-pointer tabular-nums",
        "flex items-center justify-center transition-colors duration-150",
        day.isCurrentMonth ? "text-dark-1" : "text-light-2",
        isToday && !isSelected && "font-black",
        isSelected && "bg-dark-1 text-light-2 font-black",
        !isSelected && "hover:bg-light-2/25",
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

export default function DateRequest({ className }: { className?: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [direction, setDirection] = useState(0);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const calendarWeeks = useMemo(
    () => getCalendarWeeks(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const today = useMemo(() => new Date(), []);

  const navigateMonth = useCallback((delta: number) => {
    setDirection(delta);
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    setInputValue(`${mm}/${dd}/${yyyy}`);
    setFocused(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDateInput(e.target.value);
      setInputValue(formatted);
      const parsed = parseDateInput(formatted);
      if (parsed) {
        setSelectedDate(parsed);
        setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      }
    },
    [],
  );

  const handleInputClick = useCallback(() => setFocused(true), []);
  const handleClickOutside = useCallback(() => {
    setFocused(false);
    if (inputValue) {
      const parsed = parseDateInput(inputValue);
      if (!parsed) {
        setInputValue("");
        setSelectedDate(null);
      }
    }
  }, [inputValue]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);
  const handlePrevMonth = useCallback(() => navigateMonth(-1), [navigateMonth]);
  const handleNextMonth = useCallback(() => navigateMonth(1), [navigateMonth]);
  const handleTodayClick = useCallback(
    () => handleDateSelect(new Date()),
    [handleDateSelect],
  );

  useClickOutside(containerRef, handleClickOutside);

  return (
    <span
      ref={containerRef}
      className={cn(
        "relative inline-block transition-colors duration-1000 rounded-md mx-[0.5ch]",
        focused && "bg-light-2/25",
        className,
      )}
    >
      {!inputValue && (
        <span className="absolute inset-0 pointer-events-none px-[0.5ch] font-width-90 font-bold text-light-2/75 flex items-center">
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
        className="outline-none font-width-90 font-bold px-[0.5ch] bg-transparent placeholder:text-light-2/75 tabular-nums [anchor-name:--date-request-select]"
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <IconChevronDown
          className={cn(
            "size-8 stroke-light-2 transition",
            focused && "-rotate-90 stroke-dark-1",
          )}
        />
      </span>
      <span className="absolute bottom-4 left-0 right-0 h-px bg-light-2" />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: hovered ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute bottom-4 left-0 h-px bg-dark-1/25"
      />
      <m.span
        initial={{ right: "100%" }}
        animate={{ right: focused ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "anticipate" }}
        className="absolute bottom-4 left-0 h-px bg-dark-1"
      />

      {/* Calendar Popup */}
      <m.div
        initial={{ height: "0rem", opacity: 0 }}
        animate={{
          height: focused ? "auto" : "0rem",
          opacity: focused ? 1 : 0.25,
          transition: { delay: focused ? 0 : 0.25, type: "spring" },
        }}
        className={cn(
          "absolute z-10 rounded-md mt-1.5 overflow-hidden shadow-2xl bg-light-1",
          "[position-anchor:--date-request-select] top-[anchor(bottom)] [justify-self:anchor-center]",
          "[position-try:flip-block_flip-inline] [position-visibility:anchors-visible]",
        )}
      >
        {focused && (
          <div className="p-3 w-sm">
            {/* Month / Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <m.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevMonth}
                className="p-1 rounded-md hover:bg-light-2/25 transition-colors cursor-pointer"
              >
                <IconChevronLeft className="size-5 stroke-dark-1" />
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
                    className="absolute inset-0 flex items-center justify-center font-bold text-base text-dark-1 tracking-wider"
                  >
                    {MONTHS[viewMonth]} {viewYear}
                  </m.span>
                </AnimatePresence>
              </div>

              <m.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleNextMonth}
                className="p-1 rounded-md hover:bg-light-2/25 transition-colors cursor-pointer"
              >
                <IconChevronRight className="size-5 stroke-dark-1" />
              </m.button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-[2rem_repeat(7,1fr)] gap-px mb-1">
              <span className="text-sm text-light-2/75 flex items-center justify-center font-bold font-width-75">
                Wk
              </span>
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="text-sm font-bold font-width-75 text-light-2 text-center py-1"
                >
                  {day}
                </span>
              ))}
            </div>

            <span className="block h-px bg-light-2/50 mb-1" />

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
                          transition: { delay: 0.05 * wi, duration: 0.2 },
                        }}
                        className="text-sm text-light-2 flex items-center justify-center tabular-nums"
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
                          delay={0.015 * (wi * 7 + di)}
                          onSelect={handleDateSelect}
                        />
                      ))}
                    </div>
                  ))}
                </m.div>
              </AnimatePresence>
            </div>

            <span className="block h-px bg-light-2/50 mt-1" />

            {/* Today Shortcut */}
            <m.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={handleTodayClick}
              className="w-full text-center text-sm font-bold text-dark-1/75 py-3 rounded-md hover:bg-light-2/25 transition-colors cursor-pointer"
            >
              Today
            </m.button>
          </div>
        )}
      </m.div>
    </span>
  );
}
