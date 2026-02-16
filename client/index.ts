import * as signalR from '@microsoft/signalr';

//create connection
let connection = new signalR.HubConnectionBuilder().withUrl('/hubs/view').build();

// on view update message from server
connection.on('viewCountUpdate', (value: number) => {
    const counter = document.getElementById('viewCounter');
    if (counter) {
        counter.textContent = value.toString();
    } else {
        console.warn('viewCounter element not found');
    }
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
