import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";

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
    buttons,
    setInputValue,
    onToast,
    subtotal,
    selectedRow,
    setSelectedRow,
    deliveryData,
    setDeliveryData,
    setCustomerModalOpen,
    setTransactionSaved,
    setTransactionSummary,
    setTotalPaid,
    totalPaid,
    handlePrintReceipt,
}) => {
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to log out and you won't be able to recover this session!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!",
        });

        if (result.isConfirmed) {
            try {
                await axios.post("/logout");
                window.location.href = "/";
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }
    };

    const handleVoidAll = () => {
        if (deliveryData.length === 0) {
            onToast("No items to void", "error");
            return;
        }
        setDeliveryData([]);
        setTimeout(() => {
            console.log("DeliveryData after reset:", deliveryData); // Check if it’s empty
        }, 0);
        localStorage.removeItem("transaction");
        localStorage.removeItem("deliveryData");
        localStorage.removeItem("disabledIds");
        onToast("All items voided", "success");
        setTransactionSaved(false);
        setTransactionSummary({ mopPayments: [], change: 0 });
        // Reset change
        setTotalPaid(0);
        setInputValue("");

        // Dispatch a custom event to notify PumpDelivery
        window.dispatchEvent(new Event("disabledIdsUpdated"));
    };

    const handleVoid = () => {
        console.log("Selected Row:", selectedRow);
        if (selectedRow !== null) {
            const updatedData = deliveryData.filter(
                (item) => item.Delivery_ID !== selectedRow
            );
            setDeliveryData(updatedData);
            localStorage.setItem("deliveryData", JSON.stringify(updatedData));
            onToast("Item voided", "success");
            setSelectedRow(null);

            // Recompute subtotal based on remaining items
            const newSubtotal = updatedData
                .reduce(
                    (total, item) => total + parseFloat(item.Amount || 0),
                    0
                )
                .toFixed(2);

            // Recompute change based on the new subtotal
            const newChange = Math.max(0, totalPaid - newSubtotal).toFixed(2);

            // Update state with the new change value
            setTotalPaid(totalPaid); // Retain the totalPaid amount
            setInputValue(newChange);

            // Retrieve disabledIds from localStorage
            const savedDisabledIds = localStorage.getItem("disabledIds");
            if (savedDisabledIds) {
                const disabledIds = new Set(JSON.parse(savedDisabledIds));
                // Remove the specific Delivery_ID
                disabledIds.delete(selectedRow);
                // Save updated disabledIds to localStorage
                localStorage.setItem(
                    "disabledIds",
                    JSON.stringify(Array.from(disabledIds))
                );

                // Dispatch a custom event to notify PumpDelivery
                window.dispatchEvent(new Event("disabledIdsUpdated"));
            }
        } else {
            onToast("No item to void", "error");
        }
    };

    const handleClear = () => {
        setInputValue("");
    };

    const handleSubTotal = () => {
        setInputValue(`₱ ${subtotal}`);
    };

    const handleStopAllPumps = async () => {
        try {
            // Send request to stop all pumps
            const response = await axios.post("/stop-all-pumps");
            onToast("All pumps stopped", "success");
            console.log("All pumps stopped:", response.data);

            // Update state if needed or perform additional actions
        } catch (error) {
            onToast("Error stopping all pumps", "error");
            console.error("Error stopping all pumps:", error);
        }
    };

    const handleAuthorizeAllPumps = async () => {
        try {
            const payload = {
                Type: "FullTank",
            };
            // Send request to authorize all pumps
            const response = await axios.post("/authorize-all-pumps", payload);
            onToast("All pumps authorized", "success");
            console.log("All pumps authorized:", response.data);
        } catch (error) {
            onToast("Error authorizing all pumps", "error");
            console.error("Error authorizing all pumps:", error);
        }
    };

    const handleOpenCustomerDetails = () => {
        setCustomerModalOpen(true);
    };

    const handleOpenDrawer = async () => {
        try {
            const response = await axios.get("/open-cash-drawer");
            onToast("Drawer opened", "success");
            console.log("Drawer opened:", response.data);
        } catch (error) {
            onToast("Error opening drawer", "error");
            console.error(
                "Error opening drawer:",
                error.response ? error.response.data : error.message
            );
        }
    };

    // Map button click handlers
    const buttonClickHandlers = {
        handleLogout,
        handleVoid,
        handleVoidAll,
        handleClear,
        handleSubTotal,
        handleStopAllPumps,
        handleAuthorizeAllPumps,
        handleOpenCustomerDetails,
        handleOpenDrawer,
        handlePrintReceipt
    };

    const handleButtonClick = (value) => {
        setInputValue((prev) => prev + value);
    };

    return (
        <div className="grid grid-cols-2 gap-1">
            <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00", "."].map((num) => (
                    <Button
                        key={num}
                        color="primary"
                        size="md"
                        variant="shadow"
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
                        size="md"
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
                                onClick(setInputValue);
                            }
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default POSKeyboard;
