import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = `
Sen bir regex koçusun. Kısa, net ve samimi açıklama yap.

KURALLAR:
- Açıklamayı markdown ile yaz: \`kod\` için backtick, **önemli** için bold
- 2-3 cümle max, her karakteri tek tek açıklama!
- "Eyvallah kanka" gibi gereksiz girişler yapma
- Samimi ama profesyonel ol

Regex: {{REGEX}}
Test String: {{TEST_STRING}}

SADECE JSON döndür:
{
  "aciklama": "Kısa markdown açıklama. Örnek: Bu regex \`^\\d{4}$\` ile **tam 4 haneli sayı** arıyor.",
  "matchler": ["eşleşen parçalar"],
  "hata": "Varsa hata (yoksa null)",
  "alternatif": "Daha iyi regex varsa (yoksa null)",
  "ornek_kullanim": "1 cümle örnek"
}
`;

export interface RegexAciklama {
  aciklama: string;
  matchler: string[];
  hata: string | null;
  alternatif: string | null;
  ornek_kullanim: string;
}

export async function regexAcikla(
  regex: string,
  test: string
): Promise<RegexAciklama> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY bulunamadı!");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

  const prompt = PROMPT.replace("{{REGEX}}", regex).replace(
    "{{TEST_STRING}}",
    test
  );

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI'dan geçerli JSON yanıtı alınamadı");
  }

  return JSON.parse(jsonMatch[0]);
}
