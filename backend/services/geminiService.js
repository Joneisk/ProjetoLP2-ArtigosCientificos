import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY não configurada');
}

const client = new GoogleGenAI({
    apiKey: apiKey
});

const model = "models/gemini-2.5-flash";

async function resumirArtigo(artigo) {
    if (!artigo || !artigo.conteudo) {
        return { 
            tituloResumo: "Artigo inválido", 
            comentarioResumo: "Não há conteúdo suficiente para resumir.",
            sitesRecomendados: [],
            insights: ""
        };
    }

    const prompt = `Você é um assistente acadêmico especializado em análise de artigos científicos.
Sua tarefa é resumir e analisar o artigo científico abaixo de forma completa.

O resumo deve conter em formato JSON:
{
    "tituloResumo": "Título curto (máx 8 palavras) capturando o tema principal",
    "comentarioResumo": "Parágrafo com até 150 palavras destacando objetivo, metodologia e principais conclusões",
    "sitesRecomendados": [
        {
            "nome": "Nome do site/base de dados acadêmica",
            "url": "url ou descrição do site",
            "motivo": "Por que é relevante para este tópico"
        }
    ],
    "insights": "2-3 insights interessantes sobre o tema do artigo (aplicações práticas, tendências futuras, impacto da pesquisa)"
}

ARTIGO:
---
Título: ${artigo.titulo}
Autores: ${artigo.autores ? artigo.autores.join(', ') : 'Não informado'}
Categorias: ${artigo.categoria ? artigo.categoria : 'Não informado'}
Palavras-chave: ${artigo.palavrasChave ? artigo.palavrasChave.join(', ') : 'Não informado'}
Data de publicação: ${artigo.dataPublicacao}
Resumo fornecido: ${artigo.resumo}

Conteúdo completo:
${artigo.conteudo}
---

Retorne **estritamente** em formato JSON válido, sem markdown ou formatação extra.`;

    try {
        const response = await client.models.generateContent({model, contents: prompt});
        
        let jsonText = '';

        console.log(response);
        
        // Tentar extrair texto da resposta
        if (response.response && response.response.text) {
            jsonText = response.response.text();
        } else if (response.text) {
            jsonText = response.text();
        } else if (response.candidates && response.candidates[0]) {
            const content = response.candidates[0].content;
            if (content && content.parts && content.parts[0]) {
                jsonText = content.parts[0].text;
            }
        }

        if (!jsonText) {
            throw new Error('Nenhuma resposta do Gemini');
        }

        // Limpar markdown
        const cleanJson = jsonText.trim().replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        return {
            tituloResumo: parsed.tituloResumo || "Resumo gerado",
            comentarioResumo: parsed.comentarioResumo || "",
            sitesRecomendados: Array.isArray(parsed.sitesRecomendados) ? parsed.sitesRecomendados : [],
            insights: parsed.insights || ""
        };
    } catch (error) {
        console.error("Erro na chamada da API Gemini:", error.message);
        console.error("Stack:", error.stack);
        return { 
            tituloResumo: "Erro de IA", 
            comentarioResumo: "Não foi possível gerar o resumo. Tente novamente mais tarde.",
            sitesRecomendados: [],
            insights: ""
        };
    }
}

export default resumirArtigo;
