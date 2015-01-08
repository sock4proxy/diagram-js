'use strict';

var TestHelper = require('../../../TestHelper');

/* global bootstrapDiagram, inject */


var selectionModule = require('../../../../lib/features/selection');
var overlayModule = require('../../../../lib/features/overlays');


describe('features/selection/SelectionVisuals', function() {

  describe('bootstrap', function() {

    beforeEach(bootstrapDiagram({ modules: [ selectionModule ] }));

    it('should bootstrap diagram with component', inject(function() {

    }));

  });

  describe('aaa', function() {

    beforeEach(bootstrapDiagram({ modules: [ selectionModule, overlayModule ] }));

    var shape1, shape2, shape3, connection1;

    beforeEach(inject(function(canvas) {

      // given
      shape1 = canvas.addShape({
        id: 'shape1',
        x: 10,
        y: 10,
        width: 100,
        height: 100
      });

      shape2 = canvas.addShape({
        id: 'shape2',
        x: 150,
        y: 10,
        width: 100,
        height: 100
      });

      shape3 = canvas.addShape({
        id: 'shape3',
        x: 300,
        y: 300,
        width: 100,
        height: 100
      });

      connection1 = canvas.addConnection({
        id: 'connection1',
        waypoints: [ { x: 110, y: 60 }, {x: 150, y: 60} ]
      });
    }));

    iit('.......', inject(function(selection) {

      // when
      selection.select(shape1);
      selection.select(shape2, true);
      selection.select(connection1, true);
      selection.select(shape3, true);

      //then
      var selectedElements = selection.get();
      // expect(selectedElements[0]).toBe(shape1);
    }));
  });

});
