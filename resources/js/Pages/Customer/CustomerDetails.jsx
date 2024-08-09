import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@nextui-org/react";

export const CustomerDetails = ({
    isOpen,
    onClose,
    onCustomerDataChange,
    customerName,
    customerAddress,
    customerTIN,
    customerBusinessStyle,
    onSave,
    setCustomerName,
    setCustomerAddress,
    setCustomerTIN,
    setCustomerBusinessStyle,
}) => {
    const handleClear = () => {
        setCustomerName("");
        setCustomerAddress("");
        setCustomerTIN("");
        setCustomerBusinessStyle("");
    };
    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Enter Customer Information
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Customer Name"
                                variant="bordered"
                                value={customerName}
                                onChange={(e) =>
                                    onCustomerDataChange("name", e.target.value)
                                }
                            />
                            <Input
                                label="Address"
                                variant="bordered"
                                value={customerAddress}
                                onChange={(e) =>
                                    onCustomerDataChange(
                                        "address",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                label="TIN"
                                variant="bordered"
                                value={customerTIN}
                                onChange={(e) =>
                                    onCustomerDataChange("tin", e.target.value)
                                }
                            />
                            <Input
                                label="Business Style"
                                variant="bordered"
                                value={customerBusinessStyle}
                                onChange={(e) =>
                                    onCustomerDataChange(
                                        "businessStyle",
                                        e.target.value
                                    )
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="success"
                                onClick={onSave}
                                className="w-full"
                            >
                                SAVE
                            </Button>
                            <Button onClick={handleClear} className="w-full">
                                CLEAR ALL
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

