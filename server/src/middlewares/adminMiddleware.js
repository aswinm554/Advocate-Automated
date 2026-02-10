const adminMiddleware = (req, res, next) => {
    try {
        if (req.user && req.user.role === "admin") {
            return next();
        }

        return res.status(403).json({ message: "Access denied. Admin only." });

    } catch (error) {
        return res.status(500).json({
            message: "Authorization error"
        });
    }
};

export default adminMiddleware;



