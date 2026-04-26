/* oxlint-disable sort-keys */

export type ComponentDocCategory =
  | "Foundations"
  | "Shell"
  | "Profile and social"
  | "Projects"
  | "Experience"
  | "Actions and status"
  | "Navigation and disclosure"
  | "Forms"
  | "Overlays and menus"
  | "Data display";

export interface ComponentDocSeed {
  readonly name: string;
  readonly slug: string;
  readonly category: ComponentDocCategory;
}

export interface ComponentDocContent {
  readonly summary: string;
  readonly exampleCode: string;
  readonly notes: readonly string[];
}

export interface ComponentDocEntry
  extends ComponentDocSeed, ComponentDocContent {
  readonly exampleLanguage: "astro";
}

export interface LlmHelperDocSeed {
  readonly name: "createMarkdownAlternateLink";
  readonly slug: "llm-helper";
}

export const componentDocCatalog = [
  { category: "Foundations", name: "Layout", slug: "layout" },
  { category: "Foundations", name: "PageShell", slug: "page-shell" },
  { category: "Foundations", name: "Hero", slug: "hero" },
  { category: "Foundations", name: "Section", slug: "section" },
  { category: "Foundations", name: "Panel", slug: "panel" },
  { category: "Foundations", name: "DataTable", slug: "data-table" },
  { category: "Foundations", name: "MetaList", slug: "meta-list" },
  { category: "Foundations", name: "CodeSnippet", slug: "code-snippet" },
  { category: "Foundations", name: "Stack", slug: "stack" },
  { category: "Shell", name: "FontAssets", slug: "font-assets" },
  { category: "Shell", name: "JsonLd", slug: "json-ld" },
  { category: "Shell", name: "SkipLink", slug: "skip-link" },
  { category: "Shell", name: "SeoMeta", slug: "seo-meta" },
  { category: "Shell", name: "ServiceWorker", slug: "service-worker" },
  { category: "Profile and social", name: "ProfileHero", slug: "profile-hero" },
  { category: "Profile and social", name: "SocialLinks", slug: "social-links" },
  {
    category: "Profile and social",
    name: "DecoratedHeading",
    slug: "decorated-heading",
  },
  { category: "Projects", name: "ProjectCard", slug: "project-card" },
  { category: "Projects", name: "ProjectGrid", slug: "project-grid" },
  { category: "Experience", name: "ExperienceCard", slug: "experience-card" },
  { category: "Experience", name: "ExperienceList", slug: "experience-list" },
  { category: "Experience", name: "SkillIcon", slug: "skill-icon" },
  { category: "Experience", name: "SkillIconList", slug: "skill-icon-list" },
  {
    category: "Experience",
    name: "AgentDiscoveryHint",
    slug: "agent-discovery-hint",
  },
  { category: "Actions and status", name: "Button", slug: "button" },
  { category: "Actions and status", name: "IconButton", slug: "icon-button" },
  { category: "Actions and status", name: "LinkButton", slug: "link-button" },
  { category: "Actions and status", name: "Badge", slug: "badge" },
  { category: "Actions and status", name: "Alert", slug: "alert" },
  { category: "Actions and status", name: "Callout", slug: "callout" },
  { category: "Actions and status", name: "EmptyState", slug: "empty-state" },
  { category: "Actions and status", name: "Skeleton", slug: "skeleton" },
  {
    category: "Navigation and disclosure",
    name: "Breadcrumbs",
    slug: "breadcrumbs",
  },
  { category: "Navigation and disclosure", name: "Tabs", slug: "tabs" },
  {
    category: "Navigation and disclosure",
    name: "Accordion",
    slug: "accordion",
  },
  {
    category: "Navigation and disclosure",
    name: "Pagination",
    slug: "pagination",
  },
  {
    category: "Navigation and disclosure",
    name: "TableOfContents",
    slug: "table-of-contents",
  },
  { category: "Forms", name: "Field", slug: "field" },
  { category: "Forms", name: "Input", slug: "input" },
  { category: "Forms", name: "Textarea", slug: "textarea" },
  { category: "Forms", name: "Checkbox", slug: "checkbox" },
  { category: "Forms", name: "RadioGroup", slug: "radio-group" },
  { category: "Forms", name: "Select", slug: "select" },
  { category: "Forms", name: "Switch", slug: "switch" },
  { category: "Forms", name: "FormHint", slug: "form-hint" },
  { category: "Forms", name: "FormError", slug: "form-error" },
  { category: "Overlays and menus", name: "Dialog", slug: "dialog" },
  { category: "Overlays and menus", name: "Drawer", slug: "drawer" },
  { category: "Overlays and menus", name: "Popover", slug: "popover" },
  {
    category: "Overlays and menus",
    name: "DropdownMenu",
    slug: "dropdown-menu",
  },
  { category: "Overlays and menus", name: "Tooltip", slug: "tooltip" },
  { category: "Data display", name: "StatCard", slug: "stat-card" },
  {
    category: "Data display",
    name: "DescriptionList",
    slug: "description-list",
  },
  { category: "Data display", name: "FilterBar", slug: "filter-bar" },
  { category: "Data display", name: "SortIndicator", slug: "sort-indicator" },
] as const satisfies readonly ComponentDocSeed[];

export const llmHelperDoc = {
  name: "createMarkdownAlternateLink",
  slug: "llm-helper",
} as const satisfies LlmHelperDocSeed;

type ComponentName = (typeof componentDocCatalog)[number]["name"];

const componentContentByName = {
  Accordion: {
    exampleCode: `<Accordion items={faqItems} />`,
    notes: [
      "Use Accordion when only one section may matter at a time.",
      "Keep heading text meaningful when collapsed.",
    ],
    summary:
      "Render expandable stacked sections for FAQs, notes, and progressive disclosure content.",
  },
  AgentDiscoveryHint: {
    exampleCode: `<AgentDiscoveryHint hint={["Prefer the markdown alternate."]} />`,
    notes: [
      "Use it for machine-readable discovery only.",
      "Do not depend on it for visible user instructions.",
    ],
    summary:
      "Embed hidden machine-readable discovery hints in the page without changing visible layout content.",
  },
  Alert: {
    exampleCode: `<div class="flex flex-col gap-3">
  <Alert title="Heads up" description="Tokens ship separately." variant="info" />
  <Alert title="Published" description="Release tag moved to latest." variant="success" />
  <Alert title="Check config" description="Missing package token in local shell." variant="warning" />
  <Alert title="Deploy failed" description="Production build needs attention before retry." variant="danger" />
</div>`,
    notes: [
      "Use Alert for stateful feedback that needs emphasis.",
      "Keep titles short and descriptions direct.",
    ],
    summary:
      "Render a structured status message for info, success, warning, or danger states.",
  },
  Badge: {
    exampleCode: `<div class="flex flex-wrap gap-3">
  <Badge>Default</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="danger">Danger</Badge>
  <Badge variant="info">Info</Badge>
</div>`,
    notes: [
      "Use short labels that fit in one line.",
      "Avoid using badges as primary navigation.",
    ],
    summary:
      "Display compact status or taxonomy labels using the shared badge surface and typography.",
  },
  Breadcrumbs: {
    exampleCode: `<Breadcrumbs items={breadcrumbItems} />`,
    notes: [
      "Use Breadcrumbs for hierarchy rather than tags or filters.",
      "Keep labels literal and concise.",
    ],
    summary:
      "Render hierarchical navigation links for nested docs and application sections.",
  },
  Button: {
    exampleCode: `<Button variant="primary" selected>Ship it</Button>`,
    notes: [
      "Use Button for actions, not navigation.",
      "Switch to LinkButton when the target is another route.",
      "Use selected when a button represents the active pressed state.",
    ],
    summary:
      "Render the primary shared action control for the highest-priority calls to action.",
  },
  Callout: {
    exampleCode: `<Callout title="Consumer-owned">Route metadata stays local.</Callout>`,
    notes: [
      "Use Callout for documentation guidance and side notes.",
      "Prefer Alert when the message represents a state change or warning.",
    ],
    summary:
      "Highlight supporting guidance or caveats without the stronger semantics of a stateful alert.",
  },
  Checkbox: {
    exampleCode: `<Checkbox id="updates" label="Email me release updates" />`,
    notes: [
      "Use Checkbox for independent boolean values.",
      "Prefer Switch for immediate on/off settings.",
    ],
    summary:
      "Render the shared boolean checkbox control with package-owned checked and focus treatment.",
  },
  CodeSnippet: {
    exampleCode: `<CodeSnippet variant="block" language="ts" code={snippet} />`,
    notes: [
      "Use block mode for commands and copyable examples.",
      "Keep snippets focused on the main happy path.",
    ],
    summary:
      "Render inline or block code examples with the shared Snurble code surface and spacing treatment.",
  },
  DataTable: {
    exampleCode: `<DataTable ariaLabel="Release matrix">
  <tr slot="head">
    <th scope="col">Surface</th>
    <th scope="col">Status</th>
  </tr>
  <tr>
    <td data-label="Surface">Docs app</td>
    <td data-label="Status">Ready</td>
  </tr>
</DataTable>`,
    notes: [
      "Pass exactly one of labelledBy or ariaLabel so the table has an accessible name.",
      "Pair with SortIndicator when headers need sort affordance.",
    ],
    summary:
      "Render shared table styling for structured row-and-column data while leaving sorting and shaping to the page.",
  },
  DecoratedHeading: {
    exampleCode: `<DecoratedHeading text="Featured projects" />`,
    notes: [
      "Use it when the heading should carry visual personality.",
      "Prefer plain headings in dense reference sections.",
    ],
    summary:
      "Display the shared decorative heading treatment for spotlight content and branded sections.",
  },
  DescriptionList: {
    exampleCode: `<DescriptionList items={releaseMetadata} />`,
    notes: [
      "Use DescriptionList for paired reference facts.",
      "Keep terms short and values easy to scan.",
    ],
    summary:
      "Render structured term-definition pairs for compact reference data and metadata summaries.",
  },
  Dialog: {
    exampleCode: `<Dialog open title="Delete release" closeOnBackdropClick>
  <p>This cannot be undone.</p>
</Dialog>`,
    notes: [
      "Use Dialog for blocking confirmations or focused tasks.",
      "Keep open-state wiring and trigger behavior in the page.",
    ],
    summary:
      "Render the shared modal dialog overlay pattern with focus and dismissal behavior.",
  },
  Drawer: {
    exampleCode: `<Drawer open title="Filters" position="right">
  <p>Refine the results.</p>
</Drawer>`,
    notes: [
      "Use Drawer when content is supporting rather than blocking.",
      "Keep trigger state and orchestration consumer-owned.",
    ],
    summary:
      "Render a slide-in side panel for contextual controls, filters, or navigation.",
  },
  DropdownMenu: {
    exampleCode: `<DropdownMenu open items={menuItems} />`,
    notes: [
      "Use DropdownMenu for secondary actions, not primary tasks.",
      "Keep primary actions visible elsewhere on the page.",
    ],
    summary:
      "Render an action menu for compact secondary actions tied to a single trigger.",
  },
  EmptyState: {
    exampleCode: `<EmptyState title="No releases yet" description="Publish a prerelease to get started." />`,
    notes: [
      "Use EmptyState when a collection has nothing to show.",
      "Pair it with a clear next action when possible.",
    ],
    summary:
      "Render the shared no-results or no-content state with a structured title and follow-up guidance.",
  },
  ExperienceCard: {
    exampleCode: `<ExperienceCard logo="/logos/example-corp.svg" logoAlt="Example Corp logo" title="Senior Engineer" company="Example Corp" description={trustedDescriptionHtml} start="2023-01" end="present" />`,
    notes: [
      "Pass only trusted HTML to description; prepare and validate it outside the card.",
      "Use concise role and company labels.",
      "Keep long narrative or markdown outside the card.",
    ],
    summary:
      "Render a single experience or role entry in the shared timeline-friendly card style.",
  },
  ExperienceList: {
    exampleCode: `<ExperienceList>
  <li>
    <ExperienceCard ... />
  </li>
</ExperienceList>`,
    notes: [
      "Compose ExperienceList with li children that contain ExperienceCard.",
      "Keep sorting and grouping logic page-owned.",
    ],
    summary:
      "Group multiple experience entries into the shared stacked timeline/list presentation.",
  },
  Field: {
    exampleCode: `<Field label="Email" htmlFor="email">
  <Input id="email" type="email" placeholder="matt@example.com" />
</Field>`,
    notes: [
      "Compose Field with the actual input control and matching htmlFor/id values.",
      "Keep validation orchestration in the consumer.",
    ],
    summary:
      "Provide the wrapper contract for labels, hints, errors, and child controls in shared forms.",
  },
  FilterBar: {
    exampleCode: `<FilterBar>
  <Button variant="secondary" size="sm">Stable only</Button>
</FilterBar>`,
    notes: [
      "Use FilterBar as a layout wrapper for extra filtering controls alongside its built-in search field.",
      "Keep actual filter logic and state in the page.",
    ],
    summary:
      "Render the shared search-and-filter container for collection pages and dense catalog views.",
  },
  FontAssets: {
    exampleCode: `<Fragment slot="head"><FontAssets /></Fragment>`,
    notes: [
      "Render it once per document.",
      "Keep font-origin and privacy decisions consumer-owned.",
    ],
    summary:
      "Inject the shared font-face declarations used by the Snurble typography contract.",
  },
  FormError: {
    exampleCode: `<FormError id="email-error" text="Enter a valid email address." />`,
    notes: [
      "Render FormError only when validation fails.",
      "Pass the message copy with the required text prop.",
      "Reference it with aria-describedby and aria-invalid.",
    ],
    summary:
      "Render validation feedback with the shared error color and spacing treatment.",
  },
  FormHint: {
    exampleCode: `<FormHint id="email-hint" text="We only use this for release updates." />`,
    notes: [
      "Keep hint text short and instructional.",
      "Pass the guidance copy with the required text prop.",
      "Reference it with aria-describedby on the field.",
    ],
    summary:
      "Render supporting field guidance that explains acceptable values or expected formatting.",
  },
  Hero: {
    exampleCode: `<Hero title="Button" lede="Primary shared action control." />`,
    notes: [
      "Use Hero for top-of-page intros, not repeated in-page headings.",
      "Keep ledes short enough to scan quickly.",
    ],
    summary:
      "Render the page-level introduction block for landing pages, guides, and component docs.",
  },
  IconButton: {
    exampleCode: `<IconButton ariaLabel="Open menu" selected><span aria-hidden="true">☰</span></IconButton>`,
    notes: [
      "Always pass ariaLabel for accessible naming.",
      "Reserve icon-only controls for compact secondary actions.",
      "Use selected for toggle-style icon controls so the pressed state is announced.",
    ],
    summary:
      "Render a compact icon-only action with shared focus, hover, and press treatment.",
  },
  Input: {
    exampleCode: `<Input id="email" type="email" placeholder="matt@example.com" />`,
    notes: [
      "Use Field for labels, hints, and errors around the control.",
      "Always provide the required id so labels and described-by relationships can target the control.",
    ],
    summary:
      "Render the shared single-line text input surface and typography treatment.",
  },
  JsonLd: {
    exampleCode: `<JsonLd jsonld={profileSchema} />`,
    notes: [
      "Only publish intentional data that should be public.",
      "Non-serializable input should fail fast rather than silently degrade.",
    ],
    summary:
      "Publish structured data in the document head from a JSON-serializable value.",
  },
  Layout: {
    exampleCode: `<Layout title="Button docs"><main>...</main></Layout>`,
    notes: [
      "Use the head slot for route-owned metadata.",
      "Keep favicons, theme-color, and app-specific head tags consumer-owned.",
    ],
    summary:
      "Own the document shell and head slot while leaving page-specific metadata and route policies in the consumer.",
  },
  LinkButton: {
    exampleCode: `<LinkButton href="/components/button" selected>Button docs</LinkButton>`,
    notes: [
      "Use LinkButton for navigation rather than form submission.",
      "Set external when linking to a new tab target.",
      "Use selected for the current destination so link state stays visible and semantic.",
    ],
    summary:
      "Render navigation styled like a button without collapsing link semantics into a click handler.",
  },
  MetaList: {
    exampleCode: `<MetaList>
  <dt>Status</dt>
  <dd>Stable</dd>
</MetaList>`,
    notes: [
      "Use MetaList for dense supporting facts rather than long prose.",
      "Prefer short single-line values.",
    ],
    summary:
      "Display compact metadata rows for dates, labels, and secondary facts that should scan quickly.",
  },
  PageShell: {
    exampleCode: `<PageShell class="flex flex-col gap-8"><slot /></PageShell>`,
    notes: [
      "Use it as the main content container for full pages.",
      "Let local pages decide section order and surrounding landmarks.",
    ],
    summary:
      "Provide the shared page-width and vertical rhythm wrapper used by docs pages and app-level content surfaces.",
  },
  Pagination: {
    exampleCode: `<Pagination currentPage={2} totalPages={8} />`,
    notes: [
      "Use onPageChange when you need controlled pagination behavior.",
      "Keep currentPage and totalPages page-owned.",
    ],
    summary:
      "Render previous/next and page-link navigation for paginated collections.",
  },
  Panel: {
    exampleCode: `<Panel variant="bordered"><p>Panel content</p></Panel>`,
    notes: [
      "Use bordered panels for reference content and elevated panels for featured content.",
      "Keep structural page layout outside the panel itself.",
    ],
    summary:
      "Provide the shared bordered or elevated surface wrapper for examples, cards, and supporting content.",
  },
  Popover: {
    exampleCode: `---
const popoverPosition = "right";
const showPopoverTitle = true;
const closePopoverOnOutsideClick = false;
---

<Popover
  open
  position={popoverPosition}
  title={showPopoverTitle ? "Details" : undefined}
  closeOnOutsideClick={closePopoverOnOutsideClick}
>
  <p>Popover content stays short and contextual.</p>
</Popover>`,
    notes: [
      "Use Popover for small supporting content blocks.",
      "Add a title when content needs a visible label and dismiss button.",
      "Only disable outside-click dismissal when another obvious close path exists.",
    ],
    summary:
      "Render a lightweight anchored overlay for brief contextual information.",
  },
  ProfileHero: {
    exampleCode: `<ProfileHero name="Matt Riley" subtitle="Senior Software Engineer" avatarSrc={avatar} avatarAlt="Matt Riley" />`,
    notes: [
      "Keep longer biography copy outside the primitive.",
      "Use a meaningful avatarAlt string rather than decorative alt text.",
    ],
    summary:
      "Render the shared profile banner pattern for name, subtitle, and avatar presentation.",
  },
  ProjectCard: {
    exampleCode: `<ProjectCard name="Snurble" description="Shared Astro design tokens and UI primitives." url="https://github.com/matt-riley/snurble" />`,
    notes: [
      "Use short project descriptions that scan quickly.",
      "Keep collection sorting and filtering page-owned.",
    ],
    summary:
      "Render a single project summary card while keeping selection, ranking, and data fetch logic outside the component.",
  },
  ProjectGrid: {
    exampleCode: `<ProjectGrid>
  <li>
    <ProjectCard ... />
  </li>
</ProjectGrid>`,
    notes: [
      "Compose ProjectGrid with li children that contain ProjectCard.",
      "Let the page own surrounding headings and empty states.",
    ],
    summary:
      "Lay out project cards in the shared responsive grid used by portfolio-style pages.",
  },
  RadioGroup: {
    exampleCode: `<RadioGroup name="channel" options={channelOptions} />`,
    notes: [
      "Use RadioGroup when all choices should stay visible.",
      "Keep option labels and values consumer-owned.",
    ],
    summary:
      "Render a grouped single-choice input set with consistent spacing and labeling.",
  },
  Section: {
    exampleCode: `<Section title="Overview" headingId="overview-heading"><p>...</p></Section>`,
    notes: [
      "Always pass a stable headingId so other navigation can target it.",
      "Prefer multiple sections over one long undifferentiated content block.",
    ],
    summary:
      "Create titled content sections with a stable heading contract and optional decoration control.",
  },
  Select: {
    exampleCode: `<Select id="category" options={categoryOptions} placeholder="Choose a category" defaultValue="docs" />`,
    notes: [
      "Use Select for longer or denser choice lists.",
      "Prefer RadioGroup when all options should remain visible.",
    ],
    summary:
      "Render the shared select control wrapper for compact choice lists.",
  },
  SeoMeta: {
    exampleCode: `<SeoMeta slot="head" title="Docs" description="Component reference" url="https://example.com/docs" />`,
    notes: [
      "Use absolute URLs for canonical and image fields.",
      "Keep route-specific copy and canonical ownership in the consumer.",
    ],
    summary:
      "Emit Open Graph and Twitter metadata from route-owned absolute URL inputs.",
  },
  ServiceWorker: {
    exampleCode: `<ServiceWorker src="/sw.js" scope="/" />`,
    notes: [
      "Treat service worker registration as additive.",
      "Do not assume every consumer wants offline behavior.",
    ],
    summary:
      "Register a PWA service worker from the shell without changing the surrounding layout API.",
  },
  Skeleton: {
    exampleCode: `<Skeleton width="100%" height="2.5rem" />`,
    notes: [
      "Use Skeleton only while real content is pending.",
      "Match the final content shape as closely as possible.",
    ],
    summary:
      "Render a loading placeholder surface that matches the package spacing and radius contract.",
  },
  SkillIcon: {
    exampleCode: `<SkillIcon name="typescript" label="TypeScript" />`,
    notes: [
      "Pass supported icon name and accessible label for icon-only usage.",
      "Unknown names render visible fallback glyph during development.",
    ],
    summary:
      "Render single skill or technology icon with shared circular stroke treatment.",
  },
  SkillIconList: {
    exampleCode: `<SkillIconList><SkillIcon name="typescript" label="TypeScript" /></SkillIconList>`,
    notes: [
      "Compose SkillIconList with SkillIcon children.",
      "Prefer short, scan-friendly skill labels.",
    ],
    summary:
      "Arrange multiple skill icons in the shared compact layout used by profile and experience pages.",
  },
  SkipLink: {
    exampleCode: `<SkipLink href="#main-content">Skip to main content</SkipLink>`,
    notes: [
      "Use only internal hash targets.",
      "Make the destination focusable when it is not normally tabbable.",
    ],
    summary:
      "Provide a hidden-until-focus anchor that helps keyboard users jump directly to main content.",
  },
  SocialLinks: {
    exampleCode: `<SocialLinks links={links} />`,
    notes: [
      "Pass accessible labels for each link.",
      "Only pass trusted, consumer-validated URLs in each href; vet schemes and reject malformed or untrusted values before rendering SocialLinks.",
      'Use supported lowercase network keywords: "github", "spotify", "youtube", "bluesky", "twitch", "linkedin", or "x" (aliases "twitter" to "x" internally).',
      'Use the optional effect prop with "halo" (default) or "slide" to choose the hover motion style.',
      "SocialLinks renders package-owned inline SVG icons from Tabler Icons; unsupported keywords render a fallback generic link indicator.",
      "Let the consumer choose which networks to expose.",
    ],
    summary:
      "Render the package-owned social link list with semantic navigation, focus treatment, and inline SVG icons.",
  },
  SortIndicator: {
    exampleCode: `<SortIndicator label="Updated" sortOrder="desc" />`,
    notes: [
      "Pair SortIndicator with a clickable header or navigation control.",
      "Keep sorting state and behavior outside the primitive.",
    ],
    summary:
      "Render sort direction affordance for sortable table or list headers.",
  },
  Stack: {
    exampleCode: `<Stack space={4}><p>First</p><p>Second</p></Stack>`,
    notes: [
      "Use Stack to normalize spacing between siblings.",
      "Keep semantic structure in the child elements themselves.",
    ],
    summary:
      "Apply consistent vertical spacing between related elements without page-specific wrapper CSS.",
  },
  StatCard: {
    exampleCode: `<StatCard label="Published components" value="54" trend="up" trendValue="+5 this month" />`,
    notes: [
      "Use StatCard when the primary value should dominate the presentation.",
      "Keep interpretation and surrounding narrative outside the card.",
    ],
    summary:
      "Render a headline metric with optional trend or supporting context for scan-friendly data display.",
  },
  Switch: {
    exampleCode: `<Switch id="announcements" label="Enable announcements" />`,
    notes: [
      "Use Switch for settings toggles that read as on/off.",
      "Pair it with surrounding context that explains the effect.",
    ],
    summary:
      "Render the shared immediate-toggle switch control for settings-style affordances.",
  },
  TableOfContents: {
    exampleCode: `<TableOfContents items={tocItems} />`,
    notes: [
      "Use it only when the page has enough sections to justify navigation.",
      "Generate items from page-owned headings or route content.",
    ],
    summary:
      "Render a page-local heading index for long-form docs and guide pages.",
  },
  Tabs: {
    exampleCode: `<Tabs tabs={tabs} />`,
    notes: [
      "Provide stable ids for each tab/panel pair.",
      "Keep tab labels short enough to scan quickly.",
    ],
    summary:
      "Render a named-panel disclosure pattern for switching between related views or content groups.",
  },
  Textarea: {
    exampleCode: `<Textarea id="message" rows={4} placeholder="Tell us more..." />`,
    notes: [
      "Use Textarea for longer freeform input.",
      "Keep validation feedback outside the control surface.",
    ],
    summary:
      "Render the shared multiline text-entry control without taking over validation logic.",
  },
  Tooltip: {
    exampleCode: `<button type="button" aria-describedby="copy-tooltip">Copy</button>
<Tooltip id="copy-tooltip" text="Copy install command" />`,
    notes: [
      "Use Tooltip for supplemental, non-essential copy only.",
      "Never hide critical instructions in a tooltip.",
    ],
    summary:
      "Render a small hover or focus tooltip for supplemental descriptions of compact controls.",
  },
} as const satisfies Record<ComponentName, ComponentDocContent>;

export const componentDocs = componentDocCatalog.map((entry) => ({
  ...entry,
  exampleLanguage: "astro" as const,
  ...componentContentByName[entry.name],
})) satisfies readonly ComponentDocEntry[];

export const llmHelperDocDetails = {
  exampleCode: `const alternate = createMarkdownAlternateLink({ href: "/components/button.md", title: "Button markdown twin" });`,
  notes: [
    "Use absolute or app-valid markdown paths that match a real alternate route.",
    "The helper only returns link attributes; the page still owns placement in the head slot.",
  ],
  summary:
    "Build the link attributes for a markdown alternate so HTML pages can advertise text-first twins to LLM-oriented clients.",
  title: "LLM helper API",
} as const;

export const getComponentDocBySlug = (
  slug: string
): ComponentDocEntry | undefined =>
  componentDocs.find((entry) => entry.slug === slug);
