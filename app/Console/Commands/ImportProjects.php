<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Resources;

class ImportProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:projects';

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
        $db = ConnectDb();
		$file = fopen("projects.txt","r");
		$projects = [];
		while(!\feof($file))
		{
			$line = fgets($file);
			$line = str_replace("\r\n",'',$line);
			$fields = explode(":",$line);
			$obj =  new \StdClass();
			$obj->id=$fields[0];
			$obj->name=$fields[1];
			$obj->closed=0;
			if(!isset($fields[2]))
				$obj->closed=1;
			else
			{
				$users = explode(',',$fields[2]);
				$obj->users=$users;

			}
			$projects[] = $obj;
		}
		fclose($file);
		//$d = file_get_contents('projects.txt');
		//$d = str_replace("\r\n",'',$d);
		//$projects = json_decode($d);
		
		$expectedid=0;
		foreach($projects as $project)
		{
		    if($project->id != $expectedid++)
			{
				dd($project->name." has wrong id=".$project->id);
			}
		}
		$db->projects->drop();
		$db->projects->insertMany($projects);

    }
}
