import axios from "axios";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Input,
    Button,
    Spacer,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    CircularProgress,
    ModalFooter,
} from "@nextui-org/react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai"; // Icons for success and error
import ApplicationLogo from "../Components/ApplicationLogo";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Components/Icon";

function Login() {
    const [Cashier_Number, setCashierNumber] = useState("");
    const [Cashier_Psw, setCashierPsw] = useState("");
    const [loadingStep, setLoadingStep] = useState(0); // Track loading steps
    const [isVisible, setIsVisible] = useState(false);
    const [cashierNumberError, setCashierNumberError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [errorOccurred, setErrorOccurred] = useState(false); // Track error state

    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal open/close logic

    const toggleVisibility = () => setIsVisible(!isVisible);

    const validateInputs = () => {
        let isValid = true;
        setCashierNumberError("");
        setPasswordError("");

        if (Cashier_Number.trim() === "") {
            setCashierNumberError("Invalid Cashier Number");
            isValid = false;
        }

        if (Cashier_Psw.trim() === "") {
            setPasswordError("Invalid Password");
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        onOpen(); // Open modal
        setLoadingStep(1); // Step 1: form validation passed
        setErrorOccurred(false); // Reset error state

        try {
            // Simulate the first step of processing (e.g., server request)
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLoadingStep(2); // Step 2: processing credentials

            await axios.post("/", { Cashier_Number, Cashier_Psw });
            setLoadingStep(3); // Step 3: login successful

            setTimeout(() => {
                window.location.href = "/home"; // Redirect after a short delay
            }, 1000);
        } catch (err) {
            setCashierPsw("");
            setLoadingStep(0); // Reset on error
            setErrorOccurred(true); // Set error state

            if (err.response && err.response.data) {
                setPasswordError(
                    err.response.data.error || "An error occurred"
                );
            } else {
                setPasswordError("An error occurred");
            }

            onOpenChange(false); // Close modal on error
        }
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex items-center justify-center min-h-screen p-3">
                <Card className="max-w-md w-full">
                    <CardHeader className="flex gap-3 justify-between">
                        <div className="flex gap-3">
                            <ApplicationLogo />
                            <div className="flex flex-col">
                                <p className="text-md font-bold">VENUS POS</p>
                                <p className="text-small font-semibold text-default-500">
                                    Datalogic Systems Corporation
                                </p>
                            </div>
                        </div>
                        <Chip radius="sm" color="warning">
                            Version 1.0
                        </Chip>
                    </CardHeader>
                    <Divider />
                    <Spacer y={4} />
                    <CardBody className="p-5">
                        <form onSubmit={handleSubmit}>
                            <Input
                                id="Cashier_Number"
                                value={Cashier_Number}
                                onChange={(e) =>
                                    setCashierNumber(e.target.value)
                                }
                                label="Cashier Number"
                                isRequired
                                isInvalid={!!cashierNumberError}
                                errorMessage={cashierNumberError}
                            />
                            <Spacer y={6} />
                            <Input
                                id="Cashier_Psw"
                                endContent={
                                    <button
                                        className="focus:outline-none"
                                        type="button"
                                        onClick={toggleVisibility}
                                        aria-label="toggle password visibility"
                                    >
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                                value={Cashier_Psw}
                                onChange={(e) => setCashierPsw(e.target.value)}
                                label="Password"
                                type={isVisible ? "text" : "password"}
                                isRequired
                                isInvalid={!!passwordError}
                                errorMessage={passwordError}
                            />
                            <Spacer y={4} />
                            <CardFooter className="flex justify-end">
                                <Button
                                    color="primary"
                                    variant="shadow"
                                    type="submit"
                                >
                                    Login
                                </Button>
                            </CardFooter>
                        </form>
                    </CardBody>
                </Card>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Logging In...
                            </ModalHeader>
                            <Divider />
                            <ModalBody className="flex flex-col items-center mt-6">
                                {loadingStep < 3 && !errorOccurred ? (
                                    <CircularProgress
                                        value={(loadingStep / 3) * 100}
                                        color="primary"
                                        size="lg"
                                        showValueLabel={false}
                                        className="mb-2"
                                    />
                                ) : errorOccurred ? (
                                    <AiOutlineClose
                                        color="red"
                                        size={40}
                                        className="mb-2"
                                    />
                                ) : (
                                    <AiOutlineCheck
                                        color="green"
                                        size={40}
                                        className="mb-2"
                                    />
                                )}
                                <p
                                    className={`mt-2 text-md font-extrabold ${
                                        errorOccurred ? "text-red-500" : ""
                                    }`}
                                >
                                    {loadingStep === 1 &&
                                        "Validating inputs..."}
                                    {loadingStep === 2 &&
                                        "Processing credentials..."}
                                    {loadingStep === 3 &&
                                        "Login successful! Redirecting..."}
                                    {errorOccurred &&
                                        "Login failed. Please try again."}
                                </p>
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default Login;
