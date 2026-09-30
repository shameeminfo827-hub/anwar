import { ContactSection } from '@/components/contact-section'
import { Gallery } from '@/components/gallery'
import { Hero } from '@/components/hero'
import { PointTable } from '@/components/point-table'
import { RegistrationForm } from '@/components/registration-form'
import { ResultsSection } from '@/components/results-section'
import { Schedule } from '@/components/schedule'
import { SectionHeading } from '@/components/section-heading'
import { SiteHeader } from '@/components/site-header'
import { TopScorers } from '@/components/top-scorers'
import { CandidatesList } from '@/components/candidates-list'
import {
  getCandidates,
  getEvents,
  getFestStats,
  getHouses,
  getPointsTable,
  getResults,
  getTopScorers,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [houses, events, results, standings, scorers, stats, candidates] = await Promise.all([
    getHouses(),
    getEvents(),
    getResults(),
    getPointsTable(),
    getTopScorers(),
    getFestStats(),
    getCandidates(),
  ])

  return (
    <>
      <SiteHeader />
      <main>
        <Hero
          eventCount={events.length}
          houseCount={houses.length}
          registrationCount={stats.registrations}
          completedCount={results.length}
        />

        <section aria-labelledby="schedule-title" id="schedule" className="mx-auto max-w-6xl px-4 py-16 md:pt-24">
          <SectionHeading
            id="schedule-title"
            eyebrow="Event schedule"
            title="Three days, five stages, sixteen events"
            description="Pick a day and filter by category. Reporting time is 30 minutes before each event."
          />
          <Schedule events={events} />
        </section>

        <section aria-labelledby="register-title" id="register" className="bg-secondary/50 py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <SectionHeading
                id="register-title"
                eyebrow="Registration"
                title="Sign up for an event"
                description="Registrations are open for upcoming events only. Each student may register for up to four individual events."
              />
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
                <li>Bring your school ID card on the day of the event.</li>
                <li>Group events need one registration per participant.</li>
                <li>Confirmation is shared with your house coordinator.</li>
              </ul>
            </div>
            <RegistrationForm events={events} houses={houses} />
          </div>
        </section>

        <section aria-labelledby="candidates-title" id="candidates" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            id="candidates-title"
            eyebrow="Candidates"
            title="Students & candidate numbers"
            description="Every registered student gets a unique candidate number. Quote it at the stage desk and on all entries."
          />
          <CandidatesList candidates={candidates} houses={houses} />
        </section>

        <section aria-labelledby="results-title" id="results" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            id="results-title"
            eyebrow="Results"
            title="Winners so far"
            description="Results are published as soon as judges finalize the scores for each event."
          />
          <ResultsSection results={results} />
        </section>

        <section aria-labelledby="points-title" id="points" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading id="points-title" eyebrow="Point table" title="House championship standings" />
          <PointTable standings={standings} />
        </section>

        <section aria-labelledby="scorers-title" id="scorers" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            id="scorers-title"
            eyebrow="Individual top scorers"
            title="Race for the individual championship"
            description="Ranked by total points from individual events. Group event points count only toward houses."
          />
          <TopScorers scorers={scorers} />
        </section>

        <section aria-labelledby="gallery-title" id="gallery" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading id="gallery-title" eyebrow="Photo gallery" title="Moments from the stage" />
          <Gallery />
        </section>

        <section aria-labelledby="contact-title" id="contact" className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Questions? Reach the fest committee"
          />
          <ContactSection />
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>Al Aura 2K26 · Greenwood International School</p>
          <p>Organised by the Cultural Committee</p>
        </div>
      </footer>
    </>
  )
}
