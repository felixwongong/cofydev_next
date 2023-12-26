import RoomScene from "../RoomScene/RoomScene";
import {useState} from "react";

export default function Hero() {
    const [opened, setOpened] = useState<boolean>(false);
    return (
        <div className="hero min-h-screen bg-base-200">
            {!opened ? <RoomScene/>: <div/>}
        </div>
    )
}
