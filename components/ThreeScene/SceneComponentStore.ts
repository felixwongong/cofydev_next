import {MutableRefObject} from "react";

export enum ComponentType {
    Camera,
    Light,
    Mesh,
    Group,
    Scene
}

interface ComponentMap {
    [key: ComponentType]: MutableRefObject<any>;
}

class SceneComponentStore {
    private data: ComponentMap;

    constructor() {
        this.data = {}
    }

    setData(key: string, value: MutableRefObject<any>): void{
        this.data[key] = value;
    }

    getData(key: string): MutableRefObject<any> {
        return this.data[key];
    }
}

export default SceneComponentStore;
