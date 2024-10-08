import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import axios from "axios";

// Display the current printer status and error message
export const PrinterStatus = () => {
    const [printerStatus, setPrinterStatus] = useState("Checking...");
    const [printerError, setPrinterError] = useState("");

    useEffect(() => {
        // Fetch printer status
        axios
            .get("printer-status")
            .then((response) => {
                setPrinterStatus(response.data.status);
                if (response.data.status === "disconnected") {
                    setPrinterError(response.data.error);
                } else {
                    setPrinterError("");
                }
            })
            .catch((error) => {
                setPrinterStatus("Error");
                setPrinterError("Failed to fetch printer status.");
                console.error("Failed to fetch printer status:", error);
            });
    }, []);

    const statusStyles = (status) => {
        switch (status) {
            case "connected":
                return "success";
            case "disconnected":
                return "danger";
            case "Checking...":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <div>
            <Input
                isReadOnly
                label="Printer Status"
                color={statusStyles(printerStatus)}
                size="lg"
                value={printerStatus + " " + printerError}
            />
        </div>
    );
};
