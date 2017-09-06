

var _lunar = {
  // 获取星期几
  _getDay: function (y,m,d) {
     var _d = new Date(y,m - 1,d).getDay();
     var _a = [7,1,2,3,4,5,6];
     // console.log(_d);
     return _a[_d];
  }
};
// new Date(_yyyy,mm - 1,_dd) 月 份从0 开始
var H5_date = {
  __wk__: 0,
  __d__:0,
  fn_isDay: function (y,m,d) {
    if(this.is_wkData.is){
        // 周数据 是否选中
        if(this.get_check_wkItem(y,m,d)){
            return true;
        }
        return false;
    }else{
        // 月数据 是否选中
        if(this.get_check_mItem(y,m,d)){
            return true;
        }
        return false;
    }
  },
  get_check_wkItem: function (y,m,d) {
      // 判断星期几
      var _wk = _lunar._getDay(y,m,d);
      if(this.__wk__ && _wk == this.__wk__){
        return true;
      }else{
        return false;
      }
  },
  get_check_mItem: function (y,m,d) {
      // 判断 今天几号
      var _d = this.fn_maxD(y,m);

      if(this.__d__){
          if(d == this.__d__){
            return true;
          }else if(this.__d__ > _d && d == _d){
            return true;
          }else{
            return false;
          }
      }else{
        return false;
      }
  },
  // 月份 加减
  get_m: function (_obj,N,add) {
      _obj = JSON.parse(_obj);
      N = parseInt(N)>0 ? parseInt(N) : 0;
      // 加
      function add_m(N) {
          if(_obj._mm + N > 12){
              _obj._mm = (_obj._mm + N)%12
              _obj._yyyy++;
          }else{
              _obj._mm = _obj._mm + N;
          }
          return _obj;
      }
      // 减
      function add_m2(N) {
          if(_obj._mm - N < 1){
              _obj._mm = _obj._mm - N + 12;
              _obj._yyyy--;
          }else{
              _obj._mm = _obj._mm - N;
          }
          return _obj;
      }
      if(N && add){
          _obj = add_m(N);
      }else if(N && !add){
          _obj = add_m2(N);
      }
      // console.dir(_obj);
      return _obj;
  },
  // 天数 加减
  get_d: function (_obj,N,add) {
      _obj = JSON.parse(_obj);
      N = parseInt(N)>0 ? parseInt(N) : 0;
      // 加
      function add_m(N) {
          var date = new Date(_obj._yyyy,_obj._mm - 1,_obj._dd);
          date.setDate(date.getDate()+N);

          _obj._yyyy = date.getFullYear();
          _obj._mm = date.getMonth() + 1;
          _obj._dd = date.getDate();

          return _obj;
      }
      // 减
      function add_m2(N) {
          var date = new Date(_obj._yyyy,_obj._mm - 1,_obj._dd);
          date.setDate(date.getDate()-N);

          _obj._yyyy = date.getFullYear();
          _obj._mm = date.getMonth() + 1;
          _obj._dd = date.getDate();

          return _obj;
      }
      if(N && add){
          _obj = add_m(N);
      }else if(N && !add){
          _obj = add_m2(N);
      }
      // console.dir(_obj);
      return _obj;
  },
  arr_segmentation: function (_obj) {
      var _ymd = {};
      var __a = [];
      var y = _obj._ymd.y;
      var m = _obj._ymd.m;
      var _maxD = this.fn_maxD(y,m);
      _ymd['y'+y] = {};

      _ymd['y'+y]['m'+m] = Array(_obj._ymd.d);
      __a = _obj._arr.slice(0,_maxD - _obj._ymd.d+1);
      __a.push.apply(_ymd['y'+y]['m'+m],__a);
      m++;

      _ymd['y'+y]['m'+m] = [];
      __a = _obj._arr.slice(_maxD - _obj._ymd.d,_obj._arr.length);
      __a.push.apply(_ymd['y'+y]['m'+m],__a);
      return _ymd;
  },
  toMData: function (dataArr) {

      var _yArr = [],_obj;

      _obj = this.arr_segmentation(dataArr);

      this._cOrs = _obj;
  },
  get_date: function (_obj,is_wkData) {
    // 清除数据
    this._thisMothData = [];
    this._data = [];
    this._cOrs = {};

    // 计算 财 衰 数据
    this.toMData(_obj.data);

    var _this = {
      _yyyy: _obj._yyyy,
      _mm: _obj._mm,
      _dd: _obj._dd,
      _el: _obj._el
    }

    var _str = JSON.stringify(_this);

    this._data[0] = this.get_m(_str,1,false);
    this._data[1] = this.get_m(_str,0,true);
    this._data[2] = this.get_m(_str,1,true);

    // 月数据
    if(!is_wkData){
        this.add_prevM(JSON.stringify(this._data));
        this.add_thisM(JSON.stringify(this._data));
        this.add_nextM(JSON.stringify(this._data));
    }else if(is_wkData == 'prev_wk'){
      // 上月 周数据
      this.add_thisM2(JSON.stringify(this._data),'prev_wk',_lunar._getDay(this._data[2]._yyyy,this._data[2]._mm,1));
    }else if(is_wkData == 'next_wk'){
      // 下月 周数据
      this.add_thisM2(JSON.stringify(this._data),'next_wk',_lunar._getDay(this._data[0]._yyyy,this._data[0]._mm,H5_date.fn_maxD(this._data[0]._yyyy,this._data[0]._mm)));
    }else{
      this.add_thisM2(JSON.stringify(this._data));
    }

    if(_this._el){
        document.getElementById(_this._el).innerHTML = str;
    }
    return this._thisMothData;
  },
  fn_getWkData: function (_obj,str) {
      // var _maxD = this.fn_maxD(_obj._yyyy,_obj._mm);
      // var _d = _lunar._getDay(_obj._yyyy,_obj._mm,_obj._dd);
      var _dd = Math.floor(_obj._dd/7);
      var _arr = str.split(',');
      return _arr[_dd]
  },
  fn_maxD: function (_Y,_M) {
      if (_M == '01' || _M == '03' || _M == '05' || _M == '07' || _M == '08' || _M == '10' || _M == '12') {
          return 31;
      }
      else if (_M == '04' || _M == '06' || _M == '09' || _M == '11') {
          return 30;
      } else if (_M == '02' ){
          var cond1 = _Y % 4 == 0;  //条件1：年份必须要能被4整除
          var cond2 = _Y % 100 != 0;  //条件2：年份不能是整百数
          var cond3 = _Y % 400 == 0;  //条件3：年份是400的倍数
          //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
          //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
          //所以得出判断闰年的表达式：
          var cond = cond1 && cond2 || cond3;
          if (cond) {
              return 29;
          } else {
              return 28;
          }
      }
  },
  get_cOrs_str: function (y,m,d) {
      var _cOrs_str = '&nbsp;';
      if(this._cOrs['y'+y] && this._cOrs['y'+y]['m'+m] && this._cOrs['y'+y]['m'+m][d]){
        _cOrs_str = this._cOrs['y'+y]['m'+m][d];
      }
      if(_cOrs_str == '衰'){
        _cOrs_str = '<i class="green">衰</i>';
      }else if(_cOrs_str == '财'){
        _cOrs_str = '<i class="red">衰</i>';
      }else{
        _cOrs_str = '<i class="">'+_cOrs_str+'</i>';
      }
      return _cOrs_str;
  },
  // 获取上一月数据
  add_prevM: function (_json_str) {
    var _this = {};
    _this._data = JSON.parse(_json_str);

    var _cOrs_str = '&nbsp;';
    // 获取上一月 最大天数
    var _maxD = this.fn_maxD(_this._data[0]._yyyy,_this._data[0]._mm);
    // 获取当前月 1号 信息
    var _d = _lunar._getDay(_this._data[1]._yyyy,_this._data[1]._mm,1);
    var __n = _maxD - _d;
    var is_day = '';
    var prevMonth = this.is_wkData.is ? '' : 'prevMonth ';

    if(_d != 7){
      var j;
      for (var i = __n; i < _maxD; i++) {
        j = i + 1;
        // 获取 财 衰 数据
        _cOrs_str = this.get_cOrs_str(_this._data[0]._yyyy,_this._data[0]._mm,j);
        if(this.is_wkData.is){
            is_day = this.fn_isDay(_this._data[0]._yyyy,_this._data[0]._mm,j) ? 'is_day' : '';
        }

        this._thisMothData.push('<li data_y="' + _this._data[0]._yyyy + '" data_m="' + _this._data[0]._mm + '" data_d="' + j + '" class="'+prevMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
      }
    }

    // return str;
  },
  // 获取当前一月数据
  add_thisM: function (_json_str) {
    var _this = {};
    _this._data = JSON.parse(_json_str);

    var _cOrs_str = '&nbsp;';

    var _maxD = this.fn_maxD(_this._data[1]._yyyy,_this._data[1]._mm);
    var _d = this._wk;
    var j;
    var is_day = '';
    var thisMonth = this.is_wkData.is ? '' : 'thisMonth ';

    for (var i = 0; i < _maxD; i++) {
      j = i + 1;
      // 获取 财 衰 数据
      _cOrs_str = this.get_cOrs_str(_this._data[1]._yyyy,_this._data[1]._mm,j);

      is_day = this.fn_isDay(_this._data[1]._yyyy,_this._data[1]._mm,j) ? 'is_day' : '';
      // console.log([_this._data[1]._yyyy,_this._data[1]._mm,j],is_day);

      this._thisMothData.push('<li data_y="' + _this._data[1]._yyyy + '" data_m="' + _this._data[1]._mm + '" data_d="' + j + '" class="'+thisMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
    }
    // return str;
  },
  // 获取当前一月数据 周数据
  add_thisM2: function (_json_str,str,wk) {
    var _this = {};
    _this._data = JSON.parse(_json_str);

    _wk = [,2,3,4,5,6,7,1][wk];
    var _maxD = this.fn_maxD(_this._data[1]._yyyy,_this._data[1]._mm);
    var _i = 0;
    var thisMonth = this.is_wkData.is ? '' : 'thisMonth ';
    if(str == 'prev_wk'){
        // 下月 1号星期几
        // console.log(_this._data[1],wk);
        if(_wk != 1){
            _maxD = _maxD - wk;
            _i = _maxD - 7;

            var _cOrs_str = '&nbsp;';

            var _d = this._wk;
            var j;
            var is_day = '';

            for (var i = _i; i < _maxD; i++) {
              j = i + 1;
              // 获取 财 衰 数据
              _cOrs_str = this.get_cOrs_str(_this._data[1]._yyyy,_this._data[1]._mm,j);

              is_day = this.fn_isDay(_this._data[1]._yyyy,_this._data[1]._mm,j) ? 'is_day' : '';

              this._thisMothData.push('<li data_y="' + _this._data[1]._yyyy + '" data_m="' + _this._data[1]._mm + '" data_d="' + j + '" class="'+thisMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
            }

        }else{
          _maxD = _maxD;
          _i = _maxD - 7;
        }
    }else if(str == 'next_wk'){
        // 上月最后一天星期几
        // console.log(_this._data[1],wk);
        if(_wk != 7){
            _i = 7 - _wk;
            _maxD = _i + 7;
        }else{
            _i = 0;
            _maxD = _i + 7;
        }
    }

    var _cOrs_str = '&nbsp;';

    var _d = this._wk;
    var j;
    var is_day = '';

    for (var i = _i; i < _maxD; i++) {
      j = i + 1;
      // 获取 财 衰 数据
      _cOrs_str = this.get_cOrs_str(_this._data[1]._yyyy,_this._data[1]._mm,j);

      is_day = this.fn_isDay(_this._data[1]._yyyy,_this._data[1]._mm,j) ? 'is_day' : '';

      this._thisMothData.push('<li data_y="' + _this._data[1]._yyyy + '" data_m="' + _this._data[1]._mm + '" data_d="' + j + '" class="'+thisMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
    }
    // return str;
  },
  // 获取下一月数据
  add_nextM: function (_json_str) {
    var _this = {};
    _this._data = JSON.parse(_json_str);

    var _cOrs_str = '&nbsp;';
    var j;
    var __n;
    var is_day = '';
    var nextMonth = this.is_wkData.is ? '' : 'nextMonth ';

    // 周数据 下月数据不能超过一行
    if(this.is_wkData.is && this._thisMothData.length == 35){
      return;
    }
    // 周数据 下月数据不能超过一行
    if(this.is_wkData.is && this._thisMothData.length < 35){
      __n = 35 - this._thisMothData.length;

      for (var i = 0; i < __n; i++) {
        j = i + 1;
        // 获取 财 衰 数据
        _cOrs_str = this.get_cOrs_str(_this._data[2]._yyyy,_this._data[2]._mm,j);

        if(this.is_wkData.is){
            is_day = this.fn_isDay(_this._data[2]._yyyy,_this._data[2]._mm,j) ? 'is_day' : '';
        }

        this._thisMothData.push('<li data_y="' + _this._data[2]._yyyy + '" data_m="' + _this._data[2]._mm + '" data_d="' + j + '" class="'+nextMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
      }
    }else if(this._thisMothData.length < 42){
      __n = 42 - this._thisMothData.length;

      for (var i = 0; i < __n; i++) {
        j = i + 1;
        // 获取 财 衰 数据
        _cOrs_str = this.get_cOrs_str(_this._data[2]._yyyy,_this._data[2]._mm,j);

        if(this.is_wkData.is){
            is_day = this.fn_isDay(_this._data[2]._yyyy,_this._data[2]._mm,j) ? 'is_day' : '';
        }

        this._thisMothData.push('<li data_y="' + _this._data[2]._yyyy + '" data_m="' + _this._data[2]._mm + '" data_d="' + j + '" class="'+nextMonth+ is_day +'"><span>' + j + '</span>' + _cOrs_str + '</li>');
      }
    }
    // return str;
  }
};


// init
H5_date.init = function (json_str,swiper_el,slideBox_el,_callBackObj,fn_callBack) {
  var _this = {};
  _this.data_obj = JSON.parse(json_str);
  // H5_date.data_obj = _this.data_obj
  // 数据初始化
  var _ymd = [];
  var _swiperStrArr = [];
  // 周数据 多维数组
  var _swiperStrArr2 = [];
  var _swiper;

  // 选中的 星期几 几号
  H5_date.__wk__ = _lunar._getDay(_this.data_obj._yyyy,_this.data_obj._mm,_this.data_obj._dd);
  H5_date.__d__ = _this.data_obj._dd;

  _this.swiper_el = swiper_el;
  _this.slideBox_el = slideBox_el;

  H5_date.is_wkData = _this.is_wkData = {is: false}; // true 显示周数据
  // _this.is_wkData.is = true;

  // 显示 月数据
  function __seleceMothData() {
      _this.is_wkData.is = false;
      swiperStrArr_init(_this.data_obj,function () {
        var _str = _swiperStrArr[0]+_swiperStrArr[1]+_swiperStrArr[2];
          _swiper.slides[0].parentNode && (_swiper.slides[0].parentNode.innerHTML = _str);
          _swiper.update();

          _callBackObj && _callBackObj.seleceMothData && _callBackObj.seleceMothData(this);
      });
  };
  _this.seleceMothData = __seleceMothData;
  // 显示 周数据
  function __seleceDayData() {
      _this.is_wkData.is = true;
      swiperStrArr_init(_this.data_obj,function () {
          var _str = _swiperStrArr[0]+_swiperStrArr[1]+_swiperStrArr[2];
          _swiper.slides[0].parentNode && (_swiper.slides[0].parentNode.innerHTML = _str);
          _swiper.update();

          _callBackObj && _callBackObj.seleceDayData && _callBackObj.seleceDayData(this);
      });
  };
  _this.seleceDayData = __seleceDayData;


  // 分割数组
  function formatArray(arr,n) {
    var n = n || 7;

    var result = [];
    for(var i=0;i<arr.length;i+=n){
       result.push(arr.slice(i,i+n));
    }
    return result;
  }
  // _swiperStrArr_init _swiperStrArr_init2
  function swiperStrArr_init(_obj,callBack) {
    // _obj = _obj || _this.data_obj;
  console.log(_this.data_obj);
    if(!_this.is_wkData.is){
      _swiperStrArr_init(_this.data_obj,callBack);
      _this._swiperStrArr = _swiperStrArr;
    }else{
      _swiperStrArr_init2(_this.data_obj,callBack);
      _this._swiperStrArr = _swiperStrArr;
    }
  }
  function _swiperStrArr_init(_obj,callBack) {
      var _str = JSON.stringify(_obj);
      _ymd[0] = H5_date.get_m(_str,1,false);
      _ymd[1] = JSON.parse(_str);
      _ymd[2] = H5_date.get_m(_str,1,true);

      _swiperStrArr[0] = H5_date.get_date(_ymd[0],false);
      _swiperStrArr[1] = H5_date.get_date(_ymd[1],false);
      _swiperStrArr[2] = H5_date.get_date(_ymd[2],false);

      // 调试代码
      // try{
      //     _swiperStrArr[0].join('') && _swiperStrArr[1].join('') && _swiperStrArr[2].join('');
      // }catch (e){
      //     console.log(_swiperStrArr,_lineNum);
      //     console.log(_swiperStrArr);
      // }

      _swiperStrArr[0] = '<div class="swiper-slide"><p class="calendarBox_tit"><span>'+_ymd[0]._yyyy+'年'+_ymd[0]._mm+'月</span></p><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_swiperStrArr[0].join('')+'</ul></div></div>';
      _swiperStrArr[1] = '<div class="swiper-slide"><p class="calendarBox_tit"><span>'+_ymd[1]._yyyy+'年'+_ymd[1]._mm+'月</span></p><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_swiperStrArr[1].join('')+'</ul></div></div>';
      _swiperStrArr[2] = '<div class="swiper-slide"><p class="calendarBox_tit"><span>'+_ymd[2]._yyyy+'年'+_ymd[2]._mm+'月</span></p><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_swiperStrArr[2].join('')+'</ul></div></div>';
      // 回调函数
      callBack && callBack();
  }
  function _swiperStrArr_init2(_obj,callBack) {
      var _str = JSON.stringify(_obj);
      _ymd[0] = H5_date.get_m(_str,1,false);
      _ymd[1] = JSON.parse(_str);
      _ymd[2] = H5_date.get_m(_str,1,true);

      var _wk_data = [];
      _swiperStrArr[0] = H5_date.get_date(_ymd[0],'prev_wk'); // 上月 周数据 去除重复
      _swiperStrArr[1] = H5_date.get_date(_ymd[1]);
      _swiperStrArr[2] = H5_date.get_date(_ymd[2],'next_wk');// 下月 周数据 去除重复

      // 分割数组
      _swiperStrArr2[0] = formatArray(_swiperStrArr[0]);
      _swiperStrArr2[1] = formatArray(_swiperStrArr[1]);
      _swiperStrArr2[2] = formatArray(_swiperStrArr[2]);

      // 当前月 第一天 最后一天 星期几 1-7
      var _day_first_wk = _lunar._getDay(_obj._yyyy,_obj._mm,1);
      var _day_last_wk = _lunar._getDay(_obj._yyyy,_obj._mm,H5_date.fn_maxD(_obj._yyyy,_obj._mm));

      var n = _obj._dd + [,2,3,4,5,6,7,1][_lunar._getDay(_obj._yyyy,_obj._mm,1)];
      var _lineNum = Math.ceil(n/7);
      // _lineNum = 6;

      if(_lineNum == 1){
        _wk_data[0] = _swiperStrArr2[0][_swiperStrArr2[0].length - 1];
        _wk_data[1] = _swiperStrArr2[1][0];
        _wk_data[2] = _swiperStrArr2[1][1];
      }else if(_lineNum == _swiperStrArr2[1].length){
        _wk_data[0] = _swiperStrArr2[1][_swiperStrArr2[1].length - 2];
        _wk_data[1] = _swiperStrArr2[1][_swiperStrArr2[1].length - 1];
        _wk_data[2] = _swiperStrArr2[2][0];
      }else{
        _wk_data[0] = _swiperStrArr2[1][_lineNum - 2];
        _wk_data[1] = _swiperStrArr2[1][_lineNum - 1];
        _wk_data[2] = _swiperStrArr2[1][_lineNum];
      }
      // debugger;

      // 调试代码
      // try{
      //     _wk_data[0].join('') && _wk_data[1].join('') && _wk_data[2].join('');
      // }catch (e){
      //     console.log(_swiperStrArr2,_lineNum);
      //     console.log(_wk_data);
      // }

      _swiperStrArr[0] = '<div class="swiper-slide"><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_wk_data[0].join('')+'</ul></div></div>';
      _swiperStrArr[1] = '<div class="swiper-slide"><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_wk_data[1].join('')+'</ul></div></div>';
      _swiperStrArr[2] = '<div class="swiper-slide"><div class="calendarBox_th"><ul class="clearfix"><li><i class="red">日</i></li><li><i>一</i></li><li><i>二</i></li><li><i>三</i></li><li><i>四</i></li><li><i>五</i></li><li><i class="red">六</i></li></ul></div><div class="calendarBox_td"><ul class="clearfix">'+_wk_data[2].join('')+'</ul></div></div>';

      // 回调函数
      callBack && callBack();
  }

  swiperStrArr_init(_this.data_obj);

  var _el_dom = document.getElementById(_this.slideBox_el);
  _el_dom && (_el_dom.innerHTML = _swiperStrArr.join(''));

  function _swiper_init() {
      // 显示数据 左右滑动动画 js
      var isinit = false;
      // 更新 __wk__ __d__
      function fn_updateCheck(_obj) {
        var _d = _obj._dd;
        var _wk = _lunar._getDay(_obj._yyyy,_obj._mm,_obj._dd);

        H5_date.__wk__ = _wk;
        H5_date.__d__ = _d;
      }
      function add(_swiper,_is) {
          // 防止(初始化)多次触发
          // if(!isinit){
          //   isinit = true;
          //   return false;
          // }
          var _str = JSON.stringify(_this.data_obj);
          // _swiper.disableTouchControl();
          if(_is && (_is == 'first')){

              _swiper.disableTouchControl(); // 禁用
              _this.data_obj = H5_date.get_m(_str,1,false);
              swiperStrArr_init(_this.data_obj,function () {
                // debugger;
                  // console.log(_this.data_obj._mm); //_swiperStrArr[0],
                  _swiper.removeSlide([1,2]);
                  // _swiper.slides[0].innerHTML = _swiperStrArr[0];
                  // _swiper.slides[2].innerHTML = _swiperStrArr[0];

                  _swiper.prependSlide(_swiperStrArr[0]);
                  _swiper.appendSlide(_swiperStrArr[2]);
                  _swiper.enableTouchControl(); //解除禁用
              });
          }else if(_is && (_is == 'last')){

              _swiper.disableTouchControl(); // 禁用
              _this.data_obj = H5_date.get_m(_str,1,true);
              swiperStrArr_init(_this.data_obj,function () {
                // debugger;
                  // console.log(_this.data_obj._mm); //_swiperStrArr[2],
                  _swiper.removeSlide([0,1]);
                  // _swiper.slides[0].innerHTML = _swiperStrArr[0];
                  // _swiper.slides[2].innerHTML = _swiperStrArr[0];

                  _swiper.prependSlide(_swiperStrArr[0]);
                  _swiper.appendSlide(_swiperStrArr[2]);
                  _swiper.enableTouchControl(); //解除禁用
              });
          }

          // 更新 __wk__ __d__
          fn_updateCheck(_this.data_obj);
          // _swiper.updateSlidesSize();
          // console.log(_swiper.$('.swiper-slide-active').index());
          // _swiper.enableTouchControl();
      }
      function add2(_swiper,_is) {
          // 防止(初始化)多次触发
          // if(!isinit){
          //   isinit = true;
          //   return false;
          // }

          var _str = JSON.stringify(_this.data_obj);
          _swiper.disableTouchControl();
          if(_is && (_is == 'first')){
              _swiper.disableTouchControl(); // 禁用
              _this.data_obj = H5_date.get_d(_str,7,false);
              swiperStrArr_init(_this.data_obj,function () {
                // debugger;
                  // console.log(_this.data_obj._mm); //_swiperStrArr[0],
                  _swiper.removeSlide([1,2]);
                  // _swiper.slides[0].innerHTML = _swiperStrArr[0];
                  // _swiper.slides[2].innerHTML = _swiperStrArr[0];

          // console.log(_swiperStrArr,'first');
                  _swiper.prependSlide(_swiperStrArr[0]);
                  _swiper.appendSlide(_swiperStrArr[2]);
                  _swiper.enableTouchControl(); //解除禁用
              });
          }else if(_is && (_is == 'last')){
              _swiper.disableTouchControl(); // 禁用
              _this.data_obj = H5_date.get_d(_str,7,true);
              swiperStrArr_init(_this.data_obj,function () {
                // debugger;
                  // console.log(_this.data_obj._dd); //_swiperStrArr[2],
                  _swiper.removeSlide([0,1]);
                  // _swiper.slides[0].innerHTML = _swiperStrArr[0];
                  // _swiper.slides[2].innerHTML = _swiperStrArr[0];

          // console.log(_swiperStrArr,'last');
                  _swiper.prependSlide(_swiperStrArr[0]);
                  _swiper.appendSlide(_swiperStrArr[2]);
                  _swiper.enableTouchControl(); //解除禁用
              });
          }
          // console.log(_this.data_obj);

          // 更新 __wk__ __d__
          fn_updateCheck(_this.data_obj);
          // _swiper.updateSlidesSize();
          // console.log(_swiper.$('.swiper-slide-active').index());
          _swiper.enableTouchControl();
      }
      function _SlideChangeEnd(_swiper) {
          var _is;
          var _index;
          if(_swiper.activeIndex == 0){
              _is = 'first';
          }else if(_swiper.activeIndex == _swiper.slides.length - 1){
              _is = 'last';
          }else{
              _is = null;
          }
          // 更换数据
          _this.is_wkData.is ? add2(_swiper,_is) : add(_swiper,_is);
      }
      var is_Touch = false;
      var _obj = {
          direction: 'horizontal',
          loop: false,
          initialSlide :1,
          onSlidePrevEnd: function (_swiper) {
            if(is_Touch){
                _this.is_wkData.is ? add2(_swiper,'first') : add(_swiper,'first');
                is_Touch = false;
            }
          },
          onSlideNextEnd: function (_swiper) {
              if(is_Touch){
                  _this.is_wkData.is ? add2(_swiper,'last') : add(_swiper,'last');
                  is_Touch = false;
              }
          },
          onTouchMove: function () {
              is_Touch = true;
          },
          onTouchEnd: function (_swiper) {
              setTimeout(function () {
                  // onSlidePrevEnd onSlideNextEnd 执行后 不执行
                  if(is_Touch){
                    _SlideChangeEnd(_swiper);
                    is_Touch = false;
                    return false;
                  }
              },100);
          }
      };
      // 日历显示 交互
      _swiper = new Swiper ('#'+_this.swiper_el, _obj);
  }
  _swiper_init();

  // fn_callBack && fn_callBack();

  return _this;
};

// H5_date.init(,'swiper-container1','swiper-wrapper1');
