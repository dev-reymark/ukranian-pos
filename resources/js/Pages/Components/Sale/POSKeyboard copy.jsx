import React from "react";
import { Button } from "@nextui-org/react";

export const buttons = [
    {
        label: "CLEAR",
        color: "warning",
        onClick: "handleClear",
    },
    {
        label: "VOID",
        color: "danger",
        onClick: "handleVoid",
    },
    {
        label: "VOID ALL",
        color: "danger",
        onClick: "handleVoidAll",
    },
    {
        label: "LOGOUT",
        color: "danger",
        onClick: "handleLogout",
    },
    {
        label: "OPEN DRAWER",
        color: "primary",
        onClick: "handleOpenDrawer",
    },
    {
        label: "SUB-TOTAL",
        color: "primary",
        onClick: "handleSubTotal",
    },
    {
        label: "PRINT RECEIPT",
        color: "primary",
        onClick: "handlePrintReceipt",
    },
    {
        label: "ZERO RATED",
        color: "default",
    },
    {
        label: "PG DISC",
        color: "secondary",
    },
    {
        label: "CUSTOMER INFO",
        color: "success",
        onClick: "handleOpenCustomerDetails",
    },
    {
        label: "ALL STOP",
        color: "danger",
        onClick: "handleStopAllPumps",
    },
    {
        label: "ALL AUTH",
        color: "primary",
        onClick: "handleAuthorizeAllPumps",
    },
];

const POSKeyboard = ({
    handleButtonClick,
    buttons,
    buttonClickHandlers,
    setInputValue,
}) => {
    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00", "."].map((num) => (
                    <Button
                        key={num}
                        color="primary"
                        size="lg"
                        variant="shadow"
                        // radius="full"
                        onClick={() => handleButtonClick(num.toString())}
                        className="text-2xl font-bold"
                    >
                        {num}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
                {buttons.map(({ label, color, onClick, className }, index) => (
                    <Button
                        key={index}
                        size="lg"
                        color={color}
                        variant="shadow"
                        className="font-bold"
                        onClick={() => {
                            if (
                                typeof onClick === "string" &&
                                buttonClickHandlers[onClick]
                            ) {
                                buttonClickHandlers[onClick]();
                            } else if (typeof onClick === "function") {
                                // Call the function directly with setInputValue if needed
                                onClick(setInputValue);
                            }
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default POSKeyboard;
