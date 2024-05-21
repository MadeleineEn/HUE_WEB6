<?php

use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;
use App\Models\Note;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [NoteController::class,'index']);
Route::get('/notes', [NoteController::class,'index']);
Route::get('/notes/{note}',[NoteController::class,'show']);
