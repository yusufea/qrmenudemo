import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
import { IoMdCart } from "react-icons/io";
import { LuChefHat } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CategoryItems() {
    const router = useRouter();
    const { categoryId } = router.query;
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

    const [restaurantId, setRestaurantId] = useState();
    const [categoryItems, setCategoryItems] = useState(null);

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        setRestaurantId(restaurantId)
        if (restaurantId != undefined && categoryId != undefined) {
            GetCategoryItems(restaurantId, categoryId);
        }
    }, [router.query]);

    const GetCategoryItems = async (restaurantId, categoryId) => {
        axios.get(`http://menoozi.com.tr/api/items/${restaurantId}/${categoryId}`).then(data => {
            setCategoryItems(data.data)
        }).catch(error => console.log(error));
    }

    const ReturnItemText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const ReturnCategoryText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.category_name_tr; // En son yoksa boş döner
        if (locale === "en") return category.category_name_en ? category.category_name_en : category.category_name_tr;
        if (locale === "ar") return category.category_name_ar ? category.category_name_ar : category.category_name_en ? category.category_name_en : category.category_name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const handleClick = (event, item) => {
        event.preventDefault(); // a etiketinin varsayılan davranışını engelle
        addToCart(item); // Sepete ürün ekle
    };

    const addToCart = (item) => {
        // Mevcut sepeti al veya boş bir dizi oluştur
        const currentCart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Ürün zaten sepette mi kontrol et
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
            // Ürün zaten varsa amountu 1 artır
            currentCart[existingItemIndex].amount += 1;
        } else {
            // Ürün yoksa amountu 1 olarak ayarla ve sepete ekle
            item.amount = 1;
            currentCart.push(item);
        }

        // Güncellenmiş sepeti sessionStorage'e kaydet
        sessionStorage.setItem('cart', JSON.stringify(currentCart));


        // Toast bildirimini göster
        toast.success(t.productaddtocard, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div>
            <ToastContainer />
            <div className="flex flex-col">
                <h4 className="text-center text-black text-lg font-bold dark:text-white my-3">
                    {ReturnCategoryText(categoryItems)}
                </h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <div className="flex flex-wrap w-full gap-4">
                        {categoryItems?.items?.map((item, key) => (
                            <a
                                href={`/${locale}/${categoryId}/${item.id}`}
                                className="flex flex-col justify-between"
                                key={key}
                                style={{ width: 'calc((100% / 2) - 8px)' }}
                            >
                                <div className="relative">
                                    <img
                                        src={item.image == undefined ? '/images/noimage.jpg' : item.image}
                                        className="rounded-lg border"
                                    />
                                    {item.chef_choise_flag == 1 ?
                                        <div className="absolute top-2 right-2 bg-slate-800 rounded-full p-1.5">
                                            <LuChefHat className="text-[20px] text-white" />
                                        </div> : null
                                    }
                                </div>
                                <h5 className="text-sm text-gray-700 mt-2 dark:text-white text-center font-bold">
                                    {ReturnItemText(item)} {item.price} TL
                                </h5>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // a etiketine tıklamayı durdurur
                                        addToCart(item);
                                    }}
                                    className="text-[14px] dark:text-white font-medium flex items-center gap-2 justify-center w-full mt-2"
                                >
                                    {t.addtobasket}
                                    <IoMdCart className="w-4 h-4 text-black dark:text-white" />
                                </button>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}