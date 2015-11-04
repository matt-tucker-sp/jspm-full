/* */ 
"format cjs";
(function(process) {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require('jquery'));
    } else {
      factory(jQuery);
    }
  }(function($) {
    var old = $.fn.combobox;
    var Combobox = function(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, $.fn.combobox.defaults, options);
      this.$dropMenu = this.$element.find('.dropdown-menu');
      this.$input = this.$element.find('input');
      this.$button = this.$element.find('.btn');
      this.$element.on('click.fu.combobox', 'a', $.proxy(this.itemclicked, this));
      this.$element.on('change.fu.combobox', 'input', $.proxy(this.inputchanged, this));
      this.$element.on('shown.bs.dropdown', $.proxy(this.menuShown, this));
      this.setDefaultSelection();
      var items = this.$dropMenu.children('li');
      if (items.length === 0) {
        this.$button.addClass('disabled');
      }
    };
    Combobox.prototype = {
      constructor: Combobox,
      destroy: function() {
        this.$element.remove();
        this.$element.find('input').each(function() {
          $(this).attr('value', $(this).val());
        });
        return this.$element[0].outerHTML;
      },
      doSelect: function($item) {
        if (typeof $item[0] !== 'undefined') {
          this.$selectedItem = $item;
          this.$input.val(this.$selectedItem.text().trim());
        } else {
          this.$selectedItem = null;
        }
      },
      menuShown: function() {
        if (this.options.autoResizeMenu) {
          this.resizeMenu();
        }
      },
      resizeMenu: function() {
        var width = this.$element.outerWidth();
        this.$dropMenu.outerWidth(width);
      },
      selectedItem: function() {
        var item = this.$selectedItem;
        var data = {};
        if (item) {
          var txt = this.$selectedItem.text().trim();
          data = $.extend({text: txt}, this.$selectedItem.data());
        } else {
          data = {text: this.$input.val()};
        }
        return data;
      },
      selectByText: function(text) {
        var $item = $([]);
        this.$element.find('li').each(function() {
          if ((this.textContent || this.innerText || $(this).text() || '').toLowerCase() === (text || '').toLowerCase()) {
            $item = $(this);
            return false;
          }
        });
        this.doSelect($item);
      },
      selectByValue: function(value) {
        var selector = 'li[data-value="' + value + '"]';
        this.selectBySelector(selector);
      },
      selectByIndex: function(index) {
        var selector = 'li:eq(' + index + ')';
        this.selectBySelector(selector);
      },
      selectBySelector: function(selector) {
        var $item = this.$element.find(selector);
        this.doSelect($item);
      },
      setDefaultSelection: function() {
        var selector = 'li[data-selected=true]:first';
        var item = this.$element.find(selector);
        if (item.length > 0) {
          this.selectBySelector(selector);
          item.removeData('selected');
          item.removeAttr('data-selected');
        }
      },
      enable: function() {
        this.$element.removeClass('disabled');
        this.$input.removeAttr('disabled');
        this.$button.removeClass('disabled');
      },
      disable: function() {
        this.$element.addClass('disabled');
        this.$input.attr('disabled', true);
        this.$button.addClass('disabled');
      },
      itemclicked: function(e) {
        this.$selectedItem = $(e.target).parent();
        this.$input.val(this.$selectedItem.text().trim()).trigger('change', {synthetic: true});
        var data = this.selectedItem();
        this.$element.trigger('changed.fu.combobox', data);
        e.preventDefault();
        this.$element.find('.dropdown-toggle').focus();
      },
      inputchanged: function(e, extra) {
        if (extra && extra.synthetic)
          return;
        var val = $(e.target).val();
        this.selectByText(val);
        var data = this.selectedItem();
        if (data.text.length === 0) {
          data = {text: val};
        }
        this.$element.trigger('changed.fu.combobox', data);
      }
    };
    Combobox.prototype.getValue = Combobox.prototype.selectedItem;
    $.fn.combobox = function(option) {
      var args = Array.prototype.slice.call(arguments, 1);
      var methodReturn;
      var $set = this.each(function() {
        var $this = $(this);
        var data = $this.data('fu.combobox');
        var options = typeof option === 'object' && option;
        if (!data) {
          $this.data('fu.combobox', (data = new Combobox(this, options)));
        }
        if (typeof option === 'string') {
          methodReturn = data[option].apply(data, args);
        }
      });
      return (methodReturn === undefined) ? $set : methodReturn;
    };
    $.fn.combobox.defaults = {autoResizeMenu: true};
    $.fn.combobox.Constructor = Combobox;
    $.fn.combobox.noConflict = function() {
      $.fn.combobox = old;
      return this;
    };
    $(document).on('mousedown.fu.combobox.data-api', '[data-initialize=combobox]', function(e) {
      var $control = $(e.target).closest('.combobox');
      if (!$control.data('fu.combobox')) {
        $control.combobox($control.data());
      }
    });
    $(function() {
      $('[data-initialize=combobox]').each(function() {
        var $this = $(this);
        if (!$this.data('fu.combobox')) {
          $this.combobox($this.data());
        }
      });
    });
  }));
})(require('process'));
