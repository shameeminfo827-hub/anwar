'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Candidate = {
  id: number
  candidateNo: string
  studentName: string
  grade: string
  houseId: number
  houseName: string
  houseColor: string
  eventCount: number
}

type HouseOption = { id: number; name: string; color: string }

export function CandidatesList({ candidates, houses }: { candidates: Candidate[]; houses: HouseOption[] }) {
  const [query, setQuery] = useState('')
  const [houseId, setHouseId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return candidates.filter(
      (c) =>
        (houseId === null || c.houseId === houseId) &&
        (!q || c.studentName.toLowerCase().includes(q) || c.candidateNo.toLowerCase().includes(q)),
    )
  }, [candidates, query, houseId])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="candidate-search" className="sr-only">
            Search by name or candidate number
          </label>
          <Input
            id="candidate-search"
            type="search"
            placeholder="Search name or candidate no."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div role="group" aria-label="Filter by house" className="flex flex-wrap gap-2">
          <FilterChip active={houseId === null} onClick={() => setHouseId(null)}>
            All houses
          </FilterChip>
          {houses.map((h) => (
            <FilterChip key={h.id} active={houseId === h.id} onClick={() => setHouseId(h.id)}>
              <span className="size-2 rounded-full" style={{ backgroundColor: h.color }} aria-hidden="true" />
              {h.name}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <table className="w-full text-sm">
          <caption className="sr-only">Registered candidates and their candidate numbers</caption>
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Candidate no.</th>
              <th scope="col" className="px-4 py-3 font-semibold">Student name</th>
              <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Class</th>
              <th scope="col" className="px-4 py-3 font-semibold">House</th>
              <th scope="col" className="hidden px-4 py-3 text-right font-semibold md:table-cell">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-muted/40">
                <td className="px-4 py-3">
                  <span className="rounded-md bg-primary/10 px-2 py-1 font-mono text-xs font-semibold text-primary">
                    {c.candidateNo}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{c.studentName}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{c.grade}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: c.houseColor }} aria-hidden="true" />
                    {c.houseName}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-right tabular-nums text-muted-foreground md:table-cell">
                  {c.eventCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">No candidates match your search.</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {candidates.length} candidates
      </p>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
      )}
    >
      {children}
    </button>
  )
}
