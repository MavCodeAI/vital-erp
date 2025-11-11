import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Bell, Shield, Palette, Database, Mail, Globe } from "lucide-react";

export default function Settings() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Configure system preferences and company settings
          </p>
        </div>

        {/* Company Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>Update your company details and business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="ErpMax Pakistan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-id">NTN Number</Label>
                <Input id="tax-id" defaultValue="1234567-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="Plot 123, Block A, Gulshan-e-Iqbal" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="Karachi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Province</Label>
                <Input id="state" defaultValue="Sindh" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">Postal Code</Label>
                <Input id="zip" defaultValue="75300" />
              </div>
            </div>
            <Button className="bg-gradient-primary">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Invoice Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about pending invoices</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts when inventory is low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about system updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>Manage security settings and data privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input id="password" type="password" placeholder="Enter new password" />
              <Button variant="outline">Update Password</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Appearance */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>Compact View</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Regional Settings */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Regional Settings</CardTitle>
              </div>
              <CardDescription>Configure language and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English / اردو" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC+05:00 (PKT)" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
