<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Resources;

class Import extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import';

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
		$url = env("CONFIG_URL"); 
		$db = ConnectDb();
		echo "Importing Projects\r\n";
		$data = file_get_contents($url."?fetch=projects");
		$projects = json_decode($data);
		if(isset($projects->status))
			echo "Nothing to updates\r\n";
		else
		{
			foreach($projects as $project)
			{
				$project->closed = 0;
				if(count($project->manager)==0)
					$project->closed = 1;
			}
			$db->projects->drop();
			$db->projects->insertMany($projects);
		}
		echo "Importing Resources\r\n";
		$data = file_get_contents($url."?fetch=resources");
		$resources = json_decode($data);
		if(isset($resources->status))
			echo "Nothing to updates\r\n";
		else
		{
			$db->resources->drop();
			$db->resources->insertMany($resources);
		}
		echo "Done";
    }
}
