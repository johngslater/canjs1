define(function(require){

  //--------------------------------------------------------------------------------------------------------
      //mnmx                    :[mn,mx],
      //threshold               :threshold,  // used for debugging
      //overThreshold           :overThreshold,
      //underThreshold          :underThreshold,
      //withinThreshold         :withinThreshold,
      //currentlyOverThreshold  :currentlyOverThreshold,
      //currentlyUnderThreshold :currentlyUnderThreshold,
      //currentlyWithinThreshold:currentlyWithinThreshold


  //    ICON - border coloring   // dec 3 2013
  //
  //    __when tSpan includes current date__
  //                                              --within threshold---
  //    icon/m   interior              perimeter  duringTimeSpan    NOW
  //    ------   --------              ---------  --------------    ---
  //    green    green                            Y                 -
  //    yellow   yellow                           N                 Y
  //    red      red                   red **     N                 N
  //    gray     gray/semi-opaqueIcon             no data           -
  //                       ** this keeps a red boarder at a constant size
  //    __when tSpan does not include current date__
  //                                              --within threshold---
  //    icon/m   interior              perimeter  duringTimeSpan    NOW
  //    ------   --------              ---------  --------------    ---
  //    green    green                            Y                 Y
  //    gr-red   green                 red        Y                 N
  //    gr-blk   green                 red        no data           noData
  //    yellow   yellow                           N                 Y
  //    y-red    yellow                red        N                 N
  //    y-blk    yellow                red        no data           noData
  //    gray     gray/semi-opaqueIcon             no data           Y
  //    gray-red gray/semi-opaqueIcon  red        no data           N
  //    gray-blk gray/semi-opaqueIcon  black      no data           noData

  var icon_draw=function(canvas,_sense,reading){
    // from placementSummaryView  96
    var t1=tSpan[1];   // o.values.tSpan[1];
    var today=new Date(), yTd=today.getFullYear(), mTd=today.getMonth()+1, dTd=today.getDate();
    var current=(t1[0]==yTd && t1[1]==mTd && t1[2]==dTd);

    if(current){
      if(reading.withinThreshold==undefined){
        var clr1='gray';
        var opacity='0.4';
      }
      else{
        var clr1=reading.withinThreshold ? 'green' : (reading.currentlyWithinThreshold ? 'yellow' : 'red');
        var opacity='1.0';
      }
      var clr2= (clr1=='red') ? 'red' : '';
    }
    else{
      if(reading.withinThreshold==undefined){
        var clr1='gray';
        var opacity='0.4';
      }
      else{
        var clr1=reading.withinThreshold ? 'green' : 'yellow';
        var opacity='1.0';
      }
      var clr2=reading.currentlyWithinThreshold==undefined ? '' : ( reading.currentlyWithinThreshold ? '' : 'red');
    }

  //  var canvas=$('#screenPlacementPlot_swipeSenseIconDetector canvas');
    var canvasPerimeter=canvas.parent();
    canvasPerimeter.css({
      padding:'4px', 'border-radius':'12px', margin:'5px', 'margin-bottom':'-20px', 'background-color':clr2
    });
    canvas.css({
      padding:'8px', 'border-radius':'8px', margin:'0px', 'background-color':clr1,  opacity:opacity
    }); // margin is inherited, so set to 0
    canvasPerimeter.width(canvas.outerWidth());
    canvasPerimeter.height(canvas.outerHeight());
    icon_render[_sense].render(canvas[0]);
  };

  //=======================================================================================util fns
  // dev.opera.com/articles/view/html-5-canvas-the-basics/
  var line=function(ctx,x0,y0,x,y, color){ // color="rgb(256,0,0)" or '#f00'  etc
    ctx.save(); ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x,y); ctx.stroke(); ctx.restore();
  };

  var rect=function(ctx,x0,y0,x,y, color){ // color="rgb(256,0,0)" or '#f00'  etc
    var a=function(f){ return Math.round(f)+0.0; } //align to grid, w/lines the center is on the crd
    ctx.save();
    ctx.fillStyle =color;
    ctx.strokeStyle = '#f00'; // red  // rgb
    ctx.lineWidth   = 2;
  //ctx.fillRect(a(x0),a(y0),a(x-x0),a(y-y0));  // x,y,w,h  does not do rounding properly
    ctx.fillRect(a(x0),a(y0),a(x)-a(x0),a(y)-a(y0));  // x,y,w,h
    ctx.restore();
  };
  var roundedRect_path=function(ctx,x,y,w,ht,r){
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.arcTo(x+w,y, x+w,y+r, r);
    ctx.lineTo(x+w,y+ht-r);
    ctx.arcTo(x+w,y+ht, x+w-r,y+ht, r);
    ctx.lineTo(x+r, y+ht);
    ctx.arcTo(x,y+ht, x,y+ht-r, r);
    ctx.lineTo(x, y+r);
    ctx.arcTo(x,y, x+r, y, r);
  };
  var bottomRoundedRect_path=function(ctx,x,y,w,ht,r){
    ctx.moveTo(x, y);
    ctx.lineTo(x+w, y);
    ctx.lineTo(x+w,y+ht-r);
    ctx.arcTo(x+w,y+ht, x+w-r,y+ht, r);
    ctx.lineTo(x+r, y+ht);
    ctx.arcTo(x,y+ht, x,y+ht-r, r);
    ctx.lineTo(x, y);
  };
  var centeredCircle=function(canvas,r){
  // http://www.html5canvastutorials.com/tutorials/html5-canvas-circles/
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = r;

    ctx.beginPath();
     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
     ctx.fillStyle = "#8ED6FF";
     ctx.fill();
     ctx.lineWidth = 5;
     ctx.strokeStyle = "black";
    ctx.stroke();
  };
  var piePiece = function (ctx, xc, yc, r, a1, a2, color) {
  // html5.litten.com/graphing-data-in-the-html5-canvas-element-part-iv-simple-pie-charts/
    ctx.beginPath();
    ctx.arc(xc, yc, r, a1, a2, false);
    ctx.fillStyle = color;
    ctx.fill();
    //ctx.lineWidth = 1;
   // ctx.strokeStyle = "yellow";
   // ctx.stroke();
  };
  //=======================================================================================icons
  var skyAndGround_draw=function(canvas,drawGroundTF){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    ctx.save();
      var yGround=0.2*ht;
     // rect(ctx,0,0      ,w,ht,'#77BDCA'); // sky
      ctx.beginPath();
      roundedRect_path(ctx,0,0,w,ht,0.1*w); // x,y,w,ht,r
      ctx.fillStyle='#77BDCA'; ctx.fill();
      //ctx.lineWidth = 1;
      //ctx.stroke();
      if(drawGroundTF){
      //  rect(ctx,0,yGround,w,ht,'#C37147'  );  // ground  #C37147  brown
        ctx.beginPath();
        bottomRoundedRect_path(ctx,0,yGround,w,ht-yGround,0.1*w); // x,y,w,ht,r
        ctx.fillStyle='#C37147'; ctx.fill();
        ctx.beginPath();  // grass
          ctx.shadowColor   = 'white';
          ctx.shadowBlur    = 0.15*w;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = -0.1*w;

          ctx.lineWidth=0.1*ht;
          ctx.strokeStyle = "green";
          ctx.moveTo(0,yGround);ctx.lineTo(w,yGround);
        ctx.stroke();
      }

    ctx.restore();
  };




  var arrowRight_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;
    ctx.save();
      ctx.translate(0,ht/2);
      var X=function(x){ return  w*x; };
      var Y=function(y){ return (ht/2)*y; };
      ctx.beginPath();
        ctx.moveTo(X(0.75),Y(0));
        ctx.lineTo(X(0.25),Y( 0.5));
        ctx.lineTo(X(0.25),Y(-0.5));
      ctx.fillStyle='black'; ctx.fill();
    ctx.restore();
  }
  var arrowLeft_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;
    ctx.save();
      ctx.translate(w/2,ht/2);
      ctx.scale(-1,1);
      ctx.translate(-w/2,-ht/2);
      ctx.translate(0,ht/2);
      var X=function(x){ return  w*x; };
      var Y=function(y){ return (ht/2)*y; };
      ctx.beginPath();
        ctx.moveTo(X(0.75),Y(0));
        ctx.lineTo(X(0.25),Y( 0.5));
        ctx.lineTo(X(0.25),Y(-0.5));
      ctx.fillStyle='black'; ctx.fill();
    ctx.restore();
  }


  var settings_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;
    var img = new Image();
    img.src = path.img+'cdn1.iconfinder.com/data/icons/picol/icons/settings_32.png';
    ctx.drawImage(img, 0, 0);
    ctx.save();
    ctx.restore();
  };
  var placeStake_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;

    var img = new Image();
    img.src = path.img+'stake_hand.png';
    ctx.drawImage(img, -20, -20);

    ctx.save();

    ctx.restore();
  };
  var plot_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;

    var img = new Image();
    img.src = path.img+'plot.png';
    ctx.drawImage(img, 0, 0, 50,50);

    ctx.save();

    ctx.restore();
  };
  var mapIcon_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;

    var img = new Image();
    img.src = path.img+'mapIcon.png';
    ctx.drawImage(img, -2, -2,50,50);

    return;

    // this is code to draw a marker on a map
    ctx.save();
    var clr='blue';
      var marker_bubble_offset={x:0,y:-25}, marker_radius=14, _2r=2*marker_radius;
      var marker_draw=function(marker,colorCode){  // from gmap
    //    if(o.validity['placementID']&&(o.values['placementID']==marker.name)){
          ctx.save();
          ctx.scale(1.0,0.4);
          arc_draw(ctx,marker_radius,marker_radius+75,marker_radius,0,Math.PI*2,'orange','orange');
          ctx.restore();
          arc_draw(ctx,marker_radius+1,marker_radius+20+1,4,0,Math.PI*2,'brown','brown');
          arc_draw(ctx,marker_radius,marker_radius+20,3,0,Math.PI*2,'violet','violet');
      //  }
        arc_draw(ctx,marker_radius+1,marker_radius+2,marker_radius-3,0,Math.PI*2,clr,colorCode);

    //      marker.note.html('<br/>&nbsp;&nbsp;&nbsp;'+marker.name.substr(-2)+'&nbsp;');

      //  marker.note.html(''+marker.name.substr(-2)+'&nbsp;');  // put the test appropriately
      };
      marker_draw('marker no longer used','yellow');
    ctx.restore();
  };

  var home_draw=function(canvas){
  // from  skyAndGround_draw=function(canvas,drawGroundTF){ sky and ground

    var w=canvas.width,ht=canvas.height;
    var ctx=canvas.getContext('2d');
    var w2=w/2;
    ctx.save();
      var yGround=0.8*ht;

      ctx.shadowColor   = 'white';
      ctx.shadowBlur    = 0.4*w;
      ctx.shadowOffsetX = 0.0*w;
      ctx.shadowOffsetY = -0.7*w;

      // rect(ctx,0,0      ,w,ht,'#77BDCA'); // sky
       ctx.beginPath();
         roundedRect_path(ctx,0,0,w,ht,0.1*w); // x,y,w,ht,r
       ctx.fillStyle='#77BDCA'; ctx.fill();
       //ctx.lineWidth = 1;
       //ctx.stroke();

       ctx.beginPath();
         bottomRoundedRect_path(ctx,0,yGround,w,ht-yGround,0.1*w); // x,y,w,ht,r
       ctx.fillStyle='green'; ctx.fill();
    ctx.restore();
    ctx.save();
      ctx.fillStyle   = 'black';
      ctx.strokeStyle = 'black';
      ctx.lineWidth   = 2;
      ctx.translate(0,ht/12);
       ctx.beginPath();
        ctx.moveTo(w2-w2/2,w2+w2/2); // left bot
        ctx.lineTo(w2-w2/2,w2-w2/2); // left top
        ctx.lineTo(w2     ,w2-w2/2-w2/4); // peak of roof
        ctx.lineTo(w2+w2/2,w2-w2/2); // rt top
        ctx.lineTo(w2+w2/2,w2+w2/2); // rt bot
        // door
         ctx.lineTo(w2+w2/5,w2+w2/2);
         ctx.lineTo(w2+w2/5,w2-w2/8);
         ctx.lineTo(w2-w2/5,w2-w2/8);
         ctx.lineTo(w2-w2/5,w2+w2/2);
    //   ctx.stroke();
       ctx.closePath();
      ctx.fill();

      ctx.beginPath();
       ctx.lineTo(w2-w2/2-2,w2-w2/2); // left top
       ctx.lineTo(w2     ,w2-w2/2-w2/4); // peak of roof
       ctx.lineTo(w2+w2/2+2,w2-w2/2); // rt top
      ctx.stroke();
    ctx.restore();
  };


  var back_draw=function(canvas){
    var w=canvas.width,ht=canvas.height;
    var w2=w/2;
    var ctx=canvas.getContext('2d');
    ctx.save();
      ctx.fillStyle   = 'black';
      ctx.strokeStyle = 'black';
      ctx.lineWidth   = 4*w/30;
      ctx.lineCap = 'round';

      ctx.translate(0,ht/2);
      ctx.beginPath();
        ctx.lineTo(0.8*w,0); // right
        ctx.lineTo(0.2*w,0); // left
      ctx.stroke();
      ctx.beginPath();
        ctx.lineTo(0.2*w,0);
        ctx.lineTo(0.2*w+ht/4,-ht/4); // rt top
      ctx.stroke();
      ctx.beginPath();
        ctx.lineTo(0.2*w,0);
        ctx.lineTo(0.2*w+ht/4,+ht/4); // rt top
      ctx.stroke();
    ctx.restore();
  };
  //====================================================================

  var icons={
    sun:function(canvas){
    // http://seeker9.com/2011/sun-icon-set-vector-grahic/   nice examples
      var deg=(Math.PI / 180);
      var w=canvas.width,ht=canvas.height;
      var ctx=canvas.getContext('2d');

      skyAndGround_draw(canvas,false); // blue sky
      ctx.save();
        ctx.strokeStyle = 'yellow';
        ctx.translate(w/2,ht/2);
        var r=1/5*w;
       // piePiece(ctx,0,0,r,0,360,'yellow');

        var xc=0,yc=0,a1=0,a2=360;
        ctx.beginPath();
          ctx.arc(xc, yc, r, a1, a2, false);
        ctx.closePath();
        var grd = ctx.createRadialGradient(-0.5*r,-0.5*r,0, -0.0*r,-0.1*r,1.2*r)// x0,y0,r0, x1,y1,r1
        grd.addColorStop(0, 'white');
        // got color from http://www.computerhope.com/htmcolor.htm
        grd.addColorStop(0.8,'#FFBF40');
        grd.addColorStop(1,'red');
        ctx.fillStyle = grd; ctx.fill();

        ctx.shadowColor   = 'red';
        ctx.shadowBlur    = 0.1*w;
        ctx.shadowOffsetX = 0.0*w;
        ctx.shadowOffsetY = 0.02*w;
        ctx.lineWidth=1;
        ctx.rotate(-90*deg);
        var dang=360/7;
        for(var ang=0; ang<360; ang+=dang){ line(ctx,0.5*w/2,0,0.8*w/2,0,'yellow'); ctx.rotate(dang*deg); }
      ctx.restore();
    },
    drop:function(canvas){
      skyAndGround_draw(canvas,true);
      var w=canvas.width,ht=canvas.height;
      var ctx=canvas.getContext('2d');
      var yGround=0.2*ht;
      ctx.save();

        ctx.beginPath();  // drop
       // ctx.translate(canvas.width / 2,0);
        ctx.translate(w/2,0);

        ctx.shadowColor   = 'black'; //'white';
        ctx.shadowBlur    = 0.05*w;
        ctx.shadowOffsetX = 0.03*w;
        ctx.shadowOffsetY = 0.03*w;

         var x=0
         var topy=0.15*ht;
         var boty=0.95*ht;
         var foo=0.3*ht; // affects pointiness of top of drop
         var fat=0.8;
         var width=0.4*w;
         ctx.moveTo(x,topy);
         ctx.bezierCurveTo(x,topy+foo, x-fat*width,boty, x,boty);
         ctx.bezierCurveTo(x+fat*width,boty, x,topy+foo, x,topy);
         ctx.closePath();
         var grd = ctx.createLinearGradient(x, topy, x, boty);
          grd.addColorStop(0, "white"); // light blue
          grd.addColorStop(1, "#004CB3"); // dark  blue
         ctx.fillStyle = grd; ctx.fill();
      // ctx.strokeStyle = "blue"; ctx.stroke();
      ctx.restore();
    },
    thermometer:function(canvas,groundTF){
      skyAndGround_draw(canvas,groundTF);
      var w=canvas.width,ht=canvas.height;
     // var canvas=$('#airTemp')[0];
      var ctx=canvas.getContext('2d');
      ctx.save();
        ctx.beginPath();
        ctx.translate(w/ 2,0);

      // the body
        ctx.save()
        ctx.beginPath();
        var wT=0.3*w;
        var htT=0.8*ht;
        ctx.shadowColor   = 'black';
         ctx.shadowBlur    = 0.06*w;
         ctx.shadowOffsetX = 0.04*w;
         ctx.shadowOffsetY = 0.04*w;

        roundedRect_path(ctx,0-wT/2,0.1*w,wT,htT,0.05*w); // x,y,w,ht,r
        ctx.fillStyle='silver'; ctx.fill();
        ctx.restore();

        var x=0
        var topy=0.05*ht;
        var boty=0.75*ht;

        ctx.save();
          ctx.shadowColor='black';
          ctx.shadowBlur=0.1*w;
          ctx.shadowOffsetX=0.015*w;
          ctx.shadowOffsetY=-0.01*w;

          ctx.strokeStyle="white";
          ctx.lineWidth=0.09*ht;
          ctx.beginPath();
            ctx.moveTo(x, topy+0.1*ht);
            ctx.lineTo(x, boty);
          ctx.stroke();
        ctx.restore();

        ctx.save();
          ctx.strokeStyle = "red";
          ctx.lineWidth=0.09*ht;
          ctx.beginPath();
            ctx.moveTo(x,topy+0.30*ht);
            ctx.lineTo(x, boty);
          ctx.stroke();
        ctx.restore();

        piePiece(ctx,x,boty,0.1*w,0,360,'red');
      ctx.restore();
    },

    elec:function(canvas){
      skyAndGround_draw(canvas,true);

      var w=canvas.width,ht=canvas.height;
     // var canvas=$('#airTemp')[0];
      var ctx=canvas.getContext('2d');
      ctx.save();
        ctx.translate(w/2,1.2*ht/2);
        var deg=(Math.PI / 180);
        ctx.rotate(-20*deg);
        var X=function(x){ return 1.1*w/50 *x; };
        var Y=function(y){ return 1.1*ht/50*y; };
        ctx.shadowColor   = 'black';
        ctx.shadowBlur    = 0.1*w;
        ctx.shadowOffsetX = 0.015*w;
        ctx.shadowOffsetY = 0.035*w;
        ctx.beginPath();
          ctx.moveTo(X(-22),Y( 1));
          ctx.lineTo(X(  5),Y(-8));
          ctx.lineTo(X(  3),Y( 0));
          ctx.lineTo(X( 20),Y(-4));
          ctx.lineTo(X( 20),Y( 2));
          ctx.lineTo(X( -2),Y( 5));
          ctx.lineTo(X( -1),Y(-1));
          ctx.lineTo(X(-22),Y( 1));
        ctx.fillStyle='yellow'; ctx.fill();
      ctx.restore();
    },

    allSenses:function(canvas){
      var w=canvas.width,ht=canvas.height;
      var ctx=canvas.getContext('2d');
      skyAndGround_draw(canvas,true);
      ctx.save();
        // draw an upper triangle of sky, without any ground
        ctx.beginPath();
      //roundedRect_path(ctx,0,0,w,ht,0.1*w); // x,y,w,ht,r
        var r=0.1*w,x=0,y=0;
          ctx.moveTo(x, y+ht-r-5);
          ctx.lineTo(x, y+r);
          ctx.arcTo(x,y, x+r,y, r);
          ctx.lineTo(x+w-r, y);
          ctx.fillStyle='#AAE9E9';  //'#85E0E0'; //    '#33CCCC'; // rbg
      //    ctx.fillStyle='#77BDCA'; // orig dark blue
        ctx.fill();

        ctx.save();
         ctx.scale(.8,.8);
         ctx.translate(15,4); dropOnly_draw(canvas);
          ctx.translate(-5,5); elecOnly_draw(canvas);
          ctx.translate(-18,-6); thermometerOnly_draw(canvas);
        ctx.restore();
      ctx.restore();
    }
  };

//  return icon_draw;
  return icons;
});