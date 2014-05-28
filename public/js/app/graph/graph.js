define([
  'require',
	'can/component',
  'app/models/appstate',
  'ui/plot101/plot101',
  'text!./graph.stache',
	'can/map/define'// ,
//	'css!./graph.css'
], function(require,Component, appState,grapher){
	'use strict';

	var viewModel = can.Map.extend({
		plot: null,
		createPlot: function(el) {
//			var map = this.attr('map');
//			if(!map) {
//				this.attr('map', new google.maps.Map(el, this.getMapOptions()));
//			}
		}

	});
	//Need to trigger resize on the map if we hide it then show it again
  var template=require('text!./graph.stache');  // ./ needs require to figure out the path
	can.Component.extend({
		tag: 'gt-graph',
		template: can.stache(template),
		scope: viewModel,
		events: {
			'inserted': function(){  // TBD  text



        var config={ canvasId:'myCanvas',
         //     minX: 0, minY: -10, maxX:7*3600*24, maxY:10, unitsPerTick:1
          minX: -10, minY: -10, maxX:10, maxY:10, unitsPerTick:1
        };

        var myGraph= Graph(config);

    //    myGraph.drawEquation(function(x) { return 5*Math.sin(3600*24/(2*Math.PI)); },'green',3);
        var eqn=function(x){ return 5*Math.sin(x)+1.1*Math.sin(6*x)+0.8*Math.random(); };
     //   myGraph.drawEquation(eqn,'green',3);

        var pts=[];
        for(var i=0; i<200; i++){
          var x=(config.maxX-config.minX)*(i/200)+config.minX;
          pts.push([x,eqn(x)]);
        }

        myGraph.drawPoints(pts,'black',3);

        myGraph.drawEquation(function(x){ return x*x;           },'blue' ,3);
        myGraph.drawEquation(function(x){ return 1*x;           },'red'  ,3);
			}
			// '{scope.farm.placements} add': function(Scope, ev, changed, index) {
			// 	console.log('add', arguments);
			// 	this.scope.addMarker(placement);
			// },
		}
	});

	return viewModel;

});