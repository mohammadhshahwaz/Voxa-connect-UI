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

