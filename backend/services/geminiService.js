import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY não configurada");
}

const client = new GoogleGenAI({ apiKey });
const model = "models/gemini-2.5-flash";

// Função utilitária de retry
async function retry(fn, retries = 5, delay = 1000) {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        console.log(`⏳ Retentando em ${delay}ms... (${retries} restantes)`);
        await new Promise((res) => setTimeout(res, delay));
        return retry(fn, retries - 1, delay * 2);
    }
}

async function resumirArtigo(artigo) {
    if (!artigo || !artigo.conteudo) {
        return {
            tituloResumo: "Artigo inválido",
            comentarioResumo: "Não há conteúdo suficiente para resumir.",
            sitesRecomendados: [],
            insights: ""
        };
    }

    const prompt = `
Você é um assistente acadêmico especializado em artigos científicos.
Gere um resumo estruturado em JSON contendo:
{
  "tituloResumo": "...",
  "comentarioResumo": "...",
  "sitesRecomendados": [
    {"nome": "...", "url": "...", "motivo": "..."}
  ],
  "insights": "..."
}

ARTIGO:
Título: ${artigo.titulo}
Autores: ${artigo.autores?.join(", ") || "Não informado"}
Categoria: ${artigo.categoria ?? "Não informado"}
Palavras-chave: ${artigo.palavrasChave?.join(", ") ?? "Não informado"}
Resumo: ${artigo.resumo}

Conteúdo completo:
${artigo.conteudo}

Retorne **apenas JSON válido**, sem markdown.
`;

    try {
        const response = await retry(() =>
            client.models.generateContent({
                model,
                contents: prompt
            })
        );

        // ------------------------------------
        // EXTRAÇÃO REAL DO TEXTO DA RESPOSTA
        // ------------------------------------
        let jsonText = "";

        if (
            response?.candidates?.[0]?.content?.parts?.[0]?.text
        ) {
            jsonText = response.candidates[0].content.parts[0].text;
        } else {
            console.error("🔍 Resposta completa do Gemini:");
            console.dir(response, { depth: null });
            throw new Error("Formato inesperado da resposta do Gemini");
        }

        if (!jsonText) throw new Error("Resposta vazia do Gemini");

        // Limpa markdown
        const cleanJson = jsonText
            .replace(/```json|```/g, "")
            .trim();

        const parsed = JSON.parse(cleanJson);

        return {
            tituloResumo: parsed.tituloResumo || "Resumo gerado",
            comentarioResumo: parsed.comentarioResumo || "",
            sitesRecomendados: Array.isArray(parsed.sitesRecomendados) ? parsed.sitesRecomendados : [],
            insights: parsed.insights || ""
        };

    } catch (error) {
        console.error("❌ Erro na chamada da API Gemini:", error.message);
        console.error("Stack:", error.stack);

        return {
            tituloResumo: "Erro de IA",
            comentarioResumo: "Não foi possível gerar o resumo agora. Tente mais tarde.",
            sitesRecomendados: [],
            insights: ""
        };
    }
}

export default resumirArtigo;
