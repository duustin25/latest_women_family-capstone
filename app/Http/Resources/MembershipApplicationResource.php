<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MembershipApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'organization_name' => $this->organization->name ?? 'N/A',
            
            // Primary Identity
            'fullname' => $this->fullname,
            'address' => $this->address,
            'status' => $this->status,

            // Section I: Personal Data (JSON)
            // We return the raw array so React can map through it
            'personal_data' => $this->personal_data ?? [],

            // Section II: Family Members (JSON Table)
            'family_data' => $this->family_data ?? [],

            // Approval Info
            'recommended_by' => $this->recommended_by,
            'approved_by' => $this->approved_by,
            'actioned_at' => $this->actioned_at ? $this->actioned_at->format('M d, Y h:i A') : null,
            
            'created_at' => $this->created_at->format('M d, Y'),
        ];
    }
}