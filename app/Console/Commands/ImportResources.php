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
		$d = file_get_contents('resources.txt');
		$d = str_replace("\r\n",'',$d);
		$resources = json_decode($d);
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
