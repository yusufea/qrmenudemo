import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Test() {
    const router = useRouter();
    const { restaurantId } = router.query;
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(`http://menoozi.com.tr/api/categories/9ab8ea1d-aef5-4990-a633-11a7b63ad4de`);
                setRestaurant(response.data);
            } catch (error) {
                console.error('Veri alınamadı:', error);
            }
        };

        fetchRestaurant();
    }, []);

    if (!restaurant) return <p>Yükleniyor...</p>;
    return (
        <div>

            test
        </div>
    )
}