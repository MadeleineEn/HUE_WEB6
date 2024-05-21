<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'firstname',
        'lastname',
        'email',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    //ein Nutzer kann kein, ein oder mehrere Labels haben
    public function labels():HasMany{
        return $this->hasMany(Label::class);
    }

    //ein Nutzer kann keine, eine oder mehrere Notizen haben
    public function notes():HasMany{
        return $this->hasMany(Note::class);
    }

    //ein Nutzer kann genau ein Bild haben - 1:1
    public function image():HasOne{
        return $this->hasOne(Image::class);
    }

    //mehrere Nutzer können mehrere Todos haben - n:m
    public function todos():BelongsToMany{
        return $this->belongsToMany(Todo::class)->withTimestamps();
    }

    //mehrere Nutzer können mehrere Listen haben - n:m
    public function registers():BelongsToMany{
        return $this->belongsToMany(Register::class)->withTimestamps();
    }

    public function getJWTIdentifier(){
        return $this->getKey();
    }

    public function getJWTCustomClaims(){
        return ['user' => ['id' => $this->id]];
    }
}
