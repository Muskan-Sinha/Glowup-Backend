export const logout = (req,res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: 'strict'
        })

        return res.status(200).json({message: "Logged out successfully"})
}