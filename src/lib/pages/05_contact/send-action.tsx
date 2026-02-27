import { useCallback, useState } from "react";
import Button from "../../components/button";
import IconMailFast from "../../components/svg/icon-mail-fast";
import { useToast } from "../../contexts/use-toast";
import { cn, PRIMARY_EMAIL } from "../../utils";

const RECLICK_TIMER = 500;

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
  const { toast } = useToast();

  const handleSend = useCallback(() => {
    if (disabled) return;

    setDisabled(true);
    setTimeout(() => setDisabled(false), RECLICK_TIMER);

    if (!name || !service || !date) {
      toast("No name, service or date provided", { type: "error" });
      return;
    }

    const subject = encodeURIComponent(`Appointment for ${service} on ${date}`);
    const body = encodeURIComponent(
      `Hey, my name is ${name} and I'm looking for ${service} service.\nAre you available on ${date} for a chat?`,
    );

    toast("Redirecting to your email client...", { type: "success" });
    window.location.href = `mailto:${PRIMARY_EMAIL}?subject=${subject}&body=${body}`;
  }, [disabled, name, service, date, toast]);

  return (
    <Button
      text="Send enquiry"
      type="button"
      icon={<IconMailFast className="size-8 stroke-1" />}
      className={cn(
        "px-16 py-8 text-xl gap-6 w-full place-self-center my-3",
        className,
      )}
      disabled={disabled}
      onClick={handleSend}
    />
  );
}
