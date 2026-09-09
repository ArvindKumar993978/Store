import React from "react";

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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
        isPaid ? "bg-[#86f2e4] text-[#006f66]" : "bg-[#d7dff9] text-[#5a6278]"
      }`}
    >
      {status}
    </span>
  );
}

export default function Payslips() {
  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#191c1e] mb-1">
            Financial Records
          </h1>
          <p className="text-[14px] text-[#40474f]">
            View and download your payslips and compensation details.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[#bfc7d2] rounded-lg text-[12px] font-medium text-[#191c1e] hover:bg-[#eff4ff] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter Year
          </button>
          <button className="px-4 py-2 bg-[#006194] text-white rounded-lg text-[12px] font-medium hover:bg-[#004870] active:scale-95 transition-all flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Month Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2] flex flex-col">
          <div className="flex justify-between items-start mb-6 border-b border-[#bfc7d2] pb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[#191c1e]">October 2023 Summary</h3>
              <p className="text-[14px] text-[#40474f] mt-1">Pay Period: Oct 1 - Oct 31</p>
            </div>
            <div className="bg-[#86f2e4] text-[#006f66] px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Processed
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            <div className="flex flex-col justify-center">
              <p className="text-[12px] text-[#40474f] uppercase tracking-wider mb-2">
                Gross Earnings
              </p>
              <p className="text-[28px] text-[#191c1e] font-bold tabular-nums">
                $5,240.00
              </p>
            </div>
            <div className="flex flex-col justify-center border-l-0 md:border-l border-[#bfc7d2] pl-0 md:pl-6">
              <p className="text-[12px] text-[#40474f] uppercase tracking-wider mb-2">
                Deductions &amp; Taxes
              </p>
              <p className="text-[20px] text-[#ba1a1a] font-semibold tabular-nums">-$1,180.50</p>
            </div>
            <div className="flex flex-col justify-center border-l-0 md:border-l border-[#bfc7d2] pl-0 md:pl-6 bg-[#eff4ff] p-4 rounded-lg md:bg-transparent md:p-0 md:rounded-none">
              <p className="text-[12px] text-[#40474f] uppercase tracking-wider mb-2">
                Net Pay
              </p>
              <p className="text-[28px] text-[#006194] tabular-nums font-bold">
                $4,059.50
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#bfc7d2] flex justify-end">
            <button className="text-[#006194] text-[12px] font-medium hover:underline flex items-center gap-1">
              View Detailed Breakdown
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Next Payout Card */}
        <div className="bg-[#006194] text-white rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:bg-[#004870] transition-colors">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <span className="material-symbols-outlined absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 text-[120px]">
            description
          </span>
          <div className="relative z-10">
            <h3 className="text-[12px] uppercase tracking-wider text-white/80 mb-2">
              Next Payout Date
            </h3>
            <p className="text-[28px] mb-1">Nov 15, 2023</p>
            <p className="text-[14px] text-white/70">12 days remaining</p>
          </div>
          <div className="mt-8 relative z-10 bg-black/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
            <p className="text-[12px] text-white/80 mb-1">Estimated Net Amount</p>
            <p className="text-[20px] tabular-nums font-semibold">~$4,059.50</p>
          </div>
        </div>
      </div>

      {/* Detailed Payslip History Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bfc7d2]">
        <div className="p-6 border-b border-[#bfc7d2] flex justify-between items-center">
          <h3 className="text-[16px] font-semibold text-[#191c1e]">Payslip History</h3>
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-[#40474f]">
              search
            </span>
            <input
              className="h-[40px] pl-10 pr-4 rounded-lg bg-[#eff4ff] border-none focus:ring-2 focus:ring-[#006194] text-[14px] w-64 placeholder:text-[#40474f]"
              placeholder="Search records..."
              type="text"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#eff4ff] border-b border-[#bfc7d2]">
              <tr>
                <th className="text-[12px] text-[#40474f] uppercase tracking-wider w-12"></th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">
                  Pay Period
                </th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider">
                  Date Paid
                </th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider text-right">
                  Gross
                </th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider text-right">
                  Net Pay
                </th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="p-4 text-[12px] text-[#40474f] uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px] bg-white">
              {HISTORY.map((row) => (
                <tr key={row.period} className="hover:bg-[#eff4ff] transition-colors border-b border-[#bfc7d2] last:border-b-0">
                  <td className="pl-6 py-3">
                    <span className="material-symbols-outlined text-[18px] text-[#bfc7d2]">description</span>
                  </td>
                  <td className="py-3 font-semibold text-[#191c1e]">{row.period}</td>
                  <td className="py-3 tabular-nums text-[#40474f]">{row.datePaid}</td>
                  <td className="py-3 tabular-nums text-right text-[#191c1e]">{row.gross}</td>
                  <td className="py-3 tabular-nums text-right font-semibold text-[#191c1e]">{row.net}</td>
                  <td className="py-3 text-center">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="py-3 text-right pr-6">
                    <button className="text-[#5a6278] hover:text-[#006194] transition-colors">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
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
