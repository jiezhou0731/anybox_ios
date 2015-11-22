// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'app.services'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.tabs.style('striped');

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: "LoginCtrl"
            })
            .state('signIn', {
                url: "/signIn",
                templateUrl: "templates/signIn.html",
                controller: "SignInCtrl"
            })
            .state('signUp', {
                url: "/signUp",
                templateUrl: "templates/signUp.html",
                controller: "SignUpCtrl"
            })
            .state('login.sns', {
                url: "/loginSns",
                templateUrl: "templates/loginSns.html",
                controller: "LoginSnsCtrl"
            })
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.food', {
                url: "/food",
                views: {
                    'menuContent': {
                        templateUrl: "templates/food.html",
                        controller: 'FoodCtrl'
                    }
                }
            })
             .state('app.foodDetail', {
                url: "/foodDetail",
                views: {
                    'menuContent': {
                        templateUrl: "templates/foodDetail.html",
                        controller: 'FoodDetailCtrl'
                    }
                }
            })
            
            .state('app.profile', {
                url: "/profile",
                views: {
                    'menuContent': {
                        templateUrl: "templates/profile.html",
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('app.promoCode', {
                url: "/promoCode",
                views: {
                    'menuContent': {
                        templateUrl: "templates/promoCode.html",
                        controller: 'PromoCodeCtrl'
                        /*
                        resolve: {
                            authData: ["Auth", function (Auth) {
                                return Auth.$requireAuth();
                            }],
                        }*/
                    }
                }
            })
            .state('app.payment', {
                url: "/payment",
                views: {
                    'menuContent': {
                        templateUrl: "templates/payment.html",
                        controller: 'PaymentCtrl'
                    }
                }
            })
            .state('app.success', {
                url: "/success",
                views: {
                    'menuContent': {
                        templateUrl: "templates/success.html",
                        controller: 'SuccessCtrl'
                    }
                }
            })
            .state('app.freeLunch', {
                url: "/freeLunch",
                views: {
                    'menuContent': {
                        templateUrl: "templates/freeLunch.html",
                        controller: 'FreeLunchCtrl'
                    }
                }
            })
            .state('app.help', {
                url: "/help",
                views: {
                    'menuContent': {
                        templateUrl: "templates/help.html"
                    }
                }
            })
            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/settings.html"
                    }
                }
            })
            .state('app.historyOrder', {
                url: "/historyOrder",
                views: {
                    'menuContent': {
                        templateUrl: "templates/historyOrder.html",
                        controller: 'HistoryOrderCtrl',
                    }
                }
            })
            .state('app.order', {
                url: "/order",
                views: {
                    'menuContent': {
                        templateUrl: "templates/order.html",
                        controller: 'OrderCtrl',
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('login');
        //$urlRouterProvider.otherwise('app.home');
    });
