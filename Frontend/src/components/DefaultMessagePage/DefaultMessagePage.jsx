import React, { useContext } from "react";
import { InstagramMessageIcon } from "../InstagramIcons/InstagramIcons";
import NewMessageDialogBox from "../DialogBoxes/NewMessageDialogBox";
import { MyContext } from "../../context/MyContext";

const DefaultMessagePage = () => {
    const { dialogBox } = useContext(MyContext);

    return (
        <>
            <div
                className={`fixed w-dvw h-dvh bg-black bg-opacity-70 ${
                    dialogBox ? "grid place-items-center" : "hidden"
                } `}
            >
                <NewMessageDialogBox />
            </div>
            <div
                className="message-right-section flex justify-center items-center flex-col gap-5
             max-[480px]:hidden border-[rgb(54,54,54)] border-l-[1px] w-[calc(100dvw_-_100px)] min-[900px]:w-[calc(100dvw_-_400px)] max-[767px]:w-[calc(100dvw_-_72px)]"
            >
                <div className="icon">
                    <InstagramMessageIcon />
                </div>
                <div className="message-send flex flex-col gap-2 items-center">
                    <p className="your-messages text-xl text-center">
                        Your Messages
                    </p>
                    <p className="text-[rgb(113,111,111)] text-center text-[15px]">
                        Send private photos and messages to a friend or group.
                    </p>
                    <button className="send-message-btn text-[14px] bg-[rgb(0,149,246)] min-w-0 py-[6.3px] px-[7px] font-bold rounded-lg hover:bg-[rgb(0,120,255)]">
                        Send Messages
                    </button>
                </div>
            </div>
        </>
    );
};

export default DefaultMessagePage;
