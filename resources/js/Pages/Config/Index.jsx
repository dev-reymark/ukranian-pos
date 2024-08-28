import React from "react";
import { Card, useDisclosure } from "@nextui-org/react";
import ElectricJournal from "./ElectricJournal";
import AboutSoftware from "./AboutSoftware";

export default function Index() {
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
                    <Card className="col-span-12 sm:col-span-4 h-[200px]">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                RESTART PUMP SERVER
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
                    <Card isPressable onPress={onOpenAbout} className="w-full h-[200px] col-span-12 sm:col-span-5">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">ABOUT</h1>
                        </div>
                    </Card>
                    <Card isPressable onPress={onOpenElectricJournal} className="w-full h-[200px] col-span-12 sm:col-span-7">
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">
                                ELECTRONIC JOURNAL
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
        </>
    );
}
