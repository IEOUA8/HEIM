import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  size = 40,
  className,
  withWordmark = false,
}: {
  size?: number;
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/heim-logo.png"
        alt="HEIM"
        width={size}
        height={size}
        priority
      />
      {withWordmark && (
        <span className="text-sm font-semibold tracking-wide text-brand-forest">
          Caminata por los animales
        </span>
      )}
    </span>
  );
}
