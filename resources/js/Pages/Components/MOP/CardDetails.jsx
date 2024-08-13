import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    Input,
} from "@nextui-org/react";

export const CardDetails = ({
    isOpen,
    onOpenChange,
    cardNumber,
    setCardNumber,
    approvalCode,
    setApprovalCode,
    cardHolderName,
    setCardHolderName,
    onSave,
}) => {
    return (
        <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            DEBIT/CREDIT CARD INFORMATION
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Card #"
                                placeholder="XXX-XXX-XXX-XXX-XXX"
                                variant="bordered"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                            />
                            <Input
                                label="Approval Code"
                                placeholder="XXXXXX"
                                variant="bordered"
                                value={approvalCode}
                                onChange={(e) =>
                                    setApprovalCode(e.target.value)
                                }
                            />
                            <Input
                                label="Card Holder Name"
                                placeholder="Card Holder Name"
                                variant="bordered"
                                value={cardHolderName}
                                onChange={(e) =>
                                    setCardHolderName(e.target.value)
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="w-full"
                                color="success"
                                onPress={onSave}
                            >
                                Save
                            </Button>
                            <Button
                                className="w-full"
                                color="danger"
                                onPress={() => {
                                    // Clear card details if user closes the modal
                                    setCardNumber("");
                                    setApprovalCode("");
                                    setCardHolderName("");
                                    onClose();
                                }}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
