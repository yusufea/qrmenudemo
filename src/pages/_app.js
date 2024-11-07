import "@/styles/globals.css";
import Providers from "./providers";
import Layout from "@/components/Layout/Layout";
import { appWithTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import '../styles/firstpage.css'

function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}

export default appWithTranslation(App);