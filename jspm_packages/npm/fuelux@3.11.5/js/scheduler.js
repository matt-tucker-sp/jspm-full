/* */ 
"format cjs";
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'fuelux/combobox', 'fuelux/datepicker', 'fuelux/radio', 'fuelux/selectlist', 'fuelux/spinbox'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('./combobox'), require('./datepicker'), require('./radio'), require('./selectlist'), require('./spinbox'));
  } else {
    factory(jQuery);
  }
}(function($) {
  if (!$.fn.combobox || !$.fn.datepicker || !$.fn.radio || !$.fn.selectlist || !$.fn.spinbox) {
    throw new Error('Fuel UX scheduler control requires combobox, datepicker, radio, selectlist, and spinbox.');
  }
  var old = $.fn.scheduler;
  var Scheduler = function Scheduler(element, options) {
    var self = this;
    this.$element = $(element);
    this.options = $.extend({}, $.fn.scheduler.defaults, options);
    this.$startDate = this.$element.find('.start-datetime .start-date');
    this.$startTime = this.$element.find('.start-datetime .start-time');
    this.$timeZone = this.$element.find('.timezone-container .timezone');
    this.$repeatIntervalPanel = this.$element.find('.repeat-every-panel');
    this.$repeatIntervalSelect = this.$element.find('.repeat-options');
    this.$repeatIntervalSpinbox = this.$element.find('.repeat-every');
    this.$repeatIntervalTxt = this.$element.find('.repeat-every-text');
    this.$end = this.$element.find('.repeat-end');
    this.$endSelect = this.$end.find('.end-options');
    this.$endAfter = this.$end.find('.end-after');
    this.$endDate = this.$end.find('.end-on-date');
    this.$recurrencePanels = this.$element.find('.repeat-panel');
    this.$repeatIntervalSelect.selectlist();
    this.$element.find('.selectlist').selectlist();
    this.$startDate.datepicker(this.options.startDateOptions);
    var startDateResponse = (typeof this.options.startDateChanged === "function") ? this.options.startDateChanged : this._guessEndDate;
    this.$startDate.on('change changed.fu.datepicker dateClicked.fu.datepicker', $.proxy(startDateResponse, this));
    this.$startTime.combobox();
    if (this.$startTime.find('input').val() === '') {
      this.$startTime.combobox('selectByIndex', 0);
    }
    if (this.$repeatIntervalSpinbox.find('input').val() === '0') {
      this.$repeatIntervalSpinbox.spinbox({
        'value': 1,
        'min': 1,
        'limitToStep': true
      });
    } else {
      this.$repeatIntervalSpinbox.spinbox({
        'min': 1,
        'limitToStep': true
      });
    }
    this.$endAfter.spinbox({
      'value': 1,
      'min': 1,
      'limitToStep': true
    });
    this.$endDate.datepicker(this.options.endDateOptions);
    this.$element.find('.radio-custom').radio();
    this.$repeatIntervalSelect.on('changed.fu.selectlist', $.proxy(this.repeatIntervalSelectChanged, this));
    this.$endSelect.on('changed.fu.selectlist', $.proxy(this.endSelectChanged, this));
    this.$element.find('.repeat-days-of-the-week .btn-group .btn').on('change.fu.scheduler', function(e, data) {
      self.changed(e, data, true);
    });
    this.$element.find('.combobox').on('changed.fu.combobox', $.proxy(this.changed, this));
    this.$element.find('.datepicker').on('changed.fu.datepicker', $.proxy(this.changed, this));
    this.$element.find('.datepicker').on('dateClicked.fu.datepicker', $.proxy(this.changed, this));
    this.$element.find('.selectlist').on('changed.fu.selectlist', $.proxy(this.changed, this));
    this.$element.find('.spinbox').on('changed.fu.spinbox', $.proxy(this.changed, this));
    this.$element.find('.repeat-monthly .radio-custom, .repeat-yearly .radio-custom').on('change.fu.scheduler', $.proxy(this.changed, this));
  };
  var _getFormattedDate = function _getFormattedDate(dateObj, dash) {
    var fdate = '';
    var item;
    fdate += dateObj.getFullYear();
    fdate += dash;
    item = dateObj.getMonth() + 1;
    fdate += (item < 10) ? '0' + item : item;
    fdate += dash;
    item = dateObj.getDate();
    fdate += (item < 10) ? '0' + item : item;
    return fdate;
  };
  var ONE_SECOND = 1000;
  var ONE_MINUTE = ONE_SECOND * 60;
  var ONE_HOUR = ONE_MINUTE * 60;
  var ONE_DAY = ONE_HOUR * 24;
  var ONE_WEEK = ONE_DAY * 7;
  var ONE_MONTH = ONE_WEEK * 5;
  var ONE_YEAR = ONE_WEEK * 52;
  var INTERVALS = {
    secondly: ONE_SECOND,
    minutely: ONE_MINUTE,
    hourly: ONE_HOUR,
    daily: ONE_DAY,
    weekly: ONE_WEEK,
    monthly: ONE_MONTH,
    yearly: ONE_YEAR
  };
  var _incrementDate = function _incrementDate(start, end, interval, increment) {
    return new Date(start.getTime() + (INTERVALS[interval] * increment));
  };
  Scheduler.prototype = {
    constructor: Scheduler,
    destroy: function destroy() {
      var markup;
      this.$element.find('input').each(function() {
        $(this).attr('value', $(this).val());
      });
      this.$element.find('.datepicker .calendar').empty();
      markup = this.$element[0].outerHTML;
      this.$element.find('.combobox').combobox('destroy');
      this.$element.find('.datepicker').datepicker('destroy');
      this.$element.find('.selectlist').selectlist('destroy');
      this.$element.find('.spinbox').spinbox('destroy');
      this.$element.find('.radio-custom').radio('destroy');
      this.$element.remove();
      return markup;
    },
    changed: function changed(e, data, propagate) {
      if (!propagate) {
        e.stopPropagation();
      }
      this.$element.trigger('changed.fu.scheduler', {
        data: (data !== undefined) ? data : $(e.currentTarget).data(),
        originalEvent: e,
        value: this.getValue()
      });
    },
    disable: function disable() {
      this.toggleState('disable');
    },
    enable: function enable() {
      this.toggleState('enable');
    },
    setUtcTime: function setUtcTime(d, t, offset) {
      var date = d.split('-');
      var time = t.split(':');
      function z(n) {
        return (n < 10 ? '0' : '') + n;
      }
      var utcDate = new Date(Date.UTC(date[0], (date[1] - 1), date[2], time[0], time[1], (time[2] ? time[2] : 0)));
      if (offset === 'Z') {
        utcDate.setUTCHours(utcDate.getUTCHours() + 0);
      } else {
        var re1 = '(.)';
        var re2 = '.*?';
        var re3 = '\\d';
        var re4 = '.*?';
        var re5 = '(\\d)';
        var p = new RegExp(re1 + re2 + re3 + re4 + re5, ["i"]);
        var m = p.exec(offset);
        if (m !== null) {
          var c1 = m[1];
          var d1 = m[2];
          var modifier = (c1 === '+') ? 1 : -1;
          utcDate.setUTCHours(utcDate.getUTCHours() + (modifier * parseInt(d1, 10)));
        }
      }
      var localDifference = utcDate.getTimezoneOffset();
      utcDate.setMinutes(localDifference);
      return utcDate;
    },
    endSelectChanged: function endSelectChanged(e, data) {
      var selectedItem,
          val;
      if (!data) {
        selectedItem = this.$endSelect.selectlist('selectedItem');
        val = selectedItem.value;
      } else {
        val = data.value;
      }
      this.$endAfter.parent().addClass('hidden');
      this.$endAfter.parent().attr('aria-hidden', 'true');
      this.$endDate.parent().addClass('hidden');
      this.$endDate.parent().attr('aria-hidden', 'true');
      if (val === 'after') {
        this.$endAfter.parent().removeClass('hide hidden');
        this.$endAfter.parent().attr('aria-hidden', 'false');
      } else if (val === 'date') {
        this.$endDate.parent().removeClass('hide hidden');
        this.$endDate.parent().attr('aria-hidden', 'false');
      }
    },
    _guessEndDate: function _guessEndDate() {
      var interval = this.$repeatIntervalSelect.selectlist('selectedItem').value;
      var end = new Date(this.$endDate.datepicker('getDate'));
      var start = new Date(this.$startDate.datepicker('getDate'));
      var increment = this.$repeatIntervalSpinbox.find('input').val();
      if (interval !== "none" && end <= start) {
        if (!this.$repeatIntervalSpinbox.is(':visible')) {
          increment = 1;
        }
        if (interval === "weekdays") {
          increment = 1;
          interval = "weekly";
        }
        end = _incrementDate(start, end, interval, increment);
        this.$endDate.datepicker('setDate', end);
      }
    },
    getValue: function getValue() {
      var interval = this.$repeatIntervalSpinbox.spinbox('value');
      var pattern = '';
      var repeat = this.$repeatIntervalSelect.selectlist('selectedItem').value;
      var startTime;
      if (this.$startTime.combobox('selectedItem').value) {
        startTime = this.$startTime.combobox('selectedItem').value;
        startTime = startTime.toLowerCase();
      } else {
        startTime = this.$startTime.combobox('selectedItem').text.toLowerCase();
      }
      var timeZone = this.$timeZone.selectlist('selectedItem');
      var day,
          days,
          hasAm,
          hasPm,
          month,
          pos,
          startDateTime,
          type;
      startDateTime = '' + _getFormattedDate(this.$startDate.datepicker('getDate'), '-');
      startDateTime += 'T';
      hasAm = (startTime.search('am') >= 0);
      hasPm = (startTime.search('pm') >= 0);
      startTime = $.trim(startTime.replace(/am/g, '').replace(/pm/g, '')).split(':');
      startTime[0] = parseInt(startTime[0], 10);
      startTime[1] = parseInt(startTime[1], 10);
      if (hasAm && startTime[0] > 11) {
        startTime[0] = 0;
      } else if (hasPm && startTime[0] < 12) {
        startTime[0] += 12;
      }
      startDateTime += (startTime[0] < 10) ? '0' + startTime[0] : startTime[0];
      startDateTime += ':';
      startDateTime += (startTime[1] < 10) ? '0' + startTime[1] : startTime[1];
      startDateTime += (timeZone.offset === '+00:00') ? 'Z' : timeZone.offset;
      if (repeat === 'none') {
        pattern = 'FREQ=DAILY;INTERVAL=1;COUNT=1;';
      } else if (repeat === 'secondly') {
        pattern = 'FREQ=SECONDLY;';
        pattern += 'INTERVAL=' + interval + ';';
      } else if (repeat === 'minutely') {
        pattern = 'FREQ=MINUTELY;';
        pattern += 'INTERVAL=' + interval + ';';
      } else if (repeat === 'hourly') {
        pattern = 'FREQ=HOURLY;';
        pattern += 'INTERVAL=' + interval + ';';
      } else if (repeat === 'daily') {
        pattern += 'FREQ=DAILY;';
        pattern += 'INTERVAL=' + interval + ';';
      } else if (repeat === 'weekdays') {
        pattern += 'FREQ=DAILY;';
        pattern += 'BYDAY=MO,TU,WE,TH,FR;';
        pattern += 'INTERVAL=1;';
      } else if (repeat === 'weekly') {
        days = [];
        this.$element.find('.repeat-days-of-the-week .btn-group input:checked').each(function() {
          days.push($(this).data().value);
        });
        pattern += 'FREQ=WEEKLY;';
        pattern += 'BYDAY=' + days.join(',') + ';';
        pattern += 'INTERVAL=' + interval + ';';
      } else if (repeat === 'monthly') {
        pattern += 'FREQ=MONTHLY;';
        pattern += 'INTERVAL=' + interval + ';';
        type = this.$element.find('input[name=repeat-monthly]:checked').val();
        if (type === 'bymonthday') {
          day = parseInt(this.$element.find('.repeat-monthly-date .selectlist').selectlist('selectedItem').text, 10);
          pattern += 'BYMONTHDAY=' + day + ';';
        } else if (type === 'bysetpos') {
          days = this.$element.find('.repeat-monthly-day .month-days').selectlist('selectedItem').value;
          pos = this.$element.find('.repeat-monthly-day .month-day-pos').selectlist('selectedItem').value;
          pattern += 'BYDAY=' + days + ';';
          pattern += 'BYSETPOS=' + pos + ';';
        }
      } else if (repeat === 'yearly') {
        pattern += 'FREQ=YEARLY;';
        type = this.$element.find('input[name=repeat-yearly]:checked').val();
        if (type === 'bymonthday') {
          month = this.$element.find('.repeat-yearly-date .year-month').selectlist('selectedItem').value;
          day = this.$element.find('.repeat-yearly-date .year-month-day').selectlist('selectedItem').text;
          pattern += 'BYMONTH=' + month + ';';
          pattern += 'BYMONTHDAY=' + day + ';';
        } else if (type === 'bysetpos') {
          days = this.$element.find('.repeat-yearly-day .year-month-days').selectlist('selectedItem').value;
          pos = this.$element.find('.repeat-yearly-day .year-month-day-pos').selectlist('selectedItem').value;
          month = this.$element.find('.repeat-yearly-day .year-month').selectlist('selectedItem').value;
          pattern += 'BYDAY=' + days + ';';
          pattern += 'BYSETPOS=' + pos + ';';
          pattern += 'BYMONTH=' + month + ';';
        }
      }
      var end = this.$endSelect.selectlist('selectedItem').value;
      var duration = '';
      if (repeat !== 'none') {
        if (end === 'after') {
          duration = 'COUNT=' + this.$endAfter.spinbox('value') + ';';
        } else if (end === 'date') {
          duration = 'UNTIL=' + _getFormattedDate(this.$endDate.datepicker('getDate'), '') + ';';
        }
      }
      pattern += duration;
      pattern = pattern.substring(pattern.length - 1) === ';' ? pattern.substring(0, pattern.length - 1) : pattern;
      var data = {
        startDateTime: startDateTime,
        timeZone: timeZone,
        recurrencePattern: pattern
      };
      return data;
    },
    repeatIntervalSelectChanged: function repeatIntervalSelectChanged(e, data) {
      var selectedItem,
          val,
          txt;
      if (!data) {
        selectedItem = this.$repeatIntervalSelect.selectlist('selectedItem');
        val = selectedItem.value || "";
        txt = selectedItem.text || "";
      } else {
        val = data.value;
        txt = data.text;
      }
      this.$repeatIntervalTxt.text(txt);
      switch (val.toLowerCase()) {
        case 'hourly':
        case 'daily':
        case 'weekly':
        case 'monthly':
          this.$repeatIntervalPanel.removeClass('hide hidden');
          this.$repeatIntervalPanel.attr('aria-hidden', 'false');
          break;
        default:
          this.$repeatIntervalPanel.addClass('hidden');
          this.$repeatIntervalPanel.attr('aria-hidden', 'true');
          break;
      }
      this.$recurrencePanels.addClass('hidden');
      this.$recurrencePanels.attr('aria-hidden', 'true');
      this.$element.find('.repeat-' + val).removeClass('hide hidden');
      this.$element.find('.repeat-' + val).attr('aria-hidden', 'false');
      if (val === 'none') {
        this.$end.addClass('hidden');
        this.$end.attr('aria-hidden', 'true');
      } else {
        this.$end.removeClass('hide hidden');
        this.$end.attr('aria-hidden', 'false');
      }
      this._guessEndDate();
    },
    setValue: function setValue(options) {
      var hours,
          i,
          item,
          l,
          minutes,
          period,
          recur,
          temp,
          startDate,
          startTime,
          timeOffset;
      if (options.startDateTime) {
        temp = options.startDateTime.split('T');
        startDate = temp[0];
        if (temp[1]) {
          temp[1] = temp[1].split(':');
          hours = parseInt(temp[1][0], 10);
          minutes = (temp[1][1]) ? parseInt(temp[1][1].split('+')[0].split('-')[0].split('Z')[0], 10) : 0;
          period = (hours < 12) ? 'AM' : 'PM';
          if (hours === 0) {
            hours = 12;
          } else if (hours > 12) {
            hours -= 12;
          }
          minutes = (minutes < 10) ? '0' + minutes : minutes;
          startTime = hours + ':' + minutes;
          temp = hours + ':' + minutes + ' ' + period;
          this.$startTime.find('input').val(temp);
          this.$startTime.combobox('selectByText', temp);
        } else {
          startTime = '00:00';
        }
      } else {
        startTime = '00:00';
        var currentDate = this.$startDate.datepicker('getDate');
        startDate = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();
      }
      item = 'li';
      if (options.timeZone) {
        if (typeof(options.timeZone) === 'string') {
          item += '[data-name="' + options.timeZone + '"]';
        } else {
          $.each(options.timeZone, function(key, value) {
            item += '[data-' + key + '="' + value + '"]';
          });
        }
        timeOffset = options.timeZone.offset;
        this.$timeZone.selectlist('selectBySelector', item);
      } else if (options.startDateTime) {
        temp = options.startDateTime.split('T')[1];
        if (temp) {
          if (temp.search(/\+/) > -1) {
            temp = '+' + $.trim(temp.split('+')[1]);
          } else if (temp.search(/\-/) > -1) {
            temp = '-' + $.trim(temp.split('-')[1]);
          } else {
            temp = '+00:00';
          }
        } else {
          temp = '+00:00';
        }
        timeOffset = (temp === '+00:00') ? 'Z' : temp;
        item += '[data-offset="' + temp + '"]';
        this.$timeZone.selectlist('selectBySelector', item);
      } else {
        timeOffset = 'Z';
      }
      if (options.recurrencePattern) {
        recur = {};
        temp = options.recurrencePattern.toUpperCase().split(';');
        for (i = 0, l = temp.length; i < l; i++) {
          if (temp[i] !== '') {
            item = temp[i].split('=');
            recur[item[0]] = item[1];
          }
        }
        if (recur.FREQ === 'DAILY') {
          if (recur.BYDAY === 'MO,TU,WE,TH,FR') {
            item = 'weekdays';
          } else {
            if (recur.INTERVAL === '1' && recur.COUNT === '1') {
              item = 'none';
            } else {
              item = 'daily';
            }
          }
        } else if (recur.FREQ === 'SECONDLY') {
          item = 'secondly';
        } else if (recur.FREQ === 'MINUTELY') {
          item = 'minutely';
        } else if (recur.FREQ === 'HOURLY') {
          item = 'hourly';
        } else if (recur.FREQ === 'WEEKLY') {
          if (recur.BYDAY) {
            item = this.$element.find('.repeat-days-of-the-week .btn-group');
            item.find('label').removeClass('active');
            temp = recur.BYDAY.split(',');
            for (i = 0, l = temp.length; i < l; i++) {
              item.find('input[data-value="' + temp[i] + '"]').prop('checked', true).parent().addClass('active');
            }
          }
          item = 'weekly';
        } else if (recur.FREQ === 'MONTHLY') {
          this.$element.find('.repeat-monthly input').removeAttr('checked').removeClass('checked');
          this.$element.find('.repeat-monthly label.radio-custom').removeClass('checked');
          if (recur.BYMONTHDAY) {
            temp = this.$element.find('.repeat-monthly-date');
            temp.find('input').addClass('checked').prop('checked', true);
            temp.find('label.radio-custom').addClass('checked');
            temp.find('.selectlist').selectlist('selectByValue', recur.BYMONTHDAY);
          } else if (recur.BYDAY) {
            temp = this.$element.find('.repeat-monthly-day');
            temp.find('input').addClass('checked').prop('checked', true);
            temp.find('label.radio-custom').addClass('checked');
            if (recur.BYSETPOS) {
              temp.find('.month-day-pos').selectlist('selectByValue', recur.BYSETPOS);
            }
            temp.find('.month-days').selectlist('selectByValue', recur.BYDAY);
          }
          item = 'monthly';
        } else if (recur.FREQ === 'YEARLY') {
          this.$element.find('.repeat-yearly input').removeAttr('checked').removeClass('checked');
          this.$element.find('.repeat-yearly label.radio-custom').removeClass('checked');
          if (recur.BYMONTHDAY) {
            temp = this.$element.find('.repeat-yearly-date');
            temp.find('input').addClass('checked').prop('checked', true);
            temp.find('label.radio-custom').addClass('checked');
            if (recur.BYMONTH) {
              temp.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
            }
            temp.find('.year-month-day').selectlist('selectByValue', recur.BYMONTHDAY);
          } else if (recur.BYSETPOS) {
            temp = this.$element.find('.repeat-yearly-day');
            temp.find('input').addClass('checked').prop('checked', true);
            temp.find('label.radio-custom').addClass('checked');
            temp.find('.year-month-day-pos').selectlist('selectByValue', recur.BYSETPOS);
            if (recur.BYDAY) {
              temp.find('.year-month-days').selectlist('selectByValue', recur.BYDAY);
            }
            if (recur.BYMONTH) {
              temp.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
            }
          }
          item = 'yearly';
        } else {
          item = 'none';
        }
        if (recur.COUNT) {
          this.$endAfter.spinbox('value', parseInt(recur.COUNT, 10));
          this.$endSelect.selectlist('selectByValue', 'after');
        } else if (recur.UNTIL) {
          temp = recur.UNTIL;
          if (temp.length === 8) {
            temp = temp.split('');
            temp.splice(4, 0, '-');
            temp.splice(7, 0, '-');
            temp = temp.join('');
          }
          var timeZone = this.$timeZone.selectlist('selectedItem');
          var timezoneOffset = (timeZone.offset === '+00:00') ? 'Z' : timeZone.offset;
          var utcEndHours = this.setUtcTime(temp, startTime, timezoneOffset);
          this.$endDate.datepicker('setDate', utcEndHours);
          this.$endSelect.selectlist('selectByValue', 'date');
        } else {
          this.$endSelect.selectlist('selectByValue', 'never');
        }
        this.endSelectChanged();
        if (recur.INTERVAL) {
          this.$repeatIntervalSpinbox.spinbox('value', parseInt(recur.INTERVAL, 10));
        }
        this.$repeatIntervalSelect.selectlist('selectByValue', item);
        this.repeatIntervalSelectChanged();
      }
      var utcStartHours = this.setUtcTime(startDate, startTime, timeOffset);
      this.$startDate.datepicker('setDate', utcStartHours);
    },
    toggleState: function toggleState(action) {
      this.$element.find('.combobox').combobox(action);
      this.$element.find('.datepicker').datepicker(action);
      this.$element.find('.selectlist').selectlist(action);
      this.$element.find('.spinbox').spinbox(action);
      this.$element.find('.radio-custom').radio(action);
      if (action === 'disable') {
        action = 'addClass';
      } else {
        action = 'removeClass';
      }
      this.$element.find('.repeat-days-of-the-week .btn-group')[action]('disabled');
    },
    value: function value(options) {
      if (options) {
        return this.setValue(options);
      } else {
        return this.getValue();
      }
    }
  };
  $.fn.scheduler = function scheduler(option) {
    var args = Array.prototype.slice.call(arguments, 1);
    var methodReturn;
    var $set = this.each(function() {
      var $this = $(this);
      var data = $this.data('fu.scheduler');
      var options = typeof option === 'object' && option;
      if (!data) {
        $this.data('fu.scheduler', (data = new Scheduler(this, options)));
      }
      if (typeof option === 'string') {
        methodReturn = data[option].apply(data, args);
      }
    });
    return (methodReturn === undefined) ? $set : methodReturn;
  };
  $.fn.scheduler.defaults = {};
  $.fn.scheduler.Constructor = Scheduler;
  $.fn.scheduler.noConflict = function noConflict() {
    $.fn.scheduler = old;
    return this;
  };
  $(document).on('mousedown.fu.scheduler.data-api', '[data-initialize=scheduler]', function(e) {
    var $control = $(e.target).closest('.scheduler');
    if (!$control.data('fu.scheduler')) {
      $control.scheduler($control.data());
    }
  });
  $(function() {
    $('[data-initialize=scheduler]').each(function() {
      var $this = $(this);
      if ($this.data('scheduler'))
        return;
      $this.scheduler($this.data());
    });
  });
}));
