import bcrypt from "bcrypt";
import LoginModel from "./LoginSchema.js";

class Login {
    constructor(nome, email, senha, instituicao = null) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.instituicao = instituicao;
    }

    // salva o usuário com senha criptografada
    async save() {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(this.senha, salt);

        const login = new LoginModel({
            nome: this.nome,
            email: this.email,
            senha: senhaCriptografada,
            instituicao: this.instituicao,
        });

        return await login.save();
    }

    static async findByEmail(email) {
        return await LoginModel.findOne({ email: email });
    }

    static async comparePassword(senhaDigitada, senhaHash) {
        return await bcrypt.compare(senhaDigitada, senhaHash);
    }

    static async deleteByEmail(email) {
        return await LoginModel.deleteOne({ email: email });
    }

    static async update(email, updateData) {
        return await LoginModel.updateOne({ email: email }, updateData);
    }
}

export default Login;
