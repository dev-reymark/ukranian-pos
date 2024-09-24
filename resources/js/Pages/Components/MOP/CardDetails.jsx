import React from "react";
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
    cardDetails,
    setCardDetails,
    onSave,
}) => {
    const handleChange = (field) => (e) => {
        setCardDetails((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleClose = () => {
        setCardDetails({
            cardNumber: "",
            approvalCode: "",
            cardHolderName: "",
        });
        onOpenChange(false);
    };

    return (
        <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    DEBIT/CREDIT CARD INFORMATION
                </ModalHeader>
                <ModalBody>
                    <Input
                        autoFocus
                        label="Card #"
                        placeholder="XXX-XXX-XXX-XXX-XXX"
                        variant="bordered"
                        value={cardDetails.cardNumber}
                        onChange={handleChange("cardNumber")}
                    />
                    <Input
                        label="Approval Code"
                        placeholder="XXXXXX"
                        variant="bordered"
                        isRequired
                        value={cardDetails.approvalCode}
                        onChange={handleChange("approvalCode")}
                    />
                    <Input
                        label="Card Holder Name"
                        placeholder="Card Holder Name"
                        variant="bordered"
                        value={cardDetails.cardHolderName}
                        onChange={handleChange("cardHolderName")}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button className="w-full" color="success" onPress={onSave}>
                        Save
                    </Button>
                    <Button className="w-full" color="danger" onPress={handleClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
