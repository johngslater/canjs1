// from util.js
var rect=function(ctx,x0,y0,x,y, color){ // color="rgb(256,0,0)" or '#f00'  etc
 // var a=function(f){ return Math.round(f)+0.0; } //align to grid, w/lines the center is on the crd
  var a=function(f){ return f+0.0; } //align to grid, w/lines the center is on the crd

  ctx.save();
  ctx.fillStyle =color;
  ctx.strokeStyle = '#f00'; // red  // rgb
  ctx.lineWidth   = 2;
//ctx.fillRect(a(x0),a(y0),a(x-x0),a(y-y0));  // x,y,w,h  does not do rounding properly
  ctx.fillRect(a(x0),a(y0),a(x)-a(x0),a(y)-a(y0));  // x,y,w,h
  ctx.restore();
};

var Graph=(function(){
  var transformContext=function(ctx,centerX,centerY,scaleX,scaleY) {
    ctx.translate(centerX, centerY); // move ctx to center of canvas
    ctx.scale(scaleX, -scaleY); //stretch grid to fit the canvas window + need to invert the y scale
  };
  var _drawEquation=function(equation,color,thickness,
   ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration){
    ctx.save();
      transformContext(ctx,centerX,centerY,scaleX,scaleY);
      ctx.beginPath();
      ctx.moveTo(minX, equation(minX));
      for(var x=minX+iteration; x<=maxX; x+=iteration){
        var y=equation(x);
      //ctx.lineTo(x,y);
        rect(ctx,x,y,x+0.02,y+0.02, color)
      }
    ctx.restore();
      ctx.lineJoin    = 'round';
      ctx.lineWidth   = thickness;
      ctx.strokeStyle = color;
      ctx.stroke();
    ctx.restore();
  };
  var _drawPoints=function(pts,color,thickness,
   ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration){
    ctx.save();
      transformContext(ctx,centerX,centerY,scaleX,scaleY);
      ctx.beginPath();
      ctx.moveTo(pts[0][0],pts[0][1]);
      for(var i=1; i<pts.length; i++){ var pt=pts[i],x=pt[0],y=pt[1];
      ctx.lineTo(x,y);
        rect(ctx,x,y,x+0.04,y+0.04, color)
      }
    ctx.restore();
      ctx.lineJoin    = 'round';
      ctx.lineWidth   = thickness;
      ctx.strokeStyle = color;
      ctx.stroke();
    ctx.restore();
  };
  var _drawStream=function(stream,color,thickness,
   ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration){

//ea time I get a point, put it in an array   zzzzzz
//testStream.subscribe(sub_wr('pub2','green'));


   _drawPoints(pts,color,thickness,
    ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration);
  };

  var proto={
    drawXAxis:function(ctx,canvas,centerY,axisColor,unitsPerTick,unitX,font,centerX,tickSize){
      var tickSz=tickSize/2;
      ctx.save();
        // =====axis
        ctx.beginPath();
        ctx.moveTo(0,centerY); ctx.lineTo(canvas.width,centerY);
        ctx.strokeStyle=axisColor; ctx.lineWidth=2; ctx.stroke();
        // =====tick marks
        ctx.font = font;  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        // -----left ticks
        var delta = -unitsPerTick * unitX; // xPosIncrement
        var unit  = -unitsPerTick;
        var label=0;
        for(var xPos=centerX+delta; xPos>0; xPos=Math.round(xPos+delta)){
          ctx.moveTo(xPos,centerY-tickSz); ctx.lineTo(xPos,centerY+tickSz); ctx.stroke();
          ctx.fillText(unit,xPos,centerY+tickSz+3);
          unit -= unitsPerTick;
        }
        // -----right ticks
        var delta = unitsPerTick * unitX;
        var unit  = unitsPerTick;
        var label=0;
        for(var xPos=centerX+delta; xPos<canvas.width; xPos=Math.round(xPos+delta)){
          ctx.moveTo(xPos,centerY-tickSz); ctx.lineTo(xPos,centerY+tickSz); ctx.stroke();
          ctx.fillText(unit,xPos,centerY+tickSz+3);
          unit += unitsPerTick;
        }
      ctx.restore();
    }
   ,drawYAxis:function(ctx,canvas,centerX,axisColor,unitsPerTick,unitY,font,centerY,tickSize){
      var tickSz=tickSize/2;
      ctx.save();
        // =====axis
        ctx.beginPath();
        ctx.moveTo(centerX,0); ctx.lineTo(centerX,canvas.height);
        ctx.strokeStyle=axisColor; ctx.lineWidth=2; ctx.stroke();
        // =====tick marks
        ctx.font = font; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        // -----top ticks
        var delta = -unitsPerTick * unitY; // yPosIncrement
        var label=0; var labelDelta=function(){ label+=unitsPerTick; return label; }
        for(var yPos=centerY+delta; yPos>0; yPos=Math.round(yPos+delta)){
          ctx.moveTo(centerX-tickSz,yPos); ctx.lineTo(centerX+tickSz,yPos); ctx.stroke();
          ctx.fillText(labelDelta(),centerX-tickSz-3,yPos);
        }
        // -----bottom ticks
        var delta = unitsPerTick * unitY;
        var label=0; var labelDelta=function(){ label-=unitsPerTick; return label; }
        for(var yPos=centerY+delta; yPos<canvas.height; yPos=Math.round(yPos+delta)){
          ctx.moveTo(centerX-tickSz,yPos); ctx.lineTo(centerX+tickSz,yPos); ctx.stroke();
          ctx.fillText(labelDelta(),centerX-tickSz-3,yPos);
        }
      ctx.restore();
    }
  };
  return function(config){
    // user defined properties
    var canvas = document.getElementById(config.canvasId);
    var minX=config.minX, maxX=config.maxX;
    var minY=config.minY, maxY=config.maxY;
    var unitsPerTick = config.unitsPerTick;

    // constants
    var axisColor = '#aaa';
    var font = '8pt Calibri';
    var tickSize = 20;

    // relationships
    var ctx       = canvas.getContext('2d');
    var rangeX=maxX-minX, rangeY=maxY-minY;
    var unitX=canvas.width/rangeX, unitY=canvas.height/rangeY;
    var centerY   = Math.round(Math.abs(minY/rangeY)*canvas.height);
    var centerX   = Math.round(Math.abs(minX/rangeX)*canvas.width);
    var iteration = (maxX-minX)/1000;
    var scaleX=canvas.width/rangeX, scaleY=canvas.height/rangeY;

    var self= {
      ctx:ctx
     ,drawXAxis:function(){
        proto.drawXAxis(ctx,canvas,centerY,axisColor,unitsPerTick,unitX,font,centerX,tickSize);
      }
     ,drawYAxis:function(){
        proto.drawYAxis(ctx,canvas,centerX,axisColor,unitsPerTick,unitY,font,centerY,tickSize);
      }
     ,drawEquation:function(eqn,color,thickness){
        _drawEquation(eqn,color,thickness, ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration);
      }
     ,drawPoints:function(pts,color,thickness){
        _drawPoints(pts,color,thickness, ctx,centerX,centerY,scaleX,scaleY,minX,maxX,iteration);
      }
    }
    self.drawXAxis();
    self.drawYAxis();
    return self;
  }
}());