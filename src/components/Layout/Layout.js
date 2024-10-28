import Header from "./Header/Header";

export default function Layout({ children }) {
    return (
        <div>
            <Header />
            <main className="container mx-auto px-2.5 my-auto py-2.5 dark:bg-slate-900">
                {children}
            </main>
        </div>
    )
}