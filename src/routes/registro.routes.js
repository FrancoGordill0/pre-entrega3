import { Router } from "express";
import passport from 'passport';
import { authReg, regFailed } from "../controllers/registro.controller.js";


const router = Router();

router.get('/', (req, res) => {
    res.render('registro', {});
})


router.post('/', passport.authenticate('register', {failureRedirect: '/failregister'}), authReg)

router.get('/failregister', regFailed)

export default router