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
  readonly props?: readonly ComponentProp[];
}

export interface ComponentProp {
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly default?: string;
  readonly required?: boolean;
}

export interface ComponentDocEntry
  extends ComponentDocSeed, ComponentDocContent {
  readonly exampleLanguage: "astro";
  readonly props?: readonly ComponentProp[];
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
  { category: "Foundations", name: "BentoGrid", slug: "bento-grid" },
  { category: "Foundations", name: "BentoItem", slug: "bento-item" },
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
  { category: "Actions and status", name: "ThemeToggle", slug: "theme-toggle" },
  { category: "Actions and status", name: "Sparkle", slug: "sparkle" },
  { category: "Actions and status", name: "Toast", slug: "toast" },
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
  {
    category: "Navigation and disclosure",
    name: "SegmentedControl",
    slug: "segmented-control",
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

const componentContentByName: Record<
  ComponentName,
  ComponentDocContent & { props?: readonly ComponentProp[] }
> = {
  Accordion: {
    exampleCode: `<Accordion items={faqItems} />`,
    notes: [
      "Use Accordion when you have a lot to say, but don't want to overwhelm your user all at once. It's like a polite conversationalist that only speaks when spoken to.",
      "Remember, only one section stays open at a time. It's the 'Highlander' of UI components—there can be only one (expanded at a time). Opening a new section dramatically slams the old one shut.",
      "Keep your summary labels clearly distinct from the hidden body copy. If everything looks the same, your users will just be clicking randomly in confusion.",
      "It's absolutely perfect for FAQs, hiding advanced settings, and storing your darkest secrets.",
    ],
    summary:
      "A stack of expandable sections perfect for progressive disclosure. Think of it as a set of magical drawers that organize your content neatly without taking up too much precious screen space.",
  },
  AgentDiscoveryHint: {
    exampleCode: `<AgentDiscoveryHint hint={["Prefer the markdown alternate."]} />`,
    notes: [
      "Use it for machine-readable discovery only. This is how you whisper sweet nothings to the robots.",
      "Do not depend on it for visible user instructions. Humans literally can't see this.",
      "Great for SEO bots, llm crawlers, and our future AI overlords.",
    ],
    summary:
      "Embed hidden machine-readable discovery hints in the page without changing visible layout content. It's an invisibility cloak for your metadata.",
  },
  Alert: {
    exampleCode: `<div class="flex flex-col gap-3">
  <Alert title="Heads up" description="Tokens ship separately." variant="info" />
  <Alert title="Published" description="Release tag moved to latest." variant="success" />
  <Alert title="Check config" description="Missing package token in local shell." variant="warning" />
  <Alert title="Deploy failed" description="Production build needs attention before retry." variant="danger" />
</div>`,
    notes: [
      "Use Alert for stateful feedback that absolutely needs emphasis. If your app is on fire, use a danger alert.",
      "Keep titles short and descriptions direct. No one wants to read a novel when their payment has just failed.",
      "Don't overuse them! If everything is an alert, nothing is an alert.",
    ],
    summary:
      "Render a structured status message for info, success, warning, or danger states. Basically, it's the UI equivalent of tapping the user on the shoulder very persistently.",
    props: [
      {
        name: "title",
        type: "string",
        description: "The title of the alert.",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "A supporting description for the alert.",
      },
      {
        name: "variant",
        type: "'info' | 'success' | 'warning' | 'danger'",
        description: "The status variant of the alert.",
        default: "'info'",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
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
      "Use short labels that fit in one line. If your badge needs a scrollbar, you're doing it wrong.",
      "Avoid using badges as primary navigation. They're meant to be cute little metadata tags, not big chunky buttons.",
      "Great for status indicators (e.g., 'New', 'Beta', 'Failed spectacularly').",
    ],
    summary:
      "Display compact status or taxonomy labels. It's like putting a colorful little sticker on your data to make it feel special.",
    props: [
      {
        name: "variant",
        type: "'default' | 'success' | 'warning' | 'danger' | 'info'",
        description: "The visual variant of the badge.",
        default: "'default'",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  BentoGrid: {
    exampleCode: `<BentoGrid columns={3} gap={4}>
  <BentoItem colSpan={2}><Panel>Featured</Panel></BentoItem>
  <BentoItem><Panel>Side</Panel></BentoItem>
  <BentoItem><Panel>Full Width</Panel></BentoItem>
</BentoGrid>`,
    notes: [
      "Use BentoGrid to create modular, card-based layouts that adapt to viewport size.",
      "Combine with BentoItem to control how individual cards span columns and rows.",
      "The grid defaults to 1 column on mobile, 2 on medium screens, and 3 on large screens.",
    ],
    summary:
      "A responsive CSS Grid container for modular bento-box layouts. Perfect for modern, information-dense dashboards and portfolios.",
    props: [
      {
        name: "columns",
        type: "number",
        description: "Default columns.",
        default: "1",
      },
      {
        name: "columnsMd",
        type: "number",
        description: "Columns on medium screens.",
        default: "2",
      },
      {
        name: "columnsLg",
        type: "number",
        description: "Columns on large screens.",
        default: "3",
      },
      {
        name: "gap",
        type: "number",
        description: "Gap between items (spacing token index).",
        default: "4",
      },
    ],
  },
  BentoItem: {
    exampleCode: `<BentoItem colSpan={2} rowSpan={2}>
  <Panel>Big Card</Panel>
</BentoItem>`,
    notes: [
      "Use colSpan and rowSpan to control the size of the item within a BentoGrid.",
      "Responsive spans (colSpanMd, colSpanLg, etc.) allow for fluid layout shifts across breakpoints.",
    ],
    summary:
      "A layout wrapper for items within a BentoGrid. Controls column and row spanning.",
    props: [
      {
        name: "colSpan",
        type: "number",
        description: "Number of columns to span.",
        default: "1",
      },
      {
        name: "rowSpan",
        type: "number",
        description: "Number of rows to span.",
        default: "1",
      },
      {
        name: "colSpanMd",
        type: "number",
        description: "Columns to span on medium screens.",
      },
      {
        name: "rowSpanMd",
        type: "number",
        description: "Rows to span on medium screens.",
      },
      {
        name: "colSpanLg",
        type: "number",
        description: "Columns to span on large screens.",
      },
      {
        name: "rowSpanLg",
        type: "number",
        description: "Rows to span on large screens.",
      },
    ],
  },
  Breadcrumbs: {
    exampleCode: `<Breadcrumbs items={breadcrumbItems} />`,
    notes: [
      "Use Breadcrumbs for hierarchy rather than tags or filters. It's a trail of digital breadcrumbs so your users don't get lost in the woods.",
      "Keep labels literal and concise. 'Home > Products > Shoes' is good. 'Home > Things we sell > Things you put on your feet to walk' is bad.",
      "Don't use them on the homepage. You can't go higher than the roof.",
    ],
    summary:
      "Render hierarchical navigation links for nested docs and application sections. Hansel and Gretel would have loved this component.",
    props: [
      {
        name: "items",
        type: "BreadcrumbItem[]",
        description: "List of breadcrumb items.",
        required: true,
      },
      {
        name: "separator",
        type: "string",
        description: "The separator between items.",
        default: "'/'",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Button: {
    exampleCode: `<Button variant="primary" selected>Ship it</Button>`,
    notes: [
      "Use Button for actions, not navigation. If clicking it changes the URL, you probably want a LinkButton.",
      "Switch to LinkButton when the target is another route.",
      "Use selected when a button represents the active pressed state. It's like leaving the button squished down.",
      "Don't make everything a primary button. If everything screams for attention, the user just gets a headache.",
    ],
    summary:
      "Render the primary shared action control for the highest-priority calls to action. The absolute workhorse of any UI.",
    props: [
      {
        name: "variant",
        type: "'primary' | 'secondary' | 'danger'",
        description: "The visual style of the button.",
        default: "'primary'",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        description: "The size of the button.",
        default: "'md'",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the button is disabled.",
        default: "false",
      },
      {
        name: "selected",
        type: "boolean",
        description: "Whether the button is in a selected/pressed state.",
        default: "false",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Callout: {
    exampleCode: `<Callout title="Consumer-owned">Route metadata stays local.</Callout>`,
    notes: [
      "Use Callout for documentation guidance and side notes. It's a friendly nudge in the right direction.",
      "Prefer Alert when the message represents a state change or warning.",
      "Great for 'Pro tips' and 'Did you know?' sections.",
    ],
    summary:
      "Highlight supporting guidance or caveats without the stronger semantics of a stateful alert. It's the 'by the way' of UI components.",
  },
  Checkbox: {
    exampleCode: `<Checkbox id="updates" label="Email me release updates" />`,
    notes: [
      "Use Checkbox for independent boolean values. Good for 'I agree to sell my soul' terms and conditions.",
      "Prefer Switch for immediate on/off settings that take effect right away.",
      "Always provide a clear label. A standalone checkbox is just a mysterious box waiting to ruin someone's day.",
    ],
    summary:
      "Render the shared boolean checkbox control. The classic, undeniable way to say 'yes, please' or 'absolutely not'.",
  },
  CodeSnippet: {
    exampleCode: `<CodeSnippet variant="block" language="ts" code={snippet} />`,
    notes: [
      "Use block mode for commands and copyable examples. Because let's face it, we all just copy-paste from documentation anyway.",
      "Keep snippets focused on the main happy path. Don't include 50 lines of boilerplate if you don't have to.",
      "Make sure the language prop matches the code, or the syntax highlighting will look like a modern art masterpiece (and not in a good way).",
    ],
    summary:
      "Render inline or block code examples with beautiful syntax highlighting. Perfect for showing off your elegant, bug-free (hopefully) code.",
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
      "Pass exactly one of labelledBy or ariaLabel so the table has an accessible name. Screen readers need love too.",
      "Pair with SortIndicator when headers need sort affordance.",
      "Don't put a whole app inside a table cell. It's not 1999.",
    ],
    summary:
      "Render shared table styling for structured row-and-column data. Because sometimes you just need a really good looking spreadsheet.",
  },
  DecoratedHeading: {
    exampleCode: `<DecoratedHeading text="Featured projects" />`,
    notes: [
      "Use it when the heading should carry visual personality. It's a heading, but wearing a tuxedo.",
      "Prefer plain headings in dense reference sections. You don't want a tuxedo at a casual beach party.",
    ],
    summary:
      "Display the shared decorative heading treatment for spotlight content and branded sections. When regular text just isn't fancy enough.",
  },
  DescriptionList: {
    exampleCode: `<DescriptionList items={releaseMetadata} />`,
    notes: [
      "Use DescriptionList for paired reference facts. 'Key' meets 'Value'. It's a match made in heaven.",
      "Keep terms short and values easy to scan.",
      "Don't use it for long essays. That's what paragraphs are for.",
    ],
    summary:
      "Render structured term-definition pairs for compact reference data. Perfect for displaying metadata like it's a sleek dossier.",
  },
  Dialog: {
    exampleCode: `<Dialog open title="Delete release" closeOnBackdropClick>
  <p>This cannot be undone.</p>
</Dialog>`,
    notes: [
      "Use Dialog for blocking confirmations or focused tasks. It's the UI equivalent of 'Hold up, are you sure?'",
      "Keep open-state wiring and trigger behavior in the page. We just handle the pretty box, you handle the state.",
      "Always provide a way to close it. Nobody likes a hostage situation.",
    ],
    summary:
      "Render the shared modal dialog overlay pattern. Takes over the screen to command your user's undivided attention.",
  },
  Drawer: {
    exampleCode: `<Drawer open title="Filters" position="right">
  <p>Refine the results.</p>
</Drawer>`,
    notes: [
      "Use Drawer when content is supporting rather than blocking. It slides in politely like a butler offering hors d'oeuvres.",
      "Keep trigger state and orchestration consumer-owned.",
      "Great for filters, navigation menus, and auxiliary tools.",
    ],
    summary:
      "Render a slide-in side panel for contextual controls. A smooth operator that enters stage left (or right, or top, or bottom).",
  },
  DropdownMenu: {
    exampleCode: `<DropdownMenu open items={menuItems} />`,
    notes: [
      "Use DropdownMenu for secondary actions, not primary tasks. It's the junk drawer of UI actions.",
      "Keep primary actions visible elsewhere on the page. Don't hide the 'Save' button in a dropdown.",
      "Arrow keys, Home, and End navigation are built in once the menu is open.",
    ],
    summary:
      "Render an action menu for compact secondary actions. A neat little list of things you can do, hidden behind a button.",
    props: [
      { name: "id", type: "string", description: "Unique ID for the menu." },
      {
        name: "open",
        type: "boolean",
        description: "Whether the menu is open.",
        default: "false",
      },
      {
        name: "items",
        type: "MenuItem[]",
        description: "List of menu items.",
        required: true,
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  EmptyState: {
    exampleCode: `<EmptyState title="No releases yet" description="Publish a prerelease to get started." />`,
    notes: [
      "Use EmptyState when a collection has nothing to show. Because a blank white screen is terrifying.",
      "Pair it with a clear next action when possible. Tell the user what to do to make the empty state go away.",
      "Keep the tone encouraging. 'You have no friends' is sad. 'Add some friends to get started!' is better.",
    ],
    summary:
      "Render the shared no-results state. The friendly ghost town of your application.",
  },
  ExperienceCard: {
    exampleCode: `<ExperienceCard logo="/logos/example-corp.svg" logoAlt="Example Corp logo" title="Senior Engineer" company="Example Corp" description={trustedDescriptionHtml} start="2023-01" end="present">
  <SkillIcon slot="skills" name="typescript" label="TypeScript" />
  <SkillIcon slot="skills" name="astro" label="Astro" />
</ExperienceCard>`,
    notes: [
      "Pass only trusted HTML to description. We don't want any XSS attacks in our resumes.",
      "Use concise role and company labels.",
      "Keep long narrative or markdown outside the card. Save the life story for the interview.",
    ],
    summary:
      "Render a single experience or role entry. The perfect way to humblebrag about your past jobs.",
  },
  ExperienceList: {
    exampleCode: `<ExperienceList>
  <li>
    <ExperienceCard ... />
  </li>
</ExperienceList>`,
    notes: [
      "Compose ExperienceList with li children that contain ExperienceCard.",
      "Keep sorting and grouping logic page-owned. We just make it look like a fancy timeline.",
      "Order it reverse-chronologically unless you're a time traveler.",
    ],
    summary:
      "Group multiple experience entries into a stacked timeline. Your career history, elegantly formatted.",
  },
  Field: {
    exampleCode: `<Field label="Email" htmlFor="email">
  <Input id="email" type="email" placeholder="matt@example.com" />
</Field>`,
    notes: [
      "Compose Field with the actual input control and matching htmlFor/id values. They must hold hands.",
      "Keep validation orchestration in the consumer.",
      "This provides the label, the hint, and the error wrapper. It's the protective parent of form inputs.",
    ],
    summary:
      "Provide the wrapper contract for labels, hints, and errors. Because every input deserves good context.",
  },
  FilterBar: {
    exampleCode: `<FilterBar>
  <Button variant="secondary" size="sm">Stable only</Button>
</FilterBar>`,
    notes: [
      "Use FilterBar as a layout wrapper for extra filtering controls.",
      "Keep actual filter logic and state in the page. We just provide the stylish bar.",
      "Great for search inputs combined with a few toggle buttons.",
    ],
    summary:
      "Render the shared search-and-filter container. The control center for finding exactly what you need.",
    props: [
      {
        name: "placeholder",
        type: "string",
        description: "Search input placeholder.",
        default: "'Search or filter...'",
      },
      {
        name: "variant",
        type: "'default' | 'compact'",
        description: "The visual style of the filter bar.",
        default: "'default'",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  FontAssets: {
    exampleCode: `<Fragment slot="head"><FontAssets /></Fragment>`,
    notes: [
      "Render it once per document. Loading it 50 times will not make your text 50 times prettier.",
      "Keep font-origin and privacy decisions consumer-owned.",
    ],
    summary:
      "Inject the shared font-face declarations. The invisible magic that makes our typography look so darn good.",
  },
  FormError: {
    exampleCode: `<FormError id="email-error" text="Enter a valid email address." />`,
    notes: [
      "Render FormError only when validation fails. Don't yell at the user before they've even tried.",
      "Pass the message copy with the required text prop.",
      "Reference it with aria-describedby and aria-invalid. Accessibility is not optional!",
    ],
    summary:
      "Render validation feedback. The digital equivalent of red pen on a spelling test.",
  },
  FormHint: {
    exampleCode: `<FormHint id="email-hint" text="We only use this for release updates." />`,
    notes: [
      "Keep hint text short and instructional.",
      "Pass the guidance copy with the required text prop.",
      "Reference it with aria-describedby on the field. Help screen readers understand the context.",
    ],
    summary:
      "Render supporting field guidance. The helpful little whisper that prevents form validation errors.",
  },
  Hero: {
    exampleCode: `<Hero title="Button" lede="Primary shared action control." />`,
    notes: [
      "Use Hero for top-of-page intros, not repeated in-page headings. It's the star of the show, not an extra.",
      "Keep ledes short enough to scan quickly. Leave the poetry for the body text.",
    ],
    summary:
      "Render the page-level introduction block. A bold, unapologetic welcome mat for your page.",
  },
  IconButton: {
    exampleCode: `<IconButton ariaLabel="Open menu" selected><span aria-hidden="true">☰</span></IconButton>`,
    notes: [
      "Always pass ariaLabel for accessible naming. A button with no text is completely invisible to screen readers without an ariaLabel.",
      "Reserve icon-only controls for compact secondary actions.",
      "Use selected for toggle-style icon controls so the pressed state is announced.",
    ],
    summary:
      "Render a compact icon-only action. Perfect for when you want a button, but you're too lazy to write words.",
    props: [
      {
        name: "ariaLabel",
        type: "string",
        description: "Accessible label for the button.",
        required: true,
      },
      {
        name: "variant",
        type: "'primary' | 'secondary' | 'danger'",
        description: "The visual style of the button.",
        default: "'primary'",
      },
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        description: "The size of the button.",
        default: "'md'",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the button is disabled.",
        default: "false",
      },
      {
        name: "selected",
        type: "boolean",
        description: "Whether the button is in a selected/pressed state.",
        default: "false",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Input: {
    exampleCode: `<Input id="email" type="email" placeholder="matt@example.com" />`,
    notes: [
      "Use Field for labels, hints, and errors around the control. A naked input is a sad input.",
      "Always provide the required id so labels and described-by relationships can target the control.",
    ],
    summary:
      "Render the shared single-line text input surface. The bread and butter of data collection.",
  },
  JsonLd: {
    exampleCode: `<JsonLd jsonld={profileSchema} />`,
    notes: [
      "Only publish intentional data that should be public. Don't accidentally leak your database passwords here.",
      "Non-serializable input should fail fast rather than silently degrade.",
    ],
    summary:
      "Publish structured data in the document head. Food for search engines and web crawlers.",
  },
  Layout: {
    exampleCode: `<Layout title="Button docs"><main>...</main></Layout>`,
    notes: [
      "Use the head slot for route-owned metadata.",
      "Keep favicons, theme-color, and app-specific head tags consumer-owned.",
    ],
    summary:
      "Own the document shell and head slot. The sturdy foundation upon which all your pages are built.",
  },
  LinkButton: {
    exampleCode: `<LinkButton href="/components/button" selected>Button docs</LinkButton>`,
    notes: [
      "Use LinkButton for navigation rather than form submission.",
      "Set external when linking to a new tab target.",
      "Use selected for the current destination so link state stays visible and semantic. It looks like a button, but acts like a link. It's an imposter!",
    ],
    summary:
      "Render navigation styled like a button. For those times when an anchor tag just doesn't carry enough visual weight.",
  },
  MetaList: {
    exampleCode: `<MetaList>
  <dt>Status</dt>
  <dd>Stable</dd>
</MetaList>`,
    notes: [
      "Use MetaList for dense supporting facts rather than long prose.",
      "Prefer short single-line values. If you're writing paragraphs, use a different component.",
    ],
    summary:
      "Display compact metadata rows. A wonderfully neat way to present 'Key: Value' information.",
  },
  PageShell: {
    exampleCode: `<PageShell class="flex flex-col gap-8"><slot /></PageShell>`,
    notes: [
      "Use it as the main content container for full pages.",
      "Let local pages decide section order and surrounding landmarks.",
      "It keeps your content from stretching all the way to the edges of a 49-inch ultrawide monitor.",
    ],
    summary:
      "Provide the shared page-width and vertical rhythm wrapper. The invisible corset that keeps your layout looking trim and proper.",
  },
  Pagination: {
    exampleCode: `<Pagination currentPage={2} totalPages={8} />`,
    notes: [
      "Use onPageChange when you need controlled pagination behavior.",
      "Keep currentPage and totalPages page-owned.",
      "Please don't use this if you only have 2 pages. Just show them all!",
    ],
    summary:
      "Render previous/next and page-link navigation. Because sometimes your collection of cute cat photos is just too big for one page.",
    props: [
      {
        name: "currentPage",
        type: "number",
        description: "The currently active page.",
        required: true,
      },
      {
        name: "totalPages",
        type: "number",
        description: "Total number of pages.",
        required: true,
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Panel: {
    exampleCode: `<Panel variant="glass" hover><p>Panel content</p></Panel>`,
    notes: [
      "Use bordered panels for reference content, elevated panels for featured content, and glass panels when you want translucent layered chrome.",
      "Keep structural page layout outside the panel itself.",
    ],
    summary:
      "Provide the shared flat, bordered, elevated, or glass surface wrapper. A nice little box to put your things in.",
    props: [
      {
        name: "variant",
        type: "'flat' | 'bordered' | 'elevated' | 'glass'",
        description: "The visual style of the panel.",
        default: "'flat'",
      },
      {
        name: "hover",
        type: "boolean",
        description: "Whether the panel has a hover effect.",
        default: "false",
      },
      {
        name: "padding",
        type: "'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'",
        description: "Padding token index.",
        default: "5",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Popover: {
    exampleCode: `<Popover
  open
  position="right"
  title="Details"
>
  <p>Popover content stays short and contextual.</p>
</Popover>`,
    notes: [
      "Use Popover for small supporting content blocks. Don't put an entire form inside a popover.",
      "Add a title when content needs a visible label and dismiss button.",
      "Only disable outside-click dismissal when another obvious close path exists.",
    ],
    summary:
      "Render a lightweight anchored overlay. Like a tooltip that went to the gym and got buff.",
    props: [
      { name: "id", type: "string", description: "Unique ID for the popover." },
      {
        name: "open",
        type: "boolean",
        description: "Whether the popover is open.",
        default: "false",
      },
      {
        name: "position",
        type: "'top' | 'bottom' | 'left' | 'right'",
        description: "Position relative to trigger.",
        default: "'bottom'",
      },
      { name: "title", type: "string", description: "Optional title." },
      {
        name: "closeOnOutsideClick",
        type: "boolean",
        description: "Close on outside click.",
        default: "true",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  ProfileHero: {
    exampleCode: `<ProfileHero name="Matt Riley" subtitle="Senior Software Engineer" avatarSrc={avatar} avatarAlt="Matt Riley" />`,
    notes: [
      "Keep longer biography copy outside the primitive. This is just the flashy intro.",
      "Use a meaningful avatarAlt string rather than decorative alt text.",
    ],
    summary:
      "Render the shared profile banner pattern. The ultimate 'Look at me!' component for personal portfolios.",
  },
  ProjectCard: {
    exampleCode: `<ProjectCard name="Snurble" description="Shared Astro design tokens." url="https://github.com/matt-riley/snurble" />`,
    notes: [
      "Use short project descriptions that scan quickly.",
      "Keep collection sorting and filtering page-owned.",
    ],
    summary:
      "Render a single project summary card. The perfect display case for your digital trophies.",
  },
  ProjectGrid: {
    exampleCode: `<ProjectGrid>
  <li><ProjectCard ... /></li>
</ProjectGrid>`,
    notes: [
      "Compose ProjectGrid with li children that contain ProjectCard.",
      "Let the page own surrounding headings and empty states.",
    ],
    summary:
      "Lay out project cards in a responsive grid. Because standard lists are boring.",
  },
  RadioGroup: {
    exampleCode: `<RadioGroup name="channel" label="Preferred channel" options={channelOptions} />`,
    notes: [
      "Use RadioGroup when all choices should stay visible.",
      "Pass label when the group needs an explicit visible legend.",
      "If you have more than 5 options, consider using a Select instead.",
    ],
    summary:
      "Render a grouped single-choice input set. The classic multiple-choice exam format, now in UI form.",
    props: [
      {
        name: "name",
        type: "string",
        description: "Name for the radio group.",
        required: true,
      },
      { name: "label", type: "string", description: "Optional group label." },
      {
        name: "options",
        type: "RadioOption[]",
        description: "List of radio options.",
        required: true,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the group is disabled.",
        default: "false",
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Default selected value.",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Section: {
    exampleCode: `<Section title="Overview" headingId="overview-heading"><p>...</p></Section>`,
    notes: [
      "Always pass a stable headingId so other navigation can target it.",
      "Prefer multiple documentation sections over one long undifferentiated content block. Break up that wall of text!",
    ],
    summary:
      "Create titled content sections with a stable heading contract. The building blocks of a well-structured document.",
  },
  SegmentedControl: {
    exampleCode: `<SegmentedControl name="view" options={[{label: "List", value: "list"}, {label: "Grid", value: "grid"}]} defaultValue="grid" />`,
    notes: [
      "Use SegmentedControl for switching between views or modes within a single context.",
      "The background thumb slides smoothly between options with a spring animation.",
      "Perfect for compact toggles where a full Tab set is too much.",
    ],
    summary:
      "A pill-shaped selection control. Like a Radio Group, but with better posture and a satisfying slide animation.",
    props: [
      {
        name: "name",
        type: "string",
        description: "The name of the radio group.",
        required: true,
      },
      {
        name: "options",
        type: "Option[]",
        description: "The list of options.",
        required: true,
      },
      {
        name: "defaultValue",
        type: "string",
        description: "The initially selected value.",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Select: {
    exampleCode: `<Select id="category" options={categoryOptions} placeholder="Choose a category" />`,
    notes: [
      "Use Select for longer or denser choice lists.",
      "Prefer RadioGroup when all options should remain visible.",
      "Don't use it for a simple Yes/No choice. That's what Switches and Checkboxes are for.",
    ],
    summary:
      "Render the shared select control wrapper. The polite way of asking a user to pick one thing from a long list.",
  },
  SeoMeta: {
    exampleCode: `<SeoMeta slot="head" title="Docs" description="Component reference" url="https://example.com/docs" />`,
    notes: [
      "Use absolute URLs for canonical and image fields.",
      "Keep route-specific copy and canonical ownership in the consumer.",
    ],
    summary:
      "Emit Open Graph and Twitter metadata. Making sure your links look pretty when shared on social media.",
  },
  ServiceWorker: {
    exampleCode: `<ServiceWorker src="/sw.js" scope="/" />`,
    notes: [
      "Treat service worker registration as additive.",
      "Do not assume every consumer wants offline behavior.",
    ],
    summary:
      "Register a PWA service worker. The invisible magic that makes your web app work even when the wifi dies.",
  },
  Skeleton: {
    exampleCode: `<Skeleton width="100%" height="2.5rem" />`,
    notes: [
      "Use Skeleton only while real content is pending.",
      "Match the final content shape as closely as possible, so the page doesn't jump around when it loads.",
    ],
    summary:
      "Render a loading placeholder surface. The ghostly apparition of content yet to come.",
  },
  SkillIcon: {
    exampleCode: `<SkillIcon name="typescript" label="TypeScript" />`,
    notes: [
      "Pass supported icon name and accessible label for icon-only usage.",
      "Unknown names render visible fallback glyph during development.",
    ],
    summary:
      "Render single skill or technology icon. Cute little badges to show off the languages you theoretically know.",
  },
  SkillIconList: {
    exampleCode: `<SkillIconList><SkillIcon name="typescript" label="TypeScript" /></SkillIconList>`,
    notes: [
      "Compose SkillIconList with SkillIcon children.",
      "Prefer short, scan-friendly skill labels.",
    ],
    summary:
      "Arrange multiple skill icons. A concentrated blast of your technical prowess.",
  },
  SkipLink: {
    exampleCode: `<SkipLink href="#main-content">Skip to main content</SkipLink>`,
    notes: [
      "Use only internal hash targets.",
      "Make the destination focusable when it is not normally tabbable.",
      "Essential for keyboard users who don't want to tab through 50 nav links on every page load.",
    ],
    summary:
      "Provide a hidden-until-focus anchor. The secret teleportation pad for power users.",
  },
  SocialLinks: {
    exampleCode: `<SocialLinks links={links} />`,
    notes: [
      "Pass accessible labels for each link.",
      "Only pass trusted, consumer-validated URLs.",
      "Let the consumer choose which networks to expose. (No MySpace, please).",
    ],
    summary:
      "Render the package-owned social link list. A neat row of icons to prove you exist on other parts of the internet.",
  },
  SortIndicator: {
    exampleCode: `<SortIndicator label="Updated" sortOrder="desc" />`,
    notes: [
      "Pair SortIndicator with a clickable header or navigation control.",
      "Keep sorting state and behavior outside the primitive.",
    ],
    summary:
      "Render sort direction affordance. A tiny little arrow doing a very important job.",
    props: [
      {
        name: "label",
        type: "string",
        description: "Label for the sort indicator.",
        required: true,
      },
      {
        name: "sortOrder",
        type: "'asc' | 'desc' | null",
        description: "Current sort order.",
        default: "null",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Sparkle: {
    exampleCode: `<Sparkle size="md" color="var(--snurble-palette-yellow)" />`,
    notes: [
      "Use Sparkle to reward the user for a small success.",
      "The component triggers a pop animation immediately upon rendering.",
      "It is a 'fire and forget' component that fades out automatically.",
    ],
    summary:
      "A tiny, animated SVG star. A sprinkle of magic for your micro-interactions.",
    props: [
      {
        name: "size",
        type: "'sm' | 'md' | 'lg'",
        description: "The size of the sparkle.",
        default: "'md'",
      },
      {
        name: "color",
        type: "string",
        description: "The color of the sparkle.",
        default: "var(--snurble-palette-yellow)",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Toast: {
    exampleCode: `<Toast position="bottom-right" />`,
    notes: [
      "Use Toast for brief, non-blocking feedback.",
      "Trigger toasts via window.snurbleToast.show({ message: '...' }).",
      "Toasts automatically dismiss after a duration.",
    ],
    summary:
      "A non-blocking notification overlay. The polite whisper that tells you something just happened.",
    props: [
      {
        name: "position",
        type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'",
        description: "The screen position for toasts.",
        default: "'bottom-right'",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Stack: {
    exampleCode: `<Stack space={4}><p>First</p><p>Second</p></Stack>`,
    notes: [
      "Use Stack to normalize spacing between siblings. No more weird ad-hoc margin-bottom hacks!",
      "Keep semantic structure in the child elements themselves.",
    ],
    summary:
      "Apply consistent vertical spacing. The bouncer that keeps your elements at exactly the right distance from each other.",
  },
  StatCard: {
    exampleCode: `<StatCard label="Builds passing" value="24" trend="up" trendValue="+3 this week" />`,
    notes: [
      "Use StatCard when the primary value should dominate the presentation.",
      "Pass href when the metric should link to a deeper report or destination.",
    ],
    summary:
      "Render a headline metric with optional trend. Because big numbers look cool.",
    props: [
      {
        name: "label",
        type: "string",
        description: "Label for the stat.",
        required: true,
      },
      {
        name: "value",
        type: "string | number",
        description: "Primary value to display.",
        required: true,
      },
      {
        name: "trend",
        type: "'up' | 'down' | 'neutral'",
        description: "Trend direction.",
      },
      { name: "trendValue", type: "string", description: "Trend text label." },
      { name: "icon", type: "string", description: "Optional icon HTML." },
      { name: "href", type: "string", description: "Optional link URL." },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Switch: {
    exampleCode: `<Switch id="announcements" label="Enable announcements" />`,
    notes: [
      "Use Switch for settings toggles that read as on/off.",
      "Pair it with surrounding context that explains the effect. What exactly are we turning on here?",
    ],
    summary:
      "Render the shared immediate-toggle switch control. The digital equivalent of flipping a light switch.",
    props: [
      { name: "id", type: "string", description: "Unique ID.", required: true },
      {
        name: "label",
        type: "string",
        description: "Label for the switch.",
        required: true,
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Whether the switch is disabled.",
        default: "false",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Whether the switch is checked.",
        default: "false",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  TableOfContents: {
    exampleCode: `<TableOfContents items={tocItems} />`,
    notes: [
      "Use it only when the page has enough sections to justify navigation. A TOC for two headings is just silly.",
      "Generate items from page-owned headings or route content.",
    ],
    summary:
      "Render a page-local heading index. The roadmap for long-form docs.",
  },
  ThemeToggle: {
    exampleCode: `<ThemeToggle />`,
    notes: [
      "Use ThemeToggle to let users switch between light and dark modes manually.",
      "Preference is persisted to localStorage and applied via [data-theme] on the html element.",
      "Includes subtle animations for the track, thumb, and icons.",
      "The icons change color when selected (Yellow for light, Blue for dark).",
    ],
    summary:
      "A pill-shaped theme switcher with animated icons. Give your users the power to choose their own light (or lack thereof).",
    props: [
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Tabs: {
    exampleCode: `<Tabs tabs={tabs} defaultTab="overview" />`,
    notes: [
      "Provide stable ids for each tab/panel pair.",
      "Arrow keys plus Home and End navigation are wired in for keyboard users.",
      "Keep tab labels short enough to scan quickly. Don't write a sentence in a tab label.",
    ],
    summary:
      "Render a named-panel disclosure pattern. It's like having multiple pages without actually leaving the page.",
    props: [
      {
        name: "tabs",
        type: "TabItem[]",
        description: "List of tab items.",
        required: true,
      },
      {
        name: "defaultTab",
        type: "string",
        description: "ID of the default active tab.",
      },
      { name: "class", type: "string", description: "Additional CSS classes." },
    ],
  },
  Textarea: {
    exampleCode: `<Textarea id="message" rows={4} placeholder="Tell us more..." />`,
    notes: [
      "Use Textarea for longer freeform input. When a single line just isn't enough.",
      "Keep validation feedback outside the control surface.",
    ],
    summary:
      "Render the shared multiline text-entry control. The blank canvas for user feedback and epic novels.",
  },
  Tooltip: {
    exampleCode: `<Tooltip id="copy-tooltip" text="Copy install command" />`,
    notes: [
      "Use Tooltip for supplemental, non-essential copy only.",
      "Never hide critical instructions in a tooltip. If they need to read it to succeed, put it on the page!",
    ],
    summary:
      "Render a small hover or focus tooltip. A polite little whisper of extra information.",
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
