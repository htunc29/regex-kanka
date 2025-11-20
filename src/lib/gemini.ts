import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface RegexMatch {
  match: string;
  index: number;
  groups?: string[];
}

export interface RegexResponse {
  isValid: boolean;
  aciklama: string;
  detaylar: string[];
  matchler: string[];
  hata: string | null;
  alternatif: string | null;
  ornek_kullanim: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const schema = {
  description: "Regex analiz sonucu",
  type: SchemaType.OBJECT as const,
  properties: {
    isValid: {
      type: SchemaType.BOOLEAN as const,
      description: "Regex sözdizimi geçerli mi?",
    },
    aciklama: {
      type: SchemaType.STRING as const,
      description: "Regex'in ne yaptığının kısa özeti",
    },
    detaylar: {
      type: SchemaType.ARRAY as const,
      items: { type: SchemaType.STRING as const },
      description:
        "Regex parçalarının teknik açıklaması (örn: '\\d+' -> Bir veya daha fazla rakam)",
    },
    matchler: {
      type: SchemaType.ARRAY as const,
      items: { type: SchemaType.STRING as const },
      description: "Test stringi içindeki tam eşleşmeler",
    },
    hata: {
      type: SchemaType.STRING as const,
      nullable: true,
      description: "Varsa hata mesajı",
    },
    alternatif: {
      type: SchemaType.STRING as const,
      nullable: true,
      description: "Daha iyi/kısa bir regex önerisi",
    },
    ornek_kullanim: {
      type: SchemaType.STRING as const,
      description: "JavaScript/Python kullanım örneği",
    },
  },
  required: ["isValid", "aciklama", "detaylar", "matchler", "ornek_kullanim"],
};

const SYSTEM_PROMPT = `
Sen bir Regex (Düzenli İfade) Ayrıştırma ve Optimizasyon Motorusun.
Görevin: Kullanıcının verdiği Regex ifadesini analiz etmek, hataları bulmak ve çalışma mantığını açıklamaktır.

Kurallar:
1.  **Analitik Ol:** "Bu bir mail regexi" deyip geçme. Token token analiz et. (Örn: "[a-z]+" -> Küçük harflerden oluşan kelime).
2.  **Doğruluk:** Verilen 'Test String' üzerinde regex motoru gibi davran ve SADECE gerçek eşleşmeleri listele.
3.  **Optimizasyon:** Eğer regex çok karmaşıksa veya modern standartlara (ES6+) uymuyorsa, daha kısa ve performanslı bir 'alternatif' öner.
4.  **Dil:** Yanıtların Türkçe, teknik terimler (Wildcard, Anchor, Quantifier vb.) orijinal İngilizce halleriyle parantez içinde belirtilmeli.
5.  **Format:** Asla markdown bloğu (\`\`\`json) kullanma, direkt ham JSON döndür.
`;

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.2,
  },
  systemInstruction: SYSTEM_PROMPT,
});

export async function regexAcikla(
  regex: string,
  testString: string
): Promise<RegexResponse> {
  if (!regex.trim()) return createErrorResponse("Regex ifadesi boş olamaz.");

  try {
    const userPrompt = `
    Lütfen aşağıdaki Regex ifadesini ve Test metnini analiz et:

    Regex İfadesi: """${regex}"""
    Test Metni: """${testString || ""}"""
    `;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    return JSON.parse(responseText) as RegexResponse;
  } catch (error) {
    console.error("AI Hatası:", error);
    const errorMsg = error instanceof Error ? error.message : "Bilinmeyen hata";
    return createErrorResponse(
      `Gemini API hatası: ${errorMsg}. API anahtarınızı kontrol edin.`
    );
  }
}

function createErrorResponse(msg: string): RegexResponse {
  return {
    isValid: false,
    aciklama: "İşlem başarısız.",
    detaylar: [],
    matchler: [],
    hata: msg,
    alternatif: null,
    ornek_kullanim: "",
  };
}
