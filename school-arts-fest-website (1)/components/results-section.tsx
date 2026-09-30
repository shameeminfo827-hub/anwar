import { Medal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EventResult } from '@/lib/data'

const POSITION_LABEL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' }
const POSITION_STYLE: Record<number, string> = {
  1: 'bg-highlight text-highlight-foreground',
  2: 'bg-secondary text-secondary-foreground',
  3: 'bg-muted text-muted-foreground',
}

export function ResultsSection({ results }: { results: EventResult[] }) {
  if (results.length === 0) {
    return <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Results will appear here soon.</p>
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <li key={result.eventId} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">{result.eventName}</h3>
            <Medal className="size-5 shrink-0 text-primary" aria-hidden="true" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{result.category}</Badge>
            <Badge variant="secondary">{result.section}</Badge>
          </div>
          <ol className="flex flex-col gap-2">
            {result.winners.map((w) => (
              <li key={w.position} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-10 shrink-0 items-center justify-center rounded-md text-xs font-bold ${POSITION_STYLE[w.position] ?? POSITION_STYLE[3]}`}
                >
                  {POSITION_LABEL[w.position] ?? `${w.position}th`}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{w.studentName}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ backgroundColor: w.houseColor }} aria-hidden="true" />
                    {w.houseName}
                    {w.grade !== 'Team' && ` · ${w.grade}`}
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums">+{w.points}</span>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  )
}
