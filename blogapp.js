// Yash Jaiswal
var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodoverride=require("method-override"); 
var expresssanitizer=require("express-sanitizer");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodoverride("_method"));
app.use(expresssanitizer());

//mongoose
// mongoose.connect("mongodb://localhost/blog_app");
mongoose.connect("mongodb://yash:yash97@ds155087.mlab.com:55087/blogapp",{ useNewUrlParser: true });


var blogSchema=new mongoose.Schema({
    name:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var blog = mongoose.model("blog",blogSchema);

//REST
// blog.create(
//     {
//         name:"IIIT Allahabad",
//         image:"https://img.collegepravesh.com/2016/10/IIIT-Allahabad-310x165.jpg",
//         body:"This is a top institution"
//     });

app.get("/",function(req,res){
    res.redirect("/blogs");
});    

app.get("/blogs",function (req,res) {
    blog.find({},function(err,blogs){
        if(err)
            console.log(err);
        else
            res.render("index",{blogs:blogs});
    });

});
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});

app.post("/blogs",function (req,res){
    // console.log(req.body);
    req.body.blog.body=req.sanitize(req.body.blog.body);
    // console.log(req.body);
    blog.create(req.body.blog,function (err,newblog) {
 if(err)
     res.render("new.ejs")
        else
            res.redirect("/blogs");
    });
}

);


app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundblog)
    {
        if(err)
            res.redirect("/blogs");
        else
        // console.log(foundblog);
            res.render("show.ejs",{blog:foundblog})
    }
    )
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog)
    {
     if(err)
     res.redirect("/blogs");
     else
     res.render("edit",{blog:foundblog})
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);

    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs/"+req.params.id);
    })

    // res.send("updated");
})

app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    })
})


app.get("*",function(req,res){
    res.redirect("/blogs");
});    


app.listen(process.env.PORT||1500,function () {
    console.log("server ready");

});