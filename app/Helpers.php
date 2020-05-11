<?php
use \MongoDB\Client;
use \MongoDB\BSON\UTCDateTime;

function ConnectDb()
{
	$dbname = 'resource_planner';
	$mongoClient=new Client("mongodb://127.0.0.1");
	return $mongoClient->$dbname;
}
function Period()
{
	$obj =  new \StdClass();
	$obj->start = date('Y-m-d', strtotime(date('Y-m-01').' -3 MONTH'));
	$obj->end = date('Y-m-d', strtotime(date('Y-m-01').' +12 MONTH'));
	return $obj;
}