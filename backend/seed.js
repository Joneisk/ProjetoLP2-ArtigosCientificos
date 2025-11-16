import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Categoria from './models/CategoriaSchema.js';
import Login from './models/LoginSchema.js';
import bcrypt from 'bcrypt';
import Database from './config/db.js';

dotenv.config();

const categoriasPadrao = [
  { nome: 'Medicina', descricao: 'Pesquisas e artigos sobre medicina' },
  { nome: 'Física', descricao: 'Estudos de física e fenômenos naturais' },
  { nome: 'Biologia', descricao: 'Pesquisas biológicas e da vida' },
  { nome: 'Engenharia', descricao: 'Engenharia e tecnologia aplicada' },
  { nome: 'Neurociência', descricao: 'Estudos do cérebro e neurociência' },
  { nome: 'Computação', descricao: 'Ciência da computação e programação' },
];

const adminPadrao = {
  nome: 'Administrator',
  email: 'admin@gmail.com',
  senha: 'admin123', // Será hashada
  instituicao: 'SciHub Admin',
};

async function seedAdmin() {
  try {
    // Verificar se admin já existe
    const adminExiste = await Login.findOne({ email: adminPadrao.email });
    if (adminExiste) {
      console.log('Admin já existe. Pulando criação.');
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHasheada = await bcrypt.hash(adminPadrao.senha, salt);

    // Criar admin
    const admin = new Login(
      adminPadrao.nome,
      adminPadrao.email,
      senhaHasheada,
      adminPadrao.instituicao
    );
    const saved = await admin.save();
    console.log(`Admin criado com sucesso! Email: ${saved.email}`);
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  }
}

async function seedCategorias() {
  try {
    await Database.connect();
    console.log('Conectado ao MongoDB');

    // Verificar se já existem categorias
    const count = await Categoria.countDocuments();
    if (count > 0) {
      console.log(`Banco já possui ${count} categorias. Pulando seed.`);
      await Database.disconnect();
      return;
    }

    // Inserir categorias padrão
    const resultado = await Categoria.insertMany(categoriasPadrao);
    console.log(`${resultado.length} categorias criadas com sucesso!`);
    
    resultado.forEach((cat) => {
      console.log(`   - ${cat.nome} (ID: ${cat._id})`);
    });

    await Database.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao criar categorias:', error);
    process.exit(1);
  }
}

async function runSeeds() {
  try {
    await Database.connect();
    await seedAdmin();
    await seedCategorias();
  } finally {
    await Database.disconnect();
  }
}

runSeeds();
