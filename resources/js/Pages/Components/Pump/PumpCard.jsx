import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Chip,
    Avatar,
    Input,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Divider,
} from "@nextui-org/react";
import PumpDelivery from "./PumpDelivery";
import { CheckIcon } from "../Icon";
import {
    IoCloseCircle,
    IoPauseCircle,
    IoStopCircle,
    IoPlayCircle,
    IoStopCircleSharp,
} from "react-icons/io5";
import { getPumpStatusColor } from "./PumpStatus";
import axios from "axios";
import { GrClose } from "react-icons/gr";
import { TbHandStop } from "react-icons/tb";

export const PumpCard = ({ pump, handleAppendDeliveryData, onToast }) => {
    const showButtons =
        pump.Data.NozzleUp ||
        pump.Type === "PumpFillingStatus" ||
        pump.Type === !pump.Data.NozzleUp;
    const displayFontStyle = {
        fontFamily: "'Roboto Mono', monospace",
        fontSize: "1rem",
        fontWeight: "bold",
    };
    const [showingPumpButtons, setShowingPumpButtons] = useState(false);
    const [authorizedPumps, setAuthorizedPumps] = useState([]);

    // const handleNozzleUp = (pumpId) => {
    //     onToast(`Nozzle is up for Pump ${pumpId}`, "success");
    // };

    // useEffect(() => {
    //     if (pump.Data.NozzleUp) {
    //         handleNozzleUp(pump.Id);
    //     }
    // }, [pump.Data.NozzleUp]);

    const authorizePump = async (pumpData) => {
        try {
            const response = await axios.post("/authorize-pump", pumpData);
            onToast("Pump authorized", "success");
            console.log("Authorization successful:", response.data);
            return true;
        } catch (error) {
            onToast("Error authorizing pump:", error);
            console.error("Error authorizing pump:", error);
            return false;
        }
    };

    const handleAuthorize = async (pump) => {
        const pumpData = {
            Pump: pump.Id,
            Nozzle: pump.Data.NozzleUp,
            Type: "FullTank",
            Dose: pump.Data.Dose,
            Price: pump.Data.Price,
        };
        const success = await authorizePump(pumpData);
        if (success) {
            setAuthorizedPumps((prev) => ({ ...prev, [pump.Id]: true }));
        }
    };

    const stopPump = (pumpId) => {
        axios
            .post("/stop-pump", { Pump: pumpId })
            .then((response) => {
                onToast("Pump stopped", "success");
                console.log("Pump stopped successfully:", response.data);
                setAuthorizedPumps((prev) => ({ ...prev, [pumpId]: false }));
                setShowingPumpButtons(false);
            })
            .catch((error) => {
                onToast("Error stopping pump:", error);
                console.error("Error stopping pump:", error);
            });
    };

    const suspendPump = (pumpId) => {
        axios
            .post("/suspend", { Pump: pumpId })
            .then((response) => {
                onToast("Pump suspended", "success");
                console.log("Pump suspended successfully:", response.data);
                setShowingPumpButtons(false);
            })
            .catch((error) => {
                onToast("Error suspending pump:", error);
                console.error("Error suspending pump:", error);
            });
    };

    const resumePump = (pumpId) => {
        axios
            .post("/resume", { Pump: pumpId })
            .then((response) => {
                onToast("Pump resumed", "success");
                console.log("Pump resumed successfully:", response.data);
                setShowingPumpButtons(false);
            })
            .catch((error) => {
                onToast("Error resumed pump:", error);
                console.error("Error resuming pump:", error);
            });
    };

    const emergencyStopPump = (pumpId) => {
        axios
            .post("/emergency-stop", { Pump: pumpId })
            .then((response) => {
                onToast("Emergency stop activated", "success");
                console.log("Emergency stop activated:", response.data);
                setShowingPumpButtons(false);
            })
            .catch((error) => {
                onToast("Error performing emergency stop:", error);
                console.error("Error performing emergency stop:", error);
            });
    };

    return (
        <>
            <Card key={pump.Id}>
                <CardHeader className="flex items-center justify-between">
                    <PumpDelivery
                        pumpId={pump.Id}
                        onAppend={handleAppendDeliveryData}
                        disabled={pump.Type === "PumpOfflineStatus"}
                    />
                    <Chip
                        size="lg"
                        color={getPumpStatusColor(
                            pump.Type,
                            pump.Data.NozzleUp
                        )}
                        avatar={
                            <Avatar
                                name={pump.Data.Pump.toString()}
                                getInitials={(name) => name.slice(0, 2)}
                            />
                        }
                    >
                        {pump.Data.NozzleUp
                            ? "NOZZLE"
                            : pump.Type === "PumpIdleStatus"
                            ? "IDLE"
                            : pump.Type === "PumpFillingStatus"
                            ? "FILLING"
                            : pump.Type === "PumpEndOfTransactionStatus"
                            ? "DONE"
                            : pump.Type === "PumpOfflineStatus"
                            ? "OFFLINE"
                            : ""}
                    </Chip>
                </CardHeader>
                <CardBody className="flex gap-2">
                    {pump.Data.NozzleUp ? (
                        <Input
                            color="success"
                            size="lg"
                            value={pump.Data.FuelGradeName}
                            isReadOnly
                        />
                    ) : pump.Type === "PumpIdleStatus" ? (
                        <>
                            <Input
                                color="success"
                                size="lg"
                                value="ONLINE"
                                isReadOnly
                                startContent={<CheckIcon />}
                            />
                        </>
                    ) : pump.Type === "PumpFillingStatus" ? (
                        <>
                            <Input
                                size="sm"
                                label="AMOUNT"
                                value={`₱ ${pump.Data.Amount}`}
                                isReadOnly
                                style={displayFontStyle}
                            />
                            <Input
                                size="sm"
                                label="VOLUME"
                                value={`L ${pump.Data.Volume}`}
                                isReadOnly
                                style={displayFontStyle}
                            />
                            <Input
                                size="sm"
                                label="PRICE"
                                value={pump.Data.Price}
                                isReadOnly
                                style={displayFontStyle}
                            />
                        </>
                    ) : pump.Type === "PumpEndOfTransactionStatus" ? (
                        <>
                            <Input
                                size="sm"
                                label="AMOUNT"
                                value={pump.Data.Amount}
                                isReadOnly
                                style={displayFontStyle}
                            />
                            <Input
                                size="sm"
                                label="VOLUME"
                                value={pump.Data.Volume}
                                isReadOnly
                                style={displayFontStyle}
                            />
                            <Input
                                size="sm"
                                label="PRICE"
                                value={pump.Data.Price}
                                isReadOnly
                                style={displayFontStyle}
                            />
                        </>
                    ) : pump.Type === "PumpOfflineStatus" ? (
                        <Input
                            color="danger"
                            size="lg"
                            value="OFFLINE"
                            isReadOnly
                            startContent={<IoCloseCircle className="w-6 h-6" />}
                        />
                    ) : null}
                </CardBody>

                {showButtons && (
                    <CardFooter className="flex gap-2">
                        <Button
                            size="sm"
                            color="success"
                            onClick={() => handleAuthorize(pump)}
                            className="w-full"
                        >
                            AUTHORIZE
                        </Button>
                        <Button
                            size="sm"
                            onClick={() =>
                                setShowingPumpButtons(!showingPumpButtons)
                            }
                            className="w-full"
                        >
                            CONTROLS
                        </Button>
                    </CardFooter>
                )}
            </Card>
            <Modal
                hideCloseButton
                placement="center"
                classNames={{
                    backdrop:
                        "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
                isOpen={showingPumpButtons}
                onClose={() => setShowingPumpButtons(false)}
                size="2xl"
                className="bg-gray-200"
            >
                <ModalContent>
                    <ModalHeader className="text-xl font-extrabold">
                        Pump ({pump.Id}) Controls{" "}
                    </ModalHeader>
                    <Divider />
                    <ModalBody>
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <Button
                                variant="shadow"
                                size="lg"
                                color="warning"
                                onClick={() => suspendPump(pump.Id)}
                                className="h-[100px]"
                                startContent={
                                    <IoPauseCircle className="w-10 h-10 text-default" />
                                }
                            >
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-xl font-extrabold">
                                        SUSPEND
                                    </h1>
                                </div>
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => stopPump(pump.Id)}
                                className="h-[100px] bg-red-600"
                                startContent={
                                    <IoStopCircle className="w-10 h-10 text-default" />
                                }
                            >
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-xl font-extrabold">
                                        STOP
                                    </h1>
                                </div>
                            </Button>
                            <Button
                                size="lg"
                                color="success"
                                onClick={() => resumePump(pump.Id)}
                                className="h-[100px]"
                                startContent={
                                    <IoPlayCircle className="w-10 h-10 text-default" />
                                }
                            >
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-xl font-extrabold">
                                        RESUME
                                    </h1>
                                </div>
                            </Button>

                            <Button
                                size="lg"
                                className="bg-red-400 h-[100px]"
                                onClick={() => emergencyStopPump(pump.Id)}
                                startContent={
                                    <IoStopCircleSharp className="w-10 h-10 text-default" />
                                }
                            >
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-xl font-extrabold">
                                        EMERGENCY STOP
                                    </h1>
                                </div>
                            </Button>
                        </div>
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <Button
                            isIconOnly
                            color="danger"
                            variant="flat"
                            onClick={() => setShowingPumpButtons(false)}
                        >
                            <GrClose className="w-5 h-5" />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
