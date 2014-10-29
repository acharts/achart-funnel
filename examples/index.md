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
		plotCfg : {
			margin : 50
		},
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
				colors : ['#00a3d7','#6ebb46','#f6c100','#ff6a00','#e32400','#423ba8'],
				labels : {
					position : 'right',//middle,left,right
					offset : 30,
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
		          {value:40, name:'咨询'},
		          {value:20, name:'订单'},
		          {value:60, name:'点击'},
		          {value:80, name:'点击'},
		          {value:100, name:'展现'}
				]
			}
		]
	});

	chart.render();

});
````


## 基础漏斗图
````html

<div id="c2"></div>
````

````javascript
seajs.use(['acharts','index'], function(AChart,Funnel) {

	Series = AChart.Series;
	Series.Funnel = Funnel;

	var chart = new AChart({
		id : 'c2',
		width : 600, 
		height : 500,  
		plotCfg : {
			margin : 50
		},
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
				colors : ['#00a3d7','#6ebb46','#f6c100','#ff6a00','#e32400','#423ba8'],
				labels : {
					position : 'right',//middle,left,right
					offset : 30,
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
		          {value:40, name:'咨询'},
		          {value:20, name:'订单'},
		          {value:60, name:'点击'},
		          {value:80, name:'点击'},
		          {value:100, name:'展现'}
				],
				sort : 'asc'
			}
		]
	});

	chart.render();

	var data = [
		          {value:20, name:'订单'},
		          {value:60, name:'点击'},
		          {value:80, name:'点击'},
		          {value:100, name:'展现'}
	];

	setTimeout(function(){
		chart.changeData(data);
	},1200);

});
````