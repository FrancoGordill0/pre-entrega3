import { Router } from "express";
import passport from 'passport';
import { authLogin, auth, authUser, logFailed, logout, login } from "../controllers/login.controller.js";


const router = Router();

router.get('/', (req, res) => {
    res.render('login', {});
})

router.post('/user', passport.authenticate('login', {failureRedirect: '/faillogin'}), authLogin)

router.get('/faillogin', logFailed)

router.get('/products', auth, login)

router.get('/user', auth, authUser)

router.get('/logout', logout)

export default router