
手机端日历插件
calendar js 1900-2100 农历数据
1900,3,1-2100.12.31 阳历最大值


https://github.com/jackdizhu/H5_date
https://jackdizhu.github.io/H5_date

[comment]: <> (This is a comment, it will not be included)
[comment]: <> (in  the output file unless you use it in)
[comment]: <> (a reference style link.)
[//]: <> (This is also a comment.)
[//]: # (This may be the most platform independent comment)

// 生成日历数据 1900,3,1-2100.12.31 阳历最大值
/**
    var dataArr =
        {
          _ymd: {
            y: 2017,
            m: 9,
            d: 2
          },
          _arr: ['财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰','财','衰','衰']
        }
      ;

    var data_obj = {
      _yyyy: 2017,
      _mm: 9,
      _dd: 5,
      data:dataArr
    };
*/

    var json_str = JSON.stringify(data_obj);
    var _H5_date = H5_date.init(json_str,'swiper-container1','swiper-wrapper1',{
          seleceMothData: function () { // 显示月数据 回调
              $('.calendarBox').removeClass('fixedItem');
              $('.page_results').removeClass('fixedBox');
              console.log('seleceMothData');
          },
          seleceDayData: function () { // 显示周数据 回调
              $('.calendarBox').addClass('fixedItem');
              $('.page_results').addClass('fixedBox');
              console.log('seleceDayData');
          }
      });
