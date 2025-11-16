import Login from "../models/Login.js";

class LoginController {
    // ✅ CADASTRAR USUÁRIO
    static async register(req, res) {
        try {
            const { nome, email, senha, instituicao } = req.body;

            const existingLogin = await Login.findByEmail(email);
            if (existingLogin) {
                return res.status(400).json({ success: false, message: "Email já cadastrado" });
            }

            const newLogin = new Login(nome, email, senha, instituicao);
            const saved = await newLogin.save();

            return res.json({ 
                success: true, 
                message: "Cadastrado com sucesso",
                usuario: {
                    id: saved._id.toString(),
                    nome: saved.nome,
                    email: saved.email,
                    instituicao: saved.instituicao,
                }
            });
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ FAZER LOGIN (verifica e-mail e senha)
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            const user = await Login.findByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }

            const senhaCorreta = await Login.comparePassword(senha, user.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ success: false, message: "Senha incorreta" });
            }

            // Login bem-sucedido
            return res.json({
                success: true,
                message: "Login realizado com sucesso!",
                usuario: {
                    id: user._id.toString(),
                    nome: user.nome,
                    email: user.email,
                    instituicao: user.instituicao,
                },
            });
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ LISTAR TODOS (caso queira ativar depois)
    static async list(req, res) {
        try {
            const clientes = await LoginModel.find();
            res.json(clientes);
        } catch (err) {
            console.error("Erro ao listar clientes:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ REDEFINIR SENHA
    static async resetPassword(req, res) {
        const { email, senhaAtual, senhaNova } = req.body;
        try {
            if (!email || !senhaAtual || !senhaNova) {
                return res.status(400).json({ success: false, message: "Email, senha atual e nova senha são obrigatórios" });
            }

            const user = await Login.findByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }

            const senhaCorreta = await Login.comparePassword(senhaAtual, user.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ success: false, message: "Senha atual incorreta" });
            }

            // Atualizar senha
            user.senha = senhaNova;
            await user.save();

            return res.json({ success: true, message: "Senha atualizada com sucesso" });
        } catch (err) {
            console.error("Erro ao redefinir senha:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ DELETAR POR EMAIL
    static async delete(req, res) {
        const { email } = req.params;
        try {
            const deleted = await Login.deleteByEmail(email);
            if (deleted.deletedCount > 0) {
                return res.json({ success: true, message: "Usuário deletado com sucesso" });
            } else {
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }
        } catch (err) {
            console.error("Erro ao deletar usuário:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }

    // ✅ ATUALIZAR USUÁRIO
    static async update(req, res) {
        const { email } = req.params;
        const updateData = req.body;
        try {
            const updated = await Login.update(email, updateData);
            if (updated.modifiedCount > 0) {
                return res.json({ success: true, message: "Usuário atualizado com sucesso" });
            } else {
                return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            }
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }
}

export default LoginController;
