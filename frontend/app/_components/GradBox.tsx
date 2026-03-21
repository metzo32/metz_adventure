type GradDirection = "r" | "br" | "b" | "bl" | "l" | "tr" | "t" | "tl";

interface GradBoxProps {
  children: React.ReactNode;
  direction?: GradDirection;
  className?: string;
}

const directionMap: Record<GradDirection, string> = {
  r: "bg-linear-to-r",
  br: "bg-linear-to-br",
  b: "bg-linear-to-b",
  bl: "bg-linear-to-bl",
  l: "bg-linear-to-l",
  tr: "bg-linear-to-tr",
  t: "bg-linear-to-t",
  tl: "bg-linear-to-tl",
};

export default function GradBox({
  children,
  direction = "r",
  className = "",
}: GradBoxProps) {
  return (
    <div
      className={`${directionMap[direction]} from-primary to-light ${className}`}
    >
      {children}
    </div>
  );
}
