import mongoose from "mongoose";

const CategoriaSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, unique: true },
        descricao: { type: String, required: false },
        criadoEm: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const CategoriaModel = mongoose.model('Categoria', CategoriaSchema);

export default CategoriaModel;
