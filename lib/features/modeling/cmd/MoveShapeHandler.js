'use strict';

var _ = require('lodash');

var MoveHelper = require('./helper/Move'),
    Collections = require('../../../util/Collections');


/**
 * A handler that implements reversible moving of shapes.
 */
function MoveShapeHandler(modeling) {
  this._modeling = modeling;

  this._helper = new MoveHelper(modeling);
}

MoveShapeHandler.$inject = [ 'modeling' ];

module.exports = MoveShapeHandler;


MoveShapeHandler.prototype.execute = function(context) {

  var shape = context.shape,
      delta = context.delta,
      newParent = this.getNewParent(context),
      oldParent = shape.parent;

  // save old parent in context
  context.oldParent = oldParent;
  context.oldParentIndex = Collections.indexOf(oldParent.children, shape);

  // update shape parent + position
  _.extend(shape, {
    parent: newParent,
    x: shape.x + delta.x,
    y: shape.y + delta.y
  });

  return shape;
};

MoveShapeHandler.prototype.postExecute = function(context) {

  var shape = context.shape;

  var modeling = this._modeling;

  if (context.hints.layout !== false) {
    _.forEach(shape.incoming, function(c) {
      modeling.layoutConnection(c);
    });

    _.forEach(shape.outgoing, function(c) {
      modeling.layoutConnection(c);
    });
  }

  if (context.hints.recurse !== false) {
    this.moveChildren(context);
  }
};

MoveShapeHandler.prototype.revert = function(context) {

  var shape = context.shape,
      oldParent = context.oldParent,
      oldParentIndex = context.oldParentIndex,
      currentIdx,
      delta = context.delta;

  // restore previous location in old parent
  Collections.add(oldParent.children, shape, oldParentIndex);

  // revert to old position and parent
  _.extend(shape, {
    parent: oldParent,
    x: shape.x - delta.x,
    y: shape.y - delta.y
  });

  return shape;
};

MoveShapeHandler.prototype.moveChildren = function(context) {

  var delta = context.delta,
      shape = context.shape;

  this._helper.moveRecursive(shape.children, delta, null);
};

MoveShapeHandler.prototype.getNewParent = function(context) {
  return context.newParent || context.shape.parent;
};