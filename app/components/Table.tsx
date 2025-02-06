import React, { ReactNode } from "react";

interface Props {
  columns: { key: string; label: string; className?: string }[];
  data: any[];
  renderRows: (item: any) => ReactNode;
}

const Table = ({ columns, data, renderRows }: Props) => {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((column) => (
            <th key={column.key} className={column.className}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{data?.map((data) => renderRows(data))}</tbody>
    </table>
  );
};

export default Table;
