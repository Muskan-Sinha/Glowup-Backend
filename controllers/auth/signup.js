import jwt from "jsonwebtoken"
import { USER } from "../../model/user.js"
import bcrypt from "bcryptjs";

export const createToken = (payload) => {
    const options = {
        expiresIn: '1h'
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, options);
    return token;
};

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const isUser = await USER.findOne({ email })
        console.log(isUser);


        if (isUser) {
            return res.status(409).json({ message: "User already exists" })
        }
        else {
            // const user = await USER.create({
            //     name,email,password
            // })
            // console.log(user);

            const hashedPasswrod = await bcrypt.hash(password, 10)

            const newUser = new USER({
                name, email, password: hashedPasswrod
            });

            await newUser.save();

            const token = createToken({ id: newUser._id, name: newUser.name, email: newUser.email });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

            res.status(200).json({
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                token
            });

        }
    }
    catch (error) {
        console.log(error);

        res.status(500).json({ message: "Signup failed" })
    }
}