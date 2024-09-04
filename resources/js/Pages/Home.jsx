import React, { useState, useEffect, useRef, Suspense } from "react";
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
import Swal from "sweetalert2";
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
import SaleWindowTabs from "./Components/Sale/SaleWindowTabs";
import ReportsIndex from "./Components/Reports/ReportsIndex";
import { GiGasPump } from "react-icons/gi";

export default function Home() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [pumpStatus, setPumpStatus] = useState([]);
    const [mopList, setMopList] = useState([]);
    const [isCardDetailsOpen, setCardDetailsOpen] = useState(false);
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
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerTIN, setCustomerTIN] = useState("");
    const [customerBusinessStyle, setCustomerBusinessStyle] = useState("");

    // Card Details States
    const [cardNumber, setCardNumber] = useState("");
    const [approvalCode, setApprovalCode] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");

    const [selectedDiscount, setSelectedDiscount] = useState("");
    const [selectedPreset, setSelectedPreset] = useState(null);
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to log out and you won't be able to recover this session!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!",
        });

        if (result.isConfirmed) {
            try {
                await axios.post("/logout");
                window.location.href = "/";
            } catch (error) {
                console.error("Error logging out:", error);
            }
        }
    };

    const handleOpenCustomerDetails = () => {
        setCustomerModalOpen(true);
    };

    const handleCloseCustomerDetails = () => {
        setCustomerModalOpen(false);
    };

    const handleSaveCustomerDetails = () => {
        handleCloseCustomerDetails();
    };

    const handleAppendDeliveryData = (pump) => {
        setDeliveryData((prevData) => {
            const updatedData = [...prevData, pump];
            // Save updated data to localStorage
            localStorage.setItem("deliveryData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

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
        localStorage.removeItem("transaction");
        localStorage.removeItem("deliveryData");
        localStorage.removeItem("disabledIds");
        toast.success("All transactions voided.");

        // Reset change
        setTotalPaid(0);

        setInputValue("");

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
                    // Check if any MOP has MOP_Ref of 3 and open the CardDetails modal
                    const hasRef3 = data.some((mop) => mop.MOP_Ref === "3");
                    setCardDetailsOpen(hasRef3);
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

    const handleAuthorizeAllPumps = async () => {
        try {
            const payload = {
                Type: "FullTank",
            };
            // Send request to authorize all pumps
            const response = await axios.post("/authorize-all-pumps", payload);
            toast.success("All pumps authorized successfully");
            console.log("All pumps authorized:", response.data);
        } catch (error) {
            toast.error("Error authorizing all pumps");
            console.error("Error authorizing all pumps:", error);
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

    const handleOpenDrawer = async () => {
        try {
            const response = await axios.get("/open-cash-drawer");
            toast.success("Drawer opened successfully");
            console.log("Drawer opened:", response.data);
        } catch (error) {
            toast.error("Error opening drawer");
            console.error(
                "Error opening drawer:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const buttonClickHandlers = {
        handleLogout,
        handleVoid,
        handleVoidAll,
        setInputValue,
        handleClear,
        handleSubTotal,
        handlePrintReceipt,
        handleStopAllPumps,
        handleAuthorizeAllPumps,
        handleOpenCustomerDetails,
        handleOpenDrawer,
    };

    // Handle MOP selection
    const handleSelectMOP = async (mop) => {
        console.log("MOP selected:", mop);

        const currentPayment = parseFloat(
            inputValue.replace("₱", "").replace(",", "")
        );
        if (inputValue === "" || currentPayment <= 0) {
            toast.error(
                "Please enter an amount before selecting a method of payment."
            );
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

        if (newRemainingBalance >= 0) {
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
                setCardDetailsOpen(true); // Open Card Details Modal
            } else if (newRemainingBalance === 0) {
                await saveTransaction();
            } else {
                setInputValue(`Amount Due: ₱${newRemainingBalance.toFixed(2)}`);
            }
        } else {
            const newChange = Math.abs(newRemainingBalance).toFixed(2);
            toast.success(`Change: ₱${newChange}`);

            existingTransaction.payments.push({
                mopName: mop.MOP_Name,
                amount: currentPayment,
            });
            existingTransaction.remainingBalance = 0;

            localStorage.setItem(
                "transaction",
                JSON.stringify(existingTransaction)
            );
            setInputValue(`Change: ₱${newChange}`);
            setInputValue(`Change: ₱${newChange}`);

            if (mop.MOP_Ref === "3") {
                setCardDetailsOpen(true); // Open Card Details Modal
            } else {
                await saveTransaction();
            }
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
    });

    const handleApplyDiscount = (selectedDiscount, preset) => {
        if (selectedRow === null || selectedRow === undefined) {
            toast.error("Please select an item to apply discount");
            return;
        }

        // Check if discount_id is 1 to 4
        if (
            selectedDiscount.discount_id >= 1 &&
            selectedDiscount.discount_id <= 4
        ) {
            toast.info("Discount not applicable");
        }

        console.log("Selected Row:", selectedRow);
        console.log("Selected Discount:", selectedDiscount);
        console.log("Selected Preset:", preset);

        const updatedData = deliveryData.map((item) => {
            if (item.Delivery_ID === selectedRow) {
                let discountAmount = 0;

                console.log(
                    "Selected Discount Type:",
                    selectedDiscount?.discount_type
                );
                console.log("Preset Value:", preset?.preset_value);

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

                console.log("Calculated Discount Amount:", discountAmount);

                const discountedAmount =
                    parseFloat(item.Amount) - discountAmount;

                return {
                    ...item,
                    Amount: discountedAmount.toFixed(2),
                    DiscountedAmount: discountAmount.toFixed(2),
                    PresetName: preset?.preset_name,
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
            toast.error("No transaction data found");
            return;
        }

        // If the selected MOP is a card, ensure card details are provided
        if (selectedMOP && selectedMOP.MOP_Ref === "3") {
            if (!cardNumber || !approvalCode || !cardHolderName) {
                toast.error("Please provide complete card details.");
                setCardDetailsOpen(true); // Re-open Card Details Modal
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
                change: parseFloat(change),
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
                    DiscountedAmount: item.DiscountedAmount,
                    PresetName: item.PresetName,
                    FuelGradeName: item.FuelGradeName,
                })),
                customer: {
                    name: customerName,
                    address: customerAddress,
                    tin: customerTIN,
                    businessStyle: customerBusinessStyle,
                },
                cardDetails: {
                    name: cardHolderName,
                    code: approvalCode,
                    number: cardNumber,
                },
            });

            const transactionId = response.data.transaction;
            if (transactionId) {
                localStorage.setItem("transactionId", transactionId);
                toast.success("Transaction saved successfully");
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
                });

                localStorage.removeItem("transaction");
                // Reset card details after transaction
                setCardNumber("");
                setApprovalCode("");
                setCardHolderName("");
                handlePrintReceipt(transactionId);
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
            <main className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-[100vh]">
                <Card className="dark:bg-gray-900 p-2">
                    {/* Sale Header */}
                    <div className="flex-none">
                        <Card className="max-w-full h-full">
                            <CardHeader className="justify-between">
                                <GetCashier />
                                <GetDateTime />
                            </CardHeader>
                            <CardBody className="justify-between">
                                <div className="flex gap-4">
                                    <div className="w-[70%] h-[70px] bg-slate-200 rounded-lg shadow-sm relative">
                                        <ToastContainer
                                            position="top-right"
                                            autoClose={2000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick
                                            rtl={false}
                                            pauseOnFocusLoss
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
                                                height: "50%",
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
                    <div className="flex-none">
                        <Card className="w-full gap-2 p-2">
                            <div className="flex gap-2">
                                <Input
                                    variant="bordered"
                                    label={
                                        <p className="font-bold text-xl">
                                            SUBTOTAL
                                        </p>
                                    }
                                    size="lg"
                                    value={`₱${subtotal}`}
                                    labelPlacement="outside-left"
                                    className="w-[40%]"
                                    classNames={{
                                        input: [
                                            "text-black text-xl font-bold text-right",
                                        ],
                                    }}
                                    isReadOnly
                                />
                                <Input
                                    variant="bordered"
                                    className="w-[60%]"
                                    classNames={{
                                        input: [
                                            "text-black text-2xl font-bold text-right",
                                        ],
                                    }}
                                    value={inputValue}
                                    isReadOnly
                                    size="lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                                <POSKeyboard
                                    handleButtonClick={handleButtonClick}
                                    buttons={buttons}
                                    buttonClickHandlers={buttonClickHandlers}
                                    setInputValue={setInputValue}
                                />
                            </div>
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
                                <Suspense fallback={<div>Loading...</div>}>
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
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Suspense>
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
                                <Index />
                            </Tab>
                        </Tabs>
                    </div>
                </Card>
            </main>
            <CustomerDetails
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerDetails}
                onCustomerDataChange={(key, value) => {
                    switch (key) {
                        case "name":
                            setCustomerName(value);
                            break;
                        case "address":
                            setCustomerAddress(value);
                            break;
                        case "tin":
                            setCustomerTIN(value);
                            break;
                        case "businessStyle":
                            setCustomerBusinessStyle(value);
                            break;
                        default:
                            break;
                    }
                }}
                customerName={customerName}
                customerAddress={customerAddress}
                customerTIN={customerTIN}
                customerBusinessStyle={customerBusinessStyle}
                onSave={handleSaveCustomerDetails}
                setCustomerName={setCustomerName}
                setCustomerAddress={setCustomerAddress}
                setCustomerTIN={setCustomerTIN}
                setCustomerBusinessStyle={setCustomerBusinessStyle}
            />
            <CardDetails
                isOpen={isCardDetailsOpen}
                onOpenChange={setCardDetailsOpen}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                approvalCode={approvalCode}
                setApprovalCode={setApprovalCode}
                cardHolderName={cardHolderName}
                setCardHolderName={setCardHolderName}
                onSave={async () => {
                    if (!cardNumber || !approvalCode || !cardHolderName) {
                        toast.error("Please fill in all card details.");
                        return;
                    }
                    setCardDetailsOpen(false);
                    await saveTransaction();
                }}
            />
        </>
    );
}
