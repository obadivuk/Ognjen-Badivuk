import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/resume'
import SectionHeading from './ui/SectionHeading'
import { MagneticButton, Magnetic } from './ui/Magnetic'
import Reveal from './ui/Reveal'
import { EASE, viewport } from '../lib/motion'

/** Input with a label that floats up once the field is focused or filled. */
function Field({ id, label, type = 'text', value, onChange, error, textarea = false, rows = 5 }) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className="relative">
      <Tag
        id={id}
        name={id}
        type={textarea ? undefined : type}
        rows={textarea ? rows : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        data-cursor="text"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full resize-none rounded-xl border bg-surface/50 px-4 pb-3 pt-7 text-sm text-white outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-transparent ${
          error
            ? 'border-red-400/60'
            : 'border-sage/12 focus:border-accent/70 focus:shadow-[0_0_0_4px_rgba(78,159,61,0.12)]'
        }`}
      />

      <motion.label
        htmlFor={id}
        className="pointer-events-none absolute left-4 origin-left font-mono uppercase tracking-[0.16em]"
        animate={{
          y: floated ? 12 : 22,
          fontSize: floated ? '0.625rem' : '0.75rem',
          color: error ? '#fca5a5' : focused ? '#4E9F3D' : 'rgba(163,193,173,0.55)',
        }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {label}
      </motion.label>

      {/* Focus underline */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-4 right-4 h-px origin-left bg-accent"
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 font-mono text-[11px] text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const SOCIALS = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: <path d="M3 7l9 6 9-6M3 7v10a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    icon: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'LinkedIn',
    value: profile.linkedinLabel,
    href: profile.linkedin,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: 'Location',
    value: profile.location,
    href: 'https://maps.google.com/?q=Nis,Serbia',
    icon: (
      <>
        <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorDetail, setErrorDetail] = useState('')

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell me your name'
    if (!form.email.trim()) next.email = 'An email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That address looks off'
    if (!form.message.trim()) next.message = 'A short message goes a long way'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    setErrorDetail('')

    try {
      const res = await fetch(profile.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          // Becomes the subject line of the notification Formspree sends you.
          _subject: form.subject || `Portfolio enquiry from ${form.name}`,
          subject: form.subject,
          message: form.message,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        return
      }

      // Formspree reports validation and quota problems in the body, not just
      // the status code — surface its wording rather than a generic failure.
      const data = await res.json().catch(() => null)
      setErrorDetail(data?.errors?.map((x) => x.message).join(' ') || `Server responded ${res.status}.`)
      setStatus('error')
    } catch {
      // Offline, DNS failure, or the request was blocked before it left.
      setErrorDetail('The request never reached the server — check your connection.')
      setStatus('error')
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', subject: '', message: '' })
    setErrorDetail('')
    setStatus('idle')
  }

  /** Back to the filled-in form so a failed send can be retried as-is. */
  const retry = () => {
    setErrorDetail('')
    setStatus('idle')
  }

  return (
    <section id="contact" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title="Let's build something that doesn't break."
          subtitle="Open to backend, data engineering and platform roles — and always happy to talk pipelines."
          align="center"
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          {/* Contact rail */}
          <Reveal stagger staggerAmount={0.1} className="space-y-3">
            {SOCIALS.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                data-cursor="hover"
                variants={{
                  hidden: { opacity: 0, x: -28 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                whileHover={{ x: 6 }}
                className="group flex items-center gap-4 rounded-2xl border border-sage/10 bg-surface/50 p-4 backdrop-blur-xl transition-colors duration-500 hover:border-accent/40 hover:bg-surface/85"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accent/10 transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-[0_0_22px_-6px_rgba(78,159,61,0.9)]">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" className="h-5 w-5 stroke-accent">
                    {s.icon}
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage/45">
                    {s.label}
                  </p>
                  <p className="truncate text-sm text-white/90">{s.value}</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  className="ml-auto h-4 w-4 shrink-0 -translate-x-1 stroke-sage/30 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:stroke-accent group-hover:opacity-100"
                >
                  <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
              className="!mt-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.1] to-transparent p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  Currently available
                </p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-sage/70">
                Typically replies within a day. Timezone CET (Niš, Serbia).
              </p>
            </motion.div>
          </Reveal>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl border border-sage/10 bg-surface/45 p-7 backdrop-blur-xl sm:p-9"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    className="grid h-16 w-16 place-items-center rounded-full border border-accent/40 bg-accent/15"
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" className="h-7 w-7 stroke-accent">
                      <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">
                    Message sent
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-sage/70">
                    It's in my inbox — I'll get back to you within a day. You can also reach me
                    directly at{' '}
                    <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
                      {profile.email}
                    </a>
                    .
                  </p>
                  <button
                    onClick={reset}
                    data-cursor="hover"
                    className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-sage/50 transition-colors hover:text-accent"
                  >
                    ← Write another
                  </button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    className="grid h-16 w-16 place-items-center rounded-full border border-red-400/40 bg-red-400/10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.2" className="h-7 w-7 stroke-red-300">
                      <path d="M12 7v6M12 17v.01" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </motion.span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">
                    That didn't go through
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-sage/70">
                    {errorDetail} Your message is still here — retry, or email me directly at{' '}
                    <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
                      {profile.email}
                    </a>
                    .
                  </p>
                  <div className="mt-8 flex items-center gap-6">
                    <MagneticButton onClick={retry} variant="outline">
                      Try again
                    </MagneticButton>
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent(
                        form.subject || `Portfolio enquiry from ${form.name}`
                      )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)}`}
                      data-cursor="hover"
                      className="font-mono text-xs uppercase tracking-[0.2em] text-sage/50 transition-colors hover:text-accent"
                    >
                      Open mail app
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Your name" value={form.name} onChange={set('name')} error={errors.name} />
                    <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
                  </div>

                  <Field id="subject" label="Subject (optional)" value={form.subject} onChange={set('subject')} />

                  <Field
                    id="message"
                    label="Message"
                    value={form.message}
                    onChange={set('message')}
                    error={errors.message}
                    textarea
                    rows={6}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <p className="font-mono text-[11px] text-sage/35">
                      Or just email me directly.
                    </p>
                    <MagneticButton
                      type="submit"
                      variant="solid"
                      disabled={status === 'sending'}
                      className={status === 'sending' ? 'pointer-events-none opacity-80' : ''}
                    >
                      {status === 'sending' ? (
                        <>
                          Sending
                          <motion.span
                            className="h-3.5 w-3.5 rounded-full border-2 border-ink/30 border-t-ink"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                        </>
                      ) : (
                        <>
                          Send message
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2">
                            <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Big closing CTA */}
        <Reveal className="mt-24 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-sage/40">
            Prefer the short version?
          </p>
          {/* 5.6vw keeps the 24-character address inside a 320px screen; anywhere-wrap is the backstop */}
          <Magnetic strength={0.2} innerStrength={0.32} className="max-w-full">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="view"
              data-cursor-label="Mail"
              className="mt-5 inline-block max-w-full font-display text-[clamp(1.125rem,5.6vw,4rem)] font-extrabold leading-none tracking-tight text-gradient transition-opacity duration-300 [overflow-wrap:anywhere] hover:opacity-90"
            >
              {profile.email}
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
