<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['url', 'title', 'user_id', 'note_id', 'todo_id'];

    //ein Bild kann bei einem User sein - 1:1
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    //eine Notiz kann mehrere Bilder haben - n:1
    public function note():BelongsTo{
        return $this->belongsTo(Note::class);
    }

    //einTodo kann mehrere Bilder haben - n:1
    public function todo():BelongsTo{
        return $this->belongsTo(Todo::class);
    }
}
