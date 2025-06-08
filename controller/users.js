const User=require("../models/user.js");

module.exports.signUp=async(req,res)=>{
    res.render("user/signup.ejs");
}
module.exports.postSignup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust..!");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");
    }
}
module.exports.login=async(req,res)=>{
    res.render("user/login.ejs");
}
module.exports.postLogin= async(req,res)=>{

    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}