
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const archiver = require("archiver");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
 destination: (req,file,cb)=>{
  cb(null,"uploads/");
 },
 filename:(req,file,cb)=>{
  const name = req.body.name.replace(/\s/g,"_");
  const time = Date.now();
  cb(null,`${name}_${time}_${file.originalname}`);
 }
});

const upload = multer({storage});

app.post("/upload", upload.array("photos",10), (req,res)=>{
 res.json({message:"업로드 완료"});
});

app.get("/list",(req,res)=>{

 const files = fs.readdirSync("uploads");

 const data = files.map(file=>{
  const name = file.split("_")[0];
  return {name,file};
 });

 data.sort((a,b)=>a.name.localeCompare(b.name));

 const uniqueUsers = [...new Set(data.map(d=>d.name))];

 res.json({
  files:data,
  count:uniqueUsers.length
 });

});

app.get("/download",(req,res)=>{

 const files = fs.readdirSync("uploads").sort();

 const archive = archiver("zip");

 res.attachment("photos.zip");

 archive.pipe(res);

 files.forEach(file=>{
  archive.file("uploads/"+file,{name:file});
 });

 archive.finalize();

});

app.post("/reset",(req,res)=>{

 const files = fs.readdirSync("uploads");

 files.forEach(f=>{
  fs.unlinkSync("uploads/"+f);
 });

 res.json({message:"초기화 완료"});

});

app.listen(3000,()=>{
 console.log("server running on 3000");
});
