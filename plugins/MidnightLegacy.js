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
 * (BACKGROUNDS, HEROIC_PATHS, etc.) can be manipulated to modify the choices.
 */
function MidnightLegacy() {

  if(window.SRD5E == null) {
    alert('The MidnightLegacy module requires use of the SRD5E module');
    return;
  }

  let basePlugin = window.PHB5E != null ? PHB5E : SRD5E;

  let rules = new QuilvynRules('Midnight Legacy', MidnightLegacy.VERSION);
  MidnightLegacy.rules = rules;
  rules.plugin = MidnightLegacy;

  rules.defineChoice('choices', SRD5E.CHOICES.concat(['Heroic Path']));
  rules.choiceEditorElements = SRD5E.choiceEditorElements;
  rules.choiceRules = MidnightLegacy.choiceRules;
  rules.removeChoice = SRD5E.removeChoice;
  rules.editorElements = SRD5E.initialEditorElements();
  rules.getFormats = SRD5E.getFormats;
  rules.getPlugins = MidnightLegacy.getPlugins;
  rules.makeValid = SRD5E.makeValid;
  rules.randomizeOneAttribute = SRD5E.randomizeOneAttribute;
  rules.defineChoice('random', SRD5E.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD5E.getChoices;
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
  if(window.PHB5E != null) {
    for(let c in MidnightLegacy.CLASSES)
      if(c != 'Cleric')
        MidnightLegacy.CLASSES[c] = PHB5E.CLASSES[c];
  }
  MidnightLegacy.FEATS =
    Object.assign({}, basePlugin.FEATS, MidnightLegacy.FEATS_ADDED);
  MidnightLegacy.FEATURES =
    Object.assign({}, basePlugin.FEATURES, MidnightLegacy.FEATURES_ADDED);
  MidnightLegacy.SPELLS =
    Object.assign({}, basePlugin.SPELLS, MidnightLegacy.SPELLS_ADDED);
  for(let s in MidnightLegacy.SPELLS) {
    if(MidnightLegacy.SPELLS[s] == null)
      delete MidnightLegacy.SPELLS[s];
  }
  MidnightLegacy.WEAPONS =
    Object.assign({}, SRD5E.WEAPONS, MidnightLegacy.WEAPONS_ADDED);
  // Drop disused features to avoid extraneous error messages
  let disused = [].concat(
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Cleric, 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Cleric, 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Monk, 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Monk, 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Warlock, 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.CLASSES.Warlock, 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES.Dragonborn, 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES.Dragonborn, 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES['Half-Elf'], 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES['Half-Elf'], 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES['Half-Orc'], 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES['Half-Orc'], 'Selectables'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES.Tiefling, 'Features'),
    QuilvynUtils.getAttrValueArray(basePlugin.RACES.Tiefling, 'Selectables')
  );
  disused = disused.map(x => x.replace(/^.*\d+:/, '').replace(/:.*/, ''));
  for(let f in MidnightLegacy.FEATURES) {
    if(f != 'Darkvision' && f != 'Evasion' && f != 'Fey Ancestry' &&
       f != 'Slow' &&
       !MidnightLegacy.CLASSES.Cleric.includes(f) &&
       disused.includes(f))
      delete MidnightLegacy.FEATURES[f];
  }

  MidnightLegacy.abilityRules(rules);
  MidnightLegacy.combatRules
    (rules, SRD5E.ARMORS, SRD5E.SHIELDS, MidnightLegacy.WEAPONS);
  MidnightLegacy.magicRules(rules, SRD5E.SCHOOLS, MidnightLegacy.SPELLS);
  MidnightLegacy.identityRules(
    rules, SRD5E.ALIGNMENTS, MidnightLegacy.BACKGROUNDS,
    MidnightLegacy.CLASSES, MidnightLegacy.DEITIES, MidnightLegacy.HEROIC_PATHS,
    MidnightLegacy.RACES
  );
  MidnightLegacy.talentRules
    (rules, MidnightLegacy.FEATS, MidnightLegacy.FEATURES, SRD5E.GOODIES,
     MidnightLegacy.LANGUAGES, SRD5E.SKILLS, SRD5E.TOOLS);

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

MidnightLegacy.VERSION = '2.4.1.0';

MidnightLegacy.BACKGROUNDS_ADDED = {
  'Deserter':
    'Equipment=' +
       '"Uniform With Insignia","Sturdy Boots",Bedroll,Backpack,' +
       '"1 Week\'s Rations" ' +
    'Features=' +
      '"Skill Proficiency (Athletics/Perception)",' +
      '"Weapon Proficiency (Choose 1 from any Martial)",' +
      '"Old Veteran"',
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
      '"Language (Trader\'s Tongue/Choose 1 from any)",' +
      '"Skill Proficiency (Perception/Survival)",' +
      'Survivalist'
};
MidnightLegacy.BACKGROUNDS =
  Object.assign({}, SRD5E.BACKGROUNDS, MidnightLegacy.BACKGROUNDS_ADDED);
MidnightLegacy.CLASSES = {
  'Barbarian':SRD5E.CLASSES.Barbarian,
  'Bard':SRD5E.CLASSES.Bard,
  'Cleric':
    'HitDie=d8 ' +
    'Features=' +
      '"1:Armor Proficiency (Medium/Shield)",' +
      '"1:Save Proficiency (Charisma/Wisdom)",' +
      '"1:Skill Proficiency (Choose 2 from History, Insight, Medicine, Persuasion, Religion)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Divine Domain","1:Ritual Casting",1:Spellcasting,' +
      '"2:Channel Divinity","2:Turn Undead","5:Destroy Undead",' +
      '"10:Divine Intervention",' +
      '"features.Keeper Of Obsidian Domain ? 1:Dark God\'s Blessing",' +
      '"features.Keeper Of Obsidian Domain ? 1:Necromantic Arts",' +
      '"features.Keeper Of Obsidian Domain || features.Witch Taker Domain ? 2:Astirax Servant",' +
      '"features.Keeper Of Obsidian Domain ? 6:Dominate Undead",' +
      '"features.Keeper Of Obsidian Domain ? 8:Potent Spellcasting",' +
      '"features.Keeper Of Obsidian Domain ? 17:Aura Of Darkness",' +
      '"features.Soldier Legate Domain ? 1:Weapon Proficiency (Martial)",' +
      '"features.Soldier Legate Domain ? 1:Dark Warrior",' +
      '"features.Soldier Legate Domain ? 2:Ferocious Blow",' +
      '"features.Soldier Legate Domain ? 6:Dire Bodyguard",' +
      '"features.Soldier Legate Domain ? 8:Bestial Astirax Servant",' +
      '"features.Soldier Legate Domain ? 17:Dread Avatar",' +
      '"features.Witch Taker Domain ? 1:Weapon Proficiency (Halberd/Longsword/Rapier/Shortsword)",' +
      // Handled above '"features.Witch Taker Domain ? 1:Astirax Servant",' +
      '"features.Witch Taker Domain ? 2:Mage Hunter",' +
      '"features.Witch Taker Domain ? 6:Improved Astirax Bond",' +
      '"features.Witch Taker Domain ? 8:Master Mage Hunter",' +
      '"features.Witch Taker Domain ? 17:Impervious To Magic" ' +
    'Selectables=' +
      '"deityDomains =~ \'Obsidian\' ? 1:Keeper Of Obsidian Domain:Divine Domain",' +
      '"deityDomains =~ \'Soldier\' ? 1:Soldier Legate Domain:Divine Domain",' +
      '"deityDomains =~ \'Taker\' ? 1:Witch Taker Domain:Divine Domain" ' +
    'SpellAbility=Wisdom ' +
    'SpellSlots=' +
      'C0:3@1;4@4;5@10,' +
      'C1:2@1;3@2;4@3,' +
      'C2:2@3;3@4,' +
      'C3:2@5;3@6,' +
      'C4:1@7;2@8;3@9,' +
      'C5:1@9;2@10;3@18,' +
      'C6:1@11;2@19,' +
      'C7:1@13;2@20,' +
      'C8:1@15,' +
      'C9:1@17',
  'Druid':SRD5E.CLASSES.Druid,
  'Fighter':SRD5E.CLASSES.Fighter,
  'Paladin':SRD5E.CLASSES.Paladin,
  'Ranger':SRD5E.CLASSES.Ranger,
  'Rogue':SRD5E.CLASSES.Rogue,
  'Sorcerer':SRD5E.CLASSES.Sorcerer,
  'Wizard':SRD5E.CLASSES.Wizard
};
MidnightLegacy.DEITIES = {
  'Izrador':
    'Alignment=NE ' +
    'Domain="Keeper Of Obsidian","Soldier Legate","Witch Taker"'
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
  'Shieldwall Soldier':
    'Type=General ' +
    'Require="features.Armor Proficiency (Medium) || features.Armor Proficiency (Heavy)","constitution >= 13"',
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
  'Intimidating Presence (Dragonblooded)':
    'Type=General,Heroic Require="level >= 8","features.Pure Magic"',
  'Fireheart':
    'Type=General,Heroic ' +
    'Require="level >= 12","features.Intimidating Presence (Dragonblooded)"',
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
    'Type=General,Heroic Require="level >= 16","features.Warding Presence"',
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
MidnightLegacy.FEATS =
  Object.assign({}, SRD5E.FEATS, MidnightLegacy.FEATS_ADDED);
MidnightLegacy.FEATURES_ADDED = {

  // Backgrounds
  'Knowledge Of The Enemy':
    'Section=feature ' +
    'Note="Knows the basics of Shadow military organization/Can get messages to slaves undetected"',
  'Military Rank':
    'Section=feature ' +
    'Note="Receives respect, deference, and lend of resources from fellow soldiers"',
  'Old Veteran':
    'Section=feature Note="Knows how to infiltrate military organizations"',
  'Survivalist':
    'Section=skill ' +
    'Note="Can find shelter from the weather and detect the presence of blighted lands, hostile creatures, and animals possessed by an astirax"',
  'Sympathetic Ally':
     'Section=feature ' +
     'Note="May receive support and info from a contact in occupied lands"',

  // Feats
  'Battlefield Healer':
    'Section=combat,skill ' +
    'Note=' +
      '"Allies regain extra HD from a long rest",' +
      '"Successful DC 15 Medicine with healer\'s kit use brings patient from 0 HP to 3 HP"',
  'Brawler':
    'Section=combat,combat ' +
    'Note=' +
      '"Unarmed strike inflicts d4 damage",' +
      '"May use a bonus action after a successful unarmed strike to make a second strike, grapple, or knock prone"',
  'Captor':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Strength",' +
      '"Adv on Athletics to grapple when unseen/May grapple silently/May move at full speed while grappling w/out provoking an OA"',
  'Fellhunter':
    'Section=skill ' +
    'Note="May use a bonus action to make a DC 12 Religion check; success gives self Adv on saves vs. undead and inflicts Disadv on undead targets\' saves for 1 min 1/long rest"',
  'Harrier':
    'Section=combat ' +
    'Note="Mounted 30\' move negates foe OA and causes successful melee attacks to knock prone"',
  'Improvised Fighter':
    'Section=combat,combat ' +
    'Note=' +
      '"Weapon Proficiency (Improvised)/Improvised inflicts 1d6 damage",' +
      '"May destroy an improvised weapon for +1 damage die"',
  'Knife Fighter':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Dexterity",' +
      '"Dagger crits on 18, and crit inflicts Disadv on combat for 1 rd"',
  'Learned':
    'Section=skill,skill ' +
    'Note=' +
      '"Language (Choose 1 from any)/Skill Proficiency (Choose 1 from History, Religion)",' +
      '"Can read and write"',
  'Paranoid':
    'Section=combat ' +
    'Note="Cannot be surprised when asleep/Automatic Dodge in first round"',
  'Polyglot':
    'Section=skill ' +
    'Note="Gains general language understanding after listening for 1 dy; successful DC 15 Intelligence after 1 wk gives fluency"',
  'Scavenger':
    'Section=ability,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Intelligence, Wisdom)",' +
      '"Successful DC 15 Perception recovers all spent ammo/Successful DC 12 Investigation scavenges weapon or armor materials worth up to 3d10+%{intelligenceModifier} GP"',
  'Seamaster':
    'Section=ability,ability,feature,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
      '"May climb rope at full speed",' +
      '"Increases speed of commanded ship by 2 MPH",' +
      '"No Disadv to pilot a ship during a storm"',
  'Shieldwall Soldier':
    'Section=combat ' +
    'Note="Adjacent allies gain +1 AC (+2 if self holds a shield)"',
  'Subtle Spellcaster':
    'Section=magic,skill ' +
    'Note=' +
      '"May cast 2 chosen level 1 bard, druid, sorcerer, or wizard spells 1/long rest",' +
      '"Successful Sleight Of Hand vs. passive Perception allows casting spells unnoticed"',
  'Suspicious':
    'Section=ability,skill,skill ' +
    'Note=' +
      '"+1 Intelligence",' +
      '"Skill Proficiency (Insight)/+%{proficiencyBonus} Insight",' +
      '"+%{proficiencyBonus} passive Perception/Successful DC 20 Investigation notes flaws in story detail"',
  'Unremarkable':
    'Section=ability,feature ' +
    'Note=' +
      '"+1 Wisdom",' +
      '"May run through crowds unnoticed/Reduces foe\'s passive Perception to notice self to 12"',

  // Heroic Paths
  'Acts Of Service':
    'Section=ability,combat,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Strength, Wisdom)",' +
      '"Foes suffer Disadv attacking adjacent incapacitated allies; self gains Adv on attacks",' +
      '"May spend 2 uses of healer\'s kit to reduce exhaustion by 1 or to restore ability or HP maximum"',
  'Apex Predator':
    'Section=ability,combat,feature ' +
    'Note=' +
      '"+2 Strength",' +
      '"+20 Hit Points/Unarmed strike inflicts 1d8 damage",' +
      '"Pack Alpha feature affects all creatures"',
  'Avatar Of Aryth':
    'Section=magic ' +
    'Note="May use <i>Conjure Elemental</i> effects to summon a friendly earth elemental 1/long rest" ' +
    'Spells="Conjure Elemental"',
  'Bulwark Of Faith':
    'Section=ability,save ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
      '"Adv vs. spell effects of celestials, fiends, undead, and Shadow agents"',
  'Changed To The Core':
    'Section=combat ' +
    'Note="R50\' Successful Persuasion vs. Insight causes target foe to switch sides (up to %{level//2} HD) or to flee (%{level//2+1}+ HD) 1/long rest"',
  'Channeled Magic':'Section=magic Note="%V additional %1 spell slot"',
  'Conduit':'Section=magic Note="Knows 2 Sorcerer cantrips"',
  'Courage Of Your Convictions':
    'Section=combat ' +
    'Note="R50\' May use inspiration and a bonus action to remove charmed, frightened, paralyzed, or stunned from self and allies"',
  'Crowd Rouser':
    'Section=magic ' +
    'Note="R50\' May charm and convince listeners (DC %{8+charismaModifier+proficiencyBonus} Wisdom neg) for 1 wk 1/short rest"',
  'Crucial Strike':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Charisma",' +
      '"May use Reaction to give an ally an additional attack with +%{proficiencyBonus} damage"',
  'Deadly Strike':
    'Section=combat ' +
    'Note="May automatically crit on a successful melee attack w/Adv 1/short rest"',
  'Ethereal Presence':
    'Section=magic ' +
    'Note="May spend 1 HD and use a bonus action to become ethereal for 1 min"',
  'Fallen Sense':
    'Section=ability,feature,magic ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"May communicate with chosen Fallen for conc up to 1 hr",' +
      '"R60\' Knows location and type of Fallen"',
  'Fireheart':
    'Section=magic,save ' +
    'Note=' +
      '"May reroll fire spell damage",' +
      '"Resistance to fire damage"',
  'Folk Medicine':
    'Section=skill ' +
    'Note="May restore 1d6+%{wisdomModifier} HP per use of healer\'s kit"',
  'For Victory!':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Charisma",' +
      '"R30\' Successful DC 15 Charisma gives allies +%{proficiencyBonus} attack and damage for 1 min 1/long rest"',
  'Friends Until The End':
    'Section=ability,combat,feature ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Dexterity, Strength)",' +
      '"May use Reaction to redirect damage suffered by adjacent wild companion to self",' +
      '"Wild companion guards self when incapacitated"',
  'Guard':
    'Section=combat ' +
    'Note="May use a bonus action to give an adjacent ally +1 AC (+2 with shield)"',
  'Hard To Kill':
    'Section=save ' +
    'Note="Death save succeeds on a roll of 6 or higher; 16 or higher restores 1 HP"',
  'Holy Terror':
    'Section=combat ' +
    'Note="R30\' May use inspiration to turn foes (DC %{8+wisdomModifier+proficiencyBonus} Wisdom neg; damage ends) for 1 min"',
  'Indefatigable':
    'Section=ability,ability,feature ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Constitution, Strength)",' +
      '"Suffers no Disadv on Constitution or Strength checks due to exhaustion",' +
      '"Successful DC 15 Constitution doubles exhaustion recovery"',
  'Inspiring Faith':
    'Section=feature Note="Gains inspiration after a short rest"',
  'Intimidating Presence (Dragonblooded)':
    'Section=ability,magic ' +
    'Note=' +
      '"+1 Charisma",' +
      '"R30\' Casting a spell frightens foes (Wisdom neg) for 1 rd"',
  'Lurk':
    'Section=skill ' +
    'Note="Successful Stealth vs. passive Perception makes self unnoticed/Adv on Perception to overhear nearby conversations"',
  'Masterful Focus':
    'Section=ability,save ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
      '"+%{proficiencyBonus} Constitution (maintain spell concentration)"',
  'Mind Within The Weave':
    'Section=magic ' +
    'Note="May maintain concentration on two spells simultaneously"',
  'Natural Bond':
    'Section=feature ' +
    'Note="Animals treat self as a friend (DC %{8+proficiencyBonus+wisdomModifier} Wisdom neg)"',
  'Nexus Affinity':
    'Section=ability,feature,skill ' +
    'Note=' +
      '"+1 Wisdom",' +
      '"+1d6 ability, attack, and save when w/in 1 mile of a power nexus or a black mirror",' +
      '"Successful DC 16 Insight detects a power nexus or a black mirror w/in 5 miles 3/long rest"',
  'Nexus Guardian':
    'Section=feature ' +
    'Note="May attune to a nexus, gaining remote charge use, teleportation to nexus, agelessness, and reincarnation"',
  'One With The Earth':
    'Section=feature,skill ' +
    'Note=' +
      '"Knows north, direction and potability of water and geologic features w/in 5 miles, and direction of buildings w/in 1 mile",' +
      '"Skill Proficiency (Perception/Survival)"',
  'Pack Alpha':
    'Section=feature,skill ' +
    'Note=' +
      '"May frighten beasts in a 30\' radius (DC %{8+proficiencyBonus+strengthModifier} Wisdom ends)",' +
      '"Adv on Animal Handling (predatory beasts)"',
  'Pack Fighter':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Wisdom",' +
      '"Adjacent wild companion can attack simultaneously w/self"',
  'Pure Magic':'Section=magic Note="+1 spell attack and save DC"',
  'Quick Recovery':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Constitution",' +
      '"May suffer 1 level of exhaustion as a bonus action to recover hit dice, adding %{constitutionModifier} to each"',
  'Raging Fury':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 spell attack and save DC",' +
      '"May cast a 1 action spell as a bonus action"',
  'Rallying Cry':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Charisma",' +
      '"R50\' Successful DC 15 Persuasion gives allies %{level} temporary HP 1/long rest"',
  'Reassuring Presence':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Charisma, Wisdom)",' +
      '"R60\' 6 allies gain %{level} temporary HP when combat begins"',
  'Resourceful':
    'Section=ability,skill ' +
    'Note=' +
      '"+1 Wisdom",' +
      '"May restore 1d6+1 uses of a healer\'s kit or create a kit w/1d4+1 uses after a long rest"',
  'Rooted':
    'Section=ability,combat ' +
    'Note=' +
      '"+1 Constitution",' +
      '"Cannot be moved or knocked prone/Adv on grappling"',
  'Scathing Rebuke':
    'Section=combat ' +
    'Note="R50\' Successful Intimidation vs. Insight stuns target for 1 min (damage ends) 3/long rest"',
  'Silencing Strike':
    'Section=combat ' +
    'Note="Melee hit silences target for 1 min (DC %{8+proficiencyBonus+intelligenceModifier} Constitution neg) 1/short rest"',
  'Skilled Healer':
    'Section=skill ' +
    'Note="May spend 1 healer\'s kit use to remove blindness, deafness, paralysis, or poison or to give Adv on next Constitution save vs. disease"',
  'Strength Of Faith':
    'Section=ability,save ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
      '"R30\' successful Charisma, Intelligence, or Wisdom save gives inspiration to self or ally"',
  'Study The Target':
    'Section=ability,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Dexterity, Intelligence)",' +
      '"8 hr observation and research, plus a successful DC 10+HD Investigation, gives Adv on Deception and Stealth to gain access to target"',
  'Sundered Blood':
    'Section=save ' +
    'Note="%{level<12?\'Resistance\':\'Immunity\'} to chosen damage type"',
  'Sundered Form':
    'Section=magic ' +
    'Note="May spend 8 HD and use a bonus action to assume Fallen form, gain resistance to nonmagical bludgeoning, piercing, and slashing damage, and create a 30\' radius that inflicts 10 HP damage on foes"',
  'Sundered Fury':
    'Section=ability,combat ' +
    'Note=' +
      '"Ability Boost (Choose 1 from any)",' +
      '"May spend 1 HD for +2 HD weapon or spell damage"',
  'Tactical Direction':
    'Section=feature ' +
    'Note="May take Initiative 1 to give each ally a bonus action to attack, Dash, or Disengage on their first turn"',
  'The Channeling':
    'Section=magic ' +
    'Note="May spend a level 1 spell slot to change a spell\'s damage type, a level 2 spell slot to reroll 1s and 2s on a spell\'s damage dice, or a level 3 spell slot to give 3 spell targets Disadv on a spell save"',
  'The Eye Opens':
    'Section=ability,magic ' +
    'Note=' +
      '"+1 Wisdom",' +
      '"May cast self <i>True Seeing</i> 3/long rest" ' +
    'Spells="True Seeing"',
  'The Wild Hunt':
    'Section=magic ' +
    'Note="May summon 1 CR 4, 2 CR 2, or 4 CR 1 beasts to assist for 10 min"',
  'Tough As Iron':
    'Section=combat ' +
    'Note="May reduce damage by %{(level/3+1)<?6} for 10 min; suffers 1 level of exhaustion afterward"',
  'Unbroken':
    'Section=combat ' +
    'Note="May suffer 1 level of exhaustion to negate attack damage"',
  'Unseen Lurker':
    'Section=ability,skill ' +
    'Note=' +
      '"Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
      '"Invisible during Lurk; may Lurk during combat"',
  'Vicious Assault':
    'Section=ability,combat,combat ' +
    'Note=' +
      '"+1 Strength",' +
      '"Unarmed strike inflicts 1d6 HP",' +
      '"May use a bonus action for a second unarmed strike and add ability modifier to damage"',
  'Warding Presence':
    'Section=combat ' +
    'Note="Adjacent foes suffer half speed and Disadv on attacks on an adjacent ally"',
  'Well-Spoken':
    'Section=skill,skill ' +
    'Note=' +
      '"Skill Proficiency (Deception/Intimidation/Persuasion)",' +
      '"Dbl proficiency bonus +%{proficiencyBonus} on %{level//5<?3} choices from Deception, Intimidation, Persuasion"',
  'Wild Companion':
    'Section=feature ' +
    'Note="CR 1 companion beast gains +%{proficiencyBonus} AC, attack, damage, and proficient skills and saves; hit points increase to %{level*4}"',
  'Wild Resilience':
    'Section=ability,save ' +
    'Note=' +
      '"+1 Constitution",' +
      '"May reroll a Strength, Dexterity, or Constitution save %{level//9+1}/long rest"',
  'Wild Sense':
    'Section=feature,feature ' +
    'Note=' +
      '"Has Darkvision feature",' +
      '"Can sense invisible foes"',

  // Paths
  'Astirax Servant':
    'Section=feature ' +
    'Note="May communicate telepathically %{level<10?\\"100\'\\":\\"1 mile\\"} w/bound astirax"',
  'Aura Of Darkness':
    'Section=feature ' +
    'Note="May create a 20\' radius of darkness that others cannot see through for 1 min"',
  'Bestial Astirax Servant':
    'Section=feature ' +
    'Note="May communicate telepathically 100\' w/bound astirax/Astirax may possess a Large creature"',
  'Dark Warrior':
    'Section=feature ' +
    'Note="May use a bonus action to make an additional attack %{wisdomModifier>?1}/long rest"',
  "Dark God's Blessing":
    'Section=combat Note="Self regains %{level<10?2:4}d6 HP from killing"',
  'Dire Bodyguard':
    'Section=feature ' +
    'Note="Adjacent foes suffer Disadv on attacks on others; self can use Reaction to make a melee attack"',
  'Dominate Undead':
    'Section=combat ' +
    'Note="R30\' May use Channel Energy to control undead (Wisdom neg) for 1 hr"',
  'Dread Avatar':
    'Section=save ' +
    'Note="Resistance to nonmagical bludgeoning, piercing, and slashing damage/Immunity to radiant damage"',
  'Ferocious Blow':
    'Section=feature ' +
    'Note="May use Channel Divinity to inflict +2d6 HP thunder; medium foe pushed 10\' and knocked prone"',
  'Impervious To Magic':
     'Section=magic Note="May use Reaction to cast <i>Counterspell</i>"',
  'Improved Astirax Bond':
    'Section=feature ' +
    'Note="Astirax gains +%{proficiencyBonus} AC, attack, damage, and proficient saves and skills/May extend scent magic to 1 mile for 1 min 1/dy"',
  'Mage Hunter':
    'Section=combat ' +
    'Note="R%{30+(combatNotes.masterMageHunter?30:0)}\' May use Channel Divinity to inflict Disadv on concentration of %{combatNotes.masterMageHunter?\'all casters\':\'target caster\'} and Adv on saves vs. spells of %{combatNotes.masterMageHunter?\'all casters\':\'target caster\'} (Wisdom neg) for 1 min"',
  'Master Mage Hunter':'Section=combat Note="Increased Mage Hunter effects"',
  'Necromantic Arts':
    'Section=magic ' +
    'Note="Knows <i>Chill Touch</i> cantrip" ' +
    'Spells="Chill Touch"',
  'Potent Spellcasting':
    'Section=magic Note="+%{wisdomModifier} Cleric cantrip damage"',

  // Races
  // SRD5E defines Darkvision, Dwarven Resilience, Fey Ancestry,
  // Halfling Nimbleness, Lucky (Halfling), Slow, Steady, and Trance
  'Animal Bond':
    'Section=skill Note="Adv to control, persuade, or communicate w/animals"',
  'Born Of The Sea':
    'Section=ability,skill ' +
    'Note=' +
      '"May use a bonus action to gain 1 hr water breathing 1/short rest",' +
      '"Tool Proficiency (Water Vehicles)"',
  'Caransil Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Charisma"',
  'Caransil Weapon Training':
    'Section=combat Note="Weapon Proficiency (Longbow/Longsword)"',
  'Child Of The North':'Section=save Note="Adv vs. extreme cold"',
  'Clan Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution"',
  'Clan Warrior Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Battleaxe/Warhammer)/Armor Proficiency (Medium)"',
  'Danisil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Intelligence"',
  'Danisil Weapon Training':
    'Section=combat Note="Weapon Proficiency (Scimitar/Shortbow)"',
  'Dorn Ability Adjustment':
    'Section=ability Note="+1 Strength/Ability Boost (Choose 2 from any)"',
  // Override SRD5E
  'Dwarven Toughness':'Section=Combat Note="+%{level + 2} Hit Points"',
  'Enslaved Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Constitution"',
  'Erenlander Ability Adjustment':
    'Section=ability Note="Ability Boost (Choose 2 from any)"',
  'Erunsil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Strength"',
  'Erunsil Weapon Training':
    'Section=combat Note="Weapon Proficiency (Erunsil Fighting Knife/Longbow)"',
  'Fast':'Section=ability Note="+5 Speed"',
  'Ferocity':'Section=combat Note="+2 Strength melee damage"',
  'Gnome Ability Adjustment':
    'Section=ability Note="+2 Intelligence/+1 Charisma"',
  'Gnomish Cunning':SRD5E.FEATURES['Gnome Cunning'],
  'Halfling Magic':
    'Section=magic ' +
    'Note="Knows <i>Mending</i> and <i>Prestidigitation</i> cantrips"',
  'Human Feat Bonus':'Section=feature Note="+1 general feat"',
  'Innate Magic User':'Section=magic Note="Knows 1 Sorcerer cantrip"',
  'Innate Magical Scholar':'Section=magic Note="Knows 2 Wizard cantrips"',
  'Kurgun Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/+2 Wisdom"',
  'Kurgun Warrior Training':
    'Section=combat ' +
    'Note="Weapon Proficiency (Handaxe/Shortbow/Spear)/Armor Proficiency (Medium)"',
  'Militant Culture':
    'Section=combat ' +
    'Note="Weapon Proficiency (Battleaxe/Greataxe/Longbow/Spear)"',
  'Miransil Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Miransil Weapon Training':
    'Section=combat Note="Weapon Proficiency (Javelin/Trident)"',
  'Nomadic Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+1 Wisdom"',
  'Orc Ability Adjustment':'Section=ability Note="+2 Constitution/+2 Strength"',
  'Riverfolk':
    'Section=skill ' +
    'Note="Skill Proficiency (Athletics/Insight/Persuasion)/Tool Proficiency (Water Vehicles)"',
  'Sarcosan Ability Adjustment':
    'Section=ability Note="+1 Dexterity/Ability Boost (Choose 2 from any)"',
  'Stonemaster\'s Cunning':
    'Section=skill ' +
    'Note="Adv on stonework origin and underground direction and construction"',
  'Troubled Dreams':
    'Section=combat Note="Recovers 1 fewer hit die from a long rest"',
  'Unexpected Blow':
    'Section=combat ' +
    'Note="May reroll 1 damage die when attacking an unaware foe"',
  'Wraith Of The North':
    'Section=skill Note="May hide in nature when lightly obscured"',

  // Legate domains
  'Keeper Of Obsidian Domain':
    'Spells=' +
      '"1:Detect Magic","1:Inflict Wounds",' +
      '3:Blindness/Deafness,"3:See Invisibility",' +
      '"5:Bind/Banish Astirax","5:Bestow Curse",' +
      '7:Blight,"7:Phantasmal Killer",' +
      '9:Cloudkill,9:Contagion',
  'Soldier Legate Domain':
    'Spells=' +
      '1:Bane,"1:Hellish Rebuke",' +
      '"3:Magic Weapon",3:Darkvision,' +
      '5:Haste,"5:Vampiric Touch",' +
      '7:Regenerate,7:Stoneskin,' + // Replace Banishment as per errata
      '"9:Cone Of Cold","9:Hold Monster"',
  'Witch Taker Domain':
    'Spells=' +
      '"1:Detect Magic","1:Disguise Self",' +
      '"3:Detect Thoughts","3:Ray Of Enfeeblement",' +
      '"5:Bind/Banish Astirax",5:Counterspell,' +
      '7:Confusion,"7:Freedom Of Movement",' +
      '9:Scrying,"9:Dominate Person"'

};
MidnightLegacy.FEATURES =
  Object.assign({}, SRD5E.FEATURES, MidnightLegacy.FEATURES_ADDED);
MidnightLegacy.LANGUAGES = {
  'Clan Dialect':'',
  'Colonial':'',
  'Courtier':'',
  'Erenlander':'',
  'Halfling':'',
  'High Elven':'',
  'Norther':'',
  'Old Dwarven':'',
  'Orcish':'',
  'Patrol Sign':'',
  'Shadow Tongue':'',
  'Sylvan':'',
  "Trader's Tongue":''
};
MidnightLegacy.HEROIC_PATHS = {
  'Avenger':'',
  'Beastborn':'',
  'Believer':'',
  'Channeler':'',
  'Dragonblooded':'',
  'Earthblooded':'',
  'Guardian':'',
  'Ironborn':'',
  'None':'',
  'Preserver':'',
  'Speaker':'',
  'Sunderborn':'',
  'Wildblooded':''
};
MidnightLegacy.RACES = {
  'Caransil Elf':
    'Features=' +
      '"Skill Proficiency (Perception/Stealth)",' +
      '"Language (High Elven/Erenlander/Choose 1 from Trader\'s Tongue, Old Dwarven, Orcish)",' +
      '"Caransil Ability Adjustment",' +
      '"Caransil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic User",Trance',
  'Clan Dwarf':
    'Features=' +
      '"Tool Proficiency (Choose 1 from Brewer\'s Supplies, Mason\'s Tools, Smith\'s Tools)",' +
      '"Language (Clan Dialect/Old Dwarven/Choose 1 from Erenlander, Trader\'s Tongue, Orcish)",' +
      '"Clan Dwarf Ability Adjustment",' +
      '"Clan Warrior Training",Darkvision,"Dwarven Resilience",' +
      '"Dwarven Toughness",Slow,Steady,"Stonemaster\'s Cunning"',
  'Danisil Elf':
    'Features=' +
      '"Skill Proficiency (History)",' +
      '"Language (High Elven/Choose 1 from Sylvan, Halfling)",' +
      '"Danisil Elf Ability Adjustment",' +
      '"Danisil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magical Scholar",Trance',
  'Dorn Human':
    'Features=' +
      '"Skill Proficiency (Survival/Choose 1 from any)",' +
      '"Language (Erenlander/Norther/Choose 1 from any)",' +
      '"Dorn Ability Adjustment",' +
      '"Human Feat Bonus"',
  'Enslaved Halfling':
    'Features=' +
      '"Language (Erenlander/Halfling/Choose 1 from Orcish, Trader\'s Tongue)",' +
      '"Enslaved Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness","Lucky (Halfling)",Slow,Small,' +
      '"Unexpected Blow"',
  'Erenlander Human':
    'Features=' +
      '"Skill Proficiency (Choose 3 from any)",' +
      '"Tool Proficiency (Land Vehicles/Choose 1 from any Artisan)",' +
      '"Language (Erenlander/Choose 1 from any)",' +
      '"Erenlander Ability Adjustment","Human Feat Bonus"',
  'Erunsil Elf':
    'Features=' +
      '"Skill Proficiency (Survival)",' +
      '"Language (High Elven/Orcish/Trader\'s Tongue)",' +
      '"Erunsil Elf Ability Adjustment",' +
      '"Erunsil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Wraith Of The North"',
  'Gnome':
    'Features=' +
      '"Tool Proficiency (Choose 1 from any Artisan)",' +
      '"Language (Erenlander/Trader\'s Tongue/Choose 2 from any)",' +
      '"Gnome Ability Adjustment",' +
      'Darkvision,"Gnomish Cunning",Riverfolk,Slow,Small',
  'Kurgun Dwarf':
    'Features=' +
      '"Tool Proficiency (Choose 1 from Brewer\'s Supplies, Mason\'s Tools, Smith\'s Tools)",' +
      '"Language (Clan Dialect/Old Dwarven/Choose 1 from Erenlander, Trader\'s Tongue, Orcish)",' +
      '"Kurgun Dwarf Ability Adjustment",' +
      '"Kurgun Warrior Training",Darkvision,"Dwarven Resilience",Slow,Steady',
  'Miransil Elf':
    'Features=' +
      '"Skill Proficiency (Athletics/Insight)",' +
      '"Language (High Elven/Colonial/Trader\'s Tongue)",' +
      '"Miransil Elf Ability Adjustment",' +
      '"Miransil Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      'Trance,"Born Of The Sea"',
  'Nomadic Halfling':
    'Features=' +
      '"Language (Erenlander/Halfling/Choose 1 from Orcish, Trader\'s Tongue)",' +
      '"Nomadic Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness","Lucky (Halfling)",Slow,Small,' +
      '"Animal Bond"',
  'Orc':
    'Features=' +
      '"Language (Orcish/Shadow Tongue/Choose 2 from any)",' +
      '"Orc Ability Adjustment",' +
      '"Child Of The North",Darkvision,Ferocity,"Militant Culture",' +
      '"Troubled Dreams"',
  'Sarcosan Human':
    'Features=' +
      '"Skill Proficiency (Choose 1 from Animal Handling, History/Choose 1 from any)",' +
      '"Language (Erenlander/Colonial/Choose 1 from any)",' +
      '"Sarcosan Ability Adjustment",' +
      '"Human Feat Bonus"'
};
MidnightLegacy.SPELLS_ADDED = {
  'Bind/Banish Astirax':
    'School=Divination ' +
    'Level=C3,D3,P3 ' +
    'Description=' +
      '"R200\' Self senses astiraxes, R10\' may control for 366 dy or inflict 4d12 HP radiant (Wisdom neg; Adv if possessing an animal)"',
  'Disguise Ally':
    'School=Illusion ' +
    'Level=B2,S2,W2 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R100\' Alters appearance of willing target and possessions (Investigation detects) while w/in range for conc up to 1 hr"',
  'Greenshield':
    'School=Abjuration ' +
    'Level=D2 ' +
    'Description=' +
      '"Vegetation in 20\' radius allows only allies to pass (Investigation detects; Disadv in nature) for 12 hr"',
  'Heed The Whisper':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'AtHigherLevels="may sense from any known spot in Erethor" ' +
    'Description=' +
      '"RSelf May sense creatures in a 300\' radius and cannot be surprised, even during sleep, while w/in 1 mile of Erethor for 8 hr"',
  'Lifetrap':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'AtHigherLevels="affects +1 target" ' +
    'Description=' +
      '"R150\' Target creature restrained (Strength ends) for conc up to 1 min; undead suffers 1d12 HP radiant per rd restrained at end"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'AtHigherLevels="+10\' radius" ' +
    'Description=' +
      '"R120\' Plants and animals indicate location of hidden creatures for conc up to 1 min"',
  'Silver Blood':
    'School=Abjuration ' +
    'Level=B2,S2,W2 ' +
    'Ritual=true ' +
    'Description=' +
      '"Self suffers 1d4 HP to create silver ammo, warding line (DC 14 Wisdom neg), or astirax scent barrier for 1 hr"',
  'Silver Storm':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'AtHigherLevels="+10\' cone" ' +
    'Description=' +
      '"70\' cone inflicts 10d4 HP piercing (10d8 HP if vulnerable; Dexterity half)"',
  'Silver Wind':
    'School=Conjuration ' +
    'Level=S4,W4 ' +
    'Description=' +
      '"R200\' 40\' sphere reveals invisible creatures and stuns vulnerable targets (Constitution ends) for conc up to 1 min"',
  // Removed
  'Astral Projection':null,
  'Augury':null,
  'Banishment':null,
  'Blink':null,
  'Commune':null,
  'Conjure Celestial':null,
  'Contact Other Plane':null,
  'Creation':null,
  'Demiplane':null,
  'Dimension Door':null,
  'Divination':null,
  'Etherealness':null,
  'Forbiddance':null,
  'Gate':null,
  'Magnificent Mansion':null,
  'Maze':null,
  'Planar Ally':null,
  'Planar Binding':null,
  'Plane Shift':null,
  'Rope Trick':null,
  'Secret Chest':null,
  'Teleport':null,
  'Wish':null
};
MidnightLegacy.SPELLS =
  Object.assign({}, SRD5E.SPELLS, MidnightLegacy.SPELLS_ADDED);
for(let s in MidnightLegacy.SPELLS) {
  if(MidnightLegacy.SPELLS[s] == null)
    delete MidnightLegacy.SPELLS[s];
}
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
MidnightLegacy.WEAPONS =
  Object.assign({}, SRD5E.WEAPONS, MidnightLegacy.WEAPONS_ADDED);

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
  rules, alignments, backgrounds, classes, deities, heroicPaths, races
) {
  QuilvynUtils.checkAttrTable(heroicPaths, []);
  SRD5E.identityRules
    (rules, alignments, backgrounds, classes, deities, {}, races);
  for(let hp in heroicPaths) {
    MidnightLegacy.choiceRules(rules, 'Heroic Path', hp, heroicPaths[hp]);
  }
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
  let basePlugin = window.PHB5E != null ? PHB5E : SRD5E;
  if(type != 'Heroic Path')
    basePlugin.choiceRules(rules, type, name, attrs);
  if(type == 'Class')
    MidnightLegacy.classRulesExtra(rules, name);
  else if(type == 'Feat')
    MidnightLegacy.featRulesExtra(rules, name);
  else if(type == 'Heroic Path')
    MidnightLegacy.heroicPathRulesExtra(rules, name);
  else if(type == 'Race')
    MidnightLegacy.raceRulesExtra(rules, name);
  if(type == 'Heroic Path') {
    rules.addChoice('heroicPaths', name, attrs);
    rules.defineRule('features.' + name, 'heroicPath', '=', 'source == "' + name + '" ? 1 : null');
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
    rules.defineChoice('extras', name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Features');
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
MidnightLegacy.classRulesExtra = function(rules, name) {
  let classLevel = 'levels.' + name;
  if(name == 'Cleric') {
    rules.defineRule('clericHasPotentSpellcasting',
      'features.Keeper Of Obsidian Domain', '=', '1'
    );
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
    rules.defineRule('combatNotes.mageHunter', // Italics noop
      'combatNotes.masterMageHunter', '+', 'null'
    );
  }
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the attributes passed to featRules.
 */
MidnightLegacy.featRulesExtra = function(rules, name) {
  if(name == 'Apex Predator') {
    rules.defineRule
      ('weapons.Unarmed.2', 'combatNotes.viciousAssault', '^', '"1d8"');
  } else if(name == 'Brawler') {
    rules.defineRule('weapons.Unarmed.2', 'combatNotes.brawler', '^', '"1d4"');
  } else if(name == 'Channeled Magic') {
    rules.defineRule
      ('magicNotes.channeledMagic', 'level', '=', 'source<10 ? 1 : 2');
    ['B', 'C', 'D', 'P', 'R', 'S', 'W'].forEach(spellGroup => {
      [0, 1, 2, 3, 4, 5, 6].forEach(spellLevel => {
        let slot = spellGroup + spellLevel;
        let sorter = spellLevel + spellGroup;
        rules.defineRule
          ('highestSpellSlot', 'spellSlots.' + slot, '^=', '"' + sorter + '"');
        rules.defineRule('magicNotes.channeledMagic.1',
          'features.Channeled Magic', '?', null,
          'highestSpellSlot', '=', 'source.charAt(1) + source.charAt(0)'
        );
        rules.defineRule('channeledSlots.' + slot,
          'magicNotes.channeledMagic.1', '?', 'source == "' + slot + '"',
          'magicNotes.channeledMagic', '=', null
        );
        rules.defineRule
          ('spellSlots.' + slot, 'channeledSlots.' + slot, '+', null);
      });
    });
  } else if(name == 'Conduit') {
    rules.defineRule('spellSlots.S0', 'magicNotes.conduit', '+=', '2');
  } else if(name == 'Improvised Fighter') {
    SRD5E.weaponRules
      (rules, 'Improvised', 'Simple Melee', ['Thrown'], '1d4', '20/60');
    rules.defineRule
      ('weapons.Improvised', 'combatNotes.improvisedFighter', '=', '1');
    rules.defineRule
      ('weapons.Improvised.2', 'combatNotes.improvisedFighter', '^=', '"1d6"');
  } else if(name == 'Pure Magic') {
    rules.defineRule('spellAttackModifier.S', 'magicNotes.pureMagic', '+', '1');
  } else if(name == 'Raging Fury') {
    rules.defineRule
      ('spellAttackModifier.S', 'magicNotes.ragingFury', '+', '1');
  } else if(name == 'Vicious Assault') {
    rules.defineRule
      ('weapons.Unarmed.2', 'combatNotes.viciousAssault', '^', '"1d6"');
  } else if(name == 'Wild Sense') {
    rules.defineRule('features.Darkvision', 'featureNotes.wildSense', '=', '1');
  }
};

/*
 * Defines in #rules# the rules associated with heroic path #name# that cannot
 * be derived directly from the abilities passed to heroicPathRules.
 */
MidnightLegacy.heroicPathRulesExtra = function(rules, name) {
  if(name == 'Dragonblooded') {
    rules.defineRule('casterLevels.Dragonblooded',
      'heroicPath', '?', 'source == "Dragonblooded"',
      'level', '=', null
    );
    rules.defineRule('casterLevel.S', 'casterLevels.Dragonblooded', '^=', null);
  }
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
MidnightLegacy.raceRulesExtra = function(rules, name) {
  if(name == 'Caransil Elf')
    rules.defineRule
      ('spellSlots.S0', 'magicNotes.innateMagicUser', '+=', '1');
  else if(name == 'Danisil Elf')
    rules.defineRule
      ('spellSlots.W0', 'magicNotes.innateMagicalScholar', '+=', '2');
  else if(name.match(/Halfling/)) {
    let raceLevel =
      name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';
    SRD5E.featureSpells(rules,
      'Halfling Magic', 'Halfling', raceLevel, ['Mending', 'Prestidigitation']
    );
    rules.defineRule('casterLevels.Halfling', raceLevel, '=', null);
    rules.defineRule('spellModifier.Halfling',
      'casterLevels.Halfling', '?', null,
      // NOTE: Rules don't specify the ability, but most classes
      // w/Prestidigitation in their spell lists use charisma
      'charismaModifier', '=', null
    );
    rules.defineRule('spellAttackModifier.Halfling',
      'spellModifier.Halfling', '=', null,
      'proficiencyBonus', '+', null
    );
    rules.defineRule('spellDifficultyClass.Halfling',
      'spellAttackModifier.Halfling', '=', '8 + source'
    );
  } else if(name.match(/Human/))
    rules.defineRule
      ('featCount.General', 'featureNotes.humanFeatBonus', '+=', '1');
};

/* Returns an array of plugins upon which this one depends. */
MidnightLegacy.getPlugins = function() {
  let result = [];
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
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '  Quilvyn makes available the expanded options, feats, spells, etc.' +
    "  from the Player's Handbook if the D&amp;D 5E rule set is loaded." +
    '  </li><li>\n' +
    '  Racial origin choices (Dorn, Erenlander, or Sarcosan Human; Clan' +
    '  or Kurgun Dwarf, etc.) are absorbed into the list of races.' +
    '  </li><li>\n' +
    '  As noted by the Legacy of Darkness errata, Quilvyn replaces the' +  
    '  <i>Banishment</i> spell in the list of domain spells for the Soldier' +
    '  Legate class option with <i>Regeneration</i>. Quilvyn also drops some' +
    '  spells that do not exist in Midnight from some SRD class options' +
    '  (e.g., Quilvyn drops <i>Divination</i> from the spells acquired by' +
    '  Circle Of The Land (Forest) druids).\n' +
    '  </li><li>\n' +
    '  The Midnight Legacy rule set allows you to add homebrew choices for' +
    '  all of the same types discussed in the <a href="plugins/homebrew-srd5e.html">SRD 5E Homebrew Examples document</a>.' +
    '  In addition, the ML rule set allows adding homebrew heroic paths,' +
    '  which require specifying only the heroic path name.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    "Quilvyn\'s Midnight Rule Set uses Open Game Content " +
    'released by Edge Studio under the Open Game ' +
    'License. Copyright 2021, Edge Studio under license of Fantasy Flight' +
    'Games. Authors: Greg Benage and Robert Vaughn.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Edge Studio. Portions ' +
    'of the materials used are property of Edge Studio. © Edge Studio.\n' +
    '</p><p>\n' +
    'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC. You ' +
    'should have received a copy of the Open Game License with this program; ' +
    'if not, you can obtain one from ' +
    'https://media.wizards.com/2016/downloads/SRD-OGL_V1.1.pdf. ' +
    '<a href="plugins/ogl-midnightlegacy.txt">Click here</a> to see the license.<br/>\n'+
    '</p><p>\n' +
    'Midnight : Legacy of Darkness © 2021 Edge Studio.\n' +
    '</p>\n';
};
