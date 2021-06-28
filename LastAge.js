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

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the rules from the Midnight Second Edition core rule book.
 * The LastAge function contains methods that load rules for particular parts
 * of the rule book; raceRules for character races, weaponRules for weapons,
 * etc. These member methods can be called independently in order to use a
 * subset of the LastAge rules. Similarly, the constant fields of LastAge
 * (FEATS_ADDED, RACES, etc.) can be manipulated to modify the choices. If
 * #baseRules# contains "Pathfinder", the Pathfinder plugin is used as the
 * basis for the LastAge rule set; otherwise, the SRD35 plugin is used.
 */
function LastAge(baseRules) {

  if(window.SRD35 == null) {
    alert('The LastAge module requires use of the SRD35 module');
    return;
  }

  LastAge.USE_PATHFINDER =
    window.Pathfinder != null && Pathfinder.SRD35_SKILL_MAP &&
    baseRules != null && baseRules.includes('Pathfinder');
  LastAge.basePlugin = LastAge.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Last Age' + (LastAge.USE_PATHFINDER ? ' - PF' : ''), LastAge.VERSION);
  LastAge.rules = rules;

  LastAge.CHOICES = LastAge.basePlugin.CHOICES.concat(LastAge.CHOICES_ADDED);
  rules.defineChoice('choices', LastAge.CHOICES);
  rules.choiceEditorElements = LastAge.choiceEditorElements;
  rules.choiceRules = LastAge.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = LastAge.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = LastAge.randomizeOneAttribute;
  LastAge.RANDOMIZABLE_ATTRIBUTES =
    LastAge.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (LastAge.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', LastAge.RANDOMIZABLE_ATTRIBUTES);
  delete rules.getChoices('random').deity;
  rules.ruleNotes = LastAge.ruleNotes;

  if(LastAge.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';
  }

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races',
    'heroicPath:Heroic Path,select-one,heroicPaths',
    'levels:Class Levels,bag,levels',
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,npcs');

  LastAge.ALIGNMENTS = Object.assign({}, LastAge.basePlugin.ALIGNMENTS);
  LastAge.ANIMAL_COMPANIONS = Object.assign(
    {}, LastAge.basePlugin.ANIMAL_COMPANIONS, LastAge.ANIMAL_COMPANIONS_ADDED
  );
  LastAge.ARMORS = Object.assign({}, LastAge.basePlugin.ARMORS);
  LastAge.CLASSES['Barbarian'] =
    LastAge.basePlugin.CLASSES['Barbarian'] + ' ' +
    LastAge.CLASS_FEATURES['Barbarian'];
  LastAge.CLASSES['Fighter'] =
    LastAge.basePlugin.CLASSES['Fighter'] + ' ' +
    LastAge.CLASS_FEATURES['Fighter'];
  LastAge.CLASSES['Rogue'] =
    LastAge.basePlugin.CLASSES['Rogue'] + ' ' + LastAge.CLASS_FEATURES['Rogue'];
  LastAge.NPC_CLASSES['Aristocrat'] =
    LastAge.basePlugin.NPC_CLASSES['Aristocrat'];
  LastAge.NPC_CLASSES['Commoner'] = LastAge.basePlugin.NPC_CLASSES['Commoner'];
  LastAge.NPC_CLASSES['Expert'] = LastAge.basePlugin.NPC_CLASSES['Expert'];
  LastAge.NPC_CLASSES['Warrior'] = LastAge.basePlugin.NPC_CLASSES['Warrior'];
  LastAge.FAMILIARS = Object.assign({}, LastAge.basePlugin.FAMILIARS);
  LastAge.FEATS =
    Object.assign({}, LastAge.basePlugin.FEATS, LastAge.FEATS_ADDED);
  LastAge.FEATURES =
    Object.assign({}, LastAge.basePlugin.FEATURES, LastAge.FEATURES_ADDED);
  LastAge.GOODIES = Object.assign({}, LastAge.basePlugin.GOODIES);
  for(var path in LastAge.PATHS) {
    if(LastAge.basePlugin.PATHS[path])
      LastAge.PATHS[path] =
        LastAge.basePlugin.PATHS[path].replaceAll('Cleric', 'Legate');
  }
  LastAge.SHIELDS = Object.assign({}, LastAge.basePlugin.SHIELDS);
  LastAge.SKILLS =
    Object.assign({}, LastAge.basePlugin.SKILLS, LastAge.SKILLS_ADDED);
  for(var skill in LastAge.SKILLS) {
    LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
  }
  delete LastAge.SKILLS['Knowledge (Planes)'];
  delete LastAge.SKILLS['Knowledge (Religion)'];
  LastAge.SPELLS = Object.assign({}, LastAge.SPELLS_ADDED);
  for(var s in LastAge.basePlugin.SPELLS) {
    var m = LastAge.basePlugin.SPELLS[s].match(/\b[BDW][01]|\b(C|Death|Destruction|Evil|Magic|War)[0-9]/g);
    if(m == null && !(s in LastAge.SPELLS_LEVELS))
      continue;
    var spellAttrs = LastAge.basePlugin.SPELLS[s] + ' Level=';
    if(m == null)
      spellAttrs += LastAge.SPELLS_LEVELS[s];
    else if(s in LastAge.SPELLS_LEVELS)
      spellAttrs += LastAge.SPELLS_LEVELS[s] + ',' + m.join(',');
    else
      spellAttrs += m.join(',');
    if(s in LastAge.SPELLS_SCHOOLS)
      spellAttrs += ' School="' + LastAge.SPELLS_SCHOOLS[s] + '"';
    LastAge.SPELLS[s] = spellAttrs;
  }
  LastAge.WEAPONS =
    Object.assign({}, LastAge.basePlugin.WEAPONS, LastAge.WEAPONS_ADDED);

  LastAge.abilityRules(rules);
  LastAge.aideRules(rules, LastAge.ANIMAL_COMPANIONS, LastAge.FAMILIARS);
  LastAge.combatRules(rules, LastAge.ARMORS, LastAge.SHIELDS, LastAge.WEAPONS);
  LastAge.magicRules(rules, LastAge.SCHOOLS, LastAge.SPELLS);
  // Feats must be defined before paths
  LastAge.talentRules
    (rules, LastAge.FEATS, LastAge.FEATURES, LastAge.GOODIES,
     LastAge.LANGUAGES, LastAge.SKILLS);
  LastAge.identityRules(
    rules, LastAge.ALIGNMENTS, LastAge.CLASSES, LastAge.DEITIES, LastAge.PATHS,
    LastAge.RACES, LastAge.PRESTIGE_CLASSES, LastAge.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

LastAge.VERSION = '2.2.3.7';

// LastAge uses SRD35 as its default base ruleset. If USE_PATHFINDER is true,
// the LastAge function will instead use rules taken from the Pathfinder plugin.
LastAge.USE_PATHFINDER = false;

LastAge.CHOICES_ADDED = [];
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
  'Izrador':
    'Alignment=NE ' +
    'Weapon=Longsword ' +
    'Domain=Death,Destruction,Evil,Magic,War'
};
LastAge.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
LastAge.FEATS_ADDED = {

  // MN2E
  'Craft Charm':'Type="Item Creation" Require="Max \'^skills.Craft\' >= 4"',
  'Craft Greater Spell Talisman':
    'Type="Item Creation" ' +
    'Require=' +
      '"sumMagecraft >= 1","level >= 12","sumChannelingFeats >= 3"',
  'Craft Spell Talisman':
    'Type="Item Creation" ' +
    'Require=' +
      '"sumMagecraft >= 1","sumSpellcastingFeats >= 1","level >= 3"',
  'Devastating Mounted Assault':
    'Type=Fighter Require="features.Mounted Combat >= 1","skills.Ride >= 10"',
  'Drive It Deep':'Type=Fighter Require="baseAttack >= 1"',
  'Extra Gift':
    'Type=General ' +
    'Require=' +
      '"levels.Charismatic Channeler >= 4 || levels.Spiritual Channeler >= 4"',
  'Friendly Agent':
    'Type=General ' +
    'Require=' +
      '"alignment =~ \'Good\'",' +
      '"race =~ \'Gnome|Dorn|Erenlander|Sarcosan\'"',
  'Giant-Fighter':
    'Type=Fighter ' +
    'Require="features.Dodge","Sum \'features.Weapon Focus\' >= 1"',
  'Herbalist':
    'Type="Item Creation" Require="skills.Profession (Herbalist) >= 4"',
  'Improvised Weapon':'Type=Fighter',
  'Innate Magic':'Type=General',
  'Inconspicuous':'Type=General',
  'Knife Thrower':'Type=Fighter Require="race =~ \'Jungle Elf|Snow Elf\'"',
  'Lucky':'Type=General',
  'Magecraft (Charismatic)':'Type=Channeling,Magecraft',
  'Magecraft (Hermetic)':'Type=Channeling,Magecraft',
  'Magecraft (Spiritual)':'Type=Channeling,Magecraft',
  'Magic-Hardened':'Type=General Require="race =~ \'Dwarf|Dworg|Orc\'"',
  'Natural Healer':'Type=General',
  'Orc Slayer':'Type=Fighter,General',
  'Quickened Donning':'Type=Fighter',
  'Ritual Magic':
    'Type=Channeling ' +
    'Require=' +
      '"sumMagecraft >= 1","sumSpellcastingFeats >= 1"',
  'Sarcosan Pureblood':'Type=General Require="race =~ \'Sarcosan\'"',
  'Sense Nexus':'Type=General',
  'Spell Focus (%school)':
    'Type=General Require="features.Spellcasting (%school)"',
  'Spellcasting (Abjuration)':'Type=Channeling,Spellcasting',
  'Spellcasting (Conjuration)':'Type=Channeling,Spellcasting',
  'Spellcasting (Divination)':'Type=Channeling,Spellcasting',
  'Spellcasting (Enchantment)':'Type=Channeling,Spellcasting',
  'Spellcasting (Evocation)':'Type=Channeling,Spellcasting',
  'Spellcasting (Illusion)':'Type=Channeling,Spellcasting',
  'Spellcasting (Necromancy)':'Type=Channeling,Spellcasting',
  'Spellcasting (Transmutation)':'Type=Channeling,Spellcasting',
  'Spellcasting (Greater Conjuration)':
    'Type=Channeling,Spellcasting ' +
    'Require="features.Spellcasting (Conjuration)"',
  'Spellcasting (Greater Evocation)':
    'Type=Channeling,Spellcasting Require="features.Spellcasting (Evocation)"',
  'Spell Knowledge':'Type=General Require="sumSpellcastingFeats >= 1"',
  'Thick Skull':'Type=General',
  'Warrior Of Shadow':
    'Type=General Require="charisma >= 12","levels.Legate >= 5"',
  'Whispering Awareness':
    'Type=General Require="wisdom >= 15","race !~ \'Elf\'"',

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
  'Advanced Tempering':'Type=Dwarvencraft Require=features.Dwarvencraft',
  'Clouding':'Type=Dwarvencraft Require=features.Dwarvencraft',
  'Dwarvencraft':
    'Type=General ' +
    'Require=' +
      '"skills.Craft (Armor) >= 4 || ' +
       'skills.Craft (Blacksmith) >= 4 || ' +
       'skills.Craft (Weapons) >= 4"',
  'Greater Masterwork':
    'Type=Dwarvencraft Require="features.Improved Masterwork"',
  'Improved Masterwork':
    'Type=Dwarvencraft ' +
    'Require=' +
      '"features.Dwarvencraft",' +
      '"skills.Craft (Armor) >= 8 || ' +
       'skills.Craft (Blacksmith) >= 8 || ' +
       'skills.Craft (Weapons) >= 8"',
  'Powerful Throw':
    'Type=Fighter ' +
    'Require=' +
      '"strength >= 13",' +
      '"features.Power Attack",' +
      '"features.Weapon Focus (Light Hammer) || ' +
       'features.Weapon Focus (Thowing Axe) || ' +
       'features.Weapon Focus (Urutuk Hatchet)"',
  'Reinforcing':'Type=Dwarvencraft Require=features.Dwarvencraft',
  'Shield Mate':
    'Type=Fighter Require="dexterity >= 13","features.Shield Proficiency"',
  'Tempering (Fireforged)':
    'Type=Dwarvencraft Require="features.Advanced Tempering"',
  'Tempering (Icebound)':
    'Type=Dwarvencraft Require="features.Advanced Tempering"',
  'Tempering (Quick-Cooled)':
    'Type=Dwarvencraft Require="features.Advanced Tempering"',
  'Touched By Magic':'Type=General Require="race =~ \'Dwarf|Orc\'"',
  'Trapsmith':'Type=General',
  'Tunnel Fighting':'Type=Fighter',

  // Honor & Shadow
  'Born Of Duty':
    'Type=General Require="alignment =~ \'Lawful\'","race == \'Dorn\'"',
  'Born Of The Grave':
    'Type=General Require="alignment !~ \'Good\'","race == \'Dorn\'"',

  // Sorcery & Shadow
  'Blood-Channeler':
    'Type=General ' +
    'Require="constitution >= 15","sumMagecraft >= 1"',
  'Craft Rune Of Power':
    'Type="Item Creation" ' +
    'Require=' +
      '"sumMagecraft >= 1","sumSpellcastingFeats >= 1","level >= 3"',
  'Flexible Recovery':
    'Type=General ' +
    'Require="constitution >= 13","sumMagecraft >= 1"',
  'Improved Flexible Recovery':
    'Type=General ' +
    'Require=' +
      '"constitution >= 15","features.Flexible Recovery","sumMagecraft >= 1"',
  'Knack For Charms':
    'Type="Item Creation" ' +
    'Require=' +
      '"skills.Knowledge (Arcana) >= 4",' +
      '"skills.Knowledge (Nature) >= 4"',
  'Living Talisman':
    'Type=General ' +
    'Require=' +
      '"sumMagecraft >= 1","sumSpellcastingFeats >= 1","level >= 5",' +
      '"skills.Knowledge (Arcana) >= 6"',
  'Power Reservoir':'Type=General Require="sumMagecraft >= 1"',
  'Sense Power':'Type=General Require="wisdom >= 15"',
  'Subtle Caster':'Type=General Require="sumMagecraft >= 1"',

  // Star & Shadow
  'Canny Strike':
    'Type=Fighter ' +
    'Require=' +
      '"intelligence >= 13",' +
      '"baseAttack >= 6",' +
      '"features.Clever Fighting",' +
      '"features.Weapon Finesse"',
  'Caste Status':'Type=General',
  'Clever Fighting':
    'Type=Fighter ' +
    'Require="dexterity >= 13","baseAttack >= 2","features.Weapon Finesse"',
  'Plains Warfare':'Type=Fighter Require="features.Mounted Combat"',
  'Urban Intrigue':
    'Type=General ' +
    'Imply="skills.Gather Information >= 1" ' +
    'Require="race == \'Urban Sarcosan\'","skills.Bluff >= 1"',
  'Well-Aimed Strike':
    'Type=Fighter ' +
    'Require=' +
      '"baseAttack >= 9",' +
      '"features.Canny Strike",' +
      '"features.Clever Fighting",' +
      '"features.Weapon Finesse"',

  // Steel & Shadow
  'Resigned To Death':'Type=General Require="wisdom >= 13"',
  'Whirlwind Charge':
    'Type=General ' +
    'Require=' +
      '"strength >= 15",' +
      '"baseAttack >= 6",' +
      '"features.Cleave",' +
      '"features.Power Attack"'

};
LastAge.FEATS = Object.assign({}, SRD35.FEATS, LastAge.FEATS_ADDED);
LastAge.FEATURES_ADDED = {

  // Override of 3.5 Magic Domain feature
  'Arcane Adept':
    'Section=magic Note="Use magic device as W%{levels.Legate//2>?1}"',

  // Heroic Path
  'Ability Boost':'Section=ability Note="%V to distribute"',
  'Aid Another (Move)':'Section=combat Note="Aid another as a move action"',
  'Aid Another (Combat Bonus)':
    'Section=combat Note="Aided ally +%V attack or AC"',
  'Ambush':'Section=skill Note="Allies use self Hide for ambush"',
  'Ambush (Extra Damage)':
    'Section=combat ' +
    'Note="Allies +2 damage vs. flat-footed foes on surprise and 1st melee rd"',
  'Ambush (Quick)':'Section=skill Note="Hide allies for ambush in half time"',
  'Ambush (Sniping)':
    'Section=combat Note="Reduced Hide penalty for using ranged weapons"',
  'Animal Companion':
    'Section=feature Note="Special bond and abilities w/up to %V animals"',
  'Animal Friend':
    'Section=combat,skill ' +
    'Note="Animals DC %V Will save to attack",' +
         '"+4 Handle Animal"',
  'Ancestral Bladebearer Bonus Feats':'Section=feature Note="+%V Fighter Feat"',
  'Aquatic Adaptation':
    'Section=skill Note="Breathe through gills, no underwater pressure damage"',
  'Aquatic Ally':
    'Section=magic Note="Aquatic <i>Summon Nature\'s Ally %1</i> %V/dy"',
  'Aquatic Blindsight':
    'Section=skill Note="R%V\' Detect creatures in opaque water"',
  'Aquatic Emissary':'Section=skill Note="Speak to all aquatic animals"',
  'Assist Allies':
    'Section=skill Note="Allies move in water at full speed, share oxygen"',
  'Aura Of Courage':'Section=save Note="Immune fear, +4 to allies w/in %V\'"',
  'Aura Of Warmth':'Section=magic Note="R10\' Allies +4 Fortitude vs cold"',
  'Battle Cry':'Section=combat Note="+%V hit points until end of battle %1/dy"',
  'Bestial Aura':
    'Section=combat,skill ' +
    'Note="Turn 2d6+%1 HD of animals of up to (d20+%2)/3 HD %3/dy",' +
         '"-10 Handle Animal, no Wild Empathy"',
  'Blindsense':
     'Section=feature Note="R30\' Other senses detect unseen objects"',
  'Blindsight':
    'Section=feature Note="R30\' Other senses compensate for loss of vision"',
  'Blood Of Kings':
    'Section=skill ' +
    'Note="Daily +%V Cha skills in Shadow or resistance interactions"',
  'Blood Of The Planes':'Section=skill Note="+%V Cha skills with outsiders"',
  'Bolster Spell':'Section=magic Note="Add 1 to DC of %V chosen spells"',
  'Bonus Raw Energy':'Section=magic Note="+%V"',
  'Bonus Spell Energy':'Section=magic Note="+%V Spell Energy"',
  'Bonus Spells':'Section=magic Note="+%V Channeler Spells"',
  'Burst Of Speed':
    'Section=combat ' +
    'Note="Extra attack or move action for %V rd %1/dy; fatigued afterward"',
  'Chanceborn Survivor':
    'Section=feature ' +
    'Note="Defensive Roll, Evasion, Slippery Mind, or Uncanny Dodge %V/dy"',
  'Charisma Bonus':'Section=ability Note="+%V Charisma"',
  'Cold Immunity':
    'Section=save Note="No damage from cold, x1.5 damage from fire"',
  'Cold Resistance':'Section=save Note="Ignore first %V points cold damage"',
  'Combat Overview':
    'Section=combat Note="R60\' Ally avoid AOO or foe flat-footed %V/dy"',
  'Constitution Bonus':'Section=ability Note="+%V Constitution"',
  'Coordinated Attack':
    'Section=combat ' +
    'Note="R30\' Allies attack same foe at +1/participant (max +5) %V/dy"',
  'Coordinated Initiative':
    'Section=combat Note="R30\' Allies use self initiative %V/dy"',
  'Damage Reduction':'Section=combat Note="Subtract %V from damage taken"',
  'Death Ward':'Section=save Note="Self immune death spells, death effects, energy drain, and negative energy effects"',
  'Deep Lungs':'Section=skill Note="Hold breath for %V rd"',
  'Detect Evil':'Section=magic Note="<i>Detect Evil</i> at will"',
  'Detect Outsider':'Section=magic Note="<i>Detect Outsider</i> at will"',
  'Dexterity Bonus':'Section=ability Note="+%V Dexterity"',
  'Directed Attack':
    'Section=combat Note="R30\' Ally add half self base attack 1/dy"',
  'Disrupting Attack':
    'Section=combat Note="Undead %V Will save or destroyed %1/dy"',
  "Dolphin's Grace":
    'Section=ability,skill Note="+%V\' Swim","+8 Swim (hazards)"',
  'Dragonblooded Improved Spellcasting':
    'Section=magic ' +
    'Note="Reduce energy cost of spells from %V chosen schools by 1"',
  'Elemental Friend':
    'Section=combat,skill ' +
    'Note="Elementals DC %V Will save to attack",' +
         '"+4 Diplomacy (elementals)"',
  'Elemental Resistance':'Section=save Note="%V vs. %1"',
  'Enhanced Bestial Aura':
    'Section=feature Note="R15\' Animals act negatively, cannot ride"',
  'Extended Darkvision':'Section=feature Note="+30\' b/w vision in darkness"',
  'Fast Movement':'Section=ability Note="+%V Speed"',
  'Fearsome Charge':
    'Section=combat Note="+%V damage, -1 AC for every 10\' in charge"',
  'Ferocity':'Section=combat Note="Continue fighting below 0 HP"',
  'Fey Vision':'Section=magic Note="Detect %V auras at will"',
  'Fortitude Bonus':'Section=save Note="+%V Fortitude"',
  'Frightful Presence':
    'Section=magic ' +
    'Note="R10\' Casting panics or shakes foes of lesser level 4d6 rd (DC %V Will neg)"',
  'Frost Weapon':
    'Section=combat Note="+d6 cold damage on hit for %V rd %1/dy"',
  'Greater Frost Weapon':
    'Section=combat Note="+d10 cold damage, extra hit die on critical hit"',
  'Hide In Plain Sight':'Section=skill Note="Hide even when observed"',
  'Howling Winds':
    'Section=feature Note="Answer 1 question about surrounding %1 mi %V/dy"',
  'Improved Battle Cry':'Section=combat Note="+1 attack and damage after cry"',
  'Improved Healing':'Section=combat Note="Regain %V HP/hr"',
  'Improved Healing (Ability Recovery)':
    'Section=combat Note="Regain 1 point ability damage/hr"',
  'Improved Spell Penetration':
    'Section=magic Note="+%V checks to overcome spell resistance"',
  'Improved Stonecunning':
    'Section=skill Note="R5\' Automatic Search for concealed stone door"',
  'Increased Damage Threshold':
    'Section=combat Note="Continue fighting until -%V HP"',
  'Indefatigable':'Section=save Note="Immune %V effects"',
  'Insight':'Section=skill Note="+%V skill check 1/dy"',
  'Inspire Valor':
    'Section=feature ' +
    'Note="R30\' Allies +%V attack and fear saves for %1 rd %2/dy"',
  'Inspiring Oration':
    'Section=magic ' +
    'Note="R60\' Speech applies spell-like ability to allies %V/dy"',
  'Intelligence Bonus':'Section=ability Note="+%V Intelligence"',
  'Intimidating Size':'Section=skill Note="+%V Intimidate"',
  'Ironborn Resilience':'Section=combat Note="Improved hit die"',
  'Jack-Of-All-Trades Bonus Feats':'Section=feature Note="+%V General Feat"',
  'Language Savant':
    'Section=skill ' +
    'Note="Fluent in any language after listening for 10 minutes"',
  'Last Stand':
    'Section=combat ' +
    'Note="At half HP, 1 minute of %V spell resistance, 15 damage reduction, 30 energy resistance; near death afterward %1/dy"',
  'Lay On Hands':'Section=magic Note="Harm undead or heal %V HP/dy"',
  'Leadership':'Section=feature Note="Attract followers"',
  'Luck Of Heroes':'Section=feature Note="Add %V to any d20 roll 1/dy"',
  'Master Adventurer':'Section=skill Note="+%V on three chosen non-Cha skills"',
  'Metamagic Aura':
    'Section=magic Note="R30\' %V others\' spells of up to level %1 %2/dy"',
  'Miss Chance':'Section=combat Note="%V% chance of foe miss"',
  'Mountaineer':
    'Section=skill ' +
    'Note="+%V Balance/+%V Climb/+%V Jump/+%V Survival (mountains)"',
  'Natural Armor':'Section=combat Note="+%V AC"',
  'Natural Bond':
    'Section=skill ' +
    'Note="Knowledge (Nature) is a class skill/Survival is a class skill/+2 Knowledge (Nature)/+2 Survival"',
  'Natural Leader':'Section=feature Note=" +%V Leadership score"',
  'Nonlethal Damage Reduction':
    'Section=combat Note="Ignore first %V points of non-lethal damage"',
  'Northborn':
    'Section=save,skill ' +
    'Note="Immune to non-lethal cold/exposure",' +
         '"+2 Survival (cold)/+2 Wild Empathy (cold natives)"',
  'Offensive Tactics':
    'Section=combat ' +
    'Note="+%V to first attack or all damage when using full attack action"',
  'One With Nature':'Section=magic Note="<i>Commune With Nature</i> at will"',
  'Painless':
    'Section=combat,save Note="+%V HP","+%V vs. pain effects"',
  'Planar Fury':
    'Section=combat Note="+2 Str and Con, +1 Will, -1 AC for %V rd %1/dy"',
  'Perfect Assault':
    'Section=combat Note="R30\' Allies threaten critical on any hit 1/dy"',
  'Persuasive Speaker':'Section=skill Note="+%V verbal Cha skills"',
  'Plant Friend':
    'Section=combat,skill ' +
    'Note="Plants DC %V Will save to attack",' +
         '"+4 Diplomacy (plants)"',
  'Power Words':
    'Section=magic Note="R60\' DC %2+spell level <i>Word of %V</i> %1/dy"',
  'Pureblood Bonus Feats':'Section=feature Note="+%V General Feat"',
  'Quickened Counterspelling':
    'Section=magic Note="Counterspell as move action 1/rd"',
  'Rage':
    'Section=combat Note="+4 Str, +4 Con, +2 Will, -2 AC for %V rd %1/dy"',
  'Rallying Cry':
    'Section=combat Note="Allies not flat-footed, +4 vs. surprise %V/dy"',
  'Retributive Rage':
    'Section=combat ' +
    'Note="+%V attack%1 1 rd after foe attack does %{level*2} HP damage to self"',
  'Righteous Fury':
    'Section=combat ' +
    'Note="Overcome %V points of evil foe melee damage reduction"',
  'Rock Throwing':'Section=combat Note="Use debris as R%V\' ranged weapon"',
  'Save Boost':'Section=save Note="%V to distribute"',
  'Scent':
    'Section=feature Note="R30\' Detect creatures\' presence, track by smell"',
  'Seer Sight':
    'Section=magic Note="Discern %{level}-%1 history of touched object %V/dy"',
  'Sense The Dead':
    'Section=magic Note="R%V\' +%1 <i>Detect Undead</i> check at will"',
  'Shadow Jump':'Section=feature Note="R%V\' Move between shadows"',
  'Shadow Veil':'Section=skill Note="+%V Hide"',
  'Shadowed Frightful Presence':
    'Section=feature Note="Viewers become frightened (DC %V Will neg)"',
  'Size Features (Big)':
    'Section=combat,skill Note="Use Large weapons","-4 Hide"',
  'Size Features (Extra Reach)':'Section=combat Note="15\' reach"',
  'Skill Boost':'Section=skill Note="+4 to %V chosen skills"',
  'Skill Mastery':
    'Section=skill Note="Take 10 despite distraction on %V chosen skills"',
  'Skilled Warrior':
    'Section=combat ' +
    'Note="Half penalty from %V choices of Fighting Defensively, Grapple Attack, Non-proficient Weapon, Two-Weapon Fighting"',
  'Smite Evil':
    'Section=combat Note="+%1 attack, +%2 damage vs. evil foe %V/dy"',
  'Spell Choice':
    'Section=magic Note="Use chosen %V spell as spell-like ability 1/dy"',
  'Spellsoul Resistance':'Section=save Note="+%V vs. spells"',
  'Spirit Sight (Darkness)':
    'Section=feature Note="+60\' b/w vision in darkness"',
  'Spirit Sight (Invisible)':'Section=feature Note="See invisible creatures"',
  'Spirit Sight (Magical Darkness)':
    'Section=feature Note="See perfectly through any darkness"',
  'Spontaneous Spell':
    'Section=magic Note="Use any %V spell as spell-like ability 1/dy"',
  'Stonecunning':
    'Section=skill ' +
    'Note="+%V Search involving stone or metal, automatic check w/in 10\'"',
  'Strategic Blow':
    'Section=combat Note="Overcome %V points of foe damage reduction"',
  'Strength Bonus':'Section=ability Note="+%V Strength"',
  'Take Ten':'Section=feature Note="Take 10 on any d20 roll 1/dy"',
  'Take Twenty':'Section=feature Note="Take 20 on any d20 roll 1/dy"',
  'Telling Blow':'Section=combat Note="R30\' Allies re-roll damage 1/dy"',
  'Touch Of The Living':'Section=combat Note="+%V damage vs. undead"',
  'Tremorsense':
    'Section=feature Note="R30\' Detect creatures in contact w/ground"',
  'Turn Undead':
    'Section=combat ' +
    'Note="Turn (good) or rebuke (evil) 2d6+%1 HD of undead creatures of up to (d20+%2)/3 HD %3/dy"',
  'Uncaring Mind':'Section=save Note="+%V vs. enchantment"',
  'Unearthly Grace (AC)':'Section=combat Note="+%V AC"',
  'Unearthly Grace (Dexterity)':'Section=ability Note="+%V Dexterity checks"',
  'Unearthly Grace (Fortitude)':'Section=save Note="+%V Fortitude"',
  'Unearthly Grace (Reflex)':'Section=save Note="+%V Reflex"',
  'Unearthly Grace (Will)':'Section=save Note="+%V Will"',
  'Unfettered':'Section=feature Note="Unimpeded movement %V rd/dy"',
  'Untapped Potential':
    'Section=magic Note="R30\' Contribute %V spell energy to ally spells"',
  'Untouchable':'Section=combat Note="No foe AOO from %V"',
  'Vicious Assault':'Section=combat Note="Two claw attacks at %V each"',
  'Ward Of Life':'Section=save Note="Immune to undead %V"',
  'Wild Empathy':'Section=skill Note="+%V Diplomacy (animals)"',
  'Wild Shape':'Section=magic Note="Change into creature of size %V %1/dy"',
  'Wisdom Bonus':'Section=ability Note="+%V Wisdom"',
  'Wiser Bonus Feats':'Section=feature Note="+%V General Feat (Skill Focus)"',
  'Wiser Skill Bonus':'Section=skill Note="+%V Skill Points"',

  // Feats
  'Advanced Tempering':'Section=skill Note="Increase item hardness 20%"',
  'Blood-Channeler':
    'Section=magic Note="Dbl spell energy for first two Con points lost"',
  'Born Of Duty':
    'Section=magic ' +
    'Note="R100\' Cry leaves undead shaken (DC %V Will neg), Dorn +2 vs fear and enchantment 1/dy"',
  'Born Of The Grave':'Section=magic Note="R15\' <i>Deathwatch</i> at will"',
  'Canny Strike':'Section=combat Note="+%Vd4 finesse weapon damage"',
  'Caste Status':'Section=feature Note="Benefits of caste level"',
  'Clear-Eyed':
    'Section=feature,skill ' +
    'Note="Half distance penalty for approaching creatures, x2 normal vision in dim light on plains",' +
         '"Spot is a class skill"',
  'Clever Fighting':'Section=combat Note="+%V finesse weapon damage"',
  'Clouding':'Section=skill Note="Item half weight, thrown +10\' range"',
  'Craft Charm':
    'Section=magic Note="Use Craft to create single-use magic item"',
  'Craft Greater Spell Talisman':
    'Section=magic ' +
    'Note="Talisman reduces spell energy cost of chosen school spells by 1"',
  'Craft Rune Of Power':'Section=magic Note="Imbue rune w/any known spell"',
  'Craft Spell Talisman':
    'Section=magic Note="Reduces spell energy cost of chosen spell by 1"',
  'Defiant':
    'Section=save ' +
    'Note="Trade delay effect of failed Fort or Will save 1 rd for dbl effect"',
  'Devastating Mounted Assault':
    'Section=combat Note="Full attack after mount moves"',
  'Drive It Deep':
    'Section=combat ' +
    'Note="Trade up to -%V attack for equal damage bonus w/light or one-handed weapon"',
  'Dwarvencraft':'Section=feature Note="Know %V Dwarvencraft techniques"',
  'Extra Gift':
    'Section=feature Note="Use Mastery or Force Of Personality +4 times/dy"',
  'Fanatic':
    'Section=combat ' +
    'Note="+1 attack, divine spell benefit when within 60\' of Izrador holy servant"',
  'Flexible Recovery':
    'Section=magic Note="Recover 1 spell energy per hr rest, full after 6 hr"',
  'Friendly Agent':
    'Section=skill ' +
    'Note="+4 Diplomacy (convince allegiance)/+4 Sense Motive (determine allegiance)"',
  'Giant-Fighter':
    'Section=combat Note="+4 AC, dbl critical range w/in 30\' vs. giants"',
  'Greater Masterwork':
    'Section=skill ' +
    'Note="Weapon +2 attack and +1 damage; armor or shield -1 skill penalty, +1 max dex, -5% arcane spell failure, don or remove in half time, light shield use with ranged weapon; other items +4 DC"',
  'Hardy':
    'Section=feature,magic ' +
    'Note=' +
      '"Functional on half food, sleep",' +
      '"Regain half energy after 4 hrs rest"',
  'Herbalist':'Section=magic Note="Create herbal concoctions"',
  'Huntsman':
    'Section=combat ' +
    'Note="+1 attack and damage for ea 5 above track DC vs. prey tracked for 5 mi"',
  'Improved Flexible Recovery':
    'Section=magic ' +
    'Note="DC 30 Concentration to recover %V spell energy per hr meditating"',
  'Improved Masterwork':
    'Section=skill ' +
    'Note="Weapon +1 attack and damage; armor or shield -1 skill penalty and +1 max dex; other +2 DC"',
  'Improvised Weapon':
    'Section=combat ' +
    'Note="No penalty for improvised weapon, -2 for non-proficient weapon"',
  'Inconspicuous':
    'Section=skill ' +
    'Note="+2 Bluff (shadow)/+2 Diplomacy (shadow)/+2 Hide (shadow)/+2 Sense Motive (shadow)"',
  'Innate Magic':'Section=magic Note="%V %1 spells as at-will innate ability"',
  'Knack For Charms':'Section=skill Note="+4 Craft for charm-making"',
  'Knife Thrower':
    'Section=combat ' +
    'Note="R20\' +1 attack w/racial knife, draw as free action (move action if hidden)"',
  'Living Talisman':
    'Section=magic Note="Chosen spell costs 1 fewer spell energy to cast"',
  'Lucky':'Section=save Note="+1 from luck charms and spells"',
  'Magic-Hardened':'Section=save Note="+2 vs. spells"',
  'Natural Healer':
    'Section=skill ' +
    'Note="Heal raises patient to 1 HP, triple normal healing rate"',
  'Orc Slayer':
    'Section=combat,skill ' +
    'Note="+1 AC and melee damage vs. orcs and dworgs",' +
         '"-4 Cha skills (orcs)"',
  'Pikeman':'Section=combat Note="Receive charge as move action"',
  'Plains Warfare':
    'Section=combat,save,skill ' +
    'Note="+1 AC when mounted on plains",' +
         '"+1 Reflex when mounted on plains",' +
         '"+2 Listen and Spot vs. surprise when mounted on plains"',
  'Power Reservoir':
    'Section=magic Note="Store +%V syphoned spell energy points"',
  'Powerful Throw':
    'Section=combat ' +
    'Note="Attacks w/focused weapon +10 range and use Str instead of Dex"',
  'Quickened Donning':'Section=feature Note="No penalty for hastened donning"',
  'Reinforcing':'Section=skill Note="Item +5 HP; weapon -1 attack and range"',
  'Resigned To Death':
     'Section=save Note="+4 vs. fear, 1 step less intense on failure"',
  'Ritual Magic':'Section=magic Note="Learn and lead magic rituals"',
  'Sarcosan Pureblood':
    'Section=combat,skill ' +
    'Note="+2 AC (horseback)",' +
         '"+%{level+charismaModifier} Diplomacy (horses), +2 Cha skills (horses and Sarcosans)"',
  'Sense Nexus':'Section=magic Note="DC 15 Wis to sense nexus w/in 5 miles"',
  'Sense Power':
    'Section=magic Note="<i>Detect Magic</i> %V/dy, DC 13 Wis check w/in 20\'"',
  'Shield Mate':
    'Section=combat ' +
    'Note="Adjacent allies +2 AC when self fighting defensively or using -2 Combat Expertise"',
  'Slow Learner':'Section=feature Note="Replace later with another feat"',
  'Spell Knowledge':'Section=magic Note="+2 Channeler Spells"',
  'Spellcasting (%school)':
    'Section=magic Note="Learn 1 Channeler %school spell; may learn more"',
  'Stalwart':
    'Section=save Note="Delay negative HP for 1 rd, dbl heal required"',
  'Stealthy Rider':
    'Section=companion Note="Mount use rider Hide and Move Silently ranks"',
  'Subtle Caster':
    'Section=skill ' +
    'Note="+2 Bluff (disguise casting)/+2 Sleight Of Hand (disguise casting)"',
  'Tempering (Fireforged)':
    'Section=skill ' +
    'Note="No item damage from fire, light/medium/heavy armor gives fire resistance 2/3/4"',
  'Tempering (Icebound)':
    'Section=skill ' +
    'Note="No item damage from cold, light/medium/heavy armor gives cold resistance 2/3/4"',
  'Tempering (Quick-Cooled)':
    'Section=skill Note="Increase item hardness 40%, decrease item HP 2x"',
  'Thick Skull':
    'Section=save ' +
    'Note="DC 10 + damage save to retain 1 HP after hit would result in 0 or negative"',
  'Touched By Magic':
    'Section=magic,save Note="+2 Spell Energy","-2 vs. spells"',
  'Trapsmith':
    'Section=skill ' +
    'Note="+2 Craft (Traps)/+2 Disable Device/+2 Search (find traps)"',
  'Tunnel Fighting':
    'Section=combat Note="No AC or attack penalty when squeezing"',
  'Urban Intrigue':
    'Section=skill ' +
    'Note="Use Gather Information to counter investigation of self, allies"',
  'Warrior Of Shadow':
    'Section=combat Note="Trade Turn Undead use for %V rd of +%1 damage"',
  'Well-Aimed Strike':
    'Section=combat Note="Canny Strike and Clever Fighting apply to all foes"',
  'Whirlwind Charge':
    'Section=combat Note="Attack all adjacent foes after charge"',
  'Whispering Awareness':
    'Section=feature Note="DC 12 Wis to hear Whispering Wood"',

  // Class
  'Adapter':
    'Section=skill Note="+%V skill points or %1 additional class skills"',
  'Armor Class Bonus':'Section=combat Note="+%V AC"',
  'Art Of Magic':'Section=magic Note="+1 character level for max spell level"',
  'Astirax Companion':'Section=feature Note="Special bond/abilities"',
  'Channeler Bonus Feats':'Section=feature Note="%V Channeler feats"',
  'Channeler Spellcasting':'Section=feature Note="%V Spellcasting feats"',
  'Confident Effect':'Section=combat Note="+4 Mastery checks"',
  'Counterattack':'Section=combat Note="AOO on foe miss 1/rd"',
  'Cover Ally':'Section=combat Note="Take hit for ally w/in 5\' 1/rd"',
  'Danger Sense':
    'Section=combat,skill Note="+%V Initiative","+%V Listen/+%V Spot"',
  'Defender Abilities':
    'Section=combat ' +
    'Note="Counterattack, Cover Ally, Defender Stunning Fist, Devastating Strike, Rapid Strike, Retaliatory Strike, Strike And Hold, or Weapon Trap %V/dy"',
  'Defender Stunning Fist':
    'Section=combat Note="Stun struck foe (DC %V Fort neg)"',
  'Defensive Mastery':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Devastating Strike':
    'Section=combat ' +
    'Note="Bull Rush stunned opponent as free action w/out foe AOO"',
  'Dodge Training':'Section=combat Note="+%V AC"',
  'Flurry Attack':
    'Section=combat Note="Two-weapon off hand penalty reduced by %V"',
  'Foe Specialty':
    'Section=skill ' +
    'Note="Take 10 on Knowledge checks about creature type chosen each day"',
  'Furious Grapple':
    'Section=combat Note="Extra grapple attack at highest attack bonus 1/rd"',
  'Grappling Training':
    'Section=combat Note="Disarm, sunder, and trip attacks use grapple check"',
  'Greater Confidence':
    'Section=magic ' +
    'Note="<i>Break Enchantment</i> 1/5 rd during Inspire Confidence"',
  'Greater Fury':
    'Section=magic Note="R30\' Ally gains 2d10 HP, +2 Attack, +1 Fortitude"',
  'Hated Foe':
    'Section=combat ' +
    'Note="Additional Hunter\'s Strike vs. Master Hunter creature"',
  'Heightened Effect':
    'Section=combat Note="+2 level for Mastery checks"',
  'Hunted By The Shadow':
    'Section=combat Note="No surprise by servant of shadow"',
  "Hunter's Strike":'Section=combat Note="x2 damage %V/dy"',
  'Improved Confidence':
    'Section=magic Note="Allies enchanted for half duration, fear reduced"',
  'Improved Spellcasting':
    'Section=magic Note="+%V Spell Energy/+%1 Channeler Spells"',
  'Improved Fury':
    'Section=magic ' +
    'Note="+1 Initiative, Attack, and Damage during Inspire Fury"',
  'Improved Woodland Stride':
    'Section=feature Note="Normal movement through enchanted terrain"',
  'Incredible Resilience':'Section=combat Note="+%V HP"',
  'Incredible Speed':'Section=ability Note="+%V Speed"',
  'Incredible Speed Or Resilience':'Section=feature Note="%V selections"',
  'Initiative Bonus':'Section=combat Note="+%V Initiative"',
  'Inspire Confidence':
    'Section=magic ' +
    'Note="R60\' Allies +4 save vs. enchantment and fear for %V rd"',
  'Inspire Fascination':
    'Section=magic ' +
    'Note="R120\' %V creatures enthralled %2 rd (DC %1 Will neg)"',
  'Inspire Fury':
    'Section=magic Note="R60\' Allies +1 Initiative, Attack, and Damage %V rd"',
  'Instinctive Response':'Section=combat Note="Re-roll Initiative"',
  'Knowledge Specialty':
    'Section=skill Note="+3 checks for Knowledge skill chosen each day"',
  'Literate':'Section=skill Note="+%V Language Count"',
  'Magecraft (Charismatic)':
    'Section=magic Note="Learn 3 B0 and 1 B1 spells, %V Spell Energy"',
  'Magecraft (Hermetic)':
    'Section=magic Note="Learn 3 W0 and 1 W1 spells, %V Spell Energy"',
  'Magecraft (Spiritual)':
    'Section=magic Note="Learn 3 D0 and 1 D1 spells, %V Spell Energy"',
  'Mass Suggestion':
    'Section=magic Note="<i>Suggestion</i> to %V fascinated creatures"',
  'Master Hunter':
    'Section=combat,skill ' +
    'Note="+2 or more damage vs. selected creature type(s)",' +
         '"+2 or more Bluff, Listen, Sense Motive, Spot, Survival vs. chosen creature type(s)"',
  'Masterful Strike':'Section=combat Note="%V Unarmed damage"',
  'Mastery Of Nature':
    'Section=combat ' +
    'Note="Turn or rebuke %4d6+%1 HD of plants or animals of up to (d20+%2)/3 HD %3/dy"',
  'Mastery Of Spirits':
    'Section=combat ' +
    'Note="Exorcise %4d6+%1 HD of spirits of up to (d20+%2)/3 HD %3/dy"',
  'Mastery Of The Unnatural':
    'Section=combat ' +
    'Note="Turn or rebuke %4d6+%1 HD of constructs or outsiders of up to (d20+%2)/3 HD %3/dy"',
  'Offensive Training':
    'Section=combat Note="Stunned foe blind or deaf (DC %V Fort neg)"',
  'One With The Weapon':
    'Section=combat ' +
    'Note="Masterful Strike, Precise Strike, or Stunning Fist w/chosen weapon"',
  'Overland Stride':
    'Section=feature Note="Normal movement while using Survival"',
  'Powerful Effect':'Section=combat Note="+1d6 mastery damage"',
  'Precise Effect':'Section=combat Note="Choose type of creature to affect"',
  'Precise Strike':
    'Section=combat Note="Overcome %V points of foe damage reduction"',
  'Quick Reference':'Section=skill Note="Reduce Lorebook scan penalty by %V"',
  'Quick Stride':'Section=ability Note="+%V Speed"',
  'Rapid Strike':
    'Section=combat Note="Extra attack at highest attack bonus 1/rd"',
  'Retaliatory Strike':
    'Section=combat Note="AOO vs. foe that strikes ally 1/rd"',
  'Sense Dark Magic':
    'Section=feature,magic ' +
    'Note="Scent vs. legate/outsider",' +
         '"<i>Detect Magic</i> vs. legate/outsider at will"',
  'Specific Effect':'Section=combat Note="Choose individuals to affect"',
  'Speed Training':'Section=combat Note="Extra move action each rd"',
  'Spell Specialty':'Section=skill Note="Each day choose a spell for +1 DC"',
  'Spontaneous Legate Spell':
    'Section=magic Note="Cast <i>Inflict</i> in place of known spell"',
  'Strike And Hold':'Section=combat Note="Extra Unarmed attack to grab foe"',
  'Suggestion':
    'Section=magic Note="<i>Suggestion</i> to 1 fascinated creature"',
  'Temple Dependency':
    'Section=magic Note="Must participate at temple to receive spells"',
  'Tradition Gift (Force Of Personality)':
    'Section=magic ' +
    'Note="Inspire Confidence, Fascination, Fury, or Suggestion %V/dy"',
  'Tradition Gift (Lorebook)':
    'Section=skill ' +
    'Note="+%V check for sought info after 1 min study; scan at -10"',
  'Tradition Gift (Master Of Two Worlds)':
    'Section=magic ' +
    'Note="Ability to control animals, plants, constructs and/or spirits"',
  'True Aim':'Section=combat Note="x3 damage on Hunter\'s Strike"',
  // Turn Undead as heroic path
  'Universal Effect':
    'Section=combat Note="Use multiple mastery powers simultaneously"',
  'Weapon Trap':
    'Section=combat ' +
    'Note="Attack to catch foe weapon for disarm, damage, AOO 1/rd"',
  'Wildlander Skill Mastery':
    'Section=feature,skill ' +
    'Note="+%V General Feat (Skill Focus)","Skill Mastery (%V skills)"',
  'Wildlander Traits':'Section=feature Note="%V selections"',
  'Wilderness Trapfinding':
    'Section=skill Note="Search to find and Survival to remove DC 20+ traps"',
  'Woodslore':
    'Section=skill Note="Automatic Search vs. trap or concealed door w/in 5\'"',

  // Race
  'Alert Senses':'Section=skill Note="+2 Listen/+2 Spot"',
  'Bonus Innate Spell':'Section=magic Note="+1 Innate Magic spell"',
  'Bound To The Beast':'Section=feature Note="Mounted Combat"',
  'Bound To The Spirits':'Section=feature Note="Magecraft (Spiritual)"',
  'Brotherhood':
    'Section=combat Note="+1 attack when fighting among 5+ Dorns"',
  'Cold Fortitude':'Section=save Note="+5 cold, half nonlethal damage"',
  // Deep Lungs as heroic path
  'Dexterous Hands':'Section=skill Note="+2 Craft (non-metal or wood)"',
  'Dorn Ability Adjustment':
    'Section=ability Note="+2 Strength/-2 Intelligence"',
  'Dorn Extra Feat':'Section=feature Note="+1 Fighter Feat"',
  'Dorn Skill Bonus':'Section=skill Note="+%V Skill Points"',
  'Double Knife Training':
    'Section=combat Note="Half penalty fighting w/2 fighting knives"',
  'Double Urutuk Training':
    'Section=combat Note="Half penalty fighting w/2 Urutuk hatchets"',
  'Double Sepi Training':'Section=combat Note="Half penalty fighting w/2 sepi"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Dwarf Enmity':'Section=combat Note="+%V attack vs. orcs"',
  'Dwarrow Ability Adjustment':'Section=ability Note="+2 Charisma"',
  'Dworg Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Constitution/-2 Intelligence/-2 Charisma"',
  'Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Constitution"',
  'Elfling Ability Adjustment':
    'Section=ability Note="+4 Dexterity/-2 Strength/-2 Constitution"',
  'Erenlander Ability Adjustment':'Section=ability Note="+2 any/-2 any"',
  'Erenlander Extra Feats':'Section=feature Note="+2 General Feat"',
  'Erenlander Skill Bonus':'Section=skill Note="+%V Skill Points"',
  'Favored Region (Aruun)':
     'Section=skill ' +
     'Note="+2 Survival (within Aruun)/+2 Knowledge (Nature) (within Aruun)"',
  'Favored Region (Caraheen)':
     'Section=skill ' +
     'Note="+2 Survival (within Caraheen)/+2 Knowledge (Nature) (within Caraheen)"',
  'Favored Region (Central Erenland)':
     'Section=skill ' +
     'Note="Knowledge (Local (Central Erenland)) is a class skill/+2 Survival (within Central Erenland)/+2 Knowledge (Nature) (within Central Erenland)"',
  'Favored Region (Erenland)':
     'Section=skill ' +
     'Note="Knowledge (Local (Erenland)) is a class skill/+2 Survival (within Erenland)/+2 Knowledge (Nature) (within Erenland)"',
  'Favored Region (Erethor)':
     'Section=skill ' +
     'Note="Knowledge (Local (Erethor)) is a class skill/+2 Survival (within Erethor)/+2 Knowledge (Nature) (within Erethor)"',
  'Favored Region (Kaladruns)':
     'Section=skill ' +
     'Note="Knowledge (Local (Kaladruns)) is a class skill/+2 Survival (within Kaladruns)/+2 Knowledge (Nature) (within Kaladruns)"',
  'Favored Region (Miraleen)':
     'Section=skill ' +
     'Note="+2 Survival (within Miraleen)/+2 Knowledge (Nature) (within Miraleen)"',
  'Favored Region (Northern Reaches)':
     'Section=skill ' +
     'Note="Knowledge (Local (Northern Reaches)) is a class skill/+2 Survival (within Northern Reaches)/+2 Knowledge (Nature) (within Northern Reaches)"',
  'Favored Region (Northlands)':
     'Section=skill ' +
     'Note="Knowledge (Local (Northlands)) is a class skill/+2 Survival (within Northlands)/+2 Knowledge (Nature) (within Northlands)"',
  'Favored Region (Rivers)':
     'Section=skill ' +
     'Note="+2 Survival (on rivers)/+2 Knowledge (Nature) (on rivers)"',
  'Favored Region (Southern Erenland)':
     'Section=skill ' +
     'Note="Knowledge (Local (Southern Erenland)) is a class skill/+2 Survival (within Southern Erenland)/+2 Knowledge (Nature) (within Southern Erenland)"',
  'Favored Region (Subterranean Kaladruns)':
     'Section=skill ' +
     'Note="+2 Survival (within Subterranean Kaladruns)/+2 Knowledge (Nature) (within Subterranean Kaladruns)"',
  'Favored Region (Surface Kaladruns)':
     'Section=skill ' +
     'Note="+2 Survival (within Surface Kaladruns)/+2 Knowledge (Nature) (within Surface Kaladruns)"',
  'Favored Region (Urban)':
    'Section=skill ' +
     'Note="+2 Gather Information (in cities), untrained Knowledge use regarding cities"',
  'Favored Region (Veradeen)':
     'Section=skill ' +
     'Note="+2 Survival (within Veradeen)/+2 Knowledge (Nature) (within Veradeen)"',
  'Favored Weapon (Axes/Hammers)':
    'Section=combat Note="+1 attack w/axes and hammers"',
  'Feral Elf':
    'Section=skill Note="+2 Balance (trees)/+2 Climb (trees)/+2 Listen/+2 Search/+2 Spot/+2 Survival (within Erethor)/+2 Knowledge (Nature) (within Erethor)"',
  'Fortunate':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Gifted Healer':'Section=skill Note="+2 Heal"',
  'Gnome Ability Adjustment':'Section=ability Note="+4 Charisma/-2 Strength"',
  'Graceful':'Section=skill Note="+2 Climb/+2 Jump/+2 Move Silently/+2 Tumble"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Strength"',
  'Illiteracy':
    'Section=skill Note="Must spend 2 skill points to read and write"',
  'Keen Senses':'Section=skill Note="+2 Listen/+2 Search/+2 Spot"',
  'Know Depth':'Section=feature Note="Intuit approximate depth underground"',
  'Light Sensitivity':'Section=combat Note="-1 attack in daylight"',
  'Minor Light Sensitivity':
    'Section=combat Note="DC 15 Fortitude save in sunlight to avoid -1 attack"',
  'Mixed Blood':'Section=feature Note="%V for special abilities and affects"',
  'Natural Horseman':
    'Section=combat,skill ' +
     'Note="+1 melee damage (horseback), half ranged penalty (horseback)",' +
          '"+4 Handle Animal (horse)/+4 Ride (horse)/+4 Concentration (horseback)"',
  'Natural Mountaineer':
    'Section=ability,skill ' +
    'Note="Unimpeded movement in mountainous terrain",' +
         '"+2 Climb"',
  'Natural Predator':'Section=skill Note="+%V Intimidate"',
  'Natural Riverfolk':
    'Section=skill ' +
    'Note="+2 Perform/+2 Profession (Sailor)/+2 Swim/+2 Use Rope"',
  'Natural Sailor':
    'Section=skill ' +
    'Note="+2 Craft (ship)/+2 Profession (ship)/+2 Use Rope (ship)"',
  'Natural Swimmer':
    'Section=ability,skill ' +
    'Note=' +
      '"%V swim as move action",' +
      '"+8 special action or avoid hazard, always take 10, run"',
  'Natural Trader':
    'Section=skill ' +
    'Note="+4 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading"',
  'Night Fighter':'Section=combat Note="+1 attack in complete darkness"',
  'Nimble':'Section=skill Note="+2 Climb/+2 Hide"',
  'Orc Ability Adjustment':
    'Section=ability Note="+4 Strength/-2 Intelligence/-2 Charisma"',
  'Orc Cold Resistance':'Section=save Note="Immune non-lethal/half lethal"',
  'Orc Dodger':'Section=combat Note="+1 AC vs. orc"',
  'Orc Enmity':'Section=combat Note="+1 damage vs. dwarves"',
  'Quick':
    'Section=combat,save Note="+1 attack w/light weapons","+1 Reflex"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantments"',
  'Resist Poison':'Section=save Note="+2 vs. poison"',
  'Resist Spells':'Section=magic,save Note="-2 Spell Energy","+2 vs. spells"',
  'Rugged':'Section=save Note="+2 Fortitude/+2 Reflex/+2 Will"',
  'Sarcosan Ability Adjustment':
    'Section=ability Note="+2 Charisma/+2 Intelligence/-2 Wisdom"',
  'Sarcosan Extra Feat':'Section=feature Note="+1 General Feat"',
  'Sarcosan Skill Bonus':'Section=skill Note="+%V Skill Points"',
  'Skilled Rider':
    'Section=skill ' +
    'Note="+2 Handle Animal (wogren)/+2 Ride (wogren)/+2 Concentration (wogrenback)"',
  'Skilled Trader':
    'Section=skill ' +
    'Note="+2 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading"',
  'Skilled Worker':'Section=skill Note="+4 chosen Craft or Profession"',
  'Social':'Section=skill Note="+2 Bluff/+2 Diplomacy/+2 Sense Motive"',
  'Spirit Foe':
    'Section=save,skill ' +
    'Note="+2 vs. outsiders",' +
          '"+4 Hide (nature)/+4 Move Silently (nature)"',
  'Stability':'Section=combat Note="+4 vs. Bull Rush and Trip"',
  'Steady':
    'Section=ability Note="No speed penalty in heavy armor or with heavy load"',
  'Stoneworker':
    'Section=skill Note="+2 Appraise (stone, metal)/+2 Craft (stone, metal)"',
  'Stout':'Section=feature Note="Endurance and Toughness"',
  'Studious':'Section=feature Note="Magecraft (Hermetic)"',
  'Tribal Frenzy':
    'Section=combat Note="+1 attack when fighting among 10+ Orcs"',
  'Tree Climber':'Section=skill Note="+4 Balance (trees)/+4 Climb (trees)"',
  'Two-Handed Focus':'Section=combat Note="+1 attack using weapon two-handed"',
  'Unafraid':'Section=save Note="+2 vs. fear"',
  'Wood Elf Skill Bonus':'Section=skill Note="+%V Skill Points"',

  // Animal Companions
  'Companion Empathy':
    'Section=companion Note="Continuous emotional link w/no range limit"',
  'Enhanced Sense':
    'Section=companion Note="+%V mile channeled event detection"',
  'Telepathy':
    'Section=companion ' +
    'Note="R100\' Companion-controlled telepathic communication"',

  // Prestige Classes
  'Advance Ancestral Blade':
    'Section=combat Note="Unlock %V additional powers of covenant weapon"',
  'Alchemy':'Section=skill Note="Create plains dust%V"',
  'Alter Ego':'Section=feature Note="Transform into %V in %1 as %2 ability"',
  'Ancestral Advisor':
    'Section=magic Note="Blade predicts weal/woe action outcome %V/dy"',
  'Ancestral Favor':'Section=save Note="Reroll save 1/dy"',
  'Ancestral Guide':'Section=magic Note="R10\' Blade hums near secret doors"',
  'Ancestral Protector':'Section=magic Note="Blade swats away missiles"',
  'Ancestral Recall':'Section=skill Note="+%V failed Knowledge reroll 1/dy"',
  'Ancestral Spellcasting':
    'Section=magic Note="+%V Spell Energy/+%V Channeler Spells (conjuration)"',
  'Ancestral Warnings':'Section=combat Note="+2 Initiative"',
  'Ancestral Watcher':
    'Section=magic ' +
    'Note="Mental or audible alarm when creature comes w/in 20\' of weapon"',
  'Armored Casting':'Section=magic Note="Reduce arcane spell failure by %V%"',
  "Aryth's Blessing":
    'Section=feature ' +
    'Note="Spend 10 min to gain use of different heroic path feature %V/dy"',
  'Aura Of Winter':
    'Section=magic Note="R20\' Set temperature and use <i>Weather</i> %V/dy"',
  'Awaken Ancestral Blade':'Section=combat Note="Weapon becomes intelligent"',
  'Bane Of Legates Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Bind Astirax':
    'Section=magic ' +
    'Note="R60\' Astirax bound to current form for %V hr, destroyed if host animal killed (DC %1 Will neg)"',
  'Black Rot':'Section=ability Note="Detect and affected as evil"',
  'Blade':'Section=combat Note="+%Vd8 Sneak Attack"',
  'Blade Dance':
    'Section=combat ' +
    'Note="Use Canny Strike, Clever Fighting, Weapon Defense, and Well-Aimed Strike feats with falchion and greatsword"',
  'Blade Dancer Bonus Feats':'Section=feature Note="+%V Fighter Feat"',
  'Bless Ground':
    'Section=magic ' +
    'Note="R40\' +4 vs. fear, evil shaken, <i>Fell Forbiddance</i> for %V dy"',
  'Blood-Syphoning':
    'Section=magic ' +
    'Note="Spend %1 spell energy to have attack deliver <i>Vampiric Touch</i> and syphon 1d4+%V spell energy"',
  'Blood Talisman':
    'Section=magic Note="Reduce Blood-Syphoning spell energy cost by 1"',
  'Body Of The Blessed':
    'Section=feature ' +
    'Note="Non-evil reaction improved 1 step; evil reaction hostile"',
  'Body Of The Shadowed':'Section=ability Note="Detect and affected as evil"',
  'Bonus Spellcasting':'Section=feature Note="+%V Spellcasting Feat"',
  'Breath Of The Vigdir':
    'Section=magic Note="Raise a Dorn for %V wk to complete task"',
  'Call Meruros':
    'Section=magic Note="<i>Contingency</i> summoning of Meruros for %V rd"',
  'Call Tadulos':
    'Section=magic Note="<i>Contingency</i> summoning of Tadulos for %V rd"',
  'Channeled Combat':
    'Section=magic Note="Use 1 spell energy point to gain +%V %1 for 1 rd"',
  'Chosen Ground':
    'Section=combat ' +
    'Note="+2 attack, damage, and AC and Improved Bull Rush in 20\'x20\' area for %V hr 1/dy"',
  'City Is My Shield':
    'Section=combat Note="x2 cover bonus in urban environment, min +2 cover"',
  'City Sight':'Section=feature Note="Low-Light Vision"',
  'City Speak':'Section=skill Note="Communicate with any urban dweller"',
  'City Stance':
    'Section=combat ' +
    'Note="Take better of two Initiative rolls in urban environments"',
  'Cloak Of Snow':
    'Section=magic Note="Personal <i>Weather</i> at will outdoors"',
  'Cloaked In City Shadows':'Section=skill Note="Hide in any urban terrain"',
  'Close Combat Archery':
    'Section=combat Note="Use bow w/out foe AOO; use arrows as light weapons"',
  'Closed Mind':
    'Section=save Note="Second +4 Will save against revealing spy network"',
  'Coldness Of Shadow':
    'Section=save Note="Immune fear, no benefit from good-aligned casters"',
  'Commune With Nature':
    'Section=magic Note="<i>Commune With Nature</i> %V/dy"',
  'Conceal Magic Aura':'Section=feature Note="Conceal %V magical auras"',
  'Conceal Magic':
    'Section=magic ' +
    'Note="Spells considered half level for purposes of astirax detection"',
  'Constant Waves':
    'Section=skill ' +
    'Note="Take 10 on Balance, Climb, Jump, Perform (Dance), and Tumble even when distracted"',
  'Control Weather':'Section=magic Note="<i>Control Weather</i> %V/dy"',
  "Counter Izrador's Will":
    'Section=magic Note="<i>Dispel Magic</i> to counterspell legates"',
  'Cover Story':
    'Section=skill Note="DC 20 Bluff four consecutive dy to establish alibi"',
  'Crashing Waves':'Section=combat Note="Disarm or Trap as AOO %V/rd"',
  'Dark Invitation':
    'Section=feature,magic ' +
    'Note=' +
      '"Spellcasting (Greater Conjuration)",' +
      '"+1 Channeler Spells (Summon Monster)"',
  'Death Attack':
    'Section=combat ' +
    'Note="Sneak attack after 3 rd of study causes death or paralysis d6+%1 rd (DC %V Fort neg)"',
  'Death Knell':
    'Section=magic ' +
    'Note="Touched w/negative HP dies, giving 1d8 HP, +2 Str, +1 caster level, 1d4 spell energy (%1 max) for 10*target HD min (DC %2 Will neg) %V/dy"',
  'Deathwatch':
    'Section=magic ' +
    'Note="R30\' cone Reveals state of targets for %1 min %V/dy, 1 spell energy per additional use"',
  'Deft Dodging':
    'Section=combat Note="+4 self and mount AC on full rd mounted move"',
  "Deny Izrador's Power":
    'Section=magic Note="R60\' +%V <i>Dispel Magic</i> vs. Legate spell %1/dy"',
  'Disarming Shot':'Section=combat Note="Disarm via ranged touch attack"',
  'Disguise Contraband':
    'Section=magic ' +
    'Note="Divination and detection on %V\' cu of contraband fails %V for hr"',
  'Dismounting Cut':
    'Section=combat Note="Trip attack w/weapon to dismount opponent"',
  'Divine Grace':'Section=save Note="+%V Will"',
  'Dominant Will':
    'Section=save ' +
    'Note="+%V Will vs. detection and compulsion spells to reveal activities"',
  'Dreams Of The Land (Commune)':
    'Section=magic Note="R%V mi learn facts about surrounding area"',
  'Dreams Of The Land (Dream)':
    'Section=magic Note="Send message to sleeping ally"',
  'Dreams Of The Land (Foresight)':
    'Section=magic ' +
    'Note="Warnings provide +2 AC, +2 Reflex, no surprise, flat-footed for %V hr"',
  'Druidcraft':'Section=magic Note="Energy cost of Druid spells reduced by 1"',
  'Dwarven Literacy':
    'Section=skill Note="Literate in Old Dwarven and Clan Dwarven"',
  'Dwarven Loremaster Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Empowered Dispelling':'Section=magic Note="+2 dispel checks"',
  'Efficient Study':
    'Section=feature ' +
    'Note="XP cost for learning spells and creating magic items reduced by %V%"',
  'Erratic Attack':
    'Section=combat Note="+2 self or mount AC when either attacks"',
  'Fast Hands':
    'Section=combat Note="Trade -2 first rd attack for +4 Initiative"',
  'Fell Touch':
    'Section=magic ' +
    'Note="Full-round action prevents fallen from becoming Fell or Lost"',
  'Find The Way':'Section=feature Note="%V"',
  'Fist':'Section=feature Note="%V additional Defender abilities"',
  'Fluid Defense':'Section=combat Note="+%V AC"',
  'For The King':
    'Section=combat ' +
    'Note="War cry grants self +%1 attack and +1d%2 damage vs. Shadow minions, R60\' allies +%1 vs. fear %V rd/dy"',
  'Forgotten Knowledge':'Section=skill Note="+2 Decipher Script/+2 Knowledge"',
  'Freerider Bonus Feats':'Section=feature Note="%V Freerider feats"',
  'Gardener Of Erethor Bonus Spells':
    'Section=magic Note="+%V Channeler Spells (nature)"',
  'Gardener Of Erethor Bonus Feats':
    'Section=feature Note="%V Gardener Of Erethor feats"',
  'Gaze Of The Meruros':
    'Section=magic Note="Gaze casts DC %V <i>Cause Fear</i> spell 1/dy"',
  'Ghost Sight':'Section=magic Note="<i>See Invisible</i> at will"',
  'Gift Of Izrador':'Section=magic Note="Learn %V level 1 domain spells"',
  'Gift Of The Vigdir':
    'Section=magic Note="Raise a Dorn for %V dy to complete task"',
  'Grant Protection':
    'Section=magic ' +
    'Note="<i>Sanctuary</i>, then <i>Shield Of Faith</i> to chosen person %V/dy"',
  'Ignore Armor':'Section=magic Note="Reduce arcane spell failure by %V%"',
  'Improved Vision Of The Night':'Section=feature Note=Darkvision',
  'It Is Written In The Stars':'Section=feature Note="Force reroll 1/dy"',
  'Hit And Run':
    'Section=combat Note="Move away from foe after attack w/out foe AOO"',
  'Homemaker':
    'Section=skill ' +
    'Note="+%V Knowledge (Nature)/+%V Profession (Gardener)/+%V Profession (Farmer)/+%V Profession (Herbalist)"',
  'Horse Lord':
    'Section=skill Note="+1 Handle Animal (horse)/+1 Ride (horseback)"',
  'House Of Summer':
    'Section=magic ' +
    'Note="<i>Secure Shelter</i> protects from natural weather 1/dy"',
  'Know Thy Enemy':
    'Section=combat,skill ' +
    'Note="+%V damage and AC vs. %1",' +
         '"+%V Bluff, Listen, Sense Motive, Spot, Survival vs. %1"',
  'Immovable Blade':'Section=combat Note="Cannot be involuntarily disarmed"',
  'Immunity To Fear':'Section=save Note="Immune all fear effects"',
  'Imp':'Section=feature Note="Assistance from courtesan imp"',
  'Impervious Mind':
    'Section=save Note="Mental effects preventing attacks agains %V dispelled"',
  'Imposing Presence':
    'Section=skill ' +
    'Note="+4 Intimidate (strangers)/+2 Diplomacy (Shadow minions)"',
  'Improved Coup De Grace':
    'Section=combat Note="Max damage from standard action coup de grace"',
  'Improved Mounted Archery':
    'Section=combat ' +
    'Note="No ranged attack penalty when mounted, mounted Rapid Shot"',
  'Improved Mounted Assault':
    'Section=combat Note="No penalty for additional mounted attacks"',
  'Improved Mounted Combat':
    'Section=combat Note="Mounted Combat additional %V times/rd"',
  'Improved Ride-By Attack':
    'Section=combat Note="Change direction while charging"',
  'Improved Sneak Attack Range':
    'Section=combat Note="Ranged sneak attack range +%V\'"',
  'Improved Spirited Charge':
    'Section=combat Note="x2 critical threat range w/charging weapon"',
  'Improved Trample':'Section=combat Note="No foe AOO during overrun"',
  'Information Network':
    'Section=skill ' +
    'Note="Take %V on Gather Information after 1 hr in new locale"',
  'Intimidating Shot':
    'Section=combat ' +
    'Note="Intimidate check after attack w/bonus of half damage"',
  'Joint Attack':
    'Section=combat ' +
    'Note="Rider and mount +2 attack on same target when other hits"',
  'Leaf Reader':
    'Section=combat ' +
    'Note="Reduce vegetation concealment miss chance by 10% for every 5 above DC 10 Spot check"',
  'Like Snowfall':
    'Section=magic ' +
    'Note="Continuous <i>Pass Without Trace</i>, <i>Feather Fall</i> 3/dy"',
  'Magic Resistance':'Section=save Note="+%V vs. spells"',
  'Mass Cure':
    'Section=magic Note="<i>Mass Cure Light Wounds</i> centered on self %V/dy"',
  'Master Of Fate':
    'Section=combat Note="Killing damage to self limited to -9 HP"',
  'Master Of Tales':
    'Section=magic Note="Use two Tales Of The Sorshef simultaneously"',
  'Master Spy':
    'Section=feature ' +
    'Note="Mindbond to known Master Spies, apprentices, and those in homeland at will"',
  'Mediator':
    'Section=feature Note="Shift attitude of %V creatures 1 step %1/dy"',
  'Melee Caster':'Section=magic Note="Deliver spell up to Ch%V via weapon"',
  'Meticulous Aim':
    'Section=combat Note="+1 critical range for every 2 rd aiming; +%V max"',
  'Mindbond':'Section=feature Note="Telepathic link to mentor 1/dy"',
  'Mounted Ability':'Section=feature Note="%V selections"',
  'Mounted Hide':'Section=skill Note="+%V Hide while mounted"',
  'Mounted Maneuver':'Section=feature Note="%V selections"',
  'Mystifying Speech':
    'Section=magic ' +
    'Note="Change 5 min of memory of %1 listeners (DC %2 Will neg) %V/dy"',
  'Narrowswending':
    'Section=ability Note="Ignore 2 sq difficult terrain, full-speed squeeze"',
  'Nature Sense':
    'Section=skill Note="Identify animals, plants, unsafe food and drink"',
  'Null Field':
    'Section=feature Note="Conceal auras of %V magical objects on person"',
  'Obsidian Tongue':
    'Section=skill ' +
    'Note="+%V Bluff, Diplomacy, Gather Information (Shadow minions)"',
  'Omen Of The Sorshef':'Section=magic Note="<i>Augury</i> w/%V% success"',
  'Pale Heart':'Section=save Note="+%V vs Shadow minion spells and abilities"',
  'Parables Of The Sorshef':
    'Section=skill ' +
    'Note="+%V Knowledge check wrt local notables, legendary items, and noteworthy places, additional +2 wrt Sorshef and Sarcosan history"',
  'Pride Of The Sorshef':'Section=save Note="Immune disease and poison"',
  'Primal Foe':'Section=feature Note="May not associate with %V"',
  'Ranged Sneak Attack':'Section=combat Note="R%1\' +%Vd6 Sneak Attack"',
  'Rage Of Vengeance':
    'Section=combat ' +
    'Note="Ally damage w/in 30\' by %V gives damage% chance of +2 Str, +2 Con, +1 Will, +1d6 damage, -2 AC, Cleave w/out limit against those foes while present"',
  'Recharge Nexus':
    'Section=magic ' +
    'Note="Spend %V points of spell energy to recharge nexus 1 point"',
  'Regenerative Strike':
    'Section=magic ' +
    'Note="Recover spell energy equal to 2*weapon multiplier on critical hit"',
  "Resist Izrador's Will":'Section=save Note="+%V vs. legate magic"',
  'Respect':'Section=feature Note="Leadership (shadow minions)"',
  'Roofjumping':'Section=skill Note="+10 Jump (rooftop), 10\' running jump"',
  'Rune Magic':
    'Section=magic Note="Carve rules to evoke up to level %V spell at R60\'"',
  'Sahi Bonus Feats':'Section=feature Note="%V Sahi Feat"',
  'Sahi Literacy':'Section=skill Note="Literate in Colonial and Courtier"',
  'Sanctify':
    'Section=magic Note="<i>Hallow</i> with <i>Fell Forbiddance</i> 1/dy"',
  'Savvy Host':
    'Section=feature,magic ' +
    'Note=' +
      '"Augment Summoning feat, speak with any summoned creature",' +
      '"+1 Channler Spells (Summon Monster)"',
  'Savvy Hunter':
    'Section=combat Note="Trade half damage bonus vs. %V for attack bonus"',
  'Seance':
    'Section=magic ' +
    'Note="<i>Augury</i> or <i>Legend Lore</i> about past%1 via spirits %V/dy"',
  'Security Breach':
    'Section=skill Note="Gather Information gives +%V to Bluff, Hide, and Move Silently to exploit chinks in site security"',
  'See Astirax':'Section=feature Note="See astirax as shadowy form"',
  'Sense Magic':
    'Section=magic,skill ' +
    'Note="<i>Detect Magic</i> %V/dy","+%V Spellcraft"',
  'Shadow Contacts':
    'Section=skill ' +
    'Note="Gather Information check to obain %V favor from Shadow minion"',
  'Shadow Speak':
    'Section=skill ' +
    'Note="+%V Bluff, Diplomacy, Intimidate, Sense Motive w/Shadow minions"',
  'Shadow-Tapping':'Section=feature Note="Access to two Izrador domains"',
  "Smuggler's Trade":
    'Section=skill ' +
    'Note="+%V or take 10 on Bluff, Disguise, Forgery, Gather Information when smuggling"',
  'Special Mount':'Section=feature Note="Companion mount w/special abilities"',
  'Speed Mount':'Section=combat Note="Dismount, mount as free action"',
  'Spell Resistance':'Section=save Note="%V%"',
  'Spell-Syphoning':
    'Section=magic ' +
    'Note="Blood-syphoning transfers spell from target to self or, with grapple, allows use of target spell energy"',
  'Spirit Manipulation':
    'Section=magic ' +
    'Note="%V chosen Divination or Necromancy spells as spell-like ability 1/dy"',
  'Spirit Speaker':
    'Section=magic ' +
    'Note="+1 Spell Energy/+1 Channeler Spells (conjuration or divination)"',
  'Spirit Speaker Bonus Feats':'Section=feature Note="%V Spirit Speaker Feats"',
  'Spiritcraft':
    'Section=magic ' +
    'Note="Divination and Necromancy spell energy cost reduced by 1"',
  'Spiritual Link':
    'Section=magic ' +
    'Note="<i>Alarm</i>, +1 caster level, -1 energy cost in %V areas of up to 1/2 mi diameter"',
  'Spur On':'Section=feature Note="Dbl mount speed during charge or dbl move"',
  'Spy':
    'Section=feature ' +
    'Note="%V% chance of help from d3 Aradil\'s Eyes in dire need"',
  'Spy Initiate':
    'Section=feature,skill ' +
    'Note="Services from Elven contacts","+%V Diplomacy (Elves, allies)"',
  'Still As Stone':'Section=skill Note="+10 Hide (exploiting Security Breach)"',
  'Strength Of My Ancestors':
    'Section=feature Note="+2 ability, attack, save, or skill check %V/dy"',
  'Strength Of The Wood':
    'Section=magic Note="Recover 1 spell energy point/hr during Tree Meld"',
  'Stunning Sneak Attack':
    'Section=combat Note="Sneak attack stuns foe 1 rd 3/dy (DC %V neg)"',
  'Summon Ancestor':
    'Section=magic ' +
    'Note="Cast <i>Summon Ancestral Warrior</i> and <i>Summon Ancestral Hero</i> at 50 vp discount"',
  'Sundered Spirit':
    'Section=magic ' +
    'Note="Radiate 5\'-50\' <i>Antimagic Field</i> for divine magic"',
  'Survival Of The Skilled':'Section=skill Note="+%V on %1 chosen skills"',
  'Sweeping Strike':
    'Section=combat ' +
    'Note="Attack all threatened foes during mount move w/out foe AOO"',
  'Tales Of The Sorshef (Agony)':
    'Section=magic ' +
    'Note="R60\' Foe striking ally affected by <i>Symbol Of Pain</i> (DC %2 neg, +2 if Sarcosan ally) during storytelling (%1 max) +%V rd"',
  'Tales Of The Sorshef (Determination)':
    'Section=magic ' +
    'Note="R60\' Allies +1 attack and save, +1d8 HP during storytelling (%1 max) +%V rd"',
  'Tales Of The Sorshef (Freedom)':
    'Section=magic ' +
    'Note="R60\' Allies immune paralysis, stunning, nausea, and petrification during storytelling (%1 max) +%V rd"',
  'Tales Of The Sorshef (Heart)':
    'Section=magic ' +
    'Note="R60\' Allies +%2 vs. fear and compulsion during storytelling (%1 max) +%V rd"',
  'Target Study':
    'Section=combat ' +
    'Note="Gather Information gives +2 attack and damage or +4 AC vs. chosen foe"',
  'The Drop':'Section=combat Note="+%V attack and damage vs. flat-footed foe"',
  'Tree Meld':'Section=magic Note="Merge into tree for up to %V hr"',
  'Unbreakable Blade':'Section=combat Note="Ancestral weapon cannot be harmed"',
  'Undetectable Alignment':
    'Section=magic Note="Continuous <i>Undetectable Alignment</i>"',
  'Urban Mobility':'Section=feature Note="%V selections"',
  'Unwavering Blade':
    'Section=combat ' +
    'Note="Detect weapon if separated; if unconscious, weapon protects"',
  'Venom Immunity':'Section=save Note="Immune to organic poisons"',
  'Vision Of The Night':'Section=feature Note="Low-Light Vision"',
  'Wallscaling':'Section=ability,skill ' +
  'Note=' +
    '"%V climb speed in urban settings",' +
    '"+8 Climb (urban), take 10 if rushed or threatened"',
  "Warden's Vows":
    'Section=feature ' +
    'Note="Sworn to seek King\'s heirs, keep secrets, help Erenlanders in need, and kill Shadow minions"',
  'Way Of The Snow Witch':
    'Section=magic,save ' +
    'Note=' +
      '"Additional automatic spells",' +
      '"+%V vs weather and natural energy effects"',
  'What Was Will Be Again':
    'Section=combat ' +
    'Note="x2 attacks as full-round action w/%V 5\' steps 1/day"',
  'Wheel About':
    'Section=combat Note="May make 90 degree turn during mounted charge"',
  "Whisper's Ward":
    'Section=save Note="Immune to mind-affecting effects w/in Erethor"',
  'Whisper Sense':
    'Section=combat,feature,magic ' +
    'Note=' +
      '"%V w/in Erethor",' +
      '"Sense voices in Erethor w/out wisdom check",' +
      '"%V w/in Erethor"',
  'Wizard Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Wizardcraft':
    'Section=magic Note="Prepare spells ahead of time for half energy cost"',
  'Wogren Dodge':'Section=combat Note="+2 AC during mounted move"',
  "Wogren's Sight":'Section=feature Note="Blindsense while mounted"',
  'Woodsman':'Section=skill Note="+2 Handle Animal/+2 Survival"'

};
LastAge.FEATURES = Object.assign({}, SRD35.FEATURES, LastAge.FEATURES_ADDED);
LastAge.GOODIES = Object.assign({}, SRD35.GOODIES);
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
LastAge.PATHS = {
  'Death Domain':SRD35.PATHS['Death Domain'].replaceAll('Cleric', 'Legate'),
  'Destruction Domain':SRD35.PATHS['Destruction Domain'].replaceAll('Cleric', 'Legate'),
  'Evil Domain':SRD35.PATHS['Evil Domain'].replaceAll('Cleric', 'Legate'),
  'Magic Domain':SRD35.PATHS['Magic Domain'].replaceAll('Cleric', 'Legate'),
  'War Domain':SRD35.PATHS['War Domain'].replaceAll('Cleric', 'Legate'),
  'None':
    'Group=None ' +
    'Level=level',
  'Beast':
    'Group=Beast ' +
    'Level=level ' +
    'Features=' +
      '"1:Vicious Assault","2:Bestial Aura","5:Ability Boost",7:Rage,' +
      '"12:Enhanced Bestial Aura" '+
    'Selectables=' +
      '"Low-Light Vision",Scent ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Beast1:3=1;3=2,' + // Magic Fang 2/dy
      'Beast2:4=1;9=2;14=3,' +
      'Beast3:8=1,' +
      'Beast4:19=1',
  'Chanceborn':
    'Group=Chanceborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Luck Of Heroes",3:Unfettered,"4:Miss Chance",' +
      '"6:Chanceborn Survivor","9:Take Ten","19:Take Twenty" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Chanceborn0:2=1,' +
      'Chanceborn1:7=1,' +
      'Chanceborn2:12=1,' +
      'Chanceborn3:17=1',
  'Charismatic':
    'Group=Charismatic ' +
    'Level=level ' +
    'Features=' +
      '"4:Inspiring Oration","5:Charisma Bonus",6:Leadership,' +
      '"12:Natural Leader" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Charismatic1:1=1;2=2;3=3,' +
      'Charismatic2:7=1;8=2,' +
      'Charismatic3:11=1;16=2,' +
      'Charismatic4:13=1,' +
      'Charismatic6:17=1',
  'Dragonblooded':
    'Group=Dragonblooded ' +
    'Level=level ' +
    'Features=' +
      '"1:Bolster Spell","2:Bonus Spells","3:Bonus Spell Energy",' +
      '"4:Quickened Counterspelling","6:Dragonblooded Improved Spellcasting",' +
      '"9:Improved Spell Penetration","19:Frightful Presence"',
  'Earthbonded':
    'Group=Earthbonded ' +
    'Level=level ' +
    'Features=' +
      '"1:Extended Darkvision","3:Natural Armor",4:Stonecunning,' +
      '"8:Improved Stonecunning",12:Tremorsense,16:Blindsense,' +
      '20:Blindsight ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Earthbonded1:2=1,' +
      'Earthbonded2:5=1;6=2,' +
      'Earthbonded3:11=1,' +
      'Earthbonded4:7=1;9=2;14=3,' +
      'Earthbonded5:13=1,' +
      'Earthbonded6:15=1;17=2,' +
      'Earthbonded8:19=1',
  'Faithful':
    'Group=Faithful ' +
    'Level=level ' +
    'Features=' +
      '"4:Turn Undead","5:Wisdom Bonus" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Faithful1:1=1;2=2;3=3;7=4,' +
      'Faithful2:6=1;8=2,' +
      'Faithful3:11=1;12=2;13=3,' +
      'Faithful4:16=1,' +
      'Faithful5:17=1,' +
      'Faithful8:18=1',
  'Fellhunter':
    'Group=Fellhunter ' +
    'Level=level ' +
    'Features=' +
      '"1:Sense The Dead","2:Touch Of The Living","3:Ward Of Life",' +
      '"5:Disrupting Attack" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Fellhunter1:1=1',
  'Feyblooded':
    'Group=Feyblooded ' +
    'Level=level ' +
    'Features=' +
      '"1:Low-Light Vision","7:Fey Vision" ' +
    'Selectables=' +
      '"Unearthly Grace (AC)","Unearthly Grace (Dexterity)",' +
      '"Unearthly Grace (Fortitude)","Unearthly Grace (Reflex)",' +
      '"Unearthly Grace (Will)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Feyblooded1:2=1;3=2;5=3,' +
      'Feyblooded2:6=1,' +
      'Feyblooded3:9=1;10=2;11=3,' +
      'Feyblooded4:15=1,' +
      'Feyblooded5:14=1;18=2,' +
      'Feyblooded6:17=1',
  'Giantblooded':
    'Group=Giantblooded ' +
    'Level=level ' +
    'Features=' +
      '"level < 10 ? 1:Size Features (Big)","2:Rock Throwing",' +
      '"3:Intimidating Size","4:Fast Movement","5:Strength Bonus",' +
      '"8:Fearsome Charge","10:Size Features (Large)",' +
      '"20:Size Features (Extra Reach)"',
  'Guardian':
    'Group=Guardian ' +
    'Level=level ' +
    'Features=' +
      '"1:Inspire Valor","2:Detect Evil","3:Righteous Fury","4:Smite Evil",' +
      '"5:Constitution Bonus",' +
      '"charisma >= 12 ? 6:Lay On Hands","12:Aura Of Courage","16:Death Ward" '+
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Guardian2:2=1',
  'Healer':
    'Group=Healer ' +
    'Level=level ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Healer1:1=1;3=2,' + // Cure Light 2/dy
      'Healer2:2=1;4=2;6=3,' + // Cure Moderate 2/dy
      'Healer3:5=1;7=2;8=3;9=4;11=5,' + // Cure Serious 2/dy
      'Healer4:10=1;12=2;14=3;17=4,' + // Cure Critical, Restoration 2/dy, 
      'Healer5:13=1;15=2;20=3,' + // Mass Cure Light 2/dy
      'Healer7:16=1;18=2,' + // Heal 2/dy
      'Healer9:19=1',
  'Ironborn':
    'Group=Ironborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Ironborn Resilience","2:Fortitude Bonus","3:Natural Armor",' +
      '"4:Improved Healing","5:Damage Reduction","6:Elemental Resistance",' +
      '9:Indefatigable,"14:Improved Healing (Ability Recovery)"',
  'Jack-Of-All-Trades':
    'Group=Jack-Of-All-Trades ' +
    'Level=level ' +
    'Features=' +
      '"1:Spell Choice","2:Spontaneous Spell","3:Skill Boost",' +
      '"4:Ability Boost","5:Save Boost","7:Jack-Of-All-Trades Bonus Feats" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Jack0:1=1;2=2,' +
      'Jack1:6=1;13=2,' +
      'Jack2:10=1;19=2,' +
      'Jack3:16=1',
  'Mountainborn':
    'Group=Mountainborn ' +
    'Level=level ' +
    'Features=' +
      '1:Mountaineer,3:Ambush,"4:Rallying Cry","5:Constitution Bonus",' +
      '"8:Ambush (Extra Damage)","13:Ambush (Quick)","18:Ambush (Sniping)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Mountainborn1:2=1;7=2,' +
      'Mountainborn3:12=1,' +
      'Mountainborn6:17=1',
  'Naturefriend':
    'Group=Naturefriend ' +
    'Level=level ' +
    'Features=' +
      '"1:Natural Bond","1:Wild Empathy","5:Animal Friend","10:Plant Friend",' +
      '"15:Elemental Friend","20:One With Nature" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Naturefriend1:2=1;3=2;4=3;9=4,' +
      'Naturefriend2:6=1;7=2;8=3,' +
      'Naturefriend3:11=1;12=2;13=3;14=4;16=5,' +
      'Naturefriend4:17=1;18=2;19=3,' +
      'Naturefriend5:20=1',
  'Northblooded':
    'Group=Northblooded ' +
    'Level=level ' +
    'Features=' +
      '1:Northborn,"1:Wild Empathy","2:Cold Resistance","3:Battle Cry",' +
      '"4:Howling Winds","5:Constitution Bonus","6:Aura Of Warmth",' +
      '"11:Improved Battle Cry","13:Frost Weapon","16:Cold Immunity",' +
      '"18:Greater Frost Weapon"',
  'Painless':
    'Group=Painless ' +
    'Level=level ' +
    'Features=' +
      '1:Painless,"2:Nonlethal Damage Reduction","3:Uncaring Mind",' +
      '"4:Retributive Rage",5:Ferocity,"9:Last Stand",' +
      '"10:Increased Damage Threshold"',
  'Pureblood':
    'Group=Pureblood ' +
    'Level=level ' +
    'Features=' +
      '"1:Master Adventurer","2:Blood Of Kings","3:Pureblood Bonus Feats",' +
      '"4:Skill Mastery","5:Ability Boost"',
  'Quickened':
    'Group=Quickened ' +
    'Level=level ' +
    'Features=' +
      '"1:Initiative Bonus","2:Armor Class Bonus","3:Fast Movement",' +
      '"4:Burst Of Speed","5:Dexterity Bonus"',
  'Seaborn':
    'Group=Seaborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Dolphin\'s Grace","1:Natural Swimmer","2:Deep Lungs",' +
      '"3:Aquatic Blindsight","4:Aquatic Ally","10:Aquatic Adaptation",' +
      '"14:Cold Resistance","17:Aquatic Emissary","18:Assist Allies" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Seaborn2:4=1;5=2;8=1;9=2,' +
      'Seaborn3:8=2;12=null;13=1,' +
      'Seaborn4:12=3;16=null,' +
      'Seaborn5:16=4;20=null,' +
      'Seaborn6:20=5',
  'Seer':
    'Group=Seer ' +
    'Level=level ' +
    'Features=' +
      '"3:Seer Sight" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Seer1:1=1,' +
      'Seer2:2=1;5=2,' +
      'Seer3:4=1;8=2,' +
      'Seer4:7=1;10=2;11=3;13=4,' +
      'Seer5:16=1;19=2,' +
      'Seer6:14=1;17=2,' +
      'Seer7:20=1',
  'Speaker':
    'Group=Speaker ' +
    'Level=level ' +
    'Features=' +
      '"2:Persuasive Speaker","3:Power Words","5:Charisma Bonus",' +
      '"14:Language Savant" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Speaker1:1=1,' +
      'Speaker2:4=1,' +
      'Speaker3:8=1,' +
      'Speaker4:12=1,' +
      'Speaker8:18=1',
  'Spellsoul':
    'Group=Spellsoul ' +
    'Level=level ' +
    'Features=' +
      '"1:Untapped Potential","2:Metamagic Aura","3:Spellsoul Resistance",' +
      '"4:Bonus Raw Energy"',
  'Shadow Walker':
    'Group="Shadow Walker" ' +
    'Level=level ' +
    'Features=' +
      '1:Darkvision,"2:Shadow Veil","4:Shadow Jump","11:Hide In Plain Sight" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadow1:3=1;7=2;13=3;17=4,' + // Expeditious Retreat 2/dy; Undetectable Alignment 2/dy
      'Shadow2:5=1;15=2,' + // Blur 2/dy
      'Shadow3:9=1;19=2', // Displacement 2/dy
  'Steelblooded':
    'Group=Steelblooded ' +
    'Level=level ' +
    'Features=' +
      '"2:Offensive Tactics","3:Strategic Blow","4:Skilled Warrior",' +
      '14:Untouchable',
  'Sunderborn':
    'Group=Sunderborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Detect Outsider","2:Blood Of The Planes","4:Planar Fury",' +
      '"7:Spirit Sight (Darkness)","13:Spirit Sight (Magical Darkness)",' +
      '"19:Spirit Sight (Invisible)" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Sunderborn1:1=1;3=2,' +
      'Sunderborn2:6=1,' +
      'Sunderborn3:9=1,' +
      'Sunderborn4:12=1,' +
      'Sunderborn5:15=1,' +
      'Sunderborn6:18=1',
  'Tactician':
    'Group=Tactician ' +
    'Level=level ' +
    'Features=' +
      '"1:Aid Another (Move)","2:Combat Overview","3:Coordinated Initiative",' +
      '"4:Coordinated Attack","5:Aid Another (Combat Bonus)",' +
      '"13:Directed Attack","18:Telling Blow","20:Perfect Assault"',
  'Warg':
    'Group=Warg ' +
    'Level=level ' +
    'Features=' +
      '"1:Wild Empathy","2:Animal Companion","5:Wild Shape",13:Ferocity,' +
      '20:Blindsense ' +
    'Selectables=' +
      '"Low-Light Vision",Scent ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Warg1:4=1;7=2;12=3;17=4', // Charm Animal 2/dy; Speak w/Animals 2/dy
  // Sorcery & Shadow
  'Blessed':
    'Group=Blessed ' +
    'Level=level ' +
    'Features=' +
      '"1:Body Of The Blessed","3:Aura Of Courage","5:Grant Protection",' +
      '"6:Divine Grace","7:Mass Cure","10:Bless Ground","14:Sanctify" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Blessed1:2=1;4=2;9=3;13=4;16=5;17=6,' + // Bless 4/dy; Protection From Evil 2/dy
      'Blessed2:8=1;18=2,' +
      'Blessed3:11=1,' +
      'Blessed5:7=1;15=2;19=3,' +
      'Blessed8:20=1',
  'Null':
    'Group=Null ' +
    'Level=level ' +
    'Features=' +
      '"1:Sense Magic","2:Magic Resistance","3:Null Field",' +
      '"5:Spell Resistance","9:Empowered Dispelling" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Null3:4=1;8=2;12=3,' + // Dispel Magic 3/dy
      'Null4:17=1,' +
      'Null6:13=1;18=2',
  'Shadowed':
    'Group=Shadowed ' +
    'Level=level ' +
    'Features=' +
      '"1:Body Of The Shadowed",1:Darkvision,"4:Coldness Of Shadow",' +
      '"5:Gift Of Izrador","9:Turn Undead","14:Imposing Presence",' +
      '"19:Shadowed Frightful Presence" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadowed1:3=1;6=2;7=3;11=4;12=5;16=6;17=7,' + // Bane 4/dy; Summon Monster I 3/dy
      'Shadowed2:2=1;8=2;13=3;18=4,' + // Death Knell 3/dy
      'Domain1:5=1;10=2;15=3;20=4',
  'Wiser':
    'Group=Wiser ' +
    'Level=level ' +
    'Features=' +
      '"1:Wiser Skill Bonus","2:Wiser Bonus Feats","4:Insight",' +
      '"5:Intelligence Bonus"'
};
LastAge.RACES = {
  'Agrarian Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Alert Senses","Dexterous Hands",Fortunate,"Gifted Healer",Graceful,' +
      '"Innate Magic","Low-Light Vision",Slow,Small,"Resist Fear",' +
      '"features.Stout ? 1:Endurance","features.Stout ? 1:Toughness",' +
      '"features.Studious ? 1:Magecraft (Hermetic)" ' +
    'Selectables=' +
      'Stout,Studious ' +
    'Languages=Colonial,Halfling',
  'Clan Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",' +
      '"Favored Region (Kaladruns)",' +
      '"Favored Region (Subterranean Kaladruns)",' +
      'Darkvision,"Dwarf Enmity","Orc Dodger","Favored Weapon (Axes/Hammers)",'+
      '"Know Depth","Natural Armor","Resist Poison","Resist Spells",Slow,' +
      'Stability,Steady,Stonecunning,Stoneworker ' +
    'Languages="Clan Dwarven","Old Dwarven"',
  'Danisil-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Sepi)",' +
      '"Favored Region (Aruun)","Favored Region (Erethor)",' +
      'Fortunate,"Gifted Healer","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Mixed Blood",Nimble,Small ' +
    'Languages=Halfling,"High Elven","Jungle Mouth"',
  'Dorn':
    'Features=' +
      '"Dorn Ability Adjustment",' +
      '"Weapon Familiarity (Bastard Sword/Dornish Horse Spear)",' +
      '"Favored Region (Northlands)",' +
      'Brotherhood,"Cold Fortitude","Dorn Extra Feat","Dorn Skill Bonus",' +
      '"Fortitude Bonus","Two-Handed Focus" ' +
    'Languages=Erenlander,Norther',
  'Dwarf-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",'+
      '"Favored Region (Kaladruns)",' +
      'Darkvision,"Mixed Blood","Natural Armor","Orc Dodger","Resist Poison",' +
      '"Resist Spells",Small,Slow,Stoneworker ' +
    'Selectables=' +
      '"Natural Mountaineer",Stonecunning ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue"',
  'Dworg':
    'Features=' +
      '"Dworg Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      '"Favored Region (Kaladruns)",' +
      'Darkvision,"Dwarf Enmity","Minor Light Sensitivity","Mixed Blood",' +
      'Rugged,"Resist Spells" ' +
    'Selectables=' +
      '"Natural Mountaineer",Stonecunning ' +
    'Languages="Clan Dwarven","Old Dwarven",Orcish',
  'Erenlander':
    'Features=' +
      '"Erenlander Ability Adjustment",' +
      '"Weapon Familiarity (Bastard Sword/Cedeku/Dornish Horse Spear/Sarcosan Lance)",' +
      '"Favored Region (Erenland)",' +
      '"Erenlander Extra Feats","Erenlander Skill Bonus","Skilled Worker" ' +
    'Languages=Erenlander',
  'Gnome':
    'Features=' +
      '"Gnome Ability Adjustment",' +
      '"Weapon Familiarity (Hand Crossbow)",' +
      '"Favored Region (Central Erenland)","Favored Region (Rivers)",' +
      '"Deep Lungs","Fortitude Bonus","Low-Light Vision","Natural Riverfolk",' +
      '"Natural Swimmer","Natural Trader","Resist Spells",Slow,Small ' +
    'Languages="Trader\'s Tongue",any,any',
  'Gnome-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      '"Weapon Familiarity (Hand Crossbow/Inutek)",' +
      '"Favored Region (Central Erenland)",' +
      'Darkvision,"Deep Lungs","Mixed Blood","Natural Armor",' +
      '"Natural Riverfolk","Natural Swimmer","Resist Poison","Resist Spells",' +
      'Small,Slow,"Skilled Trader" ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue",any,any',
  'Halfling-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Bound To The Beast",Fortunate,"Gifted Healer","Innate Magic",' +
      '"Keen Senses","Low-Light Vision","Mixed Blood","Mounted Combat",' +
      'Nimble,Small ' +
    'Languages=Erenlander,Halfling,"Jungle Mouth"',
  'Jungle Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Sepi)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Aruun)","Favored Region (Erethor)",' +
      '"Bonus Innate Spell","Bonus Spell Energy","Double Sepi Training",' +
      '"Feral Elf","Innate Magic","Keen Senses","Low-Light Vision",' +
      '"Resist Enchantment","Spirit Foe","Tree Climber" ' +
    'Languages="Jungle Mouth"',
  'Kurgun Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",'+
      '"Favored Region (Kaladruns)",' +
      '"Favored Region (Surface Kaladruns)",' +
      'Darkvision,"Double Urutuk Training","Dwarf Enmity",' +
      '"Favored Weapon (Axes/Hammers)","Natural Armor","Natural Mountaineer",' +
      '"Resist Poison","Resist Spells",Slow,Steady,Stoneworker '+
    'Languages="Clan Dwarven","Old Dwarven"',
  'Nomadic Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Alert Senses","Focused Rider",Fortunate,Graceful,"Innate Magic",' +
      '"Low-Light Vision","Resist Fear","Skilled Rider",Slow,Small,' +
      '"features.Bound To The Beast ? 1:Mounted Combat",' +
      '"features.Bound To The Spirits ? 1:Magecraft (Spiritual)" ' +
    'Selectables=' +
      '"Bound To The Beast","Bound To The Spirits" ' +
    'Languages=Colonial,Halfling',
  'Orc':
    'Features=' +
      '"Orc Ability Adjustment",' +
      '"Weapon Familiarity (Vardatch)",' +
      '"Favored Region (Northern Reaches)",' +
      'Darkvision,"Light Sensitivity","Natural Predator","Night Fighter",' +
      '"Orc Cold Resistance","Orc Enmity","Resist Spells","Tribal Frenzy" ' +
    'Languages="Black Tongue","Old Dwarven","High Elven",Orcish',
  'Plains Sarcosan':
    'Features=' +
      '"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      '"Favored Region (Southern Erenland)",' +
      '"Natural Horseman",Quick,"Sarcosan Extra Feat","Sarcosan Skill Bonus" ' +
    'Languages=Colonial,Erenlander',
  'Sea Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Net)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow/Guisarme/Ranseur/Tident)",' +
      '"Favored Region (Erethor)","Favored Region (Miraleen)",' +
      '"Bonus Spell Energy","Deep Lungs","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Sailor","Natural Swimmer",' +
      '"Resist Enchantment","Tree Climber" ' +
    'Languages="High Elven","Jungle Mouth"',
  'Snow Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Fighting Knife/Icewood Longbow)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Erethor)","Favored Region (Veradeen)",' +
      '"Bonus Spell Energy","Cold Fortitude","Double Knife Training",' +
      '"Fortitude Bonus","Innate Magic","Keen Senses","Low-Light Vision",' +
      '"Resist Enchantment","Tree Climber" ' +
    'Languages="High Elven",Orcish,"Patrol Sign"',
  'Urban Sarcosan':
    'Features=' +
      '"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      '"Favored Region (Urban)",' +
      'Quick,"Sarcosan Extra Feat","Sarcosan Skill Bonus",Social ' +
    'Languages=Colonial,Erenlander',
  'Wood Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow/Longsword/Short Sword)",' +
      '"Favored Region (Caraheen)","Favored Region (Erethor)",' +
      '"Bonus Spell Energy","Bonus Innate Spell","Innate Magic","Keen Senses",'+
      '"Low-Light Vision","Resist Enchantment","Tree Climber",' +
      '"Wood Elf Skill Bonus" ' +
    'Languages="High Elven"'
};
LastAge.SCHOOLS = {
  'Abjuration':'',
  'Conjuration':'',
  'Divination':'',
  'Enchantment':'',
  'Evocation':'',
  'Greater Conjuration':'',
  'Greater Evocation':'',
  'Illusion':'',
  'Necromancy':'',
  'Transmutation':''
};
LastAge.SHIELDS = Object.assign({}, SRD35.SHIELDS);
LastAge.SKILLS_ADDED = {
  'Knowledge (Local)':
    'Ability=intelligence Untrained=n ' +
    'Synergy="Knowledge (Shadow) (bureaucracy)"',
  'Knowledge (Local (Central Erenland))':'Ability=intelligence Untrained=n',
  'Knowledge (Nature)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Spirits)"',
  'Knowledge (Old Gods)':'Ability=intelligence Untrained=n',
  'Knowledge (Shadow)':'Ability=intelligence Untrained=n',
  'Knowledge (Spirits)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Nature)"',
  // Perform (Storytelling) for Sahi class
  'Perform (Storytelling)':'Ability=charisma Class=Defemder,Rogue,Wildlander',
  // Profession (Farmer) and Profession (Gardener) for Gardener Of Erethor class
  'Profession (Farmer)':'Ability=wisdom Untrained=n',
  'Profession (Gardener)':'Ability=wisdom Untrained=n',
  // Herbalist feat requires Profession (Herbalist)
  'Profession (Herbalist)':'Ability=wisdom Untrained=n',
  // Gnomes are +1 Profession (Sailor)
  'Profession (Sailor)':'Ability=wisdom Untrained=n',
  // Profession (Soldier) available to Leader Of Men Fighters
  'Profession (Soldier)':'Ability=wisdom Untrained=n'
};
LastAge.SKILLS = Object.assign({}, SRD35.SKILLS, LastAge.SKILLS_ADDED);
for(var skill in LastAge.SKILLS) {
  LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
}
delete LastAge.SKILLS['Knowledge (Planes)'];
delete LastAge.SKILLS['Knowledge (Religion)'];
LastAge.SPELLS_ADDED = {

  'Charm Repair':
    'School=Transmutation ' +
    'Level=Ch3,Jack3 ' +
    'Description="Touched minor or lesser charm restored to use"',
  'Detect Astirax':
    'School=Divination ' +
    'Level=Ch1,Jack1 ' +
    'Description="R$RL\' quarter circle Info on astiraxes for $L10 min"',
  'Detect Outsider':
    'School=Divination ' +
    'Level=Sunderborn1 ' +
    'Description="R60\' cone info on outsiders for $L10 min"',
  'Disguise Ally':
    'School=Illusion ' +
    'Level=Ch2,Jack2 ' +
    'Description="Change touched appearance, +10 disguise for $L10 min (Will disbelieve)"',
  'Disguise Weapon':
    'School=Illusion ' +
    'Level=Ch1,Jack1 ' +
    'Description="$L touched weapons look benign for $L hr"',
  'Far Whisper':
    'School=Divination ' +
    'Level=Ch1,Jack1 ' +
    'Description="+4 checks to hear Whispering Wood w/in $L10 miles for $L min"',
  'Greenshield':
    'School=Illusion ' +
    'Level=Ch2,Jack2 ' +
    'Description="Touched surrounded by 30\' foliage sphere for $L hr"',
  'Halfling Burrow':
    'School=Transmutation ' +
    'Level=Ch3,Jack3 ' +
    'Description="Hidden hole holds $L small creatures for $L hr"',
  'Lifetrap':
    'School=Transmutation ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RM\' Undead in 50\' radius tangled for $L rd, 3d6 HP (Ref neg)"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RS Plants and animals in 30\' radius reveal creatures"',
  'Nexus Fuel':
    'School=Necromancy ' +
    'Level=Ch5 ' +
    'Description="Sacrifice boosts nexus recovery rate"',
  'Silver Blood':
    'School=Transmutation ' +
    'Level=Ch2,Jack2 ' +
    'Description="Caster\'s blood damages astiraxes for 1 hr"',
  'Silver Storm':
    'School=Transmutation ' +
    'Level=Ch4 ' +
    'Description="R$RS\' Targets in cone ${Lmin15}d4 HP silver needle (Ref half)"',
  'Silver Wind':
    'School=Conjuration ' +
    'Level=Ch3,Jack3 ' +
    'Description="R$RM\' Targets in 20\' circle d6/rd for $L rd (Will neg)"',
  'Stone Soup':
    'School=Transmutation ' +
    'Level=Ch1,Jack1 ' +
    'Description="Buried stone creates broth"',
  // Sorcery and Shadow
  'Arcane Impotence':
    'School=Abjuration ' +
    'Level=Ch3,Jack3 ' +
    'Description="R$RM\' Target Channeler must use $Ldiv2 spell energy to cast w/in $L rd (Will $Ldiv2 rd)"',
  'Arcane Interference':
    'School=Abjuration ' +
    'Level=Ch5 ' +
    'Description="Spells require added $Ldiv2 energy to affect 10\' radius of touched for $L min (Will neg)"',
  'Assist':
    'School=Enchantment ' +
    'Level=Ch1,Jack1 ' +
    'Description="R$RS\' Targets in 30\' radius +2 skill checks for conc + 1 rd"',
  'Bestow Spell':
    'School=Evocation ' +
    'Level=Ch4 ' +
    'Description="Touched convey spell (Will neg)"',
  'Bleed Power':
    'School="Greater Evocation" ' +
    'Level=Ch2,Jack2 ' +
    'Description="Successful foe attack on self causes 1d6 HP to attacker for $L10 min"',
  'Boil Blood':
    'School=Transmutation ' +
    'Level=C3 ' +
    'Description="R$RS\' Target 1d8 HP for conc + 1 rd (Fort half)"',
  'Burial':
    'School=Transmutation ' +
    'Level=Ch1,Jack1 ' +
    'Description="R$RS\' Earth swallows target non-living, unattended object"',
  'Channel Might':
    'School=Evocation ' +
    'Level=Ch1,Jack1 ' +
    'Description="Touched next hit does maximum+$L HP w/in $L rd (Will neg)"',
  'Confer Power':
    'School=Transmutation ' +
    'Level=Ch2,Jack2 ' +
    'Description="Transfer spell energy to nearby casters for $L rd"',
  'Fell Forbiddance':
    'School=Abjuration ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RS\' Target $L25\' sq area impassible to undead for $L min (Will neg for intelligent)"',
  'Fey Fire':
    'School=Conjuration ' +
    'Level=Ch2,Jack2 ' +
    'Description="Touched point invisible 5\' radius fire that warms and heals 1 HP for $L hr"',
  'Fey Hearth':
    'School=Abjuration ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RS\' Creatures in 30\' radius of target fire +2 Will saves, heal 1.5 x level HP for as long as fire lasts"',
  'Greater Questing Bird':
    'School=Conjuration ' +
    'Level=Ch6 ' +
    'Description="Self temporarily learn spell up to level 6"',
  'Inspiration':
    'School=Enchantment ' +
    'Level=Ch1,Jack1 ' +
    'Description="Touched +10 one Craft check"',
  'Inspirational Might':
    'School=Enchantment ' +
    'Level=Ch5 ' +
    'Description="R$RS\' 4 allies in 30\' radius +2d10 HP, +2 attack, +1 Fortitude save for $Ldiv2 rd"',
  'Joyful Speech':
    'School=Enchantment ' +
    'Level=Ch1,Jack1 ' +
    'Description="R$RM\' Listeners in 30\' radius improve reaction, unshaken, +4 vs. fear for $L rd (Will neg)"',
  'Know The Name':
    'School=Divination ' +
    'Level=Ch1,Jack1 ' +
    'Description="Discover name(s) of touched (Will neg)"',
  'Lie':
    'School=Transmutation ' +
    'Level=Ch1,Jack1 ' +
    'Description="+10 Bluff on next lie"',
  'Magic Circle Against Shadow':
    'School=Abjuration ' +
    'Level=Ch5 ' +
    'Description="10\' radius from touched +2 AC, +2 saves, extra save vs. mental control, no contact vs. Izrador agents for $L10 min (Will neg)"',
  'Memorial':
    'School=Divination ' +
    'Level=Ch2,Jack2 ' +
    'Description="Touched $L10\' radius replays previous/next $L min to next passerby"',
  'Pacify':
    'School=Abjuration ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RS\' ${Math.floor(lvl/3) + 1} targets cannot attack for $Ldiv2 rd (Will neg)"',
  "Peasant's Rest":
    'School=Conjuration ' +
    'Level=Ch1,Jack1 ' +
    'Description="Touched gets 8 hrs rest from 4 hrs sleep"',
  'Phantom Edge':
    'School=Transmutation ' +
    'Level=Ch1,Jack1 ' +
    'Description="Touched weapon different type for $L min (Will neg)"',
  'Questing Bird':
    'School=Conjuration ' +
    'Level=Ch3,Jack3 ' +
    'Description="Self temporarily learn spell up to level 3"',
  "Scryer's Mark":
    'School=Divination ' +
    'Level=Ch2,Jack2 ' +
    'Description="Touched -4 Will vs. scrying (Will neg)"',
  'Speak With Fell':
    'School=Necromancy ' +
    'Level=C3 ' +
    'Description="R$RS\' Compel 3 correct answers from target fell w/in $L min (Will neg)"',
  'Weather':
    'School=Conjuration ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RM\' 60\' radius, 30\' high cylinder of rain or snow"',
  'Willful Stand':
    'School=Abjuration ' +
    'Level=Ch3,Jack3 ' +
    'Description="R$RM\' Target cannot attack self or enter threat space for conc (Will neg)"',
  'Withering Speech':
    'School=Enchantment ' +
    'Level=Ch2,Jack2 ' +
    'Description="R$RS\' Target 1 Wis, 1 Cha damage/min for conc"',
  'Woeful Speech':
    'School=Enchantment ' +
    'Level=Ch1,Jack1 ' +
    'Description="R$RM\' Listeners in 30\' radius shaken, -4 vs. fear for $L rd (Will neg)"',

  // Honor & Shadow
  'Form Of The Meruros':
    'School=Transmutation ' +
    'Level=Ch3 ' +
    'Description="Touched changes to Meruros-possessed wolf w/continuous <i>Hide From Undead</i> for $L10 min"',
  'Form Of The Tadulos':
    'School=Transmutation ' +
    'Level=Ch5 ' +
    'Description="Touched changes to Tadulos-possessed raven w/continuous <i>Death Ward</i> and <i>Freedom Of Movement</i> for $L10 min"',
  'Summon Ancestral Hero':
    'School=Conjuration ' +
    'Level=Ch7 ' +
    'Description=""',
  'Summon Ancestral Warrior':
    'School=Conjuration ' +
    'Level=Ch4 ' +
    'Description="R$RS\' Bargain with spirit for service"'
};
LastAge.SPELLS_LEVELS = {
  'Acid Arrow':'Ch2,Jack2',
  'Acid Fog':'Ch6',
  'Aid':'Chanceborn2,Charismatic2,Faithful2',
  'Air Walk':'Ch4',
  'Alarm':'Ch1,Jack1,Seer1',
  'Align Weapon':'Blessed2',
  'Alter Self':'Ch2,Jack2',
  'Analyze Dweomer':'Ch6',
  'Animal Growth':'Ch5',
  'Animal Messenger':'Ch2,Jack2,Naturefriend2',
  'Animal Shapes':'Ch8',
  'Animal Trance':'Ch2,Jack2',
  'Animate Dead':'Ch4',
  'Animate Objects':'Ch6',
  'Animate Plants':'Ch7',
  'Animate Rope':'Ch1,Jack1',
  'Antilife Shell':'Ch6',
  'Antimagic Field':'Ch6,Null6',
  'Antipathy':'Ch8',
  'Antiplant Shell':'Ch4',
  'Arcane Eye':'Ch4,Seer4',
  'Arcane Lock':'Ch2,Jack2',
  'Arcane Sight':'Ch3,Jack3',
  'Astral Projection':'Ch9',
  'Atonement':'Ch5',
  'Augury':'Seer2',
  'Awaken':'Ch5',
  'Baleful Polymorph':'Ch5',
  'Bane':'Shadowed1',
  'Banishment':'Ch7',
  'Barkskin':'Ch2,Jack2',
  'Bear\'s Endurance':'Beast2,Ch2,Jack2',
  'Bestow Curse':'Ch4',
  'Binding':'Ch8',
  'Black Tentacles':'Ch4',
  'Bless Weapon':'Faithful1',
  'Bless':'Blessed1,Faithful1',
  'Blight':'Ch4',
  'Blindness/Deafness':'Ch2,Jack2',
  'Blur':'Ch2,Jack2,Seaborn2,Shadow2',
  'Break Enchantment':'Ch5',
  'Bull\'s Strength':'Beast2,Ch2,Jack2',
  'Burning Hands':'Ch1,Jack1',
  'Call Lightning':'Ch3,Jack3,Naturefriend3',
  'Call Lightning Storm':'Ch5',
  'Calm Animals':'Ch1,Jack1,Naturefriend1',
  'Cat\'s Grace':'Beast2,Ch2,Jack2',
  'Cause Fear':'Ch1,Jack1',
  'Chain Lightning':'Ch6',
  'Changestaff':'Ch7',
  'Charm Animal':'Ch1,Jack1,Warg1',
  'Charm Monster':'Ch4,Charismatic4',
  'Charm Person':'Ch1,Charismatic1,Jack1',
  'Chill Metal':'Ch2,Jack2',
  'Chill Touch':'Ch1,Jack1',
  'Circle Of Death':'Ch6',
  'Clairaudience/Clairvoyance':'Ch3,Jack3,Seer3',
  'Clenched Fist':'Ch8',
  'Clone':'Ch8',
  'Cloudkill':'Ch5',
  'Color Spray':'Ch1,Jack1',
  'Command Plants':'Ch4,Naturefriend4',
  'Command Undead':'Ch2,Jack2',
  'Commune With Nature':'Ch5,Naturefriend5',
  'Commune':'Seer5',
  'Comprehend Languages':'Ch1,Jack1,Speaker1',
  'Cone Of Cold':'Ch5',
  'Confusion':'Ch4',
  'Consecrate':'Faithful2',
  'Contact Other Plane':'Ch5',
  'Contagion':'Ch3,Jack3',
  'Contingency':'Ch6',
  'Continual Flame':'Ch2,Jack2',
  'Control Plants':'Ch8',
  'Control Undead':'Ch7',
  'Control Water':'Ch4',
  'Control Weather':'Ch7',
  'Control Winds':'Ch5',
  'Create Greater Undead':'Ch8',
  'Create Undead':'Ch6',
  'Create Water':'Ch0,Jack0',
  'Creeping Doom':'Ch7',
  'Crushing Despair':'Ch4',
  'Crushing Hand':'Ch9',
  'Cure Critical Wounds':'Ch4,Healer4',
  'Cure Light Wounds':'Ch1,Healer1,Jack1',
  'Cure Minor Wounds':'Ch0,Jack0',
  'Cure Moderate Wounds':'Ch2,Healer2,Jack2',
  'Cure Serious Wounds':'Ch3,Healer3,Jack3',
  'Dancing Lights':'Ch0,Jack0',
  'Darkness':'Ch2,Jack2',
  'Darkvision':'Ch2,Jack2',
  'Daylight':'Ch3,Faithful3,Jack3',
  'Daze':'Ch0,Jack0',
  'Daze Monster':'Ch2,Charismatic2,Jack2',
  'Death Knell':'Death2,Shadowed2',
  'Death Ward':'Ch5',
  'Deep Slumber':'Ch3,Feyblooded3,Jack3',
  'Delay Poison':'Ch2,Jack2',
  'Delayed Blast Fireball':'Ch7',
  'Demand':'Ch8',
  'Detect Animals Or Plants':'Ch1,Jack1',
  'Detect Chaos':'Ch2,Jack2',
  'Detect Evil':'Ch2,Guardian2,Jack2,Shadowed2',
  'Detect Good':'Ch2,Jack2,Shadowed2',
  'Detect Law':'Ch2,Jack2',
  'Detect Magic':'Ch0,Jack0',
  'Detect Poison':'Ch0,Jack0',
  'Detect Scrying':'Ch4',
  'Detect Secret Doors':'Ch1,Jack1',
  'Detect Snares And Pits':'Ch1,Jack1',
  'Detect Thoughts':'Ch2,Jack2',
  'Detect Undead':'Ch1,Fellhunter1,Jack1',
  'Dimensional Anchor':'Ch4',
  'Diminish Plants':'Ch3,Jack3',
  'Discern Location':'Ch8',
  'Disguise Self':'Ch1,Feyblooded1,Jack1',
  'Disintegrate':'Ch6',
  'Dismissal':'Ch5',
  'Dispel Evil':'Blessed5,Faithful5',
  'Dispel Magic':'Ch3,Jack3,Null3',
  'Displacement':'Ch3,Jack3,Seaborn3,Shadow3',
  'Disrupt Undead':'Ch0,Jack0',
  'Divination':'Seer4',
  'Divine Favor':'Faithful1',
  'Dominate Animal':'Ch3,Jack3,Naturefriend3',
  'Dominate Monster':'Ch9',
  'Dominate Person':'Ch5',
  'Dream':'Ch5',
  'Eagle\'s Splendor':'Ch2,Jack2',
  'Earthquake':'Ch8,Earthbonded8',
  'Elemental Swarm':'Ch9',
  'Endure Elements':'Ch1,Jack1,Mountainborn1',
  'Energy Drain':'Ch9',
  'Enervation':'Ch4',
  'Enlarge Person':'Ch1,Jack1',
  'Entangle':'Ch1,Jack1,Naturefriend1',
  'Erase':'Ch1,Jack1',
  'Expeditious Retreat':'Ch1,Jack1,Shadow1',
  'Explosive Runes':'Ch3,Jack3',
  'Eyebite':'Ch6',
  'Fabricate':'Ch5',
  'Faerie Fire':'Ch1,Jack1',
  'False Life':'Ch2,Jack2',
  'False Vision':'Ch5,Feyblooded5',
  'Fear':'Ch4',
  'Feather Fall':'Ch1,Jack1',
  'Feeblemind':'Ch5',
  'Find The Path':'Ch6,Seer6',
  'Finger Of Death':'Ch7',
  'Fire Seeds':'Ch6',
  'Fire Shield':'Ch4',
  'Fire Storm':'Ch7',
  'Fire Trap':'Ch4',
  'Fireball':'Ch3,Jack3',
  'Flame Arrow':'Ch3,Jack3',
  'Flame Blade':'Ch2,Jack2',
  'Flame Strike':'Ch4',
  'Flaming Sphere':'Ch2,Jack2',
  'Flare':'Ch0,Jack0',
  'Flesh To Stone':'Ch6',
  'Floating Disk':'Ch1,Jack1',
  'Fly':'Ch3,Jack3',
  'Fog Cloud':'Ch2,Jack2,Seaborn2',
  'Forcecage':'Ch7',
  'Forceful Hand':'Ch6',
  'Foresight':'Ch9',
  'Fox\'s Cunning':'Ch2,Jack2',
  'Freedom Of Movement':'Beast4,Ch4',
  'Freedom':'Ch9',
  'Freezing Sphere':'Ch6',
  'Gaseous Form':'Ch3,Jack3',
  'Gate':'Ch9',
  'Geas/Quest':'Ch6',
  'Gentle Repose':'Ch3,Jack3',
  'Ghost Sound':'Ch0,Jack0',
  'Ghoul Touch':'Ch2,Jack2',
  'Giant Vermin':'Ch4',
  'Glibness':'Ch3,Feyblooded3,Jack3',
  'Glitterdust':'Ch2,Jack2',
  'Globe Of Invulnerability':'Ch6',
  'Good Hope':'Ch3,Jack3',
  'Goodberry':'Ch1,Jack1',
  'Grasping Hand':'Ch7',
  'Grease':'Ch1,Jack1',
  'Greater Arcane Sight':'Ch7',
  'Greater Dispel Magic':'Ch6,Null6',
  'Greater Heroism':'Ch6,Charismatic6',
  'Greater Invisibility':'Ch4',
  'Greater Magic Fang':'Beast3,Ch3,Jack3',
  'Greater Magic Weapon':'Ch3,Jack3',
  'Greater Planar Binding':'Ch8',
  'Greater Prying Eyes':'Ch8',
  'Greater Restoration':'Ch7',
  'Greater Scrying':'Ch7',
  'Greater Shadow Conjuration':'Ch7',
  'Greater Shadow Evocation':'Ch8',
  'Greater Shout':'Ch8,Speaker8',
  'Guards And Wards':'Ch6',
  'Guidance':'Ch0,Jack0',
  'Gust Of Wind':'Ch2,Jack2,Naturefriend2',
  'Hallow':'Ch5',
  'Hallucinatory Terrain':'Ch4',
  'Halt Undead':'Ch3,Jack3',
  'Haste':'Ch3,Jack3',
  'Heal':'Ch7,Healer7',
  'Heat Metal':'Ch2,Jack2',
  'Heroes\' Feast':'Ch6',
  'Heroism':'Ch3,Charismatic3,Jack3',
  'Hide From Animals':'Ch1,Jack1',
  'Hideous Laughter':'Ch2,Jack2',
  'Hold Animal':'Ch2,Jack2',
  'Hold Monster':'Ch5',
  'Hold Person':'Ch3,Jack3',
  'Hold Portal':'Ch1,Earthbonded1,Jack1',
  'Holy Aura':'Blessed8,Faithful8',
  'Holy Smite':'Faithful4',
  'Horrid Wilting':'Ch8',
  'Hypnotic Pattern':'Ch2,Jack2',
  'Hypnotism':'Ch1,Charismatic1,Jack1',
  'Ice Storm':'Ch4,Naturefriend4',
  'Identify':'Ch1,Jack1',
  'Illusory Script':'Ch3,Jack3',
  'Illusory Wall':'Ch4',
  'Imprisonment':'Ch9',
  'Incendiary Cloud':'Ch8',
  'Insanity':'Ch7',
  'Insect Plague':'Ch5',
  'Interposing Hand':'Ch5',
  'Invisibility':'Ch2,Feyblooded2,Jack2',
  'Invisibility Sphere':'Ch3,Jack3',
  'Iron Body':'Ch8',
  'Ironwood':'Ch6',
  'Irresistible Dance':'Ch8',
  'Jump':'Ch1,Jack1',
  'Keen Edge':'Ch3,Jack3',
  'Knock':'Ch2,Jack2',
  'Know Direction':'Ch0,Jack0',
  'Legend Lore':'Ch6,Seer6',
  'Lesser Confusion':'Ch1,Jack1',
  'Lesser Geas':'Ch4',
  'Lesser Globe Of Invulnerability':'Ch4',
  'Lesser Planar Binding':'Ch5',
  'Lesser Restoration':'Ch2,Healer2,Jack2',
  'Levitate':'Ch2,Jack2',
  'Light':'Ch0,Jack0',
  'Lightning Bolt':'Ch3,Jack3',
  'Liveoak':'Ch6',
  'Locate Creature':'Ch4,Seer4',
  'Locate Object':'Ch2,Jack2,Seer2',
  'Lullaby':'Ch0,Jack0',
  'Mage Armor':'Ch1,Jack1',
  'Mage Hand':'Ch0,Jack0',
  'Mage\'s Disjunction':'Ch9',
  'Mage\'s Faithful Hound':'Ch5',
  'Mage\'s Lucubration':'Ch6',
  'Mage\'s Private Sanctum':'Ch5',
  'Mage\'s Sword':'Ch7',
  'Magic Aura':'Ch1,Feyblooded1,Jack1',
  'Magic Circle Against Chaos':'Ch3,Jack3',
  'Magic Circle Against Evil':'Blessed3,Ch3,Faithful3,Jack3',
  'Magic Circle Against Good':'Ch3,Jack3',
  'Magic Circle Against Law':'Ch3,Jack3',
  'Magic Fang':'Beast1,Ch1,Jack1',
  'Magic Jar':'Ch5',
  'Magic Missile':'Ch1,Jack1',
  'Magic Mouth':'Ch2,Jack2',
  'Magic Stone':'Ch1,Jack1',
  'Magic Weapon':'Ch1,Jack1',
  'Major Creation':'Ch5',
  'Major Image':'Ch3,Jack3',
  'Make Whole':'Earthbonded2',
  'Mass Bear\'s Endurance':'Ch6',
  'Mass Bull\'s Strength':'Ch6',
  'Mass Cat\'s Grace':'Ch6',
  'Mass Charm Monster':'Ch8',
  'Mass Cure Critical Wounds':'Ch8',
  'Mass Cure Light Wounds':'Blessed5,Ch5,Healer5',
  'Mass Cure Moderate Wounds':'Ch6',
  'Mass Cure Serious Wounds':'Ch7',
  'Mass Eagle\'s Splendor':'Ch6',
  'Mass Enlarge Person':'Ch4',
  'Mass Fox\'s Cunning':'Ch6',
  'Mass Hold Monster':'Ch9',
  'Mass Hold Person':'Ch7',
  'Mass Invisibility':'Ch7',
  'Mass Owl\'s Wisdom':'Ch6',
  'Mass Reduce Person':'Ch4',
  'Mass Suggestion':'Ch6',
  'Meld Into Stone':'Ch3,Earthbonded3,Jack3,Mountainborn3',
  'Mending':'Ch0,Jack0',
  'Message':'Ch0,Jack0',
  'Meteor Swarm':'Ch9',
  'Mind Blank':'Ch8',
  'Mind Fog':'Ch5',
  'Minor Creation':'Ch4',
  'Minor Image':'Ch2,Jack2',
  'Mirage Arcana':'Ch5',
  'Mirror Image':'Ch2,Jack2',
  'Misdirection':'Ch2,Jack2',
  'Mislead':'Ch6,Feyblooded6',
  'Mnemonic Enhancer':'Ch4',
  'Modify Memory':'Ch4',
  'Moment Of Prescience':'Ch8',
  'Mount':'Ch1,Jack1',
  'Move Earth':'Ch6,Earthbonded6',
  'Neutralize Poison':'Ch3,Healer3,Jack3',
  'Nightmare':'Ch5',
  'Nondetection':'Ch3,Feyblooded3,Jack3',
  'Obscure Object':'Ch2,Jack2',
  'Obscuring Mist':'Ch1,Jack1,Naturefriend1',
  'Open/Close':'Ch0,Jack0',
  'Overland Flight':'Ch5',
  'Owl\'s Wisdom':'Ch2,Jack2',
  'Pass Without Trace':'Ch1,Jack1,Mountainborn1',
  'Passwall':'Ch5',
  'Permanent Image':'Ch6',
  'Persistent Image':'Ch5',
  'Phantasmal Killer':'Ch4',
  'Phantom Steed':'Ch3,Jack3',
  'Phantom Trap':'Ch2,Jack2',
  'Planar Binding':'Ch6',
  'Plant Growth':'Ch3,Jack3',
  'Poison':'Ch3,Jack3',
  'Polar Ray':'Ch8',
  'Polymorph':'Ch4',
  'Polymorph Any Object':'Ch8',
  'Power Word Blind':'Ch7',
  'Power Word Kill':'Ch9',
  'Power Word Stun':'Ch8',
  'Prayer':'Chanceborn3,Faithful3',
  'Prestidigitation':'Ch0',
  'Prismatic Sphere':'Ch9',
  'Prismatic Spray':'Ch7',
  'Prismatic Wall':'Ch8',
  'Produce Flame':'Ch1,Jack1',
  'Programmed Image':'Ch6',
  'Project Image':'Ch7',
  'Protection From Arrows':'Ch2,Jack2',
  'Protection From Chaos':'Ch1,Jack1',
  'Protection From Energy':'Ch3,Jack3',
  'Protection From Evil':'Blessed1,Ch1,Faithful1,Jack1',
  'Protection From Good':'Ch1,Jack1',
  'Protection From Law':'Ch1,Jack1',
  'Protection From Spells':'Ch8',
  'Prying Eyes':'Ch5,Seer5',
  'Pyrotechnics':'Ch2,Jack2',
  'Quench':'Ch3',
  'Rage':'Ch3,Jack3',
  'Rainbow Pattern':'Ch4,Feyblooded4',
  'Raise Dead':'Healer5',
  'Ray Of Enfeeblement':'Ch1,Jack1',
  'Ray Of Exhaustion':'Ch3,Jack3',
  'Ray Of Frost':'Ch0,Jack0',
  'Read Magic':'Ch0,Jack0',
  'Reduce Animal':'Ch2,Jack2',
  'Reduce Person':'Ch1,Jack1',
  'Regenerate':'Ch9,Healer9',
  'Reincarnate':'Ch4',
  'Remove Blindness/Deafness':'Healer3',
  'Remove Curse':'Ch4',
  'Remove Disease':'Ch3,Healer3,Jack3',
  'Remove Fear':'Ch1,Charismatic1,Jack1',
  'Repel Metal Or Stone':'Ch8',
  'Repel Vermin':'Ch4',
  'Repel Wood':'Ch6',
  'Repulsion':'Ch6',
  'Resilient Sphere':'Ch4',
  'Resist Energy':'Ch2,Jack2',
  'Resistance':'Ch0,Chanceborn0,Jack0',
  'Restoration':'Ch4,Healer4',
  'Reverse Gravity':'Ch7',
  'Rusting Grasp':'Ch4',
  'Scare':'Ch2,Jack2',
  'Scintillating Pattern':'Ch8',
  'Scorching Ray':'Ch2,Jack2',
  'Screen':'Ch8',
  'Scrying':'Ch4,Seer4',
  'Sculpt Sound':'Ch3,Jack3',
  'Secret Chest':'Ch5',
  'Secret Page':'Ch3,Jack3',
  'Secure Shelter':'Ch4',
  'See Invisibility':'Ch2,Jack2',
  'Seeming':'Ch5,Feyblooded5',
  'Sending':'Ch5',
  'Sepia Snake Sigil':'Ch3,Jack3',
  'Sequester':'Ch7',
  'Shades':'Ch9',
  'Shadow Conjuration':'Ch4',
  'Shadow Evocation':'Ch5',
  'Shambler':'Ch9',
  'Shapechange':'Ch9',
  'Shatter':'Ch2,Jack2',
  'Shield':'Ch1,Jack1',
  'Shillelagh':'Ch1,Jack1',
  'Shocking Grasp':'Ch1,Jack1',
  'Shout':'Ch4,Speaker4',
  'Shrink Item':'Ch3,Jack3',
  'Silence':'Ch2,Jack2',
  'Silent Image':'Ch1,Jack1',
  'Simulacrum':'Ch7',
  'Sleep':'Ch1,Jack1',
  'Sleet Storm':'Ch3,Jack3,Naturefriend3',
  'Slow':'Ch3,Jack3',
  'Snare':'Ch3,Jack3',
  'Soften Earth And Stone':'Ch2,Earthbonded2,Jack2',
  'Solid Fog':'Ch4',
  'Song Of Discord':'Ch5',
  'Soul Bind':'Ch9',
  'Sound Burst':'Ch2,Jack2',
  'Speak With Animals':'Ch1,Jack1,Naturefriend1,Warg1',
  'Speak With Dead':'Seer3',
  'Speak With Plants':'Ch3,Jack3,Naturefriend3',
  'Spectral Hand':'Ch2,Jack2',
  'Spell Immunity':'Null4',
  'Spell Turning':'Ch7',
  'Spellstaff':'Ch6',
  'Spider Climb':'Ch2,Jack2',
  'Spike Growth':'Ch3,Jack3,Naturefriend3',
  'Spike Stones':'Ch4,Earthbonded4',
  'Statue':'Ch7',
  'Stinking Cloud':'Ch3,Jack3',
  'Stone Shape':'Ch4,Earthbonded4',
  'Stone Tell':'Ch6,Earthbonded6,Mountainborn6',
  'Stone To Flesh':'Ch6',
  'Stoneskin':'Ch4,Earthbonded4',
  'Storm Of Vengeance':'Ch9',
  'Suggestion':'Ch3,Charismatic3,Jack3',
  'Summon Instrument':'Ch0,Jack0',
  'Summon Monster I':'Ch1,Jack1,Shadowed1,Sunderborn1',
  'Summon Monster II':'Ch2,Jack2,Sunderborn2',
  'Summon Monster III':'Ch3,Jack3,Sunderborn3',
  'Summon Monster IV':'Ch4,Sunderborn4',
  'Summon Monster IX':'Ch9',
  'Summon Monster V':'Ch5,Sunderborn5',
  'Summon Monster VI':'Ch6,Sunderborn6',
  'Summon Monster VII':'Ch7',
  'Summon Monster VIII':'Ch8',
  'Summon Nature\'s Ally I':'Ch1,Jack1',
  'Summon Nature\'s Ally II':'Ch2,Jack2,Seaborn2',
  'Summon Nature\'s Ally III':'Ch3,Jack3,Seaborn3',
  'Summon Nature\'s Ally IV':'Ch4,Naturefriend4,Seaborn4',
  'Summon Nature\'s Ally IX':'Ch9',
  'Summon Nature\'s Ally V':'Ch5,Seaborn5',
  'Summon Nature\'s Ally VI':'Ch6,Seaborn6',
  'Summon Nature\'s Ally VII':'Ch7',
  'Summon Nature\'s Ally VIII':'Ch8',
  'Summon Swarm':'Ch2,Jack2',
  'Sunbeam':'Ch7',
  'Sunburst':'Ch8',
  'Symbol Of Death':'Ch8',
  'Symbol Of Fear':'Ch6',
  'Symbol Of Insanity':'Ch8',
  'Symbol Of Pain':'Ch5',
  'Symbol Of Persuasion':'Ch6',
  'Symbol Of Sleep':'Ch5',
  'Symbol Of Stunning':'Ch7',
  'Symbol Of Weakness':'Ch7',
  'Sympathetic Vibration':'Ch6',
  'Sympathy':'Ch8',
  'Telekinesis':'Ch5',
  'Telekinetic Sphere':'Ch8',
  'Telepathic Bond':'Ch5',
  'Temporal Stasis':'Ch8',
  'Time Stop':'Ch9',
  'Tiny Hut':'Ch3,Jack3',
  'Tongues':'Ch3,Jack3,Speaker3',
  'Touch Of Fatigue':'Ch0,Jack0',
  'Touch Of Idiocy':'Ch2,Jack2',
  'Transformation':'Ch6',
  'Transmute Metal To Wood':'Ch7',
  'Transmute Mud To Rock':'Ch5',
  'Transmute Rock To Mud':'Ch5,Earthbonded5',
  'Trap The Soul':'Ch8',
  'Tree Shape':'Ch2,Jack2',
  'True Seeing':'Ch6',
  'True Strike':'Ch1,Chanceborn1,Jack1',
  'Undeath To Death':'Ch6',
  'Undetectable Alignment':'Ch1,Jack1,Shadow1',
  'Unhallow':'Ch5',
  'Unseen Servant':'Ch1,Jack1',
  'Vampiric Touch':'Ch3,Jack3',
  'Veil':'Ch6',
  'Ventriloquism':'Ch1,Feyblooded1,Jack1',
  'Virtue':'Ch0,Jack0',
  'Vision':'Ch7,Seer7',
  'Wail Of The Banshee':'Ch9',
  'Wall Of Fire':'Ch4',
  'Wall Of Force':'Ch5',
  'Wall Of Ice':'Ch4',
  'Wall Of Iron':'Ch6',
  'Wall Of Stone':'Ch5',
  'Wall Of Thorns':'Ch5',
  'Warp Wood':'Ch2,Jack2',
  'Water Breathing':'Ch3,Jack3',
  'Water Walk':'Ch3,Jack3',
  'Waves Of Exhaustion':'Ch7',
  'Waves Of Fatigue':'Ch5',
  'Web':'Ch2,Jack2',
  'Weird':'Ch9',
  'Whirlwind':'Ch8',
  'Whispering Wind':'Ch2,Jack2,Speaker2',
  'Wind Walk':'Ch6',
  'Wind Wall':'Ch3,Jack3',
  'Wood Shape':'Ch2,Jack2,Naturefriend2',
  'Zone Of Silence':'Ch4'
};
LastAge.SPELLS_SCHOOLS = {
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
  'Prestidigtation':'Evocation',
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
  'Prestidigitation':'Evocation',
  'Ray Of Frost':'Conjuration',
  'Zone Of Silence':'Enchantment'
};
LastAge.SPELLS = Object.assign({}, LastAge.SPELLS_ADDED);
for(var s in SRD35.SPELLS) {
  var m = SRD35.SPELLS[s].match(/\b[BD][01]|\b(C|Death|Destruction|Evil|Magic|War)[0-9]/g);
  if(m == null && !(s in LastAge.SPELLS_LEVELS))
    continue;
  var spellAttrs = SRD35.SPELLS[s] + ' Level=';
  if(m == null)
    spellAttrs += LastAge.SPELLS_LEVELS[s];
  else if(s in LastAge.SPELLS_LEVELS)
    spellAttrs += LastAge.SPELLS_LEVELS[s] + ',' + m.join(',');
  else
    spellAttrs += m.join(',');
  if(s in LastAge.SPELLS_SCHOOLS)
    spellAttrs += ' School="' + LastAge.SPELLS_SCHOOLS[s] + '"';
  LastAge.SPELLS[s] = spellAttrs;
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
  'Sarcosan Lance':'Level=3 Category=2h Damage=d8 Crit=3 Range=20',
  'Sepi':'Level=3 Category=Li Damage=d6 Threat=18',
  // Shard Arrow ignored--Quilvyn doesn't list ammo
  'Staghorn':'Level=3 Category=1h Damage=d6',
  'Tack Whip':'Level=1 Category=Li Damage=d4',
  'Urutuk Hatchet':'Level=3 Category=1h Damage=d8 Crit=3 Range=20',
  'Vardatch':'Level=3 Category=1h Damage=d12',
  // Debris for Giantblooded heroic path
  'Debris':'Level=0 Category=R Damage=d10 Range=30'
};
LastAge.WEAPONS = Object.assign({}, SRD35.WEAPONS, LastAge.WEAPONS_ADDED);
// Overrides of SRD3.5 class features
LastAge.CLASS_FEATURES = {
  'Barbarian':
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,Listen,Profession,Ride,' +
      '"Speak Language",Survival,Swim',
  'Fighter':
    'SkillPoints=4 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,"Knowledge (Shadow)",' +
      'Profession,Ride,"Speak Language",Swim ' +
    'Selectables=' +
      '"features.Improviser==0/features.Leader Of Men==0/features.Survivor==0 ? 4:Adapter",' +
      '"features.Adapter==0/features.Leader Of Men==0/features.Survivor==0 ? 4:Improviser",' +
      '"features.Adapter==0/features.Improviser==0/features.Survivor==0 ? 4:Leader Of Men",' +
      '"features.Adapter==0/features.Improviser==0/features.Leader Of Men==0 ? 4:Survivor",' +
      '"features.Improviser ? 4:Improved Grapple",' +
      '"features.Improviser ? 4:Improved Unarmed Strike",' +
      '"features.Improviser ? 4:Improvised Weapon",' +
      '"features.Improviser ? 4:Stunning Fist",' +
      '"features.Leader Of Men ? 4:Iron Will",' +
      '"features.Leader Of Men ? 4:Leadership",' +
      '"features.Leader Of Men ? 4:Skill Focus (Diplomacy)",' +
      '"features.Leader Of Men ? 4:Skill Focus (Profession (Soldier))",' +
      '"features.Survivor ? 4:Combat Expertise",' +
      '"features.Survivor ? 4:Dodge",' +
      '"features.Survivor ? 4:Endurance"',
  'Rogue':
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,"Gather Information",'+
      'Hide,Intimidate,Jump,"Knowledge (Shadow)",Listen,"Move Silently",' +
      '"Open Lock",Perform,Profession,Search,"Sense Motive","Sleight Of Hand",'+
      '"Speak Language",Spot,Swim,Tumble,"Use Magic Device","Use Rope"'
};
LastAge.CLASSES = {
  'Barbarian':
    SRD35.CLASSES['Barbarian'] + ' ' + LastAge.CLASS_FEATURES['Barbarian'],
  'Charismatic Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","1:Bonus Spell Energy","1:Magecraft (Charismatic)",' +
      '"2:Bonus Spells","2:Channeler Spellcasting","2:Summon Familiar",' +
      '"3:Tradition Gift (Force Of Personality)","4:Channeler Bonus Feats" ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      '"Speak Language",Spellcraft,' +
      'Bluff,Diplomacy,"Gather Information",Intimidate,"Sense Motive" ' +
    'Selectables=' +
      '"3:Inspire Confidence","3:Inspire Fascination","3:Inspire Fury",' +
      '"features.Inspire Confidence ? 3:Improved Confidence",' +
      '"features.Inspire Fascination ? 3:Suggestion",' +
      '"features.Inspire Fury ? 3:Improved Fury",' +
      '"features.Improved Confidence ? 3:Greater Confidence",' +
      '"features.Suggestion ? 3:Mass Suggestion",' +
      '"features.Improved Fury ? 3:Greater Fury" ' +
    'CasterLevelArcane="levels.Charismatic Channeler" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Ch0:1=0',
  'Defender':
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Escape Artist","Handle Animal",Hide,Jump,' +
      '"Knowledge (Local)","Knowledge (Shadow)",Listen,"Move Silently",' +
      'Profession,Ride,"Sense Motive","Speak Language",Swim,Tumble ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Dart/Farmer\'s Rope/Handaxe/Inutek/Light Hammer/Light Pick/Quarterstaff/Sap/Sickle/Throwing Axe/Sling/Great Sling)",'+
      '"1:Armor Class Bonus","1:Improved Unarmed Strike","1:Masterful Strike",'+
      '"2:Defender Abilities","2:Defender Stunning Fist",' +
      '"3:Improved Grapple","4:Precise Strike",' +
      '"6:Incredible Speed Or Resilience" ' +
    'Selectables=' +
      '"2:Defensive Mastery","2:Dodge Training","2:Flurry Attack",' +
      '"2:Grappling Training","2:Offensive Training","2:Speed Training",' +
      '"features.Dodge Training ? 2:Cover Ally",' +
      '"features.Offensive Training ? 2:One With The Weapon",' +
      '"features.Speed Training ? 2:Rapid Strike",' +
      '"features.Grappling Training ? 2:Strike And Hold",' +
      '"features.Dodge Training/features.Offensive Training ? 2:Counterattack",' +
      '"features.Grappling Training/features.Offensive Training ? 2:Devastating Strike",' +
      '"features.Grappling Training/features.Speed Training ? 2:Furious Grapple",' +
      '"features.Dodge Training/features.Speed Training ? 2:Retaliatory Strike",' +
      '"features.Dodge Training/features.Grappling Training ? 2:Weapon Trap",' +
      '"6:Incredible Resilience","6:Incredible Speed"',
  'Fighter':SRD35.CLASSES['Fighter'] + ' ' + LastAge.CLASS_FEATURES['Fighter'],
  'Hermetic Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      '"Speak Language",Spellcraft,' +
      'Knowledge ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","1:Bonus Spell Energy",1:Literate,' +
      '"1:Magecraft (Hermetic)","2:Bonus Spells","2:Channeler Spellcasting",' +
      '"2:Summon Familiar","3:Tradition Gift (Lorebook)",' +
      '"4:Channeler Bonus Feats" ' +
    'Selectables=' +
      '"3:Foe Specialty","3:Knowledge Specialty","3:Quick Reference",' +
      '"3:Spell Specialty" ' +
    'CasterLevelArcane="levels.Hermetic Channeler" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Ch0:1=0',
  'Rogue':SRD35.CLASSES['Rogue'] + ' ' + LastAge.CLASS_FEATURES['Rogue'],
  'Spiritual Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      '"Speak Language",Spellcraft,' +
      'Diplomacy,"Knowledge (Nature)","Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","1:Bonus Spell Energy","1:Magecraft (Spiritual)",' +
      '"2:Bonus Spells","2:Channeler Spellcasting","2:Summon Familiar",' +
      '"3:Tradition Gift (Master Of Two Worlds)","4:Channeler Bonus Feats" ' +
    'Selectables=' +
      '"3:Confident Effect","3:Heightened Effect","3:Mastery Of Nature",' +
      '"3:Mastery Of Spirits","3:Mastery Of The Unnatural",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Powerful Effect",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Precise Effect",' +
      '"features.Precise Effect ? 3:Specific Effect",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Universal Effect" ' +
    'CasterLevelArcane="levels.Spiritual Channeler" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Ch0:1=0',
  'Wildlander':
    'HitDie=d8 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Craft,"Handle Animal",Heal,Hide,Jump,' +
      '"Knowledge (Geography)","Knowledge (Nature)",Listen,"Move Silently",' +
      'Profession,Ride,Search,"Speak Language",Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Track,"1:Wildlander Traits","3:Danger Sense","4:Hunter\'s Strike" ' +
    'Selectables=' +
      '1:Alertness,"1:Improved Initiative","1:Master Hunter",' +
      '"1:Quick Stride","1:Wild Empathy","1:Wildlander Skill Mastery",' +
      '"1:Wilderness Trapfinding","1:Woodland Stride",' +
      '"features.Wild Empathy ? 1:Animal Companion",' +
      '"features.Master Hunter ? 1:Hated Foe",' +
      '"features.Improved Initiative ? 1:Instinctive Response",' +
      '"features.Quick Stride ? 1:Overland Stride",' +
      '"features.Master Hunter ? 1:Sense Dark Magic",' +
      '"features.Woodland Stride ? 1:Trackless Step",' +
      '"features.Wilderness Trapfinding ? 1:Woodslore",' +
      '"features.Wildlander Skill Mastery/features.Trackless Step/skills.Hide ? 1:Camouflage",' +
      '"features.Instinctive Response/features.Quick Stride ? 1:Evasion",' +
      '"features.Improved Initiative/features.Sense Dark Magic ? 1:Hunted By The Shadow",' +
      '"features.Overland Stride/features.Woodland Stride ? 1:Improved Woodland Stride",' +
      '"features.Hated Foe/features.Wildlander Skill Mastery/skills.Spot ? 1:True Aim",'+
      '"features.Camouflage ? 1:Hide In Plain Sight",' +
      '"features.Evasion ? 1:Improved Evasion",' +
      '"features.Hunted By The Shadow ? 1:Slippery Mind"'
};
LastAge.NPC_CLASSES = {
  'Legate':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Shadow)","Knowledge (Spirits)",' +
      'Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Spontaneous Legate Spell","1:Temple Dependency","1:Turn Undead",' +
      '"3:Astirax Companion" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(LastAge.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 1:' + x + '"').join(',') + ' ' +
    'CasterLevelDivine=levels.Legate ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'C0:1=3;2=4;4=5;7=6,' +
      'C1:1=1;2=2;4=3;7=4;11=5,' +
      'C2:3=1;4=2;6=3;9=4;13=5,' +
      'C3:5=1;6=2;8=3;11=4;15=5,' +
      'C4:7=1;8=2;10=3;13=4;17=5,' +
      'C5:9=1;10=2;12=3;15=4;19=5,' +
      'C6:11=1;12=2;14=3;17=4,' +
      'C7:13=1;14=2;16=3;19=4,' +
      'C8:15=1;16=2;18=3;20=4,' +
      'C9:17=1;18=2;19=3;20=4,' +
      'Domain1:1=1,' +
      'Domain2:3=1,' +
      'Domain3:5=1,' +
      'Domain4:7=1,' +
      'Domain5:9=1,' +
      'Domain6:11=1,' +
      'Domain7:13=1,' +
      'Domain8:15=1,' +
      'Domain9:17=1',
  // Unclear whether any of the base rule NPC classes would apply in Midnight.
  // Certainly not the Adept class. Aristocrat, Commoner, Expert, and Warrior
  // might be applicable in certain contexts.
  'Aristocrat':SRD35.NPC_CLASSES['Aristocrat'],
  'Commoner':SRD35.NPC_CLASSES['Commoner'],
  'Expert':SRD35.NPC_CLASSES['Expert'],
  'Warrior':SRD35.NPC_CLASSES['Warrior']
};
LastAge.PRESTIGE_CLASSES = {
  'Ancestral Bladebearer':
    'Require=' +
      '"baseAttack >= 6","Sum \'features.Weapon Focus\' >= 1",' +
      '"Sum \'features.Weapon Specialization\' >= 1" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,Profession,Ride,' +
      '"Speak Language",Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Tower Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Unbreakable Blade","2:Advance Ancestral Blade",' +
      '"3:Ancestral Bladebearer Bonus Feats","3:Ancestral Watcher",' +
      '"4:Immovable Blade","5:Ancestral Advisor","7:Ancestral Guide",' +
      '"8:Unwavering Blade","9:Ancestral Protector",' +
      '"10:Awaken Ancestral Blade"',
  "Aradil's Eye":
    'Require=' +
      'features.Inconspicuous,"race == \'Wood Elf\'","skills.Bluff >= 8",' +
      '"skills.Disguise >= 5","skills.Gather Information >= 8",' +
      '"skills.Hide >= 8","skills.Move Silently >= 5",' +
      '"skills.Sense Motive >= 5","skills.Spot >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,Listen,"Move Silently",' +
      '"Open Lock",Profession,Search,"Sense Motive","Sleight Of Hand",' +
      '"Speak Language",Spot,Survival,Swim,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Alter Ego",1:Mindbond,"2:Spy Initiate","4:Closed Mind",5:Spy,' +
      '"6:Hide In Plain Sight","7:Slippery Mind",' +
      '"8:Undetectable Alignment","10:Master Spy"',
  'Avenging Knife':
    'Require=' +
     '"alignment !~ \'Evil\'","features.Improved Initiative",' +
     'features.Inconspicuous,"features.Sneak Attack","skills.Bluff >= 5",' +
     '"skills.Gather Information >= 5","skills.Hide >= 8",' +
     '"skills.Move Silently >= 8" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,"Decipher Script",Disguise,"Escape Artist",' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently","Open Lock",' +
      'Profession,Search,"Sense Motive","Speak Language",Spot,Swim,Tumble,' +
      '"Use Rope" ' +
    'Features=' +
      '"1:The Drop","2:Security Breach","3:Sneak Attack","4:Target Study",' +
      '"5:Fast Hands","6:Cover Story","7:Stunning Sneak Attack",' +
      '"8:Improved Coup De Grace","9:Still As Stone","10:Death Attack"',
  'Bane Of Legates':
    'Require=' +
      '"features.Iron Will","sumMagecraft >= 1",' +
      '"skills.Knowledge (Arcana) >= 13","skills.Knowledge (Shadow) >= 8",' +
      '"skills.Spellcraft >= 10","spellEnergy >= 10" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Concentration,Craft,Diplomacy,"Handle Animal",Heal,' +
      'Intimidate,Knowledge,Profession,"Sense Motive",Spellcraft,Survival ' +
    'Features=' +
      '"1:Improved Spellcasting","1:Resist Izrador\'s Will",' +
      '"2:Bane Of Legates Bonus Feats","3:See Astirax",' +
      '"4:Counter Izrador\'s Will","5:Bonus Spellcasting","6:Bind Astirax",' +
      '"8:Conceal Magic","10:Sundered Spirit"',
  'Druid':
    'Require=' +
      '"features.Magecraft (Spiritual)","sumSpellcastingFeats >= 1",' +
      '"features.Mastery Of Nature||features.Wild Empathy",' +
      '"skills.Knowledge (Nature) >= 8","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Geography)","Knowledge (Nature)","Knowledge (Spirits)",' +
      'Profession,"Speak Language",Spellcraft,Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Longbow/Shortbow/Quarterstaff)",' +
      '"1:Improved Spellcasting","1:Mastery Of Nature","1:Animal Companion",' +
      '2:Druidcraft,"2:Nature Sense","3:Commune With Nature",' +
      '"5:Find The Way","8:Venom Immunity"',
  'Elven Raider':
    'Require=' +
      '"baseAttack >= 5","features.Point-Blank Shot","features.Rapid Shot",' +
      '"features.Weapon Focus (Composite Longbow)||features.Weapon Focus (Longbow)",' +
      '"race =~ /Elf/","skills.Hide >= 8","skills.Move Silently >= 8",' +
      '"skills.Survival >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Craft,Heal,Hide,Intimidate,Jump,Listen,"Move Silently",' +
      'Profession,Ride,Search,"Speak Language",Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Martial)",' +
      '"1:Ranged Sneak Attack","2:Improved Sneak Attack Range",' +
      '"3:Meticulous Aim","4:Intimidating Shot","6:Leaf Reader",' +
      '"7:Disarming Shot","9:Close Combat Archery"',
  'Freerider':
    'Require=' +
      '"baseAttack >= 6","features.Mounted Combat","features.Ride-By Attack",' +
      '"features.Spirited Charge","race =~ /Erenlander|Sarcosan/",' +
      '"skills.Handle Animal >= 4","skills.Ride >= 8","skills.Survival >= 4" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,Diplomacy,"Handle Animal",Jump,Profession,Ride,' +
      '"Speak Language",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Horse Lord","1:Special Mount","2:Mounted Maneuver",' +
      '"3:Freerider Bonus Feats","4:Spur On","7:Devastating Mounted Assault",' +
      '"7:Improved Mounted Assault","10:Sweeping Strike" ' +
    'Selectables=' +
      '"2:Deft Dodging","2:Dismounting Cut","2:Erratic Attack",' +
      '"2:Hit And Run","2:Wheel About"',
  'Haunted One':
    'Require=' +
      '"sumMagecraft >= 1",' +
      '"features.Spellcasting (Divination)",' +
      '"features.Spellcasting (Necromancy)",' +
      '"skills.Knowledge (Arcana) >= 8","skills.Knowledge (Spirits) >= 10" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Improved Spellcasting",1:Seance,2:Spiritcraft,' +
      '"2:Spirit Manipulation","3:Ghost Sight","5:Spell Focus (Divination)",' +
      '"9:Spell Focus (Necromancy)"',
  'Insurgent Spy':
    'Require=' +
      'features.Inconspicuous,"skills.Bluff >= 8","skills.Diplomacy >= 5",' +
      '"skills.Gather Information >= 8","skills.Sense Motive >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,"Knowledge (Shadow)",' +
      'Listen,"Move Silently","Open Lock",Perform,Profession,Search,' +
      '"Sense Motive","Sleight Of Hand","Speak Language",Spot,Swim,Tumble,' +
      '"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Conceal Magic Aura","1:Shadow Contacts","2:Shadow Speak",' +
      '"3:Sneak Attack"',
  'Smuggler':
    'Require=' +
      '"features.Friendly Agent","skills.Bluff >= 8","skills.Forgery >= 5",' +
      '"skills.Gather Information >= 8","skills.Hide >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently","Open Lock",' +
      'Perform,Profession,Search,"Sense Motive","Sleight Of Hand",Spot,' +
      'Swim,Tumble,"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Smuggler\'s Trade","2:Dominant Will","3:Mystifying Speech",' +
      '"4:Information Network","5:Disguise Contraband","10:Slippery Mind"',
  'Warrior Arcanist':
    'Require=' +
      '"baseAttack >= 4","sumMagecraft >= 1","sumSpellcastingFeats >= 1",' +
      '"Sum \'features.Weapon Focus\' >= 1",' +
      '"features.Weapon Proficiency (Martial)","skills.Spellcraft >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Intimidate,Jump,"Knowledge (Arcana)",' +
      'Profession,Ride,"Speak Language",Spellcraft,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Armored Casting","1:Channeled Combat","2:Improved Spellcasting",' +
      '"6:Melee Caster","10:Regenerative Strike"',
  'Whisper Adept':
    'Require=' +
      '"sumMagecraft >= 1","sumSpellcastingFeats >= 2",' +
      '"race =~ /Elf/","skills.Knowledge (Nature) >= 8",' +
      '"skills.Knowledge (Spirits) >= 10","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,Knowledge,Profession,' +
      '"Speak Language",Spellcraft,Survival ' +
    'Features=' +
      '"1:Improved Spellcasting","1:Whisper Sense","3:Fell Touch",' +
      '"5:Tree Meld","7:Strength Of The Wood","9:Whisper\'s Ward"',
  'Wizard':
    'Require=' +
      '"features.Magecraft (Hermetic)","sumSpellcastingFeats >= 2",' +
      '"skills.Knowledge (Arcana) >= 10","skills.Spellcraft >= 10",' +
      '"sumItemCreationFeats >= 1","sumMetamagicFeats >= 1" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Improved Spellcasting",1:Wizardcraft,"2:Efficient Study",' +
      '"3:Wizard Bonus Feats","4:Bonus Spellcasting"',
  'Wogren Rider':
    'Require=' +
      '"features.Mounted Archery","features.Mounted Combat",' +
      '"race =~ /Halfling/","skills.Ride >= 8","skills.Survival >= 4" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Heal,Hide,Jump,Listen,"Move Silently",' +
      'Profession,Ride,"Speak Language",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Weapon Proficiency (Martial)",' +
      '"1:Joint Attack","1:Special Mount","2:Mounted Ability","3:Speed Mount",'+
      '"5:Mounted Hide","7:Wogren Dodge","9:Wogren\'s Sight" ' +
    'Selectables=' +
      '"2:Improved Mounted Archery","2:Improved Mounted Combat",' +
      '"2:Improved Ride-By Attack","2:Improved Spirited Charge",' +
      '"2:Improved Trample","2:Ride-By Attack","2:Spirited Charge",2:Trample',
  // Destiny & Shadow
  'Pale Legate':
    'Require="skills.Knowledge (Shadow) >= 8","alignment !~ \'Evil\'" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Concentration,Craft,Diplomacy,Disguise,"Handle Animal",Heal,' +
      'Hide,Intimidate,"Knowledge (Arcana)","Knowledge (Shadow)",' +
      '"Knowledge (Spirits)",Profession,"Sense Motive","Speak Language",' +
      'Spellcraft,Survival ' +
    'Features=' +
      '"1:Black Rot","1:Pale Heart","2:Shadow Speak",' +
      '"3:Deny Izrador\'s Power","3:Sense Dark Magic","6:Detect Evil"',
  'Warden Of Erenland':
    'Require=' +
      '"race =~ \'Dorn|Erenlander|Sarcosan\'",' +
      '"baseAttack >= 6",' +
      'features.Endurance,"features.Iron Will","features.Friendly Agent",' +
      '"skills.Diplomacy >= 4","skills.Knowledge (History) >= 2","skills.Survival >= 4" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Bluff,Climb,Diplomacy,Disguise,"Gather Information","Handle Animal",' +
      'Heal,Hide,Intimidate,Jump,"Knowledge (History)",' +
      '"Knowledge (Local (Central Erenland))","Knowledge (Shadow)",Listen,' +
      '"Move Silently","Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Mediator,"1:Spirit Speaker","1:Warden\'s Vows",' +
      '"2:Aryth\'s Blessing","3:Dreams Of The Land (Commune)",' +
      '"4:For The King","6:Dreams Of The Land (Dream)",' +
      '"9:Dreams Of The Land (Foresight)"',
  // Hammer & Shadow
  'Ancestral Foe':
    'Require=' +
      '"race =~ \'Dwarf|Orc\'","baseAttack >= 6",' +
      '"skills.Knowledge (Dungeoneering) >= 6",' +
      'features.Diehard,"features.Master Hunter",' +
      '"languages.Clan Dwarven",languages.Orcish ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Heal,Hide,Intimidate,Jump,' +
      '"Knowledge (Dungeoneering)","Knowledge (Geography)",' +
      '"Knowledge (Local)",Listen,"Move Silently",Search,"Speak Language",' +
      'Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Know Thy Enemy","1:Primal Foe","1:Savvy Hunter","2:Tunnel Fighting",'+
      '"3:Hunter\'s Strike","5:Impervious Mind","8:Rage Of Vengeance"',
  'Dwarven Loremaster':
    'Require=' +
      '"race =~ \'Dwarf\'","Max \'skills.Craft\' >= 5",' +
      '"countKnowledgeSkillsGe5 >= 2","skills.Knowledge (History) >= 9",' +
      '"skills.Spellcraft >= 5",' +
      '"features.Magecraft (Charismatic) || features.Magecraft (Hermetic) || features.Magecraft (Spiritual)",' +
      '"features.Touched By Magic","sumItemCreationFeats >= 1",' +
      '"sumSpellcastingFeats >= 1" ' +
    'HitDie=d10 Attack=1/2 SkillPoints=6 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Concentration,Craft,Diplomacy,Heal,Knowledge,Profession,' +
      '"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Improved Spellcasting","1:Dwarven Literacy",' +
      '"1:Tradition Gift (Lorebook)","2:Recharge Nexus","2:Rune Magic",' +
      '"3:Dwarven Loremaster Bonus Feats"',
  // Honor & Shadow
  'Spirit Speaker':
    'Require=' +
      '"race == \'Dorn\'","baseAttack >= 5",languages.Norther,' +
      '"skills.Knowledge (Spirits) >= 5",' +
      '"Sum \'spells.*3 Grea\' >= 1",' +
      '"features.Spellcasting (Conjuration)",' +
      '"features.Spellcasting (Greater Conjuration)",' +
      '"features.Magecraft (Spiritual)",' +
      '"features.Armor Proficiency (Light) || features.Shield Proficiency" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Diplomacy,Heal,Intimidate,Jump,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,' +
      '"Sense Motive","Speak Language",Spellcraft,Survival,Swim '+
    'Features=' +
      '"1:Ancestral Spellcasting","1:Summon Ancestor","2:Armored Casting",' +
      '"2:Augment Summoning","3:Ancestral Recall",' +
      '"Spirit Speaker Bonus Feats","4:Call Tadulos","5:Ancestral Warnings",' +
      '"5:Gaze Of The Meruros","7:Ancestral Favor","8:Gift Of The Vigdir",' +
      '"9:Call Meruros","10:Breath Of The Vigdir"',
  // Sorcery & Shadow
  'Collaborator':
    'Require=' +
      '"skills.Bluff >= 8","skills.Diplomacy >= 8","skills.Sense Motive >= 8",'+
      '"features.Deceitful || features.Negotiator","sumMagecraft >= 1",' +
      '"alignment == \'Chaotic Neutral\' || alignment == \'Neutral\'",' +
      '"languages.Black Tongue" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // Knowledge (Religion) => Knowledge (Shadow)
      'Appraise,Bluff,Concentration,Diplomacy,Disguise,Forgery,' +
      '"Gather Information",Hide,"Knowledge (History)","Knowledge (Shadow)",'+
      'Listen,"Move Silently",Perform,Profession,Search,"Sleight Of Hand",' +
      'Spellcraft,Spot ' +
    'Features=' +
      '"1:Art Of Magic","1:Improved Spellcasting","1:Obsidian Tongue","2:Imp",'+
      '"2:Immunity To Fear","4:Dark Invitation","6:Shadow-Tapping",' +
      '"8:Savvy Host","10:Respect" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(LastAge.PATHS).filter(x => x.match(/Domain$/)).map(x => '"6:' + x + '"').join(',') + ' ' +
    'SpellSlots=' +
      'Domain1:1=1,' +
      'Domain2:3=1,' +
      'Domain3:5=1,' +
      'Domain4:7=1,' +
      'Domain5:9=1 ',
  'Gardener Of Erethor':
    'Require=' +
      '"skills.Profession (Gardener) || skills.Profession (Herbalist) || skills.Profession (Farmer)",' +
      '"features.Magecraft (Charismatic) || features.Magecraft (Hermetic) || features.Magecraft (Spiritual)",' +
      '"features.Spellcasting (Abjuration)",' +
      '"alignment =~ \'Lawful (Good|Neutral)|Neutral Good|^Neutral\'",' +
      '"race =~ \'Elf\'" ' +
    'HitDie=d6 Attack=1/2 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Diplomacy,"Handle Animal",Heal,' +
      '"Knowledge (Engineering)","Knowledge (Nature)",Listen,Profession,Ride,' +
      'Spellcraft,Spot,Survival,Swim ' +
    'Features=' +
      '"1:Art Of Magic",1:Homemaker,"1:Improved Spellcasting",' +
      '"2:Gardener Of Erethor Bonus Spells","2:Spiritual Link",' +
      '"3:Gardener Of Erethor Bonus Feats",6:Woodsman,"9:Chosen Ground"',
  'Snow Witch':
    'Require=' +
      '"skills.Knowledge (Arcana) >= 4","skills.Knowledge (Nature) >= 4",' +
      '"skills.Spellcraft >= 4", "skills.Survival >= 4",' +
      '"features.Endurance","sumMagecraft >= 1","sumSpellcastingFeats >= 1",' +
      '"alignment !~ \'Evil\'" ' +
    'HitDie=d8 Attack=1/2 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Heal,Hide,"Knowledge (Arcana)",' +
      '"Knowledge (Nature)",Listen,"Move Silently",Profession,Search,' +
      'Spellcraft,Spot,Survival,Swim ' +
    'Features=' +
      '"1:Art Of Magic","1:Improved Spellcasting","1:Way Of The Snow Witch",' +
      '"2:Cold Resistance","3:Like Snowfall","4:Cloak Of Snow",' +
      '"6:House Of Summer","7:Control Weather","9:Aura Of Winter",' +
      '"10:Cold Immunity"',
  'Syphon':
    'Require=' +
      '"baseAttack >= 8","skills.Spellcraft >= 8",' +
      '"Sum \'features.Improved Critical\' > 0",' +
      '"features.Weapon Proficiency (Martial) || Sum \'features.Martial Weapon Proficiency\' > 0 || Sum \'features.Exotic Weapon Proficiency\' > 0" ' +
    'HitDie=d10 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Intimidate,Jump,Profession,Ride,Spellcraft,' +
      'Swim ' +
    'Features=' +
      '"1:Art Of Magic","1:Death Knell","1:Deathwatch","2:Ignore Armor",' +
      '"2:Blood-Syphoning","4:Spell-Syphoning","5:Blood Talisman"',
  // Star & Shadow
  'Pellurian Blade Dancer':
    'Require=' +
      '"race =~ \'Sarcosan\'",' +
      '"skills.Perform (Dance) >= 3","skills.Tumble >= 5",' +
      '"features.Clever Fighting","features.Combat Expertise","features.Weapon Finesse",' +
      '"features.Weapon Proficiency (Martial) || features.Weapon Proficiency (Falchion) || features.Weapon Proficiency (Greatsword)",' +
      '"features.Weapon Focus (Falchion) || features.Weapon Focus (Greatsword)",' +
      '"features.Weapon Specialization (Falchion) || features.Weapon Specialization (Greatsword)" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Escape Artist",Jump,Perform,Profession,' +
      'Ride,"Sense Motive",Swim,Tumble ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Martial)",' +
      '"1:Blade Dance","1:Fluid Defense","2:Blade Dancer Bonus Feats",' +
      '"2:Constant Waves",4:Evasion,"6:Crashing Waves","8:Uncanny Dodge",' +
      '"10:What Was Will Be Again"',
  'Sahi':
    'Require=' +
      '"race =~ \'Sarcosan\'","skills.Knowledge (Nature) >= 8",' +
      '"skills.Perform (Storytelling) >= 5","skills.Survival >= 5",' +
      '"features.Magecraft (Spiritual)",' +
      '"sumMetamagicFeats > 0 || sumSpellcastingFeats > 0",' +
      '"languages.Colonial","languages.Courier",' +
      '"casterLevels.Spellcasting >= 2" ' +
    'HitDie=d10 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script",Diplomacy,Heal,Knowledge,' +
      'Perform,Profession,"Sense Motive","Speak Language",Spellcraft,' +
      'Survival ' +
    'Features=' +
      '"1:Art Of Magic","1:Improved Spellcasting","1:Sahi Literacy",' +
      '"1:Parables Of The Sorshef","2:Vision Of The Night",' +
      '"2:Omen Of The Sorshef","3:Alchemy","3:Forgotten Knowledge",' +
      '"3:Tales Of The Sorshef (Heart)","4:Sahi Bonus Feats",' +
      '"4:Strength Of My Ancestors","5:Tales Of The Sorshef (Determination)",' +
      '"6:It Is Written In The Stars","7:Tales Of The Sorshef (Freedom)",' +
      '"8:Improved Vision Of The Night","9:Pride Of The Sorshef",' +
      '"9:Tales Of The Sorshef (Agony)","10:Master Of Fate",' +
      '"10:Master Of Tales"',
  'Vigilant Defender':
    'Require=' +
      '"skills.Hide >= 8","skills.Knowledge (Local) >= 5","skills.Spot >= 5",' +
      'features.Alertness,features.Dodge,' +
      '"features.Sneak Attack || selectableFeatures.Defender" ' +
    'HitDie=d10 Attack=1 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,Diplomacy,"Disable Device",Disguise,' +
      '"Escape Artist",Forgery,"Gather Information",Hide,Intimidate,Jump,' +
      '"Knowledge (Local)",Listen,"Move Silently","Open Lock",Profession,' +
      'Search,"Sense Motive","Sleight Of Hand",Spot,Swim,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"levels.Defender == 0 ? 1:Blade",' +
      '"levels.Defender > 0 ? 1:Fist",' +
      '"1:City Speak","2:Survival Of The Skilled","2:Uncanny Dodge",' +
      '"3:Urban Mobility","4:Cloaked In City Shadows","5:City Sight",' +
      '"5:Survival Of The Skilled","6:Improved Uncanny Dodge",' +
      '"8:City Is My Shield","10:City Stance" ' +
    'Selectables=' +
      '"3:Narrowswending","3:Roofjumping","3:Wallscaling"'
};

/* Defines rules related to character abilities. */
LastAge.abilityRules = function(rules) {
  LastAge.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
LastAge.aideRules = function(rules, companions, familiars) {

  LastAge.basePlugin.aideRules(rules, companions, familiars);

  // For the purpose of companion stat computation, define companionMasterLevel
  // in terms of the number of times the Animal Companion is selected
  rules.defineRule('companionMasterLevel',
    'featureNotes.animalCompanion', '=', 'source * 3 - 1'
  );

  // MN companion feature set and levels differ from base rules
  var features = [
    '1:Devotion', '2:Magical Beast', '3:Companion Evasion', '4:Improved Speed',
    '5:Empathic Link'
  ];
  QuilvynRules.featureListRules
    (rules, features, 'Animal Companion', 'featureNotes.animalCompanion', false);
  features = ['Link', 'Share Spells', 'Multiattack', 'Improved Evasion'];
  for(var i = 0; i < features.length; i++)
    // Disable
    rules.defineRule
      ('animalCompanionFeatures.' + features[i], 'companionMasterLevel', '=', 'null');

  // MN rules bump Str and Tricks a bit higher
  rules.defineRule('animalCompanionStats.Str',
    'featureNotes.animalCompanion', '+', '2'
  );
  rules.defineRule('animalCompanionStats.Tricks',
    'featureNotes.animalCompanion', '+', '1'
  );

};

/* Defines rules related to combat. */
LastAge.combatRules = function(rules, armors, shields, weapons) {
  LastAge.basePlugin.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
LastAge.identityRules = function(
  rules, alignments, classes, deities, paths, races, prestigeClasses, npcClasses
) {

  if(LastAge.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races,
      Pathfinder.TRACKS, Pathfinder.TRAITS, prestigeClasses, npcClasses
    );
  else
    SRD35.identityRules(
      rules, alignments, classes, deities, paths, races, prestigeClasses,
      npcClasses
    );

  rules.defineRule('features.Illiteracy', '', '=', '1');
  rules.defineRule
    ('skillModifier.Speak Language', 'skillNotes.illiteracy', '+', '-2');

  rules.defineRule('maxSpellLevel',
    'level', '=', 'source / 2',
    'magicNotes.artOfMagic', '+', '1/2'
  );
  for(var i = 0; i < 10; i++) {
    rules.defineRule('spellSlots.Ch' + i,
      'maxSpellLevel', '?', 'Math.floor(source) == ' + i,
      'channelerSpells', '=', null
    );
  }

  // Remove Deity from editor and sheet; add heroic path and spell energy
  rules.defineEditorElement('deity');
  rules.defineSheetElement('Deity');
  rules.defineSheetElement('Deity Alignment');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'alignment');
  rules.defineSheetElement('Heroic Path', 'Alignment');
  rules.defineSheetElement('Spell Energy', 'Spell Slots');

};

/* Defines rules related to magic use. */
LastAge.magicRules = function(rules, schools, spells) {
  LastAge.basePlugin.magicRules(rules, schools, spells);
  rules.defineRule('highestMagicModifier',
    'charismaModifier', '=', null,
    'intelligenceModifier', '^', null,
    'wisdomModifier', '^', null
  );
};

/* Defines rules related to character aptitudes. */
LastAge.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  LastAge.basePlugin.talentRules
    (rules, feats, features, goodies, languages, skills);
  // No changes needed to the rules defined by base method
  rules.defineRule('sumMagecraft',
    'features.Magecraft (Charismatic)', '+=', null,
    'features.Magecraft (Hermetic)', '+=', null,
    'features.Magecraft (Spiritual)', '+=', null
  );
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
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Armor')
    LastAge.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class' || type == 'Npc' || type == 'Prestige') {
    LastAge.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    LastAge.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    LastAge.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Familiar')
    LastAge.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Feat') {
    LastAge.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    LastAge.featRulesExtra(rules, name);
  } else if(type == 'Feature')
    LastAge.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    LastAge.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    LastAge.languageRules(rules, name);
  else if(type == 'Path') {
    LastAge.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    LastAge.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    LastAge.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    LastAge.raceRulesExtra(rules, name);
  } else if(type == 'School') {
    LastAge.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(LastAge.basePlugin.schoolRulesExtra)
      LastAge.basePlugin.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
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
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergies')
    );
    if(LastAge.basePlugin.skillRulesExtra)
      LastAge.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = (school || 'Universal').substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = LastAge.PATHS[group + ' Domain'] != null;
      LastAge.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Track')
    Pathfinder.trackRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Progression')
    );
  else if(type == 'Trait') {
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
    if(Pathfinder.traitRulesExtra)
      Pathfinder.traitRulesExtra(rules, name);
  } else if(type == 'Weapon')
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
  if(type != 'Feature' && (type != 'Path' || name.indexOf('Domain') < 0) &&
     type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    type = type == 'Path' ? 'heroicPaths' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
LastAge.alignmentRules = function(rules, name) {
  LastAge.basePlugin.alignmentRules(rules, name);
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
  LastAge.basePlugin.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points and #skillPoints# additional skill points with each
 * level advance. #attack# is one of '1', '1/2', or '3/4', indicating the base
 * attack progression for the class; similarly, #saveFort#, #saveRef#, and
 * #saveWill# are each one of '1/2' or '1/3', indicating the saving throw
 * progressions. #skills# indicate class skills for the class; see skillRules
 * for an alternate way these can be defined. #features# and #selectables# list
 * the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. If the class grants spell slots,
 * #spellAbility# names the ability for computing spell difficulty class, and
 * #spellSlots# lists the number of spells per level per day granted.
 */
LastAge.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots
) {
  if(LastAge.basePlugin == window.Pathfinder) {
    for(var i = 0; i < requires.length; i++) {
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(var i = skills.length - 1; i >= 0; i--) {
      var skill = skills[i];
      if(!(skill in Pathfinder.SRD35_SKILL_MAP))
        continue;
      if(Pathfinder.SRD35_SKILL_MAP[skill] == '')
        skills.splice(i, 1);
      else
        skills[i] = Pathfinder.SRD35_SKILL_MAP[skill];
    }
  }
  LastAge.basePlugin.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the abilities passed to classRules.
 */
LastAge.classRulesExtra = function(rules, name) {

  var classLevel = 'levels.' + name;

  if(name.endsWith(' Channeler')) {

    rules.defineRule('channelerLevels', classLevel, '+=', null);
    rules.defineRule('familiarMasterLevel',
      'channelerLevels', '^=', 'source >= 2 ? source : null'
    );
    rules.defineRule('featCount.' + name,
      classLevel, '=', 'source >= 4 ? Math.floor((source - 1) / 3) : null'
    );
    rules.defineRule('featCount.Spellcasting',
      'featureNotes.channelerSpellcasting', '+=', null
    );
    rules.defineRule('featureNotes.channelerBonusFeats',
      classLevel, '+=', 'source >= 4 ? Math.floor((source - 1) / 3) : null'
    );
    rules.defineRule('featureNotes.channelerSpellcasting',
      'channelerLevels', '+=', 'source>=2 ? Math.floor((source + 1) / 3) : null'
    );
    rules.defineRule
      ('magicNotes.bonusSpellEnergy', 'channelerLevels', '+=', null);
    rules.defineRule
      ('magicNotes.bonusSpells', 'channelerLevels', '+=', '(source - 1) * 2');
    // No-op to get featureNotes.channelerBonusFeats in italics
    rules.defineRule('noop', 'featureNotes.channelerBonusFeats', '+', 'null');
    var allFeats = rules.getChoices('feats');

    if(name == 'Charismatic Channeler') {
      for(var feat in allFeats) {
        if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
           feat.startsWith('Spell Focus') ||
           feat.startsWith('Greater Spell Focus')) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('magicNotes.traditionGift(ForceOfPersonality)',
        'charismaModifier', '=', '3 + source'
      );
      rules.defineRule('magicNotes.inspireConfidence', classLevel, '=', null);
      rules.defineRule('magicNotes.inspireFascination', classLevel, '=', null);
      rules.defineRule('magicNotes.inspireFascination.1',
        classLevel, '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule
        ('magicNotes.inspireFascination.2', classLevel, '=', null);
      rules.defineRule('magicNotes.inspireFury', classLevel, '=', 'source + 5');
      rules.defineRule
        ('magicNotes.massSuggestion', classLevel, '=', 'Math.floor(source/3)');
      rules.defineRule('selectableFeatureCount.Charismatic Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
    } else if(name == 'Hermetic Channeler') {
      for(var feat in allFeats) {
        if(feat == 'Spell Knowledge' ||
           allFeats[feat].indexOf('Item Creation') >= 0 ||
           allFeats[feat].indexOf('Metamagic') >= 0) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('skillNotes.literate',
        classLevel, '=', 'Math.floor((source + 2) / 3)'
      );
      rules.defineRule('selectableFeatureCount.Hermetic Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('skillNotes.quickReference',
        'hermeticChannelerFeatures.Quick Reference', '=', '5 * source'
      );
      rules.defineRule('skillNotes.traditionGift(Lorebook)',
        classLevel, '=', null,
        'intelligenceModifier', '+', null
      );
    } else if(name == 'Spiritual Channeler') {
      for(var feat in allFeats) {
        if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
           allFeats[feat].indexOf('Item Creation') >= 0) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('combatNotes.masteryOfNature.1',
        classLevel, '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfNature.2',
        classLevel, '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfNature.3',
        'features.Mastery Of Nature', '?', null,
        'wisdomModifier', '=', '3 + source'
      );
      rules.defineRule('combatNotes.masteryOfNature.4',
        'features.Mastery Of Nature', '=', '2',
        'combatNotes.powerfulEffect', '+', '1'
      );
      rules.defineRule('combatNotes.masteryOfSpirits.1',
        classLevel, '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfSpirits.2',
        classLevel, '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfSpirits.3',
        'features.Mastery Of Spirits', '?', null,
        'wisdomModifier', '=', '3 + source'
      );
      rules.defineRule('combatNotes.masteryOfSpirits.4',
        'features.Mastery Of Spirits', '=', '2',
        'combatNotes.powerfulEffect', '+', '1'
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.1',
        classLevel, '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.2',
        classLevel, '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.3',
        'features.Mastery Of The Unnatural', '?', null,
        'wisdomModifier', '=', '3 + source'
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.4',
        'features.Mastery Of The Unnatural', '=', '2',
        'combatNotes.powerfulEffect', '+', '1'
      );
      rules.defineRule('selectableFeatureCount.Spiritual Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
    }

  } else if(name == 'Defender') {

    rules.defineRule('abilityNotes.incredibleSpeed',
      'defenderFeatures.Incredible Speed', '=', '10 * source'
    );
    rules.defineRule('combatNotes.defenderAbilities',
      classLevel, '=', '3 + source * 3 / 4',
      'level', '+', 'source / 4'
    );
    rules.defineRule('combatNotes.armorClassBonus',
      classLevel, '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.defenderStunningFist',
      classLevel, '=', '10 + Math.floor(source / 2)',
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
      'defenderUnarmedDamageMedium', '=', null,
      'defenderUnarmedDamageLarge', '=', null,
      'defenderUnarmedDamageSmall', '=', null
    );
    rules.defineRule('combatNotes.offensiveTraining',
      classLevel, '=', '14 + Math.floor(source / 2)',
      'strengthModifier', '+', null
    );
    rules.defineRule('combatNotes.preciseStrike',
      classLevel, '=', '3 * Math.floor((source + 2) / 6)'
    );
    rules.defineRule('defenderUnarmedDamageLarge',
      'features.Large', '?', null,
      'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "8")'
    );
    rules.defineRule('defenderUnarmedDamageMedium',
      classLevel, '=',
      '"d6" + (source < 7 ? "" : ("+" + Math.floor((source-1) / 6) + "d6"))'
    );
    rules.defineRule('defenderUnarmedDamageSmall',
      'features.Small', '?', null,
      'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "4")'
    );
    rules.defineRule('featureNotes.incredibleSpeedOrResilience',
      classLevel, '=', 'source < 6 ? null : Math.floor((source - 3) / 3)'
    );
    rules.defineRule('saveNotes.defensiveMastery',
      'defenderFeatures.Defensive Mastery', '=', null
    );
    rules.defineRule('selectableFeatureCount.Defender',
      classLevel, '=', 'source < 2 ? null : (Math.floor((source + 1) / 3))',
      'featureNotes.incredibleSpeedOrResilience', '+', null
    );
    rules.defineRule
      ('unarmedDamageDice', 'combatNotes.masterfulStrike', '=', null);

  } else if(name == 'Fighter') {

    rules.defineRule
      ('featCount.Fighter', classLevel, '=', '1 + Math.floor(source / 2)');
    rules.defineRule('selectableFeatureCount.Fighter',
      classLevel, '=', 'source >= 4 ? 1 + Math.floor((source+2)/6) : null',
      'features.Adapter', 'v', '1'
    );
    rules.defineRule('skillNotes.adapter',
      classLevel, '=',
      'source - 3 + (source >= 10 ? source - 9 : 0) + ' +
      '(source >= 16 ? source - 15 : 0)'
    );
    rules.defineRule('skillNotes.adapter.1',
      'features.Adapter', '?', null,
      classLevel, '=', 'source < 10 ? 1 : source < 16 ? 2 : 3'
    );

  } else if(name == 'Legate') {

    rules.defineRule('combatNotes.turnUndead.1',
      'turningLevel', '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.turnUndead.2',
      'turningLevel', '=', 'source * 3 - 10',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.turnUndead.3',
      'turningLevel', '=', '3',
      'charismaModifier', '+', null
    );
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
    rules.defineRule
      ('selectableFeatureCount.Legate', classLevel, '=', '2');
    rules.defineRule('turningLevel', classLevel, '+=', null);
    // Use animal companion stats and features for astirax abilities
    var features = [
      '3:Empathic Link', '6:Telepathy', '9:Enhanced Sense',
      '12:Companion Evasion', '18:Companion Empathy'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', 'astiraxMasterLevel', false);
    rules.defineRule('companionNotes.enhancedSense',
      classLevel, '=', 'source < 15 ? 5 : 10'
    );
    rules.defineRule('animalCompanionStats.Cha',
      classLevel, '+', 'Math.floor(source / 3) - 1'
    );
    rules.defineRule('animalCompanionStats.HD',
      classLevel, '+', '(Math.floor(source / 3) - 1) * 2'
    );
    rules.defineRule('animalCompanionStats.Int',
     classLevel, '+', 'Math.floor(source / 3) - 1'
    );
    rules.defineRule('astiraxMasterLevel',
      'hasCompanion', '?', null,
      'levels.Legate', '=', null
    );

  } else if(name == 'Wildlander') {

    rules.defineRule('abilityNotes.quickStride',
      'wildlanderFeatures.Quick Stride', '=', '10 * source'
    );
    rules.defineRule('casterLevels.Wildlander',
      'wilderlanderFeatures.Sense Dark Magic', '?', null,
      'level', '=', null
    );
    rules.defineRule("combatNotes.hunter'sStrike",
      classLevel, '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.dangerSense',
      classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
    );
    rules.defineRule('featureNotes.animalCompanion',
      'wildlanderFeatures.Animal Companion', '+=', null
    );
    rules.defineRule('featureNotes.wildlanderSkillMastery',
      'wildlanderFeatures.Wildlander Skill Mastery', '=', null
    );
    rules.defineRule('featureNotes.wildlanderTraits',
      classLevel, '=', '1 + Math.floor((source + 1) / 3)'
    );
    rules.defineRule('features.Skill Mastery',
      'features.Wildlander Skill Mastery', '+=', null
    );
    rules.defineRule('selectableFeatureCount.Wildlander',
      'featureNotes.wildlanderTraits', '+=', null,
    );
    rules.defineRule('skillNotes.dangerSense',
      classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
    );
    rules.defineRule('skillNotes.skillMastery',
      'skillNotes.wildlanderSkillMastery', '+=', null
    );
    rules.defineRule('skillNotes.wildlanderSkillMastery',
      'wildlanderFeatures.Wildlander Skill Mastery', '=', null
    );
    if(LastAge.basePlugin == window.Pathfinder) {
      // Computation as per PRD Ranger
      rules.defineRule('skillNotes.track',
        classLevel, '+=', 'Math.max(1, Math.floor(source / 2))'
      );
    }
    rules.defineRule('skillNotes.wildEmpathy',
      classLevel, '+=', null,
      'charismaModifier', '+', null
    );

  } else if(name == 'Ancestral Bladebearer') {

    rules.defineRule('casterLevels.Ancestral Bladebearer',
      classLevel, '?', 'source >= 3',
      'level', '=', null
    );
    rules.defineRule('combatNotes.advanceAncestralBlade',
      classLevel, '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('featureNotes.ancestralBladebearerBonusFeats',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.ancestralAdvisor',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );

  } else if(name == "Aradil's Eye") {

    rules.defineRule('featureNotes.alterEgo',
      classLevel, '=',
        'source<3 ? "prepared human" :' +
        'source<7 ? "prepared human or prepared humanoid" : "any humanoid"'
    );
    rules.defineRule('featureNotes.alterEgo.1',
      classLevel, '=', 'source<5 ? "one min" : "1 rd"'
    );
    rules.defineRule('featureNotes.alterEgo.2',
      classLevel, '=', 'source<9 ? "supernatural" : "extraordinary"'
    );
    rules.defineRule('featureNotes.spy', classLevel, '=', 'source * 10');
    rules.defineRule('skillNotes.spyInitiate',
      classLevel, '=', 'source >= 10 ? 10 : source >= 5 ? 8 : 4'
    );

  } else if(name == 'Avenging Knife') {

    rules.defineRule('combatNotes.deathAttack',
      classLevel, '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.deathAttack.1', classLevel, '+=', null);
    rules.defineRule
      ('combatNotes.sneakAttack', classLevel, '+=', 'Math.floor(source / 3)');
    rules.defineRule('combatNotes.stunningSneakAttack',
      classLevel, '=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.theDrop', classLevel, '=', 'Math.floor((source + 2) / 3)');
    rules.defineRule('skillNotes.securityBreach', classLevel, '=', null);

  } else if(name == 'Bane Of Legates') {

    rules.defineRule
      ('featCount.Wizard', 'featureNotes.baneOfLegatesBonusFeats', '+=', null);
    rules.defineRule('featureNotes.baneOfLegatesBonusFeats',
      classLevel, '=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('featureNotes.bonusSpellcasting',
      classLevel, '+=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('magicNotes.bindAstirax', classLevel, '=', null);
    rules.defineRule('magicNotes.bindAstirax.1',
      // 15 + ability modifier; spellDifficultyClass is 10 + abilityModifier
      'features.Bind Astirax', '?', null,
      'spellDifficultyClass.B', '^=', 'source + 5',
      'spellDifficultyClass.D', '^=', 'source + 5',
      'spellDifficultyClass.W', '^=', 'source + 5'
    );
    rules.defineRule
      ("saveNotes.resistIzrador'sWill", classLevel, '=', 'source + 10');

  } else if(name == 'Druid') {

    rules.defineRule
      ('combatNotes.masteryOfNature.1', 'druidTurningLevel', '+=', null);
    rules.defineRule
      ('combatNotes.masteryOfNature.2', 'druidTurningLevel', '+=', 'source * 3');
    rules.defineRule('companionMasterLevel', classLevel, '+=', null);
    rules.defineRule('druidTurningLevel',
      classLevel, '+=', 'Math.floor(source / 2)',
      'selectableFeatures.Spiritual Channeler - Mastery Of Spirits', '*', '2'
    );
    rules.defineRule('featureNotes.findTheWay',
      '', '=', '"Normal movement through undergrowth"',
      'features.Woodland Stride', '=', '"Untrackable outdoors"',
      'features.Trackless Step', '=', '"Continuous <i>Pass Without Trace</i>"'
    );
    rules.defineRule('featureNotes.animalCompanion',
      classLevel, '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.communeWithNature',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineChoice('spells', "Peasant's Rest(D1 Conj)");
    rules.defineChoice('spells', 'Fey Fire(D2 Conj)');

  } else if(name == 'Elven Raider') {

    rules.defineRule('combatNotes.improvedSneakAttackRange',
      classLevel, '=', 'Math.floor((source + 1) / 3) * 15'
    );
    rules.defineRule('combatNotes.rangedSneakAttack',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.rangedSneakAttack.1',
      'elvenRaiderFeatures.Ranged Sneak Attack', '=', '30',
      'combatNotes.improvedSneakAttackRange', '+', null
    );
    rules.defineRule('combatNotes.meticulousAim',
      classLevel, '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Freerider') {

    var allFeats = rules.getChoices('feats');
    var feats = [
      'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
      'Trample', 'Weapon Focus (Composite Longbow)',
      'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
      'Weapon Specialization (Composite Longbow)',
      'Weapon Specialization (Sarcosan Lance)',
      'Weapon Specialization (Scimitar)'
    ];
    for(var i = 0; i < feats.length; i++) {
      var feat = feats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    rules.defineRule('combatNotes.improvedMountedAssault',
      'feats.Devastating Mounted Assault', '?', null
    );
    rules.defineRule('featureNotes.freeriderBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('featCount.Freerider', 'featureNotes.freeriderBonusFeats', '=', null);
    rules.defineRule('featureNotes.mountedManeuver',
      classLevel, '=', 'Math.floor((source + 1) / 3)'
    );
    rules.defineRule('selectableFeatureCount.Freerider',
      'featureNotes.mountedManeuver', '=', null
    );

  } else if(name == 'Haunted One') {

    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.seance', classLevel, '=', 'Math.floor((source + 2) / 3)');
    rules.defineRule('magicNotes.seance.1',
      classLevel, '=',
        'source<4 ? "  dy" : source<7 ? " yr" : source<10 ? " century" : ""'
    );
    rules.defineRule('magicNotes.spiritManipulation',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.hauntedOneSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.hauntedOneSpellsKnown', '+', null);

  } else if(name == 'Insurgent Spy') {

    rules.defineRule('combatNotes.sneakAttack',
      classLevel, '+=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule('featureNotes.concealMagicAura', classLevel, '=', null);
    rules.defineRule('skillNotes.shadowContacts',
      classLevel, '=',
        'source>=5 ? "DC 20 minor, DC 25 major, or DC 30 incredible" : ' +
        'source>=3 ? "DC 20 minor or DC 25 major" : "DC 20 minor"'
    );
    rules.defineRule
      ('skillNotes.shadowSpeak', classLevel, '=', 'Math.floor(source / 2)');

  } else if(name == 'Smuggler') {

    rules.defineRule('baseAttack', 'smugglerBaseAttackAdjustment', '+', null);
    rules.defineRule('magicNotes.disguiseContraband', classLevel, '=', null);
    rules.defineRule
      ('magicNotes.mystifyingSpeech', classLevel, '=', 'source>=7 ? 2 : 1');
    rules.defineRule('magicNotes.mystifyingSpeech.1',
      'features.Mystifying Speech', '?', null,
      classLevel, '=', null
    );
    rules.defineRule('magicNotes.mystifyingSpeech.2',
      'features.Mystifying Speech', '?', null,
      classLevel, '=', '10 + source',
      'charismaModifier', '+', null
    );
    rules.defineRule('saveNotes.dominantWill',
      classLevel, '=', 'source >= 6 ? 4 : 2'
    );
    rules.defineRule('skillNotes.informationNetwork',
      classLevel, '=', 'source >= 7 ? 20 : 10'
    );
    rules.defineRule("skillNotes.smuggler'sTrade",
      classLevel, '=', 'Math.floor((source + 1) / 2) * 2'
    );
    rules.defineRule('smugglerBaseAttackAdjustment',
      classLevel, '=', 'source==8 || source==10 ? -1 : null'
    );

  } else if(name == 'Warrior Arcanist') {

    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.armoredCasting', '+', '-source',
      null, '^', '0'
    );
    rules.defineRule('magicNotes.armoredCasting',
      classLevel, '+=', 'Math.floor((source + 1) / 2) * 5'
    );
    rules.defineRule
      ('magicNotes.channeledCombat', 'level', '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.channeledCombat.1',
      classLevel, '=',
        'source<4 ? "attack" : ' +
        'source<7 ? "attack or AC" : "attack, damage, or AC"'
    );
    rules.defineRule('magicNotes.improvedSpellcasting',
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.meleeCaster', classLevel, '=', 'Math.floor(source / 2)');

  } else if(name == 'Whisper Adept') {

    rules.defineRule('combatNotes.whisperSense',
      classLevel, '=',
        'source<2 ? null : source<4 ? "+2 Initiative" : ' +
        '"+2 Initiative, cannot be surprised"'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('magicNotes.treeMeld', classLevel, '=', null);
    rules.defineRule('magicNotes.whisperSense',
      classLevel, '=',
        'source<6 ? null : source<8 ? "<i>Clairaudience</i>" : ' +
        'source<10 ? "<i>Clairaudience</i>, <i>Clairvoyance</i>" : ' +
        '"<i>Clairaudience</i>, <i>Clairvoyance</i>, <i>Commune With Nature</i>"'
    );

  } else if(name == 'Wizard') {

    rules.defineRule
      ('featCount.Wizard', 'featureNotes.wizardBonusFeats', '+=', null);
    rules.defineRule('featureNotes.bonusSpellcasting',
      classLevel, '+=', 'source<4 ? null : Math.floor((source - 1) / 3)'
    );
    rules.defineRule('featureNotes.wizardBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('featureNotes.efficientStudy',
      classLevel, '=', 'Math.floor((source + 1) / 3) * 10'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);

  } else if(name == 'Wogren Rider') {

    rules.defineRule('combatNotes.improvedMountedCombat',
      'dexterityModifier', '=', 'source > 0 ? source : 1'
    );
    rules.defineRule('featureNotes.mountedAbility',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('features.Blindsense', "features.Wogren's Sight", '=', '1');
    rules.defineRule
      ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
    rules.defineRule('selectableFeatureCount.Wogren Rider',
      'featureNotes.mountedAbility', '=', null
    );
    rules.defineRule('skillNotes.mountedHide',
      classLevel, '=', '0',
      'skillModifier.Hide', '+', null,
      // Use wogren's size modifier, not character's
      'features.Small', '+', '-4',
      'animalCompanionStats.Size', '+',
        'source=="S" ? 4 : source=="L" ? -4 : null'
    );

  // Source books

  } else if(name == 'Pale Legate') {

    rules.defineRule('featureNotes.senseDarkMagic',
      'features.Master Hunter', '?', null
    );
    rules.defineRule("magicNotes.denyIzrador'sPower",
      classLevel, '=', null,
      'wisdomModifier', '+', null
    );
    rules.defineRule("magicNotes.denyIzrador'sPower.1",
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('saveNotes.paleHeart', classLevel, '=', 'Math.floor((source + 2) / 3)');
    rules.defineRule
      ('skillNotes.shadowSpeak', classLevel, '=', 'Math.floor((source+1) / 3)');

  } else if(name == 'Warden Of Erenland') {

    rules.defineRule('channelerSpells', 'magicNotes.spiritSpeaker', '+', '1');
    rules.defineRule('combatNotes.forTheKing', classLevel, '=', null);
    rules.defineRule('combatNotes.forTheKing.1',
      classLevel, '=', 'Math.floor((source - 1) / 3) + 1'
    );
    rules.defineRule('combatNotes.forTheKing.2',
      classLevel, '=', 'Math.floor((source - 1) / 3) * 2 + 4'
    );
    rules.defineRule("featureNotes.aryth'sBlessing",
      classLevel, '=', 'Math.floor((source + 1) / 3)'
    );
    rules.defineRule('featureNotes.mediator', classLevel, '=', 'source * 5');
    rules.defineRule('featureNotes.mediator.1',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule
      ('magicNotes.dreamsOfTheLand(Commune)', classLevel, '=', 'source + 10');
    rules.defineRule
      ('magicNotes.dreamsOfTheLand.2', classLevel, '=', 'source * 10 + 60');
    rules.defineRule
      ('magicNotes.dreamsOfTheLand(Foresight)', classLevel, '=', null);

  } else if(name == 'Ancestral Foe') {

    rules.defineRule('ancestralFoe',
      'race', '=', 'source == "Orc" ? "dwarves, dwarrow, and dworgs" : "orcs and dworgs"'
    );
    rules.defineRule
      ("combatNotes.hunter'sStrike", classLevel, '+=', 'source<3 ? null : 1');
    rules.defineRule('combatNotes.knowThyEnemy',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('combatNotes.knowThyEnemy.1', 'ancestralFoe', '=', null);
    rules.defineRule('combatNotes.savvyHunter', 'ancestralFoe', '=', null);
    rules.defineRule('combatNotes.rageOfVengeance', 'ancestralFoe', '=', null);
    rules.defineRule('saveNotes.imperviousMind', 'ancestralFoe', '=', null);
    rules.defineRule('skillNotes.knowThyEnemy',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('skillNotes.knowThyEnemy.1', 'ancestralFoe', '=', null);
    rules.defineRule('featureNotes.primalFoe', 'ancestralFoe', '=', null);

  } else if(name == 'Dwarven Loremaster') {

    var allSkills = rules.getChoices('skills');
    for(var s in allSkills) {
      if(s.startsWith('Knowledge'))
        rules.defineRule('countKnowledgeSkillsGe5',
          'skills.' + s, '+=', 'source>=5 ? 1 : null'
        );
    }

    rules.defineRule('featCount\.Wizard',
      'featureNotes.dwarvenLoremasterBonusFeats', '+=', null
    );
    rules.defineRule('featureNotes.dwarvenLoremasterBonusFeats',
      classLevel, '=', 'source<7 ? 1 : source<10 ? 2 : 3'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.rechargeNexus', classLevel, '=', 'source<6 ? 3 : 2');
    rules.defineRule('magicNotes.runeMagic', classLevel, '=', 'source - 1');
    rules.defineRule
      ('skillNotes.traditionGift(Lorebook)', classLevel, '=', null);

  } else if(name == 'Spirit Speaker') {

    var allFeats = rules.getChoices('feats');
    for(var f in allFeats) {
      if(f == 'Extra Gift' || f == 'Spell Knowledge' ||
         allFeats[f].match(/Metamagic/))
        allFeats[f] = allFeats[f].replace('Type=', 'Type="Spirit Speaker",');
    }

    rules.defineRule
      ('channelerSpells', 'magicNotes.ancestralSpellcasting', '+', null);
    rules.defineRule('featCount.Spirit Speaker',
      'featureNotes.spiritSpeakerBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.spiritSpeakerBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
     ('magicNotes.ancestralSpellcasting', classLevel, '+=', null);
    rules.defineRule('magicNotes.armoredCasting',
      classLevel, '=', 'Math.floor(source / 2) * 5'
    );
    rules.defineRule('magicNotes.callMeruros', classLevel, '=', null);
    rules.defineRule('magicNotes.callTadulos', classLevel, '=', null);
    rules.defineRule('magicNotes.gazeOfTheMeruros',
      classLevel, '=', '10 + source',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.breathOfTheVigdir', classLevel, '=', null);
    rules.defineRule('magicNotes.giftOfTheVigdir', classLevel, '=', null);
    rules.defineRule('skillNotes.ancestralRecall', classLevel, '=', null);

  } else if(name == 'Collaborator') {

    rules.defineRule
      ('casterLevels.Domain', classLevel, '=', 'source<6 ? null : source');
    rules.defineRule('channelerSpells',
      'magicNotes.darkInvitation', '+=', '1',
      'magicNotes.savvyHost', '+=', '1'
    );
    rules.defineRule
      ('features.Augment Summoning', 'featureNotes.savvyHost', '=', '1');
    rules.defineRule('features.Leadership', 'featureNotes.respect', '=', '1');
    rules.defineRule('features.Spellcasting (Greater Conjuration)',
      'featureNotes.darkInvitation', '=', '1'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('selectableFeatureCount.Collaborator',
      classLevel, '=', 'source<6 ? null : 2'
    );
    rules.defineRule('skillNotes.obsidianTongue',
      classLevel, '=', 'Math.floor((source + 1) / 2) * 2'
   );

  } else if(name == 'Gardener Of Erethor') {

    var allFeats = rules.getChoices('feats');
    var feats = [
      'Craft Rune Of Power', 'Empower Spell', 'Skill Focus', 'Widen Spell'
    ];
    for(var i = 0; i < feats.length; i++) {
      var feat = feats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }

    rules.defineRule
      ('channelerSpells', 'magicNotes.gardenerOfErethorBonusSpells', '+', null);
    rules.defineRule('combatNotes.chosenGround', classLevel, '=', null);
    rules.defineRule('featCount.Gardener Of Erethor',
      'featureNotes.gardenerOfErethorBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.gardenerOfErethorBonusFeats',
      classLevel, '=', 'Math.floor((source - 1) / 2) - (source == 9 ? 1 : 0)'
    );
    rules.defineRule('magicNotes.gardenerOfErethorBonusSpells',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('magicNotes.spiritualLink', classLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('skillNotes.homemaker', classLevel, '=', null);

  } else if(name == 'Snow Witch') {

    var allSpells = rules.getChoices('spells');
    var snowSpells = {
      'Detect Magic':0, 'Ray Of Frost':0,
      'Chill Touch':1, 'Obscuring Mist':1,
      'Gust Of Wind':2, 'Levitate':2, 'Weather':2,
      'Quench':3, 'Sleet Storm':3, 'Wind Wall':3,
      'Air Walk':4, 'Ice Storm':4,
      'Cone Of Cold':5, 'Control Winds':5,
      'Freezing Sphere':6, 'Mislead':6, 'Wind Walk':6,
      'Control Weather':7,
      'Polar Ray':8, 'Whirlwind':8,
      'Storm Of Vengeance':9
    };
    for(var spell in snowSpells) {
      var keys =
        QuilvynUtils.getKeys(allSpells, spell + '\\(Ch' + snowSpells[spell]);
      if(keys.length != 1) {
        console.log('Missing Show Witch spell "' + spell + '"');
        continue;
      }
      rules.defineRule('snowWitchSpells.' + keys[0],
        classLevel, '?', null,
        'maxSpellLevel', '=', 'source >= ' + snowSpells[spell] + ' ? 1 : null'
      );
      rules.defineRule
        ('spells.' + keys[0], 'snowWitchSpells.' + keys[0], '=', null);
    }
    rules.defineRule
      ('magicNotes.auraOfWinter', classLevel, '=', 'source<10 ? 1 : 2');
    rules.defineRule
      ('magicNotes.controlWeather', classLevel, '=', 'source<10 ? 1 : 2');
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('saveNotes.coldResistance',
      classLevel, '=', 'Math.floor((source + 1) / 3) * 5'
    );
    rules.defineRule
      ('saveNotes.wayOfTheSnowWitch', classLevel, '=', 'source<4 ? 2 : 4');

  } else if(name == 'Syphon') {

    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.ignoreArmor', '+', '-source',
      null, '^', '0'
    );
    rules.defineRule('magicNotes.blood-Syphoning', classLevel, '=', null);
    rules.defineRule('magicNotes.blood-Syphoning.1',
      classLevel, '=', '3',
      'magicNotes.bloodTalisman', '+', '-1'
    );
    rules.defineRule('magicNotes.deathKnell',
      classLevel, '=', 'source<3 ? 1 : source<5 ? 2 : 3'
    );
    rules.defineRule('magicNotes.deathKnell.1',
      classLevel, '=', null,
      'highestMagicModifier', '+', null
    );
    rules.defineRule('magicNotes.deathKnell.2',
      'features.Death Knell', '?', null,
      'highestMagicModifier', '=', '12 + source'
    );
    rules.defineRule('magicNotes.deathwatch',
      classLevel, '=', 'source<3 ? 1 : source<5 ? 2 : 3'
    );
    rules.defineRule('magicNotes.deathwatch.1', classLevel, '=', 'source * 10');
    rules.defineRule('magicNotes.ignoreArmor',
      classLevel, '=', 'Math.floor(source / 2) * 10'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 3)'
    );

  } else if(name == 'Pellurian Blade Dancer') {

    rules.defineRule('combatNotes.crashingWaves',
      'dexterityModifier', '=', '1 + Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.fluidDefense',
      classLevel, '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.whatWasWillBeAgain',
      'dexterityModifier', '=', 'Math.max(source, 1)'
    );
    rules.defineRule('featureNotes.bladeDancerBonusFeats',
      classLevel, '=', 'Math.floor(source / 2) - (source == 10 ? 1 : 0)'
    );

  } else if(name == 'Sahi') {

    var allFeats = rules.getChoices('feats');
    for(var f in allFeats) {
      if(allFeats[f].match(/Item Creation/) || f.startsWith('Spellcasting'))
        allFeats[f] = allFeats[f].replace('Type=', 'Type="' + name + '",');
    }
    var allSkills = rules.getChoices('skills');
    for(var s in allSkills) {
      if(s.startsWith('Knowledge'))
        rules.defineRule
          ('skillModifier.' + s, 'skillNotes.forgottenKnowledge', '+', '2');
    }

    rules.defineRule
      ('featCount.Sahi', 'featureNotes.sahiBonusFeats', '=', null);
    rules.defineRule('features.Darkvision',
      'featureNotes.improvedVisionOfTheNight', '=', '1'
    );
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.visionOfTheNight', '=', '1');
    rules.defineRule('featureNotes.strengthOfMyAncestors',
      classLevel, '+=', 'source<4 ? null : 1'
    );
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.VisionOfTheNight', '=', '1');
    rules.defineRule('featureNotes.sahiBonusFeats',
      classLevel, '=', 'source<8 ? 1 : source<10 ? 2 : 3'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.omenOfTheSorshef', classLevel, '=', 'source + 70');
    rules.defineRule
      ('magicNotes.talesOfTheSorshef(Agony)', classLevel, '=', null);
    rules.defineRule('magicNotes.talesOfTheSorshef(Agony).1',
      'features.Tales Of The Sorshef (Agony)', '?', null,
      'skills.Perform (Storytelling)', '=', null
    );
    rules.defineRule('magicNotes.talesOfTheSorshef(Agony).2',
      'features.Tales Of The Sorshef (Agony)', '?', null,
      'highestMagicModifier', '=', 'source + 15'
    );
    rules.defineRule
      ('magicNotes.talesOfTheSorshef(Determination)', classLevel, '=', null);
    rules.defineRule('magicNotes.talesOfTheSorshef(Determination).1',
      'features.Tales Of The Sorshef (Determination)', '?', null,
      'skills.Perform (Storytelling)', '=', null
    );
    rules.defineRule
      ('magicNotes.talesOfTheSorshef(Freedom)', classLevel, '=', null);
    rules.defineRule('magicNotes.talesOfTheSorshef(Freedom).1',
      'features.Tales Of The Sorshef (Freedom)', '?', null,
      'skills.Perform (Storytelling)', '=', null
    );
    rules.defineRule
      ('magicNotes.talesOfTheSorshef(Heart)', classLevel, '=', null);
    rules.defineRule('magicNotes.talesOfTheSorshef(Heart).1',
      'features.Tales Of The Sorshef (Heart)', '?', null,
      'skills.Perform (Storytelling)', '=', null
    );
    rules.defineRule('magicNotes.talesOfTheSorshef(Heart).2',
      'features.Tales Of The Sorshef (Heart)', '?', null,
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.alchemy',
      classLevel, '=', 'source<5 ? "" : source<7 ? " and horse balm" : ", horse balm, and starfire"'
    );
    rules.defineRule('skillNotes.parablesOfTheSorshef',
      classLevel, '=', null,
      'wisdomModifier', '+', null
    );

  } else if(name == 'Vigilant Defender') {

    rules.defineRule
      ('abilityNotes.wallscaling', 'speed', '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('combatNotes.blade', classLevel, '=', 'Math.floor((source + 2) / 3)');
    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', 'source<6 ? null : source',
      '', '+', '4'
    );
    rules.defineRule
      ('combatNotes.sneakAttack', 'combatNotes.blade', '+=', null);
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.citySight', '=', '1');
    rules.defineRule
      ('featureNotes.fist', classLevel, '=', 'Math.floor((source + 2) / 3)');
    rules.defineRule
      ('featureNotes.urbanMobility', classLevel, '=', 'Math.floor(source / 3)');
    rules.defineRule
      ('selectableFeatureCount.Defender', 'featureNotes.fist', '+=', null);
    rules.defineRule('selectableFeatureCount.Vigilant Defender',
      'featureNotes.urbanMobility', '=', null
    );
    rules.defineRule('skillNotes.survivalOfTheSkilled',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.survivalOfTheSkilled.1',
      classLevel, '=', 'Math.floor((source + 1) / 3)'
    );

  } else if(LastAge.basePlugin.classRulesExtra) {

    LastAge.basePlugin.classRulesExtra(rules, name);

  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
LastAge.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  LastAge.basePlugin.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
LastAge.deityRules = function(rules, name, alignment, domains, weapons) {
  LastAge.basePlugin.deityRules(rules, name, alignment, domains, weapons);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack#, does
 * #damage# damage, and is size #size#. If specified, #level# indicates the
 * minimum master level the character needs to have this animal as a familiar.
 */
LastAge.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  LastAge.basePlugin.familiarRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
LastAge.featRules = function(rules, name, requires, implies, types) {
  LastAge.basePlugin.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the abilities passed to featRules.
 */
LastAge.featRulesExtra = function(rules, name) {

  var matchInfo;

  if(name == 'Drive It Deep') {
    rules.defineRule('combatNotes.driveItDeep', 'baseAttack', '=', null);
  } if(name == 'Extra Gift') {
    rules.defineRule
      ('combatNotes.masteryOfNature.3', 'featureNotes.extraGift', '+', '4');
    rules.defineRule
      ('combatNotes.masteryOfSpirits.3', 'featureNotes.extraGift', '+', '4');
    rules.defineRule
      ('combatNotes.masteryOfTheUnnatural.3', 'featureNotes.extraGift', '+', '4');
    rules.defineRule('magicNotes.traditionGift(ForceOfPersonality)',
      'featureNotes.extraGift', '+', '4'
    );
  } else if(name == 'Innate Magic') {
    rules.defineRule
      ('magicNotes.innateMagic', 'highestMagicModifier', '=', null);
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
  } else if((matchInfo = name.match(/^Magecraft\s\((.*)\)/)) != null) {
    var tradition = matchInfo[1];
    var note = 'magicNotes.magecraft(' + tradition + ')';
    var ability = tradition == 'Charismatic' ? 'charisma' :
                  tradition == 'Hermetic' ? 'intelligence' : 'wisdom';
    var spellClass = tradition == 'Charismatic' ? 'Bard' :
                     tradition == 'Hermetic' ? 'Wizard' : 'Druid';
    var spellCode = spellClass.substring(0, 1);
    rules.defineRule(note, ability + 'Modifier', '=', null);
    rules.defineRule('spellEnergy', note, '+=', null);
    rules.defineRule('spellSlots.' + spellCode + '0', note, '+=', '3');
    rules.defineRule('spellSlots.' + spellCode + '1', note, '+=', '1');
    rules.defineRule('casterLevels.' + name,
      'features.' + name, '?', null,
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.' + spellCode, 'casterLevels.' + name, '=', null);
    rules.defineRule('spellDifficultyClass.' + spellCode,
      'casterLevels.' + spellCode, '?', null,
      ability + 'Modifier', '=', '10 + source',
    );
    rules.defineRule('spells.Prestidigitation(Ch0 Evoc)', note, '=', '1');
  } else if((matchInfo = name.match(/^Spellcasting\s\((.*)\)/)) != null) {
    var note = 'magicNotes.spellcasting('+matchInfo[1].replaceAll(' ', '')+')';
    rules.defineRule('channelerSpells', note, '+=', '1');
    rules.defineRule
      ('spellcastingFeatureCount', /^features.Spellcasting/, '+=', '1');
    rules.defineRule(
      'casterLevels.Spellcasting', 'spellcastingFeatureCount', '?', null,
      'level', '=', null
    );
    rules.defineRule('casterLevels.Ch', 'casterLevels.Spellcasting', '=', null);
    rules.defineRule('casterLevelArcane', 'casterLevels.Ch', '=', null);
  } else if(name == 'Warrior Of Shadow') {
    rules.defineRule
      ('combatNotes.warriorOfShadow', 'charismaModifier', '=', null);
    rules.defineRule
      ('combatNotes.warriorOfShadow.1', 'charismaModifier', '=', null);
  } else if(name == 'Dwarvencraft') {
    rules.defineRule('featureNotes.dwarvencraft',
      'skills.Craft (Armor)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Blacksmith)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Weapons)', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule
      ('featCount.Dwarvencraft', 'featureNotes.dwarvencraft', '=', null);
  } else if(name == 'Born Of Duty') {
    rules.defineRule('magicNotes.bornOfDuty',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Improved Flexible Recovery') {
    rules.defineRule('magicNotes.improvedFlexibleRecovery',
      'highestMagicModifier', '=', null
    );
  } else if(name == 'Power Reservoir') {
    rules.defineRule
      ('magicNotes.powerReservoir', 'highestMagicModifier', '=', null);
  } else if(name == 'Sense Power') {
    rules.defineRule('magicNotes.sensePower', 'wisdomModifier', '=', null);
  } else if(name == 'Canny Strike') {
    rules.defineRule
      ('combatNotes.cannyStrike', 'intelligenceModifier', '=', null);
  } else if(name == 'Clever Fighting') {
    rules.defineRule('combatNotes.cleverFighting',
      'dexterityModifier', '=', null,
      'strengthModifier', '+', '-source'
    );
  } else if(LastAge.basePlugin.featRulesExtra) {
    LastAge.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
LastAge.featureRules = function(rules, name, sections, notes) {
  if(LastAge.basePlugin == window.Pathfinder) {
    for(var i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      var note = notes[i];
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        var pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  LastAge.basePlugin.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
LastAge.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  LastAge.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
LastAge.languageRules = function(rules, name) {
  LastAge.basePlugin.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features listed in #features#. If the path
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
LastAge.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots
) {
  if(LastAge.basePlugin == window.Pathfinder)
    LastAge.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots
    );
  else
    LastAge.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots
    );
  if(!name.match(/Domain/)) {
    rules.defineRule('features.' + name, 'heroicPath', '=', 'source == "' + name + '" ? 1 : null');
    rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
    rules.defineChoice('extras', name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Features');
  }
};

/*
 * Defines in #rules# the rules associated with heroic path #name# that cannot
 * be derived directly from the abilities passed to heroicPathRules.
 */
LastAge.pathRulesExtra = function(rules, name) {

  var pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  if(name == 'Beast') {

    rules.defineRule
      ('abilityNotes.abilityBoost', pathLevel, '+=', 'Math.floor(source / 5)');
    rules.defineRule
      ('combatNotes.rage', 'constitutionModifier', '=', '5 + source');
    rules.defineRule('combatNotes.bestialAura.1',
      'features.Bestial Aura', '?', null,
      'level', '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.bestialAura.2',
      'features.Bestial Aura', '?', null,
      'level', '=', 'source * 3 - 10',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.bestialAura.3',
      'features.Bestial Aura', '?', null,
      'level', '=', '3',
      'charismaModifier', '+', null,
      'features.Enhanced Bestial Aura', '+', '3'
    );
    rules.defineRule('combatNotes.rage.1',
      'features.Rage', '?', null,
      pathLevel, '+=', 'source >= 17 ? 2 : 1'
    );
    rules.defineRule('combatNotes.viciousAssault',
      'mediumViciousAssault', '=', null,
      'smallViciousAssault', '=', null
    );
    rules.defineRule('mediumViciousAssault',
      pathLevel, '=', 'source>=11 ? "d8" : source>=6 ? "d6" : "d4"'
    );
    rules.defineRule
      ('selectableFeatureCount.Beast', pathLevel, '=', 'source >= 16 ? 2 : 1');
    rules.defineRule('smallViciousAssault',
      'features.Small', '?', null,
      'mediumViciousAssault', '=', 'SRD35.SMALL_DAMAGE[source]'
    );

  } else if(name == 'Chanceborn') {

    rules.defineRule
      ('combatNotes.missChance', pathLevel, '+=', 'source >= 14 ? 10 : 5');
    rules.defineRule('featureNotes.luckOfHeroes',
      pathLevel, '=',
      '"d4" + (source >= 5 ? "/d6" : "") + (source >= 10 ? "/d8" : "") + ' +
      '(source >= 15 ? "/d10" : "") + (source >= 20 ? "/d12" : "")'
    );
    rules.defineRule('featureNotes.chancebornSurvivor',
      pathLevel, '+=', 'Math.floor((source - 1) / 5)'
    );
    rules.defineRule('featureNotes.unfettered',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule
      ('features.Defensive Roll', 'features.Chanceborn Survivor', '=', '1');
    rules.defineRule
      ('features.Evasion', 'features.Chanceborn Survivor', '=', '1');
    rules.defineRule
      ('features.Slippery Mind', 'features.Chanceborn Survivor', '=', '1');
    rules.defineRule
      ('features.Uncanny Dodge', 'features.Chanceborn Survivor', '=', '1');

  } else if(name == 'Charismatic') {

    rules.defineRule
      ('abilityNotes.charismaBonus', pathLevel, '+=', 'Math.floor(source / 5)');
    rules.defineRule
      ('featureNotes.naturalLeader', pathLevel, '=', 'source >= 18 ? 2 : 1');
    rules.defineRule('magicNotes.inspiringOration',
      pathLevel, '+=', 'Math.floor((source + 1) / 5)'
    );

  } else if(name == 'Dragonblooded') {

    rules.defineRule('magicNotes.bolsterSpell',
      pathLevel, '+=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('magicNotes.bonusSpellEnergy',
      pathLevel, '+=', 'source>=16 ? 8 : source>=11 ? 6 : source>=7 ? 4 : source>=3 ? 2 : null'
    );
    rules.defineRule('magicNotes.bonusSpells',
      pathLevel, '+=', 'source>=14 ? 3 : source>=8 ? 2 : source>=2 ? 1 : null'
    );
    rules.defineRule('magicNotes.frightfulPresence',
      pathLevel, '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.dragonbloodedImprovedSpellcasting',
      pathLevel, '+=', 'Math.floor(source / 6)'
    );
    rules.defineRule('magicNotes.improvedSpellPenetration',
      pathLevel, '+=', 'Math.floor((source - 5) / 4)'
    );

  } else if(name == 'Earthbonded') {

    rules.defineRule('combatNotes.naturalArmor',
      pathLevel, '+=', 'source >= 18 ? 3 : source >= 10 ? 2 : source >= 3 ? 1 : null'
    );
    rules.defineRule('skillNotes.stonecunning',
      'earthbondedFeatures.Stonecunning', '+=', '2'
    );

  } else if(name == 'Faithful') {

    rules.defineRule
      ('abilityNotes.wisdomBonus', pathLevel, '+=', 'Math.floor(source / 5)');
    rules.defineRule
      ('turningLevel', pathLevel, '+=', 'source < 4 ? null : source');
    // Override SRD35 turning frequency
    rules.defineRule('combatNotes.turnUndead.3',
      pathLevel, '=', 'Math.floor((source + 1) / 5)'
    );

  } else if(name == 'Fellhunter') {

    rules.defineRule('combatNotes.disruptingAttack',
      pathLevel, '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.disruptingAttack.1',
      pathLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.touchOfTheLiving',
      pathLevel, '+=', 'Math.floor((source + 3) / 5) * 2'
    );
    rules.defineRule('magicNotes.senseTheDead',
      pathLevel, '+=', '10 * (Math.floor((source + 4) / 5) + Math.floor((source + 1) / 5))'
    );
    rules.defineRule('magicNotes.senseTheDead.1',
      pathLevel, '=', null,
      'wisdomModifier', '+', null
    );
    rules.defineRule('saveNotes.wardOfLife',
      pathLevel, '=',
      '"extraordinary special attacks" + ' +
      '(source >= 8 ? ", ability damage" : "") + ' +
      '(source >= 13 ? ", ability drain" : "") + ' +
      '(source >= 18 ? ", energy drain" : "")'
    );

  } else if(name == 'Feyblooded') {

    rules.defineRule('abilityNotes.unearthlyGrace(Dexterity)',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.unearthlyGrace(AC)',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyGrace(Fortitude)',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyGrace(Reflex)',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyGrace(Will)',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('selectableFeatureCount.Feyblooded',
      pathLevel, '=', 'Math.floor(source / 4)'
    );
    rules.defineRule('magicNotes.feyVision',
      pathLevel, '=',
      'source >= 19 ? "all magic" : ' +
      'source >= 13 ? "enchantment and illusion" : "enchantment"'
    );

  } else if(name == 'Giantblooded') {

    rules.defineRule
      ('abilityNotes.fastMovement', pathLevel, '+=', 'source >= 12 ? 10 : 5');
    rules.defineRule('abilityNotes.strengthBonus',
      pathLevel, '+=', 'source >= 15 ? 2 : source >= 5 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.fearsomeCharge', pathLevel, '+=', 'source >= 18 ? 2 : 1');
    rules.defineRule('combatNotes.rockThrowing',
      pathLevel, '^=', 'source>=19?120 : source>=13?90 : source>=6?60 : 30'
    );
    rules.defineRule('debrisDamageDice',
      pathLevel, '=', 'source >= 16 ? "2d8" : source >= 9 ? "2d6" : null'
    );
    rules.defineRule('debrisRange', 'combatNotes.rockThrowing', '^=', null);
    rules.defineRule('skillNotes.intimidatingSize',
      pathLevel, '+=', 'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
    );
    rules.defineRule
      ('features.Large', 'features.Size Features (Large)', '=', null);
    rules.defineRule('weapons.Debris', 'combatNotes.rockThrowing', '=', '1');

  } else if(name == 'Guardian') {

    rules.defineRule('abilityNotes.constitutionBonus',
      'guardianLevel', '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.righteousFury',
      pathLevel, '+=', 'source >= 17 ? 12 : source >= 12 ? 9 : (Math.floor((source + 1) / 4) * 3)'
    );
    rules.defineRule('combatNotes.smiteEvil',
      pathLevel, '+=', 'source>=18 ? 4 : source>=14 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('combatNotes.smiteEvil.1',
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.smiteEvil.2', pathLevel, '=', null);
    rules.defineRule
      ('featureNotes.inspireValor', pathLevel, '=', 'source >= 13 ? 2 : 1');
    rules.defineRule('featureNotes.inspireValor.1', pathLevel, '=', null);
    rules.defineRule('featureNotes.inspireValor.2',
      pathLevel, '=', 'source >= 19 ? 3 : source >= 9 ? 2 : 1'
    );
    rules.defineRule('magicNotes.layOnHands',
      pathLevel, '+=', null,
      'charismaModifier', '*', null
    );
    rules.defineRule('saveNotes.auraOfCourage', pathLevel, '=', '30');

  } else if(name == 'Ironborn') {

    rules.defineRule('combatNotes.damageReduction',
      pathLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.improvedHealing',
      pathLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.naturalArmor',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('saveNotes.elementalResistance',
      pathLevel, '+=', 'Math.floor((source - 1) / 5) * 3'
    );
    rules.defineRule('saveNotes.elementalResistance.1',
      pathLevel, '=', 'source >= 6 ? "acid, cold, electricity, and fire" : null'
    );
    rules.defineRule('saveNotes.fortitudeBonus',
      pathLevel, '+=', 'Math.floor((source + 3) / 5)'
    );
    rules.defineRule('saveNotes.indefatigable',
      pathLevel, '=', 'source < 19 ? "fatigue" : "fatigue and exhaustion"'
    );

  } else if(name == 'Jack-Of-All-Trades') {

    rules.defineRule('featureNotes.jack-Of-All-TradesBonusFeats',
      pathLevel, '=', 'Math.floor(source / 7)'
    );
    rules.defineRule('magicNotes.spellChoice',
      pathLevel, '=',
      'source>=16 ? "Jack0/Jack1/Jack2/Jack3" : ' +
      'source>=10 ? "Jack0/Jack1/Jack2" : source>=6 ? "Jack0/Jack1" : "Jack0"'
    );
    rules.defineRule('magicNotes.spontaneousSpell',
      pathLevel, '=',
      'source>=19 ? "Jack0/Jack1/Jack2" : source>=13 ? "Jack0/Jack1" : "Jack0"'
    );
    rules.defineRule('abilityNotes.abilityBoost',
      pathLevel, '=', 'source>=18 ? 4 : source>=13 ? 3 : Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.saveBoost',
      pathLevel, '=', 'source>=15 ? 3 : source>=9 ? 2 : 1'
    );
    rules.defineRule('skillNotes.skillBoost',
      pathLevel, '=', 'source>=20 ? 4 : source>=17 ? 3 : source>=11 ? 2 : 1'
    );

  } else if(name == 'Mountainborn') {

    rules.defineRule('combatNotes.rallyingCry',
      pathLevel, '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('abilityNotes.constitutionBonus',
      pathLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.mountaineer',
      pathLevel, '+=', 'Math.floor((source + 4) / 5) * 2'
    );

  } else if(name == 'Naturefriend') {

    rules.defineRule
      ('combatNotes.animalFriend', 'charismaModifier', '=', '10 + source');
    rules.defineRule
      ('combatNotes.elementalFriend', 'charismaModifier', '=', '10 + source');
    rules.defineRule
      ('combatNotes.plantFriend', 'charismaModifier', '=', '10 + source');
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(name == 'Northblooded') {

    rules.defineRule('combatNotes.battleCry', pathLevel, '=', null);
    rules.defineRule('combatNotes.battleCry.1',
      pathLevel, '=', 'source>=17 ? 4 : source>=14 ? 3 : source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.frostWeapon', pathLevel, '=', null);
    rules.defineRule
      ('combatNotes.frostWeapon.1', pathLevel, '=', 'source >= 19 ? 2 : 1');
    rules.defineRule('abilityNotes.constitutionBonus',
      'northbloodedLevel', '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('featureNotes.howlingWinds',
      pathLevel, '=', 'source >= 12 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('featureNotes.howlingWinds.1', pathLevel, '=', null);
    rules.defineRule
      ('saveNotes.coldResistance', pathLevel, '+=', 'source >= 9 ? 15 : 5');
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(name == 'Painless') {

    rules.defineRule('combatNotes.increasedDamageThreshold',
      pathLevel, '+=', 'source >= 20 ? 25 : source >= 15 ? 20 : 15'
    );
    rules.defineRule('combatNotes.lastStand', pathLevel, '+=', '10 + source');
    rules.defineRule
      ('combatNotes.lastStand.1', pathLevel, '+=', 'source >= 19 ? 2 : 1');
    rules.defineRule('combatNotes.nonlethalDamageReduction',
      pathLevel, '+=', 'Math.floor((source + 3) / 5) * 3'
    );
    rules.defineRule('combatNotes.painless', pathLevel, '+=', null);
    rules.defineRule('combatNotes.retributiveRage', pathLevel, '+=', null);
    rules.defineRule('combatNotes.retributiveRage.1',
      pathLevel, '=', 'source >= 14 ? " and damage" : ""'
    );
    rules.defineRule('saveNotes.uncaringMind',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('saveNotes.painless',
      pathLevel, '=', 'Math.floor((source + 4) / 5) * 5'
    );

  } else if(name == 'Pureblood') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'purebloodHeroicPath', pathLevel,
       ['race == "Erenlander"']);
    rules.defineRule
      ('abilityNotes.abilityBoost', pathLevel, '+=', 'Math.floor(source / 5)');
    rules.defineRule('featureNotes.purebloodBonusFeats',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    // Override computation of skill mastery from Rogue feature so that we can
    // combine it with the Pureblood value.
    rules.defineRule('rogueSkillMastery',
      'rogueFeatures.Skill Mastery', '=', null,
      'intelligenceModifier', '*', 'source + 3'
    );
    rules.defineRule('skillNotes.skillMastery',
      'rogueFeatures.Skill Mastery', '=', 'null',
      'intelligenceModifier', '=', 'null',
      'rogueSkillMastery', '=', null,
      pathLevel, '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('skillNotes.bloodOfKings',
      pathLevel, '+=', 'Math.floor((source + 3) / 5) * 2'
    );
    rules.defineRule('skillNotes.masterAdventurer',
      pathLevel, '+=', 'Math.floor((source + 4) / 5) * 2'
    );

  } else if(name == 'Quickened') {

    rules.defineRule('abilityNotes.dexterityBonus',
      pathLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('abilityNotes.fastMovement',
      pathLevel, '+=', 'Math.floor((source + 2) / 5) * 5'
    );
    rules.defineRule('combatNotes.armorClassBonus',
      pathLevel, '+=', 'Math.floor((source + 3) / 5)'
    );
    rules.defineRule('combatNotes.burstOfSpeed',
      'constitutionModifier', '+=', 'source + 3'
    );
    rules.defineRule('combatNotes.burstOfSpeed.1',
      pathLevel, '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.defineRule('combatNotes.initiativeBonus',
      pathLevel, '+=', 'Math.floor((source + 4) / 5) * 2'
    );

  } else if(name == 'Seaborn') {

    rules.defineRule('abilityNotes.dolphin\'sGrace',
      pathLevel, '=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
    );
    rules.defineRule('deepLungsMultiplier',
      'seabornFeatures.Deep Lungs', '^=', '2',
      pathLevel, '+', 'source >= 6 ? 2 : 1'
    );
    rules.defineRule
      ('magicNotes.aquaticAlly', pathLevel, '+=', 'Math.floor(source / 4)');
    rules.defineRule('magicNotes.aquaticAlly.1',
      pathLevel, '=', '["","II","III","IV","V","VI"][Math.floor(source / 4)]'
    );
    rules.defineRule
      ('saveNotes.coldResistance', pathLevel, '+=', 'source >= 14 ? 5 : null');
    rules.defineRule('skillNotes.aquaticBlindsight',
      pathLevel, '+=', 'Math.floor((source + 5) / 8) * 30'
    );
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', null
    );
    rules.defineRule('abilityNotes.naturalSwimmer',
      pathLevel, '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
    );

  } else if(name == 'Seer') {

    rules.defineRule
      ('magicNotes.seerSight', pathLevel, '=', 'Math.floor((source + 6) / 6)');
    rules.defineRule('magicNotes.seerSight.1',
      pathLevel, '=', 'source >= 15 ? "year" : source >= 9 ? "month" : "day"'
    );

  } else if(name == 'Shadow Walker') {

    rules.defineRule('featureNotes.shadowJump',
      pathLevel, '+=', 'Math.floor(source / 4) * 10'
    );
    rules.defineRule('skillNotes.shadowVeil',
      pathLevel, '+=', 'Math.floor((source + 2) / 4) * 2'
    );

  } else if(name == 'Speaker') {

    rules.defineRule('abilityNotes.charismaBonus',
      'speakerLevel', '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('magicNotes.powerWords',
      pathLevel, '=',
      '"Opening" + (source >= 6 ? "/Shattering" : "") + ' +
                  '(source >= 9 ? "/Silence" : "") + ' +
                  '(source >= 13  ? "/Slumber" : "") + ' +
                  '(source >= 16 ? "/Charming" : "") + ' +
                  '(source >= 19 ? "/Holding" : "")'
    );
    rules.defineRule
      ('magicNotes.powerWords.1', 'charismaModifier', '=', 'source + 3');
    rules.defineRule
      ('magicNotes.powerWords.2', 'charismaModifier', '=', 'source + 10');
    rules.defineRule('skillNotes.persuasiveSpeaker',
      pathLevel, '=', 'source>=17 ? 8 : source>=11 ? 6 : source>=7 ? 4 : 2'
    );

  } else if(name == 'Spellsoul') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'spellsoulHeroicPath', pathLevel,
       ["Sum 'feats.Magecraft' == 0", "Sum 'feats.Spellcasting' == 0"]);
    rules.defineRule('magicNotes.bonusRawEnergy',
      pathLevel, '+=', 'source >= 18 ? 8 : source >= 13 ? 6 : source >= 9 ? 4 : source >= 4 ? 2 : null'
    );
    rules.defineRule('magicNotes.metamagicAura',
      pathLevel, '=',
      '["enlarge"].concat(source >= 5 ? ["extend"] : [])' +
                 '.concat(source >= 8 ? ["reduce"] : [])' +
                 '.concat(source >= 11 ? ["attract"] : [])' +
                 '.concat(source >= 14 ? ["empower"] : [])' +
                 '.concat(source >= 17 ? ["maximize"] : [])' +
                 '.concat(source >= 20 ? ["redirect"] : []).sort().join("/")'
    );
    rules.defineRule('magicNotes.metamagicAura.1',
      pathLevel, '=', 'Math.min(Math.floor(source / 2), 9)'
    );
    rules.defineRule('magicNotes.metamagicAura.2',
      pathLevel, '=', 'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
    );
    rules.defineRule('magicNotes.untappedPotential',
      'highestMagicModifier', '=', 'source + 1',
      'magicNotes.bonusRawEnergy', '+', null
    );
    rules.defineRule('saveNotes.spellsoulResistance',
      pathLevel, '=', 'source>=19 ? 5 : source>=16 ? 4 : source>=12 ? 3 : source>=7 ? 2 : source>=3 ? 1 : null'
    );

  } else if(name == 'Steelblooded') {

    var allFeats = rules.getChoices('feats');
    for(var feat in allFeats) {
      if(feat.match(/Weapon\s(Focus|Proficiency|Specialization)\s\(/)) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Steelblooded",');
      }
    }
    rules.defineRule('combatNotes.offensiveTactics',
      pathLevel, '+=', 'source>=17 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.skilledWarrior',
      pathLevel, '+=', 'source>=18 ? 4 : source>=13 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule('combatNotes.strategicBlow',
      pathLevel, '+=', 'source>=16 ? 15 : source>=12 ? 12 : source>=9 ? 9 : source>=6 ? 6 : 3'
    );
    rules.defineRule('combatNotes.untouchable',
      pathLevel, '=', 'source >= 19 ? "special attacks, move, standard, and full-round actions" : "special attacks"'
    );
    rules.defineRule
      ('featCount.Steelblooded', pathLevel, '=', '1 + Math.floor(source / 5)');

  } else if(name == 'Sunderborn') {

    rules.defineRule('combatNotes.planarFury',
      'constitutionModifier', '+=', 'source + 5'
    );
    rules.defineRule('combatNotes.planarFury.1',
      pathLevel, '+=', 'Math.floor((source + 2) / 6)'
    );
    rules.defineRule('skillNotes.bloodOfThePlanes',
      pathLevel, '+=', 'Math.floor((source + 1) / 3) * 2'
    );

  } else if(name == 'Tactician') {

    rules.defineRule('combatNotes.aidAnother(CombatBonus)',
      pathLevel, '+=', 'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : null'
    );
    rules.defineRule('combatNotes.combatOverview',
      pathLevel, '+=', 'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
    );
    rules.defineRule('combatNotes.coordinatedAttack',
      pathLevel, '+=', 'source>=17 ? 4 : source==16 ? 3 : Math.floor(source/4)'
    );
    rules.defineRule('combatNotes.coordinatedInitiative',
      pathLevel, '+=', 'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
    );

  } else if(name == 'Warg') {

    rules.defineRule('featureNotes.animalCompanion',
      pathLevel, '+=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('magicNotes.wildShape',
      pathLevel, '=',
      'source >= 19 ? "medium-huge" : ' +
      'source >= 11 ? "medium-large" : ' +
      'source >= 5 ? "medium" : null'
    );
    rules.defineRule('magicNotes.wildShape.1',
      pathLevel, '=', 'source >= 15 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('selectableFeatureCount.Warg',
      pathLevel, '=', 'source >= 16 ? 2 : source >= 9 ? 1 : null'
    );
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(name == 'Blessed') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'blessedHeroicPath', pathLevel,
       ["alignment =~ 'Good'"]);
    rules.defineRule('magicNotes.blessGround', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.grantProtection', pathLevel, '=', 'source<12 ? 1 : 2');
    rules.defineRule
      ('magicNotes.massCure', pathLevel, '=', 'source<15 ? 1 : 2');
    rules.defineRule('saveNotes.auraOfCourage', pathLevel, '=', '10');
    rules.defineRule('saveNotes.divineGrace',
      'charismaModifier', '=', 'source > 0 ? source : null'
    );

  } else if(name == 'Null') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'nullHeroicPath', pathLevel,
       ['sumMagecraft == 0', 'skills.Use Magic Device == 0',
        'levels.Charismatic Channeler == 0','levels.Hermetic Channeler == 0',
        'levels.Spiritual Channeler == 0']);
    rules.defineRule('featureNotes.nullField', pathLevel, '=', null);
    rules.defineRule
      ('magicNotes.senseMagic', 'wisdomModifier', '=', 'source + 3');
    rules.defineRule('saveNotes.magicResistance',
       pathLevel, '=', 'source<7 ? 1 : source<14 ? 2 : source<19 ? 3 : 4'
    );
    rules.defineRule('saveNotes.spellResistance',
       pathLevel, '=', 'Math.floor(source / 5) * 5 + 10'
    );
    rules.defineRule('skillNotes.senseMagic',
      pathLevel, '=', 'Math.floor((source + 4) / 5)',
      'wisdomModifier', '+', null,
      'intelligenceModifier', '+', '-source'
    );

  } else if(name == 'Shadowed') {

    rules.defineRule
      ('casterLevels.Domain', pathLevel, '=', 'source<5 ? null : 1');
    rules.defineRule('featureNotes.shadowedFrightfulPresence',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule
      ('magicNotes.giftOfIzrador', pathLevel, '=', 'Math.floor(source / 5)');
    rules.defineRule
      ('turningLevel', pathLevel, '+=', 'source < 4 ? null : source');
    // Override SRD35 turning frequency
    rules.defineRule('combatNotes.turnUndead.3', pathLevel, '=', '3');

  } else if(name == 'Wiser') {

    rules.defineRule('abilityNotes.intelligenceBonus',
      pathLevel, '+=', 'Math.floor(source / 5)'
    );
    rules.defineRule('skillNotes.insight',
      pathLevel, '=', 'source<7 ? 2 : source<12 ? 4 : source<17 ? 6 : 8',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('featureNotes.wiserBonusFeats',
      pathLevel, '=', 'Math.floor((source + 4) / 6) + (source == 19 ? 1 : 0)'
    );
    rules.defineRule('skillNotes.wiserSkillBonus',
      pathLevel, '=', 'source<3 ? 1 : source<6 ? 2 : source<9 ? 3 : source<11 ? 4 : source<13 ? 5 : source<16 ? 6 : source<18 ? 7 : 8'
    );

  } else if(LastAge.basePlugin.pathRulesExtra) {

    LastAge.basePlugin.pathRulesExtra(rules, name);

  }

};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
LastAge.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
) {
  LastAge.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spellSlots);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
LastAge.raceRulesExtra = function(rules, name) {

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  var raceLevel = prefix + 'Level';

  if(name == 'Agrarian Halfling') {
    rules.defineRule
      ('combatNotes.toughness', 'agrarianHalflingFeatures.Toughness', '+=', '3');
    rules.defineRule('selectableFeatureCount.Agrarian Halfling',
      'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
    );
  } else if(name == 'Danisil-Raised Elfling') {
    rules.defineRule('featureNotes.mixedBlood',
      'danisil-RaisedElflingFeatures.Mixed Blood', '=', '"Elf and Halfling"'
    );
  } else if(name == 'Clan Dwarf') {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('combatNotes.dwarfEnmity', raceLevel, '=', '1');
    rules.defineRule('combatNotes.naturalArmor', raceLevel, '+=', '2');
    rules.defineRule('skillNotes.stonecunning',
      'clanDwarfFeatures.Stonecunning', '+=', '2'
    );
  } else if(name == 'Dorn') {
    rules.defineRule('saveNotes.fortitudeBonus', raceLevel, '+=', '1');
    rules.defineRule('skillNotes.dornSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Dwarf-Raised Dwarrow') {
    rules.defineRule('combatNotes.naturalArmor', raceLevel, '+=', '1');
    rules.defineRule('featureNotes.mixedBlood',
      'dwarf-RaisedDwarrowFeatures.Mixed Blood', '=', '"Dwarf and Gnome"'
    );
    rules.defineRule('selectableFeatureCount.Dwarf-Raised Dwarrow',
      'race', '=', 'source == "Dwarf-Raised Dwarrow" ? 1 : null'
    );
    rules.defineRule('skillNotes.stonecunning',
      'dwarf-RaisedDwarrowFeatures.Stonecunning', '+=', '2'
    );
  } else if(name == 'Dworg') {
    rules.defineRule('combatNotes.dwarfEnmity', raceLevel, '=', '2');
    rules.defineRule('featureNotes.mixedBlood',
      'dworgFeatures.Mixed Blood', '=', '"Dwarf and Orc"'
    );
    rules.defineRule('selectableFeatureCount.Dworg',
      'race', '=', 'source == "Dworg" ? 1 : null'
    );
    rules.defineRule
      ('skillNotes.stonecunning', 'dworgFeatures.Stonecunning', '+=', '2');
  } else if(name == 'Halfling-Raised Elfling') {
    rules.defineRule('featureNotes.mixedBlood',
      'halfling-RaisedElflingFeatures.Mixed Blood', '=', '"Elf and Halfling"'
    );
  } else if(name == 'Erenlander') {
    rules.defineRule
      ('skillNotes.erenlanderSkillBonus', raceLevel, '=', '(source + 3) * 2');
  } else if(name == 'Gnome') {
    rules.defineRule
      ('abilityNotes.naturalSwimmer', 'speed', '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('deepLungsMultiplier', 'gnomeFeatures.Deep Lungs', '=', '3');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
    rules.defineRule('saveNotes.fortitudeBonus', raceLevel, '+=', '1');
    for(var s in rules.getChoices('skills')) {
      if(s.startsWith('Perform'))
        rules.defineRule
          ('skillModifier.' + s, 'skillNotes.naturalRiverfolk', '+', '2');
    }
  } else if(name == 'Gnome-Raised Dwarrow') {
    rules.defineRule('abilityNotes.naturalSwimmer',
      'speed', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.naturalArmor', raceLevel, '+=', '1');
    rules.defineRule('deepLungsMultiplier',
      'gnome-RaisedDwarrowFeatures.Deep Lungs', '=', '3'
    );
    rules.defineRule('featureNotes.mixedBlood',
      'gnome-RaisedDwarrowFeatures.Mixed Blood', '=', '"Dwarf and Gnome"'
    );
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
  } else if(name == 'Jungle Elf') {
    rules.defineRule('magicNotes.bonusSpellEnergy', raceLevel, '+=', '2');
    rules.defineRule
      ('magicNotes.innateMagic', 'magicNotes.bonusInnateSpell', '+', '1');
  } else if(name == 'Kurgun Dwarf') {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('combatNotes.dwarfEnmity', raceLevel, '=', '1');
    rules.defineRule('combatNotes.naturalArmor', raceLevel, '+=', '2');
  } else if(name == 'Nomadic Halfling') {
    rules.defineRule('selectableFeatureCount.Nomadic Halfling',
      'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
    );
  } else if(name == 'Orc') {
    rules.defineRule
      ('skillNotes.naturalPredator', 'strengthModifier', '=', null);
  } else if(name == 'Plains Sarcosan') {
    rules.defineRule
      ('skillNotes.sarcosanSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Sea Elf') {
    rules.defineRule('magicNotes.bonusSpellEnergy', raceLevel, '+=', '2');
    rules.defineRule
      ('abilityNotes.naturalSwimmer', 'speed', '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('deepLungsMultiplier', 'seaElfFeatures.Deep Lungs', '=', '6');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
  } else if(name == 'Snow Elf') {
    rules.defineRule('magicNotes.bonusSpellEnergy', raceLevel, '+=', '2');
    rules.defineRule('saveNotes.fortitudeBonus', raceLevel, '+=', '1');
  } else if(name == 'Urban Sarcosan') {
    rules.defineRule
      ('skillNotes.sarcosanSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Wood Elf') {
    rules.defineRule('magicNotes.bonusSpellEnergy', raceLevel, '+=', '3');
    rules.defineRule
      ('magicNotes.innateMagic', 'magicNotes.bonusInnateSpell', '+', '1');
    rules.defineRule('skillNotes.woodElfSkillBonus', raceLevel, '=', 'source');
  }

  // Since we inherit no races, no need to invoke basePlugin.raceRulesExtra

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
LastAge.schoolRules = function(rules, name, features) {
  LastAge.basePlugin.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills and yields a
 * #spellFail# percent chance of arcane spell failure.
 */
LastAge.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  LastAge.basePlugin.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability#. #untrained#, if specified, is a boolean indicating
 * whether or not the skill can be used untrained; the default is true.
 * #classes# lists the classes for which this is a class skill; a value of
 * "all" indicates that this is a class skill for all classes. #synergies#
 * lists any synergies with other skills and abilities granted by high ranks in
 * this skill.
 */
LastAge.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  LastAge.basePlugin.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects.
 */
LastAge.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell
) {
  LastAge.basePlugin.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell);
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
  LastAge.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  rules.defineRule('icewoodLongbowDamageModifier',
    'combatNotes.strengthDamageAdjustment', '=', 'source * 2'
  );
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
LastAge.choiceEditorElements = function(rules, type) {
  return LastAge.basePlugin.choiceEditorElements(rules, type);
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
LastAge.randomizeOneAttribute = function(attributes, attribute) {
  // TODO This ignores Collaborator and Shadowed domain spells
  if(attribute == 'spells' && !('levels.Legate' in attributes)) {
    var attrs = this.applyRules(attributes);
    var spells = LastAge.rules.getChoices('spells');
    for(var attr in attrs) {
      var matchInfo = attr.match(/^spellSlots\.([A-Z][A-Za-z]*)([0-9])$/);
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
    LastAge.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
LastAge.getPlugins = function() {
  return [LastAge.basePlugin].concat(LastAge.basePlugin.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
LastAge.ruleNotes = function() {
  return '' +
    '<h2>LastAge Quilvyn Plugin Notes</h2>\n' +
    'LastAge Quilvyn Plugin Version ' + LastAge.VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Racial origin choices (Plains or Urban Sarcosan, Clan or Kurgun\n' +
    '    Dwarf, etc.) are absorbed into the list of races.\n' +
    '  </li><li>\n' +
    '    Quilvyn uses Conjuration and Evocation to represent the lesser\n' +
    '    schools. This simplifies the spell list and treats legate and\n' +
    '    druid spells from these schools as the lesser variety. It also\n' +
    '    makes the Greater Spellcasting feat moot; use Spellcasting\n' +
    '    (Greater Conjuration) or Spellcasting (Greater Evocation) instead.\n' +
    '  </li><li>\n' +
    '    Quilvyn adds <i>Quench</i> to the Channeler spell list for use by\n' +
    '    the Snow Witch prestige class.\n' +
    '  </li><li>\n' +
    '    The level 4 Beast spell <i>Bear\'s Endurance</i> is corrected to\n' +
    '    <i>Bull\'s Endurance</i>.\n' +
    '  </li><li>\n' +
    '    The level 14 Seer spell <i>Divination</i> is corrected to <i>Find\n' +
    '    The Path</i>.\n' +
    '  </li><li>\n' +
    '    Quilvyn uses the Bane Of Legates class skill list from the\n' +
    '    <a href="http://www.jodaf.com/dnd/Midnight/Resources/MN2E-Errata.pdf">MN2E Errata and Clarifications</a>.\n' +
    '  </li><li>\n' +
    '    Quilvyn renames the Wogren Rider "Coordinated Attack" feature as\n' +
    '    "Joint Attack" to distinguish it from the Tactician feature.\n'+
    '  </li><li>\n' +
    '    The Wogren Rider selectable features "Improved Ride-By Attack",\n' +
    '    "Improved Spirited Charge", and "Improved Trample" only apply if\n' +
    '    the character already has the corresponding unimproved feat.\n' +
    '    Select the "Ride-By Attack", "Spirited Charge", and "Trample"\n' +
    '    selectable features otherwise.\n' +
    '  </li><li>\n' +
    '    The selectable feature list for Wildlanders includes "Alertness"\n' +
    '    and "Improved Initiative" directly, instead of the "Rapid Response"\n'+
    '    trait that allows a choice between these two feats.\n' +
    '  </li><li>\n' +
    '    Quilvyn removes the racial requirement (Elf or Halfling) from the\n' +
    '    Innate Magic feat. Since these races automatically receive this\n' +
    '    feat, enforcing the requirement would eliminate the possibility\n' +
    '    of any character selecting the feat.\n' +
    '  </li><li>\n' +
    '    The <i>Sorcery And Shadow</i> source book describes the Art Of\n' +
    '    Magic and Improved Spellcasting features differently than does the\n' +
    '    core rulebook. Quilvyn uses the core rulebook definitions, changing\n'+
    '    prestige class features as appropriate.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Variable language proficiency and synergies are not reported.\n' +
    '  </li><li>\n' +
    '    Quilvyn treats characters who receive Weapon Familiarity with a\n' +
    '    choice from a set of weapons as familiar with all of those weapons.\n'+
    '  </li><li>\n' +
    '    For characters with the Naturefriend heroic path, Quilvyn makes\n' +
    '    Knowledge (Nature) and Survival class skills and gives a +2 bonus\n' +
    '    in those skills, rather than applying the bonus only if the\n' +
    '    character already has those as class skills.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    The bonuses of the Feyblooded Unearthly Grace feature rise as the\n' +
    '    character advances in level, rather than remaining fixed as\n'+
    '    specified in the rule book.\n' +
    '  </li><li>\n' +
    '    When randomizing heroic path spells, Quilvyn may assign spells of\n' +
    '    equal level in the wrong order. For example, Quilvyn may give a\n' +
    '    Seer <i>Locate Object</i> at level 2 and <i>Augury</i> at level 5,\n' +
    '    rather than the reverse as specified in the rules.\n' +
    '  </li><li>\n' +
    '    Quilvyn gives Wildlander characters boosts in both initiative and\n' +
    '    skills at levels 6, 9, 12, etc. instead of a choice of the two.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>';
};
