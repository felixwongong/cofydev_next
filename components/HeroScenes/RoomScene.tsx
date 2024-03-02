import {useCompStore} from "../ThreeScene/ThreeScene";
import {Camera, Group, Scene, Vector3} from "three";
import {useContext, useEffect, useRef} from "react";
import {ComponentType} from "../ThreeScene/SceneComponentStore";
import {setPosition, setRotation} from "../ThreeUtil";
import Tween from "three/examples/jsm/libs/tween.module";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {globalHeroContext, HeroState} from "../HeroState";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function RoomScene() {
    const {state, setState} = useContext(globalHeroContext);
    const compStore = useCompStore();
    const roomRoot = useRef<Group>(new Group());

    function loadRoom() {
        const scene: Scene = compStore.getData(ComponentType.Scene).current!;
        const camera: Camera = compStore.getData(ComponentType.Camera).current!;
        const controls: OrbitControls = compStore.getData(ComponentType.Control).current!;
        const assetLoader = compStore.assetLoader;

        roomRoot.current.name = "roomRoot";
        roomRoot.current.scale.set(.01, .01, .01);
        scene.add(roomRoot.current);
        controls.target = roomRoot.current.position.add(new Vector3(0, -5, 0));

        assetLoader("/asset/desk_large.fbx").then(obj => roomRoot.current.add(...obj));
        assetLoader("/asset/keyboard.fbx").then(obj => {
            setPosition(obj, new Vector3(-20, 100, 30));
            roomRoot.current.add(...obj)
        });
        assetLoader("/asset/gameconsole_handheld.fbx").then(obj => {
            setPosition(obj, new Vector3(140, 100, 20));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            roomRoot.current.add(...obj)
        });
        assetLoader("/asset/lamp_desk.fbx").then(obj => {
            setPosition(obj, new Vector3(175, 100, -40));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            roomRoot.current.add(...obj)
        });
        assetLoader("/asset/monitor.fbx").then(obj => {
            setPosition(obj, new Vector3(-100, 100, -50));
            setRotation(obj, new Vector3(-1.571, 0, 0.4))

            const another = obj.map(x => x.clone())
            setPosition(another, new Vector3(60, 100, -50));
            setRotation(another, new Vector3(-1.571, 0, -0.4))

            roomRoot.current.add(...obj)
            roomRoot.current.add(...another)
        });
        assetLoader("/asset/mouse.fbx").then(obj => {
            setPosition(obj, new Vector3(50, 100, 30));
            roomRoot.current.add(...obj)
        });
        assetLoader("/asset/mousepad_large_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 100, 30));
            roomRoot.current.add(...obj)
        });

        assetLoader("/asset/chair_desk_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 0, 90));
            setRotation(obj, new Vector3(-1.571, 0, 3))
            roomRoot.current.add(...obj)
        });
    }

    useEffect(() => {
        return () => {
            if(state == HeroState.Awake) {
                loadRoom();
            }
        };
    }, [state]);


    return (
        <div>
        </div>
    )
}
