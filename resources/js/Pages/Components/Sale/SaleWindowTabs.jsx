import React from "react";
import {
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tabs,
    Tab,
} from "@nextui-org/react";

const SaleWindowTabs = ({ deliveryData, setSelectedRow, change, subtotal }) => {
    const formattedItems = Object.values(deliveryData).flat();

    const handleRowClick = (item) => {
        console.log("Row clicked:", item);
        setSelectedRow(item.Delivery_ID);
    };

    return (
        <>
            <Tabs aria-label="Options">
                <Tab key="window1" title="Window 1">
                    <Table
                        isHeaderSticky
                        aria-label="Transactions"
                        selectionMode="single"
                    >
                        <TableHeader>
                            <TableColumn>ITEM(S)</TableColumn>
                            <TableColumn>PRICE</TableColumn>
                            <TableColumn>QUANTITY</TableColumn>
                            <TableColumn>AMOUNT</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={formattedItems}
                            emptyContent="There are no transactions."
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
                                    <TableCell>{item.Volume}</TableCell>
                                    <TableCell>{item.Amount}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell className="font-bold">
                                    CASH
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-bold">
                                    TOTAL INVOICE
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>{subtotal}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    TOTAL PAYMENT
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-bold">
                                    TOTAL CHANGE
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>{change}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Tab>
            </Tabs>
        </>
    );
};

export default SaleWindowTabs;
