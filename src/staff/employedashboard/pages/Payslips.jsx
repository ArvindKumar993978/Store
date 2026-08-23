import React from "react";
import { Filter, Download, CheckCircle2, ArrowRight, Search, FileText, Eye } from "../components/icons.jsx";

const HISTORY = [
  {
    period: "October 2023",
    datePaid: "Oct 25, 2023",
    gross: "$5,240.00",
    net: "$4,059.50",
    status: "Paid",
  },
  {
    period: "September 2023",
    datePaid: "Sep 25, 2023",
    gross: "$5,240.00",
    net: "$4,032.10",
    status: "Paid",
  },
  {
    period: "August 2023",
    datePaid: "Aug 25, 2023",
    gross: "$5,100.00",
    net: "$3,958.75",
    status: "Paid",
  },
];

function StatusPill({ status }) {
  const isPaid = status === "Paid";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-label-md ${
        isPaid ? "bg-tertiary/10 text-tertiary" : "bg-secondary/10 text-secondary"
      }`}
    >
      {status}
    </span>
  );
}

export default function Payslips() {
  return (
    <>
      <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
            Financial Records
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            View and download your payslips and compensation details.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-lowest transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filter Year
          </button>
          <button className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} />
            Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
        {/* Current Month Summary Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 card-shadow card-hover-shadow transition-all border border-transparent hover:border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-start mb-6 border-b border-outline-variant pb-4">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">October 2023 Summary</h3>
              <p className="text-body-md text-on-surface-variant mt-1">Pay Period: Oct 1 - Oct 31</p>
            </div>
            <div className="bg-tertiary/10 text-tertiary-container px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1">
              <CheckCircle2 size={14} />
              Processed
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div className="flex flex-col justify-center">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
                Gross Earnings
              </p>
              <p className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-tabular-nums">
                $5,240.00
              </p>
            </div>
            <div className="flex flex-col justify-center border-l-0 md:border-l border-outline-variant pl-0 md:pl-6">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
                Deductions &amp; Taxes
              </p>
              <p className="font-headline-md text-headline-md text-error font-tabular-nums">-$1,180.50</p>
            </div>
            <div className="flex flex-col justify-center border-l-0 md:border-l border-outline-variant pl-0 md:pl-6 bg-surface-container p-4 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
              <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
                Net Pay
              </p>
              <p className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-tabular-nums font-bold">
                $4,059.50
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant flex justify-end">
            <button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">
              View Detailed Breakdown
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Next Payout Card */}
        <div className="bg-primary text-on-primary rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-primary-container transition-colors">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
            <FileText size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="font-label-md text-label-md uppercase tracking-wider text-on-primary/80 mb-2">
              Next Payout Date
            </h3>
            <p className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-1">Nov 15, 2023</p>
            <p className="font-body-md text-body-md text-on-primary/70">12 days remaining</p>
          </div>
          <div className="mt-8 relative z-10 bg-black/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <p className="font-label-md text-label-md text-on-primary/80 mb-1">Estimated Net Amount</p>
            <p className="font-headline-md text-headline-md font-tabular-nums">~$4,059.50</p>
          </div>
        </div>
      </div>

      {/* Detailed Payslip History Table */}
      <div className="bg-surface-container-lowest rounded-xl card-shadow overflow-hidden border border-outline-variant/50">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md text-on-surface">Payslip History</h3>
          <div className="relative hidden sm:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              className="h-[40px] pl-10 pr-4 rounded-lg bg-surface-container-low border-none focus:ring-2 focus:ring-primary text-body-md w-64 placeholder:text-on-surface-variant"
              placeholder="Search records..."
              type="text"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-12"></th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Date Paid
                </th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Gross
                </th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Net Pay
                </th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md bg-surface-container-lowest">
              {HISTORY.map((row) => (
                <tr key={row.period} className="hover:bg-surface-container-low transition-colors">
                  <td className="pl-6">
                    <FileText size={18} className="text-outline-variant" />
                  </td>
                  <td className="font-semibold text-on-surface">{row.period}</td>
                  <td className="font-tabular-nums text-on-surface-variant">{row.datePaid}</td>
                  <td className="font-tabular-nums text-right text-on-surface">{row.gross}</td>
                  <td className="font-tabular-nums text-right font-semibold text-on-surface">{row.net}</td>
                  <td className="text-center">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="text-right">
                    <button className="text-secondary hover:text-primary transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
