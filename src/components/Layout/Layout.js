import { useRouter } from "next/router";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header/Header";

export default function Layout({ children }) {
    const router = useRouter();


    return (
        <div>
            {
                router.pathname === '/carkcevir' ?
                    null
                    :
                    <Header />
            }
            <main className="container mx-auto px-2.5 my-auto py-2.5 dark:bg-slate-900 min-h-screen pb-24">
                {children}
            </main>
            {
                router.pathname === '/' || router.pathname === '/carkcevir' ?
                    null
                    :
                    <BottomNavigation />
            }
        </div>
    )
}