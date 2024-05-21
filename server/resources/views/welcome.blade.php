<body>
<ul>
    <ul>
        @foreach ($notes as $note)
            <li>{{$note->title}} {{$note->description}}</li>
        @endforeach
    </ul>
</ul>
</body>
