import React, { useState, useEffect, useMemo } from "react";
import { Card, Tabs, Tab } from "@nextui-org/react";

const SaleSummary = ({ subtotal, totalDiscount, transactionSummary }) => (
    <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                    <td className="px-6 py-2 align-middle text-left font-bold">
                        SUBTOTAL
                    </td>
                    <td
                        colSpan="5"
                        className="px-6 py-2 align-middle text-right font-bold"
                    >
                        ₱{subtotal}
                    </td>
                </tr>
                {totalDiscount > 0 && (
                    <tr>
                        <td className="px-6 py-2 align-middle text-left font-bold">
                            TOTAL DISCOUNT
                        </td>
                        <td
                            colSpan="5"
                            className="px-6 py-2 align-middle text-right font-bold"
                        >
                            ₱{totalDiscount.toFixed(2)}
                        </td>
                    </tr>
                )}
                {transactionSummary.mopPayments.map((payment, index) => (
                    <tr key={index}>
                        <td className="px-6 py-2 align-middle text-left font-bold">
                            {payment.mopName}
                        </td>
                        <td
                            colSpan="5"
                            className="px-6 py-2 align-middle text-right font-bold"
                        >
                            ₱{payment.amount.toFixed(2)}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className="px-6 py-2 align-middle text-left font-bold">
                        Change
                    </td>
                    <td
                        colSpan="5"
                        className="px-6 py-2 align-middle text-right font-bold"
                    >
                        ₱{transactionSummary.change.toFixed(2)}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
);

export const SaleWindowTabs = ({
    deliveryData,
    setSelectedRow,
    subtotal,
    transactionSaved,
    transactionSummary,
}) => {
    const [showSummary, setShowSummary] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);

    useEffect(() => {
        if (transactionSaved) setShowSummary(true);
    }, [transactionSaved]);

    useEffect(() => {
        setShowSummary(false);
    }, [deliveryData]);

    const formattedItems = useMemo(
        () => Object.values(deliveryData).flat(),
        [deliveryData]
    );

    const handleRowClick = (item) => {
        setSelectedRow(item.Delivery_ID);
        setSelectedRowId(item.Delivery_ID);
    };

    const totalDiscount = useMemo(
        () =>
            formattedItems.reduce((acc, { DiscountedAmount }) => {
                const discountAmount = parseFloat(DiscountedAmount) || 0;
                return acc + discountAmount;
            }, 0),
        [formattedItems]
    );

    return (
        <Tabs aria-label="Sale Window">
            <Tab key="window1" title="WINDOW 1">
                <Card className="p-2">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-warning-100 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                                            ITEM(S)
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                                            PRICE
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                                            VOLUME (L)
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider">
                                            AMOUNT (₱)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formattedItems.length === 0 ? (
                                        <tr className="h-[150px]">
                                            <td
                                                colSpan="6"
                                                className="px-6 py-3 text-center text-xl font-extrabold text-gray-400"
                                            >
                                                Nothing to show
                                            </td>
                                        </tr>
                                    ) : (
                                        formattedItems.map(
                                            ({
                                                Delivery_ID,
                                                Pump,
                                                FuelGradeName,
                                                Price,
                                                Volume,
                                                OriginalAmount,
                                                Amount,
                                                PresetName,
                                                DiscountedAmount,
                                            }) => (
                                                <React.Fragment
                                                    key={Delivery_ID}
                                                >
                                                    <tr
                                                        onClick={() =>
                                                            handleRowClick({
                                                                Delivery_ID,
                                                            })
                                                        }
                                                        className={`cursor-pointer ${
                                                            selectedRowId ===
                                                            Delivery_ID
                                                                ? "bg-blue-100"
                                                                : "hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <td className="uppercase px-4 py-2 whitespace-nowrap">
                                                            {Pump} -{" "}
                                                            {FuelGradeName}
                                                        </td>
                                                        <td className="px-12 py-2 whitespace-nowrap">
                                                            {Price}
                                                        </td>
                                                        <td className="px-12 py-2 whitespace-nowrap">
                                                            {Volume.toFixed(2)}
                                                        </td>
                                                        <td className="px-12 py-2 whitespace-nowrap">
                                                            {OriginalAmount ||
                                                                Amount.toFixed(
                                                                    2
                                                                )}
                                                        </td>
                                                    </tr>
                                                    {DiscountedAmount && (
                                                        <tr>
                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                {PresetName}
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                            <td className="px-8 py-2 whitespace-nowrap">
                                                                (
                                                                {
                                                                    DiscountedAmount
                                                                }
                                                                )
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {showSummary && (
                            <div>
                                <SaleSummary
                                    subtotal={subtotal}
                                    totalDiscount={totalDiscount}
                                    transactionSummary={transactionSummary}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </Tab>
        </Tabs>
    );
};
