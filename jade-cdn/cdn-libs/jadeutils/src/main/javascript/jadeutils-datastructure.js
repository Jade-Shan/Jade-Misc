jadeUtils.dataStructure = {};

/*
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 *
 * 例子：
 * var map = new Map();
 *
 * map.put("key", "value");
 * var val = map.get("key")
 * ……
 *
 */
jadeUtils.dataStructure.Map = function () {
    this.elements = [];
 
    //获取MAP元素个数
    this.size = function() { return this.elements.length; };
 
    //判断MAP是否为空
    this.isEmpty = function() { return (this.elements.length < 1); };
 
    //删除MAP所有元素
    this.clear = function() { this.elements = []; };
 
    //向MAP中增加元素（key, value) 
    this.put = function(_key, _value) {
        this.elements.push({ key : _key, value : _value });
    };
 
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) { bln = false; }
        return bln;
    };
 
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) { return null; }
    };
 
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），
		//失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
 
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) { bln = true; }
            }
        } catch (e) { bln = false; }
        return bln;
    };
 
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) { bln = true; }
            }
        } catch (e) { bln = false; }
        return bln;
    };
 
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = [];
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
 
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = [];
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
};


/**
 * 定义堆栈类 实现堆栈基本功能
 */
jadeUtils.dataStructure.Stack = function () {

	// 存储元素数组
	var aElement = [];

	/**
	 * 元素入栈 1.Push方法参数可以多个 2.参数为空时返回-1
	 * 
	 * @param: 入栈元素列表
	 * @return: 堆栈元素个数
	 */
	this.push = function(vElement) {
		if (arguments.length === 0)
			return -1;
		// 元素入栈
		for ( var i = 0; i < arguments.length; i += 1) {
			aElement.push(arguments[i]);
		}
		return aElement.length;
	};

	/**
	 * 元素出栈 当堆栈元素为空时,返回null
	 * 
	 * @return: vElement
	 */
	this.pop = function() {
		if (aElement.length === 0)
			return null;
		else
			return aElement.pop();
	};

	/**
	 * 获取堆栈元素个数
	 * 
	 * @return: 元素个数
	 */
	this.size = function() {
		return aElement.length;
	};

	/**
	 * 返回栈顶元素值 若堆栈为空则返回null
	 * 
	 * @return: vElement
	 */
	this.getTop = function() {
		if (aElement.length === 0)
			return null;
		else
			return aElement[aElement.length - 1];
	};

	/**
	 * 将堆栈置空
	 */
	this.removeAll = function() {
		aElement.length = 0;
	};

	/**
	 * 判断堆栈是否为空
	 * 
	 * @return: 堆栈为空返回true,否则返回false
	 */
	this.isEmpty = function() {
		if (aElement.length === 0)
			return true;
		else
			return false;
	};

	/**
	 * 将堆栈元素转化为字符串
	 * 
	 * @return: 堆栈元素字符串
	 */
	this.toString = function() {
		var sResult = (aElement.reverse()).toString();
		aElement.reverse();
		return sResult;
	};
};


/**
 * 定义队列类 实现队列基本功能
 */
jadeUtils.dataStructure.Queue = function () {

	// 存储元素数组
	var aElement = [];

	/**
	 * 元素入队 1.EnQueue方法参数可以多个 2.参数为空时返回-1
	 * 
	 * @param: vElement元素列表
	 * @return: 返回当前队列元素个数
	 */
	this.push = function(vElement) {
		if (arguments.length === 0)
			return -1;
		// 元素入队
		for ( var i = 0; i < arguments.length; i += 1) {
			aElement.push(arguments[i]);
		}
		return aElement.length;
	};

	/**
	 * 元素出队 当队列元素为空时,返回null
	 * 
	 * @return: vElement
	 */
	this.pop = function() {
		if (aElement.length === 0)
			return null;
		else
			return aElement.shift();
	};

	/**
	 * 获取队列元素个数
	 * 
	 * @return: 元素个数
	 */
	this.size = function() {
		return aElement.length;
	};

	/**
	 * 返回队头素值 若队列为空则返回null
	 * 
	 * @return: vElement
	 */
	this.GetHead = function() {
		if (aElement.length === 0)
			return null;
		else
			return aElement[0];
	};

	/**
	 * 返回队尾素值 若队列为空则返回null
	 * 
	 * @return: vElement
	 */
	this.GetEnd = function() {
		if (aElement.length === 0)
			return null;
		else
			return aElement[aElement.length - 1];
	};

	/**
	 * 将队列置空
	 */
	this.removeAll = function() {
		aElement.length = 0;
	};

	/**
	 * 判断队列是否为空
	 * 
	 * @return: 队列为空返回true,否则返回false
	 */
	this.isEmpty = function() {
		if (aElement.length === 0)
			return true;
		else
			return false;
	};

	/**
	 * 将队列元素转化为字符串
	 * 
	 * @return: 队列元素字符串
	 */
	this.toString = function() {
		var sResult = (aElement.reverse()).toString();
		aElement.reverse();
		return sResult;
	};
};


function testStatic() {
	var oStack = new jadeUtils.dataStructure.Stack();
	oStack.push("1");
	oStack.push("2");
	oStack.push("3");
	oStack.push("a");
	oStack.push("b");
	oStack.push("c");
	console.log(oStack.toString());
	console.log(oStack.pop());
	console.log(oStack.pop());
	console.log(oStack.pop());
	console.log(oStack.toString());
	// delete oStack;
}

function testQueue() {
	var oQueue = new jadeUtils.dataStructure.Queue();
	oQueue.push("1");
	oQueue.push("2");
	oQueue.push("3");
	oQueue.push("a");
	oQueue.push("b");
	oQueue.push("c");
	console.log(oQueue.toString());
	console.log(oQueue.pop());
	console.log(oQueue.pop());
	console.log(oQueue.pop());
	console.log(oQueue.toString());
	//delete oQueue;
}

// testStatic();testQueue();
