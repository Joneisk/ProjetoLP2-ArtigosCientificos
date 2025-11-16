import CategoriaModel from "./CategoriaSchema.js";

class Categoria {
    constructor(nome, descricao = null) {
        this.nome = nome;
        this.descricao = descricao;
    }

    async save() {
        const categoria = new CategoriaModel({
            nome: this.nome,
            descricao: this.descricao,
        });

        return await categoria.save();
    }

    static async findAll() {
        return await CategoriaModel.find().sort({ nome: 1 });
    }

    static async findById(id) {
        return await CategoriaModel.findById(id);
    }

    static async findByName(nome) {
        return await CategoriaModel.findOne({ nome: nome });
    }

    static async updateById(id, updateData) {
        return await CategoriaModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteById(id) {
        return await CategoriaModel.findByIdAndDelete(id);
    }
}

export default Categoria;
