import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // Server-side Gemini endpoint for AI Logo Design & SVG generation
  app.post('/api/ai/generate-logo', async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: "Iltimos, logotip tavsifini kiriting." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API kaliti sozlanmagan." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Siz O'zbekiston bayramlari va tantanali marosimlari uchun professional vektor logotip dizaynerisiz.
Foydalanuvchi o'zbek tilida logotip tavsifini yozadi (masalan: "Navro'zga yashil va oltin logotip, tepasida lola" yoki "O'qituvchilar kuniga kitob va oltin gulchambarli nishon").
Siz quyidagi JSON strukturasida logotip konfiguratsiyasini qaytarishingiz shart:
- title: Asosiy bayram yoki marosim yozuvi (qisqa, ta'sirli, o'zbek tilida, masalan "NAVRO'Z AYYOMI", "MUSTAQILLIK 35 YILLIGI", "USTOZLAR KUNI")
- subtitle: Qo'shimcha sana yoki yil yozuvi (masalan "21-MART", "1-SENTABR", "1-OKTABR", "2026")
- motto: Shior yoki tabrik so'zi (masalan "Yasharish va yangilanish fasli", "Aziz va yagonamsan, jonajon O'zbekistonim!", "Bilim va ma'rifat mash'ali")
- layoutStyle: Quyidagilardan biri: "circular-badge" | "ribbon-crest" | "laurel-wreath" | "gold-ornate" | "minimalist" | "flag-emblem" | "uzbek-pattern" | "modern-geometric" | "typographic-seal" | "royal-shield"
- shape: Quyidagilardan biri: "circle" | "square" | "shield" | "ribbon" | "octagon"
- iconId: Quyidagilardan eng mosini tanlang: "tulip" | "sumalak" | "sun-spring" | "humo-bird" | "uzbek-flag" | "book-quill" | "torch-knowledge" | "rose-flower" | "star-glory" | "crescent-mosque" | "lantern-ramadan" | "scales-constitution" | "wedding-rings" | "celebration-cake" | "graduation-cap" | "custom"
- primaryColor: HEX rang kodi (masalan "#0F766E", "#1D4ED8", "#B91C1C", "#047857", "#4338CA")
- secondaryColor: HEX rang kodi (masalan "#10B981", "#38BDF8", "#F43F5E", "#34D399", "#818CF8")
- goldColor: Oltin yoki aksent HEX rang kodi (masalan "#D4AF37", "#F59E0B", "#FBBF24", "#EAB308")
- bgColor: To'q va boy fon HEX rangi (masalan "#071318", "#0A1128", "#180A12", "#081C15")
- fontFamily: Quyidagilardan biri: "Playfair Display" | "Montserrat" | "Cinzel" | "Oswald" | "Cormorant Garamond"
- customSvgPath: Agar foydalanuvchi maxsus belgi so'rasa, 100x100 viewBox markaziga (50,50 atrofida) mos keladigan chiroyli SVG <path d="..." /> qatorini yozing (faqat d atributi qiymati emas, balki bo'sh qoldirsa ham bo'ladi agar iconId yetarli bo'lsa; agar bersangiz to'liq valid SVG path d string bo'lsin).
- explanation: O'zbek tilida qisqa 1 gaplik dizayn izohi.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              motto: { type: Type.STRING },
              layoutStyle: { type: Type.STRING },
              shape: { type: Type.STRING },
              iconId: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              goldColor: { type: Type.STRING },
              bgColor: { type: Type.STRING },
              fontFamily: { type: Type.STRING },
              customSvgPath: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: [
              'title',
              'subtitle',
              'motto',
              'layoutStyle',
              'shape',
              'iconId',
              'primaryColor',
              'secondaryColor',
              'goldColor',
              'bgColor',
              'fontFamily',
              'explanation',
            ],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: "AI javob qaytarmadi." });
      }

      const parsed = JSON.parse(text.trim());
      return res.json(parsed);
    } catch (error: any) {
      console.error('AI logo generation error:', error);
      return res.status(500).json({
        error: error?.message || "AI orqali logotip yaratishda xatolik yuz berdi.",
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
