'use strict'

import { hash, verify } from "argon2"
import argon2 from "argon2"

// Encriptar la password
export const encrypt = async (password) => {
    try {
        return await hash(password)
    } catch (err) {
        console.error(err)
        return err
    }
}

export const checkPassword = async (hashedPassword, plainPassword) => {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
        console.error("Error verifying password:", err);
        throw err;
    }
};