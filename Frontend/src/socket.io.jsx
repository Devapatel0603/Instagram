import { createContext, useMemo } from "react";
import io from "socket.io-client";
import { setFollowRequests } from "./redux/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io(import.meta.env.VITE_BACKEND_URL_FOR_SOCKET, {
            withCredentials: true,
        });
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };
