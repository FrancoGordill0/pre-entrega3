import { Router } from "express";
import { updateProd, createProd, deleteProd, getProd, getAllProds } from "../controllers/productos.controller.js";


const router = Router();

router.get('/', getProd)

router.get('/all', getAllProds)

router.post('/', createProd)

router.put('/:id', updateProd)

router.delete('/:id', deleteProd)


export default router;