var _ = require('lodash'),
    Snap = require('snapsvg');


function BendpointSnapping(eventBus) {

  function snapTo(candidates, point) {
    return Snap.snapTo(candidates, point);
  }

  function toPoint(e) {
    return _.pick(e, [ 'x', 'y' ]);
  }

  function getSnapPoints(context) {

    var snapPoints = context.snapPoints,
        waypoints = context.connection.waypoints;

    if (!snapPoints) {
      context.snapPoints = snapPoints = { horizontal: [] , vertical: [] };

      _.forEach(waypoints, function(p) {
        // we snap on existing bendpoints only,
        // not placeholders that are inserted during add
        if (p) {
          snapPoints.horizontal.push(p.y);
          snapPoints.vertical.push(p.x);
        }
      });
    }

    return snapPoints;
  }

  // SNAPPING IMPLEMENTATION

  eventBus.on('bendpoint.move.start', function(event) {
    event.context.snapStart = toPoint(event);
  });

  eventBus.on('bendpoint.move.move', 1500, function(event) {

    var context = event.context,
        snapPoints = getSnapPoints(context),
        start = context.snapStart,
        x = start.x + event.dx,
        y = start.y + event.dy,
        sx, sy;

    if (!snapPoints) {
      return;
    }

    // snap
    sx = snapTo(snapPoints.vertical, x);
    sy = snapTo(snapPoints.horizontal, y);


    // correction x/y
    var cx = (x - sx),
        cy = (y - sy);

    // update delta
    _.extend(event, {
      dx: event.dx - cx,
      dy: event.dy - cy,
      x: event.x - cx,
      y: event.y - cy
    });
  });
}


BendpointSnapping.$inject = [ 'eventBus' ];

module.exports = BendpointSnapping;