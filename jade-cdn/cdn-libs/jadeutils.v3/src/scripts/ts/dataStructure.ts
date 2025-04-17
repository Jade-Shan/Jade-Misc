
/**
 * 
 */
export class SimpleMap<T,K> {

	recs: Array<[T,K]>;

	constructor(recs?: Array<[T,K]>) {
		this.recs = recs ? recs : new Array();
	}

	/**
	 * 
	 * @returns 
	 */
	size() {
		return this.recs.length;
	}

	isEmpty () {
		return null == this.recs || this.recs.length == 0;
	}

	/**
	 * 
	 */
	removeAll() {
		this.recs = new Array();
	}

	/**
	 * 
	 * @param key 
	 * @param value 
	 */
	put(key: T, value: K) {
		this.recs.push([key, value]);
	}

	/**
	 * 
	 * @param key 
	 */
	remove(key: T) {
		let newRecs = new Array();
		for (let rec in this.recs) {
			if (key == rec[0]) {
				// skip
			} else {
				newRecs.push(rec);
			}
		}
		this.recs = newRecs;
	}

}




	///**
	// * MAP对象，实现MAP功能
	// *
	// * 构造函数：var m = new net.jadedungeon.dataStructure.Map([{"key":"a","value":1},{"key":"b","value":2}]);
	// *
	// * 接口：
	// * size()     获取MAP元素个数
	// * isEmpty()    判断MAP是否为空
	// * removeAll()     删除MAP所有元素
	// * put(key, value)   向MAP中增加元素（key, value) 
	// * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
	// * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
	// * getElementByIndex(index)   获取指定索引的元素
	// * containsKey(key)  判断MAP中是否含有指定KEY的元素
	// * containsValue(value) 判断MAP中是否含有指定VALUE的元素
	// * values()    获取MAP中所有VALUE的数组（ARRAY）
	// * keys()     获取MAP中所有KEY的数组（ARRAY）
	// *
	// * 例子：
	// * var map = new Map();
	// *
	// * map.put("key", "value");
	// * var val = map.get("key")
	// * ……
	// *
	// */
	//(function ($) {
	//	net.jadedungeon.dataStructure.Map = function (initData) {
	//		this.init(initData); return this; 
	//	};
	//	var proto = net.jadedungeon.dataStructure.Map.prototype;

	//	proto.init= function (initData) { this.elements = initData || []; };
	//	//获取MAP元素个数
	//	proto.size = function() { return this.elements.length; };
	//	//判断MAP是否为空
	//	proto.isEmpty = function() { return (this.elements.length < 1); };
	//	//删除MAP所有元素
	//	proto.removeAll = function() { this.elements = []; };

	//	proto.put = function(_key, _value) {
	//		this.elements.push({ key : _key, value : _value });
	//	};

	//	//删除指定KEY的元素，成功返回True，失败返回False
	//	proto.remove = function(_key) {
	//		var bln = false;
	//		try {
	//			for (i = 0; i < this.elements.length; i++) {
	//				if (this.elements[i].key == _key) {
	//					this.elements.splice(i, 1);
	//					return true;
	//				}
	//			}
	//		} catch (e) { bln = false; }
	//		return bln;
	//	};

	//	//获取指定KEY的元素值VALUE，失败返回NULL
	//	proto.get = function(_key) {
	//		try {
	//			for (i = 0; i < this.elements.length; i++) {
	//				if (this.elements[i].key == _key) {
	//					return this.elements[i].value;
	//				}
	//			}
	//		} catch (e) { return null; }
	//	};

	//	//获取指定索引的元素（使用getElementByIndex.key，getElementByIndex.value获取KEY和VALUE），
	//	//失败返回NULL
	//	proto.getElementByIndex = function(_index) {
	//		if (_index < 0 || _index >= this.elements.length) {
	//			return null;
	//		}
	//		return this.elements[_index];
	//	};

	//	//判断MAP中是否含有指定KEY的元素
	//	proto.containsKey = function(_key) {
	//		var bln = false;
	//		try {
	//			for (i = 0; i < this.elements.length; i++) {
	//				if (this.elements[i].key == _key) { bln = true; }
	//			}
	//		} catch (e) { bln = false; }
	//		return bln;
	//	};

	//	//判断MAP中是否含有指定VALUE的元素
	//	proto.containsValue = function(_value) {
	//		var bln = false;
	//		try {
	//			for (i = 0; i < this.elements.length; i++) {
	//				if (this.elements[i].value == _value) { bln = true; }
	//			}
	//		} catch (e) { bln = false; }
	//		return bln;
	//	};

	//	//获取MAP中所有VALUE的数组（ARRAY）
	//	proto.values = function() {
	//		var arr = [];
	//		for (i = 0; i < this.elements.length; i++) {
	//			arr.push(this.elements[i].value);
	//		}
	//		return arr;
	//	};

	//	//获取MAP中所有KEY的数组（ARRAY）
	//	proto.keys = function() {
	//		var arr = [];
	//		for (i = 0; i < this.elements.length; i++) {
	//			arr.push(this.elements[i].key);
	//		}
	//		return arr;
	//	};

	//})(jQuery);

	///**
	// * 定义堆栈类 实现堆栈基本功能
	// */
	//(function ($) {
	//	net.jadedungeon.dataStructure.Stack = function (initData) { 
	//		this.init(initData); return this; 
	//	};
	//	var proto = net.jadedungeon.dataStructure.Stack.prototype;

	//	proto.init= function (initData) { this.elements = initData || []; };

	//	/**
	//	 * 元素入栈 1.Push方法参数可以多个 2.参数为空时返回-1
	//	 * 
	//	 * @param: 入栈元素列表
	//	 * @return: 堆栈元素个数
	//	 */
	//	proto.push = function(vElement) {
	//		if (arguments.length === 0) return -1;
	//		// 元素入栈
	//		for ( var i = 0; i < arguments.length; i += 1) {
	//			this.elements.push(arguments[i]);
	//		}
	//		return this.elements.length;
	//	};

	//	/**
	//	 * 元素出栈 当堆栈元素为空时,返回null
	//	 * 
	//	 * @return: vElement
	//	 */
	//	proto.pop = function() {
	//		if (this.elements.length === 0)
	//			return null;
	//		else
	//			return this.elements.pop();
	//	};

	//	/**
	//	 * 获取堆栈元素个数
	//	 * 
	//	 * @return: 元素个数
	//	 */
	//	proto.size = function() { return this.elements.length; };

	//	/**
	//	 * 返回栈顶元素值 若堆栈为空则返回null
	//	 * 
	//	 * @return: vElement
	//	 */
	//	proto.getTop = function() {
	//		if (this.elements.length === 0)
	//			return null;
	//		else
	//			return this.elements[this.elements.length - 1];
	//	};

	//	/**
	//	 * 将堆栈置空
	//	 */
	//	proto.removeAll = function() { this.elements.length = 0; };

	//	/**
	//	 * 判断堆栈是否为空
	//	 * 
	//	 * @return: 堆栈为空返回true,否则返回false
	//	 */
	//	proto.isEmpty = function() {
	//		if (this.elements.length === 0)
	//			return true;
	//		else
	//			return false;
	//	};

	//	/**
	//	 * 将堆栈元素转化为字符串
	//	 * 
	//	 * @return: 堆栈元素字符串
	//	 */
	//	proto.toString = function() {
	//		var sResult = (this.elements.reverse()).toString();
	//		this.elements.reverse();
	//		return sResult;
	//	};
	//})(jQuery);


	///**
	// * 定义队列类 实现队列基本功能
	// */
	//(function ($) {
	//	net.jadedungeon.dataStructure.Queue = function (initData) { 
	//		this.init(initData); return this; 
	//	};
	//	var proto = net.jadedungeon.dataStructure.Queue.prototype;
	//	proto.init = function (initData) { this.elements = initData || []; };

	//	/**
	//	 * 元素入队 1.EnQueue方法参数可以多个 2.参数为空时返回-1
	//	 * 
	//	 * @param: vElement元素列表
	//	 * @return: 返回当前队列元素个数
	//	 */
	//	proto.push = function(vElement) {
	//		if (arguments.length === 0) return -1;
	//		// 元素入队
	//		for ( var i = 0; i < arguments.length; i += 1) { this.elements.push(arguments[i]); }
	//		return this.elements.length;
	//	};

	//	/**
	//	 * 元素出队 当队列元素为空时,返回null
	//	 * 
	//	 * @return: vElement
	//	 */
	//	proto.pop = function() {
	//		if (this.elements.length === 0)
	//			return null;
	//		else
	//			return this.elements.shift();
	//	};

	//	/**
	//	 * 获取队列元素个数
	//	 * 
	//	 * @return: 元素个数
	//	 */
	//	proto.size = function() { return this.elements.length; };

	//	/**
	//	 * 返回队头素值 若队列为空则返回null
	//	 * 
	//	 * @return: vElement
	//	 */
	//	proto.GetHead = function() {
	//		if (this.elements.length === 0)
	//			return null;
	//		else
	//			return this.elements[0];
	//	};

	//	/**
	//	 * 返回队尾素值 若队列为空则返回null
	//	 * 
	//	 * @return: vElement
	//	 */
	//	proto.GetEnd = function() {
	//		if (this.elements.length === 0)
	//			return null;
	//		else
	//			return this.elements[this.elements.length - 1];
	//	};

	//	/**
	//	 * 将队列置空
	//	 */
	//	proto.removeAll = function() { this.elements.length = 0; };

	//	/**
	//	 * 判断队列是否为空
	//	 * 
	//	 * @return: 队列为空返回true,否则返回false
	//	 */
	//	proto.isEmpty = function() {
	//		if (this.elements.length === 0)
	//			return true;
	//		else
	//			return false;
	//	};

	//	/**
	//	 * 将队列元素转化为字符串
	//	 * 
	//	 * @return: 队列元素字符串
	//	 */
	//	proto.toString = function() {
	//		var sResult = (this.elements.reverse()).toString();
	//		this.elements.reverse();
	//		return sResult;
	//	};
	//})(jQuery);

