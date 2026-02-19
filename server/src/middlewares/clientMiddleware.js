const clientMiddleware = (req, res, next)=>{
    try{
        if(req.user && req.user.role === "client" && req.user.isVerified === true){
            return next();
        }
        return res.status(403).json({message: "Access denies. Client only."})
    } catch (error) {
        return res.status(500).json({
            message: "Authorization error"
        });
    }
}
export default clientMiddleware;