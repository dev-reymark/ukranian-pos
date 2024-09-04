import React, { useState, useEffect } from "react";
import { Card, Tabs, Tab } from "@nextui-org/react";

const SaleWindowTabs = ({
    deliveryData,
    setSelectedRow,
    subtotal,
    transactionSaved,
    transactionSummary,
}) => {
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        if (transactionSaved) {
            setShowSummary(true);
        }
    }, [transactionSaved]);

    useEffect(() => {
        setShowSummary(false);
    }, [deliveryData]);

    const formattedItems = Object.values(deliveryData).flat();

    const handleRowClick = (item) => {
        console.log("Row clicked:", item);
        setSelectedRow(item.Delivery_ID);
    };

    // Calculate the total discount, ensuring it is a number
    const totalDiscount = formattedItems.reduce((acc, item) => {
        const discountAmount = parseFloat(item.DiscountedAmount) || 0;
        return acc + discountAmount;
    }, 0);

    return (
        <>
            <Tabs aria-label="Sale Window">
                <Tab key="window1" title="WINDOW 1">
                    <Card className="p-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ITEM(S)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            PRICE
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            VOLUME(L)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            AMOUNT(₱)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {formattedItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-3 text-center text-xl font-extrabold"
                                            >
                                                No Transactions!
                                            </td>
                                        </tr>
                                    ) : (
                                        formattedItems.map((item) => (
                                            <React.Fragment
                                                key={item.Delivery_ID}
                                            >
                                                <tr
                                                    onClick={() =>
                                                        handleRowClick(item)
                                                    }
                                                    className="hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <td className="uppercase px-6 py-4 whitespace-nowrap">
                                                        {item.Pump} -{" "}
                                                        {item.FuelGradeName}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.Price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.Volume.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {item.OriginalAmount ||
                                                            item.Amount}
                                                    </td>
                                                </tr>
                                                {item.DiscountedAmount && (
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {item.PresetName}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            - (
                                                            {
                                                                item.DiscountedAmount
                                                            }
                                                            )
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {showSummary && (
                            <div className="mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="sr-only">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                SUBTOTAL
                                            </td>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 whitespace-nowrap text-right font-bold"
                                            >
                                                ₱{subtotal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                TOTAL DISCOUNT
                                            </td>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 whitespace-nowrap text-right font-bold"
                                            >
                                                ₱{totalDiscount.toFixed(2)}
                                            </td>
                                        </tr>
                                        {transactionSummary.mopPayments.map(
                                            (payment, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                        {payment.mopName}
                                                    </td>
                                                    <td
                                                        colSpan="5"
                                                        className="px-6 py-4 whitespace-nowrap text-right font-bold"
                                                    >
                                                        ₱
                                                        {payment.amount.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">
                                                Change
                                            </td>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 whitespace-nowrap text-right font-bold"
                                            >
                                                ₱
                                                {transactionSummary.change.toFixed(
                                                    2
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </Tab>
            </Tabs>
        </>
    );
};

export default SaleWindowTabs;
