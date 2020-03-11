const express = require('express')
const path = require('path')
const db = require('./db')
const {User, Department} = db.models

const app = express()

app.use(express.json());
app.use(require('cors')());

app.get("/api/users", (req,res,next)=>{
    User.findAll()
        .then(products=>res.send(products))
        .catch(next)
})
app.get("/api/departments", (req,res,next)=>{
    Department.findAll()
        .then(companies=>res.send(companies))
        .catch(next)

})
app.post('/api/users',async(req,res,next)=>{
    const user = req.body
    User.create(user).then(result=>res.send(result))
    })
app.post("/api/departments", (req,res,next)=>{
    const department = req.body
    Department.create(department).then(result=>res.send(result))
    })
app.put('/api/users/:id',async(req,res,next)=>{
    const user = req.body
    User.update(
        {
            name: user.name,
            departmentId: user.departmentId
        },
        {returning: true, where: {id: user.id} }
    ).then(result=>res.status(201).send(result))
    
    })
app.put("/api/departments/:id", (req,res,next)=>{
    const department = req.body
    Department.update(
        {name: department.name},
        {returning: true, where: {id: department.id} }
    ).then(result=>res.status(201).send(result))
    })
app.delete('/api/users/:id',async(req,res,next)=>{
    const id = req.params.id
    User.destroy(
        { where:{id:id}}
     ).then(result=>res.sendStatus(204))
    })
app.delete("/api/departments/:id", (req,res,next)=>{
    const id = req.params.id
    Department.destroy(
        { where:{id:id}}
     ).then(result=>res.sendStatus(204))
    })

const port = process.env.PORT || 3000

db.sync().then(()=>app.listen(port, ()=> console.log(`listening on port ${port}`)))