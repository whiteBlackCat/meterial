/** @preserve jQuery animateNumber plugin v0.0.13
 * (c) 2013, Alexandr Borisov.
 * https://github.com/aishek/jquery-animateNumber
 */

// ['...'] notation using to avoid names minification by Google Closure Compiler
(function ($) {
  // 字符串倒序
  var reverse = function (value) {
    return value.split('').reverse().join('');
  };

  var defaults = {
    numberStep: function (now, tween) {
      var floored_number = Math.floor(now),
        target = $(tween.elem);

      target.text(floored_number);
    }
  };

  var handle = function (tween) {
    var elem = tween.elem;
    if (elem.nodeType && elem.parentNode) {
      var handler = elem._animateNumberSetter;
      if (!handler) {
        handler = defaults.numberStep;
      }
      handler(tween.now, tween);
    }
  };

  if (!$.Tween || !$.Tween.propHooks) {
    $.fx.step.number = handle;
  } else {
    $.Tween.propHooks.number = {
      set: handle
    };
  }

  var extract_number_parts = function (separated_number, group_length) {
    var numbers = separated_number.split('').reverse(),
      number_parts = [],
      current_number_part,
      current_index,
      q;

    for (var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
      current_number_part = '';
      for (q = 0; q < group_length; q++) {
        current_index = i * group_length + q;
        if (current_index === separated_number.length) {
          break;
        }

        current_number_part = current_number_part + numbers[current_index];
      }
      number_parts.push(current_number_part);
    }

    return number_parts;
  };

  var remove_precending_zeros = function (number_parts) {
    var last_index = number_parts.length - 1,
      last = reverse(number_parts[last_index]);

    number_parts[last_index] = reverse(parseInt(last, 10).toString());
    return number_parts;
  };

  $.animateNumber = {
    numberStepFactories: {
      /**
       * Creates numberStep handler, which appends string to floored animated number on each step.
       *
       * @example
       * // will animate to 100 with "1 %", "2 %", "3 %", ...
       * $('#someid').animateNumber({
       *   number: 100,
       *   numberStep: $.animateNumber.numberStepFactories.append(' %')
       * });
       *
       * @params {String} suffix string to append to animated number
       * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
       */
      append: function (suffix) {
        return function (now, tween) {
          var floored_number = Math.floor(now),
            target = $(tween.elem);

          target.prop('number', now).text(floored_number + suffix);
        };
      },

      /**
       * Creates numberStep handler, which format floored numbers by separating them to groups.
       *
       * @example
       * // will animate with 1 ... 217,980 ... 95,217,980 ... 7,095,217,980
       * $('#world-population').animateNumber({
       *    number: 7095217980,
       *    numberStep: $.animateNumber.numberStepFactories.separator(',')
       * });
       * @example
       * // will animate with 1% ... 217,980% ... 95,217,980% ... 7,095,217,980%
       * $('#salesIncrease').animateNumber({
       *   number: 7095217980,
       *   numberStep: $.animateNumber.numberStepFactories.separator(',', 3, '%')
       * });
       *
       * @params {String} [separator=' '] string to separate number groups
       * @params {String} [group_length=3] number group length
       * @params {String} [suffix=''] suffix to append to number
       * @returns {Function} numberStep-compatible function for use in animateNumber's parameters
       */
      separator: function (separator, group_length, suffix) {
        separator = separator || ' ';
        group_length = group_length || 3;
        suffix = suffix || '';

        return function (now, tween) {
          var floored_number = Math.floor(now),
            separated_number = floored_number.toString(),
            target = $(tween.elem);

          if (separated_number.length > group_length) {
            var number_parts = extract_number_parts(separated_number, group_length);

            separated_number = remove_precending_zeros(number_parts).join(separator);
            separated_number = reverse(separated_number);
          }

          target.prop('number', now).text(separated_number + suffix);
        };
      }
    }
  };

  $.fn.animateNumber = function () {
    var options = arguments[0],
      settings = $.extend({}, defaults, options),

      target = $(this),
      args = [settings];

    for (var i = 1, l = arguments.length; i < l; i++) {
      args.push(arguments[i]);
    }

    // needs of custom step function usage
    if (options.numberStep) {
      // assigns custom step functions
      var items = this.each(function () {
        this._animateNumberSetter = options.numberStep;
      });

      // cleanup of custom step functions after animation
      var generic_complete = settings.complete;
      settings.complete = function () {
        items.each(function () {
          delete this._animateNumberSetter;
        });

        if (generic_complete) {
          generic_complete.apply(this, arguments);
        }
      };
    }

    return target.animate.apply(target, args);
  };

}(jQuery));

/**
 * usage: 
 * $(ele).
 * prop('number', 10).  // 起始值
 * animateNumber({
 *   number: 165111,  // 目标值
 *   numberStep:$.animateNumber.numberStepFactories.separator(','),  // 数字分隔符
 *   // $.animateNumber.numberStepFactories.append(' %')
 *   // 自定义:
 *   // numberStep: function(now, tween) {
 *   //   var target = $(tween.elem);
 *   //   target
 *   //   .prop('number', now) // keep current prop value
 *   //   .text(now);
 *   // }
 *   color: 'green',
 *   'font-size': '30px',
 *   easing: 'easeInQuad',
 * });
 */


// 带小数位    
// how many decimal places allows
// var decimal_places = 2;
// var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
// $('#decimals')
//   .animateNumber({
//       number: 5 * decimal_factor,
//       numberStep: function (now, tween) {
//         var floored_number = Math.floor(now) / decimal_factor,
//           target = $(tween.elem);
//         if (decimal_places > 0) {
//           // force decimal places even if they are 0
//           floored_number = floored_number.toFixed(decimal_places);
//           // replace '.' separator with ','
//           floored_number = floored_number.toString().replace('.', ',');
//         }
//         target.text('$' + floored_number);
//       }
//     },
//     20000
//   );



// 倒计时
// 本身没有新功能只是自定义处理
// $('#revese-countdown')
//   .prop('number', 10)
//   .animateNumber({
//       number: 0,
//       numberStep: function (now, tween) {
//         var target = $(tween.elem),
//           rounded_now = Math.round(now);
//         target.text(now === tween.end ? 'Launch!' : rounded_now);
//       }
//     },
//     10000,
//     'linear'
//   );