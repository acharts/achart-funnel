var Util = require('achart-util'),
  CAxis = require('./category');

/**
 * @class Chart.Axis.NumberCategory
 * 数字分类
 * @extends Chart.Axis.Category
 */
var NumberCategory = function(cfg){
  NumberCategory.superclass.constructor.call(this,cfg)
};

NumberCategory.ATTRS = {
  type : 'numberCategory',
  /**
     * 是否分类坐标点在2个tick的中间
     * @type {Boolean}
     */
  tickAlignCenter : false
};

Util.extend(NumberCategory,CAxis);

module.exports = NumberCategory;