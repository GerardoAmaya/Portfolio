import { cn } from "@/lib/utils";
import { Rise } from "@/components/motion/rise";

export function PageHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header className={cn("container-app pt-20 pb-10 md:pt-28", className)}>
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        <Rise>{title}</Rise>
      </h1>
      {subtitle ? (
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg text-pretty">{subtitle}</p>
      ) : null}
    </header>
  );
}
