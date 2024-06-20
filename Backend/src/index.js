import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { server } from "./socket.io.js";

dotenv.config({
    path: "./.env",
});

connectDB()
    .then(() => {
        server.listen(4000, () => {
            console.log("Server is running at port 4000");
        });
    })
    .catch((error) => {
        console.log("MONGODB CONNECTION FAILED", error);
    });
