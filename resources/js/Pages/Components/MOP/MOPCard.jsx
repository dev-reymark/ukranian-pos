import React, { useState, Suspense } from "react";
import {
    Card,
    Modal,
    Button,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    Listbox,
    ListboxItem,
    ListboxSection,
    Divider,
    CardHeader,
} from "@nextui-org/react";

const ListboxWrapper = ({ children }) => (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);

const otherMOPs = [
    {
        MOP_ID: 1,
        MOP_Name: "Zero-Rated",
        content: "More details about Zero-Rated.",
    },
    {
        MOP_ID: 2,
        MOP_Name: "Discounts",
        content: "More details about Discounts.",
    },
    {
        MOP_ID: 3,
        MOP_Name: "Redemption",
        content: "More details about Redemption.",
    },
];

const MOPCard = ({ mopList, onSelectMOP }) => {
    const [showOtherMOPs, setShowOtherMOPs] = useState(false);
    const [selectedMOP, setSelectedMOP] = useState(null);
    const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [selectedDiscountPresets, setSelectedDiscountPresets] = useState([]);
    const [loadingDiscounts, setLoadingDiscounts] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOtherMOPClick = () => {
        setShowOtherMOPs(true);
    };

    const handleMOPCardClick = (mop) => {
        if (showOtherMOPs) {
            setShowOtherMOPs(false);
        }
        onSelectMOP(mop);
    };

    const handleOpenModal = (mop) => {
        if (mop.MOP_Name === "Discounts") {
            setSelectedMOP(mop);
            setDiscountModalOpen(true);
            // Fetch discounts when the Discounts modal opens
            fetchDiscounts();
        } else {
            setSelectedMOP(mop);
            onOpen();
        }
    };

    const fetchDiscounts = async () => {
        setLoadingDiscounts(true);
        try {
            const response = await fetch("/get-discount");
            const data = await response.json();
            setDiscounts(data);

            if (selectedDiscount) {
                const discount = data.find(
                    (d) => d.discount_id === selectedDiscount.discount_id
                );
                setSelectedDiscountPresets(discount ? discount.presets : []);
            }
        } catch (error) {
            console.error("Error fetching discounts:", error);
        } finally {
            setLoadingDiscounts(false);
        }
    };

    const handleDiscountSelect = (discount) => {
        setSelectedDiscount(discount);
        setSelectedDiscountPresets(discount.presets);
    };

    return (
        <div className="relative">
            {showOtherMOPs ? (
                <div className="grid grid-cols-4 gap-2">
                    {otherMOPs.map((mop) => (
                        <Card
                            key={mop.MOP_ID}
                            shadow="sm"
                            isPressable
                            onPress={() => handleOpenModal(mop)}
                            className="p-2 h-[200px]"
                        >
                            <div className="flex justify-center items-center h-full">
                                <h1 className="text-xl font-extrabold">
                                    {mop.MOP_Name.trim()}
                                </h1>
                            </div>
                        </Card>
                    ))}
                    <Card
                        isPressable
                        onPress={() => setShowOtherMOPs(false)}
                        className="fixed bottom-5 p-2 h-[200px]"
                    >
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                BACK TO MOP
                            </h1>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-2">
                    {mopList.length > 0 ? (
                        <>
                            {mopList.map((mop) => (
                                <Card
                                    key={mop.MOP_ID}
                                    shadow="sm"
                                    isPressable
                                    onPress={() => handleMOPCardClick(mop)}
                                    className="p-2 h-[200px]"
                                >
                                    <div className="flex justify-center items-center h-full">
                                        <h1 className="text-xl font-extrabold">
                                            {mop.MOP_Name.trim()}
                                        </h1>
                                    </div>
                                </Card>
                            ))}
                            <Card
                                isPressable
                                onPress={handleOtherMOPClick}
                                className="fixed bottom-5 p-2 h-[200px]"
                            >
                                <div className="flex justify-center items-center h-full">
                                    <h1 className="text-xl font-extrabold">
                                        OTHER MOP
                                    </h1>
                                </div>
                            </Card>
                        </>
                    ) : (
                        <div className="col-span-4 py-12 text-xl font-extrabold text-center text-red-500">
                            No payment method found!
                        </div>
                    )}
                </div>
            )}

            {selectedMOP && !isDiscountModalOpen && (
                <Modal isOpen={isOpen} onOpenChange={onClose}>
                    <ModalContent>
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {selectedMOP.MOP_Name}
                            </ModalHeader>
                            <ModalBody>{selectedMOP.content}</ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
            )}

            {isDiscountModalOpen && (
                <Modal
                    size="5xl"
                    isOpen={isDiscountModalOpen}
                    onOpenChange={() => setDiscountModalOpen(false)}
                >
                    <ModalContent>
                        <>
                            <ModalHeader className="text-xl font-extrabold">
                                {selectedMOP.MOP_Name}
                            </ModalHeader>
                            <ModalBody className="grid grid-cols-2 gap-2">
                                {loadingDiscounts ? (
                                    <div>Loading discounts...</div>
                                ) : (
                                    <Card>
                                        <Listbox aria-label="Discounts">
                                            <ListboxSection title="Select Discount">
                                                {discounts.length > 0 ? (
                                                    discounts.map(
                                                        (discount) => (
                                                            <ListboxItem
                                                                key={
                                                                    discount.discount_id
                                                                }
                                                                onClick={() =>
                                                                    handleDiscountSelect(
                                                                        discount
                                                                    )
                                                                }
                                                                className={`${
                                                                    selectedDiscount?.discount_id ===
                                                                    discount.discount_id
                                                                        ? "bg-primary text-white"
                                                                        : "bg-white"
                                                                }`}
                                                            >
                                                                {
                                                                    discount.discount_name
                                                                }
                                                            </ListboxItem>
                                                        )
                                                    )
                                                ) : (
                                                    <ListboxItem key="no-discounts">
                                                        No discounts available
                                                    </ListboxItem>
                                                )}
                                            </ListboxSection>
                                        </Listbox>
                                    </Card>
                                )}

                                {selectedDiscountPresets.length > 0 ? (
                                    <Card className="p-2">
                                        <CardHeader className="text-xl font-extrabold">
                                            {selectedDiscount.discount_name}
                                        </CardHeader>
                                        <Listbox aria-label="Presets">
                                            {selectedDiscountPresets.map(
                                                (preset) => (
                                                    <ListboxItem
                                                        key={preset.preset_id}
                                                    >
                                                        {preset.preset_name}
                                                    </ListboxItem>
                                                )
                                            )}
                                        </Listbox>
                                    </Card>
                                ) : (
                                    <Card className="p-2 h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-xl font-extrabold">
                                                Please select a discount
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </ModalBody>
                            <Divider />
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onPress={() => setDiscountModalOpen(false)}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default MOPCard;
