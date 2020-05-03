@extends('layouts.app')
@section('csslinks')
<link rel="stylesheet" href="{{ asset('css/rmo.css') }}" />
@endsection
@section('style')

#divtable
{
width: 100%;
height: 100%;
overflow: scroll
}
#save:hover {
  -ms-transform: scale(1.1); /* IE 9 */
  -webkit-transform: scale(1.1); /* Safari 3-8 */
  transform: scale(1.1); 
}

@endsection
@section('content')
<h1>RMO Sheet</h1>
<p>Team {{$displayname}}</p>
<div id="divtable" class=""></div>
<hr>
<script src="{{ asset('js/rmo.js') }}" ></script>
@endsection
@section('script')

var projects=@json($projects);
var resources=@json($resources);  
var rmo=@json($rmo);
 
$( document ).ready(function()
{
	var start =  new Date();
	start.setMonth(start.getMonth()  - 2);
	var end = new Date();
	end.setMonth(end.getMonth()  + 12);
 
	rmoobj = new Rmo(start,end,resources,projects);
	rmoobj.Show('divtable',rmo.data,'{{route("save")}}','{{csrf_token()}}');
});
@endsection
