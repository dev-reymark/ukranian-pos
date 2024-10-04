import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardBody,
    Tabs,
    Tab,
    Spacer,
    Input,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MOPCard from "./Components/MOP/MOPCard";
import POSKeyboard, { buttons } from "./Components/Sale/POSKeyboard";
import { PumpCard } from "./Components/Pump/PumpCard";
import { CustomerDetails } from "./Customer/CustomerDetails";
import { PrinterStatus } from "./Components/Printer/PrinterStatus";
import { GetCashier } from "./Components/Cashier/GetCashier";
import { GetDateTime } from "./Components/GetDateTime";
import { ThemeSwitcher } from "./Components/ThemeSwitcher";
import Index from "./Config/Index";
import { CardDetails } from "./Components/MOP/CardDetails";
import { SaleWindowTabs } from "./Components/Sale/SaleWindowTabs";
import ReportsIndex from "./Reports/ReportsIndex";
import { GiGasPump } from "react-icons/gi";

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
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        approvalCode: "",
        cardHolderName: "",
    });
    const [isCardDetailsOpen, setCardDetailsOpen] = useState(false);
    const [customerData, setCustomerData] = useState({
        name: "",
        address: "",
        tin: "",
        businessStyle: "",
    });

    const handleCloseCustomerDetails = () => {
        setCustomerModalOpen(false);
    };

    const handleSaveCustomerDetails = () => {
        handleCloseCustomerDetails();
    };

    const handleCustomerDataChange = (key, value) => {
        setCustomerData((prev) => ({ ...prev, [key]: value }));
    };

    const handleAppendDeliveryData = (pump) => {
        setDeliveryData((prevData) => {
            const updatedData = [...prevData, pump];
            localStorage.setItem("deliveryData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    const handleToast = (message, type) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "warning") {
            toast.warning(message);
        } else if (type === "error") {
            toast.error(message);
        } else if (type === "info") {
            toast.info(message);
        }
    };

    // Handle user interaction to enable sound playback
    const handleUserInteraction = () => {
        setUserInteracted(true);
        window.removeEventListener("click", handleUserInteraction);
    };

    useEffect(() => {
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

    // Handle MOP selection
    const handleSelectMOP = async (mop) => {
        const currentPayment = parseFloat(
            inputValue.replace("₱", "").replace(",", "")
        );

        if (inputValue === "" || currentPayment <= 0) {
            toast.warning("Please enter amount to pay");
            return;
        }

        const existingTransaction = JSON.parse(
            localStorage.getItem("transaction")
        ) || {
            subtotal: parseFloat(subtotal),
            payments: [],
            remainingBalance: parseFloat(subtotal),
        };

        const newRemainingBalance =
            existingTransaction.remainingBalance - currentPayment;

        existingTransaction.payments.push({
            mopName: mop.MOP_Name,
            amount: currentPayment,
        });
        existingTransaction.remainingBalance = newRemainingBalance;

        localStorage.setItem(
            "transaction",
            JSON.stringify(existingTransaction)
        );

        if (mop.MOP_Ref === "3") {
            setCardDetailsOpen(true);
            return;
        }

        if (newRemainingBalance >= 0) {
            if (newRemainingBalance === 0) {
                await saveTransaction();
            } else {
                setInputValue(`Amount Due: ₱${newRemainingBalance.toFixed(2)}`);
            }
        } else {
            const newChange = Math.abs(newRemainingBalance).toFixed(2);
            toast.success(`Change: ₱${newChange}`);
            setInputValue(`Change: ₱${newChange}`);

            // Since the payment is more than the total, we can save the transaction
            existingTransaction.remainingBalance = 0;
            localStorage.setItem(
                "transaction",
                JSON.stringify(existingTransaction)
            );

            await saveTransaction();
        }
    };

    // Calculate subtotal
    const subtotal = deliveryData
        .reduce((total, item) => total + parseFloat(item.Amount || 0), 0)
        .toFixed(2);

    const [transactionSummary, setTransactionSummary] = useState({
        change: 0,
        mopNames: [],
        mopPayments: [],
        deliveryData: [],
    });

    const handleApplyDiscount = (selectedDiscount, preset) => {
        if (selectedRow === null || selectedRow === undefined) {
            toast.error("Please select an item to apply discount");
            return;
        }

        if (
            selectedDiscount.discount_id >= 1 &&
            selectedDiscount.discount_id <= 4
        ) {
            toast.info("Discount not applicable");
            return;
        }

        const updatedData = deliveryData.map((item) => {
            if (item.Delivery_ID === selectedRow) {
                // Check if item already has a discount
                if (item.DiscountedAmount) {
                    toast.info("Discount already applied to this item.");
                    return item;
                }
                let discountAmount = 0;

                switch (selectedDiscount?.discount_type) {
                    case "1": // Percentage
                        discountAmount =
                            (parseFloat(item.Amount) *
                                parseFloat(preset?.preset_value)) /
                            100;
                        break;
                    case "2": // Price per liter
                        discountAmount =
                            parseFloat(item.Volume) *
                            parseFloat(preset?.preset_value);
                        break;
                    case "3": // Fixed price
                        discountAmount = parseFloat(preset?.preset_value);
                        break;
                    default:
                        break;
                }

                const discountedAmount =
                    parseFloat(item.Amount) - discountAmount;

                return {
                    ...item,
                    OriginalAmount: item.Amount,
                    Amount: discountedAmount.toFixed(2),
                    DiscountedAmount: discountAmount.toFixed(2),
                    PresetName: preset?.preset_name,
                    DiscountType: selectedDiscount?.discount_type,
                    PresetValue: preset?.preset_value,
                };
            }
            return item;
        });

        setDeliveryData(updatedData);
        toast.success("Discount applied.");
    };

    // Save transaction with selected MOP
    const saveTransaction = async () => {
        const transactionData = JSON.parse(localStorage.getItem("transaction"));
        if (!transactionData) {
            toast.error("No transaction found");
            return;
        }

        // If the selected MOP is a card, ensure card details are provided
        if (selectedMOP && selectedMOP.MOP_Ref === "3") {
            if (!cardNumber || !approvalCode || !cardHolderName) {
                toast.error("Please provide complete card details.");
                setCardDetailsOpen(true);
                return;
            }
        }

        const totalPaid = transactionData.payments.reduce(
            (acc, payment) => acc + payment.amount,
            0
        );
        const change = Math.max(
            0,
            totalPaid - transactionData.subtotal
        ).toFixed(2);

        try {
            const response = await axios.post("/store-transactions", {
                subtotal: transactionData.subtotal,
                taxTotal: (transactionData.subtotal / 1.12) * 0.12,
                ...(parseFloat(change) > 0 && { change: parseFloat(change) }),
                mopNames: transactionData.payments.map((payment) =>
                    payment.mopName.trim()
                ),
                mopPayments: transactionData.payments,
                deliveryIds: deliveryData.map((item) => ({
                    Delivery_ID: item.Delivery_ID,
                    Pump: item.Pump,
                    Nozzle: item.Nozzle,
                    Volume: item.Volume,
                    Price: item.Price,
                    Amount: item.Amount,
                    OriginalAmount: item.OriginalAmount,
                    DiscountedAmount: item.DiscountedAmount,
                    DiscountType: item.DiscountType,
                    PresetName: item.PresetName,
                    PresetValue: item.PresetValue,
                    FuelGradeName: item.FuelGradeName,
                })),
                customer: {
                    name: customerData.name,
                    address: customerData.address,
                    tin: customerData.tin,
                    businessStyle: customerData.businessStyle,
                },
                cardDetails: {
                    cardNumber: cardDetails.cardNumber,
                    approvalCode: cardDetails.approvalCode,
                    cardHolderName: cardDetails.cardHolderName,
                },
            });

            const transactionId = response.data.transaction;
            if (transactionId) {
                localStorage.setItem("transactionId", transactionId);
                toast.success("Transaction saved");
                setTransactionSaved(true);
                setRemainingBalance(0);
                setInputValue("Transaction Complete");
                // Save summary details
                setTransactionSummary({
                    change: parseFloat(change),
                    mopNames: transactionData.payments.map(
                        (payment) => payment.mopName
                    ),
                    mopPayments: transactionData.payments,
                    deliveryData: deliveryData,
                });
                localStorage.removeItem("transaction");
                setCustomerData({});
                setCardDetails({});
                handlePrintReceipt(transactionId);
            } else {
                toast.error("Error retrieving transaction ID");
            }
        } catch (error) {
            toast.error("Error saving transaction");
        }
    };

    const handlePrintReceipt = async (transactionId) => {
        if (!transactionId) {
            toast.info("Please transact first");
            return;
        }

        try {
            const response = await axios.get(`/print-receipt/${transactionId}`);
            const receiptData = response.data;
        } catch (error) {
            toast.error("Error fetching receipt data");
        }
    };

    return (
        <>
            <Head title="Home" />
            <audio ref={audioRef} src="assets/audio/nozzle-status-sound.wav" />
            <main className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-[100vh] bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
                <Card className="dark:bg-gray-900 p-2">
                    {/* Sale Header */}
                    <div>
                        <Card className="max-w-full h-full">
                            <CardHeader className="justify-between">
                                <GetCashier />
                                <GetDateTime />
                            </CardHeader>
                            <CardBody className="justify-between">
                                <div className="flex gap-4">
                                    <div className="w-[70%] h-[65px] bg-slate-200 rounded-lg shadow-sm relative">
                                        <ToastContainer
                                            autoClose={2000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick
                                            pauseOnFocusLoss={false}
                                            draggable
                                            pauseOnHover={false}
                                            theme="light"
                                            transition={Zoom}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0,
                                                width: "100%",
                                            }}
                                        />
                                    </div>
                                    <PrinterStatus />
                                    <ThemeSwitcher />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <Spacer y={3} />
                    {/* Sale Window */}
                    <div className="flex-grow">
                        <SaleWindowTabs
                            deliveryData={deliveryData}
                            setSelectedRow={setSelectedRow}
                            subtotal={subtotal}
                            transactionSaved={transactionSaved}
                            transactionSummary={transactionSummary}
                        />
                    </div>
                    {/* POS Keyboard */}
                    <div>
                        <Card className="w-full gap-2 p-2">
                            <Input
                                variant="bordered"
                                classNames={{
                                    input: [
                                        "text-black text-2xl font-bold text-right",
                                    ],
                                }}
                                value={inputValue}
                                isReadOnly
                                size="lg"
                            />
                            <POSKeyboard
                                setDeliveryData={setDeliveryData}
                                deliveryData={deliveryData}
                                setSelectedRow={setSelectedRow}
                                selectedRow={selectedRow}
                                subtotal={subtotal}
                                onToast={handleToast}
                                buttons={buttons}
                                setInputValue={setInputValue}
                                setTransactionSummary={setTransactionSummary}
                                setTransactionSaved={setTransactionSaved}
                                setCustomerModalOpen={setCustomerModalOpen}
                                setTotalPaid={setTotalPaid}
                                totalPaid={totalPaid}
                                handlePrintReceipt={handlePrintReceipt}
                            />
                        </Card>
                    </div>
                </Card>
                {/* Pumps */}
                <Card className="dark:bg-gray-900 p-2">
                    <div className="flex w-full flex-col">
                        <Tabs aria-label="Pumps" fullWidth>
                            <Tab
                                key="pumps"
                                title={<p className="font-extrabold">PUMPS</p>}
                            >
                                {pumpStatus.length === 0 ? (
                                    <div className="col-span-4 flex flex-col items-center justify-center py-12 text-xl font-extrabold text-center text-red-500">
                                        <GiGasPump className="text-7xl" />
                                        <p>No pumps connected!</p>
                                    </div>
                                ) : (
                                    <div className="overflow-y-auto scrollbar-hide max-h-screen p-1">
                                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                            {pumpStatus.map((pump) => (
                                                <PumpCard
                                                    key={pump.Id}
                                                    pump={pump}
                                                    handleAppendDeliveryData={
                                                        handleAppendDeliveryData
                                                    }
                                                    onToast={handleToast}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Tab>
                            <Tab
                                key="mop"
                                title={<p className="font-extrabold">MOP</p>}
                            >
                                <MOPCard
                                    mopList={mopList}
                                    onSelectMOP={handleSelectMOP}
                                    onApplyDiscount={handleApplyDiscount}
                                />
                            </Tab>
                            <Tab
                                key="reports"
                                title={
                                    <p className="font-extrabold">REPORTS</p>
                                }
                            >
                                <ReportsIndex />
                            </Tab>
                            <Tab
                                key="config"
                                title={<p className="font-extrabold">CONFIG</p>}
                            >
                                <Index onToast={handleToast} />
                            </Tab>
                        </Tabs>
                    </div>
                </Card>
            </main>
            <CustomerDetails
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerDetails}
                onCustomerDataChange={handleCustomerDataChange}
                customerName={customerData.name}
                customerAddress={customerData.address}
                customerTIN={customerData.tin}
                customerBusinessStyle={customerData.businessStyle}
                onSave={handleSaveCustomerDetails}
            />
            <CardDetails
                isOpen={isCardDetailsOpen}
                onOpenChange={setCardDetailsOpen}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                onSave={async () => {
                    if (!cardDetails.approvalCode) {
                        toast.error("Please fill required fields.");
                        return;
                    }
                    setCardDetailsOpen(false);
                    await saveTransaction();
                }}
            />
        </>
    );
}
