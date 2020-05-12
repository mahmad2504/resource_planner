<?php

namespace App\Console\Commands;

use \MongoDB\Client;
use \MongoDB\BSON\UTCDateTime;
use Illuminate\Console\Command;

class ImportResources extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:resources';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
	
    public function __construct()
    {
        parent::__construct();
		
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
		$db = ConnectDb();
		
		$file = fopen("resources.txt","r");
		$resources = [];
		while(!\feof($file))
		{
			$line = fgets($file);
			$line = str_replace("\r\n",'',$line);
			$fields = explode(":",$line);
			$obj =  new \StdClass();
			$obj->id=$fields[0];
			$obj->name=$fields[1];
			$obj->manager=$fields[2];
			$resources[] = $obj;
		}
		fclose($file);
		$expectedid = 0;
		foreach($resources as $resource)
		{
		    if($resource->id != $expectedid++)
			{
				dd($resource->name." has wrong id=".$resource->id);
			}
			if(!isset($resource->manager))
			{
				dd($resource->name." has no manager");
			}
		}
		$db->resources->drop();
		$db->resources->insertMany($resources);
    }
}
