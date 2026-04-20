import { createToken } from "./signup.js"
import { USER } from "../../model/user.js"
import bcrypt from "bcryptjs"
export const signin = async (req,res) => {
    try {
        const {email, password} = req.body
        const ifUserExists = await USER.findOne({email})
        if (!ifUserExists) {
            return res.status(404).json({message: "User not found"})
        }

        const checkPassword = await bcrypt.compare(password, ifUserExists.password)
        if (!checkPassword) {
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token = createToken({id:ifUserExists._id, name:ifUserExists.name , email:ifUserExists.email})

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        res.status(200).json({
  user: {
    id: ifUserExists._id,
    name: ifUserExists.name,
    email: ifUserExists.email,
  },
  token
});

        
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: "signin failed"})
    }
}