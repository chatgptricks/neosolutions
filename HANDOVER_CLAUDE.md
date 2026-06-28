# Handover for Claude - Neo Solutions Landing Page

Date: 2026-06-28
Project path: `/Users/tbnalfaro/Desktop/NEO WEBSITE`
Local URL: `http://127.0.0.1:4173/index.html`
Live URL: `https://chatgptricks.github.io/neosolutions/`
Current branch: `main`
Last deployed commit: `8f0e852 refine landing page sections`

## Context

This is a static landing page for Neo Solutions. The user is iterating visually and expects changes to be made directly in the repo, then validated in Chrome. The main page files are duplicated:

- `index.html`
- `neo-hero.html`

When changing markup or script/cache references, update both files unless intentionally changing only one entrypoint.

Main files:

- `css/style.css`: all layout and section styling.
- `js/launch-steps.js`: scroll reveal behavior for the "How we launch Neo in 3 steps" section.
- `js/audience-carousel.js`: Apple/iPad-style carousel behavior for the "Who should use Neo?" section.
- `js/impact-scroll.js`: bubble message behavior in the impact section.
- `js/lang.js`: language handling.

## Current Local State

There are uncommitted changes in:

- `css/style.css`
- `index.html`
- `neo-hero.html`
- `js/launch-steps.js`
- `js/audience-carousel.js`

There are untracked files:

- `assets/impact/JUNE.zip`
- `assets/impact/JUNE/`

Do not stage or delete those untracked files unless the user explicitly asks.

Local server is currently running:

- `python3 -m http.server 4173`
- PID observed: `9042`

## What Was Recently Changed

### 1. Launch Steps Section

Section selector:

- `.launch-steps`
- HTML starts around `index.html:566` and `neo-hero.html:566`
- CSS starts around `css/style.css:1887`
- JS: `js/launch-steps.js`

Original goal from user:

- The title should stay fixed while scrolling.
- Scrolling should reveal the 3 steps by phase.
- CTA should appear after the 3 steps.
- Once fully revealed, scrolling should continue the page normally.
- When scrolling up, the steps should remain open while visible.
- They should reset only after the section is completely out of viewport, similar to the bubble messages section.

Current implementation:

- Removed previous wheel hijacking / `preventDefault` logic from `js/launch-steps.js`.
- The section now uses passive scroll updates only.
- Progress is monotonic while section is visible via `dataset.maxProgress`.
- Reset happens when `rect.top >= viewportHeight`.
- Cache bust is currently `js/launch-steps.js?v=40`.

Current relevant JS:

- `allStepsVisibleProgress = 0.34`
- Step 1 threshold: `0.07`
- Step 2 threshold: `0.2`
- Step 3 threshold: `0.34`
- Condensed threshold: `0.34`
- CTA threshold: `0.46`

Current relevant CSS:

- `.launch-steps { min-height: 215svh; }`
- Mobile media query uses `min-height: 255svh`.

Validation already run:

- `node --check js/launch-steps.js`
- `git diff --check`
- Chrome/CDP validation confirmed:
  - scroll is monotonic through the launch section
  - steps reveal
  - reset happens when fully out of viewport

Important: The user still feels the overall experience is damaged, but the latest evidence suggests the launch section itself no longer traps wheel events. The next issue is the carousel interaction immediately after it.

### 2. Audience Carousel Section

Section selector:

- `.audience`
- JS: `js/audience-carousel.js`
- Cache bust is currently `js/audience-carousel.js?v=4`

Original goal from user:

- Carousel like Apple iPad page.
- Square visual cards.
- User later replaced images with MP4 files using the same content names.
- Scroll in the carousel should advance images.

Current media assets:

- `assets/audience/audience_leads.mp4`
- `assets/audience/audience_ads.mp4`
- `assets/audience/audience_team.mp4`
- `assets/audience/audience_calls.mp4`
- `assets/audience/audience_inbound.mp4`
- `assets/audience/audience_service.mp4`

Current JS behavior:

- Buttons scroll the track by one card width.
- Wheel listener is attached to `.audience__track`.
- It converts the dominant wheel delta into horizontal `scrollLeft`.
- A guard was added:
  - `isTrackReadyForWheel(track)`
  - current condition: `rect.top <= viewportHeight * 0.28 && rect.bottom >= viewportHeight * 0.45`

Current problem:

- User reports: "el scroll esta totalmente roto en el carousel".
- Latest Chrome/CDP test showed that vertical wheel scrolling reaches the carousel, then when the track is visible enough, the carousel consumes vertical wheel events and moves horizontally.
- This may be technically intentional from the prior requirement, but the user now experiences it as broken.

Painpoint:

- The carousel is hijacking normal vertical scroll once the pointer is over the track.
- The page feels stuck because vertical wheel input becomes horizontal carousel movement.
- This is especially bad right after the 3-steps section, because it makes the previous section feel like it broke the flow.

Recommended fix direction:

- Do not use vertical wheel to drive horizontal carousel by default.
- Prefer one of these:
  1. Use native horizontal scroll only: buttons, drag/trackpad horizontal delta, no vertical wheel capture.
  2. Use a dedicated pinned carousel section, but only if the user explicitly wants a scroll-jacked Apple-style reveal. This needs a separate, carefully designed scroll range and must release cleanly.
  3. Keep vertical page scroll normal and add visible carousel controls/arrows.

Most pragmatic next step:

- Remove vertical wheel hijacking from `js/audience-carousel.js`.
- Only respond to actual horizontal gestures (`Math.abs(deltaX) > Math.abs(deltaY)`).
- Keep buttons working.
- Validate that vertical scrolling passes through the carousel normally.

Suggested patch:

```js
track.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
  if (!canScrollHorizontally(track, event.deltaX)) return;

  event.preventDefault();
  track.scrollLeft += event.deltaX;
  updateButtons(section);
}, { passive: false });
```

Then update cache bust to `js/audience-carousel.js?v=5` in both HTML files.

## User Preferences and Sensitivities

- User is visually exacting and frustrated by scroll/animation behavior that feels unnatural.
- Avoid adding complex scroll hijacking unless absolutely necessary.
- Prefer stable native scroll, simple progressive reveal, and clear release points.
- The user cares about seamless section transitions and no visible container seams.
- When they ask for commit/deploy, stage only intentional files.
- Do not stage `.DS_Store`, `assets/impact/JUNE.zip`, or `assets/impact/JUNE/` unless requested.

## Current Painpoints

1. Carousel scroll feels broken.
   - Current implementation converts vertical wheel movement into horizontal carousel scrolling.
   - This makes the page feel stuck.
   - Fix this first.

2. 3-steps section has been overworked.
   - It previously had wheel interception and reverse-release logic.
   - That was removed, but user distrust remains because the experience around this area still feels bad.
   - Do not reintroduce wheel interception there.

3. Section flow between 3-steps and carousel is sensitive.
   - The carousel begins immediately after the launch section.
   - If carousel captures wheel too early, it feels like 3-steps is still broken.

4. There are duplicated HTML files.
   - Keep `index.html` and `neo-hero.html` synced.

5. Cache busting matters.
   - Browser may load old scripts unless `?v=` is changed.

## Validation Notes

Browser plugin / in-app browser was unavailable:

- Attempt returned: `Browser is not available: iab`
- Troubleshooting returned: `Packaged browser documentation directory is missing.`

Use Chrome/CDP directly or open Chrome manually.

Useful static checks:

```bash
node --check js/launch-steps.js
node --check js/audience-carousel.js
git diff --check
```

Local server:

```bash
python3 -m http.server 4173
```

Target URL:

```text
http://127.0.0.1:4173/index.html
```

## Suggested Next Work Order

1. Fix carousel wheel behavior first.
   - Remove vertical wheel hijack.
   - Keep button navigation.
   - Allow horizontal wheel/trackpad gestures only.

2. Validate the page flow:
   - Scroll from impact section into 3-steps.
   - Continue from 3-steps into carousel.
   - Confirm the page never feels trapped.
   - Confirm carousel can still be navigated with arrows.

3. If user still wants Apple-style scroll-driven carousel:
   - Ask for explicit confirmation before implementing scroll-jacking.
   - Implement it as a separate pinned section with its own release conditions.
   - Do not mix it with normal carousel track wheel handling.

4. After acceptance:
   - Commit only intended files.
   - Push `main`.
   - Push `main:gh-pages`.
   - Verify live URL.

## Deployment Flow When Requested

Only after user asks for commit/deploy:

```bash
git status --short
git add css/style.css index.html neo-hero.html js/launch-steps.js js/audience-carousel.js
git commit -m "refine launch steps and carousel scroll"
git push origin main
git push origin main:gh-pages
```

Verify GitHub Pages:

```bash
gh api repos/chatgptricks/neosolutions/pages --jq '{status:.status, html_url:.html_url, branch:.source.branch}'
curl -L https://chatgptricks.github.io/neosolutions/ | rg "style\\.css\\?v=32|launch-steps\\.js\\?v=40|audience-carousel\\.js\\?v=5"
```

Update the expected `v=` numbers if changed again.

## Important Current Cache Versions

Current local HTML references:

- `css/style.css?v=32`
- `js/launch-steps.js?v=40`
- `js/audience-carousel.js?v=4`
- `js/impact-scroll.js?v=18`

If fixing carousel next, bump:

- `js/audience-carousel.js?v=5`

## Bottom Line

The immediate blocker is not more styling. It is interaction semantics:

- 3-steps should remain passive and native-scroll-friendly.
- Carousel should not convert vertical wheel into horizontal movement unless the user explicitly accepts that scroll-jacked behavior.
- The fastest fix is to let vertical wheel pass through the carousel and use arrows/horizontal gestures for carousel navigation.
