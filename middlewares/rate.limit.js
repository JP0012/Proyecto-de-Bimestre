// Limitar la cantidad de solicitudes en cierto tiempo

import rateLimit from "express-rate-limit";

export const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000, //rango de tiempo
        max: 100, //cantidad de peticiones en en tiempo
        message: {
            message: "You'r blocked"
        }

    }
)