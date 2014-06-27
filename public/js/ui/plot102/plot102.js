// orig version from git/gthrive/plotting.js

// JGS plotting

//  for html: $('<ul/>',{'class': 'my-new-list',html: items.join('')}).appendTo('body');

//------------------------------------------------------------------------------------
//// zzzzzzzzzzzzzzzz #plot is hard wired into the plot
//var plotBehavior = function () {
//  var s='#plot';
////var jqn=$(s);
////jqn[0].addEventListener('mousemove',ev_canvas     , false);
////jqn[0].addEventListener('click'    ,ev_canvas     , false);
////jqn[0].addEventListener('mouseout' ,ev_canvas_mOut, false);
//  $(document).on("mousemove",s, ev_canvas, false);
//  $(document).on("click"    ,s, ev_canvas, false);
//  $(document).on("mouseout" ,s, ev_canvas_mOut, false);
//};
//plotBehavior();  // because using jQ.live we can call this right now
//
//var plotter_make = function (nodeID) {  // plotter_make('aPlot');
//// zzzzzzzzzzzzzzzzzzzzzz better have the layout set
//  // http://stackoverflow.com/questions/3008635/html5-canvas-element-multiple-layers
//  $('#' + nodeID)
//    .append(
//      $('<div style="position: relative;">')
//        .append($('<canvas id="plot"  class="foo"   width="370" height="300" style="z-index:2;">').addClass('abs'))
//        .append($('<canvas id="detector" width="370" height="300" style="z-index:1;">').addClass('abs'))
//    )
//    .append($('<canvas id="makeRoom" style=" z-index:3;" width="370" height="300">')) // works
//  //.append($('<div    id="makeRoom" style=" z-index:3;" width="370" height="300">')) // nope
//  // these work, but event capture is not working
//  //   .append($('<div    id="makeRoom" style=" z-index:3; width:370px; height:300px; ">')) // works
//  //.append($('<div    id="makeRoom" style=" z-index:3;">')
//  //         .css('width','370px').css('height','300px')) // works
//};
//
//
//// sun icon
//// sun http://www.clipartof.com/portfolio/elena/illustration/digital-collage-of-shiny-sun-logo-icons-76454.html
//


var values = [], cntr = 0;

//--------------------------------------------------------------------------------------------
// www.html5canvastutorials.com/tutorials/html5-canvas-text-metrics/
// stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
var text_width=function(ctx,s){ return ctx.measureText(s).width; };
var text_height=function(ctx,s){ return ctx.font.height; };

var plotxy = function (ctx, data, name, xRange, yRange, av, threshold,dateLabels) { // [rmn,rmx]:=threshold
  // xRange,yRange define the crds at the plot's corners
  // dateLabels  ex: [[ t1,t2,t3],[7,8]]  ie the 7th spans t1-t2 and the 8th spans t2-t3
//  var mn2=yRange[0];
//  var mx2=yRange[1];
//  console.log(ctx.canvas.width+','+ctx.canvas.height); // 300,150
  console.log('plotxy x:'+xRange[0]+'-'+xRange[1]+' y:'+yRange[0]+'-'+yRange[1]+
     ' threshold:'+threshold[0]+','+threshold[1]+' av:'+av);

//  $('.console_log').hide();

  //todo provide place/fn to report time zzzz
  //todo  dark band that corresponds to nighttimectx
  //todo move thresholds, give to the api for modifying them
  var labelFont='bold 12px sans-serif';
  ctx.font=labelFont;
  var maxLabelWidth=text_width(ctx,'1234567');

//alert(text_width(ctx,'12345')+','+text_height(ctx,'12345'));  // 35 + undefined  cant alert undefined

  //mouseover info
  var xmargin=maxLabelWidth+4;  // 39
  var ymargin=10;

  var w=$(ctx.canvas).attr('width' );
  var h=$(ctx.canvas).attr('height');

  var plot_w = w-2*xmargin, plot_h = 200;         // size of *plot* surface, the canvas usually will be larger
  var yAxis_x = xmargin, xAxis_y = plot_h+ymargin;   // where in ctx we have the origin plot, note y axis pts down

  var leftSideLabel_xPosition =yAxis_x-3;   //10+labelWidth;
  var rightSideLabel_xPosition=yAxis_x+plot_w+2+maxLabelWidth; // 322



  var xSpan=xRange[1]-xRange[0];
  var ySpan=yRange[1]-yRange[0];
  var scaleX = plot_w / xSpan;
  var scaleY = plot_h / ySpan;

  var Y = function(y){ return xAxis_y - scaleY * y; }, // note y-axis pts down
     YY = function(y){ return Y(y-yRange[0]); };
  var X = function(x){ return yAxis_x + scaleX * x; },
     XX = function(x){ return X(x-xRange[0]); };
  var horzLine = function (ctx, y, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(Math.floor(X(    0)), y); // ctx.moveTo(Math.floor(XX(xRange[0])), y);
    ctx.lineTo(Math.floor(X(xSpan)), y); // ctx.lineTo(Math.floor(XX(xRange[1])), y);
    ctx.stroke();
  };
  var vertLine = function (ctx, x, color) {
    ctx.save();
     ctx.lineWidth = 1;
     ctx.strokeStyle = color;
     ctx.beginPath();
     ctx.moveTo(x,Math.floor(Y(    0))); // ctx.moveTo(Math.floor(y,YY(yRange[0])));
     ctx.lineTo(x,Math.floor(Y(ySpan))); // ctx.lineTo(Math.floor(y,YY(yRange[1])));
     ctx.stroke();
    ctx.restore();
  };




//////  $('#plotContainer').html('').append($('<canvas id="placementPlot"   width="300" height="370">'));



//  console.log(ctx.canvas.width+','+ctx.canvas.height); // 300,150

//  var s='#plot'; // '#placementPlot'
//  s='#placementPlot'; // to get mobile to work  KLUDGE todo: fix this
//
////  ALERT(($(s   )[0]).getContext('2d'))
//  var ctx  = clear(($(s   )[0]).getContext('2d')), a1, a2, aScale = _2pi / (xRange[1]-xRange[0]);
//  ctx.globalAlpha = 1.00;



//  ctx.setTransform(1, 0, 0, 150/370, 0, 0);

  var x0=Math.floor(XX(xRange[0])); // or X(0)
  var x1=Math.floor(XX(xRange[1])); // or X(xSpan)
  rect(ctx,x0,YY(yRange[0]),x1,YY(yRange[1]),'#BBBBBB');  // background   rect ..x0,y0,x,y  210 10

  var ymin=YY(threshold[0]); //160   // why is this larger?  range is -30 to 90
  var ymax=YY(threshold[1]); //10    // scaleY = 1.6 = 200/120   so YY(90) should be
  rect(ctx,x0,ymin,x1,ymax,'#d7f59a'); // band within threshold


  // plot the connector lines
  ctx.lineWidth = 1;
//horzLine(ctx, Y(        0), 'black' );  // x-axis
 ///// horzLine(ctx, YY( av ), 'black' );  // ave
//horzLine(ctx, YY(threshold[0]), 'yellow');  // low -warning threshold[0]
//horzLine(ctx, YY(threshold[1]), 'green' );  // hi  -warning threshold[1]

  // for picking
  values = []; // is a GLOBAL
  var cntr = 0;
  var mn=data[0][1];
  var mx=mn;
  $.map(data, function (pt, i) {
    var x = Math.floor(XX(pt[0])) + 0.5;
    var v = pt[1];
    cntr++;
    if(v<mn){ mn=v; }
    if(v>mx){ mx=v; }
    values[cntr] = [x, v, Y(0), YY(v ), pt.measure_time];
  });




  if(mn<=yRange[1] && mn>=yRange[0]){ horzLine(ctx, YY( mn ), 'white' ); }
  if(mx<=yRange[1] && mx>=yRange[0]){ horzLine(ctx, YY( mx ), 'white' ); }

  ctx.lineWidth = 3; // want a 3x3 dot // todo kludge - the line/dot will be shifted 1.5 pixels to the right
  ctx.beginPath();
  $.map(data, function (pt, i) {
    var x = Math.floor(XX(pt[0])) + 0.5;
    var v = pt[1];
    cntr++;
//    ctxl.strokeStyle = rgbToHex(cntr, 0, 0);
//    ctxl.moveTo(x, YY(v)-3);
//    ctxl.lineTo(x, YY(v));
//  ctxl.stroke();
  });
  ctx.stroke();

  var plotPts=function(data,filter,color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    $.map(data, function (pt, i) {
      var x = Math.floor(XX(pt[0]));
      var v = pt[1];
      if((v<=yRange[1])  && (v>= yRange[0])){ // clip to plotting area
        if (filter(v)) { ctx.moveTo(x, YY(v)-3); ctx.lineTo(x, YY(v)); } // results in 3x3 dot
      }
    });
    ctx.stroke();
  };

  // plot the connector lines
  // make a canvas and place it
  ctx.strokeStyle = 'gray';  // 'gray';
  ctx.lineWidth = 1;

  // Set the clipping area so connector lines are not drawn outside the xy plot surface
  ctx.save();

  ctx.beginPath();
  ctx.rect(yAxis_x, xAxis_y-plot_h, yAxis_x+plot_w, xAxis_y); // left top rt bot
  ctx.clip();

  ctx.beginPath();
  var i0=0;
  var x = Math.floor(XX(data[i0][0]));
  var v = data[i0][1];
  ctx.moveTo(x, YY(v));
 // if((v<=yRange[1])  && (v>= yRange[0])){ ctx.moveTo(x, YY(v)); }
 // else
  for(var i=1; i<data.length; i++){
    var x = Math.floor(XX(data[i][0]));
    var v = data[i][1];
  //  if((v<=yRange[1])  && (v>= yRange[0])){ // clip to plotting area
      ctx.lineTo(x, YY(v));
  //  }
  }
  ctx.stroke();

  ctx.restore();

  ctx.lineWidth = 3;

  plotPts(data,function(v){return true;              } ,'green' );
  plotPts(data,function(v){return (v < threshold[0]);} ,'yellow');
  plotPts(data,function(v){return (v > threshold[1]);} ,'yellow'   );

// ___ labels ___
  // see http://dev.opera.com/articles/view/html-5-canvas-the-basics/ for .fillText
  // http://www.html5canvastutorials.com/tutorials/html5-canvas-text-align/

//  var k=function(v){
//    v=Math.round(100*v)/100;  // removes everything past the last 2 decimal places
//    if(Math.abs(v)>99999){ return  Math.round(v/1000)    .toString()+'K'; }; // 123456.123-> 123K
//    if(Math.abs(v)> 9999){ return (Math.round(v/100 )/10).toString()+'K'; }; // -12345.123-> 12.3K
//    return v;
//  };
  var k=function(v){
    //v=Math.round(100*v)/100;  // removes everything past the last 2 decimal places
    if(Math.abs(v)>99999){ return Math.round(v/1000 )     .toString()+'K'; }; // 123456.123-> 123K
    if(Math.abs(v)> 9999){ return (Math.round(v/100 )/10 ).toString()+'K'; }; // -12345.123-> 12.3K
    if(Math.abs(v)< 10  ){ var rv= (Math.round(v*1000 )/1000); return rv==0 ? '0.00?' : rv.toString();     };
    return v.toPrecision(4).slice(0,5);
  };
//  var x=1234567890;
//  for(var i=1; i<20; i++){
//    console.log(k(x));
//    x=x/10;
//  }




  ctx.font =labelFont;
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';
  ctx.textBaseline='middle';

  //the range of the plot - not so useful
//ctx.fillText(k(yRange[1]), leftSideLabel_xPosition, YY(yRange[1]));
//ctx.fillText(k(yRange[0]), leftSideLabel_xPosition, YY(yRange[0]));


  ctx.textAlign='right';

 // mx and min
  ctx.textBaseline='top';
  var yy,ok=true;
  yy=mn; ok=true;
  if(yy>=yRange[1]){ yy=yRange[1]; ok=false; }
  if(yy<=yRange[0]){ yy=yRange[0]; ok=false; }
  ctx.strokeStyle = ok ? 'black' : 'red';
  ctx.fillStyle   = ok ? 'black' : 'red';
  ctx.fillText(k(mn), leftSideLabel_xPosition, YY(yy));
  ctx.textBaseline='bottom';
  yy=mx; ok=true;
  if(yy>=yRange[1]){ yy=yRange[1]; ok=false; }
  if(yy<=yRange[0]){ yy=yRange[0]; ok=false; }
  ctx.strokeStyle = ok ? 'black' : 'red';
  ctx.fillStyle   = ok ? 'black' : 'red';
  ctx.fillText(k(mx), leftSideLabel_xPosition, YY(yy));


  ctx.textBaseline='middle';
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'black';

  return;  // todo: take this out  after I fix my data jun20



  // threshold range
  ctx.fillText(k(threshold[0]), rightSideLabel_xPosition, YY(threshold[0]));
  ctx.fillText(k(threshold[1]), rightSideLabel_xPosition, YY(threshold[1]));

  $.map(dateLabels[0],function(t,i){ vertLine(ctx,XX(t),'blue');});
  $.map(dateLabels[1],function(l,i){
    ctx.save();
     ctx.textBaseline='top';
     ctx.fillText(l,XX((dateLabels[0][i]+dateLabels[0][i+1])/2) , ymargin+plot_h+4);
    ctx.restore();

  });
};
////--------------------------------------------------------------------------------------------
//var ev_canvas = function (ev) { // position relative to the canvas element.
//  var x, y;
//  if (ev.layerX || ev.layerX == 0) {
//    x = ev.layerX;
//    y = ev.layerY;
//  }  //FF
//  else if (ev.offsetX || ev.offsetX == 0) {
//    x = ev.offsetX;
//    y = ev.offsetY;
//  }  //Opera
//// for a rev of Chrome on the acthis doesnt work,  so I compute 'by hand'
//  var x0 = Math.floor($(ev.target.parentNode).offset().left);
//  var y0 = Math.floor($(ev.target.parentNode).offset().top);
//  x = ev.pageX - x0;
//  y = ev.pageY - y0;  // should be position relative to canvas element.
//
//  // html('x',ev._x); html('y',ev._y); // display mouse coordinates
////  html('rbga', rbga(ev._x,ev._y).join(','));          // display pixal color under mouse
//
//  // if(ev.type=='mousedown') { mDown=true ; X0=x;  Y0=y; html('mDown','true' ); }
//  // if(ev.type=='mouseup'  ) { mDown=false;              html('mDown','false'); }
//
//  if (ev.type == 'mousemove') {
//    var ctx = $('#detector')[0].getContext('2d');
//    var rgba_ = rbga(ctx, x, y);
//    if (rgba_[0] > 0) {
//      var vTrial = values[rgba_[0]];
//      if (vTrial != undefined) {
//        v = vTrial;
//        showTime($('#makeRoom')[0].getContext('2d'), v);
//      }
//    }
//  }
//  if (ev.type == 'click') {
//    if (v != null) {
//      vKeep = [];
//      for (var i = 0; i < v.length; i++) { vKeep[i] = v[i]; }
//    }
//  }
//};
//function ev_canvas_mOut(ev) {
//  if (vKeep) { showTime($('#makeRoom')[0].getContext('2d'), vKeep) }
//}
