var cdnworkout = "http://7xldv2.com1.z0.glb.clouddn.com/workout/";

var workoutApp = {};
workoutApp.appPath = "/crawler-web2";

workoutApp.userAuth = { };

workoutApp.userAuth.checkLogin = function (username, password) {
	if ('' !== username && '' !== password) {
		return true;
	} else {
		return false;
	}
};

workoutApp.userAuth.barinit = function () {
	$('#login').on('click', function(event) {
		jadeUtils.cookieOperator('username', $('#username').val());
		jadeUtils.cookieOperator('password', $('#password').val());
		console.debug($('#username').val());
		$('#logindiv').hide();
		$('#lb-username').html($('#username').val());
		$('#userinfodiv').show();
	});

	$('#logout').on('click', function(event) {
		jadeUtils.cookieOperator('username', '');
		jadeUtils.cookieOperator('password', '');
		$('#userinfodiv').hide();
		$('#logindiv').show();
	});

	var username = jadeUtils.cookieOperator('username');
	var password = jadeUtils.cookieOperator('password');
	$('#username').val(username);
	$('#password').val(password);
	if (workoutApp.userAuth.checkLogin(username, password)) {
		$('#logindiv').hide();
		$('#lb-username').html($('#username').val());
			$('#userinfodiv').show();
	}
};

