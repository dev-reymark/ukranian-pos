import axios from "axios";
import { Card, useDisclosure } from "@nextui-org/react";
import ElectricJournal from "./ElectricJournal";
import AboutSoftware from "./AboutSoftware";
import PriceChange from "./PriceChange";

const actions = {
    restartPTS: {
        label: "Restart PTS Controller",
        onPress: "restartPumpServer",
    },
    aboutSoftware: {
        label: "About Software",
        onPress: "onOpenAbout",
    },
    electricJournal: {
        label: "Electronic Journal",
        onPress: "onOpenElectricJournal",
    },
    priceChange: {
        label: "Price Change",
        onPress: "onOpenPriceChange",
    },
    managerView: {
        label: "Manager's View",
    },
    posConfig: {
        label: "POS Config",
    },
};

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
        isOpen: isOpenPriceChange,
        onOpen: onOpenPriceChange,
        onOpenChange: onOpenChangePriceChange,
    } = useDisclosure();

    const restartPumpServer = () => {
        axios
            .post("/restart-pts")
            .then(() => {
                onToast("PTS server restarted", "success");
            })
            .catch((error) => {
                onToast("Error", error.message);
            });
    };

    const actionHandlers = {
        restartPumpServer,
        onOpenAbout,
        onOpenElectricJournal,
        onOpenPriceChange,
    };

    const ActionCard = ({ label, onPress }) => (
        <Card
            isPressable={!!onPress}
            onPress={onPress ? actionHandlers[onPress] : null}
            className="p-2 h-[150px]"
        >
            <div className="flex justify-center items-center h-full">
                <h1 className="text-xl font-extrabold uppercase">{label}</h1>
            </div>
        </Card>
    );

    return (
        <>
            <section>
                <div className="w-full h-full mx-auto gap-2 grid grid-cols-3">
                    {Object.keys(actions).map((key) => (
                        <ActionCard
                            key={key}
                            label={actions[key].label}
                            onPress={actions[key].onPress}
                        />
                    ))}
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
                onToast={onToast}
                isOpen={isOpenPriceChange}
                onOpenChange={onOpenChangePriceChange}
            />
        </>
    );
}
