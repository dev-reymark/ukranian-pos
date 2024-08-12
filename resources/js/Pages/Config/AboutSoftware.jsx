import React from "react";
import {
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
    Link,
    Image,
} from "@nextui-org/react";
import ApplicationLogo from "../Components/ApplicationLogo";

function AboutSoftware({ isOpen, onOpenChange }) {
    return (
        <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            ABOUT THE SOFTWARE
                        </ModalHeader>
                        <ModalBody>
                            <Card className="w-full mx-auto p-2">
                                <CardHeader className="flex gap-3">
                                    <ApplicationLogo />
                                    <div className="flex flex-col">
                                        <p className="text-md">VENUS POS</p>
                                        <p className="text-small text-default-500">
                                            © Datalogic Systems Corp. 2024
                                        </p>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p>
                                        <b>License</b>: MIT <br />
                                        <b>Version</b>: 1.0.0
                                    </p>
                                </CardBody>
                                <Divider />
                                <CardFooter>
                                    <Link isExternal showAnchorIcon href="">
                                        Visit source code on GitHub.
                                    </Link>
                                </CardFooter>
                            </Card>
                        </ModalBody>
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

export default AboutSoftware;
