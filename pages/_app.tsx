import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ThemeProvider} from "next-themes";
import {useReportWebVitals} from "next/web-vitals";


function MyApp({ Component, pageProps }: AppProps) {
    useReportWebVitals((metric) => {
        console.log(metric)
    })

    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
