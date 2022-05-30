class SimpleCache {
	constructor(){
		this.cache = {};
	}

	get(key){
		if (this.cache.hasOwnProperty(key)){
			let value = this.cache[key];
			if (typeof value === 'object'){
				return JSON.parse(JSON.stringify(value)); // A hack for making deep copies
			} else {
				return value;
			}
		}
	}

	set(key, value){
		if (typeof value === 'function'){
			console.error("You can't store a function in the cache! That just doesn't make sense.");
			return false;
		} else if (typeof value === 'object'){
			this.cache[key] = JSON.parse(JSON.stringify(value)); // A hack for making deep copies
		} else {
			this.cache[key] = value;
		}
		return true;
	}

	remove(key){
		if (this.cache.hasOwnProperty(key)){
			delete this.cache[key];
		}
	}
}

module.exports = SimpleCache;
