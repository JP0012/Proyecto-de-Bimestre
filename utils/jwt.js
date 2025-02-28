// Generador de tokens
'use strict'

import jwt from "jsonwebtoken"
                                // Objeto con datos (usuario)
export const generateJwt = async (payload) => {
    try {
        return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: '3h', //Recomendable 1 o 2 horas
                algorithm: 'HS256'
            }
        )
    } catch (err) {
        console.error(err)
        return err
    }
}