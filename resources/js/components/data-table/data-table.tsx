import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, Download, FilterX, MoreHorizontal, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDataTable } from '@/hooks/use-datatable';
import type { BulkAction, DataTableColumn, DataTableProps, PaginatedData, RowAction } from '@/types/datatable';

export function DataTable<T extends { id: number }>({
    tableId,
    data,
    columns,
    filters = [],
    bulkActions = [],
    rowActions = [],
    searchable = true,
    exportable = false,
    exportUrl,
    routePrefix = '',
    onBulkAction,
    savedColumnVisibility,
}: DataTableProps<T>) {
    const {
        search,
        setSearch,
        sortConfig,
        setSort,
        filters: activeFilters,
        setFilter,
        clearFilters,
        perPage,
        setPerPage,
        goToPage,
        selectedIds,
        toggleSelectAll,
        toggleSelect,
        clearSelection,
        columnVisibility,
        toggleColumnVisibility,
        visibleColumns,
    } = useDataTable({
        tableId,
        routePrefix,
        columns: columns as DataTableColumn<unknown>[],
        savedColumnVisibility,
    });

    const [confirmAction, setConfirmAction] = useState<{ action: BulkAction; ids: number[] } | null>(null);

    const hasActiveFilters = Object.values(activeFilters).some((v) => v !== '');
    const allSelected = data.data.length > 0 && selectedIds.length === data.data.length;
    const someSelected = selectedIds.length > 0 && selectedIds.length < data.data.length;

    function handleBulkAction(action: BulkAction) {
        if (selectedIds.length === 0) {
            return;
        }

        if (action.requireConfirm) {
            setConfirmAction({ action, ids: selectedIds });
        } else {
            onBulkAction?.(action.key, selectedIds);
            clearSelection();
        }
    }

    function confirmBulkAction() {
        if (!confirmAction) {
            return;
        }

        onBulkAction?.(confirmAction.action.key, confirmAction.ids);
        setConfirmAction(null);
        clearSelection();
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    {searchable && (
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="datatable-search"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {filters.map((filter) => (
                        <Select
                            key={filter.key}
                            value={activeFilters[filter.key] || 'all'}
                            onValueChange={(value) => setFilter(filter.key, value === 'all' ? '' : value)}
                        >
                            <SelectTrigger id={`filter-${filter.key}`} className="w-[140px]">
                                <SelectValue placeholder={filter.label} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All {filter.label}</SelectItem>
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}

                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <FilterX className="mr-1 h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Columns3 className="mr-1 h-4 w-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            {columns.map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.key}
                                    checked={columnVisibility[column.key] !== false}
                                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                                >
                                    {column.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {exportable && exportUrl && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-1 h-4 w-4" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <a href={`${exportUrl}?format=csv&${new URLSearchParams(window.location.search).toString()}`}>CSV</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`${exportUrl}?format=excel&${new URLSearchParams(window.location.search).toString()}`}>Excel</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href={`${exportUrl}?format=pdf&${new URLSearchParams(window.location.search).toString()}`}>PDF</a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && bulkActions.length > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
                    <span className="text-sm font-medium">{selectedIds.length} selected</span>
                    <div className="flex items-center gap-2">
                        {bulkActions.map((action) => (
                            <Button
                                key={action.key}
                                variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => handleBulkAction(action)}
                            >
                                {action.icon}
                                {action.label}
                            </Button>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={clearSelection}>
                        Clear selection
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                {bulkActions.length > 0 && (
                                    <th className="w-[40px] px-4 py-3">
                                        <Checkbox
                                            checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                                            onCheckedChange={() => toggleSelectAll(data.data)}
                                        />
                                    </th>
                                )}
                                {visibleColumns.map((column) => (
                                    <th key={column.key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        {column.sortable !== false ? (
                                            <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort(column.key)}>
                                                {column.label}
                                                {sortConfig.sort_by === column.key ? (
                                                    sortConfig.sort_direction === 'asc' ? (
                                                        <ArrowUp className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowDown className="h-4 w-4" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                                                )}
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                ))}
                                {rowActions.length > 0 && <th className="w-[60px] px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length + (bulkActions.length > 0 ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            ) : (
                                data.data.map((item) => (
                                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/30">
                                        {bulkActions.length > 0 && (
                                            <td className="px-4 py-3">
                                                <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} />
                                            </td>
                                        )}
                                        {visibleColumns.map((column) => (
                                            <td key={column.key} className="px-4 py-3">
                                                {column.render
                                                    ? column.render(item)
                                                    : String((item as Record<string, unknown>)[column.key] ?? '')}
                                            </td>
                                        ))}
                                        {rowActions.length > 0 && (
                                            <td className="px-4 py-3 text-right">
                                                <RowActionsDropdown item={item} actions={rowActions} />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <DataTablePagination data={data} perPage={perPage} setPerPage={setPerPage} goToPage={goToPage} />

            {/* Confirm Dialog */}
            <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Action</DialogTitle>
                        <DialogDescription>
                            {confirmAction?.action.confirmMessage ||
                                `Are you sure you want to ${confirmAction?.action.label.toLowerCase()} ${confirmAction?.ids.length} items?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant={confirmAction?.action.variant === 'destructive' ? 'destructive' : 'default'} onClick={confirmBulkAction}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function RowActionsDropdown<T>({ item, actions }: { item: T; actions: RowAction<T>[] }) {
    const visibleActions = actions.filter((action) => !action.visible || action.visible(item));

    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {visibleActions.map((action, index) => (
                    <span key={action.key}>
                        {action.variant === 'destructive' && index > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            onClick={() => action.onClick(item)}
                            className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
                        >
                            {action.icon}
                            {action.label}
                        </DropdownMenuItem>
                    </span>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function DataTablePagination<T>({
    data,
    perPage,
    setPerPage,
    goToPage,
}: {
    data: PaginatedData<T>;
    perPage: number;
    setPerPage: (value: number) => void;
    goToPage: (page: number) => void;
}) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">
                {data.from && data.to ? (
                    <>
                        Showing {data.from} to {data.to} of {data.total} results
                    </>
                ) : (
                    'No results'
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page</span>
                    <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
                        <SelectTrigger id="rows-per-page" className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 100].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" disabled={data.current_page === 1} onClick={() => goToPage(1)}>
                        First
                    </Button>
                    <Button variant="outline" size="sm" disabled={data.current_page === 1} onClick={() => goToPage(data.current_page - 1)}>
                        Prev
                    </Button>

                    {generatePageNumbers(data.current_page, data.last_page).map((page, index) =>
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                …
                            </span>
                        ) : (
                            <Button
                                key={page}
                                variant={data.current_page === page ? 'default' : 'outline'}
                                size="sm"
                                className="w-9"
                                onClick={() => goToPage(page as number)}
                            >
                                {page}
                            </Button>
                        ),
                    )}

                    <Button variant="outline" size="sm" disabled={data.current_page === data.last_page} onClick={() => goToPage(data.current_page + 1)}>
                        Next
                    </Button>
                    <Button variant="outline" size="sm" disabled={data.current_page === data.last_page} onClick={() => goToPage(data.last_page)}>
                        Last
                    </Button>
                </div>
            </div>
        </div>
    );
}

function generatePageNumbers(current: number, last: number): (number | string)[] {
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', last);
    } else if (current >= last - 2) {
        pages.push(1, '...', last - 3, last - 2, last - 1, last);
    } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', last);
    }

    return pages;
}
