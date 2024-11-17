import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Spinner.module.css";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import confetti from "canvas-confetti";

const SpinWheel = () => {
    const router = useRouter();

    const wheelRef = useRef(null);
    const spinBtnRef = useRef(null);
    const finalValueRef = useRef(null);
    let myChart;

    const [gameSettings, setGameSettings] = useState([]);
    const [winModalShow, setWinModalShow] = useState(false);
    const [couponCode, setCouponCode] = useState();
    const [winningLabelState, setWinningLabelState] = useState();
    const [canSpin, setCanSpin] = useState(false);
    const [closeButtonDisabled, setCloseButtonDisabled] = useState(true);


    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    useEffect(() => {
        if (winModalShow && couponCode !== 0) {
            triggerConfetti();
        }
    }, [winModalShow, couponCode]); // Modal ve kazanan kontrolü yapıldığında konfeti tetiklenir.

    useEffect(() => {
        if (winModalShow) {
            setCloseButtonDisabled(true); // Butonu devre dışı yap
            const timer = setTimeout(() => {
                setCloseButtonDisabled(false); // 3 saniye sonra aktif yap
            }, 3000);

            return () => clearTimeout(timer); // Temizlik işlemi
        }
    }, [winModalShow]);

    useEffect(() => {
        // Kullanıcının çarkı çevirip çeviremeyeceğini kontrol et
        const lastSpinDate = Cookies.get("lastSpinDate");
        const today = new Date().toISOString().split("T")[0]; // Bugünün tarihi (YYYY-MM-DD formatında)

        if (lastSpinDate === today) {
            setCanSpin(false); // Bugün çark çevrilmiş
        } else {
            setCanSpin(true); // Çark çevrilebilir
        }
    }, []);

    const pastelColors = [
        "#FFB3BA", // Pastel pembe
        "#FFDFBA", // Pastel turuncu
        "#FFFFBA", // Pastel sarı
        "#BAFFC9", // Pastel yeşil
        "#BAE1FF", // Pastel mavi
        "#D5BAFF", // Pastel mor
        "#FFC4E1", // Pastel şeker pembesi
        "#B9FBC1", // Pastel açık yeşil
        "#FAF4B7", // Pastel krem
        "#BFFCC6"  // Pastel nane yeşili
    ];



    useEffect(() => {
        if (!gameSettings.length) return;

        const labels = gameSettings.map(item => item.part_name);
        const data = new Array(labels.length).fill(1);
        const pieColors = labels.map((_, index) => pastelColors[index % pastelColors.length]);

        if (wheelRef.current) {
            myChart = new Chart(wheelRef.current, {
                plugins: [ChartDataLabels],
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{ backgroundColor: pieColors, data: data }],
                },
                options: {
                    responsive: true,
                    animation: { duration: 0 },
                    plugins: {
                        tooltip: false,
                        legend: { display: false },
                        datalabels: {
                            color: "#334155",
                            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                            font: { size: 14 },
                        },
                    },
                },
            });
        }

        const findCouponCodeByPartName = (gameSettings, partName) => {
            if (partName === "PAS") {
                setCouponCode(0);
                return;
            }

            const foundItem = gameSettings.find(item => item.part_name === partName);
            if (foundItem) {
                setCouponCode(foundItem.coupon_code);
                insertGameWinner(foundItem.coupon_code, partName);
                return;
            }

            return null;

        };

        const valueGenerator = (angleValue) => {
            const sliceAngle = 360 / labels.length;
            const adjustedAngle = angleValue % 360;
            const index = Math.floor((360 - adjustedAngle) / sliceAngle) % labels.length;
            const winningLabel = labels[index];
            spinBtnRef.current.disabled = false;
            const today = new Date().toISOString().split("T")[0];
            Cookies.set("lastSpinDate", today, { expires: 1 }); // Çerez 1 gün sonra otomatik silinir
            findCouponCodeByPartName(gameSettings, winningLabel);
            setWinningLabelState(winningLabel);
            setWinModalShow(true);
        };

        let count = 0;
        let resultValue = 101;

        const spinWheel = () => {
            spinBtnRef.current.disabled = true;
            finalValueRef.current.innerHTML = `<p>Bol Şans!</p>`;
            const randomDegree = Math.floor(Math.random() * 360);
            const targetRotation = 360 * 5 + randomDegree;
            let currentRotation = 0;

            const rotationInterval = window.setInterval(() => {
                currentRotation += resultValue;
                myChart.options.rotation = currentRotation;
                myChart.update();

                if (currentRotation >= targetRotation) {
                    clearInterval(rotationInterval);
                    valueGenerator(randomDegree);
                    count = 0;
                    resultValue = 101;
                } else {
                    if (currentRotation > targetRotation - 360) {
                        resultValue -= 2;
                    }
                }
            }, 10);
        };

        spinBtnRef.current.addEventListener("click", spinWheel);
        return () => {
            if (spinBtnRef.current) {
                spinBtnRef.current.removeEventListener("click", spinWheel);
            }
            if (myChart) myChart.destroy();
        };
    }, [gameSettings]);

    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId") || null;
        if (customerId === null) router.push("/");

        if (customerId) {
            GetGameSettings(customerId);
        }
    }, []);

    useEffect(() => {
        // Modal açıldığında scroll engelle, kapandığında tekrar aç
        if (winModalShow) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "hidden";
        }
    }, [winModalShow]); // winModalShow state'ine bağlı olarak overflow stilini güncelle

    useEffect(() => {
        document.body.style.overflow = "hidden";

    }, [])
    const GetGameSettings = async (customerId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/gameSettings/${customerId}`);
            setGameSettings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const insertGameWinner = async (couponCode, winningLabel) => {
        const customerId = sessionStorage.getItem("customerId") || null;

        const requestData = {
            customer_id: customerId,
            award: winningLabel,
            date: new Date().toISOString(),
            code: couponCode,
            is_used: 0,
            used_time: null
        };
        console.log(requestData, "requestData")

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/gameWinners`, requestData);
            console.log("Başarılı:", response.data);
        } catch (error) {
            console.error("Hata:", error);
        }
    };
    return (
        <div className="pt-8">
            <div className={styles.container}>
                <canvas ref={wheelRef} id="wheel"></canvas>
                <button ref={spinBtnRef} className={styles.spinBtn} disabled={!canSpin}>
                    {canSpin ? "Çevir" : "Bugün Çevirildi"}
                </button>
                <img
                    src="/images/wheelarrow.png"
                    alt="spinner arrow"
                    className={styles.arrow}
                />
            </div>
            <div ref={finalValueRef} id="final-value" className={styles.finalValue}>
                <p>Çevir Butonuna Tıklayın</p>
            </div>
            {winModalShow && couponCode !== 0 ? (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-6 border w-96 shadow-lg rounded-md bg-white h-auto py-14">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900">Tebrikler!</h3>
                            <div className="mt-1 px-3 py-3">
                                {/* Ödül Mesajı */}
                                <p className="text-lg text-gray-700">{winningLabelState} Kazandınız!</p>

                                {/* Kupon Kodunuz Açıklaması */}
                                <p className="mt-2 text-md text-gray-500">Kupon Kodunuz:</p>

                                {/* Çerçeve İçerisinde Kupon Kodu */}
                                <div className="flex justify-center">
                                    <div className="mt-3 border-2 border-gray-300 rounded-lg p-3">
                                        <p className="text-xl font-bold text-gray-800">{couponCode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => router.push('/')}
                                    className={`px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 ${closeButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={closeButtonDisabled}
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {winModalShow && couponCode === 0 ? (
                <div className="fixed inset-0 bg-gray-600 dark:bg-slate-800 bg-opacity-70 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="p-8 border w-96 shadow-lg rounded-md bg-white  h-[300px] py-14">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900">Üzgünüm..</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-lg text-gray-500">Kazanamadınız.</p>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default SpinWheel;
