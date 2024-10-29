import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CategoryItems() {
    const router = useRouter();
    const { restaurantId, categoryId } = router.query;

    const [categoryItems, setCategoryItems] = useState(null);

    useEffect(() => {
        if (restaurantId != undefined && categoryId != undefined) {
            GetCategoryItems(restaurantId, categoryId);
        }
    }, [router.query]);

    const GetCategoryItems = async (restaurantId, categoryId) => {
        axios.get(`http://menoozi.com.tr/api/items/${restaurantId}/${categoryId}`).then(data => {
            setCategoryItems(data.data)
        }).catch(error => console.log(error));
    }

    console.log(categoryItems)
    return (
        <div>
            <div className="flex flex-col gap-4">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">Kahvaltılar</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <div className="flex flex-wrap w-full gap-4">
                        {categoryItems?.map((item,key) => (
                            <a href={`/${restaurantId}/${categoryId}/${item.id}`} key={key} style={{ width: 'calc((100% / 2) - 8px)' }}>
                                <img src={item.image == undefined ? '/images/noimage.jpg' : item.image} className="rounded-lg border" />
                                <h5 className="text-sm text-gray-700 mt-2 dark:text-white text-center font-bold">{item.name_tr} {item.price} TL</h5>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}