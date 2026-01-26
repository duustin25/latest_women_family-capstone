<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PublicVawcController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/VAWC/Index', [
            'hotlines' => [
                'vawc_desk' => '(02) 8XXX-XXXX',
                'pnp_women' => '117',
                'emergency' => '911'
            ]
        ]);
    }
}