function cardMenuE() {
	if (!Duelist()) {
		menu_reason = "You are not a duelist";
		return;
	}
	var card = $(this).parent();
	if (card.data("controller") != player1) {
		if (card.data("controller") == player3) {
			updateController(player1, card);
			updateOwner(player1, card);
		}
	}
	if (card == menu_card) {
		menu_reason = "card is menu_card";
		return;
	}
	if (!viewing) {
		if (!isPlayer1(card.data("controller").username)) {
			menu_reason = "You don't control this card";
			return;
		}
		if (isIn(card, player1.main_arr) >= 0) {
			menu_reason = "Card is in the Deck";
			return;
		}
		if (isIn(card, player1.extra_arr) >= 0) {
			menu_reason = "Card is in the Extra Deck";
			return;
		}
	}
	
	if (automatic) {
		cardMenuE2(card);
		return;
	}
	
	var menu = [];
	if (card.data("controller") != player1) {
		if (isIn(card, player1.opponent.grave_arr) >= 0 || isIn(card, player1.opponent.banished_arr) >= 0) {
			if (card.data("cardfront").data("card_type") == "Monster") {
				if (hasAvailableMonsterZones(player1)) {
					menu.push({label:"SS ATK",data:"SS ATK"});
					if (card.data("cardfront").data("monster_color") != "Link") {
						menu.push({label:"SS DEF",data:"SS DEF"});
					}
				}
			}
			if (isIn(card, player1.opponent.grave_arr) >= 0) {
				menu.push({label:"Banish",data:"Banish"});
			}
			else if (!card.data("face_down")) {
				menu.push({label:"To Grave",data:"To GY"});
			}
		}
		if ((viewing == "Opponent's Deck (partial)" || viewing == "Opponent's Deck (Top 3 Cards)" || viewing == "Opponent's Deck (Top 5 Cards)") && isIn(card, player1.opponent.main_arr) >= 0) {
			if (findCard(["Destiny HERO - Dominance", "Flower Cardian Peony with Butterfly", "Goddess Skuld's Oracle", "Millennium Necklace", "SPYRAL GEAR - Drone"])) {
				menu.push({label:"To Top of Deck",data:"To T Deck 2"});
			}
			if (findCard(["Flower Cardian Peony with Butterfly"])) { // eh
				menu.push({label:"To Bottom of Deck",data:"To B Deck 2"});
			}
		}
	}
	else {
		if (currentPhase == "BP" && turn_player.username == username && !card.data("face_down") && isMonster(player1, card)) {
			if (card.data("inATK")) {
				if (countMonsters(player2) > 0) {
					menu.push({label:"Attack",data:"Attack"});
				}
				menu.push({label:"Attack Directly",data:"Attack directly"});
			}
			else {
				switch (card.data("cardfront").data("name")) {
					default:
						if (card.data("cardfront").data("effect").indexOf("This card can attack while in face-up Defense Position") < 0) {
							break;
						}
					case "Elemental HERO Rampart Blaster":
					case "Invoked Cocytus":
					case "Superheavy Samurai Beast Kyubi":
					case "Superheavy Samurai Big Benkei":
					case "Superheavy Samurai General Jade":
					case "Superheavy Samurai Ninja Sarutobi":
					case "Superheavy Samurai Ogre Shutendoji":
					case "Superheavy Samurai Stealth Ninja":
					case "Superheavy Samurai Steam Train King":
					case "Superheavy Samurai Swordmaster Musashi":
					case "Superheavy Samurai Wagon":
					case "Superheavy Samurai Warlord Susanowo":
					case "Total Defense Shogun":
						if (countMonsters(player2) > 0) {
							menu.push({label:"Attack",data:"Attack"});
						}
						menu.push({label:"Attack Directly",data:"Attack directly"});
				}
			}
		}
		if (isIn(card, player1.hand_arr) >= 0) {
			if (hasAvailableSTZones(player1) && card.data("cardfront").data("effect").indexOf("You can Set this card from your hand to your Spell") >= 0) {
				menu.push({label:"Set (To S/T)",data:"Set ST"});
			}
			/*switch (card.data("cardfront").data("name")) {
				case "Artifact Achilleshield":
				case "Artifact Aegis":
				case "Artifact Beagalltach":
				case "Artifact Caduceus":
				case "Artifact Chakram":
				case "Artifact Failnaught":
				case "Artifact Labrys":
				case "Artifact Lancea":
				case "Artifact Mjollnir":
				case "Artifact Moralltach":
				case "Artifact Scythe":
				case "Artifact Vajra":
				case "Primineral Mandstrong":
				case "Silver Sentinel":
				case "Toy Magician":
				   if (hasAvailableSTZones(player1)) {
					   menu.push({label:"Set (To S/T)",data:"Set ST"});
				   }
				   break;
			}*/
			/*if (card.data("cardfront").data("pendulum")) {
				if (links && !player1.s1 || !links && !player1.pendulumLeft) {
					menu.push({label:"Activate Left",data:"Activate Pendulum Left"});
				}
				if (links && !player1.s5 || !links && !player1.pendulumRight) {
					menu.push({label:"Activate Right",data:"Activate Pendulum Right"});
				}
			}*/
			/*if (!links) {
				if (card.data("cardfront").data("pendulum")) {
					if (links && !player1.s1 || !links && !player1.pendulumLeft) {
						menu.push({label:"Activate Left",data:"Activate Pendulum Left"});
					}
					if (links && !player1.s5 || !links && !player1.pendulumRight) {
						menu.push({label:"Activate Right",data:"Activate Pendulum Right"});
					}
				}
			}*/
			/*if (!links) {
				if (card.data("cardfront").data("pendulum")) {
					if (!player1.pendulumLeft) {
						menu.push({label:"Activate Left",data:"Activate Pendulum Left"});
					}
					if (!player1.pendulumRight) {
						menu.push({label:"Activate Right",data:"Activate Pendulum Right"});
					}
				}
			}
			else {
				if (card.data("cardfront").data("pendulum")) {
					if (!player1.s1 || !player1.s5) {
						//menu.push({label:"Activate",data:"Activate Pendulum"});
						menu.push({label:"Activate",data:player1.s1 && !player1.s5 ? "Activate Pendulum Right" : (!player1.s1 && player1.s5 ? "Activate Pendulum Left" : "Activate Pendulum")});
					}
				}
			}*/
			if (card.data("cardfront").data("pendulum")) {
				if (links && (!player1.s1 || !player1.s5)) {
					menu.push({label:"Activate",data:player1.s1 && !player1.s5 ? "Activate Pendulum Right" : (!player1.s1 && player1.s5 ? "Activate Pendulum Left" : "Activate Pendulum")});
				}
				else if (!links) {
					if (!player1.pendulumLeft) {
						menu.push({label:"Activate Left",data:"Activate Pendulum Left"});
					}
					if (!player1.pendulumRight) {
						menu.push({label:"Activate Right",data:"Activate Pendulum Right"});
					}
				}
			}
			if (card.data("cardfront").data("type") != "Field" && card.data("cardfront").data("card_type") != "Monster" && hasAvailableSTZones(player1)) {
				//if (card.data("cardfront").data("card_type") == "Spell" || (card.data("cardfront").data("name") == "Harpie's Feather Storm" && findCard(["Harpie Lady", "Harpie Queen", "Harpie Channeler", "Harpie Dancer"])) || card.data("cardfront").data("card_type") == "Trap" && card.data("cardfront").data("name").indexOf("Magical Musket") == 0 && findCard(["Magical Musket Mastermind Zakiel", "Magical Musketeer Calamity", "Magical Musketeer Caspar", "Magical Musketeer Doc", "Magical Musketeer Kidbrave", "Magical Musketeer Starfire", "Magical Musketeer Wild"])) {
				if (card.data("cardfront").data("card_type") == "Spell") {
					menu.push({label:"Activate",data:"Activate ST"});
				}
				menu.push({label:"Set",data:"Set ST"});
			}
			if (card.data("cardfront").data("type") == "Field" && !player1.fieldSpell) {
				menu.push({label:"Activate",data:"Activate Field Spell"});
				menu.push({label:"Set",data:"Set Field Spell"});
			}
			if (hasAvailableMonsterZones(player1)) {
				if (card.data("cardfront").data("card_type") == "Monster") {
					menu.push({label:"Normal Summon",data:"Normal Summon"});
					menu.push({label:"Set",data:"Set monster"});
				}
				else if (findCard(["Magical Hats"])) {
					menu.push({label:"Set to Monster Zone",data:"Set monster"});
				}
			}
		}
		if (card.data("cardfront").data("monster_color") == "Xyz" && isIn(card, player1.extra_arr) >= 0 && countOverlayOptions(player1) >= 1) {
			menu.push({label:"OL ATK",data:"OL ATK"});
			menu.push({label:"OL DEF",data:"OL DEF"});
		}
		if ((hasAvailableMonsterZones(player1) || links && (!linkLeft || !linkRight) && isIn(card, player1.extra_arr) >= 0) && card.data("cardfront").data("card_type") == "Monster" && !card.data("isXyzMaterial") && !isMonster(player1, card) && !isST(player1, card)) {
			menu.push({label:"S. Summon ATK",data:"SS ATK"});
			if (card.data("cardfront").data("monster_color") != "Link") {
				menu.push({label:"S. Summon DEF",data:"SS DEF"});
			}
		}
		if (isIn(card, player1.grave_arr) >= 0 && hasAvailableMonsterZones(player1)) {
			switch (card.data("cardfront").data("name")) {
				case "First-Aid Squad":
				case "Paleozoic Olenoides":
				case "Paleozoic Hallucigenia":
				case "Paleozoic Canadia":
				case "Paleozoic Pikaia":
				case "Paleozoic Eldonia":
				case "Paleozoic Dinomischus":
				case "Paleozoic Marrella":
				case "Paleozoic Leanchoilia":
				case "The Phantom Knights of Dark Gauntlets":
				case "The Phantom Knights of Shadow Veil":
				case "The Prime Monarch":
					menu.push({label:"SS ATK",data:"SS ATK"});
					menu.push({label:"SS DEF",data:"SS DEF"});
					break;
			}
		}
		if (card.data("cardfront").data("monster_color") == "Token") {
			menu.push({label:"Remove",data:"Remove Token"});
			if (isMonster(player1, card)) {
				if (card.data("inDEF")) {
					menu.push({label:"To ATK",data:"To ATK"});
				}
				else if (card.data("cardfront").data("monster_color") != "Link") {
					menu.push({label:"To DEF",data:"To DEF"});
				}
			}
			//menu.push({label:"Change Control",data:"Change control"});
			menu.push({label:"Move",data:"Move"});
		}
		else {
			if (isST(player1, card) && card.data("face_down")) {
				menu.push({label:"Activate",data:"Activate ST"});
			}
			if (player1.fieldSpell && card[0] == player1.fieldSpell[0] && card.data("face_down")) {
				menu.push({label:"Activate",data:"Activate Field Spell"});
			}
			if (isIn(card, player1.main_arr) >= 0) {
				menu.push({label:"To Hand",data:"To hand"});
				//if (!player1.fieldSpell && card.data("cardfront").data("type") == "Field" && findCard(["Ancient Fairy Dragon", "Demise of the Land", "Dream Mirror Hypnagogia", "Galatea, the Orcust Automaton", "Ghostrick Renovation", "Last Resort", "Metaverse", "Pop-Up", "Triamid Dancer", "Triamid Hunter", "Triamid Master"])) {
				if (!player1.fieldSpell && card.data("cardfront").data("type") == "Field") {
					//menu.push({label:"Activate ",data:"Activate Field Spell"});
					menu.push({label:"Activate",data:"Activate Field Spell"});
				}
			}
			if (isIn(card, player1.grave_arr) < 0 && !card.data("isXyzMaterial")) {
				menu.push({label:"To Graveyard",data:"To GY"});
			}
			if (!card.data("face_down")) {
				//if (isMonster(player1, card) || isST(player1, card) || player1.fieldSpell && card[0] == player1.fieldSpell[0] || player1.pendulumLeft && card[0] == player1.pendulumLeft[0] || player1.pendulumRight && card[0] == player1.pendulumRight[0]) {
				if (isMonster(player1, card) || isST(player1, card) || player1.fieldSpell && card[0] == player1.fieldSpell[0] || player1.pendulumLeft && card[0] == player1.pendulumLeft[0] || player1.pendulumRight && card[0] == player1.pendulumRight[0] || isIn(card, player1.grave_arr) >= 0 || isIn(card, player1.banished_arr) >= 0) {
					menu.push({label:"Declare",data:"Declare"});
				}
			}
			if (!links && card.data("cardfront").data("pendulum") && isIn(card, player1.hand_arr) < 0) {
				if (!player1.pendulumLeft) {
					menu.push({label:"Activate Left",data:"Activate Pendulum Left"});
				}
				if (!player1.pendulumRight) {
					menu.push({label:"Activate Right",data:"Activate Pendulum Right"});
				}
			}
			if (isMonster(player1, card)) {
				if (card.data("inDEF")) {
					if (card.data("face_down")) {
						menu.push({label:"Flip Summon",data:"Flip Summon"});
						menu.push({label:"Flip",data:"Flip"});
					}
					else {
						menu.push({label:"To ATK",data:"To ATK"});
					}
				}
				else if (card.data("cardfront").data("monster_color") != "Link") {
					menu.push({label:"To DEF",data:"To DEF"});
				}
				if (!card.data("face_down") && card.data("cardfront").data("monster_color") != "Link") {
					menu.push({label:"Set",data:"Set monster"});
				}
			}
			if (isST(player1, card) && !card.data("face_down")) {
				menu.push({label:"Set",data:"Set ST"});
			}
			if (player1.fieldSpell && card[0] == player1.fieldSpell[0] && !card.data("face_down")) {
				menu.push({label:"Set",data:"Set Field Spell"});
			}
			if (isIn(card, player1.hand_arr) < 0 && isIn(card, player1.main_arr) < 0 && !isExtraDeckCard(card) && card.data("cardfront").data("monster_color") != "Token" && !card.data("isXyzMaterial")) {
				menu.push({label:"To Hand",data:"To hand"});
			}
			//if (card.data("isXyzMaterial")) {
			//	menu.push({label:"Detach",data:"Detach"});
			//}
			if (isIn(card, player1.banished_arr) < 0) {
				menu.push({label:"Banish",data:"Banish"});
				if (findCard([
					"Black Luster Soldier - Envoy of the Evening Twilight",
					"Blue Duston",
					"Chaos Scepter Blast",
					"Eater of Millions",
					"Elemental HERO Nebula Neos",
					"Evening Twilight Knight",
					"Evenly Matched",
					"Banquet of Millions",
					"Gizmek Orochi, the Serpentron Sky Slasher",
					"Lightforce Sword",
					"Necro Fusion",
					"Network Trap Hole",
					"Number 89: Diablosis the Mind Hacker",
					"PSY-Frame Overload",
					"Small World",
					"Super Koi Koi",
					"Transmission Gear",
					"Treasure Panda",
					"Wind-Up Zenmaintenance",
					"Xyz Override"
				//], true) || isIn(card, player1.main_arr) >= 0 || card.data("face_down")) {
				], true) || isIn(card, player1.main_arr) >= 0 || isIn(card, player1.extra_arr) >= 0 || card.data("face_down")) {
					menu.push({label:"Banish FD",data:"Banish FD"});
				}
			}
			if (player1.opponent == null) {
				player1.opponent = player2; // quick fix
			}
			if (isMonster(player1, card) && hasAvailableMonsterZones(player1.opponent)) {
				//menu.push({label:"Change Control",data:"Change control"});
			}
			if (isExtraDeckCard(card) && isIn(card, player1.extra_arr) < 0) {
				menu.push({label:"To Extra Deck",data:"To ED"});
			}
			//if (card.data("cardfront").data("pendulum") && isIn(card, player1.extra_arr) < 0 && (isMonster(player1, card) || isST(player1, card) || card == player1.pendulumRight || card == player1.pendulumLeft)) {
			if (card.data("cardfront").data("pendulum") && isIn(card, player1.main_arr) < 0 && isIn(card, player1.hand_arr) < 0) { // i think you should be able to return it from the gy to the extra deck
				menu.push({label:"To Extra Deck FU",data:"To ED FU"});
			}
			if (!isExtraDeckCard(card) && isIn(card, player1.main_arr) < 0 && !card.data("isXyzMaterial")) {
				menu.push({label:"To Top of Deck",data:"To T Deck"});
				//if (findEffect("bottom", true, true, true) && isIn(card, player1.extra_arr) < 0 || findCard(["Small World"])) {
				if (findEffect("bottom", true, true, true) && isIn(card, player1.extra_arr) < 0) {
					menu.push({label:"To Bottom of Deck",data:"To B Deck"});
				}
			}
			/*if (card.data("cardfront").data("pendulum") && !card.data("face_down") && (isMonster(player1, card) || isST(player1, card))) {
				if (!links) {
					if (!player1.pendulumRight) {
						menu.push({label:"To P. Right",data:"Activate Pendulum Right"});
					}
					if (!player1.pendulumLeft) {
						menu.push({label:"To P. Left",data:"Activate Pendulum Left"});
					}
				}
				else if (!player1.s1 || !player1.s5) {
					menu.push({label:"Activate Pendulum",data:player1.s1 && !player1.s5 ? "Activate Pendulum Right" : (!player1.s1 && player1.s5 ? "Activate Pendulum Left" : "Activate Pendulum")});
				}
			}*/
			
			
			
			
			
			if (isMonster(player1, card) || isST(player1, card) || (player1.fieldSpell && card[0] == player1.fieldSpell[0]) || (player1.pendulumRight && card[0] == player1.pendulumRight[0]) || (player1.pendulumLeft && card[0] == player1.pendulumLeft[0])) {
				menu.push({label:"Target",data:"Target"});
			}
			
			
			
			if (isMonster(player1, card) || isST(player1, card) || (player1.fieldSpell && card[0] == player1.fieldSpell[0]) && !card.data("face_down")) {
				menu.push({label:"Move",data:"Move"});
			}
			if (isMonster(player1, card) && countOverlayOptions(player1) > 1 && !card.data("face_down")) {
				menu.push({label:"Overlay",data:"Overlay"});
			}
			if ((isIn(card, player1.hand_arr) >= 0 && card.data("cardfront").data("card_type") != "Spell") || isIn(card, player1.main_arr) >= 0 || isIn(card, player1.grave_arr) >= 0) {
				//if (card.data("cardfront").type != "Field" && hasAvailableSTZones(player1)) {
				if (hasAvailableSTZones(player1)) {
					menu.push({label:"To S/T",data:"To ST"});
				}
			}
			if (isIn(card, player1.hand_arr) >= 0) {
				menu.push({label:"Declare",data:"Declare"}); // we'll need to enforce a minimum of v446
			}
			if (isIn(card, player1.hand_arr) >= 0 || isIn(card, player1.extra_arr) >= 0 || isIn(card, player1.main_arr) >= 0 && findCard(["Small World"])) {
				menu.push({label:"Reveal",data:"Reveal"});
			}
			if (!card.data("face_down")) {
				if (isMonster(player1, card)) {
					switch (card.data("cardfront").data("name")) {
						case "Parasite Paracide":
							menu.push({label:"Resolve Effect",data:"To T Deck 2 FU"});
							break;
						case "SPYRAL GEAR - Drone":
							if (player1.opponent.main_arr.length >= 3) {
								menu.push({label:"Look at cards",data:"Spyral event"});
							}
							break;
						case "Destiny HERO - Dominance":
							if (player1.opponent.main_arr.length >= 5) {
								menu.push({label:"Look at opponent cards",data:"Dominance event"});
							}
							break;
						case "Zolga the Prophet":
							if (player1.opponent.main_arr.length >= 1) {
								menu.push({label:"Look at opponent cards",data:"Zolga event"});
							}
							break;
						case "Flower Cardian Peony with Butterfly":
							if (player1.opponent.main_arr.length >= 3) {
								menu.push({label:"Look at cards",data:"Peony event"});
							}
							break;
						case "Aegaion the Sea Castrum":
							if (player1.opponent.extra_arr.length > 0) {
								menu.push({label:"Resolve Effect",data:"Random extra event"});
							}
							break;
						case "Number 78: Number Archive":
							if (player1.extra_arr.length > 0) {
								menu.push({label:"Resolve Effect",data:"Banish random ED card"});
							}
							break;
						case "Kozmo Tincan": // this card requires the remaining cards to go to the GY
						case "Noble Knight Borz": // this card requires the remaining cards to go to the GY
							if (player1.main_arr.length >= 3) {
								menu.push({label:"Resolve Effect",data:"Tincan effect"});
							}
							break;
						case "Crowley, the First Propheseer":
						case "Power Tool Dragon":
						case "Machina Metalcruncher":
							if (player1.main_arr.length >= 3) {
								menu.push({label:"Resolve Effect",data:"Crescent effect"});
							}
							break;
						case "Salamangreat Foxy":
							if (player1.main_arr.length >= 3) {
								menu.push({label:"Banish 3 Cards",data:"Banish top 3 cards"});
							}
							break;
						case "Time Thief Redoer":
							if (player1.opponent.main_arr.length >= 1) {
								menu.push({label:"Resolve Effect",data:"Redoer event"});
							}
							break;
						case "Necroface":
							if (player1.opponent.banished_arr.length >= 1 || player2.opponent.banished_arr.length >= 1) {
								menu.push({label:"Resolve Effect",data:"Necroface event"});
							}
							break;
					}
					if (card.data("cardfront").data("id") == 10190) {
						if (player1.extra_arr.length >= 1) {
							menu.push({label:"Banish Random Card",data:"Banish random ED card 2"});
						}
					}
				}
				if (isST(player1, card)) {
					if (card.data("cardfront").data("name") == "Pot of Desires" && player1.main_arr.length >= 12) {
						menu.push({label:"Banish 10 Cards FD",data:"Banish top 10 cards FD"});
					}
					if (card.data("cardfront").data("name") == "Pot of Extravagance" && countFaceDownExtraDeckCards(player1) >= 3) {
						menu.push({label:"Banish 3 ED Cards FD",data:"Banish 3 random ED cards FD"});
					}
					if (card.data("cardfront").data("name") == "Pot of Extravagance" && countFaceDownExtraDeckCards(player1) >= 6) {
						menu.push({label:"Banish 6 ED Cards FD",data:"Banish 6 random ED cards FD"});
					}
					
					if (card.data("cardfront").data("name") == "Pot of Duality" && player1.main_arr.length >= 3) {
						menu.push({label:"Banish 3 Cards",data:"Banish top 3 cards"});
					}
					if (card.data("cardfront").data("name") == "That Grass Looks Greener" && player1.main_arr.length > player1.opponent.main_arr.length) {
						menu.push({label:"Mill " + String(player1.main_arr.length - player1.opponent.main_arr.length),data:"Mill difference"});
					}
					if (card.data("cardfront").data("name") == "Pharaoh's Treasure") {
						menu.push({label:"To Top of Deck face-up",data:"To T Deck FU"});
					}
					if (card.data("cardfront").data("id") == 11111 && player1.main_arr.length >= 3) {
						//menu.push({label:"Resolve Effect",data:"Crescent effect"});
					}
					if (card.data("cardfront").data("name") == "Spellbook Library of the Crescent" && player1.main_arr.length >= 3) {
						menu.push({label:"Resolve Effect",data:"Crescent effect"});
					}
					if (card.data("cardfront").data("name") == "Bingo Machine, Go!!!" && player1.main_arr.length >= 3) {
						menu.push({label:"Resolve Effect",data:"Crescent effect"});
					}
					if (card.data("cardfront").data("name") == "Exchange") {
						//menu.push({label:"Resolve Effect",data:"Exchange event"});
					}
					if (card.data("cardfront").data("name") == "Goddess Skuld's Oracle" && player2.main_arr.length >= 3) {
						menu.push({label:"Look at cards",data:"Oracle event"});
					}
					if (card.data("cardfront").data("name") == "You're in Danger!" && player1.main_arr.length >= 3) {
						menu.push({label:"Resolve Effect",data:"Page-Flip effect"});
					}
					if (card.data("cardfront").data("name") == "Toon Page-Flip" && player1.main_arr.length >= 3) {
						menu.push({label:"Resolve Effect",data:"Page-Flip effect"});
					}
					if (card.data("cardfront").data("name") == "Ancient Telescope" && player2.main_arr.length >= 1) {
						menu.push({label:"Look at cards",data:"Telescope event"});
					}
					if (card.data("cardfront").data("name") == "Senri Eye") {
						menu.push({label:"Look at cards",data:"Senri event"});
					}
					if (card.data("cardfront").data("name") == "Draw of Fate") {
						menu.push({label:"Resolve Effect",data:"Fate effect"});
					}
					if (card.data("cardfront").data("name") == "Old Mind") {
						menu.push({label:"To Opponent's Hand",data:"To hand 2"});
					}
					if (card.data("cardfront").data("name") == "Transmission Gear" && moderator >= 2) {
						//menu.push({label:"Resolve Effect",data:"Play RPS"});
					}
					if (card.data("cardfront").data("name") == "Fusion Guard") {
						menu.push({label:"Resolve Effect",data:"Banish random Fusion card"});
					}
				}
				if (isIn(card, player1.grave_arr) >= 0 || isMonster(player1, card)) {
					if (card.data("cardfront").data("name") == "Lilith, Lady of Lament") {
						if (player1.main_arr.length >= 3 && hasAvailableSTZones(player1)) {
							menu.push({label:"Resolve Effect",data:"Lilith effect"});
						}
					}
					if (card.data("cardfront").data("name") == "Super Quantal Fairy Alphan") {
						if (player1.main_arr.length >= 3 && hasAvailableSTZones(player1)) {
							menu.push({label:"Resolve Effect",data:"Alphan effect"});
						}
					}
					if (card.data("cardfront").data("name") == "Gizmek Orochi, the Serpentron Sky Slasher") {
						if (player1.main_arr.length >= 8) {
							menu.push({label:"Banish 8 Cards FD",data:"Banish top 8 cards FD"});
						}
					}
				}
				if (card.data("cardfront").data("name") == "Golden Castle of Stromberg" && player1.fieldSpell && card[0] == player1.fieldSpell[0] && player1.main_arr.length >= 10) {
					menu.push({label:"Banish 10 Cards FD",data:"Banish top 10 cards FD"});
				}
				if (card.data("cardfront").data("name") == "Malefic World" && player1.fieldSpell && card[0] == player1.fieldSpell[0] && player1.main_arr.length >= 3) {
					menu.push({label:"Resolve Effect",data:"Crescent effect"});
				}
				if (card.data("cardfront").data("name") == "Cynet Storm" && player1.fieldSpell && card[0] == player1.fieldSpell[0]) {
					menu.push({label:"Resolve Effect", data:"Cynet Storm"});
				}
				if (card.data("cardfront").data("name") == "Prescience" && player1.opponent.main_arr.length > 0) {
					menu.push({label:"Resolve Effect",data:"View top card 2"});
				}
			}
			if (card.data("cardfront").data("type") == "Field" && isIn(card, player1.main_arr) >= 0) {
				if (findCard(["Set Rotation"])) {
					if (player1.fieldSpell == null) {
						menu.push({label:"Set",data:"Set Field Spell"});
					}
					if (player1.opponent.fieldSpell == null) {
						menu.push({label:"Set to other side",data:"Set Field Spell 2"});
					}
				}
				if (findCard(["Dream Mirror Hypnagogia"])) {
					if (player1.opponent.fieldSpell == null) {
						menu.push({label:"Activate to other side",data:"Activate Field Spell 2"});
					}
				}
			}
			if (isIn(card, player1.hand_arr) >= 0 && findCard(["Amazoness Chain Master", "Exchange", "Graceful Tear", "Lullaby of Obedience", "Gold Moon Coin", "Magical Contract Door"]) || isIn(card, player1.banished_arr) >= 0 && findCard(["Gift Exchange"], true, true)) {
				menu.push({label:"To Opponent's Hand",data:"To hand 2"});
			}
			if (findCard(["Jack-In-The-Hand"])) {
				menu.push({label:"To Opponent's Hand",data:"To hand 2"});
			}
			if (card.data("isXyzMaterial")) {
				menu = [];
				menu.push({label:"Detach",data:"Detach"});
				menu.push({label:"Banish",data:"Banish"});
			}
			if ((viewing == "Deck (Picking 3 Cards)" || viewing == "Deck (Picking Card)") && (isIn(card, player1.main_arr) >= 0 || isIn(card, player1.opponent.main_arr) >= 0)) {
				menu = [];
				if (player1.temp_arr.indexOf(card.data("id")) < 0) {
					menu.push({label:"Choose",data:"Choose card"});
				}
			}
			if (player1.skillCard && card[0] == player1.skillCard[0]) {
				menu = [];
				if (card.data("face_down")) {
					menu.push({label:"Activate",data:"Activate Skill"});
				}
				else {
					menu.push({label:"Set",data:"Set Skill"});
					if (card.data("cardfront").data("name") == "Millennium Necklace") {
						menu.push({label:"Look at cards",data:"Necklace event"});
					}
				}
			}
			if (moderator >= 2 && isIn(card, player1.hand_arr) >= 0) {
				menu.push({label:"Swap",data:"Swap"});
			}
		}
	}
	DEBF.newBehavior(card, menu);
showMenu(card, menu);
}