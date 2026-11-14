<?php

namespace App\Http\Requests\Tag;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTagRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome da tag é obrigatório.',
            'name.string' => 'O nome da tag deve ser uma string.',
            'name.max' => 'O nome da tag não pode ter mais de 255 caracteres.',
            'color.required' => 'A cor da tag é obrigatória.',
            'color.string' => 'A cor da tag deve ser uma string.',
            'color.max' => 'A cor da tag não pode ter mais de 255 caracteres.',
        ];
    }
}
