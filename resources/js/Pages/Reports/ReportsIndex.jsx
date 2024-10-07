import React, { useState } from "react";
import {
    Card,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ReportsIndex() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isReportModalOpen,
        onOpen: onOpenReportModal,
        onClose: onCloseReportModal,
    } = useDisclosure(); // New state for report modal
    const [currentReport, setCurrentReport] = useState("");
    const [periodDetails, setPeriodDetails] = useState([]);
    const [selectedPeriodReport, setSelectedPeriodReport] = useState(null);

    const reports = [
        "CLOSE CASHDRAW",
        "PRINT CASHDRAW",
        "ATT PRINT SHIFT",
        "CLOSE SHIFT",
        "PRINT SHIFT",
        "CUMULATIVE SALE",
        "CLOSE DAY",
        "PRINT DAY",
        "CALIBRATION",
        "CLOSE MONTH",
        "PRINT MONTH",
        "TAPPING",
    ];

    const handleReportClick = async (report) => {
        let periodType = null;

        if (report === "CLOSE SHIFT") {
            periodType = 1; // close shift
        } else if (report === "CLOSE DAY") {
            periodType = 2; // close day
        } else if (report === "CLOSE MONTH") {
            periodType = 3; // close month
        }

        if (periodType !== null) {
            const result = await Swal.fire({
                title: `Are you sure you want to ${report}?`,
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, proceed!",
                cancelButtonText: "No, cancel!",
            });

            if (result.isConfirmed) {
                try {
                    const response = await axios.post(
                        "/close-shift",
                        {
                            periodType,
                            posID: 1,
                        },
                        {
                            headers: {
                                "X-CSRF-TOKEN": document
                                    .querySelector('meta[name="csrf-token"]')
                                    .getAttribute("content"),
                            },
                        }
                    );

                    console.log(response.data);
                    toast.success("Report generated successfully");
                } catch (error) {
                    console.error("Error:", error);
                    toast.error("Error generating report");
                }
            }
        } else if (
            ["PRINT SHIFT", "PRINT DAY", "PRINT MONTH"].includes(report)
        ) {
            periodType =
                report === "PRINT SHIFT" ? 1 : report === "PRINT DAY" ? 2 : 3;
            setCurrentReport(report);
            const fetchedPeriods = await fetchPeriods(periodType);
            setPeriodDetails(fetchedPeriods);
            onOpen();
        } else {
            alert(`localhost says: ${report}`);
        }
    };

    const fetchPeriods = async (periodType) => {
        try {
            const response = await axios.get("/get-all-period", {
                params: { periodType },
            });
            return response.data.data || [];
        } catch (error) {
            console.error("Error fetching periods:", error);
            return [];
        }
    };

    const handlePeriodClick = (period) => {
        setSelectedPeriodReport(period.report);
        onOpenReportModal();
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-2">
                {reports.map((report, index) => (
                    <Card
                        key={index}
                        className="p-2 w-full h-[150px]"
                        isPressable
                        onPress={() => handleReportClick(report)}
                        shadow="sm"
                    >
                        <div className="flex justify-center items-center h-full">
                            <h1 className="text-xl font-extrabold">{report}</h1>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                hideCloseButton={true}
                size="2xl"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h1 className="text-xl font-extrabold">
                                    {currentReport}
                                </h1>
                            </ModalHeader>
                            <ModalBody>
                                {periodDetails.length > 0 ? (
                                    <Table
                                        selectionMode="single"
                                        aria-label="Get Periods by ID"
                                    >
                                        <TableHeader>
                                            <TableColumn>Period_ID</TableColumn>
                                            <TableColumn>
                                                Period_Create_TS
                                            </TableColumn>
                                            <TableColumn>
                                                Period_Type
                                            </TableColumn>
                                            <TableColumn>
                                                Period_Close_DT
                                            </TableColumn>
                                            <TableColumn>
                                                Shift_Number
                                            </TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {periodDetails.map(
                                                (periodItem, index) => (
                                                    <TableRow
                                                        key={index}
                                                        onClick={() =>
                                                            handlePeriodClick(
                                                                periodItem
                                                            )
                                                        }
                                                    >
                                                        <TableCell>
                                                            {
                                                                periodItem
                                                                    .period
                                                                    .Period_ID
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                new Date(
                                                                    periodItem.period.Period_Create_TS
                                                                ).getTime() -
                                                                    new Date(
                                                                        periodItem.period.Period_Create_TS
                                                                    ).getTimezoneOffset() *
                                                                        60000
                                                            ).toLocaleString(
                                                                [],
                                                                {
                                                                    year: "numeric",
                                                                    month: "numeric",
                                                                    day: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                    hour12: true,
                                                                }
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                periodItem
                                                                    .period
                                                                    .Period_Type
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                new Date(
                                                                    periodItem.period.Period_Close_DT
                                                                ).getTime() -
                                                                    new Date(
                                                                        periodItem.period.Period_Close_DT
                                                                    ).getTimezoneOffset() *
                                                                        60000
                                                            ).toLocaleString(
                                                                [],
                                                                {
                                                                    year: "numeric",
                                                                    month: "numeric",
                                                                    day: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "numeric",
                                                                    hour12: true,
                                                                }
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                periodItem
                                                                    .period
                                                                    .Shift_number
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p>No details available.</p>
                                )}
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

            {/* Modal for selected period report */}
            <Modal
                isOpen={isReportModalOpen}
                onOpenChange={onCloseReportModal}
                size="xl"
                isDismissable={false}
                hideCloseButton={true}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1 className="text-xl font-extrabold">Print Report</h1>
                    </ModalHeader>
                    <Divider />
                    <ModalBody>
                        {selectedPeriodReport && (
                            <>
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
                                    <div>
                                        {selectedPeriodReport.depSales.map(
                                            (sale, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between py-1"
                                                >
                                                    <span>{sale.depName}</span>
                                                    <span>Qty: {sale.qty}</span>
                                                    <span>Val: {sale.val}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div>
                                        {selectedPeriodReport.fuelSales.map(
                                            (fuelsale, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between py-1"
                                                >
                                                    {fuelsale.Grade_Name}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </pre>
                            </>
                        )}
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <Button color="primary">Print</Button>
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={onCloseReportModal}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
