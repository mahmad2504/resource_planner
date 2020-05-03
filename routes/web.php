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