import {createContext, ReactNode, useContext, useEffect, useRef} from "react";
import * as THREE from "three";
import {Group, Object3D} from "three";
import "../ThreeUtil";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {createCamera, render} from "../ThreeUtil";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import Tween from "three/examples/jsm/libs/tween.module";
import {globalHeroContext, HeroState} from "../HeroState";
import SceneComponentStore, {ComponentType} from "./SceneComponentStore";

const compStoreCxt = createContext<SceneComponentStore | null>(null);
export const useCompStore = () => useContext(compStoreCxt)

export default function ThreeScene({ children }: { children?: ReactNode }) {
    const {state, setState} = useContext(globalHeroContext);
    const compStore = useRef<SceneComponentStore>(new SceneComponentStore(loadAsset));

    const containerRef = useRef<null | HTMLDivElement>(null);
    const sceneCreated = useRef<boolean>(false);

    const renderer = useRef<null | THREE.WebGLRenderer>(null);
    const renderer2D = useRef<null | CSS2DRenderer>(null);
    const scene = useRef<null | THREE.Scene>(null);
    const camera = useRef<null | THREE.PerspectiveCamera>(null);
    const controls = useRef<null | OrbitControls>(null);
    const loader = useRef<null | FBXLoader>(null);



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
        controls.enableDamping = false;
        controls.autoRotate = false;
        controls.enablePan = false;
        return controls;
    }



    function loadAsset(path: string) {
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

    useEffect(() => {
        function animate() {
            requestAnimationFrame(animate);

            if(controls.current != null) {
                controls.current!.update()
            }
            Tween.update()

            render(renderer.current!, renderer2D.current!, scene.current!, camera.current!)
        }

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

        if (!sceneCreated.current && typeof window !== "undefined") {
            //Initialization
            sceneCreated.current = true
            scene.current = new THREE.Scene();
            camera.current = createCamera()
            createRenderer()
            controls.current = createOrbital()
            window.addEventListener("resize", onContainerResize);
            loader.current = new FBXLoader()

            const ambient = new THREE.AmbientLight(0xF3E1BF, 5);
            scene.current!.add(ambient)

            compStore.current.setData(ComponentType.Camera, camera);
            compStore.current.setData(ComponentType.Scene, scene);
            compStore.current.setData(ComponentType.Renderer, renderer);
            compStore.current.setData(ComponentType.Control, controls);

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
        <compStoreCxt.Provider value={compStore.current}>
            <div ref={containerRef} className="w-full h-full"/>
            {children}
        </compStoreCxt.Provider>
    )
}
