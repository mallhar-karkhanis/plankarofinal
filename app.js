const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const wrapAsync=require("/Users/malharkarkhanis/Desktop/Major/utils/wrapAsync.js");
const ExpressError=require("/Users/malharkarkhanis/Desktop/Major/utils/ExpressError.js");
const methodOverride=require("method-override");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.use(express.urlencoded({extended:true}));

const ejsMate=require("ejs-mate");
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const session=require("express-session");

const flash=require("connect-flash");



const sessionOptions={
    
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,


    cookie:{

        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,


    },
    

   
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





let port =8080;
main().then(()=>{

    console.log("connected to DB");


}).catch(err=>{
    console.log(err);
});

async function main(){

    await mongoose.connect("mongodb://127.0.0.1:27017/ventura");




}

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"

    });

 let registeredUser=await User.register(fakeUser,"helloworld");
 res.send(registeredUser);


});




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)



app.use((err,req,res,next)=>{

  let{statusCode=500,message="Something went wrong"}=err;

  res.status(statusCode).render("/Users/malharkarkhanis/Desktop/Major/views/listings/error.ejs",{message});

})
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});


