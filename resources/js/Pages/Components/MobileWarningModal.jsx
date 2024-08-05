import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";

export default function MobileScreenWarningModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (mobile) {
                onOpen(); // Open modal if the screen is mobile
            } else {
                onClose(); // Close modal if the screen is not mobile
            }
        };

        checkScreenSize(); // Initial check
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, [onOpen, onClose]);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            backdrop="blur"
            closeButton={false}
            hideCloseButton={true}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 font-bold">
                    Mobile Screen Warning
                </ModalHeader>
                <ModalBody className="py-5">
                    <p>
                        You are using a mobile device. Some features may not be
                        fully optimized for mobile screens.
                    </p>
                    <p>
                        For the best experience, we recommend using a larger
                        screen device.
                    </p>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
