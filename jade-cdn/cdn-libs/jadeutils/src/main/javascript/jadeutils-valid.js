jadeUtils.valid = {};
/**
 * 验证姓名 中文字、英文字母、数字
 */
jadeUtils.valid.checkName = function (username) {
	return /^[\u4e00-\u9fa5a-z][\u4e00-\u9fa5a-z0-9 ]+$/i.test(username);
};

/**
 * 验证手机号
 */
jadeUtils.valid.testMobile_zh_CN = function (phoneno) {
	return /^1[3|4|5|8][0-9]\d{8}$/.test(phoneno);
};


/**
 * 测试文件扩展名
 */
jadeUtils.valid.testImageFilePostfix = function (postfix) {
	if (!postfix.match(/.jpg|.gif|.png|.bmp/i)) {
		return false;
	}
	return true;
};
// /**
//  * 验证图片大小
//  */
// var imgMaxSize = 500 * 1024;
// function onUploadImgChange(fileInput) {
// 	var filePath = fileInput.value;
// 	var fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
// 	if (fileInput.files && fileInput.files[0]) {
// 		// alert(fileInput);
// 		// alert(fileInput.files[0]);
// 		console.log(fileInput.files[0].size);
// 		if (fileInput.files[0].size > imgMaxSize) {
// 			alert("图片大于500K，请压缩后上传");
// 			return false;
// 		}
// 		var xx = fileInput.files[0];
// 		for ( var i in xx) {
// 			if (xx[i].size > imgMaxSize) {
// 				alert("图片大于500K，请压缩后上传");
// 				return false;
// 			}
// 		}
// 	} else {
// 		fileInput.select();
// 		var url = document.selection.createRange().text;
// 		try {
// 			var fso = new ActiveXObject("Scripting.FileSystemObject");
// 			console.log(fso.GetFile(url).size);
// 			if (fso.GetFile(url).size) {
// 				alert("图片大于500K，请压缩后上传");
// 				return false;
// 			}
// 		} catch (e) {
// 			alert('如果你用的是ie 请将安全级别调低！');
// 		}
// 	}
// 	return true;
// }
