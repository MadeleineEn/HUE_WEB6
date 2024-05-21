<?php

use App\Http\Controllers\NoteController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\TodoController;
use \App\Http\Controllers\UserController;
use \App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Alle Routen von Notizen
Route::get('notes', [NoteController::class,'index']);
Route::get('notes/{id}',[NoteController::class,'getById']);
Route::get('notes/search/{searchTerm}',[NoteController::class,'findBySearchTerm']);
Route::group(['middleware' => ['api','auth.jwt','auth.admin']], function() {
    Route::post('notes', [NoteController::class, 'save']);
    Route::put('notes/{id}', [NoteController::class, 'update']);
    Route::delete('notes/{id}', [NoteController::class, 'delete']);
});

//Alle Routen von Labels (Tags)
Route::get('labels', [LabelController::class,'index']);
Route::get('labels/{id}',[LabelController::class,'getById']);
Route::get('labels/{title}',[LabelController::class,'checkTitle']);
Route::get('labels/search/{searchTerm}',[LabelController::class,'findBySearchTerm']);
Route::group(['middleware' => ['api','auth.jwt','auth.admin']], function() {
    Route::post('labels', [LabelController::class, 'save']);
    Route::put('labels/{id}', [LabelController::class, 'update']);
    Route::delete('labels/{id}', [LabelController::class, 'delete']);
});

//Alle Routen von Registers (Listen)
Route::get('registers', [RegisterController::class,'index']);
Route::get('registers/{id}',[RegisterController::class,'getById']);
Route::get('registers/search/{searchTerm}',[RegisterController::class,'findBySearchTerm']);
Route::group(['middleware' => ['api','auth.jwt','auth.admin']], function() {
    Route::post('registers', [RegisterController::class, 'save']);
    Route::put('registers/{id}', [RegisterController::class, 'update']);
    Route::delete('registers/{id}', [RegisterController::class, 'delete']);
});

//Alle Routen von Todos
Route::get('todos', [TodoController::class,'index']);
Route::get('todos/{id}',[TodoController::class,'getById']);
Route::get('todos/search/{searchTerm}',[TodoController::class,'findBySearchTerm']);
Route::group(['middleware' => ['api','auth.jwt','auth.admin']], function(){
    Route::post('todos',[TodoController::class,'save']);
    Route::put('todos/{id}',[TodoController::class,'update']);
    Route::delete('todos/{id}',[TodoController::class,'delete']);
});

//Alle Routen von User
Route::get('users', [UserController::class,'index']);
Route::get('users/{id}',[UserController::class,'getById']);
Route::get('users/ids', [UserController::class, 'getUserIds']);
Route::delete('users/{id}',[UserController::class,'delete']);

//Authorisierung
Route::post('auth/login', [AuthController::class, 'login']);
Route::group(['middleware' => ['api','auth.jwt','auth.admin']], function(){
    Route::post('auth/logout', [AuthController::class,'logout']);
    Route::get('auth/user/role', [UserController::class, 'getUserRole']);
});




