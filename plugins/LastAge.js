/*
Copyright 2023, James J. Hayes

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
/* jshint forin: false */
/* globals Quilvyn, QuilvynRules, QuilvynUtils, SRD35, Pathfinder */
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

  let usePathfinder =
    window.Pathfinder != null && Pathfinder.SRD35_SKILL_MAP != null &&
    baseRules != null && baseRules.includes('Pathfinder');

  let rules = new QuilvynRules(
    'Midnight - ' + (usePathfinder ? 'Pathfinder 1E' : 'SRD v3.5'),
    LastAge.VERSION
  );
  rules.plugin = LastAge;
  rules.basePlugin = usePathfinder ? Pathfinder : SRD35;
  LastAge.rules = rules;

  LastAge.CHOICES =
    rules.basePlugin.CHOICES.filter(x => !x.match(/Deity|Faction/)).concat(LastAge.CHOICES_ADDED);
  rules.defineChoice('choices', LastAge.CHOICES);
  rules.choiceEditorElements = LastAge.choiceEditorElements;
  rules.choiceRules = LastAge.choiceRules;
  rules.removeChoice = SRD35.removeChoice;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = rules.basePlugin.getFormats || SRD35.getFormats;
  rules.getPlugins = LastAge.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = LastAge.randomizeOneAttribute;
  LastAge.RANDOMIZABLE_ATTRIBUTES =
    rules.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (LastAge.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', LastAge.RANDOMIZABLE_ATTRIBUTES);
  delete rules.getChoices('random').deity;
  rules.getChoices = SRD35.getChoices;
  rules.ruleNotes = LastAge.ruleNotes;

  if(usePathfinder) {
    SRD35.ABBREVIATIONS.CMB = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS.CMD = 'Combat Maneuver Defense';
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
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,nPCs');

  LastAge.ALIGNMENTS = Object.assign({}, rules.basePlugin.ALIGNMENTS);
  LastAge.ANIMAL_COMPANIONS = Object.assign(
    {}, rules.basePlugin.ANIMAL_COMPANIONS, LastAge.ANIMAL_COMPANIONS_ADDED
  );
  LastAge.ARMORS = Object.assign({}, rules.basePlugin.ARMORS);
  LastAge.CLASSES.Barbarian =
    rules.basePlugin.CLASSES.Barbarian + ' ' +
    LastAge.CLASS_FEATURES.Barbarian;
  LastAge.CLASSES.Fighter =
    rules.basePlugin.CLASSES.Fighter + ' ' +
    LastAge.CLASS_FEATURES.Fighter;
  LastAge.CLASSES.Rogue =
    rules.basePlugin.CLASSES.Rogue + ' ' + LastAge.CLASS_FEATURES.Rogue;
  LastAge.NPC_CLASSES.Aristocrat =
    rules.basePlugin.NPC_CLASSES.Aristocrat;
  LastAge.NPC_CLASSES.Commoner = rules.basePlugin.NPC_CLASSES.Commoner;
  LastAge.NPC_CLASSES.Expert = rules.basePlugin.NPC_CLASSES.Expert;
  LastAge.NPC_CLASSES.Warrior = rules.basePlugin.NPC_CLASSES.Warrior;
  LastAge.FAMILIARS = Object.assign({}, rules.basePlugin.FAMILIARS);
  LastAge.FEATS =
    Object.assign({}, rules.basePlugin.FEATS, LastAge.FEATS_ADDED);
  LastAge.FEATURES =
    Object.assign({}, rules.basePlugin.FEATURES, LastAge.FEATURES_ADDED);
  LastAge.GOODIES = Object.assign({}, rules.basePlugin.GOODIES);
  LastAge.SHIELDS = Object.assign({}, rules.basePlugin.SHIELDS);
  LastAge.SKILLS =
    Object.assign({}, rules.basePlugin.SKILLS, LastAge.SKILLS_ADDED);
  for(let skill in LastAge.SKILLS) {
    LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
  }
  delete LastAge.SKILLS['Knowledge (Planes)'];
  delete LastAge.SKILLS['Knowledge (Religion)'];
  LastAge.SPELLS = Object.assign({}, LastAge.SPELLS_ADDED);
  for(let s in rules.basePlugin.SPELLS) {
    let m = rules.basePlugin.SPELLS[s].match(/\b[BDW][01]|\b(C|Death|Destruction|Evil|Magic|War)[0-9]/g);
    if(m == null && !(s in LastAge.SPELLS_LEVELS))
      continue;
    let spellAttrs = rules.basePlugin.SPELLS[s] + ' Level=';
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
    Object.assign({}, rules.basePlugin.WEAPONS, LastAge.WEAPONS_ADDED);
  if(usePathfinder) {
    let domainObjects =
      Object.assign({}, LastAge.HEROIC_PATHS, LastAge.NPC_CLASSES, LastAge.PRESTIGE_CLASSES);
    for(let p in domainObjects) {
      if(!(domainObjects[p].includes('Domain')))
        continue;
      domainObjects[p] = domainObjects[p]
        .replace(/"([^=,]*)1:Deadly Touch"/, '"$11:Bleeding Touch","$18:Death\'s Embrace"')
        .replace(/"([^=,]*)1:Smite"/, '"$11:Destructive Smite","$18:Destructive Aura"')
        .replace(/"([^=,]*)1:Empowered Evil"/, '"$11:Touch Of Evil","$18:Scythe Of Evil"')
        .replace(/"([^=,]*)1:Arcane Adept"/, '"$11:Hand Of The Acolyte","$18:Dispelling Touch"')
        .replace(/"([^=,]*)1:Weapon Of War"/, '"$11:Arcane Adept","$18:Weapon Master"');
      if(p in LastAge.HEROIC_PATHS)
        LastAge.HEROIC_PATHS[p] = domainObjects[p];
      else if(p in LastAge.NPC_CLASSES)
        LastAge.NPC_CLASSES[p] = domainObjects[p];
      else if(p in LastAge.PRESTIGE_CLASSES)
        LastAge.PRESTIGE_CLASSES[p] = domainObjects[p];
    }
  }

  LastAge.abilityRules(rules);
  LastAge.aideRules(rules, LastAge.ANIMAL_COMPANIONS, LastAge.FAMILIARS);
  LastAge.combatRules(rules, LastAge.ARMORS, LastAge.SHIELDS, LastAge.WEAPONS);
  LastAge.magicRules(rules, LastAge.SCHOOLS, LastAge.SPELLS);
  // Feats must be defined before paths
  LastAge.talentRules
    (rules, LastAge.FEATS, LastAge.FEATURES, LastAge.GOODIES,
     LastAge.LANGUAGES, LastAge.SKILLS);
  LastAge.identityRules(
    rules, LastAge.ALIGNMENTS, LastAge.CLASSES, LastAge.DEITIES,
    LastAge.HEROIC_PATHS, LastAge.RACES, LastAge.PRESTIGE_CLASSES,
    LastAge.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

LastAge.VERSION = '2.4.1.1';

LastAge.CHOICES_ADDED = ['Heroic Path'];
LastAge.CHOICES =
  SRD35.CHOICES.filter(x => x != 'Deity').concat(LastAge.CHOICES_ADDED);
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
  'Spellcasting (Abjuration)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Conjuration)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Divination)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Enchantment)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Evocation)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Illusion)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Necromancy)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Transmutation)':'Type=Channeling,Spellcasting Require=sumMagecraft',
  'Spellcasting (Greater Conjuration)':
    'Type=Channeling,Spellcasting ' +
    'Require="features.Spellcasting (Conjuration)",sumMagecraft',
  'Spellcasting (Greater Evocation)':
    'Type=Channeling,Spellcasting ' +
    'Require="features.Spellcasting (Evocation)",sumMagecraft',
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

  // Fury of Shadow
  "Aruun's Bounty":
    'Type="Item Creation" ' +
    'Require="features.Brew Potion","sumItemCreationFeats >= 3"',
  'Greater Draw On Earth Power':
    'Type=General ' +
    'Require=' +
      '"wisdom >= 17",' +
      'skills.Concentration,' +
      '"features.Lesser Draw On Earth Power"',
  'Lesser Draw On Earth Power':
    'Type=General ' +
    'Require=' +
      '"wisdom >= 15",' +
      'skills.Concentration,' +
      '"features.Minor Draw On Earth Power"',
  'Minor Draw On Earth Power':
    'Type=General ' +
    'Require="wisdom >= 13",skills.Concentration',
  'Sister Trained':
    'Type=Metamagic ' +
    'Require="gender == \'Female\'",casterLevelArcane,"sumMetamagicFeats >= 3"',
  'Swamp Taught':'Type=Metamagic Require="race =~ \'Elf\'"',
  'Willow Schooled':'Type="Item Creation" Require="sumItemCreationFeats >= 3"',
  'Witch Sight':'Type=Metamagic Require="features.Spell Focus (Divination)"',

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
       'features.Weapon Focus (Throwing Axe) || ' +
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
      '"features.Power Attack"',

  // Under the Shadow
  'Fallen Courtier':'Type=General',
  'Legate Of The Bluff':
    'Type=General Require="levels.Legate >= 3","charisma >= 12"',
  'Shadow Cipher':
    'Type=General ' +
    'Require=' +
      '"features.Fallen Courtier",' +
      '"skills.Decipher Script >= 2",' +
      '"languages.Black Tongue"',
  'Shadow Killer':
    'Type=General Require="features.Fallen Courtier","sneakAttack >= 1"'

};
LastAge.FEATS = Object.assign({}, SRD35.FEATS, LastAge.FEATS_ADDED);
LastAge.FEATURES_ADDED = {

  // Override of 3.5 Magic Domain feature
  'Arcane Adept':
    'Section=magic ' +
    'Note="May use a magic device as Ch%{(levels.Legate||shadowedLevel)//2>?1}"',

  // Heroic Path
  'Ability Boost':
    // Best, Pureblood, and Jack-Of-All-Trades heroic paths
    'Section=ability ' +
    'Note="%{beastLevel||purebloodLevel?level//5:level<16?level//4:level<18?3:4} to distribute"',
  'Aid Another (Move)':'Section=combat Note="May aid another as a move action"',
  'Aid Another (Combat Bonus)':
    'Section=combat Note="Aided ally +%{(tacticianLevel+1)//5} attack or AC"',
  'Align Weapons':
    'Section=magic ' +
    'Note="May use <i>Align Weapon</i> (good) effects on %{charismaModifier>?1} weapons %{blessedLevel<18:1:2}/dy"',
  'Ambush':'Section=skill Note="Allies may use self Hide for an ambush"',
  'Ambush (Extra Damage)':
    'Section=combat ' +
    'Note="R30\' Allies gain +2 damage vs. flat-footed foes during surprise and 1st melee rd"',
  'Ambush (Quick)':
    'Section=skill Note="Hiding allies for an ambush takes half normal time"',
  'Ambush (Sniping)':
    'Section=combat Note="Reduces Hide penalty for using ranged weapons"',
  'Animal Companion':
    'Section=feature Note="Special bond and abilities w/up to %V animals"',
  'Animal Friend':
    'Section=combat,skill ' +
    'Note="Animals require a successful DC %{10+charismaModifier} Will to attack self",' +
         '"+4 Handle Animal"',
  'Aquatic Adaptation':
    'Section=save,skill ' +
    'Note=' +
      '"Suffers no underwater pressure damage",' +
      '"May breathe through gills"',
  'Aquatic Ally':
    'Section=magic ' +
    'Note="May use aquatic <i>Summon Nature\'s Ally %{seabornLevel<8?\'II\':seabornLevel<12?\'III\':seabornLevel<16?\'IV\':seabornLevel<20?\'V\':\'VI\'}</i> %{seabornLevel//4}/dy"',
  'Aquatic Blindsight':
    'Section=skill Note="R%{(seabornLevel+5)//8*30}\' Detects creatures in opaque water"',
  'Aquatic Emissary':'Section=skill Note="May speak to all aquatic animals"',
  'Assist Allies':
    'Section=skill ' +
    'Note="May allow allies to move in water at full speed and to hold their breath 5x longer"',
  'Aura Of Courage':
    'Section=save ' +
    'Note="Immune to fear/R%{guardianLevel?30:10}\' allies +4 vs. fear"',
  'Aura Of Warmth':
    'Section=magic Note="R10\' Allies gain +4 Fortitude vs. cold"',
  'Battle Cry':'Section=combat Note="May gain +%{northbloodedLevel} HP until end of battle %{northbloodedLevel<17?northbloodedLevel//7+1:4}/dy"',
  'Beast':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Magic Fang</i>%{level>=13 ? \' 2/dy\' : \'\'}' +
      '%{level>=4 ? \\", <i>Bear\'s Endurance</i>\\" : \'\'}%{level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level>=8 ? \', <i>Greater Magic Fang</i>\' : \'\'}%{level>=18 ? \' 2/dy\' : level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level>=9 ? \\", <i>Cat\'s Grace</i>\\" : \'\'}%{level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level>=14 ? \\", <i>Bull\'s Strength</i> 1/dy\\" : \'\'}' +
      '%{level>=19 ? \', <i>Freedom Of Movement</i> 1/dy\' : \'\'}' +
      '%{level<13 ? \' 1/dy\' : \'\'}"',
  'Bestial Aura':
    'Section=combat,skill,skill ' +
    'Note=' +
      '"May turn 2d6+%{beastLevel+charismaModifier} HD of animals of up to (d20+%{beastLevel*3-10+charismaModifier})/3 HD %{3+charismaModifier+(beastLevel>=12?3:0)}/dy",' +
      '"-10 Handle Animal",' +
      '"Cannot use Wild Empathy"',
  'Bless Ground':
    'Section=magic ' +
    'Note="R40\' Gives +4 vs. fear, shakes evil creatures, and inflicts <i>Fell Forbiddance</i> effects for %{blessedLevel} dy"',
  'Blessed':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Bless</i>%{level<9 ? \'\' : level<13 ? \' 2/dy\' : level<17 ? \' 3/dy\' : \' 4/dy\'}' +
      '%{level>=4 ? \', <i>Protection From Evil</i>\' : \'\'}%{level<9 ? \'\' : level<16 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=8 ? \', <i>Align Weapon</i>\' : \'\'}%{level<9 ? \'\' : level<18 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=11 ? \', <i>Magic Circle Against Evil</i> 1/dy\' : \'\'}' +
      '%{level>=19 ? \', <i>Dispel Evil</i> 1/dy\' : \'\'}' +
      '%{level>=20 ? \', <i>Holy Aura</i> 1/dy\' : \'\'}' +
      '%{level<9 ? \' 1/dy\' : \'\'}"',
  // Blindsense as SRD35
  'Blindsight':
    'Section=feature Note="R30\' Can maneuver and fight w/out vision"',
  'Blood Of Kings':
    'Section=skill ' +
    'Note="Choice of +%{(purebloodLevel+3)//5*2} Charisma skills in Shadow or resistance interactions each day"',
  'Blood Of The Planes':
    'Section=skill ' +
    'Note="+%{(sunderbornLevel+1)//3*2} Charisma skills with outsiders"',
  'Body Of The Blessed':
    'Section=feature ' +
    'Note="Improves reaction of non-evil creatures 1 step; evil creatures are hostile"',
  'Body Of The Shadowed':
    'Section=ability Note="Considered evil for spell effects"',
  'Bolster Spell':
    'Section=magic ' +
    'Note="+1 DC on %{dragonbloodedLevel//5+1} chosen spells"',
  'Bonus Raw Energy':'Section=magic Note="+%V"',
  'Bonus Spell Energy':'Section=magic Note="+%V Spell Energy"',
  'Bonus Spells':'Section=magic Note="+%V Channeler Spells"',
  'Burst Of Speed':
    'Section=combat ' +
    'Note="May gain an extra attack or move action for %{constitutionModifier+3} rd %{(quickenedLevel+1)//5}/dy; fatigued afterward"',
  'Chanceborn':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Resistance</i>' +
      '%{level>=7 ? \', <i>True Strike</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Aid</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Prayer</i>\' : \'\'}' +
      ' 1/dy"',
  'Charismatic':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Charm Person</i>' +
      '%{level>=2 ? \', <i>Remove Fear</i>\' : \'\'}' +
      '%{level>=3 ? \', <i>Hypnotism</i>\' : \'\'}' +
      '%{level>=7 ? \', <i>Aid</i>\' : \'\'}' +
      '%{level>=8 ? \', <i>Daze Monster</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Heroism</i>\' : \'\'}' +
      '%{level>=13 ? \', <i>Charm Monster</i>\' : \'\'}' +
      '%{level>=16 ? \', <i>Suggestion</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Greater Heroism</i>\' : \'\'}' +
      ' 1/dy"',
  'Charisma Bonus':'Section=ability Note="+%{level//5} Charisma"',
  'Cold Immunity':
    'Section=save Note="Suffers no damage from cold, x1.5 damage from fire"',
  'Cold Resistance':'Section=save Note="Resistance %V to cold"',
  'Coldness Of Shadow':
    'Section=feature,save ' +
    'Note=' +
      '"Gains no benefit from good-aligned casters",' +
      '"Immune to fear"',
  'Combat Overview':
    'Section=combat ' +
    'Note="R60\' May allow ally to avoid AOO or make foe flat-footed %{tacticianLevel<15?(tacticianLevel+2)//4:4}/dy"',
  'Constitution Bonus':'Section=ability Note="+%{level//5} Constitution"',
  'Coordinated Attack':
    'Section=combat ' +
    'Note="R30\' May allow all allies to attack the same foe at +1 per ally (maximum +5) %{tacticianLevel<16?tacticianLevel//4:tacticianLevel==16?3:4}/dy"',
  'Coordinated Initiative':
    'Section=combat ' +
    'Note="R30\' Allies may use self Initiative %{tacticianLevel<15?(tacticianLevel+1)//4:tacticianLevel==15?3:4}/dy"',
  // Damage Reduction as SRD35
  'Death Ward':
    'Section=save ' +
    'Note="Immune to death spells, death effects, energy drain, and negative energy effects"',
  'Deep Lungs':'Section=skill Note="May hold breath for %V rd"',
  // Detect Evil as SRD35
  'Detect Outsider':
    'Section=magic Note="May use <i>Detect Outsider</i> effects at will"',
  'Dexterity Bonus':'Section=ability Note="+%{level//5} Dexterity"',
  'Directed Attack':
    'Section=combat Note="R30\' May give ally +%{baseAttack//2} attack 1/dy"',
  'Disrupting Attack':
    'Section=combat ' +
    'Note="May destroy undead %{fellhunterLevel//5}/dy (DC %{10+fellhunterLevel//2+charismaModifier} Will neg)"',
  'Divine Grace':'Section=save Note="+%{charismaModifier>?0} Will"',
  "Dolphin's Grace":
    'Section=ability,skill Note="+%{seabornLevel>=15?60:seabornLevel>=7?40:20}\' Swim","+8 Swim (hazards)"',
  'Earthbonded':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Hold Portal</i>' +
      '%{level>=5 ? \', <i>Soften Earth And Stone</i>\' : \'\'}' +
      '%{level>=6 ? \', <i>Make Whole</i>\' : \'\'}' +
      '%{level>=7 ? \', <i>Spike Stones</i>\' : \'\'}' +
      '%{level>=9 ? \', <i>Stone Shape</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Meld Into Stone</i>\' : \'\'}' +
      '%{level>=13 ? \', <i>Transmute Rock To Mud</i>\' : \'\'}' +
      '%{level>=14 ? \', <i>Stoneskin</i>\' : \'\'}' +
      '%{level>=15 ? \', <i>Move Earth</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Stone Tell</i>\' : \'\'}' +
      '%{level>=19 ? \', <i>Earthquake</i>\' : \'\'}' +
      ' 1/dy"',
  'Elemental Friend':
    'Section=combat,skill ' +
    'Note=' +
      '"Elementals require a successful DC %{10+charismaModifier} Will to attack self",' +
      '"+4 Diplomacy (elementals)"',
  'Elemental Resistance':
    'Section=save Note="Resistance %V to acid, cold, electricity, and fire"',
  'Empowered Dispelling':'Section=magic Note="+2 dispel checks"',
  'Enhanced Bestial Aura':
    'Section=feature Note="R15\' Animals react negatively/Cannot ride"',
  'Extended Darkvision':'Section=feature Note="+30\' b/w vision in darkness"',
  'Faithful':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Bless</i>' +
      '%{level>=2 ? \', <i>Protection From Evil</i>\' : \'\'}' +
      '%{level>=3 ? \', <i>Divine Favor</i>\' : \'\'}' +
      '%{level>=6 ? \', <i>Aid</i>\' : \'\'}' +
      '%{level>=7 ? \', <i>Bless Weapon</i>\' : \'\'}' +
      '%{level>=8 ? \', <i>Consecrate</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Daylight</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Magic Circle Against Evil</i>\' : \'\'}' +
      '%{level>=13 ? \', <i>Prayer</i>\' : \'\'}' +
      '%{level>=16 ? \', <i>Holy Smite</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Dispel Evil</i>\' : \'\'}' +
      '%{level>=19 ? \', <i>Holy Aura</i>\' : \'\'}' +
      ' 1/dy"',
  'Fast Movement':'Section=ability Note="+%V Speed"',
  'Fearsome Charge':
    'Section=combat Note="May suffer -1 AC for +%{giantbloodedLevel<18?1:2} damage per 10\' in charge"',
  'Ferocity':'Section=combat Note="May continue fighting below 0 HP"',
  'Fey Vision':
    'Section=magic ' +
    'Note="May detect %{feybloodedLevel<13?\'enchantment\':feybloodedLevel<19?\'enchantment and illusion\':\'all magic\'} auras at will"',
  'Feyblooded':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Disguise Self</i>' +
      '%{level>=3 ? \', <i>Ventriloquism</i>\' : \'\'}' +
      '%{level>=5 ? \', <i>Magic Aura</i>\' : \'\'}' +
      '%{level>=6 ? \', <i>Invisibility</i>\' : \'\'}' +
      '%{level>=9 ? \', <i>Nondetection</i>\' : \'\'}' +
      '%{level>=10 ? \', <i>Glibness</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Deep Slumber</i>\' : \'\'}' +
      '%{level>=14 ? \', <i>False Vision</i>\' : \'\'}' +
      '%{level>=15 ? \', <i>Rainbow Pattern</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Mislead</i>\' : \'\'}' +
      '%{level>=18 ? \', <i>Seeming</i>\' : \'\'}' +
      ' 1/dy"',
  'Fortitude Bonus':
    'Section=save ' +
    'Note="+%{(ironbornLevel?(level+3)//5:0)+(race=~\'Dorn|Gnome|Snow Elf\'?1:0)} Fortitude"',
  'Frightful Presence':
    'Section=magic ' +
    'Note="R10\' Casting panics or shakes foes of lesser level (DC %{dragonbloodedLevel//2+10+charismaModifier} Will neg) for 4d6 rd"',
  'Frightful Presence (Shadowed)':
    'Section=feature ' +
    'Note="Frightens viewers (DC %{10+shadowedLevel//2+charismaModifier} Will neg)"',
  'Frost Weapon':
    'Section=combat ' +
    'Note="Inflicts +1d6 HP cold for %{northbloodedLevel} rd %{northbloodedLevel<19?1:2}/dy"',
  'Gift Of Izrador':'Section=magic Note="May learn %V level 1 domain spells"',
  'Grant Protection':
    'Section=magic ' +
    'Note="May use <i>Sanctuary</i> and <i>Shield Of Faith</i> effects on target %{blessedLevel<12?1:2}/dy"',
  'Greater Frost Weapon':
    'Section=combat Note="Inflicts +1d10 HP cold, crit +1 multiplier"',
  // Hide In Plain Sight as SRD35
  'Guardian':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Detect Evil</i>' +
      '%{level>=16 ? \', <i>Death Ward</i>\' : \'\'}' +
      ' at will"',
  'Healer':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Cure Light Wounds</i>%{level<3 ? \'\' : \' 2/dy\'}' +
      '%{level>=2 ? \', <i>Lesser Restoration</i>\' : \'\'}%{level<3 ? \'\' : \' 1/dy\'}' +
      '%{level>=4 ? \', <i>Cure Moderate Wounds</i>\' : \'\'}%{level<4 ? \'\' : level<6 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=5 ? \', <i>Remove Disease</i> 1/dy\' : \'\'}' +
      '%{level>=7 ? \', <i>Cure Serious Wounds</i>\' : \'\'}%{level<7 ? \'\' : level<9 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=8 ? \', <i>Remove Blindness/Deafness</i> 1/dy\' : \'\'}' +
      '%{level>=10 ? \', <i>Cure Critical Wounds</i>\' : \'\'}%{level<10 ? \'\' : level<12 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=11 ? \', <i>Neutralize Poison</i> 1/dy\' : \'\'}' +
      '%{level>=13 ? \', <i>Mass Cure Light Wounds</i>\' : \'\'}%{level<13 ? \'\' : level<15 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=14? \', <i>Restoration</i>\' : \'\'}%{level<14 ? \'\' : level<17 ? \' 1/dy\' : \' 2/dy\'}' +
      '%{level>=18 ? \', <i>Heal</i> 1/dy\' : \'\'}' +
      '%{level>=19 ? \', <i>Regenerate</i> 1/dy\' : \'\'}' +
      '%{level>=20 ? \', <i>Raise Dead</i> 1/dy\' : \'\'}' +
      '%{level<3 ? \' 1/dy\' : \'\'}"',
  'Howling Winds':
    'Section=feature ' +
    'Note="May gain answers to %{northbloodedLevel//4<?3} questions about surrounding %{northbloodedLevel} miles %{northbloodedLevel//4<?3}/dy"',
  'Imposing Presence':
    'Section=skill ' +
    'Note="+4 Intimidate (strangers)/+2 Diplomacy (Shadow minions)"',
  'Improved Battle Cry':'Section=combat Note="+1 attack and damage after cry"',
  'Improved Healing':'Section=combat Note="Regains %{ironbornLevel//2} HP/hr"',
  'Improved Healing (Ability Recovery)':
    'Section=combat Note="Regains 1 point of ability damage/hr"',
  'Improved Spell Penetration':
    'Section=magic Note="+%{(dragonbloodedLevel-5)//4} to overcome SR"',
  'Improved Spellcasting (Dragonblooded)':
    'Section=magic ' +
    'Note="Reduces Spell Energy cost of spells from %{dragonbloodedLevel//6} chosen schools by 1"',
  'Improved Stonecunning':
    'Section=skill ' +
    'Note="R5\' Makes automatic Search for concealed stone doors"',
  'Increased Damage Threshold':
    'Section=combat ' +
    'Note="May continue fighting until -%{painlessLevel<15?15:painlessLevel<20?20:25} HP"',
  'Indefatigable':
    'Section=save ' +
    'Note="Immune to %{ironbornLevel<19?\'fatigue\':\'fatigue and exhaustion\'} effects"',
  'Initiative Bonus':
    'Section=combat Note="+%{(quickenedLevel+4)//5*2} Initiative"',
  'Insight':
    'Section=skill ' +
    'Note="+%{(wiserLevel+3)//5*2+intelligenceModifier} skill check 1/dy"',
  'Inspire Valor':
    'Section=feature ' +
    'Note="R30\' Allies gain +%{guardianLevel<13?1:2} attack and fear saves for %{guardianLevel} rd %{(guardianLevel+1)//10+1}/dy"',
  'Inspiring Oration':
    'Section=magic ' +
    'Note="R60\' May apply spell-like ability to allies %{(charismaticLevel+1)//5}/dy"',
  'Intelligence Bonus':'Section=ability Note="+%{level//5} Intelligence"',
  'Intimidating Size':
    'Section=skill Note="+%{level<14?(level+1)//4*2:level<17?8:10} Intimidate"',
  'Incredible Resilience (Ironborn)':'Section=combat Note="+1 hit die step"',
  'Jack-Of-All-Trades Bonus Feats':
   'Section=feature Note="+%{level//7} General Feat"',
  'Language Savant':
    'Section=skill ' +
    'Note="Becomes fluent in any language after listening for 10 minutes"',
  'Last Stand':
    'Section=combat ' +
    'Note="At half HP, may gain 1 min of SR %{painlessLevel+10}, DR 15/-, resistance 30 to acid, cold, electricity, and fire, but suffer near death afterward, %{painlessLevel<19?1:2}/dy"',
  'Lay On Hands':'Section=magic Note="May harm undead or heal %{guardianLevel*charismaModifier} HP/dy"',
  // Leadership as SRD35
  'Luck Of Heroes':
    'Section=feature ' +
    'Note="May add d4%{(chancebornLevel>=5?\'/d6\':\'\')+(chancebornLevel>=10?\'/d8\':\'\')+(chancebornLevel>=15?\'/d10\':\'\')+(chancebornLevel>=20?\'/d12\':\'\')} to any d20 roll 1/dy"',
  'Magic Resistance':
    'Section=save ' +
    'Note="+%{nullLevel<7?1:nullLevel<14?2:nullLevel<19?3:4} vs. spells"',
  'Mass Cure':
    'Section=magic ' +
    'Note="May use <i>Mass Cure Light Wounds</i> effects centered on self %{blessedLevel<15?1:2}/dy"',
  'Master Adventurer':
    'Section=skill ' +
    'Note="+%{(purebloodLevel+4)//5*2} three chosen non-Charisma skills"',
  'Metamagic Aura':
    'Section=magic ' +
    'Note="R30\' May %{(spellsoulLevel>=11?\'attract, \':\'\')+(spellsoulLevel>=14?\'empower, \':\'\')+\'enlarge\'+(spellsoulLevel>=5?\', extend\':\'\')+(spellsoulLevel>=17?\', maximize\':\'\')+(spellsoulLevel>=20?\', redirect\':\'\')+(spellsoulLevel>=8?\', reduce\':\'\')} others\' spells of up to level %{spellsoulLevel//2<?9} %{spellsoulLevel<14?(spellsoulLevel+2)//4:spellsoulLevel==14?3:4}/dy"',
  'Miss Chance':
    'Section=combat Note="%{chancebornLevel<14?5:10}% chance of foe miss"',
  'Mountainborn':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Endure Elements</i>' +
      '%{level>=7 ? \', <i>Pass Without Trace</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Meld Into Stone</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Stone Tell</i>\' : \'\'}' +
      ' 1/dy"',
  'Mountaineer':
    'Section=skill,skill ' +
    'Note=' +
      '"+%V Balance/+%V Climb/+%V Jump",' +
      '"+%V Survival (mountains)"',
  // Natural Armor as SRD35
  'Natural Bond':
    'Section=skill ' +
    'Note="Knowledge (Nature) is a class skill/Survival is a class skill/+2 Knowledge (Nature)/+2 Survival"',
  'Natural Leader':
    'Section=feature Note=" +%{charismaticLevel<18?1:2} Leadership score"',
  'Naturefriend':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Calm Animals</i>' +
      '%{level>=3 ? \', <i>Entangle</i>\' : \'\'}' +
      '%{level>=4 ? \', <i>Obscuring Mist</i>\' : \'\'}' +
      '%{level>=6 ? \', <i>Animal Messenger</i>\' : \'\'}' +
      '%{level>=7 ? \', <i>Wood Shape</i>\' : \'\'}' +
      '%{level>=8 ? \', <i>Gust Of Wind</i>\' : \'\'}' +
      '%{level>=9 ? \', <i>Speak With Animals</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Speak With Plants</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Call Lightning</i>\' : \'\'}' +
      '%{level>=13 ? \', <i>Dominate Animal</i>\' : \'\'}' +
      '%{level>=14 ? \', <i>Spike Growth</i>\' : \'\'}' +
      '%{level>=16 ? \', <i>Sleet Storm</i>\' : \'\'}' +
      '%{level>=17 ? \\", <i>Summon Nature\'s Ally IV</i>\\" : \'\'}' +
      '%{level>=18 ? \', <i>Command Plants</i>\' : \'\'}' +
      '%{level>=19 ? \', <i>Ice Storm</i>\' : \'\'}' +
      ' 1/dy"',
  'Nonlethal Damage Reduction':
    'Section=combat Note="DR %{(painlessLevel+3)//5*3}/- non-lethal"',
  'Northborn':
    'Section=save,skill ' +
    'Note="Immune to non-lethal cold and exposure",' +
         '"+2 Survival (cold)/+2 Wild Empathy (cold natives)"',
  'Null':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Dispel Magic</i>%{level<8 ? \'\' : level<12 ? \' 2/dy\' : \' 3/dy\'}' +
      '%{level>=13 ? \', <i>Greater Dispel Magic</i> 1/dy\' : \'\'}' +
      '%{level>=17 ? \', <i>Spell Immunity</i> 1/dy\' : \'\'}' +
      '%{level>=18 ? \', <i>Antimagic Field</i> 1/dy\' : \'\'}' +
      '%{level<8 ? \' 1/dy\' : \'\'}"',
  'Null Field':
    'Section=feature ' +
    'Note="May conceal the auras of %{nullLevel} magical objects carried on person"',
  'Offensive Tactics':
    'Section=combat ' +
    'Note="+%{steelbloodedLevel>=17?4:steelbloodedLevel>=11?3:steelbloodedLevel>=7?2:1} to first attack or all damage when using a full-attack action"',
  'One With Nature':
    'Section=magic Note="May use <i>Commune With Nature</i> effects at will"',
  'Painless':
    'Section=combat,save ' +
    'Note=' +
      '"+%{painlessLevel} HP",' +
      '"+%{(painlessLevel+4)//5*5} vs. pain effects"',
  'Perfect Assault':
    'Section=combat ' +
    'Note="R30\' May allow allies to threaten crit on any hit 1/dy"',
  'Persuasive Speaker':
    'Section=skill ' +
    'Note="+%{speakerLevel>=17?8:speakerLevel>=11?6:speakerLevel>=7?4:2} verbal Charisma skills"',
  'Planar Fury':
    'Section=combat ' +
    'Note="May gain +2 Strength, +2 Constitution, and +1 Will and suffer -1 AC for %{constitutionModifier+5} rd %{(sunderbornLevel+2)//6}/dy"',
  'Plant Friend':
    'Section=combat,skill ' +
    'Note="Plants require a successful DC %{10+charismaModifier} Will to attack self",' +
         '"+4 Diplomacy (plants)"',
  'Power Words':
    'Section=magic ' +
    'Note="R60\' May use DC %{10+charismaModifier}+spell level <i>Word of Opening%{(speakerLevel>=6?\'/Shattering\':\'\')+(speakerLevel>=9?\'/Silence\':\'\')+(speakerLevel>=13?\'/Slumber\':\'\')+(speakerLevel>=16?\'/Charming\':\'\')+(speakerLevel>=19?\'/Holding\':\'\')}</i> %{charismaModifier+3}/dy"',
  'Pureblood Bonus Feats':
    'Section=feature Note="+%{(level+2)//5} General Feat"',
  'Quickened Counterspelling':
    'Section=magic Note="May counterspell as a move action 1/rd"',
  // Rage as SRD35
  'Rallying Cry':
    'Section=combat ' +
    'Note="May make allies not flat-footed and give +4 vs. surprise %{(mountainbornLevel+1)//5}/dy"',
  'Resistance (Spellsoul)':
    'Section=save ' +
    'Note="+%{spellsoulLevel<7?1:spellsoulLevel<12?2:spellsoulLevel<16?3:spellsoulLevel<19?4:5} vs. spells"',
  'Retributive Rage':
    'Section=combat ' +
    'Note="+%{painlessLevel} attack%{painlessLevel<14?\'\':\' and damage\'} for 1 rd after foe attack inflicts %{level*2} HP to self"',
  'Righteous Fury':'Section=combat Note="Ignores %{guardianLevel<15?(guardianLevel+1)//4*3:guardianLevel<17?9:12} points of evil foe DR"',
  'Rock Throwing':
    'Section=combat Note="May use debris as a R%V\' ranged weapon"',
  'Sanctify':
    'Section=magic ' +
    'Note="May combine <i>Hallow</i> and <i>Fell Forbiddance</i> effects 1/dy"',
  'Save Boost':'Section=save Note="%{level<9?1:level<15?2:3} to distribute"',
  'Scent':
    'Section=feature Note="R30\' May detect creatures and track by smell"',
  'Seaborn':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      "<i>Summon Nature's Ally %{level<8 ? 'II' : level<12 ? 'III 2/dy' : level<16 ? 'IV 3/dy' : level<20 ? 'V 4/dy' : 'VI 5/dy'}" +
      '%{level>=5 ? \', <i>Blur</i>\' : \'\'}%{level<8 ? \'\' : \' 1/dy\'}' +
      '%{level>=9 ? \', <i>Fog Cloud</i> 1/dy\' : \'\'}' +
      '%{level>=13 ? \', <i>Displacement</i> 1/dy\' : \'\'}' +
      '%{level<8 ? \' 1/dy\' : \'\'}"',
  'Seer':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Alarm</i>' +
      '%{level>=2 ? \', <i>Augury</i>\' : \'\'}' +
      '%{level>=4 ? \', <i>Clairaudience/Clairvoyance</i>\' : \'\'}' +
      '%{level>=5 ? \', <i>Locate Object</i>\' : \'\'}' +
      '%{level>=7 ? \', <i>Locate Creature</i>\' : \'\'}' +
      '%{level>=8 ? \', <i>Speak With Dead</i>\' : \'\'}' +
      '%{level>=10 ? \', <i>Divination</i>\' : \'\'}' +
      '%{level>=11 ? \', <i>Scrying</i>\' : \'\'}' +
      '%{level>=13 ? \', <i>Arcane Eye</i>\' : \'\'}' +
      '%{level>=14 ? \', <i>Find The Path</i>\' : \'\'}' +
      '%{level>=16 ? \', <i>Prying Eyes</i>\' : \'\'}' +
      '%{level>=17 ? \', <i>Legend Lore</i>\' : \'\'}' +
      '%{level>=19 ? \', <i>Commune</i>\' : \'\'}' +
      '%{level>=20 ? \', <i>Vision</i>\' : \'\'}' +
      ' 1/dy"',
  'Seer Sight':
    'Section=magic ' +
    'Note="May discern %{seerLevel}-%{seerLevel<9?\'day\':seerLevel<15?\'month\':\'year\'} history of touched object %{seerLevel//6+1}/dy"',
  'Sense Magic':
    'Section=magic,skill ' +
    'Note=' +
      '"May use <i>Detect Magic</i> effects %{wisdomModifier+3}/dy",' +
      '"+%{(level+4)//5+wisdomModifier-intelligenceModifier} Spellcraft"',
  'Sense The Dead':
    'Section=magic ' +
    'Note="R%{(fellhunterLevel+4)//5*20-(fellhunterLevel-1-(fellhunterLevel-1)%5<3?10:0)}\' May use <i>Detect Undead</i> effects (d20 + %{fellhunterLevel+wisdomModifier}; DC 10 + undead HD) at will"',
  'Shadow Jump':
    'Section=feature ' +
    'Note="May teleport %{shadowWalkerLevel//4*10}\' between shadows"',
  'Shadow Veil':'Section=skill Note="+%{(level+2)//4*2} Hide"',
  'Shadow Walker':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Expeditious Retreat</i>%{level>=13 ? \' 2/dy\' : \'\'}' +
      '%{level>=5 ? \', <i>Blur</i>\' : \'\'}%{level>=15 ? \' 2/dy\' level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level>=7 ? \', <i>Undetectable Alignment</i>\' : \'\'}%{level>=17 ? \' 2/dy\' level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level>=9 ? \', <i>Displacement</i>\' : \'\'}%{level>=19 ? \' 2/dy\' level>=13 ? \' 1/dy\' : \'\'}' +
      '%{level<13 ? \' 1/dy\' : \'\'}"',
  'Shadowed':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Detect Good</i>%{level<7 ? \'\' : \' 1/dy\'}' +
      ', <i>Detect Evil</i>%{level<7 ? \'\' : \' 1/dy\'}' +
      '%{level>=3 ? \', <i>Bane</i>\' : \'\'}%{level<7 ? \'\' : level<11 ? \' 2/dy\' : level<17 ? \' 3/dy\' : \' 4/dy\'}' +
      '%{level>=6 ? \', <i>Summon Monster I</i>\' : \'\'}%{level<7 ? \'\' : level<12 ? \' 1/dy\' : level<16 ? \' 2/dy\' : \' 3/dy\'}' +
      '%{level>=8 ? \', <i>Death Knell</i>\' : \'\'}%{level<13 ? \' 1/dy\' : level<18 ? \' 2/dy\' : \' 3/dy\'}' +
      '%{level<7 ? \' 1/dy\' : \'\'}"',
  'Size Features (Big)':
    'Section=combat,skill Note="May use Large weapons","-4 Hide"',
  'Size Features (Extra Reach)':'Section=combat Note="Has 15\' reach"',
  'Skill Boost':'Section=skill Note="+4 to %{level<11?1:level<17?2:level<20?3:4} chosen skills"',
  // Skill Mastery as SRD35
  'Skilled Warrior':
    'Section=combat ' +
    'Note="Suffers half normal penalty from %{(steelbloodedLevel+2)//5} choices of Fighting Defensively, Grapple, non-proficient Weapons, and Two-Weapon Fighting"',
  // Smite Evil as SRD35
  'Speaker':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Comprehend Languages</i>' +
      '%{level>=4 ? \', <i>Whispering Wind</i>\' : \'\'}' +
      '%{level>=8 ? \', <i>Tongues</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Shout</i>\' : \'\'}' +
      '%{level>=18 ? \', <i>Greater Shout</i>\' : \'\'}' +
      ' 1/dy"',
  'Spell Choice':
    'Section=magic Note="May use chosen Ch0%{(level>=6?\'/Ch1\':\'\')+(level>=10?\'/Ch2\':\'\')+(level>=16?\'/Ch3\':\'\')} spell as a spell-like ability 1/dy"',
  'Spell Resistance':'Section=save Note="SR %V"',
  'Spirit Sight (Darkness)':
    'Section=feature Note="+60\' b/w vision in darkness"',
  'Spirit Sight (Invisible)':
    'Section=feature Note="Can see invisible creatures"',
  'Spirit Sight (Magical Darkness)':
    'Section=feature Note="Can see clearly through any darkness"',
  'Spontaneous Spell':
    'Section=magic ' +
    'Note="May use any Ch0%{(level>=13?\'/Ch1\':\'\')+(level>=19?\'/Ch2\':\'\')} spell as a spell-like ability 1/dy"',
  'Steelblooded Bonus Feats':'Section=feature Note="%V selections"',
  'Stonecunning':
    'Section=feature,skill ' +
    'Note="May determine approximate depth underground",' +
         '"+%V Search (stone or metal), automatic check w/in 10\'"',
  'Strategic Blow':
    'Section=combat ' +
    'Note="Ignores %{steelbloodedLevel<15?steelbloodedLevel//3*3:steelbloodedLevel<16?12:15} points of foe DR"',
  'Strength Bonus':
    'Section=ability Note="+%{giantbloodedLevel<15?1:2} Strength"',
  'Sunderborn':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Summon Monster I</i>' +
      '%{level>=6 ? \', <i>Summon Monster II</i>\' : \'\'}' +
      '%{level>=9 ? \', <i>Summon Monster III</i>\' : \'\'}' +
      '%{level>=12 ? \', <i>Summon Monster IV</i>\' : \'\'}' +
      '%{level>=15 ? \', <i>Summon Monster V</i>\' : \'\'}' +
      '%{level>=18 ? \', <i>Summon Monster VI</i>\' : \'\'}' +
      ' 1/dy"',
  'Survivor (Chanceborn)':
    'Section=feature ' +
    'Note="May use Defensive Roll, Evasion, Slippery Mind, or Uncanny Dodge %{(chancebornLevel-1)//5}/dy"',
  'Take Ten':'Section=feature Note="May take 10 on any d20 roll 1/dy"',
  'Take Twenty':'Section=feature Note="May take 20 on any d20 roll 1/dy"',
  'Telling Blow':
    'Section=combat Note="R30\' May allow allies to re-roll damage 1/dy"',
  'Touch Of The Living':
    'Section=combat ' +
    'Note="Inflicts +%{(fellhunterLevel+3)//5*2} HP w/melee weapon vs. undead"',
  // Tremorsense as SRD35
  // Turn Undead as SRD35
  'Uncaring Mind':
    'Section=save Note="+%{(painlessLevel+2)//5} Will vs. enchantment"',
  'Unearthly Grace (AC)':
    'Section=combat ' +
    'Note="+%{feybloodedLevel//4<?charismaModifier} Armor Class"',
  'Unearthly Grace (Dexterity)':
    'Section=ability ' +
    'Note="+%{feybloodedLevel//4<?charismaModifier} Dexterity checks"',
  'Unearthly Grace (Fortitude)':
    'Section=save Note="+%{feybloodedLevel//4<?charismaModifier} Fortitude"',
  'Unearthly Grace (Reflex)':
    'Section=save Note="+%{feybloodedLevel//4<?charismaModifier} Reflex"',
  'Unearthly Grace (Will)':
    'Section=save Note="+%{feybloodedLevel//4<?charismaModifier} Will"',
  'Unfettered':
    'Section=feature ' +
    'Note="May ignore restrictions on movement for %{(chancebornLevel+2)//5} rd/dy"',
  'Untapped Potential':
    'Section=magic Note="R30\' May contribute %V Spell Energy to ally spells"',
  'Untouchable':'Section=combat Note="Special attacks%{steelbloodedLevel>=19?\', move, standard, and full-round actions\':\'\'} provoke no AOO"',
  'Vicious Assault':
    'Section=combat ' +
    'Note="May make two claw attacks that inflict 1d%{beastLevel<6?(features.Small?3:4):beastLevel<11?(features.Small?4:6):(features.Small?6:8)} each"',
  'Ward Of Life':'Section=save Note="Immune to undead extraordinary special attacks%{(fellhunterLevel>=8?\', ability damage\':\'\')+(fellhunterLevel>=13?\', ability drain\':\'\')+(fellhunterLevel>=18?\', energy drain\':\'\')}"',
  'Warg':
    'Section=magic ' +
    'Note=' +
      '"May use ' +
      '<i>Charm Animal</i>%{level>=12 ? \' 2/dy\' : \'\'}' +
      '%{level>=7 ? \', <i>Speak With Animals</i>\' : \'\'}%{level>=12 ? \' 2/dy\' : level>=12 ? \' 1/dy\' : \'\'}' +
      '%{level<12 ? \' 1/dy\' : \'\'}"',
  // Wild Empathy as SRD35
  // Wild Shape as SRD35
  'Wisdom Bonus':'Section=ability Note="+%{level//5} Wisdom"',
  'Wiser Bonus Feats':
    'Section=feature ' +
    'Note="+%{(level+4)//6+(level==19?1:0)} General Feat (Skill Focus)"',
  'Wiser Skill Bonus':
    'Section=skill ' +
    'Note="+%{level<3?1:level<6?2:level<9?3:level<11?4:level<13?5:level<16?6:level<18?7:8} Skill Points"',

  // Feats
  'Advanced Tempering':'Section=skill Note="Increases item hardness by 20%"',
  "Aruun's Bounty":'Section=magic Note="Potions brewed in Aruun cost half XP"',
  'Blood-Channeler':
    'Section=magic ' +
    'Note="Gains dbl Spell Energy for first two Constitution points lost"',
  'Born Of Duty':
    'Section=magic ' +
    'Note="R100\' Cry inflicts shaken on undead (DC %{level//2+10+charismaModifier} Will neg) and gives Dorn +2 vs. fear and enchantment 1/dy"',
  'Born Of The Grave':
    'Section=magic Note="R15\' May use <i>Deathwatch</i> effects at will"',
  'Canny Strike':
    'Section=combat ' +
    'Note="Inflicts +%{intelligenceModifier}d4 HP w/finesse weapon"',
  'Caste Status':'Section=feature Note="Gains benefits of caste level"',
  'Clear-Eyed':
    'Section=feature,skill ' +
    'Note=' +
      '"Suffers half distance penalty for approaching creatures/x2 normal vision in dim light when on plains",' +
      '"Spot is a class skill"',
  'Clever Fighting':
    'Section=combat ' +
    'Note="Inflicts +%{dexterityModifier-strengthModifier} HP w/finesse weapon"',
  'Clouding':
    'Section=skill ' +
    'Note="Item has half normal weight; thrown item has +10\' range"',
  'Craft Charm':
    'Section=magic Note="May use Craft to create a single-use magic item"',
  'Craft Greater Spell Talisman':
    'Section=magic ' +
    'Note="Talisman reduces Spell Energy cost of chosen school spells by 1"',
  'Craft Rune Of Power':'Section=magic Note="May imbue rune w/any known spell"',
  'Craft Spell Talisman':
    'Section=magic Note="Reduces Spell Energy cost of chosen spell by 1"',
  'Defiant':
    'Section=save ' +
    'Note="May delay effect of a failed Fort or Will save 1 rd and suffer dbl effect"',
  'Devastating Mounted Assault':
    'Section=combat Note="May make a full attack after mount moves"',
  'Drive It Deep':
    'Section=combat ' +
    'Note="May suffer up to -%{baseAttack} attack for equal damage bonus w/a light or one-handed weapon"',
  'Dwarvencraft':'Section=feature Note="Knows %V Dwarvencraft techniques"',
  'Extra Gift':
    'Section=feature ' +
    'Note="May use Mastery or Force Of Personality +4 times/dy"',
  'Fallen Courtier':
    'Section=feature,save,skill ' +
    'Note=' +
      '"May attempt to find Baden cache or safehouse",' +
      '"+2 to resist betraying Fallen Court",' +
      '"+2 Sense Motive (determine allegiance)/+2 to resist betraying Fallen Court"',
  'Fanatic':
    'Section=combat ' +
    'Note="+1 attack and divine spell benefits when within 60\' of a Shadow holy servant"',
  'Flexible Recovery':
    'Section=magic Note="Recovers 1 Spell Energy per hr rest, full after 6 hr"',
  'Friendly Agent':
    'Section=skill ' +
    'Note="+4 Diplomacy (convince allegiance)/+4 Sense Motive (determine allegiance)"',
  'Giant-Fighter':
    'Section=combat Note="+4 AC and dbl critical range w/in 30\' vs. giants"',
  'Greater Draw On Earth Power':
    'Section=magic ' +
    'Note="May draw %{wisdomModifier*3} Spell Energy/dy from a nearby ancient monolith"',
  'Greater Masterwork':
    'Section=skill ' +
    'Note="Weapon gains +2 attack and +1 damage; armor or shield gains -1 skill penalty, +1 maximum Dexterity bonus, and -5% arcane spell failure and can be donned or removed in half normal time; light shield may be used with a ranged weapon; other item gains +4 DC"',
  'Hardy':
    'Section=feature,magic ' +
    'Note=' +
      '"Remains functional on half food and sleep",' +
      '"Regains half Spell Energy after 4 hrs rest"',
  'Herbalist':'Section=magic Note="May create herbal concoctions"',
  'Huntsman':
    'Section=combat ' +
    'Note="After tracking 5 miles, gains +1 attack and damage for 1 dy if track attempt exceed DC by 5"',
  'Improved Flexible Recovery':
    'Section=magic ' +
    'Note="Successful DC 30 Concentration recovers %{highestMagicModifier} Spell Energy per hr meditating"',
  'Improved Masterwork':
    'Section=skill ' +
    'Note="Weapon gains +1 attack and damage; armor or shield gains -1 skill penalty and +1 maximum Dexterity bonus; other item gains +2 DC"',
  'Improvised Weapon':
    'Section=combat ' +
    'Note="Suffers no penalty w/improvised weapons and a -2 attack penalty for non-proficient weapons"',
  'Inconspicuous':
    'Section=skill ' +
    'Note="+2 Bluff (shadow)/+2 Diplomacy (shadow)/+2 Hide (shadow)/+2 Sense Motive (shadow)"',
  'Innate Magic':
    'Section=magic Note="May use %V %1 spells as at-will innate abilities"',
  'Knack For Charms':'Section=skill Note="+4 Craft (charms)"',
  'Knife Thrower':
    'Section=combat ' +
    'Note="R20\' +1 ranged attack w/racial knife/May draw a knife as a free action (move action for a hidden knife)"',
  'Legate Of The Bluff':
    'Section=skill ' +
    'Note="May make DC 10 Gather Information and Diplomacy checks to find a district resident and call in a lesser favor 1/dy; DC 25 for a greater favor %{charismaModifier}/month"',
  'Lesser Draw On Earth Power':
    'Section=magic ' +
    'Note="May draw %{wisdomModifier*2} Spell Energy/dy from a nearby menhir, dolmen, or tumuli"',
  'Living Talisman':
    'Section=magic Note="Chosen spell costs 1 fewer Spell Energy to cast"',
  'Lucky':'Section=save Note="+1 from luck charms and spells"',
  'Magic-Hardened':'Section=save Note="+2 vs. spells"',
  'Minor Draw On Earth Power':
    'Section=magic ' +
    'Note="May draw %{wisdomModifier} Spell Energy/dy from a nearby menhir or dolmen"',
  'Natural Healer':
    'Section=skill ' +
    'Note="Successful Heal raises patient to 1 HP and triples healing rate"',
  'Orc Slayer':
    'Section=combat,skill ' +
    'Note="+1 AC and melee damage vs. orcs and dworgs",' +
         '"-4 Charisma skills (orcs)"',
  'Pikeman':'Section=combat Note="May receive a charge as a move action"',
  'Plains Warfare':
    'Section=combat,save,skill ' +
    'Note="+1 AC when mounted on plains",' +
         '"+1 Reflex when mounted on plains",' +
         '"+2 Listen and Spot vs. surprise when mounted on plains"',
  'Power Reservoir':'Section=magic Note="Stores +%{highestMagicModifier} siphoned Spell Energy"',
  'Powerful Throw':
    'Section=combat ' +
    'Note="Attacks w/focused weapon gain +10\' range and use Strength instead of Dexterity"',
  'Quickened Donning':
    'Section=feature Note="Suffers no penalty for hastened donning"',
  'Reinforcing':
    'Section=skill ' +
    'Note="Item gains +5 HP; a light weapon suffers -1 attack and a ranged weapon -2"',
  'Resigned To Death':
     'Section=save Note="+4 vs. fear, suffers 1 step less intense on failure"',
  'Ritual Magic':'Section=magic Note="May learn and lead magic rituals"',
  'Sarcosan Pureblood':
    'Section=combat,skill ' +
    'Note="+2 AC (horseback)",' +
         '"+%{level+charismaModifier} Diplomacy (horses), +2 Charisma skills (horses and Sarcosans)"',
  'Sense Nexus':
    'Section=magic Note="Successful DC 15 Wisdom senses nexus w/in 5 miles"',
  'Sense Power':
    'Section=magic ' +
    'Note="May use <i>Detect Magic</i> %{wisdomModifier}/dy/Successful DC 13 Wisdom detects magical auras w/in 20\'"',
  'Shadow Cipher':
    'Section=skill ' +
    'Note="May take 10 or take 20 on Decipher Script (Shadow documents)"',
  'Shadow Killer':
    'Section=combat Note="Sneak attack on Shadow servant inflicts +1d6 HP"',
  'Shield Mate':
    'Section=combat ' +
    'Note="Adjacent allies gain +2 AC when self fighting defensively or using -2 Combat Expertise"',
  'Sister Trained':
    'Section=magic Note="May use any metamagic feat for dbl normal cost"',
  'Slow Learner':
    'Section=feature Note="May replace this later with another feat"',
  'Spell Knowledge':'Section=magic Note="+2 Channeler Spells"',
  'Spellcasting (%school)':
    'Section=magic Note="Knows 1 Channeler %school spell and may learn more"',
  'Stalwart':
    'Section=save ' +
    'Note="May delay dropping to negative HP for 1 rd; requires dbl healing afterward"',
  'Stealthy Rider':
    'Section=companion ' +
    'Note="Mount may use rider\'s Hide and Move Silently ranks"',
  'Subtle Caster':
    'Section=skill ' +
    'Note="+2 Bluff (disguise casting)/+2 Sleight Of Hand (disguise casting)"',
  'Swamp Taught':
    'Section=magic ' +
    'Note="May spend 1 Spell Energy for +%{level+(intelligenceModifier>?wisdomModifier)} knowledge check w/in Whisper"',
  'Tempering (Fireforged)':
    'Section=skill ' +
    'Note="Item immune to fire; light/medium/heavy armor gives fire resistance 2/3/4"',
  'Tempering (Icebound)':
    'Section=skill ' +
    'Note="Item immune to cold; light/medium/heavy armor gives cold resistance 2/3/4"',
  'Tempering (Quick-Cooled)':
    'Section=skill ' +
    'Note="Increases item hardness by 40%; decreases item HP by half"',
  'Thick Skull':
    'Section=save ' +
    'Note="Successful DC 10+damage Fort retains 1 HP after a hit that would result in 0 or negative HP"',
  'Touched By Magic':
    'Section=magic,save Note="+2 Spell Energy","-2 vs. spells"',
  'Trapsmith':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Craft (Traps)/+2 Disable Device",' +
      '"+2 Search (find traps)"',
  'Tunnel Fighting':
    'Section=combat ' +
    'Note="Suffers no penalty to AC or attack w/a one-handed weapon when squeezing"',
  'Urban Intrigue':
    'Section=skill ' +
    'Note="May use Gather Information to counter investigations of self and allies"',
  'Warrior Of Shadow':
    'Section=combat ' +
    'Note="May spend 1 Turn Undead use for %{charismaModifier} rd of +%{charismaModifier} damage"',
  'Well-Aimed Strike':
    'Section=combat Note="Canny Strike and Clever Fighting apply to all foes"',
  'Whirlwind Charge':
    'Section=combat Note="May attack all adjacent foes after a charge"',
  'Whispering Awareness':
    'Section=feature Note="Successful DC 12 Wisdom hears Whispering Wood"',
  'Willow Schooled':'Section=magic Note="May recreate a legendary magic item"',
  'Witch Sight':
    'Section=magic ' +
    'Note="May use water as a divination focus w/in Erethor at half cost"',

  // Class
  'Adapter':
    'Section=skill ' +
    'Note="Gains +%{levels.Fighter<10?levels.Fighter-3:levels.Fighter<16?levels.Fighter*2-12:(levels.Fighter*3-27)} skill points or %{levels.Fighter<10?1 : levels.Fighter<16?2:3} additional class skills"',
  // Armor Class Bonus as SRD35
  'Art Of Magic':
    'Section=magic Note="+1 character level for maximum spell level"',
  'Astirax Companion':'Section=feature Note="Special bond and abilities"',
  'Channeler Bonus Feats':'Section=feature Note="%V Channeler feats"',
  'Channeler Spellcasting':'Section=feature Note="%V Spellcasting feats"',
  'Confident Effect':'Section=combat Note="+4 Mastery checks"',
  'Counterattack':'Section=combat Note="May take AOO on a foe miss 1/rd"',
  'Cover Ally':
    'Section=combat Note="May suffer damage in place of an adjacent ally 1/rd"',
  'Danger Sense':
    'Section=combat,skill Note="+%V Initiative","+%V Listen/+%V Spot"',
  'Defender Abilities':
    'Section=combat ' +
    'Note="May use Counterattack, Cover Ally, Defender Stunning Fist, Devastating Strike, Rapid Strike, Retaliatory Strike, Strike And Hold, or Weapon Trap %{levels.Defender*3/4+3+level/4}/dy"',
  'Defender Stunning Fist':
    'Section=combat Note="May stun struck foe (DC %{levels.Defender//2+10+strengthModifier} Fort neg) for 1 rd %{levels.Defender+3+nonDefenderClassLevels//4}/dy"',
  'Defensive Mastery':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Devastating Strike':
    'Section=combat ' +
    'Note="May Bull Rush stunned opponent as a free action w/no AOO"',
  'Divine Enhancement':
    'Section=combat ' +
    'Note="May spend a spell slot to gain a spell level bonus to attack and damage %{($\'levels.Legate Martial\'+1)//3+charismaModifier}/dy"',
  'Dodge Training':'Section=combat Note="+%V Armor Class"',
  'Drain Vitality':
    'Section=magic ' +
    'Note="Using an <i>Inflict</i> spell restores an equal amount of HP to self"',
  'Flurry Attack':
    'Section=combat ' +
    'Note="Reduces two-weapon off hand penalty by %{$\'defenderFeatures.Flurry Attack\'}"',
  'Foe Specialty':
    'Section=skill ' +
    'Note="May take 10 on Knowledge checks about a creature type chosen each day"',
  'Furious Grapple':
    'Section=combat ' +
    'Note="Successful additional Grapple during grapple allows an additional action 1/rd"',
  'Grappling Training':
    'Section=combat Note="May use Grapple to Disarm, Sunder, or Trip"',
  'Greater Confidence':
    'Section=magic ' +
    'Note="May use <i>Break Enchantment</i> effects every 5 rd during Inspire Confidence"',
  'Greater Fury':
    'Section=magic ' +
    'Note="R30\' May use Inspire Fury to give self or an ally +2d10 HP, +2 Attack, and +1 Fortitude"',
  'Hated Foe':
    'Section=combat ' +
    'Note="May make an additional Hunter\'s Strike vs. Master Hunter creature"',
  'Heightened Effect':'Section=combat Note="+2 level for Mastery checks"',
  'Hunted By The Shadow':
    'Section=combat Note="Never surprised by Shadow servants"',
  "Hunter's Strike":'Section=combat Note="x2 damage %{levels.Wildlander//4+($\'levels.Ancestral Foe\'||0)//3}/dy"',
  'Improved Confidence':
    'Section=magic ' +
    'Note="Allies who fail save enchanted for half duration, fear reduced"',
  'Improved Spellcasting':
    'Section=magic Note="+%V Spell Energy/+%1 Channeler Spells"',
  'Improved Fury':
    'Section=magic ' +
    'Note="+1 Initiative, Attack, and Damage during Inspire Fury"',
  'Improved Woodland Stride':
    'Section=feature Note="May move normally through enchanted terrain"',
  'Increase Morale':
    'Section=combat ' +
    'Note="R60\' May allow allies to recover from fear, gain +%V on next attack and damage, and gain +%1 AC for 1 rd 1/dy"',
  'Incredible Resilience':'Section=combat Note="+%V HP"',
  'Incredible Speed':'Section=ability Note="+%V Speed"',
  'Incredible Speed Or Resilience':'Section=feature Note="%V selections"',
  'Inspire Confidence':
    'Section=magic ' +
    'Note="R60\' Allies gain +4 save vs. enchantment and fear for %{$\'levels.Charismatic Channeler\'} rd"',
  'Inspire Fascination':
    'Section=magic ' +
    'Note="R120\' May hold %{$\'levels.Charismatic Channeler\'} creatures spellbound for %{$\'levels.Charismatic Channeler\'} rd (DC %{$\'levels.Charismatic Channeler\'//2+10+charismaModifier} Will neg)"',
  'Inspire Fury':
    'Section=magic ' +
    'Note="R60\' Allies gain +1 Initiative, attack, and damage for conc + 5 rd"',
  'Instinctive Response':'Section=combat Note="May re-roll Initiative"',
  'Knowledge Specialty':
    'Section=skill Note="+3 daily choice of Knowledge skill"',
  'Legate Martial Bonus Feats':'Section=feature Note="%V Legate Martial Feats"',
  'Literate':'Section=skill Note="+%V Language Count"',
  'Magecraft (Charismatic)':
    'Section=magic Note="Knows 3 B0 and 1 B1 spells/%V Spell Energy"',
  'Magecraft (Hermetic)':
    'Section=magic Note="Knows 3 W0 and 1 W1 spells/%V Spell Energy"',
  'Magecraft (Spiritual)':
    'Section=magic Note="Knows 3 D0 and 1 D1 spells/%V Spell Energy"',
  'Mass Suggestion':
    'Section=magic ' +
    'Note="May use <i>Suggestion</i> effects on %{$\'levels.Charismatic Channeler\'//3} fascinated creatures"',
  'Master Hunter':
    'Section=combat,skill ' +
    'Note="+2 or more damage vs. chosen creature type",' +
         '"+2 or more Bluff, Listen, Sense Motive, Spot and Survival vs. chosen creature type"',
  'Masterful Strike':'Section=combat Note="%V Unarmed damage"',
  'Mastery Of Nature':
    'Section=combat ' +
    'Note="R60\' May turn or rebuke %4d6+%1 HD of plants and animals of up to (d20+%2)/3 HD %3/dy"',
  'Mastery Of Spirits':
    'Section=combat ' +
    'Note="R60\' May exorcise %4d6+%1 HD of spirits of up to (d20+%2)/3 HD %3/dy"',
  'Mastery Of The Unnatural':
    'Section=combat ' +
    'Note="R60\' May turn or rebuke %4d6+%1 HD of constructs or outsiders of up to (d20+%2)/3 HD %3/dy"',
  'Offensive Training':
    'Section=combat ' +
    'Note="May blind or deafen stunned foe (DC %{14+levels.Defender//2+strengthModifier} Fort neg) for %{strengthModifier} rd"',
  'One With The Weapon':
    'Section=combat ' +
    'Note="May use Masterful Strike, Precise Strike, or Stunning Fist w/chosen weapon"',
  'Overland Stride':
    'Section=feature Note="May use Survival while moving at full speed"',
  'Powerful Effect':
    'Section=combat ' +
    'Note="Mastery Of Nature, Spirits, and The Unnatural inflict +1d6 HP"',
  'Precise Effect':
    'Section=combat ' +
    'Note="May choose a type of creature to affect w/Master Of Two Worlds"',
  'Precise Strike':
    'Section=combat ' +
    'Note="Ignores %{(levels.Defender+2)//6*3} points of foe DR"',
  'Quick Reference':
    'Section=skill ' +
    'Note="Reduces Lorebook scan penalty by %{$\'features.Quick Reference\' * 5}"',
  'Quick Stride':'Section=ability Note="+%V Speed"',
  'Rapid Strike':
    'Section=combat Note="May make an extra attack at highest attack bonus 1/rd"',
  'Retaliatory Strike':
    'Section=combat Note="May make AOO vs. a foe that strikes an ally 1/rd"',
  'Sense Dark Magic':
    'Section=feature,magic ' +
    'Note=' +
      '"May use Scent vs. a legate or outsider",' +
      '"May use <i>Detect Magic</i> effects vs. a legate or outsider at will"',
  'Sense Dark Magic (Legate)':
    'Section=magic ' +
    'Note="May use <i>Detect Magic</i> effects vs. a legate at will"',
  'Specific Effect':
    'Section=combat ' +
    'Note="May choose which individuals to affect w/Master Of Two Worlds"',
  'Speed Training':'Section=combat Note="May make an extra move action each rd"',
  'Spell Specialty':'Section=skill Note="+1 DC on spell chosen each day"',
  'Spontaneous Legate Spell':
    'Section=magic Note="May cast <i>Inflict</i> in place of known spell"',
  'Strike And Hold':
    'Section=combat Note="May make an extra unarmed attack to grab foe"',
  'Suggestion':
    'Section=magic ' +
    'Note="May use <i>Suggestion</i> effects on 1 fascinated creature (DC %{10+$\'levels.Charismatic Channeler\'//2+charismaModifier} Will neg)"',
  'Temple Dependency':
    'Section=magic Note="Must participate at a temple to receive spells"',
  'Tradition Gift (Force Of Personality)':
    'Section=magic ' +
    'Note="May use Inspire Confidence, Fascination, Fury, or Suggestion %V/dy"',
  'Tradition Gift (Lorebook)':
    'Section=skill ' +
    'Note="May attempt +%V Lorebook for sought info after 1 min study or scan at -10"',
  'Tradition Gift (Master Of Two Worlds)':
    'Section=magic ' +
    'Note="May control animals, plants, constructs, and/or spirits"',
  'True Aim':'Section=combat Note="x3 damage on Hunter\'s Strike"',
  // Turn Undead as heroic path
  'Universal Effect':
    'Section=combat ' +
    'Note="May use multiple Master Of Two Worlds powers simultaneously"',
  'Weapon Trap':
    'Section=combat ' +
    'Note="Successful attack to grab foe weapon allows choice of Disarm, damage, or AOO 1/rd"',
  'Wildlander Skill Mastery':
    'Section=feature,skill ' +
    'Note="+%V General Feat (Skill Focus)","Skill Mastery (%V skills)"',
  'Wildlander Traits':'Section=feature Note="%V selections"',
  'Wilderness Trapfinding':
    'Section=skill Note="May use Search to find and Survival to remove DC 20+ traps"',
  'Woodslore':
    'Section=skill Note="Automatic Search vs. trap or concealed door w/in 5\'"',

  // Race
  'Alert Senses':'Section=skill Note="+2 Listen/+2 Search/+2 Spot"',
  'At Home In The Trees':
    'Section=skill Note="+4 Balance (trees)/+4 Climb (trees)"',
  'Bonus Innate Spell':'Section=magic Note="+1 Innate Magic spell"',
  'Bound To The Beast':'Section=feature Note="Has Mounted Combat feature"',
  'Bound To The Spirits':
    'Section=feature Note="Has Magecraft (Spiritual) feature"',
  'Brotherhood':
    'Section=combat Note="+1 attack when fighting among 5+ Dorns"',
  'Cold Fortitude':
    'Section=save Note="+5 vs. cold/Suffers half nonlethal damage from cold"',
  'Cold Tolerance':
    'Section=save ' +
    'Note="Immune to non-lethal cold/Suffers half damage from lethal cold"',
  // Deep Lungs as heroic path
  'Dexterous Hands':'Section=skill Note="+2 Craft (non-metal or wood)"',
  'Dexterous Healer':'Section=skill Note="+2 Heal"',
  'Dorn Ability Adjustment':
    'Section=ability Note="+2 Strength/-2 Intelligence"',
  'Dorn Extra Feat':'Section=feature Note="+1 Fighter Feat"',
  'Dorn Skill Bonus':'Section=skill Note="+%V Skill Points"',
  'Double Knife Training':
    'Section=combat Note="Suffers half normal penalty from fighting w/2 knives"',
  'Double Urutuk Training':
    'Section=combat ' +
    'Note="Suffers half normal penalty from fighting w/2 urutuk hatchets"',
  'Double Sepi Training':
    'Section=combat Note="Suffers half normal penalty from fighting w/2 sepi"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Dwarf Enmity':'Section=combat Note="+1 attack vs. orcs"',
  'Dwarrow Ability Adjustment':'Section=ability Note="+2 Charisma"',
  'Dwarven Kin':'Section=combat,save Note="+1 AC","+2 vs. poison"',
  'Dworg Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Constitution/-2 Intelligence/-2 Charisma"',
  'Dworg Enmity':'Section=combat Note="+2 attack vs. orcs"',
  'Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Constitution"',
  'Elfling Ability Adjustment':
    'Section=ability Note="+4 Dexterity/-2 Strength/-2 Constitution"',
  'Erenlander Ability Adjustment':'Section=ability Note="+2 any/-2 any"',
  'Erenlander Extra Feats':'Section=feature Note="+2 General Feats"',
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
  'Fearlessness':'Section=save Note="+2 vs. fear"',
  'Feral Elf':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Listen/+2 Search/+2 Spot",' +
      '"+2 Balance (trees)/+2 Climb (trees)/+2 Survival (within Erethor)/+2 Knowledge (Nature) (within Erethor)"',
  'Fortunate':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Frenzied Valor':
    'Section=combat Note="+1 attack when fighting among 10+ Orcs"',
  'Gnome Ability Adjustment':'Section=ability Note="+4 Charisma/-2 Strength"',
  'Graceful':'Section=skill Note="+2 Climb/+2 Jump/+2 Move Silently/+2 Tumble"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Strength"',
  'Icewood Bow Focus':'Section=combat Note="+1 Icewood Bow Attack Modifier"',
  'Illiteracy':
    'Section=skill Note="Must spend 2 skill points to read and write"',
  'Keen Senses':'Section=skill Note="+2 Listen/+2 Spot"',
  'Light Sensitivity':'Section=combat Note="-1 attack in daylight"',
  'Minor Light Sensitivity':
    'Section=combat ' +
    'Note="Successful DC 15 Fort save required in sunlight to avoid -1 attack"',
  'Mixed Blood':'Section=feature Note="%V for special abilities and affects"',
  'Natural Channeler':'Section=magic Note="+%V Spell Energy"',
  'Natural Horseman':
    'Section=combat,skill ' +
     'Note="+1 melee damage on horseback/Suffers half ranged penalty on horseback",' +
          '"+4 Handle Animal (horse)/+4 Ride (horse)/+4 Concentration (horseback)"',
  'Natural Mountaineer':
    'Section=ability,skill ' +
    'Note="May move normally in mountainous terrain",' +
         '"+2 Climb"',
  'Natural Predator':'Section=skill Note="+%V Intimidate"',
  'Natural Riverfolk':
    'Section=ability,skill ' +
    'Note=' +
      '"May swim %{speed//2}\' as a move action",' +
      '"+2 Perform/+2 Profession (Sailor)/+2 Swim/+2 Use Rope"',
  'Natural Sailor':
    'Section=skill ' +
    'Note="+2 Craft (ship)/+2 Profession (ship)/+2 Use Rope (ship)"',
  'Natural Swimmer':
    'Section=ability,skill ' +
    'Note=' +
      '"May swim %V\' as a move action",' +
      '"+8 Swim (special action or avoid hazard)/May always take 10 on Swim/May run when swimming"',
  'Natural Trader':
    'Section=skill ' +
    'Note="+4 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading"',
  'Night Fighter':'Section=combat Note="+1 attack in complete darkness"',
  'Nimble':'Section=skill Note="+2 Climb/+2 Hide"',
  'Orc Ability Adjustment':
    'Section=ability Note="+4 Strength/-2 Intelligence/-2 Charisma"',
  'Orc Dodger':'Section=combat Note="+1 AC vs. orc"',
  'Orc Enmity':'Section=combat Note="+1 damage vs. dwarves"',
  'Quick':
    'Section=combat,save ' +
    'Note=' +
      '"+1 attack w/light weapons",' +
      '"+1 Reflex"',
  'Resilient':
    'Section=combat,save ' +
    'Note=' +
      '"+2 AC",' +
      '"+2 vs. poison"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantments"',
  'Resist Poison':'Section=save Note="+2 vs. poison"',
  'Resist Spells':'Section=save Note="+2 vs. spells"',
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
  'Spell Resistant':
    'Section=magic,save ' +
    'Note=' +
      '"-2 Spell Energy",' +
      '"+2 vs. spells"',
  'Spirit Foe':
    'Section=save,skill ' +
    'Note=' +
      '"+2 vs. outsiders",' +
      '"+4 Hide (nature)/+4 Move Silently (nature)"',
  'Stability':'Section=combat Note="+4 vs. Bull Rush and Trip"',
  'Steady':
    'Section=ability Note="No speed penalty in heavy armor or with heavy load"',
  'Stoneworker':
    'Section=skill Note="+2 Appraise (stone, metal)/+2 Craft (stone, metal)"',
  'Stout':'Section=feature Note="Has Endurance and Toughness features"',
  'Studious':'Section=feature Note="Has Magecraft (Hermetic) feature"',
  'Two-Handed Focus':
     'Section=combat Note="+1 attack when using a weapon two-handed"',
  'Wood Elf Skill Bonus':'Section=skill Note="+%V Skill Points"',

  // Animal Companions
  'Companion Empathy':
    'Section=companion Note="May maintain an emotional link w/no range limit"',
  'Enhanced Sense':
    'Section=companion ' +
    'Note="Increases range for detecting channeled events by %{levels.Legate<15?5:10} miles"',
  'Magical Beast':
    'Section=companion ' +
    'Note="Companion is considered a magical beast for type-dependent effects"',
  'Telepathy':
    'Section=companion ' +
    'Note="R100\' Companion can establish and control telepathic communication"',

  // Prestige Classes
  'Advance Ancestral Blade':
    'Section=combat ' +
    'Note="May unlock %{($\'levels.Ancestral Bladebearer\'+2)//4} additional powers of covenant weapon"',
  'Alchemy':
    'Section=skill ' +
    'Note="May create plains dust%{levels.Sahi<5?\'\':levels.Sahi<7?\' and horse balm\':\', horse balm, and starfire\'}"',
  'Alter Ego':
    'Section=feature ' +
    'Note="May transform into %{$\\"levels.Aradil\'s Eye\\"<3?\'a designed human\':$\\"levels.Aradil\'s Eye\\"<7?\'a designed human or humanoid\':\'any humanoid\'} in 1 %{$\\"levels.Aradil\'s Eye\\"<5?\'min\':\'rd\'} as %{$\\"levels.Aradil\'s Eye\\"<9?\'a supernatural\':\'an extraordinary\'} ability"',
  'Ancestral Advisor': // dictionary prefers Adviser; rule book reads "Advisor"
    'Section=magic Note="May use blade for %{(level+70)<?90}% chance to learn weal or woe outcome of a proposed action up to 30 min in the future %{charismaModifier>?1}/dy"',
  'Ancestral Bladebearer Bonus Feats':'Section=feature Note="+%V Fighter Feat"',
  'Ancestral Favor':'Section=save Note="May reroll a save 1/dy"',
  'Ancestral Guide':'Section=magic Note="R10\' Blade hums near secret doors"',
  'Ancestral Protector':'Section=magic Note="Blade swats away missiles"',
  'Ancestral Recall':
    'Section=skill ' +
    'Note="May make +%{$\'levels.Spirit Speaker\'} Knowledge reroll 1/dy"',
  'Ancestral Spellcasting':
    'Section=magic Note="+%V Spell Energy/+%V Channeler Spells (conjuration)"',
  'Ancestral Warnings':'Section=combat Note="+2 Initiative"',
  'Ancestral Watcher':
    'Section=magic ' +
    'Note="Receives mental or audible alarm when a creature comes w/in 20\' of weapon"',
  'Armored Casting':'Section=magic Note="Reduces arcane spell failure by %V%"',
  "Aryth's Blessing":
    'Section=feature ' +
    'Note="May spend 10 min to gain use of a different heroic path feature %{($\'levels.Warden Of Erenland\'+1)//3}/dy"',
  'Aura Of Winter':
    'Section=magic ' +
    'Note="R20\' May set temperature and use <i>Weather</i> %{$\'levels.Snow Witch\'<10?1:2}/dy"',
  'Authority Of Izrador':
    'Section=skill Note="+%V Diplomacy/+%V Gather Information/+%V Intimidate"',
  'Awaken Ancestral Blade':'Section=combat Note="Weapon has intelligence"',
  'Bane Of Legates Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Bind Astirax':
    'Section=magic ' +
    'Note="R60\' Binds an astirax to its current form for %{$\'levels.Bane Of Legates\'} hr; astirax is destroyed if host animal is killed (DC %{((spellDifficultyClass.B||0)>?(spellDifficultyClass.D||0)>?(spellDifficultyClass.W||0))+5} Will neg)"',
  'Black Rot':'Section=ability Note="Considered evil for spell effects"',
  'Blade':'Section=combat Note="+%Vd8 Sneak Attack"',
  'Blade Dance':
    'Section=combat ' +
    'Note="May use Canny Strike, Clever Fighting, Weapon Defense, and Well-Aimed Strike feats with falchion and greatsword"',
  'Blade Dancer Bonus Feats':'Section=feature Note="+%V Fighter Feat"',
  'Blood-Syphoning':
    'Section=magic ' +
    'Note="May spend %1 Spell Energy to have an attack deliver <i>Vampiric Touch</i> and syphon 1d4+%V Spell Energy"',
  'Blood Talisman':
    'Section=magic Note="Reduces Blood-Syphoning Spell Energy cost by 1"',
  'Bonus Spellcasting':'Section=feature Note="+%V Spellcasting Feat"',
  'Breath Of The Vigdir':
    'Section=magic Note="Raises a deceased Dorn for %{$\'levels.Spirit Speaker\'} wk to complete a task"',
  'Call Meruros':
    'Section=magic ' +
    'Note="May use <i>Contingency</i> for summoning a Meruros for %{$\'levels.Spirit Speaker\'} rd"',
  'Call Tadulos':
    'Section=magic ' +
    'Note="May use <i>Contingency</i> for summoning a Tadulos for %{$\'levels.Spirit Speaker\'} rd"',
  'Channeled Combat':
    'Section=magic Note="May spend 1 Spell Energy to gain +%{level//2} %{$\'levels.Warrior Arcanist\'<4?\'attack\':$\'levels.Warrior Arcanist\'<7?\'attack or AC\':\'attack, damage, or AC\'} for 1 rd"',
  'Chosen Ground':
    'Section=combat ' +
    'Note="Chosen 20\'x20\' area gives self +2 attack, damage, and AC and Improved Bull Rush for %{$\'levels.Gardener Of Erethor\'} hr 1/dy"',
  'City Is My Shield':
    'Section=combat ' +
    'Note="Gains x2 cover bonus (minimum +2) in urban environment"',
  'City Sight':'Section=feature Note="Has Low-Light Vision feature"',
  'City Speak':'Section=skill Note="May communicate with any urban dweller"',
  'City Stance':
    'Section=combat ' +
    'Note="May use better of two Initiative rolls in urban environments"',
  'Cloak Of Snow':
    'Section=magic ' +
    'Note="May use personal <i>Weather</i> effects at will outdoors"',
  'Cloaked In City Shadows':
    'Section=skill Note="May Hide in any urban terrain"',
  'Close Combat Archery':
    'Section=combat ' +
    'Note="May use a bow w/out provoking AOO/May use arrows as light weapons"',
  'Closed Mind':
    'Section=save ' +
    'Note="May attempt second +4 Will save against revealing a spy network"',
  'Commune With Nature':
    'Section=magic ' +
    'Note="May use <i>Commune With Nature</i> effects %{levels.Druid//3}/dy"',
  'Conceal Magic':
    'Section=magic ' +
    'Note="Spells are considered half level for astirax detection"',
  'Conceal Magic Aura':
    'Section=feature ' +
    'Note="May conceal %{$\'levels.Insurgent Spy\'} magical aura"',
  'Constant Waves':
    'Section=skill ' +
    'Note="May take 10 on Balance, Climb, Jump, Perform (Dance), and Tumble even when distracted"',
  'Control Weather':
    'Section=magic ' +
    'Note="May use <i>Control Weather</i> effects %{$\'levels.Snow Witch\'<10?1:2}/dy"',
  'Coordinated Attack (Wogren)':
    'Section=combat ' +
    'Note="Rider and mount gain +2 attack on the same target when the other hits"',
  "Counter Izrador's Will":
    'Section=magic Note="May use <i>Dispel Magic</i> to counterspell legates"',
  'Cover Story':
    'Section=skill ' +
    'Note="Successful DC 20 Bluff for four consecutive dy establishes alibi"',
  'Crashing Waves':
    'Section=combat ' +
    'Note="May use Disarm or Trap as AOO %{dexterityModifier+1>?1}/rd"',
  'Cure Wounds':
    'Section=magic ' +
    'Note="May use <i>Cure %{levels.Lightbearer<3?\'Minor\':levels.Lightbearer<5?\'Light\':levels.Lightbearer<7?\'Moderate\':levels.Lightbearer<9?\'Serious\':\'Critical\'} Wounds</i> effects 3/dy"',
  'Cuts Like Ice':
    'Section=feature ' +
    'Note="Has Greater Weapon Focus (Fighting Knife)%V features"',
  'Dark Invitation':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Spellcasting (Greater Conjuration) feature",' +
      '"+1 Channeler Spells (Summon Monster spell)"',
  'Death Attack':
    'Section=combat ' +
    'Note="Sneak attack after 3 rd of study inflicts choice of death or paralysis for 1d6+%{$\'levels.Avenging Knife\'} rd (DC %{$\'levels.Avenging Knife\'+10+intelligenceModifier} Fort neg)"',
  'Death Knell':
    'Section=magic ' +
    'Note="Touched w/negative HP dies, and self gains 1d8 temporary HP, +2 Strength, and +1 caster level, and 1d4 Spell Energy (%{levels.Syphon+highestMagicModifier} maximum) for 10*target HD min (DC %{highestMagicModifier+12} Will neg) %{levels.Syphon<3?1:levels.Syphon<5?2:3}/dy"',
  'Deathwatch':
    'Section=magic ' +
    'Note="R30\' cone reveals HP state of targets for %{levels.Syphon*10} min %{levels.Syphon<3?1:levels.Syphon<5?2:3}/dy; may spend 1 Spell Energy per additional use"',
  'Deft Dodging':
    'Section=combat ' +
    'Note="Self and mount gain +4 AC during full rd mounted move"',
  "Deny Izrador's Power":
    'Section=magic ' +
    'Note="R60\' May use +%{$\'levels.Pale Legate\'+levels.Legate+wisdomModifier} <i>Dispel Magic</i> vs. Legate spell %{$\'levels.Pale Legate\'//3}/dy"',
  'Destiny Marked':'Section=feature Note="%{feats.Leadership?\'+4 Leadership\':\'Has Leadership feature\'}"',
  'Destroy Undead':'Section=combat Note="Turns undead as a level %V cleric"',
  'Disarming Shot':
    'Section=combat Note="May use Disarm via ranged touch attack"',
  'Disguise Contraband':
    'Section=magic ' +
    'Note="May cause divination and detection on %{levels.Smuggler}\' cu of contraband to fail for %{levels.Smuggler} hr"',
  'Dismounting Cut':
    'Section=combat Note="May use Trip w/weapon to dismount opponent"',
  'Dominant Will':
    'Section=save ' +
    'Note="+%{levels.Smuggler<6?2:4} Will vs. detection and compulsion spells to reveal activities"',
  'Dreams Of The Land (Commune)':
    'Section=magic ' +
     'Note="R%{$\'levels.Warden Of Erenland\'+10} miles May learn facts about surrounding area"',
  'Dreams Of The Land (Dream)':
    'Section=magic Note="May send message to sleeping ally"',
  'Dreams Of The Land (Foresight)':
    'Section=magic ' +
    'Note="May receive warnings that provide +2 AC and Reflex and negate surprise and flat-footed for %{$\'levels.Warden Of Erenland\'} hr"',
  'Druidcraft':
    'Section=magic Note="Reduces Spell Energy cost of Druid spells by 1"',
  'Dwarven Literacy':
    'Section=skill Note="Literate in Old Dwarven and Clan Dwarven"',
  'Dwarven Loremaster Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Efficient Study':
    'Section=feature ' +
    'Note="Reduces XP cost for learning spells and creating magic items by %{(levels.Wizard+1)//3*10}%"',
  'Erratic Attack':
    'Section=combat Note="Self or mount gains +2 AC when either attacks"',
  'Fast Hands':
    'Section=combat Note="May gain +4 Initiative and suffer -2 attack in first rd"',
  'Fell Touch':
    'Section=magic ' +
    'Note="Full-round action prevents fallen from becoming Fell or Lost"',
  'Find The Way':
    'Section=feature ' +
    'Note="%{$\'features.Trackless Step\'?\'Has continuous <i>Pass Without Trace</i> effect\':$\'features.Woodland Stride\'?\'Untrackable outdoors\':\'May move normally through undergrowth\'}"',
  'Fires Of Acceptance':
    'Section=skill Note="Vision targets ignore opposed alignment penalties"',
  'Fires Of Conviction':
    'Section=skill ' +
    'Note="Vision targets w/%{alignment} alignment gain +%{$\'visionaryFeatures.Fires Of Conviction\'} Vision benefits"',
  'Fires Of Destruction':
    'Section=skill ' +
    'Note="Vision targets w/%V alignment suffer additional -%{$\'visionaryFeatures.Fires Of Destruction\'} penalties"',
  'Fist':'Section=feature Note="+%V Defender abilities"',
  'Fluid Defense':'Section=combat Note="+%V Armor Class"',
  'For The King':
    'Section=combat ' +
    'Note="War cry grants self +%{($\'levels.Warden Of Erenland\'-1)//3+1} attack and +1d%{($\'levels.Warden Of Erenland\'-1)//3*2+4} damage vs. Shadow minions and R60\' allies +%{($\'levels.Warden Of Erenland\'-1)//3+1} vs. fear %{$\'levels.Warden Of Erenland\'} rd/dy"',
  'Forged In Dreams':
    'Section=skill ' +
    'Note="R60\' May spend 1 Vision use to make target friendly (DC %{10+levels.Visionary+charismaModifier} Will neg) for %{charismaModifier} hr"',
  'Forgotten Knowledge':'Section=skill Note="+2 Decipher Script/+2 Knowledge"',
  'Freerider Bonus Feats':'Section=feature Note="%V Freerider feats"',
  'Gardener Of Erethor Bonus Spells':
    'Section=magic Note="+%V Channeler Spells (nature)"',
  'Gardener Of Erethor Bonus Feats':
    'Section=feature Note="%V Gardener Of Erethor feats"',
  'Gaze Of The Meruros':
    'Section=magic ' +
    'Note="Gaze casts single-target DC %{$\'levels.Spirit Speaker\'+10+charismaModifier} <i>Cause Fear</i> spell 1/dy"',
  'Ghost Sight':
    'Section=magic Note="May use <i>See Invisible</i> effects at will"',
  'Gift Of The Vigdir':
    'Section=magic ' +
    'Note="Raises a deceased Dorn for %{$\'levels.Spirit Speaker\'} dy to complete a task"',
  'Gone Pale':'Section=feature Note="Self loses Legate features"',
  'Guiding Light':
    'Section=feature Note="+%{((levels.Visionary-1)//2)*2} Leadership score"',
  'Harrower Bonus Feats':'Section=feature Note="%V Harrower Feats"',
  'Heal':'Section=magic Note="May use <i>Heal</i> effects 1/dy"',
  'Hit And Run':
    'Section=combat ' +
    'Note="May move away from a foe after an attack w/out provoking AOO"',
  'Homemaker':
    'Section=skill ' +
    'Note="+%V Knowledge (Nature)/+%V Profession (Gardener)/+%V Profession (Farmer)/+%V Profession (Herbalist)"',
  'Horse Lord':
    'Section=skill Note="+1 Handle Animal (horse)/+1 Ride (horseback)"',
  'House Of Summer':
    'Section=magic Note="May use <i>Secure Shelter</i> effects 1/dy"',
  'Ignore Armor':'Section=magic Note="Reduces arcane spell failure by %V%"',
  'Immovable Blade':'Section=combat Note="Cannot be involuntarily disarmed"',
  'Immunity To Fear':'Section=save Note="Immune to all fear effects"',
  'Imp':'Section=feature Note="May gain the services of a courtesan imp"',
  'Impervious Mind':
    'Section=save ' +
    'Note="Immune to mental effects that prevent attacks against %{ancestralFoe}"',
  'Improved Coup De Grace':
    'Section=combat ' +
    'Note="Inflicts maximum damage from a standard action coup de grace"',
  'Improved Mounted Archery':
    'Section=combat ' +
    'Note="Suffers no ranged attack penalty when mounted/May use Rapid Shot when mounted"',
  'Improved Mounted Assault':
    'Section=combat Note="Suffers no penalty for additional mounted attacks"',
  'Improved Mounted Combat':
    'Section=combat ' +
    'Note="May use Mounted Combat +%{dexterityModifier>?1} times/rd"',
  'Improved Ride-By Attack':
    'Section=combat Note="May change direction while charging"',
  'Improved Sneak Attack Range':
    'Section=combat Note="+%V\' Ranged sneak attack"',
  'Improved Spirited Charge':
    'Section=combat Note="x2 critical threat range w/charging weapon"',
  'Improved Trample':'Section=combat Note="Overrun provokes no AOO"',
  'Improved Vision Of The Night':'Section=feature Note="60\' Darkvision"',
  'Information Network':
    'Section=skill ' +
    'Note="May take %{levels.Smuggler<7?10:20} on Gather Information after 1 hr in a new locale"',
  'Inspire Fanaticism':
    'Section=feature ' +
    'Note="Followers in sight gain +%{(levels.Harrower+1)//3} attack, Will, Diplomacy, and Intimidate"',
  'Inspiring Leader':
    'Section=combat ' +
    'Note="R60\' Allies gain +%{$\'levels.Erunsil Blood\'<9?2:3} attack while self is fighting"',
  'It Is Written In The Stars':'Section=feature Note="May force reroll 1/dy"',
  'Intimidating Shot':
    'Section=combat ' +
    'Note="Intimidate after an attack gains a bonus of half damage"',
  'Kindle Hearts':
    'Section=skill ' +
    'Note="R60\' May spend 1 Vision use to give target +%{charismaModifier} save vs. morale effect or penalty reduction"',
  'Kindle Minds':
    'Section=skill ' +
    'Note="R60\' May spend 1 Vision use to give target +%{charismaModifier} save vs. fear or to reduce fear by 1 step"',
  'Kindle Spirits':
    'Section=skill ' +
    'Note="R60\' May spend 1 Vision use to give target +%{charismaModifier} save vs. compulsion"',
  'Know Thy Enemy':
    'Section=combat,skill ' +
    'Note="+%{($\'levels.Ancestral Foe\'+2)//3} damage and AC vs. %{ancestralFoe}",' +
         '"+%{($\'levels.Ancestral Foe\'+2)//3} Bluff, Listen, Sense Motive, Spot, Survival vs. %{ancestralFoe}"',
  'Leaf Reader':
    'Section=combat ' +
    'Note="Reduces vegetation concealment miss chance by 10% for every 5 above DC 10 Spot check"',
  'Light The World':
    'Section=skill ' +
    'Note="May spend 1 Vision use to reroll an attack, save, or skill check"',
  'Like Snowfall':
    'Section=magic ' +
    'Note="Leaves no evidence of passage/May use <i>Feather Fall</i> effects 3/dy"',
  'Master Of Fate':
    'Section=combat ' +
    'Note="Killing damage to self cannot reduce HP to less than -9"',
  'Master Of Tales':
    'Section=magic ' +
    'Note="May use two Tales Of The Sorshef effects simultaneously"',
  'Master Spy':
    'Section=feature ' +
    'Note="May use Mindbond at will to contact known Master Spies, apprentices, and those in homeland"',
  'Mediator':
    'Section=feature ' +
    'Note="May shift attitude of %{$\'levels.Warden Of Erenland\'*5} creatures 1 step %{($\'levels.Warden Of Erenland\'+2)//3}/dy"',
  'Melee Caster':
    'Section=magic ' +
    'Note="May deliver spell up to Ch%{$\'levels.Warrior Arcanist\'//2} via weapon"',
  'Meticulous Aim':
    'Section=combat ' +
    'Note="Gains +1 critical range for every 2 rd spent aiming (+%{$\'levels.Elven Raider\'//2} maximum)"',
  'Mindbond':
    'Section=feature Note="May establish a telepathic link to mentor 1/dy"',
  'Mounted Ability':'Section=feature Note="%V selections"',
  'Mounted Hide':
    'Section=skill ' +
    'Note="Hide modifier is +%{(skillModifier.Hide||0)+(features.Small?-4:0)+(animalCompanionStats.Size==\'S\'?4:animalCompanionStats.Size==\'L\'?-4:0)} when mounted on wogren"',
  'Mounted Maneuver':'Section=feature Note="%V selections"',
  'Mystifying Speech':
    'Section=magic ' +
    'Note="May change 5 min of memory of %{levels.Smuggler} listeners (DC %{levels.Smuggler+10+charismaModifier} Will neg) %{levels.Smuggler<7?1:2}/dy"',
  'Narrowswending':
    'Section=ability ' +
    'Note="May move normally through 2 sq of difficult terrain and squeeze through narrows at full speed"',
  'Nature Sense':
    'Section=skill ' +
    'Note="May identify animals, plants, and unsafe food and drink"',
  'Oathbinder':
    'Section=skill ' +
    'Note="May spend 1 Vision use to know direction, distance, health, and mental state of oathbound target"',
  'Oathholder':
    'Section=skill ' +
    'Note="May spend 1 Vision use to allow oathbound target to use self Fort or Will save base modifier; failure also affects self"',
  'Oathkeeper':
    'Section=skill ' +
    'Note="May spend 1 Vision use to command oathbound target telepathically (DC %{10+levels.Visionary+charismaModifier} Will neg) for %{charismaModifier} min; successful saves dispel any effects that interfere w/control"',
  'Oathmaker':
    'Section=skill ' +
    'Note="May spend 1 Vision use to use <i>Scrying</i> effects on oathbound target"',
  'Obsidian Tongue':
    'Section=skill ' +
    'Note="+%{(levels.Collaborator+1)//2*2} Bluff, Diplomacy, and Gather Information (Shadow minions)"',
  'Omen Of The Sorshef':
    'Section=magic ' +
    'Note="May use <i>Augury</i> effects w/%{levels.Sahi+70}% success 1/dy"',
  'Pale As Snow':
    'Section=combat,skill ' +
    'Note=' +
      '"Foes suffer %V% miss chance in snow",' +
      '"+4 Hide and untrackable in snow"',
  'Pale Heart':
    'Section=save ' +
    'Note="+%{($\'levels.Pale Legate\'+2)//3+(levels.Legate||0)//3} vs. Shadow minion spells and abilities"',
  'Parables Of The Sorshef':
    'Section=skill ' +
    'Note="+%{levels.Sahi+wisdomModifier} Knowledge check wrt local notables, legendary items, and noteworthy places; additional +2 wrt Sorshef and Sarcosan history"',
  'Pride Of The Sorshef':'Section=save Note="Immune to disease and poison"',
  'Primal Foe':'Section=feature Note="May not associate with %{ancestralFoe}"',
  'Ranged Sneak Attack':'Section=combat Note="R%1\' +%Vd6 Sneak Attack"',
  'Rage Of Vengeance':
    'Section=combat ' +
    'Note="Damage to an ally w/in 30\' by %{ancestralFoe} gives damage% chance of +2 Strength, +2 Constitution, +1 Will, +1d6 damage, -2 AC, and limitless Cleave against those foes while present"',
  'Razor Sharp':
    'Section=combat Note="Daily ritual gives fighting knife dbl threat range"',
  'Recharge Nexus':
    'Section=magic ' +
    'Note="May spend %{$\'levels.Dwarven Loremaster\'<6?3:2} Spell Energy to recharge a nexus 1 point"',
  'Regenerative Strike':
    'Section=magic ' +
    'Note="Critical hit on foe restores up to 2x crit multiplier Spell Energy"',
  "Resist Izrador's Will":
    'Section=save Note="SR %{$\'levels.Bane Of Legates\'+10} vs. legate magic"',
  'Respect':'Section=feature Note="Has Leadership feature w/Shadow minions"',
  'Roofjumping':'Section=skill Note="+10 Jump (rooftop), 10\' running jump"',
  'Rune Magic':
    'Section=magic ' +
    'Note="May carve runes to evoke R60\' spell up to level %{$\'levels.Dwarven Loremaster\'-1}"',
  'Sahi Bonus Feats':'Section=feature Note="%V Sahi Feat"',
  'Sahi Literacy':'Section=skill Note="Literate in Colonial and Courtier"',
  'Savvy Host':
    'Section=feature,magic ' +
    'Note=' +
      '"Has Augment Summoning feature/May speak w/any summoned creature",' +
      '"+1 Channeler Spells (Summon Monster spell)"',
  'Savvy Hunter':
    'Section=combat Note="May reduce damage bonus vs. %{ancestralFoe} by half to gain an equal attack bonus"',
  'Seance':
    'Section=magic ' +
    'Note="May use <i>Augury</i> or R100\' <i>Legend Lore</i> effects about past%{$\'levels.Haunted One\'<4?\' dy\':$\'levels.Haunted One\'<7?\' yr\':$\'levels.Haunted One\'<10?\' century\':\'\'} %{($\'levels.Haunted One\'+2)//3}/dy"',
  'Security Breach':
    'Section=skill ' +
    'Note="Successful Gather Information gives +%{$\'levels.Avenging Knife\'} to Bluff, Hide, and Move Silently to exploit chinks in site security"',
  'See Astirax':'Section=feature Note="Can see astiraxes as shadowy forms"',
  'Shadow Contacts':
    'Section=skill ' +
    'Note="Successful Gather Information obtains a DC 20 minor%{$\'levels.Insurgent Spy\'<3?\'\':$\'levels.Insurgent Spy\'<5?\' or DC 25 major\':\', DC 25 major, or DC 30 incredible\'} favor from a Shadow minion"',
  'Shadow Speak':
    'Section=skill ' +
    'Note="+%V Bluff, Diplomacy, Intimidate, and Sense Motive w/Shadow minions"',
  'Shadow-Tapping':'Section=feature Note="Has access to two domains"',
  'Silent Killer':
    'Section=skill Note="+4 Move Silently (forests and mountains)"',
  "Smuggler's Trade":
    'Section=skill ' +
    'Note="+%{(levels.Smuggler+1)//2*2} and may take 10 on Bluff, Disguise, Forgery, and Gather Information when smuggling"',
  'Speak With Dead':
    'Section=magic ' +
    'Note="May use <i>Speak With Dead</i> effects %{levels.Harrower//3}/dy"',
  'Special Mount':'Section=feature Note="Companion mount w/special abilities"',
  'Speed Mount':'Section=combat Note="May mount or dismount as a free action"',
  'Spell-Syphoning':
    'Section=magic ' +
    'Note="Blood-syphoning transfers a spell from target to self; grapple allows use of target Spell Energy"',
  'Spirit Manipulation':
    'Section=magic ' +
    'Note="May use %{$\'levels.Haunted One\'//2} chosen Divination or Necromancy spells as spell-like ability 1/dy"',
  'Spirit Speaker':
    'Section=magic,magic ' +
    'Note=' +
      '"+1 Spell Energy",' +
      '"+1 Channeler Spells (Conjuration or Divination)"',
  'Spirit Speaker Bonus Feats':'Section=feature Note="%V Spirit Speaker Feats"',
  'Spiritcraft':
    'Section=magic ' +
    'Note="Reduces cost of Divination and Necromancy spells by 1"',
  'Spiritual Link':
    'Section=magic ' +
    'Note="May use <i>Alarm</i> effects, gains +1 caster level, and reduces spell cost by 1 in %{$\'levels.Gardener Of Erethor\'//2} chosen areas of up to 1/2 mile diameter each"',
  'Spur On':
    'Section=feature Note="Mount gains dbl speed during charge or dbl move"',
  'Spy':
    'Section=feature ' +
    'Note="Has %{$\\"levels.Aradil\'s Eye\\"*10}% chance of receiving help from 1d3 Aradil\'s Eyes when in dire need"',
  'Spy Initiate':
    'Section=feature,skill ' +
    'Note=' +
      '"May receive services from Elven contacts",' +
      '"+%V Diplomacy (elves and allies)"',
  'Still As Stone':'Section=skill Note="+10 Hide (exploiting security breach)"',
  'Strength Of My Ancestors':
    'Section=feature Note="+2 ability, attack, save, or skill check 1/dy"',
  'Strength Of The Wood':
    'Section=magic Note="Recovers 1 Spell Energy/hr during Tree Meld"',
  'Stunning Sneak Attack':
    'Section=combat ' +
    'Note="May stun foe for 1 rd w/Sneak Attack (DC %{$\'levels.Avenging Knife\'+10+intelligenceModifier} neg) 3/dy"',
  'Summon Ancestor':
    'Section=magic ' +
    'Note="Casting <i>Summon Ancestral Warrior</i> and <i>Summon Ancestral Hero</i> costs 50 vp less than normal"',
  'Sundered Spirit':
    'Section=magic ' +
    'Note="Radiates 5\'-50\' <i>Antimagic Field</i> for divine magic"',
  'Survival Of The Skilled':
    'Section=skill ' +
    'Note="+%{$\'levels.Vigilant Defender\'//2} on %{($\'levels.Vigilant Defender\'+1)//3} chosen skills"',
  'Sweeping Strike':
    'Section=combat ' +
    'Note="May attack all threatened foes w/out provoking AOO during mount move"',
  'Tactical Insight':
    'Section=combat ' +
    'Note="R60\' May give self and allies +%{($\'levels.Legate Martial\'+3)//4} attack and AC against chosen foe w/in 30\' after 1 rd of study"',
  'Tales Of The Sorshef (Agony)':
    'Section=magic ' +
    'Note="R60\' Any foe striking an ally suffers <i>Symbol Of Pain</i> effects (DC %{highestMagicModifier+15} neg, +2 if a Sarcosan ally) during storytelling (%{$\'skills.Perform (Storytelling)\'} rd maximum) + %{levels.Sahi} rd"',
  'Tales Of The Sorshef (Determination)':
    'Section=magic ' +
    'Note="R60\' Allies gain +1 attack, +1 saves, and +1d8 HP during storytelling (%{$\'skills.Perform (Storytelling)\'} rd maximum) + %{levels.Sahi} rd"',
  'Tales Of The Sorshef (Freedom)':
    'Section=magic ' +
    'Note="R60\' Allies gain immunity to paralysis, stunning, nausea, and petrification during storytelling (%{$\'skills.Perform (Storytelling)\'} rd maximum) + %{levels.Sahi} rd"',
  'Tales Of The Sorshef (Heart)':
    'Section=magic ' +
    'Note="R60\' Allies gain +%{levels.Sahi//2} vs. fear and compulsion during storytelling (%{$\'skills.Perform (Storytelling)\'} rd maximum) + %{levels.Sahi} rd"',
  'Target Study':
    'Section=combat ' +
    'Note="Successful Gather Information (DC 10 + target HD) gives +2 attack, +2 damage, or +4 AC vs. target"',
  'The Drop':
    'Section=combat ' +
    'Note="+%{($\'levels.Avenging Knife\'+2)//3} attack and damage vs. flat-footed foe"',

  'Tree Meld':
    'Section=magic ' +
    'Note="May merge into a tree for up to %{$\'levels.Whisper Adept\'} hr; suffers 5d6 HP from involuntary exit"',
  'Unbreakable Blade':'Section=combat Note="Ancestral weapon cannot be harmed"',
  'Undetectable Alignment':'Section=save Note="Immune to alignment detection"',
  'Urban Mobility':'Section=feature Note="%V selections"',
  'Unwavering Blade':
    'Section=combat ' +
    'Note="Knows where weapon is when separated/Weapon protects unconscious self"',
  'Venom Immunity':'Section=save Note="Immune to organic poisons"',
  'Vision':'Section=skill Note="R60\' May use Perform to give %{levels.Visionary} targets +1 per shared alignment component to attacks, level and skill checks, and saves and inflict -1 per opposed alignment component to AC and damage while performing (%{levels.Visionary} min maximum) + %{charismaModifier} rd %{levels.Visionary}/dy"',
  'Vision Of The Night':'Section=feature Note="Has Low-Light Vision feature"',
  "Vision's Gifts":'Section=feature Note="%V selections"',
  'Wallscaling':
    'Section=ability,skill ' +
    'Note=' +
      '"%{speed//2} climb speed in urban settings",' +
      '"+8 Climb (urban); may take 10 when rushed or threatened"',
  "Warden's Vows":
    'Section=feature ' +
    'Note="Has sworn to seek the king\'s heirs, keep secrets, help Erenlanders in need, and kill Shadow minions"',
  'Way Of The Snow Witch':
    'Section=magic,save ' +
    'Note=' +
      '"Knows additional spells",' +
      '"+%{$\'levels.Snow Witch\'<4?2:4} vs. weather and natural energy effects"',
  'What Was Will Be Again':
    'Section=combat ' +
    'Note="Gains x2 attacks and %{dexterityModifier>?1} 5\' steps in a full-round action 1/day"',
  'Wheel About':
    'Section=combat Note="May make 90 degree turn during mounted charge"',
  "Whisper's Ward":
    'Section=save Note="Immune to mind-affecting effects w/in Erethor"',
  'Whisper Sense':
    'Section=combat,feature,magic ' +
    'Note=' +
      '"%V w/in Erethor",' +
      '"Requires no check to hear Whispering Wood in Erethor",' +
      '"May use %V effects w/in Erethor at will"',
  'Wizard Bonus Feats':'Section=feature Note="%V Wizard Feats"',
  'Wizardcraft':
    'Section=magic Note="May prepare spells ahead of time for half Spell Energy cost"',
  'Wogren Dodge':'Section=combat Note="+2 AC during mounted move"',
  "Wogren's Sight":'Section=feature Note="Has R30\' Blindsense while mounted"',
  'Woodsman':'Section=skill Note="+2 Handle Animal/+2 Survival"',
  "Xione's Herald":
    'Section=combat ' +
    'Note="R30\' Foes panicked for 10 rd (DC %{charismaModifier+15} Will shaken for 1 rd)"'

};
LastAge.FEATURES = Object.assign({}, SRD35.FEATURES, LastAge.FEATURES_ADDED);
LastAge.GOODIES = Object.assign({}, SRD35.GOODIES);
LastAge.HEROIC_PATHS = {
  'None':'',
  'Beast':
    'Features=' +
      '"1:Vicious Assault","2:Bestial Aura","5:Ability Boost",7:Rage,' +
      '"12:Enhanced Bestial Aura" '+
    'Selectables=' +
      '"Low-Light Vision",Scent',
  'Chanceborn':
    'Features=' +
      '"1:Luck Of Heroes",3:Unfettered,"4:Miss Chance",' +
      '"6:Survivor (Chanceborn)","9:Take Ten","19:Take Twenty"',
  'Charismatic':
    'Features=' +
      '"4:Inspiring Oration","5:Charisma Bonus",6:Leadership,' +
      '"12:Natural Leader"',
  'Dragonblooded':
    'Features=' +
      '"1:Bolster Spell","2:Bonus Spells","3:Bonus Spell Energy",' +
      '"4:Quickened Counterspelling",' +
      '"6:Improved Spellcasting (Dragonblooded)",' +
      '"9:Improved Spell Penetration","19:Frightful Presence"',
  'Earthbonded':
    'Features=' +
      '"1:Extended Darkvision","3:Natural Armor",4:Stonecunning,' +
      '"8:Improved Stonecunning",12:Tremorsense,16:Blindsense,' +
      '20:Blindsight',
  'Faithful':
    'Features=' +
      '"4:Turn Undead","5:Wisdom Bonus"',
  'Fellhunter':
    'Features=' +
      '"1:Sense The Dead","2:Touch Of The Living","3:Ward Of Life",' +
      '"5:Disrupting Attack"',
  'Feyblooded':
    'Features=' +
      '"1:Low-Light Vision","7:Fey Vision" ' +
    'Selectables=' +
      '"Unearthly Grace (AC)","Unearthly Grace (Dexterity)",' +
      '"Unearthly Grace (Fortitude)","Unearthly Grace (Reflex)",' +
      '"Unearthly Grace (Will)"',
  'Giantblooded':
    'Features=' +
      '"level < 10 ? 1:Size Features (Big)","2:Rock Throwing",' +
      '"3:Intimidating Size","4:Fast Movement","5:Strength Bonus",' +
      '"8:Fearsome Charge","10:Size Features (Large)",' +
      '"20:Size Features (Extra Reach)"',
  'Guardian':
    'Features=' +
      '"1:Inspire Valor","2:Detect Evil","3:Righteous Fury","4:Smite Evil",' +
      '"5:Constitution Bonus",' +
      '"charisma >= 12 ? 6:Lay On Hands","12:Aura Of Courage","16:Death Ward"',
  'Healer':'',
  'Ironborn':
    'Features=' +
      '"1:Incredible Resilience (Ironborn)","2:Fortitude Bonus",' +
      '"3:Natural Armor","4:Improved Healing","5:Damage Reduction",' +
      '"6:Elemental Resistance",9:Indefatigable,' +
      '"14:Improved Healing (Ability Recovery)"',
  'Jack-Of-All-Trades':
    'Features=' +
      '"1:Spell Choice","2:Spontaneous Spell","3:Skill Boost",' +
      '"4:Ability Boost","5:Save Boost","7:Jack-Of-All-Trades Bonus Feats"',
  'Mountainborn':
    'Features=' +
      '1:Mountaineer,3:Ambush,"4:Rallying Cry","5:Constitution Bonus",' +
      '"8:Ambush (Extra Damage)","13:Ambush (Quick)","18:Ambush (Sniping)"',
  'Naturefriend':
    'Features=' +
      '"1:Natural Bond","1:Wild Empathy","5:Animal Friend","10:Plant Friend",' +
      '"15:Elemental Friend","20:One With Nature"',
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
      '"10:Increased Damage Threshold"',
  'Pureblood':
    'Features=' +
      '"1:Master Adventurer","2:Blood Of Kings","3:Pureblood Bonus Feats",' +
      '"4:Skill Mastery","5:Ability Boost"',
  'Quickened':
    'Features=' +
      '"1:Initiative Bonus","2:Armor Class Bonus","3:Fast Movement",' +
      '"4:Burst Of Speed","5:Dexterity Bonus"',
  'Seaborn':
    'Features=' +
      '"1:Dolphin\'s Grace","1:Natural Swimmer","2:Deep Lungs",' +
      '"3:Aquatic Blindsight","4:Aquatic Ally","10:Aquatic Adaptation",' +
      '"14:Cold Resistance","17:Aquatic Emissary","18:Assist Allies"',
  'Seer':
    'Features=' +
      '"3:Seer Sight"',
  'Shadow Walker':
    'Features=' +
      '1:Darkvision,"2:Shadow Veil","4:Shadow Jump","11:Hide In Plain Sight"',
  'Speaker':
    'Features=' +
      '"2:Persuasive Speaker","3:Power Words","5:Charisma Bonus",' +
      '"14:Language Savant"',
  'Spellsoul':
    'Features=' +
      '"1:Untapped Potential","2:Metamagic Aura","3:Resistance (Spellsoul)",' +
      '"4:Bonus Raw Energy"',
  'Steelblooded':
    'Features=' +
      '"1:Steelblooded Bonus Feats","2:Offensive Tactics",' +
      '"3:Strategic Blow","4:Skilled Warrior",14:Untouchable',
  'Sunderborn':
    'Features=' +
      '"1:Detect Outsider","2:Blood Of The Planes","4:Planar Fury",' +
      '"7:Spirit Sight (Darkness)","13:Spirit Sight (Magical Darkness)",' +
      '"19:Spirit Sight (Invisible)"',
  'Tactician':
    'Features=' +
      '"1:Aid Another (Move)","2:Combat Overview","3:Coordinated Initiative",' +
      '"4:Coordinated Attack","5:Aid Another (Combat Bonus)",' +
      '"13:Directed Attack","18:Telling Blow","20:Perfect Assault"',
  'Warg':
    'Features=' +
      '"1:Wild Empathy","2:Animal Companion","5:Wild Shape",13:Ferocity,' +
      '20:Blindsense ' +
    'Selectables=' +
      '"Low-Light Vision",Scent',
  // Sorcery & Shadow
  'Blessed':
    'Features=' +
      '"1:Body Of The Blessed","3:Aura Of Courage","5:Grant Protection",' +
      '"6:Divine Grace","7:Mass Cure","8:Align Weapons","10:Bless Ground",' +
      '"14:Sanctify"',
  'Null':
    'Features=' +
      '"1:Sense Magic","2:Magic Resistance","3:Null Field",' +
      '"5:Spell Resistance","9:Empowered Dispelling"',
  'Shadowed':
    'Features=' +
      '"1:Body Of The Shadowed",1:Darkvision,"4:Coldness Of Shadow",' +
      '"5:Gift Of Izrador","9:Turn Undead","14:Imposing Presence",' +
      '"19:Frightful Presence (Shadowed)",' +
      '"shadowedFeatures.Death Domain ? 1:Deadly Touch",' +
      '"shadowedFeatures.Destruction Domain ? 1:Smite",' +
      '"shadowedFeatures.Evil Domain ? 1:Empowered Evil",' +
      '"shadowedFeatures.Magic Domain ? 1:Arcane Adept",' +
      '"shadowedFeatures.War Domain ? 1:Weapon Of War" ' +
    'Selectables=' +
      '"5:Death Domain:Domain",' +
      '"5:Destruction Domain:Domain",' +
      '"5:Evil Domain:Domain",' +
      '"5:Magic Domain:Domain",' +
      '"5:War Domain:Domain"',
  'Wiser':
    'Features=' +
      '"1:Wiser Skill Bonus","2:Wiser Bonus Feats","4:Insight",' +
      '"5:Intelligence Bonus"'
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
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Dexterous Hands","Dexterous Healer",Fearlessness,Fortunate,Graceful,' +
      '"Innate Magic","Keen Senses","Low-Light Vision",Slow,Small,' +
      '"featureNotes.stout ? 1:Endurance",' +
      '"featureNotes.stout ? 1:Toughness",' +
      '"featureNotes.studious ? 1:Magecraft (Hermetic)" ' +
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
      '"Resilient",Slow,"Spell Resistant",Stability,Steady,Stonecunning,' +
      'Stoneworker ' +
    'Languages="Clan Dwarven","Old Dwarven"',
  'Danisil-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Sepi)",' +
      '"Favored Region (Aruun)","Favored Region (Erethor)",' +
      '"Alert Senses","Dexterous Healer",Fortunate,"Innate Magic",' +
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
      'Darkvision,"Dwarven Kin","Mixed Blood","Orc Dodger","Resist Spells",' +
      'Small,Slow,Stoneworker ' +
    'Selectables=' +
      '"Natural Mountaineer",Stonecunning ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue"',
  'Dworg':
    'Features=' +
      '"Dworg Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      '"Favored Region (Kaladruns)",' +
      'Darkvision,"Dworg Enmity","Minor Light Sensitivity","Mixed Blood",' +
      'Rugged,"Spell Resistant" ' +
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
      '"Natural Trader","Resist Spells",Slow,Small ' +
    'Languages="Trader\'s Tongue",any,any',
  'Gnome-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      '"Weapon Familiarity (Hand Crossbow/Inutek)",' +
      '"Favored Region (Central Erenland)",' +
      'Darkvision,"Deep Lungs","Dwarven Kin","Mixed Blood",' +
      '"Natural Riverfolk","Resist Spells",Small,Slow,"Skilled Trader" ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue",any,any',
  'Halfling-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Bound To The Beast","Dexterous Healer",Fortunate,"Innate Magic",' +
      '"Alert Senses","Low-Light Vision","Mixed Blood","Mounted Combat",' +
      'Nimble,Small ' +
    'Languages=Erenlander,Halfling,"Jungle Mouth"',
  'Jungle Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Sepi)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Aruun)","Favored Region (Erethor)",' +
      '"At Home In The Trees","Bonus Innate Spell","Double Sepi Training",' +
      '"Alert Senses","Feral Elf","Innate Magic","Low-Light Vision",' +
      '"Natural Channeler","Resist Enchantment","Spirit Foe" ' +
    'Languages="Jungle Mouth"',
  'Kurgun Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",'+
      '"Favored Region (Kaladruns)",' +
      '"Favored Region (Surface Kaladruns)",' +
      'Darkvision,"Double Urutuk Training","Dwarf Enmity",' +
      '"Favored Weapon (Axes/Hammers)","Natural Mountaineer","Resilient",' +
      'Slow,"Spell Resistant",Steady,Stoneworker '+
    'Languages="Clan Dwarven","Old Dwarven"',
  'Nomadic Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      'Fearlessness,Fortunate,Graceful,"Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Skilled Rider",Slow,Small,' +
      '"featureNotes.boundToTheBeast ? 1:Mounted Combat",' +
      '"featureNotes.boundToTheSpirits ? 1:Magecraft (Spiritual)" ' +
    'Selectables=' +
      '"Bound To The Beast","Bound To The Spirits" ' +
    'Languages=Colonial,Halfling',
  'Orc':
    'Features=' +
      '"Orc Ability Adjustment",' +
      '"Weapon Familiarity (Vardatch)",' +
      '"Favored Region (Northern Reaches)",' +
      '"Cold Tolerance",Darkvision,"Frenzied Valor","Light Sensitivity",' +
      '"Natural Predator","Night Fighter","Orc Enmity","Spell Resistant" ' +
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
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow/Guisarme/Ranseur/Trident)",' +
      '"Favored Region (Erethor)","Favored Region (Miraleen)",' +
      '"Alert Senses","At Home In The Trees","Deep Lungs","Innate Magic",' +
      '"Low-Light Vision","Natural Channeler","Natural Sailor",' +
      '"Natural Swimmer","Resist Enchantment" ' +
    'Languages="High Elven","Jungle Mouth"',
  'Snow Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Fighting Knife/Icewood Longbow)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Erethor)","Favored Region (Veradeen)",' +
      '"At Home In The Trees","Cold Fortitude","Double Knife Training",' +
      '"Alert Senses","Fortitude Bonus","Icewood Bow Focus","Innate Magic",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment" ' +
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
      '"Alert Senses","At Home In The Trees","Bonus Innate Spell",' +
      '"Innate Magic","Low-Light Vision","Natural Channeler",' +
      '"Resist Enchantment","Wood Elf Skill Bonus" ' +
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
  'Knowledge (Local (Veradeen))':'Ability=intelligence Untrained=n',
  'Knowledge (Nature)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Spirits)"',
  'Knowledge (Old Gods)':'Ability=intelligence Untrained=n',
  'Knowledge (Shadow)':'Ability=intelligence Untrained=n',
  'Knowledge (Spirits)':
    'Ability=intelligence Untrained=n Synergy="Knowledge (Nature)"',
  // Perform (Storytelling) for Sahi class
  'Perform (Storytelling)':'Ability=charisma Class=Defender,Rogue,Wildlander',
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
for(let skill in LastAge.SKILLS) {
  LastAge.SKILLS[skill] = LastAge.SKILLS[skill].replace(/Class=\S+/i, '');
}
delete LastAge.SKILLS['Knowledge (Planes)'];
delete LastAge.SKILLS['Knowledge (Religion)'];
LastAge.SPELLS_ADDED = {

  // NOTE: It's unclear which of these spells might be available in potion/oil
  // form. Given the problematic nature of magic items in Midnight, the
  // question is probably moot.
  'Charm Repair':
    'School=Transmutation ' +
    'Level=Ch3 ' +
    'Description="Restores touched minor or lesser charm, once per charm"',
  'Detect Astirax':
    'School=Divination ' +
    'Level=Ch1 ' +
    'Description="R%{lvl*40+400}\' Quarter circle gives self info on astiraxes for %{lvl*10} min"',
  'Detect Outsider':
    'School=Divination ' +
    'Level=Sunderborn1 ' + // Only a Sunderborn spell
    'Description="R60\' Cone gives self info on outsiders for %{lvl*10} min"',
  'Disguise Ally':
    'School=Illusion ' +
    'Level=Ch2 ' +
    'Description="Willing touched changes appearance and gains +10 Disguise for %{lvl*10} min (Will disbelieve)"',
  'Disguise Weapon':
    'School=Illusion ' +
    'Level=Ch1 ' +
    'Description="%{lvl} touched weapons look benign for %{lvl} hr"',
  'Far Whisper':
    'School=Divination ' +
    'Level=Ch1 ' +
    'Description="Self gains +4 checks to hear Whispering Wood w/in %{lvl*10} miles for %{lvl} min"',
  'Greenshield':
    'School=Illusion ' +
    'Level=Ch2 ' +
    'Description="Surrounds touched with a 30\' foliage sphere for %{lvl} hr"',
  'Halfling Burrow':
    'School=Transmutation ' +
    'Level=Ch3 ' +
    'Description="Creates a hidden hole that can hold %{lvl} small creatures for %{lvl} hr"',
  'Lifetrap':
    'School=Transmutation ' +
    'Level=Ch2 ' +
    'Description="R%{lvl*10+100}\' Immobilizes undead in 50\' radius for %{lvl} rd and inflicts 3d6 HP (Ref half Speed only)"',
  "Nature's Revelation":
    'School=Transmutation ' +
    'Level=Ch2 ' +
    'Description="R%{lvl//2*5+25}\' Plants and animals in 30\' radius reveal hidden and invisible creatures"',
  'Nexus Fuel':
    'School=Necromancy ' +
    'Level=Ch5 ' +
    'Description="Sacrifice boosts nexus recovery rate by 1 point/HD"',
  'Silver Blood':
    'School=Transmutation ' +
    'Level=Ch2 ' +
    'Description="Self blood damages astiraxes for 1 hr"',
  'Silver Storm':
    'School=Transmutation ' +
    'Level=Ch4 ' +
    'Description="R%{lvl//2*5+25}\' Cone inflicts %{lvl<?15}d4 HP (Ref half)"',
  'Silver Wind':
    'School=Conjuration ' +
    'Level=Ch3 ' +
    'Description="R%{lvl*10+100}\' Creatures in 10\' radius glow, suffer blindness (Will neg) and 1d6 HP/rd for %{lvl} rd"',
  'Stone Soup':
    'School=Transmutation ' +
    'Level=Ch1 ' +
    'Description="Stone buried for 1 hr creates a nourishing broth for %{lvl} creatures"',
  // Sorcery and Shadow
  'Arcane Impotence':
    'School=Abjuration ' +
    'Level=Ch3 ' +
    'Description="R%{lvl*10+100}\' Channeler target must use %{lvl//2} Spell Energy to cast for next %{lvl} rd (Will %{lvl//2} rd)"',
  'Arcane Interference':
    'School=Abjuration ' +
    'Level=Ch5 ' +
    'Description="Spells require +%{lvl//2} Spell Energy to affect 10\' radius of touched for %{lvl} min (Will neg)"',
  'Assist':
    'School=Enchantment ' +
    'Level=Ch1 ' +
    'Description="R%{lvl//2*5+25}\' Targets in 30\' radius gain +2 skill checks for conc + 1 rd"',
  'Bestow Spell':
    'School=Evocation ' +
    'Level=Ch4 ' +
    'Description="Touched conveys spell"',
  'Bleed Power':
    'School="Greater Evocation" ' +
    'Level=Ch2 ' +
    'Description="Successful attacks on self inflict 1d6 HP each on up to %{lvl} attackers for %{lvl*10} min"',
  'Boil Blood':
    'School=Transmutation ' +
    'Level=C3 ' +
    'Description="R%{lvl//2*5+25}\' Target suffers 1d8 HP for %{lvl} rd or conc + 1 rd (Fort half)"',
  'Burial':
    'School=Transmutation ' +
    'Level=Ch1 ' +
    'Description="R%{lvl//2*5+25}\' Earth swallows non-living, unattended object target"',
  'Channel Might':
    'School=Evocation ' +
    'Level=Ch1 ' +
    'Description="Next successful melee attack by touched w/in %{lvl} rd inflicts maximum+%{lvl} HP"',
  'Confer Power':
    'School=Transmutation ' +
    'Level=Ch2 ' +
    'Description="Transfers self Spell Energy to adjacent casters for %{lvl} rd or conc + 1 rd"',
  'Fell Forbiddance':
    'School=Abjuration ' +
    'Level=Ch2 ' +
    'Description="R%{lvl//2*5+25}\' %{lvl} 5\' sq become impassible to undead for %{lvl} min (Will neg for intelligent undead)"',
  'Fey Fire':
    'School=Conjuration ' +
    'Level=Ch2,D2 ' +
    'Description="Touched point contains an invisible 5\' radius fire that warms and heals 1 HP and all nonlethal damage for %{lvl} hr"',
  'Fey Hearth':
    'School=Abjuration ' +
    'Level=Ch2 ' +
    'Description="R%{lvl//2*5+25}\' Creatures in 30\' radius of target fire gain +2 Will saves and heal 1.5 x level HP for as long as fire lasts"',
  'Greater Questing Bird':
    'School=Conjuration ' +
    'Level=Ch6 ' +
    'Description="Self temporarily learns up to 6th level spell"',
  'Inspiration':
    'School=Enchantment ' +
    'Level=Ch1 ' +
    'Description="Touched gains +10 on one Craft check"',
  'Inspirational Might':
    'School=Enchantment ' +
    'Level=Ch5 ' +
    'Description="R%{lvl//2*5+25}\' 4 allies in 30\' radius gain +2d10 temporary HP, +2 attack, and +1 Fort for %{lvl//2} rd"',
  'Joyful Speech':
    'School=Enchantment ' +
    'Level=Ch1 ' +
    'Description="R%{lvl*10+100}\' Listeners in 15\' radius improve reaction to self 1 step, are unshaken, and gain +4 vs. fear for %{lvl} rd"',
  'Know The Name':
    'School=Divination ' +
    'Level=Ch1 ' +
    'Description="Self learns names of touched (Will neg)"',
  'Lie':
    'School=Transmutation ' +
    'Level=Ch1 ' +
    'Description="Self gains +10 Bluff on next lie"',
  'Magic Circle Against Shadow':
    'School=Abjuration ' +
    'Level=Ch5 ' +
    'Description="10\' radius from touched gives +2 AC and saves, suppresses mental control, bars contact and entry (SR neg) by Shadow agents for %{lvl*10} min or traps Shadow agents (SR neg) for %{lvl} dy"',
  'Memorial':
    'School=Divination ' +
    'Level=Ch2 ' +
    'Description="Touched %{lvl*10}\' radius replays %{lvl} min events to next passerby"',
  'Pacify':
    'School=Abjuration ' +
    'Level=Ch2 ' +
    'Description="R%{lvl//2*5+25}\' %{lvl//3+1} targets in 15\' radius cannot attack for %{lvl//2} rd (Will neg)"',
  "Peasant's Rest":
    'School=Conjuration ' +
    'Level=Ch1,D1 ' +
    'Description="Touched receives benefits of 8 hr rest from 4 hr sleep"',
  'Phantom Edge':
    'School=Transmutation ' +
    'Level=Ch1 ' +
    'Description="Touched weapon attacks as a different weapon type for %{lvl} min (Will neg)"',
  'Questing Bird':
    'School=Conjuration ' +
    'Level=Ch3 ' +
    'Description="Self temporarily learns up to 3rd level spell"',
  "Scryer's Mark":
    'School=Divination ' +
    'Level=Ch2 ' +
    'Description="Touched suffers -4 Will vs. self scrying (Will neg)"',
  'Speak With Fell':
    'School=Necromancy ' +
    'Level=C3 ' +
    'Description="R%{lvl//2*5+25}\' Compels 3 correct answers from Fell target w/in %{lvl} min (Will neg)"',
  'Weather':
    'School=Conjuration ' +
    'Level=Ch2 ' +
    'Description="R%{lvl*10+100}\' Creates 60\' radius, 30\' high cylinder of rain or snow"',
  'Willful Stand':
    'School=Abjuration ' +
    'Level=Ch3 ' +
    'Description="R%{lvl*10+100}\' Target cannot attack self or enter threat space for conc (Will neg)"',
  'Withering Speech':
    'School=Enchantment ' +
    'Level=Ch2 ' +
    'Description="R%{lvl//2*5+25}\' Target suffers -1 Wisdom and Charisma each min for conc"',
  'Woeful Speech':
    'School=Enchantment ' +
    'Level=Ch1 ' +
    'Description="R%{lvl*10+100}\' Listeners in 30\' radius become shaken and suffer -2 vs. fear for %{lvl} rd (Will neg)"',

  // Honor & Shadow
  'Form Of The Meruros':
    'School=Transmutation ' +
    'Level=Ch3 ' +
    'Description="Willing touched becomes a Meruros-possessed wolf w/continuous <i>Hide From Undead</i> effects for %{lvl*10} min"',
  'Form Of The Tadulos':
    'School=Transmutation ' +
    'Level=Ch5 ' +
    'Description="Willing touched becomes a Tadulos-possessed raven w/continuous <i>Death Ward</i> and <i>Freedom Of Movement</i> effects for %{lvl*10} min"',
  'Summon Ancestral Hero':
    'School=Conjuration ' +
    'Level=Ch7 ' +
    'Description="R%{lvl//2*5+25}\' Self bargains with Dornish spirit for service"',
  'Summon Ancestral Warrior':
    'School=Conjuration ' +
    'Level=Ch4 ' +
    'Description="R%{lvl//2*5+25}\' Self bargains with Dornish spirit for service"'

};
LastAge.SPELLS_LEVELS = {
  'Acid Arrow':'Ch2',
  'Acid Fog':'Ch6',
  'Air Walk':'Ch4',
  'Alarm':'Ch1',
  'Alter Self':'Ch2',
  'Analyze Dweomer':'Ch6',
  'Animal Growth':'Ch5',
  'Animal Messenger':'Ch2',
  'Animal Shapes':'Ch8',
  'Animal Trance':'Ch2',
  'Animate Dead':'Ch4',
  'Animate Objects':'Ch6',
  'Animate Plants':'Ch7',
  'Animate Rope':'Ch1',
  'Antilife Shell':'Ch6',
  'Antimagic Field':'Ch6',
  'Antipathy':'Ch8',
  'Antiplant Shell':'Ch4',
  'Arcane Eye':'Ch4',
  'Arcane Lock':'Ch2',
  'Arcane Sight':'Ch3',
  'Astral Projection':'Ch9',
  'Atonement':'Ch5',
  'Awaken':'Ch5',
  'Baleful Polymorph':'Ch5',
  'Banishment':'Ch7',
  'Barkskin':'Ch2',
  "Bear's Endurance":'Ch2',
  'Bestow Curse':'Ch4',
  'Binding':'Ch8',
  'Black Tentacles':'Ch4',
  'Bless Weapon':'Faithful1', // Need to list because we don't import P spells
  'Blight':'Ch4',
  'Blindness/Deafness':'Ch2',
  'Blur':'Ch2',
  'Break Enchantment':'Ch5',
  "Bull's Strength":'Ch2',
  'Burning Hands':'Ch1',
  'Call Lightning':'Ch3',
  'Call Lightning Storm':'Ch5',
  'Calm Animals':'Ch1',
  "Cat's Grace":'Ch2',
  'Cause Fear':'Ch1',
  'Chain Lightning':'Ch6',
  'Changestaff':'Ch7',
  'Charm Animal':'Ch1',
  'Charm Monster':'Ch4',
  'Charm Person':'Ch1',
  'Chill Metal':'Ch2',
  'Chill Touch':'Ch1',
  'Circle Of Death':'Ch6',
  'Clairaudience/Clairvoyance':'Ch3',
  'Clenched Fist':'Ch8',
  'Clone':'Ch8',
  'Cloudkill':'Ch5',
  'Color Spray':'Ch1',
  'Command Plants':'Ch4',
  'Command Undead':'Ch2',
  'Commune With Nature':'Ch5',
  'Comprehend Languages':'Ch1',
  'Cone Of Cold':'Ch5',
  'Confusion':'Ch4',
  'Contact Other Plane':'Ch5',
  'Contagion':'Ch3',
  'Contingency':'Ch6',
  'Continual Flame':'Ch2',
  'Control Plants':'Ch8',
  'Control Undead':'Ch7',
  'Control Water':'Ch4',
  'Control Weather':'Ch7',
  'Control Winds':'Ch5',
  'Create Greater Undead':'Ch8',
  'Create Undead':'Ch6',
  'Create Water':'Ch0',
  'Creeping Doom':'Ch7',
  'Crushing Despair':'Ch4',
  'Crushing Hand':'Ch9',
  'Cure Critical Wounds':'Ch4',
  'Cure Light Wounds':'Ch1',
  'Cure Minor Wounds':'Ch0',
  'Cure Moderate Wounds':'Ch2',
  'Cure Serious Wounds':'Ch3',
  'Dancing Lights':'Ch0',
  'Darkness':'Ch2',
  'Darkvision':'Ch2',
  'Daylight':'Ch3',
  'Daze':'Ch0',
  'Daze Monster':'Ch2',
  'Death Knell':'Death2',
  'Death Ward':'Ch5',
  'Deep Slumber':'Ch3',
  'Delay Poison':'Ch2',
  'Delayed Blast Fireball':'Ch7',
  'Demand':'Ch8',
  'Detect Animals Or Plants':'Ch1',
  'Detect Chaos':'Ch2',
  'Detect Evil':'Ch2',
  'Detect Good':'Ch2',
  'Detect Law':'Ch2',
  'Detect Magic':'Ch0',
  'Detect Poison':'Ch0',
  'Detect Scrying':'Ch4',
  'Detect Secret Doors':'Ch1',
  'Detect Snares And Pits':'Ch1',
  'Detect Thoughts':'Ch2',
  'Detect Undead':'Ch1',
  'Dimensional Anchor':'Ch4',
  'Diminish Plants':'Ch3',
  'Discern Location':'Ch8',
  'Disguise Self':'Ch1',
  'Disintegrate':'Ch6',
  'Dismissal':'Ch5',
  'Dispel Magic':'Ch3',
  'Displacement':'Ch3',
  'Disrupt Undead':'Ch0',
  'Dominate Animal':'Ch3',
  'Dominate Monster':'Ch9',
  'Dominate Person':'Ch5',
  'Dream':'Ch5',
  "Eagle's Splendor":'Ch2',
  'Earthquake':'Ch8',
  'Elemental Swarm':'Ch9',
  'Endure Elements':'Ch1',
  'Energy Drain':'Ch9',
  'Enervation':'Ch4',
  'Enlarge Person':'Ch1',
  'Entangle':'Ch1',
  'Erase':'Ch1',
  'Expeditious Retreat':'Ch1',
  'Explosive Runes':'Ch3',
  'Eyebite':'Ch6',
  'Fabricate':'Ch5',
  'Faerie Fire':'Ch1',
  'False Life':'Ch2',
  'False Vision':'Ch5',
  'Fear':'Ch4',
  'Feather Fall':'Ch1',
  'Feeblemind':'Ch5',
  'Find The Path':'Ch6',
  'Finger Of Death':'Ch7',
  'Fire Seeds':'Ch6',
  'Fire Shield':'Ch4',
  'Fire Storm':'Ch7',
  'Fire Trap':'Ch4',
  'Fireball':'Ch3',
  'Flame Arrow':'Ch3',
  'Flame Blade':'Ch2',
  'Flame Strike':'Ch4',
  'Flaming Sphere':'Ch2',
  'Flare':'Ch0',
  'Flesh To Stone':'Ch6',
  'Floating Disk':'Ch1',
  'Fly':'Ch3',
  'Fog Cloud':'Ch2',
  'Forcecage':'Ch7',
  'Forceful Hand':'Ch6',
  'Foresight':'Ch9',
  "Fox's Cunning":'Ch2',
  'Freedom Of Movement':'Ch4',
  'Freedom':'Ch9',
  'Freezing Sphere':'Ch6',
  'Gaseous Form':'Ch3',
  'Gate':'Ch9',
  'Geas/Quest':'Ch6',
  'Gentle Repose':'Ch3',
  'Ghost Sound':'Ch0',
  'Ghoul Touch':'Ch2',
  'Giant Vermin':'Ch4',
  'Glibness':'Ch3',
  'Glitterdust':'Ch2',
  'Globe Of Invulnerability':'Ch6',
  'Good Hope':'Ch3',
  'Goodberry':'Ch1',
  'Grasping Hand':'Ch7',
  'Grease':'Ch1',
  'Greater Arcane Sight':'Ch7',
  'Greater Dispel Magic':'Ch6',
  'Greater Heroism':'Ch6',
  'Greater Invisibility':'Ch4',
  'Greater Magic Fang':'Ch3',
  'Greater Magic Weapon':'Ch3',
  'Greater Planar Binding':'Ch8',
  'Greater Prying Eyes':'Ch8',
  'Greater Restoration':'Ch7',
  'Greater Scrying':'Ch7',
  'Greater Shadow Conjuration':'Ch7',
  'Greater Shadow Evocation':'Ch8',
  'Greater Shout':'Ch8',
  'Guards And Wards':'Ch6',
  'Guidance':'Ch0',
  'Gust Of Wind':'Ch2',
  'Hallow':'Ch5',
  'Hallucinatory Terrain':'Ch4',
  'Halt Undead':'Ch3',
  'Haste':'Ch3',
  'Heal':'Ch7',
  'Heat Metal':'Ch2',
  "Heroes' Feast":'Ch6',
  'Heroism':'Ch3',
  'Hide From Animals':'Ch1',
  'Hideous Laughter':'Ch2',
  'Hold Animal':'Ch2',
  'Hold Monster':'Ch5',
  'Hold Person':'Ch3',
  'Hold Portal':'Ch1',
  'Holy Smite':'Faithful4', // Need to list because we don't import P spells
  'Horrid Wilting':'Ch8',
  'Hypnotic Pattern':'Ch2',
  'Hypnotism':'Ch1',
  'Ice Storm':'Ch4',
  'Identify':'Ch1',
  'Illusory Script':'Ch3',
  'Illusory Wall':'Ch4',
  'Imprisonment':'Ch9',
  'Incendiary Cloud':'Ch8',
  'Insanity':'Ch7',
  'Insect Plague':'Ch5',
  'Interposing Hand':'Ch5',
  'Invisibility':'Ch2',
  'Invisibility Sphere':'Ch3',
  'Iron Body':'Ch8',
  'Ironwood':'Ch6',
  'Irresistible Dance':'Ch8',
  'Jump':'Ch1',
  'Keen Edge':'Ch3',
  'Knock':'Ch2',
  'Know Direction':'Ch0',
  'Legend Lore':'Ch6',
  'Lesser Confusion':'Ch1',
  'Lesser Geas':'Ch4',
  'Lesser Globe Of Invulnerability':'Ch4',
  'Lesser Planar Binding':'Ch5',
  'Lesser Restoration':'Ch2',
  'Levitate':'Ch2',
  'Light':'Ch0',
  'Lightning Bolt':'Ch3',
  'Liveoak':'Ch6',
  'Locate Creature':'Ch4',
  'Locate Object':'Ch2',
  'Lullaby':'Ch0',
  'Mage Armor':'Ch1',
  'Mage Hand':'Ch0',
  "Mage's Disjunction":'Ch9',
  "Mage's Faithful Hound":'Ch5',
  "Mage's Lucubration":'Ch6',
  "Mage's Private Sanctum":'Ch5',
  "Mage's Sword":'Ch7',
  'Magic Aura':'Ch1',
  'Magic Circle Against Chaos':'Ch3',
  'Magic Circle Against Evil':'Ch3',
  'Magic Circle Against Good':'Ch3',
  'Magic Circle Against Law':'Ch3',
  'Magic Fang':'Ch1',
  'Magic Jar':'Ch5',
  'Magic Missile':'Ch1',
  'Magic Mouth':'Ch2',
  'Magic Stone':'Ch1',
  'Magic Weapon':'Ch1',
  'Major Creation':'Ch5',
  'Major Image':'Ch3',
  "Mass Bear's Endurance":'Ch6',
  "Mass Bull's Strength":'Ch6',
  "Mass Cat's Grace":'Ch6',
  'Mass Charm Monster':'Ch8',
  'Mass Cure Critical Wounds':'Ch8',
  'Mass Cure Light Wounds':'Ch5',
  'Mass Cure Moderate Wounds':'Ch6',
  'Mass Cure Serious Wounds':'Ch7',
  "Mass Eagle's Splendor":'Ch6',
  'Mass Enlarge Person':'Ch4',
  "Mass Fox's Cunning":'Ch6',
  'Mass Hold Monster':'Ch9',
  'Mass Hold Person':'Ch7',
  'Mass Invisibility':'Ch7',
  "Mass Owl's Wisdom":'Ch6',
  'Mass Reduce Person':'Ch4',
  'Mass Suggestion':'Ch6',
  'Meld Into Stone':'Ch3',
  'Mending':'Ch0',
  'Message':'Ch0',
  'Meteor Swarm':'Ch9',
  'Mind Blank':'Ch8',
  'Mind Fog':'Ch5',
  'Minor Creation':'Ch4',
  'Minor Image':'Ch2',
  'Mirage Arcana':'Ch5',
  'Mirror Image':'Ch2',
  'Misdirection':'Ch2',
  'Mislead':'Ch6',
  'Mnemonic Enhancer':'Ch4',
  'Modify Memory':'Ch4',
  'Moment Of Prescience':'Ch8',
  'Mount':'Ch1',
  'Move Earth':'Ch6',
  'Neutralize Poison':'Ch3',
  'Nightmare':'Ch5',
  'Nondetection':'Ch3',
  'Obscure Object':'Ch2',
  'Obscuring Mist':'Ch1',
  'Open/Close':'Ch0',
  'Overland Flight':'Ch5',
  "Owl's Wisdom":'Ch2',
  'Pass Without Trace':'Ch1',
  'Passwall':'Ch5',
  'Permanent Image':'Ch6',
  'Persistent Image':'Ch5',
  'Phantasmal Killer':'Ch4',
  'Phantom Steed':'Ch3',
  'Phantom Trap':'Ch2',
  'Planar Binding':'Ch6',
  'Plant Growth':'Ch3',
  'Poison':'Ch3',
  'Polar Ray':'Ch8',
  'Polymorph':'Ch4',
  'Polymorph Any Object':'Ch8',
  'Power Word Blind':'Ch7',
  'Power Word Kill':'Ch9',
  'Power Word Stun':'Ch8',
  'Prestidigitation':'Ch0',
  'Prismatic Sphere':'Ch9',
  'Prismatic Spray':'Ch7',
  'Prismatic Wall':'Ch8',
  'Produce Flame':'Ch1',
  'Programmed Image':'Ch6',
  'Project Image':'Ch7',
  'Protection From Arrows':'Ch2',
  'Protection From Chaos':'Ch1',
  'Protection From Energy':'Ch3',
  'Protection From Evil':'Ch1',
  'Protection From Good':'Ch1',
  'Protection From Law':'Ch1',
  'Protection From Spells':'Ch8',
  'Prying Eyes':'Ch5',
  'Pyrotechnics':'Ch2',
  'Quench':'Ch3',
  'Rage':'Ch3',
  'Rainbow Pattern':'Ch4',
  'Ray Of Enfeeblement':'Ch1',
  'Ray Of Exhaustion':'Ch3',
  'Ray Of Frost':'Ch0',
  'Read Magic':'Ch0',
  'Reduce Animal':'Ch2',
  'Reduce Person':'Ch1',
  'Regenerate':'Ch9',
  'Reincarnate':'Ch4',
  'Remove Curse':'Ch4',
  'Remove Disease':'Ch3',
  'Remove Fear':'Ch1',
  'Repel Metal Or Stone':'Ch8',
  'Repel Vermin':'Ch4',
  'Repel Wood':'Ch6',
  'Repulsion':'Ch6',
  'Resilient Sphere':'Ch4',
  'Resist Energy':'Ch2',
  'Resistance':'Ch0',
  'Restoration':'Ch4',
  'Reverse Gravity':'Ch7',
  'Rusting Grasp':'Ch4',
  'Scare':'Ch2',
  'Scintillating Pattern':'Ch8',
  'Scorching Ray':'Ch2',
  'Screen':'Ch8',
  'Scrying':'Ch4',
  'Sculpt Sound':'Ch3',
  'Secret Chest':'Ch5',
  'Secret Page':'Ch3',
  'Secure Shelter':'Ch4',
  'See Invisibility':'Ch2',
  'Seeming':'Ch5',
  'Sending':'Ch5',
  'Sepia Snake Sigil':'Ch3',
  'Sequester':'Ch7',
  'Shades':'Ch9',
  'Shadow Conjuration':'Ch4',
  'Shadow Evocation':'Ch5',
  'Shambler':'Ch9',
  'Shapechange':'Ch9',
  'Shatter':'Ch2',
  'Shield':'Ch1',
  'Shillelagh':'Ch1',
  'Shocking Grasp':'Ch1',
  'Shout':'Ch4',
  'Shrink Item':'Ch3',
  'Silence':'Ch2',
  'Silent Image':'Ch1',
  'Simulacrum':'Ch7',
  'Sleep':'Ch1',
  'Sleet Storm':'Ch3',
  'Slow':'Ch3',
  'Snare':'Ch3',
  'Soften Earth And Stone':'Ch2',
  'Solid Fog':'Ch4',
  'Song Of Discord':'Ch5',
  'Soul Bind':'Ch9',
  'Sound Burst':'Ch2',
  'Speak With Animals':'Ch1',
  'Speak With Plants':'Ch3',
  'Spectral Hand':'Ch2',
  'Spell Turning':'Ch7',
  'Spellstaff':'Ch6',
  'Spider Climb':'Ch2',
  'Spike Growth':'Ch3',
  'Spike Stones':'Ch4',
  'Statue':'Ch7',
  'Stinking Cloud':'Ch3',
  'Stone Shape':'Ch4',
  'Stone Tell':'Ch6',
  'Stone To Flesh':'Ch6',
  'Stoneskin':'Ch4',
  'Storm Of Vengeance':'Ch9',
  'Suggestion':'Ch3',
  'Summon Instrument':'Ch0',
  'Summon Monster I':'Ch1',
  'Summon Monster II':'Ch2',
  'Summon Monster III':'Ch3',
  'Summon Monster IV':'Ch4',
  'Summon Monster IX':'Ch9',
  'Summon Monster V':'Ch5',
  'Summon Monster VI':'Ch6',
  'Summon Monster VII':'Ch7',
  'Summon Monster VIII':'Ch8',
  "Summon Nature's Ally I":'Ch1',
  "Summon Nature's Ally II":'Ch2',
  "Summon Nature's Ally III":'Ch3',
  "Summon Nature's Ally IV":'Ch4',
  "Summon Nature's Ally IX":'Ch9',
  "Summon Nature's Ally V":'Ch5',
  "Summon Nature's Ally VI":'Ch6',
  "Summon Nature's Ally VII":'Ch7',
  "Summon Nature's Ally VIII":'Ch8',
  'Summon Swarm':'Ch2',
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
  'Tiny Hut':'Ch3',
  'Tongues':'Ch3',
  'Touch Of Fatigue':'Ch0',
  'Touch Of Idiocy':'Ch2',
  'Transformation':'Ch6',
  'Transmute Metal To Wood':'Ch7',
  'Transmute Mud To Rock':'Ch5',
  'Transmute Rock To Mud':'Ch5',
  'Trap The Soul':'Ch8',
  'Tree Shape':'Ch2',
  'True Seeing':'Ch6',
  'True Strike':'Ch1',
  'Undeath To Death':'Ch6',
  'Undetectable Alignment':'Ch1',
  'Unhallow':'Ch5',
  'Unseen Servant':'Ch1',
  'Vampiric Touch':'Ch3',
  'Veil':'Ch6',
  'Ventriloquism':'Ch1',
  'Virtue':'Ch0',
  'Vision':'Ch7',
  'Wail Of The Banshee':'Ch9',
  'Wall Of Fire':'Ch4',
  'Wall Of Force':'Ch5',
  'Wall Of Ice':'Ch4',
  'Wall Of Iron':'Ch6',
  'Wall Of Stone':'Ch5',
  'Wall Of Thorns':'Ch5',
  'Warp Wood':'Ch2',
  'Water Breathing':'Ch3',
  'Water Walk':'Ch3',
  'Waves Of Exhaustion':'Ch7',
  'Waves Of Fatigue':'Ch5',
  'Web':'Ch2',
  'Weird':'Ch9',
  'Whirlwind':'Ch8',
  'Whispering Wind':'Ch2',
  'Wind Walk':'Ch6',
  'Wind Wall':'Ch3',
  'Wood Shape':'Ch2',
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
for(let s in SRD35.SPELLS) {
  let m = SRD35.SPELLS[s].match(/\b[BD][01]|\b(C|Death|Destruction|Evil|Magic|War)[0-9]/g);
  if(m == null && !(s in LastAge.SPELLS_LEVELS))
    continue;
  let spellAttrs = SRD35.SPELLS[s] + ' Level=';
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
  'Atharak':'Level=Exotic Category=Two-Handed Damage=d6',
  'Cedeku':'Level=Exotic Category=Light Damage=d6 Threat=19',
  'Crafted Vardatch':'Level=Exotic Category=One-Handed Damage=d10 Threat=19',
  'Dornish Horse Spear':'Level=Exotic Category=Two-Handed Damage=d10 Crit=3',
  "Farmer's Rope":'Level=Simple Category=Light Damage=d2',
  'Fighting Knife':'Level=Exotic Category=Light Damage=d6 Threat=19 Crit=3',
  'Great Sling':'Level=Simple Category=Ranged Damage=d6 Range=60',
  'Greater Vardatch':'Level=Exotic Category=Two-Handed Damage=2d8',
  'Halfling Lance':'Level=Exotic Category=Two-Handed Damage=d8 Crit=3',
  'Icewood Longbow':'Level=Exotic Category=Ranged Damage=d8 Crit=3 Range=120',
  'Inutek':'Level=Exotic Category=Ranged Damage=d3 Range=20',
  'Sarcosan Lance':'Level=Exotic Category=Two-Handed Damage=d8 Crit=3 Range=20',
  'Sepi':'Level=Exotic Category=Light Damage=d6 Threat=18',
  // Shard Arrow ignored--Quilvyn doesn't list ammo
  'Staghorn':'Level=Exotic Category=One-Handed Damage=d6',
  'Tack Whip':'Level=Simple Category=Light Damage=d4',
  'Urutuk Hatchet':'Level=Exotic Category=One-Handed Damage=d8 Crit=3 Range=20',
  'Vardatch':'Level=Exotic Category=One-Handed Damage=d12'
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
      '"4:Adapter:Warrior\'s Way","4:Improviser:Warrior\'s Way",' +
      '"4:Leader Of Men:Warrior\'s Way","4:Survivor:Warrior\'s Way",' +
      '"4:Improved Grapple:Improviser Feat",' +
      '"4:Improved Unarmed Strike:Improviser Feat",' +
      '"4:Improvised Weapon:Improviser Feat",' +
      '"4:Stunning Fist:Improviser Feat",' +
      '"4:Iron Will:Leader Of Men Feat",' +
      '"4:Leadership:Leader Of Men Feat",' +
      '"4:Skill Focus (Diplomacy):Leader Of Men Feat",' +
      '"4:Skill Focus (Profession (Soldier)):Leader Of Men Feat",' +
      '"4:Combat Expertise:Survivor Feat",' +
      '"4:Dodge:Survivor Feat",' +
      '"4:Endurance:Survivor Feat"',
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
    SRD35.CLASSES.Barbarian + ' ' + LastAge.CLASS_FEATURES.Barbarian,
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
      '"1:Armor Proficiency (Padded)",' +
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
  'Fighter':SRD35.CLASSES.Fighter + ' ' + LastAge.CLASS_FEATURES.Fighter,
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
  'Rogue':SRD35.CLASSES.Rogue + ' ' + LastAge.CLASS_FEATURES.Rogue,
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
      '"3:Astirax Companion",' +
      '"legateFeatures.Death Domain ? 1:Deadly Touch",' +
      '"legateFeatures.Destruction Domain ? 1:Smite",' +
      '"legateFeatures.Evil Domain ? 1:Empowered Evil",' +
      '"legateFeatures.Magic Domain ? 1:Arcane Adept",' +
      '"legateFeatures.War Domain ? 1:Weapon Of War" ' +
    'Selectables=' +
      '"1:Death Domain:Domain",' +
      '"1:Destruction Domain:Domain",' +
      '"1:Evil Domain:Domain",' +
      '"1:Magic Domain:Domain",' +
      '"1:War Domain:Domain" ' +
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
  'Aristocrat':SRD35.NPC_CLASSES.Aristocrat,
  'Commoner':SRD35.NPC_CLASSES.Commoner,
  'Expert':SRD35.NPC_CLASSES.Expert,
  'Warrior':SRD35.NPC_CLASSES.Warrior
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
      // Taken from MN2E_Errata.pdf
      'Bluff,Concentration,Craft,"Gather Information","Handle Animal",' +
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
      '"1:Art Of Magic","1:Improved Spellcasting","1:Mastery Of Nature",' +
      '"1:Animal Companion",2:Druidcraft,"2:Nature Sense",' +
      '"3:Commune With Nature","5:Find The Way","8:Venom Immunity"',
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
      '"1:Art Of Magic","1:Improved Spellcasting",1:Seance,2:Spiritcraft,' +
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
      '"1:Armored Casting","1:Channeled Combat","2:Art Of Magic",' +
      '"2:Improved Spellcasting","6:Melee Caster","10:Regenerative Strike"',
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
      '"1:Art Of Magic","1:Improved Spellcasting","1:Whisper Sense",' +
      '"3:Fell Touch","5:Tree Meld","7:Strength Of The Wood",' +
      '"9:Whisper\'s Ward"',
  'Wizard':
    'Require=' +
      '"features.Magecraft (Hermetic)","sumSpellcastingFeats >= 2",' +
      '"skills.Knowledge (Arcana) >= 10","skills.Spellcraft >= 10",' +
      '"sumItemCreationFeats >= 1","sumMetamagicFeats >= 1" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Art Of Magic","1:Improved Spellcasting",1:Wizardcraft,' +
      '"2:Efficient Study","3:Wizard Bonus Feats","4:Bonus Spellcasting"',
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
      '"1:Coordinated Attack (Wogren)","1:Special Mount","2:Mounted Ability",' +
      '"3:Speed Mount","5:Mounted Hide","7:Wogren Dodge","9:Wogren\'s Sight" ' +
    'Selectables=' +
      '"2:Improved Mounted Archery","2:Improved Mounted Combat",' +
      '"2:Improved Ride-By Attack","2:Improved Spirited Charge",' +
      '"2:Improved Trample","2:Ride-By Attack","2:Spirited Charge",2:Trample',
  // City of Shadow
  'Lightbearer':
    'Require=' +
      '"alignment =~ \'Good\'","skills.Knowledge (History) >= 8",' +
      'features.Leadership ' +
    'HitDie=d10 Attack=3/4 SkillPoints=6 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Concentration,Craft,"Decipher Script",Diplomacy,Disguise,' +
      '"Gather Information",Heal,Hide,Knowledge,Profession,Search,' +
      '"Sense Motive",Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Cure Wounds","2:Smite Evil","4:Turn Undead","8:Destroy Undead",' +
      '10:Heal',
  // CoS web supplement
  'Harrower':
    'Require=' +
      '"alignment == \'Lawful Evil\'","skills.Diplomacy >= 8",' +
      '"skills.Gather Information >= 4","skills.Intimidate >= 8",' +
      '"features.Iron Will","features.Leadership","levels.Legate" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Concentration,Craft,Diplomacy,"Gather Information",Heal,' +
      'Intimidate,"Knowledge (Arcana)","Knowledge (History)",' +
      '"Knowledge (Shadow)",Profession,"Sense Motive",Spellcraft ' +
    'Features=' +
      '"1:Authority Of Izrador","1:Caster Level Bonus",' +
      '"2:Inspire Fanaticism","3:Speak With Dead","3:Harrower Bonus Feats"',
  'Legate Martial':
    'Require=' +
      '"alignment == \'Lawful Evil\'","skills.Concentration >= 8",' +
      '"skills.Intimidate >= 8","skills.Profession (Soldier) >= 8",' +
      '"features.Leadership","levels.Legate" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,Heal,Intimidate,"Knowledge (Arcana)",' +
      '"Knowledge (History)","Knowledge (Shadow)",Profession,Spellcraft ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Tactical Insight","2:Caster Level Bonus",' +
      '"2:Legate Martial Bonus Feats","3:Increase Morale",' +
      '"4:Divine Enhancement","8:Drain Vitality"',
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
      '"1:Black Rot","1:Gone Pale","1:Pale Heart","2:Shadow Speak",' +
      '"3:Deny Izrador\'s Power","3:Sense Dark Magic (Legate)","6:Detect Evil"',
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
  // Fury of Shadow
  'Erunsil Blood':
    'Require=' +
      '"race == \'Snow Elf\'","baseAttack >= 5",' +
      '"skills.Hide >= 8","skills.Move Silently >= 8","skills.Survival >= 8",' +
      '"features.Quick Draw","features.Track",' +
      '"features.Weapon Focus (Fighting Knife)" ' +
    'HitDie=d8 Attack=1 SkillPoints=6 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Craft,"Handle Animal",Heal,Hide,Jump,' +
      '"Knowledge (Local (Veradeen))",Listen,"Move Silently",Search,Spot,' +
      'Survival,Swim,"Use Rope" ' +
      'Features=' +
        '"1:Armor Proficiency (Light)",' +
        '"1:Weapon Proficiency (Martial)",' +
        '"1:Silent Killer","2:Cuts Like Ice","3:Destiny Marked",' +
        '"4:Pale As Snow","6:Inspiring Leader","7:Razor Sharp",' +
        '"10:Xione\'s Herald"',
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
      '"1:Art Of Magic","1:Improved Spellcasting","1:Dwarven Literacy",' +
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
      '"8:Savvy Host","10:Respect",' +
      '"collaboratorFeatures.Death Domain ? 1:Deadly Touch",' +
      '"collaboratorFeatures.Destruction Domain ? 1:Smite",' +
      '"collaboratorFeatures.Evil Domain ? 1:Empowered Evil",' +
      '"collaboratorFeatures.Magic Domain ? 1:Arcane Adept",' +
      '"collaboratorFeatures.War Domain ? 1:Weapon Of War" ' +
    'Selectables=' +
      '"6:Death Domain:Domain",' +
      '"6:Destruction Domain:Domain",' +
      '"6:Evil Domain:Domain",' +
      '"6:Magic Domain:Domain",' +
      '"6:War Domain:Domain" ' +
    'SpellAbility=wisdom ' +
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
      '"skills.Spellcraft >= 4","skills.Survival >= 4",' +
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
      '"3:Narrowswending","3:Roofjumping","3:Wallscaling"',
  // Under the Shadow
  'Visionary':
    'Require=' +
      '"charismaSkillsGe10 >= 3",features.Leadership ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Bluff,Craft,"Decipher Script",Diplomacy,Disguise,' +
      '"Gather Information","Handle Animal",Intimidate,' +
      '"Knowledge (Geography)",Perform,Profession,"Sense Motive",' +
      '"Speak Language" ' +
    'Features=' +
      '1:Vision,"1:Vision\'s Gifts","3:Guiding Light" ' +
    'Selectables=' +
      '"1:Fires Of Acceptance:Vision\'s Gift",' +
      '"1:Fires Of Conviction:Vision\'s Gift",' +
      '"1:Fires Of Destruction:Vision\'s Gift",' +
      '"features.Fires Of Acceptance/features.Fires Of Conviction/features.Fires Of Destruction ? 1:Forged In Dreams:Vision\'s Gift",' +
      '"1:Kindle Hearts:Vision\'s Gift",' +
      '"1:Kindle Minds:Vision\'s Gift",' +
      '"1:Kindle Spirits:Vision\'s Gift",' +
      '"features.Kindle Hearts/features.Kindle Minds/features.Kindle Spirits ? 1:Light The World:Vision\'s Gift",' +
      '"1:Oathbinder:Vision\'s Gift",' +
      '"features.Oathbinder ? 1:Oathholder:Vision\'s Gift",' +
      '"features.Oathbinder ? 1:Oathkeeper:Vision\'s Gift",' +
      '"features.Oathbinder/features.Oathholder/features.Oathkeeper ? 1:Oathmaker:Vision\'s Gift"'
  
};

/* Defines rules related to character abilities. */
LastAge.abilityRules = function(rules) {
  rules.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
LastAge.aideRules = function(rules, companions, familiars) {

  rules.basePlugin.aideRules(rules, companions, familiars);

  // For the purpose of companion stat computation, define companionMasterLevel
  // in terms of the number of times Animal Companion is selected/granted
  rules.defineRule('companionMasterLevel',
    'featureNotes.animalCompanion', '=', 'source * 3 - 1'
  );

  // MN companion feature set and levels differ from base rules
  let features = [
    '1:Devotion', '3:Magical Beast', '6:Companion Evasion', '9:Improved Speed',
    '12:Empathic Link'
  ];
  QuilvynRules.featureListRules
    (rules, features, 'Animal Companion', 'companionMasterLevel', false);
  features = ['Link', 'Share Spells', 'Multiattack', 'Improved Evasion'];
  for(let i = 0; i < features.length; i++)
    // Disable
    rules.defineRule
      ('animalCompanionFeatures.' + features[i], 'companionMasterLevel', '=', 'null');

  // MN rules bump Str and Tricks a bit higher
  rules.defineRule('animalCompanionStats.Str',
    'companionMasterLevel', '+', 'Math.floor(source / 3) * 2 + 2'
  );
  rules.defineRule('animalCompanionStats.Tricks',
    'companionMasterLevel', '+=', 'Math.floor(source / 3) + 2'
  );

};

/* Defines rules related to combat. */
LastAge.combatRules = function(rules, armors, shields, weapons) {
  rules.basePlugin.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
LastAge.identityRules = function(
  rules, alignments, classes, deities, paths, races, prestigeClasses, npcClasses
) {

  QuilvynUtils.checkAttrTable(paths, ['Features', 'Selectables']);

  if(rules.basePlugin == window.Pathfinder)
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
  for(let i = 0; i < 10; i++) {
    rules.defineRule('spellSlots.Ch' + i,
      'maxSpellLevel', '?', 'Math.floor(source) == ' + i,
      'channelerSpells', '=', null
    );
  }

  // Cancel base rules' calculation of Ch spell DC based on abilities;
  // LastAge bases them on the Magecraft feat.
  rules.defineRule('spellDifficultyClass.Ch',
    'charismaModifier', '=', 'null',
    'intelligenceModifier', '=', 'null',
    'wisdomModifier', '=', 'null'
  );
  // Remove Deity from editor and sheet; add heroic path and Spell Energy
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
  rules.basePlugin.magicRules(rules, schools, spells);
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
  rules.basePlugin.talentRules
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
  if(type == 'Path')
    type = 'Heroic Path';
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
  else if(type == 'Class' || type == 'NPC' || type == 'Prestige') {
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
    if(type == 'Prestige')
      rules.defineRule('levels.' + name, 'prestige.' + name, '=', null);
    else if(type == 'NPC')
      rules.defineRule('levels.' + name, 'npc.' + name, '=', null);
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
  else if(type == 'Heroic Path') {
    LastAge.heroicPathRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables')
    );
    LastAge.heroicPathRulesExtra(rules, name);
  } else if(type == 'Language')
    LastAge.languageRules(rules, name);
  else if(type == 'Race') {
    LastAge.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages')
    );
    LastAge.raceRulesExtra(rules, name);
  } else if(type == 'School') {
    LastAge.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(rules.basePlugin.schoolRulesExtra)
      rules.basePlugin.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    LastAge.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    let untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    LastAge.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergies')
    );
    if(rules.basePlugin.skillRulesExtra)
      rules.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let liquids = QuilvynUtils.getAttrValueArray(attrs, 'Liquid');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = (school || 'Universal').substring(0, 4);
    for(let i = 0; i < groupLevels.length; i++) {
      let matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      let group = matchInfo[1];
      let level = matchInfo[2] * 1;
      let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      let domainSpell = LastAge.NPC_CLASSES.Legate.includes(group + ' Domain');
      LastAge.spellRules
        (rules, fullName, school, group, level, description, domainSpell,
         liquids);
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
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
LastAge.alignmentRules = function(rules, name) {
  rules.basePlugin.alignmentRules(rules, name);
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
  rules.basePlugin.armorRules
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
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < requires.length; i++) {
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(let i = skills.length - 1; i >= 0; i--) {
      let skill = skills[i];
      if(!(skill in Pathfinder.SRD35_SKILL_MAP))
        continue;
      if(Pathfinder.SRD35_SKILL_MAP[skill] == '')
        skills.splice(i, 1);
      else
        skills[i] = Pathfinder.SRD35_SKILL_MAP[skill];
    }
  }
  rules.basePlugin.classRules(
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

  let allFeats, classFeats, feat, i;
  let classLevel = 'levels.' + name;

  if(name == 'Barbarian') {

    rules.defineRule('abilityNotes.fastMovement', classLevel, '+=', '10');

  } else if(name.endsWith(' Channeler')) {

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
    allFeats = rules.getChoices('feats');

    if(name == 'Charismatic Channeler') {
      for(feat in allFeats) {
        if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
           feat.startsWith('Spell Focus') ||
           feat.startsWith('Greater Spell Focus')) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('magicNotes.traditionGift(ForceOfPersonality)',
        'charismaModifier', '=', '3 + source',
        classLevel, '+', 'Math.floor(source / 3)'
      );
      rules.defineRule('selectableFeatureCount.Charismatic Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
    } else if(name == 'Hermetic Channeler') {
      for(feat in allFeats) {
        if(feat == 'Spell Knowledge' ||
           allFeats[feat].indexOf('Item Creation') >= 0 ||
           allFeats[feat].indexOf('Metamagic') >= 0) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('selectableFeatureCount.Hermetic Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule
        ('skillNotes.literate', classLevel, '=', 'Math.floor((source +2) / 3)');
      rules.defineRule('skillNotes.traditionGift(Lorebook)',
        classLevel, '=', null,
        'intelligenceModifier', '+', null
      );
    } else if(name == 'Spiritual Channeler') {
      for(feat in allFeats) {
        if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
           allFeats[feat].indexOf('Item Creation') >= 0) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('combatNotes.masteryOfNature.1',
        'features.Mastery Of Nature', '?', null,
        'turningLevels.Nature', '+=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfNature.2',
        'features.Mastery Of Nature', '?', null,
        'turningLevels.Nature', '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfNature.3',
        'features.Mastery Of Nature', '?', null,
        'turningFrequency', '=', null
      );
      rules.defineRule('combatNotes.masteryOfNature.4',
        'features.Mastery Of Nature', '?', null,
        'turningDamageDice', '=', null
      );
      rules.defineRule('combatNotes.masteryOfSpirits.1',
        'features.Mastery Of Spirits', '?', null,
        'turningLevels.Spirits', '+=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfSpirits.2',
        'features.Mastery Of Spirits', '?', null,
        'turningLevels.Spirits', '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfSpirits.3',
        'features.Mastery Of Spirits', '?', null,
        'turningFrequency', '=', null
      );
      rules.defineRule('combatNotes.masteryOfSpirits.4',
        'features.Mastery Of Spirits', '?', null,
        'turningDamageDice', '=', null
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.1',
        'features.Mastery Of The Unnatural', '?', null,
        'turningLevels.Unnatural', '+=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.2',
        'features.Mastery Of The Unnatural', '?', null,
        'turningLevels.Unnatural', '=', 'source * 3 - 10',
        'wisdomModifier', '+', null,
        'combatNotes.heightenedEffect', '+', '2'
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.3',
        'features.Mastery Of The Unnatural', '?', null,
        'turningFrequency', '=', null
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.4',
        'features.Mastery Of The Unnatural', '?', null,
        'turningDamageDice', '=', null
      );
      rules.defineRule('selectableFeatureCount.Spiritual Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('turningLevels.Nature', classLevel, '+=', null);
      rules.defineRule('turningLevels.Spirits', classLevel, '+=', null);
      rules.defineRule('turningLevels.Unnatural', classLevel, '+=', null);
      rules.defineRule('turningDamageDice',
        classLevel, '=', '2',
       'combatNotes.powerfulEffect', '+', '1'
      );
      rules.defineRule('turningFrequency', 'wisdomModifier', '=', '3 + source');
    }

  } else if(name == 'Defender') {

    rules.defineRule('abilityNotes.incredibleSpeed',
      'defenderFeatures.Incredible Speed', '=', 'source * 10'
    );
    rules.defineRule('combatNotes.armorClassBonus',
      classLevel, '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('combatNotes.dodgeTraining',
      'defenderFeatures.Dodge Training', '=', null
    );
    rules.defineRule('combatNotes.incredibleResilience',
      'defenderFeatures.Incredible Resilience', '=', 'source * 3'
    );
    rules.defineRule('combatNotes.masterfulStrike',
      'defenderUnarmedDamageMedium', '=', null,
      'defenderUnarmedDamageLarge', '=', null,
      'defenderUnarmedDamageSmall', '=', null
    );
    rules.defineRule('defenderUnarmedDamageLarge',
      'features.Large', '?', null,
      classLevel, '=',
        '"1d8" + (source < 7 ? "" : ("+" + Math.floor((source-1) / 6) + "d6"))'
    );
    rules.defineRule('defenderUnarmedDamageMedium',
      classLevel, '=', 'Math.floor((source+5) / 6) + "d6"'
    );
    rules.defineRule('defenderUnarmedDamageSmall',
      'features.Small', '?', null,
      classLevel, '=',
        '"1d4" + (source < 7 ? "" : ("+" + Math.floor((source-1) / 6) + "d6"))'
    );
    rules.defineRule('featureNotes.incredibleSpeedOrResilience',
      classLevel, '=', 'source < 6 ? null : Math.floor((source - 3) / 3)'
    );
    rules.defineRule('nonDefenderClassLevels',
      classLevel, '=', '-source',
      'level', '+', null
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
    rules.defineRule("selectableFeatureCount.Fighter (Warrior's Way)",
      classLevel, '=', 'source >= 4 ? 1 : null'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Improviser Feat)',
      'features.Improviser', '?', null,
      classLevel, '=', 'source >= 4 ? Math.floor((source + 2) / 6) : null'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Leader Of Men Feat)',
      'features.Leader Of Men', '?', null,
      classLevel, '=', 'source >= 4 ? Math.floor((source + 2) / 6) : null'
    );
    rules.defineRule('selectableFeatureCount.Fighter (Survivor Feat)',
      'features.Survivor', '?', null,
      classLevel, '=', 'source >= 4 ? Math.floor((source + 2) / 6) : null'
    );

  } else if(name == 'Legate') {

    rules.defineRule('combatNotes.charismaTurningAdjustment',
      'legateFeatures.Turn Undead', '=', '0',
      'charismaModifier', '+', null
    );
    rules.defineChoice('notes', 'combatNotes.charismaTurningAdjustment:%S');
    rules.defineRule('combatNotes.turnUndead.1',
      'turningLevel', '=', null,
      'combatNotes.charismaTurningAdjustment', '+', null
    );
    rules.defineRule('combatNotes.turnUndead.2',
      'turningLevel', '=', 'source * 3 - 10',
      'combatNotes.charismaTurningAdjustment', '+', null
    );
    rules.defineRule('combatNotes.turnUndead.3',
      'combatNotes.charismaTurningAdjustment', '=', 'source + 3'
    );
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
    rules.defineRule
      ('selectableFeatureCount.Legate (Domain)', classLevel, '=', '2');
    // Calculate the effect of legate level on turning level in two steps so
    // that Gone Pale can negate it.
    rules.defineRule('legateTurningLevel', classLevel, '=', null);
    rules.defineRule('turningLevel', 'legateTurningLevel', '+=', null);
    // Use animal companion stats and features for astirax abilities
    let features = [
      '3:Empathic Link', '6:Telepathy', '9:Enhanced Sense',
      '12:Companion Evasion', '18:Companion Empathy'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', 'astiraxMasterLevel', false);
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
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Legate - .* Domain/)) {
        let domain = s.replace('Legate - ', '').replace(' Domain', '');
        rules.defineRule('legateDomainLevels.' + domain,
          'legateFeatures.' + domain + ' Domain', '?', null,
          'levels.Legate', '=', null
        );
        rules.defineRule('casterLevels.' + domain,
          'legateDomainLevels.' + domain, '^=', null
        );
      }
    }

    if(rules.basePlugin == window.Pathfinder)
      // Pick up domain rules; will affect Collaborator and Shadowed as well
      Pathfinder.classRulesExtra(rules, 'Cleric');

  } else if(name == 'Wildlander') {

    rules.defineRule('abilityNotes.quickStride',
      'wildlanderFeatures.Quick Stride', '=', '10 * source'
    );
    rules.defineRule('casterLevels.Wildlander',
      'wildlanderFeatures.Sense Dark Magic', '?', null,
      'level', '=', null
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
      'featureNotes.wildlanderTraits', '+=', null
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
    if(rules.basePlugin == window.Pathfinder) {
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
    rules.defineRule('featureNotes.ancestralBladebearerBonusFeats',
      classLevel, '+=', 'Math.floor(source / 3)'
    );

  } else if(name == "Aradil's Eye") {

    rules.defineRule('skillNotes.spyInitiate',
      "levels.Aradil's Eye", '=', 'source<5? 4 : source<10 ? 8 : 10'
    );

  } else if(name == 'Avenging Knife') {

    rules.defineRule
      ('combatNotes.sneakAttack', classLevel, '+=', 'Math.floor(source / 3)');

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

  } else if(name == 'Druid') {

    rules.defineRule('combatNotes.masteryOfNature.1',
      'features.Mastery Of Nature', '?', null,
      'turningLevels.Nature', '+=', null,
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.masteryOfNature.2',
      'features.Mastery Of Nature', '?', null,
      'turningLevels.Nature', '+=', 'source * 3 - 10',
      'wisdomModifier', '+', null
    );
    rules.defineRule('combatNotes.masteryOfNature.3',
      'features.Mastery Of Nature', '?', null,
      'turningFrequency', '=', null
    );
    rules.defineRule('combatNotes.masteryOfNature.4',
      'features.Mastery Of Nature', '?', null,
      'turningDamageDice', '=', null
    );
    rules.defineRule('companionMasterLevel', classLevel, '+=', null);
    rules.defineRule('featureNotes.animalCompanion',
      classLevel, '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('druidTurningOffset',
      'charismaticChannelerFeatures.Mastery Of Nature', '?', null,
      classLevel, '=', 'source - Math.floor(source / 2)'
    );
    rules.defineRule('druidTurningLevel',
      classLevel, '=', null,
      'druidTurningOffset', '+', null
    );
    rules.defineRule('turningDamageDice', 'druidTurningLevel', '=', '2');
    rules.defineRule('turningFrequency', 'wisdomModifier', '=', '3 + source');
    rules.defineRule('turningLevels.Nature', 'druidTurningLevel', '+=', null);

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

  } else if(name == 'Freerider') {

    allFeats = rules.getChoices('feats');
    classFeats = [
      'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
      'Trample', 'Weapon Focus (Composite Longbow)',
      'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
      'Weapon Specialization (Composite Longbow)',
      'Weapon Specialization (Sarcosan Lance)',
      'Weapon Specialization (Scimitar)'
    ];
    for(i = 0; i < classFeats.length; i++) {
      feat = classFeats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    rules.defineRule('companionMasterLevel', classLevel, '+=', null);
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
      ('spellEnergy', 'magicNotes.hauntedOneSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.hauntedOneSpellsKnown', '+', null);

  } else if(name == 'Insurgent Spy') {

    rules.defineRule('combatNotes.sneakAttack',
      classLevel, '+=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule('skillNotes.shadowSpeak',
      'levels.Insurgent Spy', '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Smuggler') {

    rules.defineRule('baseAttack', 'smugglerBaseAttackAdjustment', '+', null);
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
    rules.defineRule('magicNotes.improvedSpellcasting',
      classLevel, '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Whisper Adept') {

    rules.defineRule('combatNotes.whisperSense',
      classLevel, '=',
        'source<2 ? null : source<4 ? "+2 Initiative" : ' +
        '"+2 Initiative and cannot be surprised"'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('magicNotes.whisperSense',
      classLevel, '=',
        'source<6 ? null : source<8 ? "<i>Clairaudience</i>" : ' +
        'source<10 ? "<i>Clairaudience/Clairvoyance</i>" : ' +
        '"<i>Clairaudience/Clairvoyance</i>, <i>Commune With Nature</i>"'
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
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);

  } else if(name == 'Wogren Rider') {

    rules.defineRule('companionMasterLevel', classLevel, '+=', null);
    rules.defineRule
      ('featureNotes.blindsense', "features.Wogren's Sight", '=', '30');
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

  // Supplements

  } else if(name == 'Lightbearer') {

    rules.defineRule('combatNotes.charismaTurningAdjustment',
      'lightbearerFeatures.Turn Undead', '=', '0'
    );
    rules.defineRule
      ('combatNotes.destroyUndead', classLevel, '=', 'source * 2');
    rules.defineRule('combatNotes.smiteEvil',
      classLevel, '+=', 'source>=10 ? 3 : source>=6 ? 2 : source>=2 ? 1 : null'
    );
    rules.defineRule
      ('combatNotes.smiteEvil.1', 'lightbearerSmiteAttackBonus', '^=', null);
    rules.defineRule('combatNotes.smiteEvil.2', classLevel, '=', null);
    rules.defineRule('lightbearerSmiteAttackBonus',
      'lightbearerFeatures.Smite Evil', '?', null,
      'wisdomModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('turningLevel',
      classLevel, '+=', 'source>=4 ? source - 3 : null',
      'combatNotes.destroyUndead', '+', 'source / 2 + 3'
    );

  } else if(name == 'Harrower') {

    allFeats = rules.getChoices('feats');
    classFeats = ['Investigator', 'Negotiator', 'Persuasive'];
    for(i = 0; i < classFeats.length; i++) {
      feat = classFeats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    rules.defineRule
      ('featCount.Harrower', 'featureNotes.harrowerBonusFeats', '=', null);
    rules.defineRule('featureNotes.harrowerBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule('skillNotes.authorityOfIzrador',
      classLevel, '=', 'Math.floor((source + 2) / 3)'
    );

  } else if(name == 'Legate Martial') {

    allFeats = rules.getChoices('feats');
    classFeats = [
      'Cleave', 'Combat Casting', 'Combat Reflexes', 'Great Cleave',
      'Improved Two-Weapon Fighting', 'Mounted Combat', 'Ride-By Attack',
      'Spirited Charge', 'Trample', 'Weapon Finesse'
    ];
    for(feat in allFeats) {
      if(feat.match(/^(Greater Weapon Focus|Greater Weapon Specialization|Weapon Focus)/))
        classFeats.push(feat);
    }
    for(i = 0; i < classFeats.length; i++) {
      feat = classFeats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    rules.defineRule('combatNotes.increaseMorale', classLevel, '=', null);
    rules.defineRule('combatNotes.increaseMorale.1',
      'features.Increase Morale', '?', null,
      'charismaModifier', '=', null
    );
    rules.defineRule('featCount.Legate Martial',
      'featureNotes.legateMartialBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.legateMartialBonusFeats',
      classLevel, '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      classLevel, '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Pale Legate') {

    // Negate Legate features
    rules.defineRule('notPaleLegate',
      'levels.Legate', '=', '1',
      'featureNotes.gonePale', 'v', '0'
    );
    let legateFeatures =
      QuilvynUtils.getAttrValueArray(LastAge.NPC_CLASSES.Legate, 'Features');
    legateFeatures.forEach(f => {
      f = f.replace(/^[0-9]*:/, '');
      rules.defineRule('legateFeatures.' + f, 'notPaleLegate', '?', null);
    });
    rules.defineRule('astiraxMasterLevel', 'notPaleLegate', '?', null);
    rules.defineRule('legateTurningLevel', 'notPaleLegate', '?', null);
    // Add Pale Legate features
    rules.defineRule
      ('selectableFeatureCount.Legate (Domain)', 'notPaleLegate', '?', null);
    rules.defineRule('featureNotes.senseDarkMagic',
      'features.Master Hunter', '?', null
    );
    rules.defineRule('skillNotes.shadowSpeak',
      'levels.Legate', '+', 'Math.floor(source / 2)',
      'levels.Pale Legate', '+=', 'Math.floor((source + 1) / 3)'
    );

  } else if(name == 'Warden Of Erenland') {

    rules.defineRule('channelerSpells', 'magicNotes.spiritSpeaker', '+', '1');

  } else if(name == 'Ancestral Foe') {

    rules.defineRule('ancestralFoe',
      'race', '=', 'source == "Orc" ? "dwarves, dwarrow, or dworgs" : "orcs or dworgs"'
    );

  } else if(name == 'Dwarven Loremaster') {

    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
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
      ('skillNotes.traditionGift(Lorebook)', classLevel, '=', null);

  } else if(name == 'Spirit Speaker') {

    allFeats = rules.getChoices('feats');
    for(feat in allFeats) {
      if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
         allFeats[feat].match(/Metamagic/))
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
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

  } else if(name == 'Collaborator') {

    rules.defineRule
      ('casterLevels.Domain', classLevel, '=', 'source<6 ? null : source');
    rules.defineRule('channelerSpells',
      'magicNotes.darkInvitation', '+=', '1',
      'magicNotes.savvyHost', '+=', '1'
    );
    rules.defineRule('deity', classLevel, '=', '"Izrador"');
    rules.defineRule
      ('features.Augment Summoning', 'featureNotes.savvyHost', '=', '1');
    rules.defineRule('features.Leadership', 'featureNotes.respect', '=', '1');
    rules.defineRule('features.Spellcasting (Greater Conjuration)',
      'featureNotes.darkInvitation', '=', '1'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('selectableFeatureCount.Collaborator (Domain)',
      classLevel, '=', 'source<6 ? null : 2'
    );
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Collaborator - .* Domain/)) {
        let domain = s.replace('Collaborator - ', '').replace(' Domain', '');
        rules.defineRule('collaboratorDomainLevels.' + domain,
          'collaboratorFeatures.' + domain + ' Domain', '?', null,
          'levels.Collaborator', '=', null
        );
        rules.defineRule('casterLevels.' + domain,
          'collaboratorDomainLevels.' + domain, '^=', null
        );
      }
    }

  } else if(name == 'Gardener Of Erethor') {

    allFeats = rules.getChoices('feats');
    classFeats = [
      'Craft Rune Of Power', 'Empower Spell', 'Skill Focus', 'Widen Spell'
    ];
    for(i = 0; i < classFeats.length; i++) {
      feat = classFeats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }

    rules.defineRule
      ('channelerSpells', 'magicNotes.gardenerOfErethorBonusSpells', '+', null);
    rules.defineRule('featCount.Gardener Of Erethor',
      'featureNotes.gardenerOfErethorBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.gardenerOfErethorBonusFeats',
      classLevel, '=', 'Math.floor((source - 1) / 2) - (source == 9 ? 1 : 0)'
    );
    rules.defineRule('magicNotes.gardenerOfErethorBonusSpells',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);
    rules.defineRule('skillNotes.homemaker', classLevel, '=', null);

  } else if(name == 'Snow Witch') {

    let allSpells = rules.getChoices('spells');
    let snowSpells = [
      ['Detect Magic', 'Ray Of Frost'],
      ['Chill Touch', 'Obscuring Mist'],
      ['Gust Of Wind', 'Levitate', 'Weather'],
      ['Quench', 'Sleet Storm', 'Wind Wall'],
      ['Air Walk', 'Ice Storm'],
      ['Cone Of Cold', 'Control Winds'],
      ['Freezing Sphere', 'Mislead', 'Wind Walk'],
      ['Control Weather'],
      ['Polar Ray', 'Whirlwind'],
      ['Storm Of Vengeance']
    ];
    for(let level = 0; level < snowSpells.length; level++) {
      snowSpells[level].forEach(spell => {
        let keys =
          QuilvynUtils.getKeys(allSpells, spell + '\\(Ch' + level);
        if(keys.length != 1) {
          console.log('Missing Show Witch spell "' + spell + '"');
        } else {
          rules.defineRule('snowWitchSpells.' + keys[0],
            'magicNotes.wayOfTheSnowWitch', '?', null,
            'maxSpellLevel', '=', 'source >= ' + level + ' ? 1 : null'
          );
          rules.defineRule
            ('spells.' + keys[0], 'snowWitchSpells.' + keys[0], '=', null);
        }
      });
    }
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('saveNotes.coldResistance',
      classLevel, '^=', 'source>= 10 ? Infinity : Math.floor((source+1)/3) * 5'
    );

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
    rules.defineRule('magicNotes.ignoreArmor',
      classLevel, '=', 'Math.floor(source / 2) * 10'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule('magicNotes.improvedSpellcasting.1',
      classLevel, '+=', 'Math.floor(source / 3)'
    );

  } else if(name == 'Pellurian Blade Dancer') {

    rules.defineRule('combatNotes.fluidDefense',
      classLevel, '=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featureNotes.bladeDancerBonusFeats',
      classLevel, '=', 'Math.floor(source / 2) - (source == 10 ? 1 : 0)'
    );

  } else if(name == 'Sahi') {

    allFeats = rules.getChoices('feats');
    for(feat in allFeats) {
      if(allFeats[feat].match(/Item Creation/) ||
         feat.startsWith('Spellcasting'))
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
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
    rules.defineRule
      ('features.Low-Light Vision', 'featureNotes.VisionOfTheNight', '=', '1');
    rules.defineRule('featureNotes.sahiBonusFeats',
      classLevel, '=', 'source<8 ? 1 : source<10 ? 2 : 3'
    );
    rules.defineRule('magicNotes.improvedSpellcasting', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.improvedSpellcasting.1', classLevel, '+=', null);

  } else if(name == 'Vigilant Defender') {

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

  } else if(name == 'Erunsil Blood') {

    rules.defineRule
      ('combatNotes.paleAsSnow', classLevel, '=', 'source>=8 ? 15 : null');
    rules.defineRule('featureNotes.cutsLikeIce',
      '', '=', '" and Weapon Specialization (Fighting Knife)"',
      'feats.Weapon Specialization (Fighting Knife)', '=', '" and Greater Weapon Specialization (Fighting Knife)"',
      classLevel, '=', 'source < 5 ? "" : null'
    );
    rules.defineRule('features.Greater Weapon Focus (Fighting Knife)',
      'featureNotes.cutsLikeIce', '=', '1'
    );
    rules.defineRule
      ('features.Leadership', 'featureNotes.destinyMarked', '=', '1');
    rules.defineRule('features.Weapon Specialization (Fighting Knife)',
      'featureNotes.cutsLikeIce', '=', '1'
    );
    rules.defineRule('features.Greater Weapon Specialization (Fighting Knife)',
      'featureNotes.cutsLikeIce', '=', 'source.match(/Greater/) ? 1 : null'
    );
    rules.defineRule
      ('fightingKnifeThreatRange', 'combatNotes.razorSharp', '*', '2');
    // The EB class has an unusual progression for Fort and Ref saves
    rules.defineRule('classFortitudeBonus',
      classLevel, '+', 'Math.floor(source / 2) + 1 - (source==8 || source==10 ? 1 : 0)'
    );
    rules.defineRule('classReflexBonus',
      classLevel, '+', 'Math.floor((source + 1) / 2) - (source==5 || source==7 || source==9 ? 1 : 0)'
    );

  } else if(name == 'Visionary') {

    let allSkills = rules.getChoices('skills');
    for(let s in allSkills) {
      if(allSkills[s].match(/charisma/i))
        rules.defineRule
          ('charismaSkillsGe10', 'skills.' + s, '+=', 'source>=10 ? 1 : null');
    }
    rules.defineRule("featureNotes.vision'sGifts",
      classLevel, '=', '1 + Math.floor(source / 2)'
    );
    rules.defineRule("selectableFeatureCount.Visionary (Vision's Gift)",
      "featureNotes.vision'sGifts", '=', null
    );
    rules.defineRule('skillNotes.firesOfDestruction',
      'alignment', '=',
        'source.match(/Neutral/) ? null : ' +
        '{"Chaotic Good":"Lawful Evil", "Chaotic Evil":"Lawful Good", ' +
         '"Lawful Good":"Chaotic Evil", "Lawful Evil":"Chaotic Good"}[source]'
    );

  }

  if(name.match(/Barbarian|Fighter|Rogue/) && rules.basePlugin.classRulesExtra)
    rules.basePlugin.classRulesExtra(rules, name);

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
  rules.basePlugin.companionRules(
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
  rules.basePlugin.deityRules(rules, name, alignment, domains, weapons);
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
  rules.basePlugin.familiarRules(
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
  rules.basePlugin.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by SRD35 method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the abilities passed to featRules.
 */
LastAge.featRulesExtra = function(rules, name) {

  let matchInfo;

  if(name == 'Extra Gift') {
    rules.defineRule('magicNotes.traditionGift(ForceOfPersonality)',
      'featureNotes.extraGift', '+', '4'
    );
    rules.defineRule('turningFrequency', 'featureNotes.extraGift', '+', '4');
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
    let tradition = matchInfo[1];
    let note = 'magicNotes.magecraft(' + tradition + ')';
    let ability = tradition == 'Charismatic' ? 'charisma' :
                  tradition == 'Hermetic' ? 'intelligence' : 'wisdom';
    let spellClass = tradition == 'Charismatic' ? 'Bard' :
                     tradition == 'Hermetic' ? 'Wizard' : 'Druid';
    let spellCode = spellClass.substring(0, 1);
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
      ability + 'Modifier', '=', '10 + source'
    );
    rules.defineRule('spells.Prestidigitation(Ch0 Evoc)', note, '=', '1');
    rules.defineRule('magecraftDC.' + tradition,
      'features.' + name, '?', null,
      ability + 'Modifier', '=', '10 + source'
    );
    rules.defineRule('spellDifficultyClass.Ch',
      'magecraftDC.' + tradition, '^=', null
    );
  } else if((matchInfo = name.match(/^Spellcasting\s\((.*)\)/)) != null) {
    let note = 'magicNotes.spellcasting('+matchInfo[1].replaceAll(' ', '')+')';
    rules.defineRule('channelerSpells', note, '+=', '1');
    rules.defineRule
      ('spellcastingFeatureCount', /^features.Spellcasting/, '+=', '1');
    rules.defineRule(
      'casterLevels.Spellcasting', 'spellcastingFeatureCount', '?', null,
      'level', '=', null
    );
    rules.defineRule('casterLevels.Ch', 'casterLevels.Spellcasting', '=', null);
    rules.defineRule('casterLevelArcane', 'casterLevels.Ch', '=', null);
  } else if(name == 'Dwarvencraft') {
    rules.defineRule('featureNotes.dwarvencraft',
      'skills.Craft (Armor)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Blacksmith)', '+=', 'Math.floor(source / 4)',
      'skills.Craft (Weapons)', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule
      ('featCount.Dwarvencraft', 'featureNotes.dwarvencraft', '=', null);
  } else if(rules.basePlugin.featRulesExtra) {
    rules.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
LastAge.featureRules = function(rules, name, sections, notes) {
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      let note = notes[i];
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        let pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  rules.basePlugin.featureRules(rules, name, sections, notes);
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
  rules.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
LastAge.languageRules = function(rules, name) {
  rules.basePlugin.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with heroic path #name#. The heroic
 * path grants the features listed in #features# and #selectables#.
 */
LastAge.heroicPathRules = function(rules, name, features, selectables) {
  if(rules.basePlugin == window.Pathfinder)
    rules.basePlugin.pathRules(
      rules, name, name, 'level', features, selectables, [], [], null, []
    );
  else
    rules.basePlugin.pathRules(
      rules, name, name, 'level', features, selectables, null, []
    );
  rules.defineRule('features.' + name, 'heroicPath', '=', 'source == "' + name + '" ? 1 : null');
  rules.defineSheetElement(name + ' Features', 'Feats+', null, '; ');
  rules.defineChoice('extras', name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Features');
};

/*
 * Defines in #rules# the rules associated with heroic path #name# that cannot
 * be derived directly from the abilities passed to heroicPathRules.
 */
LastAge.heroicPathRulesExtra = function(rules, name) {

  let pathLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';

  if(name == 'Beast') {

    rules.defineRule
      ('combatNotes.rage', 'constitutionModifier', '=', '5 + source');
    rules.defineRule('combatNotes.rage.1',
      'features.Rage', '?', null,
      pathLevel, '+=', 'source >= 17 ? 2 : 1'
    );
    rules.defineRule
      ('selectableFeatureCount.Beast', pathLevel, '=', 'source >= 16 ? 2 : 1');
    rules.basePlugin.featureSpells(rules,
      'Beast', 'Beast', 'charisma', 'level', '', [
        '3:Magic Fang', "4:Bear's Endurance", '8:Greater Magic Fang',
        "9:Cat's Grace", "14:Bull's Strength", '19:Freedom Of Movement'
      ]
    );
    rules.defineRule('magicNotes.beast', 'level', '?', 'source>=3');

  } else if(name == 'Chanceborn') {

    rules.defineRule
      ('features.Defensive Roll', 'features.Survivor (Chanceborn)', '=', '1');
    rules.defineRule
      ('features.Evasion', 'features.Survivor (Chanceborn)', '=', '1');
    rules.defineRule
      ('features.Slippery Mind', 'features.Survivor (Chanceborn)', '=', '1');
    rules.defineRule
      ('features.Uncanny Dodge', 'features.Survivor (Chanceborn)', '=', '1');
    rules.basePlugin.featureSpells(rules,
      'Chanceborn', 'Chanceborn', 'charisma', 'level', '', [
        '2:Resistance', '7:True Strike', '12:Aid', '17:Prayer'
      ]
    );
    rules.defineRule('magicNotes.chanceborn', 'level', '?', 'source>=2');

  } else if(name == 'Charismatic') {

    rules.basePlugin.featureSpells(rules,
      'Charismatic', 'Charismatic', 'charisma', 'level', '', [
        '1:Charm Person', '2:Remove Fear', '3:Hypnotism', '7:Aid',
        '8:Daze Monster', '11:Heroism', '13:Charm Monster', '16:Suggestion',
        '17:Greater Heroism'
      ]
    );

  } else if(name == 'Dragonblooded') {

    rules.defineRule('magicNotes.bonusSpellEnergy',
      pathLevel, '+=', 'source>=16 ? 8 : source>=11 ? 6 : source>=7 ? 4 : source>=3 ? 2 : null'
    );
    rules.defineRule('magicNotes.bonusSpells',
      pathLevel, '+=', 'source>=14 ? 3 : source>=8 ? 2 : source>=2 ? 1 : null'
    );

  } else if(name == 'Earthbonded') {

    rules.defineRule('combatNotes.naturalArmor',
      pathLevel, '+=', 'source >= 18 ? 3 : source >= 10 ? 2 : source >= 3 ? 1 : null'
    );
    rules.defineRule
      ('featureNotes.blindsense', 'earthbondedFeatures.Blindsense', '=', '30');
    rules.defineRule('skillNotes.stonecunning',
      'earthbondedFeatures.Stonecunning', '+=', '2'
    );
    rules.basePlugin.featureSpells(rules,
      'Earthbonded', 'Earthbonded', 'charisma', 'level', '', [
        '2:Hold Portal', '5:Soften Earth And Stone', '6:Make Whole',
        '7:Spike Stones', '9:Stone Shape', '11:Meld Into Stone',
        '13:Transmute Rock To Mud', '14:Stoneskin', '15:Move Earth',
        '17:Stone Tell', '19:Earthquake'
      ]
    );
    rules.defineRule('magicNotes.earthbonded', 'level', '?', 'source>=2');

  } else if(name == 'Faithful') {

    rules.defineRule
      ('turningLevel', pathLevel, '+=', 'source<4 ? null : source');
    rules.defineRule('combatNotes.turnUndead.3',
      pathLevel, '+=', 'Math.floor((source + 1) / 5)'
    );
    rules.basePlugin.featureSpells(rules,
      'Faithful', 'Faithful', 'charisma', 'level', '', [
        '1:Bless', '2:Protection From Evil', '3:Divine Favor', '6:Aid',
        '7:Bless Weapon', '8:Consecrate', '11:Daylight',
        '12:Magic Circle Against Evil', '13:Prayer', '16:Holy Smite',
        '17:Dispel Evil', '18:Holy Aura'
      ]
    );

  } else if(name == 'Fellhunter') {

    rules.basePlugin.featureSpells(rules,
      'Sense The Dead', 'SenseTheDead', 'charisma', 'level', '',
      ['1:Detect Undead']
    );

  } else if(name == 'Feyblooded') {

    rules.defineRule('selectableFeatureCount.Feyblooded',
      pathLevel, '=', 'Math.floor(source / 4)'
    );
    rules.basePlugin.featureSpells(rules,
      'Feyblooded', 'Feyblooded', 'charisma', 'level', '', [
        '2:Disguise Self', '3:Ventriloquism', '5:Magic Aura', '6:Invisibility',
        '9:Nondetection', '10:Glibness', '11:Deep Slumber', '14:False Vision',
        '15:Rainbow Pattern', '17:Mislead', '18:Seeming'
      ]
    );
    rules.defineRule('magicNotes.feyblooded', 'level', '?', 'source>=2');

  } else if(name == 'Giantblooded') {

    rules.defineRule
      ('abilityNotes.fastMovement', pathLevel, '+=', 'source >= 12 ? 10 : 5');
    rules.defineRule('combatNotes.rockThrowing',
      pathLevel, '=', 'source<6 ? 30 : source<13 ? 60 : source<19 ? 90 : 120'
    );
    rules.defineRule
      ('features.Large', 'features.Size Features (Large)', '=', null);
    LastAge.weaponRules(rules, 'Debris', 'Simple', 'Ranged', 'd10', 20, 2, 30);
    rules.defineRule('weapons.Debris', 'combatNotes.rockThrowing', '=', '1');
    rules.defineRule('debrisDamageDice',
      pathLevel, '=', 'source >= 16 ? "2d8" : source >= 9 ? "2d6" : null'
    );
    rules.defineRule('debrisRange', 'combatNotes.rockThrowing', '^=', null);

  } else if(name == 'Guardian') {

    rules.defineRule('guardianSmiteAttackBonus',
      'guardianFeatures.Smite Evil', '?', null,
      'charismaModifier', '=', 'Math.max(source, 0)'
    );
    rules.defineRule('combatNotes.smiteEvil',
      pathLevel, '+=', 'source>=18 ? 4 : source>=14 ? 3 : source>=8 ? 2 : 1'
    );
    rules.defineRule
      ('combatNotes.smiteEvil.1', 'guardianSmiteAttackBonus', '^=', null);
    rules.defineRule('combatNotes.smiteEvil.2', pathLevel, '=', null);
    rules.basePlugin.featureSpells(rules,
      'Guardian', 'Guardian', 'charisma', 'level', '', [
        '2:Detect Evil', '16:Death Ward'
      ]
    );
    rules.defineRule('magicNotes.guardian', 'level', '?', 'source>=2');

  } else if(name == 'Healer') {

    rules.basePlugin.featureSpells(rules,
      'Healer', 'Healer', 'charisma', 'level', '', [
        '1:Cure Light Wounds', '2:Lesser Restoration', '4:Cure Moderate Wounds',
        '5:Remove Disease', '7:Cure Serious Wounds',
        '8:Remove Blindness/Deafness', '10:Cure Critical Wounds',
        '11:Neutralize Poison', '13:Mass Cure Light Wounds', '14:Restoration',
        '16:Heal', '19:Regenerate', '20:Raise Dead'
      ]
    );

  } else if(name == 'Ironborn') {

    rules.defineRule('combatNotes.damageReduction',
      pathLevel, '^=', 'Math.floor(source / 5)'
    );
    rules.defineRule('combatNotes.naturalArmor',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('saveNotes.elementalResistance',
      pathLevel, '^=', 'Math.floor((source - 1) / 5) * 3'
    );
    rules.defineRule
      ('damageReduction.-', 'combatNotes.damageReduction', '^=', null);
    rules.defineRule
      ('resistance.Acid', 'saveNotes.elementalResistance', '^=', null);
    rules.defineRule
      ('resistance.Cold', 'saveNotes.elementalResistance', '^=', null);
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.elementalResistance', '^=', null);
    rules.defineRule
      ('resistance.Fire', 'saveNotes.elementalResistance', '^=', null);

  } else if(name == 'Jack-Of-All-Trades') {

    // Calculate Ch caster level and spell DC for purposes of Jack's Spell
    // Choice feature, but use only if the character isn't otherwise a caster.
    rules.defineRule('casterLevels.Ch', 'jackCasterLevel', '^=', null);
    rules.defineRule('spellDifficultyClass.Ch', 'jackSpellDC', '^=', null);
    rules.defineRule('jackCasterLevel',
      'features.Jack-Of-All-Trades', '?', null,
      'level', '=', null,
      'channelerSpells', '=', '0'
    );
    rules.defineRule('jackSpellDC',
      'features.Jack-Of-All-Trades', '?', null,
      'charismaModifier', '=', '10 + source',
      'channelerSpells', '=', '0'
    );

  } else if(name == 'Mountainborn') {

    rules.defineRule('skillNotes.mountaineer',
      pathLevel, '+=', 'Math.floor((source + 4) / 5) * 2'
    );
    rules.defineRule('skillNotes.mountaineer-1',
      pathLevel, '+=', 'Math.floor((source + 4) / 5) * 2'
    );
    rules.basePlugin.featureSpells(rules,
      'Mountainborn', 'Mountainborn', 'charisma', 'level', '', [
        '2:Endure Elements', '7:Pass Without Trace', '12:Meld Into Stone',
        '17:Stone Tell',
      ]
    );
    rules.defineRule('magicNotes.mountainborn', 'level', '?', 'source>=2');

  } else if(name == 'Naturefriend') {

    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);
    rules.basePlugin.featureSpells(rules,
      'Naturefriend', 'Naturefriend', 'charisma', 'level', '', [
        '2:Calm Animals', '3:Entangle', '4:Obscuring Mist',
        '6:Animal Messenger', '7:Wood Shape', '8:Gust Of Wind',
        '9:Speak With Animals', '11:Speak With Plants', '12:Call Lightning',
        '13:Dominate Animal', '14:Spike Growth', '16:Sleet Storm',
        "17:Summon Nature's Ally IV", '18:Command Plants', '19:Ice Storm'
      ]
    );
    /* Work around SRD35.featureSpells bug--doesn't note space in school name. */
    let allNotes = rules.getChoices('notes');
    QuilvynUtils.getKeys(allNotes, /\(Naturefriend\d/).forEach(n => {
      if(allNotes[n].includes('Greater Evocation'))
        allNotes[n] =
          allNotes[n].replaceAll('Greater Evocation', 'GreaterEvocation');
    });
    /* */
    rules.defineRule('magicNotes.naturefriend', 'level', '?', 'source>=2');
    rules.basePlugin.featureSpells(rules,
      'One With Nature', 'OneWithNature', 'charisma', 'level', '', [
      '20:Commune With Nature'
    ]);

  } else if(name == 'Northblooded') {

    rules.defineRule('resistance.Cold', 'saveNotes.coldResistance', '^=', null);
    rules.defineRule('saveNotes.coldResistance',
      pathLevel, '^=', 'source>=16 ? Infinity : source>=9 ? 15 : 5'
    );
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(name == 'Pureblood') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'purebloodHeroicPath', pathLevel,
       ['race == "Erenlander"']);
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

  } else if(name == 'Quickened') {

    rules.defineRule('abilityNotes.fastMovement',
      pathLevel, '+=', 'Math.floor((source + 2) / 5) * 5'
    );
    rules.defineRule('combatNotes.armorClassBonus',
      pathLevel, '+=', 'Math.floor((source + 3) / 5)'
    );

  } else if(name == 'Seaborn') {

    rules.defineRule('deepLungsMultiplier',
      'seabornFeatures.Deep Lungs', '^=', '2',
      pathLevel, '+', 'source >= 6 ? 2 : 1'
    );
    rules.defineRule('resistance.Cold', 'saveNotes.coldResistance', '^=', null);
    rules.defineRule
      ('saveNotes.coldResistance', pathLevel, '^=', 'source>=14 ? 5 : null');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', null
    );
    rules.defineRule('abilityNotes.naturalSwimmer',
      pathLevel, '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
    );
    rules.basePlugin.featureSpells(rules,
      'Seaborn', 'Seaborn', 'charisma', 'level', '', [
        "4:Summon Nature's Ally II", '5:Blur', "8:Summon Nature's Ally III",
        '9:Fog Cloud', "12:Summon Nature's Ally IV", '13:Displacement',
        "16:Summon Nature's Ally V", "20:Summon Nature's Ally IV"
      ]
    );
    rules.defineRule('magicNotes.seaborn', 'level', '?', 'source>=4');

  } else if(name == 'Seer') {

    rules.basePlugin.featureSpells(rules,
      'Seer', 'Seer', 'charisma', 'level', '', [
        '1:Alarm', '2:Augury', '4:Clairaudience/Clairvoyance',
        '5:Locate Object', '7:Locate Creature', '8:Speak With Dead',
        '10:Divination', '11:Scrying', '13:Arcane Eye', '14:Find The Path',
        '16:Prying Eyes', '17:Legend Lore', '19:Commune', '20:Vision'
      ]
    );

  } else if(name == 'Shadow Walker') {

    rules.basePlugin.featureSpells(rules,
      'Shadow Walker', 'ShadowWalker', 'charisma', 'level', '', [
        '3:Expeditious Retreat', '5:Blur', '7:Undetectable Alignment',
        '9:Displacement'
      ]
    );
    rules.defineRule('magicNotes.shadowWalker', 'level', '?', 'source>=3');

  } else if(name == 'Speaker') {

    rules.basePlugin.featureSpells(rules,
      'Speaker', 'Speaker', 'charisma', 'level', '', [
        '1:Comprehend Languages', '4:Whispering Wind', '8:Tongues', '12:Shout',
        '18:Greater Shout'
      ]
    );

  } else if(name == 'Spellsoul') {

    rules.defineRule('magicNotes.bonusRawEnergy',
      pathLevel, '=', 'source<9 ? 2 : source<13 ? 4 : source<18 ? 6 : 8'
    );
    rules.defineRule('magicNotes.untappedPotential',
      'highestMagicModifier', '=', 'source + 1',
      'magicNotes.bonusRawEnergy', '+', null
    );
    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'spellsoulHeroicPath', pathLevel,
       ["Sum 'feats.Magecraft' == 0", "Sum 'feats.Spellcasting' == 0"]);

  } else if(name == 'Steelblooded') {

    let allFeats = rules.getChoices('feats');
    for(let feat in allFeats) {
      if(feat.match(/Weapon\s(Focus|Proficiency|Specialization)\s\(/)) {
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="Steelblooded",');
      }
    }
    rules.defineRule('featCount.Steelblooded',
      'featureNotes.steelbloodedBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.steelbloodedBonusFeats',
      pathLevel, '=', 'Math.floor(source / 5) + 1'
    );

  } else if(name == 'Sunderborn') {

    rules.basePlugin.featureSpells(rules,
      'Sunderborn', 'Sunderborn', 'charisma', 'level', '', [
        '3:Summon Monster I', '6:Summon Monster II', '9:Summon Monster III',
        '12:Summon Monster IV', '15:Summon Monster V', '18:Summon Monster VI'
      ]
    );
    rules.defineRule('magicNotes.sunderborn', 'level', '?', 'source>=3');
    rules.basePlugin.featureSpells(rules,
      'Detect Outsider', 'DetectOutsider', 'charisma', 'level', '', [
        '1:Detect Outsider'
      ]
    );

  } else if(name == 'Warg') {

    rules.defineRule('featureNotes.animalCompanion',
      pathLevel, '+=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule
      ('featureNotes.blindsense', 'wargFeatures.Blindsense', '=', '30');
    rules.defineRule('magicNotes.wildShape',
      pathLevel, '=',
      'source >= 19 ? "medium-huge" : ' +
      'source >= 11 ? "medium-large" : ' +
      'source >= 5 ? "medium" : null'
    );
    rules.defineRule('magicNotes.wildShape.1', pathLevel, '=', null);
    rules.defineRule('magicNotes.wildShape.2',
      pathLevel, '=', 'source >= 15 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule('selectableFeatureCount.Warg',
      pathLevel, '=', 'source >= 16 ? 2 : source >= 9 ? 1 : null'
    );
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);
    rules.basePlugin.featureSpells(rules,
      'Warg', 'Warg', 'charisma', 'level', '', [
        '4:Charm Animal', '7:Speak With Animals'
      ]
    );
    rules.defineRule('magicNotes.warg', 'level', '?', 'source>=4');

  } else if(name == 'Blessed') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'blessedHeroicPath', pathLevel,
       ["alignment =~ 'Good'"]);
    rules.basePlugin.featureSpells(rules,
      'Blessed', 'Blessed', 'charisma', 'level', '', [
        '2:Bless', '4:Protection From Evil', '8:Align Weapon',
        '11:Magic Circle Against Evil', '19:Dispel Evil', '20:Holy Aura'
      ]
    );
    rules.defineRule('magicNotes.blessed', 'level', '?', 'source>=2');

  } else if(name == 'Null') {

    QuilvynRules.prerequisiteRules
      (rules, 'validation', 'nullHeroicPath', pathLevel,
       ['sumMagecraft == 0', 'skills.Use Magic Device == 0',
        'levels.Charismatic Channeler == 0','levels.Hermetic Channeler == 0',
        'levels.Spiritual Channeler == 0']);
    rules.defineRule('saveNotes.spellResistance',
      pathLevel, '=', 'Math.floor(source / 5) * 5 + 10'
    );
    rules.defineRule
      ('spellResistance', 'saveNotes.spellResistance', '^=', null);
    rules.basePlugin.featureSpells(rules,
      'Null', 'Null', 'charisma', 'level', '', [
        '4:Dispel Magic', '8:Dispel Magic', '13:Greater Dispel Magic',
        '17:Spell Immunity', '18:Antimagic Field'
      ]
    );
    rules.defineRule('magicNotes.null', 'level', '?', 'source>=4');

  } else if(name == 'Shadowed') {

    rules.defineRule
      ('casterLevels.Domain', pathLevel, '=', 'source<5 ? null : 1');
    rules.defineRule('combatNotes.charismaTurningAdjustment',
      'shadowedFeatures.Turn Undead', '=', '0'
    );
    rules.defineRule('deity', pathLevel, '=', '"Izrador"');
    rules.defineRule
      ('magicNotes.giftOfIzrador', pathLevel, '=', 'Math.floor(source / 5)');
    rules.defineRule('selectableFeatureCount.Shadowed (Domain)',
      'magicNotes.giftOfIzrador', '=', null
    );
    rules.defineRule('magicNotes.shadowed', 'level', '?', 'source>=2');
    rules.defineRule
      ('spellSlots.Domain1', 'magicNotes.giftOfIzrador', '=', null);
    // Note: assume full level; book doesn't say whether to use this or level-8
    rules.defineRule
      ('turningLevel', pathLevel, '+=', 'source<9 ? null : source');
    rules.basePlugin.featureSpells(rules,
      'Shadowed', 'Shadowed', 'charisma', 'level', '', [
        '2:Detect Good', '2:Detect Evil', '3:Bane', '6:Summon Monster I',
        '8:Death Knell'
      ]
    );
    for(let s in rules.getChoices('selectableFeatures')) {
      if(s.match(/Shadowed - .* Domain/)) {
        let domain = s.replace('Shadowed - ', '').replace(' Domain', '');
        rules.defineRule('shadowedDomainLevels.' + domain,
          'shadowedFeatures.' + domain + ' Domain', '?', null,
          pathLevel, '=', null
        );
        rules.defineRule('casterLevels.' + domain,
          'shadowedDomainLevels.' + domain, '^=', null
        );
      }
    }

  }

};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages.
 */
LastAge.raceRules = function(
  rules, name, requires, features, selectables, languages
) {
  rules.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the attributes passed to raceRules.
 */
LastAge.raceRulesExtra = function(rules, name) {

  let prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replaceAll(' ', '');
  let raceLevel = prefix + 'Level';

  if(name == 'Agrarian Halfling') {
    rules.defineRule
      ('combatNotes.toughness', 'agrarianHalflingFeatures.Toughness', '+=', '3');
    rules.defineRule('selectableFeatureCount.Agrarian Halfling',
      'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
    );
  } else if(name == 'Danisil-Raised Elfling') {
    rules.defineRule('featureNotes.mixedBlood',
      'danisil-RaisedElflingFeatures.Mixed Blood', '=', '"Elf and halfling"'
    );
  } else if(name == 'Clan Dwarf') {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
    rules.defineRule('skillNotes.stonecunning',
      'clanDwarfFeatures.Stonecunning', '+=', '2'
    );
  } else if(name == 'Dorn') {
    rules.defineRule
      ('featCount.Fighter', 'featureNotes.dornExtraFeat', '+=', '1');
    rules.defineRule('skillNotes.dornSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Dwarf-Raised Dwarrow') {
    rules.defineRule('featureNotes.mixedBlood',
      'dwarf-RaisedDwarrowFeatures.Mixed Blood', '=', '"Dwarf and gnome"'
    );
    rules.defineRule('selectableFeatureCount.Dwarf-Raised Dwarrow',
      'race', '=', 'source == "Dwarf-Raised Dwarrow" ? 1 : null'
    );
    rules.defineRule('skillNotes.stonecunning',
      'dwarf-RaisedDwarrowFeatures.Stonecunning', '+=', '2'
    );
  } else if(name == 'Dworg') {
    rules.defineRule('featureNotes.mixedBlood',
      'dworgFeatures.Mixed Blood', '=', '"Dwarf and orc"'
    );
    rules.defineRule('selectableFeatureCount.Dworg',
      'race', '=', 'source == "Dworg" ? 1 : null'
    );
    rules.defineRule
      ('skillNotes.stonecunning', 'dworgFeatures.Stonecunning', '+=', '2');
  } else if(name == 'Halfling-Raised Elfling') {
    rules.defineRule('featureNotes.mixedBlood',
      'halfling-RaisedElflingFeatures.Mixed Blood', '=', '"Elf and halfling"'
    );
  } else if(name == 'Erenlander') {
    rules.defineRule
      ('featCount.General', 'featureNotes.erenlanderExtraFeats', '+=', '2');
    rules.defineRule
      ('skillNotes.erenlanderSkillBonus', raceLevel, '=', '(source + 3) * 2');
  } else if(name == 'Gnome') {
    rules.defineRule
      ('deepLungsMultiplier', 'gnomeFeatures.Deep Lungs', '=', '3');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
    for(let s in rules.getChoices('skills')) {
      if(s.startsWith('Perform'))
        rules.defineRule
          ('skillModifier.' + s, 'skillNotes.naturalRiverfolk', '+', '2');
    }
  } else if(name == 'Gnome-Raised Dwarrow') {
    rules.defineRule('abilityNotes.naturalSwimmer',
      'speed', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('deepLungsMultiplier',
      'gnome-RaisedDwarrowFeatures.Deep Lungs', '=', '3'
    );
    rules.defineRule('featureNotes.mixedBlood',
      'gnome-RaisedDwarrowFeatures.Mixed Blood', '=', '"Dwarf and gnome"'
    );
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
  } else if(name == 'Jungle Elf') {
    rules.defineRule
      ('magicNotes.innateMagic', 'magicNotes.bonusInnateSpell', '+', '1');
    rules.defineRule('magicNotes.naturalChanneler', raceLevel, '=', '2');
  } else if(name == 'Kurgun Dwarf') {
    rules.defineRule
      ('abilityNotes.armorSpeedAdjustment', 'abilityNotes.steady', '^', '0');
  } else if(name == 'Nomadic Halfling') {
    rules.defineRule('selectableFeatureCount.Nomadic Halfling',
      'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
    );
  } else if(name == 'Orc') {
    rules.defineRule
      ('skillNotes.naturalPredator', 'strengthModifier', '=', null);
  } else if(name == 'Plains Sarcosan') {
    rules.defineRule
      ('featCount.General', 'featureNotes.sarcosanExtraFeat', '+=', '1');
    rules.defineRule
      ('skillNotes.sarcosanSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Sea Elf') {
    rules.defineRule
      ('abilityNotes.naturalSwimmer', 'speed', '=', 'Math.floor(source / 2)');
    rules.defineRule
      ('deepLungsMultiplier', 'seaElfFeatures.Deep Lungs', '=', '6');
    rules.defineRule('magicNotes.naturalChanneler', raceLevel, '=', '2');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
  } else if(name == 'Snow Elf') {
    rules.defineRule('magicNotes.naturalChanneler', raceLevel, '=', '2');
  } else if(name == 'Urban Sarcosan') {
    rules.defineRule
      ('featCount.General', 'featureNotes.sarcosanExtraFeat', '+=', '1');
    rules.defineRule
      ('skillNotes.sarcosanSkillBonus', raceLevel, '=', 'source + 3');
  } else if(name == 'Wood Elf') {
    rules.defineRule
      ('magicNotes.innateMagic', 'magicNotes.bonusInnateSpell', '+', '1');
    rules.defineRule('magicNotes.naturalChanneler', raceLevel, '=', '3');
    rules.defineRule('skillNotes.woodElfSkillBonus', raceLevel, '=', 'source');
  }

  // Since we inherit no races, no need to invoke basePlugin.raceRulesExtra

};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
LastAge.schoolRules = function(rules, name, features) {
  rules.basePlugin.schoolRules(rules, name, features);
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
  rules.basePlugin.shieldRules
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
  rules.basePlugin.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects. #liquids# lists any liquid forms via
 * which the spell can be applied.
 */
LastAge.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell, liquids
) {
  rules.basePlugin.spellRules
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
  rules.basePlugin.weaponRules(
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
  if(type == 'Heroic Path')
    return [
      ['Features', 'Features', 'text', [40]],
      ['Selectables', 'Selectable Features', 'text', [40]]
    ];
  else
    return rules.basePlugin.choiceEditorElements(rules, type);
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
LastAge.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'spells') {
    // For Channelers, pick only from spells for which the character has the
    // corresponding Spellcasting feature and distribute the spells among
    // those of the maximum allowed spell level and lower.
    let attrs = this.applyRules(attributes);
    let spells = this.getChoices('spells');
    for(let attr in attrs) {
      let matchInfo = attr.match(/^spellSlots\.([A-Z][A-Za-z]*)([0-9])$/);
      if(!matchInfo)
        continue;
      let group = matchInfo[1];
      let level = matchInfo[2];
      if(group == 'Domain')
        group = '(' + QuilvynUtils.getKeys(attrs, /^features.*Domain$/).map(x => x.replace(/features.| Domain/g, '')).join('|') + ')';
      let magecraftSchools = QuilvynUtils.getKeys(attrs, /^features.Spellcasting/).map(x =>  x.replace(/.*\(|\).*/g, '').substring(0, 4)); 
      let spellPat = group == 'Ch' ?
        new RegExp('\\(Ch[0-' + level + '] ('+magecraftSchools.join('|')+')') :
        new RegExp('\\(' + group + level);
      let knownAlready = new Set(QuilvynUtils.getKeys(attrs, spellPat));
      let choices =
        QuilvynUtils.getKeys(spells, spellPat).filter(x=>!knownAlready.has(x));
      for(let leftToPick = attrs[attr] - knownAlready.size;
          leftToPick > 0 && choices.length > 0;
          leftToPick--) {
        let index = QuilvynUtils.random(0, choices.length - 1);
        attributes['spells.' + choices[index]] = 1;
        choices.splice(index, 1);
      }
    }
  } else {
    this.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns an array of plugins upon which this one depends. */
LastAge.getPlugins = function() {
  return [this.basePlugin].concat(this.basePlugin.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
LastAge.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Midnight Rule Set Notes</h2>\n' +
    '<p>\n' +
    'Quilvyn Midnight Rule Set Version ' + LastAge.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
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
    '    Quilvyn removes the racial requirement (elf or halfling) from the\n' +
    '    Innate Magic feat. Since these races automatically receive this\n' +
    '    feat, enforcing the requirement would eliminate the possibility\n' +
    '    of any character selecting it.\n' +
    '  </li><li>\n' +
    '    <i>Sorcery And Shadow</i> and other supplement books describe the\n' +
    '    Art Of Magic and Improved Spellcasting features differently than\n' +
    '    does the core rulebook. Quilvyn uses the core rulebook\n' +
    '    definitions, changing prestige class features from the supplements\n'+
    '    as appropriate.\n' +
    '  </li><li>\n' +
    '    For Pale Legates, Quilvyn retains the base attack and save bonuses\n' +
    '    derived from levels in the Legate class. Other Legate features are\n' +
    '    canceled by the Gone Pale feature.\n' +
    '  </li><li>\n' +
    '    The LastAge rule set allows you to add homebrew choices for all\n' +
    '    of the same types discussed in the <a href="plugins/homebrew-srd35.html">SRD v3.5 Homebrew Examples document</a>,\n' +
    '    with the exception of deity. When using Pathfinder as the base\n' +
    '    rule set, homebrew traits are also allowed. In addition, the\n' +
    '    rule set supports adding homebrew heroic paths, which require the\n' +
    '    name and lists of features and selectable features similar to\n' +
    '    those specified for homebrew classes.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
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
    '\n' +
    '<h3>Known Bugs</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn increases the bonuses of the Feyblooded Unearthly Grace\n' +
    "    feature rise as the character's level and abilities increase,\n" +
    '    rather than leaving them fixed as specified in the rule book.\n' +
    '  </li><li>\n' +
    '    Quilvyn gives Wildlander characters boosts in both initiative and\n' +
    '    skills at levels 6, 9, 12, etc. instead of a choice of the two.\n' +
    '  </li><li>\n' +
    '    Quilvyn uses charisma instead of wisdom to calculate the Turn\n' +
    '    Undead abilities of the Lightbearer prestige class\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    "Quilvyn\'s Midnight Rule Set uses Open Game Content " +
    'released by Fantasy Flight Publishing, Inc. under the Open Game ' +
    'License. Copyright 2003-2007, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'System Reference Document material is Open Game Content released by ' +
    'Wizards of the Coast under the Open Game License. System Reference ' +
    'Document Copyright 2000-2003, Wizards of the Coast, Inc.; Authors ' +
    'Jonathan Tweet, Monte Cook, Skip Williams, Rich Baker, Andy Collins, ' +
    'David Noonan, Rich Redman, Bruce R. Cordell, John D. Rateliff, Thomas ' +
    'Reid, James Wyatt, based on original material by E. Gary Gygax and Dave ' +
    'Arneson.\n' +
    '</p><p>\n' +
    'Pathfinder Roleplaying Game Reference Document. © 2011, Paizo ' +
    'Publishing, LLC; Author: Paizo Publishing, LLC.\n' +
    '</p><p>\n' +
    'Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC. You ' +
    'should have received a copy of the Open Game License with this program; ' +
    'if not, you can obtain one from ' +
    'https://media.wizards.com/2016/downloads/SRD-OGL_V1.1.pdf. ' +
    '<a href="plugins/ogl-lastage.txt">Click here</a> to see the license.<br/>\n'+
    '</p><p>\n' +
    'MIDNIGHT 2ND EDITION Copyright 2005, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'City of Shadow Copyright 2003, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Destiny and Shadow Copyright 2006, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Fury of Shadow Copyright 2004, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Hammer and Shadow Copyright 2005, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Honor and Shadow Copyright 2007, Fantasy Flight Publishing, Inc.\n' +
    '</p>\n' +
    'Sorcery and Shadow Copyright 2003, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Star and Shadow Copyright 2005, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Under the Shadow Copyright 2004, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    // Presently, no material is taken from the supplements listed below
    'Forge of Shadow Copyright 2004, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Hand of Shadow Copyright 2006, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Heart of Shadow Copyright 2005, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Legends of Shadow Copyright 2006, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Minions of the Shadow Copyright 2003, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n' +
    'Steel and Shadow Copyright 2004, Fantasy Flight Publishing, Inc.\n' +
    '</p><p>\n';
};
