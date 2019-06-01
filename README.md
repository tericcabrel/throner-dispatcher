# Concerto

This is a micro service built with NodeJS ond Socket.IO 
to manage communication between a client app and a queue manager like RabbitMQ
on dispox project

+ socket.io
+ joi
+ mongodb
+ winston
+ amqplib

## Installation

Clone the repository and do theses steps

```
git clone https://gitrepo.variancetechnologies.io/dillygence/concerto.git
cp .env.exampl .env
nano .env
mkdir log 
chmod 777 log
npm install
```

## Starting the server

```
npm start
```

