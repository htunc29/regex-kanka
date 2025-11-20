"use client";

interface MatchHighlighterProps {
  text: string;
  matches: string[];
}

export default function MatchHighlighter({
  text,
  matches,
}: MatchHighlighterProps) {
  if (!text) {
    return (
      <div className="text-gray-500 italic">Test string'ini yaz bakalım...</div>
    );
  }

  if (matches.length === 0) {
    return <div className="text-gray-400">{text}</div>;
  }

  let highlighted = text;
  let offset = 0;

  
  matches.forEach((match) => {
    const index = highlighted.indexOf(match, offset);
    if (index !== -1) {
      highlighted =
        highlighted.slice(0, index) +
        `<mark class="bg-yellow-400 text-black px-1 rounded">${match}</mark>` +
        highlighted.slice(index + match.length);
      offset = index + match.length + 60;
    }
  });

  return (
    <div
      className="text-gray-300 font-mono text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
