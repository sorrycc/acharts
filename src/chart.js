/**
 * @fileOverview 图表控件
 * @ignore
 */
  
var Util = require('./util'),
  Canvas = require('./canvas'),
  PlotBack = require('./chart/plotback'),
  SeriesGroup = require('./chart/seriesgroup'),
  Theme = require('./chart/theme');

/**
 * @class Chart
 * 图，里面包括坐标轴、图例等图形
 */
var Chart = function(cfg){
  this._attrs = Util.mix({},Chart.ATTRS,cfg);
  this.events = {};
};



Chart.ATTRS = {

    /**
     * 画板
     * <code>
     *  var canvas =  chart.get('canvas');
     * </code>
     * @type {Chart.Canvas}
     */
    canvas : undefined,
    /**
     * 数据图例默认的颜色顺序
     * @type {Array}
     */
    colors : undefined,
    /**
     * 显示的数据
     * @type {Array}
     */
    data : undefined,
    /**
     * 标示每个图例颜色的配置项
     * @type {Object}
     */
    legend : undefined,
   
    /**
     * 绘图的配置，包括背景、边框等配置信息
     * @type {Object}
     */
    plotCfg : undefined,
    /**
     * @protected
     * 绘制图形的区域
     * @type {Object}
     */
    plotRange : undefined,
    /**
     * 数据图序列集合
     * @type {Array}
     */
    series : undefined,
    /**
     * 数据图序列默认的配置项
     * @type {Object}
     */
    seriesOptions : undefined,
    /**
     * 子标题
     * @type {String}
     */
    subTitle : undefined,
    /**
     * 标题
     * @type {String}
     */
    title : undefined,
    /**
     * 提示信息
     * @type {Object}
     */
    tooltip : undefined,
    /**
     * x 轴坐标
     * @type {Object|Array}
     */
    xAxis : undefined,

    /**
     * Y 轴坐标
     * @type {Object|Array}
     */
    yAxis : undefined,
    /**
     * 数据中使用的字段，用于转换数据使用例如： 
     *  - fields : ['intelli','force','political','commander']
     *  - 数据：
     * <pre><code>
     * [
     *  {"name" : "张三","intelli":52,"force":90,"political":35,"commander" : 85},
     *   {"name" : "李四","intelli":95,"force":79,"political":88,"commander": 72},
     *  {"name" : "王五","intelli":80,"force":42,"political":92,"commander": 50}
     * ]
     * </code></pre>
     *  - 转换成
     *  <pre><code>
     * [
     *   [52,90,35,85],
     *   [95,79,88,72],
     *   [80,42,92,50]
     * ]
     * </code></pre>
     * @type {Array}
     */
    fields : undefined,
    /**
     * 应用的样式
     * @type {Object}
     */
    theme : Theme.Base
    
    /**
     * @event seriesactived
     * 数据序列激活
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesunactived
     * 数据序列取消激活
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesitemactived
     * 数据序列的子项激活，一般用于饼图和柱状图
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.seriesItem 数据序列子项
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesitemunactived
     * 数据序列的子项取消激活，一般用于饼图和柱状图
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.seriesItem 数据序列子项
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesitemclick
     * 数据序列的子项的点击，一般用于饼图和柱状图
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.seriesItem 数据序列子项
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesitemselected
     * 数据序列的子项选中，一般用于饼图和柱状图
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.seriesItem 数据序列子项
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event seriesitemunselected
     * 数据序列的子项取消选中，一般用于饼图和柱状图
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.seriesItem 数据序列子项
     * @param {Chart.Series} ev.series 数据序列对象
     */
    
    /**
     * @event tooltipchange
     * tooltip信息改变
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.title tooltip 标题
     * @param {Chart.Series} ev.items 显示tooltip的项
     * @param {HTMLElement} ev.dom 自定义tooltip时，tooltip的DOM 节点
     */
    
    /**
     * @event tooltipshow
     * tooltip显示
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.title tooltip 标题
     * @param {Chart.Series} ev.items 显示tooltip的项
     * @param {HTMLElement} ev.dom 自定义tooltip时，tooltip的DOM 节点
     */
    
    /**
     * @event tooltiphide
     * tooltip隐藏
     * @param {Object} ev 事件对象
     * @param {Chart.Series} ev.title tooltip 标题
     * @param {Chart.Series} ev.items 显示tooltip的项
     * @param {HTMLElement} ev.dom 自定义tooltip时，tooltip的DOM 节点
     */
    
    
    /**
     * @event plotclick
     * 点击图表内部
     * @param {Object} ev 事件对象
     * @param {Number} x 点击的x的坐标
     * @param {Number} y 点击的y的坐标
     * @param {Chart.Canvas.Shape} Shape 点击到的图形
     */
    
    /**
     * @event plotmove
     * 在图表内部移动
     * @param {Object} ev 事件对象
     * @param {Number} x 移动到x的坐标
     * @param {Number} y 移动到y的坐标
     * @param {Chart.Canvas.Shape} Shape 移动到的图形
     */
    
    /**
     * @event plotover
     * 移入图表内部
     * @param {Object} ev 事件对象
     * @param {Number} x 移动到x的坐标
     * @param {Number} y 移动到y的坐标
     * @param {Chart.Canvas.Shape} Shape 移动到的图形
     */
    
    /**
     * @event plotout
     * 移出图表内部
     */
    
  }



Util.augment(Chart,{

  get : function(name){
    return this._attrs[name];
  },
  set : function(name,value){
    this._attrs[name] = value;
    return this;
  },
  render : function(){
    var _self = this;
    if(!_self.get('id')){
      throw 'You must assign id for the chart!';
    }
    _self.paint();
  },
  /**
   * 清除图形
   */
  clear : function(){
    var _self = this,
      canvas = _self.get('canvas');
    canvas.destroy();
    _self.set('isPaint',false);
  },
  /**
   * 绘制整个图
   */
  paint : function(){
    var _self = this;
    if(!_self.get('isPaint')){
      _self._renderCanvas();
      _self._renderPlot();
      _self._renderTitle();
      _self._renderSeries();
      _self.get('canvas').sort();
    }
  },
  
  //渲染画板
  _renderCanvas : function(){
    var _self = this,
      id = _self.get('id') || _self.get('render') || '';
    id = id.replace('#','');
    var  el = document.getElementById(id),
      width = _self.get('width') || Util.getWidth(el),
      height = _self.get('height') || Util.getHeight(el),
      canvas = new Canvas({
        width : width,
        height :height,
        id : id
      });
    canvas.chart = _self;
    _self.set('el',el);
    _self.set('canvas',canvas);
  },
  //渲染背景、边框等
  _renderPlot : function(){
    var _self = this,
      plotCfg = _self.get('plotCfg'),
      canvas = _self.get('canvas'),
      theme = _self.get('theme'),
      plotBack,
      plotRange;

    plotCfg = Util.mix({},theme.plotCfg,plotCfg);
    plotBack = canvas.addGroup(PlotBack,plotCfg),
    plotRange = plotBack.get('plotRange');

    _self.set('plotRange',plotRange);

  },
  //渲染title
  _renderTitle : function(){
    var _self = this,
      title = _self.get('title'),
      subTitle = _self.get('subTitle'),
      theme = _self.get('theme'),
      canvas = _self.get('canvas');
    if(title){
      if(title.x == null){
        title.x = canvas.get('width')/2;
        title.y = title.y || 15;
      }
      title = Util.mix({},theme.title,title);
      canvas.addShape('label',title);
    }
    if(subTitle){
      if(subTitle.x == null){
        subTitle.x = canvas.get('width')/2;
        subTitle.y = subTitle.y || 35;
      }
      subTitle = Util.mix({},theme.subTitle,subTitle);
      canvas.addShape('label',subTitle);
    }
  },
  _getDefaultType : function(){
    var _self = this,
      seriesOptions = _self.get('seriesOptions'),
      rst = 'line'; //默认类型是线
    Util.each(seriesOptions,function(v,k){
      rst = k.replace('Cfg','');
      return false;
    });
    return rst;
  },
  //渲染数据图序列
  _renderSeries : function(){
    var _self = this,
      theme = _self.get('theme'),
      cfg = {},
      attrs = _self._attrs,
      defaultType = _self._getDefaultType(),
      seriesGroup;

    Util.each(attrs.series,function(item){
      if(!item.type){
        item.type = defaultType;
      }
    });
    Util.mix(true,cfg,theme,{
      colors :  attrs.colors,
      data : attrs.data,
      fields : attrs.fields,
      series : attrs.series,
      seriesOptions : attrs.seriesOptions,
      tooltip : attrs.tooltip,
      legend : attrs.legend,
      xAxis : attrs.xAxis
    });

    Util.mix(cfg,{
      plotRange : attrs.plotRange
    });

    if(Util.isObject(attrs.yAxis)){
      Util.mix(true,cfg,{
        yAxis : attrs.yAxis
      });
    }else if(Util.isArray(attrs.yAxis)){
      attrs.yAxis[0] = Util.mix(true,{},theme.yAxis,attrs.yAxis[0]);
      cfg.yAxis = attrs.yAxis;
    }


    seriesGroup = _self.get('canvas').addGroup(SeriesGroup,cfg);
    _self.set('seriesGroup',seriesGroup);

  },
  /**
   * 重绘整个图
   */
  repaint : function(){
    var _self = this;
    _self.get('seriesGroup').repaint();
  },
  /**
   * 获取所有的数据序列
   * @return {Array} 所有的数据序列数组
   */
  getSeries : function(){
    return this.get('seriesGroup').getSeries();
  },
   /**
   * 改变数据
   * @param  {Array} data 数据
   */
  changeData : function(data){
    var _self = this,
      group = _self.get('seriesGroup');
    if(data !== _self.get('data')){
      _self.set('data',data);
    }
    group.changeData(data);
  },
  /**
   * 附加事件
   * @param  {String}   eventType 事件类型
   * @param  {Function} fn  事件处理函数
   */
  on : function(eventType,fn){
    var _self = this,
      events = this.events,
      callbacks = events[eventType];

    if(!callbacks){
      callbacks = events[eventType] = [];
    }
    callbacks.push(fn);
    return this;
  },
  /**
   * 触发事件
   * @param  {String} eventType 事件类型
   */
  fire : function(eventType,eventObj){
    var _self = this,
      events = _self.events,
      callbacks = events[eventType];
    if(callbacks){
      Util.each(callbacks,function(m){
        m(eventObj);
      });
    }
  },
  /**
   * 移除事件
   * @param  {String}   eventType 事件类型
   * @param  {Function} fn  事件处理函数
   */
  off : function(eventType,fn){
    var _self = this,
      node = _self.get('node'),
      events = this.events,
      callbacks = events[eventType];
    if(!eventType){
      this.events = {};
      return this;
    }    
    if(callbacks){
      Util.remove(callbacks,fn);
    }
    return this;
  }
});

module.exports = Chart;
