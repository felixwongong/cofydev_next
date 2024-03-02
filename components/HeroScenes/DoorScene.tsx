import {useCompStore} from "../ThreeScene/ThreeScene";
import {Camera, Group, Scene, Vector3} from "three";
import {useContext, useEffect, useRef} from "react";
import {ComponentType} from "../ThreeScene/SceneComponentStore";
import {setPosition} from "../ThreeUtil";
import Tween from "three/examples/jsm/libs/tween.module";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {globalHeroContext, HeroState} from "../HeroState";

export default function DoorScene() {
    const {state, setState} = useContext(globalHeroContext);
    const compStore = useCompStore();
    const doorRoot = useRef<Group>(new Group());

    function loadDoor() {
        const scene: Scene = compStore.getData(ComponentType.Scene).current!;
        const camera: Camera = compStore.getData(ComponentType.Camera).current!;
        const assetLoader = compStore.assetLoader;

        doorRoot.current.name = "doorRoot";
        doorRoot.current.scale.set(0, 0, 0);
        scene.add(doorRoot.current);
        camera.position.z = 10;

        assetLoader("/asset/Door_A.fbx").then(obj => {
            setPosition(obj, new Vector3(-80, 0, 0))
            doorRoot.current.add(...obj)
        });

        assetLoader("/asset/Wall_Doorway.fbx").then(obj => {
            doorRoot.current.add(...obj)
            new Tween.Tween(doorRoot.current!.scale)
                .to({x: 0.01, y: 0.01, z: 0.01}, 1000)
                .easing(Tween.Easing.Elastic.Out)
                .start();

            const clickableIcon = document.createElement("img");
            clickableIcon.src = "asset/click.gif";
            clickableIcon.width = 500;
            clickableIcon.height = 500;
            clickableIcon.classList.add("h-10")
            clickableIcon.classList.add("w-10")
            const clickableIconLabel = new CSS2DObject(clickableIcon);
            clickableIconLabel.position.set(70, 70, 0);
            doorRoot.current!.add(clickableIconLabel);
        });
    }

    useEffect(() => {
        return () => {
            if(state == HeroState.Awake) {
                loadDoor()
            }
        };
    }, [state]);


    return (
        <div>
        </div>
    )
}
