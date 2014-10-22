 # 图表可视区域

---

图表的可视区域

---

## 目录

  * 简介
  * 区域判断

### 简介

  * 图表的可视区域是图表绘制数据序列的区域,实现的类是Plot.Range
  * 可视区域 = 边框 - 边距
  * Plot.Range 类接受2个参数,start 和 end
  * 一般情况 start是左下角的点，end是右上角的点，跟坐标轴的方向一致

  ![plot](http://gtms03.alicdn.com/tps/i3/TB1nkqKGXXXXXccXVXXoGvmPFXX-480-360.jpg)


### 区域判断

  Plot.Range类存在以下几个属性和方法来判断范围

#### 属性
  * tl,tr,bl,br,cc 标示左上角、右上角、左下角，有下角和中心点

#### 方法

  * getWidth() 获取宽度
  * getHeight() 获取高度
  * isInRange(x,y) 是否在区域内
  * isInVertical(y) 是否在纵向区域内
  * isInHorizontal(x) 是否在横向区域内


## 使用

  * 可以直接创建Plot.Range

  ```js

    var plotRange = new Plot.Range({x: 50,y: 250},{x : 250,y : 50});

  ```
  * 也可以通过创建Plot.Back获取计算的Plot.Range

  ```js
  
    var canvas = new Canvas({
      id : 'id',
      width : 500,
      height : 500
    });

    var plotBack = canvas.addGroup(Plot.Back,{
      margin : [30,50]
    });

    var plotRange = plotBack.get('plotRange'); // start : {x : 50,y : 470},end : {x : 450,y : 30}

  ```

