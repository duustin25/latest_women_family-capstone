<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Reactivate all inactive statuses for debugging/fixing user issue
$affected = \App\Models\OngoingStatus::where('is_active', false)->update(['is_active' => true]);
echo "Reactivated $affected statuses.\n";
