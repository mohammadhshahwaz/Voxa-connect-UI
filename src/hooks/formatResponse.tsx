import React from "react";

interface Props {
  text: string;
}

// Very small markdown-ish renderer for headings, bold, bullets, and ordered lists
// Not a full markdown parser. Keeps UI minimal and safe.
const FormatResponse: React.FC<Props> = ({ text }) => {
  if (!text) return null;

  // Normalize line endings
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  const elements: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (s: string) => {
    // Bold: **text**
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let m: RegExpExecArray | null;
    while ((m = boldRegex.exec(s))) {
      const [full, bold] = m;
      const start = m.index;
      if (start > cursor) parts.push(s.slice(cursor, start));
      parts.push(<strong key={`b-${start}`}>{bold}</strong>);
      cursor = start + full.length;
    }
    if (cursor < s.length) parts.push(s.slice(cursor));
    return parts;
  };

  const flushParagraph = (buffer: string[]) => {
    if (buffer.length) {
      const content = buffer.join(" ").trim();
      if (content) elements.push(
        <p key={`p-${elements.length}`} className="whitespace-pre-wrap text-gray-800 text-sm">{renderInline(content)}</p>
      );
      buffer.length = 0;
    }
  };

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={`h3-${i}`} className="font-semibold text-gray-900 mb-1">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={`h2-${i}`} className="font-semibold text-gray-900 text-lg mb-1">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={`h1-${i}`} className="font-bold text-gray-900 text-xl mb-1">{renderInline(line.slice(2))}</h1>);
      i++; continue;
    }

    // Ordered list block (consecutive lines starting with `1.`, `2.` etc.)
    const olMatch = line.match(/^\d+\.\s+/);
    if (olMatch) {
      const items: React.ReactNode[] = [];
      let j = i;
      while (j < lines.length) {
        const l = lines[j].trim();
        const mm = l.match(/^(\d+)\.\s+(.*)$/);
        if (!mm) break;
        items.push(<li key={`ol-${j}`} className="ml-5 list-decimal">{renderInline(mm[2])}</li>);
        j++;
      }
      elements.push(<ol key={`ol-${i}`} className="list-decimal ml-5 space-y-1 text-sm text-gray-800">{items}</ol>);
      i = j; continue;
    }

    // Unordered list block (consecutive lines starting with `- ` or `* `)
    const ulStart = line.startsWith("- ") || line.startsWith("* ");
    if (ulStart) {
      const items: React.ReactNode[] = [];
      let j = i;
      while (j < lines.length) {
        const l = lines[j].trim();
        if (!(l.startsWith("- ") || l.startsWith("* "))) break;
        items.push(<li key={`ul-${j}`} className="ml-5 list-disc">{renderInline(l.slice(2))}</li>);
        j++;
      }
      elements.push(<ul key={`ul-${i}`} className="list-disc ml-5 space-y-1 text-sm text-gray-800">{items}</ul>);
      i = j; continue;
    }

    // Paragraph accumulation: capture consecutive non-blank, non-list, non-heading lines
    const buffer: string[] = [];
    let j = i;
    while (j < lines.length) {
      const l = lines[j].trim();
      if (!l || l.startsWith("# ") || l.startsWith("## ") || l.startsWith("### ") || /^\d+\.\s+/.test(l) || l.startsWith("- ") || l.startsWith("* ")) break;
      buffer.push(l);
      j++;
    }
    flushParagraph(buffer);
    i = j;
  }

  return <div className="space-y-2">{elements}</div>;
};

export default FormatResponse;

