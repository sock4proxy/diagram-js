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
});
