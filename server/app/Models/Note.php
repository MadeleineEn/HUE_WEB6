<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Note extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id', 'register_id'];

    //eine Notiz kann mehrere Bilder haben - 1:n
    public function images():HasMany{
        return $this->hasMany(Image::class);
    }

    //eine Notiz kann zu mehreren Listen gehören - n:1
    public function register():BelongsTo{
        return $this->belongsTo(Register::class);
    }

    //eine Notiz hat mehrere Todos - 1:n
    public function todos():HasMany{
        return $this->hasMany(Todo::class);
    }

    //eine Notiz kann zu einem User gehören - n:1
    public function user():BelongsTo{
        return $this->belongsTo(User::class);
    }

    //eine Notiz kann mehrere Labels haben und umgekehrt - n:m
    public function labels():BelongsToMany{
        return $this->belongsToMany(Label::class)->withTimestamps();
    }

}
