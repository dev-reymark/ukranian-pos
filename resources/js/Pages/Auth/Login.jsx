import axios from "axios";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Code,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Input,
    Button,
    Spacer,
} from "@nextui-org/react";
import ApplicationLogo from "../Components/ApplicationLogo";
import toast, { Toaster } from "react-hot-toast";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../Components/Icon";

function Login() {
    const [Cashier_Number, setCashierNumber] = useState("");
    const [Cashier_Psw, setCashierPsw] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cashierNumberError, setCashierNumberError] = useState("");
    const [passwordError, setPasswordError] = useState("");

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
        setIsLoading(true);

        try {
            await axios.post("/login", { Cashier_Number, Cashier_Psw });
            toast.success("Login successful! Redirecting...");
            setTimeout(() => {
                window.location.href = "/home";
            }, 1000);
        } catch (err) {
            setCashierPsw("");
            if (err.response && err.response.data) {
                toast.error(err.response.data.error || "An error occurred");
            } else {
                toast.error("An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Login" />
            <Toaster position="top-right" />
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
                        <Code color="warning">Version 1.0</Code>
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
                                    isLoading={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}

export default Login;
