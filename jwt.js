const jwt = require('jsonwebtoken');

//generating token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.SECRET)
}

//verify token
const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token is required' });
    }
    //Extracting token from authorization header
    token = authHeader.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({ message: 'Token is required' }); //if token is missing or empty
        } else {
            const decoded = jwt.verify(token, process.env.SECRET);
            //console.log(decoded); //decoded gives id 
            req.user = decoded; //decoded have object with id in it
            next();
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = { generateToken, verifyToken };