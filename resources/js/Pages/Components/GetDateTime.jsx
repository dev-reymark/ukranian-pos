import React from "react";
import { Input } from "@nextui-org/react";

export const GetDateTime = () => {
    const now = new Date();

    const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatDateTime = (date, timeZone) => {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: timeZone,
        };
        return new Intl.DateTimeFormat("en-US", options).format(date);
    };

    const currentDateTime = formatDateTime(now, serverTimeZone);

    return (
        <Input
            isReadOnly
            color="default"
            variant="flat"
            label={`Server Time (${serverTimeZone})`}
            value={currentDateTime}
            className="w-[25%]"
        />
    );
};
