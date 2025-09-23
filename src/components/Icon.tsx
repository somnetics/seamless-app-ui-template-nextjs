import * as Icons from "lucide-react";

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  // get lucide icon
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[name];

  // if not iocn return
  if (!LucideIcon) return null;

  // return generated icon
  return <LucideIcon size={size} className={className} />;
}
