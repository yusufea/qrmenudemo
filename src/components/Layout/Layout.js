import { useRouter } from "next/router";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header/Header";

export default function Layout({ children }) {
    const router = useRouter();


    return (
        <div>
            {
                router.pathname === '/testcark' || router.pathname === '/testcarkbackup' ?
                    null : <Header />
            }
            <main className={`${router.pathname != "/testcark" ? 'dark:bg-slate-900 min-h-screen pb-24' : 'null'}`}>
                {children}
            </main>
            {
                router.pathname === '/' || router.pathname === '/carkcevir' || router.pathname === '/testcark' || router.pathname === '/testcarkbackup' ?
                    null
                    :
                    <BottomNavigation />
            }
        </div>
    )
}