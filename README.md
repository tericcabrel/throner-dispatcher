# Throner Dispatcher

Dispatch request between throner-api, throner-iot and throner-web 

### Description
This project listen request coming from the client through web socket, identity the action to do and the service to call then do the request. It also listen request coming from the IOT app and send to the client.<br>
**Example: Battery status, send command to the drone**
 

### Installation
```
git clone https://github.com/tericcabrel/throner-dispatcher.git
yarn install
cp .env.example .env
nano .env
```

### Start the server
```
yarn start
```

The server will run on port 5991. You can change this by editing `.env` file.

### Project
To view all the repositories involved on this project, follow the link below<br>
[View Throner project](https://github.com/tericcabrel/throner)
