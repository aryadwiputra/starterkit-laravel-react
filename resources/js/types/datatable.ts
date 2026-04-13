import type { ReactNode } from 'react';

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type DataTableColumn<T> = {
    key: string;
    label: string;
    sortable?: boolean;
    visible?: boolean;
    render?: (item: T) => ReactNode;
};

export type DataTableFilter = {
    key: string;
    label: string;
    options: { label: string; value: string }[];
};

export type SortConfig = {
    sort_by: string;
    sort_direction: 'asc' | 'desc';
};

export type BulkAction = {
    key: string;
    label: string;
    icon?: ReactNode;
    variant?: 'default' | 'destructive';
    requireConfirm?: boolean;
    confirmMessage?: string;
};

export type RowAction<T> = {
    key: string;
    label: string;
    icon?: ReactNode;
    onClick: (item: T) => void;
    visible?: (item: T) => boolean;
    variant?: 'default' | 'destructive';
};

export type DataTableProps<T> = {
    tableId: string;
    data: PaginatedData<T>;
    columns: DataTableColumn<T>[];
    filters?: DataTableFilter[];
    bulkActions?: BulkAction[];
    rowActions?: RowAction<T>[];
    searchable?: boolean;
    exportable?: boolean;
    exportUrl?: string;
    filterValues?: Record<string, string>;
    sortConfig?: SortConfig;
    routePrefix?: string;
    onBulkAction?: (action: string, selectedIds: number[]) => void;
    getItemId?: (item: T) => number;
    savedColumnVisibility?: string[];
};
