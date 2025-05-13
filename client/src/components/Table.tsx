const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <table className="w-full mt-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      <thead>
        <tr className="text-left text-gray-500 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-800">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr
            key={item.id || idx}
            className={
              idx % 2 === 0
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-50 dark:bg-gray-800"
            }
          >
            {renderRow(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
