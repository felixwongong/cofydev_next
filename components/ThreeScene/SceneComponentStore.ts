import {MutableRefObject} from "react";
import {Object3D} from "three";

export enum ComponentType {
    Camera,
    Scene,
    Renderer,
    Control,
}

type ComponentMap = {
    [key in ComponentType]: MutableRefObject<any>;
}

class SceneComponentStore {
    public data: ComponentMap;
    public assetLoader: (path: string) => Promise<Object3D[]>;

    constructor(assetLoader: (path: string) => Promise<Object3D[]>) {
        this.data = { } as ComponentMap;
        this.assetLoader = assetLoader;
    }

    setData(key: ComponentType, value: MutableRefObject<any>): void{
        this.data[key] = value;
    }

    getData(key: ComponentType): MutableRefObject<any> {
        return this.data[key];
    }
}

export default SceneComponentStore;
