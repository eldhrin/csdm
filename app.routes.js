/**
 * Created by fl8328 on 26/07/2018.
 */
angular.module('routerRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider

    //home page
        .when('add/test',{
            templateUrl  : 'views/view/index.html',
            controller   : 'indexController',
            controllerAs : 'home'
        });

    $locationProvider.html5Mode(true);
});