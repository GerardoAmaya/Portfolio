import { cn } from "@/lib/utils";

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
    <header className={cn("container-app pb-10 pt-20 md:pt-28", className)}>
      <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
