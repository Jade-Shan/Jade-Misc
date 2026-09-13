workoutApp.muscle = {};
/**
 * 肌肉相关数据
 */
workoutApp.muscle.muscleJson = [
{"id": "1", "name": "Neck", "chs": "颈", "subs": [
	{"id": "1-1", "name": "Omohyoid", "chs": "肩胛舌骨肌", "subs": []},
	{"id": "1-2", "name": "Sternohyoid", "chs": "胸骨甲状肌", "subs": []},
	{"id": "1-3", "name": "Sternocleidomastoid", "chs": "胸锁乳突肌", "subs": []}]},
{"id": "2", "name": "Chest", "chs": "胸", "subs": [
	{"id": "2-1", "name": "Pectoralis Major", "chs": "胸大肌", "subs": []},
	{"id": "2-2", "name": "Pectoralis Minor", "chs": "胸小肌", "subs": []},
	{"id": "2-3", "name": "Serratus Anterior", "chs": "前锯肌", "subs": []}]},
{"id": "3", "name": "Back", "chs": "背", "subs": [
	{"id": "3-1", "name": "Trapezius", "chs": "斜方肌", "subs": [
		{"id": "3-1-1", "name": "Trapezius", "chs": "斜方肌", "subs": []},
		{"id": "3-1-2", "name": "Trapezius", "chs": "斜方肌", "subs": []}]},
	{"id": "3-2", "name": "Infraspinatus", "chs": "棘下肌", "subs": []},
	{"id": "3-3", "name": "Rhomboid Major", "chs": "菱形肌", "subs": []},
	{"id": "3-4", "name": "Teres Major", "chs": "大圆肌", "subs": []},
	{"id": "3-5", "name": "Teres Minor", "chs": "小圆肌", "subs": []},
	{"id": "3-6", "name": "Latissimus Dorsi", "chs": "背阔肌", "subs": []}]},
{"id": "4", "name": "Shoulders", "chs": "肩", "subs": [
	{"id": "4-1", "name": "Deltoid Anterior Head", "chs": "三角肌前头", "subs": []},
	{"id": "4-2", "name": "Deltoid Middle Head", "chs": "三角肌中头", "subs": []},
	{"id": "4-3", "name": "Deltoid Posterior Head", "chs": "三角肌后头", "subs": []}]},
{"id": "5", "name": "UpperArms", "chs": "上臂", "subs": [
	{"id": "5-1", "name": "Brachialis", "chs": "肱肌", "subs": []},
	{"id": "5-2", "name": "Biceps Brachialis", "chs": "肱二头肌", "subs": [
		{"id": "5-2-1", "name": "Biceps Brachialis Long Head", "chs": "长头", "subs": []},
		{"id": "5-2-2", "name": "Biceps Brachialis Short Head", "chs": "短头", "subs": []}]},
	{"id": "5-3", "name": "Pronator Teres", "chs": "旋前圆肌", "subs": []},
	{"id": "5-4", "name": "Pronator quadratus", "chs": "旋前方肌", "subs": []},
	{"id": "5-5", "name": "Triceps Brachialis", "chs": "三头肌", "subs": [
		{"id": "5-5-1", "name": "Triceps Brachialis Lateral Head", "chs": "三头肌外头", "subs": []},
		{"id": "5-5-2", "name": "Triceps Brachialis Long Head", "chs": "三头肌长头", "subs": []},
		{"id": "5-5-3", "name": "Triceps Brachialis Medial Head", "chs": "三头肌内头", "subs": []}]}]},
{"id": "6", "name": "Forearms", "chs": "前臂", "subs": [
	{"id": "6-1", "name": "Brachioradialis", "chs": "肱桡肌", "subs": []},
	{"id": "6-2", "name": "Flexor Carpi Radialis", "chs": "桡侧腕屈肌", "subs": []},
	{"id": "6-3", "name": "Extensor Carpi Radialis", "chs": "桡侧腕伸肌", "subs": []},
	{"id": "6-4", "name": "Flexor Carpi Ulnaris", "chs": "尺侧腕屈肌", "subs": []},
	{"id": "6-5", "name": "Extensor Carpi Ulnaris", "chs": "尺侧腕伸肌", "subs": []},
	{"id": "6-6", "name": "Palmaris Longus", "chs": "掌长肌", "subs": []},
	{"id": "6-7", "name": "Extensor Pollicis Longus", "chs": "拇伸长肌", "subs": []},
	{"id": "6-8", "name": "Extensor Pollicis Brevis", "chs": "拇伸短肌", "subs": []},
	{"id": "6-9", "name": "Abductor Pollicis Longus", "chs": "外展拇伸长肌", "subs": []},
	{"id": "6-a", "name": "Abductor Pollicis Brevis", "chs": "外展拇伸短肌", "subs": []}]},
{"id": "7", "name": "Abs", "chs": "腹肌", "subs": [
	{"id": "7-1", "name": "Rectus Abdominis", "chs": "腹直肌", "subs": []},
	{"id": "7-2", "name": "Tendinous Inscriptions", "chs": "腱割肌", "subs": []},
	{"id": "7-4", "name": "Flank muscle", "chs": "肋间肌", "subs": []},
	{"id": "7-5", "name": "External Oblique", "chs": "腹外斜肌", "subs": []}]},
{"id": "8", "name": "Waist", "chs": "腰", "subs": [
	{"id": "8-1", "name": "Erector Spinae", "chs": "竖脊肌", "subs": []},
	{"id": "8-2", "name": "Thoracolumbar Fascia", "chs": "胸腰筋膜", "subs": []}]},
{"id": "9", "name": "Gluters", "chs": "臀", "subs": [
	{"id": "9-1", "name": "Gluteus Maximus", "chs": "臀大肌", "subs": []},
	{"id": "9-2", "name": "Gluteus Medius", "chs": "臀中肌", "subs": []},
	{"id": "9-3", "name": "Gluteus Minimus", "chs": "臀小肌", "subs": []}]},
{"id": "a", "name": "Thighs", "chs": "大腿", "subs": [
	{"id": "a-1", "name": "Gracilis", "chs": "股薄肌", "subs": []},
	{"id": "a-2", "name": "Sartorius", "chs": "缝匠肌", "subs": []},
	{"id": "a-3", "name": "Tensor Fasciae Latae", "chs": "阔筋膜张肌", "subs": []},
	{"id": "a-4", "name": "Pectineus", "chs": "耻骨肌", "subs": []},
	{"id": "a-5", "name": "Adductor Longus", "chs": "内收长肌", "subs": []},
	{"id": "a-6", "name": "Rectus Femoris", "chs": "股直肌", "subs": []},
	{"id": "a-7", "name": "Vastus Lateralis", "chs": "股外侧肌", "subs": []},
	{"id": "a-8", "name": "Vastus Medialis", "chs": "股内侧肌", "subs": []},
	{"id": "a-9", "name": "Hamstrings", "chs": "股后肌群", "subs": [
		{"id": "a-9-1", "name": "Iliotibial Band", "chs": "髂胫带", "subs": []},
		{"id": "a-9-2", "name": "Biceps Femoris", "chs": "股二头肌", "subs": []},
		{"id": "a-9-3", "name": "Semitendinosus", "chs": "半腱肌", "subs": []},
		{"id": "a-9-4", "name": "Semimembranosus", "chs": "半膜肌", "subs": []},
		{"id": "a-9-5", "name": "Adductor Magnus", "chs": "内收大肌", "subs": []}]}]},
{"id": "b", "name": "Calves", "chs": "小腿", "subs": [
	{"id": "b-1", "name": "Tibialis Anterior", "chs": "胫骨前肌", "subs": []},
	{"id": "b-2", "name": "Tibialis Posterior", "chs": "胫骨后肌", "subs": []},
	{"id": "b-3", "name": "Peroneus Longus", "chs": "腓骨长肌", "subs": [
		{"id": "b-3-1", "name": "Peroneus Longus", "chs": "腓骨长肌", "subs": []},
		{"id": "b-3-2", "name": "Peroneus Longus", "chs": "腓骨长肌", "subs": []}]},
	{"id": "b-4", "name": "Peroneus Brevis", "chs": "腓骨短肌", "subs": []},
	{"id": "b-5", "name": "Extensor Digitorum Longus", "chs": "伸趾长肌", "subs": []},
	{"id": "b-6", "name": "Gastrocnemius", "chs": "腓肠肌", "subs": [
		{"id": "b-6-1", "name": "Gastrocnemius", "chs": "腓肠肌", "subs": []},
		{"id": "b-6-2", "name": "Gastrocnemius", "chs": "腓肠肌", "subs": []}]},
	{"id": "b-7", "name": "Soleus", "chs": "比目鱼肌", "subs": [
		{"id": "b-7-1", "name": "Soleus", "chs": "比目鱼肌", "subs": []},
		{"id": "b-7-2", "name": "Soleus", "chs": "比目鱼肌", "subs": []}]},
	{"id": "b-8", "name": "Flexor Hallucis Longus", "chs": "屈姆长肌", "subs": []}]}];

/**
 * 把肌肉json数据转入Map中
 */
workoutApp.muscle.addMuscle2Map = function (muscles, maps) {
	for (var i in muscles) {
		var d = muscles[i];
		maps.put(d.id, d);
		if (d.subs.length > 0) {workoutApp.muscle.addMuscle2Map(d.subs, maps);}
	}
};

/**
 * 把肌肉json数据转入Map中
 */
workoutApp.muscle.muscleMap = new jadeUtils.dataStructure.Map();
workoutApp.muscle.addMuscle2Map(workoutApp.muscle.muscleJson, 
		workoutApp.muscle.muscleMap);

workoutApp.muscle.MuscleDataFpath = cdnworkout + "datas/muscle-front.data";
workoutApp.muscle.MuscleDataBpath = cdnworkout + "datas/muscle-back.data" ;

/**
 * 初始化肌肉图，绑定点击事件
 */
workoutApp.muscle.initMuscleImage = function (item) {
	$("#" + item +" .muscle-outline").each(function (idx, item) {
			$(item).on("click", function (e) {
				var muscleId = $(this).attr("muscle");
				console.debug(workoutApp.muscle.muscleMap.get(muscleId));
				});
			});
};


/**
 * 加载肌肉图片（Svg格式）
 */
workoutApp.muscle.loadMuscleImg = function (cId, width, height, scale, url, callback) {
	$.get(url, function (data, status, xhr) {
		if (200 == xhr.status && "success" == status) {
			var html = '<svg xmlns="http://www.w3.org/2000/svg"' +
		'width="' + width + '" height="' + height + '">' + 
		'<g transform="scale(' + scale + ')">' + data + '</g></svg>';
	$("#"+cId).html(html);
	workoutApp.muscle.initMuscleImage(cId);
	callback();
		}
	});
};

workoutApp.muscle.markMusclesPrimary = function (ids) {
	if(ids.length > 0)
	$.each(ids, function(index, item){
			$("." + item).attr("class","muscle-primary");
			});
};
workoutApp.muscle.markMusclesMinor = function (ids) {
	if(ids.length > 0)
	$.each(ids, function(index, item){
			$("." + item).attr("class","muscle-minor");
			});
};
workoutApp.muscle.markMusclesExtra = function (ids) {
	if(ids.length > 0)
	$.each(ids, function(index, item){
			$("." + item).attr("class","muscle-extra");
			});
};

workoutApp.muscle.loadMarkedMuscles = function (fid, bid, width, height, scale, marks) {
	workoutApp.muscle.loadMuscleImg(fid, width, height, scale,
			workoutApp.muscle.MuscleDataFpath, function() {
				workoutApp.muscle.loadMuscleImg(bid, width, height, scale, 
					workoutApp.muscle.MuscleDataBpath, function () {
						workoutApp.muscle.markMusclesExtra(marks.ext);
						workoutApp.muscle.markMusclesPrimary(marks.pim);
						workoutApp.muscle.markMusclesMinor(marks.min);
					});
			});
};


