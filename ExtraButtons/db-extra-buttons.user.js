// ==UserScript==
// @name         DuelingBook Extra Button Functionality
// @namespace    http://limitlesssocks.github.io/
// @version      0.2
// @description  Adds extra buttons to DuelingBook cards based on PSCT
// @author       Sock#3222
// @match        https://www.duelingbook.com/*
// @icon         https://www.google.com/s2/favicons?domain=duelingbook.com
// @grant        none
// @downloadURL  https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/ExtraButtons/db-extra-buttons.user.js
// @updateURL    https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/ExtraButtons/db-extra-buttons.user.js
// ==/UserScript==

const DEBF = {};
window.DEBF = DEBF;
DEBF.pollingRate = 100; // ms
DEBF.waitUntilLoaded = (varname) => new Promise((resolve, reject) => {
    let recur = () => {
        if(typeof window[varname] !== "undefined") {
            resolve();
        }
        else {
            setTimeout(recur, DEBF.pollingRate);
        }
    };
    recur();
});

const load = async function() {
    // ASSUMPTION: showMenu is the last called thing in cardMenuE.
    console.log("DEBF loaded");
    await DEBF.waitUntilLoaded("cardMenuE");
    console.log("cardMenuE defined, overwriting");

    const oldCardMenuE = cardMenuE;

    const hasText = (card, text) =>
        card.data("cardfront").data("effect").search(text) !== -1;

    const addButtonIfNew = (menu, option) => {
        if(menu.some(({ data }) => data === option.data)) {
            return;
        }
        menu.unshift(option);
    };

    const findEffectAdvanced = (fn) => {
        if(typeof fn !== "function") {
            let dat = fn;
            fn = (card) => hasText(card, dat);
        }
        var cards = [player1.m1, player1.m2, player1.m3, player1.m4, player1.m5, player1.s1, player1.s2, player1.s3, player1.s4, player1.s5, player1.pendulumLeft, player1.pendulumRight, player1.fieldSpell, player2.m1, player2.m2, player2.m3, player2.m4, player2.m5, player2.s1, player2.s2, player2.s3, player2.s4, player2.s5, player2.pendulumLeft, player2.pendulumRight, player2.fieldSpell, linkLeft, linkRight, player1.skillCard, player2.skillCard];
        var arr = [player1.hand_arr, player1.grave_arr, player1.banished_arr, player1.opponent.grave_arr, player1.opponent.banished_arr];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                cards.push(arr[i][j]);
            }
        }
        for (let card of cards) {
            if (card && fn(card)) {
                return true;
            }
        }
        return false;
    };

    let newBehavior = (card, menu) => {
        let placeField = false;
        let setField = false;
        let banishFaceDown = false;
        let placeTopOfDeckFU = false;

        // activate/set field checks //
        placeField = placeField || hasText(card, /place (this banished card|this card (you control|from your (\w+))) in your Field/);
        setField = setField || hasText(card, /Set (this banished card|this card (you control|from your (\w+))) to your Field/);

        let placeOrSetField = false;
        placeOrSetField = placeOrSetField || hasText(card, /(place or Set|Set or place) (this banished card|this card from your (\w+)) (in|to) your Field/);

        // banish face-down checks //
        banishFaceDown = banishFaceDown || findEffectAdvanced(card => hasText(card, "face-down") && hasText(card, "banish"), true, true, true);
        
        // top of deck face-up checks //
        placeTopOfDeckFU = placeTopOfDeckFU || findEffectAdvanced(card => (hasText(card, /top of.*Deck/i) || hasText(card, /shuffle.*Deck/i)) && hasText(card, /face-up/), true, true, true);
        
        // various combination checks //
        placeField = placeField || placeOrSetField;
        setField = setField || placeOrSetField;

        // add da buttons //
        if(!player1.fieldSpell && !isMonster(player1, card) && !isST(player1, card)) {
            if(placeField) {
                addButtonIfNew(menu, {label:"Activate to Field Zone",data:"Activate Field Spell"});
            }
            if(setField) {
                addButtonIfNew(menu, {label:"Set to Field Zone",data:"Set Field Spell"});
            }
        }
        if(banishFaceDown) {
            addButtonIfNew(menu, {label:"Banish FD",data:"Banish FD"});
        }
        if(!card.data("face_down") && placeTopOfDeckFU) {
            addButtonIfNew(menu, {label:"To Top of Deck face-up",data:"To T Deck FU"});
            addButtonIfNew(menu, {label:"To Top of opponent's Deck face-up",data:"To T Deck 2 FU"});
        }
    };
    DEBF.newBehavior = newBehavior;

    let body = oldCardMenuE.toString();
    body = body.replace(/showMenu\(card, menu\);/, "DEBF.newBehavior(card, menu);\n$&");
    //console.log(body);

    cardMenuE = eval(body + "; cardMenuE");
};
window.addEventListener("load", load);