var _ = require('lodash');

var Dom = require('../../util/Dom'),
    Event = require('../../util/Event'),
    Util = require('./Util');

var BENDPOINT_IDX_ATTR = 'data-idx',
    BENDPOINT_CLS = Util.BENDPOINT_CLS,
    BENDPOINT_SELECTOR = '.' + BENDPOINT_CLS;

/**
 * A service that adds editable bendpoints to connections.
 *
 * @param {EventBus} eventBus
 */
function Bendpoints(eventBus, dragging, canvas, graphicsFactory, modeling) {

  function toLocalCoordinates(event) {

    var position = Event.toPoint(event),
        clientRect = canvas._container.getBoundingClientRect(),
        offset;

    // canvas relative position

    offset = {
      x: clientRect.left,
      y: clientRect.top
    };

    // update actual event payload with canvas relative measures

    var viewbox = canvas.viewbox();

    return {
      x: viewbox.x + (position.x - offset.x) / viewbox.scale,
      y: viewbox.y + (position.y - offset.y) / viewbox.scale
    };
  }

  function addBendpoints(connection, gfx) {

    _.forEach(connection.waypoints, function(p, idx) {
      var bendpointGfx = Util.addBendpoint(gfx);

      bendpointGfx.attr(BENDPOINT_IDX_ATTR, idx);
      bendpointGfx.translate(p.x, p.y);
    });
  }

  function removeBendpoints(connection, gfx, exclude) {
    gfx.selectAll('.' + BENDPOINT_CLS).forEach(function(s) {
      if (s.node !== exclude) {
        s.remove();
      }
    });
  }

  function getBendpoint(node) {

    if (!node) {
      return null;
    }

    var parent = Dom.closest(node, BENDPOINT_SELECTOR + ', .djs-element, svg');

    if (parent && Dom.matches(parent, BENDPOINT_SELECTOR)) {
      return parent;
    }

    return null;
  }


  eventBus.on('element.mousedown', function(e) {

    var element = e.element,
        gfx = e.gfx,
        bendpoint,
        bendpointIndex,
        add = false,
        context;

    if (!element.waypoints) {
      return;
    }

    bendpoint = getBendpoint(e.originalEvent && e.originalEvent.target);

    if (bendpoint) {
      bendpointIndex = parseInt(bendpoint.getAttribute(BENDPOINT_IDX_ATTR));
    } else {
      add = true;
      bendpointIndex = Util.getApproxIntersection(element.waypoints, toLocalCoordinates(e.originalEvent)).index;
    }

    context = {
      connection: element,
      bendpointIndex: bendpointIndex,
      add: add
    };

    dragging.activate(e.originalEvent, 'bendpoint.move', {
      data: {
        connection: element,
        connectionGfx: gfx,
        context: context
      }
    });
  });

  eventBus.on('element.hover', function(e) {
    var element = e.element,
        gfx = e.gfx;

    var hoverTarget = e.originalEvent && e.originalEvent.target;

    if (element.waypoints) {

      if (!getBendpoint(hoverTarget)) {
        addBendpoints(element, gfx);
      }
    }
  });

  eventBus.on('element.out', function(e) {
    var element = e.element;

    var hoverTarget = e.originalEvent && e.originalEvent.relatedTarget,
        hoverBendpoint = getBendpoint(hoverTarget);

    removeBendpoints(element, e.gfx, hoverBendpoint);
  });


  // DRAGGING IMPLEMENTATION


  function redrawConnection(data) {
    graphicsFactory.update('connection', data.connection, data.connectionGfx);
  }

  eventBus.on('bendpoint.move.start', function(e) {

    var context = e.context,
        connection = context.connection,
        add = context.add,
        idx = context.bendpointIndex;

    if (add) {
      // insert placeholder for bendpoint to-be-added
      connection.waypoints.splice(idx, 0, null);
    } else {
      context.originalBendpoint = connection.waypoints[idx];
    }

    canvas.addMarker(connection, 'djs-updating');
  });

  eventBus.on('bendpoint.move.move', function(e) {

    var context = e.context,
        connection = e.connection;

    connection.waypoints[context.bendpointIndex] = { x: e.x, y: e.y };

    redrawConnection(e);
  });

  eventBus.on([
    'bendpoint.move.end',
    'bendpoint.move.cancel'
  ], function(e) {

    var context = e.context,
        connection = context.connection,
        add = context.add,
        idx = context.bendpointIndex;

    context.newWaypoints = _.clone(connection.waypoints);

    if (add) {
      // remove placeholder for new bendpoint
      connection.waypoints.splice(idx, 1);
    } else {
      connection.waypoints[idx] = context.originalBendpoint;
    }

    canvas.removeMarker(connection, 'djs-updating');
  });

  eventBus.on('bendpoint.move.end', function(e) {

    var context = e.context;

    modeling.updateWaypoints(context.connection, context.newWaypoints);

    // TODO: reconnect
    // TODO: rules
  });

  eventBus.on('bendpoint.move.cancel', function(e) {
    redrawConnection(e);
  });
}

Bendpoints.$inject = [ 'eventBus', 'dragging', 'canvas', 'graphicsFactory', 'modeling' ];

module.exports = Bendpoints;