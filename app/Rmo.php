<?php

namespace App;
class Rmo
{
	function __construct()
	{
		$this->db = ConnectDb();
		$this->collection = $this->db->rmo;
	}
	function GetOld($user)
	{
		$rmo = $this->collection->findOne(['owner'=>$user],['projection'=>['_id'=>0]]);
		if($rmo == null)
		{
			$da=json_decode('{"data":[],"nextindex":0}');
			$da->owner = $user;
			return $da;
		}
		$rmo->rmo->owner = $user;
		return $rmo->rmo;	
	}
	function Get($user)
	{
		$projection = ['projection'=>['_id'=>0]];
		$users = $this->db->resources->find(['manager'=>$user],$projection)->toArray();
		if(count($users)==0)
		{
			$da=json_decode('{"data":[],"nextindex":0}');
			$da->owner = $user;
			return $da;
		}

		$rmo = new \StdClass();
		$rmo->owner = $user;
		$rmo->data = [];
		foreach($users as $user)
		{
			$query = ['id'=>$user->id];
			$resource = $this->db->utilization->findOne($query,$projection);
			if($resource !=null)
				$rmo->data[] = $resource;
		}
		return $rmo;
	}
	function SearchOld($projectid)
	{
		$cursor = $this->collection->find(["rmo.data.projects.id"=>$projectid,"backup"=>['$ne'=>1]]);
		$teams = $cursor->toArray();
		$this->Filter($teams,$projectid);
		return $teams;
	}

	function Search($projectid)
	{
		$cursor = $this->db->utilization->find(["projects.id"=>$projectid]);
		$resources = $cursor->toArray();
		$this->Filter($resources,$projectid);
		return $resources;
	}
	function Filter($resources,$projectid)
	{
		$delr=[];
		$j=-1;
		foreach($resources as $resource)
		{
			$j++;
			$i=-1;
			$del = [];
			foreach($resource->projects as $project)
			{
				$i++;
				if($projectid != $project->id)
					$del[]=$i;
			}
			foreach($del as $index)
			{
				unset($resource->projects[$index]);
			}
			if(count($resource->projects)==0)
				$delr[]=$j;
		}
		foreach($delr as $index)
		{
			unset($resources[$index]);
		}

		return $resources;
	}
	public function  compare($a, $b)
	{
		return strnatcmp($a->week, $b->week);
	}
	private function Clean($rmo)
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
						if(count($project->utilization) > 0)
						{
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
						else
							$del[] =$i;		
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
	public function SaveOld($data)
	{
		$date =  new \DateTime();
		$obj = new \StdClass();
		$obj->rmo=$this->Clean($data);

		//dd($obj->rmo);
		$obj->owner=$data->owner;

		$query =['owner'=>$data->owner];
		$this->collection->updateOne($query,['$set'=>$obj],['upsert'=>true]);
		
		$obj->owner=$data->owner."_".$date->format('Y-m');
		$obj->backup = 1;
		$query =['owner'=>$obj->owner];
		$this->collection->updateOne($query,['$set'=>$obj],['upsert'=>true]);
	}
	public function Save($data)
	{
		$date =  new \DateTime();
		//$obj->rmo=$this->Clean($data);

		//dd($data);
		foreach($data->data as $resource)
		{
			//dd($resource);
			$query =['id'=> $resource->id];
			$this->db->utilization->updateOne($query,['$set'=>$resource],['upsert'=>true]);

		}
		return;
	}
}