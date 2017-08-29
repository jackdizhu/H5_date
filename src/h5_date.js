// 依赖插件calendar
var _lunar = {
  // 阳历 转农历 等 详细信息
  solar2lunar: calendar.solar2lunar
};
var H5_date = {
  get_date: function (_obj,_wk) {
    var _this = {
      _yyyy: _obj._yyyy,
      _mm: _obj._mm,
      _dd: _obj._dd,
      _el: _obj._el
    }
    var str = '';
    str += this.add_prevM({
      _yyyy: _this._yyyy,
      _mm: _this._mm-1
    });
    str += this.add_thisM({
      _yyyy: _this._yyyy,
      _mm: _this._mm,
      _dd: _this._dd
    },_wk);
    str += this.add_nextM({
      _yyyy: _this._yyyy,
      _mm: _this._mm+1
    });
    // _wk 按周显示
    if(_wk){
        str = this.fn_getWkData(_this,str);
    }
    if(_this._el){
        document.getElementById(_this._el).innerHTML = str;
    }
    return str;
  },
  fn_getWkData: function (_obj,str) {
      // var _maxD = this.fn_maxD(_obj._yyyy,_obj._mm);
      // var _d = _lunar.solar2lunar(_obj._yyyy,_obj._mm,_obj._dd);
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
  // 获取上一月数据
  add_prevM: function (_obj) {
    // 获取上一月 最大天数
    var _maxD = this.fn_maxD(_obj._yyyy,_obj._mm);
    // 获取当前月 1号 信息
    var _d = _lunar.solar2lunar(_obj._yyyy,_obj._mm+1,1);
    var __n = _maxD - _d.nWeek;
    var str = '',j;
    if(_d.nWeek != 7){
      for (var i = 0; i < _d.nWeek; i++) {
        j = i + __n + 1;
        if(i == 0){
          str += '<tr>';
        }
        str += '<td data_y="' + _obj._yyyy + '" data_m="' + _obj._mm + '" data_d="' + i + '" class="prevMonth"><i>' + j + '</i><em>' + '&nbsp;' + '</em></td>';
      }
    }else{
      str += '<tr>';
    }
    return str;
  },
  // 获取当前一月数据
  add_thisM: function (_obj,_wk) {
    // 按周显示 分割字符串
    var _j = _wk ? ',' : '';

    var _maxD = this.fn_maxD(_obj._yyyy,_obj._mm);
    var _d = _lunar.solar2lunar(_obj._yyyy,_obj._mm,1);
    var str = '',j;
    var _wk = _d.nWeek;
    var __wk = _d.nWeek;
    var is_day = '';

    for (var i = 0; i < _maxD; i++) {
      j = i + 1;
      // 当天星期几
      __wk = _wk%7;
      if(_obj._dd && j == _obj._dd){
        is_day = 'is_day';
      }else{
        is_day = '';
      }
      // if(_wk%7 == 0){
      //  str += '<tr>';
      // }
      str += '<td data_y="' + _obj._yyyy + '" data_m="' + _obj._mm + '" data_d="' + i + '" class="thisMonth '+ is_day +'"><i>' + j + '</i><em>' + '&nbsp;' + '</em></td>';
      if(__wk == 6){
        str += '</tr>' +_j+ '<tr>';
      }
      _wk++;
    }
    return str;
  },
  // 获取下一月数据
  add_nextM: function (_obj) {
    // 上一月 最大值
    var _maxD = this.fn_maxD(_obj._yyyy,_obj._mm-1);
    // 上一月 最后一天信息
    var _d = _lunar.solar2lunar(_obj._yyyy,_obj._mm-1,_maxD);
    var str = '',j;
    var _wk = _d.nWeek;
    // 如果上一月最后一天是 星期六
    if(_wk == 6){
      return '</tr>';
    }
    var __n = (14 - _wk - 1)%7;
    var __wk = _d.nWeek;
    for (var i = 0; i < __n; i++) {
      j = i + 1;
      // 当天星期几
      __wk = _wk%7;
      if(_wk%7 == 0){
        str += '<tr>';
      }
      str += '<td data_y="' + _obj._yyyy + '" data_m="' + _obj._mm + '" data_d="' + i + '" class="nextMonth"><i>' + j + '</i><em>' + '&nbsp;' + '</em></td>';
      if(__wk == 6 || i == __n - 1){
        str += '</tr>';
      }
      _wk++;
    }
    return str;
  }
};
