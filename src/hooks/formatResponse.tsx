// import React from "react";

// interface Props {
//   text: string;
// }

// // Very small markdown-ish renderer for headings, bold, bullets, and ordered lists
// // Not a full markdown parser. Keeps UI minimal and safe.
// const FormatResponse: React.FC<Props> = ({ text }) => {
//   if (!text) return null;

//   // Normalize line endings
//   const lines = text.replace(/\r\n?/g, "\n").split("\n");

//   const elements: React.ReactNode[] = [];
//   let i = 0;

//   // Helpers: detect script per block to choose font and direction
//   type BlockAttrs = { lang?: string; fontClass: string; dir?: "rtl" | "ltr" };
//   const detectAttrs = (s: string): BlockAttrs => {
//     const hasDevanagari = /[\u0900-\u097F]/.test(s);
//     const hasArabicBlocks = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(s);
//     const hasUrduSigns = /[\u067E\u0686\u0691\u0698\u06AF\u06BA\u06BE\u06C1\u06D2]/.test(s);
//     if (hasDevanagari) return { lang: "hi", fontClass: "font-devanagari" };
//     if (hasArabicBlocks) {
//       if (hasUrduSigns) return { lang: "ur", fontClass: "font-urdu", dir: "rtl" };
//       return { lang: "ar", fontClass: "font-arabic", dir: "rtl" };
//     }
//     return { fontClass: "" };
//   };

//   const renderInline = (s: string) => {
//     // Bold: **text**
//     const parts: React.ReactNode[] = [];
//     let cursor = 0;
//     const boldRegex = /\*\*(.+?)\*\*/g;
//     let m: RegExpExecArray | null;
//     while ((m = boldRegex.exec(s))) {
//       const [full, bold] = m;
//       const start = m.index;
//       if (start > cursor) parts.push(s.slice(cursor, start));
//       parts.push(<strong key={`b-${start}`}>{bold}</strong>);
//       cursor = start + full.length;
//     }
//     if (cursor < s.length) parts.push(s.slice(cursor));
//     return parts;
//   };

//   const flushParagraph = (buffer: string[]) => {
//     if (buffer.length) {
//       // Normalize Unicode so Devanagari and Arabic diacritics combine correctly
//       const content = buffer.join(" ").normalize("NFC").trim();
//       if (content) {
//         const attrs = detectAttrs(content);
//         elements.push(
//           <p
//             key={`p-${elements.length}`}
//             className={`whitespace-pre-wrap text-gray-800 text-sm leading-relaxed ${attrs.fontClass}`}
//             {...(attrs.lang ? { lang: attrs.lang } : {})}
//             {...(attrs.dir ? { dir: attrs.dir } : {})}
//             style={{
//               wordBreak: "keep-all",
//               lineBreak: "strict",
//               fontFeatureSettings: '"liga" 1, "clig" 1, "kern" 1',
//               whiteSpace: "pre-line",
//             }}
//           >
//             {renderInline(content)}
//           </p>
//         );
//       }
//       buffer.length = 0;
//     }
//   };

//   while (i < lines.length) {
//     const line = lines[i].trim();
//     if (!line) {
//       i++;
//       continue;
//     }

//     // Headings
//     if (line.startsWith("### ")) {
//       const content = line.slice(4);
//       const attrs = detectAttrs(content);
//       elements.push(
//         <h3
//           key={`h3-${i}`}
//           className={`font-semibold text-gray-900 mb-1 ${attrs.fontClass}`}
//           {...(attrs.lang ? { lang: attrs.lang } : {})}
//           {...(attrs.dir ? { dir: attrs.dir } : {})}
//         >
//           {renderInline(content)}
//         </h3>
//       );
//       i++;
//       continue;
//     }
//     if (line.startsWith("## ")) {
//       const content = line.slice(3);
//       const attrs = detectAttrs(content);
//       elements.push(
//         <h2
//           key={`h2-${i}`}
//           className={`font-semibold text-gray-900 text-lg mb-1 ${attrs.fontClass}`}
//           {...(attrs.lang ? { lang: attrs.lang } : {})}
//           {...(attrs.dir ? { dir: attrs.dir } : {})}
//         >
//           {renderInline(content)}
//         </h2>
//       );
//       i++;
//       continue;
//     }
//     if (line.startsWith("# ")) {
//       const content = line.slice(2);
//       const attrs = detectAttrs(content);
//       elements.push(
//         <h1
//           key={`h1-${i}`}
//           className={`font-bold text-gray-900 text-xl mb-1 ${attrs.fontClass}`}
//           {...(attrs.lang ? { lang: attrs.lang } : {})}
//           {...(attrs.dir ? { dir: attrs.dir } : {})}
//         >
//           {renderInline(content)}
//         </h1>
//       );
//       i++;
//       continue;
//     }

//     // Ordered list block (consecutive lines starting with `1.`, `2.` etc.)
//     const olMatch = line.match(/^\d+\.\s+/);
//     if (olMatch) {
//       const items: React.ReactNode[] = [];
//       let j = i;
//       while (j < lines.length) {
//         const l = lines[j].trim();
//         const mm = l.match(/^(\d+)\.\s+(.*)$/);
//         if (!mm) break;
//         const content = mm[2];
//         const attrs = detectAttrs(content);
//         items.push(
//           <li
//             key={`ol-${j}`}
//             className={`text-sm text-gray-800 ${attrs.fontClass}`}
//             {...(attrs.lang ? { lang: attrs.lang } : {})}
//             {...(attrs.dir ? { dir: attrs.dir } : {})}
//           >
//             {renderInline(content)}
//           </li>
//         );
//         j++;
//       }
//       elements.push(
//         <ol key={`ol-${i}`} className="ml-5 space-y-1 list-decimal">
//           {items}
//         </ol>
//       );
//       i = j;
//       continue;
//     }

//     // Unordered list block (consecutive lines starting with `- ` or `* `)
//     const ulStart = line.startsWith("- ") || line.startsWith("* ");
//     if (ulStart) {
//       const items: React.ReactNode[] = [];
//       let j = i;
//       while (j < lines.length) {
//         const l = lines[j].trim();
//         if (!(l.startsWith("- ") || l.startsWith("* "))) break;
//         const content = l.slice(2);
//         const attrs = detectAttrs(content);
//         items.push(
//           <li
//             key={`ul-${j}`}
//             className={`text-sm text-gray-800 ${attrs.fontClass}`}
//             {...(attrs.lang ? { lang: attrs.lang } : {})}
//             {...(attrs.dir ? { dir: attrs.dir } : {})}
//           >
//             {renderInline(content)}
//           </li>
//         );
//         j++;
//       }
//       elements.push(
//         <ul key={`ul-${i}`} className="ml-5 space-y-1 list-disc">
//           {items}
//         </ul>
//       );
//       i = j;
//       continue;
//     }

//     // Paragraph accumulation: capture consecutive non-blank, non-list, non-heading lines
//     const buffer: string[] = [];
//     let j = i;
//     while (j < lines.length) {
//       const l = lines[j].trim();
//       if (
//         !l ||
//         l.startsWith("# ") ||
//         l.startsWith("## ") ||
//         l.startsWith("### ") ||
//         /^\d+\.\s+/.test(l) ||
//         l.startsWith("- ") ||
//         l.startsWith("* ")
//       )
//         break;
//       buffer.push(l);
//       j++;
//     }
//     flushParagraph(buffer);
//     i = j;
//   }

//   return <div className="space-y-2">{elements}</div>;
// };

// export default FormatResponse;


// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// export default function MarkdownRenderer({ text }: { text: string }) {
//   return (
//     <div className="prose max-w-none">
//       <ReactMarkdown remarkPlugins={[remarkGfm]}>
//         {text}
//       </ReactMarkdown>
//     </div>
//   );
// }

import React from "react";
import MarkdownIt from "markdown-it";
import mk from "markdown-it-br";

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(mk) // fix line breaks
  .enable(["table"]); // ensure table support

interface Props {
  text: string;
}

const MarkdownRenderer: React.FC<Props> = ({ text }) => {
  const renderedHtml = md.render(text || "");

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export default MarkdownRenderer;

