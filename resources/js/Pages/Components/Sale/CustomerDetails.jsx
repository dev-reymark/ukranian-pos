import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@nextui-org/react";

export const CustomerDetails = ({ isOpen, onClose, onCustomerDataChange }) => {
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
                                onChange={(e) =>
                                    onCustomerDataChange("name", e.target.value)
                                }
                            />
                            <Input
                                label="Address"
                                variant="bordered"
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
                                onChange={(e) =>
                                    onCustomerDataChange("tin", e.target.value)
                                }
                            />
                            <Input
                                label="Business Style"
                                variant="bordered"
                                onChange={(e) =>
                                    onCustomerDataChange(
                                        "businessStyle",
                                        e.target.value
                                    )
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Continue
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

