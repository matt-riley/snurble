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
