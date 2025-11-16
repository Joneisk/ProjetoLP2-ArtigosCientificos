import Artigo from "../models/Artigo.js";
import Categoria from "../models/Categoria.js";
import resumirArtigo from "../services/geminiService.js";

class ArtigoController {
    static async resumir(req, res) {
        try {
            const artigo = await Artigo.findById(req.params.id);
            if (!artigo) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }

            const resumo = await resumirArtigo(artigo);
            res.json({ 
                success: true, 
                data: {
                    ...resumo,
                    geradoEm: new Date().toISOString()
                }
            });
        } catch (err) {
            console.error("Erro ao resumir artigo:", err);
            res.status(500).json({ success: false, message: "Erro interno ao resumir artigo" });
        }
    }

    // ✅ CADASTRAR ARTIGO
    static async register(req, res) {
        try {
            const { titulo, categoria, resumo, conteudo, autores, palavrasChave, autorId, autorNome } = req.body;

            if (!titulo || !categoria || !resumo || !conteudo || !autores || !palavrasChave || !autorId || !autorNome) {
                return res.status(400).json({ success: false, message: "Preencha todos os campos obrigatórios." });
            }

            // Verificar se categoria existe
            const categoriaExiste = await Categoria.findById(categoria);
            if (!categoriaExiste) {
                return res.status(400).json({ success: false, message: "Categoria não encontrada." });
            }

            const novoArtigo = new Artigo(
                titulo,
                categoria,
                resumo,
                conteudo,
                Array.isArray(autores) ? autores : autores.split(',').map(a => a.trim()),
                Array.isArray(palavrasChave) ? palavrasChave : palavrasChave.split(',').map(p => p.trim()),
                autorId,
                autorNome
            );
            const saved = await novoArtigo.save();

            return res.json({ success: true, message: "Artigo cadastrado com sucesso!", data: saved });
        } catch (err) {
            console.error("Erro ao cadastrar artigo:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor", error: err.message });
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

    // ✅ LISTAR ARTIGOS POR CATEGORIA
    static async getByCategoria(req, res) {
        const { categoriaId } = req.params;
        try {
            const artigos = await Artigo.findByCategoria(categoriaId);
            return res.json({ success: true, data: artigos });
        } catch (err) {
            console.error("Erro ao listar artigos por categoria:", err);
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
            return res.json({ success: true, message: "Artigo atualizado com sucesso", data: updated });
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

    // ✅ ADICIONAR CURTIDA
    static async like(req, res) {
        const { id } = req.params;
        const userId = req.body?.userId;
        try {
            if (!userId) {
                return res.status(400).json({ success: false, message: "userId é obrigatório" });
            }
            const updated = await Artigo.toggleLike(id, userId);
            if (!updated) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, message: "Voto atualizado", data: updated });
        } catch (err) {
            console.error("Erro ao adicionar curtida:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ ADICIONAR DESCURTIDA
    static async dislike(req, res) {
        const { id } = req.params;
        const userId = req.body?.userId;
        try {
            if (!userId) {
                return res.status(400).json({ success: false, message: "userId é obrigatório" });
            }
            const updated = await Artigo.toggleDislike(id, userId);
            if (!updated) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, message: "Voto atualizado", data: updated });
        } catch (err) {
            console.error("Erro ao adicionar descurtida:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ ADICIONAR FEEDBACK
    static async addFeedback(req, res) {
        const { id } = req.params;
        const { userId, userName, comment } = req.body;
        try {
            if (!comment || !userName) {
                return res.status(400).json({ success: false, message: "Comentário e nome são obrigatórios" });
            }

            const updated = await Artigo.addFeedback(id, userId, userName, comment);
            if (!updated) {
                return res.status(404).json({ success: false, message: "Artigo não encontrado" });
            }
            return res.json({ success: true, message: "Feedback adicionado com sucesso", data: updated });
        } catch (err) {
            console.error("Erro ao adicionar feedback:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ LISTAR FEEDBACKS
    static async getFeedbacks(req, res) {
        const { id } = req.params;
        try {
            const feedbacks = await Artigo.getFeedbacks(id);
            return res.json({ success: true, data: feedbacks });
        } catch (err) {
            console.error("Erro ao buscar feedbacks:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }
}

export default ArtigoController;
