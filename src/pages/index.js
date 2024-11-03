import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import en from "../../locales/en";
import ar from "../../locales/ar";
import tr from "../../locales/tr";
import { useTheme } from "next-themes";

export default function RestaurantPage() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "tr" ? tr : locale === "en" ? en : ar;
  const [restaurantId, setRestaurantId] = useState();
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
    setRestaurantId(restaurantId)
    if (restaurantId) {
      GetRestaurantCategories(restaurantId);
      GetMostSellerProducts(restaurantId);
    }
  }, []);

  const GetRestaurantCategories = async (restaurantId) => {
    axios.get(`http://menoozi.com.tr/api/categories/${restaurantId}`).then(data => {
      setCategories(data.data)
    }).catch(error => console.log(error));
  }

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



  const ReturnCategoryText = (category) => {
    if (!category) return ""; // Eğer kategori yoksa boş bir string döner

    // Öncelik sırasına göre kategori adını döndür
    if (locale === "tr") return category.name_tr; // En son yoksa boş döner
    if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
    if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

    return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
  }

  const [mostSellerProducts, setMostSellerProducts] = useState();
  const GetMostSellerProducts = async (restaurantId) => {
    axios.get(`http://menoozi.com.tr/api/mostsellers/${restaurantId}`).then(data => {
      setMostSellerProducts(data.data.items)
    }).catch(error => console.log(error));
  }

  const { theme, setTheme } = useTheme();



  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 mt-1">
        <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.mostseller}</h4>
        <div className="relative flex items-center border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg">
          {/* Sol Kaydırma Oku */}
          <button
            onClick={() => scrollLeft(scrollRefMostSeller)}
            className="absolute left-2 z-10 rounded-full p-2"
          >
            <FaChevronLeft fontSize={18} className="text-slate-600 dark:text-slate-300" />
          </button>

          {/* Kategori Listesi */}
          {/* <div
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
                <img src={item.image} alt={item.text} className="w-full h-full rounded-lg" />
                <span className="text-sm text-gray-700 mt-2 dark:text-white">{item.text}</span>
              </a>
            ))}
          </div> */}
          <div
            ref={scrollRefMostSeller}
            className="flex overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide w-full px-0"
          >
            {mostSellerProducts?.map((item, index) => (
              <a href={`/${item.category_id}/${item.id}`} key={index} className="flex flex-col items-center px-2" style={{ minWidth: 'calc(100% / 2)' }}>
                <img src={`${item.image === null ? '/images/noimage.jpg' : item.image}`} alt={ReturnCategoryText(item)} className="w-full h-full rounded-lg" />
                <span className="text-sm text-gray-700 mt-2 dark:text-white">{ReturnCategoryText(item)}</span>
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
      <div className="flex flex-col gap-2">
        <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.categories}</h4>
        <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
          {/* <div className="flex flex-wrap gap-2.5">
            {categories?.map((category, index) => (
              <a
                href={`/${locale}/${category.id}`}
                key={index}
                className="flex flex-col items-center w-full h-[120px]"
              >
                <div className="relative rounded-lg w-full h-full">
                  <div className="relative w-full h-full">
                    <div
                      style={{
                        backgroundImage: `url(${category.image === undefined ? '/images/noimage.jpg' : category.image})`,
                      }}
                      className="border w-full bg-contain bg-center rounded-lg h-full"
                    />
                    {category.image != undefined ? <div className="absolute inset-0 bg-black opacity-30 rounded-lg" /> : null}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-lg font-bold text-center px-2 py-1 ${theme === 'light' ? (category.image != undefined ? 'text-white' : 'black') : "text-white"}`}>
                      {ReturnCategoryText(category)}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div> */}
          <main className="container flex flex-col gap-4 py-2">
            <section id="categories">
              <div className="horizontalProductList border-slate-500 shadow border flex flex-wrap justify-evenly items-center gap-1">
                {categories?.map((item) => (
                  <a
                    key={item.id} // Eklenmesi gereken benzersiz bir anahtar
                    className="homePageCategory flex-grow p-4 py-5 text-center shadow flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      minHeight: '120px', // Kapsayıcının en az yüksekliği
                      backgroundSize: 'cover', // Arka planı kapsayıcıya sığdır
                      backgroundPosition: 'center', // Arka planı ortala
                    }}
                    href={`/${locale}/${item.id}`}
                  >
                    <span className="absolute inset-0 bg-black opacity-50" /> {/* Siyah opak katman */}
                    <span className="relative text-white z-10">{ReturnCategoryText(item)}</span> {/* Beyaz yazı */}
                  </a>
                ))}
              </div>
            </section>
          </main>



          {/* {organizedCategories.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex w-full gap-2 mb-2.5">
                            {row.items.map((category, index) => (
                                <a
                                    href="#"
                                    key={index}
                                    className="flex flex-col items-center"
                                    style={{ width: `${(category.columns / 12) * 100}%` }}
                                >
                                    <div className="relative w-full h-[120px]">
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-bold text-white text-center px-2 py-1">
                                                {category.name}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ))} */}
        </div>
      </div>

    </div>
  );
}
