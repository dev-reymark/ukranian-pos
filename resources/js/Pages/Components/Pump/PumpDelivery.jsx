import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import {
    Badge,
    Button,
    Table,
    TableColumn,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
} from "@nextui-org/react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { FaGasPump } from "react-icons/fa";

export default function PumpDelivery({ pumpId, onAppend, disabled }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [pumpData, setPumpData] = useState([]);
    const [disabledIds, setDisabledIds] = useState(new Set());
    const [deliveryCount, setDeliveryCount] = useState(0);

    useEffect(() => {
        // Load disabled IDs from localStorage
        const savedDisabledIds = localStorage.getItem("disabledIds");
        if (savedDisabledIds) {
            setDisabledIds(new Set(JSON.parse(savedDisabledIds)));
        }

        // Fetch pump data and update delivery count
        const fetchPumpData = async () => {
            try {
                const response = await axios.get(`/pump-deliveries/${pumpId}`);
                const unsoldPumpData = response.data.filter(
                    (pump) => pump.Is_Sold !== "1"
                );
                setPumpData(unsoldPumpData);
                setDeliveryCount(unsoldPumpData.length); // Set delivery count to the number of unsold deliveries
            } catch (error) {
                console.error("Error fetching pump data:", error);
            }
        };

        fetchPumpData();

        // Listen for the custom event
        const handleDisabledIdsUpdate = () => {
            const updatedDisabledIds = localStorage.getItem("disabledIds");
            if (updatedDisabledIds) {
                setDisabledIds(new Set(JSON.parse(updatedDisabledIds)));
            } else {
                setDisabledIds(new Set());
            }
        };
        window.addEventListener("disabledIdsUpdated", handleDisabledIdsUpdate);

        // Update delivery count every 10 seconds (Reduced frequency)
        const interval = setInterval(() => {
            fetchPumpData();
        }, 10000);

        return () => clearInterval(interval);
    }, [pumpId]);

    useEffect(() => {
        if (openDialog) {
            fetchPumpData(pumpId);
        }
    }, [openDialog, pumpId]);

    const fetchPumpData = async (pumpId) => {
        try {
            const response = await axios.get(`/pump-deliveries/${pumpId}`);
            const unsoldPumpData = response.data.filter(
                (pump) => pump.Is_Sold !== "1"
            );
            setPumpData(unsoldPumpData);
            setDeliveryCount(unsoldPumpData.length); // Update delivery count
        } catch (error) {
            console.error("Error fetching pump data:", error);
        }
    };

    const handleAppend = useCallback(
        (pump) => {
            onAppend(pump);
            const updatedDisabledIds = new Set(disabledIds).add(
                pump.Delivery_ID
            );
            setDisabledIds(updatedDisabledIds);
            // Save updated disabled IDs to localStorage
            localStorage.setItem(
                "disabledIds",
                JSON.stringify(Array.from(updatedDisabledIds))
            );
        },
        [disabledIds, onAppend]
    );

    const isRowDisabled = (id) => {
        return disabledIds.has(id);
    };

    return (
        <>
            <Badge content={deliveryCount} shape="circle" color="danger">
                <Button
                    radius="full"
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    isDisabled={disabled}
                >
                    <FaGasPump className="h-4 w-4" />
                </Button>
            </Badge>
            {openDialog && (
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    className="relative z-10"
                >
                    <DialogBackdrop transition />
                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <DialogPanel
                                    transition
                                    className="pointer-events-auto relative w-screen max-w-sm sm:max-w-md lg:max-w-3xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                                >
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="flex justify-between px-4 sm:px-6">
                                            <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                                                Pump Deliveries
                                            </DialogTitle>
                                            <Button
                                                size="sm"
                                                radius="full"
                                                type="button"
                                                onClick={() =>
                                                    setOpenDialog(false)
                                                }
                                                color="danger"
                                                isIconOnly
                                            >
                                                <IoMdClose className="w-5 h-5" />
                                            </Button>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <Table aria-label="Pumps Data">
                                                <TableHeader>
                                                    <TableColumn>
                                                        DELIVERY ID
                                                    </TableColumn>
                                                    <TableColumn>
                                                        PUMP
                                                    </TableColumn>
                                                    <TableColumn>
                                                        NOZZLE
                                                    </TableColumn>
                                                    <TableColumn>
                                                        ITEM
                                                    </TableColumn>
                                                    <TableColumn>
                                                        VOLUME
                                                    </TableColumn>
                                                    <TableColumn>
                                                        PRICE
                                                    </TableColumn>
                                                    <TableColumn>
                                                        AMOUNT
                                                    </TableColumn>
                                                </TableHeader>
                                                <TableBody emptyContent="There are no pending deliveries.">
                                                    {pumpData.map((pump) => (
                                                        <TableRow
                                                            key={
                                                                pump.Delivery_ID
                                                            }
                                                            className={
                                                                isRowDisabled(
                                                                    pump.Delivery_ID
                                                                )
                                                                    ? "bg-default-300 cursor-not-allowed"
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                !isRowDisabled(
                                                                    pump.Delivery_ID
                                                                ) &&
                                                                handleAppend(
                                                                    pump
                                                                )
                                                            }
                                                            disabled={isRowDisabled(
                                                                pump.Delivery_ID
                                                            )}
                                                        >
                                                            <TableCell>
                                                                {
                                                                    pump.Delivery_ID
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.Pump}
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.Nozzle}
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.FuelGradeName}
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.Volume}
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.Price}
                                                            </TableCell>
                                                            <TableCell>
                                                                {pump.Amount}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
}
