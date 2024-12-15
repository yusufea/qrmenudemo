import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Test() {

    const [gameSettings, setGameSettings] = useState([]);

    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId") || null;
        if (customerId === null) window.location.href = "/";

        if (customerId) {
            GetGameSettings(customerId);
        }
    }, []);

    const GetGameSettings = async (customerId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/gameSettings/${customerId}`);
            setGameSettings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    function getRandomItemByChance(arr) {
        // Toplam chance_ratio'yu hesapla
        const totalChance = arr.reduce((sum, item) => sum + item.chance_ratio, 0);

        // 0 ile toplam chance_ratio arasındaki rastgele bir sayı seç
        const random = Math.random() * totalChance;

        let sum = 0;

        // Chance_ratio'yu kontrol ederek uygun elemanı seç
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i].chance_ratio;
            if (random <= sum) {
                return { ...arr[i], index: i }; // Seçilen öğe ile index bilgisini döndür
            }
        }
    }

    const [gameWinner, setGameWinner] = useState();
    return (
        <div>

            <button onClick={() => {
                const selected = getRandomItemByChance(gameSettings);
                setGameWinner(selected)
            }}>Test</button>
            <h6 className="text-xl text-indigo-600">-{gameWinner?.part_name}-</h6>
        </div>
    )
}