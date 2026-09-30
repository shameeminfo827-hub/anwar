'use client'

import { useActionState } from 'react'
import { Loader2, Mail, MapPin, Phone, User } from 'lucide-react'
import { sendContactMessage, type FormState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const initialState: FormState = { status: 'idle', message: '' }

const CONTACTS = [
  { icon: User, label: 'Fest Convener', value: 'Mrs. Lakshmi Menon', href: undefined },
  { icon: Phone, label: 'Phone', value: '+91 98470 12345', href: 'tel:+919847012345' },
  { icon: Mail, label: 'Email', value: 'artsfest@greenwood.edu', href: 'mailto:artsfest@greenwood.edu' },
  { icon: MapPin, label: 'Venue', value: 'Greenwood International School, MG Road, Kochi', href: undefined },
]

export function ContactSection() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState)
  const errors = state.fieldErrors ?? {}

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <ul className="grid gap-3 sm:grid-cols-2">
          {CONTACTS.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="flex gap-3 rounded-2xl border bg-card p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
                {href ? (
                  <a href={href} className="break-words font-medium hover:text-primary hover:underline">
                    {value}
                  </a>
                ) : (
                  <span className="font-medium">{value}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl bg-secondary p-5 text-sm leading-relaxed text-secondary-foreground">
          <p className="font-semibold">House coordinators</p>
          <p className="text-pretty">
            Crimson: Mr. Arjun Das · Saffron: Ms. Priya Raj · Emerald: Mr. Thomas Varghese · Sapphire: Ms. Nisha Pillai
          </p>
          <p className="mt-2 text-muted-foreground">Help desk open 8:30 AM – 5:00 PM near the main auditorium.</p>
        </div>
      </div>

      <form action={formAction} noValidate className="flex flex-col gap-4 rounded-3xl border bg-card p-6">
        <h3 className="font-display text-xl font-semibold">Send a message</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea id="contact-message" name="message" rows={4} aria-invalid={!!errors.message} />
          {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
        </div>
        {state.status !== 'idle' && (
          <p role="status" className={state.status === 'success' ? 'text-sm text-primary' : 'text-sm text-destructive'}>
            {state.message}
          </p>
        )}
        <Button type="submit" disabled={pending} className="w-fit">
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {pending ? 'Sending...' : 'Send message'}
        </Button>
      </form>
    </div>
  )
}
