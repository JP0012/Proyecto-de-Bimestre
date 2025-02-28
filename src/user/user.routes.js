import { Router } from 'express';
import { getAllUsers, getUserById, updateUserRole, updateUser, deleteUser, updateProfile, deleteUserAccount } from '../user/user.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas para usuarios
// Solo el admin puede obtener todos los usuarios
api.get('/', [validateJwt, isAdmin], getAllUsers); 
// Todos pueden ver su propio usuario por ID
api.get('/:userId', [validateJwt], getUserById); 
// Solo el admin puede cambiar el rol de un usuario
api.put('/:userId/role', [validateJwt, isAdmin], updateUserRole); 
// Solo el admin puede editar la información de un usuario
api.put('/:userId', [validateJwt, isAdmin], updateUser); 
// Solo el admin puede eliminar un usuario
api.delete('/:userId', [validateJwt, isAdmin], deleteUser); 
// Los usuarios pueden editar su propio perfil
api.put('/profile', [validateJwt], updateProfile); 
// Los usuarios pueden eliminar su propia cuenta
api.delete('/profile', [validateJwt], deleteUserAccount); 

export default api;
