import type { SVGProps } from "react";

export default function IconBrandBlender({
  className,
  ...props
}: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 14a6 5 0 1 0 12 0a6 5 0 1 0 -12 0" />
      <path d="M14 14a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M3 16l9 -6.5" />
      <path d="M6 9h9" />
      <path d="M13 5l5.65 5" />
    </svg>
  );
}
