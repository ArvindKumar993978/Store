/**
 * Shared export helpers used across Admin / Staff pages so every
 * "Export PDF" / "Export CSV" / "Export Excel" button produces a
 * real downloadable/printable file with zero external dependencies.
 */

/**
 * Build and print/save a clean PDF report with a title, optional subtitle,
 * and a styled data table.
 */
export function exportRowsAsPDF({ title, subtitle, columns = [], rows = [], filename = "report" }) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || filename}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #191c1e; }
          h1 { color: #006194; margin: 0 0 6px 0; font-size: 22px; }
          p { color: #565e74; margin: 0 0 16px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          th { background-color: #006194; color: white; text-align: left; padding: 8px 12px; border: 1px solid #006194; }
          td { padding: 8px 12px; border: 1px solid #bfc7d2; }
          tr:nth-child(even) { background-color: #f7f9fb; }
          .footer { margin-top: 20px; font-size: 10px; color: #707881; text-align: right; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${title || "Report"}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
        <table>
          <thead>
            <tr>${columns.map((c) => `<th>${c}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleString()} • Efficient Ledger</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/** Escape a single CSV cell value. */
function csvCell(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Build and download a real CSV file (openable directly in Excel).
 */
export function exportRowsAsCSV(columns = [], rows = [], filename = "export") {
  const lines = [columns.map(csvCell).join(",")];
  rows.forEach((row) => lines.push(row.map(csvCell).join(",")));
  // Prefix with UTF-8 BOM so Excel opens Hindi, Rupee ₹, etc. correctly
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${filename}.csv`);
}

/** Trigger a browser download for an in-memory Blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Build and print/save a single record sheet (e.g. customer profile or invoice).
 */
export function exportRecordAsPDF({ title, subtitle, fields = [], filename = "record" }) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || filename}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #191c1e; }
          h1 { color: #006194; margin: 0 0 6px 0; font-size: 22px; }
          p { color: #565e74; margin: 0 0 16px 0; font-size: 13px; }
          .grid { display: grid; grid-template-columns: 140px 1fr; gap: 8px 16px; margin-top: 16px; font-size: 13px; }
          .label { font-weight: 600; color: #565e74; }
          .val { color: #191c1e; }
          .footer { margin-top: 30px; font-size: 10px; color: #707881; }
        </style>
      </head>
      <body>
        <h1>${title || "Record"}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
        <div class="grid">
          ${fields.map((f) => `<div class="label">${f.label}:</div><div class="val">${f.value}</div>`).join("")}
        </div>
        <div class="footer">Generated on ${new Date().toLocaleString()} • Efficient Ledger</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
