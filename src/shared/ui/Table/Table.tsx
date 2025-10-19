import * as React from "react";

interface Column {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyText?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const {
    columns,
    data,
    loading = false,
    emptyText = "데이터가 없습니다.",
    className,
    ...rest
  } = props;

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-grey-200 bg-white dark:border-grey-700 dark:bg-bg-card-black">
        <div className="p-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-main-500 border-t-transparent"></div>
          <p className="mt-2 text-grey-500 dark:text-grey-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-grey-200 bg-white dark:border-grey-700 dark:bg-bg-card-black">
      <div className="overflow-x-auto">
        <table ref={ref} className={`w-full ${className || ""}`} {...rest}>
          <thead className="bg-grey-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-grey-700 uppercase dark:bg-grey-800 dark:text-grey-200"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-200 dark:divide-grey-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-grey-500 dark:text-grey-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={index}
                  className="hover:bg-grey-50 transition-colors dark:hover:bg-grey-800"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm whitespace-nowrap text-grey-900 dark:text-grey-100"
                    >
                      {column.render
                        ? column.render(record[column.key], record)
                        : record[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

Table.displayName = "Table";
export { Table, type TableProps, type Column };
