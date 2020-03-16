<?php

namespace App\Http\Controllers;
use \MongoDB\Client;
use \MongoDB\BSON\UTCDateTime;

use Auth;
use Illuminate\Http\Request;
use Response;
use App\Ldap;
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
    public function LoadPlanner(Request $request)
    {
        $data = $request->session()->get('data');
		if($data == null)
			return view('login');
		if(!isset($data->user_name))
			return view('login');
        $displayname=$data->user_displayname;
		return view('planner',compact('displayname'));
    }
}
