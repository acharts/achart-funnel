var AChart = require('acharts'),
	Util = AChart.Util,
	Series = AChart.Series,
	ActivedGroup = AChart.Actived.Group,
	Legend = require("achart-legend");

var Funnel = function(cfg){
		Funnel.superclass.constructor.call(this,cfg);
	};

Util.extend(Funnel,Series);

Util.mixin(Funnel,[ActivedGroup,Legend.UseLegend]);

Funnel.ATTRS = {
	colors : ['#ff6600','#b01111','#ac5724','#572d8a'],
	xField : 'name',
	yField : 'value',
	width : null,
	item : {
		stroke : '#fff'
	}
};

Util.augment(Funnel,{
	renderUI : function(){
		Funnel.superclass.renderUI.call(this);
		this._sortData(this.get('data'));
		this._initpplot();
		this._initGroup();
	},
	//设置边框为零
	_initpplot : function(){
		
		var plotRange = this.get('parent').get('plotRange');
			canvas = this.get('canvas');

			plotRange.bl = {x:0,y:canvas.get('height')-50},
			plotRange.br = {x:canvas.get('width'),y:canvas.get('height')-50},
			plotRange.tl = {x:0,y:0},
			plotRange.tr = {x:canvas.get('width'),y:0};

		this.set('width',canvas.get('width')-80);
		this.set('height',canvas.get('height')-80);
	},
	//存放漏斗图形的分组
	_initGroup : function(){
		var _self = this,
		group = _self.addGroup();
		_self.set('group',group);
	},
	//处理节点前，对数据进行排序
	_sortData : function(data){
		var _self = this; 
		data.sort(function(obj1,obj2){
			if (_self.get('Cfg').overturn) {
				return obj1.value - obj2.value;
			}else{
				return obj2.value - obj1.value;
			}
		});
	},
	getPointByValue : function(name,value) {
		return {xValue : name,value : value};
	},
	processPoint : function(point,index){
		var _self = this,
		width = _self.get('canvas').get('width'),
		startPoint = _self._getStartPoint(),
		centerX = (startPoint.x + width/2),
		avgHeight = _self._getAvgHeight(),
		curY = startPoint.y + avgHeight * index,
		centerY = curY + avgHeight/2;

		point.x = centerX;
		point.y = centerY;

		point.beginY = curY;
		point.endY = curY + avgHeight;
	},
	draw : function(points,callback){
		var _self = this;

		Util.each(points,function(point,index){
			_self._drawShape(point,index);
		});

		this.renderLegend();

		callback && callback();
	},
	_getAvgHeight : function(){
		return this.get('height')/this.get('data').length;
	},
	_drawShape : function(point,index){
		var _self = this,
		cfg = _self._getItemCfg(point,index),
		group = _self.get('group');

		cfg.path = _self._getItemPath(point,index);

		var shape = group.addShape('path',cfg);
			shape.set('value',point.value),
			shape.set('xValue',point.xValue);

		_self._resizeShapeToCenterPoint(shape,0.2);

		shape.animate({
			path : cfg.path
		},400,'<');

		shape.set('point',point);

		if(_self.get('labels')){
			var xValue = point.xValue,
				max = _self._getMaxValue();
			_self.addLabel(xValue,point,max);
		}
	},
	addLabel : function (value,point,max){
	    var _self = this,
	        labelsGroup = _self.get('labelsGroup'),
	        label = {},
			width = _self.get('width'),
	        labelCfg = _self.get('labels'),
	        xOffset = 0,
	        rst;

	    if (labelCfg.position == 'right') {
	    	xOffset = (point.value/max) * width/2 + 20;
	    }else if (labelCfg.position == 'left') {
	    	xOffset = -((point.value/max) * width/2 + 20);
	    }; 


	    if(labelsGroup){
	    	label.text = value;
			label.x = point.x + xOffset;
			label.y = point.y;
			label.point = point;
			rst = labelsGroup.addLabel(label);
	    }

	    return rst;
    }, 
	_resizePath : function(path,m){
		if(path){
			arrPath = Util.parsePathString(path);
		    for (var i = 0; i < arrPath.length; i++) {
		    	for (var j = 1; j < arrPath[i].length; j++) {
		    		arrPath[i][j] = arrPath[i][j]*m;
		    	};
		    };
		    path = Util.parsePathArray(arrPath);	
		    return path;
		}else{
			return "";
		}
	},
	//以Shap中心点为参考点缩放
	_resizeShapeToCenterPoint : function(shape,m){
		var _self = this,
			bbox = shape.getBBox(),
			path = Util.parsePathArray(shape.attr('path')),
			point = {
				x : bbox.cx,
				y : bbox.cy
			};
		if(path){
			arrPath = Util.parsePathString(path);
		    for (var i = 0; i < arrPath.length; i++) {
		    	for (var j = 1; j < arrPath[i].length; j++) {
		    		if (j%2 == 0) {
		    			arrPath[i][j] = point.y - (point.y - arrPath[i][j])*m;
		    		}else{
		    			arrPath[i][j] = point.x - (point.x - arrPath[i][j])*m;
		    		}
		    	};
		    };
		    shape.attr('path',Util.parsePathArray(arrPath));	
		}else{
			return null;
		}
	},
	//省略逻辑直接设置20,20,否则需要根据plotRange计算
	_getStartPoint : function(){
		return {x : 0,y:0};
	},
	//获取最大的值
	_getMaxValue : function(){
		var data = this.get('data'),
			max = this.get('data')[0].value;
		for (var i = 1; i < data.length; i++) {
			if (data[i].value > max) {
				max = data[i].value;    			
			};
		};
		return max;
	},
	//获取最大的值
	_getMinValue : function(){
		var data = this.get('data'),
			min = this.get('data')[0].value;
		for (var i = 1; i < data.length; i++) {
			if (data[i].value < min) {
				min = data[i].value;    			
			};
		};
		return min;
	},
	//获取节点的path
	_getItemPath : function(point,index){
		var _self = this,
		max = _self._getMaxValue(),
		min = _self._getMinValue(),
		width = _self.get('width'),
		points = _self.getPoints();
		if (_self.get('Cfg').topShape == "angle") {
			topValue = 0;
		}else if (_self.get('Cfg').topShape == "rect") {
			topValue = min;
		}

		if (_self.get('Cfg').overturn) {
			lastValue = points[index - 1] ? points[index - 1].value : topValue;
			var tl = point.x - (lastValue/max) * width/2,
				tr = point.x + (lastValue/max) * width/2,
				bl = point.x - (point.value/max) * width/2,
				br = point.x + (point.value/max) * width/2;
			return [['M',tl,point.beginY],['L',tr,point.beginY],['L',br,point.endY],['L',bl,point.endY],['z']];
		}else{
			nextValue = points[index + 1] ? points[index + 1].value : topValue;
			var tl = point.x - (point.value/max) * width/2,
				tr = point.x + (point.value/max) * width/2,
				bl = point.x - (nextValue/max) * width/2,
				br = point.x + (nextValue/max) * width/2;
			return [['M',tl,point.beginY],['L',tr,point.beginY],['L',br,point.endY],['L',bl,point.endY],['z']];
		}
	},
    //覆写 getLengendItems 方法
    getLengendItems : function(){
	  var types = 'circle',
		  symbols = 'circle';
      var _self = this,
	      group = _self.get('group'),
	      items = [];
	      children = group.get('children');
        
      Util.each(children,function(child,i){
		color = child.get('attrs').fill;
		var item = {
		name : 'test ' + i,
		color : color,
		type : types,
		symbol : symbols, 
		item : child
		};
		items.push(item);
      });

      return items;
    },
	//覆写Lengend鼠标事件
	_bindLegendEvent : function(){
		var _self = this,
		  legendGroup = _self.get('legendGroup');

		//over
		legendGroup.on('itemover',function(ev){
		  var legendItem = ev.item,
		    item = _self.getByLendItem(legendItem);
		  if(_self.setActivedItem){
		    _self.setActivedItem(item);
		  }
		});

		//out
		legendGroup.on('itemout',function(ev){
		  var legendItem = ev.item,
		    item = _self.getByLendItem(legendItem);
		  if(_self.clearActivedItem){
		    _self.clearActivedItem(item);
		  }
		});

		legendGroup.on('itemchecked',function(ev){
		  var legendItem = ev.item,
		    item = _self.getByLendItem(legendItem);
		  _self.showChild(item);
		});

		legendGroup.on('itemunchecked',function(ev){
		  var legendItem = ev.item,
		    item = _self.getByLendItem(legendItem);
		  _self.hideChild(item);
		});
	},
	showChild : function(item){
		if (item) {
			item.show();
			this._resetPath();
		}
	},
	hideChild : function(item){
		if (item) {
			item.hide();
			this._resetPath();
		}
	},
	_resetPath : function(){
		var _self = this,
			paths = _self.get('group').get('children'),
			visiblePaths = [],
			varlueArr = [],
			labelsGroup = _self.get('labelsGroup');

		Util.each(paths,function(path,index){
			if (path.get('visible')) {
				visiblePaths.push(path);
				varlueArr.push(path.get('value'));
			}else{
				_self._resizeShapeToCenterPoint(path,0.2);
			}
		})

		var num = visiblePaths.length;
			max = varlueArr[0],
		    min = varlueArr[0];

		for (var i = 0; i < varlueArr.length; i++) {
			if(varlueArr[i] > max){
				max = varlueArr[i];
			}
		};

		for (var i = 0; i < varlueArr.length; i++) {
			if(varlueArr[i] < min){
				min = varlueArr[i];
			}
		};

		
		labelsGroup.clear();

		Util.each(visiblePaths,function(visiblePath,index){
		    height = _self.get('height'),
		    widthCanvas = _self.get('canvas').get('width'),
		    width = _self.get('width'),
		    avgHeight = height/num,
		    startPoint = _self._getStartPoint(),
		    centerX = (startPoint.x + widthCanvas/2),
		    curY = startPoint.y + avgHeight * index,
		    centerY = curY + avgHeight/2;

		    point = {
		    	x : centerX,
		    	y : centerY,
		    	beginY : curY,
		    	endY : curY + avgHeight,
		    	value : visiblePath.get('value'),
		    	xValue : visiblePath.get('xValue')
		    }

			if(_self.get('labels')){
				_self.addLabel(point.xValue,point,max);
			}

			var path = _self._getPath(point,max,min,index,visiblePaths);
			visiblePath.animate({
				path : path
			},400)
		})


	},
	_getPath : function(point,max,min,index,visiblePaths){
		var _self = this,
		    width = _self.get('width');

			if (_self.get('Cfg').topShape == "angle") {
				topValue = 0;
			}else if (_self.get('Cfg').topShape == "rect") {
				topValue = min;
			}

			if (_self.get('Cfg').overturn) {
				lastValue = visiblePaths[index - 1] ? visiblePaths[index - 1].get('value') : topValue;
				var tl = point.x - (lastValue/max) * width/2,
					tr = point.x + (lastValue/max) * width/2,
					bl = point.x - (point.value/max) * width/2,
					br = point.x + (point.value/max) * width/2;
				return [['M',tl,point.beginY],['L',tr,point.beginY],['L',br,point.endY],['L',bl,point.endY],['z']];
			}else{
				nextValue = visiblePaths[index + 1] ? visiblePaths[index + 1].get('value') : topValue;
				var tl = point.x - (point.value/max) * width/2,
					tr = point.x + (point.value/max) * width/2,
					bl = point.x - (nextValue/max) * width/2,
					br = point.x + (nextValue/max) * width/2;
				return [['M',tl,point.beginY],['L',tr,point.beginY],['L',br,point.endY],['L',bl,point.endY],['z']];
			}
	},
	_getItemCfg : function(point,index){
		var _self = this,
		colors = _self.get('colors'),
		item = _self.get('item'),
		rst = {};

		Util.mix(rst,item);
		rst.fill = colors[index%colors.length];
		point.color = rst.fill;
		return rst;
	},
	getActiveItems : function(){
		return this.get('group').get('children');
	},
	//覆写 ActivedGroup 的是否处于激活状态
	isItemActived : function(item) {
		return item.get('actived');
	},
	//覆写设置子项 actived状态的变化
	setItemActived : function(item,actived){
		var _self = this,
		color = item.getCfgAttr('attrs').fill; //初始化时的颜色

		if(actived){
			item.set('actived',true);
			item.attr('fill',Util.highlight(color,0.15));
		}else{
			item.set('actived',false);
			item.attr('fill',color);
		}
	},
	bindMouseOver : function(){
		var _self = this;

		_self.get('group').on('mouseover',function(ev){
			var item = ev.target.shape;
			if(item){
				_self.setActivedItem(item);
			}
		});
	},
	//获取当前定位的点
	getTrackingInfo : function(ev){
		var _self = this,
		item = _self.getActived();
		return item && Util.mix(item.get('point'),ev);
	}

});

module.exports = Funnel;