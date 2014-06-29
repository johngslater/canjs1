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

  return function(canvas,_sense,reading){ // draw a pin
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
});