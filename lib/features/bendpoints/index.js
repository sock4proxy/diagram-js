module.exports = {
  __depends__: [ require('../dragging') ],
  __init__: [ 'bendpoints', 'bendpointSnapping' ],
  bendpoints: [ 'type', require('./Bendpoints') ],
  bendpointSnapping: [ 'type', require('./BendpointSnapping') ]
};