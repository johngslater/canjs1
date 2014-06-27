define([
  'require',
	'can/component',
  'app/models/appstate',
  'ui/plot101/plot101',
  'ui/plot102/plot102',
  'json!app/fixtures/farm.json',
  'text!./graph.stache',
	'can/map/define'// ,
//	'css!./graph.css'
], function(require,Component, appState,graphEqns,grapher,mockData){
	'use strict';

  var mockPlot=function(){
    var config={ canvasId:'myCanvas', minX: -10, minY: -10, maxX:10, maxY:10, unitsPerTick:1 };
    var myGraph= Graph(config);

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

//    console.log(mockData)  // exists
  };
  var realPlot=function(ctx,pts){
    console.log(pts);
    if(!pts || pts.length==0){ return; }
    pts=$.map(pts,function(v,k){
      return [[v.measure_time,v.value]]; // map flattens, so add extra set of [ ]
    });
    console.log(pts);
    var dmx,dmn,av=0;
    dmx=dmn=pts[0][1];
    $.map(pts,function(V,k){ var v=V[1]; av+=v; if(v>dmx){ dmx=v; }; if(v<dmn){ dmn=v; } });
    av=av/pts.length; av=Math.round(av);
//    alert('drawing av '+av+' mn,mx '+dmn+','+dmx+' range '+pts[0][0]+','+pts[pts.length-1][0]);
    plotxy(ctx,pts,'senseless',
      [pts[0][0],pts[pts.length-1][0]],[dmn,dmx], av,
      [dmn,dmx+3],
      ['a','b','c','d']
    );
  };

  // ---------- boilerplate copied from graph-screen, ask Curtis for a better way Jun19
  var inserted =false;
  var sense    =undefined;
  var placement=undefined;//wrong - i am getting the stake id, not the placement id
  var canvas   =undefined;
  var fsm=function(){
    console.log(mockData);  // mockData exists just fine
    if(inserted&&placement&&sense){
      var id=placement.gnode_serial_num+'_'+placement.rel_num;
      console.log('in graph.js ',id,sense);
      console.log(mockData.data)
  //    $('#graphLabel').html(placement.gnode_serial_num+' > '+sense); // xyplot code TBD


      // ---- get the data ----
      // todo: BIG giant KLUDGE
      var pts=mockData.data[ {
        'at_celsius':'Air_Temp' ,
        'ec_raw'    :'EC'       ,
        'lt_lumen'  :'Light'    ,
        'sm_raw'    :'Moisture' ,
        'st_celsius':'Soil_Temp'
      }[sense] ].measurements[id]
      console.log(pts);  // measure_time value pairs
      realPlot( $('#myCanvas')[0].getContext('2d'),pts);
      // 2) plot it with my std plotting routine
    }
    else{
  //    $('app-graph').find('#myCanvas');
    }
  };
  appState.bind('sense'    , function(ev, newVal, oldVal) { sense    =newVal; fsm(); });
  appState.bind('placement', function(ev, newVal, oldVal) { placement=newVal; fsm(); });

	var viewModel = can.Map.extend({
		plot: null,
    appState: appState,
    mockData:mockData,  // todo: super KLUDGE
		createPlot: function(el) {
//			var map = this.attr('map');
//			if(!map){ this.attr('map', new google.maps.Map(el, this.getMapOptions())); }
		}
	});
	//Need to trigger resize on the map if we hide it then show it again
  var template=require('text!./graph.stache');  // ./ needs require to figure out the path
	can.Component.extend({
		tag: 'app-graph',
		template: can.stache(template),
		scope: viewModel,
		events: {  //  todo: listen to sense and placement
      init: function(){
//        this.fsm = can.debounce(this.fsm, 200);
//        this.on(); //rebinds to the new debounced version
      },
//      'fsm':function(ev){
//       // ev.batchNum will be unique to each batch of changes
//      }, // you can put the fsm here
//  '{scope.appState} sense': 'fsm',//replaces 82
//      '{scope.appState} placement': 'fsm',//replaces 83
			'inserted': function(){
        mockPlot();
        inserted=true; canvas=$('app-graph').find('#myCanvas');     fsm();
      }
		}
	});
	return viewModel;
});