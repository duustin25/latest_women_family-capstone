<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Strategies\CaseManagement\CaseStrategyFactory;

class CaseReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Polymorphic name resolution
        $strategy = CaseStrategyFactory::make($this->type);
        $name = $strategy->getDisplayName($this->resource);

        // Resolve Hybrid Status
        $uiStatus = $this->lifecycle_status;
        if ($this->lifecycle_status === 'Ongoing' && $this->status) {
            $uiStatus = 'Ongoing: ' . $this->status->name;
        } elseif ($this->lifecycle_status === 'Referred' && $this->referralAgency) {
            $uiStatus = 'Referred: ' . $this->referralAgency->name;
        }

        return [
            'id' => $this->id,
            'case_number' => $this->case_number,
            'name' => $name,
            'type' => $this->type,
            'subType' => $this->abuseType ? $this->abuseType->name : 'N/A',
            'status' => $uiStatus,
            'lifecycle_status' => $this->lifecycle_status,
            'date' => $this->incident_date ? $this->incident_date->format('M d, Y') : $this->created_at->format('M d, Y'),
            'time' => $this->created_at->format('h:i A'),
            'referred_to' => $this->referralAgency ? $this->referralAgency->name : null,
            'created_at' => $this->created_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
