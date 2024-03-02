import RoomScene from "../RoomScene/RoomScene";
import {AnimatePresence, motion} from "framer-motion";
import {globalHeroContext, HeroState} from "../HeroState";
import {useState} from "react";
import styles from "./Hero.module.css";

export default function Hero() {
    const [state, setState] = useState<HeroState>(HeroState.Initial);

    return (
        <div className="hero min-h-screen bg-base-200">
            <globalHeroContext.Provider value={{state, setState}}>
                <RoomScene/>
            </globalHeroContext.Provider>
            {state == HeroState.Initial &&
                <AnimatePresence>
                    <motion.div className={`hero-content text-center ${styles.bottomCenter}`}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 1}}
                    >
                        <div>
                            <h1 className="text-5xl font-bold">Hello From CofyDev</h1>
                            <p className="py-6">Here is a place you can play around, and know more about me.</p>
                            <button className="btn btn-primary" onClick={() => setState(HeroState.Started)}>Get Started
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            }
        </div>
    )
}
