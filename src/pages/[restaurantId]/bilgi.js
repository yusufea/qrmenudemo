import { FaWifi } from "react-icons/fa";

export default function Info() {
    return (
        <div className="flex flex-col gap-3 ">
            <h4 className="text-center text-black text-lg font-bold dark:text-white">Bilgiler</h4>
            <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                        <FaWifi className="w-6 h-6" />
                        <h4 className="text-black dark:text-white text-lg">Wifi Şifresi:</h4>
                    </div>
                    <h4 className="text-black dark:text-white text-lg">bigmamas2023</h4>
                </div>
            </div>
        </div>
    )
}