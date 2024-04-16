import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";
import qr from "qr-image";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})

app.post("/generate",(req,res)=>{
    const URL = req.body.URL;
    const qr_svg = qr.image(URL);
    qr_svg.pipe(fs.createWriteStream("public/qr_image.png"));

    fs.writeFile("public/URL.txt",URL,(err)=>{
        if(err){
            console.log("error saving url ",err);
            res.status(500).send("error generating qr code");
        }else{
            console.log("qr code generated");
            res.status(200).redirect("/image.html")
        }
    });

})



app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})