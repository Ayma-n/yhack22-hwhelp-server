import { Server} from "socket.io";
import {addPersonToQueue, checkMatchesInQueueForGivenPerson as checkMatchesInQueueForGivenPerson} from './people.js';

export function setupWebSockets(httpServer: any, options: Object) {
    const io = new Server(httpServer, options);
  
    io.on("connection", (socket) => {
      console.log(socket);
      // adds info about student/tutor to data structure
      socket.on("setup info for queue", (infoObj) => {
        console.log(infoObj);
        addPersonToQueue({...infoObj, socketId: socket.id});
        // for each person on queue, check if they have matched with anyone
        // TODO: fix, this is not good design
        const timer = setInterval(checkMatchesInQueueForGivenPerson, 8000, socket, infoObj);
      });
      // sends when a student connects to a tutor
      socket.on("private message", ({ content, to }) => {
        socket.to(to).emit("private message", {
          content,
          from: socket.id,
        });
      });
    });
  }