'use strict';

var _ = require('lodash'),
    $ = require('jquery');

var MARKER_HOVER = 'hover',
    MARKER_SELECTED = 'selected';

var getBBox = require('../../util/Elements').getBBox;

var OFFSET = 10;

/**
 * A plugin that adds a visible selection UI to shapes and connections
 * by appending the <code>hover</code> and <code>selected</code> classes to them.
 *
 * @class
 *
 * Makes elements selectable, too.
 *
 * @param {EventBus} events
 * @param {SelectionService} selection
 * @param {Canvas} canvas
 */
function SelectionVisuals(events, canvas, overlays, selection) {

  this._multiSelectionBox = null;
  var self = this;

  function addMarker(e, cls) {
    canvas.addMarker(e, cls);
  }

  function removeMarker(e, cls) {
    canvas.removeMarker(e, cls);
  }

  events.on('element.hover', function(event) {
    addMarker(event.element, MARKER_HOVER);
  });

  events.on('element.out', function(event) {
    removeMarker(event.element, MARKER_HOVER);
  });

  events.on('selection.changed', function(event) {

    function deselect(s) {
      removeMarker(s, MARKER_SELECTED);
    }

    function select(s) {
      addMarker(s, MARKER_SELECTED);
    }

    function addMultiSelectionBox() {

      var newSelection = selection.get();

      if (self._multiSelectionBox) {
        overlays.remove(self._multiSelectionBox);
      }

      if (newSelection.length > 1) {
        var bbox = getBBox(newSelection);

        var html = $('<div></div>').css({
          width: bbox.width + (OFFSET * 2),
          height: bbox.height + (OFFSET * 2),
          border: '1px dashed #A146FF'
        });

        self._multiSelectionBox = overlays.add(canvas.getRootElement(), {
          html: html,
          position: { left: bbox.x - OFFSET, top: bbox.y - OFFSET }
        });
      }
    }

    var oldSelection = event.oldSelection,
        newSelection = event.newSelection;

    addMultiSelectionBox(newSelection);

    _.forEach(oldSelection, function(e) {
      if (newSelection.indexOf(e) === -1) {
        deselect(e);
      }
    });

    _.forEach(newSelection, function(e) {
      if (oldSelection.indexOf(e) === -1) {
        select(e);
      }
    });
  });
}

SelectionVisuals.$inject = [
  'eventBus',
  'canvas',
  'overlays',
  'selection'
];

module.exports = SelectionVisuals;
