import React, { useState, useEffect } from "react";
import {
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    Card,
    CardHeader,
    CardBody,
    Divider,
    DatePicker,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import axios from "axios";
import { now, getLocalTimeZone } from "@internationalized/date";
import toast, { Toaster } from "react-hot-toast";

function PriceChange({ isOpen, onOpenChange }) {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [currentPrice, setCurrentPrice] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPriceInvalid, setIsPriceInvalid] = useState(false);

    useEffect(() => {
        if (isOpen) {
            axios
                .get("/get-grades")
                .then((response) => {
                    setGrades(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching grades:", error);
                });
        }
    }, [isOpen]);

    const handleGradeSelect = (event) => {
        const selectedValue = event.target.value;
        console.log("Selected Grade ID:", selectedValue);
        const grade = grades.find((g) => g.Grade_ID === selectedValue);
        console.log("Selected Grade:", grade);
        if (grade) {
            console.log("Grade Price Profile:", grade.price_profile);
            console.log("Grade Price:", grade.price_profile?.Grade_Price);
            setSelectedGrade(grade);
            setCurrentPrice(grade.price_profile?.Grade_Price || "0"); // Set current price
        }
    };

    const handlePriceUpdate = () => {
        if (!selectedGrade) {
            console.error("No grade selected");
            return;
        }

        if (!newPrice) {
            setIsPriceInvalid(true);
            return;
        }

        setLoading(true); // Set loading to true before API request

        axios
            .put(`/update-price/${selectedGrade.Grade_ID}`, {
                newPrice: newPrice,
            })
            .then((response) => {
                toast.success("Price updated successfully!");
                console.log("Price updated successfully:", response.data);
                setCurrentPrice(newPrice); // Update the current price to reflect the change
                setNewPrice(""); // Reset new price field
            })
            .catch((error) => {
                console.error("Error updating price:", error);
            })
            .finally(() => {
                setLoading(false); // Reset loading state after request completes
                setIsPriceInvalid(false); // Reset the validation state
            });
    };

    return (
        <>
            <Toaster position="top-center" />
            <Modal
                isDismissable={false}
                isKeyboardDismissDisabled
                size="4xl"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                hideCloseButton
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h1 className="text-2xl font-extrabold">
                                    PRICE CHANGE
                                </h1>
                            </ModalHeader>
                            <ModalBody className="w-full mx-auto p-3">
                                <DatePicker
                                    variant="faded"
                                    defaultValue={now(
                                        getLocalTimeZone("Asia/Manila")
                                    )}
                                    label={
                                        <p className="text-lg font-extrabold">
                                            EFFECTIVITY
                                        </p>
                                    }
                                    labelPlacement="outside-left"
                                    showMonthAndYearPickers
                                    isDisabled
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Card>
                                        <CardHeader>
                                            <h2 className="text-xl font-extrabold">
                                                Grades
                                            </h2>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody className="p-4">
                                            <RadioGroup
                                                label="Select Grades"
                                                onChange={handleGradeSelect}
                                            >
                                                {grades.map((grade) => (
                                                    <Radio
                                                        className="text-xl font-semibold"
                                                        size="lg"
                                                        key={grade.Grade_ID}
                                                        value={grade.Grade_ID}
                                                    >
                                                        {grade.Grade_Name.trim()}
                                                    </Radio>
                                                ))}
                                            </RadioGroup>
                                        </CardBody>
                                    </Card>
                                    <div className="grid grid-rows-2 gap-2">
                                        <Card>
                                            <CardHeader>
                                                <h2 className="text-xl font-extrabold">
                                                    Current Price
                                                </h2>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-2 p-2">
                                                <Input
                                                    variant="faded"
                                                    label="CASH"
                                                    value={currentPrice}
                                                    isReadOnly
                                                />
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <h2 className="text-xl font-extrabold">
                                                    New Price
                                                </h2>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-2 p-2">
                                                <Input
                                                    label="CASH"
                                                    value={newPrice}
                                                    onChange={(e) =>
                                                        setNewPrice(
                                                            e.target.value
                                                        )
                                                    }
                                                    isRequired
                                                    isInvalid={isPriceInvalid}
                                                    errorMessage="Price not set"
                                                />
                                            </CardBody>
                                        </Card>
                                        <Button
                                            color="primary"
                                            onClick={handlePriceUpdate}
                                            isLoading={loading}
                                            className="text-xl font-bold"
                                        >
                                            APPLY
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <Divider />
                            <ModalFooter>
                                <Button color="danger" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default PriceChange;
