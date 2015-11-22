angular.module('starter.controllers', ["app.services", "numberPicker","fieldEditor"])

.controller('FacadeCtrl', function (Auth, $state) {
  /* Leave empty */
})

.controller('LoginCtrl', function (LocalStore,$window, UserManager, Auth, Toast, $scope, $state, $ionicModal, $ionicPopup, $ionicLoading, $rootScope) {
 LocalStore.set("profile",{});
 $scope.showSignIn = function(){
	 $window.location.href = '#/signIn';
 }
 $scope.showSignUp = function(){
	 $window.location.href = '#/signUp';
 }
})

.controller('SignInCtrl', function (LocalStore,UserManager, Auth, Toast, $scope, $state, $ionicLoading, $rootScope) {
  $scope.loginData = {};
  $scope.resetPassword = {};

  $scope.signIn = function () {
	  console.log($scope.loginData.email);
    if (!$scope.loginData.email) {
      Toast.warning("Please input email.");
      return;
    }

    if (!$scope.loginData.password) {
      Toast.warning("Please input password.");
      return;
    }

    $ionicLoading.show({
      template: 'Loading...'
    });
    Auth.signIn($scope.loginData).then(function (response) {
    	console.log("User Login");
    	console.log(response);
      LocalStore.set("profile",response.data);
      console.log(response.data);
      $rootScope.menu={};
      $rootScope.menu.userName=response.data.firstName+" "+response.data.lastName;
      $state.go("app.home");
    }).catch(function (error) {
      Toast.error("Error");
    }).finally(function () {
      $ionicLoading.hide();
    });
  };

  $scope.showForgetPassword = function () {
    $ionicPopup.show({
      title: "Reset Password",
      template: '<label class="item item-input"><input type="text" placeholder="Registered Email" ng-model="resetPassword.email"></label>',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Reset</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.resetPassword.email) {
            Toast.warning("Please input your registered email.");
            e.preventDefault();
            return;
          }

          Auth.$resetPassword($scope.resetPassword).then(function () {
            Toast.success("Password reset email sent successfully!");
          }).catch(function (error) {
            Toast.warning(error.message);
          });
        }
      }]
    });
  };

})

.controller('SignUpCtrl', function (LocalStore,UserManager, Auth, Toast, $scope, $state, $ionicLoading, $rootScope) {
  $scope.loginData = {};
  $scope.resetPassword = {};

  $scope.signUp = function () {
	    if (!$scope.loginData.email || $scope.loginData.email.indexOf("@")==-1) {
	      Toast.warning("Please input valid email.");
	      return;
	    }

	    if (!$scope.loginData.password) {
	      Toast.warning("Please input password.");
	      return;
	    }

		var phoneno = /^\d{10}$/;  
  		if(!($scope.loginData.phoneNumber.match(phoneno))) {
		  Toast.warning("Please input valid phone number.");
	      return;
  		}

	    Auth.signUp($scope.loginData).then(function (response) {
	      LocalStore.set("profile",response.data);
	      $rootScope.menu={};
	      $rootScope.menu.userName=response.data.firstName+" "+response.data.lastName;
	      $state.go("app.home");
	    }).catch(function (error) {
	      Toast.error(error.message);
	    });
};
})

.controller('AppCtrl', function (Auth, $scope, $http,$window,$rootScope,LocalStore) {
  $rootScope.window=$window;
  $scope.login = function () {
    Auth.$unauth();
  };
})

.controller('MenuCtrl', function ($ionicHistory,Auth, $scope, $http,$window,$rootScope,LocalStore,$state) {
  $scope.userName=LocalStore.get("profile").firstName+" "+LocalStore.get("profile").lastName;

  $scope.$on("profileUpdate",function(){
  	$scope.userName=LocalStore.get("profile").firstName+" "+LocalStore.get("profile").lastName;
  })

  $scope.login = function () {
    Auth.$unauth();
  };
})

.controller('HomeCtrl', function (LocalStore, HomepageManager, $window, $scope,$rootScope, $ionicModal,$state, $ionicSlideBoxDelegate) {
  HomepageManager.getList().then(function(response){
	  console.log(response.data);
	  $rootScope.homepageList = response.data;  
	  $ionicSlideBoxDelegate.update();
  });
  

  $scope.slideChange = function(){
  }

  $rootScope.foodDetailHtml=LocalStore.get("foodDetailHtml");

  $scope.slideClick= function(productId){
  	$rootScope.foodDetailHtml.productId=productId; 
	  LocalStore.set("foodDetailHtml",$rootScope.foodDetailHtml);
	  $window.location.href = '#/app/foodDetail';
  }

  $rootScope.state=$state;
})

.controller('FoodCtrl', function (DateSel, OrderManager, $scope,$rootScope, $ionicModal, $window, LocalStore) {
  $rootScope.foodDetailHtml=LocalStore.get("foodDetailHtml");
  $scope.clickProductImage = function(productId){
	  $rootScope.foodDetailHtml.productId=productId; 
	  LocalStore.set("foodDetailHtml",$rootScope.foodDetailHtml);
	  $window.location.href = '#/app/foodDetail';
  }

  $scope.imageDomainUrl=url.domain;
  
  $rootScope.days = DateSel.days;
  $scope.getSelectedDate = DateSel.getSelectedDate;
  
  $rootScope.selectDateIndex = function(index){
	  DateSel.selectDateIndex(index);
	  OrderManager.getOrder(DateSel.getSelectedDate());
  };
  
  OrderManager.getOrder(DateSel.getSelectedDate());

  $scope.getTabTitle = function (tabName){
	  var number = $rootScope.OrderManager.getItemNumber();
	  if (number[tabName]==0){
		  return $scope.capFirstLetter(tabName);
	  } else {
		  return $scope.capFirstLetter(tabName)+" ("+number[tabName]+")";
	  }
  }

  $scope.capFirstLetter=function(st){
 	 return st.replace(/^./, function (match) {
     return match.toUpperCase();
  	});
  }
})

.controller('FoodDetailCtrl', function (DateSel, OrderManager, $scope,$rootScope, $ionicModal, $window,LocalStore) {
  $rootScope.foodDetailHtml=LocalStore.get("foodDetailHtml");
 
console.log( $rootScope.foodDetailHtml.productId);
  $scope.imageDomainUrl=url.domain;
  
  $rootScope.days = DateSel.days;
  $scope.getSelectedDate = DateSel.getSelectedDate;
  
  $rootScope.selectDateIndex = function(index){
	  DateSel.selectDateIndex(index);
	  OrderManager.getOrder(DateSel.getSelectedDate());
  };
  
  OrderManager.getOrder(DateSel.getSelectedDate());

  $scope.getTabTitle = function (tabName){
	  var number = $rootScope.OrderManager.getItemNumber();
	  if (number[tabName]==0){
		  return $scope.capFirstLetter(tabName);
	  } else {
		  return $scope.capFirstLetter(tabName)+" ("+number[tabName]+")";
	  }
  }

  $scope.capFirstLetter=function(st){
 	 return st.replace(/^./, function (match) {
     return match.toUpperCase();
  	});
  }
})

.controller('OrderCtrl', function ($ionicHistory,$state,OrderManager, DateSel, $scope,$rootScope, $ionicPopup,$window) {
	$rootScope.OrderManager.getFreeLunchList().then(function(response){
		console.log(response.data);
		$rootScope.OrderManager.freeLunchList=response.data;
	});
	
	$scope.roundToCent=function(real){
		return roundToCent(real);
	}
	$scope.clickSelectPayment = function(){
		$ionicHistory.nextViewOptions({
		  disableAnimate: true,
		  disableBack: true
		});
		$state.go("app.success");
		return;
		$rootScope.OrderManager.placeOrder().then(function(response){
			$rootScope.OrderManager.currentOrderId=response.data.id;
			console.log(response.data);
			$window.location.href = '#/app/payment';
		});
	}
	
	$rootScope.OrderManager.freeLunchId=0;

	$scope.timestampToDate = function(timestamp){
		return timestampToDate(timestamp);
	}
	$scope.showPopup = function() {
		var title="No free lunch available"
		if ($rootScope.OrderManager.freeLunchList.length==1){
			title="1 free lunch available";
		} else if ($rootScope.OrderManager.freeLunchList.length>1){
			title=$rootScope.OrderManager.freeLunchList.length +" free lunches available"
		}
		 var myPopup = $ionicPopup.show({
			    templateUrl:'templates/selectFreeLunch.html',
			    //subTitle: 'Please use normal things',
			    scope: $scope,
			    buttons: [
			      { text: 'CANCEL' },
			      {
			        text: '<b>APPLY</b>',
			        type: 'button-positive',
			        onTap: function(e) {
			        	 myPopup.close(); 
			        }
			      }
			    ]
			  });
	};
	$scope.clickFreeLunch = function(clickedId){
		for (var i=0; i<=$rootScope.OrderManager.freeLunchList.length; i++){
			$("#select_lunch_"+i).hide();
		}
		console.log(clickedId);
		$("#select_lunch_"+clickedId).show();
	}
	  
  $scope.greaterThan = function(prop, val){
	    return function(item){
	      return item[prop] > val;
	    }
  }
  
  $rootScope.getShortDate = function getShortDate(date){
		var arr=date.split(" ");
		var shortDate=arr[0]+", "+arr[1]+" "+arr[2];
		return shortDate;
	}
})

.controller('HistoryOrderCtrl', function ($scope,$rootScope, OrderManager) {
	$rootScope.OrderManager.getHistoryOrder().then(function(response){
		var historyOrder = [];
		for (var i=0; i<response.data.length; i++){
			for (var j=0; j<response.data[i].detail.length; j++){
				historyOrder.push(response.data[i].detail[j]);
			}
		}
		$rootScope.OrderManager.historyOrder=historyOrder;
	});
	
	$scope.getDates=function(dateType){
		var dates =[];
		if ($rootScope.OrderManager.historyOrder!=undefined) {
			for (var i=0; i<$rootScope.OrderManager.historyOrder.length; i++){
				console.log($rootScope.OrderManager.historyOrder[i][dateType]);
				var dateStr = timestampToDate($rootScope.OrderManager.historyOrder[i][dateType]);
				if (dates.indexOf(dateStr)==-1){
					dates.push(dateStr);
				}
			}
		}
		return dates;
	}
	
	$scope.sameDateAs = function(dateType,val){
	    return function(item){
	      return timestampToDate(item[dateType]) == val;
	    }
	}
	
	$scope.timestamp = function(){
	    return function(item){
	      return dateToTimestamp(item);
	    }
	}
})

.controller('SuccessCtrl', function ($scope,$rootScope, $state, $ionicHistory) {
 	 $scope.clickInvite=function(){
 	 	$state.go("app.freeLunch");
 	 }

 	 $scope.clickReturnHome=function(){
 	 	$ionicHistory.nextViewOptions({
		  disableAnimate: true,
		  disableBack: true
		});
 	 	$state.go("app.home");
 	 }
})

.controller('ProfileCtrl', function ($scope, UserManager, $rootScope,LocalStore, $ionicHistory, $state) {
	if (LocalStore.get("profile").id!=undefined) {
		$rootScope.UserManager.getProfile().then(function(response){
			$rootScope.UserManager.profile=response.data.profile;
		});
	}

	$scope.clickLogout = function(){
	  	$ionicHistory.nextViewOptions({
			  disableAnimate: true,
			  disableBack: true
			});
	  	$state.go("login");
	}

	$scope.userData=LocalStore.get("profile");
	$scope.clickSubmit = function(){
	}
	
	$scope.isEditing=-1;
	$scope.clickEdit = function(){
		$scope.isEditing=-$scope.isEditing;
	}

	$scope.clickSave = function () {
		UserManager.editProfile($scope.userData).then(function(response){
			LocalStore.set("profile",response.data);
			$rootScope.$broadcast("profileUpdate");
		});
		$scope.isEditing=-1;
	};

	$scope.test = function(){
		$('#sss').html('<input id="aa" type="text" ng-model="value" ng-disabled="!isEditing" style="height:47px;" value="asdf" autofocus>')
	}
})

.controller('PromoCodeCtrl', function ($scope,$rootScope, UserManager,OrderManager) {
	$scope.promocode = "";
	$scope.sendPromoCode = function (code) {
		UserManager.sendPromocode(code).then(function(response){
			console.log(response.data);
		});
	};

	$scope.timestampToDate = function(timestamp){
		return timestampToDate(timestamp);
	}
	$rootScope.OrderManager.getFreeLunchList().then(function(response){
		$rootScope.OrderManager.freeLunchList=response.data;
	});
})

.controller('SettingsCtrl', function ($scope) {
})

.controller('FreeLunchCtrl', function ($scope, UserManager,LocalStore) {
	$scope.userCode = LocalStore.get("profile").userCode;

	$scope.sendEmail = function() { 
		var bodyText = "Use my promo code, "+$scope.userCode+", and get a free lunch up to $10."; 
            window.plugin.email.open({ 
                to:          [""], // email addresses for TO field 
                cc:          Array, // email addresses for CC field 
                bcc:         Array, // email addresses for BCC field 
                subject:    "$10 of your AnyBox lunch!", // subject of the email 
                body:       bodyText, // email body (for HTML, set isHtml to true) 
                isHtml:    true, // indicats if the body is HTML or plain text 
            }, function () { 
                console.log('email view dismissed'); 
            }, 
            this);     
	} 
	
	$scope.sendSms = function(){
		var number = ""; 
		var message = "Use my promo code, "+$scope.userCode+", and get a free lunch up to $10."; 
		var options = { 
		    replaceLineBreaks: false, // true to replace \n by a new line,
		      android: { 
		          intent: 'INTENT'
		      } 
		  }; 
		var success = function () { alert('Message sent successfully'); }; 
		var error = function (e) { alert('Message Failed:' + e); }; 
		sms.send(number, message, options, success, error); 
	};
 
})

.controller('PaymentCtrl', function (Toast, StripeHttp, $scope) {
  var customerId="cus_7LnQpf5pn49syn";
  $scope.newCard = {};

  $scope.getCardLogo = function (brand) {
    var path = "img/creditcards/";

    switch (brand) {
      case "Visa":
        path += "visa.png";
        break;
      case "MasterCard":
        path += "mastercard.png";
        break;
      case "Discover":
        path += "discover.png";
        break;
      case "American Express":
        path += "amex.png";
        break;
      case "JCB":
        path += "jcb.png";
        break;
      case "Diners Club":
        path += "diners.png";
        break;
      default:
        path += "credit.png";
    }

    return path;
  };

  $scope.addCard = function () {
    Stripe.card.createToken($scope.newCard, function stripeResponseHandler(status, response) {

      if (response.error) {
        Toast.error(response.error.message);
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        StripeHttp.post('https://api.stripe.com/v1/customers/' + customerId + '/sources', {
          source: token
        }).success(function (data, status, headers, config) {
          getCards(customerId);
        }).error(function (data, status, headers, config) {
          Toast.error("Add cards fail. " + status + data);
        });
      }
    });
  };

  function getCards(cusId) {
    StripeHttp.get('https://api.stripe.com/v1/customers/' + cusId + '/sources')
      .success(function (data, status, headers, config) {
        $scope.cards = data.data;
      }).error(function (data, status, headers, config) {
        Toast.error("Get cards fail. " + status + data);
      });
  }
});

function longDateToShortDate(date){
	var arr=date.split(" ");
	var shortDate=arr[0]+", "+arr[1]+" "+arr[2]+", "+arr[3];
	return shortDate;
}

function timestampToDate(timestamp){
	var date = new Date(timestamp);
	var dateStr = longDateToShortDate(date.toDateString());
	return dateStr;
}

function dateToTimestamp(date){
	date=date.replace(',', '');
	var dateArr=date.split(" ");
	var newDate=dateArr[1]+"/"+dateArr[2]+"/"+dateArr[3];
	return (new Date(newDate).getTime());
}
function roundToCent(real){
	return Math.round(real*100)/100;
}