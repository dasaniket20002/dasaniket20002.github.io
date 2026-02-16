import { IconChevronRight, IconMailFast } from "@tabler/icons-react";
import * as m from "motion/react-m";
import { useCallback, useRef, useState } from "react";
import Button from "../../components/button";
import Link from "../../components/link";
import { cn, PRIMARY_EMAIL } from "../../utils";
import { AnimatePresence } from "motion/react";

const RECLICK_TIMER = 2500;

export default function SendAction({
  className,
  name,
  service,
  date,
}: {
  className?: string;
  name: string;
  service: string;
  date: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [notification, setNotification] = useState("");

  const handleSend = useCallback(() => {
    if (disabled) return;

    setDisabled(true);
    setTimeout(() => setDisabled(false), RECLICK_TIMER);

    if (!name || !service || !date) {
      setNotification("No name, service or date provided");
      setTimeout(() => setNotification(""), RECLICK_TIMER);
      return;
    }

    const subject = encodeURIComponent(`Appointment for ${service} on ${date}`);
    const body = encodeURIComponent(
      `Hey, my name is **${name}** and I'm looking for ${service} service.\nAre you available on ${date} for a chat?${description ? `\n\nAdditional details:\n${description}` : ""}`,
    );

    setNotification("Redirecting to your email client...");
    setTimeout(() => setNotification(""), RECLICK_TIMER);
    window.location.href = `mailto:${PRIMARY_EMAIL}?subject=${subject}&body=${body}`;
  }, [date, description, name, service, disabled]);

  return (
    <div
      className={cn(
        "size-full grid grid-cols-3 grid-rows-[auto_1fr] gap-2 p-1",
        className,
      )}
    >
      <m.textarea
        ref={textareaRef}
        initial={{ height: "0px", opacity: 0 }}
        animate={{ height: open ? "auto" : "0px", opacity: open ? 1 : 0 }}
        rows={10}
        id="form-more-description"
        className="w-full row-span-full col-[1/3] focus:bg-light-2/25 p-3 rounded-lg outline-none border border-dark-1/75 text-xl transition-colors duration-1000 resize-none overflow-y-scroll"
        placeholder="Enter description here (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div
        onClick={() => {
          setOpen((val) => {
            if (!val) textareaRef.current?.focus();
            else textareaRef.current?.blur();
            return !val;
          });
        }}
        className="flex items-center gap-1 py-3"
      >
        <IconChevronRight
          className={cn("size-5 stroke-1 transition", open && "-rotate-180")}
        />
        <Link>Want to add more context?</Link>
      </div>
      <div className="ml-8 size-full space-y-3">
        <Button
          text="Send enquiry"
          type="button"
          icon={<IconMailFast className="size-8 stroke-1" />}
          className="px-16 py-8 text-xl gap-6 w-full"
          disabled={disabled}
          onClick={handleSend}
        />
        <AnimatePresence mode="wait">
          <m.p
            key={notification}
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 100% 0% 0%)" }}
          >
            {notification}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
