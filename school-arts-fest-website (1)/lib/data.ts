import 'server-only'
import { asc, desc, eq, ne, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { candidates, events, houses, registrations, results } from '@/lib/db/schema'

export type House = typeof houses.$inferSelect
export type FestEvent = typeof events.$inferSelect

export async function getHouses() {
  return db.select().from(houses).orderBy(asc(houses.id))
}

export async function getEvents() {
  return db
    .select()
    .from(events)
    .orderBy(asc(events.day), asc(events.startTime))
}

export type EventResult = {
  eventId: number
  eventName: string
  category: string
  section: string
  winners: {
    position: number
    studentName: string
    grade: string
    houseName: string
    houseColor: string
    points: number
  }[]
}

export async function getResults(): Promise<EventResult[]> {
  const rows = await db
    .select({
      eventId: events.id,
      eventName: events.name,
      category: events.category,
      section: events.section,
      day: events.day,
      position: results.position,
      studentName: results.studentName,
      grade: results.grade,
      points: results.points,
      houseName: houses.name,
      houseColor: houses.color,
    })
    .from(results)
    .innerJoin(events, eq(results.eventId, events.id))
    .innerJoin(houses, eq(results.houseId, houses.id))
    .orderBy(desc(events.day), asc(events.startTime), asc(results.position))

  const grouped = new Map<number, EventResult>()
  for (const row of rows) {
    const entry =
      grouped.get(row.eventId) ??
      ({
        eventId: row.eventId,
        eventName: row.eventName,
        category: row.category,
        section: row.section,
        winners: [],
      } satisfies EventResult)
    entry.winners.push({
      position: row.position,
      studentName: row.studentName,
      grade: row.grade,
      houseName: row.houseName,
      houseColor: row.houseColor,
      points: row.points,
    })
    grouped.set(row.eventId, entry)
  }
  return [...grouped.values()]
}

export async function getPointsTable() {
  return db
    .select({
      id: houses.id,
      name: houses.name,
      color: houses.color,
      motto: houses.motto,
      points: sql<number>`coalesce(sum(${results.points}), 0)`.mapWith(Number),
      gold: sql<number>`count(*) filter (where ${results.position} = 1)`.mapWith(Number),
      silver: sql<number>`count(*) filter (where ${results.position} = 2)`.mapWith(Number),
      bronze: sql<number>`count(*) filter (where ${results.position} = 3)`.mapWith(Number),
    })
    .from(houses)
    .leftJoin(results, eq(results.houseId, houses.id))
    .groupBy(houses.id)
    .orderBy(desc(sql`coalesce(sum(${results.points}), 0)`), asc(houses.name))
}

export async function getTopScorers(limit = 8) {
  return db
    .select({
      studentName: results.studentName,
      grade: results.grade,
      houseName: houses.name,
      houseColor: houses.color,
      points: sql<number>`sum(${results.points})`.mapWith(Number),
      wins: sql<number>`count(*) filter (where ${results.position} = 1)`.mapWith(Number),
      podiums: sql<number>`count(*)`.mapWith(Number),
    })
    .from(results)
    .innerJoin(houses, eq(results.houseId, houses.id))
    .where(ne(results.grade, 'Team'))
    .groupBy(results.studentName, results.grade, houses.name, houses.color)
    .orderBy(desc(sql`sum(${results.points})`), desc(sql`count(*) filter (where ${results.position} = 1)`))
    .limit(limit)
}

export type Candidate = {
  id: number
  candidateNo: string
  studentName: string
  grade: string
  houseId: number
  houseName: string
  houseColor: string
  eventCount: number
}

export async function getCandidates(): Promise<Candidate[]> {
  return db
    .select({
      id: candidates.id,
      candidateNo: candidates.candidateNo,
      studentName: candidates.studentName,
      grade: candidates.grade,
      houseId: candidates.houseId,
      houseName: houses.name,
      houseColor: houses.color,
      eventCount: sql<number>`(select count(*) from ${registrations} where lower(${registrations.admissionNo}) = lower(${candidates.admissionNo}))`.mapWith(Number),
    })
    .from(candidates)
    .innerJoin(houses, eq(candidates.houseId, houses.id))
    .orderBy(asc(candidates.candidateNo))
}

export async function getFestStats() {
  const [row] = await db
    .select({
      registrations: sql<number>`count(*)`.mapWith(Number),
    })
    .from(registrations)
  return { registrations: row?.registrations ?? 0 }
}
