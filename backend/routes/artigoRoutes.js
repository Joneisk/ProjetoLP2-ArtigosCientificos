import express from "express";
import ArtigoController from "../controller/ArtigoController.js";

const router = express.Router();

router.post("/register", ArtigoController.register);
router.get("/list", ArtigoController.list);
router.get("/get/:id", ArtigoController.get);
router.get("/categoria/:categoriaId", ArtigoController.getByCategoria);
router.put("/update/:id", ArtigoController.update);
router.delete("/delete/:id", ArtigoController.delete);
router.post("/resumir/:id", ArtigoController.resumir);
router.post("/like/:id", ArtigoController.like);
router.post("/dislike/:id", ArtigoController.dislike);
router.post("/feedback/:id", ArtigoController.addFeedback);
router.get("/feedbacks/:id", ArtigoController.getFeedbacks);

export default router;