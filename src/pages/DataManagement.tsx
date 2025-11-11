import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { showSuccess, showError } from "@/lib/toast";
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  FileText, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Package,
  ShoppingCart,
  Users,
  FolderKanban,
  UserCircle,
  Building2,
  Calculator
} from "lucide-react";

const stats = [
  { title: "Total Records", value: "12,458", change: "+234", trend: "up", icon: Database, color: "text-success", bgColor: "bg-blue-500/10" },
  { title: "Last Export", value: "2 days ago", change: "Jan 13", trend: "up", icon: Download, color: "text-primary", bgColor: "bg-green-500/10" },
  { title: "Last Import", value: "5 days ago", change: "Jan 10", trend: "up", icon: Upload, color: "text-primary", bgColor: "bg-purple-500/10" },
  { title: "Data Size", value: "45.2 MB", change: "+2.1 MB", trend: "up", icon: Database, color: "text-success", bgColor: "bg-orange-500/10" },
];

const modules = [
  { id: "sales", name: "Sales & Invoices", icon: ShoppingCart, records: 1234, size: "8.5 MB" },
  { id: "purchase", name: "Purchase Orders", icon: Package, records: 856, size: "6.2 MB" },
  { id: "inventory", name: "Inventory Items", icon: Database, records: 2341, size: "12.3 MB" },
  { id: "crm", name: "CRM & Leads", icon: UserCircle, records: 3421, size: "5.8 MB" },
  { id: "hr", name: "HR & Employees", icon: Users, records: 156, size: "2.1 MB" },
  { id: "projects", name: "Projects", icon: FolderKanban, records: 89, size: "3.4 MB" },
  { id: "parties", name: "Customers & Vendors", icon: Building2, records: 487, size: "4.2 MB" },
  { id: "accounting", name: "Accounting", icon: Calculator, records: 3874, size: "7.7 MB" },
];

const exportFormats = [
  { id: "csv", name: "CSV", icon: FileText, description: "Comma-separated values" },
  { id: "excel", name: "Excel", icon: FileSpreadsheet, description: "Microsoft Excel format" },
  { id: "json", name: "JSON", icon: FileJson, description: "JavaScript Object Notation" },
];

export default function DataManagement() {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleModuleToggle = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(m => m !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedModules.length === modules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(modules.map(m => m.id));
    }
  };

  const handleExport = () => {
    if (selectedModules.length === 0) {
      showError("Please select at least one module to export");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          // Create and download file
          const data = {
            exportDate: new Date().toISOString(),
            modules: selectedModules,
            format: selectedFormat,
            recordCount: selectedModules.reduce((acc, modId) => {
              const mod = modules.find(m => m.id === modId);
              return acc + (mod?.records || 0);
            }, 0)
          };

          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `erp-export-${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
          a.click();
          URL.revokeObjectURL(url);

          showSuccess(`Successfully exported ${selectedModules.length} module(s) in ${selectedFormat.toUpperCase()} format!`);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      showSuccess(`File "${file.name}" selected for import`);
    }
  };

  const handleImport = () => {
    if (!importFile) {
      showError("Please select a file to import");
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          showSuccess(`Successfully imported data from "${importFile.name}"!`);
          setImportFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleQuickExportAll = () => {
    setSelectedModules(modules.map(m => m.id));
    setTimeout(() => handleExport(), 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Export and import your business data
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-soft hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl xl:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className={`h-3 w-3 ${stat.color}`} />
                  ) : (
                    <ArrowDownRight className={`h-3 w-3 ${stat.color}`} />
                  )}
                  <span className={stat.color}>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Export Data */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle>Export Data</CardTitle>
              </div>
              <CardDescription>Download your data in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Export */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Quick Export All Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Export all modules at once with default settings
                    </p>
                    <Button onClick={handleQuickExportAll} className="bg-gradient-primary">
                      <Download className="mr-2 h-4 w-4" />
                      Export All Data
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Select Modules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Select Modules</Label>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedModules.length === modules.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      onClick={() => handleModuleToggle(module.id)}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedModules.includes(module.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selectedModules.includes(module.id) ? "bg-primary text-white" : "bg-muted"
                      }`}>
                        <module.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{module.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.records.toLocaleString()} records • {module.size}
                        </p>
                      </div>
                      {selectedModules.includes(module.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Select Format */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Export Format</Label>
                <div className="grid grid-cols-3 gap-3">
                  {exportFormats.map((format) => (
                    <div
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedFormat === format.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <format.icon className={`h-8 w-8 ${
                        selectedFormat === format.id ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <div className="text-center">
                        <p className="font-medium text-sm">{format.name}</p>
                        <p className="text-xs text-muted-foreground">{format.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting data...</span>
                    <span className="font-semibold">{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>
              )}

              {/* Export Button */}
              <Button
                onClick={handleExport}
                disabled={isExporting || selectedModules.length === 0}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected ({selectedModules.length})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Import Data */}
          <Card className="shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle>Import Data</CardTitle>
              </div>
              <CardDescription>Upload data from external files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warning */}
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-warning mb-1">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Importing data will merge with existing records. Make sure to backup your data before importing.
                    </p>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="import-file"
                    accept=".csv,.xlsx,.json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      CSV, Excel, or JSON files (max 50MB)
                    </p>
                  </label>
                </div>

                {importFile && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{importFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(importFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImportFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Import Options */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Import Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Skip Duplicates</p>
                      <p className="text-xs text-muted-foreground">Don't import duplicate records</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Update Existing</p>
                      <p className="text-xs text-muted-foreground">Update records if they exist</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Validate Data</p>
                      <p className="text-xs text-muted-foreground">Check data before importing</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Importing data...</span>
                    <span className="font-semibold">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}

              {/* Import Button */}
              <Button
                onClick={handleImport}
                disabled={isImporting || !importFile}
                className="w-full bg-gradient-primary"
                size="lg"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Recent Exports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "2024-01-13", modules: "All Modules", format: "CSV", size: "45.2 MB", status: "success" },
                { date: "2024-01-10", modules: "Sales, Inventory", format: "Excel", size: "20.8 MB", status: "success" },
                { date: "2024-01-08", modules: "CRM", format: "JSON", size: "5.8 MB", status: "success" },
              ].map((export_, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{export_.modules}</p>
                      <p className="text-xs text-muted-foreground">
                        {export_.date} • {export_.format} • {export_.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
