define(function(require){
	'use strict';

	var Construct = require('can/construct');
	var List = require('can/list');
	var Storage = require('ui/storage/storage');
	var moment = require('moment');

	var CacheModel = Construct.extend({
		defaults: {
			dateFormat: 'YYYY-MM-DD',
			prefix: 'gauges_',
			daySpan: 3,
			ajaxOptions: {
				type: 'get',
				url: '/gauges',
				dataType: 'json'
			},
			List: List
		}
	}, {
		setup: function(config) {
			this._storage = new Storage({
				type: 'localStorage'
			});
			this._pending = {};

			this.config = can.extend(true, this.constructor.defaults, config);

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

      return this._merge(cacheInfo.hits, pendingRequests);
    },
		_addPending: function(key, request) {
			var pending = this._pending;
			if(pending[key]) {
				return pending[key];
			} else {
				request.done(function(){
					delete pending[key];
				});
				return pending[key] = request;
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
			//support discontinuous sets of dates. The solution to handle this with tracking
			//still involves looping and extra overhead
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
		_merge: function(data, pending) {
			var self = this,
				instanceData = [],
				instance;

			//Add existing data to Array that will become the List returned.
			can.each(data, function(d, date){
				instanceData.push(d);
			});

			//Create list.
			instance = new this.config.List(instanceData);

			//Register success callback for each pending request that will
			//add more data to the List instance
			can.each(pending, function(p){
				p.request.then(function(newData){
					var parsedData = self._parseData(newData);
					self._storage.set(self.config.prefix + p.key, parsedData);
					instance.push(parsedData);
				});
			});
			return instance;
		},
		_parseData: function(data){
			return data;
		}
	});

	return CacheModel;
});