import mongoose from "mongoose";

const LoginSchema = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        senha: {type: String, required: true},
        instituicao: {type: String, required: false},
        criadoEm: {type: Date, default: Date.now},
    },
    { timestamps: true }
);

const LoginModel = mongoose.model('Login', LoginSchema);

export default LoginModel;