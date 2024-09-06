import axios from "axios";
import { Card, useDisclosure } from "@nextui-org/react";
import ElectricJournal from "./ElectricJournal";
import AboutSoftware from "./AboutSoftware";
import PriceChange from "./PriceChange";

export default function Index({ onToast }) {
    const {
        isOpen: isOpenElectricJournal,
        onOpen: onOpenElectricJournal,
        onOpenChange: onOpenChangeElectricJournal,
    } = useDisclosure();
    const {
        isOpen: isOpenAbout,
        onOpen: onOpenAbout,
        onOpenChange: onOpenChangeAbout,
    } = useDisclosure();
    const {
        isOpen: isPriceChange,
        onOpen: onOpenPriceChange,
        onOpenChange: onOpenChangePriceChange,
    } = useDisclosure();

    const restartPumpServer = () => {
        axios
            .post("/restart-pts")
            .then((response) => {
                onToast("PTS server restarted", "success");
            })
            .catch((error) => {
                onToast("Error", error.message);
            });
    };

    return (
        <>
            <section>
                <div className="w-full h-full mx-auto gap-2 grid grid-cols-12 grid-rows-2">
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                MANAGER'S VIEW
                            </h1>
                        </div>
                    </Card>
                    <Card
                        isPressable
                        onPress={restartPumpServer}
                        className="col-span-12 sm:col-span-4 h-[200px]"
                    >
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                RESTART PTS CONTROLLER
                            </h1>
                        </div>
                    </Card>
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                POS CONFIG
                            </h1>
                        </div>
                    </Card>
                    <Card
                        isPressable
                        onPress={onOpenAbout}
                        className="col-span-12 sm:col-span-4 h-[200px]"
                    >
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                ABOUT SOFTWARE
                            </h1>
                        </div>
                    </Card>
                    <Card
                        isPressable
                        onPress={onOpenElectricJournal}
                        className="col-span-12 sm:col-span-4 h-[200px]"
                    >
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                ELECTRONIC JOURNAL
                            </h1>
                        </div>
                    </Card>
                    <Card isPressable onPress={onOpenPriceChange} className="col-span-12 sm:col-span-4 h-[200px]">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                PRICE CHANGE
                            </h1>
                        </div>
                    </Card>
                </div>
            </section>
            <ElectricJournal
                isOpen={isOpenElectricJournal}
                onOpenChange={onOpenChangeElectricJournal}
            />
            <AboutSoftware
                isOpen={isOpenAbout}
                onOpenChange={onOpenChangeAbout}
            />
            <PriceChange
                isOpen={isPriceChange}
                onOpenChange={onOpenChangePriceChange}
            />
        </>
    );
}
