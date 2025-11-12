// routes/loginRoutes.js
import express from "express";
import LoginController from "../controller/LoginController.js";

const router = express.Router();

// Rota para cadastro de novo login
router.post("/register", LoginController.register);

// Rota para listar logins (ou clientes)
router.get("/list", LoginController.list);

// Rota para deletar login por e-mail
router.delete("/delete/:email", LoginController.delete);

// Rota para atualizar login por e-mail
router.put("/update/:email", LoginController.update);

export default router;
