import { useState } from "react";
import style from "@/styles/luckwhell.module.css";

export default function SpinWhell() {
    const [value, setValue] = useState(0);
    const segments = ["100", "1", "50", "0", "1000", "10", "5", "20"]; // Dilim değerleri sırasıyla
    const [newValue, setNewValue] = useState("");
    const handleSpin = () => {
        // Yeni bir dönüş açısı hesapla ve değerini ayarla
        const newValue = value + Math.ceil(Math.random() * 3600);
        setValue(newValue)
        // Döndükten sonra durduğu dilimi hesapla
        setTimeout(() => {
            const totalDegrees = newValue % 360;
            const segmentAngle = 360 / segments.length;
            const stoppedIndex = Math.floor((360 - totalDegrees + segmentAngle / 2) % 360 / segmentAngle);
            console.log("Çarkın ucunun gösterdiği değer:", segments[stoppedIndex]);
            setNewValue(segments[stoppedIndex])
        }, 5000); // Dönüş süresi kadar bekle (5 saniye)
    };

    return (
        <div>

            <div className="flex justify-center mt-12">
                <div className={style.container}>
                    <div className={style.spinBtn} onClick={handleSpin}>Spin</div>
                    <div className={style.wheel} style={{ transform: `rotate(${value}deg)` }}>
                        {segments.map((segmentValue, index) => (
                            <div
                                key={index}
                                className={style.number}
                                style={{ "--i": index + 1, "--clr": getColor(index) }}
                            >
                                <span>{segmentValue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <h4 className="text-center mt-12">Kazanç: {newValue}</h4>

        </div>
    );
}

function getColor(index) {
    const colors = ["#db7093", "#20b2aa", "#daa520", "#ff340f", "#4169e1", "#3cb371", "#d63e92", "#ff7f50"];
    return colors[index % colors.length];
}
