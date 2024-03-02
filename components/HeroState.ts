import {createContext} from "react";

export enum HeroState {
    Initial,
    Started,
    DoorOpened
}

export type HeroContent = {
    state: HeroState,
    setState: (c: HeroState) => void
}

export const globalHeroContext = createContext<HeroContent>({
    state: HeroState.Initial,
    setState: () => {}
});
