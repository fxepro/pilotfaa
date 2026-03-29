/** Shared PilotFAA marketing homepage / subpages */

/** USD. See `docs/Pricing`. */
export const PILOTFAA_COURSES = [
  { emoji: "✈️", name: "Private Pilot", sub: "Fixed-Wing", ref: "PHAK FAA-H-8083-25C", lessons: 60, hours: "40h", color: "#1756C8", checkoutSlug: "private-pilot", priceRegular: 259, introPrice: 199 },
  { emoji: "🚁", name: "Helicopter PPL", sub: "Rotorcraft", ref: "RFH FAA-H-8083-21B", lessons: 48, hours: "32h", color: "#127A48", checkoutSlug: "helicopter-ppl", priceRegular: 259, introPrice: 199 },
  { emoji: "🛩️", name: "Instrument Rating", sub: "IFR", ref: "IFH FAA-H-8083-15B", lessons: 52, hours: "36h", color: "#C8860A", checkoutSlug: "instrument", priceRegular: 279, introPrice: 219 },
  { emoji: "🛫", name: "Commercial Pilot", sub: "Single Engine", ref: "PHAK + ACS", lessons: 40, hours: "35h", color: "#6B21A8", checkoutSlug: "commercial", priceRegular: 299, introPrice: 229 },
  { emoji: "🪂", name: "Sport Pilot", sub: "Light sport", ref: "14 CFR §61.313 · ACS", lessons: 36, hours: "20h", color: "#0D9488", checkoutSlug: "sport-pilot", priceRegular: 199, introPrice: 159 },
  {
    emoji: "📚",
    name: "All-Access Bundle",
    sub: "Every certification track",
    ref: "Private · Heli · IFR · Commercial · Sport",
    lessons: 236,
    hours: "163h+",
    color: "#0f172a",
    checkoutSlug: "all-access-bundle",
    priceRegular: 799,
    introPrice: 599,
  },
] as const;

/**
 * Used when /checkout has no `plan`, `price`, `deal`, or session `selectedPlan`.
 * `planName` must match an active backend `SubscriptionPlan.plan_name`.
 * Amounts are introductory / display; payment APIs may still use `billing_period` internally.
 */
export const PILOTFAA_DEFAULT_CHECKOUT_PLAN = {
  planName: "Plan 2",
  introPrice: 199,
  priceRegular: 259,
} as const;

/** Shown in checkout when there is no `?course=`; matches default list/intro amounts. */
export const PILOTFAA_DEFAULT_CHECKOUT_DISPLAY = {
  name: PILOTFAA_COURSES[0].name,
  sub: PILOTFAA_COURSES[0].sub,
  emoji: PILOTFAA_COURSES[0].emoji,
} as const;

export function pilotfaaCheckoutCourseDisplay(
  courseSlug: string | null
): { name: string; sub: string; emoji: string } | null {
  if (!courseSlug) return null;
  const c = PILOTFAA_COURSES.find((x) => x.checkoutSlug === courseSlug);
  return c ? { name: c.name, sub: c.sub, emoji: c.emoji } : null;
}

export function pilotfaaCheckoutIntroPrice(courseSlug: string | null): number {
  if (!courseSlug) return PILOTFAA_DEFAULT_CHECKOUT_PLAN.introPrice;
  const c = PILOTFAA_COURSES.find((x) => x.checkoutSlug === courseSlug);
  return c ? c.introPrice : PILOTFAA_DEFAULT_CHECKOUT_PLAN.introPrice;
}

export function pilotfaaCheckoutRegularPrice(courseSlug: string | null): number {
  if (!courseSlug) return PILOTFAA_DEFAULT_CHECKOUT_PLAN.priceRegular;
  const c = PILOTFAA_COURSES.find((x) => x.checkoutSlug === courseSlug);
  return c ? c.priceRegular : PILOTFAA_DEFAULT_CHECKOUT_PLAN.priceRegular;
}

export const PILOTFAA_FEATURES = [
  { icon: "🤖", title: "AI Ground Instructor", body: "Captain FAA answers every question grounded in official PHAK, FAR/AIM, and ACS sources — with citations on every response." },
  { icon: "✏️", title: "FAA-Style Quizzes", body: "Chapter quizzes and full 60-question mock exams with rationale sourced directly from the FAA handbook." },
  { icon: "📊", title: "ACS Progress Tracking", body: "Track mastery at the ACS task level — the same standard your DPE uses on checkride day." },
  { icon: "📖", title: "Integrated PHAK Reference", body: "Every lesson links directly to the source chapter and page. No guessing, no paraphrasing." },
] as const;

/** Primary site top nav (`PilotFAANav`). Footer may include extra links (e.g. Deals) via `PILOTFAA_FOOTER_LINK_GROUPS`. */
export const PILOTFAA_NAV = [
  { label: "Courses", href: "/courses" },
  { label: "Features", href: "/features" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const PILOTFAA_FOOTER_LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Features", href: "/features" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
] as const;

/** Pathname only — drops any #fragment so links never become `/#courses` or `/courses#…` in the bar */
export function pilotfaaMarketingPath(href: string): string {
  const trimmed = href.trim();
  const beforeHash = trimmed.split("#")[0] ?? "";
  if (!beforeHash) return "/";
  return beforeHash.startsWith("/") ? beforeHash : `/${beforeHash}`;
}
