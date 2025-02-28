import { Router } from 'express';
import { addToCart, getCart, removeFromCart } from '../cart/cart.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas para el carrito de compras
// Los clientes pueden agregar productos a su carrito
api.post('/add', [validateJwt], addToCart); 
// Los clientes pueden ver su carrito
api.get('/', [validateJwt], getCart); 
// Los clientes pueden eliminar un producto de su carrito
api.delete('/remove/:productId', [validateJwt], removeFromCart); 

export default api;
