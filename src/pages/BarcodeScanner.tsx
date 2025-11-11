import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/lib/toast";
import { 
  Scan, 
  QrCode, 
  Camera, 
  Package, 
  Plus, 
  Minus,
  Check,
  X,
  Printer,
  Download,
  Search,
  Smartphone
} from "lucide-react";

const scannedItems = [
  { id: "1", barcode: "8901234567890", name: "Laptop Pro 15", sku: "LAP-001", stock: 45, location: "A-12", price: "Rs 125,000" },
  { id: "2", barcode: "8901234567891", name: "Monitor 27 inch", sku: "MON-002", stock: 23, location: "B-08", price: "Rs 45,000" },
  { id: "3", barcode: "8901234567892", name: "Wireless Keyboard", sku: "KEY-003", stock: 67, location: "C-15", price: "Rs 3,500" },
];

export default function BarcodeScanner() {
  const [scanMode, setScanMode] = useState<"single" | "bulk">("single");
  const [scannedData, setScannedData] = useState<typeof scannedItems>([]);
  const [manualBarcode, setManualBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate barcode scan
    setTimeout(() => {
      const randomItem = scannedItems[Math.floor(Math.random() * scannedItems.length)];
      setScannedData([...scannedData, randomItem]);
      setIsScanning(false);
      showSuccess(`Scanned: ${randomItem.name}`);
    }, 1500);
  };

  const handleManualEntry = () => {
    if (!manualBarcode) {
      showError("Please enter a barcode");
      return;
    }
    const item = scannedItems.find(i => i.barcode === manualBarcode);
    if (item) {
      setScannedData([...scannedData, item]);
      showSuccess(`Added: ${item.name}`);
      setManualBarcode("");
    } else {
      showError("Barcode not found in database");
    }
  };

  const handlePrintLabels = () => {
    if (selectedItems.length === 0) {
      showError("Please select items to print");
      return;
    }
    showSuccess(`Printing ${selectedItems.length} label(s)...`);
  };

  const handleExportData = () => {
    showSuccess("Exporting scanned data...");
  };

  const handleClearAll = () => {
    setScannedData([]);
    setSelectedItems([]);
    showSuccess("Cleared all scanned items");
  };

  const handleToggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === scannedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(scannedData.map(i => i.id));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Barcode Scanner</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Scan barcodes and QR codes for inventory management
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scanner Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Mode */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Scan Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={scanMode === "single" ? "default" : "outline"}
                    onClick={() => setScanMode("single")}
                    className="h-20"
                  >
                    <div className="text-center">
                      <Scan className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">Single Scan</p>
                    </div>
                  </Button>
                  <Button
                    variant={scanMode === "bulk" ? "default" : "outline"}
                    onClick={() => setScanMode("bulk")}
                    className="h-20"
                  >
                    <div className="text-center">
                      <QrCode className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm">Bulk Scan</p>
                    </div>
                  </Button>
                </div>

                {/* Camera Scanner */}
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20">
                  {isScanning ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <Camera className="h-16 w-16 mx-auto text-primary" />
                      </div>
                      <p className="font-medium">Scanning...</p>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium mb-1">Ready to Scan</p>
                        <p className="text-sm text-muted-foreground">
                          Click the button below to start scanning
                        </p>
                      </div>
                      <Button
                        onClick={handleStartScan}
                        className="bg-gradient-primary"
                        size="lg"
                      >
                        <Scan className="mr-2 h-5 w-5" />
                        Start Camera Scan
                      </Button>
                    </div>
                  )}
                </div>

                {/* Manual Entry */}
                <div className="space-y-3">
                  <Label>Manual Barcode Entry</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter barcode number"
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualEntry()}
                    />
                    <Button onClick={handleManualEntry}>
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>

                {/* Mobile Scanner Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">Mobile Scanner Available</p>
                      <p className="text-xs text-muted-foreground">
                        Use your phone camera for faster scanning. Download our mobile app or use the web version.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scanned Items */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scanned Items ({scannedData.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      {selectedItems.length === scannedData.length ? "Deselect All" : "Select All"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClearAll}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {scannedData.length > 0 ? (
                  <div className="space-y-2">
                    {scannedData.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                          selectedItems.includes(item.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                          className="h-4 w-4"
                        />
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                          <Package className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.sku} • {item.barcode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{item.price}</p>
                          <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                        </div>
                        <Badge variant="outline">{item.location}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items scanned yet</p>
                    <p className="text-sm">Start scanning to see items here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handlePrintLabels}
                  disabled={selectedItems.length === 0}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Labels ({selectedItems.length})
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleExportData}
                  disabled={scannedData.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button 
                  className="w-full justify-start bg-gradient-primary"
                  disabled={scannedData.length === 0}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Process Items
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Session Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Items Scanned</span>
                  <span className="font-semibold">{scannedData.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Selected</span>
                  <span className="font-semibold">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-semibold">Rs 173,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Scan Mode</span>
                  <Badge>{scanMode === "single" ? "Single" : "Bulk"}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Supported Formats */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>EAN-13 / UPC-A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>QR Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Code 128</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Code 39</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    <span>Data Matrix</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-soft border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Scanning Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-muted-foreground">
                <p>• Hold the barcode 6-8 inches from camera</p>
                <p>• Ensure good lighting conditions</p>
                <p>• Keep the barcode flat and steady</p>
                <p>• Use bulk mode for multiple items</p>
                <p>• Clean camera lens for better accuracy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
