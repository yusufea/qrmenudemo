import "@/styles/globals.css";
import Providers from "./providers";
import Layout from "@/components/Layout/Layout";
import { appWithTranslation } from 'next-i18next';

function App({ Component, pageProps }) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}

export default appWithTranslation(App);