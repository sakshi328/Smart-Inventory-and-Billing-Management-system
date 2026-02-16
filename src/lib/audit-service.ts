
export interface AuditLog {
    id: string;
    action: string;
    user: string;
    details: string;
    timestamp: string;
    severity: "info" | "warning" | "destructive";
}

// Mock initial logs
const initialLogs: AuditLog[] = [
    { id: "1", action: "LOGIN", user: "Sakshi Patil", details: "User logged in successfully", timestamp: new Date(Date.now() - 86400000).toLocaleString(), severity: "info" },
    { id: "2", action: "UPDATE_STOCK", user: "Sakshi Patil", details: "Added 50 units to 'Wireless Mouse'", timestamp: new Date(Date.now() - 40000000).toLocaleString(), severity: "info" },
    { id: "3", action: "DELETE_INVOICE", user: "Sakshi Patil", details: "Deleted invoice INV-009 (Draft)", timestamp: new Date(Date.now() - 3600000).toLocaleString(), severity: "destructive" },
    { id: "4", action: "REFUND", user: "Sakshi Patil", details: "Processed refund for INV-004", timestamp: new Date().toLocaleString(), severity: "warning" },
];

let logs: AuditLog[] = [...initialLogs];

export const getAuditLogs = (): AuditLog[] => {
    return [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const logAction = (action: string, details: string, severity: "info" | "warning" | "destructive" = "info") => {
    const newLog: AuditLog = {
        id: Math.random().toString(36).substring(7),
        action,
        user: "Sakshi Patil", // Mock User
        details,
        timestamp: new Date().toLocaleString(),
        severity
    };
    logs.unshift(newLog);
};
