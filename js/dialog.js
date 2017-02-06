;(function ($) {
    var Dialog = function (config) {
        this.config = {
            buttons: null,
            type: "ok",
            delay: null,
            message: null,
            width: "auto",
            maskOpacity: null,
            animate: null,
            delayCallback: null,
        };
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        } else {
            this.isConfig = true;
        };
        this.body = $("body");
        this.mask = $('<div class="g-dialog-container">');
        this.win = $('<div class="dialog-window">');
        this.winHeader = $('<div class="dialog-header"></div>');
        this.winContent = $('<div class="dialog-content"></div>');
        this.winFooter = $('<div class="dialog-footer">');
        this.create();
    };
    Dialog.zIndex = 10000;
    Dialog.prototype = {
        animate: function () {
            var _this_ = this;
            this.win.css("-webkit-transform", "scale(0,0)");
            setTimeout(function () {
                _this_.win.css("-webkit-transform", "scale(1,1)")
            }, 100);
        },
        create: function () {

            var _this_ = this,
                config = this.config,
                win = this.win,
                mask = this.mask,
                header = this.winHeader,
                content = this.winContent,
                footer = this.winFooter,
                body = this.body;
            Dialog.zIndex++;
            this.mask.css("z-index", Dialog.zIndex);
            if (this.isConfig) {
                win.append(header.addClass("warning"));
                this.animate();
                mask.append(win);
                body.append(mask);
            }
            else {
                header.addClass(config.type);
                win.append(header);
                if (config.message)
                    win.append(content.html(config.message));
                if (config.buttons) {
                    _this_.createButtons(footer, config.buttons);
                    win.append(footer);
                }
                if (config.width != "auto") {
                    win.width(config.width);
                }
                if (config.maskOpacity) {
                    mask.css("backgroundColor", "rgba(0,0,0," + config.maskOpacity + ")");
                }
                if (config.delay && config.delay != 0) {
                    setTimeout(function (e) {
                        _this_.close();
                        if (config.delayCallback) {
                            config.delayCallback();
                        }


                    }, config.delay);
                }
                if (config.animate) {
                    _this_.animate();
                }
                mask.append(win);
                body.append(mask);
            }
            mask.tap(function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this_.close()
            });
        },
        close: function () {
            this.mask.remove();
        },

        createButtons: function (footer, buttons) {
            var _this_ = this;

            $(buttons).each(function () {
                var type = this.type ? " class='" + this.type + "'" : "";

                var btnText = this.text;
                var button = $("<button" + type + ">" + btnText + "</button>");

                var callback = this.callback ? this.callback : null;
                if (callback) {
                    button.tap(function () {
                        var isClose = callback();
                        if (isClose)
                            _this_.close();
                    });
                }
                footer.append(button);

            });
        },


    };
    window.Dialog = Dialog;
    $.dialog = function (config) {
        return new Dialog(config);
    }
})(Zepto);