// ==UserScript==
// @name         DuelingBook Extra Button Functionality
// @namespace    http://limitlesssocks.github.io/
// @version      1.0
// @description  Adds extra buttons to DuelingBook cards based on PSCT
// @author       Sock#3222
// @match        https://www.duelingbook.com/*
// @icon         https://www.google.com/s2/favicons?domain=duelingbook.com
// @grant        none
// ==/UserScript==
// @downloadURL  https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/ExtraButtons/db-extra-buttons.user.js
// @updateURL    https://github.com/LimitlessSocks/DuelingBookUserScripts/raw/main/ExtraButtons/db-extra-buttons.user.js

const DEBF = {
    target: { data(id) {console.log(id)}},
};
window.DEBF = DEBF;

const load = async function() {
    console.log("debf: loaded");
    
    $("head").append($("<style>").text(`
        #expand-dish {
            position: absolute;
            right: 0px;
            bottom: 183.5px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            border-radius: 10px;
            z-index: 30;
            border: 4px solid #15A;
            z-index: 51;
        }
        #expand-dish.minimize {
            position: fixed;
            top: 10px;
            left: 530px;
        }
        #expand-dish:hover {
            border-color: #37C;
        }
        #button-dish * {
            position: static;
        }
        #button-dish h2 {
            margin: 0;
        }
        #button-dish button {
            margin: 3px;
        }
        #button-dish {
            position: fixed;
            display: none;
            top: 10px;
            left: 10px;
            width: 550px;
            height: 250px;
            padding: 12px;
            font-size: 12px;
            background: white;
            color: black;
            border: 4px solid #15A;
            border-radius: 10px;
            user-select: text;
            z-index: 50;
            overflow-y: auto;
        }
        .debf-target {
            filter: brightness(1.5) drop-shadow(0px 0px 30px white);
        }
    `));
    const expandDish = $("<button id=expand-dish>");
    const dish = $("<div id=button-dish>");
    
    const dataList = [
        { header: "Conventional" },
        { label: "Banish FD", data: "Banish FD" },
        { label: "To ED", data: "To ED" },
        { label: "To ED FU", data: "To ED FU" },
        { label: "To deck (Bottom)", data: "To B Deck" },
        { label: "Target", data: "Target" },
        { label: "Randomly add 3 revealed", data: "Crescent effect" },
        
        { header: "Deck" },
        { label: "To Opp's Deck (Top)", data: "To T Deck 2" },
        { label: "To Opp's Deck (Bottom)", data: "To B Deck 2" },
        { label: "To Deck (Top FU)", data: "To T Deck FU" },
        { label: "To Opp's Deck (Top FU)", data: "To T Deck 2 FU" },
        
        { header: "Field Zone" },
        { label: "Place in Field Zone", data: "Activate Field Spell" },
        { label: "Set in Field Zone", data: "Set Field Spell" },
        { label: "Set Field Zone (opponent's)", data: "Set Field Spell 2" },
        { label: "Place Field Zone (opponent's)", data: "Activate Field Spell 2" },
        
        { header: "Spell & Trap Zones" },
        { label: "Activate S/T", data: "Activate ST" },
        { label: "To S/T", data: "To ST" },
        { label: "Set S/T", data: "Set ST" },
        { label: "Set to Monster Zone", data: "Set monster" },
        { label: "Scale left", data: "Activate Pendulum Left" },
        { label: "Scale right", data: "Activate Pendulum Right" },
        
        { header: "Monster Zones" },
        { label: "NS", data: "Normal Summon" },
        { label: "SS ATK", data: "SS ATK" },
        { label: "SS DEF", data: "SS DEF" },
        { label: "Move", data: "Move" },
        
        { header: "Special" },
        { label: "Extrav(3)", data: "Banish 3 random ED cards FD" },
        { label: "Mill difference", data: "Mill difference" },
        { label: "Exchange", data: "Exchange event" },
        
        { header: "Unsorted" },
        { label: "Peek Opp's top 5", data: "Telescope event" },
        // { label: "", data: "Random extra event" },
        // { label: "Banish random FD ED card FU", data: "Banish random ED card 2" },
        
        // unused
        { label: "", data: "Banish" },
        { label: "", data: "To GY" },
        { label: "", data: "Attack" },
        { label: "", data: "Attack directly" },
        { label: "", data: "Activate Pendulum" },
        { label: "", data: "OL ATK" },
        { label: "", data: "OL DEF" },
        { label: "", data: "Remove Token" },
        { label: "", data: "To ATK" },
        { label: "", data: "To DEF" },
        { label: "", data: "Change control" },
        { label: "", data: "To hand" },
        { label: "", data: "Declare" },
        { label: "", data: "Flip Summon" },
        { label: "", data: "Flip" },
        { label: "", data: "Detach" },
        { label: "", data: "To T Deck" },
        { label: "", data: "Overlay" },
        { label: "", data: "To ST" },
        { label: "", data: "Reveal" },
        { label: "", data: "Spyral event" },
        { label: "", data: "Dominance event" },
        { label: "", data: "Zolga event" },
        { label: "", data: "Peony event" },
        { label: "", data: "Banish random ED card" },
        { label: "", data: "Tincan effect" },
        { label: "", data: "Crescent effect" },
        { label: "", data: "Banish top 3 cards" },
        { label: "", data: "Redoer event" },
        { label: "", data: "Necroface event" },
        { label: "", data: "Banish top 10 cards FD" },
        { label: "", data: "Banish 6 random ED cards FD" },
        { label: "", data: "Oracle event" },
        { label: "", data: "Page-Flip effect" },
        { label: "", data: "Senri event" },
        { label: "", data: "Fate effect" },
        { label: "", data: "To hand 2" },
        // { label: "RPS", data: "Play RPS" },
        { label: "", data: "Banish random Fusion card" },
        { label: "", data: "Lilith effect" },
        { label: "", data: "Alphan effect" },
        { label: "", data: "Banish top 8 cards FD" },
        { label: "", data: "Cynet Storm" },
        { label: "", data: "View top card 2" },
        { label: "", data: "Choose card" },
        { label: "", data: "Activate Skill" },
        { label: "", data: "Set Skill" },
        { label: "", data: "Necklace event" },
        { label: "", data: "Swap" },
    ];
    
    const removeOldTarget = () => {
        if(DEBF.target.data("cardfront")) {
            DEBF.target.data("cardfront").removeClass("debf-target");
        }
    };
    
    for(let { label, header, data } of dataList) {
        if(header) {
            let h = $("<h2>");
            h.text(header);
            dish.append(h);
        }
        else if(label) {
            let button = $("<button>");
            button.click(() => {
                cardMenuClicked(DEBF.target, data, null);
                removeOldTarget();
                toggleDish();
            });
            button.text(label);
            dish.append(button);
        }
    }
    
    const toggleDish = () => {
        dish.toggle();
        expandDish.toggleClass("minimize");
    };
    
    expandDish.text("☢️");
    expandDish.click(toggleDish);
    expandDish.keydown(() => {
        // $("#duel input.cin_txt").focus();
    });
    $("#duel").append(expandDish);
    $("#duel").append(dish);
    $("body").click((ev) => {
        console.log(ev);
        console.log("target:", window.target = ev.target);
        let target = ev.target;
        while(target && !target.classList.contains("card")) {
            target = target.parentElement;
        }
        if(!target) {
            return;
        }
        let card = $(target);
        if(!card.is(DEBF.target)) {
            removeOldTarget();
            DEBF.target = card;
            DEBF.target.data("cardfront").addClass("debf-target");
        }
        else {
            DEBF.target.data("cardfront").toggleClass("debf-target");
        }
    });
};

if(document.readyState === "complete") {
    console.log("debf: document already loaded");
    load();
}
else {
    window.addEventListener("load", load);
}