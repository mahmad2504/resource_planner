<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>RMO - Mentor Graphics</title>
<link rel="stylesheet" href="{{ asset('css/jquery.2.7.1.contextMenu.min.css') }}" />
<link rel="stylesheet" href="{{ asset('css/font-awesome.4.7.0.min.css') }}" />
@yield('csslinks')
<style>
	@yield('style')
</style>
</head>
<body>
@yield('content')
<script src="{{ asset('js/svg.js') }}"></script>
<script src="{{ asset('js/core.3.1.9-1.min.js') }}" ></script>
<script src="{{ asset('js/md5.3.1.9-1.min.js') }}" ></script>
<script src="{{ asset('js/jquery-3.4.1.min.js') }}" ></script>
<script src="{{ asset('js/jquery.contextMenu.2.7.1.min.js') }}" ></script>
<script src="{{ asset('js/jquery.ui.2.7.1,position.js') }}" ></script>
<script>
@yield('script')
</script>
</body>
</html>




    

