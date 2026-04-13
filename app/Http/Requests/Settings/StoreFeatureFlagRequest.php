<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeatureFlagRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('settings.flags.manage');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'key' => ['required', 'string', 'max:100', 'regex:/^[A-Za-z0-9._-]+$/', Rule::unique('feature_flags', 'key')],
            'description' => ['nullable', 'string', 'max:500'],
            'enabled' => ['nullable', 'boolean'],
            'environments' => ['nullable', 'array'],
            'environments.*' => ['required', 'string', 'max:50'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')],
            'users' => ['nullable', 'array'],
            'users.*' => ['required', 'integer', Rule::exists('users', 'id')],
        ];
    }
}
