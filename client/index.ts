import * as signalR from '@microsoft/signalr';
import { CustomLogger } from "./customLogger";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack"


let btnJoinYellow = document.getElementById("btnJoinYellow");
let btnJoinBlue = document.getElementById("btnJoinBlue");
let btnJoinOrange = document.getElementById("btnJoinOrange");
let btnTriggerYellow = document.getElementById("btnTriggerYellow");
let btnTriggerBlue = document.getElementById("btnTriggerBlue");
let btnTriggerOrange = document.getElementById("btnTriggerOrange");

//create connection
let connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    //.configureLogging(signalR.LogLevel.Trace)
    //implementing custom logger
    .configureLogging(new CustomLogger())
    .withHubProtocol(new MessagePackHubProtocol())
    .withUrl('/hubs/view').build();
let colorConnection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    //.configureLogging(signalR.LogLevel.Trace)
    //implementing custom logger
    .configureLogging(new CustomLogger())
    .withHubProtocol(new MessagePackHubProtocol())
    .withUrl("/hubs/color").build();

let body = document.getElementsByTagName("body")[0];

// Connection Events
connection.onreconnected((connectionId?: string) => {
    body.style.backgroundColor = "green";
});

connection.onreconnecting((error?: Error) => {
    body.style.backgroundColor = "yellow";
});

connection.onclose((error?: Error) => {
    body.style.backgroundColor = "red";
});


btnJoinYellow?.addEventListener("click", () => { connection.invoke("JoinGroup", "Yellow"); });
btnJoinBlue?.addEventListener("click", () => { connection.invoke("JoinGroup", "Blue"); });
btnJoinOrange?.addEventListener("click", () => { connection.invoke("JoinGroup", "Orange"); });

btnTriggerYellow?.addEventListener("click", () => { connection.invoke("TriggerGroup", "Yellow"); });
btnTriggerBlue?.addEventListener("click", () => { connection.invoke("TriggerGroup", "Blue"); });
btnTriggerOrange?.addEventListener("click", () => { connection.invoke("TriggerGroup", "Orange"); });


// on view update message from server
connection.on('viewCountUpdate', (value: number) => {
    const counter = document.getElementById('viewCounter');
    if (counter) {
        counter.textContent = value.toString();
    } else {
        console.warn('viewCounter element not found');
    }
});

connection.on("triggerColor", (color) => {
    document.getElementsByTagName("body")[0].style.backgroundColor = color;
});

//notify server we're watching
function notify() {
    connection.send('notifyWatching').catch(err => console.error(err.toString()));
}

//start connection
function startSuccess() {
    console.log('Connection started!');
    notify();
}

function startFail() {
    console.log('Connection failed to start!');
}
connection.start()
  .then(startSuccess)
  .catch(err => {
    startFail();
    console.error(err.toString());
  });
