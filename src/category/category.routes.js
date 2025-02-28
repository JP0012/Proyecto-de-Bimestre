import { Router } from 'express';
import { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } from '../category/category.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas para categorías
api.post('/', [validateJwt, isAdmin], createCategory); // Solo admin puede crear
api.get('/', getAllCategory); // Todos pueden ver categorías
api.get('/:id', getCategoryById); // Todos pueden ver una categoría por ID
api.put('/:id', [validateJwt, isAdmin], updateCategory); // Solo admin puede editar
api.delete('/:id', [validateJwt, isAdmin], deleteCategory); // Solo admin puede eliminar

export default api;
