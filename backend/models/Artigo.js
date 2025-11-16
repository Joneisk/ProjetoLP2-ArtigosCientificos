import ArtigoModel from "./ArtigoSchema.js";

class Artigo {
    constructor(titulo, categoria, resumo, conteudo, autores, palavrasChave, autorId, autorNome, dataPublicacao = new Date()) {
        this.titulo = titulo;
        this.categoria = categoria;
        this.resumo = resumo;
        this.conteudo = conteudo;
        this.autores = autores;
        this.palavrasChave = palavrasChave;
        this.autorId = autorId;
        this.autorNome = autorNome;
        this.dataPublicacao = dataPublicacao;
    }

    async save() {
        const artigo = new ArtigoModel({
            titulo: this.titulo,
            categoria: this.categoria,
            resumo: this.resumo,
            conteudo: this.conteudo,
            autores: this.autores,
            palavrasChave: this.palavrasChave,
            autorId: this.autorId,
            autorNome: this.autorNome,
            dataPublicacao: this.dataPublicacao,
            feedbacks: [],
        });

        return await artigo.save();
    }

    static async findAll() {
        return await ArtigoModel.find().populate('categoria').sort({ dataPublicacao: -1 });
    }

    static async findById(id) {
        return await ArtigoModel.findById(id).populate('categoria');
    }

    static async findByCategoria(categoriaId) {
        return await ArtigoModel.find({ categoria: categoriaId }).populate('categoria').sort({ dataPublicacao: -1 });
    }

    static async updateById(id, updateData) {
        return await ArtigoModel.findByIdAndUpdate(id, updateData, { new: true }).populate('categoria');
    }

    static async deleteById(id) {
        return await ArtigoModel.findByIdAndDelete(id);
    }

    static async toggleLike(id, userId) {
        const artigo = await ArtigoModel.findById(id);
        if (artigo) {
            const userLiked = artigo.usuariosCurtidas.includes(userId);
            const userDisliked = artigo.usuariosDescurtidas.includes(userId);

            if (userLiked) {
                // Remove like
                artigo.usuariosCurtidas = artigo.usuariosCurtidas.filter(id => !id.equals(userId));
                artigo.curtidas = Math.max(0, artigo.curtidas - 1);
            } else {
                // Add like
                artigo.usuariosCurtidas.push(userId);
                artigo.curtidas = (artigo.curtidas || 0) + 1;

                // Remove dislike se existir
                if (userDisliked) {
                    artigo.usuariosDescurtidas = artigo.usuariosDescurtidas.filter(id => !id.equals(userId));
                    artigo.descurtidas = Math.max(0, artigo.descurtidas - 1);
                }
            }
            return await artigo.save();
        }
        return null;
    }

    static async toggleDislike(id, userId) {
        const artigo = await ArtigoModel.findById(id);
        if (artigo) {
            const userDisliked = artigo.usuariosDescurtidas.includes(userId);
            const userLiked = artigo.usuariosCurtidas.includes(userId);

            if (userDisliked) {
                // Remove dislike
                artigo.usuariosDescurtidas = artigo.usuariosDescurtidas.filter(id => !id.equals(userId));
                artigo.descurtidas = Math.max(0, artigo.descurtidas - 1);
            } else {
                // Add dislike
                artigo.usuariosDescurtidas.push(userId);
                artigo.descurtidas = (artigo.descurtidas || 0) + 1;

                // Remove like se existir
                if (userLiked) {
                    artigo.usuariosCurtidas = artigo.usuariosCurtidas.filter(id => !id.equals(userId));
                    artigo.curtidas = Math.max(0, artigo.curtidas - 1);
                }
            }
            return await artigo.save();
        }
        return null;
    }

    static async addFeedback(artigoId, userId, userName, comment) {
        const artigo = await ArtigoModel.findById(artigoId);
        if (artigo) {
            artigo.feedbacks.push({
                userId,
                userName,
                comment,
                createdAt: new Date(),
            });
            return await artigo.save();
        }
        return null;
    }

    static async getFeedbacks(artigoId) {
        const artigo = await ArtigoModel.findById(artigoId);
        return artigo ? artigo.feedbacks : [];
    }
}

export default Artigo;