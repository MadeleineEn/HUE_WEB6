<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use DateTime;
use App\Models\Note;
use App\Models\Image;
use App\Models\User;
use App\Models\Label;


class NotesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $note1 = new Note;
        $note1->title = "Hausübung machen";
        $note1->description = "Die Hausübung wird aufwendig, es gibt viel zu tun.";
        $note1->user_id = 1;
        $note1->register_id = 1;

        //den ersten User auswählen
        $user = User::first();
        $note1->user()->associate($user);
        $note1->save();

        //Bilder den Notizen hinzufügen
        //Bild 1
        $image1 = new Image;
        $image1->title = "Hausübung";
        $image1->url =
            "https://community.thriveglobal.com/wp-content/uploads/2019/03/shutterstock_310700672.jpg";
        $note1->images()->save($image1);

        $note2 = new Note;
        $note2->title = "Website programmieren";
        $note2->description = "Du musst noch die Website programmieren, das darfst du nicht vergessen.";
        $note2->user_id = 1;
        $note2->register_id = 1;

        //den ersten User auswählen
        $user = User::first();
        $note2->user()->associate($user);
        $note2->save();

        //Bild 2
        $image2 = new Image;
        $image2->title = "Websites";
        $image2->url =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp2HjauuH2XohbuCu7nSVgaACsmcJTxZLsO24u2dAaUw&s";
        $note2->images()->save($image2);

        //Labels testen
        $labels = Label::all()->pluck("id");
        $note1->labels()->sync($labels);
        $note2->labels()->sync($labels);
    }
}
