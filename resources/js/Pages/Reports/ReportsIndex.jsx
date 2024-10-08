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
    } = useDisclosure();
    const {
        isOpen: isCashDrawModalOpen,
        onOpen: onOpenCashDrawModal,
        onClose: onCloseCashDrawModal,
    } = useDisclosure();
    const [cashDrawDetails, setCashDrawDetails] = useState([]);
    const [currentReport, setCurrentReport] = useState("");
    const [periodDetails, setPeriodDetails] = useState([]);
    const [selectedPeriodReport, setSelectedPeriodReport] = useState(null);
    const [selectedCashDrawReport, setSelectedCashDrawReport] = useState(null);
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
        } else if (report === "CLOSE CASHDRAW") {
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
                        "/close-cash-draw",
                        {
                            posID: 1, // Use appropriate posID
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
                    toast.success("Cash draw closed successfully");
                } catch (error) {
                    console.error("Error:", error);
                    toast.error("Error closing cash draw");
                }
                return;
            }
        } else if (report === "PRINT CASHDRAW") {
            await fetchCashDraw();
            return;
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

    const fetchCashDraw = async () => {
        try {
            const response = await axios.get("/get-all-cash-draw");
            setCashDrawDetails(response.data.data);
            onOpenCashDrawModal();
        } catch (error) {
            console.error("Error fetching cash draw data:", error);
            toast.error("Error fetching cash draw details");
        }
    };

    const handlePeriodClick = (period) => {
        setSelectedPeriodReport(period.report);
        onOpenReportModal();
    };

    const handleCashDrawClick = async (cashDrawItem) => {
        // Assuming cashDrawItem has CDraw_Period_ID you want to send
        const cDrawPeriodID = cashDrawItem.CDraw_Period_ID;

        try {
            const response = await axios.get("/get-cash-draw-by-period", {
                params: { cdrawPeriodID: cDrawPeriodID },
            });

            if (response.data.statusCode === 1) {
                setSelectedCashDrawReport(response.data.data);
            } else {
                console.error("Error:", response.data.statusDescription);
                // Handle error accordingly, e.g., show a notification
            }
        } catch (error) {
            console.error("Request failed:", error);
            // Handle request failure, e.g., show a notification
        }
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
                                                            {periodItem.period
                                                                .Period_Close_DT
                                                                ? new Date(
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
                                                                  )
                                                                : "Not Close"}
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

            {/* Modal for cash draw details */}
            <Modal
                isOpen={isCashDrawModalOpen}
                onOpenChange={onCloseCashDrawModal}
                isDismissable={false}
                hideCloseButton={true}
                size="2xl"
            >
                <ModalContent>
                    <ModalHeader>
                        <h1 className="text-xl font-extrabold">
                            Cash Draw Report
                        </h1>
                    </ModalHeader>
                    <ModalBody>
                        {cashDrawDetails.length > 0 ? (
                            <Table
                                selectionMode="single"
                                aria-label="Cash Draw Details"
                            >
                                <TableHeader>
                                    <TableColumn>Period</TableColumn>
                                    <TableColumn>Close Date</TableColumn>
                                    <TableColumn>Cashier</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {cashDrawDetails.map(
                                        (cashDrawItem, index) => (
                                            <TableRow
                                                key={index}
                                                onClick={() =>
                                                    handleCashDrawClick(
                                                        cashDrawItem
                                                    )
                                                }
                                                isPressable
                                            >
                                                <TableCell>
                                                    {
                                                        cashDrawItem.CDraw_Period_ID
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        cashDrawItem.CDraw_Close_Date
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {cashDrawItem.Cashier_Name}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No cash draw details available.</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onPress={onCloseCashDrawModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal for selected Cash Draw */}
            <Modal isOpen={Boolean(selectedCashDrawReport)} size="xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1 className="text-xl font-extrabold">
                            Print Cash Draw
                        </h1>
                    </ModalHeader>
                    <Divider />
                    <ModalBody>
                        {selectedCashDrawReport ? (
                            <>
                                {/* Render Cash Draw Details */}
                                <div
                                    style={{
                                        marginBottom: "1rem",
                                        textAlign: "left",
                                    }}
                                >
                                    <h3>
                                        Cashier:{" "}
                                        {
                                            selectedCashDrawReport.cdrawDetails
                                                .Cashier_Name
                                        }
                                    </h3>
                                    <p>
                                        Period:{" "}
                                        {
                                            selectedCashDrawReport.cdrawDetails
                                                .CDraw_Period_ID
                                        }
                                    </p>
                                    <p>
                                        Open Date:{" "}
                                        {
                                            selectedCashDrawReport.cdrawDetails
                                                .CDraw_Open_Date
                                        }
                                    </p>
                                    <p>
                                        Close Date:{" "}
                                        {
                                            selectedCashDrawReport.cdrawDetails
                                                .CDraw_Close_Date
                                        }
                                    </p>
                                </div>

                                {/* Render Financial History (cdrawFinHistory) */}
                                {/* <div style={{ marginBottom: "1rem" }}>
                                    <h4>Financial History</h4>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>MOP Name</th>
                                                <th>Total Amount</th>
                                                <th>Float</th>
                                                <th>Num Safe Drops</th>
                                                <th>Total Safe Drops</th>
                                                <th>Num Payins</th>
                                                <th>Total Payins</th>
                                                <th>Num CashOuts</th>
                                                <th>Total CashOuts</th>
                                                <th>Num Refunds</th>
                                                <th>Total Refunds</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCashDrawReport.cdrawFinHistory.map(
                                                (finHistory, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                finHistory.MOP_Name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Tot_Amount
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Float
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Num_Safedrop
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Tot_Safedrop
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Num_Payin
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Tot_Payin
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Num_CashOut
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Tot_CashOut
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Num_Refund
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                finHistory.CDraw_Tot_Refund
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div> */}

                                {/* Render Grade History (cdrawGradeHist) */}
                                {/* <div style={{ marginBottom: "1rem" }}>
                                    <h4>Grade History</h4>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Grade Name</th>
                                                <th>Transactions</th>
                                                <th>Volume</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCashDrawReport.cdrawGradeHist.map(
                                                (gradeHistory, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                gradeHistory.Grade_Name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                gradeHistory.CDrawGrade_Trs
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                gradeHistory.CDrawGrade_Vol
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                gradeHistory.CDrawGrade_Val
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div> */}

                                {/* Render Department History (cdrawDeptHist) */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <h4>Department History</h4>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Department Name</th>
                                                <th>Quantity Sold</th>
                                                <th>Value Sold</th>
                                                <th>Quantity Refunded</th>
                                                <th>Value Refunded</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCashDrawReport.cdrawDeptHist.map(
                                                (deptHistory, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                deptHistory.Dept_Name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                deptHistory.CDrawDept_Qty_Sld
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                deptHistory.CDrawDept_Val_Sld
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                deptHistory.CDrawDept_Qty_Ref
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                deptHistory.CDrawDept_Val_Ref
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Render Manual Grade History (manualCdrawGradeHist) */}
                                {/* <div style={{ marginBottom: "1rem" }}>
                                    <h4>Manual Grade History</h4>
                                    <table
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Grade Name</th>
                                                <th>Transactions</th>
                                                <th>Volume</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedCashDrawReport.manualCdrawGradeHist.map(
                                                (manualGradeHistory, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {
                                                                manualGradeHistory.Grade_Name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                manualGradeHistory.CDrawGrade_Trs
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                manualGradeHistory.CDrawGrade_Vol
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                manualGradeHistory.CDrawGrade_Val
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div> */}
                            </>
                        ) : (
                            <p>No data available.</p>
                        )}
                    </ModalBody>

                    <Divider />
                    <ModalFooter>
                        {/* <Button
                            color="primary"
                            onPress={() => {
                                axios
                                    .post("/print-cash-draw", {
                                        data: JSON.stringify(
                                            selectedCashDrawReport,
                                            null,
                                            2
                                        ), // Send formatted report as string
                                    })
                                    .then((response) => {
                                        if (
                                            response.data.status === "success"
                                        ) {
                                            alert(
                                                "Cash draw report sent to printer."
                                            );
                                        } else {
                                            alert(
                                                "Failed to print cash draw report."
                                            );
                                        }
                                    })
                                    .catch((error) => {
                                        console.error(
                                            "Print request failed:",
                                            error
                                        );
                                    });
                            }}
                        >
                            Print
                        </Button> */}

                        <Button
                            color="primary"
                            onPress={() => {
                                axios
                                    .post("/display-in-notepad", {
                                        data: JSON.stringify(
                                            selectedCashDrawReport,
                                            null,
                                            2
                                        ), // Send formatted report as string
                                    })
                                    .then((response) => {
                                        if (
                                            response.data.status === "success"
                                        ) {
                                            alert(
                                                "Cash draw report opened in Notepad for testing."
                                            );
                                        } else {
                                            alert(
                                                "Failed to open cash draw report."
                                            );
                                        }
                                    })
                                    .catch((error) => {
                                        console.error("Request failed:", error);
                                    });
                            }}
                        >
                            Open in Notepad
                        </Button>

                        <Button
                            color="danger"
                            variant="flat"
                            onPress={() => {
                                setSelectedCashDrawReport(null); // Close modal by clearing the selectedCashDrawReport state
                            }}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
