import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";

import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";

          // If inline code or no language is specified, just render a <code> tag
          if (inline || !language) {
            return (
              <code className="bg-gray-200 rounded px-1" {...props}>
                {children}
              </code>
            );
          }

          // Otherwise, it's a code block — highlight it with Prism
          const code = String(children).replace(/\n$/, "");
          const highlighted = Prism.highlight(
            code,
            Prism.languages[language] || Prism.languages.javascript,
            language
          );

          return (
            <pre className="p-4 bg-white rounded-md overflow-auto my-4">
              <code
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
