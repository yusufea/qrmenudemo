import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import tr from "../../locales/tr";
import en from "../../locales/en";
import ar from "../../locales/ar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Feedback() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

    const [subject, setSubject] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [date, setDate] = useState(new Date().toISOString()); // Tarihi ISO formatında başlatıyoruz
    const [errors, setErrors] = useState({ subject: '', message: '' });

    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId") || null;
        console.log(customerId)
        if (customerId === null) router.push('/')
        if (customerId) {
            GetFeedbackSubject(customerId);
        }
    }, []);

    const GetFeedbackSubject = async (restaurantId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/feedbackSubject/${restaurantId}`);
            setSubject(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectSubject = (e) => {
        setSelectedSubject(e.target.value);
        setErrors({ ...errors, subject: '' }); // Seçim yapıldığında hata mesajını sıfırla
    };

    const handleSubmit = async () => {
        const customerId = sessionStorage.getItem("customerId") || null;

        // Hata kontrolü: konu ve mesaj alanları boş olamaz
        if (!selectedSubject) {
            setErrors(prev => ({ ...prev, subject: 'Konu seçilmelidir' }));
            return;
        }
        if (!message) {
            setErrors(prev => ({ ...prev, message: 'Mesaj boş bırakılamaz' }));
            return;
        }

        const requestData = {
            customer_id: customerId,
            name: `${firstName} ${lastName}`,
            phone: cleanPhoneNumber(phone),
            subject_id: selectedSubject,
            message: message,
            date: date,
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/feedback`, requestData);
            console.log("Başarılı:", response.data);
            // Toast bildirimini göster
            toast.success(t.feedback, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            router.reload()
            // Başarılı mesaj veya yönlendirme ekleyebilirsiniz
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    useEffect(() => {
        const phoneInput = document.getElementById("phone");

        const formatPhoneNumber = () => {
            let value = phoneInput.value.replace(/\D/g, ""); // Sadece rakamları al
            setPhone(value)

            // Başlangıçta 0 ekleyip değerleri formatla
            let formattedValue = "";
            if (value.length > 0) {
                formattedValue += "0";
            }
            if (value.length > 1) {
                formattedValue += " (" + value.slice(1, 4);
            }
            if (value.length > 4) {
                formattedValue += ") " + value.slice(4, 7);
            }
            if (value.length > 7) {
                formattedValue += " " + value.slice(7, 9);
            }
            if (value.length > 9) {
                formattedValue += " " + value.slice(9, 11);
            }

            phoneInput.value = formattedValue;
        };

        phoneInput.addEventListener("input", formatPhoneNumber);

        // Temizleme işlemi
        return () => {
            phoneInput.removeEventListener("input", formatPhoneNumber);
        };
    }, []);

    const cleanPhoneNumber = (phone) => {
        console.log(phone,"phonephonephone")
        return phone.replace(/\D/g, ""); // Sadece rakamları al
    };

    return (
        <div className="pt-6 px-6">
            <ToastContainer />
            <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-4">
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t.name}</label>
                        <input
                            type="text"
                            id="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t.surname}</label>
                        <input
                            type="text"
                            id="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefon</label>
                    <input onChange={(e) => setPhone(e.target.value)} type="text" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0 (___) ___ __ __" />
                </div>
                <div>
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t.subject}</label>
                    <select
                        id="subject"
                        value={selectedSubject}
                        onChange={handleSelectSubject}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    >
                        <option value="">{t.selectsubject}</option>
                        {subject.map((subj) => (
                            <option key={subj.id} value={subj.id}>
                                {subj.subject}
                            </option>
                        ))}
                    </select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t.message}</label>
                    <textarea
                        id="message"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={t.entermessage}
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    {t.submit}
                </button>
            </div>
        </div>
    );
}
