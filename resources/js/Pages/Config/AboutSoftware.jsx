import React from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
    Divider,
    Link,
} from "@nextui-org/react";
import ApplicationLogo from "../Components/ApplicationLogo";

function AboutSoftware({ isOpen, onOpenChange }) {
    return (
        <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-xl font-extrabold">
                            ABOUT THE SOFTWARE
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <ApplicationLogo />
                                    <div className="flex flex-col text-xl font-extrabold">
                                        <p className="text-md">VENUS POS</p>
                                        <p className="text-small text-default-500">
                                            © Datalogic Systems Corp. 2024
                                        </p>
                                    </div>
                                </div>
                                <Divider />
                                <div className="font-extrabold">
                                    <p>License: MIT</p>
                                    <p>Version: 1.0.0</p>
                                </div>
                                <Divider />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <div className="font-bold py-4">
                                <div className="flex h-5 items-center space-x-4 text-small">
                                    <Link href="" target="_blank">
                                        Read License
                                    </Link>
                                    <Divider orientation="vertical" />
                                    <Link href="" target="_blank">
                                        Report a Bug
                                    </Link>
                                </div>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default AboutSoftware;
