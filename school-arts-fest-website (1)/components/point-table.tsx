import { Trophy } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type HouseStanding = {
  id: number
  name: string
  color: string
  motto: string | null
  points: number
  gold: number
  silver: number
  bronze: number
}

export function PointTable({ standings }: { standings: HouseStanding[] }) {
  const max = Math.max(1, ...standings.map((s) => s.points))
  const leader = standings[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      {leader && (
        <div
          className="flex flex-col justify-between gap-6 rounded-3xl p-6 text-white"
          style={{ backgroundColor: leader.color }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
            <Trophy className="size-4" aria-hidden="true" />
            Currently leading
          </div>
          <div>
            <p className="font-display text-5xl font-extrabold">{leader.name}</p>
            {leader.motto && <p className="mt-1 opacity-90">{leader.motto}</p>}
          </div>
          <p className="font-display text-4xl font-bold tabular-nums">
            {leader.points} <span className="text-lg font-medium opacity-90">points</span>
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 pl-5">#</TableHead>
              <TableHead>House</TableHead>
              <TableHead className="text-center">
                <span aria-hidden="true">1st</span>
                <span className="sr-only">First places</span>
              </TableHead>
              <TableHead className="text-center">
                <span aria-hidden="true">2nd</span>
                <span className="sr-only">Second places</span>
              </TableHead>
              <TableHead className="text-center">
                <span aria-hidden="true">3rd</span>
                <span className="sr-only">Third places</span>
              </TableHead>
              <TableHead className="pr-5 text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standings.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="pl-5 font-display text-lg font-bold">{i + 1}</TableCell>
                <TableCell>
                  <div className="flex min-w-36 flex-col gap-1.5">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="size-3 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                      {s.name}
                    </span>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(s.points / max) * 100}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center tabular-nums">{s.gold}</TableCell>
                <TableCell className="text-center tabular-nums">{s.silver}</TableCell>
                <TableCell className="text-center tabular-nums">{s.bronze}</TableCell>
                <TableCell className="pr-5 text-right font-display text-lg font-bold tabular-nums">{s.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="border-t px-5 py-3 text-xs text-muted-foreground">
          Individual events: 5 / 3 / 1 points. Group events: 10 / 6 / 2 points.
        </p>
      </div>
    </div>
  )
}
