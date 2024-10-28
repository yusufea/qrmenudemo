import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RestaurantPage() {
    const router = useRouter();
    const scrollRefMostSeller = useRef(null);

    const scrollLeft = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            scrollRight(scrollRefMostSeller);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-2 mt-1">
                <h4 className="text-center text-white text-lg font-bold">Çok Satan Ürünler</h4>
                <div className="relative flex items-center border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg">
                    {/* Sol Kaydırma Oku */}
                    <button
                        onClick={() => scrollLeft(scrollRefMostSeller)}
                        className="absolute left-2 z-10 rounded-full p-2"
                    >
                        <FaChevronLeft fontSize={18} className="text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Kategori Listesi */}
                    <div
                        ref={scrollRefMostSeller}
                        className="flex overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide w-full px-0"
                    >
                        {[
                            { image: "/images/products/prod1.webp", text: "Ürün 1", href: "churros" },
                            { image: "/images/products/prod2.webp", text: "Ürün 2", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "sansebastian" },
                            { image: "/images/products/prod2.webp", text: "Ürün 4", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 5", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 6", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 5", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 6", href: "nargile" },
                            { image: "/images/products/prod2.webp", text: "Ürün 8", href: "nargile" },
                        ].map((item, index) => (
                            <a href={`/urun/${item.href}`} key={index} className="flex flex-col items-center px-2" style={{ minWidth: 'calc(100% / 3)' }}>
                                <img src={item.image} alt={item.text} className="w-full h-full rounded-full" />
                                <span className="text-sm text-gray-700 mt-2 dark:text-white">{item.text}</span>
                            </a>
                        ))}
                    </div>

                    {/* Sağ Kaydırma Oku */}
                    <button
                        onClick={() => scrollRight(scrollRefMostSeller)}
                        className="absolute right-2 z-10 rounded-full p-2"
                    >
                        <FaChevronRight fontSize={18} className="text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </div>
        </div>
    );
}
