/**
 * @ignore
 */
define(function(require) {
    /**
     * Button constructor
     *
     * [See example on JSFiddle](http://jsfiddle.net/bizdevfe/yaram3jy/1/)
     * @constructor
     * @param {HTMLElement|jQuery} button 目标元素
     * @param {Object} [options] 参数
     * @param {String} [options.theme] 主题
     * @param {String} [options.label] 文字
     * @param {Boolean} [options.disabled] 是否禁用
     * @param {Function} [options.onClick] 点击回调
     */
    function Button(button, options) {
        if (button instanceof jQuery) {
            if (button.length > 0) {
                button = button[0]; //只取第一个元素
            } else {
                return;
            }
        }

        if (!isButton(button)) {
            return;
        }

        this.main = button;
        this.$main = $(this.main);
        this.options = $.extend({}, options || {});
        this.init(this.options);
    }

    var defaultClass = 'biz-button',
        disableClass = 'biz-button-disable',
        prefix = 'biz-button-';

    Button.prototype = {
        /**
         * 初始化
         * @param {Object} [options] 参数
         * @protected
         */
        init: function(options) {
            this.$main.addClass(defaultClass);
            if (options.theme) {
                this.$main.addClass(prefix + options.theme);
            }

            if (options.label) {
                this.$main.html(options.label);
            }

            if (options.disabled) {
                this.disable();
            }

            if (options.onClick) {
                var self = this;
                this.$main.on('click.bizButton', function(e) {
                    options.onClick.call(self, e);
                });
            }
        },

        /**
         * 激活
         */
        enable: function() {
            this.main.disabled = false;
            this.$main.removeClass(disableClass);
        },

        /**
         * 禁用
         */
        disable: function() {
            this.main.disabled = true;
            this.$main.addClass(disableClass);
        },

        /**
         * 销毁
         */
        destroy: function() {
            this.$main.removeClass(defaultClass + ' ' + disableClass);
            if (this.options.theme) {
                this.$main.removeClass(prefix + this.options.theme);
            }
            this.$main.off('click.bizButton');
        }
    };

    function isButton(elem) {
        return elem.nodeType === 1 && elem.tagName.toLowerCase() === 'button';
    }

    var dataKey = 'bizButton';

    $.extend($.fn, {
        bizButton: function(method, options) {
            var button;
            switch (method) {
                case 'enable':
                    this.each(function() {
                        button = $(this).data(dataKey);
                        if (button) {
                            button.enable();
                        }
                    });
                    break;
                case 'disable':
                    this.each(function() {
                        button = $(this).data(dataKey);
                        if (button) {
                            button.disable();
                        }
                    });
                    break;
                case 'destroy':
                    this.each(function() {
                        button = $(this).data(dataKey);
                        if (button) {
                            button.destroy();
                            $(this).data(dataKey, null);
                        }
                    });
                    break;
                default:
                    this.each(function() {
                        if (!$(this).data(dataKey) && isButton(this)) {
                            $(this).data(dataKey, new Button(this, method));
                        }
                    });
            }

            return this;
        }
    });

    return Button;
});