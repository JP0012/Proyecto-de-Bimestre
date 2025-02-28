import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getBestSellingProducts, getOutOfStockProducts, exploreProducts } from '../product/product.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas para productos
// Solo el admin puede crear productos
api.post('/', [validateJwt, isAdmin], createProduct); 
// Todos pueden ver los productos
api.get('/', getAllProducts); 
// Solo el admin puede ver un producto por su ID
api.get('/:productId', getProductById);
// Solo el admin puede editar productos
api.put('/:productId', [validateJwt, isAdmin], updateProduct);
// Solo el admin puede eliminar productos
api.delete('/:productId', [validateJwt, isAdmin], deleteProduct);
// Solo el admin puede ver los productos más vendidos
api.get('/best-selling', [validateJwt, isAdmin], getBestSellingProducts);
// Solo el admin puede verificar el stock antes de procesar una factura
api.post('/check-stock', [validateJwt, isAdmin], getOutOfStockProducts);
// Los usuarios pueden explorar productos sin necesidad de autenticación
api.get('/explore', exploreProducts); 

export default api;
