import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const MOPCard = ({ mopList, onSelectMOP }) => {
    return mopList.length > 0 ? (
        mopList.map((mop) => (
            <Card key={mop.MOP_ID} isPressable onPress={() => onSelectMOP(mop)}>
                <CardBody>
                    <div className="text-xl text-center">{mop.MOP_Name.trim()}</div>
                </CardBody>
            </Card>
        ))
    ) : (
        <div className="col-span-4 text-center text-red-500">Payment method not found</div>
    );
};

export default MOPCard;
