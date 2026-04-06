export default function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-sm shadow-slate-950/20">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium uppercase tracking-[0.08em]">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-slate-950/60 even:bg-slate-900/80">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4 align-top text-slate-200">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
