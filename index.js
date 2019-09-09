//test new repo with fork
const express = require("express");
const app = express();
const port = process.env.PORT || 8800;

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

const server = app.listen(port, (err)=>{
  if(err){
    console.log(err);
    return false;
  }
  
  console.log(port+" is opened");
});

var io = require("socket.io")(server);

/*
io.on("connection", (socket)=>{
  console.log(socket.id + " connected");
  
  socket.on("my_sticker", (data)=>{
    io.emit("sticker_received", data);
  });
});
*/
//namespace and rooms
var stspace = io.of("/sticker");

var num = 0;
stspace.on("connection", (socket)=>{
  console.log(socket.id + " connected");
  /*num++;
  if(num < 3){
    socket.join("room1");
  } else {
    socket.join("room2");
  }*/
  socket.on("join_room", (data)=>{
    socket.join(data.roomName);
  })
  
  //socket.join("name of the room")
  //io.to("name of the room").emit()
  //socket.leave("name of the room")
  
  socket.on("my_sticker", (data)=>{
    stspace.to(data.roomName).emit("sticker_received", data);
  });
});

var chatspace = io.of("/chat");
chatspace.on("connection", (socket)=>{
  chatspace.emit("user_connected");
  
  socket.on("typed_msg", (data)=>{
    console.log(data);
    chatspace.emit("new_msg", data);
    //stspace.emit("new_chat_sticker")
  })
});
