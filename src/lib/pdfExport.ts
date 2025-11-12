// PDF Export Utility Functions for ERP System

interface ExportColumn {
  header: string;
  key: string;
  format?: (value: unknown) => string;
}

interface ExportOptions {
  title: string;
  columns: ExportColumn[];
  data: unknown[];
  filename?: string;
  showDate?: boolean;
  companyName?: string;
}

export const exportToPDF = (options: ExportOptions) => {
  const {
    title,
    columns,
    data,
    filename = 'report',
    showDate = true,
    companyName = 'ErpMax Pakistan'
  } = options;

  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) {
    return { success: false, message: 'Please allow pop-ups to export PDF' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; text-align: center; margin-bottom: 10px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .company-name { color: #666; font-size: 16px; margin-top: 5px; }
        .date { color: #666; font-size: 14px; margin-top: 10px; }
        .info { color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f3f4f6; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold; font-size: 13px; }
        td { padding: 10px; border: 1px solid #ddd; font-size: 12px; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .status-paid, .status-received, .status-completed, .status-active { color: #16a34a; font-weight: bold; }
        .status-pending, .status-in-progress { color: #eab308; font-weight: bold; }
        .status-overdue, .status-cancelled { color: #dc2626; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print {
          body { padding: 10px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p class="company-name">${companyName}</p>
        ${showDate ? `<p class="date">Generated on: ${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
        <p class="info">Total Records: ${data.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => {
                const value = row[col.key];
                const formattedValue = col.format ? col.format(value) : value;
                const statusClass = col.key === 'status' ? `status-${value}` : '';
                return `<td class="${statusClass}">${formattedValue || '-'}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>${companyName} - Enterprise Resource Planning System</p>
        <p>This is a computer-generated report</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);

  return { success: true, message: 'PDF export initiated' };
};

export const exportSingleRecordPDF = (options: {
  title: string;
  recordId: string;
  fields: { label: string; value: string; highlight?: boolean }[];
  companyName?: string;
}) => {
  const { title, recordId, fields, companyName = 'ErpMax Pakistan' } = options;

  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) {
    return { success: false, message: 'Please allow pop-ups to export PDF' };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - ${recordId}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
        .title { font-size: 36px; color: #333; margin: 0; }
        .company-name { color: #666; margin-top: 10px; font-size: 16px; }
        .record-id { font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center; }
        .details { margin: 30px 0; }
        .field { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #e5e7eb; }
        .field:nth-child(even) { background-color: #f9fafb; }
        .field-label { color: #666; font-size: 14px; font-weight: 600; text-transform: uppercase; }
        .field-value { font-size: 16px; font-weight: bold; }
        .highlight-box { background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; border: 2px solid #e5e7eb; }
        .highlight-label { color: #666; font-size: 14px; }
        .highlight-value { font-size: 32px; font-weight: bold; color: #333; margin-top: 10px; }
        .footer { margin-top: 60px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${title}</h1>
        <p class="company-name">${companyName}</p>
      </div>
      <div class="record-id">${recordId}</div>
      <div class="details">
        ${fields.map(field => 
          field.highlight 
            ? `<div class="highlight-box">
                <div class="highlight-label">${field.label}</div>
                <div class="highlight-value">${field.value}</div>
              </div>`
            : `<div class="field">
                <span class="field-label">${field.label}</span>
                <span class="field-value">${field.value}</span>
              </div>`
        ).join('')}
      </div>
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>${companyName} - Enterprise Resource Planning System</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-PK')}</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
  }, 250);

  return { success: true, message: 'PDF export initiated' };
};

export const exportToExcel = (options: {
  columns: ExportColumn[];
  data: unknown[];
  filename?: string;
}) => {
  const { columns, data, filename = 'export' } = options;

  // Create CSV content
  const headers = columns.map(col => col.header);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        const formattedValue = col.format ? col.format(value) : value;
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(formattedValue || '');
        return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, message: 'Excel export successful' };
};
