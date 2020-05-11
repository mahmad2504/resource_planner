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
	function Get()
	{
		$cursor = $this->collection->find(['closed'=>"0"],['projection'=>['_id'=>0]]);
		$projects = $cursor->toArray();
		if( count($projects) ==0) 
		{
			dump("Database error");
			dd("Please send email to mumtaz_ahmad@mentor.com for an account");
		}
		return $projects;	
	}
}
