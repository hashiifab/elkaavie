<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'duration_months' => 'required|integer|min:1|max:12',
            'guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string',
            'payment_method' => 'required|in:credit_card,bank_transfer',
            'phone_number' => 'required|string',
            'identity_card' => 'required|file|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'Room selection is required',
            'check_in.required' => 'Check-in date is required',
            'check_out.required' => 'Check-out date is required',
            'guests.required' => 'Number of guests is required',
            'payment_method.required' => 'Payment method is required',
            'phone_number.required' => 'Phone number is required',
            'identity_card.required' => 'Identity card is required',
            'identity_card.file' => 'Identity card must be a file',
            'identity_card.mimes' => 'Identity card must be a JPEG, PNG, or JPG file',
            'identity_card.max' => 'Identity card file size cannot exceed 2MB',
        ];
    }
}
