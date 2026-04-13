<?php

namespace App\Services;

use App\Http\Requests\DataTableRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class DataTableService
{
    /**
     * Apply datatable parameters to the query.
     *
     * @param  list<string>  $searchableColumns
     * @param  list<string>  $filterableColumns
     */
    public function apply(
        Builder $query,
        DataTableRequest $request,
        array $searchableColumns = [],
        array $filterableColumns = [],
    ): LengthAwarePaginator {
        $this->applySearch($query, $request->searchQuery(), $searchableColumns);
        $this->applyFilters($query, $request->filters(), $filterableColumns);
        $this->applySort($query, $request->sortBy(), $request->sortDirection());

        return $query->paginate($request->perPage())->withQueryString();
    }

    /**
     * Apply search to the query.
     *
     * @param  list<string>  $searchableColumns
     */
    private function applySearch(Builder $query, ?string $search, array $searchableColumns): void
    {
        if (! $search || empty($searchableColumns)) {
            return;
        }

        $query->where(function (Builder $query) use ($search, $searchableColumns) {
            foreach ($searchableColumns as $column) {
                if (str_contains($column, '.')) {
                    [$relation, $field] = explode('.', $column, 2);
                    $query->orWhereHas($relation, function (Builder $query) use ($field, $search) {
                        $query->where($field, 'like', "%{$search}%");
                    });
                } else {
                    $query->orWhere($column, 'like', "%{$search}%");
                }
            }
        });
    }

    /**
     * Apply filters to the query.
     *
     * @param  array<string, string>  $filters
     * @param  list<string>  $filterableColumns
     */
    private function applyFilters(Builder $query, array $filters, array $filterableColumns): void
    {
        foreach ($filters as $column => $value) {
            if (! in_array($column, $filterableColumns) || $value === '' || $value === null) {
                continue;
            }

            if (str_contains($column, '.')) {
                [$relation, $field] = explode('.', $column, 2);
                $query->whereHas($relation, function (Builder $query) use ($field, $value) {
                    $query->where($field, $value);
                });
            } else {
                $query->where($column, $value);
            }
        }
    }

    /**
     * Apply sorting to the query.
     */
    private function applySort(Builder $query, string $sortBy, string $sortDirection): void
    {
        if (str_contains($sortBy, '.')) {
            return;
        }

        $query->orderBy($sortBy, $sortDirection);
    }
}
