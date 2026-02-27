import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useState } from "react";
import Button from "../../components/button";
import IconMailFast from "../../components/svg/icon-mail-fast";
import { cn, PRIMARY_EMAIL } from "../../utils";

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
      `Hey, my name is **${name}** and I'm looking for ${service} service.\nAre you available on ${date} for a chat?`,
    );

    setNotification("Redirecting to your email client...");
    setTimeout(() => setNotification(""), RECLICK_TIMER);
    window.location.href = `mailto:${PRIMARY_EMAIL}?subject=${subject}&body=${body}`;
  }, [date, name, service, disabled]);

  return (
    <div
      className={cn("size-full space-y-3 p-1 place-items-center", className)}
    >
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
  );
}
