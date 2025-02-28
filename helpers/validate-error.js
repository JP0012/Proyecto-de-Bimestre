//Validar los errores
import { validationResult } from "express-validator"; //Capturar los resultados de las validaciones

//Cuando hay imagenes
export const validateErrors = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(errors)
    }
    next()
}

//Cuando no hay imagenes
export const validateErrorWithoutImg = (req, res, next)=>{
    const errors = validationResult(req)
   
    if (!errors.isEmpty()){
        return res.status(400).send(
            {
                success: false,
                message: 'Validation errors',
                errors: errors.errors
            }
        )
    }
    next()
}