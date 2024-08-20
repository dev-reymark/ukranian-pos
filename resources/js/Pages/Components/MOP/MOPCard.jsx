import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const mopImages = {
    CASH: "/assets/img/MOP/cash.webp",
    "METROBANK C CARD": "/assets/img/MOP/metrobank.webp",
    "QR GCASH": "/assets/img/MOP/gcashQr.webp",
    "QR PAYMAYA": "/assets/img/MOP/paymayaQr.webp",
    "PAYMAYA CREDIT CARD": "/assets/img/MOP/paymayaCreditCard.webp",
};

const MOPCard = ({ mopList, onSelectMOP }) => {
    return mopList.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
            {mopList.map((mop) => (
                <Card
                    key={mop.MOP_ID}
                    shadow="sm"
                    isPressable
                    onPress={() => onSelectMOP(mop)}
                    className="p-2 h-[200px]"
                >
                    <div className="flex justify-center items-center h-full">
                        <h1 className="text-xl font-extrabold">
                            {mop.MOP_Name.trim()}
                        </h1>
                    </div>
                </Card>
            ))}
        </div>
    ) : (
        <div className="col-span-4 text-center text-red-500">
            Payment method not found
        </div>
    );
};

export default MOPCard;
