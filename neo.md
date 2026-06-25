# Neo Solutions - Content Inventory

- Source: [https://neosolutions.ai/](https://neosolutions.ai/)
- Crawl date: 2026-06-24
- Goal: extract the public content and implementation cues from the current site so it can be rebuilt from scratch with the same messaging.

## What the site is

Neo Solutions is a done-for-you AI agent service for businesses that generate leads through paid ads or messaging channels. The core promise is simple:

- respond instantly
- qualify leads
- follow up automatically
- book calls or appointments
- keep doing it 24/7

The homepage is a single-page landing site with a dark glassmorphism style, a sticky header, a lead form, testimonials, FAQ, and a live chat widget.

## Brand and positioning

- Brand name: Neo Solutions
- Subtitle / descriptor: Agente IA para negocios
- Main positioning: AI response systems for businesses running Instagram and Facebook ads
- Core audience: lead-generating businesses that lose opportunities because replies are slow
- Main promise: an AI agent that responds like the business, qualifies prospects, and books calls automatically

## Metadata

- `lang`: `es-419` in the rendered document
- `title`: `Neo Solutions | Agentes IA para Negocios`
- `meta description`: AI agents that respond, qualify, and convert leads 24/7
- `canonical`: `https://neosolutions.ai/`
- Open Graph and Twitter image: `https://neosolutions.ai/assets/brand/neo-icon-512.png`
- `theme-color`: `#020306`

## Site map

The public site currently exposes one index page only.

- `/` - main landing page
- `robots.txt` allows all bots and points to the sitemap
- `sitemap.xml` contains only the homepage URL

## Navigation and anchors

The page uses a one-page structure with these anchors:

- `#features`
- `#numbers`
- `#steps`
- `#goals`
- `#faq`
- `#top`

Header actions:

- language toggle: `ES` / `EN`
- mobile menu toggle
- primary CTA: book a call on Cal.com

## Primary CTAs

The site repeats a small set of calls to action:

- Book a call
- Book your evaluation call
- Submit request
- Choose a time on Cal.com

Primary booking URL:

- [https://cal.com/neosolutions](https://cal.com/neosolutions)

## Main messaging

### Hero message

The top of the page says, in essence:

- businesses running Instagram and Facebook ads need faster lead response
- leads message the business
- Neo responds, qualifies, and books the call automatically
- the system works 24/7

The hero also includes a product walkthrough placeholder, described as a short demo that will live there.

### Reasons to try

The three quick reasons shown under the hero are:

- they handle everything
- the system is trained on business information
- it responds on WhatsApp, Instagram, and Facebook

## Content by section

### 1. Benefits / Features

This section argues that Neo:

- stops lost leads caused by slow replies
- replies in seconds across every channel, 24/7
- replaces manual follow-up
- asks the right questions and moves prospects forward
- removes the need for a full-time assistant or commission-based rep
- is built end-to-end by the team, including tone, qualification questions, and handoff rules

### 2. Impact / Numbers

The comparison table presents the following claims:

- chats without reply:
  - human team: 78%
  - Neo: 0%
  - revenue impact: `+$8k-$18k/month`
- availability:
  - human team: 8 hours/day
  - Neo: 24/7
  - revenue impact: `+$6k-$14k/month`
- response time:
  - human team: `~34 min`
  - Neo: `<1 second`
  - revenue impact: `+$4k-$10k/month`
- lead conversion rate:
  - human team: `23%`
  - Neo: `48%`
  - revenue impact: `+$15k-$40k/month`

The framing line is that if you do not respond in 5 minutes, competitors may win the lead.

### 3. Process

The launch process is three steps:

- evaluation call
  - review channels, current replies, and sales process
  - identify where Neo can create the biggest impact
- build the AI agent
  - teach Neo what the business sells
  - teach tone of voice
  - define what should happen with each lead
- go live in 7 days
  - start responding, qualifying, and booking from the first message
  - let the team focus on closing

### 4. Who it is for

The site targets four main use cases:

- businesses already generating leads
  - examples: coaches, consultants, law firms, dental practices, medical clinics, e-commerce brands, local businesses, service agencies
- businesses running paid ads
  - leads from Meta, Google, WhatsApp, Instagram, Facebook, or website forms
- teams that cannot chase every message
  - Neo handles the first reply, qualification questions, reminders, and next steps
- offers that depend on booked calls
  - qualified leads go directly to the calendar

### 5. Control / Ownership

The site emphasizes that the customer stays in control:

- Neo is built from start to finish by the team
- the knowledge base is built
- the business is used to train the agent
- responses are tested and tuned
- follow-up rules are defined
- channels are connected
- qualified leads are handed to the team

The active promise here is: automate the process, but keep ownership of rules and approvals.

### 6. Testimonials

There are six testimonials. The sentiment is consistent:

- immediate responses
- less time monitoring WhatsApp
- faster qualification
- fewer leads going cold
- booked calls outside working hours
- less need to hire more staff just to answer messages
- recovered opportunities that were previously slipping through

Named testimonial authors:

- Giulio Corrales Herrera
- Marvin Solari
- Andrea Rodríguez
- Javier Pérez
- Laura Méndez
- Carlos Ramírez

Each is labeled as either Neo customer, business owner, consultant, service agency, or local business.

### 7. Risk reversal

The site reduces perceived risk with three promises:

- they handle the entire build
- they optimize until it works
- there are no long-term contracts

The operational terms shown:

- no technical skills required
- if performance targets are not met, they keep tuning at no extra cost
- launch is month to month after deployment

### 8. Lead capture form

The form is titled as a lead-flow discovery / strategy request.

Fields:

- name
- business email
- company
- phone number or WhatsApp
- monthly lead volume
- primary channel
- what should Neo automate first?

Lead volume options:

- `1-50 leads`
- `51-200 leads`
- `201-500 leads`
- `500+ leads`

Primary channel options:

- WhatsApp
- Instagram / Facebook
- Website forms
- Other channel
- Multiple channels

Form behavior:

- action: `/api/lead`
- method: `POST`
- anti-spam honeypot field named `website`
- success state points the user back to Cal.com
- failure state tells the user to email `hello@neosolutions.ai`

### 9. FAQ

FAQ topics:

- what Neo is
- what Neo can do
- which channels it supports
- whether it can book appointments automatically
- how the customer maintains control over responses

Answers in plain language:

- Neo is a done-for-you AI response system
- it can answer common questions, qualify leads, book appointments, trigger follow-ups, collect customer information, and escalate complex conversations
- it works with WhatsApp Business, Facebook Messenger, and Instagram
- it can send qualified leads straight to the calendar
- the business defines the knowledge base, tone, approved answers, audience rules, and handoff points

### 10. Footer

Footer messaging:

- AI agents that respond, qualify, and convert leads 24/7 on autopilot

Contact and social:

- email: [hello@neosolutions.ai](mailto:hello@neosolutions.ai)
- Instagram: [neosolutions.ai](https://www.instagram.com/neosolutions.ai/)

## Tech and implementation notes

### Front-end stack signals

The site appears to be a custom static landing page with vanilla HTML, CSS, and JavaScript.

Files referenced by the page:

- `styles.css?v=39`
- `script.js?v=25`

### Visual direction

The design system is dark, polished, and high-contrast:

- background: near-black with layered radial gradients
- accent color: electric blue
- surfaces: translucent glass panels
- navigation: sticky pill header
- motion: reveal-on-scroll and subtle ambient animation
- typography: `Inter`, with system fallbacks

### Theme tokens observed

- background: `#020204`
- background variant: `#05060a`
- text: `#f8fbff`
- muted text: `#8c96a8`
- primary: `#183ee0`
- primary light: `#6f86ff`
- primary mid: `#244fff`
- primary dark: `#0a1a73`

### Responsive behavior

The page includes:

- collapsed mobile navigation
- table-to-card adaptation for the stats section
- mobile footer layout changes
- mobile-friendly chat widget positioning

### Chat widget

There is an embedded Builderbot widget configured with:

- `data-builderbot-chat`
- `data-company="Neo Solutions"`
- `data-subtitle="Agente IA para negocios"`
- `data-locale="es"`
- `data-theme="dark"`
- avatar assets from the Neo brand folder

The chat widget ID is:

- `2f70a4e3-04e7-42e6-869f-58ce05b9108f`

## Asset inventory

Referenced public assets:

- `assets/brand/neo-icon-512.png`
- `assets/brand/neo-apple-touch-icon.png`
- `assets/brand/neo-wordmark-white.png`
- `assets/brand/neo-mark.png`
- `assets/customer-info-photo.webp`
- `assets/drive-sales-photo.webp`
- `assets/customer-service-photo.webp`
- `assets/audience-control-photo.webp`
- `assets/onboarding-knowledge-photo.webp`

## Rebuild brief

If you recreate this from scratch, keep these content rules:

- same core promise: instant AI lead response, qualification, follow-up, and booking
- same audience: businesses generating leads through ads and messaging channels
- same conversion flow: hero CTA to evaluation call, then lead form, then FAQ reassurance
- same trust posture: done-for-you build, no technical work for the client, month-to-month after launch
- same channels: WhatsApp, Instagram, Facebook, and website forms
- same visual language: dark, premium, blue-accented, glassy, minimal, and conversion-focused

## Notes

- The homepage is the only public route found in the sitemap.
- The HTML source is English-first, but the site ships a client-side language toggle and defaults to Spanish in the browser.
- If you want, the next useful step is to turn this inventory into a clean content model for the new site:
  - sections
  - copy blocks
  - CTA map
  - form schema
  - design tokens
