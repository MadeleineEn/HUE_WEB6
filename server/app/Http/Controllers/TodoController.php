<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use App\Models\Image;
use App\Models\Label;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Exception;

class TodoController extends Controller
{
    public function index(): JsonResponse {
        /*alle relevanten Beziehungen laden
        1:n zu Images
        n:m zu Labels
        n:1 zu Notes
        n:m zu Users*/

        $todos = Todo::with(['images','labels', 'note', 'users'])
            ->get();
        return response()->json($todos, 200);
    }

    public function getById(string $id):JsonResponse{
        $todo = Todo::with(['images','labels', 'note', 'users'])->find($id);
        return response()->json($todo, 201);
    }

    public function findBySearchTerm(string $searchTerm):JsonResponse{
        $todos = Todo::with(['images','labels', 'note', 'users'])
            ->where('title','LIKE','%'.$searchTerm.'%')
            ->orWhere('description','LIKE','%'.$searchTerm.'%')
            ->orWhere('due_date','LIKE','%'.$searchTerm.'%')
            ->orWhere('is_public','LIKE','%'.$searchTerm.'%')
            ->orWhereHas('images', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('labels', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('note', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('users', function ($query) use ($searchTerm) {
                $query->where('username', 'LIKE', '%' . $searchTerm . '%');
            })
            ->get();
        return response()->json($todos, 200);
    }

    public function save(Request $request):JsonResponse{
        $request = $this->parseRequest($request);
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try{
            $todo = Todo::create($request->all());
            if(isset($request['images']) && is_array($request['images'])){
                foreach ($request['images'] as $img){
                    $image = Image::firstOrNew(['url'=>$img['url'], 'title'=>$img['title']]);
                    $todo->images()->save($image);
                }
            }
            $labelIds = [];
            if(isset($request['labels']) && is_array($request['labels'])){
                foreach ($request['labels'] as $lab){
                    array_push($labelIds,$lab['id']);
                    $label = Label::firstOrNew(['title'=>$lab['title']]);
                }
            }
            $todo->labels()->sync($labelIds);
            $todo->save();

            $userIds = [];
            if(isset($request['users']) && is_array($request['users'])){
                foreach ($request['users'] as $usr){
                    array_push($userIds,$usr['id']);
                    $user = User::firstOrNew(['name'=>$usr['name'], 'email'=>$usr['email'], 'password'=>$usr['password']]);
                }
            }

            $todo->users()->sync($userIds);
            $todo->save();

            DB::commit();
            return response()->json($todo, 201);
        } catch(Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("saving todo failed: ".$e->getMessage(), 420);
        }
    }

    public function update(Request $request, int $id):JsonResponse{
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try{
            $todo = Todo::with(['images','labels', 'note', 'users'])->where('id',$id)->first();
            if($todo != null){
                $request = $this->parseRequest($request);
                $todo->update($request->all());

                //Alte Bilder löschen
                $todo->images()->delete();

                if(isset($request['images']) && is_array($request['images'])){
                    foreach ($request['images'] as $img){
                        $image = Image::firstOrNew(['url'=>$img['url'], 'title'=>$img['title']]);
                        $todo->images()->save($image);
                    }
                }

                //Update Label
                $labelIds = [];
                if(isset($request['labels']) && is_array($request['labels'])){
                    foreach ($request['labels'] as $lab){
                        array_push($labelIds,$lab['id']);
                        $label = Label::firstOrNew(['title'=>$lab['title']]);
                    }
                }
                $todo->labels()->sync($labelIds);
                $todo->save();

                //Update User
                $userIds = [];
                if(isset($request['users']) && is_array($request['users'])){
                    foreach ($request['users'] as $usr){
                        array_push($userIds,$usr['id']);
                        $user = User::firstOrNew(['name'=>$usr['name'], 'email'=>$usr['email'], 'password'=>$usr['password']]);
                    }
                }
                $todo->users()->sync($userIds);

                $todo->save();
            }
            DB::commit();

            $todo1 = Todo::with(['images','labels', 'note', 'users'])->where('id',$id)->first();
            return response()->json($todo1, 201);
        } catch(Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("updating todo failed: ".$e->getMessage(), 420);
        }
    }


    public function delete(int $id):JsonResponse {
        $todo = Todo::where('id',$id)->first();
        if($todo != null){
            $todo->delete();
            return response()->json('todo with id: ('.$id.') successfully deleted', 200);
        } else {
            return response()->json("could not delete todo - it does not exist", 422);
        }
    }

    private function parseRequest(Request $request):Request{
        //get date and convert it - it is in ISO 8601 "2023-03-22T16:29:00.000Z"
        $date = new DateTime($request->due_date);
        $request['due_date'] = $date->format('Y-m-d H:i:s');
        return $request;
    }

}
