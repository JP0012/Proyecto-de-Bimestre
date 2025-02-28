// Logica de autenticacioin 
import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

// Test 
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

// Register 
export const register = async (req ,res) => {
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.role = data.role || "CLIENT"
        await user.save()
        return res.send({message: `Registered succesfully, can be logged with username: ${user.username}`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}



// Login 
export const login = async (req, res) => {
    try {
        let { userLoggin, password} = req.body
        let user = await User.findOne(
            {
                $or: [  //Subfuncion OR | espera un arreglo de busquedas
                    {email: userLoggin},
                    {username: userLoggin}
                ]
            }
        )  
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {  
                uid: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(400).send({message: 'Wrong email or password'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'General error with login fuction'})
    }
}