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
Route::get('/login', 'HomeController@Login')->name('login');
Route::get('/logout', 'HomeController@Logout')->name('logout');
Route::post('/authenticate', 'HomeController@Authenticate')->name('authenticate'); 
Route::get('/planner', 'HomeController@LoadPlanner')->name('planner'); 