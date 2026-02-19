const juniorMiddleware = (req, res, next)=>{
    try{
        if(req.user && req.user.role === "junior_advocate" && req.user.isVerified === true){
            return next();
        }
        return res.status(403).json({message: "Access denies. Junior advocate only."})
    } catch (error) {
        return res.status(500).json({
            message: "Authorization error"
        });
    }
}
export default juniorMiddleware;