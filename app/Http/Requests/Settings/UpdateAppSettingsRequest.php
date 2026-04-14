<?php

namespace App\Http\Requests\Settings;

use DateTimeZone;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('settings.app.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'timezone' => ['nullable', 'string', Rule::in(DateTimeZone::listIdentifiers())],
            'locale' => ['nullable', 'string', 'alpha_dash', 'max:15'],
            'fallback_locale' => ['nullable', 'string', 'alpha_dash', 'max:15'],
            'maintenance_enabled' => ['nullable', 'boolean'],
            'maintenance_message' => ['nullable', 'string', 'max:500'],
        ];
    }
}
