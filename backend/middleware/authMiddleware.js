const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        console.log("TOKEN:", authHeader);

        const token = authHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "No token, Authorization denied" });
        }

        // ✅ THIS MUST BE OUTSIDE if
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = authMiddleware;