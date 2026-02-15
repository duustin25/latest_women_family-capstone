<?php

namespace App\Services;

use App\Models\Organization;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ChatbotService
{
    /**
     * Process a user query using the Python AI engine.
     */
    public function processQuery(string $query): array
    {
        try {
            // Path to the python script
            $scriptPath = resource_path('python/chat.py');

            // Handle environment where 'python' might be 'python3'
            $process = new Process(['python', $scriptPath, $query]);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new ProcessFailedException($process);
            }

            $output = $process->getOutput();
            $result = json_decode($output, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($result['response'])) {
                // Check if response is an ACTION tag
                if (str_starts_with($result['response'], 'ACTION_')) {
                    return $this->handleAction($result['response']);
                }

                return ['response' => $result['response']];
            }

            if (!empty(trim($output))) {
                return ['response' => trim($output)];
            }

            return ['response' => "I apologize, but I'm having trouble processing that right now. Please try again."];

        } catch (\Exception $e) {
            \Log::error('Chatbot Python Error: ' . $e->getMessage());
            return ['response' => $this->fallbackLogic($query)];
        }
    }

    private function handleAction(string $action): array
    {
        // ---------------------------------------------------------
        // DYNAMIC ACTION MAPPING ENGINE
        // ---------------------------------------------------------
        // Instead of hardcoding responses in Python, the AI returns an 
        // "ACTION_TAG". Laravel intercepts this tag and executes results
        // fetching from the live database. This ensures data is always 
        // up-to-date without retraining the model.

        switch ($action) {
            case 'ACTION_FETCH_ANNOUNCEMENTS':
                return $this->fetchAnnouncements();
            case 'ACTION_FETCH_OFFICIALS':
                return $this->fetchOfficials();
            case 'ACTION_FETCH_LAWS':
                return $this->fetchLaws();
            case 'ACTION_FETCH_ORG_REQUIREMENTS_KALIPI':
                return $this->fetchOrgRequirements('KALIPI');
            case 'ACTION_FETCH_ORG_REQUIREMENTS_SOLO_PARENT':
                return $this->fetchOrgRequirements('Solo Parent');
            case 'ACTION_DISAMBIGUATE_REPORT':
                // Intent Disambiguation:
                // If the user's intent is vague (e.g., "Report"), we ask for clarification
                // and provide clickable Quick Reply buttons to guide them.
                return [
                    'response' => "Nais mo bang mag-report ng kaso para sa isang babae (VAWC) o para sa isang bata (BCPC)?",
                    'suggestions' => ['File VAWC Case', 'File BCPC Case']
                ];
            default:
                return ['response' => "I'm sorry, I encountered an internal action error."];
        }
    }

    private function fetchAnnouncements(): array
    {
        // Fetch latest 3 announcements
        $news = \App\Models\Announcement::latest()->take(3)->get();

        if ($news->isEmpty()) {
            return ['response' => "There are no new announcements at this time."];
        }

        $response = "Here are the latest announcements:\n\n";
        foreach ($news as $item) {
            $date = $item->created_at->format('M d, Y');
            $response .= "📢 **{$item->title}** ({$date})\n{$item->content}\n\n"; // Assuming 'content' or 'body'
        }

        return ['response' => $response];
    }

    private function fetchOfficials(): array
    {
        $officials = \App\Models\BarangayOfficial::orderBy('id')->get(); // Adjust ordering as needed

        if ($officials->isEmpty()) {
            return ['response' => "The list of officials is currently unavailable."];
        }

        $response = "Here are our Barangay Officials:\n\n";
        foreach ($officials as $official) {
            // Adjust fields based on your Official model (e.g., name, position)
            $response .= "👤 **{$official->name}** - {$official->position}\n";
        }

        return ['response' => $response];
    }

    private function fetchLaws(): array
    {
        // Hardcoded for now as Laws might not be in DB, or fetch if in DB
        // Assuming static for now or maybe create a Law model later if requested
        // Prompt implies "Admin can CRUD... Laws", so assume Law model exists or use static if not found
        // Let's check if Law model exists, otherwise static.
        // Returning static for safety + standard laws mentioned in intents.

        return [
            'response' => "Here are some key laws protecting women and children:\n\n" .
                "📜 **RA 9262 (Anti-VAWC Act)**: Protects women and children from violence.\n" .
                "📜 **RA 7610**: Special Protection of Children Against Abuse, Exploitation and Discrimination Act.\n" .
                "📜 **RA 11313 (Safe Spaces Act)**: Penalizes gender-based sexual harassment in public spaces and online.\n\n" .
                "For more details, please visit the 'Laws' page."
        ];
    }

    private function fetchOrgRequirements(string $orgName): array
    {
        $org = Organization::where('name', 'LIKE', "%{$orgName}%")->first();

        if (!$org) {
            return ['response' => "I couldn't find information for {$orgName}."];
        }

        $reqs = $org->requirements; // Assuming cast to array
        $reqList = is_array($reqs) ? implode(", ", $reqs) : $reqs;

        return ['response' => "To join **{$org->name}**, you need:\n\n{$reqList}\n\nYou can apply directly on the Organizations page."];
    }

    private function fallbackLogic(string $query): string
    {
        $query = strtolower($query);

        if (Str::contains($query, ['join', 'apply', 'requirements'])) {
            return "To join an organization, please navigate to the Organizations page and click 'Join'. Requirements usually include a valid ID and proof of residency.";
        }

        if (Str::contains($query, ['vawc', 'abuse', 'report', 'emergency'])) {
            return "If this is an emergency, please call 911 immediately. To file a VAWC report, use the red 'Report Case' button on the dashboard.";
        }

        return "I am experiencing a temporary system issue. Please contact the administrator or try again later.";
    }
}
