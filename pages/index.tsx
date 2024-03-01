import type { NextPage } from 'next'
import Head from 'next/head'
import NavMenu from "../components/NavMenu/NavMenu";
import Image from "next/image";
import Hero from "../components/Hero/Hero";

const Home: NextPage = () => {
  return (
    <div className={"font-comic bg-base-200 min-h-screen box-border"}>
      <Head>
        <title>Felix Room🪴</title>
        <meta name="description" content="Inter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <NavMenu/>
          <Hero/>
      </main>

        <footer className="footer footer-center p-10 text-base">
            <div>
                <Image src={"/icons/coffee.gif"} alt={"logo"} className={"bg-base-100 dark:bg-secondary rounded"} width={50} height={50}/>
                    <p className="font-bold">
                        Cofy Dev <br/>Portfolio created by Felix
                    </p>
                    <p>Copyright © 2023 - All right reserved</p>
            </div>
        </footer>

    </div>
  )
}

export default Home
