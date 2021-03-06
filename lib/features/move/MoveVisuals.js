var _ = require('lodash');

var Elements = require('../../util/Elements');

var LOW_PRIORITY = 500;

var MARKER_DRAGGING = 'djs-dragging',
    MARKER_OK = 'drop-ok',
    MARKER_NOT_OK = 'drop-not-ok';


/**
 * A plugin that makes shapes draggable / droppable.
 *
 * @param {EventBus} eventBus
 * @param {ElementRegistry} elementRegistry
 * @param {Canvas} canvas
 * @param {Styles} styles
 */
function MoveVisuals(eventBus, elementRegistry, canvas, styles) {

  function getGfx(e) {
    return elementRegistry.getGraphics(e);
  }

  function getVisualDragShapes(shapes) {
    return Elements.selfAndDirectChildren(shapes, true);
  }

  function getAllDraggedElements(shapes) {
    var allShapes = Elements.selfAndAllChildren(shapes, true);

    var allConnections = _.collect(allShapes, function(shape) {
      return (shape.incoming || []).concat(shape.outgoing || []);
    });

    return _.flatten(allShapes.concat(allConnections), true);
  }

  function addDragger(shape, dragGroup) {
    var gfx = getGfx(shape);
    var dragger = gfx.clone();
    var bbox = gfx.getBBox();

    dragger.attr(styles.cls('djs-dragger', [], {
      x: bbox.x,
      y: bbox.y
    }));

    dragGroup.add(dragger);
  }

  // assign a low priority to this handler
  // to let others modify the move context before
  // we draw things
  //
  eventBus.on('shape.move.start', LOW_PRIORITY, function(event) {

    var context = event.context,
        dragShapes = context.shapes;

    var dragGroup = canvas.getDefaultLayer().group().attr(styles.cls('djs-drag-group', [ 'no-events' ]));

    var visuallyDraggedShapes = getVisualDragShapes(dragShapes);

    visuallyDraggedShapes.forEach(function(shape) {
      addDragger(shape, dragGroup);
    });


    // cache all dragged elements / gfx
    // so that we can quickly undo their state changes later
    var allDraggedElements = context.allDraggedElements = getAllDraggedElements(dragShapes);

    // add dragging marker
    _.forEach(allDraggedElements, function(e) {
      canvas.addMarker(e, MARKER_DRAGGING);
    });

    context.dragGroup = dragGroup;
  });

  // assign a low priority to this handler
  // to let others modify the move context before
  // we draw things
  //
  eventBus.on('shape.move.move', LOW_PRIORITY, function(event) {

    var context = event.context,
        dragGroup = context.dragGroup,
        target = context.target;

    if (target) {
      canvas.addMarker(target, context.canExecute ? MARKER_OK : MARKER_NOT_OK);
    }

    dragGroup.translate(event.dx, event.dy);
  });

  eventBus.on([ 'shape.move.out', 'shape.move.cleanup' ], function(event) {
    var context = event.context;

    if (context.target) {
      canvas.removeMarker(context.target, context.canExecute ? MARKER_OK : MARKER_NOT_OK);
    }
  });

  eventBus.on('shape.move.cleanup', function(event) {

    var context = event.context,
        allDraggedElements = context.allDraggedElements,
        dragGroup = context.dragGroup;


    // remove dragging marker
    _.forEach(allDraggedElements, function(e) {
      canvas.removeMarker(e, MARKER_DRAGGING);
    });

    if (dragGroup) {
      dragGroup.remove();
    }
  });
}

MoveVisuals.$inject = [ 'eventBus', 'elementRegistry', 'canvas', 'styles' ];

module.exports = MoveVisuals;