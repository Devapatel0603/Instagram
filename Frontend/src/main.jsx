import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";
import { MyContextProvider } from "./context/MyContext";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketProvider } from "./socket.io";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <MyContextProvider>
            <SocketProvider>
                <BrowserRouter>
                    <App />
                    <ToastContainer
                        autoClose={2700}
                        hideProgressBar={true}
                        bodyClassName="grow-font-size"
                        theme="dark"
                        closeOnClick
                        transition={Zoom}
                    />
                </BrowserRouter>
            </SocketProvider>
        </MyContextProvider>
    </Provider>
);
