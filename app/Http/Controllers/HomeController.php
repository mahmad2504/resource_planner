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
		$projects = $projects->all();
		
		$resources = new Resources();
		$resources = $resources->useronly($data->user_name);
		
	//dd($projects);
		if(file_exists('data/'.$data->user_name."/rmo/latest"))
			$data = file_get_contents('data/'.$data->user_name."/rmo/latest");
		else
			$data = '{"data":[]}';
		$rmo = json_decode($data);
		//dd(json_decode($rmo));
		return view('planner',compact('rmo','displayname','projects','resources'));
    }
	public function LoadRMO(Request $request)
	{
		$data = $request->session()->get('data');
		if($data == null)
			return Response::json(['status' => 'Error'], 404); 
		$data = file_get_contents('data/'.$data->user_name."/rmo/latest");
		dd(json_decode($data));
	}
	public function SaveRMO(Request $request)
	{
		$date =  new \DateTime();
		$data = $request->session()->get('data');
		if($data == null)
			return Response::json(['status' => 'Error'], 404); 
		$rmofolder='data/'.$data->user_name."/rmo";
		
		if(!file_exists($rmofolder))
			mkdir($rmofolder, 0, true);
		
		
		
		//echo $data->user_name;
		$filename = $date->format('Y-m');
		file_put_contents($rmofolder."/latest",json_encode($request->rmo));
		file_put_contents($rmofolder."/".$filename,json_encode($request->rmo));
			return Response::json(['status' => 'OK']); 
	}
	public function Projects(Request $request)
	{
		$data = $request->session()->get('data');
		if($data == null)
			return Response::json(['status' => 'Error'], 404);
		$projects = new Projects();
		return $projects->all();
		//$conf='data/'.$data->user_name."/conf";
		//file_get_contents(
	}
	public function Resources(Request $request)
	{
		$data = $request->session()->get('data');
		if($data == null)
			return Response::json(['status' => 'Error'], 404);
		$resources = new Resources();
		if($request->my == 1)
			return $resources->useronly($data->user_name);
		else
			return $resources->all();
	}
}
