import Link from "next/link";
import Image from "next/image";
import {useTheme} from "next-themes";
import {ChangeEvent} from "react";


export default function NavMenu() {
    const {theme, setTheme} = useTheme();

    function getOnChange(checked: ChangeEvent<HTMLInputElement>) {
        checked.target.checked ? setTheme("sunset") : setTheme("retro");
        console.log(theme)
    }

    return (
        <div className="absolute navbar bg-base-100 z-40">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </label>
                    <ul tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href={"/"}>🧑🏼‍💻Work</Link></li>
                        <li><Link href={"/"}>📖Post</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl" href="/pages">Felix Wong☕</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <div className="tooltip tooltip-bottom tooltip-info" data-tip="Not available yet😢">
                        <li><Link href={"/"}>🧑🏼‍💻Work</Link></li>
                    </div>
                    <div className="tooltip tooltip-bottom tooltip-info" data-tip="Not available yet😢">
                        <li><Link href={"/"}>📖Post</Link></li>
                    </div>
                </ul>
            </div>
            <div className="navbar-end">
                <label className="swap swap-rotate navbar-end w-10 h-10 my-auto bg-base-100 dark:bg-secondary rounded">
                    <input type="checkbox" className="theme-controller" onChange={getOnChange}/>

                    <Image src={"/icons/sun.gif"} width={100} height={100} alt="toggleNightMode"
                           className="swap-off fill-current"/>

                    <Image src={"/icons/moon.gif"} width={100} height={100} alt="toggleNightMode"
                           className="swap-on fill-current"/>
                </label>
            </div>
        </div>
    )
}
