type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex max-w-2xl flex-col gap-2">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 id={id} className="font-display text-3xl font-bold text-balance md:text-4xl">
        {title}
      </h2>
      {description && <p className="leading-relaxed text-muted-foreground text-pretty">{description}</p>}
    </div>
  )
}
