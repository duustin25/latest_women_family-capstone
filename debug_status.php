<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$statuses = \App\Models\OngoingStatus::all();
echo json_encode($statuses, JSON_PRETTY_PRINT);
