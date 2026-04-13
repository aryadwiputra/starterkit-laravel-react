import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { store as storeColumnPreferences } from '@/routes/column-preferences';
import type { DataTableColumn, SortConfig } from '@/types/datatable';

type UseDataTableOptions = {
    tableId: string;
    routePrefix: string;
    defaultSort?: SortConfig;
    defaultPerPage?: number;
    savedColumnVisibility?: string[];
    columns: DataTableColumn<unknown>[];
};

export function useDataTable({
    tableId,
    routePrefix,
    defaultSort = { sort_by: 'created_at', sort_direction: 'desc' },
    defaultPerPage = 10,
    savedColumnVisibility,
    columns,
}: UseDataTableOptions) {
    const params = new URLSearchParams(window.location.search);

    const [search, setSearchValue] = useState(params.get('search') || '');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        sort_by: params.get('sort_by') || defaultSort.sort_by,
        sort_direction: (params.get('sort_direction') as 'asc' | 'desc') || defaultSort.sort_direction,
    });
    const [perPage, setPerPageValue] = useState(Number(params.get('per_page')) || defaultPerPage);

    const [filters, setFiltersValue] = useState<Record<string, string>>(() => {
        const f: Record<string, string> = {};

        params.forEach((value, key) => {
            if (key.startsWith('filters[') && key.endsWith(']')) {
                const filterKey = key.slice(8, -1);

                f[filterKey] = value;
            }
        });

        return f;
    });

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        const vis: Record<string, boolean> = {};

        columns.forEach((col) => {
            if (savedColumnVisibility) {
                vis[col.key] = savedColumnVisibility.includes(col.key);
            } else {
                vis[col.key] = col.visible !== false;
            }
        });

        return vis;
    });

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const visibleColumns = columns.filter((col) => columnVisibility[col.key] !== false);

    function buildQueryParams(overrides: Record<string, unknown> = {}) {
        const result: Record<string, unknown> = {
            search: search || undefined,
            sort_by: sortConfig.sort_by,
            sort_direction: sortConfig.sort_direction,
            per_page: perPage,
            ...overrides,
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                result[`filters[${key}]`] = value;
            }
        });

        const filterOverrides = (overrides as Record<string, unknown>).filters as Record<string, string> | undefined;

        if (filterOverrides) {
            Object.keys(filters).forEach((key) => {
                delete result[`filters[${key}]`];
            });

            Object.entries(filterOverrides).forEach(([key, value]) => {
                if (value) {
                    result[`filters[${key}]`] = value;
                }
            });

            delete result.filters;
        }

        Object.keys(result).forEach((key) => {
            if (result[key] === undefined || result[key] === '') {
                delete result[key];
            }
        });

        return result;
    }

    function reload(overrides: Record<string, unknown> = {}) {
        const queryParams = buildQueryParams(overrides);

        router.get(routePrefix, queryParams as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function setSearch(value: string) {
        setSearchValue(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            reload({ search: value || undefined, page: 1 });
        }, 300);
    }

    function setSort(column: string) {
        const newDirection = sortConfig.sort_by === column && sortConfig.sort_direction === 'asc' ? 'desc' : 'asc';
        const newSort = { sort_by: column, sort_direction: newDirection as 'asc' | 'desc' };

        setSortConfig(newSort);
        reload({ ...newSort });
    }

    function setFilter(key: string, value: string) {
        const newFilters = { ...filters, [key]: value };

        if (!value) {
            delete newFilters[key];
        }

        setFiltersValue(newFilters);
        reload({ filters: newFilters, page: 1 });
    }

    function clearFilters() {
        setFiltersValue({});
        setSearchValue('');
        reload({ search: undefined, filters: {}, page: 1 });
    }

    function setPerPage(value: number) {
        setPerPageValue(value);
        reload({ per_page: value, page: 1 });
    }

    function goToPage(page: number) {
        reload({ page });
    }

    function toggleColumnVisibility(columnKey: string) {
        const newVisibility = { ...columnVisibility, [columnKey]: !columnVisibility[columnKey] };

        setColumnVisibility(newVisibility);

        const visibleCols = Object.entries(newVisibility)
            .filter(([, visible]) => visible)
            .map(([key]) => key);

        // Persist via fetch (non-Inertia request)
        fetch(storeColumnPreferences().url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({ table_id: tableId, visible_columns: visibleCols }),
        });
    }

    function toggleSelectAll(items: { id: number }[]) {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((item) => item.id));
        }
    }

    function toggleSelect(id: number) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    }

    function clearSelection() {
        setSelectedIds([]);
    }

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return {
        search,
        setSearch,
        sortConfig,
        setSort,
        filters,
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
    };
}
