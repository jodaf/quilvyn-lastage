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
  MidnightLegacy.SPELLS =
    Object.assign({}, basePlugin.SPELLS, MidnightLegacy.SPELLS_ADDED);
  MidnightLegacy.WEAPONS =
    Object.assign({}, basePlugin.WEAPONS, MidnightLegacy.WEAPONS_ADDED);

  MidnightLegacy.abilityRules(rules);
  MidnightLegacy.combatRules
    (rules, basePlugin.ARMORS, basePlugin.SHIELDS, MidnightLegacy.WEAPONS);
  MidnightLegacy.magicRules(rules, basePlugin.SCHOOLS, MidnightLegacy.SPELLS);
  MidnightLegacy.identityRules(
    rules, basePlugin.ALIGNMENTS, MidnightLegacy.BACKGROUNDS,
    MidnightLegacy.CLASSES, MidnightLegacy.DEITIES, MidnightLegacy.PATHS,
    MidnightLegacy.RACES
  );
  MidnightLegacy.talentRules
    (rules, MidnightLegacy.FEATS, MidnightLegacy.FEATURES, SRD5E.GOODIES,
     MidnightLegacy.LANGUAGES, SRD5E.SKILLS, basePlugin.TOOLS);

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
MidnightLegacy.CLASSES = Object.assign({}, SRD5E.CLASSES);
delete MidnightLegacy.CLASSES.Monk;
delete MidnightLegacy.CLASSES.Warlock;
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
  'Unremarkable':'Type=General',

  'Lurk':'Type=General,Heroic Require="heroicPath == \'Avenger\'"',
  'Silencing Strike':
    'Type=General,Heroic Require="level >= 4",features.Lurk',
  'Study The Target':
    'Type=General,Heroic Require="level >= 8","features.Silencing Strike"',
  'Deadly Strike':
    'Type=General,Heroic Require="level >= 12","features.Study The Target"',
  'Unseen Lurker':
    'Type=General,Heroic Require="level >= 16","features.Deadly Strike"',
  'Wild Resilience':'Type=General,Heroic Require="heroicPath == \'Beastborn\'"',
  'Vicious Assault':
    'Type=General,Heroic Require="level >= 4","features.Wild Resilience"',
  'Pack Alpha':
    'Type=General,Heroic Require="level >= 8","features.Vicious Assault"',
  'Wild Sense':
    'Type=General,Heroic Require="level >= 12","features.Pack Alpha"',
  'Apex Predator':
    'Type=General,Heroic Require="level >= 16","features.Wild Sense"',
  'Inspiring Faith':'Type=General,Heroic Require="heroicPath == \'Believer\'"',
  'Courage Of Your Convictions':
    'Type=General,Heroic Require="level >= 4","features.Inspiring Faith"',
  'Bulwark Of Faith':
    'Type=General,Heroic ' +
    'Require="level >= 8","features.Courage Of Your Convictions"',
  'Holy Terror':
    'Type=General,Heroic Require="level >= 12","features.Bulwark Of Faith"',
  'Strength Of Faith':
    'Type=General,Heroic Require="level >= 16","features.Holy Terror"',
  'Channeled Magic':'Type=General,Heroic Require="heroicPath == \'Channeler\'"',
  'Masterful Focus':
    'Type=General,Heroic Require="level >= 4","features.Channeled Magic"',
  'Mind Within The Weave':
    'Type=General,Heroic Require="level >= 8","features.Masterful Focus"',
  'The Eye Opens':
    'Type=General,Heroic ' +
    'Require="level >= 12","features.Mind Within The Weave"',
  'The Channeling':
    'Type=General,Heroic Require="level >= 16","features.The Eye Opens"',
  'Conduit':'Type=General,Heroic Require="heroicPath == \'Dragonblooded\'"',
  'Pure Magic':'Type=General,Heroic Require="level >= 4",features.Conduit',
  'Intimidating Presence':
    'Type=General,Heroic Require="level >= 8","features.Pure Magic"',
  'Fireheart':
    'Type=General,Heroic ' +
    'Require="level >= 12","features.Intimidating Presence"',
  'Raging Fury':'Type=General,Heroic Require="level >= 16",features.Fireheart',
  'One With The Earth':
    'Type=General,Heroic Require="heroicPath == \'Earthblooded\'"',
  'Nexus Affinity':
    'Type=General,Heroic Require="level >= 4","features.One With The Earth"',
  'Avatar Of Aryth':
    'Type=General,Heroic Require="level >= 8","features.Nexus Affinity"',
  'Rooted':
    'Type=General,Heroic Require="level >= 12","features.Avatar Of Aryth"',
  'Nexus Guardian':'Type=General,Heroic Require="level >= 16",features.Rooted',
  'Guard':'Type=General,Heroic Require="heroicPath == \'Guardian\'"',
  'Crucial Strike':'Type=General,Heroic Require="level >= 4",features.Guard',
  'Tactical Direction':
    'Type=General,Heroic Require="level >= 8","features.Crucial Strike"',
  'Warding Presence':
    'Type=General,Heroic Require="level >= 12","features.Tactical Direction"',
  'For Victory!':
    'Type=General,Heroic Require="level >= 16","features.Warding Precence"',
  'Hard To Kill':'Type=General,Heroic Require="heroicPath == \'Ironborn\'"',
  'Tough As Iron':
    'Type=General,Heroic Require="level >= 4","features.Hard To Kill"',
  'Indefatigable':
    'Type=General,Heroic Require="level >= 8","features.Tough As Iron"',
  'Quick Recovery':
    'Type=General,Heroic Require="level >= 12",features.Indefatigable',
  'Unbroken':
    'Type=General,Heroic Require="level >= 16","features.Quick Recovery"',
  'Folk Medicine':'Type=General,Heroic Require="heroicPath == \'Preserver\'"',
  'Resourceful':
    'Type=General,Heroic Require="level >= 4","features.Folk Medicine"',
  'Skilled Healer':
    'Type=General,Heroic Require="level >= 8",features.Resourceful',
  'Acts Of Service':
    'Type=General,Heroic Require="level >= 12","features.Skilled Healer"',
  'Reassuring Presence':
    'Type=General,Heroic Require="level >= 16","features.Acts Of Service"',
  'Well-Spoken':'Type=General,Heroic Require="heroicPath == \'Speaker\'"',
  'Crowd Rouser':
    'Type=General,Heroic Require="level >= 4",features.Well-Spoken',
  'Rallying Cry':
    'Type=General,Heroic Require="level >= 8","features.Crowd Rouser"',
  'Scathing Rebuke':
    'Type=General,Heroic Require="level >= 12","features.Rallying Cry"',
  'Changed To The Core':
    'Type=General,Heroic Require="level >= 16","features.Scathing Rebuke"',
  'Fallen Sense':'Type=General,Heroic Require="heroicPath == \'Sunderborn\'"',
  'Sundered Blood':
    'Type=General,Heroic Require="level >= 4","features.Fallen Sense"',
  'Sundered Fury':
    'Type=General,Heroic Require="level >= 8","features.Sundered Blood"',
  'Ethereal Presence':
    'Type=General,Heroic Require="level >= 12","features.Sundered Fury"',
  'Sundered Form':
    'Type=General,Heroic Require="level >= 12","features.Ethereal Presence"',
  'Natural Bond':'Type=General,Heroic Require="heroicPath == \'Wildblooded\'"',
  'Wild Companion':
    'Type=General,Heroic Require="level >= 4","features.Natural Bond"',
  'Pack Fighter':
    'Type=General,Heroic Require="level >= 8","features.Wild Companion"',
  'Friends Until The End':
    'Type=General,Heroic Require="level >= 12","features.Pack Fighter"',
  'The Wild Hunt':
    'Type=General,Heroic ' +
    'Require="level >= 16","features.Friends Until The End"'

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

  // Heroic Paths
  'Acts Of Service':'Section=feature Note="FILL"',
  'Apex Predator':'Section=feature Note="FILL"',
  'Avatar Of Aryth':'Section=feature Note="FILL"',
  'Bulwark Of Faith':'Section=feature Note="FILL"',
  'Changed To The Core':'Section=feature Note="FILL"',
  'Channeled Magic':'Section=feature Note="FILL"',
  'Conduit':'Section=feature Note="FILL"',
  'Courage Of Your Convictions':'Section=feature Note="FILL"',
  'Crowd Rouser':'Section=feature Note="FILL"',
  'Crucial Strike':'Section=feature Note="FILL"',
  'Deadly Strike':'Section=feature Note="FILL"',
  'Ethereal Presence':'Section=feature Note="FILL"',
  'Fallen Sense':'Section=feature Note="FILL"',
  'Fireheart':'Section=feature Note="FILL"',
  'Folk Medicine':'Section=feature Note="FILL"',
  'For Victory!':'Section=feature Note="FILL"',
  'Friends Until The End':'Section=feature Note="FILL"',
  'Guard':'Section=feature Note="FILL"',
  'Hard To Kill':'Section=feature Note="FILL"',
  'Holy Terror':'Section=feature Note="FILL"',
  'Indefatigable':'Section=feature Note="FILL"',
  'Inspiring Faith':'Section=feature Note="FILL"',
  'Intimidating Presence':'Section=feature Note="FILL"',
  'Lurk':'Section=feature Note="FILL"',
  'Masterful Focus':'Section=feature Note="FILL"',
  'Mind Within The Weave':'Section=feature Note="FILL"',
  'Natural Bond':'Section=feature Note="FILL"',
  'Nexus Affinity':'Section=feature Note="FILL"',
  'Nexus Guardian':'Section=feature Note="FILL"',
  'One With The Earth':'Section=feature Note="FILL"',
  'Pack Alpha':'Section=feature Note="FILL"',
  'Pack Fighter':'Section=feature Note="FILL"',
  'Pure Magic':'Section=feature Note="FILL"',
  'Quick Recovery':'Section=feature Note="FILL"',
  'Raging Fury':'Section=feature Note="FILL"',
  'Rallying Cry':'Section=feature Note="FILL"',
  'Reassuring Presence':'Section=feature Note="FILL"',
  'Resourceful':'Section=feature Note="FILL"',
  'Rooted':'Section=feature Note="FILL"',
  'Scathing Rebuke':'Section=feature Note="FILL"',
  'Silencing Strike':'Section=feature Note="FILL"',
  'Skilled Healer':'Section=feature Note="FILL"',
  'Strength Of Faith':'Section=feature Note="FILL"',
  'Study The Target':'Section=feature Note="FILL"',
  'Sundered Blood':'Section=feature Note="FILL"',
  'Sundered Form':'Section=feature Note="FILL"',
  'Sundered Fury':'Section=feature Note="FILL"',
  'Tactical Direction':'Section=feature Note="FILL"',
  'The Channeling':'Section=feature Note="FILL"',
  'The Eye Opens':'Section=feature Note="FILL"',
  'The Wild Hunt':'Section=feature Note="FILL"',
  'Tough As Iron':'Section=feature Note="FILL"',
  'Unbroken':'Section=feature Note="FILL"',
  'Unseen Lurker':'Section=feature Note="FILL"',
  'Vicious Assault':'Section=feature Note="FILL"',
  'Warding Presence':'Section=feature Note="FILL"',
  'Well-Spoken':'Section=feature Note="FILL"',
  'Wild Companion':'Section=feature Note="FILL"',
  'Wild Resilience':'Section=feature Note="FILL"',
  'Wild Sense':'Section=feature Note="FILL"',

  // Paths
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
  // SRD5E defines Darkvision, Dwarven Resilience, Dwarven Toughness,
  // Fey Ancestry, Halfling Nimbleness, Lucky Halfling, Slow, and Trance
  'Animal Bond':
    'Section=skill Note="Adv to control, persuade, or communicate w/animals"',
  'Born Of The Sea':
    'Section=ability,skill ' +
    'Note="Use bonus action for 1 hr water breathing",' +
         '"Tool Proficiency (Water Vehicles)"',
  'Canansil Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Caransil Elf Weapon Training':
    'Section=combat Note="Weapon Proficiency (Longbow/Longsword)"',
  'Child Of The North':'Section=save Note="Adv vs. extreme cold"',
  'Clan Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution"',
  'Clan Warrior Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Battleaxe/Warhammer)/Armor Proficiency (Medium)"',
  'Danisil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Intelligence"',
  'Danisil Elf Weapon Training':
    'Section=combat Note="Weapon Proficiency (Scimitar/Shortbow)"',
  'Dorn Ability Adjustment':'Section=ability Note="+1 Strength/+1 any two"',
  'Enslaved Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Erenlander Ability Adjustment':'Section=ability Note="+1 any two"',
  'Erunsil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Strength"',
  'Erunsil Elf Weapon Training':
    'Section=combat Note="Weapon Proficiency (Erunsil Fighting Knife/Longbow)"',
  'Fast':'Section=ability Note="+5 Speed"',
  'Ferocity':'Section=combat Note="+2 Str-based melee damage"',
  'Gnome Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Charisma"',
  'Gnomish Cunning':SRD5E.FEATURES['Gnome Cunning'],
  'Halfling Magic':
    'Section=magic Note="Know <i>Mending</i> and <i>Prestidigitation<i>"',
  'Human Feat Bonus':'Section=feature Note="+1 General Feat"',
  'Innate Magic Scholar':'Section=magic Note="Know 2 Wizard cantrips"',
  'Innate Magic User':'Section=magic Note="Know 1 Sorcerer cantrip"',
  'Kurgun Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Wisdom"',
  'Kurgun Dwarf Warrior Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Handaxe/Shortbow/Spear)/Armor Proficiency (Medium)"',
  'Militant Culture':
    'Section=combat ' +
    'Note="Weapon Proficiency (Battleaxe/Greataxe/Longbow/Spear)"',
  'Miransil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Miransil Elf Weapon Training':
    'Section=combat Note="Weapon Proficiency (Javelin/Trident)"',
  'Nomadic Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Orc Ability Adjustment':'Section=ability Note="+2 Constitution/+2 Strength"',
  'Riverfolk':
    'Section=skill ' +
    'Note="Skill Proficiency (Athletics/Insight/Persuasion)/Tool Proficiency (Water Vehicles)"',
  'Sarcosan Ability Adjustment':
    'Section=ability Note="+1 Dexterity/+1 any two"',
  'Stonemaster\'s Cunning':
    'Section=skill ' +
    'Note="Adv on stonework origin and underground direction and construction"',
  'Troubled Dreams':'Section=combat Note="Long rest recovers 1 fewer hit die"',
  'Unexpected Blow':
    'Section=combat Note="May reroll 1 damage die from unexpected attack"',
  'Wraith Of The North':
    'Section=skill Note="Hide in nature when lightly obscured"'

};
MidnightLegacy.FEATURES =
  Object.assign({}, SRD5E.FEATURES, MidnightLegacy.FEATURES_ADDED);
MidnightLegacy.LANGUAGES = {
  'Clan Dialect':'',
  'Colonial':'',
  'Erenlander':'',
  'Halfling':'',
  'High Elven':'',
  'Norther':'',
  'Old Dwarven':'',
  'Orcish':'',
  'Shadow Tongue':'',
  "Trader's Tongue":''
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
      '"5:Scrying,Dominate Person"',
  'Avenger':
    'Group=Avenger ' +
    'Level=level',
  'Beastborn':
    'Group=Beastborn ' +
    'Level=level',
  'Believer':
    'Group=Believer ' +
    'Level=level',
  'Channeler':
    'Group=Channeler ' +
    'Level=level',
  'Dragonblooded':
    'Group=Dragonblooded ' +
    'Level=level',
  'Earthblooded':
    'Group=Earthblooded ' +
    'Level=level',
  'Guardian':
    'Group=Guardian ' +
    'Level=level',
  'Ironborn':
    'Group=Ironborn ' +
    'Level=level',
  'None':
    'Group=None ' +
    'Level=level',
  'Preserver':
    'Group=Preserver ' +
    'Level=level',
  'Speaker':
    'Group=Speaker ' +
    'Level=level',
  'Sunderborn':
    'Group=Sunderborn ' +
    'Level=level',
  'Wildblooded':
    'Group=Wildblooded ' +
    'Level=level'
};
MidnightLegacy.RACES = {
  'Caransil Elf':
    'Features=' +
      '"Skill Proficiency (Perception/Stealth)",' +
      '"Language (High Elven/Erenlander/Choose 1 from Trader\'s Tongue/Old Dwarven/Orcish)",' +
      '"Canansil Ability Adjustment",' +
      '"Caransil Elf Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic User",Trance ' +
    'Languages=Erenlander,"High Elven",any"',
  'Clan Dwarf':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Languages (Clan Dialect/Old Dwarven/Choose 1 from Trader\'s Tongue, Orcish)",' +
      '"Clan Dwarf Ability Adjustment",' +
      '"Clan Warrior Training",Darkvision,"Dwarven Resilience",' +
      '"Dwarven Toughness",Slow,"Stonemaster\'s Cunning" ' +
    'Languages="Clan Dialect","Old Dwarven",any',
  'Danisil Elf':
    'Features=' +
      '"Skill Proficiency (History)",' +
      '"Language (High Elven/Choose 1 from Sylvan, Halfling)",' +
      '"Danisil Elf Ability Adjustment",' +
      '"Danisil Elf Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic Scholar",Trance ' +
    'Languages="High Elven",any',
  'Dorn Human':
    'Features=' +
      '"Skill Proficiency (Survival/Choose 1 from any)",' +
      '"Languages (Eranlander, Norther, choose 1 from any)",' +
      '"Dorn Ability Adjustment",' +
      '"Human Feat Bonus" ' +
    'Languages=Erenlander,Norther,any',
  'Enslaved Halfling':
    'Features=' +
      '"Language (Erenlander/Halfling/Choose 1 from Orcish, Trader\'s Tongue)",' +
      '"Enslaved Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness","Lucky Halfling",Slow,' +
      '"Unexpected Blow" ' +
    'Languages=Erenlander,Halfling,any"',
  'Erenlander Human':
    'Features=' +
      '"Skill Proficiency (Choose 3 from any)",' +
      '"Tool Proficiency (Land Vehicles/Choose 1 from any Artisan)",' +
      '"Language (Erenlander/Choose 1 from any)",' +
      '"Erenlander Ability Adjustment",' +
      '"Human Feat Bonus",' +
    'Languages=Erenlander,any',
  'Erunsil Elf':
    'Features=' +
      '"Skill Proficiency (Survival)",' +
      '"Language (High Elven/Orcish/Trader\'s Tongue)",' +
      '"Erunsil Elf Ability Adjustment",' +
      '"Erunsil Elf Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Wraith Of The North" ' +
    'Languages="High Elven",Orcish,"Trader\'s Tongue"',
  'Gnome':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Language (Erenlander/Trader\'s Tongue/Choose 2 from any)",' +
      '"Gnome Ability Adjustment",' +
      'Darkvision,"Gnomish Cunning",Riverfolk,Slow ' +
    'Languages=Erenlander,"Trader\'s Tongue",any,any',
  'Kurgun Dwarf':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Languages (Clan Dialect/Old Dwarven/Choose 1 from Trader\'s Tongue, Orcish)",' +
      '"Kurgun Dwarf Ability Adjustment",' +
      '"Kurgun Dwarf Warrior Training",Darkvision,"Dwarven Resilience",Slow '  +
    'Languages="Clan Dialect","Old Dwarven","Trader\'s Tongue",Orcish',
  'Miransil Elf':
    'Features=' +
      '"Skill Proficiency (Athletics/Insight)",' +
      '"Language (High Elven/Colonial/Trader\'s Tongue)",' +
      '"Miransil Elf Ability Adjustment",' +
      '"Miransil Elf Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Born Of The Sea" ' +
    'Languages="High Elven",Colonial,"Trader\'s Tongue"',
  'Nomadic Halfling':
    'Features=' +
      '"Language (Erenlander/Halfling/Choose 1 from Orcish, Trader\'s Tongue)",' +
      '"Nomadic Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness","Lucky Halfling",Slow,' +
      '"Animal Bond" ' +
    'Languages=Erenlander,Halfling,any"',
  'Orc':
    'Features=' +
      '"Language (Orcish/Shadow Tongue/Choose 2 from any)",' +
      '"Orc Ability Adjustment",' +
      '"Child Of The North",Darkvision,Ferocity,"Militant Culture",' +
      '"Troubled Dreams" ' +
    'Languages=Orcish,"Shadow Tongue",any,any',
  'Sarcosan Human':
    'Features=' +
      '"Skill Proficiency (Choose 1 from Animal Handling, History/Choose 1 from any)",' +
      '"Language (Erenlander/Colonial/Choose 1 from any)",' +
      '"Sarcosan Ability Adjustment",' +
      '"Human Feat Bonus" ' +
    'Languages=Erenlander,Colonial,any',
};
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

/* Defines the rules related to character abilities. */
MidnightLegacy.abilityRules = function(rules) {
  SRD5E.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to combat. */
MidnightLegacy.combatRules = function(rules, armors, shields, weapons) {
  SRD5E.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
MidnightLegacy.identityRules = function(
  rules, alignments, backgrounds, classes, deities, paths, races
) {
  SRD5E.identityRules
    (rules, alignments, backgrounds, classes, deities, paths, races);
  // Remove Deity from editor and sheet; add heroic path
  delete rules.getChoices('random').deity;
  rules.defineEditorElement('deity');
  rules.defineSheetElement('Deity');
  rules.defineSheetElement('Deity Alignment');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'alignment');
  rules.defineSheetElement('Heroic Path', 'Alignment');
};

/* Defines rules related to magic use. */
MidnightLegacy.magicRules = function(rules, schools, spells) {
  SRD5E.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
MidnightLegacy.talentRules = function(
  rules, feats, features, goodies, languages, skills, tools
) {
  SRD5E.talentRules(rules, feats, features, goodies, languages, skills, tools);
  // No changes needed to the rules defined by base method
  rules.defineRule
    ('featCount.Heroic', 'heroicPath', '=', 'source == "None" ? null : 1');
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
MidnightLegacy.choiceRules = function(rules, type, name, attrs) {
  var basePlugin = window.PHB5E != null ? PHB5E : SRD5E;
  basePlugin.choiceRules(rules, type, name, attrs);
  if(type == 'Class')
    MidnightLegacy.classRulesExtra(rules, name);
  else if(type == 'Path')
    MidnightLegacy.pathRulesExtra(rules, name);
  else if(type == 'Race')
    MidnightLegacy.raceRulesExtra(rules, name);
  if(type == 'Path' && !name.includes('Domain'))
    rules.addChoice('heroicPaths', name, attrs);
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
MidnightLegacy.classRulesExtra = function(rules, name) {
  var classLevel = 'levels.' + name;
  if(name == 'Cleric')
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
};

/*
 * Defines in #rules# the rules associated with heroic path #name# that cannot
 * be derived directly from the abilities passed to heroicPathRules.
 */
MidnightLegacy.pathRulesExtra = function(rules, name) {
  if(!name.match(/Domain/)) {
    rules.defineRule('features.' + name, 'heroicPath', '=', 'source == "' + name + '" ? 1 : null');
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
    rules.defineChoice('extras', name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Features');
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
MidnightLegacy.raceRulesExtra = function(rules, name) {
  if(name == 'Caransil Elf')
    rules.defineRule
      ('spellSlots.S0', 'magicNotes.innateMagicalUser', '+=', '1');
  else if(name == 'Clan Dwarf')
    rules.defineRule
      ('combatNotes.dwarvenToughness', 'level', '=', 'source + 2');
  else if(name == 'Danisil Elf')
    rules.defineRule
      ('spellSlots.W0', 'magicNotes.innateMagicalScholar', '+=', '2');
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
