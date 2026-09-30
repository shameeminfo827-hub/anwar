import { Crown } from 'lucide-react'

type Scorer = {
  studentName: string
  grade: string
  houseName: string
  houseColor: string
  points: number
  wins: number
  podiums: number
}

export function TopScorers({ scorers }: { scorers: Scorer[] }) {
  if (scorers.length === 0) {
    return <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">No scores yet.</p>
  }

  const [champion, ...rest] = scorers

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <article className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-highlight bg-card p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
          <Crown className="size-7" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Kala Prathibha frontrunner</p>
        <h3 className="font-display text-3xl font-bold">{champion.studentName}</h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: champion.houseColor }} aria-hidden="true" />
          {champion.houseName} House · {champion.grade}
        </p>
        <dl className="mt-2 grid w-full grid-cols-3 gap-2">
          <Stat label="Points" value={champion.points} />
          <Stat label="Wins" value={champion.wins} />
          <Stat label="Podiums" value={champion.podiums} />
        </dl>
      </article>

      <ol className="flex flex-col gap-2" start={2}>
        {rest.map((s, i) => (
          <li key={`${s.studentName}-${s.grade}`} className="flex items-center gap-4 rounded-2xl border bg-card px-4 py-3">
            <span className="w-6 font-display text-lg font-bold text-muted-foreground">{i + 2}</span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-semibold">{s.studentName}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: s.houseColor }} aria-hidden="true" />
                {s.houseName} · {s.grade} · {s.wins} {s.wins === 1 ? 'win' : 'wins'}
              </span>
            </div>
            <span className="font-display text-xl font-bold tabular-nums text-primary">
              {s.points}
              <span className="sr-only"> points</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col rounded-xl bg-muted p-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  )
}
