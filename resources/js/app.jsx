import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { NextUIProvider } from "@nextui-org/react";
import ScreenSizeWrapper from "./Pages/Components/ScreenSizeWrapper";

const appName = import.meta.env.VITE_APP_NAME || "VenusPOS";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <NextUIProvider>
                <ScreenSizeWrapper>
                    <App {...props} />
                </ScreenSizeWrapper>
            </NextUIProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
