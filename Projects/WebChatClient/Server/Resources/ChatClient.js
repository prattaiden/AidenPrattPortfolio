"use strict"

//getting elements from the html so they can be edited
const roomName = document.getElementById("RoomName");
const message = document.getElementById("Message");
//message.readOnly = true;
const userName = document.getElementById("UserName");

const chatDiv = document.getElementById("chatBox");
const UsersDiv = document.getElementById("statusBox");

const MSGButton = document.getElementById("messageSend");
const LeaveButton = document.getElementById("leave");
const SubButton = document.getElementById("submit");
let wsOpen = false;

let ws =  new WebSocket("ws://localhost:8080");
console.log("created the web socket");



ws.onopen = function (){
  console.log("ws is now open!!!")
  wsOpen = true;
  ws.send("hello");
}

//---------------------------------------ON MESSAGE------------------------------------
ws.onmessage = function (e) {
  //JSON from server to parse through the string
  console.log(e.data);
  let data = JSON.parse(e.data);

  //pargraph element for the message field of the app
  let msg = document.createElement("p");

  //if statement to check the type of data and ensure that a user and room is enterted in their fields
  if (data.type === "join" && data.user != "" && data.room != ""){
    //users element for the users field of the app
    let users = document.createElement("p");

    //sets the text content of msg element to the user and entering the room
    msg.textContent = data.user + " joined: " + data.room;

    //setting the text content of users to the name of the user
    users.textContent = data.user;
    //saving the user id as the data.user
    users.id = data.user;
    //adding the users to the users div
    //sending back to client
    UsersDiv.appendChild(users);
  }

  //if data from JSON is a message
  //makes so it empty messages cannot be sent
  if (data.type === "message" && data.message != "") {
    //text content is the output onto the chat screen
    msg.textContent =  data.user + ": " + data.message;
  }

  //if data from the JSON is leave
  if (data.type === "leave"){
    console.log("received leave msg")
    let userThatLeft = document.getElementById(data.user);
    //msg.textContent = "";
    msg.textContent = data.user + " left: " + data.room;
    UsersDiv.removeChild(userThatLeft);
    UsersDiv.innerHTML = "";

  }
  //sending the message type back to the client by appending the child
  chatDiv.appendChild(msg);
}

//-------------------------------------METHODS-------------------------------------------
function handleKeyPressForJoinRoom(e){
  if(!wsOpen){
    console.log("web socket is not open yet..");
  }

  if (e.keyCode === 13){ //13 is the enter key

    //string for the JSON to send to the web socket
    let joinJSON = {"type":"join", "user":userName.value, "room":roomName.value}
        //"join " + userName.value + " " + roomName.value;

    ws.send(JSON.stringify(joinJSON));

    userName.readOnly = true;
    roomName.readOnly = true;
//

  }
}

function handleClickJoinRoom(e){
  if(!wsOpen){
    console.log("web socket is not open yet...");
  }

  //if the action of pressing the button event is not null
  if (e != null){
    //string for JSON then sending to the web socket
    let joinJSON = "join " + userName.value + " " + roomName.value;

    ws.send(JSON.stringify(joinJSON));


    userName.readOnly = true;
    roomName.readOnly = true;

  }
}

function handleSendMessageEnter(e){
  if(!wsOpen){
    console.log("web socket is not open yet..");
  }

  if (e.keyCode === 13) {
    //string for JSON then sending to web socket
    let stringMessage= {"type":"message", "user":userName.value, "room":roomName.value, "message":message.value}

    ws.send(JSON.stringify(stringMessage));

    //erases what the user entered into the message field
    message.value = "";
  }
}

function handleSendMessageClick(e){
  if(!wsOpen){
    console.log("web socket is not open yet..");
  }

  if (e != null) {
    let stringMessage = "message " + message.value;

    ws.send(stringMessage);
    message.value = "";
  }
}

function handleEscape(e){
  if(!wsOpen){
    console.log("web socket is not open yet..");
  }
    let stringEscape = {"type":"leave", "user":userName.value, "room":roomName.value}
    ws.send(JSON.stringify(stringEscape));

  //can enter text into username field
  //username field set to empty
  userName.readOnly = false;
  userName.value = "";

  //can enter text into room field
  //room field set to empty
  roomName.readOnly = false;
  roomName.value = "";

  //cannot enter text into message field
  //set message field set to empty
  message.readOnly = true;
  message.value = "";

//removing any text from the chat and user fields
  UsersDiv.innerHTML = "";
  chatDiv.innerHTML = "";
}


//Listeners for joining a room and entering a username
userName.addEventListener("keypress", handleKeyPressForJoinRoom);
roomName.addEventListener("keypress", handleKeyPressForJoinRoom);
SubButton.addEventListener("click", handleClickJoinRoom);

//Listeners for sending a message
message.addEventListener("keypress", handleSendMessageEnter);
MSGButton.addEventListener("click", handleSendMessageClick);

//Listener for leaving the room
LeaveButton.addEventListener("click", handleEscape);


