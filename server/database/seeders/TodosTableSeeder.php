<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\Image;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TodosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $todo1 = new Todo;
        $todo1->title = "Auto waschen";
        $todo1->description = "Das Auto ist schon sehr dreckig und muss gewaschen werden.";
        $todo1->due_date = "2024-05-20 10:00:00";
        $todo1->is_public = false;
        $todo1->note_id = null;
        $todo1->save();

        $image1 = new Image;
        $image1->title = "Auto";
        $image1->url =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Fiat_Punto_2012_5door_front.JPG/420px-Fiat_Punto_2012_5door_front.JPG";
        $todo1->images()->save($image1);

        $todo2 = new Todo;
        $todo2->title = "Bachelorarbeit schreiben";
        $todo2->description = "Die Zeit rennt, die Arbeit muss fertig werden.";
        $todo2->due_date = "2024-06-17 11:00:00";
        $todo2->is_public = true;
        $todo2->note_id = 2;
        $todo2->save();

        $image2 = new Image;
        $image2->title = "Bachelorarbeit";
        $image2->url =
            "https://ostasieninstitut.com/wp-content/uploads/2019/03/Bachelorarbeit.jpg";
        $todo2->images()->save($image2);

        $todo3 = new Todo;
        $todo3->title = "Lesen";
        $todo3->description = "Zum Ausgleich darf man ein Buch lesen nicht vergessen.";
        $todo3->due_date = "2024-05-25 10:00:00";
        $todo3->is_public = true;
        $todo3->note_id = 1;
        $todo3->save();

        $image3 = new Image;
        $image3->title = "Lesen";
        $image3->url =
            "https://cdn.britannica.com/83/78183-004-345353F4/Stack-books.jpg";
        $todo3->images()->save($image3);
    }
}
