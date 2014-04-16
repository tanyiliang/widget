/**
 * @file 无限滚动插件
 * @import core/widget.js,extend/iscroll.js
 */
(function( gmu, $, undefined ) {

    /**
     * 滑块控件内部的对象
     * @class Fish.mobile.widget.iscroll.IScrollObj
     *
     */
    function IScrollObj ($el,options) {

        /**
         * @property {Object} $el
         * 滚动插件对应的页面元素
         */

        /**
         * @property {String} value
         * 滚动插件的值
         */

        /**
         * @property {Number} index
         * 滚动插件的索引值
         */

        var opt = {
            infiniteElements: "#"+$el[0].id + " li",
            dataset: function(start, count) {//
                var scroll = this;
                if(!scroll.reloadOnce){
                    setTimeout(
                        function(){
                            scroll.reorderInfinite();
                            // delete scroll.reloadOnce;
                        }
                    ,1)
                    scroll.reloadOnce = true;
                }
            }
        }
        opt = $.extend(true, opt, options);
        this.$el = $el;
        this.iscroll = new IScroll($el[0],opt);

    };


    IScrollObj.prototype = {
        scrollTo: function (y, time) {
            if(this.iscroll.y !== y){
                this.iscroll.scrollTo(this.iscroll.x, y+this.iscroll.y, time, IScroll.utils.ease.quadratic);
            }
        }
    }

    var _activeClass = "active"; //滚动控件选中行的样式,不开放修改


    /**
     * 滑块控件,可单独使用,一般用于时间选择
     * @class Fish.mobile.widget.Iscroll
     * <pre>
        $(element).iscroll(option);
     * </pre>
     *
     */
    gmu.define( 'iscroll', {

        /**
         * @property {Object} options
         * 滑块控件初始化参数
         * @property {String} options.value 滑块控件初始值.
         * @property {Array} options.data (required) 滑块控件值域.
         * @property {String} options.title 滑块控件标题.
         * @property {Number} options.offsetCycle 滑块控件初始偏移量，一般采用默认值.
         * @property {Number} options.bounceTime 滑块控件滑动速度，一般采用默认值.
         */

        options: {
            value : null, //初始选中值
            data: [], //初始值列表
            offsetCycle : 20, //初始偏移循环50次
            showLine:3,//页面可见记录数,要求为基数,中间那条是选中记录
            title:false,//显示标题
            bounceTime:500//,//弹跳时间
        },

        _init: function(_opts) {
            var me = this;
            me.on( 'ready', function(){
                me._initIscrollObj();
            } );
        },

        _create: function() {
            var me = this,
                _opts = me._options;
            if( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me._initOption();//init option
            me.$el.addClass('ui-time').append((_opts['title']?me._generateHeadHTML():'')+me._generateBodyHTML());//init html
            me.$body = me.$el.find(".scroller-body");
            me._setPosition();//fix css left and cover position
            return me;
        },

        _initOption:function(){
            var me = this,
                _opts = me._options;
            if((me.datalength=_opts.data.length) == 0 ) {
                throw new Error("need data param!!");
            }
            _opts.value = _opts.value || _opts.data[0];
            me.fixLine = (_opts.showLine-1)/2;
        },
        //在title参数不为空的时候,会执行到这，返回一个head的内容
        _generateHeadHTML:function() {
            return '<div class="scroller-head">'+this._options.title+'</div>';
        },
        //主体内容
        _generateBodyHTML:function() {
            var me = this,
                $html=$("<div>"),
                _opts = me._options;
            var data = _opts.data;
            for(var i = 0,arr = []; i < data.length; i++) {
                arr.push('<li>' + data[i] + '</li>');
            }
            $html.append('<div class="scroller-body"><div class="scroller"><ul></ul></div></div>').find('.scroller-body ul').html(arr.join(''));
            $html.find('.scroller-body').append('<div class="scroller-cover" style="height:0px;margin-top:0px;"></div>').attr("id","scroller-body_"+me.$el.attr("id"));
            return $html.html();
        },
        // 目前的计算公式还是按照界面显示3个数据来计算的
        _setPosition:function(){
            var me = this,
                $body = me.$body,
                $el = me.$el;
            me.bheight=$body.find("li:first").height();
            $el.find(".scroller-cover").css({'height':me.bheight,'margin-top':(-1-me.bheight/2)});//设置中间横线位置
            var pos = $el.position();
            var fixPos = {"top":pos.top + $el.find(".scroller-head").height(),"left":pos.left};
            $body.css(fixPos).width($el.width()).height(me._options.showLine*me.bheight);
            $body.find("li").width($el.width());
        },
        /**
         * 设置滑动控件的值
         * <pre>
            $(element).iscroll("setValue",'09');
         * </pre>
         * @param  {String} value 一般为字符串,也可以是数字,此值会高亮显示
         */
        setValue:function(value){
            if(!value) return; //目前暂不接受空值
            var me = this,
                height=me.bheight,
                _opts = me._options,
                iscrollObj = me._iscroll,
                $iscroll = iscrollObj.iscroll;
            var index = _opts.data.indexOf(value);
            if(index>-1){
                var last = iscrollObj.index||0;
                me._setSelect(value,index);
                iscrollObj.scrollTo(-height*(index-last) ,_opts.bounceTime);
            }//else{do nothing}
        },
        /**
         * 设置滑动控件的下标
         * <pre>
            $(element).iscroll("setIndex",9);
         * </pre>
         * @param  {Number} index 数值类型，表示选中值在当前数据中的索引
         */
        setIndex:function(index){
            var me = this,
                height=me.bheight,
                _opts = me._options,
                iscrollObj = me._iscroll,
                $iscroll = iscrollObj.iscroll;
            if(index < -1 || index > _opts.data.length -1 ) return; //目前暂不接受范围外的数据
            var last = iscrollObj.index || 0;
            me._setSelect(_opts.data[index],index);
            me.offsetY = me.offsetY?me.offsetY : -height*(index-last);
            iscrollObj.scrollTo(me.offsetY,_opts.bounceTime);
            delete me.offsetY;
        },

        _setSelect:function(value,index){
            var iscrollObj = this._iscroll,
                _opts = this._options;
            iscrollObj.value = value;
            iscrollObj.index = index;
            iscrollObj.$el.find('li').removeClass(_activeClass).eq(index).addClass(_activeClass);
        },

        /**
         * 获取滑动控件的值
         * <pre>
            var value = $(element).iscroll("getValue");
         * </pre>
         * @return {String} 返回滚动控件中高亮显示的值
         */
        getValue:function(){
            return this._iscroll.value;
        },
        /**
         * 获取滑动控件的下标
         * <pre>
            var value = $(element).iscroll("getValue");
         * </pre>
         * @return {Number} 返回滚动控件中高亮显示的值在当前数据中的索引
         */
        getIndex:function(){
            return this._iscroll.index;
        },
        /**
         * 重置滑动控件的数据
         * <pre>
            var value = $(element).iscroll("reloadData"，option);
         * </pre>
         * @param  {Object} option 重置的数据，包含属性数据data(必填)，初始值value，是否进行滚动iscroll
         */
        reloadData:function(option){
            var me = this,
                _opts = me._options;
            //变更初始化参数值,注意copy出来改
            _opts.value = option.value;
            _opts.data = option.data.slice(0);
            me._initOption();
            //销毁需要重构的iscroll
            me._iscroll.iscroll.destroy();
            //重绘HTML
            var data = _opts.data,length = data.length;
            for(var i = 0,arr = []; i < length; i++) {
                arr.push('<li>' + data[i] + '</li>');
            }
            me.$el.find('.scroller-body ul').html(arr.join(''));

            me._initIscrollObj(option.iscroll);

        },

        _initIscrollObj:function(iscroll){
            var me = this,
                _opts = me._options;

            var startY = 0 - me.bheight * (_opts.offsetCycle * me.datalength - me.fixLine );
            var index = _opts.data.indexOf(_opts.value);
            if(index>-1){//fix initValue
                startY +=-me.bheight*index;
            }else{ //fix outer value
                _opts.value = _opts.data[0];
                index = 0;
            }
            var iscrollObj = me._iscroll = new IScrollObj(me.$body,{startY:startY});
            me._bindIscrollEvent();
            me._setSelect(_opts.value,index);
            if(iscroll){//联动一圈
                me.offsetY = -me.bheight*me.datalength;
                iscrollObj.scrollTo(me.offsetY,_opts.bounceTime);
                delete me.offsetY;
            }
        },

        _bindIscrollEvent:function(){
            var me = this,
                iscrollObj = me._iscroll,
                $iscroll = iscrollObj.iscroll,
                _opts = me._options,
                height = me.bheight;

            $iscroll.on('scrollStart',  function() {
                iscrollObj._scrollStop = false;
                me.trigger('beforeScroll',iscrollObj);
                iscrollObj.$el.find("li").removeClass(_activeClass);
            });
            // $iscroll.on('scrollCancel',  function() {
            //     console.log("scrollCancel--------------->");
            // });
            $iscroll.on('scrollEnd', function() {
                var mod = this.y%height;
                if(iscrollObj._scrollStop) return ;//在滚动修正的时候避免触发两次回调
                if(mod ==0){ //正好不偏不倚
                    var index = (-this.y/height+me.fixLine)%me.datalength; //这里的+1,表示选中的实际上是界面第2个元素
                    me._setSelect(_opts.data[index],index);
                }else{
                    var fixY = 0;
                    if(-mod>height/2){//超过一半,下移一个高度
                        fixY = this.y-mod-height;
                        me.offsetY=0-mod-height;
                    }else if(-mod<height/2){//上移
                        fixY = this.y-mod;
                        me.offsetY=-mod;
                    } else {//正好处于中间,根据滑动方向判断是上移还是下移
                        fixY = this.y-mod-((this.startY>this.y)?height:0);
                        me.offsetY=0-mod-((this.startY>this.y)?height:0);
                    }
                    me.setIndex((-fixY/height+me.fixLine)%me.datalength); //使用修正过的值进行滑动//这里的+1,表示选中的实际上是界面第2个元素
                }
                me.trigger('afterScroll',iscrollObj);
                iscrollObj._scrollStop = true;
            });

        },

        /**
         * 销毁滑动控件
         * <pre>
            $(element).iscroll("destroy");
         * </pre>
         */
        destroy: function() {
            var me = this;
            me._iscroll.iscroll.destroy();// remove event
            me.$el.empty().removeClass("ui-time");// remove element
            return me.$super('destroy');
        }

        /**
         * 当组件初始化完后触发
         * @event ready
         * @param {Event} e gmu.Event对象
         */

        /**
         * 滑动开始前触发的事件
         * @event beforeScroll
         * @param {Event} e gmu.Event对象
         * @param {IScrollObj} iscrollObj 滑动控件的内部对象**{@link Fish.mobile.widget.iscroll.IScrollObj IScrollObj}**
         *
         */

        /**
         * 滑动停止后触发的事件
         * @event afterScroll
         * @param {Event} e gmu.Event对象
         * @param {IScrollObj} iscrollObj 滑动控件的内部对象**{@link Fish.mobile.widget.iscroll.IScrollObj IScrollObj}**
         *
         */

        /**
         * 组件在销毁的时候触发
         * @event destroy
         * @param {Event} e gmu.Event对象
         */
    });
})( gmu, gmu.$ );
