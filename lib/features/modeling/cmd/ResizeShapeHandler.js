'use strict';

var _ = require('lodash');

var Elements = require('../../../util/Elements');


/**
 * A handler that implements reversible resizing of shapes.
 *
 */
function ResizeShapeHandler(modeling) {
  this._modeling = modeling;
}

ResizeShapeHandler.$inject = [ 'modeling' ];

module.exports = ResizeShapeHandler;

/**
 * {
 *   shape: {....}
 *   newBounds: {
 *     width:  20,
 *     height: 40,
 *     x:       5,
 *     y:      10
 *   }
 *
 * }
 */
ResizeShapeHandler.prototype.execute = function(context) {

  var shape   = context.shape,
      newBounds = context.newBounds;

  // save old bbox in context
  context.oldBounds = {
    width:  shape.width,
    height: shape.height,
    x:      shape.x,
    y:      shape.y
  };

  // update shape
  _.extend(shape, {
    width:  newBounds.width,
    height: newBounds.height,
    x:      newBounds.x,
    y:      newBounds.y
  });

  return shape;
};

ResizeShapeHandler.prototype.postExecute = function(context) {

  var shape = context.shape;

  var modeling = this._modeling;

  _.forEach(shape.incoming, function(c) {
    modeling.layoutConnection(c);
  });

  _.forEach(shape.outgoing, function(c) {
    modeling.layoutConnection(c);
  });

};

ResizeShapeHandler.prototype.revert = function(context) {

  var shape   = context.shape,
      oldBounds = context.oldBounds;

  // restore previous bbox
  _.extend(shape, {
    width:  oldBounds.width,
    height: oldBounds.height,
    x:      oldBounds.x,
    y:      oldBounds.y
  });

  return shape;
};
