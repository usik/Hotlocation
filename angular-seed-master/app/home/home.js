'use strict';

angular.module('myApp.home', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope','$location','CommonProp','$firebaseAuth',function($scope,$location,CommonProp,$firebaseAuth) {
 var firebaseObj = new Firebase("https://amber-torch-5013.firebaseio.com");
    var loginObj = $firebaseAuth(firebaseObj);
  
  $scope.user = {};
  var login={};
  $scope.login=login;

  $scope.SignIn = function(e) {
    login.loading= true;
    e.preventDefault();
    var username = $scope.user.email;
    var password = $scope.user.password;
    loginObj.$authWithPassword({
            email: username,
            password: password
        })
        .then(function(user) {
            //Success callback
            login.loading=false;
            console.log('Authentication successful');
	CommonProp.setUser(user.password.email);
		$location.path('/welcome');
        }, function(error) {
            //Failure callback
            login.loading=false;
            console.log('Authentication failure');
        });
}
}])
.service('CommonProp', function() {
    var user = '';
 
    return {
        getUser: function() {
            return user;
        },
        setUser: function(value) {
            user = value;
        }
    };
})
.directive('laddaLoading', [
    function(){
        return{
            link:function(scope,element,attrs){
                var Ladda=window.Ladda;
                var ladda = Ladda.create(element[0]);
                //Watching login.loading for change
                scope.$watch(attrs.laddaLoading, function(newVal, oldVal){
                    //based on the value start and stop the indicator
                    if(newVal){
                        ladda.start();
                    } else{
                        ladda.stop();
                    }
                });
            }
        };
    }

]);