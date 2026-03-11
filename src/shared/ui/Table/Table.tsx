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
  errorText?: string;
  selectable?: boolean;
  rowKey?: string;
  selectedRowKeys?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
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
    errorText = "",
    selectable = false,
    rowKey = "id",
    selectedRowKeys = [],
    onSelectionChange,
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

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allKeys = finalData.map((record) => record[rowKey]);
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedRowKeys, key]);
    } else {
      onSelectionChange(
        selectedRowKeys.filter((k) => String(k) !== String(key)),
      );
    }
  };

  const isAllSelected =
    finalData.length > 0 &&
    finalData.every((record) =>
      selectedRowKeys.some(
        (selectedKey) => String(selectedKey) === String(record[rowKey]),
      ),
    );

  const someSelected =
    finalData.length > 0 &&
    finalData.some((record) =>
      selectedRowKeys.some(
        (selectedKey) => String(selectedKey) === String(record[rowKey]),
      ),
    );

  const isIndeterminate = someSelected && !isAllSelected;

  return (
    <div className="overflow-hidden rounded-lg border border-grey-200 bg-white dark:border-gray-700 dark:bg-bg-card-black">
      <div className="overflow-x-auto">
        <table ref={ref} className={`w-full ${className || ""}`} {...rest}>
          <thead className="bg-grey-50">
            <tr>
              {selectable && (
                <th className="w-10 px-6 py-3 text-left dark:bg-grey-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-grey-300 text-main-600 focus:ring-main-500"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-grey-700 uppercase dark:bg-grey-800 dark:text-grey-200"
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
                  colSpan={columns.length + (selectable ? 1 : 0)}
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
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-8 text-center text-grey-500 dark:text-white"
                >
                  {errorText.length > 0 ? errorText : emptyText}
                </td>
              </tr>
            ) : (
              finalData.map((record, index) => {
                const key = record[rowKey];
                const isSelected = selectedRowKeys.some(
                  (selectedKey) => String(selectedKey) === String(key),
                );

                return (
                  <tr
                    key={key ?? index}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-main-50 dark:bg-main-900/20"
                        : "hover:bg-grey-50 dark:hover:bg-grey-800"
                    }`}
                    onClick={() => {
                      if (selectable) handleSelectRow(key, !isSelected);
                    }}
                  >
                    {selectable && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-grey-300 text-main-600 focus:ring-main-500"
                          checked={!!isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(key, e.target.checked);
                          }}
                        />
                      </td>
                    )}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

Table.displayName = "Table";
export { Table, type TableProps, type Column };
