//Wrapper around various storage methods
//Should detect the best method to use given the environment
//Currently we hardcode it to localStorage but session, hash, cookie and plain old object storage can be implements
define(function(require){
	'use strict';

	//TODO: Add simple benchmark.js
	var Construct = require('can/construct');

	var Storage = Construct.extend({
		stores: {
			'global': {
				supported: function(){
					return true;
				},
				sizeLimit: 10000000,
				init: function(){
					window.uiStore = {};
					this.instance = window.uiStore;
				},
				get: function(key) {
					return window.uiStore[key];
				},
				set: function(key, value) {
					return window.uiStore[key] = value;
				},
				remove: function(key) {
					return delete window.uiStore[key];
				}
			},
			'localStorage': {
				supported: function(){
					try {
						localStorage.setItem('testing', 'testing');
						localStorage.removeItem('testing');
						return true;
					} catch(e) {
						return false;
					}
				},
				sizeLimit: 4000000,
				init: function(){
					this.instance = window.localStorage;
				},
				get: function(key) {
					return localStorage.getItem(key);
				},
				set: function(key, value) {
					return localStorage.setItem(key, value);
				},
				remove: function(key) {
					return localStorage.removeItem(key);
				}
			},
			'sessionStorage': {
				supported: function(){
					try {
						sessionStorage.setItem('testing', 'testing');
						sessionStorage.removeItem('testing');
						return true;
					} catch(e) {
						return false;
					}
				},
				sizeLimit: 4000000,
				init: function(){
					this.instance = window.sessionStorage;
				},
				get: function(key) {
					return sessionStorage.getItem(key);
				},
				set: function(key, value) {
					return sessionStorage.setItem(key, value);
				},
				remove: function(key) {
					return sessionStorage.removeItem(key);
				}
			}
		}
	}, {
		init: function(config) {
			config = config || {};

			var self = this,
				stores = ['global'],
				store;

			//If user defined a type, add it to the front of the stores Array.
			if(config.type) {
				stores.unshift(config.type);
			}

			//Check each entry in the stores Array and stop when we find the first
			//supported store
			can.each(stores, function(type) {
				store = self.constructor.stores[type];
				if(store && store.supported()) {
					self.store = store;
					return false;
				}
			});
			this.store.init();
			this.currentSize = this.getCurrentSize();
		},
		getAll: function(cb) {
			var instance = this.store.instance,
				store = this.store;

			for(var key in instance){
				if(instance.hasOwnProperty(key)){
					cb(key, store.get(key));
				}
			}
		},
		getCurrentSize: function() {
			var siz=0;
			this.getAll(function(key, data){
				siz += data.length;
			});
			return siz;
		},
		set: function(key, value) {
			//TODO: try/catch to detect quota exceeded
			//TODO: Handle case where key you are setting already exists
			var toStore = JSON.stringify({readCount: 0, readTime: +new Date(), value: value});
			this.makeSpace(toStore);
			this.currentSize += toStore.length;
			return this.store.set(key, toStore);
		},
		get: function(key) {
			var value = JSON.parse(this.store.get(key));
			if(value) {
				value.readCount++;
				value.readTime = +new Date();
				this.store.set(key, JSON.stringify(value));
				return value.value;
			}
			return value;
		},
		remove: function(key) {
			var toRemove = this.store.get(key);
			this.currentSize = this.currentSize - toRemove.length;
			this.store.remove(key);
		},
		makeSpace: function(value) {
			var self = this,
				removal = value.length + this.currentSize - this.store.sizeLimit,
				allData = [];
			if(removal) {
				this.getAll(function(key, data) {
					var d = JSON.parse(data);
					d.key = key;
					d.size = data.length;
					allData.push(d);
				});
				allData.sort(function(a, b){
					var diff = b.readCount - a.readCount;
					if(diff !== 0) {
						return diff;
					}
					return b.readTime - a.readTime;
				});

				while(removal > 0 && allData.length) {
					var last = allData.pop();
					self.remove(last.key);
					removal = removal - last.size;
				}
			}
		}
	});

	return Storage;
});