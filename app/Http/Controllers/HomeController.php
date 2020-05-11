<?php

namespace App\Http\Controllers;
use \MongoDB\Client;
use \MongoDB\BSON\UTCDateTime;

use Auth;
use Illuminate\Http\Request;
use Response;
use App\Ldap;
use App\Projects;
use App\Resources;
use App\Rmo;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
		
    }
	public function Logout(Request $request)
	{
		$request->session()->forget('data');
		echo "Your are logged out of system";
		return redirect('login');
		//return view('login');
	}
	public function Login(Request $request)
	{
		return view('login');
	}
	public function Authenticate(Request $request)
	{
		//dump($request->data);
		if(!isset($request->data['USER'])||!isset($request->data['PASSWORD']))
			return Response::json(['error' => 'Invalid Credentials'], 404); 
		$ldap =  new Ldap();
		$data = $ldap->Login($request->data['USER'],$request->data['PASSWORD']);
		if($data== null)
		{
			$request->session()->forget('data');
			return Response::json(['error' => 'Invalid Credentials'], 404); 
		}
		else
			$request->session()->put('data', $data);
		
		return [];
		//return $data->user_displayname;
	}
    public function Planner(Request $request)
    {
		$data = $request->session()->get('data');
		if($data == null)
			return view('login');
		if(!isset($data->user_name))
			return view('login');
        $displayname=$data->user_displayname;
		$projects = new Projects();
		$projects = $projects->Get();
		
		$resources = new Resources();
		$resources = $resources->Get($data->user_name);
		$rmo = new Rmo();
	   	$rmo = $rmo->Get($data->user_name);
		//$rmo = json_decode($rmo);
		$rmo->start = Period()->start;
		$rmo->end = Period()->end;
		
		return view('planner',compact('rmo','displayname','projects','resources'));
    }
	public function ProjectView(Request $request)
    {
		$rmo =  new Rmo();
		dd($rmo->Search($request->projectid));
		return view('view.project');
    }
	public function SaveRMO(Request $request)
	{
		$data = json_decode($request->rmo);
		$rmo =  new Rmo();
		$rmo ->Save($data);
		return Response::json(['status' => 'OK']); 
	}
	
	public function Projects(Request $request)
	{
		$projects = new Projects();
		return $projects->Get();
	}
	public function Resources(Request $request)
	{
		$data = $request->session()->get('data');
		$resources = new Resources();
		if($data == null)
			return $resources->Get();
		else
			return $resources->Get($data->user_name);
	}
}
