import * as signalR from '@microsoft/signalr';
import { CustomLogger } from "./customLogger";
let btnJoinYellow = document.getElementById("btnJoinYellow");
let btnJoinBlue = document.getElementById("btnJoinBlue");
let btnJoinOrange = document.getElementById("btnJoinOrange");
let btnTriggerYellow = document.getElementById("btnTriggerYellow");
let btnTriggerBlue = document.getElementById("btnTriggerBlue");
let btnTriggerOrange = document.getElementById("btnTriggerOrange");
//create connection
let connection = new signalR.HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Trace)
    //implementing custom logger
    .configureLogging(new CustomLogger())
    .withUrl('/hubs/view').withUrl("/hubs/color").build();
btnJoinYellow === null || btnJoinYellow === void 0 ? void 0 : btnJoinYellow.addEventListener("click", () => { connection.invoke("JoinGroup", "Yellow"); });
btnJoinBlue === null || btnJoinBlue === void 0 ? void 0 : btnJoinBlue.addEventListener("click", () => { connection.invoke("JoinGroup", "Blue"); });
btnJoinOrange === null || btnJoinOrange === void 0 ? void 0 : btnJoinOrange.addEventListener("click", () => { connection.invoke("JoinGroup", "Orange"); });
btnTriggerYellow === null || btnTriggerYellow === void 0 ? void 0 : btnTriggerYellow.addEventListener("click", () => { connection.invoke("TriggerGroup", "Yellow"); });
btnTriggerBlue === null || btnTriggerBlue === void 0 ? void 0 : btnTriggerBlue.addEventListener("click", () => { connection.invoke("TriggerGroup", "Blue"); });
btnTriggerOrange === null || btnTriggerOrange === void 0 ? void 0 : btnTriggerOrange.addEventListener("click", () => { connection.invoke("TriggerGroup", "Orange"); });
// on view update message from server
connection.on('viewCountUpdate', (value) => {
    const counter = document.getElementById('viewCounter');
    if (counter) {
        counter.textContent = value.toString();
    }
    else {
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
//# sourceMappingURL=index.js.map