function HtmlToClipboard(options) {
    // default settings
    var settings = {
        limitTarget: null,
        listenOnCopy: false,
        raw: false
    };
    
    // use this flag to avoid recursively copying
    var justCopied = false;

    // actual settings
    if (typeof options === "object") {
        for (option in options) {
            settings[option] = options[option];
        }
    }

    if (typeof settings.raw !== "boolean")
        throw "'raw' option must be boolean";
    if (settings.limitTarget && (typeof settings.limitTarget !== "string" && !(settings.limitTarget instanceof HTMLElement)))
        throw "'target' option must be either a selector or a DOM node";


    // find target element either from selector string or from element
    var getTarget = function(limitTarget) {
        var target = limitTarget;
        if (typeof target === "string") {
            var el = document.querySelector(target);
            if (el === null) {
                throw "Element with selector '" + target + "' does not exist in the DOM";
            } else {
                return el;
            }
        } else {
            if (document.contains(target)) {
                return target;
            } else {
                throw "Target element is not present in the DOM";
            }
        }
    };

    // get the current selection, possibly limited to target element
    var getSelection = function (limitTarget) {
        var selection = window.getSelection();

        // limit selection to target
        if (limitTarget) {
            var target = getTarget(limitTarget);
            
            // don't limit the selection in standard inputs
            if (typeof target.selectionStart !== "undefined") {
                return target.value.substring(target.selectionStart, target.selectionEnd);
            }

            for (var i = 0; i < selection.rangeCount; i++) {
                var range = selection.getRangeAt(i);
                var sliceStart = 0;
                var sliceEnd = null;
                if (range.intersectsNode(target)) {
                    var lengthBefore = range.toString().length;
                    range.setStart(target, 0);
                    var lengthAfter = range.toString().length;
                    if (lengthAfter > lengthBefore)
                        sliceStart = lengthAfter - lengthBefore;

                    lengthBefore = range.toString().length;
                    range.setEnd(target, target.childNodes.length);
                    lengthAfter = range.toString().length;
                    if (lengthAfter > lengthBefore)
                        sliceEnd = lengthBefore;
                    else
                        sliceEnd = lengthAfter;

                    return range.toString().substr(sliceStart, sliceEnd);
                }
            }
            return "";
        } else {
            // textarea
            if (typeof document.activeElement.selectionStart !== "undefined") {
                return document.activeElement.value.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);

            // everything else
            } else {
                return selection.toString();
            }
        }
    };


    var copyToClipboard = function (data, raw) {
        if (typeof raw !== "boolean")
            raw = true;

        var tmpEl = document.createElement(raw ? "textarea" : "div");
        tmpEl.style.opacity = 0;
        tmpEl.style.position = "absolute";
        tmpEl.style.pointerEvents = "none";
        tmpEl.style.zIndex = -1;  
        tmpEl.setAttribute('tabindex', '-1'); // so it can be focused
        tmpEl.innerHTML = data;
        document.body.appendChild(tmpEl);

        var focused = document.activeElement;
        tmpEl.focus();

        if (raw) {
            tmpEl.select();
        } else {
            window.getSelection().removeAllRanges();  
            var range = document.createRange(); 
            range.setStartBefore(tmpEl.firstChild);
            range.setEndAfter(tmpEl.lastChild);
            window.getSelection().addRange(range);
        }

        var success = false;
        try {
            justCopied = true;
            setTimeout(function () {
                justCopied = false;
            });
            success = document.execCommand('copy');
        } catch (err) {
            console.error(err);
        }
        if (!success)
            console.error('execCommand failed!');

        window.getSelection().removeAllRanges();  
        document.body.removeChild(tmpEl);

        focused.focus();
    }



    // listen on copy event
    if (settings.listenOnCopy) {
        var eventTarget = document;
        if (settings.limitTarget)
            eventTarget = getTarget(settings.limitTarget);

        var self = this;
        eventTarget.addEventListener('copy', function (e) {
            if (!justCopied) {
                e.preventDefault();
                self.copy();
            }
        });
    }


    this.copy = function(data) {
        if (typeof data !== "string")
            var data = getSelection(settings.limitTarget);

        if (data !== "")
            copyToClipboard(data, settings.raw);
    };
}