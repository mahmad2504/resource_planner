<?php

namespace App;

class Projects
{
	private $projects=null;
	function __construct()
	{
		$this->db = ConnectDb();
		$this->collection = $this->db->projects;
	}
	function Get($user=null)
	{
		$cursor = $this->collection->find(['closed'=>0],['projection'=>['_id'=>0]]);
		
		$projects = $cursor->toArray();
		if( count($projects) ==0) 
		{
			dump("Database error");
			dd("Please send email to mumtaz_ahmad@mentor.com for an account");
		}
		$selected = [];
		
		foreach($projects as $project)
		{
			if($user != null)
			{
				if(in_array($user,(Array)$project->users))
					$selected[]=$project;
				else if($project->users[0]=='all')
					$selected[]=$project;
			}
			else
				$selected[]=$project;
		}
		if( count($selected) ==0) 
		{
			dump("Database error");
			dd("Please send email to mumtaz_ahmad@mentor.com for an account");
		}
		return $selected;	
	}
}
