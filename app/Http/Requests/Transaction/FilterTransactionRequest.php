<?php

namespace App\Http\Requests\Transaction;

use App\Enums\TransactionPeriod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilterTransactionRequest extends FormRequest
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
            'search' => 'string|nullable',
            'maxValue' => 'numeric|gte:0|nullable',
            'minValue' => 'numeric|gte:0|nullable',
            'categories' => 'array',
            'period' => [Rule::enum(TransactionPeriod::class)],
        ];
    }
}
