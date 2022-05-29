/*
Copyright 2021, James J. Hayes

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

/* jshint esversion: 6 */
/* jshint forin: false */
/* globals SRD5E, PHB5E, Tasha, Volo, Xanathar, Quilvyn, QuilvynRules, QuilvynUtils */
"use strict";

/*
 * This module loads the rules from the Midnight Legacy of Darkness rule book.
 * The MidnightLegacy function contains methods that load rules for particular
 * parts of the rules; raceRules for character races, magicRules for spells,
 * etc. These member methods can be called independently in order to use a
 * subset of the rules. Similarly, the constant fields of MidnightLegacy
 * (BACKGROUNDS, PATHS, etc.) can be manipulated to modify the choices.
 */
function MidnightLegacy() {

  if(window.SRD5E == null) {
    alert('The MidnightLegacy module requires use of the SRD5E module');
    return;
  }

  var basePlugin = window.PHB5E != null ? PHB5E : SRD5E;

  var rules = new QuilvynRules('Midnight Legacy', MidnightLegacy.VERSION);
  MidnightLegacy.rules = rules;

  rules.defineChoice('choices', SRD5E.CHOICES);
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = MidnightLegacy.choiceRules;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = MidnightLegacy.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = MidnightLegacy.ruleNotes;

  SRD5E.createViewers(rules, SRD5E.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'background:Background,select-one,backgrounds',
    'race:Race,select-one,races',
    'heroicPath:Heroic Path,select-one,heroicPaths',
    'levels:Class Levels,bag,levels');

  MidnightLegacy.BACKGROUNDS =
    Object.assign({}, basePlugin.BACKGROUNDS, MidnightLegacy.BACKGROUNDS_ADDED);
  MidnightLegacy.FEATS =
    Object.assign({}, basePlugin.FEATS, MidnightLegacy.FEATS_ADDED);
  MidnightLegacy.FEATURES =
    Object.assign({}, basePlugin.FEATURES, MidnightLegacy.FEATURES_ADDED);
  MidnightLegacy.PATHS =
    Object.assign({}, basePlugin.PATHS, MidnightLegacy.PATHS_ADDED);
  MidnightLegacy.RACES =
    Object.assign({}, basePlugin.RACES, MidnightLegacy.RACES_ADDED);
  MidnightLegacy.SPELLS =
    Object.assign({}, basePlugin.SPELLS, MidnightLegacy.SPELLS_ADDED);
  MidnightLegacy.WEAPONS =
    Object.assign({}, basePlugin.WEAPONS, MidnightLegacy.WEAPONS_ADDED);

  SRD5E.abilityRules(rules);
  SRD5E.combatRules
    (rules, basePlugin.ARMORS, basePlugin.SHIELDS, MidnightLegacy.WEAPONS);
  SRD5E.magicRules(rules, basePlugin.SCHOOLS, MidnightLegacy.SPELLS);
  SRD5E.identityRules(
    rules, basePlugin.ALIGNMENTS, MidnightLegacy.BACKGROUNDS,
    MidnightLegacy.CLASSES, MidnightLegacy.DEITIES, MidnightLegacy.PATHS,
    MidnightLegacy.RACES
  );
  SRD5E.talentRules
    (rules, MidnightLegacy.FEATS, MidnightLegacy.FEATURES, SRD5E.GOODIES,
     SRD5E.LANGUAGES, SRD5E.SKILLS, basePlugin.TOOLS);

  if(window.Tasha != null)
    Tasha('Tasha', rules);
  if(window.Volo != null) {
    if(Volo.CHARACTER_RACES_IN_PLAY)
      Volo('Character', rules);
    if(Volo.MONSTROUS_RACES_IN_PLAY)
      Volo('Monstrous', rules);
  }
  if(window.Xanathar != null)
    Xanathar('Xanathar', rules);

  Quilvyn.addRuleSet(rules);

}

MidnightLegacy.VERSION = '2.3.1.0';

MidnightLegacy.BACKGROUNDS_ADDED = {
  'Former Slave':
    'Equipment=' +
       '"Common Clothes","50\' Rope","Basic Tool","Pair Of Shackles" ' + 
    'Features=' +
      '"Skill Proficiency (Athletics/Deception)",' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Knowledge Of The Enemy"',
  'Freedom Fighter':
    'Equipment=' +
      '"Disguise Kit","Forgery Kit","Poisoner\'s Kit","Nondescript Clothing",' +
      '"Dark Cloak And Hood","Belt With Hidden Pouch" ' +
    'Features=' +
      '"Skill Proficiency (Animal Handling/Investigation)",' +
      '"Tool Proficiency (Choose 1 from Disguise Kit, Forgery Kit, Poisoner\'s Kit)",' +
      '"Sympathetic Ally"',
  'Veteran Soldier':
    'Equipment=' +
       '"Uniform With Insignia","Sturdy Boots",Bedroll,Backpack,' +
       '"1 Week\'s Rations" ' +
    'Features=' +
      '"Skill Proficiency (Athletics/Perception)",' +
      '"Weapon Proficiency (Choose 1 from any Martial)",' +
      '"Military Rank"',
  'Wildlander':
    'Equipment=' +
      'Staff,"Traveler\'s Clothes",Backpack,"2 Weeks\' Rations",' +
      '"Hunting Trap" '+
    'Features=' +
      '"Skill Proficiency (Perception/Survival)",' +
      'Survivalist ' +
    'Languages="Trader\'s Tongue",any'
};
MidnightLegacy.DEITIES = {
  'Izrador':
    'Alignment=CE Domain="Keeper Of Obsidian","Soldier Legate","Witch Taker"'
};
MidnightLegacy.FEATS_ADDED = {
  'Battlefield Healer':'Type=General',
  'Brawler':'Type=General',
  'Captor':'Type=General',
  'Fellhunter':'Type=General',
  'Harrier':'Type=General',
  'Improvised Fighter':'Type=General',
  'Knife Fighter':'Type=General',
  'Learned':'Type=General',
  'Paranoid':'Type=General',
  'Polyglot':'Type=General',
  'Scavenger':'Type=General',
  'Seamaster':'Type=General',
  'Shieldwall Soldier':'Type=General',
  'Subtle Spellcaster':'Type=General',
  'Suspicious':'Type=General',
  'Unremarkable':'Type=General'
};
MidnightLegacy.FEATURES_ADDED = {

  // Backgrounds
  'Knowledge Of The Enemy':'Section=feature Note="FILL"',
  'Sympathetic Ally':'Section=feature Note="FILL"',
  'Military Rank':'Section=feature Note="FILL"',
  'Survivalist':'Section=feature Note="FILL"',

  // Feats
  'Battlefield Healer':'Section=feature Note="FILL"',
  'Brawler':'Section=feature Note="FILL"',
  'Captor':'Section=feature Note="FILL"',
  'Fellhunter':'Section=feature Note="FILL"',
  'Harrier':'Section=feature Note="FILL"',
  'Improvised Fighter':'Section=feature Note="FILL"',
  'Knife Fighter':'Section=feature Note="FILL"',
  'Learned':'Section=feature Note="FILL"',
  'Paranoid':'Section=feature Note="FILL"',
  'Polyglot':'Section=feature Note="FILL"',
  'Scavenger':'Section=feature Note="FILL"',
  'Seamaster':'Section=feature Note="FILL"',
  'Shieldwall Soldier':'Section=feature Note="FILL"',
  'Subtle Spellcaster':'Section=feature Note="FILL"',
  'Suspicious':'Section=feature Note="FILL"',
  'Unremarkable':'Section=feature Note="FILL"',

  // Paths
  'Astirax Servant':'Section=feature Note="FILL"',
  'Astirax Servant':'Section=feature Note="FILL"',
  'Aura Of Darkness':'Section=feature Note="FILL"',
  'Bestial Astirax Servant':'Section=feature Note="FILL"',
  'Dark Warrior':'Section=feature Note="FILL"',
  "Dark God's Blessing":'Section=feature Note="FILL"',
  'Dire Bodyguard':'Section=feature Note="FILL"',
  'Dominate Undead':'Section=feature Note="FILL"',
  'Dread Avatar':'Section=feature Note="FILL"',
  'Ferocious Blow':'Section=feature Note="FILL"',
  'Impervious To Magic':'Section=feature Note="FILL"',
  'Improved Astirax Bond':'Section=feature Note="FILL"',
  'Mage Hunter':'Section=feature Note="FILL"',
  'Master Mage Hunter':'Section=feature Note="FILL"',
  'Necromantic Arts':'Section=feature Note="FILL"',
  'Potent Spellcasting':'Section=feature Note="FILL"',

  // Races
  'Animal Bond':'Section=feature Note="FILL"',
  'Born Of The Sea':'Section=feature Note="FILL"',
  'Canansil Ability Adjustment':
    'Section=feature Note="+2 Dexterity/+1 Charisma"',
  'Caransil Weapon Training':'Section=feature Note="FILL"',
  'Child Of The North':'Section=feature Note="FILL"',
  'Clan Dwarf Ability Adjustment':'Section=feature Note="+2 Constitution"',
  'Clan Warrior Training':'Section=feature Note="FILL"',
  'Danisil Ability Adjustment':
    'Section=feature Note="+2 Dexterity/+1 Intelligence"',
  'Danisil Weapon Training':'Section=feature Note="FILL"',
  'Darkvision':'Section=feature Note="FILL"',
  'Dorn Ability Adjustment':'Section=feature Note="+1 Strength/+1 any two"',
  'Dwarven Resilience':'Section=feature Note="FILL"',
  'Dwarven Toughness':'Section=feature Note="FILL"',
  'Enslaved Halfling Ability Adjustment':
    'Section=feature Note="+2 Dexterity/+1 Constitution"',
  'Erenlander Ability Adjustment':'Section=feature Note="+1 any two"',
  'Erunsil Ability Adjustment':
    'Section=feature Note="+2 Dexterity/+1 Strength"',
  'Erunsil Weapon Training':'Section=feature Note="FILL"',
  'Fast':'Section=feature Note="FILL"',
  'Ferocity':'Section=feature Note="FILL"',
  'Fey Ancestry':'Section=feature Note="FILL"',
  'Gnome Ability Adjustment':
    'Section=feature Note="+2 Intelligence/+1 Charisma"',
  'Gnomish Cunning':'Section=feature Note="FILL"',
  'Halfling Magic':'Section=feature Note="FILL"',
  'Halfling Nimbleness':'Section=feature Note="FILL"',
  'Human Feat Bonus':'Section=feature Note="FILL"',
  'Innate Magic Scholar':'Section=feature Note="FILL"',
  'Innate Magic User':'Section=feature Note="FILL"',
  'Kurgun Ability Adjustment':
    'Section=feature Note="+2 Constitution/+2 Wisdom"',
  'Kurgun Warrior Training':'Section=feature Note="FILL"',
  'Lucky':'Section=feature Note="FILL"',
  'Militant Culture':'Section=feature Note="FILL"',
  'Miransil Ability Adjustment':'Section=feature Note="+2 Dexterity/+1 Wisdom"',
  'Miransil Weapon Training':'Section=feature Note="FILL"',
  'Nomadic Halfling Ability Adjustment':
    'Section=feature Note="+2 Dexterity/+1 Wisdom"',
  'Orc Ability Adjustment':'Section=feature Note="+2 Constitution/+2 Strength"',
  'Riverfolk':'Section=feature Note="FILL"',
  'Sarcosan Ability Adjustment':
    'Section=feature Note="+1 Dexterity/+1 any two"',
  'Slow':'Section=feature Note="FILL"',
  'Stonmaster\'s Cunning':'Section=feature Note="FILL"',
  'Trance':'Section=feature Note="FILL"',
  'Troubled Dreams':'Section=feature Note="FILL"',
  'Unexpected Blow':'Section=feature Note="FILL"',
  'Wraith Of The North':'Section=feature Note="FILL"'

};
MidnightLegacy.PATHS_ADDED = {
  'Keeper Of Obsidian Domain':
    'Group=Legate Level=levels.Legate ' +
    'Features=' +
      '"1:Dark God\'s Blessing",' +
      '"1:Necromantic Arts",' +
      '"2:Astirax Servant",' +
      '"6:Dominate Undead",' +
      '"8:Potent Spellcasting",' +
      '"17:Aura Of Darkness" ' +
    'Spells=' +
      '"1:Detect Magic,Inflict Wounds",' +
      '"2:Blindness/Deafness,See Invisibility",' +
      '"3:Bind/Banish Astirax,Bestow Curse",' +
      '"4:Blight,Phantasmal Killer",' +
      '"5:Cloudkill,Contagion"',
  'Soldier Legate Domain':
    'Group=Legate Level=levels.Legate ' +
    'Features=' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Dark Warrior",' +
      '"2:Ferocious Blow",' +
      '"6:Dire Bodyguard",' +
      '"8:Bestial Astirax Servant",' +
      '"17:Dread Avatar" ' +
    'Spells=' +
      '"1:Bane,Hellish Rebuke",' +
      '"2:Magic Weapon,Darkvision",' +
      '"3:Haste,Vampiric Touch",' +
      '"4:Banishment,Stoneskin",' +
      '"5:Cone Of Cold,Hold Monster"',
  'Witch Taker Domain':
    'Group=Legate Level=levels.Legate ' +
    'Features=' +
      '"1:Weapon Proficiency (Halberd/Longsword/Rapier/Shortsword)",' +
      '"1:Astirax Servant",' +
      '"2:Mage Hunter",' +
      '"6:Improved Astirax Bond",' +
      '"8:Master Mage Hunter",' +
      '"17:Impervious To Magic" ' +
    'Spells=' +
      '"1:Detect Magic,Disguise Self",' +
      '"2:Detect Thoughts,Ray Of Enfeeblement",' +
      '"3:Bind/Banish Astirax,Counterspell",' +
      '"4:Confusion,Freedom Of Movement",' +
      '"5:Scrying,Dominate Person"'
};
MidnightLegacy.RACES_ADDED = {
  'Caransil':
    'Features=' +
      '"Skill Proficiency (Perception/Stealth)",' +
      '"Canansil Ability Adjustment",' +
      '"Caransil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic User",Trance ' +
    'Languages=Erenlander,"High Elven","Old Dwarven",Orcish,"Trader\'s Tongue"',
  'Clan Dwarf':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Clan Dwarf Ability Adjustment",' +
      '"Clan Warrior Training",Darkvision,"Dwarven Resilience",' +
      '"Dwarven Toughness",Slow,"Stonmaster\'s Cunning" ' +
    'Languages="Clan Dialect","Old Dwarven","Trader\'s Tongue",Orcish',
  'Danisil':
    'Features=' +
      '"Skill Proficiency (History)",' +
      '"Danisil Ability Adjustment",' +
      '"Danisil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic Scholar",Trance ' +
    'Languages=Halfling,"High Elven",Sylvan',
  'Dorn':
    'Features=' +
      '"Skill Proficiency (Survival/Choose 1 from any)",' +
      '"Dorn Ability Adjustment",' +
      '"Human Feat Bonus" ' +
    'Languages=Erenlander,Norther,any',
  'Enslaved Halfling':
    'Features=' +
      '"Enslaved Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness",Lucky,Slow,"Unexpected Blow" ' +
    'Languages=Erenlander,Halfling,Orcish,"Trader\'s Tongue"',
  'Erenlander':
    'Features=' +
      '"Skill Proficiency (Choose 3 from any)",' +
      '"Tool Proficiency (Land Vehicles/Choose 1 from any Artisan)",' +
      '"Erenlander Ability Adjustment",' +
      '"Human Feat Bonus",' +
    'Languages=Erenlander,any',
  'Erunsil':
    'Features=' +
      '"Skill Proficiency (Survival)",' +
      '"Erunsil Ability Adjustment",' +
      '"Erunsil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Wraith Of The North" ' +
    'Languages="High Elven",Orcish,"Trader\'s Tongue"',
  'Gnome':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Gnome Ability Adjustment",' +
      'Darkvision,"Gnomish Cunning",Riverfolk,Slow ' +
    'Languages=Eranlander,"Trader\'s Tongue",any,any',
  'Kurgun':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Kurgun Ability Adjustment",' +
      '"Kurgun Warrior Training",Darkvision,"Dwarven Resilience",Slow '  +
    'Languages="Clan Dialect","Old Dwarven","Trader\'s Tongue",Orcish',
  'Miransil':
    'Features=' +
      '"Skill Proficiency (Athletics/Insight)",' +
      '"Miransil Ability Adjustment",' +
      '"Miransil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Born Of The Sea" ' +
    'Languages="High Elven",Colonial,"Trader\'s Tongue"',
  'Nomadic Halfling':
    'Features=' +
      '"Nomadic Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness",Lucky,Slow,"Animal Bond" ' +
    'Languages=Erenlander,Halfling,Orcish,"Trader\'s Tongue"',
  'Orc':
    'Features=' +
      '"Orc Ability Adjustment",' +
      '"Child Of The North",Darkvision,Ferocity,"Militant Culture",' +
      '"Troubled Dreams" ' +
    'Languages=Orcish,"Shadow Tongue",any,any',
  'Sarcosan':
    'Features=' +
      '"Skill Proficiency (Choose 1 from Animal Handling, History/Choose 1 from any)",' +
      '"Sarcosan Ability Adjustment",' +
      '"Human Feat Bonus" ' +
    'Languages=Erenlander,Colonial,any',
};
MidnightLegacy.RACES =
  Object.assign({}, SRD5E.RACES, MidnightLegacy.RACES_ADDED);
MidnightLegacy.SPELLS_ADDED = {
  'Bind/Banish Astirax':
    'School=Divination ' +
    'Level=C3,D3,P3 ' +
    'Description="FILL"',
  'Disguise Ally':
    'School=Illusion ' +
    'Level=B2,S2,W2 ' +
    'Description="FILL"',
  'Greenshield':
    'School=Abjuration ' +
    'Level=D2 ' +
    'Description="FILL"',
  'Heed The Whisper':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  'Lifetrap':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description="FILL"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description="FILL"',
  'Silver Blood':
    'School=Abjuration ' +
    'Level=B1,S1,W1 ' +
    'Description="FILL"',
  'Silver Storm':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description="FILL"',
  'Silver Wind':
    'School=Conjuration ' +
    'Level=S4,W4 ' +
    'Description="FILL"'
};
MidnightLegacy.WEAPONS_ADDED = {
  'Atharak':SRD5E.WEAPONS.Whip,
  'Cedeku':SRD5E.WEAPONS.Scimitar,
  'Dornish Horse Spear':SRD5E.WEAPONS.Halberd,
  'Erunsil Fighting Knife':SRD5E.WEAPONS.Dagger,
  'Greater Vardatch':SRD5E.WEAPONS.Greataxe,
  'Inutek':SRD5E.WEAPONS.Net,
  'Halfling Lance':SRD5E.WEAPONS.Lance,
  'Staghorn':SRD5E.WEAPONS.Dagger,
  'Urutuk':SRD5E.WEAPONS.Handaxe,
  'Vardatch':SRD5E.WEAPONS.Battleaxe
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
MidnightLegacy.choiceRules = function(rules, type, name, attrs) {
  var basePlugin = window.PHB5E != null ? PHB5E : SRD5E;
  basePlugin.choiceRules(rules, type, name, attrs);
  if(type == 'Feat')
    MidnightLegacy.featRulesExtra(rules, name);
  else if(type == 'Path')
    MidnightLegacy.pathRulesExtra(rules, name);
  else if(type == 'Race')
    MidnightLegacy.raceRulesExtra(rules, name);
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
MidnightLegacy.featRulesExtra = function(rules, name) {
  if(name == 'Svirfneblin Magic') {
    SRD5E.featureSpells(
      rules, 'Svirfneblin Magic', 'W', 'level',
      ['Disguise Self,Blur,Blindness/Deafness,Nondetection']
    );
  }
};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to pathRules.
 */
MidnightLegacy.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Arcana Domain') {
    rules.defineRule
      ('combatNotes.arcaneAbjuration', 'spellDifficultyClass.C', '=', null);
    rules.defineRule('combatNotes.arcaneAbjuration.1',
      'features.Arcane Abjuration', '?', null,
      pathLevel, '=', 'source>=5 ? ", banish up to CR " + (source<8 ? "1/2" : source>=17 ? 4 : Math.floor((source - 5) / 3)) : ""'
    );
    rules.defineRule('spellSlots.W0', 'magicNotes.arcaneInitiate', '+=', '2');
    rules.defineRule('spellSlots.W6', 'magicNotes.arcaneMastery', '+=', '1');
    rules.defineRule('spellSlots.W7', 'magicNotes.arcaneMastery', '+=', '1');
    rules.defineRule('spellSlots.W8', 'magicNotes.arcaneMastery', '+=', '1');
    rules.defineRule('spellSlots.W9', 'magicNotes.arcaneMastery', '+=', '1');
    rules.defineRule('casterLevels.W', 'casterLevels.Arcana', '^=', null);
  } else if(name == 'Bladesinging') {
    // Copied from Tasha's
    // Have to hard-code these proficiencies, since featureRules only handles
    // notes w/a single type of granted proficiency
    rules.defineRule
      ('armorProficiency.Light', 'combatNotes.trainingInWarAndSong', '=', '1');
    rules.defineRule
      ('weaponChoiceCount', 'combatNotes.trainingInWarAndSong', '+=', '1');
    rules.defineRule('combatNotes.bladesong',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.songOfVictory',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.extraAttack', pathLevel, '+=', '1');
    rules.defineRule('magicNotes.bladesong',
      'intelligenceModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Mastermind') {
    // Have to hard-code these proficiencies, since featureRules only handles
    // notes w/a single type of granted proficiency
    rules.defineRule
      ('toolProficiency.Disguise Kit', 'skillNotes.masterOfIntrigue', '=', '1');
    rules.defineRule
      ('toolProficiency.Forgery Kit', 'skillNotes.masterOfIntrigue', '=', '1');
    rules.defineRule
      ('toolChoiceCount', 'skillNotes.masterOfIntrigue', '+=', '1');
  } else if(name == 'Oath Of The Crown') {
    rules.defineRule('combatNotes.championChallenge',
      'spellDifficultyClass.P', '=', null
    );
    rules.defineRule('magicNotes.turnTheTide',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Path Of The Battlerager') {
    rules.defineRule('combatNotes.battleragerArmor.1',
      'features.Battlerager Armor', '?', null,
      'strengthModifier', '=', null
    );
    rules.defineRule('combatNotes.recklessAbandon',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
  } else if(name == 'Path Of The Totem Warrior (Elk)') {
    rules.defineRule
      ('combatNotes.elkTotemicAttunement', 'strengthModifier', '=', null);
    rules.defineRule('combatNotes.elkTotemicAttunement.1',
      'features.Elk Totemic Attunement', '?', null,
      'strengthModifier', '=', '8 + source',
      'proficiencyBonus', '+', null
    );
  } else if(name == 'Purple Dragon Knight') {
    rules.defineRule
      ('combatNotes.inspiringSurge', pathLevel, '=', 'source>=18 ? 2 : 1');
    rules.defineRule('combatNotes.rallyingCry', pathLevel, '=', null);
    rules.defineRule('featureNotes.royalEnvoy.1',
      'features.Royal Envoy', '?', null,
      'proficiencyBonus', '=', null
    );
    rules.defineRule
      ('skills.Persuasion', 'featureNotes.royalEnvoy.1', '+', null);
  } else if(name == 'Storm Sorcery') {
    // Copied from Xanathar
    rules.defineRule("combatNotes.storm'sFury", pathLevel, '=', null);
    rules.defineRule("combatNotes.storm'sFury.1",
      "features.Storm's Fury", '?', null,
      'spellDifficultyClass.S', '=', null
    );
    rules.defineRule('languageCount', 'skillNotes.windSpeaker', '+', '5');
    rules.defineRule('languages.Aquan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Auran', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Ignan', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule
      ('languages.Primordial', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule('languages.Terran', 'skillNotes.windSpeaker', '=', '1');
    rules.defineRule
      ('magicNotes.heartOfTheStorm', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('magicNotes.windSoul', 'charismaModifier', '=', '3 + source');
  } else if(name == 'Swashbuckler') {
    // Copied from Xanathar
    rules.defineRule('combatNotes.rakishAudacity.1',
      'features.Rakish Audacity', '?', null,
      'charismaModifier', '=', null
    );
    // Dummy rule to italicize combatNotes.rakishAudacity
    rules.defineRule('initiative', 'combatNotes.rakishAudacity', '+', '0');
  } else if(name == 'The Undying') {
    rules.defineRule
      ('combatNotes.amongTheDead', 'spellDifficultyClass.K', '=', null);
    rules.defineRule('combatNotes.defyDeath',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('combatNotes.indestructibleLife', pathLevel, '=', null);
    rules.defineRule('magicNotes.defyDeath',
      'constitutionModifier', '=', 'Math.max(source, 1)'
    );
    SRD5E.featureSpells
      (rules, 'Among The Dead', 'K', pathLevel, ['Spare The Dying']);
  } else if(name == 'Way Of The Long Death') {
    rules.defineRule('combatNotes.hourOfReaping', 'kiSaveDC', '=', null);
    rules.defineRule('combatNotes.touchOfDeath',
      pathLevel, '=', null,
      'wisdomModifier', '+', null,
      '', '^', '1'
    );
    rules.defineRule('combatNotes.touchOfTheLongDeath', 'kiSaveDC', '=', null);
  } else if(name == 'Way Of The Sun Soul') {
    // Copied from Xanathar
    rules.defineRule('combatNotes.radiantSunBolt',
      'proficiencyBonus', '=', null,
      'dexterityModifier', '+', null
    );
    rules.defineRule('combatNotes.radiantSunBolt.1',
      'features.Radiant Sun Bolt', '?', null,
      'combatNotes.martialArts', '=', null
    );
    rules.defineRule('combatNotes.radiantSunBolt.2',
      'features.Radiant Sun Bolt', '?', null,
      'dexterityModifier', '=', null
    );
    rules.defineRule
      ('combatNotes.sunShield', 'wisdomModifier', '=', 'source + 5');
    rules.defineRule
      ('magicNotes.searingArcStrike', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.searingSunburst', 'kiSaveDC', '=', null);
    SRD5E.featureSpells
     (rules, 'Searing Arc Strike', 'W', pathLevel, ['Burning Hands']);
  }

};

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
MidnightLegacy.raceRulesExtra = function(rules, name) {

  var raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') +
    'Level';

  if(name == 'Gray Dwarf') {
    rules.defineRule('magicNotes.duergarMagic.1',
      'features.Duergar Magic', '?', null,
      raceLevel, '=', 'source>=5 ? " and <i>Invisibility</i>" : ""'
    );
    SRD5E.featureSpells(
      rules, 'Duergar Magic', 'W', 'level', ['Enlarge/Reduce', '5:Invisibility']
    );
  }

};

/* Returns an array of plugins upon which this one depends. */
MidnightLegacy.getPlugins = function() {
  var result = [];
  if(window.PHB5E != null)
    result.push(PHB5E);
  result.push(SRD5E);
  if(window.Tasha != null &&
     QuilvynUtils.getKeys(MidnightLegacy.rules.getChoices('selectableFeatures'), /Peace Domain/).length > 0)
    result.unshift(Tasha);
  if(window.Volo != null &&
     (Volo.CHARACTER_RACES_IN_PLAY || Volo.MONSTROUS_RACES_IN_PLAY))
    result.unshift(Volo);
  if(window.Xanathar != null &&
     QuilvynUtils.getKeys(MidnightLegacy.rules.getChoices('selectableFeatures'), /Forge Domain/).length > 0)
    result.unshift(Xanathar);
  return result;
};

/* Returns HTML body content for user notes associated with this rule set. */
MidnightLegacy.ruleNotes = function() {
  return '' +
    '<h2>Midnight Legacy Quilvyn Plugin Notes</h2>\n' +
    'Midnight Legacy Quilvyn Plugin Version ' + MidnightLegacy.VERSION + '\n' +
    '<p>\n' +
    'There are no known bugs, limitations, or usage notes specific to the Midnight Legacy Rule Set.\n' +
    '</p>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    'Quilvyn\'s Midnight Legacy rule set is unofficial Fan Content permitted ' +
    'under Wizards of the Coast\'s ' +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Player\'s Handbook © 2014 Wizards of the Coast LLC.\n' +
    '</p>\n';
};
