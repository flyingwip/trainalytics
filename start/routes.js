'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.get('/', 'StravaController.index');


Route.on('/signup').render('auth.signup');
Route.on('/login').render('auth.login');
Route.post('/signup', 'UserController.create').validator('CreateUser');
Route.get('/logout', async ({ auth, response }) => {
    await auth.logout();
    return response.redirect('/login');
});
Route.post('/login', 'UserController.login').validator('LoginUser');

Route.get('/connect', 'StravaController.connect').middleware(['auth'])
Route.on('/home').render('home')


