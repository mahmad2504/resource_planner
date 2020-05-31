<?php

namespace App;

class Resources
{
	private $resources=null;
	function __construct()
	{
		$this->db = ConnectDb();
		$this->collection = $this->db->resources;
	}
	function Get($user=null)
	{
		if($user==null)
		{
			$cursor = $this->collection->find([],['projection'=>['_id'=>0]]);
			return $cursor->toArray();
		}
		else
		{
			$query=['manager'=>['$in'=>[$user,'all']]];
			$cursor = $this->collection->find($query,['projection'=>['_id'=>0]]);
			$users = $cursor->toArray();
			if( count($users) ==0) 
			{
				{
					dump("202 Unauthroized Access");
					dd("Please send email to mumtaz_ahmad@mentor.com for an account");
				}
			}
			//$u->manager = $users; 
			//dd($users);
			return $users;
		}
	}
}
