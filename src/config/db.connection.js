import mongoose from 'mongoose';
import { options } from "../database/db.mongoose.js";


const environment = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(options.mongoDB.url, (err) => {
        if (err) {
            console.log('No se puede conectar a la base de datos')
        } else {
            console.log('Conectado a la base de datos')
        }
    })
}
export default environment;