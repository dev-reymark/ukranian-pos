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
        <div className="grid grid-cols-4 gap-2">
            {reports.map((report, index) => (
                <Card
                    key={index}
                    className="p-2 w-full h-[150px]"
                    isPressable
                    onPress={() => alert(`localhost says: ${report}`)}
                    shadow="sm"
                >
                    <div className="flex justify-center items-center h-full">
                        <h1 className="text-xl font-extrabold">{report}</h1>
                    </div>
                </Card>
            ))}
        </div>
    );
}
