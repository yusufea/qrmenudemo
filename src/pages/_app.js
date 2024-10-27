import "@/styles/globals.css";
import Providers from "./providers";
import Layout from "@/components/Layout/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  )
}