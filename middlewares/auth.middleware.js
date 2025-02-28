import jwt from 'jsonwebtoken';

export const verifyClient = (req, res, next) => {
    const token = req.authorization['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        if (decoded.role !== 'CLIENT') {
            return res.status(403).send({ message: 'You do not have the required role' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ message: 'Error verifying token or user role' });
    }
};
