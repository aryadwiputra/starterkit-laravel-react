<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Role|null $role */
        $role = $this->route('role');

        if ($role && $role->name === 'super-admin') {
            return false;
        }

        return $this->user()?->can('role.edit') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Role|null $role */
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'alpha_dash',
                'max:255',
                Rule::unique('roles', 'name')->ignore($role?->id),
                Rule::notIn(['super-admin']),
            ],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::in($this->permissionNames()),
            ],
        ];
    }

    /**
     * @return list<string>
     */
    private function permissionNames(): array
    {
        return Permission::query()->pluck('name')->all();
    }
}
