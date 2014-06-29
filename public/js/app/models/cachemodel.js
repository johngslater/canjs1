define(function(require){
	'use strict';

	var Construct = require('can/construct');
	var Map = require('can/map');
	var List = require('can/list');
	var Storage = require('ui/storage/storage');
	var moment = require('moment');
	var appSettings = require('app/settings');

	require('can/construct/proxy');

	//Make sure all requests have a token
	require('app/models/util/tokenizeRequest');

	require('app/fixtures/gauges');

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
			this._configSubscriptions = [];

			this.config = can.extend(true, this.constructor.defaults, config);

			this.getConfiguration = this._makeGetter.call(this, false);
			this.getData = this._makeGetter.call(this, true);

			return Construct.prototype.setup.apply(this, arguments); // arguments[0]===config
		},
    find: function(params) {
      var self = this,
        cacheInfo = this._cacheLookup(params),
        pendingRequests = [];

      can.each(cacheInfo.misses, function(date){
        var key = self.config.prefix + date,
          ajaxOptions;

        //If request for this date is already pending, we use the existing pending request
        if(self._isPending(key)) {
          pendingRequests.push({
            key: date,
            request: self._pending[key]
          });
        } else {
          ajaxOptions = can.extend({}, self.config.ajaxOptions, {
            data: {
              startDate: date,
              endDate: date
            }
          });

          pendingRequests.push({
            key: date,
            request: self._addPending(self.config.prefix + date, can.ajax(ajaxOptions))
          });
        }
      });

      return this._merge(cacheInfo.hits, pendingRequests); // merge no longer exits
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
				iterator = moment(startDate), //Clone startDate so we can manipulate it.
				cacheMisses = [],
				cachedData = {},
				currentDay, lookup;

			//Loop through the days between start and end and determine if we have the data.
			//We do this instead of keeping track of the dates cached because this will
			//support discontinuous sets of dates.
			for(iterator; iterator.isBefore(endDate); iterator.add('days', 1)) {
				currentDay = iterator.format(this.config.dateFormat);

        lookup = this._storage.get(this.config.prefix + currentDay)
				if(!(lookup)) {
					cacheMisses.push(currentDay); //Miss, store date so we can do a request.
				} else {
					cachedData[currentDay] = lookup; //Hit.
				}
			}

			return {
				hits: cachedData,
				misses: cacheMisses
			};
		},
		_updateConfiguration: function(config) {
			var oldConfig = this._storage.get(this.config.configKey) || {},
				newConfig = can.extend(true, oldConfig, config);

			//Update configuration in storage
			this._storage.set(this.config.configKey, newConfig);

			can.each(this._configSubscriptions, function(update) {
				update(newConfig);
			});
		},
		_getServerData: function(params, success, error) {
			var self = this,
				requestParams = can.extend({}, params),
				cacheInfo = this._cacheLookup(params),
				pendingRequests = [];

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
					//If this is the first request, we need to retrieve the configuration
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

			return {
				data: cacheInfo.hits,
				pending: pendingRequests
			};
		},
		syncConfiguration: function(onUpdate) {
			this._configSubscriptions.push(onUpdate);
		},
		//This creates the getConfiguration (isData === false) and getData (isData === true) functions
		_makeGetter: function(isData){
			return function(params, success, error) {
				console.info('CacheModel::get(' + isData + ')', params);
				var self = this,
					dataInfo = this._getServerData(params, success, error || function(){}),
					requests = can.map(dataInfo.pending, function(p) {
						return p.request;
					});

				if(isData) {
					can.each(dataInfo.data, function(d){
						var data = can.extend({}, d);
						success(data);
					});
				} else {
					success(can.extend({}, (this._storage.get(this.config.configKey) || {})));
				}

				can.each(dataInfo.pending, function(p){
					p.request.then(function(newData){
						var data = can.extend({}, newData);
						if(data.configuration) {
							self._updateConfiguration(data.configuration);
							if(!isData) {
								success(can.extend({}, data.configuration));
							}
							delete data.configuration;
						}
						//Add request data to cache
						self._storage.set(self.config.dataPrefix + p.key, data);
						if(isData) {
							success(data);
						}
					}, error);
				});

				return $.when.apply(null, requests);
			};
		}
	});

	return CacheModel;
});