<?php

namespace Database\Seeders;

use App\Models\Image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = new User;
        $user1->username = "marthaberger";
        $user1->firstname = "Martha";
        $user1->lastname = "Berger";
        $user1->email = "berger@gmail.com";
        $user1->role = "admin";
        $user1->password = bcrypt('secret');
        $user1->save();

        $image1 = new Image;
        $image1->title = "Martha Berger";
        $image1->url ="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg";
        $user1->image()->save($image1);

        $user2 = new User;
        $user2->username = "davidsteiner";
        $user2->firstname = "David";
        $user2->lastname = "Steiner";
        $user2->email = "steiner@gmail.com";
        $user2->role = "user";
        $user2->password = bcrypt('special');
        $user2->save();

        $image2 = new Image;
        $image2->title = "David Steiner";
        $image2->url =
            "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
        $user2->image()->save($image2);
    }
}
