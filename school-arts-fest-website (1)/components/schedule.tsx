'use client'

import { useMemo, useState } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FestEvent } from '@/lib/data'

const DAY_LABELS: Record<number, string> = {
  1: 'Oct 14',
  2: 'Oct 15',
  3: 'Oct 16',
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-muted text-muted-foreground',
  live: 'bg-primary text-primary-foreground',
  upcoming: 'bg-highlight text-highlight-foreground',
}

export function Schedule({ events }: { events: FestEvent[] }) {
  const days = useMemo(() => [...new Set(events.map((e) => e.day))].sort(), [events])
  const categories = useMemo(() => ['All', ...new Set(events.map((e) => e.category))], [events])
  const [day, setDay] = useState(days.find((d) => events.some((e) => e.day === d && e.status !== 'completed')) ?? days[0])
  const [category, setCategory] = useState('All')

  const visible = events.filter((e) => e.day === day && (category === 'All' || e.category === category))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Festival day" className="inline-flex w-fit gap-1 rounded-xl bg-muted p-1">
          {days.map((d) => (
            <button
              key={d}
              role="tab"
              type="button"
              aria-selected={day === d}
              onClick={() => setDay(d)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                day === d ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Day {d}
              <span className="ml-1 hidden font-normal text-muted-foreground sm:inline">{DAY_LABELS[d]}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
                category === c ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
          No {category.toLowerCase()} events on this day.
        </p>
      ) : (
        <ol className="flex flex-col gap-3" role="tabpanel">
          {visible.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-3 rounded-2xl border bg-card p-4 md:flex-row md:items-center md:gap-6"
            >
              <div className="flex shrink-0 items-center gap-2 font-display text-lg font-bold md:w-36 md:flex-col md:items-start md:gap-0">
                <span>{event.startTime}</span>
                <span className="text-sm font-normal text-muted-foreground">to {event.endTime}</span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{event.name}</h3>
                  <Badge variant="outline">{event.category}</Badge>
                  <Badge variant="secondary">{event.section}</Badge>
                </div>
                {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
              </div>
              <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {event.stage}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                    STATUS_STYLES[event.status] ?? STATUS_STYLES.upcoming,
                  )}
                >
                  {event.status === 'live' && <Clock className="size-3" aria-hidden="true" />}
                  {event.status === 'live' ? 'Live now' : event.status}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
