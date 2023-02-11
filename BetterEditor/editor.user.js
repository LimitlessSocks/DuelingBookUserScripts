// ==UserScript==
// @name         DuelingBook Custom Editor Expansions
// @namespace    http://limitlesssocks.github.io/
// @version      0.1.2
// @description  Making custom card editing not a pain.
// @author       Sock#3222
// @match        https://www.duelingbook.com/*
// @grant        none
// @updateURL    https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/BetterEditor/editor.user.css
// @license      CC-BY-SA-4.0
// ==/UserScript==

(function () {
    let expanded = false;
    const addExpandedStyleIfNotPresent = () => {
        if(expanded) return;
        $('<style>').text(`

            textarea.desc_txt.expanded {
                /*width: 80%;
                height: 80%;*/
                z-index: 30;
                position: fixed;
                top: 10%;
                left: 10%;
                font-size: 40px;
                line-height: 1em;
            }

        `).appendTo(document.head);
    };
    let load = () => {
        console.log("Loading db-custom-edit.user.js");

        // change background
        //$("#circuit_board").attr("src", CUSTOM_BACKGROUND);

        $.fn.insertIntoTextArea = function(textToInsert) {
            return this.each(function () {
                var txt = $(this);
                var cursorPosStart = txt.prop('selectionStart');
                var cursorPosEnd = txt.prop('selectionEnd');
                var v = txt.val();
                var textBefore = v.substring(0,  cursorPosStart);
                var textAfter  = v.substring(cursorPosEnd, v.length);
                txt.val(textBefore + textToInsert + textAfter);
                txt.prop('selectionStart', cursorPosStart);
                txt.prop('selectionEnd', cursorPosStart + textToInsert.length);
                txt.focus();
            });
        };

        const DOUBLE_CLICK_DELAY = 300;//ms

        for(let desc of $("textarea.desc_txt")) {
            desc = $(desc);
            desc.data("expanded", false);
            let save = {};
            let isClickedRecently = false;
            let clickedRecentlyTimeout = null;
            desc.click(() => {
                let expanded = desc.data("expanded");
                if(expanded) return;
                if(!isClickedRecently) {
                    isClickedRecently = true;
                    clickedRecentlyTimeout = setTimeout(() => {
                        isClickedRecently = false;
                    }, DOUBLE_CLICK_DELAY);
                    return;
                }

                clearTimeout(clickedRecentlyTimeout);
                isClickedRecently = false;

                addExpandedStyleIfNotPresent();

                desc.addClass("expanded");
                save.height = desc.css("height");
                save.width = desc.css("width");
                desc.css("height", "80%");
                desc.css("width", "80%");

                desc.data("expanded", true);
            });
            desc.contextmenu((e) => {
                let expanded = desc.data("expanded");
                if(!expanded) return;

                e.preventDefault();
                desc.removeClass("expanded");
                desc.css(save);

                desc.data("expanded", false);
            });
        }

        document.addEventListener("keydown", (ev) => {
            // console.log(ev.altKey, ev.which);
            // 78 -> N
            // alt+N
            if(ev.altKey && ev.which === 78) {
                console.log("alt+N");
                let cur = $(document.activeElement);
                // console.log("cur:", cur);
                if(cur.length === 0) return;
                let nameEl = cur.parent().find("input.name_txt + .textinput.proxy");
                let name = nameEl.text();
                // console.log("name el:", nameEl);
                // console.log("name to insert:", name);
                cur.insertIntoTextArea(name);
            }
        });
    };
    console.log("ready state?", document.readyState);
    if(document.readyState === "complete") {
        console.log("document already loaded");
        load();
    }
    else {
        window.addEventListener("load", load);
    }
})();
