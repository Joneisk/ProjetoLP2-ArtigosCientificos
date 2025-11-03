import Categoria from "../models/Categoria.js";

class CategoriaController {
    // ✅ Criar nova categoria
    static async create(req, res) {
        try {
            const { nome } = req.body;

            // Verifica se já existe uma categoria com o mesmo nome
            const existingCategoria = await Categoria.findByName(nome);
            if (existingCategoria) {
                return res.status(400).json({ success: false, message: "Categoria já existe" });
            }

            const newCategoria = new Categoria(nome);
            await newCategoria.save();

            return res.json({ success: true, message: "Categoria criada com sucesso" });
        } catch (err) {
            console.error("Erro ao criar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Listar todas as categorias
    static async list(req, res) {
        try {
            const categorias = await CategoriaModel.find();
            return res.json({ success: true, data: categorias });
        } catch (err) {
            console.error("Erro ao listar categorias:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Buscar categoria por nome
    static async getByName(req, res) {
        try {
            const { nome } = req.params;
            const categoria = await Categoria.findByName(nome);

            if (!categoria) {
                return res.status(404).json({ success: false, message: "Categoria não encontrada" });
            }

            return res.json({ success: true, data: categoria });
        } catch (err) {
            console.error("Erro ao buscar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Atualizar nome da categoria
    static async update(req, res) {
        try {
            const { nome } = req.params; // nome atual
            const { novoNome } = req.body; // novo nome

            const updated = await Categoria.update(nome, { nome: novoNome });

            if (updated.modifiedCount > 0) {
                return res.json({ success: true, message: "Categoria atualizada com sucesso" });
            } else {
                return res.status(404).json({ success: false, message: "Categoria não encontrada" });
            }
        } catch (err) {
            console.error("Erro ao atualizar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Deletar categoria pelo nome
    static async delete(req, res) {
        try {
            const { nome } = req.params;
            const deleted = await Categoria.deleteByName(nome);

            if (deleted.deletedCount > 0) {
                return res.json({ success: true, message: "Categoria deletada com sucesso" });
            } else {
                return res.status(404).json({ success: false, message: "Categoria não encontrada" });
            }
        } catch (err) {
            console.error("Erro ao deletar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }
}

export default CategoriaController;
