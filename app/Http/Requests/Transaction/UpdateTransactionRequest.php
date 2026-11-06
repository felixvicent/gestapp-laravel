<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'value' => 'required|numeric|gt:0',
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'O título da transação é obrigatório.',
            'value.required' => 'O valor da transação é obrigatório.',
            'value.numeric' => 'O valor da transação deve ser um número.',
            'value.gt' => 'O valor da transação deve ser maior que 0.',
            'date.required' => 'A data da transação é obrigatória.',
            'date.date' => 'A data da transação deve ser uma data válida.',
            'category_id.required' => 'A categoria da transação é obrigatória.',
            'category_id.exists' => 'A categoria selecionada é inválida.',
        ];
    }
}
