// Adapted from 21st.dev "Contact Form" (kevingirelli/contact-form): header and
// contact details on one side, the form in a card on the other. Here it submits
// natively to Netlify Forms (works with JS off), so the pending / success states
// of the original are not needed: the thank-you page takes over.
import { useId } from 'react';

import { Button } from '@/components/ui/button';
import { CapabilityLink } from '@/components/ui/capability-link';
import { CopyButton } from '@/components/ui/copy-button';
import { Html } from '@/components/ui/html';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/lib/icons';
import type { Homepage, Site } from '@/lib/content';
import { flag, headline } from '@/lib/text';

export function ContactForm({ contact, site }: { contact: Homepage['contact']; site: Site }) {
  const id = useId();
  const { form } = contact;

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap">
        {/* Block inside a block: plain .panel outside, .inset glass inside (same as commitments). */}
        <div className="panel grid items-start gap-[clamp(32px,5vw,80px)] p-[clamp(24px,4.5vw,64px)] lg:grid-cols-2">
          <div className="grid min-w-0 gap-5">
            <p className="eyebrow">
              <span>{contact.eyebrow}</span>
            </p>
            <Html as="h2" id="contact-title" html={headline(contact.headline)} />
            <Html as="p" className="lead" html={flag(contact.sub)} />

            <div className="mt-3 flex flex-wrap gap-3">
              {site.bookingUrl ? (
                <Button asChild>
                  <a href={site.bookingUrl} data-event="booking_click">
                    <Icon name="calendar-event" size={22} />
                    {site.primaryCta}
                  </a>
                </Button>
              ) : null}
              <CapabilityLink site={site} className="whitespace-normal text-left max-sm:w-full" />
            </div>
            <Html as="p" className="max-w-[46ch] text-ink" html={flag(contact.friction)} />

            <ul className="mt-2 grid gap-2 border-t border-border pt-6">
              <li className="flex min-h-11 items-center gap-3 text-ink">
                <Icon name="mail" size={24} className="text-navy max-[479px]:hidden" />
                <span className="[overflow-wrap:anywhere]">{site.contactEmail}</span>
                <CopyButton value={site.contactEmail} />
              </li>
              {site.linkedinUrl ? (
                <li>
                  <a
                    href={site.linkedinUrl}
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-3 text-ink underline decoration-[rgba(21,19,74,0.3)] underline-offset-[5px] hover:decoration-navy"
                  >
                    <Icon name="brand-linkedin" size={24} className="text-navy" />
                    Actura Health on LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <form
            className="inset grid gap-[22px] p-[clamp(24px,3vw,40px)]"
            name="contact"
            method="POST"
            action="/contact/thanks/"
            data-netlify="true"
            netlify-honeypot="bot-field"
            aria-labelledby="contact-title"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className="grid gap-[22px] sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`${id}-name`}>{form.name}</Label>
                <Input id={`${id}-name`} name="name" type="text" autoComplete="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${id}-agency`}>{form.agency}</Label>
                <Input id={`${id}-agency`} name="agency" type="text" autoComplete="organization" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${id}-email`}>{form.email}</Label>
              <Input id={`${id}-email`} name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${id}-message`}>{form.message}</Label>
              <Textarea id={`${id}-message`} name="message" rows={5} required />
            </div>

            <Button type="submit" data-event="form_submit" className="justify-self-start max-sm:justify-self-stretch">
              {form.submit}
            </Button>
            {/* Privacy notice the client asked for (change list 2026-10-19). */}
            <Html as="p" className="text-sm text-muted-foreground" html={flag(form.privacy)} />
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
