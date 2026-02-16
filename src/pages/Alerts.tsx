
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, Info, RefreshCw } from "lucide-react";
import { products, invoices } from "@/lib/mock-data";
import { useStore } from "@/context/StoreContext";
import { generateSystemAlerts, Alert } from "@/lib/notification-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Alerts = () => {
  const { currentStore } = useStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Initial load
    refreshAlerts();
  }, [currentStore]);

  const refreshAlerts = () => {
    const newAlerts = generateSystemAlerts(products, invoices, currentStore?.id || null);
    setAlerts(newAlerts);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning": return <Bell className="h-5 w-5 text-yellow-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-50 dark:bg-red-900/10 border-red-200";
      case "warning": return "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200";
      case "success": return "bg-green-50 dark:bg-green-900/10 border-green-200";
      default: return "bg-blue-50 dark:bg-blue-900/10 border-blue-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Notifications</h1>
            <p className="text-muted-foreground text-sm mt-1">
              System alerts and automated updates for {currentStore ? currentStore.name : "All Stores"}
            </p>
          </div>
          <Button onClick={refreshAlerts} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Alerts
          </Button>
        </div>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No active alerts at the moment.</p>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className={`border ${getBgColor(alert.type)} shadow-sm`}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                  </div>
                  {alert.type === "critical" && (
                    <Badge variant="destructive">Action Required</Badge>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
