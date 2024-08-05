import React, { useState } from "react";
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
} from "@nextui-org/react";
import PumpDelivery from "./PumpDelivery";
import { CheckIcon } from "../Icon";
import { IoCloseCircle } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { getPumpStatusColor } from "./PumpStatus";
import axios from "axios";
import toast from "react-hot-toast";

const PumpCard = ({ pump, handleAppendDeliveryData }) => {
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

    const authorizePump = async (pumpData) => {
        try {
            const response = await axios.post("/authorize-pump", pumpData);
            toast.success("Pump authorized successfully");
            console.log("Authorization successful:", response.data);
            return true;
        } catch (error) {
            toast.error("Error authorizing pump");
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
                toast.success("Pump stopped successfully");
                console.log("Pump stopped successfully:", response.data);
                setAuthorizedPumps((prev) => ({ ...prev, [pumpId]: false }));
            })
            .catch((error) => {
                toast.error("Error stopping pump");
                console.error("Error stopping pump:", error);
            });
    };

    const suspendPump = (pumpId) => {
        axios
            .post("/suspend", { Pump: pumpId })
            .then((response) => {
                toast.success("Pump suspended successfully");
                console.log("Pump suspended successfully:", response.data);
            })
            .catch((error) => {
                toast.error("Error suspending pump");
                console.error("Error suspending pump:", error);
            });
    };

    const resumePump = (pumpId) => {
        axios
            .post("/resume", { Pump: pumpId })
            .then((response) => {
                toast.success("Pump resumed successfully");
                console.log("Pump resumed successfully:", response.data);
            })
            .catch((error) => {
                toast.error("Error resuming pump");
                console.error("Error resuming pump:", error);
            });
    };

    const emergencyStopPump = (pumpId) => {
        axios
            .post("/emergency-stop", { Pump: pumpId })
            .then((response) => {
                toast.success("Emergency stop activated");
                console.log("Emergency stop activated:", response.data);
            })
            .catch((error) => {
                toast.error("Error performing emergency stop");
                console.error("Error performing emergency stop:", error);
            });
    };

    return (
        <>
            <Card key={pump.Id} className="p-2">
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
                                getInitials={(name) => name.charAt(0)}
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
                        >
                            AUTHORIZE
                        </Button>
                        <Button
                            size="sm"
                            onClick={() =>
                                setShowingPumpButtons(!showingPumpButtons)
                            }
                        >
                            <span className="flex items-center gap-2">
                                Pump Controls
                            </span>
                        </Button>
                    </CardFooter>
                )}
            </Card>
            <Modal
                placement="left"
                classNames={{
                    backdrop:
                        "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
                isOpen={showingPumpButtons}
                onClose={() => setShowingPumpButtons(false)}
            >
                <ModalContent>
                    <ModalHeader>Pump ({pump.Id}) Controls </ModalHeader>
                    <ModalBody>
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <Button
                                size="lg"
                                color="danger"
                                onClick={() => stopPump(pump.Id)}
                            >
                                STOP
                            </Button>
                            <Button
                                size="lg"
                                color="warning"
                                onClick={() => suspendPump(pump.Id)}
                            >
                                SUSPEND
                            </Button>
                            <Button
                                size="lg"
                                color="primary"
                                onClick={() => resumePump(pump.Id)}
                            >
                                RESUME
                            </Button>
                            <Button
                                size="lg"
                                className="bg-red-500"
                                onClick={() => emergencyStopPump(pump.Id)}
                            >
                                EMERGENCY STOP
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="flat"
                            onClick={() => setShowingPumpButtons(false)}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PumpCard;
