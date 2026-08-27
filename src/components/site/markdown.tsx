import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
  img: ({ src = "", alt = "", title = "" }) => {
    if (!src) return null;

    return (
      <figure className="markdown-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="markdown-media__image" />
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
