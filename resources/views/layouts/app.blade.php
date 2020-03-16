<!DOCTYPE html>
<html class="no-js" lang="en">
<head>
<script>window.mgcap = {"language":"English","executionTime":36,"server":"www.mentor.com","property":"mentor","pagename":"Embedded Software:Internet of Things:Security","cached":true,"platform":"mentor","designArea":"Embedded Software","externalSource":"direct","legacy":{"executionTime":"0-50 ms","hier1":"Embedded Software,Internet of Things,Security,Security","channel":"products:embedded software","classificatonKey":"EmbeddedSoftware","ovisitorid":"1580547162105CFF731735168D7798CBBE78DA6B615E566501AEDE2D813CA2896D09521503919","pageCategory":"Product"},"signedInStatus":"Anonymous","page":{"id":"21c6d4f6-4aaf-4fa6-8bb3-bc84b295f87c"}}</script><script>window.mgcap_events = {"event22":"download_student_guide","event5":"collateral_view","event25":"internal_campaign_clickthru","event18":"profile_questions","event24":"contact_us","event8":"account_form","event30":"video_25","event27":"video_view","event23":"course_request","event10":"course_view","event1":"offer_overview","event21":"download_course_catalog","event6":"overview_listing","event4":"opt_in","event2":"offer_form","event7":"overview_detail","event29":"video_segment_view","event26":"video_time_viewed","event3":"interaction","event28":"video_complete","event11":"course_schedule","event31":"video_50","event19":"web_seminar_attend","event32":"video_75"}</script><script>(function(i,s,o,g,r,a,m){i['AnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://cdn.data.mentor.com/dev/net.min.js','mgca');mgca('create',{platform:'mentor',MENTOR_KEY:'pt878PhnIR6nvPa1nTQpvFfc84Wlj1w1jhBCLGd1',env:'production'});</script>
<meta http-equiv=X-UA-Compatible content="IE=Edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@mentor_graphics" />
<meta name="twitter:creator" content="@mentor_graphics" />
<meta property="og:title" content="Security" />
<meta property="og:description" content="Mentor has focused embedded security strategies in Security Services Teams, Software Development and Quality Process, and Security Technologies" />
<meta property="og:image" content="" />
<meta property="og:url" content="https://www.mentor.com/embedded-software/iot/security" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en" />
<title>Security - Mentor Graphics</title>
<meta name="Description" id="Description" content="Mentor has focused embedded security strategies in Security Services Teams, Software Development and Quality Process, and Security Technologies" />
<meta name="EntityType" id="EntityType" content="" />
<meta name="SubsiteType" id="SubsiteType" content="" />
<meta name="LastModified" id="LastModified" content="2019-01-31" />
<meta name="DesignArea" id="DesignArea" content="Embedded Software" />
<meta name="Section" id="Section" content="" />
<link rel="alternate" type="application/rss+xml" title="RSS" href="/embedded-software/feed/">
<meta name="bn_designarea" content="3b3d43ac-bb64-4e78-94c5-f0f27d550ce0" />
<link type="text/css" rel="stylesheet" href="{{ asset('css/mgc_agg.css') }}" />
<link type="text/css" rel="stylesheet" href="{{ asset('css/mgc-icons-legacy.css') }}" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=aljPzogMmq">
<link rel="icon" type="image/png" href="/favicon-32x32.png?v=aljPzogMmq" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16x16.png?v=aljPzogMmq" sizes="16x16">
<link rel="mask-icon" href="/safari-pinned-tab.svg?v=aljPzogMmq" color="#3769ac">
<link rel="shortcut icon" href="/favicon.ico?v=aljPzogMmq">
@yield('csslinks')
<style>
	@yield('style')
</style>
<meta name="theme-color" content="#ffffff">
</head>
<body class=" mgc flex-body products">

<header class="header-main bg-secondary flex-none" role="navigation">
<!-- **************************************************************************** -->
<!-- The Modal -->
<div id="modal" class="modal">
  <!-- Modal content -->
  <div class="modal-content" style="width:60%;margin: auto;">
    <span id="closemodal" class="close">&times;</span>
    <h3 id="cve_title"></h3>
	<h4>Description</h4>
	<p id="cve_description"></p>
	<div  class="card card-block" style="margin-bottom:0px;">
		<div>
			<small style="float:left;margin-top:-10px;"><span style="font-weight:bold;">Vector: </span><span id="cvss_vector"></span></small>
			<small style="float:right;margin-top:-10px;"><span style="font-weight:bold;">Attack Vector: </span><small id="cvss_attackvector"></small></small>
		</div>
		<br>
		<div>
			<small style="float:left;margin-top:-10px;"><span style="font-weight:bold;">Score: </span><span id="cvss_basescore"></span></small>
			<small style="float:right;margin-top:-10px;"><span style="font-weight:bold;">Severity: </span><small id="cvss_severity"></small></small>
		</div>
		<br>
		<div>
			<small style="float:left;margin-top:-10px;"><span style="font-weight:bold;">Published: </span><span id="cve_published"></span></small>
			<small style="float:right;margin-top:-10px;"><span style="font-weight:bold;">Modified: </span><small id="cve_modified"></small></small>
		</div>
	</div>

	<h4 style="margin-top:5px;">Products Affected</h4>
	<div id="package_table"></div>
	<hr>
	<small style="font-size:10px;margin-top:0px;float:right">Find out more about <span style="font-weight:bold;" id="cve_number"></span> from the <a id="mitre_link">MITRE-CVE</a> dictionary and <a id="nvd_link">NIST NVD</a></small>

	
  </div>
</div>
<!-- **************************************************************************** -->
<div class="header-main-logo">
<a class="logo-mentor m-t-xs" href="https://mentor.com"><span class="sr-only">Mentor, A Siemens Business</span></a>
</div>

<div id="user" class="header-main-ancillary m-l-auto text-inverse user">
    <div>
        <svg class="icon icon-user icon-circle-border" aria-hidden="true"><use xlink:href="#icon-user"></use></svg> <a href=''>{{$displayname}}</a> | <a href="{{route('logout')}}">Logout</a>
    </div>
</div>

</header>

<div id="content" class="flex-content">
<div class="bg-white border-bottom text-webfont-one m-b-md">
<div class="container position-relative">

</div>
</div>
<div  id="copy" class="container">
<br>
@yield('content')
</div>
</div>
<footer class="footer-section flex-none text-webfont-one">

</footer>
<!--pageElement:FOOTER-->
<footer class="footer-site flex-none">
<div class="container">
<div class="row-flex middle-md">
<div class="col-md-8 col-xs-12 text-center text-lg-left">
<p class="text-xs">

</p>
<p class="text-xs m-b-md m-lg-b-0">Designed and Implemented By Mumtaz_Ahmad, Embedded Platform Solutions </p>
<p class="text-xs m-b-md m-lg-b-0">&copy; Mentor, a Siemens Business, All rights reserved</p>
</div>
<div class="col-md-4 col-xs-12 text-center text-lg-right text-xs">
<div class="m-b" id="footer-site-social-links">
<h3 class="text-uc m-b-sm">Follow Mentor</h3>
<a href="http://www.linkedin.com/company/mentor_graphics" class="circle circle-md bg-opaque-light m-x-xs"><svg class="icon icon-linkedin2"><use xlink:href="#icon-linkedin2"></use></svg></a>
<a href="https://twitter.com/mentor_graphics" class="circle circle-md bg-opaque-light m-x-xs"><svg class="icon icon-twitter"><use xlink:href="#icon-twitter"></use></svg></a>
<a href="https://www.facebook.com/pages/Mentor-Graphics/362609027104610" class="circle circle-md bg-opaque-light m-x-xs"><svg class="icon icon-facebook"><use xlink:href="#icon-facebook"></use></svg></a>
<a href="http://www.youtube.com/channel/UC6glMEaanKWD86NEjwbtgfg" class="circle circle-md bg-opaque-light m-x-xs"><svg class="icon icon-youtube"><use xlink:href="#icon-youtube"></use></svg></a>
<a href="https://plus.google.com/b/102197424811444669688/102197424811444669688/posts" class="circle circle-md bg-opaque-light m-x-xs"><svg class="icon icon-google-plus"><use xlink:href="#icon-google-plus"></use></svg></a>
</div>
<p class="m-b-0"><a class="text-white p-r-sm text-emphasis text-no-underline" href="tel:+18005473000">1-800-547-3000</a> <a href="/company/contact_us" class="btn btn-sm btn-info">Contact Mentor</a></p>
</div>
</div>
</div>
</footer>
<!--/pageElement:FOOTER-->
<div class="bg-info text-inverse p-a raised-lg" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index: 2000" id="cookieBanner">
<div class="container-lg item-flex item-flex-responsive">
<div class="item-flex-main p-r-md">This site uses cookies to improve your user experience and to provide you with content we believe will be of interest to you. Detailed information on the use of cookies on this website is provided in our <a href="/terms_conditions/privacy" class=“text-underline”>Privacy Policy</a>. By using this website, you consent to the use of our cookies.</div>
<button id="cookieConsent" class="btn btn-inverse-outline btn-sm btn-pill item-flex"><svg class="icon icon-cross2 text-lg m-r-xs"><use xlink:href="#icon-cross2"></use></svg> <span class="text-muted">Ok, don't show me this again</span></button>
</div>
</div>
<!--pageElement:PAGETAGGING-->


<!-- Scroll To Top -->
<a href="#top" id="scrollToTop" class="scroll-top" title="Scroll to Top"><svg class="icon icon-arrow-up3" aria-hidden="true"><use xlink:href="#icon-arrow-up3"></use></svg></a>
<div id="mgc-player-wrapper">
<div id="mgc-player" class="mgc-player"></div>
</div>
<!-- //// MGC PAGE END //// -->
<script src="{{ asset('js/svg.js') }}"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script>
@yield('script')
</script>
</body>
</html>




    

