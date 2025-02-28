// Rutas de autenticacion
import { Router } from "express"
import { login, register, test } from "./auth.controller.js"
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { LoginValidator, registerValidator } from "../../helpers/validators.js";
import { uploadProfilePicture } from "../../middlewares/multer.uploads.js";
import { deleteFileError } from "../../middlewares/delete.file.on.errors.js";
const api = Router()

// Rutas publicas
api.post('/register',
    [
        uploadProfilePicture.single('profilePicture'),
        registerValidator,
        deleteFileError
    ],
    register
)

api.post(
    '/login',
    [
        LoginValidator
    ],
    login
)

//Rutas privadas
                //Middleware
api.get('/test', validateJwt, test)

// Exportar
export default api