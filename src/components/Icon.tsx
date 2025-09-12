import * as Icons from "lucide-react";

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const LucideIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ size?: number; className?: string }>
    >
  )[name];

  if (!LucideIcon) return null;

  return <LucideIcon size={size} className={className} />;
}
