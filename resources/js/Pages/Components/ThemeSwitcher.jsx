import React, { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import { MoonFilledIcon, SunFilledIcon } from "@nextui-org/shared-icons";

export function ThemeSwitcher() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("color-theme");
        return (
            savedTheme === "dark" ||
            (!savedTheme &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        );
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("color-theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const handleChange = () => {
        setIsDarkMode((prevTheme) => !prevTheme);
    };

    return (
        <Switch
            checked={isDarkMode}
            onChange={handleChange}
            classNames={{
                wrapper: "shadow-sm",
                startContent: "text-white",
            }}
            endContent={<MoonFilledIcon />}
            size="sm"
            startContent={<SunFilledIcon />}
        />
    );
}
