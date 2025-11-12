import express from "express";
import ArtigoController from "../controller/ArtigoController.js";

const router = express.Router();

router.post("/register", ArtigoController.register);
router.get("/list", ArtigoController.list);
router.get("/get/:id", ArtigoController.get);
router.put("/update/:id", ArtigoController.update);
router.delete("/delete/:id", ArtigoController.delete);
router.post("/resumir/:id", ArtigoController.resumir);


export default router;
