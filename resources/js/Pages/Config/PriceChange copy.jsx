import React, { useState, useEffect } from "react";
import {
    DatePicker,
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
    CheckboxGroup,
    Checkbox,
    Spacer,
} from "@nextui-org/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { now, today, getLocalTimeZone } from "@internationalized/date";

function PriceChange({ isOpen, onOpenChange, onToast }) {
    const [grades, setGrades] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]);
    const [prices, setPrices] = useState({});
    const [newPrices, setNewPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [isPriceInvalid, setIsPriceInvalid] = useState(false);
    const [effectivityDate, setEffectivityDate] = useState(
        now(getLocalTimeZone()).add({ minutes: 5 })
    );

    const handleEffectivityDateChange = (date) => {
        setEffectivityDate(date);
    };

    useEffect(() => {
        if (isOpen) {
            axios
                .get("/get-pump-nozzle")
                .then((response) => {
                    const data = response.data;
                    setGrades(data.FuelGrades || []);
                    const initialPrices = {};
                    data.FuelGrades.forEach((grade) => {
                        initialPrices[grade.Id] = grade.Price.toString();
                    });
                    setPrices(initialPrices);
                })
                .catch((error) => {
                    console.error("Error fetching grades:", error);
                });
        }
    }, [isOpen]);

    const handleGradeSelect = (values) => {
        setSelectedGrades(values);
    };

    const handlePriceChange = (gradeId, value) => {
        setNewPrices((prevPrices) => ({
            ...prevPrices,
            [gradeId]: value,
        }));
    };

    const handlePriceUpdate = () => {
        if (selectedGrades.length === 0) {
            onToast("No grades selected", "error");
            return;
        }

        if (!effectivityDate) {
            onToast("Please select an effectivity date", "error");
            return;
        }

        const invalidPrices = selectedGrades.some((gradeId) => {
            const price = newPrices[gradeId];
            return !price || isNaN(parseFloat(price));
        });

        if (invalidPrices) {
            setIsPriceInvalid(true);
            return;
        }

        setIsPriceInvalid(false);

        const updatedGrades = grades.map((grade) =>
            selectedGrades.includes(grade.Id.toString())
                ? {
                    ...grade,
                    Price: parseFloat(newPrices[grade.Id] || prices[grade.Id]),
                    isSelected: true,  // Mark this grade as selected
                }
                : {
                    ...grade,
                    isSelected: false,  // Mark as not selected
                }
        );

        const updateRequest = {
            Protocol: "jsonPTS",
            Packets: [
                {
                    Id: 1,
                    Type: "SetFuelGradesConfiguration",
                    Data: {
                        FuelGrades: updatedGrades,
                    },
                },
            ],
            EffectivityDate: effectivityDate.toString(),
        };

        setLoading(true);
        axios
            .post("/set-fuel-grades", updateRequest)
            .then(() => {
                toast.success("Prices updated successfully!");

                // Update prices with the new values
                const updatedPrices = { ...prices, ...newPrices };
                setPrices(updatedPrices);
                setNewPrices({});
            })
            .catch((error) => {
                console.error("Error updating prices:", error);
                toast.error("Failed to update prices");
            })
            .finally(() => {
                setLoading(false);
                setIsPriceInvalid(false);
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
                            <Divider />
                            <Spacer y={2} />
                            <ModalBody className="w-full mx-auto p-3">
                                <DatePicker
                                    variant="faded"
                                    label={
                                        <p className="text-lg font-extrabold">
                                            EFFECTIVITY
                                        </p>
                                    }
                                    labelPlacement="outside-left"
                                    showMonthAndYearPickers
                                    minValue={now(getLocalTimeZone())}
                                    defaultValue={now(getLocalTimeZone()).add({
                                        minutes: 5,
                                    })}
                                    onChange={handleEffectivityDateChange}
                                />
                                <Spacer y={2} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Card>
                                        <CardHeader>
                                            <h2 className="text-xl font-extrabold">
                                                Grades
                                            </h2>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody className="p-4">
                                            <CheckboxGroup
                                                label="Select Grades"
                                                onChange={handleGradeSelect}
                                            >
                                                {grades.map((grade) => (
                                                    <Checkbox
                                                        className="text-xl font-semibold"
                                                        size="lg"
                                                        key={grade.Id}
                                                        value={grade.Id.toString()}
                                                    >
                                                        {grade.Name.trim()}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </CardBody>
                                    </Card>

                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 overflow-auto space-y-4 p-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                {selectedGrades.map(
                                                    (gradeId) => {
                                                        const grade =
                                                            grades.find(
                                                                (g) =>
                                                                    g.Id.toString() ===
                                                                    gradeId
                                                            );
                                                        return (
                                                            <Card
                                                                key={grade.Id}
                                                            >
                                                                <CardHeader>
                                                                    <h2 className="text-xl font-extrabold">
                                                                        {grade.Name.trim()}
                                                                    </h2>
                                                                </CardHeader>
                                                                <Divider />
                                                                <CardBody className="gap-1 p-2">
                                                                    <Input
                                                                        label="Current Price"
                                                                        value={
                                                                            prices[
                                                                                grade
                                                                                    .Id
                                                                            ]
                                                                        }
                                                                        isReadOnly
                                                                    />
                                                                    <Input
                                                                        label="New Price"
                                                                        value={
                                                                            newPrices[
                                                                                grade
                                                                                    .Id
                                                                            ] ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handlePriceChange(
                                                                                grade.Id,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        isRequired
                                                                        isInvalid={
                                                                            isPriceInvalid
                                                                        }
                                                                        errorMessage="Price not set"
                                                                    />
                                                                </CardBody>
                                                            </Card>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            {selectedGrades.length === 0 && (
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-red-600">
                                                        No grades selected
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            color="primary"
                                            fullWidth
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
