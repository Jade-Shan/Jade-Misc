workoutApp.workout = {};

workoutApp.workout.AerobicItems = [
{id: "aero-1-1", name: "慢跑", ename: "Jogging"},
{id: "aero-2-1", name: "游泳", ename: "Swimming"},
{id: "aero-3-1", name: "椭圆机", ename: "Elliptical Machine"},
];

workoutApp.workout.StrengthItems = [
	{part: "肩部", epart: "Shoulder", type: "fixed", id: "sth-1-1", name: "", ename: "Shoulder Press", 
		pim: ["4-1", "4-2", "4-3"], min: ["3-1-1", "5-5-1", "5-5-2", "5-5-3"], ext: []},
	{part: "肩部", epart: "Shoulder", type: "fixed", id: "sth-1-2", name: "", ename: "Shoulder Press", 
		pim: ["4-1", "4-2", "4-3"], min: ["5-5-1", "5-5-2", "5-5-3"], ext: []},

	{part: "胸部", epart: "Chest", type: "fixed", id: "sth-2-1", name: "", ename: "Chest Press", 
		pim: ["2-1", "2-2"], min: ["4-1", "4-2", "5-5-1", "5-5-2", "5-5-3"], ext: []},
	{part: "胸部", epart: "Chest", type: "fixed", id: "sth-2-2", name: "", ename: "Wide Chest Press", 
		pim: ["2-1", "2-2", "5-5-1", "5-5-2", "5-5-3"], min: [], ext: []},
	{part: "胸部", epart: "Chest", type: "fixed", id: "sth-2-3", name: "", ename: "Incline Chest Press", 
		pim: ["2-1", "2-2", "4-1", "5-5-1", "5-5-2", "5-5-3"], min: [], ext: []},

	{part: "背部", epart: "Back", type: "fixed", id: "sth-3-1", name: "低位划船", ename: "Low Row", 
		pim: ["3-6"], min: ["3-1-1", "3-1-2", "5-2-1", "5-2-2"], ext: []},
	{part: "背部", epart: "Back", type: "fixed", id: "sth-3-2", name: "高位下拉", ename: "", 
		pim: ["3-6", "5-2-1", "5-2-2"], min: [], ext: []},
	{part: "背部", epart: "Back", type: "fixed", id: "sth-3-3", name: "划船", ename: "Row", 
		pim: ["3-1-1", "3-1-2", "4-3", "3-6", "5-2-1", "5-2-2"], min: [], ext: []},

	{part: "腰部", epart: "Waist", type: "fixed", id: "sth-4-1", name: "", ename: "Lower Back", 
		pim: ["8-1"], min: [], ext: []},

	{part: "大臂", epart: "Upper Arms", type: "fixed", id: "sth-5-1", name: "", ename: "Arm Curl", 
		pim: ["5-2-1", "5-2-2"], min: [], ext: []},


	{part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-1", name: "", ename: "Leg Press", 
		pim: ["a-6", "a-7", "a-8", "9-1"], min: ["a-9-2", "a-9-3", "a-1", "a-5"], ext: []},
	{part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-2", name: "", ename: "Adductor", 
		pim: ["a-1", "a-5"], min: [], ext: []},
	{part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-3", name: "", ename: "Leg Extension", 
		pim: ["a-6", "a-7", "a-8"], min: [], ext: []},
	{part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-4", name: "", ename: "Abductor", 
		pim: ["9-1"], min: [], ext: []}

	// {part: "肩部", epart: "Shoulder", type: "fixed", id: "sth-1-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "胸部", epart: "Chest", type: "fixed", id: "sth-2-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "背部", epart: "Back", type: "fixed", id: "sth-3-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "腰部", epart: "Waist", type: "fixed", id: "sth-4-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "大臂", epart: "Upper Arms", type: "fixed", id: "sth-5-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "前臂", epart: "Forearms", type: "fixed", id: "sth-6-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "前臂", epart: "Forearms", type: "fixed", id: "sth-6-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "大腿", epart: "Thighs", type: "fixed", id: "sth-7-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "小腿", epart: "Calves", type: "fixed", id: "sth-8-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "小腿", epart: "Calves", type: "fixed", id: "sth-8-", name: "", ename: "", pim: [], min: [], ext: []},
	// {part: "腹部", epart: "Abs", type: "fixed", id: "sth-9-", name: "", ename: "", pim: [], min: [], ext: []}
	// {part: "腹部", epart: "Abs", type: "fixed", id: "sth-9-", name: "", ename: "", pim: [], min: [], ext: []}

];

/**
 * 把json数据转入Map中
 */
workoutApp.workout.addItems2Map = function (item, map) {
	for (var i in item) {
		var d = item[i];
		map.put(d.id, d);
	}
	return map;
};

workoutApp.workout.StrengthItemMap = workoutApp.workout.addItems2Map(
	workoutApp.workout.StrengthItems, new jadeUtils.dataStructure.Map());

workoutApp.workout.AerobicItemMap = workoutApp.workout.addItems2Map(
	workoutApp.workout.AerobicItems, new jadeUtils.dataStructure.Map());



workoutApp.workoutRec = {};

workoutApp.workoutRec.recordStrengthRec = function () {
	var username = $('#username').val();
	var password = $('#password').val();
	var workoutId = $('#workoutId').val();
	var weight = $('#weight').val();
	var repeat = $('#repeat').val();
	var auth = 'Basic ' + jadeUtils.string.base64encode(
			jadeUtils.string.utf16to8(username + ':' + password)); 
	if ("" !== username) {
		$.ajax({ type: 'POST', dataType: 'json', timeout: 3000,
				url: workoutApp.appPath + '/api/workout/recordStrengthRec', 
				headers: {Authorization: auth},
				data: {
					username: username,
					password: password,
					workoutId: workoutId,
					weight  : weight,
					repeat  : repeat},
				success: function(data, status, xhr) {
					console.debug(data);
					jadeUtils.cookieOperator('weight' + workoutId, weight);
					jadeUtils.cookieOperator('repeat' + workoutId, repeat);
				},
				error: function(xhr, errorType, error) { alert("Ajax Error!"); },
				complete: function(xhr, status) {}
			});
	}
};


workoutApp.workoutRec.recordAerobicRec = function () {
	var username = $('#username').val();
	var password = $('#password').val();
	var workoutId = $('#workoutId').val();
	var time = $('#time').val();
	var distance = $('#distance').val();
	var calories = $('#calories').val();
	var auth = 'Basic ' + jadeUtils.string.base64encode(
			jadeUtils.string.utf16to8(username + ':' + password)); 
	if ("" !== username) {
		$.ajax({ type: 'POST', dataType: 'json', timeout: 3000,
				url: workoutApp.appPath + '/api/workout/recordAerobicRec', 
				headers: {Authorization: auth},
				data: {
					username: username,
					password: password,
					workoutId: workoutId,
					time: time,
					distance: distance,
					calories: calories},
				success: function(data, status, xhr) {
					console.debug(data);
					jadeUtils.cookieOperator('time'     + workoutId, time    );
					jadeUtils.cookieOperator('distance' + workoutId, distance);
					jadeUtils.cookieOperator('calories' + workoutId, calories);
				},
				error: function(xhr, errorType, error) { alert("Ajax Error!"); },
				complete: function(xhr, status) {}
			});
	}
};


