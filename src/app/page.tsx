"use client";

import { useState } from "react";
import RegexInput from "@/components/RegexInput";
import MatchHighlighter from "@/components/MatchHighlighter";
import ExplanationBox from "@/components/ExplanationBox";
import { RegexResponse } from "@/lib/gemini";

export default function Home() {
  const [regex, setRegex] = useState("");
  const [testString, setTestString] = useState("");
  const [result, setResult] = useState<RegexResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!regex) {
      setError("Önce bir regex pattern yaz kanka!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regex, test: testString }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  const randomExamples = [
    {
      regex: "^\\d{4}$",
      test: "2025 yılında doğdum, 1234 şifrem",
      desc: "Tam 4 haneli sayı",
    },
    {
      regex: "[a-z]+@[a-z]+\\.[a-z]+",
      test: "Mail: test@gmail.com veya info@site.org",
      desc: "Basit email adresi",
    },
    {
      regex: "\\b[A-Z][a-z]+",
      test: "Merhaba Dünya! JavaScript öğreniyorum",
      desc: "Büyük harfle başlayan kelimeler",
    },
  ];

  const loadRandomExample = () => {
    const example = randomExamples[Math.floor(Math.random() * randomExamples.length)];
    setRegex(example.regex);
    setTestString(example.test);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Regex Playground
            <span className="text-sm font-normal text-gray-500 ml-2">
              by Gemini AI
            </span>
          </h1>
          <p className="text-gray-400 mt-2">
            Regex mi? Kanka sana AI abin açıklasın! 🚀
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <RegexInput
                value={regex}
                onChange={setRegex}
                label="Regex Pattern"
                placeholder="Örn: ^\d{4}$"
              />

              <div className="mt-6">
                <RegexInput
                  value={testString}
                  onChange={setTestString}
                  label="Test String"
                  placeholder="Buraya test edilecek metin..."
                  mono={false}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleExplain}
                  disabled={loading || !regex}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700
                    disabled:cursor-not-allowed text-white rounded-lg font-medium
                    transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Düşünüyor...
                    </>
                  ) : (
                    <>🚀 Açıkla!</>
                  )}
                </button>

                <button
                  onClick={loadRandomExample}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white
                    rounded-lg font-medium transition-colors"
                >
                  🎲
                </button>
              </div>
            </div>

            {testString && (
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  🎯 Match Preview
                </h3>
                <MatchHighlighter
                  text={testString}
                  matches={result?.matchler || []}
                />
              </div>
            )}
          </div>

          <div>
            <ExplanationBox data={result} loading={loading} error={error} />
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Made with ❤️ using{" "}
            <span className="text-blue-400">Next.js</span> +{" "}
            <span className="text-purple-400">Gemini 1.5 Flash</span>
          </p>
        </div>
      </main>
    </div>
  );
}
