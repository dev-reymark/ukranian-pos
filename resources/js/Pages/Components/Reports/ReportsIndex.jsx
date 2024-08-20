import React from "react";
import { Card } from "@nextui-org/react";

export default function ReportsIndex() {
    const reports = [
        "CLOSE CASHDRAW",
        "PRINT CASHDRAW",
        "ATT PRINT SHIFT",
        "CLOSE SHIFT",
        "PRINT SHIFT",
        "CUMULATIVE SALE",
        "CLOSE DAY",
        "PRINT DAY",
        "CALIBRATION",
        "CLOSE MONTH",
        "PRINT MONTH",
        "TAPPING",
    ];

    return (
        <div className="w-full h-full mx-auto gap-2 grid grid-cols-4">
            {reports.map((report, index) => (
                <Card
                    key={index}
                    className="p-2 h-[200px]"
                >
                    <div className="flex justify-center items-center h-full">
                        <h1 className="text-xl font-extrabold">{report}</h1>
                    </div>
                </Card>
            ))}
        </div>
    );
}
