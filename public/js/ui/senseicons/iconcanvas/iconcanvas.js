define(function(require){
	'use strict';

	// var mapping = {
	// 	'sun'
	// }
	var Component = require('can/component');

	var ViewModel = {};

	Component.extend({
		tag: 'ui-iconcanvas',
		// template: '<canvas></canvas>',
		template: '[{{sense}}]',
		scope: ViewModel,
		events: {
			'inserted': function(){
				console.log('ui-iconcanvas inserted', this.scope.serialize());
			// 		var target=this.element.find('.senseIcons');
			// 		target.html('senseIcons go here');


		 // //     var cnt=0; make it a global
			// 		var newCnvs=function(){cnt+=1;
			// 			var id='cnvs'+cnt;
			// 			console.log('placement-form.Component.events.inserted making a canvas with id:'+id);
			// 			return $('<canvas>').attr({ id:id, width:'45', height:'45' }); };

			// 		var cnvs=newCnvs();
			// 		senseIcons.sun(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.thermometer(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.thermometer(cnvs[0],false);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.drop(cnvs[0],true);
			// 		target.append(cnvs);
			// 		var cnvs=newCnvs();
			// 		senseIcons.elec(cnvs[0],true);
			// 		target.append(cnvs);

				// 	}
			}
		}
	});
	return ViewModel;
});