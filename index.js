function equals(o1, o2) {
	if (o1 === o2) return true;

	const t1 = typeof o1;
	const t2 = typeof o2;

	if (t1 === 'object' && t2 === 'object') {

		const keys1 = Object.keys(o1).sort();
		const keys2 = Object.keys(o2).sort();

		if (Array.isArray(o1) && Array.isArray(o2)) {
			if (keys1.length !== keys2.length) return false;

			for (let i = 0, len = o1.length; i < len; i++) {
				if (!equals(o1[i], o2[i])) {
					return false;
				}
			}

			return true;
		} else if (Array.isArray(o1) || Array.isArray(o2)) {
			return false;
		}

		if (keys1.length !== keys2.length) return false;

		if (JSON.stringify(keys1) !== JSON.stringify(keys2)) {
			return false;
		}

		for (let i = 0, len = keys1.length; i < len; i++) {
			if (!equals(o1[keys1[i]], o2[keys1[i]])) {
				return false;
			}
		}

		return true;
	}

	return false;
}

function Store() {
	this._map = new Map();

	this.put = (key, value) => {
		this._map.set(key, value);
	};

	this.has = (...args) => {
		const values = this._map.values();

		for (let value of values) {
			const has = equals(value.args, args);

			if (has) {
				return value;
			}
		}

		return false;
	};

	this.clear = key => {
		this._map.delete(key);
	};
}

export default function cache(target, key, descriptor) {

	const method = descriptor.value;
	const store = new Store();

	descriptor.value = async function(...args) {

		const value = store.has(...args);

		if (value) {
			return Promise.resolve(value.result);
		}

		const key = Symbol();

		const result = await method.apply(this, [...args, () => store.clear(key)]);
		store.put(key, { result, args });
		return result;
	};

	return descriptor;
}
