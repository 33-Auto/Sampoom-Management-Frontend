import * as React from "react";

interface Column {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column[];
  data?: any[];
  dataPromise?: Promise<{ data: any[] }>;
  loading?: boolean;
  emptyText?: string;
}

// 현재 Table은 Promise 데이터를 지원한다.
// data와 dataPromise가 동시에 주어질 때, data가 우선시된다.
const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const {
    columns,
    data,
    dataPromise,
    loading = false,
    emptyText = "데이터가 없습니다.",
    className,
    ...rest
  } = props;

  // Promise 데이터 처리
  const [resolvedData, setResolvedData] = React.useState<any[]>([]);
  const [isPromiseLoading, setIsPromiseLoading] = React.useState(false);

  React.useEffect(() => {
    // data가 없고 dataPromise가 있을 때만 처리
    if (dataPromise && !data) {
      setIsPromiseLoading(true);
      dataPromise
        .then((result) => {
          setResolvedData(result.data || []);
        })
        .catch((error) => {
          console.error("Promise 데이터 로딩 실패:", error);
          setResolvedData([]);
        })
        .finally(() => {
          setIsPromiseLoading(false);
        });
    }
  }, [dataPromise, data]);

  const finalData = data || resolvedData;
  const isLoading = loading || isPromiseLoading;

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
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-grey-500 dark:text-white"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      data-testid="spinner"
                      className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-main-500 border-t-transparent"
                    ></div>
                  </div>
                </td>
              </tr>
            ) : finalData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-grey-500 dark:text-white"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              finalData.map((record, index) => (
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
