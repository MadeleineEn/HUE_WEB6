<?php

namespace App\Http\Controllers;

use App\Models\Label;
use App\Models\Note;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class LabelController extends Controller
{
    public function index(): JsonResponse {
        /* alle relevanten Beziehungen laden
        n:m zu Notes
        n:m zuTodos
        n:1 zu User*/
        $labels = Label::with(['notes','todos','user'])
            ->get();
        return response()->json($labels, 200);
    }

    //Titel vom Label darf nur einmal vergeben werden (vgl. ISBN bei Buch),
    //deshalb schaut man hier, ob der Titel schon vergeben ist
    public function checkTitle(string $title):JsonResponse{
        //den richtigen Title suchen
        $label = Label::where('title', $title)->first();
        //Label mit Title suchen und wenn es das Label schon gibt, dann gibt er true zurück
        return $label != null ? response()->json(true, 200) : response()->json(false, 200);
    }

    public function getById(string $id):JsonResponse{
        $label = Label::with(['notes','todos','user'])->find($id);
        return response()->json($label, 201);
    }

    public function findBySearchTerm(string $searchTerm):JsonResponse{
        $labels = Label::with(['notes','todos','user'])
            ->where('title','LIKE','%'.$searchTerm.'%')
            ->orWhereHas('notes', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('todos', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('user',function($query) use ($searchTerm){
                $query->where('username','LIKE','%'.$searchTerm.'%');
            })->get();
        return response()->json($labels, 200);
    }

    public function save(Request $request):JsonResponse{
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try{
            $label = Label::create($request->all());

            if(isset($request['notes']) && is_array($request['notes'])){
                foreach ($request['notes'] as $not){
                    $note = Note::firstOrNew(['title'=>$not['title'], 'description'=>$not['description']]);
                    $label->notes()->save($note);
                }
            }

            if(isset($request['todos']) && is_array($request['todos'])){
                foreach ($request['todos'] as $tod){
                    $todo = Todo::firstOrNew(['title'=>$tod['title'], 'description'=>$tod['description'],
                        'due_date'=>$tod['due_date'], 'is_public'=>$tod['is_public']]);
                    $label->todos()->save($todo);
                }
            }

            DB::commit();
            return response()->json($label, 201);
        } catch(Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("saving label failed: ".$e->getMessage(), 420);
        }
    }

    public function update(Request $request, int $id):JsonResponse{
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try{
            $label = Label::with(['notes','todos','user'])->where('id',$id)->first();
            if($label != null){
                $label->update($request->all());

                //Update Notiz
                $noteIds = [];
                if(isset($request['notes']) && is_array($request['notes'])){
                    foreach ($request['notes'] as $not){
                        array_push($noteIds,$not['id']);
                        $note = Note::firstOrNew(['title'=>$not['title'], 'description'=>$not['description']]);
                    }
                }
                $label->notes()->sync($noteIds);
                $label->save();

                //UpdateTodo
                $todoIds = [];
                if(isset($request['todos']) && is_array($request['todos'])){
                    foreach ($request['todos'] as $tod){
                        array_push($todoIds,$tod['id']);
                        $todo = Todo::firstOrNew(['title'=>$tod['title'], 'description'=>$tod['description'],
                            'due_date'=>$tod['due_date'], 'is_public'=>$tod['is_public']]);
                    }
                }
                $label->todos()->sync($todoIds);

                $label->save();
            }
            DB::commit();

            //sichergehen, dass der upgedatete Tag/Label geholt wird und geben das aus
            $label1 = Label::with(['notes','todos','user'])->where('id',$id)->first();
            return response()->json($label1, 201);
        } catch(Exception $e) {
            DB::rollBack();
            //Fehlercode 420 - hat nicht funktioniert
            return response()->json("updating label failed: ".$e->getMessage(), 420);
        }
    }


    public function delete(int $id):JsonResponse {
        $label = Label::where('id',$id)->first();
        if($label != null){
            $label->delete();
            return response()->json('label with id: ('.$id.') successfully deleted', 200);
        } else {
            return response()->json("could not delete label - it does not exist", 422);
        }
    }


}
