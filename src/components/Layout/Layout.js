import { useRouter } from "next/router";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header/Header";

export default function Layout({ children }) {
    const router = useRouter();


    return (
        <div>
            {
                router.pathname === '/testcark' ?
                    null : <Header />
            }
            <main className="dark:bg-slate-900 min-h-screen pb-24">
                {children}
            </main>
            {
                router.pathname === '/' || router.pathname === '/carkcevir' || router.pathname === '/testcark' ?
                    null
                    :
                    <BottomNavigation />
            }
        </div>
    )
}