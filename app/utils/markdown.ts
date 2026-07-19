// Shared post-content helpers.
//
// Posts written in the old textarea admin used hand-typed markdown
// (`## heading`, `**bold**`, `- list`, `> quote`, `![alt](url)`). Posts
// written with the RichTextEditor store real HTML instead. Everything here
// treats both as valid input: `isHtmlContent` tells the two apart, and
// `markdownToHtml` is the fallback converter for legacy content.

export const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// Tag whitelist matches exactly what the RichTextEditor / markdownToHtml can
// produce. A generic `<...>` sniff would false-positive on legacy plain text
// that happens to contain bracket-like text (e.g. "<sub 5k pace>").
const HTML_TAG_RE = /<\/?(p|h[1-3]|ul|ol|li|blockquote|strong|em|a|img|br)\b[^>]*>/i;

export const isHtmlContent = (content: string) => HTML_TAG_RE.test(content ?? "");

// ── Inline markdown: images, links, bold, italic ──
const renderInline = (line: string) => {
  let html = escapeHtml(line);
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, src) =>
    /^(https?:|\/)/i.test(src) ? `<img src="${src}" alt="${alt}" />` : alt
  );
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, href) =>
    /^(https?:|mailto:|\/)/i.test(href)
      ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
      : text
  );
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  return html;
};

export const markdownToHtml = (content: string) => {
  if (!content) return "";

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    let m;

    if (!line) {
      closeList();
      continue;
    }

    if ((m = line.match(/^### (.+)$/))) {
      closeList();
      out.push(`<h3 id="${slugify(m[1])}">${renderInline(m[1])}</h3>`);
    } else if ((m = line.match(/^## (.+)$/))) {
      closeList();
      out.push(`<h2 id="${slugify(m[1])}">${renderInline(m[1])}</h2>`);
    } else if ((m = line.match(/^# (.+)$/))) {
      closeList();
      out.push(`<h1 id="${slugify(m[1])}">${renderInline(m[1])}</h1>`);
    } else if ((m = line.match(/^!\[(.*?)\]\((.*?)\)$/))) {
      closeList();
      if (/^(https?:|\/)/i.test(m[2])) {
        out.push(`<img src="${m[2]}" alt="${escapeHtml(m[1])}" />`);
      }
    } else if ((m = line.match(/^> (.+)$/))) {
      closeList();
      out.push(`<blockquote>${renderInline(m[1])}</blockquote>`);
    } else if ((m = line.match(/^-\s+(.+)$/))) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${renderInline(m[1])}</li>`);
    } else {
      closeList();
      out.push(`<p>${renderInline(line)}</p>`);
    }
  }
  closeList();

  return out.join("\n");
};

// Ensures content is HTML regardless of source format.
const toHtml = (content: string) => (isHtmlContent(content) ? content : markdownToHtml(content));

// Raw TipTap output has no id attributes, and markdownToHtml's ids may be
// stale if heading text was hand-edited after the fact. Recompute ids from
// the actual heading text in one pass, and hand back both the id-augmented
// HTML (for rendering) and the flat list (for the TOC sidebar).
export const injectHeadingIds = (content: string) => {
  const html = toHtml(content);
  const headings: { level: number; text: string; id: string }[] = [];

  const withIds = html.replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    headings.push({ level: Number(level), text, id });
    const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, "");
    return `<h${level}${cleanAttrs} id="${id}">${inner}</h${level}>`;
  });

  return { html: withIds, headings };
};

// Strips tags and decodes the handful of entities markdownToHtml/TipTap
// actually produce — good enough for excerpts/SEO description, no DOM needed.
export const stripToPlainText = (html: string) => {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getExcerptText = (content: string) => stripToPlainText(toHtml(content));
