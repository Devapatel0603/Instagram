import jwt from "jsonwebtoken";

const addJwtTokenToCookie = async (res, _id) => {
    const token = await jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 5,
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
};

export { addJwtTokenToCookie };
