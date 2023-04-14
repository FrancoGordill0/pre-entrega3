import { Router } from "express";
import { actualizarProductoCarrito, crearCarrito, eliminarProductoCarrito, eliminarTodosProductosCarrito, obtenerCarrito, obtenerCarritoUser } from "../controllers/cart.controller.js";


const router = Router();

router.get('/', obtenerCarrito)

router.get('/:id', obtenerCarritoUser)

router.post('/', crearCarrito)

router.put('/:cid/products/:pid', actualizarProductoCarrito)

router.delete('/:cid/products/:pid', eliminarProductoCarrito)

router.delete('/:cid', eliminarTodosProductosCarrito)

export default router