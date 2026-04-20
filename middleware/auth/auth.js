import jwt from "jsonwebtoken";
import { USER } from "../../model/user.js";


export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) 
            return res.status(401).json({message: "No token"})

        const decoded = jwt.verify(token , process.env.SECRET_KEY)
        console.log(decoded);
        

        const user = await USER.findById(decoded.id).select('-password')
        console.log(user);
        
        if(!user) return res.status(401).json({message: "user not found"})

        req.user = user
        next()
    } catch(error) {
        res.status(401).json({message: "unauthorized", error: error.message})
    }
}