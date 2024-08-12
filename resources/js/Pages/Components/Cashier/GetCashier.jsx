import React, { useEffect, useState } from "react";
import { Chip, User } from "@nextui-org/react";
import axios from "axios";

export const GetCashier = () => {
    const [cashierName, setCashierName] = useState("");
    const [cashierId, setCashierId] = useState("");

    useEffect(() => {
        // Fetch logged-in cashier details
        axios
            .get("cashier-name")
            .then((response) => {
                setCashierName(response.data.Cashier_Name);
                setCashierId(response.data.Cashier_ID);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the cashier details!",
                    error
                );
            });
    }, []);

    return (
        <div className="flex gap-5">
            <User
                name={
                    <h1 className="font-semibold leading-none text-default-600">
                        {cashierName}
                    </h1>
                }
                description={"Cashier ID: " + cashierId}
                avatarProps={{
                    src: "/assets/img/cashier.png",
                }}
            />
        </div>
    );
};

export const ShiftSchedule = () => {
    const currentHour = new Date().getHours();

    let shiftName;

    if (currentHour >= 6 && currentHour < 14) {
        shiftName = "1st Shift (6 AM - 2 PM)";
    } else if (currentHour >= 14 && currentHour < 22) {
        shiftName = "2nd Shift (2 PM - 10 PM)";
    } else {
        shiftName = "GY (10 PM - 6 AM)";
    }

    return <Chip size="sm">{shiftName}</Chip>;
};
