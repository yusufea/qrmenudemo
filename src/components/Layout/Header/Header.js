import ThemeSwitcher from "@/components/switch/ThemeSwitcher";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Header() {
    const scrollRefNavbarCategories = useRef(null);

    const scrollLeft = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
        }
    };

    const scrollRight = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
    };
    return (
        <div>
            <div className="container mx-auto px-2.5 my-auto py-2.5 dark:bg-slate-900">
                <div className="flex justify-between h-full">
                    <img className="w-14 h-14 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi84iuDjRQz6FKaFClc9gV_ox3Tx1LwgbctQ&s" />
                    <div className="h-14">
                        <div className="h-full flex flex-col justify-center items-center">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen border-b border-gray-300 dark:border-gray-700"></div>
            <div className="relative flex items-center border-b border-gray-300 dark:bg-slate-800">
                {/* Sol Kaydırma Oku */}
                <button
                    onClick={() => scrollLeft(scrollRefNavbarCategories)}
                    className="absolute left-3 z-10 rounded-full hover:bg-gray-300"
                    style={{ transform: 'translateX(-50%)' }}
                >
                    <FaChevronLeft className="dark:text-slate-400" />
                </button>

                {/* Kategori Listesi */}
                <nav
                    ref={scrollRefNavbarCategories}
                    className="flex overflow-x-scroll whitespace-nowrap py-2 scrollbar-hide mx-8"
                >
                    {["Kategori 1", "Kategori 2", "Kategori 3", "Kategori 4", "Kategori 5", "Kategori 6", "Kategori 7"].map((category, index) => (
                        <span key={index} className="px-2 py-1 text-sm text-gray-700 cursor-pointer hover:text-blue-500 dark:text-white">
                            {category}
                        </span>
                    ))}
                </nav>

                {/* Sağ Kaydırma Oku */}
                <button
                    onClick={() => scrollRight(scrollRefNavbarCategories)}
                    className="absolute right-4 z-10 rounded-full hover:bg-gray-300"
                    style={{ transform: 'translateX(50%)' }}
                >
                    <FaChevronRight className="dark:text-slate-400" />
                </button>
            </div>
        </div>
    )
}