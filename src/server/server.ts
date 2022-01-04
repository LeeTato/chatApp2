import express from "express";
import cors from "cors";
import * as socketIO from "socket.io";
import http from 'http';
import mongoose from "mongoose";
// import dotenv from "dotenv";
import path from 'path';
import { ChatModel } from "./schemas/chat.schema.js";
import { UserModel } from "./schemas/user.schema.js";
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const clientPath = path.join(__dirname, '/dist/client');
app.use(express.static(clientPath));


//the serverSocketIo listen whatever incoming command on the server 
const serverSocketIo = new socketIO.Server(server,  { cors: {
  origin: '*'
}});
mongoose.connect("mongodb://localhost:27017/chat").then(() => {
    console.log("Connected to Chat DB Successfully");
  }) .catch((err) => console.log("Failed to Connect to DB", err));

const PORT = process.env.PORT || 3000;

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4200']
}));

//is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. 
//This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({message: "Hello World!"});
});

//create chat app
app.post("/create-chat", function(req,res){
  const{sender,text,to} = req.body;
  const chat = new ChatModel({
    sender,
    to,
    text,

  });
  chat
  .save()
  .then((data)=>{
    res.json({ data })
  })
  .catch((err) => {
    res.status(501);
    res.json({ errors: err });
  });
})

//create user
app.post("/create-user", function(req,res){
  const{name,username,email,password} = req.body;
  const chat = new UserModel({
   name,username,email,password
  });
  chat
  .save()
  .then((data)=>{
    res.json({ data })
  })
  .catch((err) => {
    res.status(501);
    res.json({ errors: err });
  });
})


server.listen(PORT, function () {
  console.log(`starting at localhost http://localhost:${PORT}`);
});

// Run when server connected 
serverSocketIo.on('connection', function(clientSocket){
//when the client send the client with join route the server send the answer with new-user-joined 
  clientSocket.on('join', function(data){
    clientSocket.join(data.room);
    serverSocketIo.emit('userJoined', {user:data.user, message:'joined.'})
  });

  //client to leave
  clientSocket.on('leave', function(data){
    serverSocketIo.emit('left-room', {user:data.user, message:'left-room.'})

    // send message
    clientSocket.on('message', function(data){
      serverSocketIo.in(data.room).emit('new-message',{user:data.user, message:data.message})
    });

    clientSocket.on('disconnect', function(){
      serverSocketIo.emit('message ', 'A user has left the chat ')
  });
   // BroadCast when  a user connect 
   clientSocket.broadcast.emit('message', 'A user has joined the chat');

   
});

})

