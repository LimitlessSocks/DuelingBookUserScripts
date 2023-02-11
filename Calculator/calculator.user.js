// ==UserScript==
// @name         DuelingBook Calculator
// @namespace    http://limitlesssocks.github.io/
// @version      0.2.1
// @description  A calculator extension
// @author       Sock#3222
// @match        https://www.duelingbook.com/html5
// @grant        none
// @updateURL    https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/Calculator/calculator.user.css
// @license      CC-BY-SA-4.0
// ==/UserScript==

(function () {
    const dbc_log = (...args) => console.log("DBC:", ...args);
    dbc_log("start of code");
    const STATE = {
        expanded: true,
    };
    const USE_NEW_BUTTONS = false;
    const sendMessage = (msg) =>
        Send({
            "action": "Duel",
            "play": "Duel message",
            "message": msg,
            "html": ~~$('#duel .html_cb').is(":checked")
        });

    const sendAlert = (msg) =>
        sendMessage("[DBC]: " + msg);
    // Send({"action":"Duel", "play":"Life points", "amount":amount});

    const oldShowMenu = showMenu;
    const CLOSE_MENU = Symbol("CLOSE_MENU");
    const customOldMenu = function (card, dp) {
        if (!dp) {
            menu_reason = "Menu has no data";
            return;
        }
        // dp.reverse();
        if (TweenMax.isTweening(card)) {
            menu_reason = "Card is currently tweening";
            return;
        }
        if (menu_card && menu_card[0] == card[0]) {
            menu_reason = "Card is menu_card 2";
            return;
        }
        if ($('#overlay').is(":visible")) {
            menu_reason = "overlay is visible";
            return;
        }
        if (!$('#cig1_txt').is(":visible")) {
            menu_reason = "Number of cards in GY is invisible";
            return;
        }
        if (menu_card) {
            if (getRotation(menu_card[0]) == -90 && inBounds(menu)) {
                menu_reason = "Card is rotated";
                return;
            }
            dbc_log("Removing menu from within custom");
            removeCardMenu();
        }
        if (isInYourHand(player1, card)) {
            card.css("top", card.data("controller").handY - 30);
            $('#blue_target').hide();
        }
        if (true || getScale(card[0]) < 0.2) {
            for (var i = 0; i < dp.length; i++) {
                switch (dp[i].label) {
                    case "S. Summon ATK":
                        dp[i].label = "SS ATK";
                        break;
                    case "S. Summon DEF":
                        dp[i].label = "SS DEF";
                        break;
                    case "To Graveyard":
                        dp[i].label = "To Grave";
                        break;
                    case "To Top of Deck":
                        dp[i].label = "To T. Deck";
                        break;
                    case "To Bottom of Deck":
                        dp[i].label = "To B. Deck";
                        break;
                }
            }
        }
        menu_card = card;
        menu.find('#card_menu_content').html("");
        var scale = getScale(card[0]);
        if (scale < 0) {
            scale = -scale;
        }
        var width = 400;
        var height = 580;
        var rotation = getRotation(card[0]);
        if (rotation == 180) {
            rotation = 0;
        }
        if (rotation != 0) {
            width = 580;
            height = 400;
        }
        menu.css("width", width * scale);
        if (width * scale > 100) {
            dbc_log('menu is too wide');
            return;
        }
        var h = 0;
        var menu_height = 14;
        for (var i = 0; i < dp.length ;i++) {
            var option = $('<div class="card_menu_btn"><div class="image"><img src="' +  IMAGES_START + 'svg/card_menu_btn_up.svg" /></div><span class="card_menu_txt">' + dp[i].label + '</span></div>');
            option.data("data", dp[i].data);
            if(dp[i].data === CLOSE_MENU) {
                option.click(removeCardMenu);
                option.css("z-index", 1);
            }
            else {
                option.click(cardMenuClickE);
            }
            option.css("width", width * scale);
            option.css("height", menu_height);
            option.find('.image').css("width", width);
            var optionScaleY = 0.265;
            if (rotation != 0) {
                optionScaleY = 0.18;
            }
            // TweenMax.to(option.find('.image'), 0, {scaleY:optionScaleY, scaleX:scale});
            $('body').append(option);
            var num = 14;
            if (option.find('.card_menu_txt')[0].scrollHeight > 15) {
                h += option.find('.card_menu_txt')[0].scrollHeight / num * menu_height;
                option.css("height", option.find('.card_menu_txt')[0].scrollHeight / num * menu_height);
                // TweenMax.to(option.find('.image'), 0, {scaleY:optionScaleY * option.find('.card_menu_txt')[0].scrollHeight / num, scaleX:scale});
            }
            else {
                h += menu_height;
                option.find('.card_menu_txt').css("white-space", "nowrap");
            }
            addButton(option);
            if (dp[i].label.indexOf("Mill ") >= 0) {
                option.find('img').attr("src", IMAGES_START + "svg/card_menu_btn_up2.svg");
            }
            menu.find('#card_menu_content').append(option);
        }
        $('#viewing').append(menu);
        menu.css("height", h);
        var left = parseInt(card.css("left")) - scale * width / 2;
        var top = parseInt(card.css("top"))// - height * scale / 2 - h;
        if (menu_card.parent()[0] == $('#view > .content')[0]) {
            top += 58 + 32 - $('#view > .content').scrollTop();
            left += 219 + 5;
        }
        var startY = top + menu[0].scrollHeight;
        if (menu[0].scrollHeight > parseInt(card.css("height")) * scale) {
            startY = top + parseInt(card.css("height")) * scale;
        }
        menu.css("top", top);
        // menu.css("top", top + 1); // helps prevent unwanted menuOutE events
        menu.css("left", left);
        applyChange();
    };

    let newShowMenu = function (card, dp) {
        if(dp && STATE.expanded) {
            let aux = [];
            const isInHand = isIn(card, player1.hand_arr) >= 0;
            const inSpellTrapZone = isST(player1, card);
            const isFaceDown = card.data("face_down");
            if (isInHand) {
                if(!player1.fieldSpell) {
                    aux.push({label:"Activate (Field)",data:"Activate Field Spell"});
                    aux.push({label:"Set (Field)",data:"Set Field Spell"});
                }
                if (hasAvailableSTZones(player1)) {
                    aux.push({label:"Set (To S/T)",data:"Set ST"});
                }
                if (player1.opponent.fieldSpell == null) {
                    aux.push({
                        label: "Set (Opp Field)",
                        data: "Set Field Spell 2"
                    });
                    aux.push({
                        label: "Activate (Opp Field)",
                        data: "Activate Field Spell 2"
                    });
                }
            }
            // if(isInHand || inSpellTrapZone) {
            if(inSpellTrapZone) {
                aux.push({label:"To Opponent's Deck",data:"To T Deck 2 FU"});
				aux.push({label:"To Opponent's Hand",data:"To hand 2"});
            }
            aux.push({label:"Banish FD",data:"Banish FD"});

            for(let el of aux) {
                if(dp.some(mdat => mdat.data === el.data)) continue;
                dp.push(el);
            }
        }
        // oldShowMenu(card, dp);
        dp.push({label:"Close",data:CLOSE_MENU});
        customOldMenu(card, dp);
    };
    if(USE_NEW_BUTTONS) {
        window.showMenu = newShowMenu;
    }

    const hues = (max) => {
        let delta = 330 / max;
        let colors = [];
        for(let i = 0; i < max; i++) {
            let h = i * delta;
            colors.push(`hsla(${h}, 100%, 35%, 1.0)`);
        }
        return colors;
    };

    window.applyChange = (card_menu=$("#card_menu"), content=$("#card_menu_content")) => {
        let n = content.children().length;
        let h = hues(n);
        let r = n * 6;
        let ox = r, oy = r;
        // let left = parseFloat($("#card_menu").css("left"));
        // let top = parseFloat($("#card_menu").css("top"));
        card_menu.css({
            // left: left - ox + 5 + "px",
            // top: top + "px",
            overflow: "visible",
        });
        content.css({
            width: "500px",
        });
        // let rowCount = 3;
        // let perRow = Math.ceil(n / rowCount);
        let perRow = 4;
        let rowCount = Math.ceil(n / perRow);
        let height = 50;
        let width = 50;
        let padding = 0;
        dbc_log("ROWCOUNT:", rowCount);
        dbc_log("PERROW:", perRow);
        let totalHeight = rowCount * (height + padding);
        menu.css("height", totalHeight);
        menu.css("top", parseFloat(menu.css("top")) - totalHeight);
        [...content.children()].forEach((child, i) => {
            child = $(child);
            let row = i % perRow;
            let col = Math.floor(i / perRow);
            let dy = col * (width + padding);
            let dx = row * (height + padding);
            // let theta = i / n * Math.PI * 2;
            // let x = Math.cos(theta);
            // let y = Math.sin(theta);
            // let dx = ox + x * r;
            // let dy = oy + y * r;
            child.css({
                top: dy + "px",
                left: dx + "px",
                position: "absolute",
                width: width + "px",
                height: height + "px",
                // backgroundColor: h[i],
            });
            child.find("span").css({
                whiteSpace: "normal"
            });
            // let text = child.find(".card_menu_txt").text();
            // child.empty();
            // child.append($("<div>").text(text));
        });
    };

    if(USE_NEW_BUTTONS) {
        const menuFixInterval = setInterval(
            () => {
                let curTop = parseFloat(menu.css("top"));
                if(curTop < 0) {
                    menu.css("top", 0);
                }
            },
            50
        );
        window.menuFixInterval = menuFixInterval;
        const oldMenuOutE = menuOutE;
        window.menuOutE = (e) => {
            // dbc_log("MENU OUT: ", e);
            dbc_log("MENU OUT");
            //unstun
            return;
        };
        window.menuRollOutE = (e) => {
            dbc_log("MENU ROLL OUT (#card_menu)");
            return;
        };
        $(".card .content:first")
            .off("mouseleave")
            .mouseleave(menuOutE);
        // $("#card_menu")
    }


    const oldDuelResponse = duelResponse;
    const DUEL_RESPONSE_PROMISES = new Map();
    window.duelResponse = function (data) {
        dbc_log("owo", data);
        let toResolve = DUEL_RESPONSE_PROMISES.get(data.play);
        if(toResolve) {
            while(toResolve.length) {
                toResolve.shift()(data);
            }
        }
        oldDuelResponse(data);
    };
    const addPromise = (ev, fn) => {
        if(!DUEL_RESPONSE_PROMISES.has(ev)) {
            DUEL_RESPONSE_PROMISES.set(ev, []);
        }
        DUEL_RESPONSE_PROMISES.get(ev).push(fn);
    };
    const MAX_TIMEOUT = 10000; // 10 seconds
    const waitForDuelResponse = (ev) => new Promise((resolve, reject) => {
        let tid = setTimeout(reject, MAX_TIMEOUT);
        addPromise(ev, (data) => {
            clearTimeout(tid);
            resolve(data);
        });
    });

    const waitDelay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

    const generateRandom = async (n, notify = true) => {
        let data, result, reason;;
        switch(n) {
            case 2:
                coinE();
                data = await waitForDuelResponse("Coin");
                result = data.result == "heads" ? 2 : 1;
                reason = "tails = 1, heads = 2";
                break;
            case 3:
                dieE();
                data = await waitForDuelResponse("Die");
                result = Math.ceil(data.result / 2);
                reason = "roll / 2, rounded up";
                break;
            case 4:
                // two coins
                coinE();
                data = [];
                data[0] = await waitForDuelResponse("Coin");
                setTimeout(coinE, 1000);
                data[1] = await waitForDuelResponse("Coin");
                data = data.map(e => e.result == "heads" ? 1 : 0);
                dbc_log("DATA:", data);
                result = parseInt(data.join(""), 2) + 1;
                reason = "TT=1, TH=2, HT=3, HH=4";
                break;
            case 5:
                dieE();
                data = await waitForDuelResponse("Die");
                result = data.result;
                if(result == 6) {
                    await waitDelay(1000);
                    result = await generateRandom(n, false);
                }
                reason = "roll until not 6";
                break;
            case 6:
                dieE();
                data = await waitForDuelResponse("Die");
                result = data.result;
                reason = "roll";
                break;
        }
        if(reason && notify) {
            sendAlert("Chosen >>" + result + "<< between 1 and " + n + " (" + reason + ")");
        }
        return result;
    };
    window.generateRandom = generateRandom;

    // need to re-attach listeners
    const extraHidden = $("#extra_hidden");
    extraHidden.off("mouseenter");
    window.showExtraDeckMenu = function () {
        if (viewing != null && viewing != "") {
            viewingE(viewing);
            return;
        }
        if (player1.extra_arr.length == 0) {
            return;
        }
        if (!Duelist()) {
            return;
        }
        var menu = [];
        menu.push({label:"View",data:"View ED"});
        if (!solo && !automatic) {
            menu.push({label:"Show",data:"Show ED"});
        }
        if (countFaceDownExtraDeckCards(player1) >= 1) {
            menu.push({label:"Banish random (face-up)",data:"Banish random ED card"});
            // menu.push({label:"Banish random (face-down)",data:"Banish random ED card"});
        }
        showMenu(player1.extra_arr[0], menu);
    };
    extraHidden.on("mouseenter", showExtraDeckMenu);

    const sendAction = (action, param=null) =>
        sendMessage("/" + action + (param === null ? "" : " " + param));

    const gainLifePoints = (lp) =>
        Send({"action":"Duel", "play":"Life points", "amount": lp});
    const loseLifePoints = (lp) =>
        gainLifePoints(-lp);
    const getMyLifePoints = () =>
        parseInt($("#lifepoints1").text());
    const getOppLifePoints = () =>
        parseInt($("#lifepoints2").text());

    const setLifePoints = (v) => {
        let my = getMyLifePoints();
        let diff = v - my;
        gainLifePoints(diff);
    };
    const actionMod = (action, count, mod=10) => {
        if(count != count || count < 1) return;
        sendAction(action, Math.min(count, mod));
        count -= mod;
        setTimeout(actionMod, 1000, action, count, mod);
    };
    const drawCards = (n) => actionMod("draw", n);
    const millCards = (n) => actionMod("mill", n);
    const banishCards = (n) => actionMod("banish", n);
    const banishFdCards = (n) => actionMod("banishfd", n);
    const pause = () => sendAction("pause");
    const discardHand = () => sendAction("discardhand");
    const banishHand = () => sendAction("banishhand");
    const banishEdRandomFd = (n=1) => {
        if(n < 1) return;
        Send({"action":"Duel", "play":"Banish random ED card", "card":"0"});
        n--;
        setTimeout(banishEdRandomFd, 500, n);
    };
    window.banishEdRandomFd=banishEdRandomFd;

    const SHOW_NOTHING = Symbol("DBC.SHOW_NOTHING");
    const NO_RETURN = Symbol("DBC.NO_RETURN");
    const retArg = (f) => (...args) => (f(...args), args[0]);
    const retNone = (f) => (...args) => (f(...args), NO_RETURN);

    let load = () => {
        dbc_log("Loading db-calc.user.js");

        const toggleCalc = $("<button id=toggle-calc>");
        toggleCalc.text("…");

        const calcBody = $("<div id=calc-body></div>");
        const calcInput = $("<input id=calc-input>");
        const calcStream = $("<div id=calc-stream></div>");
        calcBody.append(calcInput);
        calcBody.append(calcStream);


        const SCOPE = {
            clear: () => {
                calcStream.empty();
                return SHOW_NOTHING;
            },
            lp: (v = null) => {
                if(v == null) return getMyLifePoints();
                setLifePoints(v);
                return v;
            },
            rand: (min=null, max=null) =>
                max === null
                    ? min === null
                        ? Math.random()
                        : SCOPE.rand(1, min)
                    : Math.floor(Math.random() * (max - min + 1)) + min,
            my: getMyLifePoints,
            opp: getOppLifePoints,
            gain: retArg(gainLifePoints),
            lose: retArg(loseLifePoints),
            bh: retNone(banishHand),
            banishhand: retNone(banishHand),
            dh: retNone(discardHand),
            discardhand: retNone(discardHand),
            draw: retNone(drawCards),
            mill: retNone(millCards),
            banish: retNone(banishCards),
            banishfd: retNone(banishFdCards),
            pause: retNone(pause),
            reset: resetDeckE,
            banrandfd: retNone(banishEdRandomFd),
            showrand: retNone(generateRandom),
        };
        const calculate = (input) => {
            let result;
            let output = true;
            let outputLine = $("<div class=calc-output-line>");
            try {
                result = math.evaluate(input, SCOPE);
                if(result === SHOW_NOTHING) return;
                if(result === undefined || result === NO_RETURN) {
                    output = false;
                }
                else {
                    SCOPE._ = result;
                }
                if(typeof result === "function") {
                    //TODO:
                    result = "(function)";
                    outputLine.addClass("calc-special");
                }
                outputLine.text(result + "");
            }
            catch(err) {
                let msg = "";
                if(err instanceof TypeError) {
                    if(err.message.startsWith("undefined")) msg = "undefined";
                }
                if(msg) {
                    msg = "=" + msg;
                }
                dbc_log(err, msg);
                outputLine.text("(err" + msg + ")");
                outputLine.addClass("calc-error");
                // calcStream.prepend($("<div class=\"calc-output-line calc-error\">").text("err"));
            }
            if(output) {
                calcStream.prepend(outputLine);
            }
            calcStream.prepend($("<div class=calc-input-line>").text(input));
        };

        $("head").append($("<style>").text(`
            #calc-body * {
                position: static;
            }
            .calc-input-line {
                text-align: left;
            }
            .calc-output-line {
                text-align: right;
                padding-right: 5px;
            }
            .calc-error { color: red; font-style: italic; }
            .calc-special { color: green; font-style: italic; }
            #toggle-calc {
                position: absolute;
                left: 59px;
                top: 546px;
                width: 36px;
                height: 45px;
                cursor: pointer;
                font-size: 20px;
                border-radius: 10px;
                z-index: 30;
                border: 4px solid #1a5;
                padding: 0;
            }
            #toggle-calc.error {
                border: 4px solid #a15;
            }
            #toggle-calc:hover {
                border-color: #3c7;
            }
            #toggle-calc.error:hover {
                border-color: #c37;
            }
            #calc-body {
                position: absolute;
                display: none;
                top: 350px;
                left: 108px;
                width: 320px;
                height: 250px;
                padding: 12px;
                font-size: 18px;
                background: white;
                color: black;
                border: 4px solid #1a5;
                border-radius: 10px;
                user-select: text;
                z-index: 50;
            }
            #calc-input {
                height: 30px;
                width: calc(100% - 10px);
                padding: 5px;
            }
            #calc-stream {
                height: 220px;
                overflow-y: auto;
            }
        `));

        const IS_WORD_REGEX = /\w/;
        $.getScript("https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.4.0/math.js")
        .fail(function (jqxhr, settings, exception) {
            toggleCalc.toggleClass("error");
            toggleCalc.text("✖️");
            calcBody.text("Unable to load extension: " + exception);
            toggleCalc.click(() => {
                calcBody.toggle();
            });
        })
        .done(function (script, textStatus) {
            toggleCalc.text("➕");
            toggleCalc.click(() => {
                calcBody.toggle();
            });
            calcInput.on("keydown", (ev) => {
                if(ev.key == "Enter") {
                    calculate(calcInput.val());
                    calcInput.val("");
                }
                else if(ev.key == "Backspace") {
                    let isControl = ev.originalEvent.ctrlKey;
                    // dbc_log(isControl);
                    // for some reason we need to reimplement the wheel
                    let cursorPosStart = calcInput.prop("selectionStart");
                    let cursorPosEnd = calcInput.prop("selectionEnd");
                    let v = calcInput.val();
                    let textBefore = v.substring(0,  cursorPosStart);
                    let textAfter  = v.substring(cursorPosEnd, v.length);
                    if(cursorPosStart != cursorPosEnd) {
                        v = textBefore + textAfter;
                    }
                    else if(isControl) {
                        let i = textBefore.length - 1;
                        let startWordMatch = IS_WORD_REGEX.test(textBefore[i]);
                        for(; i >= 0; --i) {
                            if(startWordMatch !== IS_WORD_REGEX.test(textBefore[i])) break;
                        }
                        cursorPosStart = i + 1;
                        v = textBefore.slice(0, i + 1) + textAfter;
                    }
                    else {
                        cursorPosStart--;
                        v = textBefore.slice(0, -1) + textAfter;
                    }
                    cursorPosEnd = cursorPosStart;
                    calcInput.val(v);
                    calcInput.prop("selectionStart", cursorPosStart);
                    calcInput.prop("selectionEnd", cursorPosEnd);
                }
            });
        });

        $("#chat_buttons").append(toggleCalc);
        $("#content").append(calcBody);

        document.addEventListener("keydown", (ev) => {
            // dbc_log(ev.altKey, ev.which);
            if(ev.altKey && ev.which === 69) { // alt+e
                STATE.expanded = !STATE.expanded;
            }
        });
        let useIfButton = `
        #card_menu {
            /*background: rgba(0,0,0,0.3);*/
        }
        .card_menu_btn {
            background: rgba(0,155,0,1);
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 12px;
            /*border-radius: 5px;*/
        }
        .card_menu_btn:hover {
            z-index: 90;
            background: rgba(0,255,0,1);
        }
        .card_menu_btn .image {
            display: none;
        }
        .card_menu_btn span {
            display: block;
            position: static;
            margin: 5px;
        }
        `;
        $("<style>")
            .prop("type", "text/css")
            .html(`
            #aswift_0, .skinny-ad {
                display: none !important;
            }
            ` + (USE_NEW_BUTTONS ? useIfButton : ""))
            .appendTo("head");

    };

    if(document.readyState === "complete") {
        dbc_log("document already loaded");
        load();
    }
    else {
        dbc_log("attaching listener");
        window.addEventListener("load", load);
    }
    dbc_log("end of code");
})();
