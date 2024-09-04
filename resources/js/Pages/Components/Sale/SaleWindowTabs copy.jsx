import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tabs,
    Tab,
} from "@nextui-org/react";

const SaleWindowTabs = ({
    deliveryData,
    setSelectedRow,
    subtotal,
    transactionSaved,
    transactionSummary,
}) => {
    const [showSummary, setShowSummary] = useState(false);

    // Update showSummary when transaction is saved
    useEffect(() => {
        if (transactionSaved) {
            setShowSummary(true);
        }
    }, [transactionSaved]);

    // Reset showSummary when deliveryData changes
    useEffect(() => {
        setShowSummary(false);
    }, [deliveryData]);

    const formattedItems = Object.values(deliveryData).flat();

    const handleRowClick = (item) => {
        console.log("Row clicked:", item);
        setSelectedRow(item.Delivery_ID);
    };

    return (
        <>
            <Tabs aria-label="Sale Window">
                <Tab key="window1" title="WINDOW 1">
                    <Card className="p-2">
                        <Table
                            removeWrapper
                            isHeaderSticky
                            aria-label="Transactions"
                            selectionMode="single"
                            className="max-h-[330px] overflow-y-auto scrollbar-hide"
                        >
                            <TableHeader>
                                <TableColumn>ITEM(S)</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>VOLUME(L)</TableColumn>
                                <TableColumn>AMOUNT(₱)</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={formattedItems}
                                emptyContent={
                                    <h1 className="text-xl font-extrabold">
                                        No Transactions!
                                    </h1>
                                }
                            >
                                {formattedItems.map((item) => (
                                    <TableRow
                                        key={item.Delivery_ID}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <TableCell>
                                            {item.Pump} - {item.FuelGradeName}
                                        </TableCell>
                                        <TableCell>{item.Price}</TableCell>
                                        <TableCell>
                                            {item.Volume.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{item.Amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {showSummary && (
                            <div>
                                <Table
                                    aria-label="Transaction Summary"
                                    hideHeader
                                    removeWrapper
                                >
                                    <TableHeader>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="subtotal">
                                            <TableCell className="font-bold">
                                                SUBTOTAL
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-bold">
                                                ₱{subtotal}
                                            </TableCell>
                                        </TableRow>
                                        {transactionSummary.mopPayments.map(
                                            (payment, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-bold">
                                                        {payment.mopName}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell className="font-bold">
                                                        ₱
                                                        {payment.amount.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        <TableRow key="change">
                                            <TableCell className="font-bold">
                                                Change
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-bold">
                                                ₱
                                                {transactionSummary.change.toFixed(
                                                    2
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                </Tab>
                <Tab key="window2" title="WINDOW 2">
                    <Card className="p-2 h-[340px]">
                        <Table
                            removeWrapper
                            isHeaderSticky
                            aria-label="Transactions"
                            selectionMode="single"
                            className="max-h-[330px] overflow-y-auto scrollbar-hide"
                        >
                            <TableHeader>
                                <TableColumn>ITEM(S)</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>VOLUME(L)</TableColumn>
                                <TableColumn>AMOUNT(₱)</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={formattedItems}
                                emptyContent={
                                    <h1 className="text-xl font-extrabold mt-20">
                                        No transactions yet.
                                    </h1>
                                }
                            >
                                {formattedItems.map((item) => (
                                    <TableRow
                                        key={item.Delivery_ID}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <TableCell>
                                            {item.Pump} - {item.FuelGradeName}
                                        </TableCell>
                                        <TableCell>{item.Price}</TableCell>
                                        <TableCell>
                                            {item.Volume.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{item.Amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {showSummary && (
                            <div>
                                <Table
                                    aria-label="Transaction Summary"
                                    hideHeader
                                    removeWrapper
                                >
                                    <TableHeader>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                        <TableColumn></TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow key="subtotal">
                                            <TableCell className="font-bold">
                                                SUBTOTAL
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-bold">
                                                ₱{subtotal}
                                            </TableCell>
                                        </TableRow>
                                        {transactionSummary.mopPayments.map(
                                            (payment, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-bold">
                                                        {payment.mopName}
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell className="font-bold">
                                                        ₱
                                                        {payment.amount.toFixed(
                                                            2
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        <TableRow key="change">
                                            <TableCell className="font-bold">
                                                Change
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="font-bold">
                                                ₱
                                                {transactionSummary.change.toFixed(
                                                    2
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                </Tab>
            </Tabs>
        </>
    );
};

export default SaleWindowTabs;
