import axios from "axios";
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function LogoutButton() {
    const handleLogout = async () => {
        try {
            await axios.post("/logout");
            toast.success("Logged out successfully");
            window.location.href = "/";
        } catch (error) {
            toast.error("An error occurred during logout");
        }
    };

    return (
        <>
            <Toaster />
            <Button onClick={handleLogout} color="danger">
                Logout
            </Button>
        </>
    );
}

export default LogoutButton;
