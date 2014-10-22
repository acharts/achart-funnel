# Demo

---

## 基础漏斗图
````html

<div id="c1"></div>
````

````javascript
seajs.use(['acharts','index'], function(AChart,Funnel) {

	Series = AChart.Series;
	Series.Funnel = Funnel;

	var chart = new AChart({
		id : 'c1',
		width : 600, 
		height : 500,  
		tooltip : {
			title : {
				'font-size' : '16px',
				y : 10,
				x : 5,
				fill : '#ff7c26'
			}
		},
		legend : null,
		series : [
			{   
				name : '流量分析',
				type : 'funnel',
				labels : {
					position : 'left',//middle,left,right
					label : {
						'font-size' : '16px',
						fill : 'black'
					}
				},
			    legend : {
			      x : -22,
			      y : -15,
			      leaveChecked : true, //阻止最后一项也取消勾选
			    },
				data : [
		          {value:60, name:'访问'},
		          {value:40, name:'咨询'},
		          {value:20, name:'订单'},
		          {value:20, name:'点击'},
		          {value:80, name:'点击'},
		          {value:100, name:'展现'}
				],
				Cfg : {
					overturn : false,//是否翻转
					topShape : 'rect'//angle,rect设置最后一个元素的形状
				}
			}
		]
	});

	chart.render();

});
````
