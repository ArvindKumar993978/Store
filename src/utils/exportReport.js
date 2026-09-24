import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Shared export helpers used across Admin / Staff pages so every
 * "Export PDF" / "Export CSV" / "Export Excel" button produces a
 * real downloadable file instead of just showing a fake spinner.
 */

/**
 * Build and download a real PDF with a title, optional subtitle,
 * and a data table.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Big heading at the top of the PDF
 * @param {string} [opts.subtitle]  - Smaller line under the title (e.g. date range)
 * @param {string[]} opts.columns   - Column headers, in order
 * @param {Array<Array<string|number>>} opts.rows - Table rows (same order as columns)
 * @param {string} opts.filename    - File name, without extension
 */
export function exportRowsAsPDF({ title, subtitle, columns, rows, filename }) {
  const doc = new jsPDF({ orientation: columns.length > 5 ? "landscape" : "portrait" });

  doc.setFontSize(18);
  doc.setTextColor(0, 97, 148); // #006194
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(63, 72, 80); // #3f4850
    doc.text(subtitle, 14, 25);
  }

  autoTable(doc, {
    startY: subtitle ? 30 : 24,
    head: [columns],
    body: rows,
    headStyles: { fillColor: [0, 97, 148], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [239, 244, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Generated ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  doc.save(`${filename}.pdf`);
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
 *
 * @param {string[]} columns
 * @param {Array<Array<string|number>>} rows
 * @param {string} filename - without extension
 */
export function exportRowsAsCSV(columns, rows, filename) {
  const lines = [columns.map(csvCell).join(",")];
  rows.forEach((row) => lines.push(row.map(csvCell).join(",")));
  // Prefix with a BOM so Excel opens UTF-8 (₹, etc.) correctly.
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
 * Build and download a simple "record sheet" style PDF for a single
 * entity (e.g. one customer's profile) instead of a table — a title,
 * then label/value pairs.
 *
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} [opts.subtitle]
 * @param {Array<{label: string, value: string}>} opts.fields
 * @param {string} opts.filename
 */
export function exportRecordAsPDF({ title, subtitle, fields, filename }) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(0, 97, 148);
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(63, 72, 80);
    doc.text(subtitle, 14, 25);
  }

  autoTable(doc, {
    startY: subtitle ? 32 : 26,
    body: fields.map((f) => [f.label, f.value]),
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [63, 72, 80], cellWidth: 55 },
      1: { textColor: [11, 28, 48] },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}
