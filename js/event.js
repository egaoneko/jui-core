jui.define("event", [ "util.base", "jquery" ], function(_, $) {

    var UIEvent = function () {
        var list = [];

        function settingEventAnimation(e) {
            var pfx = ["webkit", "moz", "MS", "o", ""];

            for (var p = 0; p < pfx.length; p++) {
                var type = e.type;

                if (!pfx[p]) type = type.toLowerCase();
                $(e.target).on(pfx[p] + type, e.callback);
            }

            list.push(e);
        }

        function settingEvent(e) {
            if (e.callback && !e.children) {
                $(e.target).on(e.type, e.callback);
            } else {
                $(e.target).on(e.type, e.children, e.callback);
            }

            list.push(e);
        }

        function settingEventTouch(e) {
            if (e.callback && !e.children) {
                $(e.target).on(getEventTouchType(e.type), e.callback);
            } else {
                $(e.target).on(getEventTouchType(e.type), e.children, e.callback);
            }

            list.push(e);
        }

        function getEventTouchType(type) {
            return {
                "click": "touchstart",
                "dblclick": "touchend",
                "mousedown": "touchstart",
                "mousemove": "touchmove",
                "mouseup": "touchend"
            }[type];
        }

        this.add = function (args) {
            var e = {target: args[0], type: args[1]};

            if (_.typeCheck("function", args[2])) {
                e = $.extend(e, {callback: args[2]});
            } else if (_.typeCheck("string", args[2])) {
                e = $.extend(e, {children: args[2], callback: args[3]});
            }

            // �̺�Ʈ ������ �迭�� ����
            var eventTypes = _.typeCheck("array", e.type) ? e.type : [e.type];

            // �̺�Ʈ ������ ���� �̺�Ʈ ����
            for (var i = 0; i < eventTypes.length; i++) {
                e.type = eventTypes[i]

                if (e.type.toLowerCase().indexOf("animation") != -1)
                    settingEventAnimation(e);
                else {
                    // body, window, document ��쿡�� �̺�Ʈ ��ø�� ����
                    if (e.target != "body" && e.target != window && e.target != document) {
                        $(e.target).off(e.type);
                    }

                    if (_.isTouch) {
                        settingEventTouch(e);
                    } else {
                        settingEvent(e);
                    }
                }
            }
        }

        this.trigger = function (selector, type) {
            $(selector).trigger((_.isTouch) ? getEventTouchType(type) : type);
        }

        this.get = function (index) {
            return list[index];
        }

        this.getAll = function () {
            return list;
        }

        this.size = function () {
            return list.length;
        }
    }

    return UIEvent;
});