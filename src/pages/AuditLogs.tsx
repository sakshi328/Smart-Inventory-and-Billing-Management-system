
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ShieldAlert, Activity } from "lucide-react";
import { getAuditLogs, AuditLog } from "@/lib/audit-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [logs, setLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        setLogs(getAuditLogs());
    }, []);

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const refreshLogs = () => {
        setLogs(getAuditLogs());
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Audit Logs</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Track system activity and security events
                        </p>
                    </div>
                    <Button variant="outline" onClick={refreshLogs}>
                        <Activity className="mr-2 h-4 w-4" />
                        Refresh Logs
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Severity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground text-sm">{log.timestamp}</TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.user}</TableCell>
                                    <TableCell>{log.details}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={`
                                    ${log.severity === 'destructive' ? 'border-red-500 text-red-600 bg-red-50' :
                                                log.severity === 'warning' ? 'border-orange-500 text-orange-600 bg-orange-50' :
                                                    'border-blue-500 text-blue-600 bg-blue-50'}
                                `}>
                                            {log.severity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AuditLogs;
