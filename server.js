import express from 'express'
import connectToDatabase from './db.js'
import cors from 'cors'
const app=express()
const port=3000
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3001"
}));
 let db;



app.listen(port,async()=>{
    console.log(`my todo app is running at port ${port}`);
    db=await connectToDatabase('todo-project-db')
})

//api section
app.get('/test',(req,res)=>{
    res.send("API is UP")
})
//1..
app.post('/create-todo',async(req,res)=>{
    try{
        let body=req.body;
        await db.collection('todo').insertOne(body);
        res.status(201).json({msg:"todo inserted successfully"})
    }catch(error){
        res.status(500).json({msg:"internal server error"})
    }
})
//2..
app.get('/read-todos',async (req,res)=>{
    try{
        let todolist=await db.collection('todo').find().toArray();
        res.status(200).json(todolist)
    }catch(error){
        res.status(500).json({msg:"internal server error"})
    }
})
//3..
app.get('/read-todo',async (req,res)=>{
    try{
        let querytodoid=req.query.todoid;
        let todo=await db.collection('todo').findOne({'todoid':querytodoid})
        res.status(200).json(todo)
    }catch(error){
        res.status(500).json({
            msg:"internal server error",
            error:error.message
        })
    }
})
//4..
app.patch('/update-todo',async (req,res)=>{
    try{
        let querytodoId=req.query.todoId;
        let reqBody=req.body;
        let result=await db.collection('todo').updateOne({"todoId":querytodoId},{$set:reqBody})
        if(result.matchedCount===0){
            res.status(404).json({msg:'todo not found'})
        }else
            res.status(201).json({msg:'todo updated successfully'})
    }catch(error){
         res.status(500).json({
            msg:"internal server error",
            error:error.message
        })
    }
})
//5..
app.delete('/delete-todo',async(req,res)=>{
    try{
        let queryToDoId=req.query.todoid;
        let result=await db.collection('todo').deleteOne({'todoid':queryToDoId})
        if(result.deletedount===0){
            res.status(404).json({msg:'todo not found'})
        }else{
            res.status(201).json({msg:'todo deleted'})
        }
    }catch(error){
         res.status(500).json({
            msg:"internal server error",
            error:error.message
        })
    }
})