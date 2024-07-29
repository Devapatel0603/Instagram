import { io } from "../socket.io.js";

const emitEvents = (event, members, data) => {
    members.forEach((member) => {
        io.to(member).emit(event, data);
    });
};

export { emitEvents };
