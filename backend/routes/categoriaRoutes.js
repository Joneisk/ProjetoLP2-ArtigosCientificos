import express from "express";
import CategoriaController from "../controller/CategoriaController.js";

const router = express.Router();

// Criar nova categoria
router.post("/create", CategoriaController.create);

// Listar todas as categorias
router.get("/list", CategoriaController.list);

// Buscar categoria por ID
router.get("/get/:id", CategoriaController.getById);

// Atualizar categoria (por ID)
router.put("/update/:id", CategoriaController.update);

// Deletar categoria (por ID)
router.delete("/delete/:id", CategoriaController.delete);

export default router;
