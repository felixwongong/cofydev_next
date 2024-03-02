import {useContext, useEffect, useRef} from "react";
import * as THREE from "three";
import {Group, Object3D, Vector3} from "three";
import "../ThreeUtil";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCamera, render, setPosition, setRotation} from "../ThreeUtil";
import {CSS2DObject, CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import Tween from "three/examples/jsm/libs/tween.module";
import {globalHeroContext, HeroState} from "../HeroState";

export default function RoomScene() {
    const {state, setState} = useContext(globalHeroContext);

    const containerRef = useRef<null | HTMLDivElement>(null);
    const sceneCreated = useRef<boolean>(false);

    const renderer = useRef<null | THREE.WebGLRenderer>(null);
    const renderer2D = useRef<null | CSS2DRenderer>(null);
    const scene = useRef<null | THREE.Scene>(null);
    const camera = useRef<null | THREE.PerspectiveCamera>(null);
    const controls = useRef<null | OrbitControls>(null);
    const loader = useRef<null | FBXLoader>(null);
    const roomRoot = useRef<Group>(new Group());
    const doorRoot = useRef<Group>(new Group());

    function createRenderer() {
        renderer.current = new THREE.WebGLRenderer({alpha: true});
        //Absolute such that container size would restricted by canvas size
        renderer.current!.domElement.classList.add("absolute");
        containerRef.current?.appendChild(renderer.current!.domElement);

        renderer2D.current = new CSS2DRenderer();
        renderer.current!.domElement.classList.add("absolute");
        containerRef.current?.appendChild(renderer2D.current!.domElement);

        onContainerResize()
    }

    function onContainerResize() {
        console.log("Resizing 3D canvas")
        if(renderer.current == null){
            console.error("canvas renderer not found");
            return;
        }

        const width = containerRef.current!.offsetWidth;
        const height = containerRef.current!.offsetHeight;

        renderer.current!.setSize(width,height);
        renderer2D.current!.setSize(width, height);
        camera.current!.aspect = width / height;
        camera.current!.updateProjectionMatrix();
    }

    function createOrbital() {
        const controls = new OrbitControls(camera.current!, renderer.current!.domElement)
        controls.enableDamping = true
        controls.autoRotate = true;
        controls.enablePan = false;
        return controls;
    }

    function animate() {
        requestAnimationFrame(animate);

        if(controls.current != null) {
            controls.current!.update()
        }
        Tween.update()

        render(renderer.current!, renderer2D.current!, scene.current!, camera.current!)
    }

    function loadAsset(path: string): Promise<Object3D[]> {
        let resolveFunc: (value: Object3D[]) => void;
        let rejectFunc: (reason?: any) => void;
        const loadPromise = new Promise<Object3D[]>((resolve, reject) => {
            resolveFunc = resolve;
            rejectFunc = reject;
        });
        loader.current!.load(
            path,
            (object) => {
                resolveFunc (object.children)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
        return loadPromise;
    }

    function loadRoom() {
        roomRoot.current.name = "roomRoot";
        roomRoot.current.scale.set(.01, .01, .01);
        scene.current!.add(roomRoot.current);
        controls.current!.target = roomRoot.current.position.add(new Vector3(0, -5, 0));

        loadAsset("/asset/desk_large.fbx").then(obj => roomRoot.current.add(...obj));
        loadAsset("/asset/keyboard.fbx").then(obj => {
            setPosition(obj, new Vector3(-20, 100, 30));
            roomRoot.current.add(...obj)
        });
        loadAsset("/asset/gameconsole_handheld.fbx").then(obj => {
            setPosition(obj, new Vector3(140, 100, 20));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            roomRoot.current.add(...obj)
        });
        loadAsset("/asset/lamp_desk.fbx").then(obj => {
            setPosition(obj, new Vector3(175, 100, -40));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            roomRoot.current.add(...obj)
        });
        loadAsset("/asset/monitor.fbx").then(obj => {
            setPosition(obj, new Vector3(-100, 100, -50));
            setRotation(obj, new Vector3(-1.571, 0, 0.4))

            const another = obj.map(x => x.clone())
            setPosition(another, new Vector3(60, 100, -50));
            setRotation(another, new Vector3(-1.571, 0, -0.4))

            roomRoot.current.add(...obj)
            roomRoot.current.add(...another)
        });
        loadAsset("/asset/mouse.fbx").then(obj => {
            setPosition(obj, new Vector3(50, 100, 30));
            roomRoot.current.add(...obj)
        });
        loadAsset("/asset/mousepad_large_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 100, 30));
            roomRoot.current.add(...obj)
        });

        loadAsset("/asset/chair_desk_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 0, 90));
            setRotation(obj, new Vector3(-1.571, 0, 3))
            roomRoot.current.add(...obj)
        });
    }

    function loadDoor() {
        doorRoot.current.name = "doorRoot";
        doorRoot.current.scale.set(0, 0, 0);
        scene.current!.add(doorRoot.current);
        camera.current!.position.z = 10;

        loadAsset("/asset/Door_A.fbx").then(obj => {
            setPosition(obj, new Vector3(-80, 0, 0))
            doorRoot.current.add(...obj)
        });
        loadAsset("/asset/Wall_Doorway.fbx").then(obj => {
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
        if (!sceneCreated.current && typeof window !== "undefined") {
            //Initialization
            sceneCreated.current = true
            scene.current = new THREE.Scene();
            camera.current = createCamera()
            createRenderer()
            window.addEventListener("resize", onContainerResize);
            loader.current = new FBXLoader()

            const ambient = new THREE.AmbientLight(0xF3E1BF, 5);
            scene.current!.add(ambient)
            // loadRoom();
            loadDoor()

            animate()
        }

        if(state) {
            if (state == HeroState.Started) {
                new Tween.Tween(camera.current!.position)
                    .to({x: 0, y: 2, z: 4.5}, 1000)
                    .easing(Tween.Easing.Quadratic.InOut)
                    .start();
            }
        }
    }, [state]);


    return (
        <div ref={containerRef} className="w-full h-full"/>
    )
}
