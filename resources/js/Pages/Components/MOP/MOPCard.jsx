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
        <div className="grid grid-cols-4 gap-4">
            {mopList.map((mop) => (
                <Card
                    shadow="sm"
                    key={mop.MOP_ID}
                    isPressable
                    onPress={() => onSelectMOP(mop)}
                >
                    <CardBody className="overflow-visible p-0">
                        <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt={mop.MOP_Name.trim()}
                            className="w-full object-cover h-[200px]"
                            // src={
                            //     mopImages[mop.MOP_Name.trim()] ||
                            //     "/assets/img/MOP/mop.webp"
                            // }
                        />
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                        <b>{mop.MOP_Name.trim()}</b>
                    </CardFooter>
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
