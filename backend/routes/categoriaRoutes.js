import express from "express";
import CategoriaController from "../controllers/CategoriaController.js";

const router = express.Router();

// Criar nova categoria
router.post("/create", CategoriaController.create);

// Listar todas as categorias
router.get("/list", CategoriaController.list);

// Buscar categoria por nome
router.get("/get/:nome", CategoriaController.getByName);

// Atualizar categoria (por nome)
router.put("/update/:nome", CategoriaController.update);

// Deletar categoria (por nome)
router.delete("/delete/:nome", CategoriaController.delete);

export default router;
