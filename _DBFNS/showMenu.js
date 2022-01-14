function showMenu(card, dp) {
	if (!dp) {
		menu_reason = "Menu has no data";
		return;
	}
	dp.reverse();
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
		removeCardMenu();
	}
	if (isInYourHand(player1, card)) {
		card.css("top", card.data("controller").handY - 30);
		$('#blue_target').hide();
	}
	if (getScale(card[0]) < 0.2) {
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
		console.log('menu is too wide');
		return;
	}
	var h = 0;
	var menu_height = 14;
	for (var i = 0; i < dp.length ;i++) {
		if (automatic && dp[i].label == "Set ST") {
			dp[i].label = "Set";
		}
		var option = $('<div class="card_menu_btn"><div class="image"><img src="' + IMAGES_START + 'svg/card_menu_btn_up.svg" /></div><span class="card_menu_txt">' + dp[i].label + '</span></div>');
		option.data("data", dp[i].data);
		option.click(cardMenuClickE);
		option.css("width", width * scale);
		option.css("height", menu_height);
		option.find('.image').css("width", width);
		if (menu.hasClass("unloaded")) {
			option.find('.image img')[0].onload = function(){
				menu.removeClass("unloaded");
			};
		}
		var optionScaleY = 0.265;
		if (rotation != 0) {
			optionScaleY = 0.18;
		}
		TweenMax.to(option.find('.image'), 0, {scaleY:optionScaleY, scaleX:scale});
		$('body').append(option);
		var num = 14;
		if (option.find('.card_menu_txt')[0].scrollHeight > 15) {
			h += option.find('.card_menu_txt')[0].scrollHeight / num * menu_height;
			option.css("height", option.find('.card_menu_txt')[0].scrollHeight / num * menu_height);
			TweenMax.to(option.find('.image'), 0, {scaleY:optionScaleY * option.find('.card_menu_txt')[0].scrollHeight / num, scaleX:scale});
		}
		else {
			h += menu_height;
			option.find('.card_menu_txt').css("white-space", "nowrap");
		}
		addButton(option);
		switch (dp[i].label) {
			case "Activate ":
			case "Flip Deck":
			case "Turn Top Card FU":
			case "Banish 10 Cards FD":
			case "Banish 3 Cards":
			case "Banish 3 ED Cards FD":
			case "Banish 6 ED Cards FD":
			case "Banish random ED Card":
			case "Banish random ED Card FD":
			case "To Top of Deck face-up":
			case "To Opponent's Deck":
			case "Face-Down":
			case "Mill difference":
			case "Activate to other side":
			case "Set to your side":
			case "Set to other side":
			case "Resolve Effect":
			case "Look at cards":
			case "Set to Monster Zone":
			case "Draw Spell/Trap":
			case "Draw Spellcaster":
			case "Choose":
			case "Banish ED Card FD":
			case "To Opponent's Hand":
			case "Look at opponent cards":
			case "Card of Fate Effect":
			case "Banish Random Card":
			case "Banish 8 Cards FD":
				option.find('img').attr("src", IMAGES_START + "svg/card_menu_btn_up2.svg");
				break;
		}
		if (dp[i].label.indexOf("Mill ") >= 0) {
			option.find('img').attr("src", IMAGES_START + "svg/card_menu_btn_up2.svg");
		}
		menu.find('#card_menu_content').append(option);
	}
	$('#viewing').append(menu);
	
	
	
	
	
	menu.css("height", h);
	var left = parseInt(card.css("left")) - scale * width / 2;
	var top = parseInt(card.css("top")) - height * scale / 2 - h;
	if (menu_card.parent()[0] == $('#view > .content')[0]) {
		top += 58 + 32 - $('#view > .content').scrollTop();
		left += 219 + 5;
	}
	var startY = top + menu[0].scrollHeight;
	if (menu[0].scrollHeight > parseInt(card.css("height")) * scale) {
		startY = top + parseInt(card.css("height")) * scale;
	}
	//menu.css("top", top);
	menu.css("top", top + 1); // helps prevent unwanted menuOutE events
	menu.data("top", top + 1);
	menu.css("left", left);
	TweenMax.set(menu, {"scaleY":1});
	//TweenMax.set(menu, {"scaleY":isMonster(player1, menu_card) ? 2 : 2.5});
	TweenMax.fromTo(menu.find('#card_menu_content'), 0.03 * dp.length, {"top":h}, {"top":0, ease:Linear.easeNone, onComplete:function(){
		var scaleY = 1;
		if (menu[0].getBoundingClientRect().y < -marginTop) {
			scaleY = (menu[0].scrollHeight + menu[0].getBoundingClientRect().y) / menu[0].scrollHeight;
			menu.css("top", top - menu[0].getBoundingClientRect().y);
			TweenMax.set(menu, {"scaleY":scaleY});
		}
	}});
	
	/*if (mobile) {
		var sel = $('<select></select>');
		for (var i = 0; i < dp.length ;i++) {
			sel.append('<option>' + dp[i].label + '</option>');
		}
		sel.insertAfter(menu);
	}*/
}