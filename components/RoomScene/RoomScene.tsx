import {useEffect, useRef} from "react";
import * as THREE from "three";
import "../ThreeUtil";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Color, Group, Object3D, Quaternion, Vector3} from "three";
import {render, createCamera, setPosition, setRotation} from "../ThreeUtil";

export default function RoomScene() {
    const containerRef = useRef<null | HTMLDivElement>(null);
    const sceneCreated = useRef<boolean>(false);

    const renderer = useRef<null | THREE.WebGLRenderer>(null);
    const scene = useRef<null | THREE.Scene>(null);
    const camera = useRef<null | THREE.PerspectiveCamera>(null);
    const controls = useRef<null | OrbitControls>(null);
    const loader = useRef<null | FBXLoader>(null);
    const root = useRef<Group>(new Group());

    function createRenderer() {
        renderer.current = new THREE.WebGLRenderer({alpha: true});
        //Absolute such that container size would restricted by canvas size
        renderer.current!.domElement.classList.add("absolute");
        containerRef.current?.appendChild(renderer.current!.domElement);
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
        controls.current!.update()

        render(renderer.current!, scene.current!, camera.current!)
    }

    function loadAsset(path: string): Promise<Object3D[]> {
        let resolveFunc, rejectFunc;
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
        loadAsset("/asset/desk_large.fbx").then(obj => root.current.add(...obj));
        loadAsset("/asset/keyboard.fbx").then(obj => {
            setPosition(obj, new Vector3(-20, 100, 30));
            root.current.add(...obj)
        });
        loadAsset("/asset/gameconsole_handheld.fbx").then(obj => {
            setPosition(obj, new Vector3(140, 100, 20));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            root.current.add(...obj)
        });
        loadAsset("/asset/lamp_desk.fbx").then(obj => {
            setPosition(obj, new Vector3(175, 100, -40));
            setRotation(obj, new Vector3(-1.571, 0, -0.5))
            root.current.add(...obj)
        });
        loadAsset("/asset/monitor.fbx").then(obj => {
            setPosition(obj, new Vector3(-100, 100, -50));
            setRotation(obj, new Vector3(-1.571, 0, 0.4))

            const another = obj.map(x => x.clone())
            setPosition(another, new Vector3(60, 100, -50));
            setRotation(another, new Vector3(-1.571, 0, -0.4))

            root.current.add(...obj)
            root.current.add(...another)
        });
        loadAsset("/asset/mouse.fbx").then(obj => {
            setPosition(obj, new Vector3(50, 100, 30));
            root.current.add(...obj)
        });
        loadAsset("/asset/mousepad_large_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 100, 30));
            root.current.add(...obj)
        });

        loadAsset("/asset/chair_desk_A.fbx").then(obj => {
            setPosition(obj, new Vector3(0, 0, 90));
            setRotation(obj, new Vector3(-1.571, 0, 3))
            root.current.add(...obj)
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
            controls.current = createOrbital()
            loader.current = new FBXLoader()
            root.current.name = "root";
            root.current.scale.set(.01, .01, .01);
            scene.current!.add(root.current);
            controls.current!.target = root.current.position.add(new Vector3(0, -5, 0));

            const ambient = new THREE.AmbientLight(0xF3E1BF, 5);
            scene.current!.add(ambient)
            loadRoom();

            animate()
        }
    }, []);


    return (
        <div ref={containerRef} className="w-full h-full"/>
    )
}
