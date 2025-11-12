import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-2.5-flash";

async function resumirArtigo(artigo) {
    if (!artigo || !artigo.conteudo) {
        return { tituloResumo: "Artigo inválido", comentarioResumo: "Não há conteúdo suficiente para resumir." };
    }

    const prompt = `
        Você é um assistente acadêmico. Sua tarefa é resumir o artigo científico abaixo.
        O resumo deve conter:
        1. Um título curto (máx. 6 palavras) que capture o tema principal.
        2. Um parágrafo resumo com até 120 palavras, destacando o objetivo, metodologia e principais conclusões.

        Retorne **estritamente** em formato JSON:
        { "tituloResumo": "...", "comentarioResumo": "..." }

        ARTIGO:
        ---
        Título: ${artigo.titulo}
        Autor: ${artigo.autor}
        Data de publicação: ${artigo.dataPublicacao}
        Conteúdo:
        ${artigo.conteudo}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        const jsonText = response.response.text().trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Erro na chamada da API Gemini:", error);
        return { 
            tituloResumo: "Erro de IA", 
            comentarioResumo: "Não foi possível gerar o resumo. Tente novamente mais tarde." 
        };
    }
}

export default resumirArtigo;
