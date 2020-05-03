<?php

namespace App;

class Resources
{
	private $resources=null;
	function __construct()
	{
		$d = file_get_contents('data/resources.txt');
		$d = str_replace("\r\n",'',$d);
		$this->resources = json_decode($d);
		//$this->resources = [];
	}
	function all()
	{
		return $this->resources;	
	}
	function useronly($user)
	{
		$file='data/'.$user."/resources.txt";
		if(!file_exists($file))
		{
			dump("202 Unauthroized Access");
			dd("Please send email to mumtaz_ahmad@mentor.com for an account");
		}
		$content = file_get_contents($file);
		$content = str_replace("\r\n",'',$content);
		$users = explode(",",$content);
		
		$resources = [];
		foreach($users as $user)
		{
			$found=0;

			foreach($this->resources as $resource)
			{
				if(strtolower($resource->name)==strtolower($user))
				{
					$resources[] = $resource;
					$found=1;
					break;
				}
			}
			 if($found==0)
			{
				dd($user." Not valid");
			}
		}
		return $resources;
	}
}
