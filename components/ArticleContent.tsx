"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({
  content,
  className = "",
}: ArticleContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Convert h1 to h2 to avoid multiple h1 tags on the page
          h1: ({ children }) => (
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 mt-8 first:mt-0">
              {children}
            </h2>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-primary-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 bg-primary-100 font-semibold text-left text-primary-800 text-sm sm:text-base">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 text-neutral-700 text-sm sm:text-base">
              {children}
            </td>
          ),
          tr: ({ children }) => <tr className="even:bg-gray-50">{children}</tr>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
