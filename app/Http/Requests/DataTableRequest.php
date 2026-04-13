<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DataTableRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:100'],
            'sort_direction' => ['nullable', 'string', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,25,50,100'],
            'filters' => ['nullable', 'array'],
            'filters.*' => ['nullable', 'string'],
        ];
    }

    /**
     * Get the search query.
     */
    public function searchQuery(): ?string
    {
        return $this->validated('search');
    }

    /**
     * Get the sort column.
     */
    public function sortBy(string $default = 'created_at'): string
    {
        return $this->validated('sort_by') ?? $default;
    }

    /**
     * Get the sort direction.
     */
    public function sortDirection(string $default = 'desc'): string
    {
        return $this->validated('sort_direction') ?? $default;
    }

    /**
     * Get the per page count.
     */
    public function perPage(int $default = 10): int
    {
        return (int) ($this->validated('per_page') ?? $default);
    }

    /**
     * Get the filters.
     *
     * @return array<string, string>
     */
    public function filters(): array
    {
        return $this->validated('filters') ?? [];
    }
}
