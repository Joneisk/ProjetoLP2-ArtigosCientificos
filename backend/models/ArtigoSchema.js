import mongoose from "mongoose";

const ArtigoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    resumo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autores: { type: [String], required: true },
    palavrasChave: { type: [String], required: true },
    autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true },
    autorNome: { type: String, required: true },
    dataPublicacao: { type: Date, default: Date.now },
    curtidas: { type: Number, default: 0 },
    descurtidas: { type: Number, default: 0 },
    usuariosCurtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Login' }],
    usuariosDescurtidas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Login' }],
    feedbacks: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Login' },
        userName: { type: String },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const ArtigoModel = mongoose.model("Artigo", ArtigoSchema);

export default ArtigoModel;