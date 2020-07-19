/*
Copyright 2020, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

"use strict";

var LASTAGE_VERSION = '2.0-alpha';

/*
 * This module loads the rules from the Second Edition core rule book.
 * The LastAge function contains methods that load rules for particular
 * parts/chapters of the rule book; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the LastAge rules.  Similarly, the constant fields of
 * LastAge (FEATS, HEROIC_PATHS, etc.) can be manipulated to modify the choices.
 */
function LastAge() {

  if(window.SRD35 == null) {
    alert('The LastAge module requires use of the SRD35 module');
    return;
  }

  if(window.Pathfinder == null || Pathfinder.SRD35_SKILL_MAP == null) {
    LastAge.USE_PATHFINDER = false;
  }
  LastAge.baseRules = LastAge.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Last Age' + (LastAge.USE_PATHFINDER ? ' - PF' : ''), LASTAGE_VERSION);
  LastAge.rules = rules;

  LastAge.CHOICES = LastAge.baseRules.CHOICES.concat(LastAge.CHOICES_ADDED);
  rules.defineChoice('choices', LastAge.CHOICES);
  rules.choiceEditorElements = LastAge.choiceEditorElements;
  rules.choiceRules = LastAge.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = LastAge.randomizeOneAttribute;
  LastAge.RANDOMIZABLE_ATTRIBUTES =
    LastAge.baseRules.RANDOMIZABLE_ATTRIBUTES.concat
    (LastAge.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  delete rules.getChoices('random').deity;
  rules.ruleNotes = LastAge.ruleNotes;

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('preset', 'race', 'heroicPath', 'level', 'levels');

  LastAge.ALIGNMENTS = Object.assign({}, LastAge.baseRules.ALIGNMENTS);
  LastAge.ANIMAL_COMPANIONS = Object.assign(
    {}, LastAge.baseRules.ANIMAL_COMPANIONS, LastAge.ANIMAL_COMPANIONS_ADDED
  );
  LastAge.ARMORS = Object.assign({}, LastAge.baseRules.ARMORS);
  for(var domain in LastAge.DOMAINS) {
    LastAge.DOMAINS[domain] = LastAge.baseRules.DOMAINS[domain];
  }
  LastAge.FAMILIARS = Object.assign({}, LastAge.baseRules.FAMILIARS);
  LastAge.FEATS =
    Object.assign({}, LastAge.baseRules.FEATS, LastAge.FEATS_ADDED);
  LastAge.FEATURES =
    Object.assign({}, LastAge.baseRules.FEATURES, LastAge.FEATURES_ADDED);
  LastAge.GENDERS = Object.assign({}, LastAge.baseRules.GENDERS);
  LastAge.SCHOOLS =
    Object.assign({}, LastAge.baseRules.SCHOOLS, LastAge.SCHOOLS_ADDED);
  LastAge.SHIELDS = Object.assign({}, LastAge.baseRules.SHIELDS);
  LastAge.SKILLS =
    Object.assign({}, LastAge.baseRules.SKILLS, LastAge.SKILLS_ADDED);
  for(var skill in LastAge.SKILLS) {
    LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
  }
  LastAge.SPELLS =
    Object.assign({}, LastAge.baseRules.SPELLS, LastAge.SPELLS_ADDED);
  for(var spell in LastAge.SPELL_SCHOOL_CHANGES) {
    LastAge.SPELLS[spell] +=
      ' School="' + LastAge.SPELL_SCHOOL_CHANGES[spell] + '"';
  }
  LastAge.WEAPONS =
    Object.assign({}, LastAge.baseRules.WEAPONS, LastAge.WEAPONS_ADDED);

  // For spells, schools have to be defined before classes and domains
  // Spell definition is handed by individual classes
  LastAge.magicRules(rules, LastAge.SCHOOLS, []);
  LastAge.abilityRules(rules);
  LastAge.aideRules(rules, LastAge.ANIMAL_COMPANIONS, LastAge.FAMILIARS);
  LastAge.combatRules(rules, LastAge.ARMORS, LastAge.SHIELDS, LastAge.WEAPONS);
  LastAge.identityRules(
    rules, LastAge.ALIGNMENTS, LastAge.CLASSES, LastAge.DEITIES,
    LastAge.DOMAINS, LastAge.GENDERS, LastAge.HEROIC_PATHS, LastAge.RACES
  );
  LastAge.talentRules
    (rules, LastAge.FEATS, LastAge.FEATURES, LastAge.LANGUAGES, LastAge.SKILLS);
  LastAge.goodiesRules(rules);

  if(window.SRD35NPC != null) {
    SRD35NPC.identityRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.talentRules(rules, SRD35NPC.FEATURES);
  }

  Quilvyn.addRuleSet(rules);

}

// By default, add new choices below to those defined by the SRD35 plugin.
// The LastAge function will override with Pathfinder choices if USE_PATHFINDER
// is true.
LastAge.USE_PATHFINDER = false;

LastAge.CHOICES_ADDED = ['Heroic Path'];
LastAge.CHOICES = SRD35.CHOICES.concat(LastAge.CHOICES_ADDED);
LastAge.RANDOMIZABLE_ATTRIBUTES_ADDED = ['heroicPath'];
LastAge.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat(LastAge.RANDOMIZABLE_ATTRIBUTES_ADDED);

LastAge.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
LastAge.ANIMAL_COMPANIONS_ADDED = {
  // Attack, Dam, AC include all modifiers
  'Boro':
    'Str=18 Dex=10 Con=16 Int=2 Wis=11 Cha=5 HD=5 AC=13 Attack=7 Dam=1d8+6 ' +
    'Size=L Level=7',
  'Grass Cat':
    'Str=16 Dex=19 Con=15 Int=2 Wis=12 Cha=6 HD=3 AC=15 Attack=6 ' +
    'Dam=2@1d2+1,1d6+3 Size=M Level=4',
  'Ort':
    'Str=15 Dex=12 Con=14 Int=2 Wis=11 Cha=2 HD=3 AC=14 Attack=4 Dam=1d6+3 ' +
    'Size=M Level=4',
  'Plains Leopard':
    'Str=21 Dex=17 Con=15 Int=2 Wis=12 Cha=6 HD=5 AC=15 Attack=8 ' +
    'Dam=2@1d4+5,1d8+2 Size=L Level=7',
  'River Eel':
    'Str=17 Dex=15 Con=13 Int=2 Wis=12 Cha=2 HD=7 AC=15 Attack=8 Dam=1d8+4 ' +
    'Size=L Level=10',
  'Sea Dragon':
    'Str=26 Dex=13 Con=24 Int=2 Wis=14 Cha=6 HD=12 AC=18 Attack=18 ' +
    'Dam=3d6+8,1d8+4 Size=H Level=13',
  'Wogren':
    'Str=16 Dex=13 Con=14 Int=6 Wis=13 Cha=12 HD=3 AC=16 Attack=6 ' +
    'Dam=2@1d4+1,1d6+3 Size=M'
};
LastAge.ANIMAL_COMPANIONS =
  Object.assign({}, SRD35.ANIMAL_COMPANIONS, LastAge.ANIMAL_COMPANIONS_ADDED);
LastAge.ARMORS = Object.assign({}, SRD35.ARMORS);
LastAge.DEITIES = {
  'None':'',
  'Izrador (NE)':
    'Weapon=Longsword Domain=Death,Destruction,Evil,Magic,War'
};
LastAge.DOMAINS = {
  'Death':SRD35.DOMAINS['Death'],
  'Destruction':SRD35.DOMAINS['Destruction'],
  'Evil':SRD35.DOMAINS['Evil'],
  'Magic':SRD35.DOMAINS['Magic'],
  'War':SRD35.DOMAINS['War']
};
LastAge.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
LastAge.FEATS_ADDED = {
  // MN2E
  'Craft Charm':'Type=Item Creation Require="Sum skills.Craft >= 4"',
    // TODO actually max instead of sum
  'Craft Greater Spell Talisman':
    'Type=Item Creation Require="Sum features.Magecraft >= 1","level >= 12"',
    // TODO any 3 channeling
  'Craft Spell Talisman':
    'Type=Item Creation Require="Sum features.Magecraft >= 1","Sum features.Spellcasting >= 1","level >= 3"',
  'Devastating Mounted Assault':
    'Type=Fighter Require="features.Mounted Combat >= 1","skills.Ride >= 10"',
  'Drive It Deep':'Type=Fighter Require="baseAttack >= 1"',
  'Extra Gift':
    'Type=General Require="levels.Charismatic Channeler >= 4 || levels.Spiritual Channeler >= 4"',
  'Friendly Agent':
    'Type=General Require="alignment =~ /Good/","race =~ /Gnome|Dorn|Erenlander|Sarcosan/"',
  'Giant Fighter':'Type=Fighter Require="Sum features.Weapon Focus >= 1"',
  'Greater Spell Focus (Greater Conjuration)':
    'Type=General Require="features.Spell Focus (Greater Conjuration)',
  'Greater Spell Focus (Greater Evocation)':
    'Type=General Require="features.Spell Focus (Greater Evocation)',
  'Herbalist':'Type=Item Creation Require="skills.Profession (Herbalist) >= 4"',
  'Improvised Weapon':'Type=Fighter',
  'Innate Magic':'Type=General Require="race =~ /Elf|Halfling/"',
  'Inconspicuous':'Type=General',
  'Knife Thrower':'Type=Fighter Require="race =~ /Jungle Elf|Snow Elf/"',
  'Lucky':'Type=General',
  'Magecraft (Charismatic)':'Type=Channeling',
  'Magecraft (Hermetic)':'Type=Channeling',
  'Magecraft (Spiritual)':'Type=Channeling',
  'Magic Hardened':'Type=General Require="race =~ /Dwarf|Dworg|Orc/"',
  'Natural Healer':'Type=General',
  'Orc Slayer':'Type=FighterGeneral',
  'Quickened Donning':'Type=Fighter',
  'Ritual Magic':
    'Type=Channeling Require="Sum features.Magecraft >= 1","Sum features.Spellcasting >= 1"',
  'Sarcosan Pureblood':'Type=General Require="race =~ /Sarcosan/"',
  'Sense Nexus':'Type=General',
  'Spell Focus (Greater Conjuration)':'Type=General Imply="casterLevel >= 1"',
  'Spell Focus (Greater Evocation)':'Type=General Imply="casterLevel >= 1"',
  'Spellcasting (Abjuration)':'Type=Channeling',
  'Spellcasting (Conjuration)':'Type=Channeling',
  'Spellcasting (Divination)':'Type=Channeling',
  'Spellcasting (Enchantment)':'Type=Channeling',
  'Spellcasting (Evocation)':'Type=Channeling',
  'Spellcasting (Illusion)':'Type=Channeling',
  'Spellcasting (Necromancy)':'Type=Channeling',
  'Spellcasting (Transmutation)':'Type=Channeling',
  'Spellcasting (Greater Conjuration)':'Type=Channeling',
  'Spellcasting (Greater Evocation)':'Type=Channeling',
  // Skill Focus (Profession (Soldier)) available to Leader Of Men Fighters
  'Skill Focus':'Profession (Soldier)',
  'Spell Knowledge':'Type=General Require="Sum features.Spellcasting >= 1"',
  'Thick Skull':'Type=General',
  'Warrior Of Shadow':'Type=General Require="charisma >= 12","levels.Legate >= 5"',
  // Legates w/War domain receive Weapon Focus (Longsword)
  'Weapon Focus (Longsword)':'Type=Fighter',
  'Whispering Awareness':'Type=General Require="wisdom >= 15","race =~ /Elf/"',
  // Destiny & Shadow
  'Clear-Eyed':'Type=General Require="race == \'Erenlander\'"',
  'Defiant':'Type=General Require="race == \'Erenlander\'"',
  'Fanatic':'Type=General Require="race == \'Erenlander\'"',
  'Hardy':'Type=General Require="constitution >= 13",features.Endurance',
  'Huntsman':'Type=General Require="skills.Survival >= 5",features.Track',
  'Pikeman':'Type=Fighter',
  'Slow Learner':'Type=General Require="race == \'Erenlander\'"',
  'Stalwart':'Type=General Require="race == \'Erenlander\'",features.Defiant',
  'Stealthy Rider':'Type=General Require="skills.Ride >= 1"',
  // Hammer & Shadow
  'Dwarvencraft':
    'Type=General Require="skills.Craft (Armor) >= 4 || skills.Craft (Blacksmith) >= 4 || skills.Craft (Weapons) >= 4"',
  'Powerful Throw':
    'Type=Fighter Require="strength >= 13","features.Power Attack","features.Weapon Focus (Light Hammer) || features.Weapon Focus (Thowing Axe) || features.Weapon Focus (Urutuk Hatchet)"',
  'Shield Mate':
    'Type=Fighter Require="dexterity >= 13","features.Shield Proficiency (Heavy)"',
  'Touched By Magic':'Type=General Require="race =~ /Dwarf|Orc/"',
  'Trapsmith':'Type=General',
  'Tunnel Fighting':'Type=Fighter',
  // TODO Dwarvencraft Techniques -- probably selectable features
  // Honor & Shadow
  'Born Of Duty':'Type=General Require="alignment =~ /Lawful/","race == \'Dorn\'"',
  'Born Of The Grave':'Type=General Require="alignment !~ /Good/",race == \'Dorn\'"',
  // Sorcery & Shadow
  'Blood-Channeler':
    'Type=General Require="constitution >= 15","Sum features.Magecraft >= 1"',
  'Craft Rune Of Power':
    'Type=Item Creation Require="Sum features.Magecraft >= 1","Sum features.Spellcasting >= 1","level >= 3"',
  'Flexible Recovery':
    'Type=General Require="constitution >= 13","Sum features.Magecraft >= 1"',
  'Improved Flexible Recovery':
    'Type=General Require="constitution >= 15","features.Flexible Recovery","Sum features.Magecraft >= 1"',
  'Knack For Charms':
    'Type=Item Creation Require="skills.Knowledge (Arcana) >= 4","skills.Knowledge (Nature) >= 4"',
  'Living Talisman':
    'Type=General Require="Sum features.Magecraft >= 1","Sum features.Spellcasting >= 1","level >= 5","skills.Knowledge (Arcana) >= 6"',
  'Power Reservoir':'Type=General Require="Sum features.Magecraft >= 1"',
  'Sense Power':'Type=General Require="wisdom >= 15"',
  'Subtle Caster':'Type=General Require="Sum features.Magecraft >= 1"',
  // Star & Shadow
  'Canny Strike':
    'Type=Fighter Require="intelligence >= 13","baseAttack >= 6","features.Clever Fighting","features.Weapon Finesse"',
  'Caste Status':'Type=General',
  'Clever Fighting':'Type=Fighter Require="dexterity >= 13","baseAttack >= 2","features.Weapon Finesse"',
  'Plains Warfare':'Type=Fighter Require="features.Mounted Combat"',
  'Urban Intrigue':
    'Type=General Imply="skills.Gather Information >= 1" Require="race == \'Urban Sarcosan\'","skills.Bluff >= 1"',
  'Well-Aimed Strike':
    'Type=Fighter Require="baseAttack >= 9","features.Canny Strike","features.Clever Fighting","features.Weapon Finesse"',
  // Steel & Shadow
  'Resigned To Death':'Type=General Require="wisdom >= 13"',
  'Whirlwind Charge':'Type=General Require="strength >= 15","baseAttack >= 6","features.Cleave","features.Power Attack"'
};
LastAge.FEATS = Object.assign({}, SRD35.FEATS, LastAge.FEATS_ADDED);
LastAge.FEATURES_ADDED = {
  // Heroic Paths
  'Ability Recovery':'combat:Regain 1 point ability damage/hour',
  'Aid Another':'combat:Aid another as a move action',
  'Aided Combat Bonus':'combat:Aided ally +%V to attack or AC',
  'Ambush':'skill:Allies use self Hide for ambush',
  'Animal Companion':'feature:Special bond/abilities w/up to %V animals',
  'Animal Friend':[
    'combat:Animals DC %V Will save to attack',
    'skill:+4 Handle Animal'
  ],
  'Aquatic Adaptation':
    'skill:Breathe through gills, no underwater pressure damage',
  'Aquatic Ally':"magic:Aquatic <i>Summon Nature's Ally %V</i> %V/day",
  'Aquatic Blindsight':"skill:R%V' Detect creatures in opaque water",
  'Aquatic Emissary':'skill:Speak to all aquatic animals',
  'Assist Allies':'skill:Allies move through water at full speed, share oxygen',
  'Aura Of Courage':"save:Immune fear, +4 to allies w/in 30'",
  'Aura Of Warmth':"magic:R10' Allies +4 Fortitude vs cold",
  'Battle Cry':'combat:+%V hit points after cry %1/day',
  'Bestial Aura':[
    'combat:Turn animals',
    'skill:-10 Handle Animal, no Wild Empathy'
  ],
  'Blindsense':"feature:R30' Other senses detect unseen objects",
  'Blindsight':"feature:R30' Other senses compensate for loss of vision",
  'Blood Of Kings':
    'skill:Daily +%V on charisma skills in Shadow or resistance interactions',
  'Blood Of The Planes':'skill:+%V on charisma skills with outsiders',
  'Bolster Spell':'magic:Add 1 to DC of %V chosen spells',
  'Burst Of Speed':
    'combat:Extra attack or move action for %V rounds %1/day; fatigued afterward',
  'Cold Immunity':'save:No damage from cold, x1.5 damage from fire',
  'Cold Resistance':'save:Ignore first %V points cold damage',
  'Combat Overview':
    "combat:R60' Ally avoid AOO and flat-footed, foe flat-footed %V/day",
  'Coordinated Initiative':"combat:R30' Allies use self initiative %V/day",
  'Damage Reduction':'combat:%V subtracted from damage taken',
  'Death Ward':'save:Immune to negative energy and death effects',
  'Deep Lungs':'skill:Hold breath for %V rounds',
  'Detect Evil':'magic:<i>Detect Evil</i> at will',
  'Detect Outsider':'magic:Detect outsiders at will',
  'Directed Attack':"combat:R30' Ally add 1/2 self base attack 1/day",
  'Disrupting Attack':'combat:Undead %V Will save or destroyed %1/day',
  "Dolphin's Grace":'skill:+8 swim hazards',
  'Dragon Spell Penetration':'magic:+%V checks to overcome spell resistance',
  'Elemental Friend':[
    'combat:Elementals DC %V Will save to attack',
    'skill:+4 Diplomacy (elementals)'
  ],
  'Enhanced Bestial Aura':"feature:R15' Animals act negatively, cannot ride",
  'Extra Reach':"combat:15' reach",
  'Fast Movement':'ability:+%V Speed',
  'Fearsome Charge':"combat:+%V damage, -1 AC for every 10' in charge",
  'Feat Bonus':'feature:+%V General Feats',
  'Ferocity':'combat:Continue fighting below 0 HP',
  'Fey Vision':'magic:Detect %V auras at will',
  'Frightful Presence':
    'magic:Casting panics or shakes foes of lesser level 4d6 rounds (DC %V Will neg)',
  'Frost Weapon':'combat:+d6 cold damage on hit for %V rounds %1/day',
  'Greater Frost Weapon':
    'combat:+d10 cold damage, extra hit die on critical hit',
  'Hide In Plain Sight':'skill:Hide even when observed',
  'Howling Winds':'magic:<i>Commune With Nature</i> (winds) %V/day',
  'Improved Ambush':
    'combat:Allies +2 damage vs. flat-footed foes on surprise and 1st melee rounds',
  'Improved Battle Cry':'combat:+1 attack and damage after cry',
  'Improved Healing':'combat:Regain %V HP/hour',
  'Improved Resist Spells':'save:+%V vs. spells',
  'Improved Retributive Rage':
    'combat:+%V damage next round after suffering %1 damage',
  'Improved Spellcasting':
    'magic:Reduce energy cost of spells from %V chosen schools by 1',
  'Improved Stonecunning':
    "feature:R5' Automatic Search for concealed stone door",
  'Improved Untouchable':
    'combat:No foe AOO from move, standard, and full-round actions',
  'Increased Damage Threshold':'combat:Continue fighting until -%V HP',
  'Indefatigable':'save:Immune %V effects',
  'Inspire Valor':
    "feature:R30' Allies extra attack, +%V fear saves for %1 rounds %2/day",
  'Inspiring Oration':
    "magic:R60' Speech applies spell-like ability to allies %V/day",
  'Intimidating Size':'skill:+%V Intimidate',
  'Ironborn Resilience':'combat:Improved hit die',
  'Joint Attack':
    "combat:R30' Allies attack same foe at +1/participant (max +5) %V/day",
  'Language Savant':
    'skill:Fluent in any language after listening for 10 minutes',
  'Large':'combat:+4 bull rush, disarm, and grapple, -1 AC and attack',
  'Last Stand':
    'combat:1 minute of %V spell resistance, 15 damage reduction, 30 energy resistance; near death afterward %1/day',
  'Lay On Hands':'magic:Harm undead or heal %V HP/day',
  'Leadership':'feature:Attract followers',
  'Luck Of Heroes':'feature:Add %V to any d20 roll 1/day',
  'Magical Darkvision':'feature:See perfectly in any darkness',
  'Master Adventurer':'skill:+%V on three chosen non-charisma skills',
  'Metamagic Aura':"magic:R30' %V others' spells of up to level %1",
  'Miss Chance':'combat:%V% chance of foe miss',
  'Mountain Survival':'skill:+%V Survival (mountains)',
  'Mountaineer':'skill:+%V Balance/+%V Climb/+%V Jump',
  'Natural Armor':'combat:+%V AC',
  'Natural Bond':'skill:Knowledge (Nature) is a class skill/Survival is a class skill/+2 Knowledge (Nature)/+2 Survival',
  'Natural Leader':'feature: +%V Leadership score',
  'Natural Swimmer':"ability:Swim %V' as move action",
  'Nonlethal Damage Reduction':
    'combat:Ignore first %V points of non-lethal damage',
  'Northborn':[
    'save:Immune to non-lethal cold/exposure',
    'skill:+2 Survival (cold)/Wild Empathy (cold natives)'
  ],
  'Obvious':'skill:-4 Hide',
  'Offensive Tactics':
    'combat:+%V to first attack or all damage when using full attack action',
  'One With Nature':'magic:<i>Commune With Nature</i> at will',
  'Painless':[
    'combat:+%V HP',
    'save:+%V vs. pain effects'
  ],
  'Panar Fury':
    'combat:+2 strength and constitution, +1 Will, -1 AC for %V rounds %1/day',
  'Perfect Assault':"combat:R30' Allies threaten critical on any hit 1/day",
  'Persistence':
    'feature:Defensive Roll, Evasion, Slippery Mind, Uncanny Dodge %V/day',
  'Persuasive Speaker':'skill:+%V verbal Cha skills',
  'Plant Friend':[
    'combat:Plants DC %V Will save to attack',
    'skill:+4 Diplomacy (plants)'
  ],
  'Power Words':'magic:DC %2+spell level <i>Word of %V</i> %1/day',
  'Quick Ambush':'skill:Hide allies for ambush in half time',
  'Quickened Counterspelling':'magic:Counterspell as move action 1/round',
  'Rage':
    'combat:+4 strength, +4 constitution, +2 Will, -2 AC for %V rounds %1/day',
  'Rallying Cry':'combat:Allies not flat-footed, +4 vs. surprise %V/day',
  'Resist Elements':'save:%V resistance to acid, cold, electricity, and fire',
  'Retributive Rage':
    'combat:+%V attack next round after suffering double level damage',
  'Righteous Fury':
    'combat:Overcome %V points of evil foe melee damage reduction',
  'Rock Throwing':'combat:Use debris as ranged weapon',
  'Scent':"feature:R30' Detect creatures' presence, track by smell",
  'See Invisible':'feature:See invisible creatures',
  'Seer Sight':'magic:Discern recent history of touched object %V/day',
  'Sense The Dead':"magic:R%V' Detect undead at will",
  'Shadow Jump':"feature:R%V' Move between shadows",
  'Shadow Veil':'skill:+%V Hide',
  'Skill Boost':'skill:+4 to %V chosen skills',
  'Skill Fixation':'skill:Take 10 despite distraction on %V chosen skills',
  'Skilled Warrior':
    'combat:Half penalty from %V choices of Fighting Defensively, Grapple Attack, Non-proficient Weapon, Two-Weapon Fighting',
  'Smite Evil':'combat:+%1 attack, %2 damage vs. evil foe %V/dy',
  'Sniping Ambush':'combat:Reduced Hide penalty for using ranged weapons',
  'Spell Choice':'magic:Use chosen %V spell as spell-like ability 1/day',
  'Spontaneous Spell':'magic:Use any %V spell as spell-like ability 1/day',
  'Stonecunning':
    "skill:+%V Search involving stone or metal, automatic check w/in 10'",
  'Strategic Blow':'combat:Overcome %V points of foe damage reduction',
  'Take Ten':'feature:Take 10 on any d20 roll 1/day',
  'Take Twenty':'feature:Take 20 on any d20 roll 1/day',
  'Telling Blow':"combat:R30' Allies re-roll damage 1/day",
  'Touch Of The Living':'combat:+%V damage vs. undead',
  'Tremorsense':"feature:R30' Detect creatures in contact w/ground",
  'Uncaring Mind':'save:+%V vs. enchantment',
  'Unfettered':'magic:<i>Freedom Of Movement</i> %V rounds/day',
  'Untapped Potential':"magic:R30' Contribute %V points ally spells",
  'Untouchable':'combat:No foe AOO from special attacks',
  'Vicious Assault':'combat:Two claw attacks at %V each',
  'Ward Of Life':'save:Immune to undead %V',
  'Wild Empathy':'skill:+%V Diplomacy (animals)',
  'Wild Shape':'magic:Change into creature of size %V %1/day',
// TODO 'validationNotes.purebloodHeroicPathRace:Requires Race =~ Erenlander'
  // Feats
  'Blood-Channeler':'magic:Dbl spell energy for first two Con points lost',
  'Born Of Duty':
    "magic:R100' Cry shakes undead (DC %V Will neg), Dorn +2 vs fear, enchant 1/day",
  'Born Of The Grave':"magic:R15' <i>Deathwatch</i> at will",
  'Canny Strike':'combat:+%Vd4 finesse weapon damage',
  'Caste Status':'feature:Benefits of caste level',
  'Clear-Eyed':[
    'feature:Half penalty for distance sight, x2 normal vision in dim light on plains',
    'skill:Spot is a class skill'
  ],
  'Clever Fighting':'combat:+%V finesse weapon damage',
  'Craft Charm':'magic:Use Craft to create single-use magic item',
  'Craft Greater Spell Talisman':
    'magic:Talisman reduces spell energy cost of chosen school spells by 1',
  'Craft Rune Of Power':'magic:Imbue rune w/any known spell',
  'Craft Spell Talisman':'magic:Reduces spell energy cost of chosen spell by 1',
  'Defiant':'save:Delay effect of failed Fort, Will save for 1 rd, dbl fail effect',
  'Devastating Mounted Assault':'combat:Full attack after mount moves',
  'Drive It Deep':'combat:Trade up to -%V attack for equal damage bonus',
  'Dwarvencraft':'feature:Know %V Dwarvencraft techniques',
  'Extra Gift':'feature:Use Master Of Two Worlds/Force Of Personality +4 times/day',
  'Fanatic':"combat:+1 attack, divine spell benefit within 60' of Izrador servant",
  'Flexible Recovery':"magic:Recover 1 spell energy per hour's rest",
  'Friendly Agent':
    'skill:+4 Diplomacy (convince allegiance)/+4 Sense Motive (determine allegiance)',
  'Giant Fighter':"combat:+4 AC, double critical range w/in 30' vs. giants",
  'Hardy':'feature:Functional on half food, sleep',
  'Herbalist':'magic:Create herbal concoctions',
  'Huntsman':
    'combat:+1 attack and damage for ea 5 above track DC vs. prey tracked for 5 mi',
  'Improved Flexible Recovery':
    "magic:DC 30 Concentration to recover %V spell energy per hour's meditation",
  'Improvised Weapon':
    'combat:No penalty for improvised weapon/-2 for non-proficient weapon',
  'Inconspicuous':
    'skill:+2 Bluff (shadow)/+2 Diplomacy (shadow)/+2 Hide (shadow)/+2 Sense Motive (shadow)',
  'Innate Magic':'magic:%V %1 spells as at-will innate ability',
  'Knack For Charms':'skill:+4 Craft for charm-making',
  'Knife Thrower':'combat:+1 ranged attack/Quickdraw w/racial knife',
  'Living Talisman':'magic:Chosen spell costs 1 fewer spell energy to cast',
  'Lucky':'save:+1 from luck charms and spells',
  'Magic Hardened':'save:+2 vs. spells',
  'Natural Healer':
    'skill:Successful Heal raises patient to 1 HP/triple normal healing rate',
  'Orc Slayer':[
    'combat:+1 AC and damage vs. orcs and dworgs',
    'skill:-4 Cha skills vs. orcs and dworgs'
  ],
  'Pikeman':'combat:Receive charge as move action',
  'Plains Warfare':[
    'combat:+1 AC when mounted on plains',
    'save:+1 Reflex when mounted on plains',
    'skill:+2 Listen, Spot vs. surprise when mounted on plains'
  ],
  'Power Reservoir':'magic:Store +%V siphoned spell energy points',
  'Powerful Throw':'combat:+10 range, use Str bonus for attack',
  'Quickened Donning':'feature:No penalty for hastened donning',
  'Resigned To Death':'save:+4 vs. fear, fail 1 step less intense',
  'Ritual Magic':'magic:Learn and lead magic rituals',
  'Sarcosan Pureblood':[
    'combat:+2 AC (horsed)',
    'skill:Use Diplomacy w/horses, +2 Cha skills (horses/Sarcosans)'
  ],
  'Sense Nexus':'magic:DC 15 Wis to sense nexus w/in 5 miles',
  'Sense Power':"magic:<i>Detect Magic</i> %V/day, DC 13 Wis check w/in 20'",
  'Shield Mate':
    'combat:Allies +2 AC when self fighting defensively or -2 Combat Expertise',
  'Slow Learner':'feature:Replace later with another feat',
  'Spell Knowledge':'magic:+2 spells',
  'Stalwart':'save:Delay negative HP for 1 rd, dbl heal required',
  'Stealthy Rider':'companion:Mount use rider Hide, Move Silently',
  'Subtle Caster':'skill:+2 Bluff or Sleight Of Hand to disguise spell casting',
  'Thick Skull':'save:DC 10 + damage save to stay at 1 HP',
  'Touched By Magic':[
    'magic:+2 spell energy',
    'save:-2 vs. spells'
  ],
  'Trapsmith':'skill:+2 Craft (Traps)/+2 Disable Device/+2 Search (find traps)',
  'Tunnel Fighting':'combat:No AC or attack penalty when squeezing',
  'Urban Intrigue':
    'skill:Use Gather Information to counter investigation of self, allies',
  'Warrior Of Shadow':'combat:Substitute %V rounds of +%1 damage for Turn Undead use',
  'Well-Aimed Strike':'combat:Canny Strike and Clever Fighting apply to all foes',
  'Whirlwind Charge':'combat:Attack all adjacent foes after charge',
  'Whispering Awareness':'feature:DC 12 Wis to hear Whispering Wood',
  // Classes
  'Adapter':'skill:+%V skill points or %1 additional class skills',
  'Art Of Magic':'magic:+1 character level for max spell level',
  'Astirax Companion':'feature:Special bond/abilities',
  'Confident Effect':'combat:+4 Master of Two Worlds checks',
  'Counterattack':'combat:AOO on foe miss 1/round',
  'Cover Ally':"combat:Take hit for ally w/in 5' 1/round",
  'Defender Abilities':'combat:Counterattack/Cover Ally/Defender Stunning Fist/Devastating Strike/Rapid Strike/Retaliatory Strike/Strike And Hold/Weapon Trap %V/day',
  'Defender Stunning Fist':'combat:Foe %V Fortitude save or stunned',
  'Defensive Mastery':'save:+%V Fortitude/+%V Reflex/+%V Will',
  'Devastating Strike':'combat:Bull Rush stunned opponent as free action w/out foe AOO',
  'Flurry Attack':'combat:Two-weapon off hand penalty reduced by %V',
  'Foe Specialty':'skill:Each day choose a creature type to take 10 on Knowledge checks',
  'Force Of Personality':'magic:Inspire Confidence/Fascination/Fury/Suggestion %V/day',
  'Furious Grapple':'combat:Extra grapple attack at highest attack bonus 1/round',
  'Grappling Training':'combat:Disarm/sunder/trip attacks use grapple check',
  'Greater Confidence':'magic:<i>Break Enchantment</i> 1/5 rounds during Inspire Confidence',
  'Greater Fury':'magic:Ally gains 2d10 hit points/+2 attack/+1 Fortitude save',
  'Hated Foe':"combat:Additional Hunter's Strike vs. Master Hunter creature",
  'Heightened Effect':'combat:+2 level for Master of Two Worlds checks',
  'Hunted By The Shadow':'combat:No surprise by servant of shadow',
  "Hunter's Strike":'combat:x2 damage %V/day',
  'Improved Confidence':'magic:Allies failing enchantment saves affected for half duration; fear reduced',
  'Improved Fury':'magic:+1 Initiative/attack/damage',
  'Improved Woodland Stride':'feature:Normal movement through enchanted terrain',
  'Incredible Resilience':'combat:+%V HP',
  'Incredible Speed':'ability:+%V speed',
  'Insire Confidence':"magic:Allies w/in 60' +4 save vs. enchantment/fear for %V rounds",
  'Inspire Fascination':"magic:%V creatures w/in 120' make %1 DC Will save or enthralled %2 rounds",
  'Inspire Fury':"magic:Allies w/in 60' +1 initiative/attack/damage %V rounds",
  'Instinctive Response':'combat:Re-roll Initiative',
  'Knowledge Specialty':'skill:Each day Choose a Knowledge Skill Focus',
  'Lorebook':'skill:Study 1 minute for knowledge of situation; scan at -10',
  'Magecraft (Charismatic)':'magic:4 spells/%V spell energy points',
  'Magecraft (Hermetic)':'magic:4 spells/%V spell energy points',
  'Magecraft (Spiritual)':'magic:4 spells/%V spell energy points',
  'Mass Suggestion':'magic:<i>Suggestion</i> to %V fascinated creatures',
  'Master Hunter':[
    'combat:+2 or more damage vs. selected creature type(s)',
    'skill:+2 or more Bluff, Listen, Sense Motive, Spot, Survival vs. chosen creature type(s)'
  ],
  'Master Of Two Worlds':'combat:Mastery of Nature/Spirits/The Unnatural %V/day',
  'Masterful Strike':'combat:%V unarmed damage',
  'Mastery Of Nature':'combat:Turn animals/plants',
  'Mastery Of Spirits':'combat:Turn to exorcise spirits',
  'Mastery Of The Unnatural':'combat:Turn constructs/outsiders (double hit die)',
  'Offensive Training':'combat:Stunned foe %V DC save to avoid blinding/deafening',
  'One With The Weapon':'combat:Masterful Strike/Precise Strike/Stunning Fist w/chosen weapon',
  'Overland Stride':'feature:Normal movement while using Survival',
  'Powerful Effect':'combat:+1d6 mastery damage',
  'Precise Effect':'combat:Choose type of creature to affect',
  'Precise Strike':'combat:Overcome %V points of foe damage reduction',
  'Quick Reference':'skill:Reduce Lorebook scan penalty by %V',
  'Quick Stride':'ability:+%V Speed',
  'Rapid Strike':'combat:Extra attack at highest attack bonus 1/round',
  'Retaliatory Strike':'combat:AOO vs. foe that strikes ally 1/round',
  'Sense Dark Magic':[
    'feature:Scent vs. legate/outsider',
    'magic:<i>Detect Magic</i> vs. legate/outsider at will'
  ],
  'Skill Mastery':'skill:+3 on %V chosen skills',
  'Specific Effect':'combat:Choose individuals to affect',
  'Speed Training':'combat:Extra move action each round',
  'Spell Specialty':'skill:Each day choose a spell for +1 DC',
  'Spontaneous Legate Spell':'magic:Cast <i>Inflict</i> in place of known spell',
  'Strike And Hold':'combat:Extra unarmed attack to grab foe',
  'Suggestion':'magic:<i>Suggestion</i> to 1 fascinated creature',
  'Temple Dependency':'magic:Must participate at temple to receive spells',
  'True Aim':"combat:x3 damage on Hunter's Strike",
  'Universal Effect':'combat:Use multiple mastery powers simultaneously',
  'Weapon Trap':'combat:Attack to catch foe weapon for disarm/damage/AOO 1/round',
  'Wilderness Trapfinding':'skill:Search to find/Survival to remove DC 20+ traps',
  'Woodslore':"feature:Automatic Search vs. trap/concealed door w/in 5'",
  // Races
  'Alert Senses':'skill:+2 Listen/+2 Spot',
  'Bound To The Beast':'feature:Mounted Combat',
  'Bound To The Spirit':'feature:Magecraft (Spiritual)',
  'Brotherhood':'combat:+1 attack when fighting alongside 4+ Dorns',
  'Cold Fortitude':'save:+5 cold, half nonlethal damage',
  'Deep Lungs':'skill:Hold breath for %V rounds',
  'Dextrous':'skill:+2 Craft (non-metal or wood)',
  'Dodge Orcs':'combat:+1 AC vs. orc',
  'Dorn Ability Adjustment':'ability:+2 strength/-2 intelligence',
  'Dwarf Ability Adjustment':'ability:+2 constitution/-2 charisma',
  'Dwarf Favored Enemy':'combat:+1 attack vs. orc',
  'Dwarf Favored Weapon':'combat:+1 attack with axes and hammers',
  'Dwarrow Ability Adjustment':'ability:+2 charisma',
  'Dworg Ability Adjustment':
    'ability:+2 strength/+2 constitution/-2 intelligence/-2 charisma',
  'Dworg Favored Enemy':'combat:+2 attack vs. orc',
  'Elf Ability Adjustment':'ability:+2 dexterity/-2 constitution',
  'Elfling Ability Adjustment':
    'ability:+4 dexterity/-2 strength/-2 constitution',
  'Erenlander Ability Adjustment':'ability:+2 choice/-2 choice',
  'Favored Region':
    'skill:%V; Knowledge (Local) is a class skill, +2 Survival (region)/Knowledge (Nature) (region)',
  'Fierce':'combat:+1 attack w/two-handed weapons',
  'Fortunate':'save:+1 Fortitude/+2 Reflex/+2 Will',
  'Gifted Healer':'skill:+2 Heal',
  'Gnome Ability Adjustment':'ability:+4 charisma/-2 strength',
  'Graceful':'skill:+2 Climb/+2 Jump/+2 Move Silently/+2 Tumble',
  'Halfling Ability Adjustment':'ability:+2 dexterity/-2 strength',
  'Heartlander':'skill:+4 chosen Craft or Profession',
  'Illiteracy':'skill:Must spend 2 skill points to read and write',
  'Improved Cold Fortitude':'save:Immune non-lethal/half lethal',
  'Improved Innate Magic':'magic:+1 Innate Magic spell',
  'Improved Keen Senses':'skill:+2 Listen/+2 Search/+2 Spot',
  'Improved Natural Channeler':'magic:+1 spell energy',
  'Improved Natural Swimmer':
    'skill:+8 special action or avoid hazard/always take 10/run',
  'Improved Tree Climber':'skill:+2 Balance (trees)/Climb (trees)',
  'Interactive':'skill:+2 Bluff/+2 Diplomacy/+2 Sense Motive',
  'Keen Senses':'skill:+2 Listen/+2 Search/+2 Spot',
  'Know Depth':'feature:Intuit approximate depth underground',
  'Light Sensitivity':'combat:-1 attack in daylight',
  'Minor Light Sensitivity':
    'combat:DC 15 Fortitude save in sunlight to avoid -1 attack',
  'Natural Channeler':'magic:+2 spell energy',
  'Natural Horseman':[
    'combat:+1 melee damage (horseback), half ranged penalty (horseback)',
    'skill:+4 Concentration (horseback)/+4 Handle Animal (horse)/+4 Ride (horse)'
  ],
  'Natural Mountaineer':[
    'ability:Unimpeded movement in mountainous terrain',
    'skill:+2 Climb'
  ],
  'Natural Preditor':'skill:+%V Intimidate',
  'Natural Riverfolk':
    'skill:+2 Perform/+2 Profession (Sailor)/+2 Swim/+2 Use Rope',
  'Natural Sailor':'skill:+2 Craft (ship)/Profession (ship)/Use Rope (ship)',
  'Natural Swimmer':'ability:%V swim as move action',
  'Natural Trader':
    'skill:+4 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading',
  'Night Fighter':'combat:+1 attack in darkness',
  'Nimble':'skill:+2 Climb/+2Hide',
  'Orc Ability Adjustment':'ability:+4 strength/-2 intelligence/-2 charisma',
  'Orc Favored Enemy':'combat:+1 damage vs. dwarves',
  'Orc Frenzy':'combat:+1 attack when fighting among 10+ Orcs',
  'Quick':[
    'combat:+1 attack w/light weapons',
    'save:+1 Reflex'
  ],
  'Resilient':'combat:+2 AC',
  'Resist Enchantment':'save:+2 vs. enchantments',
  'Resist Poison':'save:+2 vs. poison',
  'Resist Spells':'magic:-2 Spell Energy',
  'Resist Spells':'save:+2 vs. spells',
  'Robust':'save:+1 Fortitude',
  'Rugged':'save:+2 Fortitude/+2 Reflex/+2 Will',
  'Sarcosan Ability Adjustment':'ability:+2 charisma/+2 intelligence/-2 wisdom',
  'Skilled Rider':
    'skill:+2 Concentration (wogrenback)/+2 Handle Animal (wogren)/Ride (wogren)',
  'Skilled Trader':
    'skill:+2 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling/trading',
  'Spirit Foe':[
    'save:+2 vs. outsiders',
    'skill:+4 Hide (nature)/Move Silently (nature)'
  ],
  'Stability':'save:+4 vs. Bull Rush and Trip',
  'Stone Knowledge':'skill:+2 Appraise (stone, metal)/Craft (stone, metal)',
  'Stonecunning':"skill:+%V Search (stone, metal), automatic check w/in 10'",
  'Stout':'feature:Endurance/Toughness',
  'Studious':'feature:Magecraft (Hermetic)',
  'Sturdy':'combat:+1 AC',
  'Tree Climber':'skill:+4 Balance (trees)/Climb (trees)',
  'Unafraid':'save:+2 vs. fear',
  'Urban':
    'skill:+2 Gather Information (urban), untrained Knowledge use in urban areas'
};
LastAge.FEATURES = Object.assign({}, SRD35.FEATURES, LastAge.FEATURES_ADDED);
LastAge.GENDERS = Object.assign({}, SRD35.GENDERS);
LastAge.HEROIC_PATHS = {
  'None':'',
  'Beast':
    'Features=' +
      '"1:Vicious Assault","1:Wild Sense","2:Bestial Aura",7:Rage,' +
      '"12:Enhanced Bestial Aura" ' +
    'Selectables=' +
      '"Constitution Bonus","Dexterity Bonus","Low-Light Vision",Scent,' +
      '"Strength Bonus","Wisdom Bonus" ' +
    'Spells=' +
      '"3:Magic Fang","4:Bear\'s Endurance","8:Greater Magic Fang",' +
      '"9:Cat\'s Grace","13:Magic Fang","14:Bull\'s Strength",' +
      '"17:Greater Magic Fang","19:Freedom Of Movement"',
  'Chanceborn':
    'Features=' +
      '"1:Luck Of Heroes",3:Unfettered,"4:Miss Chance",6:Persistence,' +
      '"9:Take Ten","19:Take Twenty" ' +
    'Spells=' +
      '2:Persistence,"7:True Strike",12:Aid,17:Prayer',
  'Charismatic':
    'Features=' +
      '"4:Inspiring Oration","5:Charisma Bonus",6:Leadership,' +
      '"12:Natural Leader" ' +
    'Spells=' +
      '"1:Charm Person","2:Remove Fear",3:Hypnotism,7:Aid,"8:Daze Monster",' +
     '11:Heroism,"13:Charm Monster",16:Suggestion,"17:Greater Heroism"',
  'Dragonblooded':
    'Features=' +
      '"1:Bolster Spell","4:Quickened Counterspelling",' +
      '"6:Improved Spellcasting","9:Dragon Spell Penetration",' +
      '"19:Frightful Presence"',
  'Earthbonded':
    'Features=' +
      '1:Darkvision,"3:Natural Armor",4:Stonecunning,' +
      '"8:Improved Stonecunning",12:Tremorsense,16:Blindsense,' +
      '20:Blindsight ' +
    'Spells=' +
      '"2:Hold Portal","5:Soften Earth And Stone","6:Make Whole",' +
      '"7:Spike Stones","9:Stone Shape","11:Meld Into Stone",' +
      '"13:Transmute Rock To Mud",14:Stoneskin,"15:Move Earth",' +
      '"17:Stone Tell",19:Earthquake',
  'Faithful':
    'Features=' +
      '"4:Turn Undead" ' +
    'Spells=' +
      '1:Bless,"2:Protection From Evil","3:Divine Favor",6:Aid,' +
      '"7:Bless Weapon",8:Consecrate,11:Daylight,' +
      '"12:Magic Circle Against Evil",13:Prayer,"16:Holy Smite",' +
      '"17:Dispel Evil","18:Holy Aura"',
  'Fellhunter':
    'Features=' +
      '"1:Sense The Dead","2:Touch Of The Living","3:Ward Of Life",' +
      '"5:Disrupting Attack"',
  'Feyblooded':
    'Features=' +
      '"1:Low-Light Vision","7:Fey Vision" ' +
    'Selectables=' +
      '"Armor Class Bonus","Dexterity Bonus","Fortitude Bonus",' +
      '"Reflex Bonus","Will Bonus" ' +
    'Spells=' +
      '"2:Disguise Self",3:Ventriloquism,"5:Magic Aura",6:Invisibility,' +
      '9:Nondetection,10:Glibness,"11:Deep Slumber","14:False Vision",' +
      '"15:Rainbow Pattern",17:Mislead,18:Seeming',
  'Giantblooded':
    'Features=' +
      '1:Obvious,"2:Rock Throwing","3:Intimidating Size","4:Fast Movement",' +
      '"5:Strength Bonus","8:Fearsome Charge",10:Large,"20:Extra Reach"',
  'Guardian':
    'Features=' +
      '"1:Inspire Valor","2:Detect Evil","3:Righteous Fury","4:Smite Evil",' +
      '"5:Constitution Bonus","6:Lay On Hands","12:Aura Of Courage",' +
      '"16:Death Ward"',
  'Healer':
    'Features= ' +
    'Spells=' +
      '"1:Cure Light Wounds","2:Lesser Restoration","3:Cure Light Wounds",' +
      '"4:Cure Moderate Wounds","5:Remove Disease","6:Cure Moderate Wounds",' +
      '"7:Cure Serious Wounds","8:Remove Blindness/Deafness",' +
      '"9:Cure Serious Wounds","10:Cure Critical Wounds",' +
      '"11:Neutralize Poison","12:Cure Critical Wounds",' +
      '"13:Mass Cure Light Wounds",14:Restoration,' +
      '"15:Mass Cure Light Wounds",16:Heal,17:Restoration,18:Heal,' +
      '19:Regenerate,"20:Raise Dead"',
  'Ironborn':
    'Features=' +
      '"1:Ironborn Resilience","2:Fortitude Bonus","3:Natural Armor",' +
      '"4:Improved Healing","5:Damage Reduction","6:Resist Elements",' +
      '9:Indefatigable,"14:Ability Recovery"',
  'Jack-Of-All-Trades':
    'Features=' +
      '"1:Spell Choice","2:Spontaneous Spell","3:Skill Boost","7:Feat Bonus" ' +
    'Selectables=' +
      '"Charisma Bonus","Constitution Bonus","Dexterity Bonus",' +
      '"Intelligence Bonus","Strength Bonus","Wisdom Bonus"',
  'Mountainborn':
    'Features=' +
      '1:Mountaineer,"1:Mountain Survival",3:Ambush,"4:Rallying Cry",' +
      '"5:Constitution Bonus","8:Improved Ambush","13:Quick Ambush",' +
      '"18:Sniping Ambush" ' +
    'Spells=' +
      '"2:Endure Elements","7:Pass Without Trace","12:Meld Into Stone",' +
      '"17:Stone Tell"',
  'Naturefriend':
    'Features=' +
      '"1:Natural Bond","1:Wild Empathy","5:Animal Friend","10:Plant Friend",' +
      '"15:Elemental Friend","20:One With Nature" ' +
    'Spells=' +
      '"2:Calm Animals",3:Entangle,"4:Obscuring Mist","6:Animal Messenger",' +
      '"7:Wood Shape","8:Gust Of Wind","9:Speak With Animals",' +
      '"11:Speak With Plants","12:Call Lightning","13:Dominate Animal",' +
      '"14:Spike Growth","16:Sleet Storm","17:Summon Nature\'s Ally IV",' +
      '"18:Command Plants","19:Ice Storm"',
  'Northblooded':
    'Features=' +
      '1:Northborn,"1:Wild Empathy","2:Cold Resistance","3:Battle Cry",' +
      '"4:Howling Winds","5:Constitution Bonus","6:Aura Of Warmth",' +
      '"11:Improved Battle Cry","13:Frost Weapon","16:Cold Immunity",' +
      '"18:Greater Frost Weapon"',
  'Painless':
    'Features=' +
      '1:Painless,"2:Nonlethal Damage Reduction","3:Uncaring Mind",' +
      '"4:Retributive Rage",5:Ferocity,"9:Last Stand",' +
      '"10:Increased Damage Threshold","14:Improved Retributive Rage"',
  'Pureblood':
    'Features=' +
      '"1:Master Adventurer","2:Blood Of Kings","3:Feat Bonus",' +
      '"4:Skill Fixation" ' +
    'Selectables=' +
      '"Charisma Bonus","Constitution Bonus","Dexterity Bonus",' +
      '"Intelligence Bonus","Strength Bonus","Wisdom Bonus"',
  'Quickened':
    'Features=' +
      '"1:Initiative Bonus","2:Armor Class Bonus","3:Fast Movement",' +
      '"4:Burst Of Speed","5:Dexterity Bonus"',
  'Seaborn':
    'Features=' +
      '"1:Dolphin\'s Grace","1:Natural Swimmer","2:Deep Lungs",' +
      '"3:Aquatic Blindsight","4:Aquatic Ally","10:Aquatic Adaptation",' +
      '"14:Cold Resistance","17:Aquatic Emissary","18:Assist Allies" ' +
    'Spells=' +
      '"4:Summon Nature\'s Ally II",5:Blur,"8:Summon Nature\'s Ally III",' +
      '"9:Fog Cloud","12:Summon Nature\'s Ally IV",13:Displacement,' +
      '"16:Summon Nature\'s Ally V","20:Summon Nature\'s Ally VI"',
  'Seer':
    'Features=' +
      '"3:Seer Sight" ' +
    'Spells=' +
      '1:Alarm,2:Augury,4:Clairaudience/Clairvoyance,"5:Locate Object",' +
      '"7:Locate Creature","8:Speak With Dead",10:Divination,11:Scrying,' +
      '"13:Arcane Eye","14:Find The Path","16:Prying Eyes","17:Legend Lore",' +
      '19:Commune,20:Vision',
  'Speaker':
    'Features=' +
      '"2:Persuasive Speaker","3:Power Words","5:Charisma Bonus",' +
      '"14:Language Savant" ' +
    'Spells=' +
      '"1:Comprehend Languages","4:Whispering Wind",8:Tongues,12:Shout,' +
      '"18:Greater Shout"',
  'Spellsoul':
    'Features=' +
      '"1:Untapped Potential","2:Metamagic Aura","3:Improved Resist Spells"',
  'Shadow Walker':
    'Features=' +
      '1:Darkvision,"2:Shadow Veil","4:Shadow Jump","11:Hide In Plain Sight" ' +
    'Spells=' +
      '"3:Expeditious Retreat",5:Blur,"7:Undetectable Alignment",' +
      '9:Displacement,"13:Expeditious Retreat",15:Blur,' +
      '"17:Undetectable Alignment",19:Displacement',
  'Steelblooded':
    'Features=' +
      '"2:Offensive Tactics","3:Strategic Blow","4:Skilled Warrior",' +
      '14:Untouchable,"19:Improved Untouchable"',
  'Sunderborn':
    'Features=' +
      '"1:Detect Outsider","2:Blood Of The Planes","4:Planar Fury",' +
      '7:Darkvision,"13:Magical Darkvision","19:See Invisible" ' +
    'Spells=' +
      '"3:Summon Monster I","6:Summon Monster II","9:Summon Monster III",' +
      '"12:Summon Monster IV","15:Summon Monster V","18:Summon Monster VI"',
  'Tactician':
    'Features=' +
      '"1:Aid Another","2:Combat Overview","3:Coordinated Initiative",' +
      '"4:Joint Attack","5:Aided Combat Bonus","13:Directed Attack",' +
      '"18:Telling Blow","20:Perfect Assault"',
  'Warg':
    'Features=' +
      '"1:Wild Empathy","2:Animal Companion","5:Wild Shape",13:Ferocity,' +
      '20:Blindsense ' +
    'Selectables=' +
      '"Low-Light Vision",Scent ' +
    'Spells=' +
      '"4:Charm Animal","7:Speak With Animals","12:Charm Animal",' +
      '"17:Speak With Animals"'
};
LastAge.LANGUAGES = {
  'Black Tongue':
    '',
  'Clan Dwarven':
    '',
  'Colonial':
    '',
  'Courtier':
    '',
  'Erenlander':
    '',
  'Halfling':
    '',
  'High Elven':
    '',
  'Jungle Mouth':
    '',
  'Norther':
    '',
  'Old Dwarven':
    '',
  'Orcish':
    '',
  'Patrol Sign':
    '',
  'Sylvan':
    '',
  "Trader's Tongue":
    ''
};
LastAge.RACES = {
  'Agrarian Halfling':
    'Features=' +
      '"Alert Senses",Fortunate,Graceful,"Halfling Ability Adjustment",' +
      '"Innate Magic","Low-Light Vision",Slow,Small,"Resist Fear",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Dextrous Hands","Gifted Healer"',
  'Clan Dwarf':
    'Features=' +
      'Darkvision,"Dwarf Ability Adjustment","Dwarf Favored Enemy",' +
      '"Dwarf Favored Weapon","Resist Poison",Resilient,Slow,"Resist Spells",' +
      '"Stone Knowledge","Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",'+
      '"Dodge Orcs","Know Depth,Stability,Stonecunning',
  'Clan-Raised Dwarrow':
    'Features=' +
      'Darkvision,"Dwarrow Ability Adjustment","Resist Poison",Small,Slow,' +
      '"Resist Spells",Sturdy,' +
      '"Dodge Orcs",Stonecunning,"Stone Knowledge",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)"',
  'Clan-Raised Dworg':
    'Features=' +
      'Darkvision,"Dworg Ability Adjustment","Dworg Favored Enemy",' +
      '"Minor Light Sensitivity",Rugged,"Resist Spells",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      'Stonecunning',
  'Danisil-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",Fortunate,"Gifted Healer","Innate Magic",' +
      '"Keen Senses","Low-Light Vision",Nimble,Small,' +
      '"Weapon Familiarity (Atharak/Sepi)"',
  'Dorn':
    'Features=' +
      'Brotherhood,"Cold Fortitude","Dorn Ability Adjustment",Fierce,Robust,' +
      '"Weapon Familiarity (Bastard Sword/Dornish Horse Spear)"',
  'Erenlander':
    'Features=' +
      '"Erenlander Ability Adjustment",Heartlander,' +
      '"Weapon Familiarity (Bastard Sword/Cedeku/Dornish Horse Spear/Sarcosan Lance)"',
  'Gnome':
    'Features=' +
      '"Deep Lungs","Gnome Ability Adjustment","Low-Light Vision",' +
      '"Natural Riverfolk","Natural Swimmer","Natural Trader",Robust,Slow,' +
      'Small,"Resist Spells","Weapon Familiarity (Hand Crossbow)"',
  'Gnome-Raised Dwarrow':
    'Features=' +
      'Darkvision,"Dwarrow Ability Adjustment","Resist Poison",Small,Slow,' +
      '"Resist Spells",Sturdy,' +
      '"Deep Lungs","Natural Riverfolk","Natural Swimmer","Skilled Trader",' +
      '"Weapon Familiarity (Hand Crossbow/Inutek)"',
  'Halfling-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",Fortunate,"Gifted Healer","Innate Magic",' +
      '"Keen Senses","Low-Light Vision",Nimble,Small,' +
      '"Bound To The Beast","Weapon Familiarity (Atharak/Halfling Lance)"',
  'Jungle Elf':
    'Features=' +
      '"Elf Ability Adjustment","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment",' +
      '"Tree Climber",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)" ' +
      '"Improved Innate Magic","Improved Keen Senses","Improved Tree Climber",'+
      '"Spirit Foe","Weapon Familiarity (Sepi)"',
  'Kurgun Dwarf':
    'Features=' +
      'Darkvision,"Dwarf Ability Adjustment","Dwarf Favored Enemy",' +
      '"Dwarf Favored Weapon","Resist Poison",Resilient,Slow,"Resist Spells",' +
      '"Stone Knowledge","Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",'+
      '"Natural Mountaineer","Weapon Familiarity (Urutuk Hatchet)"',
  'Kurgun-Raised Dwarrow':
    'Features=' +
      'Darkvision,"Dwarrow Ability Adjustment","Resist Poison",Small,Slow,' +
      '"Resist Spells",Sturdy,' +
      '"Dodge Orcs","Natural Mountaineer","Stone Knowledge"',
  'Kurgun-Raised Dworg':
    'Features=' +
      'Darkvision,"Dworg Ability Adjustment","Dworg Favored Enemy",' +
      '"Minor Light Sensitivity",Rugged,"Resist Spells",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      '"Natural Mountaineer"',
  'Nomadic Halfling':
    'Features=' +
      '"Alert Senses",Fortunate,Graceful,"Halfling Ability Adjustment",' +
      '"Innate Magic","Low-Light Vision",Slow,Small,"Resist Fear",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Focused Rider","Skilled Rider"',
  'Orc':
    'Features=' +
      'Darkvision,"Improved Cold Fortitude","Light Sensitivity",' +
      '"Natural Predator","Night Fighter","Orc Ability Adjustment",' +
      '"Orc Favored Enemy","Orc Frenzy","Resist Spells",' +
      '"Weapon Familiarity (Vardatch)"',
  'Plains Sarcosan':
    'Features=' +
      'Quick,"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      '"Natural Horseman"',
  'Sea Elf':
    'Features=' +
      '"Elf Ability Adjustment","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment",' +
      '"Tree Climber",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)" ' +
      '"Deep Lungs","Improved Natural Swimmer","Natural Sailor",' +
      '"Natural Swimmer","Weapon Familiarity (Net)",' +
      '"Weapon Proficiency (Guisarme/Ranseur/Tident)"',
  'Snow Elf':
    'Features=' +
      '"Elf Ability Adjustment","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment",' +
      '"Tree Climber",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)" ' +
       '"Cold Fortitude",Robust,"Weapon Familiarity (Fighting Knife)"',
  'Urban Sarcosan':
    'Features=' +
      'Quick,"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      'Interactive,Urban',
  'Wood Elf':
    'Features=' +
      '"Elf Ability Adjustment","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment",' +
      '"Tree Climber",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)" ' +
      '"Improved Innate Magic","Improved Natural Channeler",' +
      '"Weapon Proficiency (Longsword/Short Sword)"'
};
LastAge.SCHOOLS_ADDED = {
  'Greater Conjuration':
    '',
  'Greater Evocation':
    ''
};
LastAge.SCHOOLS = Object.assign({}, SRD35.SCHOOLS, LastAge.SCHOOLS_ADDED);
LastAge.SHIELDS = Object.assign({}, SRD35.SHIELDS);
LastAge.SKILLS_ADDED = {
  'Knowledge (Local)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Shadow) (bureaucracy)"',
  'Knowledge (Nature)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Spirits)"',
  'Knowledge (Old Gods)':'Ability=intelligence Untrained=n',
  'Knowledge (Shadow)':'Ability=intelligence Untrained=n',
  'Knowledge (Spirits)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Nature)"',
  // Profession (Soldier) available to Leader Of Men Fighters
  'Profession (Soldier)':'Ability=wisdom Untrained=n'
};
LastAge.SKILLS = Object.assign({}, SRD35.SKILLS, LastAge.SKILLS_ADDED);
for(var skill in LastAge.SKILLS) {
  LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
}
LastAge.SPELLS_ADDED = {
  'Charm Repair':
    'School=Transmutation ' +
    'Description="Touched minor/lesser charm restored to use"',
  'Detect Astirax':
    'School=Divination ' +
    'Description="R$RL\' quarter circle Info on astiraxes for $L10 min"',
  'Disguise Ally':
    'School=Illusion ' +
    'Description="Change touched appearance/+10 disguise for $L10 min (Will disbelieve)"',
  'Disguise Weapon':
    'School=Illusion ' +
    'Description="$L touched weapons look benign for $L hours"',
  'Far Whisper':
    'School=Divination ' +
    'Description="+4 checks to hear Whispering Wood w/in $L10 miles for $L min"',
  'Greenshield':
    'School=Illusion ' +
    'Description="Touched surrounded by 30\' foliage sphere for $L hr"',
  'Halfling Burrow':
    'School=Transmutation ' +
    'Description="Hidden hole holds $L small creatures for $L hr"',
  'Lifetrap':
    'School=Transmutation ' +
    'Description="R$RM\' Undead in 50\' radius tangled for $L rd, 3d6 HP (Ref neg)"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Description="R$RS Plants/animals in 30\' radius reveal creatures"',
  'Nexus Fuel':
    'School=Necromancy ' +
    'Description="Sacrifice boosts nexus recovery rate"',
  'Silver Blood':
    'School=Transmutation ' +
    'Description="Caster\'s blood damages astiraxes for 1 hr"',
  'Silver Storm':
    'School=Transmutation ' +
    'Description="R$RS\' Targets in cone ${Lmin15}d4 HP silver needle (Ref half)"',
  'Silver Wind':
    'School=Conjuration ' +
    'Description="R$RM\' Targets in 20\' circle d6/rd for $L rd (Will neg)"',
  'Stone Soup':
    'School=Transmutation ' +
    'Description="Buried stone creates broth"',
  // Sorcery and Shadow
  'Arcane Impotence':
    'School=Abjuration ' +
    'Description="R$RM\' Target Channeler must use $Ldiv2 spell energy to cast w/in $L rd (Will $Ldiv2 rd)"',
  'Arcane Interference':
    'School=Abjuration ' +
    'Description="Spells require added $Ldiv2 energy to affect 10\' radius of touched for $L min (Will neg)"',
  'Assist':
    'School=Enchantment ' +
    'Description="R$RS\' Targets in 30\' radius +2 skill checks for conc + 1 rd"',
  'Bestow Spell':
    'School=Evocation ' +
    'Description="Touched convey spell (Will neg)"',
  'Bleed Power':
    'School="Greater Evocation" ' +
    'Description="Successful foe attack on self causes 1d6 HP to attacker for $L10 min"',
  'Boil Blood':
    'School=Transmutation ' +
    'Description="R$RS\' Target 1d8 HP for conc + 1 rd (Fort half)"',
  'Burial':
    'School=Transmutation ' +
    'Description="R$RS\' Earth swallows target non-living, unattended object"',
  'Channel Might':
    'School=Evocation ' +
    'Description="Touched next hit does maximum+$L HP w/in $L rd (Will neg)"',
  'Confer Power':
    'School=Transmutation ' +
    'Description="Transfer spell energy to nearby casters for $L rd"',
  'Fell Forbiddance':
    'School=Abjuration ' +
    'Description="R$RS\' Target ${lvl*25}\' sq area impassible to undead for $L min (Will neg for intelligent)"',
  'Fey Fire':
    'School=Conjuration ' +
    'Description="Touched point invisible 5\' radius fire that warms and heals 1 HP for $L hr"',
  'Fey Hearth':
    'School=Abjuration ' +
    'Description="R$RS\' Creatures in 30\' radius of target fire +2 Will saves, heal 1.5xlevel HP for as long as fire lasts"',
  'Greater Questing Bird':
    'School=Conjuration ' +
    'Description="Self temporarily learn spell le level 6"',
  'Inspiration':
    'School=Enchantment ' +
    'Description="Touched +10 one Craft check"',
  'Inspirational Might':
    'School=Enchantment ' +
    'Description="R$RS\' 4 allies in 30\' radius +2d10 HP, +2 attack, +1 Fortitude save for $Ldiv2 rd"',
  'Joyful Speech':
    'School=Enchantment ' +
    'Description="R$RM\' Listeners in 30\' radius improve reaction, unshaken, +4 vs. fear for $L rd (Will neg)"',
  'Know The Name':
    'School=Divination ' +
    'Description="Discover name(s) of touched (Will neg)"',
  'Lie':
    'School=Transmutation ' +
    'Description="+10 Bluff on next lie"',
  'Magic Circle Against Shadow':
    'School=Abjuration ' +
    'Description="10\' radius from touched +2 AC/+2 saves/extra save vs. mental control/no contact vs. Izrador agents for $L10 min (Will neg)"',
  'Memorial':
    'School=Divination ' +
    'Description="Touched $L10\' radius replays previous/next $L min to next passerby"',
  'Pacify':
    'School=Abjuration ' +
    'Description="R$RS\' ${Math.floor(lvl/3) + 1} targets cannot attack for $Ldiv2 rd (Will neg)"',
  "Peasant's Rest":
    'School=Conjuration ' +
    'Description="Touched gets 8 hrs rest from 4 hrs sleep"',
  'Phantom Edge':
    'School=Transmutation ' +
    'Description="Touched weapon different type for $L min (Will neg)"',
  'Questing Bird':
    'School=Conjuration ' +
    'Description="Self temporarily learn spell le level 3"',
  "Scryer's Mark":
    'School=Divination ' +
    'Description="Touched -4 Will vs. scrying (Will neg)"',
  'Speak With Fell':
    'School=Necromancy ' +
    'Description="R$RS\' Compel 3 correct answers from target fell w/in $L min (Will neg)"',
  'Weather':
    'School=Conjuration ' +
    'Description="R$RM\' 60\' radius, 30\' high cylinder of rain or snow"',
  'Willful Stand':
    'School=Abjuration ' +
    'Description="R$RM\' Target cannot attack self or enter threat space for conc (Will neg)"',
  'Withering Speech':
    'School=Enchantment ' +
    'Description="R$RS\' Target 1 Wis, 1 Cha damage/min for conc"',
  'Woeful Speech':
    'School=Enchantment ' +
    'Description="R$RM\' Listeners in 30\' radius shaken, -4 vs. fear for $L rd (Will neg)"',
};
LastAge.SPELLS = Object.assign({}, SRD35.SPELLS, LastAge.SPELLS_ADDED);
LastAge.SPELL_SCHOOL_CHANGES = {
  // SRD spells placed in Greater Conjuration/Evocation
  'Burning Hands':'Greater Evocation',
  'Call Lightning':'Greater Evocation',
  'Call Lightning Storm':'Greater Evocation',
  'Chain Lightning':'Greater Evocation',
  'Clenched Fist':'Greater Evocation',
  'Cone Of Cold':'Greater Evocation',
  'Creeping Doom':'Greater Conjuration',
  'Crushing Hand':'Greater Evocation',
  'Delayed Blast Fireball':'Greater Evocation',
  'Earthquake':'Greater Evocation',
  'Elemental Swarm':'Greater Conjuration',
  'Fire Shield':'Greater Evocation',
  'Fire Storm':'Greater Evocation',
  'Fireball':'Greater Evocation',
  'Flame Blade':'Greater Evocation',
  'Flame Strike':'Greater Evocation',
  'Flaming Sphere':'Greater Evocation',
  'Floating Disk':'Greater Evocation',
  'Forcecage':'Greater Evocation',
  'Forceful Hand':'Greater Evocation',
  'Freezing Sphere':'Greater Evocation',
  'Gate':'Greater Conjuration',
  'Grasping Hand':'Greater Evocation',
  'Greater Planar Binding':'Greater Conjuration',
  'Gust Of Wind':'Greater Evocation',
  'Hallow':'Greater Evocation',
  'Ice Storm':'Greater Evocation',
  'Insect Plague':'Greater Conjuration',
  'Interposing Hand':'Greater Evocation',
  'Lesser Planar Binding':'Greater Conjuration',
  'Lightning Bolt':'Greater Evocation',
  "Mage's Sword":'Greater Evocation',
  'Magic Missile':'Greater Evocation',
  'Meteor Swarm':'Greater Evocation',
  'Mount':'Greater Conjuration',
  'Planar Binding':'Greater Conjuration',
  'Polar Ray':'Greater Evocation',
  'Produce Flame':'Greater Evocation',
  'Resilient Sphere':'Greater Evocation',
  'Scorching Ray':'Greater Evocation',
  'Secret Chest':'Greater Conjuration',
  'Shocking Grasp':'Greater Evocation',
  'Storm Of Vengeance':'Greater Conjuration',
  'Summon Instrument':'Greater Conjuration',
  'Summon Monster I':'Greater Conjuration',
  'Summon Monster II':'Greater Conjuration',
  'Summon Monster III':'Greater Conjuration',
  'Summon Monster IV':'Greater Conjuration',
  'Summon Monster IX':'Greater Conjuration',
  'Summon Monster V':'Greater Conjuration',
  'Summon Monster VI':'Greater Conjuration',
  'Summon Monster VII':'Greater Conjuration',
  'Summon Monster VIII':'Greater Conjuration',
  "Summon Nature's Ally I":'Greater Conjuration',
  "Summon Nature's Ally II":'Greater Conjuration',
  "Summon Nature's Ally III":'Greater Conjuration',
  "Summon Nature's Ally IV":'Greater Conjuration',
  "Summon Nature's Ally IX":'Greater Conjuration',
  "Summon Nature's Ally V":'Greater Conjuration',
  "Summon Nature's Ally VI":'Greater Conjuration',
  "Summon Nature's Ally VII":'Greater Conjuration',
  "Summon Nature's Ally VIII":'Greater Conjuration',
  'Summon Swarm':'Greater Conjuration',
  'Telekinetic Sphere':'Greater Evocation',
  'Tiny Hut':'Greater Evocation',
  'Trap The Soul':'Greater Conjuration',
  'Unhallow':'Greater Evocation',
  'Wall Of Fire':'Greater Evocation',
  'Wall Of Force':'Greater Evocation',
  'Wall Of Ice':'Greater Evocation',
  'Whirlwind':'Greater Evocation',
  'Wind Wall':'Greater Evocation',
  // Other SRD spells w/different school
  'Ray Of Frost':'Conjuration',
  'Zone Of Silence':'Enchantment'
};
for(var spell in LastAge.SPELL_SCHOOL_CHANGES) {
  LastAge.SPELLS[spell] +=
    ' School="' + LastAge.SPELL_SCHOOL_CHANGES[spell] + '"';
}
LastAge.WEAPONS_ADDED = {
  'Atharak':'Level=3 Category=2h Damage=d6',
  'Cedeku':'Level=3 Category=Li Damage=d6 Threat=19',
  'Crafted Vardatch':'Level=3 Category=1h Damage=d10 Threat=19',
  'Dornish Horse Spear':'Level=3 Category=2h Damage=d10 Crit=3',
  "Farmer's Rope":'Level=1 Category=Li Damage=d2',
  'Fighting Knife':'Level=3 Category=Li Damage=d6 Threat=19 Crit=3',
  'Great Sling':'Level=1 Category=R Damage=d6 Range=60',
  'Greater Vardatch':'Level=3 Category=2h Damage=2d8',
  'Halfling Lance':'Level=3 Category=2h Damage=d8 Crit=3',
  'Icewood Longbow':'Level=3 Category=R Damage=d8 Crit=3 Range=120',
  'Inutek':'Level=3 Category=R Damage=d3 Range=20',
  'Sarcosan Lance':'Level=3 Category=2h Damage=d8 Crit=3',
  'Sepi':'Level=3 Category=Li Damage=d6 Threat=18',
  // TODO 'Shard Arrow':'Level=1 d6@16x1',
  'Staghorn':'Level=3 Category=1h Damage=d6',
  'Tack Whip':'Level=1 Category=Li Damage=d4',
  'Urutuk Hatchet':'Level=3 Category=1h Damage=d8 Crit=3 Range=20',
  'Vardatch':'Level=3 Category=1h Damage=d12'
};
LastAge.WEAPONS = Object.assign({}, SRD35.WEAPONS, LastAge.WEAPONS_ADDED);
LastAge.CLASSES = {
  'Barbarian':SRD35.CLASSES['Barbarian'],
  'Charismatic Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","2:Familiar","1:Magecraft (Charismatic)",' +
      '"3:Force Of Personality" ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      '"Speak Language",Spellcraft,' +
      'Bluff,Diplomacy,"Gather Information",Intimidate,"Sense Motive" ' +
    'Selectables=' +
      '"3:Greater Confidence","3:Greater Fury","3:Improved Confidence",' +
      '"3:Improved Fury","3:Inspire Confidence","3:Inspire Fascination",' +
      '"3:Inspire Fury","3:Mass Suggestion",3"Suggestion ' +
    'SpellAbility=charisma ' +
    'Spells=' +
      '"Ch0:Create Water;Cure Minor Wounds;Dancing Lights;Daze;Detect Magic;' +
      'Detect Poison;Disrupt Undead;Flare;Ghost Sound;Guidance;' +
      'Know Direction;Light;Lullaby;Mage Hand;Mending;Message;Open/Close;' +
      'Ray Of Frost;Read Magic;Resistance;Summon Instrument;' +
      'Touch Of Fatigue;Virtue",' +
      '"Ch1:Alarm;Animate Rope;Assist;Burial;Burning Hands;Calm Animals;' +
      'Cause Fear;Channel Might;Charm Animal;Charm Person;Chill Touch;' +
      'Color Spray;Comprehend Languages;Cure Light Wounds;' +
      'Detect Animals Or Plants;Detect Astirax;Detect Secret Doors;' +
      'Detect Snares And Pits;Detect Undead;Disguise Self;Disguise Weapon;' +
      'Endure Elements;Enlarge Person;Entangle;Erase;Expeditious Retreat;' +
      'Faerie Fire;Far Whisper;Feather Fall;Floating Disk;Goodberry;Grease;' +
      'Hide From Animals;Hold Portal;Hypnotism;Identify;Inspiration;' +
      'Joyful Speech;Jump;Know The Name;Lesser Confusion;Lie;Mage Armor;' +
      'Magic Aura;Magic Fang;Magic Missile;Magic Mouth;Magic Stone;' +
      "Magic Weapon;Mount;Obscuring Mist;Pass Without Trace;Peasant's Rest;" +
      'Phantom Edge;Produce Flame;Protection From Chaos;' +
      'Protection From Evil;Protection From Good;Protection From Law;' +
      'Ray Of Enfeeblement;Reduce Person;Remove Fear;Shield;Shillelagh;' +
      'Shocking Grasp;Silent Image;Sleep;Speak With Animals;Spider Climb;' +
      "Stone Soup;Summon Monster I;Summon Nature's Ally I;True Strike;" +
      'Undetectable Alignment;Unseen Servant;Ventriloquism;Woeful Speech",' +
      '"Ch2:Acid Arrow;Alter Self;Animal Messenger;Animal Trance;Arcane Lock;' +
      "Barkskin;Bear's Endurance;Bleed Power;Blindness/Deafness;Blur;" +
      "Bull's Strength;Cat's Grace;Chill Metal;Command Undead;Confer Power;" +
      'Continual Flame;Cure Moderate Wounds;Darkness;Darkvision;' +
      'Daze Monster;Delay Poison;Detect Chaos;Detect Evil;Detect Good;' +
      "Detect Law;Detect Thoughts;Disguise Ally;Eagle's Splendor;" +
      'False Life;Fell Forbiddance;Fey Fire;Fey Hearth;Flame Blade;' +
      "Flaming Sphere;Fog Cloud;Fox's Cunning;Ghoul Touch;Glitterdust;" +
      'Greenshield;Gust Of Wind;Heat Metal;Hideous Laughter;Hold Animal;' +
      'Hypnotic Pattern;Invisibility;Knock;Lesser Restoration;Levitate;' +
      'Lifetrap;Locate Object;Magic Mouth;Memorial;Minor Image;' +
      "Mirror Image;Misdirection;Nature's Revelation;Obscure Object;" +
      "Owl's Wisdom;Pacify;Phantom Trap;Protection From Arrows;" +
      'Pyrotechnics;Reduce Animal;Resist Energy;Scare;Scorching Ray;' +
      "Scryer's Mark;See Invisibility;Shatter;Silence;Silver Blood;" +
      'Soften Earth And Stone;Sound Burst;Spectral Hand;Spider Climb;' +
      "Summon Monster II;Summon Nature's Ally II;Summon Swarm;" +
      'Touch Of Idiocy;Tree Shape;Warp Wood;Weather;Web;Whispering Wind;' +
      'Withering Speech;Wood Shape",' +
      '"Ch3:Arcane Impotence;Arcane Sight;Call Lightning;Charm Repair;' +
      'Clairaudience/Clairvoyance;Contagion;Cure Serious Wounds;Daylight;' +
      'Deep Slumber;Diminish Plants;Dispel Magic;Displacement;' +
      'Dominate Animal;Explosive Runes;Fireball;Flame Arrow;Fly;' +
      'Gaseous Form;Gentle Repose;Glibness;Good Hope;Greater Magic Fang;' +
      'Greater Magic Weapon;Greater Questing Bird;Gust Of Wind;' +
      'Halfling Burrow;Halt Undead;Haste;Heroism;Hold Person;' +
      'Illusory Script;Invisibility Sphere;Keen Edge;Lightning Bolt;' +
      'Magic Circle Against Chaos;Magic Circle Against Evil;' +
      'Magic Circle Against Good;Magic Circle Against Law;Major Image;' +
      'Meld Into Stone;Neutralize Poison;Nondetection;Phantom Steed;' +
      'Plant Growth;Poison;Protection From Energy;Questing Bird;Rage;' +
      'Ray Of Exhaustion;Remove Disease;Sculpt Sound;Secret Page;' +
      'Sepia Snake Sigil;Shrink Item;Silver Wind;Sleet Storm;Slow;Snare;' +
      'Speak With Plants;Spike Growth;Stinking Cloud;Suggestion;' +
      "Summon Monster III;Summon Nature's Ally III;Tiny Hut;Tongues;" +
      'Vampiric Touch;Water Breathing;Water Walk;Willful Stand;Wind Wall",' +
      '"Ch4:Air Walk;Animate Dead;Antiplant Shell;Arcane Eye;Bestow Curse;' +
      'Bestow Spell;Black Tentacles;Blight;Charm Monster;Command Plants;' +
      'Confusion;Control Water;Crushing Despair;Cure Critical Wounds;' +
      'Detect Scrying;Dimensional Anchor;Enervation;Fear;Fire Shield;' +
      'Fire Trap;Flame Strike;Freedom Of Movement;Giant Vermin;' +
      'Greater Invisibility;Hallucinatory Terrain;Ice Storm;Illusory Wall;' +
      'Lesser Geas;Lesser Globe Of Invulnerability;Locate Creature;' +
      'Mass Enlarge Person;Mass Reduce Person;Minor Creation;' +
      'Mnemonic Enhancer;Modify Memory;Phantasmal Killer;Polymorph;' +
      'Rainbow Pattern;Reincarnate;Remove Curse;Repel Vermin;' +
      'Resilient Sphere;Restoration;Rusting Grasp;Scrying;Secure Shelter;' +
      'Shadow Conjuration;Shout;Silver Storm;Solid Fog;Spike Stones;' +
      "Stone Shape;Stoneskin;Summon Monster IV;Summon Nature's Ally IV;" +
      'Wall Of Fire;Wall Of Ice;Zone Of Silence",' +
      '"Ch5:Animal Growth;Arcane Interference;Atonement;Awaken;' +
      'Baleful Polymorph;Break Enchantment;Call Lightning Storm;Cloudkill;' +
      'Commune With Nature;Cone Of Cold;Contact Other Plane;' +
      'Control Winds;Death Ward;Dismissal;Dominate Person;Dream;Fabricate;' +
      'False Vision;Feeblemind;Hallow;Hold Monster;Insect Plague;' +
      "Interposing Hand;Lesser Planar Binding;Mage's Faithful Hound;" +
      "Mage's Private Sanctum;Magic Circle Against Shadow;Magic Jar;" +
      'Major Creation;Mass Cure Light Wounds;Mind Fog;Mirage Arcana;' +
      'Nexus Fuel;Nightmare;Overland Flight;Passwall;Persistent Image;' +
      'Prying Eyes;Secret Chest;Seeming;Sending;Shadow Evocation;' +
      "Song Of Discord;Summon Monster V;Summon Nature's Ally V;" +
      'Symbol Of Pain;Symbol Of Sleep;Telekinesis;Telepathic Bond;' +
      'Transmute Mud To Rock;Transmute Rock To Mud;Unhallow;Wall Of Force;' +
      'Wall Of Stone;Wall Of Thorns;Waves Of Fatigue",' +
      '"Ch6:Acid Fog;Analyze Dweomer;Animate Objects;Antilife Shell;' +
      'Antimagic Field;Chain Lightning;Circle Of Death;Contingency;' +
      'Create Undead;Disintegrate;Eyebite;Find The Path;Fire Seeds;' +
      'Flesh To Stone;Forceful Hand;Freezing Sphere;Geas/Quest;' +
      'Globe Of Invulnerability;Greater Dispel Magic;Greater Heroism;' +
      "Greater Questing Bird;Guards And Wards;Heroes' Feast;Ironwood;" +
      "Legend Lore;Liveoak;Mage's Lucubration;Mass Bear's Endurance;" +
      "Mass Bull's Strength;Mass Cat's Grace;Mass Cure Moderate Wounds;" +
      "Mass Eagle's Splendor;Mass Fox's Cunning;Mass Owl's Wisdom;" +
      'Mass Suggestion;Mislead;Move Earth;Permanent Image;Planar Binding;' +
      'Programmed Image;Repel Wood;Repulsion;Spellstaff;Stone Tell;' +
      "Stone To Flesh;Summon Monster VI;Summon Nature's Ally VI;" +
      'Symbol Of Fear;Symbol Of Persuasion;Sympathetic Vibration;' +
      'Transformation;True Seeing;Undeath To Death;Veil;Wall Of Iron",' +
      '"Ch7:Animate Plants;Banishment;Changestaff;Control Undead;' +
      'Control Weather;Creeping Doom;Delayed Blast Fireball;' +
      'Finger Of Death;Fire Storm;Forcecage;Grasping Hand;' +
      'Greater Arcane Sight;Greater Restoration;Greater Scrying;' +
      "Greater Shadow Conjuration;Heal;Insanity;Mage's Sword;" +
      'Mass Cure Serious Wounds;Mass Hold Person;Mass Invisibility;' +
      'Power Word Blind;Prismatic Spray;Project Image;Reverse Gravity;' +
      'Sequester;Simulacrum;Spell Turning;Statue;Summon Monster VII;' +
      "Summon Nature's Ally VII;Sunbeam;Symbol Of Stunning;" +
      'Symbol Of Weakness;Transmute Metal To Wood;Vision;' +
      'Waves Of Exhaustion;Wind Walk",' +
      '"Ch8:Animal Shapes;Antipathy;Binding;Clenched Fist;Clone;' +
      'Control Plants;Create Greater Undead;Demand;Discern Location;' +
      'Earthquake;Greater Planar Binding;Greater Prying Eyes;' +
      'Greater Shadow Evocation;Greater Shout;Horrid Wilting;' +
      'Incendiary Cloud;Iron Body;Irresistible Dance;Mass Charm Monster;' +
      'Mass Cure Critical Wounds;Mind Blank;Moment Of Prescience;' +
      'Polar Ray;Polymorph Any Object;Power Word Stun;Prismatic Wall;' +
      'Protection From Spells;Repel Metal Or Stone;Reverse Gravity;' +
      'Scintillating Pattern;Screen;Summon Monster VIII;' +
      "Summon Nature's Ally VIII;Sunburst;Symbol Of Death;" +
      'Symbol Of Insanity;Sympathy;Telekinetic Sphere;Temporal Stasis;' +
      'Trap The Soul;Whirlwind",' +
      '"Ch9:Astral Projection;Crushing Hand;Dominate Monster;' +
      'Elemental Swarm;Energy Drain;Foresight;Freedom;Gate;Imprisonment;' +
      "Mage's Disjunction;Mass Hold Monster;Meteor Swarm;Power Word Kill;" +
      'Prismatic Sphere;Regenerate;Shades;Shambler;Shapechange;Soul Bind;' +
      "Storm Of Vengeance;Summon Monster IX;Summon Nature's Ally IX;" +
      'Time Stop;Wail Of The Banshee;Weird"',
  'Defender':
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Escape Artist","Handle Animal",Hide,Jump,' +
      '"Knowledge (Local)","Knowledge (Shadow)",Listen,"Move Silently",' +
      'Profession,Ride,"Sense Motive","Speak Language",Swim,Tumble ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Farmer\'s Rope/Handaxe/Inutek/Light Hammer/Light Pick/Quarterstaff/Sap/Sickle/Throwing Axe/Sling/Great Sling)",'+
      '"1:Improved Unarmed Strike","1:Masterful Strike",' +
      '"2:Defender Abilities","2:Defender Stunning Fist",' +
      '"3:Improved Grapple","4:Precise Strike" ' +
    'Selectables=' +
       '2:Counterattack,"2:Cover Ally","2:Defensive Mastery",' +
       '"2:Devastating Strike","2:Dodge Training","2:Flurry Attack",' +
       '"2:Furious Grapple","2:Grappling Training","2:Incredible Resilience",' +
       '"2:Incredible Speed","2:Offensive Training","2:One With The Weapon",' +
       '"2:Rapid Strike","2:Retaliatory Strike","2:Speed Training",' +
       '"2:Strike And Hold","2:Weapon Trap"',
  'Fighter':
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills =' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,"Knowledge (Shadow)",' +
      'Profession,Ride,"Speak Language",Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)" ' +
    'Selectables=' +
      '4:Adapter,4:Improviser,"4:Leader Of Men",4:Survivor,"4:Improved Grapple",' +
      '"4:Improved Unarmed Strike","4:Improvised Weapon","4:Stunning Fist",' +
      '"4:Iron Will",4:Leadership","4:Skill Focus (Diplomacy)",' +
      '"4:Skill Focus (Profession (Soldier))","4:Combat Expertise",4:Dodge,4:Endurance',
  'Hermetic Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      'Knowledge ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","2:Familiar","1:Magecraft (Hermetic)",3:Lorebook ' +
    'Selectables=' +
      '"3:Foe Specialty","3:Knowledge Specialty","3:Quick Reference",' +
      '"3:Spell Specialty" ' +
    'SpellAbility=intelligence',
  'Legate':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills =' +
      'Concentration,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Shadow)","Knowledge (Spirits)",' +
      'Profession,"Speak Language,Spellcraft ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Simple)"' +
      '"1:Spontaneous Legate Spell","1:Temple Dependency","1:Turn Undead",' +
      '"3:Astirax Companion" ' +
    'SpellAbility=charisma ' +
    'SpellsPerDay=' +
      'C0=1=3;2=4;4=5;7=6,' +
      'C1=1=1;2=2;4=3;7=4;11=5,' +
      'C2=3=1;4=2;6=3;9=4;13=5,' +
      'C3=5=1;6=2;8=3;11=4;15=5,' +
      'C4=7=1;8=2;10=3;13=4;17=5,' +
      'C5=9=1;10=2;12=3;15=4;19=5,' +
      'C6=11=1;12=2;14=3;17=4,' +
      'C7=13=1;14=2;16=3;19=4,' +
      'C8=15=1;16=2;18=3;20=4,' +
      'C9=17=1;18=2;19=3;20=4,' +
      'Dom1:1=1,' +
      'Dom2:3=1,' +
      'Dom3:5=1,' +
      'Dom4:7=1,' +
      'Dom5:9=1,' +
      'Dom6:11=1,' +
      'Dom7:13=1,' +
      'Dom8:15=1,' +
      'Dom9:17=1 ' +
    'Spells=' + QuilvynUtils.getAttrValueArray(SRD35.CLASSES['Cleric'], 'Spells').concat(['C3:Boil Blood;Speak With Fell']).join(','),
  'Rogue':SRD35.CLASSES['Rogue'],
  'Spiritual Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      'Diplomacy,"Knowledge (Nature)","Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","2:Familiar","1:Magecraft (Spiritual)",' +
      '"3:Master Of Two Worlds" ' +
    'Selectables=' +
      '"3:Confident Effect","3:Heightened Effect","3:Mastery Of Nature",' +
      '"3:Mastery Of Spirits","3:Mastery Of The Unnatural",' +
      '"3:Powerful Effect","3:Precise Effect","3:Specific Effect",' +
      '"3:Universal Effect" ' +
    'SpellAbility=wisdom',
  'Wildlander':
    'HitDie=d8 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills =' +
      'Balance,Climb,Craft,"Handle Animal",Heal,Hide,Jump,' +
      '"Knowledge (Geography)","Knowledge (Nature)",Listen,"Move Silently",' +
      'Profession,Ride,Search,"Speak Language",Spot,Survival,Swim,Use Rope ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Track,"3:Danger Sense","3:Initiative Bonus","4:Hunter\'s Strike" ' +
    'Selectable=' +
      '1:Alertness,"1:Animal Companion",1:Camouflage,1:"Danger Sense",' +
      '1:Evasion,"1:Hated Foe","1:Hide In Plain Sight",' +
      '"1:Hunted By The Shadow","1:Improved Evasion","1:Improved Initiative",' +
      '"1:Improved Woodland Stride","1:Initiative Bonus",' +
      '"1:Instinctive Response","1:Master Hunter","1:Overland Stride",' +
      '"1:Quick Stride","1:Sense Dark Magic","1:Skill Mastery",' +
      '"1:Slippery Mind","1:Trackless Step","1:True Aim","1:Wild Empathy",' +
      '"1:Wilderness Trapfinding","1:Woodland Stride",1:Woodslore'
};

LastAge.racesFavoredRegions = {
  'Agrarian Halfling':'Central Erenland',
  'Clan Dwarf':'Kaladrun Mountains/Subterranean',
  'Clan-Raised Dwarrow':'Kaladrun Mountains',
  'Clan-Raised Dworg':'Kaladrun Mountains',
  'Danisil-Raised Elfling':'Aruun', 'Dorn':'Northlands',
  'Erenlander':'Erenland', 'Gnome':'Central Erenland',
  'Gnome-Raised Dwarrow':'Central Erenland',
  'Halfling-Raised Elfling':'Central Erenland', 'Jungle Elf':'Erethor/Aruun',
  'Kurgun Dwarf':'Kaladrun Mountains/Surface',
  'Kurgun-Raised Dwarrow':'Kaladrun Mountains',
  'Kurgun-Raised Dworg':'Kaladrun Mountains',
  'Nomadic Halfling':'Central Erenland', 'Orc':'Northern Reaches',
  'Plains Sarcosan':'Southern Erenland', 'Sea Elf':'Erethor/Miraleen',
  'Snow Elf':'Erethor/Veradeen', 'Urban Sarcosan':null,
  'Wood Elf':'Erethor/Caraheen'
};
LastAge.racesLanguages = {
  "Agrarian Halfling":
    "Colonial:3/Halfling:3/" +
    "Black Tongue:0/Courtier:0/Erenlander:0/Jungle Mouth:0/Orcish:0/" +
    "Trader's Tongue:0",
  "Clan Dwarf":
    "Clan Dwarven:3/Old Dwarven:3/" +
    "Clan Dwarven:0/Orcish:0",
  "Clan-Raised Dwarrow":
    "Clan Dwarven:3/Old Dwarven:3/Trader's Tongue:1/" +
    "Clan Dwarven:0/Orcish:0",
  "Clan-Raised Dworg":
    "Clan Dwarven:3/Old Dwarven:1/Orcish:1/" +
    "Clan Dwarven:0/Trader's Tongue:0",
  "Danisil-Raised Elfling":
    "Halfling:1/High Elven:3/Jungle Mouth:3/" +
    "Colonial:0/Erenlander:0/Orcish:0/Trader's Tongue:0",
  "Dorn":
    "Erenlander:3/Norther:3/" +
    "Colonial:0/High Elven:0/Orcish:0/Trader's Tongue:0",
  "Erenlander":
    "Erenlander:3/" +
    "Any:0",
  "Gnome":
    "Trader's Tongue:3/Any:2/Any:1" +
    "Any:0",
  "Gnome-Raised Dwarrow":
    "Clan Dwarven:2/Old Dwarven:1/Trader's Tongue:1/Any:1/Any:1/" +
    "Any:0",
  "Halfling-Raised Elfling":
    "Erenlander:3/Halfling:3/Jungle Mouth:1/" +
    "Colonial:0/Orcish:0/Trader's Tongue:0",
  "Jungle Elf":
    "Jungle Mouth:3/" +
    "Colonial:0/Erenlander:0/Halfling:0/High Elven:0/Sylvan:0/" +
    "Trader's Tongue:0",
  "Kurgun Dwarf":
    "Clan Dwarven:3/Old Dwarven:3/" +
    "Clan Dwarven:0/Orcish:0/Trader's Tongue:0",
  "Kurgun-Raised Dwarrow":
    "Clan Dwarven:3/Old Dwarven:3/Trader's Tongue:1/" +
    "Clan Dwarven:0/Orcish:0",
  "Kurgun-Raised Dworg":
    "Clan Dwarven:3/Old Dwarven:1/Orcish:1/" +
    "Clan Dwarven:0/Trader's Tongue:0",
  "Nomadic Halfling":
    "Colonial:3/Halfling:3/" +
    "Black Tongue:0/Courtier:0/Erenlander:0/Jungle Mouth:0/Orcish:0/" +
    "Trader's Tongue:0",
  "Orc":
    "Black Tongue:1/Old Dwarven:1/High Elven:1/Orcish:3/" +
    "Any:0",
  "Plains Sarcosan":
    "Colonial:3/Erenlander:3/" +
    "Courtier:0/Halfling:0/Norther:0/Orcish:0/Trader's Tongue:0",
  "Sea Elf":
    "High Elven:3/Jungle Mouth:3/" +
    "Halfling:0/Sylvan:0/Trader's Tongue:0",
  "Snow Elf":
    "High Elven:3/Orcish:1/Patrol Sign:1/" +
    "Black Tongue:0/Erenlander:0/Norther:0/Sylvan:0/Trader's Tongue:0",
  "Urban Sarcosan":
    "Colonial:3/Erenlander:3/" +
    "Courtier:0/Halfling:0/Norther:0/Orcish:0/Trader's Tongue:0",
  "Wood Elf":
    "High Elven:3/" +
    "Colonial:0/Erenlander:0/Halfling:0/Jungle Mouth:0/Old Dwarven:0/" +
    "Orcish:0/Sylvan:0/Trader's Tongue:0"
};

/* Defines the rules related to character abilities. */
LastAge.abilityRules = function(rules) {
  LastAge.baseRules.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
LastAge.aideRules = function(rules, companions, familiars) {
  LastAge.baseRules.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
LastAge.combatRules = function(rules, armors, shields, weapons) {
  LastAge.baseRules.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to goodies included in character notes. */
LastAge.goodiesRules = function(rules) {
  LastAge.baseRules.goodiesRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
LastAge.identityRules = function(
  rules, alignments, classes, deities, domains, genders, heroicPaths, races
) {
  if(LastAge.baseRules == SRD35)
    SRD35.identityRules
      (rules, alignments, classes, deities, domains, genders, races);
  else
    Pathfinder.identityRules
      (rules, alignments, [], classes, deities, domains, [], genders, races,
       Pathfinder.TRAITS);
  for(var path in heroicPaths) {
    rules.choiceRules(rules, 'Heroic Path', path, heroicPaths[path]);
  }
  rules.defineEditorElement('deity');
  rules.defineSheetElement('Deity');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'experience');
  rules.defineSheetElement('Heroic Path', 'Alignment');
};

/* Defines rules related to magic use. */
LastAge.magicRules = function(rules, schools, spells) {
  LastAge.baseRules.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character feats, languages, and skills. */
LastAge.talentRules = function(rules, feats, features, languages, skills) {
  LastAge.baseRules.talentRules(rules, feats, features, languages, skills);
  // No changes needed to the rules defined by base method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
LastAge.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    LastAge.alignmentRules(rules, name);
  else if(type == 'Animal Companion')
    LastAge.companionRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Armor')
    LastAge.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class') {
    LastAge.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsPerDay'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      LastAge.SPELLS
    );
    LastAge.classRulesExtra(rules, name);
  } else if(type == 'Domain')
    LastAge.domainRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      LastAge.SPELLS
    );
  else if(type == 'Familiar')
    LastAge.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Feat') {
    LastAge.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Type'),
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply')
    );
    LastAge.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    LastAge.featureRules(rules, name, attrs);
  else if(type == 'Gender')
    LastAge.genderRules(rules, name);
  else if(type == 'Heroic Path') {
    LastAge.heroicPathRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells')
    );
  } else if(type == 'Language')
    LastAge.languageRules(rules, name);
  else if(type == 'Race') {
    LastAge.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      LastAge.SPELLS
    );
    LastAge.raceRulesExtra(rules, name);
  } else if(type == 'School')
    LastAge.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
  else if(type == 'Shield')
    LastAge.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    LastAge.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class')
    );
    LastAge.skillRulesExtra(rules, name);
  } else if(type == 'Spell')
    LastAge.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Trait')
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
  else if(type == 'Weapon')
    LastAge.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Threat'),
      QuilvynUtils.getAttrValue(attrs, 'Crit'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replace(/ /g, '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
LastAge.alignmentRules = function(rules, name) {
  LastAge.baseRules.alignmentRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillPenalty# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
LastAge.armorRules = function(
  rules, name, ac, weight, maxDex, skillPenalty, spellFail
) {
  LastAge.baseRules.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires# and soft prerequisites #implies#. The class
 * grants #hitDie# (format [n]'d'n) additional hit points and #skillPoint#
 * additional skill points with each level advance. #attack# is one of '1',
 * '1/2', or '3/4', indicating the base attack progression for the class;
 * similarly, #saveFort#, #saveRef#, and #saveWill# are each one of '1/2' or
 * '1/3', indicating the saving through progressions. #skills# indicate class
 * skills for the class (but see also skillRules for an alternate way these can
 * be defined). #features# and #selectables# list the features and selectable
 * features acquired as the character advances in class level; #languages# list
 * any automatic languages for the class.  #casterLevelArcane# and
 * #casterLevelDivine#, if specified, give the expression for determining the
 * caster level for the class; within these expressions the text "Level"
 * indicates class level. #spellAbility#, if specified, contains the base
 * ability for computing spell difficulty class for cast spells. #spellsPerDay#
 * lists the number of spells per day that the class can cast, and #spells#
 * lists spells defined by the class.
 */
LastAge.classRules = function(
  rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, languages,
  casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
  spellDict
) {
  LastAge.baseRules.classRules(
    rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
    saveRef, saveWill, skills, features, selectables, languages,
    casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
    spellDict
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #intel#, #wis#, #dex#, #con#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
LastAge.companionRules = function(
  rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level, size
) {
  LastAge.baseRules.companionRules
    (rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage,
     level, size);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #domains# and
 * #favoredWeapons# list the associated domains and favored weapons.
 */
LastAge.deityRules = function(rules, name, domains, favoredWeapons) {
  LastAge.baseRules.deityRules(rules, name, domains, favoredWeapons);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with domain #name#. #features# and
 * #spells# list the associated features and domain spells.
 */
LastAge.domainRules = function(rules, name, features, spells, spellDict) {
  LastAge.baseRules.domainRules(rules, name, features, spells, spellDict);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires# and soft prerequisites #implies#. The class
 * grants #hitDie# (format [n]'d'n) additional hit points and #skillPoint#
 * additional skill points with each level advance. #attack# is one of '1',
 * '1/2', or '3/4', indicating the base attack progression for the class;
 * similarly, #saveFort#, #saveRef#, and #saveWill# are each one of '1/2' or
 * '1/3', indicating the saving through progressions. #skills# indicate class
 * skills for the class (but see also skillRules for an alternate way these can
 * be defined). #features# and #selectables# list the features and selectable
 * features acquired as the character advances in class level.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * expression for determining the caster level for the class; within these
 * expressions the text "Level" indicates class level. #spellAbility#, if
 * specified, contains the base ability for computing spell difficulty class
 * for cast spells. #spellsPerDay# lists the number of spells per day that the
 * class can cast, and #spells# lists spells defined by the class.
 */
LastAge.classRules = function(
  rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
  saveRef, saveWill, skills, features, selectables, languages,
  casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
  spellDict
) {
  LastAge.baseRules.classRules(
    rules, name, requires, implies, hitDie, attack, skillPoints, saveFort,
    saveRef, saveWill, skills, features, selectables, languages,
    casterLevelArcane, casterLevelDivine, spellAbility, spellsPerDay, spells,
    spellDict
  );
};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
 */
LastAge.classRulesExtra = function(rules, name) {

  if(name.indexOf(' Channeler') >= 0) {

    rules.defineRule('casterLevelArcane', 'casterLevels.Ch', '+=', null);
    rules.defineRule('familiarLevel',
      'channelerLevels', '+=', 'source >= 2 ? Math.floor(source / 2) : null'
    );
    rules.defineRule('familiarMasterLevel', 'channelerLevels', '+=', null);
    rules.defineRule('featCount.' + name,
      'levels.' + name, '=',
      'source >= 4 ? Math.floor((source - 1) / 3) : null'
    );
    rules.defineRule('featCount.Spellcasting',
      'channelerLevels', '+=',
      'source >= 2 ? Math.floor((source + 1) / 3) : null'
    );
    rules.defineRule
      ('magicNotes.channelerSpellEnergy', 'channelerLevels', '=', null);
    rules.defineRule('magicNotes.channelerSpellsKnown',
      'channelerLevels', '=', '(source - 1) * 2'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.channelerSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.channelerSpellsKnown', '+', null);

    if(name == 'Charismatic Channeler') {
      /* TODO
      feats = ['Extra Gift', 'Spell Knowledge'];
      for(var j = 0; j < LastAge.SCHOOLS.length; j++) {
        var school = LastAge.SCHOOLS[j].split(':')[0];
        feats[feats.length] = 'Greater Spell Focus (' + school + ')';
        feats[feats.length] = 'Spell Focus (' + school + ')';
      }
      */
      rules.defineRule
        ('channelerLevels', 'levels.Charismatic Channeler', '+=', null);
      rules.defineRule('magicNotes.forceOfPersonality',
        'charismaModifier', '=', '3 + source'
      );
      rules.defineRule('magicNotes.inspireConfidence',
        'levels.Charismatic Channeler', '=', null
      );
      rules.defineRule('magicNotes.inspireFascination',
        'levels.Charismatic Channeler', '=', null
      );
      rules.defineRule('magicNotes.inspireFascination.1',
        'levels.Charismatic Channeler', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('magicNotes.inspireFascination.2',
        'levels.Charismatic Channeler', '=', null
      );
      rules.defineRule('magicNotes.inspireFury',
        'levels.Charismatic Channeler', '=', 'source + 5'
      );
      rules.defineRule('magicNotes.magecraft(Charismatic)',
        'charismaModifier', '=', null
      );
      rules.defineRule('magicNotes.massSuggestion',
        'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
      );
      rules.defineRule('selectableFeatureCount.Charismatic Channeler',
        'levels.Charismatic Channeler', '=',
        'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.magecraft(Charismatic)', '+=', null);
      rules.defineRule
        ('spellsKnown.B0', 'magicNotes.magecraft(Charismatic)', '+=', '3');
      rules.defineRule
        ('spellsKnown.B1', 'magicNotes.magecraft(Charismatic)', '+=', '1');
    } else if(name == 'Hermetic Channeler') {
      /* TODO
      feats = ['Spell Knowledge'];
      var allFeats = SRD35.FEATS.concat(LastAge.FEATS);
      for(var j = 0; j < allFeats.length; j++) {
        var pieces = allFeats[j].split(':');
        if(pieces[1].match(/Item Creation|Metamagic/)) {
          feats.push(pieces[0]);
        }
      }
      */
      rules.defineRule
        ('channelerLevels', 'levels.Hermetic Channeler', '+=', null);
      rules.defineRule('magicNotes.magecraft(Hermetic)',
        'intelligenceModifier', '=', null
      );
      rules.defineRule('selectableFeatureCount.Hermetic Channeler',
        'levels.Hermetic Channeler', '=',
        'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('skillNotes.quickReference',
        'hermeticChannelerFeatures.Quick Reference', '=', '5 * source'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.magecraft(Hermetic)', '+=', null);
      rules.defineRule
        ('spellsKnown.W0', 'magicNotes.magecraft(Hermetic)', '+=', '3');
      rules.defineRule
        ('spellsKnown.W1', 'magicNotes.magecraft(Hermetic)', '+=', '1');
    } else if(name == 'Spiritual Channeler') {
      /* TODO
      feats = ['Extra Gift', 'Spell Knowledge'];
      var allFeats = SRD35.FEATS.concat(LastAge.FEATS);
      for(var j = 0; j < allFeats.length; j++) {
        var pieces = allFeats[j].split(':');
        if(pieces[1].indexOf('Item Creation') >= 0) {
          feats.push(pieces[0]);
        }
      }
      */
      rules.defineRule
        ('channelerLevels', 'levels.Spiritual Channeler', '+=', null);
      rules.defineRule('combatNotes.masterOfTwoWorlds',
        'levels.Spiritual Channeler', '?', 'source >= 3',
        'wisdomModifier', '=', '3 + source'
      );
      rules.defineRule
        ('magicNotes.magecraft(Spiritual)', 'wisdomModifier', '=', null);
      rules.defineRule('selectableFeatureCount.Spiritual Channeler',
        'levels.Spiritual Channeler', '=',
        'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.magecraft(Spiritual)', '+=', null);
      rules.defineRule
        ('spellsKnown.D0', 'magicNotes.magecraft(Spiritual)', '+=', '3');
      rules.defineRule
        ('spellsKnown.D1', 'magicNotes.magecraft(Spiritual)', '+=', '1');
      var turningTargets = {
        'Nature':'Nature', 'Spirits':'Spirit', 'The Unnatural':'Unnatural'
      };
      for(var a in turningTargets) {
        var prefix = 'turn' + turningTargets[a];
        rules.defineRule(prefix + '.level',
          'features.Mastery Of ' + a, '?', null,
          'levels.Spiritual Channeler', '+=', null
        );
        rules.defineRule(prefix + '.damageModifier',
          prefix + '.level', '=', null,
          'wisdomModifier', '+', null
        );
        rules.defineRule(prefix + '.frequency',
          prefix + '.level', '=', '3',
          'wisdomModifier', '+', null
        );
        rules.defineRule(prefix + '.maxHitDice',
          prefix + '.level', '=', 'source * 3 - 10',
          'wisdomModifier', '+', null
        );
        rules.defineNote([
          prefix + '.damageModifier:2d6 + %V',
          prefix + '.frequency:%V/day',
          prefix + '.maxHitDice:(d20 + %V) / 3'
        ]);
        rules.defineSheetElement
          ('Turn ' + turningTargets[a], 'Turn Undead', null, ' * ');
      }
    }

  } else if(name == 'Defender') {

    rules.defineRule('abilityNotes.incredibleSpeed',
      'defenderFeatures.Incredible Speed', '=', '10 * source'
    );
    rules.defineRule('armorClass',
      'combatNotes.defenderArmorClassAdjustment', '+', null,
      'combatNotes.dodgeTraining', '+', null
    );
    rules.defineRule('combatNotes.defenderAbilities',
      'levels.Defender', '=', '3 + source * 3 / 4',
      'level', '+', 'source / 4'
    );
    rules.defineRule('combatNotes.defenderArmorClassAdjustment',
      'levels.Defender', '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.defenderStunningFist',
      'levels.Defender', '=', '10 + Math.floor(source / 2)',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.dodgeTraining',
      'defenderFeatures.Dodge Training', '=', null
    );
    rules.defineRule('combatNotes.flurryAttack',
      'defenderFeatures.Flurry Attack', '=', null
    );
    rules.defineRule('combatNotes.incredibleResilience',
      'defenderFeatures.Incredible Resilience', '=', '3 * source'
    );
    rules.defineRule('combatNotes.masterfulStrike',
      'defenderUnarmedDamageLarge', '=', null,
      'defenderUnarmedDamageMedium', '=', null,
      'defenderUnarmedDamageSmall', '=', null
    );
    rules.defineRule('combatNotes.offensiveTraining',
      'levels.Defender', '=', '14 + Math.floor(source / 2)',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.preciseStrike',
      'levels.Defender', '=', '3 * Math.floor((source + 2) / 6)'
    );
    rules.defineRule('defenderUnarmedDamageLarge',
      'features.Large', '?', null,
      'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "8")'
    );
    rules.defineRule('defenderUnarmedDamageMedium',
      'levels.Defender', '=',
      '"1d6" + (source < 7 ? "" : ("+" + Math.floor((source-1) / 6) + "d6"))'
    );
    rules.defineRule('defenderUnarmedDamageSmall',
      'features.Small', '?', null,
      'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "4")'
    );
    rules.defineRule('saveNotes.defensiveMastery',
      'defenderFeatures.Defensive Mastery', '=', null
    );
    rules.defineRule('selectableFeatureCount.Defender',
      'levels.Defender', '=',
      'source < 2 ? null : (Math.floor((source + 1) / 3) + ' +
                           '(source < 6 ? 0 : Math.floor((source - 3) / 3)))'
    );
    rules.defineRule
      ('weaponDamage.Unarmed', 'combatNotes.masterfulStrike', '=', null);

  } else if(name == 'Fighter') {

    rules.defineRule('featCount.Fighter',
      'levels.Fighter', '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule('selectableFeatureCount.Fighter',
      'levels.Fighter', '=', 'source < 4 ? null : (1 + Math.floor((source + 2) / 6))'
    );
    rules.defineRule('skillNotes.adapter',
      'levels.Fighter', '=',
      'source - 3 + (source >= 10 ? source - 9 : 0) + ' +
      '(source >= 16 ? source - 15 : 0)'
    );
    rules.defineRule('skillNotes.adapter.1',
      'fighterFeatures.Adapter', '?', null,
      'levels.Fighter', '=', 'source < 10 ? 1 : source < 16 ? 2 : 3'
    );

  } else if(name == 'Legate') {

    rules.defineRule('astiraxMasterLevel', 'levels.Legate', '+=', null);
    rules.defineRule('casterLevels.C', 'levels.Legate', '=', null);
    rules.defineRule('casterLevels.Dom', 'casterLevels.C', '+=', null);
    rules.defineRule('casterLevelDivine', 'casterLevels.C', '+=', null);
    rules.defineRule('deity', 'levels.Legate', '=', '"Izrador (NE)"');
    rules.defineRule('domainCount', 'levels.Legate', '+=', '2');
    rules.defineRule('features.Weapon Focus (Longsword)',
      'legateFeatures.Weapon Focus (Longsword)', '=', null
    );
    rules.defineRule('features.Weapon Proficiency (Longsword)',
      'legateFeatures.Weapon Proficiency (Longsword)', '=', null
    );
    rules.defineRule('legateFeatures.Weapon Focus (Longsword)',
      'domains.War', '?', null,
      'levels.Legate', '=', '1'
    );
    rules.defineRule('legateFeatures.Weapon Proficiency (Longsword)',
      'domains.War', '?', null,
      'levels.Legate', '=', '1'
    );
    for(var j = 1; j < 10; j++) {
      rules.defineRule('spellsPerDay.Dom' + j,
        'levels.Legate', '=',
        'source >= ' + (j * 2 - 1) + ' ? 1 : null');
    }
    rules.defineRule('turningLevel', 'levels.Legate', '+=', null);

  } else if(name == 'Wildlander') {

    rules.defineRule('abilityNotes.quickStride',
      'wildlanderFeatures.Quick Stride', '=', '10 * source'
    );
    rules.defineRule('casterLevels.Wildlander',
      'wilderlanderFeatures.Sense Dark Magic', '?', null,
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.Detect Magic', 'casterLevels.Wildlander', '^=', null);
    rules.defineRule('casterLevels.W', 'casterLevels.Wildlander', '^=', null);
    rules.defineRule
      ('companionMasterLevel', 'levels.Wildlander', '+=', null);
    rules.defineRule("combatNotes.hunter'sStrike",
      'levels.Wildlander', '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.initiativeBonus',
      'levels.Wildlander', '+=', 'source >= 3 ? 1 : null',
      'wildlanderFeatures.Initiative Bonus', '+', null
    );
    rules.defineRule('featureNotes.animalCompanion',
      'wildlanderFeatures.Animal Companion', '+=', null
    );
    rules.defineRule('selectableFeatureCount.Wildlander',
      'levels.Wildlander', '=',
      '1 + Math.floor((source + 1) / 3) + ' +
      '(source < 6 ? 0 : Math.floor((source - 3) / 3))'
    );
    rules.defineRule('skillNotes.dangerSense',
      'levels.Wildlander', '+=', 'source >= 3 ? 1 : null',
      'wildlanderFeatures.Danger Sense', '+', null
    );
    rules.defineRule('skillNotes.skillMastery',
      'wildlanderFeatures.Skill Mastery', '+=', null
    );
    rules.defineRule('skillNotes.skillMasteryFeature2',
      'wildlanderFeatures.Skill Mastery', '+=', null
    );
    rules.defineRule('skillNotes.wildEmpathy',
      'levels.Wildlander', '+=', 'source',
      'charismaModifier', '+', null
    );

  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #intel#, #wis#, #dex#, #con#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
LastAge.companionRules = function(
  rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level, size
) {

  LastAge.baseRules.companionRules(
    rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, size, level
  );

  // Override SRD3.5 feature list
  var features = {
    'Devotion': 1, 'Magical Beast': 2, 'Companion Evasion': 3,
    'Improved Speed': 4, 'Empathic Link': 5,
    'Link': 0, 'Share Spells': 0, 'Multiattack': 0,
    'Companion Improved Evasion': 0
  };
  for(var feature in features) {
    if(features[feature] > 0) {
      rules.defineRule('animalCompanionFeatures.' + feature,
        'companionLevel', '=',
        'source >= ' + features[feature] + ' ? 1 : null'
      );
    } else {
      // Disable N/A SRD3.5 companion features
      rules.defineRule
        ('animalCompanionFeatures.' + feature, 'companionLevel', '=', 'null');
    }
  }

  // Companion level based on feature count instead of class level
  rules.defineRule('companionLevel',
    'companionMasterLevel', '=', 'null',
    'featureNotes.animalCompanion', '=', null
  );

  // Overrides of a couple of SRD3.5 calculations
  rules.defineRule
    ('animalCompanionStats.Str', 'companionLevel', '+', 'source * 2');
  rules.defineRule
    ('animalCompanionStats.Tricks', 'companionLevel', '=', 'source+1');

  // Adapt Legate astirax rules to make it a form of animal companion.
  features = {
    'Telepathy': 2, 'Enhanced Sense': 3, 'Companion Evasion': 4,
    'Companion Empathy': 6
  };
  for(var feature in features) {
    rules.defineRule('animalCompanionFeatures.' + feature,
      'astiraxLevel', '=', 'source >= ' + features[feature] + ' ? 1 : null'
    );
    rules.defineRule
      ('features.' + feature, 'animalCompanionFeatures.' + feature, '=', '1');
  }

  // TODO
  var notes = [
    'companionNotes.companionEmpathy:' +
      'Continuous emotional link w/no range limit',
    'companionNotes.enhancedSense:' +
      '+%V mile channeled event detection',
    'companionNotes.telepathy:' +
      "Companion-controlled telepathic communication up to 100'"
  ];

  rules.defineRule
    ('astiraxLevel', 'levels.Legate', '=', 'Math.floor(source / 3)');
  rules.defineRule('companionNotes.enhancedSense',
    'astiraxLevel', '=', 'source < 4 ? 5 : 10'
  );
  rules.defineRule
    ('animalCompanionStats.Cha', 'astiraxLevel', '+', 'source - 1');
  rules.defineRule
    ('animalCompanionStats.HD', 'astiraxLevel', '+', '(source - 1) * 2');
  rules.defineRule
    ('animalCompanionStats.Int', 'astiraxLevel', '+', 'source - 1');

};

/*
 * Defines in #rules# the rules associated with domain #name#. #features# and
 * #spells# list the associated features and domain spells.
 */
LastAge.domainRules = function(rules, name, features, spells, spellDict) {
  LastAge.baseRules.domainRules(rules, name, features, spells, spellDict);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #intel#, #wis#, #dex#, #con#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a familiar.
 */
LastAge.familiarRules = function(
  rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, level, size
) {
  LastAge.baseRules.familiarRules
    (rules, name, str, intel, wis, dex, con, cha, hd, ac, attack, damage, size, level);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #types# lists the
 * categories of the feat, and #require# and #implies# list the hard and soft
 * prerequisites for the feat.
 */
LastAge.featRules = function(rules, name, types, requires, implies) {
  LastAge.baseRules.featRules(rules, name, types, requires, implies);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
 */
LastAge.featRulesExtra = function(rules, name) {

  if(feat == 'Drive It Deep') {
    rules.defineRule('combatNotes.driveItDeep', 'baseAttack', '=', null);
  } if(feat == 'Extra Gift') {
    rules.defineRule
      ('combatNotes.masterOfTwoWorlds', 'featureNotes.extraGift', '+', '4');
    rules.defineRule
      ('magicNotes.forceOfPersonality', 'featureNotes.extraGift', '+', '4');
  } else if(feat == 'Innate Magic') {
    rules.defineRule('magicNotes.innateMagic',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
    rules.defineRule('magicNotes.innateMagic.2',
      'features.Innate Magic', '?', null,
      'charismaModifier', '=', '(source + 5) * 10000',
      'intelligenceModifier', '+', '(source + 5) * 100',
      'wisdomModifier', '+', 'source + 5'
    );
    rules.defineRule('magicNotes.innateMagic.1',
      'magicNotes.innateMagic.2', '=',
        'Math.floor(source/10000) >= Math.floor((source%10000)/100) && ' +
        'Math.floor(source/10000) >= source%100 ? "B0" : ' +
        'Math.floor((source%10000)/100) >= source%100 ? "W0" : "D0"'
    );
    rules.defineRule('casterLevels.innateB',
      'magicNotes.innateMagic.1', '?', 'source == "B0"',
      'level', '=', null
    );
    rules.defineRule('casterLevels.innateD',
      'magicNotes.innateMagic.1', '?', 'source == "D0"',
      'level', '=', null
    );
    rules.defineRule('casterLevels.innateW',
      'magicNotes.innateMagic.1', '?', 'source == "W0"',
      'level', '=', null
    );
    rules.defineRule('casterLevels.B', 'casterLevels.innateB', '=', null);
    rules.defineRule('casterLevels.D', 'casterLevels.innateD', '=', null);
    rules.defineRule('casterLevels.W', 'casterLevels.innateW', '=', null);
  } else if((matchInfo = feat.match(/^Magecraft \((.*)\)/)) != null) {
    var tradition = matchInfo[1];
    var note = 'magicNotes.magecraft(' + tradition + ')';
    var ability = tradition == 'Charismatic' ? 'charisma' :
                  tradition == 'Hermetic' ? 'intelligence' : 'wisdom';
    var spellClass = tradition == 'Charismatic' ? 'Bard' :
                     tradition == 'Hermetic' ? 'Wizard' : 'Druid';
    var spellCode = spellClass.substring(0, 1);
    notes = [note + ':4 spells/%V spell energy points'];
    rules.defineRule(note, ability + 'Modifier', '=', null);
    rules.defineRule('spellEnergy', note, '+=', null);
    rules.defineRule('spellsKnown.' + spellCode + '0', note, '+=', '3');
    rules.defineRule('spellsKnown.' + spellCode + '1', note, '+=', '1');
    // Pick up SRD35 level 0/1 spells of the appropriate class.
    var classRules = new QuilvynRules('');
    SRD35.magicRules(classRules, [spellClass], [], []);
    var schools = rules.getChoices('schools');
    for(var s in classRules.getChoices('spells')) {
      var matchInfo = s.match('^(.*)\\((' + spellCode + '[01])');
      if(matchInfo == null) {
        continue;
      }
      var spell = matchInfo[1];
      var school = LastAge.spellsSchools[spell] || SRD35.spellsSchools[spell];
      if(school == null) {
        continue;
      }
      spell += '(' + matchInfo[2] + ' ' +
               (school == 'Universal' ? 'None' : schools[school]) + ')';
      rules.defineChoice('spells', spell);
    }
    rules.defineRule('casterLevels.' + feat,
      'features.' + feat, '?', null,
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.' + spellCode, 'casterLevels.' + feat, '=', null);
  } else if((matchInfo = feat.match(/^Spellcasting \((.*)\)/)) != null) {
    var school = matchInfo[1];
    var schoolNoSpace = school.replace(/ /g, '');
    var note = 'magicNotes.spellcasting(' + schoolNoSpace + ')';
    notes = [note + ':May learn school spells/+1 school spell'];
    if(school.indexOf('Greater ') == 0) {
      notes[notes.length] =
        'validationNotes.spellcasting(' + schoolNoSpace + ')FeatFeats:' +
          'Requires Spellcasting (' + school.substring(8) + ')';
    }
    rules.defineRule('spellsKnownBonus', note, '+=', '1');
    rules.defineRule('spellcastingFeatureCount',
      /features.Spellcasting \(.*\)$/, '+=', '1'
    );
    rules.defineRule(
      'casterLevels.Spellcasting', 'spellcastingFeatureCount', '?', null,
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.Ch', 'casterLevels.Spellcasting', '=', null);
  } else if((matchInfo = feat.match(/^Spell Focus \((.*)\)/)) != null) {
    // Add validation note to what base rules already computed
    var school = matchInfo[1];
    var schoolNoSpace = school.replace(/ /g, '');
    notes = [
     'validationNotes.spellFocus(' + schoolNoSpace + ')FeatFeatures:' +
       'Requires Spellcasting (' + school + ')'
    ];
  } else if(feat == 'Spell Knowledge') {
    rules.defineRule('spellsKnownBonus', 'magicNotes.spellKnowledge', '+', '2');
  } else if(feat == 'Warrior Of Shadow') {
    rules.defineRule
      ('combatNotes.warriorOfShadow', 'charismaModifier', '=', null);
    rules.defineRule
      ('combatNotes.warriorOfShadow.1', 'charismaModifier', '=', null);
  } else if(feat == 'Dwarvencraft') {
    rules.defineRule('featureNotes.dwarvencraft',
      'skills.Craft (Armor)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Blacksmith)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Weapons)', '+=', 'Math.floor(source / 4)'
    );
  } else if(feat == 'Touched By Magic') {
    rules.defineRule('spellEnergy', 'magicNotes.touchedByMagic', '+', '2');
  } else if(feat == 'Born Of Duty') {
    rules.defineRule('magicNotes.bornOfDuty',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(feat == 'Improved Flexible Recovery') {
    rules.defineRule('magicNotes.improvedFlexibleRecovery',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
  } else if(feat == 'Power Reservoir') {
    rules.defineRule('magicNotes.powerReservoir',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
  } else if(feat == 'Sense Power') {
    rules.defineRule('magicNotes.sensePower', 'wisdomModifier', '=', null);
  } else if(feat == 'Canny Strike') {
    rules.defineRule
      ('combatNotes.cannyStrike', 'intelligenceModifier', '=', null);
  } else if(feat == 'Clever Fighting') {
    rules.defineRule('combatNotes.cleverFighting',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #notes# lists
 * notes associated with feature.
 */
LastAge.featureRules = function(rules, name, notes) {
  LastAge.baseRules.featureRules(rules, name, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with gender #name#. */
LastAge.genderRules = function(rules, name) {
  LastAge.baseRules.genderRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * TODO
 */
LastAge.heroicPathRules = function(rules, name, features, selectables, spells) {

  if(!name) {
    console.log('Empty class name');
    return;
  }

  var prefix =
    name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');

  rules.defineRule('pathLevels.' + name,
    'heroicPath', '?', 'source == "' + name + '"',
    'level', '=', null
  );
  rules.defineSheetElement(name + ' Features', 'Feats', null, ' * ');
  rules.defineChoice('extras', prefix + 'Features');

  for(var i = 0; i < features.length; i++) {
    var matchInfo = features[i].match(/^((\d+):)?(.*)$/);
    var feature = matchInfo ? matchInfo[3] : features[i];
    var level = matchInfo ? matchInfo[2] : 1;
    rules.defineRule(prefix + 'Features.' + feature,
      'pathLevels.' + name, '=', 'source >= ' + level + ' ? 1 : null'
    );
    rules.defineRule
      ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
    if((matchInfo = feature.match(/^Weapon (Familiarity|Proficiency) \((.*\/.*)\)$/)) != null) {
      // Set individual features for each weapon on the list.
      var weapons = matchInfo[2].split('/');
      for(var j = 0; j < weapons.length; j++) {
        rules.defineRule('features.Weapon ' + matchInfo[1] + ' (' + weapons[j] + ')', 'features.' + feature, '=', '1');
      }
    }
  }

  for(var i = 0; i < selectables.length; i++) {
    var matchInfo = selectables[i].match(/^((\d+):)?(.*)$/);
    var feature = matchInfo ? matchInfo[3] : selectables[i];
    var level = matchInfo ? matchInfo[2] : 1;
    var choice = name + ' - ' + feature;
    rules.defineChoice('selectableFeatures', choice + ':' + name);
    rules.defineRule(prefix + 'Features.' + feature,
      'selectableFeatures.' + choice, '+=', null
    );
    rules.defineRule
      ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
    SRD35.testRules(rules, 'validation', prefix + ' - ' + feature.replace(/ /g, '') + 'HeroicPath', 'selectableFeatures.' + choice, ['levels.' + name + ' >= ' + level]);
  }

  if(spells.length > 0) {
    rules.defineRule('casterLevels.' + name,
      'heroicPath', '?', 'source == "' + name + '"',
      'level', '=', null
    );
    rules.defineRule('casterLevels.Ch', 'casterLevels.' + name, '^=', null);
    var spellLevels = {};
    for(var i = 0; i < spells.length; i++) {
      var levelAndSpell = spellFeatures[i].split(/:/);
      var level = levelAndSpell.length == 1 ? 1 : levelAndSpell[0];
      var spell = levelAndSpell[levelAndSpell.length == 1 ? 0 : 1];
      spell = '<i>' + spell + '</i>';
      if(spellLevels[spell] == null) {
        spellLevels[spell] = [level];
      } else {
        spellLevels[spell][spellLevels[spell].length] = level;
      }
    }
    for(spell in spellLevels) {
      var levels = spellLevels[spell];
      var rule = '';
      for(var j = levels.length - 1; j >= 0; j--) {
        rule += 'source >= ' + levels[j] + ' ? ' + (j + 1) + ' : ';
      }
      rule += 'null';
      rules.defineRule
        (prefix + 'Spells.' + spell, 'pathLevels.' + name, '=', rule);
    }
    rules.defineSheetElement(name + ' Spells', 'Spells', null, ' * ');
  }

  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', prefix + 'Features');

};

/*
 * TODO
 */
LastAge.heroicPathRulesExtra = function(rules, name) {

  if(name == 'Beast') {

    rules.defineRule
      ('combatNotes.rage', 'constitutionModifier', '=', '5 + source');
    rules.defineRule('combatNotes.rage.1',
      'features.Rage', '?', null,
      'pathLevels.Beast', '+=', 'source >= 17 ? 2 : 1'
    );
    rules.defineRule('combatNotes.viciousAssault',
      'mediumViciousAssault', '=', null,
      'smallViciousAssault', '=', null
    );
    rules.defineRule('mediumViciousAssault',
      'pathLevels.Beast', '=', 'source>=11 ? "d8" : source>=6 ? "d6" : "d4"'
    );
    rules.defineRule('selectableFeatureCount.Beast',
      'pathLevels.Beast', '=', 'Math.floor(source / 5) + ((source >= 16) ? 2 : 1)'
    );
    rules.defineRule('smallViciousAssault',
      'features.Small', '?', null,
      'mediumViciousAssault', '=', 'SRD35.SMALL_DAMAGE[source]'
    );

  } else if(name == 'Chanceborn') {

    rules.defineRule('combatNotes.missChance',
      'pathLevels.Chanceborn', '+=', 'source >= 14 ? 10 : 5'
    );
    rules.defineRule('featureNotes.luckOfHeroes',
      'pathLevels.Chanceborn', '=',
      '"d4" + (source >= 5 ? "/d6" : "") + (source >= 10 ? "/d8" : "") + ' +
      '(source >= 15 ? "/d10" : "") + (source >= 20 ? "/d12" : "")'
    );
    rules.defineRule('featureNotes.persistence',
      'pathLevels.Chanceborn', '+=', 'Math.floor((source - 1) / 5)'
    );
    rules.defineRule('features.Defensive Roll', 'features.Survivor', '=', '1');
    rules.defineRule('features.Evasion', 'features.Survivor', '=', '1');
    rules.defineRule('features.Slippery Mind', 'features.Survivor', '=', '1');
    rules.defineRule('features.Uncanny Dodge', 'features.Survivor', '=', '1');
    rules.defineRule('magicNotes.unfettered',
      'pathLevels.Chanceborn', '+=', 'Math.floor((source + 2) / 5)'
    );

  } else if(name == 'Charismatic') {

    rules.defineRule('charismaticFeatures.Charisma Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );
    rules.defineRule('featureNotes.naturalLeader',
      'pathLevels.Charismatic', '=', 'source >= 18 ? 2 : 1'
    );
    rules.defineRule('magicNotes.inspiringOration',
      'pathLevels.Charismatic', '+=', 'Math.floor((source + 1) / 5)'
    );

  } else if(name == 'Dragonblooded') {

    rules.defineRule('magicNotes.bolsterSpell',
      'pathLevels.Dragonblooded', '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('magicNotes.dragonbloodedSpellEnergy',
      'pathLevels.Dragonblooded', '=',
      'source>=16 ? 8 : source>=11 ? 6 : source>=7 ? 4 : source>=3 ? 2 : null'
    );
    rules.defineRule('magicNotes.dragonbloodedSpellsKnown',
      'pathLevels.Dragonblooded', '=',
      'source>=14 ? 3 : source>=8 ? 2 : source>=2 ? 1 : null'
    );
    rules.defineRule('magicNotes.dragonSpellPenetration',
      'pathLevels.Dragonblooded', '+=', 'Math.floor((source - 5) / 4)'
    );
    rules.defineRule('magicNotes.frightfulPresence',
      'pathLevels.Dragonblooded', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.improvedSpellcasting',
      'pathLevels.Dragonblooded', '+=', 'Math.floor(source / 6)'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.dragonbloodedSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.dragonbloodedSpellsKnown', '+', null);

  } else if(name == 'Earthbonded') {

    rules.defineRule('combatNotes.naturalArmor',
      'earthbondedFeatures.Natural Armor', '+=', null
    );
    rules.defineRule('earthbondedFeatures.Natural Armor',
      'level', '+', 'source >= 18 ? 2 : source >= 10 ? 1 : null'
    );
    rules.defineRule('skillNotes.stonecunning',
      'earthbondedFeatures.Stonecunning', '+=', '2'
    );

  } else if(name == 'Faithful') {

    rules.defineRule('faithfulFeatures.Wisdom Bonus',
      'pathLevels.Faithful', '=', 'source<5 ? null : Math.floor(source/5)'
    );
    rules.defineRule('features.Wisdom Bonus',
     'faithfulFeatures.Wisdom Bonus', '+=', null
    );
    rules.defineRule('turningLevel',
      'pathLevels.Faithful', '+=', 'source < 4 ? null : source'
    );
    // Override SRD35 turning frequency
    rules.defineRule('combatNotes.turnUndead.3',
      'pathLevels.Faithful', 'v', 'Math.floor((source + 1) / 5)'
    );

  } else if(name == 'Fellhunter') {

    rules.defineRule('combatNotes.disruptingAttack',
      'pathLevels.Fellhunter', '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.disruptingAttack.1',
      'pathLevels.Fellhunter', '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.touchOfTheLiving',
      'pathLevels.Fellhunter', '+=', 'Math.floor((source + 3) / 5) * 2'
    );
    rules.defineRule('magicNotes.senseTheDead',
      'pathLevels.Fellhunter', '+=',
        '10 * (Math.floor((source + 4) / 5) + Math.floor((source + 1) / 5))'
    );
    rules.defineRule('saveNotes.wardOfLife',
      'pathLevels.Fellhunter', '=',
      '"extraordinary special attacks" + ' +
      '(source >= 8 ? "/ability damage" : "") + ' +
      '(source >= 13 ? "/ability drain" : "") + ' +
      '(source >= 18 ? "/energy drain" : "")'
    );

  } else if(name == 'Feyblooded') {

    rules.defineRule('selectableFeatureCount.Feyblooded',
      'unearthlyMaxBonusCount', '=',
        'source > 0 ? (source * (source + 1)) / 2 : null',
      'unearthlyChaModTotalBonus', '+', 'source > 0 ? source : null'
    );
    rules.defineRule('magicNotes.feyVision',
      'pathLevels.Feyblooded', '=',
      'source >= 19 ? "all magic" : ' +
      'source >= 13 ? "enchantment/illusion" : "enchantment"'
    );
    rules.defineRule('unearthlyMaxBonusCount',
      'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)',
      'charismaModifier', 'v', null
    );
    rules.defineRule('unearthlyChaModTotalBonus',
      'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)',
      'unearthlyMaxBonusCount', '+', '-source',
      'charismaModifier', '*', null
    );

  } else if(name == 'Giantblooded') {

    rules.defineRule('abilityNotes.fastMovement',
      'pathLevels.Giantblooded', '+=', 'Math.floor((source + 4) / 8) * 5'
    );
    rules.defineRule('combatNotes.fearsomeCharge',
      'pathLevels.Giantblooded', '+=', 'Math.floor((source + 2) / 10)'
    );
    rules.defineRule('giantbloodedFeatures.Strength Bonus',
      'level', '+', 'source >= 15 ? 1 : null'
    );
    rules.defineRule('skillNotes.intimidatingSize',
      'pathLevels.Giantblooded', '+=',
      'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
    );
    rules.defineRule
      ('weapons.Debris', 'combatNotes.rockThrowing', '=', '1');
    // Damage modified to account for Large adjustment starting level 10
    rules.defineRule('weaponDamage.Debris',
      'pathLevels.Giantblooded', '=',
      'source>=16 ? "d10" : source>=10 ? "d8" : source>=9 ? "2d6" : "d10"'
    );
    rules.defineRule('weaponRange.Debris',
      'pathLevels.Giantblooded', '=',
      'source >= 19 ? 120 : source >= 13 ? 90 : source >= 6 ? 60 : 30'
    );

  } else if(name == 'Guardian') {

    rules.defineRule('guardianFeatures.Constitution Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );
    rules.defineRule('combatNotes.righteousFury',
      'pathLevels.Guardian', '+=',
      'source >= 17 ? 12 : source >= 12 ? 9 : ' +
      '(Math.floor((source + 1) / 4) * 3)'
    );
    rules.defineRule('combatNotes.smiteEvil',
      'pathLevels.Guardian', '+=',
      'source >= 18 ? 4 : source >= 14 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('combatNotes.smiteEvil.1', 'charismaModifier', '=', null);
    rules.defineRule
      ('combatNotes.smiteEvil.2', 'pathLevels.Guardian', '=', null);
    rules.defineRule('featureNotes.inspireValor',
      'pathLevels.Guardian', '=', 'source >= 13 ? 2 : 1'
    );
    rules.defineRule('featureNotes.inspireValor.1',
      'pathLevels.Guardian', '=', null
    );
    rules.defineRule('featureNotes.inspireValor.2',
      'pathLevels.Guardian', '=', 'source >= 19 ? 3 : source >= 9 ? 2 : 1'
    );
    rules.defineRule('magicNotes.layOnHands',
      'pathLevels.Guardian', '+=', null,
      'charismaModifier', '*', null
    );

  } else if(name == 'Ironborn') {

    rules.defineRule('combatNotes.damageReduction',
      'pathLevels.Ironborn', '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.improvedHealing',
      'pathLevels.Ironborn', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.naturalArmor',
      'ironbornFeatures.Natural Armor', '+=', null
    );
    rules.defineRule('ironbornFeatures.Fortitude Bonus',
      'level', '+', 'Math.floor((source - 2) / 5)'
    );
    rules.defineRule('ironbornFeatures.Natural Armor',
      'level', '+', 'Math.floor((source - 3) / 5)'
    );
    rules.defineRule('saveNotes.resistElements',
      'pathLevels.Ironborn', '+=', 'Math.floor((source - 1) / 5) * 3'
    );
    rules.defineRule('saveNotes.fortitudeBonus',
      'features.Fortitude Bonus', '=', null 
    );
    rules.defineRule('saveNotes.indefatigable',
      'pathLevels.Ironborn', '=',
       'source < 9 ? null : source < 19 ? "fatigue" : "fatigue/exhaustion"'
    );

  } else if(name == 'Jack-Of-All-Trades') {

    rules.defineRule('featureNotes.featBonus',
      'pathLevels.Jack-Of-All-Trades', '=', 'source >= 14 ? 1 : null'
    );
    rules.defineRule('magicNotes.spellChoice',
      'pathLevels.Jack-Of-All-Trades', '=',
      'source>=16 ? "Ch0/Ch1/Ch2/Ch3" : source>=10 ? "Ch0/Ch1/Ch2" : ' +
      'source>=6 ? "Ch0/Ch1" : "Ch0"'
    );
    rules.defineRule('magicNotes.spontaneousSpell',
      'pathLevels.Jack-Of-All-Trades', '=',
      'source >= 19 ? "Ch0/Ch1/Ch2" : source >= 13 ? "Ch0/Ch1" : "Ch0"'
    );
    rules.defineRule('selectableFeatureCount.Jack-Of-All-Trades',
      'pathLevels.Jack-Of-All-Trades', '=',
      'source>=18 ? 7 : source>=15 ? 6 : source>=12 ? 5 : source>=9 ? 4 : ' +
      'source>=8 ? 3 : source>=5 ? 2 : source>=4 ? 1 : null'
    );
    rules.defineRule('skillNotes.skillBoost',
      'pathLevels.Jack-Of-All-Trades', '=',
      'source >= 20 ? 4 : source >= 17 ? 3 : source >= 11 ? 2 : 1'
    );
    rules.defineRule('skillPoints', 'skillNotes.skillBoost', '+', '4 * source');

  } else if(name == 'Mountainborn') {

    rules.defineRule('combatNotes.rallyingCry',
      'pathLevels.Mountainborn', '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('mountainbornFeatures.Constitution Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );
    rules.defineRule('skillNotes.mountaineer',
      'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 5) * 2'
    );
    rules.defineRule('skillNotes.mountainSurvival',
      'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 5) * 2'
    );

  } else if(name == 'Naturefriend') {

    rules.defineRule('combatNotes.animalFriend',
      'charismaModifier', '=', '10 + source'
    );
    rules.defineRule('combatNotes.elementalFriend',
      'charismaModifier', '=', '10 + source'
    );
    rules.defineRule('combatNotes.plantFriend',
      'charismaModifier', '=', '10 + source'
    );
    rules.defineRule
      ('skillNotes.wildEmpathy','pathLevels.Naturefriend','+=',null);

  } else if(name == 'Northblooded') {

    rules.defineRule
      ('combatNotes.battleCry', 'pathLevels.Northblooded', '=', null);
    rules.defineRule('combatNotes.battleCry.1',
      'pathLevels.Northblooded', '=',
      'source >= 17 ? 4 : source >= 14 ? 3 : source >= 7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.frostWeapon',
      'pathLevels.Northblooded', '=', null
    );
    rules.defineRule('combatNotes.frostWeapon.1',
      'pathLevels.Northblooded', '=', 'source >= 19 ? 2 : 1'
    );
    rules.defineRule('northbloodedFeatures.Constitution Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );
    rules.defineRule('magicNotes.howlingWinds',
      'pathLevels.Northblooded', '+=',
      'source >= 12 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('saveNotes.coldResistance',
      'pathLevels.Northblooded', '+=', 'source >= 9 ? 15 : 5'
    );
    rules.defineRule('skillNotes.wildEmpathy',
      'pathLevels.Northblooded', '+=', null
    );

  } else if(name == 'Painless') {

    rules.defineRule('combatNotes.improvedRetributiveRage',
      'pathLevels.Painless', '+=', null
    );
    rules.defineRule('combatNotes.increasedDamageThreshold',
      'pathLevels.Painless', '+=',
      'source >= 20 ? 25 : source >= 15 ? 20 : 15'
    );
    rules.defineRule('combatNotes.lastStand',
      'pathLevels.Painless', '+=', '10 + source'
    );
    rules.defineRule('combatNotes.lastStand.1',
      'pathLevels.Painless', '+=', 'source >= 19 ? 2 : 1'
    );
    rules.defineRule('combatNotes.nonlethalDamageReduction',
      'pathLevels.Painless', '+=', 'Math.floor((source + 3) / 5) * 3'
    );
    rules.defineRule('combatNotes.painless', 'pathLevels.Painless', '+=', null);
    rules.defineRule('combatNotes.retributiveRage',
      'pathLevels.Painless', '+=', null
    );
    rules.defineRule('saveNotes.uncaringMind',
      'pathLevels.Painless', '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('saveNotes.painless',
      'pathLevels.Painless', '=', 'Math.floor((source + 4) / 5) * 5'
    );

  } else if(name == 'Pureblood') {

    rules.defineRule('featureRules.featBonus',
      'pathLevels.Pureblood', '+=', 'Math.floor((source - 3) / 5)'
    );
    rules.defineRule('selectableFeatureCount.Pureblood',
      'pathLevels.Pureblood', '=', 'source>=5 ? Math.floor(source / 5) : null'
    );
    rules.defineRule('skillNotes.skillFixation',
      'pathLevels.Pureblood', '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('skillNotes.bloodOfKings',
      'pathLevels.Pureblood', '+=', 'Math.floor((source + 3) / 5) * 2'
    );
    rules.defineRule('skillNotes.masterAdventurer',
      'pathLevels.Pureblood', '+=', 'Math.floor((source + 4) / 5) * 2'
    );

  } else if(name == 'Quickened') {

    rules.defineRule('abilityNotes.fastMovement',
      'pathLevels.Quickened', '+=', 'Math.floor((source + 2) / 5) * 5'
    );
    rules.defineRule('combatNotes.armorClassBonus',
      'features.Armor Class Bonus', '=', null
    );
    rules.defineRule('combatNotes.burstOfSpeed',
      'constitutionModifier', '+=', 'source + 3'
    );
    rules.defineRule('combatNotes.burstOfSpeed.1',
      'pathLevels.Quickened', '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('combatNotes.initiativeBonus',
      'pathLevels.Quickened', '+=', 'Math.floor((source + 4) / 5) * 2'
    );
    rules.defineRule('quickenedFeatures.Armor Class Bonus',
      'level', '+', 'Math.floor((source - 2) / 5)'
    );
    rules.defineRule('quickenedFeatures.Dexterity Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );

  } else if(name == 'Seaborn') {

    rules.defineRule('deepLungsMultiplier',
      'seabornFeatures.Deep Lungs', '^=', '2',
      'pathLevels.Seaborn', '+', 'source >= 6 ? 2 : 1'
    );
    rules.defineRule('magicNotes.aquaticAlly',
      'pathLevels.Seaborn', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.coldResistance',
      'pathLevels.Seaborn', '+=', 'source >= 14 ? 5 : null'
    );
    rules.defineRule('skillNotes.aquaticBlindsight',
      'pathLevels.Seaborn', '+=', 'Math.floor((source + 5) / 8) * 30'
    );
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', null
    );
    rules.defineRule('skillNotes.naturalSwimmer',
      'pathLevels.Seaborn', '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
    );

  } else if(name == 'Seer') {

    rules.defineRule('magicNotes.seerSight',
      'pathLevels.Seer', '=', 'Math.floor((source + 6) / 6)'
    );

  } else if(name == 'Shadow Walker') {

    rules.defineRule('featureNotes.shadowJump',
      'pathLevels.Shadow Walker', '+=', 'Math.floor(source / 4) * 10'
    );
    rules.defineRule('skillNotes.shadowVeil',
      'pathLevels.Shadow Walker', '+=', 'Math.floor((source + 2) / 4) * 2'
    );

  } else if(name == 'Speaker') {

    rules.defineRule('speakerFeatures.Charisma Bonus',
      'level', '+', 'Math.floor((source - 5) / 5)'
    );
    rules.defineRule('magicNotes.powerWords',
      'pathLevels.Speaker', '=',
      '"Opening" + (source >= 6 ? "/Shattering" : "") + ' +
                  '(source >= 9 ? "/Silence" : "") + ' +
                  '(source >= 13  ? "/Slumber" : "") + ' +
                  '(source >= 16 ? "/Charming" : "") + ' +
                  '(source >= 19 ? "/Holding" : "")'
    );
    rules.defineRule('magicNotes.powerWords.1',
      'charismaModifier', '=', 'source + 3'
    );
    rules.defineRule('magicNotes.powerWords.2',
      'charismaModifier', '=', 'source + 10'
    );
    rules.defineRule('skillNotes.persuasiveSpeaker',
      'pathLevels.Speaker', '=',
      'source >= 17 ? 8 : source >= 11 ? 6 : source >= 7 ? 4 : 2'
    );

  } else if(name == 'Spellsoul') {

    rules.defineRule('highestMagicModifier',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
    rules.defineRule('magicNotes.metamagicAura',
      'pathLevels.Spellsoul', '=',
      '(source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1) + "/day " + ' +
      '["enlarge"].concat(source >= 5 ? ["extend"] : [])' +
                 '.concat(source >= 8 ? ["reduce"] : [])' +
                 '.concat(source >= 11 ? ["attract"] : [])' +
                 '.concat(source >= 14 ? ["empower"] : [])' +
                 '.concat(source >= 17 ? ["maximize"] : [])' +
                 '.concat(source >= 20 ? ["redirect"] : []).sort().join("/")'
    );
    rules.defineRule('magicNotes.metamagicAura',
      'pathLevels.Spellsoul', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.untappedPotential',
      'highestMagicModifier', '=', 'source + 1',
      'level', '+',
        'source>=18 ? 8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : 0'
    );
    rules.defineRule('saveNotes.improvedResistSpells',
      'pathLevels.Spellsoul', '=',
      'source>=19 ? 5 : source>=16 ? 4 : source>=12 ? 3 : source>=7 ? 2 : ' +
      'source>=3 ? 1 : null'
    );

  } else if(name == 'Steelblooded') {

    /* TODO
    feats = [];
    for(var feat in rules.getChoices('feats')) {
      if(feat.match(/Weapon (Focus|Proficiency|Specialization) \(/)) {
        feats[feats.length] = feat;
      }
    }
    */
    rules.defineRule('combatNotes.offensiveTactics',
      'pathLevels.Steelblooded', '+=',
      'source>=17 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.skilledWarrior',
      'pathLevels.Steelblooded', '+=',
      'source>=18 ? 4 : source>=13 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('combatNotes.strategicBlow',
      'pathLevels.Steelblooded', '+=',
      'source>=16 ? 15 : source>=12 ? 12 : source>=9 ? 9 : source>=6 ? 6 : 3'
    );
    rules.defineRule('featCount.Steelblooded',
      'pathLevels.Steelblooded', '=', '1 + Math.floor(source / 5)'
    );

  } else if(name == 'Sunderborn') {

    rules.defineRule('combatNotes.planarFury',
      'constitutionModifier', '+=', 'Math.floor((source + 2) / 6)'
    );
    rules.defineRule('combatNotes.planarFury.1',
      'pathLevels.Sunderborn', '+=', 'Math.floor((source + 2) / 6)'
    );
    rules.defineRule('skillNotes.bloodOfThePlanes',
      'pathLevels.Sunderborn', '+=', 'Math.floor((source + 1) / 3) * 2'
    );

  } else if(name == 'Tactician') {

    rules.defineRule('combatNotes.aidedCombatBonus',
      'pathLevels.Tactician', '+=',
      'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : 0'
    );
    rules.defineRule('combatNotes.combatOverview',
      'pathLevels.Tactician', '+=',
      'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
    );
    rules.defineRule('combatNotes.coordinatedInitiative',
      'pathLevels.Tactician', '+=',
      'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.jointAttack',
      'pathLevels.Tactician', '+=',
      'source>=17 ? 4 : source==16 ? 3 : Math.floor(source / 4)'
    );

  } else if(name == 'Warg') {

    rules.defineRule('companionMasterLevel', 'pathLevels.Warg', '=', null);
    rules.defineRule('featureNotes.animalCompanion',
      'wargFeatures.Animal Companion', '+=', null
    );
    rules.defineRule('wargFeatures.Animal Companion',
      'level', '+', 'Math.floor((source - 2) / 4)'
    );
    rules.defineRule('magicNotes.wildShape',
      'pathLevels.Warg', '=',
      'source >= 19 ? "medium-huge" : ' +
      'source >= 11 ? "medium-large" : ' +
      'source >= 5 ? "medium" : null'
    );
    rules.defineRule('magicNotes.wildShape.1',
      'pathLevels.Warg', '=', 'source >= 15 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('selectableFeatureCount.Warg',
      'pathLevels.Warg', '=', 'source >= 16 ? 3 : source >= 9 ? 2 : 1'
    );
    rules.defineRule('skillNotes.wildEmpathy', 'pathLevels.Warg', '+=', null);

  }

};

/* Defines in #rules# the rules associated with language #name#. */
LastAge.languageRules = function(rules, name) {
  LastAge.baseRules.languageRules(rules, name);
  // TODO
};

/* TODO
  rules.defineRule('spellDifficultyClass.B',
    'casterLevels.B', '?', null,
    'charismaModifier', '=', '10 + source'
  );
  rules.defineRule('spellDifficultyClass.Ch',
    'casterLevels.Ch', '?', null,
    'charismaModifier', '=', '10 + source',
    'intelligenceModifier', '^', '10 + source',
    'wisdomModifier', '^', '10 + source'
  );
  rules.defineRule('spellDifficultyClass.D',
    'casterLevels.D', '?', null,
    'wisdomModifier', '=', '10 + source'
  );
  rules.defineRule('spellDifficultyClass.W',
    'casterLevels.W', '?', null,
    'intelligenceModifier', '=', '10 + source'
  );
  rules.defineRule('maxSpellLevel',
    'casterLevels.Ch', '?', null,
    'level', '=', 'source / 2',
    'features.Art Of Magic', '+', '1/2'
  );
  for(var i = 0; i < 10; i++) {
    rules.defineRule('spellsKnown.Ch' + i,
      'maxSpellLevel', '?', 'Math.floor(source) == ' + i,
      'spellsKnownBonus', '=', null
    );
  }
  rules.defineSheetElement('Spell Energy', 'Spells Per Day');

*/

/*
 * Defines in #rules# the rules associated with race #name#. #features# lists
 * associated features and #languages# the automatic languages. #spells# lists
 * any natural spells, for which #spellAbility# is used to compute the save DC.
 */
LastAge.raceRules = function(
  rules, name, features, languages, spellAbility, spells, spellDict
) {
  LastAge.baseRules.raceRules
    (rules, name, features, languages, spellAbility, spells, spellDict);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
 */
LastAge.raceRulesExtra = function(rules, name) {

/* TODO
  for(var i = 0; i < languages.length; i++) {
    var language = languages[i];
    rules.defineRule('languages.' + language,
      'race', '+=',
      'LastAge.racesLanguages[source] == null ? null : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':3")>=0 ? 3 : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':2")>=0 ? 2 : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':1")>=0 ? 1 : ' +
      'null'
    );
  }
  rules.defineChoice('languages', languages);
  rules.defineRule('languageCount',
    'race', '=',
      'LastAge.racesLanguages[source] == null ? 0 : ' +
      'eval(LastAge.racesLanguages[source].replace(/\\D+/g, "+"))',
    'intelligenceModifier', '+', 'source > 0 ? source : null',
    'skillModifier.Speak Language', '+', '2 * source'
  );

  rules.defineRule('skillNotes.favoredRegion',
    'race', '=', 'LastAge.racesFavoredRegions[source]'
  );
*/
  rules.defineRule('features.Illiteracy', '', '=', '1');
  rules.defineRule
    ('skillModifier.Speak Language', 'skillNotes.illiteracy', '+', '-2');

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(race == 'Dorn') {

    rules.defineRule('featCount.Fighter',
      'featureNotes.dornFeatCountBonus', '+=', null
    );
    rules.defineRule('featureNotes.dornFeatCountBonus',
      'race', '=', 'source == "Dorn" ? 1 : null'
    );
    rules.defineRule('skillNotes.dornSkillPointsBonus',
      'race', '?', 'source == "Dorn"',
      'level', '=', 'source + 3'
    );

  } else if(race.indexOf(' Dwarf') >= 0) {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
    );
    if(race == 'Clan Dwarf') {
      rules.defineRule('skillNotes.stonecunningFeature',
        'clanDwarfFeatures.Stonecunning', '+=', '2'
      );
    }

  } else if(race.indexOf(' Dwarrow') >= 0) {

    if(race == 'Clan-Raised Dwarrow') {
      rules.defineRule('skillNotes.stonecunningFeature',
        'clanRaisedDwarrowFeatures.Stonecunning', '+=', '2'
      );
    } else if(race == 'Gnome-Raised Dwarrow') {
      rules.defineRule('deepLungsMultiplier',
        'gnomeRaisedDwarrowFeatures.Deep Lungs', '=', '3'
      );
      rules.defineRule('skillNotes.deepLungsFeature',
        'deepLungsMultiplier', '=', null,
        'constitution', '*', 'source'
      );
      rules.defineRule('skillNotes.naturalSwimmerFeature',
        'speed', '=', 'Math.floor(source / 2)'
      );
    }

  } else if(race.indexOf(' Dworg') >= 0) {

    if(race == 'Clan-Raised Dworg') {
      rules.defineRule('skillNotes.stonecunningFeature',
        'clanRaisedDworgFeatures.Stonecunning', '+=', '2'
      );
    }

  } else if(race.indexOf(' Elfling') >= 0) {

    if(race == 'Halfling-Raised Elfling') {
      rules.defineRule('features.Mounted Combat',
        'featureNotes.boundToTheBeastFeature', '=', '1'
      );
    }

  } else if(race.indexOf(' Elf') >= 0) {

    if(race == 'Jungle Elf') {
      rules.defineRule('magicNotes.innateMagicFeature',
        'magicNotes.improvedInnateMagicFeature', '+', '1'
      );
      rules.defineRule
        ('skillNotes.feralElfFeature2', 'features.Feral Elf', '=', '1');
    } else if(race == 'Sea Elf') {
      rules.defineRule('deepLungsMultiplier',
        'seaElfFeatures.Deep Lungs', '=', '6'
      );
      rules.defineRule('skillNotes.deepLungsFeature',
        'deepLungsMultiplier', '=', null,
        'constitution', '*', 'source'
      );
      rules.defineRule('skillNotes.naturalSwimmerFeature',
        'speed', '=', 'Math.floor(source / 2)'
      );
    } else if(race == 'Wood Elf') {
      rules.defineRule('magicNotes.innateMagicFeature',
        'magicNotes.improvedInnateMagicFeature', '+', '1'
      );
      rules.defineRule('skillNotes.woodElfSkillPointsBonus',
        'race', '?', 'source == "Wood Elf"',
        'level', '=', 'source'
      );
    }

  } else if(race == 'Erenlander') {

    rules.defineRule('abilityNotes.erenlanderAbilityAdjustment',
      'race', '=', 'source == "Erenlander" ? 1 : null'
    );
    rules.defineRule('featureNotes.erenlanderFeatCountBonus',
      'race', '=', 'source == "Erenlander" ? 2 : null'
    );
    rules.defineRule('skillNotes.erenlanderSkillPointsBonus',
      'race', '?', 'source == "Erenlander"',
      'level', '=', '(source + 3) * 2'
    );

  } else if(race == 'Gnome') {

    rules.defineRule
      ('deepLungsMultiplier', 'gnomeFeatures.Deep Lungs', '=', '3');
    rules.defineRule('skillNotes.deepLungsFeature',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
    rules.defineRule('skillNotes.naturalSwimmerFeature',
      'speed', '=', 'Math.floor(source / 2)'
    );

  } else if(race.indexOf(' Halfling') >= 0) {

    if(race == 'Agrarian Halfling') {
      selectableFeatures = ['Stout', 'Studious'];
      rules.defineRule('agrarianHalflingFeatures.Endurance',
        'featureNotes.stoutFeature', '=', '1'
      );
      rules.defineRule('agrarianHalflingFeatures.Toughness',
        'featureNotes.stoutFeature', '=', '1'
      );
      rules.defineRule('agrarianHalflingFeatures.Magecraft (Hermetic)',
        'featureNotes.studiousFeature', '=', '1'
      );
      rules.defineRule('features.Endurance',
        'agrarianHalflingFeatures.Endurance', '=', '1'
      );
      rules.defineRule('features.Magecraft (Hermetic)',
        'agrarianHalflingFeatures.Magecraft (Hermetic)', '=', '1'
      );
      rules.defineRule('features.Toughness',
        'agrarianHalflingFeatures.Toughness', '=', '1'
      );
      rules.defineRule('selectableFeatureCount.Agrarian Halfling',
        'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
      );
    } else if(race == 'Nomadic Halfling') {
      selectableFeatures = ['Bound To The Beast', 'Bound To The Spirits'];
      rules.defineRule('features.Magecraft (Spiritual)',
        'nomadicHalflingFeatures.Magecraft (Spiritual)', '=', '1'
      );
      rules.defineRule('features.Mounted Combat',
        'nomadicHalflingFeatures.Mounted Combat', '=', '1'
      );
      rules.defineRule('nomadicHalflingFeatures.Magecraft (Spiritual)',
        'featureNotes.boundToTheSpiritsFeature', '=', '1'
      );
      rules.defineRule('nomadicHalflingFeatures.Mounted Combat',
        'featureNotes.boundToTheBeastFeature', '=', '1'
      );
      rules.defineRule('selectableFeatureCount.Nomadic Halfling',
        'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
      );
    }

  } else if(race == 'Orc') {

    rules.defineRule
      ('skillNotes.naturalPredatorFeature', 'strengthModifier', '=', null);

  } else if(race.indexOf(' Sarcosan') >= 0) {

    rules.defineRule('featureNotes.sarcosanFeatCountBonus',
      'race', '=', 'source.indexOf("Sarcosan") >= 0 ? 1 : null'
    );
    rules.defineRule('skillNotes.sarcosanSkillPointsBonus',
      'race', '?', 'source.indexOf("Sarcosan") >= 0',
      'level', '=', 'source + 3'
    );

  }

};

/* Defines in #rules# the rules associated with magic school #name#. */
LastAge.schoolRules = function(rules, name, features) {
  LastAge.baseRules.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills
 * and yields a #spellFail# percent chance of arcane spell failure.
 */
LastAge.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  LastAge.baseRules.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #untrained#, if
 * specified is a boolean indicating whether or not the skill can be used
 * untrained; the default is true. #classes# lists the classes for which this
 * is a class skill; a value of "all" indicates that this is a class skill for
 * all classes. #synergies#, if specified, lists synergies to other skills and
 * abilities granted by high ranks in this skill.
 */
LastAge.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  LastAge.baseRules.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
LastAge.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  LastAge.baseRules.spellRules
    (rules, name, school, casterGroup, level, description);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
LastAge.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range
) {
  LastAge.baseRules.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
};

/*
 * Replaces references to SRD35 skills in each element of #arr# with the
 * appropriate Pathfinder skill.
 */
LastAge.SRD35ToPathfinder = function(arr) {
  if(arr == null)
    return null;
  var pieces;
  var result = [];
  for(var i = 0; i < arr.length; i++) {
    var item = arr[i];
    var prefix = '';
    var matchInfo = item.match(/(.*:((\+|-)\S+\s+)?)(.*)/);
    if(matchInfo) {
      item = matchInfo[4];
      prefix = matchInfo[1];
    }
    pieces = item.split('/');
    var newPieces = [];
    for(var j = 0; j < pieces.length; j++) {
      var piece = pieces[j];
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        if(piece.indexOf(skill) >= 0) {
          if(Pathfinder.SRD35_SKILL_MAP[skill] == '') {
            piece = '';
          } else {
            piece = piece.replace(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
          }
          break;
        }
      }
      if(piece != '' && newPieces.indexOf(piece) < 0) {
        newPieces.push(piece);
      }
    }
    if(newPieces.length > 0) {
      var newItem = prefix + newPieces.join('/');
      if(result.indexOf(newItem) < 0)
        result.push(newItem);
    }
  }
  return result;
}

/* Sets #attributes#'s #attribute# attribute to a random value. */
LastAge.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'languages') {
    var attrs = this.applyRules(attributes);
    var choices;
    var howMany =
      attrs.languageCount - QuilvynUtils.sumMatching(attrs, /^languages\./);
    if(attrs.race == null || LastAge.racesLanguages[attrs.race] == null) {
      // Allow any non-restricted language
      choices = QuilvynUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/)) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else if(LastAge.racesLanguages[attrs.race].indexOf('Any') >= 0) {
      // Allow (at least) any non-restricted language
      choices = QuilvynUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/) &&
           LastAge.racesLanguages[attrs.race].indexOf(choices[i]) < 0) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else {
      // Allow only those listed for this race
      choices =
        LastAge.racesLanguages[attrs.race].replace(/:\d*/g, '').split('/');
    }
    while(howMany > 0 && choices.length > 0) {
      var i = QuilvynUtils.random(0, choices.length - 1);
      var language = choices[i];
      var attr = 'languages.' + language;
      var currentPoints = attrs[attr] == null ? 0 : attrs[attr];
      var maxPoints = 'Black Tongue/Patrol Sign'.indexOf(language) < 0 ? 3 : 1;
      if(currentPoints < maxPoints) {
        // Maximize half the time; otherwise, randomize
        var addedPoints = QuilvynUtils.random(0, 99) < 50 ?
                          maxPoints - currentPoints:
                          QuilvynUtils.random(1, maxPoints - currentPoints);
        if(addedPoints > howMany)
          addedPoints = howMany;
        attrs[attr] = currentPoints + addedPoints;
        attributes[attr] =
          (attributes[attr] == null ? 0 : attributes[attr]) + addedPoints;
        howMany -= addedPoints;
      } else {
        choices = choices.slice(0, i).concat(choices.slice(i + 1));
      }
    }
  } else if(attribute == 'spells') {
    var attrs = this.applyRules(attributes);
    var spells = LastAge.rules.getChoices('spells');
    for(var attr in attrs) {
      var matchInfo = attr.match(/^spellsKnown\.([A-Z][A-Za-z]*)([0-9])$/);
      if(!matchInfo)
        continue;
      var abbr = matchInfo[1];
      var level = matchInfo[2];
      var magecraftSchools = QuilvynUtils.getKeys(attrs, /^features.Spellcasting/).map(x =>  x.replace(/.*\(|\).*/g, '').substring(0, 4)); 
      var spellPat = new RegExp
        ('\\(' + abbr + (abbr == 'Ch' ? '[0-' + level + '] (' + magecraftSchools.join('|') + ')' : level));
      var knownAlready = new Set(QuilvynUtils.getKeys(attrs, spellPat));
      var choices =
        QuilvynUtils.getKeys(spells, spellPat).filter(x=>!knownAlready.has(x));
      for(var leftToPick = attrs[attr] - knownAlready.size;
          leftToPick > 0 && choices.length > 0;
          leftToPick--) {
        var index = QuilvynUtils.random(0, choices.length - 1);
        attributes['spells.' + choices[index]] = 1;
        choices.splice(index, 1);
      }
    }
  } else {
    LastAge.baseRules.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
LastAge.ruleNotes = function() {
  return '' +
    '<h2>LastAge Quilvyn Module Notes</h2>\n' +
    'LastAge Quilvyn Module Version ' + LASTAGE_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Racial origin choices (e.g., Plains/Urban Sarcosan, Clan/Kurgun\n' +
    '    Dwarf) are absorbed into the list of races.\n' +
    '  </li><li>\n' +
    '    Quilvyn lists Greater Conjuration and Greater Evocation as separate\n' +
    '    schools and uses Conjuration and Evocation to represent the\n' +
    '    lesser variety.  This simplfies the spell list and treats legate\n' +
    '    and druid spells from these schools as the lesser variety.  It\n' +
    '    also makes the Greater Spellcasting feat moot; use Spellcasting\n' +
    '    (Greater Conjuration) or Spellcasting (Greater Evocation) instead.\n' +
    '  </li><li>\n' +
    '    The rule book uses several feature names multiple times with\n' +
    '    different effects.  For example, the Orc "Cold Resistance" feature\n' +
    '    grants immunity to non-lethal damage and half damage from lethal\n' +
    '    cold, while the Northblooded and Seaborn feature of the same name\n' +
    '    grants damage reduction.  In these cases Quilvyn uses a different\n' +
    '    name for one of the features in order to remove the ambiguity.\n' +
    '    The renamed features are: Orc "Cold Resistance" (renamed\n' +
    '    "Improved Cold Fortitude" to distinguish from the Northblooded and\n' +
    '    Seaborn feature); Chanceborn "Survivor" (renamed "Persistence" to\n' +
    '    distinguish from the Fighter feature); Insurgent Spy "Conceal\n' +
    '    Magic" (renamed "Conceal Aura" to distinguish from the Bane Of\n' +
    '    Legates feature); Pureblood "Skill Mastery" (renamed "Skill\n' +
    '    Fixation" to distinguish from the Wildlander feature); Spellsoul\n' +
    '    "Resistance" (renamed "Improved Spell Resistance" to distinguish\n' +
    '    from other resistance features); Tactician "Coordinated Attack"\n' +
    '    (renamed "Joint Attack" to distinguish from the Wogren Rider\n' +
    '    feature); prestige class "Improved Spellcasting" (split into "Art\n' +
    '    Of Magic" and bonus spells and points to distinguish from the\n' +
    '    Dragonblooded feature).  Also, the Survival bonus granted by the\n' +
    '    Mountainborn "Mountaineer" feature is treated as a separate\n' +
    '    feature ("Mountain Survival") for consistency with the Dwarf\n' +
    '    "Mountaineer" feature.\n' +
    '  </li><li>\n' +
    '    In situations where a feature has very different effects at\n' +
    '    different character levels, Quilvyn uses a different feature name\n' +
    '    for each effect.  For example, the Giantblooded "Size Features"\n' +
    '    feature is replaced by "Obvious" at level 1, "Large" at level 10,\n' +
    '    and "Extra Reach" at level 20.  Other instances: Ironborn level\n' +
    '    14 "Improved Healing" becomes "Ability Recovery"; Mountaineer\n' +
    '    "Ambush" becomes "Improved Ambush", "Quick Ambush", and "Sniping\n' +
    '    Ambush" at levels 8, 13, and 18; Painless "Retributive Rage"\n' +
    '    becomes "Improved Retributive Rage" at level 14; Steelborn\n' +
    '    "Untouchable" becomes "Improved Untouchable" at level 19;\n' +
    '    Sunderborn "Spirit Sight" becomes "Darkvision", "Magical\n' +
    '    Darkvision", and "See Invisible" at levels 7, 13, and 19;\n' +
    '    Tactician "Aid Another" becomes "Aided Combat Bonus" at level 5;\n' +
    "    Aradil's Eye \"Alter Ego\" becomes \"Quick Alteration\" and\n" +
    '    "Nonmagical Alteration" at levels 5 and 9; Whisper Adept "Whisper\n' +
    '    Sense" becomes "Whisper Initiative", "Whisper Surprise", "Whisper\n' +
    '    Clairaudience", "Whisper Clairvoyance", and "Whisper Commune" at\n' +
    '    levels 2, 4, 6, 8, and 10.\n' +
    '  </li><li>\n' +
    "    The rule book incorrectly lists Bear's Endurance as a spell\n" +
    '    acquired at the level 4 Beast heroic path.  Quilvyn corrects this\n' +
    "    to Bull's Endurance.\n" +
    '  </li><li>\n' +
    '    The Wogren Rider selectable features "Improved Ride-By Attack",\n' +
    '    "Improved Spirited Charge", and "Improved Trample" only apply if\n' +
    '    the character already has the corresponding unimproved feat.\n' +
    '    Select the "Ride-By Attack", "Spirited Charge", and "Trample"\n' +
    '    selectable features otherwise.\n' +
    '  </li><li>\n' +
    '    The selectable feature list includes "Alertness" and "Improved\n' +
    '    Initiative" directly, instead of the Wildlander "Rapid Response"\n' +
    '    trait that allows a choice between these two feats.  Similarly,\n' +
    '    the selectable feature list separates "Initiative Bonus" from\n' +
    '    "Danger Sense", since "Danger Sense" requires choosing between\n' +
    '    initiative and listen/spot bonuses after level 1.\n' +
    '  </li><li>\n' +
    '    Quilvyn treats Eranlanders as familiar with all Dornish and\n' +
    '    Sarcosan weapons, rather than with a single one.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Language synergy is not reported.\n' +
    '  </li><li>\n' +
    '    Quilvyn does not report a validation error for a character with\n' +
    '    pidgin language competence in Courtier or High Elven.  Note that\n' +
    '    the rule book violates this rule by specifying that Orcs have\n' +
    '    pidgin competence in High Elven.\n' +
    '  </li><li>\n' +
    '    For characters with the Naturefriend heroic path, Quilvyn makes\n' +
    '    Knowledge (Nature) and Survival class skills and gives a +2 bonus\n' +
    '    in those skills, rather than applying the bonus only if the\n' +
    '    character already has those as class skills.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>';
};

// Language synergies:
// Pidgin Colonial or Norther -> Pidgin Erenlander
// Basic Colonial and Norther -> Basic Erenlander
// Basic High Elven -> Pidgin Jungle Mouth
// Basic Halfling -> Pidgin Jungle Mouth
// Basic Jungle Mouth -> Pidgin Halfling
// Basic Colonial -> Pidgin Trader's Tongue
// Basic Erenlander -> Pidgin Trader's Tongue
// Basic Halfling -> Pidgin Trader's Tongue
// Basic High Elven -> Pidgin Trader's Tongue
// Basic Norther -> Pidgin Trader's Tongue
// Basic Old Dwarven -> Pidgin Trader's Tongue
