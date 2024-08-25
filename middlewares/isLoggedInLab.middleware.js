const jwt = require('jsonwebtoken');
const labAuthModel = require("../modules/lab/lab/lab.model");

module.exports = async (req, res, next) => {
    
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
        const auth = jwt.verify(token, process.env.JWT_SECRET);

        if (!token) {
            res.status(401).json({ message: 'Authorized token not find', data: null, status: 401, success: false });
            next();
            return;
        }

        const user = await labAuthModel.findById(auth._id);
        if (user) {
            req.user = user;
        } else {
            res.status(401).json({ message: 'You are not authorized', data: null, status: 401, success: false });
        }
        next();
    } catch (e) {
        res.status(401).json({ message: 'Unauthorized', data: null, status: 401, success: false });
    }
};