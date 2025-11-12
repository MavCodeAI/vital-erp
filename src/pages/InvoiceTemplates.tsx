import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/lib/toast";
import { Plus, FileText, Eye, Edit, Copy, Trash2, Check, Palette, Layout } from "lucide-react";

const templates = [
  {
    id: "1",
    name: "Modern Professional",
    description: "Clean and modern design with blue accents",
    preview: "/templates/modern.png",
    color: "#3B82F6",
    layout: "standard",
    isDefault: true,
    fields: ["logo", "company", "invoice_no", "date", "items", "subtotal", "tax", "total", "terms"]
  },
  {
    id: "2",
    name: "Classic Business",
    description: "Traditional layout with professional styling",
    preview: "/templates/classic.png",
    color: "#1F2937",
    layout: "classic",
    isDefault: false,
    fields: ["logo", "company", "invoice_no", "date", "items", "subtotal", "tax", "total"]
  },
  {
    id: "3",
    name: "Minimalist",
    description: "Simple and elegant design",
    preview: "/templates/minimal.png",
    color: "#10B981",
    layout: "minimal",
    isDefault: false,
    fields: ["company", "invoice_no", "date", "items", "total"]
  },
  {
    id: "4",
    name: "Corporate Elite",
    description: "Premium design for corporate clients",
    preview: "/templates/corporate.png",
    color: "#8B5CF6",
    layout: "corporate",
    isDefault: false,
    fields: ["logo", "company", "invoice_no", "date", "due_date", "items", "subtotal", "tax", "discount", "total", "terms", "signature"]
  },
  {
    id: "5",
    name: "Creative Studio",
    description: "Bold and creative layout",
    preview: "/templates/creative.png",
    color: "#F59E0B",
    layout: "creative",
    isDefault: false,
    fields: ["logo", "company", "invoice_no", "date", "items", "subtotal", "total", "notes"]
  },
  {
    id: "6",
    name: "Tech Startup",
    description: "Modern tech-focused design",
    preview: "/templates/tech.png",
    color: "#06B6D4",
    layout: "tech",
    isDefault: false,
    fields: ["logo", "company", "invoice_no", "date", "items", "subtotal", "tax", "total", "payment_methods"]
  },
];

const customFields = [
  { id: "logo", name: "Company Logo", type: "image" },
  { id: "company", name: "Company Details", type: "text" },
  { id: "invoice_no", name: "Invoice Number", type: "text" },
  { id: "date", name: "Invoice Date", type: "date" },
  { id: "due_date", name: "Due Date", type: "date" },
  { id: "items", name: "Line Items", type: "table" },
  { id: "subtotal", name: "Subtotal", type: "number" },
  { id: "tax", name: "Tax/GST", type: "number" },
  { id: "discount", name: "Discount", type: "number" },
  { id: "total", name: "Total Amount", type: "number" },
  { id: "terms", name: "Terms & Conditions", type: "textarea" },
  { id: "notes", name: "Notes", type: "textarea" },
  { id: "signature", name: "Signature", type: "image" },
  { id: "payment_methods", name: "Payment Methods", type: "text" },
];

export default function InvoiceTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customColor, setCustomColor] = useState("#3B82F6");
  const [selectedFields, setSelectedFields] = useState<string[]>(templates[0].fields);

  const handleSetDefault = (templateId: string) => {
    showSuccess("Default template updated!");
  };

  const handleDuplicate = (template: typeof templates[0]) => {
    showSuccess(`Template "${template.name}" duplicated!`);
  };

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      showSuccess("Template deleted!");
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(f => f !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const handleSaveCustomization = () => {
    showSuccess("Template customization saved!");
    setIsCustomizing(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Invoice Templates</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Customize your invoice designs and branding
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input placeholder="My Custom Template" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Template description" />
                </div>
                <div className="space-y-2">
                  <Label>Brand Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-20 h-10" />
                    <Input value={customColor} onChange={(e) => setCustomColor(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Layout Style</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="standard">Standard</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
                <Button className="w-full bg-gradient-primary">Create Template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="shadow-soft hover:shadow-elevated transition-all overflow-hidden">
              <div className="relative">
                {/* Template Preview */}
                <div 
                  className="h-48 flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: template.color }}
                >
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">{template.layout.toUpperCase()}</p>
                  </div>
                </div>
                {template.isDefault && (
                  <Badge className="absolute top-2 right-2 bg-success">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {template.fields.slice(0, 4).map((field) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      {field.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                  {template.fields.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.fields.length - 4} more
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name} - Preview</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="border rounded-lg p-8" style={{ borderColor: template.color }}>
                          <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-start pb-4 border-b" style={{ borderColor: template.color }}>
                              <div>
                                <div className="w-32 h-16 bg-muted rounded flex items-center justify-center text-xs">
                                  Company Logo
                                </div>
                                <div className="mt-4 space-y-1 text-sm">
                                  <p className="font-bold">ErpMax Pakistan</p>
                                  <p className="text-muted-foreground">Plot 123, Block A</p>
                                  <p className="text-muted-foreground">Karachi, Pakistan</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <h2 className="text-3xl font-bold" style={{ color: template.color }}>INVOICE</h2>
                                <p className="text-sm mt-2">INV-001</p>
                                <p className="text-sm text-muted-foreground">Date: Jan 15, 2024</p>
                              </div>
                            </div>

                            {/* Bill To */}
                            <div>
                              <p className="font-semibold mb-2">Bill To:</p>
                              <div className="text-sm space-y-1">
                                <p>Karachi Corporation</p>
                                <p className="text-muted-foreground">123 Business St</p>
                                <p className="text-muted-foreground">Karachi, Pakistan</p>
                              </div>
                            </div>

                            {/* Items Table */}
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b" style={{ borderColor: template.color }}>
                                  <th className="text-left py-2">Item</th>
                                  <th className="text-right py-2">Qty</th>
                                  <th className="text-right py-2">Price</th>
                                  <th className="text-right py-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="py-2">Product Name</td>
                                  <td className="text-right">2</td>
                                  <td className="text-right">Rs 50,000</td>
                                  <td className="text-right">Rs 100,000</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="py-2">Service Name</td>
                                  <td className="text-right">1</td>
                                  <td className="text-right">Rs 25,000</td>
                                  <td className="text-right">Rs 25,000</td>
                                </tr>
                              </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                              <div className="w-64 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>Rs 125,000</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax (18%):</span>
                                  <span>Rs 22,500</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: template.color, color: template.color }}>
                                  <span>Total:</span>
                                  <span>Rs 147,500</span>
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            {template.fields.includes('terms') && (
                              <div className="pt-4 border-t text-xs text-muted-foreground">
                                <p className="font-semibold mb-1">Terms & Conditions:</p>
                                <p>Payment due within 30 days. Late payments subject to 2% monthly interest.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setSelectedFields(template.fields);
                      setCustomColor(template.color);
                      setIsCustomizing(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(template)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  {!template.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                {!template.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSetDefault(template.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customization Dialog */}
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customize Template: {selectedTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Color Picker */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">Brand Color</Label>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={customColor} 
                    onChange={(e) => setCustomColor(e.target.value)} 
                    className="w-20 h-10" 
                  />
                  <Input 
                    value={customColor} 
                    onChange={(e) => setCustomColor(e.target.value)} 
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              {/* Fields Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  <Label className="text-base font-semibold">Template Fields</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {customFields.map((field) => (
                    <div
                      key={field.id}
                      onClick={() => handleFieldToggle(field.id)}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedFields.includes(field.id)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm">{field.name}</p>
                        <p className="text-xs text-muted-foreground">{field.type}</p>
                      </div>
                      {selectedFields.includes(field.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCustomizing(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveCustomization} className="flex-1 bg-gradient-primary">
                  Save Customization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
