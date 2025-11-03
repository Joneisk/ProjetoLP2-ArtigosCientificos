import express, { Router } from 'express';
import mongoose from 'mongoose';
import __dirname from './utils/pathUtils.js';
import dotenv from 'dotenv';
import path from "path";

import loginRoutes from "./routes/loginRoutes.js";
import Database from './config/db.js';

//dotenv
dotenv.config();


const app = express();
const port = process.env.PORT;

app.set('views', path.join(__dirname, 'views')); //Definindo a pasta do template EJS
app.set('view engine', 'ejs'); //Definindo o motor de template EJS

app.use(express.urlencoded({ extended: true })); // lê dados de form HTML
app.use(express.json()); // caso futuramente queira enviar JSON

Database.connect();//BD

app.use("/login", loginRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});