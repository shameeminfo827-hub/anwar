'use server'

import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { candidates, contactMessages, events, houses, registrations } from '@/lib/db/schema'

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  fieldErrors?: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s-]{6,17}$/

function field(formData: FormData, key: string, max = 200) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

async function findCandidateNo(admissionNo: string) {
  const [row] = await db
    .select({ candidateNo: candidates.candidateNo })
    .from(candidates)
    .where(eq(sql`lower(${candidates.admissionNo})`, admissionNo.toLowerCase()))
    .limit(1)
  return row?.candidateNo
}

async function getOrCreateCandidateNo(input: {
  studentName: string
  admissionNo: string
  grade: string
  houseId: number
}) {
  const existing = await findCandidateNo(input.admissionNo)
  if (existing) return existing

  try {
    const [created] = await db
      .insert(candidates)
      .values(input)
      .returning({ candidateNo: candidates.candidateNo })
    return created.candidateNo
  } catch {
    // A concurrent registration for the same admission number may have created it first.
    const raced = await findCandidateNo(input.admissionNo)
    if (raced) return raced
    throw new Error('Could not assign a candidate number')
  }
}

export async function registerStudent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const studentName = field(formData, 'studentName', 80)
  const admissionNo = field(formData, 'admissionNo', 30)
  const grade = field(formData, 'grade', 20)
  const email = field(formData, 'email', 120).toLowerCase()
  const phone = field(formData, 'phone', 20)
  const houseId = Number(field(formData, 'houseId'))
  const eventId = Number(field(formData, 'eventId'))

  const fieldErrors: Record<string, string> = {}
  if (studentName.length < 2) fieldErrors.studentName = 'Enter the full name.'
  if (!admissionNo) fieldErrors.admissionNo = 'Admission number is required.'
  if (!grade) fieldErrors.grade = 'Enter class and division, e.g. IX-B.'
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email.'
  if (phone && !PHONE_RE.test(phone)) fieldErrors.phone = 'Enter a valid phone number.'
  if (!Number.isInteger(houseId) || houseId <= 0) fieldErrors.houseId = 'Choose a house.'
  if (!Number.isInteger(eventId) || eventId <= 0) fieldErrors.eventId = 'Choose an event.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors }
  }

  try {
    const [[event], [house]] = await Promise.all([
      db.select().from(events).where(eq(events.id, eventId)).limit(1),
      db.select({ id: houses.id }).from(houses).where(eq(houses.id, houseId)).limit(1),
    ])

    if (!event || !house) {
      return { status: 'error', message: 'Selected event or house was not found.' }
    }
    if (event.status !== 'upcoming') {
      return {
        status: 'error',
        message: `Registration for ${event.name} is closed.`,
        fieldErrors: { eventId: 'Registration closed for this event.' },
      }
    }

    const [existing] = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(sql`lower(${registrations.admissionNo})`, admissionNo.toLowerCase()),
        ),
      )
      .limit(1)

    if (existing) {
      return {
        status: 'error',
        message: `Admission no. ${admissionNo} is already registered for ${event.name}.`,
      }
    }

    await db.insert(registrations).values({
      studentName,
      admissionNo,
      grade,
      email,
      phone: phone || null,
      houseId,
      eventId,
    })

    const candidateNo = await getOrCreateCandidateNo({ studentName, admissionNo, grade, houseId })

    revalidatePath('/')
    return {
      status: 'success',
      message: `${studentName} is registered for ${event.name} (Day ${event.day}, ${event.startTime}). Candidate no: ${candidateNo}.`,
    }
  } catch (error) {
    console.error('Registration failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}

export async function sendContactMessage(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = field(formData, 'name', 80)
  const email = field(formData, 'email', 120).toLowerCase()
  const message = field(formData, 'message', 2000)

  const fieldErrors: Record<string, string> = {}
  if (name.length < 2) fieldErrors.name = 'Enter your name.'
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Enter a valid email.'
  if (message.length < 10) fieldErrors.message = 'Message should be at least 10 characters.'

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors }
  }

  try {
    await db.insert(contactMessages).values({ name, email, message })
    return { status: 'success', message: 'Thanks! The fest committee will reply soon.' }
  } catch (error) {
    console.error('Contact message failed', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
