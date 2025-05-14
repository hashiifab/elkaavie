<?php

namespace App\Http\Requests\Api;

use App\Services\BookingService;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Allow 'payment_rejected' as a special action, not a real status
        $validStatuses = array_merge(BookingService::getValidStatuses(), ['payment_rejected']);

        return [
            'status' => ['required', 'string', 'in:' . implode(',', $validStatuses)],
        ];
    }

    /**
     * Get custom error messages for validator errors
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        // Include 'payment_rejected' in the valid statuses for error messages
        $validStatuses = array_merge(BookingService::getValidStatuses(), ['payment_rejected']);

        return [
            'status.required' => 'The booking status is required.',
            'status.in' => 'The booking status must be one of: ' . implode(', ', $validStatuses),
        ];
    }
}