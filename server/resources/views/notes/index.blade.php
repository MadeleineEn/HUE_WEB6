<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
<ul>
    @foreach ($notes as $note)
        <li><a href="notes/{{$note->id}}">
                {{$note->title}}</a></li>
    @endforeach
</ul>
</body>
</html>
