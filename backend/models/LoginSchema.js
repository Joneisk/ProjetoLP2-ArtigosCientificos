import mongoose from "mongoose";



const LoginSchema = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        email: {type: String, required: true},
        senha: {type: String, required: true},
       
    }
);


const LoginModel = mongoose.model('Login', LoginSchema);

export default LoginModel;