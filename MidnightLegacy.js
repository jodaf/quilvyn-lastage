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
  for(var s in MidnightLegacy.SPELLS) {
    if(MidnightLegacy.SPELLS[s] == null)
      delete MidnightLegacy.SPELLS[s];
  }
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
      '"Skill Proficiency (Perception/Survival)",' +
      'Survivalist ' +
    'Languages="Trader\'s Tongue",any'
};
MidnightLegacy.BACKGROUNDS =
  Object.assign({}, SRD5E.BACKGROUNDS, MidnightLegacy.BACKGROUNDS_ADDED);
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
  'Shieldwall Soldier':
    'Type=General ' +
    'Require="features.Armor Proficiency (Medium)","constitution >= 13"',
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
    'Note="Know basics of Shadow military organization; can get messages to slaves undetected"',
  'Military Rank':
    'Section=feature Note="Comrades and soldiers show respect and deference"',
  'Old Veteran':
    'Section=feature Note="Know how to infiltrate military orders"',
  'Survivalist':
    'Section=skill ' +
    'Note="Can detect presence of hostile creatures and blighted lands, find shelter from weather"',
  'Sympathetic Ally':
     'Section=feature ' +
     'Note="Receives support and info from contact in occupied lands"',

  // Feats
  'Battlefield Healer':
    'Section=combat,skill ' +
    'Note="Allies regain extra HD from long rest",' +
         '"DC 15 Int with healer\'s kit stabilizes and restores 3 HP"',
  'Brawler':
    'Section=combat ' +
    'Note="Unarmed strike does d4 damage, gives bonus action for second strike, grapple, or knock prone"',
  'Captor':
    'Section=ability,combat ' +
    'Note="+1 Strength",' +
         '"Adv on Athletics to grapple when unseen; grapple silently; move at full speed while grappling"',
  'Fellhunter':
    'Section=skill ' +
    'Note="DC 12 Religion gives Adv on saves and inflicts Disadv on undead for 1 min 1/long rest"',
  'Harrier':
    'Section=combat ' +
    'Note="Mounted move negates foe OA causes successful attacks to knock prone"',
  'Improvised Fighter':
    'Section=combat ' +
    'Note="Weapon Proficiency (Improvised)/Improvised weapon damage increased to 1d6"',
  'Knife Fighter':
    'Section=ability,combat ' +
    'Note="+1 Dexterity",' +
         '"Dagger crits on 18; crit hit inflicts Disadv on combat for 1 rd"',
  'Learned':
    'Section=skill ' +
    'Note="+1 Language Count/Can read and write/Skill Proficiency (Choose 1 from History, Religion)"',
  'Paranoid':
    'Section=combat ' +
    'Note="Cannot be surprised when asleep/Automatic Dodge in first round"',
  'Polyglot':
    'Section=skill ' +
    'Note="General language understanding after 1 dy, DC 15 Int to learn after 1 wk"',
  'Scavenger':
    'Section=ability,skill ' +
    'Note="Ability Boost (Choose 1 from Intelligence, Wisdom)",' +
         '"DC 15 Perception to recover all ammo; DC 12 Investigation to scavenge weapon or armor materials"',
  'Seamaster':
    'Section=ability,feature,skill ' +
    'Note="Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
         '"Increase speed of commanded ship by 2 MPH, climb rope at full speed",' +
         '"No Disadv to pilot ship through storm"',
  'Shieldwall Soldier':
    'Section=combat Note="R5\' Ally +1 AC, +2 if self has shield"',
  'Subtle Spellcaster':
    'Section=magic,skill ' +
    'Note="Cast 2 chosen level 1 spells 1/long rest",' +
         '"Sleight Of Hand vs. passive Perception to cast spells unnoticed"',
  'Suspicious':
    'Section=ability,skill ' +
    'Note="+1 Intelligence",' +
         '"Skill Proficiency (Insight)/Dbl proficiency for Insight and passive Perception/DC 20 Investigation to note flaws in story detail"',
  'Unremarkable':
    'Section=ability,feature ' +
    'Note="+1 Wisdom","Run through crowds unnoticed/Foe passive Perception to notice self reduced to 12"',

  // Heroic Paths
  'Acts Of Service':
    'Section=ability,combat,skill ' +
    'Note="Ability Boost (Choose 1 from Strength, Wisdom)",' +
         '"Foes suffer Disadv attacking adjacent incapacitated allies; self gains Adv on attacks",' +
         '"May spend 2 uses of Healer\'s Kit to reduce exhaustion, or restore ability or HP maximum"',
  'Apex Predator':
    'Section=ability,combat,feature ' +
    'Note="+2 Strength",' +
         '"+20 Hit Points/Unarmed strike inflicts 1d8 damage",' +
         '"Pack Alpha affects all creatures"',
  'Avatar Of Aryth':'Section=magic Note="Summon earth elemental 1/long rest"',
  'Bulwark Of Faith':
    'Section=ability,save ' +
    'Note="Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
         '"Adv vs. spells of celestials, fiends, undead, and Shadow agents"',
  'Changed To The Core':
    'Section=combat ' +
    'Note="R50\' Persuasion vs. Insight causes target foe to flee (%{level//2+1}+ HD) or switch sides 1/long rest"',
  'Channeled Magic':'Section=magic Note="%V additional %1 spell slot"',
  'Conduit':'Section=magic Note="Know 2 Sorcerer cantrips"',
  'Courage Of Your Convictions':
    'Section=combat ' +
    'Note="R50\' Use inspiration and bonus action to remove condition from self and allies"',
  'Crowd Rouser':
    'Section=magic ' +
    'Note="R50\' May charm and convince listeners (DC %{8+charismaModifier+proficiencyBonus} Wis neg) for 1 wk 1/short rest"',
  'Crucial Strike':
    'Section=ability,combat ' +
    'Note="+1 Charisma",' +
         '"Use reaction to give ally additional attack with +%{proficiencyBonus} damage"',
  'Deadly Strike':
    'Section=combat Note="May automatically crit on strike w/Adv 1/short rest"',
  'Ethereal Presence':'Section=magic Note="Spend 1 HD for 1 min etherealnes"',
  'Fallen Sense':
    'Section=ability,feature,magic ' +
    'Note="Ability Boost (Choose 1 from any)",' +
         '"Communicate with outsider for conc or 1 hr",' +
         '"R60\' Detect location and type of Fallen"',
  'Fireheart':
    'Section=magic,save ' +
    'Note="May reroll fire spell damage","Resistance to fire damage"',
  'Folk Medicine':
    'Section=skill ' +
    'Note="Restore 1d6+%{wisdomModifier} per use of Healer\'s Kit"',
  'For Victory!':
    'Section=ability,combat ' +
    'Note="+1 Charisma",' +
         '"R30\' DC 15 Charisma gives allies +%{proficiencyBonus} attack and damage for 1 min 1/long rest"',
  'Friends Until The End':
    'Section=ability,combat,feature ' +
    'Note="Ability Boost (Choose 1 from Dexitery, Strength)",' +
         '"Make take damage for Animal Companion if adjacent",' +
         '"Animal Companion guards self when incapacitated"',
  'Guard':
    'Section=combat ' +
    'Note="Use bonus action to give adjacent ally +1 AC (+2 with shield)"',
  'Hard To Kill':
    'Section=save Note="Death save on roll of 6; 16 restores 1 HP"',
  'Holy Terror':
    'Section=combat ' +
    'Note="R30\' Use inspiration and bonus action to turn foes (DC %{8+wisdomModifier+proficiencyBonus} Wisdom neg) for 1 min"',
  'Indefatigable':
    'Section=ability,feature ' +
    'Note="Ability Boost (Choose 1 from Constitution, Strength)/No Disadv on Con or Str checks due to exhaustion",' +
         '"DC 15 Constitution check to dbl exhaustion recovery"',
  'Inspiring Faith':'Section=feature Note="Gain inspiration after short rest"',
  'Intimidating Presence':'Section=ability,magic ' +
    'Note="+1 Charisma",' +
         '"R30\' Casting spell frightens foes (Wis neg)"',
  'Lurk':
    'Section=skill ' +
    'Note="Make Stealth vs. passive Perception to become unnoticed"',
  'Masterful Focus':
    'Section=ability,save ' +
    'Note="Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
         '"+%{proficiencyBonus} concentration to maintain spell"',
  'Mind Within The Weave':
    'Section=magic ' +
    'Note="May simultaneously maintain concentration on two spells"',
  'Natural Bond':
    'Section=feature ' +
    'Note="Animals treat self as a friend (DC %{8+proficiencyBonus+wisdomModifier} Wis neg)"',
  'Nexus Affinity':
    'Section=ability,feature,skill ' +
    'Note="+1 Wisdom",' +
         '"+1d6 ability, attack, and save w/in 1 mile of a power nexus or black mirror",' +
         '"DC 16 Insight to detect power nexus or black mirror w/in 5 miles"',
  'Nexus Guardian':
    'Section=feature ' +
    'Note="May attune to nexus, which grants remote charge use, teleportation to nexus, agelessness, and reincarnation"',
  'One With The Earth':
    'Section=feature,skill ' +
    'Note="Know north, direction of water and geologic features w/in 5 miles, direction of buildings w/in 1 mile",' +
         '"Skill Proficiency (Perception/Survival)"',
  'Pack Alpha':
    'Section=feature,skill ' +
    'Note="May frighten beasts in 30\' radius (DC %{8+proficiencyBonus+strengthModifier} Wis neg)",' +
         '"Adv Animal Handling (predatory beasts)"',
  'Pack Fighter':
    'Section=ability,combat ' +
    'Note="+1 Wisdom",' +
         '"Animal Companion can attack at same time as self if adjacent"',
  'Pure Magic':'Section=magic Note="+%V spell attack and save DC"',
  'Quick Recovery':
    'Section=ability,combat ' +
    'Note="+1 Constitution",' +
         '"May trade 1 level of exhaustion to recover hit dice, adding %{constitutionModifier} to each"',
  'Raging Fury':
    'Section=magic ' +
    'Note="Increased Pure Magic effects/May cast 1 action spell as bonus action"',
  'Rallying Cry':
    'Section=ability,combat ' +
    'Note="+1 Charisma",' +
         '"R50\' DC 15 Persuasion gives allies %{level} temporary HP 1/long rest"',
  'Reassuring Presence':
    'Section=ability,combat ' +
    'Note="Ability Boost (Choose 1 from Charisma, Wisdom)",' +
         '"R60\' 6 allies gain %{level} temporary HP at start of combat"',
  'Resourceful':
    'Section=ability,skill ' +
    'Note="+1 Wisdom","Long rest restores 1d6+1 uses of Healer\'s Kit"',
  'Rooted':
    'Section=ability,combat ' +
    'Note="+1 Constitution",' +
         '"Cannot be moved or knocked prone/Adv on grappling"',
  'Scathing Rebuke':
    'Section=combat ' +
    'Note="$50\' Intimidation vs. Insight stuns target 3/long rest"',
  'Silencing Strike':
    'Section=combat ' +
    'Note="Melee hit silences target for 1 min (DC %{8+proficiencyBonus+intelligenceModifier} Con neg) 1/short rest"',
  'Skilled Healer':
    'Section=skill ' +
    'Note="May spend 1 Healer\'s Kit use to remove blindness, deafness, paralysis, or poison or to give Adv on next save vs. disease"',
  'Strength Of Faith':
    'Section=ability,save ' +
    'Note="Ability Boost (Choose 1 from Charisma, Intelligence, Wisdom)",' +
         '"R30\' Apply successful Charisma, Intelligence, or Wisdom save to self and 1 ally"',
  'Study The Target':
    'Section=ability,skill ' +
    'Note="+1 Dexterity",' +
         '"8 hr observation and research plus DC 10+HD Investigation check gives Adv on Deception and Stealth to gain access to target"',
  'Sundered Blood':
    'Section=save ' +
    'Note="%{level<12\'Resistance\':\'Immunity\'} to chosen damage type"',
  'Sundered Form':
    'Section=magic Note="Spend 8 HD to assume Fallen form, gain resistance to nonmagical bludgeoning, piercing, and slashing damage, and 30\' radius that inflicts 10 HP damage"',
  'Sundered Fury':
    'Section=ability,combat ' +
    'Note="Ability Boost (Choose 1 from any)",' +
          '"Spend 1 HD for 2 HD damage w/weapon or spell"',
  'Tactical Direction':
    'Section=feature ' +
    'Note="Trade Initiative 1 to give each ally a bonus action on first turn"',
  'The Channeling':
    'Section=magic ' +
    'Note="May spend level 1 slot to change spell damage type, level 2 slot to reroll 1 or 2 on spell damage die, or level 3 slot to give three spell targets Disadv on spell save"',
  'The Eye Opens':
    'Section=ability,magic ' +
    'Note="+1 Wisdom",' +
         '"May cast <i>True Seeing</i> 3/long rest"',
  'The Wild Hunt':
    'Section=magic ' +
    'Note="May summon 1 CR 4, 2 CR 2, or 4 CR 1 to assist for 10 min"',
  'Tough As Iron':
    'Section=combat ' +
    'Note="May reduce damage by %{(level/3+1)<?6} for 10 min; gain 1 level of exhaustion afterward"',
  'Unbroken':
    'Section=combat Note="Trade 1 level of exhaustion to avoid attack damage"',
  'Unseen Lurker':
    'Section=ability,skill ' +
    'Note="Ability Boost (Choose 1 from Dexterity, Wisdom)",' +
         '"Invisible during Lurk; may Lurk during combat"',
  'Vicious Assault':
    'Section=ability,combat ' +
    'Note="+1 Strength",' +
          '"Unarmed strike inflicts 1d6 HP; gain bonus second unarmed strike"',
  'Warding Presence':
    'Section=combat ' +
    'Note="Adjacent foes suffer half speed, Disadv on attacks on others"',
  'Well-Spoken':
    'Section=feature,skill ' +
    'Note="Dbl skill proficiency on %V choices from Deception, Intimidation, Persuasion",' +
         '"Skill Proficiency (Deception/Intimidation/Persuasion)"',
  'Wild Companion':
    'Section=feature ' +
    'Note="CR 1 companion gains +{proficiencyBonus} AC, attack, damage, and proficient skills and saves; HP increases to %{level*4}"',
  'Wild Resilience':
    'Section=ability,save ' +
    'Note="+1 Constitution","May reroll Str, Dex, or Con save 1/long rest"',
  'Wild Sense':
    'Section=feature Note="Have Darkvision; Can sense invisible foes"',

  // Paths
  'Astirax Servant':
    'Section=feature ' +
    'Note="R%{level<10?\\"100\'\\":\\"1 mile\\"} May communicate telepathically w/bound astirax"',
  'Aura Of Darkness':
    'Section=feature ' +
    'Note="Creates 20\' radius of darkness that others cannot see through"',
  'Bestial Astirax Servant':
    'Section=feature ' +
    'Note="R100\' May communicate telepathically w/bound astirax; astirax can possess large creature"',
  'Dark Warrior':
    'Section=feature Note="Extra attack %{wisdomModifier>?1}/long rest"',
  "Dark God's Blessing":
    'Section=combat Note="Self regains %{level<10?2:4}d6 HP from killing"',
  'Dire Bodyguard':
    'Section=feature ' +
    'Note="Foe Disadv on attacks on others w/in 5\'; self can use reaction for melee attack"',
  'Dominate Undead':
    'Section=combat ' +
    'Note="R30\' Use Channel Energy to control undead (Wis neg) for 1 hr"',
  'Dread Avatar':
    'Section=save ' +
    'Note="Resistance to bludgeoning, piercing, and slashing damage and nonmagical weapons; immunity to radiant damage"',
  'Ferocious Blow':
    'Section=feature ' +
    'Note="Use Channel Divinity for +2d6 HP thunder; medium foe pushed 10\' and knocked prone"',
  'Impervious To Magic':
     'Section=magic ' +
     'Note="Use Reaction to cast <i>Counterspell</i> w/out using spell slot"',
  'Improved Astirax Bond':
    'Section=feature ' +
    'Note="Astirax gains +%{proficiencyBonus} AC, attack, and damage; may extend scent magic to 1 mile for 1 min 1/dy"',
  'Mage Hunter':
    'Section=combat ' +
    'Note="R%V\' Use Channel Divinity to inflict Disadv on target caster concentration and Adv on saves vs. target\'s spells for 1 min"',
  'Master Mage Hunter':'Section=combat Note="Extends Mage Hunter effect"',
  'Necromantic Arts':'Section=magic Note="Know <i>Chill Touch</i>"',
  'Potent Spellcasting':
    'Section=magic Note="+%{wisdomModifier} Cleric cantrip damage"',

  // Races
  // SRD5E defines Darkvision, Dwarven Resilience, Dwarven Toughness,
  // Fey Ancestry, Halfling Nimbleness, Lucky Halfling, Slow, and Trance
  'Animal Bond':
    'Section=skill Note="Adv to control, persuade, or communicate w/animals"',
  'Born Of The Sea':
    'Section=ability,skill ' +
    'Note="Use bonus action for 1 hr water breathing",' +
         '"Tool Proficiency (Water Vehicles)"',
  'Caransil Ability Adjustment':
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
MidnightLegacy.PATHS =
  Object.assign({}, SRD5E.PATHS, MidnightLegacy.PATHS_ADDED);
MidnightLegacy.RACES = {
  'Caransil Elf':
    'Features=' +
      '"Skill Proficiency (Perception/Stealth)",' +
      '"Language (High Elven/Erenlander/Choose 1 from Trader\'s Tongue/Old Dwarven/Orcish)",' +
      '"Caransil Ability Adjustment",' +
      '"Caransil Elf Weapon Training",Darkvision,Fast,"Fey Ancestry",' +
      '"Innate Magic User",Trance ' +
    'Languages=Erenlander,"High Elven",any',
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
      '"Languages (Erenlander, Norther, choose 1 from any)",' +
      '"Dorn Ability Adjustment",' +
      '"Human Feat Bonus" ' +
    'Languages=Erenlander,Norther,any',
  'Enslaved Halfling':
    'Features=' +
      '"Language (Erenlander/Halfling/Choose 1 from Orcish, Trader\'s Tongue)",' +
      '"Enslaved Halfling Ability Adjustment",' +
      '"Halfling Magic","Halfling Nimbleness","Lucky Halfling",Slow,' +
      '"Unexpected Blow" ' +
    'Languages=Erenlander,Halfling,any',
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
    'Languages=Erenlander,Halfling,any',
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
    'Description=' +
      '"R200\' Self detect astiraxes, R10\' bind to commands for 1 yr or inflict 4d12 HP radiant (Wis neg)"',
  'Disguise Ally':
    'School=Illusion ' +
    'Level=B2,S2,W2 ' +
    'Description=' +
      '"R100\' Willing target altered in appearance for conc or 1 hr or until out of range"',
  'Greenshield':
    'School=Abjuration ' +
    'Level=D2 ' +
    'Description="Vegetation in 20\' radius allows only allies to pass"',
  'Heed The Whisper':
    'School=Divination ' +
    'Level=D1,R1 ' +
    'Description=' +
      '"While w/in 1 mile of Erethor, self detects hostile creatures for 8 hr"',
  'Lifetrap':
    'School=Transmutation ' +
    'Level=D1,R1 ' +
    'Description=' +
      '"R150\' Target creature restrained (Str neg) for conc or 1 min; undead suffers 1d12/tn at end"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Level=D2,R2 ' +
    'Description=' +
      '"R120\' Plants and animals identify hidden creatures for conc or 1 min"',
  'Silver Blood':
    'School=Abjuration ' +
    'Level=B1,S1,W1 ' +
    'Description=' +
      '"Self suffer 1d4 HP to create silver ammo, warding line, or astirax barrier for 1 hr"',
  'Silver Storm':
    'School=Transmutation ' +
    'Level=S5,W5 ' +
    'Description=' +
      '"70\' cone of silver needles inflicts 10d4 piercing (Dex half)"',
  'Silver Wind':
    'School=Conjuration ' +
    'Level=S4,W4 ' +
    'Description=' +
      '"R200\' 40\' sphere reveals creatures, inflicts stun on vulnerable (Con neg)"',
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
for(var s in MidnightLegacy.SPELLS) {
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
  if(type == 'Path' && attrs.includes('Group=' + name)) {
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
  var classLevel = 'levels.' + name;
  if(name == 'Cleric')
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
};

/*
 * Defines in #rules# the rules associated with heroic path #name# that cannot
 * be derived directly from the abilities passed to heroicPathRules.
 */
MidnightLegacy.pathRulesExtra = function(rules, name) {
  if(name == 'Beastborn') {
    rules.defineRule('features.Darkvision', 'featureNotes.wildSense', '=', '1');
  } else if(name == 'Channeler') {
    rules.defineRule
      ('magicNotes.channeledMagic', 'level', '=', 'source<10 ? 1 : 2');
    ['B', 'C', 'D', 'P', 'R', 'S', 'W'].forEach(spellGroup => {
      [0, 1, 2, 3, 4, 5, 6].forEach(spellLevel => {
        var slot = spellGroup + spellLevel;
        var sorter = spellLevel + spellGroup;
        rules.defineRule
          ('highestSpellSlot', 'spellSlots.' + slot, '^=', '"' + sorter + '"');
        rules.defineRule('magicNotes.channeledMagic.1',
          'highestSpellSlot', '=', 'source.charAt(1) + source.charAt(0)'
        );
        // TODO 2 if level >= 10
        rules.defineRule('spellSlots.' + slot,
          'magicNotes.channeledMagic.1', '+', 'source == "' + slot + '" ? 1 : null'
        );
      });
    });
  } else if(name == 'Dragonblooded') {
    rules.defineRule('casterLevels.Dragonblooded',
      'heroicPath', '?', 'source == "Dragonblooded"',
      'level', '=', null
    );
    rules.defineRule('casterLevel.S', 'casterLevels.Dragonblooded', '^=', null);
    rules.defineRule('magicNotes.pureMagic',
      '', '=', '1',
      'magicNotes.ragingFury', '+', '1'
    );
    rules.defineRule
      ('spellAttackModifier.S', 'magicNotes.pureMagic', '+', null);
    rules.defineRule
      ('spellDifficultyClass.S', 'magicNotes.pureMagic', '+', null);
    rules.defineRule('spellSlots.S0', 'magicNotes.conduit', '+=', '2');
  } else if(name == 'Speaker') {
    rules.defineRule('featureNotes.well-Spoken',
      'level', '=', 'Math.min(Math.floor(source / 5), 3)'
    );
  } else if(name == 'Witch Taker Domain') {
    rules.defineRule
      ('combatNotes.mageHunter', 'levels.Cleric', '=', 'source<8 ? 30 : 60');
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
