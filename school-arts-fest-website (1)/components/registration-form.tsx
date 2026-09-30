'use client'

import { useActionState } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { registerStudent, type FormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FestEvent, House } from '@/lib/data'

const initialState: FormState = { status: 'idle', message: '' }

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30'

export function RegistrationForm({ events, houses }: { events: FestEvent[]; houses: House[] }) {
  const [state, formAction, pending] = useActionState(registerStudent, initialState)
  const errors = state.fieldErrors ?? {}
  const openEvents = events.filter((e) => e.status === 'upcoming')

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-3xl border bg-card p-6 shadow-sm md:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="studentName" label="Student name" error={errors.studentName}>
          <Input id="studentName" name="studentName" autoComplete="name" required aria-invalid={!!errors.studentName} />
        </FormField>
        <FormField id="admissionNo" label="Admission number" error={errors.admissionNo}>
          <Input id="admissionNo" name="admissionNo" required aria-invalid={!!errors.admissionNo} placeholder="GIS-2041" />
        </FormField>
        <FormField id="grade" label="Class & division" error={errors.grade}>
          <Input id="grade" name="grade" required aria-invalid={!!errors.grade} placeholder="IX-B" />
        </FormField>
        <FormField id="houseId" label="House" error={errors.houseId}>
          <select id="houseId" name="houseId" required defaultValue="" aria-invalid={!!errors.houseId} className={selectClass}>
            <option value="" disabled>
              Select your house
            </option>
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="eventId" label="Event" error={errors.eventId} className="sm:col-span-2">
          <select id="eventId" name="eventId" required defaultValue="" aria-invalid={!!errors.eventId} className={selectClass}>
            <option value="" disabled>
              {openEvents.length ? 'Choose an event open for registration' : 'No events open right now'}
            </option>
            {openEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {`${e.name} (${e.section}) - Day ${e.day}, ${e.startTime}`}
              </option>
            ))}
          </select>
        </FormField>
        <FormField id="email" label="Parent / student email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} />
        </FormField>
        <FormField id="phone" label="Phone (optional)" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
        </FormField>
      </div>

      {state.status !== 'idle' && (
        <p
          role="status"
          className={
            state.status === 'success'
              ? 'flex items-start gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground'
              : 'flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive'
          }
        >
          {state.status === 'success' ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          )}
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-fit">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {pending ? 'Submitting...' : 'Submit registration'}
      </Button>
    </form>
  )
}

function FormField({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
