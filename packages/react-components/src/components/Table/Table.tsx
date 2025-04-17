import React, { useState, useMemo } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface TableColumn<T> {
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Header text for the column
   */
  header: React.ReactNode;
  
  /**
   * Function to render the cell content
   */
  cell: (row: T, index: number) => React.ReactNode;
  
  /**
   * Whether the column is sortable
   * @default false
   */
  sortable?: boolean;
  
  /**
   * Width of the column (CSS value)
   */
  width?: string;
  
  /**
   * Text alignment for the column
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  /**
   * Array of data to display in the table
   */
  data: T[];
  
  /**
   * Array of column definitions
   */
  columns: TableColumn<T>[];
  
  /**
   * Key function to generate unique keys for rows
   * @default (row, index) => index
   */
  getRowKey?: (row: T, index: number) => string | number;
  
  /**
   * Whether to show a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether to enable sorting
   * @default true
   */
  sortable?: boolean;
  
  /**
   * Default column to sort by
   */
  defaultSortColumn?: string;
  
  /**
   * Default sort direction
   * @default 'asc'
   */
  defaultSortDirection?: 'asc' | 'desc';
  
  /**
   * Whether to enable pagination
   * @default false
   */
  pagination?: boolean;
  
  /**
   * Number of rows per page
   * @default 10
   */
  rowsPerPage?: number;
  
  /**
   * Whether to show a border around the table
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Whether to show alternating row colors
   * @default true
   */
  striped?: boolean;
  
  /**
   * Whether to highlight rows on hover
   * @default true
   */
  hoverable?: boolean;
  
  /**
   * Whether to make the table take up the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Size of the table
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Function called when a row is clicked
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * Function called when sort changes
   */
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  
  /**
   * Function called when page changes
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Text to display when there is no data
   * @default 'No data'
   */
  emptyText?: React.ReactNode;
}

/**
 * Table component with sorting and pagination
 */
export function Table<T>({
  data,
  columns,
  getRowKey = (_, index) => index,
  loading = false,
  sortable = true,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  pagination = false,
  rowsPerPage = 10,
  bordered = false,
  striped = true,
  hoverable = true,
  fullWidth = true,
  size = 'md',
  className = '',
  onRowClick,
  onSort,
  onPageChange,
  emptyText = 'No data',
}: TableProps<T>) {
  const { resolvedTheme } = useFlexTheme();
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortable) {
      return data;
    }
    
    const column = columns.find(col => col.id === sortColumn);
    if (!column || !column.sortable) {
      return data;
    }
    
    return [...data].sort((a, b) => {
      const aValue = column.cell(a, 0);
      const bValue = column.cell(b, 0);
      
      // Handle different types of values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      // Convert to string for other types
      const aString = String(aValue);
      const bString = String(bValue);
      
      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, columns, sortColumn, sortDirection, sortable]);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) {
      return sortedData;
    }
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, pagination, currentPage, rowsPerPage]);
  
  // Total pages
  const totalPages = useMemo(() => {
    if (!pagination) {
      return 1;
    }
    
    return Math.ceil(data.length / rowsPerPage);
  }, [data.length, pagination, rowsPerPage]);
  
  // Handle sort
  const handleSort = (columnId: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column || !column.sortable) return;
    
    const newDirection = 
      columnId === sortColumn
        ? sortDirection === 'asc' ? 'desc' : 'asc'
        : 'asc';
    
    setSortColumn(columnId);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(columnId, newDirection);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Base classes
  const tableClasses = [
    'flex-table',
    `flex-table--${size}`,
    `flex-table--theme-${resolvedTheme}`,
    bordered ? 'flex-table--bordered' : '',
    striped ? 'flex-table--striped' : '',
    hoverable ? 'flex-table--hoverable' : '',
    fullWidth ? 'flex-table--full-width' : '',
    loading ? 'flex-table--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="flex-table-container">
      <table className={tableClasses}>
        <thead className={`flex-table-header flex-table-header--theme-${resolvedTheme}`}>
          <tr>
            {columns.map(column => (
              <th
                key={column.id}
                className={`flex-table-th flex-table-th--${column.align || 'left'} ${
                  column.sortable && sortable ? 'flex-table-th--sortable' : ''
                } ${
                  sortColumn === column.id ? `flex-table-th--sorted-${sortDirection}` : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && sortable && handleSort(column.id)}
              >
                <div className="flex-table-th-content">
                  {column.header}
                  
                  {column.sortable && sortable && (
                    <span className="flex-table-sort-icon">
                      {sortColumn === column.id ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className={`flex-table-body flex-table-body--theme-${resolvedTheme}`}>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className={`flex-table-row flex-table-row--theme-${resolvedTheme} ${
                  onRowClick ? 'flex-table-row--clickable' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {columns.map(column => (
                  <td
                    key={column.id}
                    className={`flex-table-td flex-table-td--${column.align || 'left'}`}
                  >
                    {column.cell(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`flex-table-empty flex-table-empty--theme-${resolvedTheme}`}
              >
                {loading ? (
                  <div className="flex-table-loading-indicator">
                    <div className="flex-table-spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  emptyText
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {pagination && totalPages > 1 && (
        <div className={`flex-table-pagination flex-table-pagination--theme-${resolvedTheme}`}>
          <button
            className="flex-table-pagination-button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          
          <button
            className="flex-table-pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lsaquo;
          </button>
          
          <span className="flex-table-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            className="flex-table-pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &rsaquo;
          </button>
          
          <button
            className="flex-table-pagination-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
