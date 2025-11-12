import ArtigoModel from "./ArtigoSchema.js";

class Artigo {
    constructor(titulo, autor, conteudo, dataPublicacao = new Date()) {
        this.titulo = titulo;
        this.autor = autor;
        this.conteudo = conteudo;
        this.dataPublicacao = dataPublicacao;
    }

    async save() {
        const artigo = new ArtigoModel({
            titulo: this.titulo,
            autor: this.autor,
            conteudo: this.conteudo,
            dataPublicacao: this.dataPublicacao,
        });

        return await artigo.save();
    }

    static async findAll() {
        return await ArtigoModel.find().sort({ dataPublicacao: -1 });
    }

    static async findById(id) {
        return await ArtigoModel.findById(id);
    }

    static async updateById(id, updateData) {
        return await ArtigoModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteById(id) {
        return await ArtigoModel.findByIdAndDelete(id);
    }
}

export default Artigo;
