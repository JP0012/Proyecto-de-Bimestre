// Validar campos en las rutas
import { body } from "express-validator";  //Capturar todo el body de la solicitud
import { validateErrors, validateErrorWithoutImg } from "./validate-error.js";
import { existUserName, existEmail, objectIdValid } from "./db.validators.js";

export const registerValidator = [
    body('name', 'Name cannot by empty').notEmpty(),
    body('surname', 'Surname cannot by empty').notEmpty(),
    body('email', 'Email cannot by empty or is not a valid email').notEmpty().isEmail().custom(existEmail),
    body('username', 'Username cannot by empty').notEmpty().toLowerCase().custom(existUserName),
    body('password', 'Password cannot by empty').notEmpty().isStrongPassword().isLength({min: 8}),
    body('phone', 'Phone cannot by empty or not a valid phone').notEmpty().isMobilePhone(),
    validateErrors //Sin llaves para no ejecutarla de primero, es solo referencia de funcion
]

export const LoginValidator = [
    body('userLoggin', 'Username cannot by empty ').notEmpty().toLowerCase(),
    body('password', 'Password cannot by empty').notEmpty().isStrongPassword().isLength({min: 8}),
    validateErrorWithoutImg
]

export const updateValidator = [
    body('name', 'Name cannot by empty'),
    body('surname', 'Surname cannot by empty'),
    body('email', 'Email cannot by empty or is not a valid email').isEmail(),
    body('username', 'Username cannot by empty').toLowerCase().isLowercase(),
    body('phone', 'Phone cannot by empty or not a valid phone').isMobilePhone(),
]


export const PasswordValidator = [
    body('password', 'Password cannot by empty').notEmpty().isStrongPassword().isLength({min: 8}),
]