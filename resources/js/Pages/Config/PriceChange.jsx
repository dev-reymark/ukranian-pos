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
    CardFooter,
    Divider,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import axios from "axios";
import { now, getLocalTimeZone } from "@internationalized/date";

function PriceChange({ isOpen, onOpenChange }) {
    const [grades, setGrades] = useState([]);
    const [currentPrices, setCurrentPrices] = useState({});
    useEffect(() => {
        if (isOpen) {
            axios
                .get("/get-grades")
                .then((response) => {
                    setGrades(response.data);
                    setCurrentPrices(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching grades:", error);
                });
        }
    }, [isOpen]);
    return (
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
                                className=""
                                showMonthAndYearPickers
                                isDisabled
                                // minValue={now(getLocalTimeZone("Asia/Manila"))}
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
                                        <RadioGroup label="Select Grades">
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
                                            <Input label="CASH" />
                                            <Input label="CREDIT" />
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
                                            <Input label="CASH" />
                                            <Input label="CREDIT" />
                                        </CardBody>
                                    </Card>
                                    <Button color="primary">APPLY</Button>
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
    );
}

export default PriceChange;
