import mongoose from "mongoose";

const ArtigoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    dataPublicacao: { type: Date, default: Date.now },
    conteudo: { type: String, required: true },
});

const ArtigoModel = mongoose.model("Artigo", ArtigoSchema);

export default ArtigoModel;
