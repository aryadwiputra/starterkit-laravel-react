<?php

namespace App\Http\Controllers;

use App\Models\UserColumnPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ColumnPreferenceController extends Controller
{
    /**
     * Store or update column visibility preferences.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_id' => ['required', 'string', 'max:100'],
            'visible_columns' => ['required', 'array'],
            'visible_columns.*' => ['required', 'string'],
        ]);

        UserColumnPreference::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'table_id' => $validated['table_id'],
            ],
            [
                'visible_columns' => $validated['visible_columns'],
            ],
        );

        return response()->json(['message' => 'Preferences saved.']);
    }
}
