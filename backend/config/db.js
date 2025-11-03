import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

class Database {
    static async connect() {
        try{
            const uri = process.env.MONGODB_URI;
            await mongoose.connect(uri);
            console.log("Conectado ao MongoDB");
        }
        catch(error){
            console.error("Erro ao conectar ao MongoDB:", error);
            process.exit(1);//finalizando a aplicação
        }
    }


    static async disconnect() {
        try{
            await mongoose.disconnect();
            console.log("Desconectado do MongoDB");
        }
        catch(error){
            console.error("Erro ao desconectar do MongoDB:", error);
        }
    }
}

export default Database;