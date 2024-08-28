import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
} from "@nextui-org/react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-hot-toast";

function ElectricJournal({ isOpen, onOpenChange }) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    ); 
    const [selectedTime, setSelectedTime] = useState(null);
    const [journalList, setJournalList] = useState([]);
    const [originalJournalList, setOriginalJournalList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const pages = Math.ceil(journalList.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return journalList.slice(start, end);
    }, [page, journalList]);

    useEffect(() => {
        const getJournal = async () => {
            try {
                const response = await axios.get("/get-journals");
                if (Array.isArray(response.data.data)) {
                    setOriginalJournalList(response.data.data);
                    applyFilters(new Date(), null); // Filter by today's date by default
                } else {
                    setError("Unexpected data format.");
                }
            } catch (error) {
                setError("Failed to fetch journals.");
            }
        };

        getJournal();
    }, []);

    const handleRowClick = (item) => {
        setSelectedItem(item);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        applyFilters(new Date(date), selectedTime);
    };

    const handleTimeChange = (event) => {
        const time = event.target.value;
        setSelectedTime(time);
        applyFilters(new Date(selectedDate), time);
    };

    const applyFilters = (date, time) => {
        let filteredList = originalJournalList;

        if (date) {
            filteredList = filteredList.filter((item) => {
                const itemDate = new Date(item.Transaction_Date);
                return itemDate.toDateString() === date.toDateString();
            });
        }

        if (time) {
            const [hours, minutes] = time.split(":").map(Number);
            filteredList = filteredList.filter((item) => {
                const itemDate = new Date(item.Transaction_Date);
                return (
                    itemDate.getHours() === hours &&
                    itemDate.getMinutes() === minutes
                );
            });
        }

        setJournalList(filteredList);
    };

    const handlePrint = async () => {
        if (selectedItem) {
            try {
                const response = await axios.post("/print-data", {
                    data: selectedItem.Data,
                });

                if (response.data.status === "success") {
                    toast.success("Print job sent successfully");
                } else {
                    toast.error(
                        "Failed to send print job: " + response.data.message
                    );
                }
            } catch (error) {
                toast.error(
                    "An error occurred while sending the print request."
                );
            }
        } else {
            toast.error("No item selected to print");
        }
    };

    return (
        <Modal
            size="5xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            JOURNALS
                        </ModalHeader>
                        <ModalBody>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex gap-4">
                                <Table
                                    aria-label="Journals History"
                                    className="w-[60%]"
                                    bottomContent={
                                        <div className="flex w-full justify-center">
                                            <Pagination
                                                isCompact
                                                showControls
                                                showShadow
                                                color="secondary"
                                                page={page}
                                                total={pages}
                                                onPageChange={(newPage) =>
                                                    setPage(newPage)
                                                }
                                            />
                                        </div>
                                    }
                                    classNames={{
                                        wrapper: "min-h-[222px]",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn key="date">
                                            DATE
                                        </TableColumn>
                                        <TableColumn key="si_number">
                                            OR/SI #
                                        </TableColumn>
                                        <TableColumn hidden key="data">
                                            RECEIPT DATA
                                        </TableColumn>
                                        <TableColumn key="cashier">
                                            CASHIER
                                        </TableColumn>
                                        <TableColumn key="pos_id">
                                            POS
                                        </TableColumn>
                                        <TableColumn key="sale_total">
                                            SALE TOTAL
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="Nothing to display.">
                                        {items.map((item) => (
                                            <TableRow
                                                key={item.Transaction_ID}
                                                onClick={() =>
                                                    handleRowClick(item)
                                                }
                                                className="cursor-pointer"
                                            >
                                                <TableCell>
                                                    {new Date(
                                                        new Date(
                                                            item.Transaction_Date
                                                        ).getTime() -
                                                            new Date(
                                                                item.Transaction_Date
                                                            ).getTimezoneOffset() *
                                                                60000
                                                    ).toLocaleString([], {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    #{item.si_number}
                                                </TableCell>
                                                <TableCell hidden>
                                                    {item.Data}
                                                </TableCell>
                                                <TableCell>
                                                    {item.Cashier_Name}
                                                </TableCell>
                                                <TableCell>
                                                    {item.pos_id}
                                                </TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat(
                                                        "en-PH",
                                                        {
                                                            style: "currency",
                                                            currency: "PHP",
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    ).format(item.Sale_Total)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Card className="w-[40%]">
                                    <CardHeader className="flex gap-3">
                                        <Button
                                            className="w-full"
                                            color="primary"
                                            onClick={handlePrint}
                                        >
                                            Print
                                        </Button>
                                        <Button
                                            className="w-full"
                                            color="secondary"
                                            onClick={() => {
                                                setSelectedDate(
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                );
                                                setSelectedTime(null);
                                                applyFilters(new Date(), null);
                                            }}
                                        >
                                            Reset Search
                                        </Button>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody className="flex gap-3">
                                        <input
                                            type="date"
                                            className="w-full"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                        <input
                                            type="time"
                                            className="w-full"
                                            value={selectedTime || ""}
                                            onChange={handleTimeChange}
                                        />
                                    </CardBody>
                                    <Divider />
                                </Card>
                            </div>
                            <Card className="w-full">
                                <CardHeader className="flex gap-3 justify-between items-center">
                                    <div className="flex flex-col">
                                        <p className="text-small text-default-500">
                                            Here you can see transaction
                                            details.
                                        </p>
                                    </div>
                                    <Button
                                        color="warning"
                                        size="sm"
                                        onClick={() => setSelectedItem(null)}
                                        isIconOnly
                                    >
                                        <AiOutlineClose />
                                    </Button>
                                </CardHeader>
                                <Divider />
                                <CardBody className="flex flex-col items-center">
                                    {selectedItem ? (
                                        <pre
                                            style={{
                                                textAlign: "center",
                                                whiteSpace: "pre-wrap",
                                                wordWrap: "break-word",
                                                fontFamily: "monospace",
                                                lineHeight: "1.5",
                                                color: "#333",
                                                padding: "10px",
                                                backgroundColor: "#f4f4f4",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            {selectedItem.Data}
                                        </pre>
                                    ) : (
                                        <p>
                                            Click on a journal entry to view the
                                            receipt data.
                                        </p>
                                    )}
                                </CardBody>
                                <Divider />
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

export default ElectricJournal;
