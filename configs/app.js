"use strict"

import express from 'express' 
import morgan from 'morgan' 
import helmet from 'helmet' 
import cors from 'cors' 
import authRoutes from '../src/auth/auth.routes.js'
import { limiter } from '../middlewares/rate.limit.js'
import userRoutes from '../src/user/user.routes.js'
import productRoutes from '../src/product/product.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'
import { defaultCategory } from '../src/category/category.controller.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/product', productRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/cart',cartRoutes)
    app.use('/v1/invoice',invoiceRoutes)
}

// ESModulesno acepta exports.
export const initServer = async() => {
    const app = express() 
    try {
        configs(app)
        routes(app)
        defaultCategory()
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (err) {
        console.log('Server init failed', err)
    }
}

/*

       BRO ENTRE A POSTMANT Y IBA A CAMBIAR A MI CUENTA PERO ME DI CUENTA QUE EN USUARIOS TENES QUE EL REGISTER PUEDA INGRESAR SU ROL Y NO DEBE SER ASI
       TIENE QUE TENER POR DEFAULT CLIENT 

*/
