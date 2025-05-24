const express = require("express");
const fs = require("fs");
const users = require("./dummy_users.json");
const e = require("express");
const app = express();
const PORT = 8000;
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
app.get("/user", (req, res) => {
    const html =`<ul>
        ${users.map(user =>`<li>${user.first_name}</li>`).join("")}
    </ul>`;
    res.send(html);
});
app.get("api/user", (req, res) => {
    res.send(users);
});
app.get("/api/user/:id",(req,res)=>{
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    res.send(user);
})
app.post("/api/user", (req, res) => {

    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFileSync("./dummy_users.json", JSON.stringify(users, null, 2) ,(err,data)=>{

        res.json({ status:"success", user: body });
    });
    console.log(body);


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