<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Todo;
use App\Models\Image;
use App\Models\Label;
use App\Models\Note;
use App\Models\Register;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(): JsonResponse{
    /* alle relevanten Beziehungen laden
     * 1:1 zu Image
     * 1:n zu Labels
     * 1:n zu Notes
     * n:m zu Registers
     * n:m zu Todos
    */
        $users = User::with(['image','labels','notes','registers','todos'])
            ->get();
        return response()->json($users,200);
    }

    public function getById(string $id):JsonResponse{
        $user = User::with(['image','labels','notes','registers','todos'])->find($id);
        return response()->json($user, 201);
    }

    public function getUserIds(): JsonResponse {
        $userIds = User::pluck('id')->toArray();
        return response()->json($userIds, 200);
    }

    public function getUserRole(): JsonResponse{
        $user = Auth::user();
        if ($user) {
            $role = $user->role;
            return response()->json(['role' => $role], 200);
        } else {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
    }

    public function delete(int $id):JsonResponse {
        $user = User::where('id',$id)->first();
        if($user != null){
            $user->delete();
            return response()->json('user with id: ('.$id.') successfully deleted', 200);
        } else {
            return response()->json("could not delete user - does not exist", 422);
        }
    }
}
