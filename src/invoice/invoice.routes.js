import { Router } from 'express';
import { createInvoice, getInvoicesByUser, getInvoiceById, updateInvoice, deleteInvoice } from '../invoice/invoice.controller.js';
import { isAdmin, validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

// Rutas para la gestión de facturas
// Crear una nueva factura desde el carrito del usuario
api.post('/create', [validateJwt], createInvoice); 
// Obtener todas las facturas de un usuario
api.get('/:userId', [validateJwt], getInvoicesByUser); 
// Obtener una factura específica por ID
api.get('/invoice/:invoiceId', [validateJwt], getInvoiceById); 
// Editar una factura (solo accesible para administradores)
api.put('/update/:invoiceId', [validateJwt, isAdmin], updateInvoice); 
// Eliminar una factura (solo accesible para administradores)
api.delete('/delete/:invoiceId', [validateJwt, isAdmin], deleteInvoice);

export default api;
