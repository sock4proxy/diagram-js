var Snap = require('snapsvg');

var BENDPOINT_CLS = module.exports.BENDPOINT_CLS = 'djs-bendpoint';

module.exports.addBendpoint = function(parentGfx) {
  var groupGfx = parentGfx.group().addClass(BENDPOINT_CLS);

  groupGfx.circle(0, 0, 5).addClass('djs-visual');
  groupGfx.circle(0, 0, 10).addClass('djs-hit');

  return groupGfx;
};


function circlePath(center, r) {
  var x = center.x,
      y = center.y;

  return [
    ['M', x, y],
    ['m', 0, -r],
    ['a', r, r, 0, 1, 1, 0, 2 * r],
    ['a', r, r, 0, 1, 1, 0, -2 * r],
    ['z']
  ];
}

function linePath(points) {
  var segments = [];

  points.forEach(function(p) {
    segments.push([ 'L', p.x, p.y ]);
  });

  return segments;
}
/**
 * Returns the closest point on the connection towards a given reference point.
 *
 * @param  {Array<Point>} waypoints
 * @param  {Point} reference
 *
 * @return {Object} intersection data (segment, point)
 */
module.exports.getApproxIntersection = function(waypoints, reference) {
  var intersections = Snap.path.intersection(circlePath(reference, 10), linePath(waypoints));

  var a = intersections[0],
      b = intersections[intersections.length - 1],
      idx;

  if (!a) {
    // no intersection
    return null;
  }

  if (b) {

    if (a.segment2 !== b.segment2) {
      // we use the bendpoint in between both segments
      // as the intersection point

      idx = Math.max(a.segment2, b.segment2) - 1;

      return {
        point: waypoints[idx],
        bendpoint: true,
        index: idx
      };
    }

    return {
      point: {
        x: (Math.round(a.x + b.x) / 2),
        y: (Math.round(a.y + b.y) / 2)
      },
      index: a.segment2
    };
  }

  return {
    point: {
      x: Math.round(a.x),
      y: Math.round(a.y)
    },
    segment: a.segment2
  };
};