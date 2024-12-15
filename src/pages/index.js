import axios from "axios";
import { useRouter } from "next/router";
import ar from "../../locales/ar";
import en from "../../locales/en";
import tr from "../../locales/tr";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineRestaurantMenu, MdComment } from "react-icons/md";
import { RxColorWheel } from "react-icons/rx";

export default function Welcome() {
  const router = useRouter();
  const { locale } = router;

  const t = locale === "tr" ? tr : locale === "en" ? en : ar;

  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
    if (restaurantId) {
      GetCustomers(restaurantId);
    }
  }, []);

  const GetCustomers = async (restaurantId) => {
    axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/customers/${restaurantId}`).then(data => {
      setCustomers(data.data)
      sessionStorage.setItem('customerId', data.data.id);
    }).catch(error => console.log(error));
  }

  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="relative">
        {/* Resim */}
        {
          customers?.banner ?
            <img src={customers?.banner} className="w-full" /> :
            <div class="flex items-center justify-center w-full h-72 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
              <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
        }

        {/* Beyaza geçişli gradyan kaplama */}
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${theme == 'light' ? 'from-white' : 'from-slate-900'} to-transparent h-12`} />

        {/* Opak kaplama ve yazı */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 flex items-center justify-center">
          <span className="text-white text-xl font-bold">{customers?.name}</span>
        </div>
      </div>
      <h5 className="text-center font-bold text-xl my-2 mb-4 dark:text-white">{t.welcome}</h5>
      <div className="flex justify-center">
        <div className="flex flex-col gap-2">
          <a href={`/${locale}/menu`} type="button" className="flex btnshadow dark:shadow-2xl py-3 justify-center gap-2 items-center text-[17px] text-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            <MdOutlineRestaurantMenu className="text-lg" />
            {t.menu}
          </a>
          {customers?.feedback_flag != 0 ?
            <a href={`/${locale}/geribildirim`} type="button" className="flex btnshadow dark:shadow-2xl py-3 justify-center gap-2 items-center text-[17px] text-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              <MdComment className="text-lg" />
              {t.complaints_opinions_suggestions}
            </a> :
            null
          }
          {customers?.game_of_chance_flag != 0 ?
            <a href={`/${locale}/carkcevir`} type="button" className="flex btnshadow dark:shadow-2xl py-3 justify-center gap-2 items-center text-[17px] text-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              <RxColorWheel className="text-lg" />
              {t.spinwhell}
            </a> :
            null
          }
        </div>
      </div>
    </div>
  )
}