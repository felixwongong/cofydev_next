import {useEffect, useRef} from "react";
import * as THREE from "three";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Color, Group, Object3D, Quaternion, Vector3} from "three";




export default function ThreeScene() {
    const containerRef = useRef<null | HTMLDivElement>(null);
    const sceneCreated = useRef<boolean>(false);

    const renderer = useRef<null | THREE.WebGLRenderer>(null);
    const scene = useRef<null | THREE.Scene>(null);
    const camera = useRef<null | THREE.PerspectiveCamera>(null);
    const controls = useRef<null | OrbitControls>(null);
    const loader = useRef<null | FBXLoader>(null);
    const root = useRef<Group>(new Group());

    function render() {
        if (!renderer.current || !scene.current || !camera.current!) return;
        renderer.current!.render(scene.current!, camera.current!);
    }

    function createScene() {
        sceneCreated.current = true
        scene.current = new THREE.Scene();
    }

    function createCamera() {
        camera.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.current!.position.z = 5;
    }

    function createRenderer() {
        renderer.current = new THREE.WebGLRenderer({alpha: true});
        renderer.current!.setSize(window.innerWidth, window.innerHeight);
        containerRef.current?.appendChild(renderer.current!.domElement);
    }

    function createOrbital() {
        controls.current = new OrbitControls(camera.current!, renderer.current!.domElement)
        controls.current!.enableDamping = true
        controls.current!.autoRotate = true;
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.current!.update()
        render()
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

    function setPosition(objects: Object3D[], position: Vector3) {
        objects.forEach(obj => obj.position.set(position.x, position.y, position.z))
    }

    function setRotation(objects: Object3D[], rotation: Vector3) {
        objects.forEach(obj => obj.rotation.set(rotation.x, rotation.y, rotation.z))
    }

    useEffect(() => {
        if (!sceneCreated.current && typeof window !== "undefined") {
            //Initialization
            createScene()
            createCamera()
            createRenderer()
            createOrbital()
            loader.current = new FBXLoader()
            root.current.name = "root";
            root.current.scale.set(.01, .01, .01);
            scene.current!.add(root.current);
            controls.current!.target = root.current.position.add(new Vector3(0, -5, 0));

            const ambient = new THREE.AmbientLight(0xF3E1BF, 5);
            scene.current!.add(ambient)


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
                setPosition(obj, new Vector3(160, 100, -40));
                setRotation(obj, new Vector3(-1.571, 0, -1))
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

            animate()
        }
    }, []);


    return (
        <div ref={containerRef}/>
    )
}
