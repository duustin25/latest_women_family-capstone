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

        $latestReferral = $this->referrals->sortByDesc('created_at')->first();

        // Resolve Hybrid Status
        $uiStatus = $this->lifecycle_status;
        if ($this->lifecycle_status === 'Ongoing' && $this->status) {
            $uiStatus = 'Ongoing: ' . $this->status->name;
        } elseif ($this->lifecycle_status === 'Referred' && $latestReferral && $latestReferral->agency) {
            $uiStatus = 'Referred: ' . $latestReferral->agency->name;
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
            'zone' => $this->zone ? $this->zone->name : 'Unspecified',
            'created_at' => $this->created_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
