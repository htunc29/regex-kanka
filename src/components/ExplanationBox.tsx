"use client";

import { RegexResponse } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

interface ExplanationBoxProps {
  data: RegexResponse | null;
  loading: boolean;
  error: string | null;
}

export default function ExplanationBox({
  data,
  loading,
  error,
}: ExplanationBoxProps) {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">AI düşünüyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-800">
        <div className="flex items-center gap-2 text-red-400">
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-500 text-center italic">
          Regex yaz, AI abin açıklasın... 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
      {!data.isValid && (
        <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-xl">❌</span>
            <span className="font-semibold">Geçersiz Regex</span>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          📖 Ne Yapıyor?
        </h3>
        <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code: ({ children }) => (
                <code className="bg-gray-900 text-blue-300 px-2 py-0.5 rounded font-mono text-sm">
                  {children}
                </code>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-gray-400 italic">{children}</em>
              ),
            }}
          >
            {data.aciklama}
          </ReactMarkdown>
        </div>
      </div>

      {data.detaylar && data.detaylar.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">
            🔍 Detaylı Analiz
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            {data.detaylar.map((detay, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>{detay}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.matchler.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-2">
            ✅ Eşleşenler ({data.matchler.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.matchler.map((match, i) => (
              <code
                key={i}
                className="bg-green-900/30 text-green-300 px-3 py-1 rounded border border-green-700 font-mono text-sm"
              >
                {match}
              </code>
            ))}
          </div>
        </div>
      )}

      {data.hata && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 mb-2">
            ⚡ Dikkat!
          </h3>
          <p className="text-yellow-300 bg-yellow-900/20 p-3 rounded border border-yellow-700">
            {data.hata}
          </p>
        </div>
      )}

      {data.alternatif && (
        <div>
          <h3 className="text-sm font-semibold text-purple-400 mb-2">
            💡 Alternatif
          </h3>
          <code className="block bg-purple-900/20 text-purple-300 p-3 rounded border border-purple-700 font-mono">
            {data.alternatif}
          </code>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-cyan-400 mb-2">
          🎯 Ne İşe Yarar?
        </h3>
        <p className="text-gray-300 italic">{data.ornek_kullanim}</p>
      </div>
    </div>
  );
}
