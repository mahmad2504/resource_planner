<?php

namespace App;

class Projects
{
	private $projects=null;
	function __construct()
	{
		$d = file_get_contents('data/projects.txt');
		$d = str_replace("\r\n",'',$d);
		$d = json_decode($d);
		$this->projects = [];
		foreach($d as $project)
		{
			if($project->closed != 1)
				$this->projects[] = $project;
		}
		
		//foreach($d as $project)
		//	dump($project);	
	}
	function all()
	{
		return $this->projects;	
	}
	
}
