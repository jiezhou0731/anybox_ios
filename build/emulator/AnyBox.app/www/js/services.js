var url={};

//url.domain="http://10.0.0.10:8080/anybox/";
url.domain="http://73.172.188.159:8080/anybox/";

//url.domain="http://73.172.188.159:8080/anybox/";

url.userSignUp=url.domain+"ruser/register";
url.userSignIn=url.domain+"ruser/login";
url.homepageList=url.domain+"reventcards";
url.foodMenu=url.domain+"rproduct/list";
url.placeOrder=url.domain+"rorder/add";
url.getProfile=url.domain+"ruser/";
url.sendPromoCode=url.domain+"ruser/invite";
url.freeLunch=url.domain+"ruser/freelunch/";
url.historyOrder=url.domain+"rorder/list/";
url.editProfile=url.domain+"ruser/update";

/*
url.domain="http://10.0.0.15/~jie/";//"http://localhost/~jie/";//"http://pixelanimators.com/"; 
url.userSignUp=url.domain+"jiezhoudev_english/index.php?r=anybox/ruser_register";
url.userSignIn=url.domain+"jiezhoudev_english/index.php?r=anybox/ruser_login";
url.homepageList=url.domain+"jiezhoudev_english/index.php?r=anybox/homepage_list";
url.foodMenu=url.domain+"jiezhoudev_english/index.php?r=anybox/rproduct_list";
url.orderPriceCalc=url.domain+"jiezhoudev_english/index.php?r=anybox/order_price_calc";
url.freeLunch=url.domain+"jiezhoudev_english/index.php?r=anybox/rfreeLunch";
url.sendPromoCode=url.domain+"jiezhoudev_english/index.php?r=anybox/rfreeLunch";
url.historyOrder=url.domain+"jiezhoudev_english/index.php?r=anybox/historyOrder";
url.getProfile=url.domain+"jiezhoudev_english/index.php?r=anybox/getProfile";
*/

angular.module('app.services', [])

.factory('LocalStore', function ($window) {
	localStore={};
  
	localStore.set=function(key,value){
	  $window.localStorage[key] = angular.toJson(value);
  }
  
	localStore.get=function(key){
	  return JSON.parse(window.localStorage[key] || '{}');
  }
  
  
  return localStore;
})

.factory('Toast', function () {
  var Toast = {};

  toastr.options = {
    "debug": false,
    "positionClass": "toast-bottom-center",
    "onclick": null,
    "fadeIn": 300,
    "fadeOut": 1000,
    "timeOut": 3000,
    "extendedTimeOut": 1000
  };

  Toast.info = function (message) {
    toastr.info(message);
  };

  Toast.warning = function (message) {
    toastr.warning(message);
  };

  Toast.success = function (message) {
    toastr.success(message);
  };

  Toast.error = function (message) {
    toastr.error(message);
  };

  return Toast;
})

.factory("DateSel", function () {
  var DateSel = {};
  var weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  DateSel.days = [];
  for (var i = 0; i < 14; ++i) {
    var day = new Date();
    day.setDate(day.getDate() + i);
    if (day.getDay()==6 || day.getDay()==0 ) continue;
    DateSel.days.push({
      dateObj: day,
      month: day.getMonth() + 1,
      date: day.getDate(),
      weekDayLabel: weekDayLabels[day.getDay()],
      selected: false
    });
  }

  DateSel.selectDateIndex = function (idx) {
    if (DateSel.selectedIndex !== undefined) {
      DateSel.days[DateSel.selectedIndex].selected = false;
    }
    DateSel.days[idx].selected = true;
    DateSel.selectedIndex = idx;
  };

  DateSel.getDateAtIndex = function (idx) {
	return DateSel.days[idx].dateObj;
  };
	  
  DateSel.getSelectedDate = function () {
    return DateSel.days[DateSel.selectedIndex].dateObj;
  };

  DateSel.selectDateIndex(0);

  return DateSel;
})

.factory('HomepageManager', function ($http) {
  var HomepageManager = {};
  HomepageManager.getList=function(){
	  return $http.post(url.homepageList);
  }
  return HomepageManager;
})

.factory('OrderManager', function ($http,$rootScope,$state, LocalStore) {
  if ($rootScope.OrderManager===undefined){
	  $rootScope.OrderManager = {};
  }
  
  $rootScope.OrderManager.getFoodMenu=function(date){
	  /*
	var dateArr=dateStr.split(" ");
	var newDate=dateArr[1]+"/"+dateArr[2]+"/"+dateArr[3];
	var date = new Date(newDate).getTime();
	
	*/
	var month=""+(date.getMonth()+1);
	if (month.length==1){
		month="0"+month;
	}
	var dateStr=(date.getFullYear()+""+month+""+date.getDate());
	var params={
		"machineId":1,
		"userId":LocalStore.get("profile").id,//$rootScope.profile.id,
		"date":dateStr
	};
	return $http.get(url.foodMenu,{"params":params});
  }
  
  
  $rootScope.OrderManager.orders = {};

  $rootScope.OrderManager.getFreeLunchList = function () {
	  return $http.get(url.freeLunch+LocalStore.get("profile").id);
  };
  
  $rootScope.OrderManager.getHistoryOrder = function () {
	  var params={
				"userId":LocalStore.get("profile").id,//$rootScope.profile.id,
			};
	  return $http.get(url.historyOrder+LocalStore.get("profile").id);
  };
  
  $rootScope.OrderManager.getSelectedFreeLunch = function () {
	  if ( $rootScope.OrderManager.freeLunchId==undefined || $rootScope.OrderManager.freeLunchId==0){
		  return undefined;
	  } else {
		  for (var i=0; i<$rootScope.OrderManager.freeLunchList.length; i++){
			  if ($rootScope.OrderManager.freeLunchList[i].id==$rootScope.OrderManager.freeLunchId){
				  return $rootScope.OrderManager.freeLunchList[i];
			  }
		  }
	  }
	  return undefined;
  };
	  
  $rootScope.OrderManager.initializeOrder = function (date) {
	$rootScope.OrderManager.getFoodMenu(date).then(function(reponse){
		$rootScope.OrderManager.orders[date]=[];
		for (var i=0; i<reponse.data.length; i++) {
			var product=reponse.data[i].product;
			if (product.categoryId=="2"){
				product.category="juice";
			} else {
				product.category="salad";
			}
			product.price = reponse.data[i].realPrice;
			product.storage = reponse.data[i].storage;
			product.amount=0;
			$rootScope.OrderManager.orders[date].push(product);
		}
	});
	$rootScope.OrderManager.orders[date] =[];
  };

  $rootScope.OrderManager.getOrderStatusAtDate = function (date){
	  if (!$rootScope.OrderManager.orders[date]) {
	      return "nothing";
	  }
	  for (var j=0; j<$rootScope.OrderManager.orders[date].length; j++) {
		  if ($rootScope.OrderManager.orders[date][j].amount>0){
			  return "ordered";
		  }
	  }
	  return "nothing";
  }
  
  $rootScope.OrderManager.getDates = function (){
	  var dates = Object.keys($rootScope.OrderManager.orders);
	  // clear empty dates;
	  for (var i=0; i<dates.length; i++) {
		  var empty=true;
		  for (var j=0; j<$rootScope.OrderManager.orders[dates[i]].length; j++) {
			  if ($rootScope.OrderManager.orders[dates[i]][j].amount>0){
				  empty=false;
			  }
		  }
		  if (empty){
			  dates.splice(i, 1);
			  i--;
		  }
	  }
	  return dates;
  }
  
  $rootScope.OrderManager.getItemNumber = function (){
	  var itemNumber={};
	  itemNumber.total=0;
	  itemNumber.salad=0;
	  itemNumber.juice=0;
	  var dates = Object.keys($rootScope.OrderManager.orders);
	  for (var i=0; i<dates.length; i++) {
		  for (var j=0; j<$rootScope.OrderManager.orders[dates[i]].length; j++) {
			  itemNumber.total+=$rootScope.OrderManager.orders[dates[i]][j].amount;
			  if ($rootScope.OrderManager.orders[dates[i]][j].category=="salad"){
				  itemNumber.salad+=$rootScope.OrderManager.orders[dates[i]][j].amount;
			  } else if ($rootScope.OrderManager.orders[dates[i]][j].category=="juice"){
				  itemNumber.juice+=$rootScope.OrderManager.orders[dates[i]][j].amount;
			  }  
		  }
	  }
	  return itemNumber;
  }
  
  $rootScope.OrderManager.getOrder = function (date) {
    if (!$rootScope.OrderManager.orders[date]) {
      $rootScope.OrderManager.orders[date]=[];
	  $rootScope.OrderManager.initializeOrder(date);
	}
	return $rootScope.OrderManager.orders[date];
  };
	  
  $rootScope.OrderManager.getOrderPrice = function(){
	  var price={};
	  price.total=0;
	  price.subTotal=0;
	  var dates = Object.keys($rootScope.OrderManager.orders);
	  for (var i=0; i<dates.length; i++) {
		  for (var j=0; j<$rootScope.OrderManager.orders[dates[i]].length; j++) {
			  price.total+=$rootScope.OrderManager.orders[dates[i]][j].amount*$rootScope.OrderManager.orders[dates[i]][j].price;
			  price.subTotal+=$rootScope.OrderManager.orders[dates[i]][j].amount*$rootScope.OrderManager.orders[dates[i]][j].originalPrice;
		  }
	  }
	  
	  price.discount=roundToCent(price.subTotal-price.total);
	  price.freeLunch=0;
	  
	  if ($rootScope.OrderManager.getSelectedFreeLunch() != undefined && $rootScope.OrderManager.getSelectedFreeLunch().money!=undefined){
		  price.freeLunch=$rootScope.OrderManager.getSelectedFreeLunch().money;
		  price.total-=$rootScope.OrderManager.getSelectedFreeLunch().money;
	  }
	  
	  if (price.total<0){
		  price.total=0;
	  }
	  
	  price.tax=roundToCent(price.total*0.1);
	  price.total+=price.tax;
	  price.total=roundToCent(price.total);
	  return price;
  }
  $rootScope.OrderManager.placeOrder = function(){
	  var obj={};
	  obj.order={};
	  if ($rootScope.OrderManager.currentOrderId!=undefined){
		  obj.order.id=$rootScope.OrderManager.currentOrderId;
	  }
	  obj.order.userId=LocalStore.get("profile").id;
	 // obj.order.stripeCustomerId="cus_6Nr6Nnu5piBxxj"; 
	 // obj.order.stripeCardId="card_16B5wEL8hthdp9KMusgpdnQm";
	  
	  obj.detail=[];
	  var dates = Object.keys($rootScope.OrderManager.orders);
	  for (var i=0; i<dates.length; i++) {
		  for (var j=0; j<$rootScope.OrderManager.orders[dates[i]].length; j++) {
			  if ($rootScope.OrderManager.orders[dates[i]][j].amount>0) {
				  var item={};
				  item.machineId=1;
				  item.productId=$rootScope.OrderManager.orders[dates[i]][j].id;
				  item.productNumber=$rootScope.OrderManager.orders[dates[i]][j].amount;
				  var d1 = new Date(dates[i]);
				  var d = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
				  item.pickupDate = Date.parse(d); 
				  obj.detail.push(item);
			  }
		  }
	  }
	  var json = angular.toJson(obj, true);
	  return $http.post(url.placeOrder,json);
  }
  
  return $rootScope.OrderManager;
})

.factory('UserManager', function ($http,$rootScope,$state,LocalStore) {
  if ($rootScope.UserManager===undefined){
	  $rootScope.UserManager = {};
  }
  
  $rootScope.UserManager.getProfile=function(){
	var params={
		"userId":LocalStore.get("profile").id//$rootScope.profile.id,
	};

	return $http.get(url.getProfile+LocalStore.get("profile").id+"?f=1");
  }
  
  $rootScope.UserManager.sendPromocode = function (promocode) {
	  var params={
				"id":LocalStore.get("profile").id,//$rootScope.profile.id,
				"inviteBy":promocode
			};
	  console.log(params);
	  return $http.post(url.sendPromoCode,params);
  };

  $rootScope.UserManager.editProfile = function (userData) {
	  return $http.post(url.editProfile,userData);
  };
  
  if ($rootScope.UserManager.profile==undefined){
  	if (LocalStore.get("profile").id!=undefined) {
	  $rootScope.UserManager.getProfile().then(function(response){
		  console.log(response.data);
		  $rootScope.UserManager.profile = response.data;
	  });
	}
  }
  
  return $rootScope.UserManager;
})

.factory("Auth", function ($http,LocalStore) {
  var Auth = {};
  
  Auth.signIn=function(loginData){
	  var json = angular.toJson(loginData, true);
	  console.log(loginData);
	  return $http.post(url.userSignIn, json).
	  success(function(data, status, headers, config) {
		  //LocalStore.set("profile",data);
	  }).
	  error(function(data, status, headers, config) {
	  });
  }
  
  Auth.signUp=function(loginData){
	  var json = angular.toJson(loginData, true);
	  console.log(loginData);
	  return $http.post(url.userSignUp, json).
	  success(function(data, status, headers, config) {
			LocalStore.set("profile",data);
	  });
  }
  
  return Auth;
})

.factory('StripeHttp', ["$http", function ($http) {
  Stripe.setPublishableKey('pk_test_pPPGBZ5JYzJzJ3UK33kPhk2W');
  var StripeHttp = {};
  var apiKey = "sk_test_SzFxso7NttMZZNvppqFvgto3";
  var authHeader = "Bearer " + apiKey;

  var req = {
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  var http = function (method, url, data) {
    req.method = method;
    req.url = url;
    if (data) {
      req.data = $.param(data);
    }
    return $http(req);
  };

  StripeHttp.get = function (url) {
    return http('GET', url);
  };

  StripeHttp.post = function (url, data) {
    return http('POST', url, data);
  };

  return StripeHttp;
}]);

function deepCopy (arr) {
    var out = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        var obj = {};
        for (var k in item) {
            obj[k] = item[k];
        }
        out.push(obj);
    }
    return out;
}

function roundToCent(real){
	return Math.round(real*100)/100;
}