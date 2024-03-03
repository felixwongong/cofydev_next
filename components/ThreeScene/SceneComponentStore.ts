import {MutableRefObject} from "react";
import {Object3D} from "three";

export enum ComponentType {
    Camera,
    Light,
    Mesh,
    Group,
    Scene,
    Renderer,
    Control,
}

type ComponentMap = {
    [key: ComponentType]: MutableRefObject<any>;
}

class SceneComponentStore {
    public data: ComponentMap;
    public assetLoader: (path: string) => Promise<Object3D[]>;

    constructor() {
        this.data = {}
    }

    setData(key: ComponentType, value: MutableRefObject<any>): void{
        this.data[key] = value;
    }

    getData(key: ComponentType): MutableRefObject<any> {
        return this.data[key];
    }
}

export default SceneComponentStore;
