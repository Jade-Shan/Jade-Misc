var server = nw.require("./javascript/comm/SimpleHTTPServer");

var globalData = {};
globalData.mainWindow = window;

/* ======================= */
/*                         */
/* ======================= */
var handle = server.defaultHandle;

/* 测试功能 */
var testService = require("./javascript/test");
handle = server.addHandle(handle, testService.handle);

/* 其他的模块也像测试功能一样加上去 */


/* ======================= */
/*                         */
/* ======================= */
server.start(globalData, handle);

