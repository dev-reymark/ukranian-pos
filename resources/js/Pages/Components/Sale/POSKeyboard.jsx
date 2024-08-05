import React from "react";
import { Button } from "@nextui-org/react";

const POSKeyboard = ({ handleButtonClick, buttons, buttonClickHandlers, setInputValue }) => {
    return (
        <>
            <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00", "."].map((num) => (
                    <Button
                        key={num}
                        color="primary"
                        size="lg"
                        onClick={() => handleButtonClick(num.toString())}
                    >
                        {num}
                    </Button>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
                {buttons.map(({ label, color, onClick, className }, index) => (
                    <Button
                        key={index}
                        size="lg"
                        color={color}
                        onClick={() => {
                            if (
                                typeof onClick === "string" &&
                                buttonClickHandlers[onClick]
                            ) {
                                buttonClickHandlers[onClick]();
                            } else if (typeof onClick === "function") {
                                // Call the function directly with setInputValue if needed
                                onClick(setInputValue);
                            }
                        }}
                        className={className}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </>
    );
};


export default POSKeyboard;
