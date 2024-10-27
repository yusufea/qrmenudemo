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
        <div className="dark:bg-slate-900 container mx-auto px-2.5 my-auto py-2.5">
            <div className="relative flex items-center dark:bg-slate-800 rounded-lg">
                {/* Sol Kaydırma Oku */}
                <button
                    onClick={() => scrollLeft(scrollRefMostSeller)}
                    className="absolute left-2 z-10 rounded-full p-2"
                >
                    <FaChevronLeft className="text-gray-700 dark:text-slate-400" />
                </button>

                {/* Kategori Listesi */}
                <div
                    ref={scrollRefMostSeller}
                    className="flex overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide w-full px-0"
                >
                    {[
                        { image: "/images/products/prod1.webp", text: "Ürün 1" },
                        { image: "/images/products/prod2.webp", text: "Ürün 2" },
                        { image: "/images/products/prod3.webp", text: "Ürün 3" },
                        { image: "/images/products/prod2.webp", text: "Ürün 4" },
                        { image: "/images/products/prod3.webp", text: "Ürün 5" },
                        { image: "/images/products/prod1.webp", text: "Ürün 6" },
                        { image: "/images/products/prod3.webp", text: "Ürün 5" },
                        { image: "/images/products/prod1.webp", text: "Ürün 3" },
                        { image: "/images/products/prod3.webp", text: "Ürün 3" },
                        { image: "/images/products/prod3.webp", text: "Ürün 3" },
                        { image: "/images/products/prod1.webp", text: "Ürün 6" },
                        { image: "/images/products/prod2.webp", text: "Ürün 8" },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col items-center px-2" style={{ minWidth: 'calc(100% / 3)' }}>
                            <img src={item.image} alt={item.text} className="w-full h-full rounded-full" />
                            <span className="text-sm text-gray-700 mt-2 dark:text-white">{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Sağ Kaydırma Oku */}
                <button
                    onClick={() => scrollRight(scrollRefMostSeller)}
                    className="absolute right-2 z-10 rounded-full p-2"
                >
                    <FaChevronRight className="text-gray-700 dark:text-slate-400" />
                </button>
            </div>
        </div>
    );
}
