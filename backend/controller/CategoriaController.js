import Categoria from "../models/Categoria.js";
import Login from "../models/Login.js";

class CategoriaController {
    // ✅ Criar nova categoria (apenas admin)
    static async create(req, res) {
        try {
            const { nome, descricao, adminEmail } = req.body;

            if (!nome) {
                return res.status(400).json({ success: false, message: "Nome da categoria é obrigatório" });
            }

            // Verifica se o usuário é admin
            if (adminEmail !== "admin@gmail.com") {
                return res.status(403).json({ success: false, message: "Acesso negado. Apenas admin pode criar categorias." });
            }

            // Verifica se existe um usuário com esse email
            const user = await Login.findByEmail(adminEmail);
            if (!user) {
                return res.status(403).json({ success: false, message: "Acesso negado. Admin não encontrado." });
            }

            // Verifica se já existe uma categoria com o mesmo nome
            const existingCategoria = await Categoria.findByName(nome);
            if (existingCategoria) {
                return res.status(400).json({ success: false, message: "Categoria já existe" });
            }

            const newCategoria = new Categoria(nome, descricao || null);
            const saved = await newCategoria.save();

            return res.json({ success: true, message: "Categoria criada com sucesso", data: saved });
        } catch (err) {
            console.error("Erro ao criar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Listar todas as categorias
    static async list(req, res) {
        try {
            const categorias = await Categoria.findAll();
            return res.json({ success: true, data: categorias });
        } catch (err) {
            console.error("Erro ao listar categorias:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Buscar categoria por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const categoria = await Categoria.findById(id);

            if (!categoria) {
                return res.status(404).json({ success: false, message: "Categoria não encontrada" });
            }

            return res.json({ success: true, data: categoria });
        } catch (err) {
            console.error("Erro ao buscar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Atualizar categoria
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;

            const updated = await Categoria.updateById(id, { nome, descricao });

            if (updated) {
                return res.json({ success: true, message: "Categoria atualizada com sucesso", data: updated });
            } else {
                return res.status(404).json({ success: false, message: "Categoria não encontrada" });
            }
        } catch (err) {
            console.error("Erro ao atualizar categoria:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ Deletar categoria (apenas admin)
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const { adminEmail } = req.body;

            // Verifica se o usuário é admin
            if (adminEmail !== "admin@gmail.com") {
                return res.status(403).json({ success: false, message: "Acesso negado. Apenas admin pode deletar categorias." });
            }

            const deleted = await Categoria.deleteById(id);

            if (deleted) {
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
