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
            'beginDate' => 'date|before_or_equal:endDate',
            'endDate' => 'date|after_or_equal:beginDate',
        ];
    }

    public function messages(): array
    {
        return [
            'beginDate.date_format' => 'A data inicial deve estar no formato válido.',
            'beginDate.before_or_equal' => 'A data inicial deve ser igual ou anterior á data final.',
            'endDate.date_format' => 'A data final deve estar no formato válido.',
            'endDate.after_or_equal' => 'A data final deve ser igual ou posterior à data inicial.',
        ];
    }
}
