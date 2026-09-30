import Image from 'next/image'
import { CalendarDays, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

type HeroProps = {
  eventCount: number
  houseCount: number
  registrationCount: number
  completedCount: number
}

export function Hero({ eventCount, houseCount, registrationCount, completedCount }: HeroProps) {
  const stats = [
    { label: 'Events', value: eventCount },
    { label: 'Houses', value: houseCount },
    { label: 'Registrations', value: registrationCount },
    { label: 'Results out', value: completedCount },
  ]

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col gap-6">
          <p className="w-fit rounded-full bg-highlight px-3 py-1 text-xs font-semibold uppercase tracking-wider text-highlight-foreground">
            Annual School Arts Festival
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] text-balance md:text-6xl">
            Where every student <span className="text-primary">takes the stage.</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Three days of music, dance, theatre, literature and fine arts. Follow the schedule, register for
            events and track your house on the live point table.
          </p>
          <ul className="flex flex-col gap-2 text-sm font-medium sm:flex-row sm:gap-6">
            <li className="flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              October 14 – 16, 2026
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
              Greenwood International School
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<a href="#register" />}>
              Register for an event
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<a href="#points" />}>
              View point table
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-card shadow-xl">
            <Image
              src="/gallery/dance.png"
              alt="Students performing a group dance on the open air stage"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-4 gap-2 rounded-2xl border bg-card p-3 shadow-lg md:-left-6 md:right-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <span className="font-display text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
