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
	public function ConnectDb()
	{
		$dbname = 'resource_planner';
		$mongoClient=new Client("mongodb://127.0.0.1");
		$this->db = $mongoClient->$dbname;
		$collection = 'resources';	
		$this->collection = $this->db->$collection;
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
		$projects = $projects->all();
		
		$resources = new Resources();
		$resources = $resources->useronly($data->user_name);
		
		$start = date('Y-m-d', strtotime(date('Y-m-01').' -3 MONTH'));
		$end = date('Y-m-d', strtotime(date('Y-m-01').' +12 MONTH'));
		
		
	//dd($projects);
		if(file_exists('data/'.$data->user_name."/rmo/latest"))
			$data = file_get_contents('data/'.$data->user_name."/rmo/latest");
		else
			$data = '{"data":[]}';
		
		
		$rmo = json_decode($data);
		$rmo->start = $start;
		$rmo->end = $end;

		return view('planner',compact('rmo','displayname','projects','resources'));
    }
	public function ProjectView(Request $request)
    {
		return view('view.project');
    }
	public function LoadRMO(Request $request)
	{
		$data = $request->session()->get('data');
		if($data == null)
			return Response::json(['status' => 'Error'], 404); 
		$data = file_get_contents('data/'.$data->user_name."/rmo/latest");
		dd(json_decode($data));
	}
	public function  compare($a, $b)
	{
		return strnatcmp($a->week, $b->week);
	}
	public function CleanRMO($rmo)
	{
		$start = date('Y-m-d', strtotime(date('Y-m-01').' -12 MONTH'));
		
		$week = new \DateTime($start);
		$week = $week->format("W");
		
		$year = new \DateTime($start);
		$year = $year->format("Y");
	
		$start_week = $year."_".$week;
		
		$nextindex=0;
		foreach($rmo->data as &$resource)
		{
			$i=-1;
			if(isset($resource->projects))
			{
				$del = [];
				foreach($resource->projects as $project)
				{
					$i++;
					if(!isset($project->utilization))
					{
						$del[] =$i;
					}
					else
					{
						usort($project->utilization, [$this,'compare']);
						$nextindex = $project->index+1;
						 
						$last_week = $project->utilization[count($project->utilization)-1]->week;
						if(strlen($last_week)==6)
							$last_week = str_replace('_','_0',$last_week);
						//dump($project->name." ".$last_week." ".$start_week);
						if($last_week < $start_week)
						{
							$del[] =$i;
							//echo "removing ".$project->id."<br>";
						} 
					}	
				}
				//dump($del);
				foreach($del as $index)
				{
					//echo $index."\r\n";
					unset($resource->projects[$index]);
				}
			}
		}
		return $rmo;
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
		$rmo = $this->CleanRMO(json_decode($request->rmo));
		
		//dump($rmo);
		//echo $rmofolder;
		file_put_contents($rmofolder."/latest",json_encode($rmo));
		file_put_contents($rmofolder."/".$filename,json_encode($rmo));
		$this->ConnectDb();
		$obj = new \StdClass();
		$obj->rmo=$rmo;
		$obj->owner=$data->user_name;
		$query =['owner'=>$data->user_name];
		$this->collection->updateOne($query,['$set'=>$obj],['upsert'=>true]);
		return Response::json(['status' => 'OK']); 
	}
	public function Search(Request $request)
	{
		$this->ConnectDb();
		if($request->projectid != null)
		{
			$cursor = $this->collection->find(["rmo.data.projects.id"=>$request->projectid]);
			$teams = $cursor->toArray();
			
		}
		else
			return [];
		
		foreach($teams as $team)
		{
			$delr = [];
			for($j=0;$j<count($team->rmo->data);$j++)
			{
				$resource=$team->rmo->data[$j];
				$del = [];
				for($k=0;$k<count($resource->projects);$k++)
				{
					$project = $resource->projects[$k];
					if($project->id != $request->projectid)
						$del[] = $k;
				}
				//dump($resource->projects);
				foreach($del as $index)
				{
					unset($resource->projects[$index]);
				}
				if(count($resource->projects)==0)
				{
					$delr[] = $j;
				}
				//dump($resource->projects);
			}
			foreach($delr as $index)
			{
				unset($team->rmo->data[$index]);
			}
			
		}
		return $teams;
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
