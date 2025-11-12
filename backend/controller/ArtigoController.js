import Artigo from "../models/Artigo.js";
import resumirArtigo from "../services/geminiService.js";

class ArtigoController {
    static async resumir(req, res) {
        try {
            const artigo = await Artigo.findById(req.params.id);
            if (!artigo) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }

            const resumo = await resumirArtigo(artigo);
            res.json({ success: true, resumo });
        } catch (err) {
            console.error("Erro ao resumir artigo:", err);
            res.status(500).json({ success: false, message: "Erro interno ao resumir artigo" });
        }
    }

    // ✅ CADASTRAR ARTIGO
    static async register(req, res) {
        try {
            const { titulo, autor, conteudo } = req.body;

            if (!titulo || !autor || !conteudo) {
                return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios." });
            }

            const novoArtigo = new Artigo(titulo, autor, conteudo);
            await novoArtigo.save();

            return res.json({ success: true, message: "Artigo cadastrado com sucesso!" });
        } catch (err) {
            console.error("Erro ao cadastrar artigo:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ LISTAR TODOS OS ARTIGOS
    static async list(req, res) {
        try {
            const artigos = await Artigo.findAll();
            return res.json({ success: true, data: artigos });
        } catch (err) {
            console.error("Erro ao listar artigos:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ BUSCAR ARTIGO POR ID
    static async get(req, res) {
        const { id } = req.params;
        try {
            const artigo = await Artigo.findById(id);
            if (!artigo) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, data: artigo });
        } catch (err) {
            console.error("Erro ao buscar artigo:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ ATUALIZAR ARTIGO
    static async update(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const updated = await Artigo.updateById(id, updateData);
            if (!updated) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, message: "Artigo atualizado com sucesso" });
        } catch (err) {
            console.error("Erro ao atualizar artigo:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ DELETAR ARTIGO
    static async delete(req, res) {
        const { id } = req.params;
        try {
            const deleted = await Artigo.deleteById(id);
            if (!deleted) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, message: "Artigo deletado com sucesso" });
        } catch (err) {
            console.error("Erro ao deletar artigo:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }
}

export default ArtigoController;
