export const getPumpStatusColor = (type, nozzleUp) => {
    if (nozzleUp) {
        return "warning";
    }
    switch (type) {
        case "PumpIdleStatus":
            return "default";
        case "PumpFillingStatus":
            return "primary";
        case "PumpEndOfTransactionStatus":
            return "success";
        case "PumpOfflineStatus":
            return "danger";
        default:
            return "secondary";
    }
};
