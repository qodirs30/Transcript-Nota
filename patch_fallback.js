const fs = require('fs');
let code = fs.readFileSync('netlify/functions/api.ts', 'utf8');

const fallbackLogic = `
      // Fallback logic
      let result;
      const ai = new GoogleGenAI({ apiKey: resolvedKey })
      
      try {
        // Coba model 3.8 dulu (paling cerdas)
        result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{
            role: 'user',
            parts: [
              { text: EXTRACTION_PROMPT },
              { inlineData: { data: base64Data, mimeType } },
            ],
          }],
        })
      } catch (err: any) {
        console.warn('[FALLBACK] gemini-3.8-flash gagal. Mencoba gemini-3.6-flash...', err.message)
        
        // Coba key lain jika ada (untuk menghindari rate limit beruntun)
        let fallbackKey = resolvedKey;
        if (!userKey && envKeys.length > 1) {
           const otherKeys = envKeys.filter(k => k !== resolvedKey);
           fallbackKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
        }
        const fallbackAi = new GoogleGenAI({ apiKey: fallbackKey })
        
        // Coba model 3.6 (paling stabil)
        result = await fallbackAi.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{
            role: 'user',
            parts: [
              { text: EXTRACTION_PROMPT },
              { inlineData: { data: base64Data, mimeType } },
            ],
          }],
        })
      }
`;

const oldLogic = `      // Call Gemini
      const ai = new GoogleGenAI({ apiKey: resolvedKey })
      const result = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [{
          role: 'user',
          parts: [
            { text: EXTRACTION_PROMPT },
            { inlineData: { data: base64Data, mimeType } },
          ],
        }],
      })`;

code = code.replace(oldLogic, fallbackLogic);
fs.writeFileSync('netlify/functions/api.ts', code);
console.log('Patched API with fallback!');
