<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNotificationPreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $typeKeys = collect(config('notification_types', []))
            ->filter(fn ($entry) => is_array($entry) && isset($entry['key']))
            ->map(fn ($entry) => (string) $entry['key'])
            ->values()
            ->all();

        return [
            'preferences' => ['required', 'array'],
            'preferences.*.type_key' => ['required', 'string', Rule::in($typeKeys)],
            'preferences.*.channels' => ['required', 'array'],
            'preferences.*.channels.database' => ['sometimes', 'boolean'],
            'preferences.*.channels.mail' => ['sometimes', 'boolean'],
            'preferences.*.channels.slack' => ['sometimes', 'boolean'],
        ];
    }
}
