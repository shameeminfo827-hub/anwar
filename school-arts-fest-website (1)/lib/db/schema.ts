import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const houses = pgTable('houses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  motto: text('motto'),
})

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  section: text('section').notNull(),
  stage: text('stage').notNull(),
  day: integer('day').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  description: text('description'),
  status: text('status').notNull(),
})

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  studentName: text('student_name').notNull(),
  admissionNo: text('admission_no').notNull(),
  grade: text('grade').notNull(),
  houseId: integer('house_id').notNull(),
  eventId: integer('event_id').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull(),
  position: integer('position').notNull(),
  studentName: text('student_name').notNull(),
  grade: text('grade').notNull(),
  houseId: integer('house_id').notNull(),
  points: integer('points').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  candidateNo: text('candidate_no').notNull().unique(),
  studentName: text('student_name').notNull(),
  admissionNo: text('admission_no'),
  grade: text('grade').notNull(),
  houseId: integer('house_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
