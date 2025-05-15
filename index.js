const express = require("express");
const users = require("./dummy_users.json");
const app = express();
const PORT = 8000;
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
    res.json({ status:"pending"});

});
app.patch("/api/user", (req, res) => {
    res.json({ status:"pending"});
    
});
app.delete("/api/user", (req, res) => {
    res.json({ status:"pending"});
    
});
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});