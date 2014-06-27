define(function(require){
	'use strict';

	var Construct = require('can/construct');
	var Storage = require('ui/storage/storage');
	var moment = require('moment');
	var appSettings = require('app/settings');

	require('can/construct/proxy');

	//Make sure all requests have a token
	require('app/models/util/tokenizeRequest');

	if(appSettings.fixtures) {
		require(['app/fixtures/gauges'], function(){});
	}

	var firstRequest = true;

	var CacheModel = Construct.extend({
		defaults: {
			dateFormat: 'YYYY-MM-DD',
			configKey: 'gProducts',
			dataPrefix: 'gauges_',
			daySpan: 3,
			ajaxOptions: {
				type: 'get',
				url: '/gauges',
				dataType: 'json'
			}
		}
	}, {
		setup: function(config) {
			this._storage = new Storage({
				type: 'localStorage'
			});
			this._pending = {};

			this.config = can.extend(true, this.constructor.defaults, config);

			return Construct.prototype.setup.apply(this, arguments);
		},
		_addPending: function(key, request) {
			var pending = this._pending;
			if(pending[key]) {
				return pending[key];
			} else {
				request.done(function(){
					delete pending[key];
				});
				pending[key] = request;
				return request;
			}
		},
		_isPending: function(key) {
			return !!this._pending[key];
		},
		_cacheLookup: function(findParams) {
			var startDate = (findParams.startDate ? moment(findParams.startDate) : moment().subtract('days', this.config.daySpan)).format(this.config.dateFormat),
				endDate = (findParams.endDate ? moment(findParams.endDate) : moment()).format(this.config.dateFormat),
				iterator = moment(startDate), //Clone startDare so we can manipulate it.
				cacheMisses = [],
				cachedData = {},
				currentDay, lookup;

			//Loop through the days between start and end and determine if we have the data.
			//We do this instead of keeping track of the dates cached because this will
			//support discontinuous sets of dates.
			for(iterator; iterator.isBefore(endDate); iterator.add('days', 1)) {
				currentDay = iterator.format(this.config.dateFormat);
				if(!(lookup = this._storage.get(this.config.dataPrefix + currentDay))) {
					//Miss, store date so we can do a request.
					cacheMisses.push(currentDay);
				} else {
					//Hit.
					cachedData[currentDay] = lookup;
				}
			}

			return {
				hits: cachedData,
				misses: cacheMisses
			};
		},
		_merge: function(data, pending, requestForData) {
			var self = this,
				def = $.Deferred(),
				isArray = Object.keys(data).length + pending.length > 1,
				requests = can.map(pending, function(p){
					return p.request;
				}),
				instanceData = isArray ? [] : {},
				addData = can.proxy(function(data) {
					if(isArray) {
						instanceData.push(data);
					} else {
						instanceData = can.extend(true, instanceData, data);
					}
				}, this);

			//Add existing data to Array that will become the List.
			can.each(data, function(d, date){
				addData(d);
			});

			//Register success callback for each pending request that will
			//add more data to the List instance
			can.each(pending, function(p){
				p.request.then(function(newData){
					//Update configuration on each request then delete configuration so data in
					//storage is 'clean'
					if(newData.configuration) {
						self._updateConfiguration(newData.configuration);
						delete newData.configuration;
					}
					self._storage.set(self.config.dataPrefix + p.key, newData);

					addData(newData);
				});
			});
			//Return a Deferred that resolves when all the pending requests resolve
			$.when.apply(null, requests).then(function() {
				if(requestForData) {
					def.resolve(instanceData);
				} else {
					def.resolve(self._storage.get(self.config.configKey));
				}
			});
			return def;
		},
		_updateConfiguration: function(config) {
			var oldConfig = this._storage.get(this.config.configKey) || {},
				newConfig = can.extend(true, oldConfig, config);

			this._storage.set(this.config.configKey, newConfig);
		},
		find: function(params, isData) {
			var self = this,
				requestParams = can.extend({}, params),
				requestForData = typeof isData !== 'undefined' ? isData : true,
				cacheInfo = this._cacheLookup(params),
				pendingRequests = [];

			console.info('CacheModel:', params);
			delete params.src;

			can.each(cacheInfo.misses, function(date){
				var key = self.config.dataPrefix + date,
					ajaxOptions;

				//If request for this date is already pending, we use the existing pending request
				if(self._isPending(key)) {
					pendingRequests.push({
						key: date,
						request: self._pending[key]
					});
				} else {
					//Override start/end date to be a single day
					ajaxOptions = can.extend({}, self.config.ajaxOptions, {
						data: can.extend(requestParams, {
							startDate: date,
							endDate: date
						})
					});
					//If this is the first request, we wait until it is complete before
					//making anymore requests so we have the configuration
					if(firstRequest) {
						firstRequest = false;
						ajaxOptions.data.configuration_last_received_at = '';
					}

					pendingRequests.push({
						key: date,
						request: self._addPending(self.config.dataPrefix + date, can.ajax(ajaxOptions))
					});
				}
			});

			return this._merge(cacheInfo.hits, pendingRequests, requestForData);
		}
	});

	return CacheModel;
});