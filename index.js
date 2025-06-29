const express = require("express");
const fs = require("fs");

const e = require("express");

const app = express();
const PORT = 8000;
const mongoose = require("mongoose");


//connection
mongoose.connect('mongodb://127.0.0.1:27017/YouTube-app-1').then(() => {
    console.log("Connected to MongoDB");}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
});

//schema
const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender:{
        type: String,
        
    },
});
//model
const User = mongoose.model("User", userSchema);

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    fs.appendFile("./logs.txt", `${new Date().toISOString()} - ${req.method} ${req.url}\n`, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
        next();
    });
});
//routes
app.get("/user", async(req, res) => {
    const AllUsers = await User.find({});
    const html =`<ul>
        ${AllUsers.map((user) =>`<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>`;
    res.send(html);
});
app.get("api/user", (req, res) => {
    res.send(users);
});
app.get("/api/user/:id",async(req,res)=>{
    
    const user = await User.findById(req.params.id);
    return res.json(user);
})
app.post("/api/users", async(req, res) => {

    const body = req.body;
    if(!body.first_name || !body.email ||!body.last_name|| !body.job_title || !body.gender){
        return res.status(400).json({ status: "error", message: "All fields are required" });
    }
    const result = await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    jobTitle: body.job_title,
    gender: body.gender,
    
    });

    console.log(result);
   return res.status(201).json({message:"user created"});


});
app.patch("/api/user", (req, res) => {
    res.json({ status:"pending"});
    
});
app.delete("/api/user/:id", (req, res) => {
    const id = req.params.id;
    const userIndex = users.findIndex(user => user.id == id);
     if (userIndex !== -1) {
        users.splice(userIndex, 1);
        fs.writeFile("./dummy_users.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to update file" });
            }
            res.json({ status: "success", message: "User deleted" });
        });
    } else {
        res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({ status:"pending"});
    
});
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});