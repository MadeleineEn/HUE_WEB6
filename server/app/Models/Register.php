<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Register extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'is_public'];

    //Notizen können zu mehreren Liste gehören - 1:n
    public function notes():HasMany{
        return $this->hasMany(Note::class);
    }

    //mehrere Nutzer können mehrere Listen haben - n:m
    public function users():BelongsToMany{
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
