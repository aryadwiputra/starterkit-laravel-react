<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaAssetRequest extends FormRequest
{
    /**
     * @var array<int, string>
     */
    private const ALLOWED_MIMES = [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'csv',
        'txt',
        'zip',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('media.manage') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'file' => [
                'required',
                'file',
                'max:51200', // 50MB
                'mimes:'.implode(',', self::ALLOWED_MIMES),
            ],
        ];
    }
}
