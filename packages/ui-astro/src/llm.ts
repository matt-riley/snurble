export interface LlmPageManifest {
  readonly route: string;
  readonly markdownRoute: string;
  readonly title: string;
  readonly summary?: string;
  readonly section?: string;
  readonly hints?: readonly string[];
}

export interface MarkdownAlternateLinkAttributes {
  readonly rel: "alternate";
  readonly type: "text/markdown";
  readonly href: string;
  readonly title?: string;
}

interface CreateMarkdownAlternateLinkOptions {
  readonly href: string;
  readonly title?: string;
}

export const createMarkdownAlternateLink = ({
  href,
  title,
}: CreateMarkdownAlternateLinkOptions): MarkdownAlternateLinkAttributes => ({
  href,
  rel: "alternate",
  ...(title ? { title } : {}),
  type: "text/markdown",
});
