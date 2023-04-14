import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const SECRET_SESSION= process.env.SECRET_SESSION
const USER_MONGO = process.env.USER_MONGO
const PASSWORD_MONGO = process.env.PASSWORD_MONGO
const DB_MONGO = process.env.DB_MONGO
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL
const PERSISTENCE = process.env.PERSISTENCE


export const options = {

    fileSystem: {
        usersFileName: 'users.json',
        productsFileName: 'products.json'
    },

    server: {
        port:PORT,
        persistence: PERSISTENCE,
        secretSession: SECRET_SESSION
    },

    mongoDB: {
        url: `mongodb+srv://${USER_MONGO}:${PASSWORD_MONGO}@cluster0.cmqpdge.mongodb.net/${DB_MONGO}?retryWrites=true&w=majority`
    },

    github: {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL
    }
    
}





