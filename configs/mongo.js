// Conexion a la BD 
import mongoose from "mongoose";

export const connect = async () => {
    try {
        //Ciclo de vida de Mongo
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | could not be connect to Mongodb')
        })
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | try connecting')
        })
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB |connected to mongodb')
        })
        mongoose.connection.on('open', ()=>{
            console.log('MongoDB |connected to database')
        })
        mongoose.connection.on('recconnected', ()=>{
            console.log('MongoDB | reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected')
        })

        // Conectar a la BD 
        await mongoose .connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize: 50,   //maximo de conexiones
                serverSelectionTimeoutMS: 5000  //Tiempo maximo parea intentar conectar
            }
        )
    } catch (err) {
        console.log('Database connection failed', err)
    }
}