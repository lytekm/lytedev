import { Children, isValidElement } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ href, children }) => {
    const external = /^https?:\/\//.test(href ?? "");
    return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
  },
  p: ({ children }) => {
    // Markdown wraps standalone images in paragraphs; figures cannot be nested in <p>.
    const hasImage = Children.toArray(children).some((child) =>
      isValidElement<{ node?: { tagName?: string } }>(child) && child.props.node?.tagName === "img",
    );
    return hasImage ? <div>{children}</div> : <p>{children}</p>;
  },
  table: ({ children }) => <div className="markdown-table" tabIndex={0} role="region" aria-label="Scrollable table"><table>{children}</table></div>,
  img: ({ src = "", alt = "", title = "" }) => {
    if (!src) return null;

    return (
      <figure className="markdown-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" className="markdown-media__image" />
        {title ? <figcaption>{title}</figcaption> : null}
      </figure>
    );
  },
  code: ({ className, children, ...props }) => {
    const isBlock = Boolean(className);

    if (!isBlock) {
      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="code-block">{children}</pre>,
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
