import { useTheme } from "next-themes";
import { FaSun,FaMoon } from "react-icons/fa";

const { useState, useEffect } = require("react")

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) {
        return null;
    }

    const handleTheme = () => {
        if (theme === 'light') {
            setTheme("dark")
        } else {
            setTheme('light')
        }
    }

    return (
        <div>
            {theme == 'light' ? <button onClick={() => handleTheme()}><FaMoon className="dark:text-white" fontSize={28}/></button> : <button onClick={() => handleTheme()}><FaSun className="dark:text-white" fontSize={28}/></button>}
        </div >
    )
}

export default ThemeSwitcher