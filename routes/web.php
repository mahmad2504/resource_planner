<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', 'HomeController@Planner')->name('home');
Route::get('/login', 'HomeController@Login')->name('login');
Route::get('/logout', 'HomeController@Logout')->name('logout');
Route::post('/authenticate', 'HomeController@Authenticate')->name('authenticate'); 
Route::get('/planner', 'HomeController@Planner')->name('planner'); 
Route::post('/save', 'HomeController@SaveRMO')->name('save'); 
Route::get('/load', 'HomeController@LoadRMO')->name('load'); 
Route::get('/projects', 'HomeController@Projects')->name('projects');
Route::get('/resources', 'HomeController@Resources')->name('resources');
Route::get('/search', 'HomeController@Search')->name('search');
Route::get('/project', 'HomeController@ProjectView')->name('projectview');


//her shareef aurat .... aik shareef mard ki bull side dekhna chahti hey...jo us ko bister per usterha istimaal karey jesay key aik aurat ka haq hey...do shareef insaan yeh baat kisi sey share nahin ker patey lekin kahin yeh cheez un key dimagh main chupi reh jati hey...main tumhari usi side main interested houn