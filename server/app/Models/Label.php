<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Label extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'user_id'];

    //mehrere Labels können zu einem Nutzer gehören - n:1
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    //Labels können bei mehreren Notizen gespeichert sein - n:m
    public function notes():BelongsToMany{
        return $this->belongsToMany(Note::class)->withTimestamps();
    }

    //Labels können bei mehrerenTodos gespeichert sein - n:m
    public function todos():BelongsToMany{
        return $this->belongsToMany(Todo::class)->withTimestamps();
    }
}
