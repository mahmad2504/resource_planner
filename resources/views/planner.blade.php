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

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top:-45px;
}

#save:hover {
  -ms-transform: scale(1.1); /* IE 9 */
  -webkit-transform: scale(1.1); /* Safari 3-8 */
  transform: scale(1.1); 
}

@endsection
@section('content')

<div  class="flex" style="height:80px; border: 3px solid #4682B4;background:#2e5790;">
    <img width="200px" src="images/logo2.png"></img>
	<span class="center" style=" align: middle; text-align: center; color:#6a92bd;font-size:40px;" >RESOURCE PLANNER</span>
	<i style="color:white;font-size:20px;margin-top:-50px;float:right;margin-right:20px;" class="fa fa-user" aria-hidden="true">&nbsp&nbsp&nbsp{{$displayname}}&nbsp&nbsp|&nbsp&nbsp<a href="logout">Logout</a></i>
</div>
<br>
<br>
<div id="divtable" class=""></div>
<hr>

<footer id="footer" style="text-align: center;width:90%;" class="container-fluid">
	<small style="color:grey" >&#169; Embedded Platform Soltions, Mentor A Siemens Business.
	<a style="color:grey" href="mailto:Mumtaz_Ahmad@mentor.com">
		<i  class="fa fa-envelope"></i>
	</a>
	
	<a style="color:grey" href="https://www.linkedin.com/in/mumtazahmad2">
		<i class="fa fa-linkedin"></i>
	</a>
	<a style="color:grey" href="https://github.com/mahmad2504/resource_planner"> <span style="color:grey"></span>  
		<i class="fa fa-github"></i>
	</a>
	</small>
</footer>
			
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
