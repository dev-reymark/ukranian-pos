import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from "@nextui-org/react";

const CustomerDetails = ({
    isCustomerModalOpen,
    handleCloseCustomerDetails,
    customerName,
    setCustomerName,
    customerAddress,
    setCustomerAddress,
    customerTIN,
    setCustomerTIN,
    customerBusinessStyle,
    setCustomerBusinessStyle,
    handleSaveCustomerDetails,
}) => {
    return (
        <Modal
            isOpen={isCustomerModalOpen}
            onClose={handleCloseCustomerDetails}
            aria-labelledby="modal-title"
        >
            <ModalContent>
                <ModalHeader>
                    <p className="font-bold">Customer Information</p>
                </ModalHeader>
                <ModalBody>
                    <Input
                        label="Name"
                        variant="bordered"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <Input
                        label="Address"
                        variant="bordered"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                    <Input
                        label="TIN"
                        variant="bordered"
                        value={customerTIN}
                        onChange={(e) => setCustomerTIN(e.target.value)}
                    />
                    <Input
                        label="Business Style"
                        variant="bordered"
                        value={customerBusinessStyle}
                        onChange={(e) => setCustomerBusinessStyle(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSaveCustomerDetails} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleCloseCustomerDetails} color="secondary">
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomerDetails;
