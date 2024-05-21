<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'due_date', 'is_public', 'note_id'];

    //einTodo kann zu keiner oder einer Notiz gehören - n:1
    public function note():BelongsTo{
        return $this->belongsTo(Note::class);
    }

    //einTodo kann mehrere Images haben - 1:n
    public function images():HasMany{
        return $this->hasMany(Image::class);
    }

    //mehrereTodos können bei mehrere Labels haben - n:m
    public function labels():BelongsToMany{
        return $this->belongsToMany(Label::class)->withTimestamps();
    }

    //mehrereTodos können zu mehreren Usern gehören - n:m
    public function users():BelongsToMany{
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
