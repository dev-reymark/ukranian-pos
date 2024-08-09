import React, { useEffect, useState } from "react";
import { User } from "@nextui-org/react";
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
