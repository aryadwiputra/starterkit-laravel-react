<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportService
{
    /**
     * Export data as CSV.
     *
     * @param  array<string, string>  $columnMap
     */
    public function csv(Builder $query, array $columnMap, string $filename = 'export'): BinaryFileResponse
    {
        $export = new DataExport($query->get(), $columnMap);

        return $export->download("{$filename}.csv", Excel::CSV);
    }

    /**
     * Export data as Excel.
     *
     * @param  array<string, string>  $columnMap
     */
    public function excel(Builder $query, array $columnMap, string $filename = 'export'): BinaryFileResponse
    {
        $export = new DataExport($query->get(), $columnMap);

        return $export->download("{$filename}.xlsx", Excel::XLSX);
    }

    /**
     * Export data as PDF.
     *
     * @param  array<string, string>  $columnMap
     */
    public function pdf(Builder $query, array $columnMap, string $filename = 'export'): Response
    {
        $data = $query->get();
        $headers = array_values($columnMap);
        $keys = array_keys($columnMap);

        $rows = $data->map(function ($item) use ($keys) {
            return collect($keys)->map(function ($key) use ($item) {
                $value = data_get($item, $key);

                if (is_array($value)) {
                    return implode(', ', $value);
                }

                return (string) ($value ?? '');
            })->toArray();
        });

        $pdf = Pdf::loadView('exports.table', [
            'title' => $filename,
            'headers' => $headers,
            'rows' => $rows,
        ]);

        return $pdf->download("{$filename}.pdf");
    }
}

/**
 * @internal
 */
class DataExport implements FromCollection, WithHeadings
{
    use Exportable;

    /**
     * @param  array<string, string>  $columnMap
     */
    public function __construct(
        private readonly Collection $data,
        private readonly array $columnMap,
    ) {}

    /**
     * @return \Illuminate\Support\Collection<int, array<int, string>>
     */
    public function collection(): \Illuminate\Support\Collection
    {
        $keys = array_keys($this->columnMap);

        return $this->data->map(function ($item) use ($keys) {
            return collect($keys)->map(function ($key) use ($item) {
                $value = data_get($item, $key);

                if (is_array($value)) {
                    return implode(', ', $value);
                }

                return (string) ($value ?? '');
            })->toArray();
        });
    }

    /**
     * @return list<string>
     */
    public function headings(): array
    {
        return array_values($this->columnMap);
    }
}
