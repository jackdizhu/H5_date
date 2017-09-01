// 月份加减需要处理

var _lunar = {
  // 获取星期几
  _getDay: function (y,m,d) {
     var _d = new Date(y,m - 1,d).getDay();
     var _a = [7,1,2,3,4,5,6];
     // console.log(_d);
     return _a[_d];
  }
};
var H5_date = {
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

    this.add_prevM(this._data[0]);
    this.add_thisM(this._data[1]);
    this.add_nextM(this._data[2]);

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
      return _cOrs_str;
  },
  // 获取上一月数据
  add_prevM: function () {
    var _cOrs_str = '&nbsp;';
    // 获取上一月 最大天数
    var _maxD = this.fn_maxD(this._data[1]._yyyy,this._data[1]._mm);
    // 获取当前月 1号 信息
    var _d = _lunar._getDay(this._data[1]._yyyy,this._data[1]._mm,1);
    var __n = _maxD - _d;
    if(_d != 7){
      var j;
      for (var i = 0; i < _d; i++) {
        j = i + __n + 1;
        // 获取 财 衰 数据
        _cOrs_str = this.get_cOrs_str(this._data[0]._yyyy,this._data[0]._mm,j);

        this._thisMothData.push('<li data_y="' + this._data[0]._yyyy + '" data_m="' + this._data[0]._mm + '" data_d="' + j + '" class="prevMonth"><span>' + j + '</span><i>' + _cOrs_str + '</i></li>');
      }
    }

    // return str;
  },
  // 获取当前一月数据
  add_thisM: function () {
    var _cOrs_str = '&nbsp;';

    var _maxD = this.fn_maxD(this._data[1]._yyyy,this._data[1]._mm);
    var _d = this._wk;
    var j;
    var is_day = '';

    for (var i = 0; i < _maxD; i++) {
      j = i + 1;
      // 获取 财 衰 数据
      _cOrs_str = this.get_cOrs_str(this._data[1]._yyyy,this._data[1]._mm,j);
      if(this._data[1]._dd && j == this._data[1]._dd){
        is_day = 'is_day';
      }else{
        is_day = '';
      }
      this._thisMothData.push('<li data_y="' + this._data[1]._yyyy + '" data_m="' + this._data[1]._mm + '" data_d="' + i + '" class="thisMonth '+ is_day +'"><span>' + j + '</span><i>' + _cOrs_str + '</i></li>');
    }
    // return str;
  },
  // 获取下一月数据
  add_nextM: function () {
    var _cOrs_str = '&nbsp;';
    var j;
    var __n = 42 - this._thisMothData.length;

    if(this._thisMothData.length < 42){
      for (var i = 0; i < __n; i++) {
        j = i + 1;
        // 获取 财 衰 数据
        _cOrs_str = this.get_cOrs_str(this._data[2]._yyyy,this._data[2]._mm,j);
        // 当天星期几
        // str += '<li data_y="' + this._data[2]._yyyy + '" data_m="' + this._data[2]._mm + '" data_d="' + i + '" class="nextMonth"><span>' + j + '</span><i>' + _cOrs_str + '</i></li>';
        this._thisMothData.push('<li data_y="' + this._data[2]._yyyy + '" data_m="' + this._data[2]._mm + '" data_d="' + i + '" class="nextMonth"><span>' + j + '</span><i>' + _cOrs_str + '</i></li>');
      }
    }
    // return str;
  }
};
