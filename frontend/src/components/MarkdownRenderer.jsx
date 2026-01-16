import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <div className="relative">
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || "text"}
                PreTag="div"
                className="rounded-md text-sm"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>

              {/* Copy button */}
              <button
                className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded"
                onClick={() =>
                  navigator.clipboard.writeText(children.toString())
                }
              >
                Copy
              </button>
            </div>
          ) : (
            <code className="bg-gray-200 px-1 rounded">{children}</code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
