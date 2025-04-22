
/**
 * 
 */
export class SimpleMap<K, T> {

	recs: Array<[K, T]>;

	constructor(recs?: Array<[K, T]>) {
		this.recs = recs ? recs : new Array();
	}

	/**
	 * 
	 * @returns 
	 */
	size(): number { return this.recs.length; }

	isEmpty(): boolean { return null == this.recs || this.recs.length == 0; }

	/**
	 * 
	 */
	removeAll(): void { this.recs = new Array(); }

	/**
	 * 
	 * @param key 
	 * @param value 
	 */
	put(key: K, value: T): void { this.recs.push([key, value]); }

	/**
	 * 
	 * @param key 
	 */
	remove(key: K): void {
		let newRecs = new Array();
		for (let rec in this.recs) {
			if (key != rec[0]) { newRecs.push(rec); }
		}
		this.recs = newRecs;
	}

	/**
	 * 
	 * @param idx 
	 * @returns 
	 */
	getElementByIndex(idx: number): ([K, T] | null) {
		if (null == this.recs || idx < 0 || idx >= this.recs.length) {
			return null;
		} else {
			return this.recs[idx];
		}
	}

	/**
	 * 
	 * @param key 
	 * @returns 
	 */
	containsKey(key: K): boolean {
		if (null == this.recs || this.recs.length < 1) {
			return false;
		}
		for (let r of this.recs) {
			if (r[0] === key) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 
	 * @param value
	 * @returns 
	 */
	containsValue(value: T): boolean {
		if (null == this.recs || this.recs.length < 1) {
			return false;
		}
		for (let r of this.recs) {
			if (r[1] === value) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 
	 * @returns 
	 */
	keys(): Array<K> {
		let arr: Array<K> = [];
		for (let r of this.recs) {
			arr.push(r[0]);
		}
		return arr;
	}


	/**
	 * 
	 * @returns 
	 */
	values(): Array<T> {
		let arr: Array<T> = [];
		for (let r of this.recs) {
			arr.push(r[1]);
		}
		return arr;
	}

}

