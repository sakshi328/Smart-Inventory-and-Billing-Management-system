import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account and preferences
          </p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-4">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Business Name</Label>
                <Input defaultValue="My Store" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Email</Label>
                <Input defaultValue="admin@mystore.com" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Phone</Label>
                <Input defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Tax Rate (%)</Label>
                <Input defaultValue="9" type="number" />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-4">Low Stock Threshold</h3>
            <div className="space-y-2">
              <Label className="text-xs">Default minimum stock level</Label>
              <Input defaultValue="10" type="number" className="w-32" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
