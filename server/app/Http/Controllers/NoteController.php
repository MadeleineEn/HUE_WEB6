<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Label;
use App\Models\Note;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class NoteController extends Controller
{
    public function index(): JsonResponse {
        /*lädt alle relevanten Beziehungen
        1:n zu Images
        n:m zu Label
        n:1 zu Registers
        1:n zuTodos
        n:1 zu User*/
        $notes = Note::with(['images','labels', 'register', 'todos', 'user'])
            ->get();
        return response()->json($notes, 200);
    }

    public function findBySearchTerm(string $searchTerm):JsonResponse{
        $notes = Note::with(['images','labels', 'todos', 'user'])
            ->where('title','LIKE','%'.$searchTerm.'%')
            ->orWhere('description','LIKE','%'.$searchTerm.'%')
            ->orWhereHas('images', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('labels', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('register', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('todos', function ($query) use ($searchTerm) {
                $query->where('title', 'LIKE', '%' . $searchTerm . '%');
            })
            ->orWhereHas('user', function ($query) use ($searchTerm) {
                $query->where('username', 'LIKE', '%' . $searchTerm . '%');
            })
            ->get();
        return response()->json($notes, 200);
    }

    public function getById(string $id):JsonResponse{
        $note = Note::with(['images','labels', 'register', 'todos', 'user'])->find($id);
        return response()->json($note, 201);
    }
    public function save(Request $request):JsonResponse{
        //Starten einer DB-Transaktion
        DB::beginTransaction();
        try{
            $note = Note::create($request->all());
            if(isset($request['images']) && is_array($request['images'])){
                foreach ($request['images'] as $img){
                    $image = Image::firstOrNew(['url'=>$img['url'], 'title'=>$img['title']]);
                    $note->images()->save($image);
                }
            }
            if(isset($request['labels']) && is_array($request['labels'])){
                foreach ($request['labels'] as $lab){
                    $label = Label::firstOrNew(['title'=>$lab['title']],['user_id'=>$lab['user_id']]);
                    $note->labels()->save($label);
                }
            }
            if(isset($request['todos']) && is_array($request['todos'])){
                foreach ($request['todos'] as $tod){
                    $todo = Todo::firstOrNew(['title'=>$tod['title'], 'description'=>$tod['description'],
                        'due_date'=>$tod['due_date'], 'is_public'=>$tod['is_public']]);
                    $note->todos()->save($todo);
                }
            }

            DB::commit();
            return response()->json($note, 201);
        } catch(Exception $e) {
            DB::rollBack();
            return response()->json("saving note failed: ".$e->getMessage(), 420);
        }
    }
    public function update(Request $request, int $id): JsonResponse {
        // Starten einer DB-Transaktion
        DB::beginTransaction();
        try {
            $note = Note::with(['images', 'labels', 'register', 'todos', 'user'])->where('id', $id)->first();
            if ($note != null) {
                $note->update($request->all());

                // Alte Bilder löschen
                $note->images()->delete();

                if (isset($request['images']) && is_array($request['images'])) {
                    foreach ($request['images'] as $img) {
                        $image = Image::firstOrNew(['url' => $img['url'], 'title' => $img['title']]);
                        $note->images()->save($image);
                    }
                }

                $ids = [];

                // Alte Labels entfernen
                $note->labels()->detach();

                if (isset($request['labels']) && is_array($request['labels'])) {
                    foreach ($request['labels'] as $lab) {
                        if (is_int($lab)) {
                            $label = Label::find($lab);
                            if ($label) {
                                array_push($ids, $lab);
                            } else {
                                throw new Exception("Label with ID $lab does not exist.");
                            }
                        } elseif (is_array($lab) && isset($lab['id'])) {
                            $label = Label::find($lab['id']);
                            if ($label) {
                                array_push($ids, $lab['id']);
                            } else {
                                $newLabel = Label::firstOrCreate(
                                    ['title' => $lab['title']],
                                    ['user_id' => $lab['user_id']]
                                );
                                array_push($ids, $newLabel->id);
                            }
                        }
                    }
                }

                $note->labels()->sync($ids);

                if (isset($request['todos']) && is_array($request['todos'])) {
                    foreach ($request['todos'] as $tod) {
                        $todo = Todo::firstOrNew([
                            'title' => $tod['title'],
                            'description' => $tod['description'],
                            'due_date' => $tod['due_date'],
                            'is_public' => $tod['is_public']
                        ]);
                        $note->todos()->save($todo);
                    }
                }

                $note->save();
            }
            DB::commit();

            // Sicherstellen, dass die aktualisierte Notiz geholt wird und ausgeben
            $note1 = Note::with(['images', 'labels', 'register', 'todos', 'user'])->where('id', $id)->first();
            return response()->json($note1, 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json("updating note failed: " . $e->getMessage(), 420);
        }
    }

    public function delete(int $id):JsonResponse {
        $note = Note::where('id',$id)->first();
        if($note != null){
            $note->delete();
            return response()->json('note with id: ('.$id.') successfully deleted', 200);
        } else {
            return response()->json("could not delete note - it does not exist", 422);
        }
    }
}
