import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn, randomRange } from "../../utils";

const LOADING_MESSAGES = [
  "Aligning pixels...",
  "Convincing the internet to cooperate...",
  "Making it look intentional...",
  "Warming up the servers.",
  "Applying duct tape.",
  "Running on caffeine and hope.",
  "npm install patience...",
  "Have you tried turning it off and on again?",
  "Blame the cache.",
  "Summoning semicolons...",
  "Still faster than Jira.",
  "Loading the loading message...",
  "Consulting the crystal ball...",
  "This message is here so you don't feel ignored.",
  "Yes, this is actually loading.",
  "I could've shown a spinner. I chose chaos.",
];

export default function Message({ className }: { className?: string }) {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const rs: Array<number> = [];
    const generateMessage = () => {
      const r = randomRange(0, LOADING_MESSAGES.length - 1, rs);
      rs.push(r);
      if (rs.length === LOADING_MESSAGES.length) rs.splice(0, rs.length - 2);
      setMessage(LOADING_MESSAGES[r]);
    };
    generateMessage();
    const interval = setInterval(() => generateMessage(), 3000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <m.p
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      key={message}
      className={cn("font-light origin-top", className)}
      layout
    >
      {message}
    </m.p>
  );
}
