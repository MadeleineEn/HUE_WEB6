<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Register;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;


class RegisterController extends Controller
{
    public function index(): JsonResponse
    {
        /*alle relevanten Beziehungen laden
        1:n zu Notes
        n:m zu Users
        */
        $registers = Register::with(['notes', 'users'])
            ->get();
        return response()->json($registers, 200);
    }

    public function getById(string $id): JsonResponse
    {
        $register = Register::with(['notes', 'users'])->find($id);
        return response()->json($register, 201);
    }

    public function findBySearchTerm(string $searchTerm): JsonResponse
    {
        $registers = Register::with(['notes', 'users'])
            ->where('title', 'LIKE', '%' . $searchTerm . '%')
            ->orWhere('is_public', 'LIKE', '%' . $searchTerm . '%')
            ->orWhereHas('notes', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('users', function ($query) use ($searchTerm) {
                $query->where('name', 'LIKE', '%' . $searchTerm . '%');
            })
            ->get();
        return response()->json($registers, 200);
    }

    public function save(Request $request): JsonResponse
    {
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try {
            $register = Register::create($request->all());

            if (isset($request['notes']) && is_array($request['notes'])) {
                foreach ($request['notes'] as $not) {
                    $note = Note::firstOrNew(['title' => $not['title'], 'description' => $not['description']]);
                    $register->notes()->save($note);
                }
            }
            $userIds = [];
            if (isset($request['users']) && is_array($request['users'])) {
                foreach ($request['users'] as $usr) {
                    $user = User::firstOrNew([
                            'username' => $usr['username'],
                            'firstname' => $usr['firstname'],
                            'lastname' => $usr['lastname'],
                            'email' => $usr['email'],
                            'password' => $usr['password']
                        ]
                    );

                    $user->save();
                    $userIds = $user->id;
                }
                $register->users()->sync($userIds);
            }
            DB::commit();
            return response()->json($register, 201);
        } catch
        (Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("saving register failed: " . $e->getMessage(), 420);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try {
            $register = Register::with(['notes', 'users'])->where('id', $id)->first();
            if ($register != null) {
                $register->update($request->all());

                if (isset($request['notes']) && is_array($request['notes'])) {
                    foreach ($request['notes'] as $not) {
                        $note = Note::firstOrNew(['title' => $not['title'], 'description' => $not['description']]);
                        $register->notes()->save($note);
                    }
                }
                $userIds = [];
                if (isset($request['users']) && is_array($request['users'])) {
                    foreach ($request['users'] as $usr) {
                        array_push($userIds, $usr['id']);
                        $user = User::firstOrNew([
                                'username' => $usr['username'],
                                'firstname' => $usr['firstname'],
                                'lastname' => $usr['lastname'],
                                'email' => $usr['email'],
                                'role' => $usr['role'],
                            ]
                        );
                        // Passwort extra speichern, um Probleme mit Hashing zu vermeiden
                        if (isset($usr['password']) && !empty($usr['password'])) {
                            $user->password = bcrypt($usr['password']);
                        }
                        $user->save();
                        $userIds[] = $user->id;
                    }
                }
                $register->users()->sync($userIds);

                $register->save();
            }
            DB::commit();

            //sichergehen, dass die upgedatete Notiz geholt wird und geben das aus
            $register1 = Register::with(['notes', 'users'])->where('id', $id)->first();
            return response()->json($register1, 201);
        } catch (Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("updating register failed " . $e->getMessage(), 420);
        }
    }


    public function delete(int $id): JsonResponse
    {
        $register = Register::where('id', $id)->first();
        if ($register != null) {
            $register->delete();
            return response()->json('register with id: (' . $id . ') successfully deleted', 200);
        } else {
            return response()->json("could not delete register - it does not exist", 422);
        }
    }
}
