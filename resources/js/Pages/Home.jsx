import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import { Card, Tabs, Tab, Input } from "@nextui-org/react";
import axios from "axios";
import { FaGasPump } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import SaleWindowTabs from "./Components/Sale/SaleWindowTabs";
import MOPCard from "./Components/MOP/MOPCard";
import POSKeyboard, { buttons } from "./Components/Sale/POSKeyboard";
import PumpCard from "./Components/Pump/PumpCard";

export default function Home() {
    const [inputValue, setInputValue] = useState("");
    const [pumpStatus, setPumpStatus] = useState([]);
    const [mopList, setMopList] = useState([]);
    const [deliveryData, setDeliveryData] = useState(() => {
        const savedData = localStorage.getItem("deliveryData");
        return savedData ? JSON.parse(savedData) : [];
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const [soundPlaying, setSoundPlaying] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const audioRef = useRef(null);
    const [selectedMOP, setSelectedMOP] = useState([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [transactionSaved, setTransactionSaved] = useState(false);
    const [remainingBalance, setRemainingBalance] = useState(0);

    const handleAppendDeliveryData = (pump) => {
        setDeliveryData((prevData) => {
            const updatedData = [...prevData, pump];
            // Save updated data to localStorage
            localStorage.setItem("deliveryData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    useEffect(() => {
        // Calculate subtotal
        const newSubtotal = deliveryData
            .reduce((total, item) => total + parseFloat(item.Amount || 0), 0)
            .toFixed(2);

        // Update input value with subtotal
        setInputValue(`Subtotal: ₱${newSubtotal}`);
    }, [deliveryData]);

    const handleClear = () => {
        setInputValue("");
    };

    const handleSubTotal = () => {
        setInputValue(`Subtotal: ₱${subtotal}`);
    };

    const handleVoidAll = () => {
        if (deliveryData.length === 0) {
            toast.error("No transactions to void");
            return;
        }
        setDeliveryData([]);
        localStorage.removeItem("deliveryData");
        localStorage.removeItem("disabledIds");
        toast.success("All transactions voided.");

        // Reset change
        setTotalPaid(0);

        // Dispatch a custom event to notify PumpDelivery
        window.dispatchEvent(new Event("disabledIdsUpdated"));
    };

    const handleVoid = () => {
        console.log("Selected Row:", selectedRow);
        if (selectedRow !== null) {
            const updatedData = deliveryData.filter(
                (item) => item.Delivery_ID !== selectedRow
            );
            setDeliveryData(updatedData);
            localStorage.setItem("deliveryData", JSON.stringify(updatedData));
            toast.success("Transaction voided");
            setSelectedRow(null);

            // Recompute subtotal based on remaining items
            const newSubtotal = updatedData
                .reduce(
                    (total, item) => total + parseFloat(item.Amount || 0),
                    0
                )
                .toFixed(2);

            // Recompute change based on the new subtotal
            const newChange = Math.max(0, totalPaid - newSubtotal).toFixed(2);

            // Update state with the new change value
            setTotalPaid(totalPaid); // Retain the totalPaid amount
            setInputValue(newChange);

            // Retrieve disabledIds from localStorage
            const savedDisabledIds = localStorage.getItem("disabledIds");
            if (savedDisabledIds) {
                const disabledIds = new Set(JSON.parse(savedDisabledIds));
                // Remove the specific Delivery_ID
                disabledIds.delete(selectedRow);
                // Save updated disabledIds to localStorage
                localStorage.setItem(
                    "disabledIds",
                    JSON.stringify(Array.from(disabledIds))
                );

                // Dispatch a custom event to notify PumpDelivery
                window.dispatchEvent(new Event("disabledIdsUpdated"));
            }
        } else {
            toast.error("No transaction selected");
        }
    };
    // Handle user interaction to enable sound playback
    const handleUserInteraction = () => {
        setUserInteracted(true);
        // Remove the event listener after the first interaction
        window.removeEventListener("click", handleUserInteraction);
    };

    useEffect(() => {
        // Add event listener to track user interaction
        window.addEventListener("click", handleUserInteraction);

        const fetchPumpStatus = () => {
            axios
                .get("/get-pump-status")
                .then((response) => {
                    const pumpData = response.data;
                    setPumpStatus(pumpData);

                    // Check for NozzleUp status and manage sound playback
                    const hasNozzleUpStatus = pumpData.some(
                        (pump) => pump.Data.NozzleUp
                    );

                    if (userInteracted) {
                        if (hasNozzleUpStatus && !soundPlaying) {
                            // Start playing sound if not already playing
                            if (audioRef.current) {
                                audioRef.current.loop = true; // Set loop to true
                                audioRef.current.play().catch((error) => {
                                    console.error(
                                        "Error playing sound:",
                                        error
                                    );
                                });
                            }
                            setSoundPlaying(true);
                        } else if (!hasNozzleUpStatus && soundPlaying) {
                            // Stop playing sound if NozzleUp is no longer present
                            if (audioRef.current) {
                                audioRef.current.pause();
                                audioRef.current.currentTime = 0; // Reset the sound to the beginning
                            }
                            setSoundPlaying(false);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching pump status:", error);
                });
        };

        const fetchMopList = () => {
            axios
                .get("/get-mop")
                .then((response) => {
                    setMopList(response.data.data);
                })
                .catch((error) => {
                    console.error("Error fetching MOP list:", error);
                });
        };

        fetchPumpStatus();
        fetchMopList();

        const interval = setInterval(fetchPumpStatus, 500);
        return () => clearInterval(interval);
    }, [soundPlaying, userInteracted]);

    const handleButtonClick = (value) => {
        setInputValue((prev) => prev + value);
        setTotalPaid((prev) => prev + value);
    };

    const handleStopAllPumps = async () => {
        try {
            // Send request to stop all pumps
            const response = await axios.post("/stop-all-pumps");
            toast.success("All pumps stopped successfully");
            console.log("All pumps stopped:", response.data);

            // Update state if needed or perform additional actions
        } catch (error) {
            toast.error("Error stopping all pumps");
            console.error("Error stopping all pumps:", error);
        }
    };

    const handlePrintReceipt = async (transactionId) => {
        if (!transactionId) {
            toast.error("Transaction ID is undefined");
            return;
        }

        try {
            const response = await axios.get(`/print-receipt/${transactionId}`);
            const receiptData = response.data;
        } catch (error) {
            toast.error("Error fetching receipt data");
            console.error("Error fetching receipt data:", error);
        }
    };

    const buttonClickHandlers = {
        handleVoid,
        handleVoidAll,
        setInputValue,
        handleClear,
        handleSubTotal,
        handlePrintReceipt,
        handleStopAllPumps,
    };

    // Handle MOP selection
    const handleSelectMOP = async (mop) => {
        console.log("MOP selected:", mop);
        // Check if there is an amount input
        if (
            inputValue === "" ||
            parseFloat(inputValue.replace("₱", "").replace(",", "")) <= 0
        ) {
            toast.error(
                "Please enter an amount before selecting a method of payment."
            );
            return;
        }
        setSelectedMOP(mop);

        // Trigger save transaction when an MOP is selected
        await saveTransaction();
    };

    // Calculate subtotal
    const subtotal = deliveryData
        .reduce((total, item) => total + parseFloat(item.Amount || 0), 0)
        .toFixed(2);
    // Calculate tax (12%)
    const taxTotal = subtotal / 1.12 * 0.12;

    // Calculate change
    const change = totalPaid - subtotal;

    // Save transaction with selected MOP
    const saveTransaction = async () => {
        if (!selectedMOP) {
            toast.error("Please select a method of payment");
            return;
        }

        if (deliveryData.length === 0) {
            toast.error("No transactions to save");
            return;
        }

        try {
            const response = await axios.post("/store-transactions", {
                subtotal,
                taxTotal,
                change,
                mopName: selectedMOP.MOP_Name.trim(),
                deliveryIds: deliveryData.map((item) => ({
                    Delivery_ID: item.Delivery_ID,
                    Pump: item.Pump,
                    Nozzle: item.Nozzle,
                    Volume: item.Volume,
                    Price: item.Price,
                    Amount: item.Amount,
                    FuelGradeName: item.FuelGradeName,
                })),
                payment: inputValue
            });

            const transactionId = response.data.transaction;
            if (transactionId) {
                toast.success("Transaction saved successfully");
                setTransactionSaved(true);
                const remaining = subtotal - totalPaid;
                setRemainingBalance(remaining);
                if (remaining > 0) {
                    setInputValue(`Amount Due: ₱${remaining.toFixed(2)}`);
                } else {
                    setInputValue(`Change: ₱${Math.abs(remaining).toFixed(2)}`);
                }
                // setDeliveryData([]);
                setSelectedMOP(null);
                setTotalPaid(0);

                // localStorage.removeItem("deliveryData");
                // localStorage.removeItem("disabledIds");

                // Print the receipt after saving the transaction
                await handlePrintReceipt(transactionId);
            } else {
                toast.error("Error retrieving transaction ID");
            }
        } catch (error) {
            toast.error("Error saving transaction");
            console.error("Error saving transaction:", error);
        }
    };

    return (
        <>
            <Head title="Home" />
            <audio ref={audioRef} src="assets/audio/nozzle-status-sound.wav" />
            <Toaster position="top-right" />
            <div className="min-h-screen p-3">
                <main className="w-full h-full mx-auto">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-4">
                        <Card className="flex flex-col h-full p-3">
                            {/* Sale Window */}
                            <div className="flex-grow">
                                <SaleWindowTabs
                                    deliveryData={deliveryData}
                                    setSelectedRow={setSelectedRow}
                                    subtotal={subtotal}
                                />
                            </div>
                            {/* POS Keyboard */}
                            <Card className="w-full gap-2 p-2">
                                <Input
                                    variant="faded"
                                    classNames={{
                                        input: [
                                            "text-black text-2xl font-bold text-right",
                                        ],
                                    }}
                                    value={inputValue}
                                    isReadOnly
                                    size="lg"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    <POSKeyboard
                                        handleButtonClick={handleButtonClick}
                                        buttons={buttons}
                                        buttonClickHandlers={
                                            buttonClickHandlers
                                        }
                                        setInputValue={setInputValue}
                                    />
                                </div>
                            </Card>
                        </Card>
                        {/* Pumps and other components */}
                        <Card className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10">
                            <div className="flex w-full flex-col">
                                <Tabs aria-label="Options" fullWidth>
                                    <Tab key="pumps" title="PUMPS">
                                        {pumpStatus.length === 0 ? (
                                            <div className="flex flex-col items-center mt-6">
                                                <FaGasPump className="w-12 h-12 text-danger" />
                                                <span className="mt-4">
                                                    No pumps found
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-2">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {pumpStatus.map((pump) => (
                                                        <PumpCard
                                                            key={pump.Id}
                                                            pump={pump}
                                                            handleAppendDeliveryData={
                                                                handleAppendDeliveryData
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Tab>

                                    <Tab key="mop" title="MOP">
                                        <div className="grid grid-cols-4 gap-4">
                                            <MOPCard
                                                mopList={mopList}
                                                onSelectMOP={handleSelectMOP}
                                            />
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
