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

/*jshint esversion: 6 */
"use strict";

var LASTAGE_VERSION = '2.1.1.4';

/*
 * This module loads the rules from the Second Edition core rule book. The
 * LastAge function contains methods that load rules for particular parts of
 * the rule book; raceRules for character races, weaponRules for weapons, etc.
 * These member methods can be called independently in order to use a subset of
 * the LastAge rules. Similarly, the constant fields of LastAge (FEATS_ADDED,
 * RACES, etc.) can be manipulated to modify the choices.
 */
function LastAge() {

  if(window.SRD35 == null) {
    alert('The LastAge module requires use of the SRD35 module');
    return;
  }

  if(window.Pathfinder == null || Pathfinder.SRD35_SKILL_MAP == null) {
    LastAge.USE_PATHFINDER = false;
  }
  LastAge.basePlugin = LastAge.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Last Age' + (LastAge.USE_PATHFINDER ? ' - PF' : ''), LASTAGE_VERSION);
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

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset', 'race', 'heroicPath', 'level', 'levels');

  LastAge.ALIGNMENTS = Object.assign({}, LastAge.basePlugin.ALIGNMENTS);
  LastAge.ANIMAL_COMPANIONS = Object.assign(
    {}, LastAge.basePlugin.ANIMAL_COMPANIONS, LastAge.ANIMAL_COMPANIONS_ADDED
  );
  LastAge.ARMORS = Object.assign({}, LastAge.basePlugin.ARMORS);
  LastAge.CLASSES['Barbarian'] = LastAge.basePlugin.CLASSES['Barbarian'];
  LastAge.CLASSES['Rogue'] = LastAge.basePlugin.CLASSES['Rogue'];
  LastAge.FAMILIARS = Object.assign({}, LastAge.basePlugin.FAMILIARS);
  LastAge.FEATS =
    Object.assign({}, LastAge.basePlugin.FEATS, LastAge.FEATS_ADDED);
  LastAge.FEATURES =
    Object.assign({}, LastAge.basePlugin.FEATURES, LastAge.FEATURES_ADDED);
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
  LastAge.SPELLS =
    Object.assign({}, LastAge.basePlugin.SPELLS, LastAge.SPELLS_ADDED);
  for(var spell in LastAge.SPELL_SCHOOL_CHANGES) {
    LastAge.SPELLS[spell] +=
      ' School="' + LastAge.SPELL_SCHOOL_CHANGES[spell] + '"';
  }
  LastAge.WEAPONS =
    Object.assign({}, LastAge.basePlugin.WEAPONS, LastAge.WEAPONS_ADDED);

  LastAge.abilityRules(rules);
  LastAge.aideRules(rules, LastAge.ANIMAL_COMPANIONS, LastAge.FAMILIARS);
  LastAge.combatRules(rules, LastAge.ARMORS, LastAge.SHIELDS, LastAge.WEAPONS);
  // Most spell definitions are handled by individual classes and pathes.
  // Schools must be defined before this can be done.
  LastAge.magicRules(rules, LastAge.SCHOOLS, []);
  // Feats must be defined before paths
  LastAge.talentRules
    (rules, LastAge.FEATS, LastAge.FEATURES, LastAge.LANGUAGES, LastAge.SKILLS);
  LastAge.identityRules(
    rules, LastAge.ALIGNMENTS, LastAge.CLASSES, LastAge.DEITIES, LastAge.PATHS,
    LastAge.RACES
  );
  LastAge.goodiesRules(rules);

  if(window.SRD35NPC != null) {
    SRD35NPC.identityRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.talentRules(rules, SRD35NPC.FEATURES);
  }

  Quilvyn.addRuleSet(rules);

}

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
    'Type="Item Creation" Require="Sum \'features.Magecraft\' >= 1","level >= 12","sumChannelingFeats >= 3"',
  'Craft Spell Talisman':
    'Type="Item Creation" Require="Sum \'features.Magecraft\' >= 1","Sum features.Spellcasting >= 1","level >= 3"',
  'Devastating Mounted Assault':
    'Type=Fighter Require="features.Mounted Combat >= 1","skills.Ride >= 10"',
  'Drive It Deep':'Type=Fighter Require="baseAttack >= 1"',
  'Extra Gift':
    'Type=General Require="levels.Charismatic Channeler >= 4 || levels.Spiritual Channeler >= 4"',
  'Friendly Agent':
    'Type=General Require="alignment =~ \'Good\'","race =~ \'Gnome|Dorn|Erenlander|Sarcosan\'"',
  'Giant Fighter':'Type=Fighter Require="Sum features.Weapon Focus >= 1"',
  'Greater Spell Focus (Greater Conjuration)':
    'Type=General Require="features.Spell Focus (Greater Conjuration)"',
  'Greater Spell Focus (Greater Evocation)':
    'Type=General Require="features.Spell Focus (Greater Evocation)"',
  'Herbalist':'Type="Item Creation" Require="skills.Profession (Herbalist) >= 4"',
  'Improvised Weapon':'Type=Fighter',
  'Innate Magic':'Type=General',
  'Inconspicuous':'Type=General',
  'Knife Thrower':'Type=Fighter Require="race =~ \'Jungle Elf|Snow Elf\'"',
  'Lucky':'Type=General',
  'Magecraft (Charismatic)':'Type=Channeling',
  'Magecraft (Hermetic)':'Type=Channeling',
  'Magecraft (Spiritual)':'Type=Channeling',
  'Magic Hardened':'Type=General Require="race =~ \'Dwarf|Dworg|Orc\'"',
  'Natural Healer':'Type=General',
  'Orc Slayer':'Type=FighterGeneral',
  'Quickened Donning':'Type=Fighter',
  'Ritual Magic':
    'Type=Channeling Require="Sum \'features.Magecraft\' >= 1","Sum \'features.Spellcasting\' >= 1"',
  'Sarcosan Pureblood':'Type=General Require="race =~ \'Sarcosan\'"',
  'Sense Nexus':'Type=General',
  'Spell Focus (Abjuration)':
    'Type=General Require="features.Spellcasting (Abjuration)"',
  'Spell Focus (Conjuration)':
    'Type=General Require="features.Spellcasting (Conjuration)"',
  'Spell Focus (Divination)':
    'Type=General Require="features.Spellcasting (Divination)"',
  'Spell Focus (Enchantment)':
    'Type=General Require="features.Spellcasting (Enchantment)"',
  'Spell Focus (Evocation)':
    'Type=General Require="features.Spellcasting (Evocation)"',
  'Spell Focus (Greater Conjuration)':
    'Type=General Require="features.Spellcasting (Conjuration)"',
  'Spell Focus (Greater Evocation)':
    'Type=General Require="features.Spellcasting (Evocation)"',
  'Spell Focus (Illusion)':
    'Type=General Require="features.Spellcasting (Illusion)"',
  'Spell Focus (Necromancy)':
    'Type=General Require="features.Spellcasting (Necromancy)"',
  'Spell Focus (Transmutation)':
    'Type=General Require="features.Spellcasting (Transmutation)"',
  'Spellcasting (Abjuration)':'Type=Channeling,Spellcasting',
  'Spellcasting (Conjuration)':'Type=Channeling,Spellcasting',
  'Spellcasting (Divination)':'Type=Channeling,Spellcasting',
  'Spellcasting (Enchantment)':'Type=Channeling,Spellcasting',
  'Spellcasting (Evocation)':'Type=Channeling,Spellcasting',
  'Spellcasting (Illusion)':'Type=Channeling,Spellcasting',
  'Spellcasting (Necromancy)':'Type=Channeling,Spellcasting',
  'Spellcasting (Transmutation)':'Type=Channeling,Spellcasting',
  'Spellcasting (Greater Conjuration)':
    'Type=Channeling,Spellcasting Require="features.Spellcasting (Conjuration)"',
  'Spellcasting (Greater Evocation)':
    'Type=Channeling,Spellcasting Require="features.Spellcasting (Evocation)"',
  // Skill Focus (Profession (Soldier)) available to Leader Of Men Fighters
  'Skill Focus (Profession (Soldier))':'Type=General',
  'Spell Knowledge':'Type=General Require="Sum \'features.Spellcasting\' >= 1"',
  'Thick Skull':'Type=General',
  'Warrior Of Shadow':'Type=General Require="charisma >= 12","levels.Legate >= 5"',
  // Legates w/War domain receive Weapon Focus (Longsword)
  'Weapon Focus (Longsword)':'Type=Fighter',
  'Whispering Awareness':'Type=General Require="wisdom >= 15","race =~ \'Elf\'"',
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
  'Touched By Magic':'Type=General Require="race =~ \'Dwarf|Orc\'"',
  'Trapsmith':'Type=General',
  'Tunnel Fighting':'Type=Fighter',
  // TBD Dwarvencraft Techniques -- probably selectable features

  // Honor & Shadow
  'Born Of Duty':'Type=General Require="alignment =~ \'Lawful\'","race == \'Dorn\'"',
  'Born Of The Grave':'Type=General Require="alignment !~ \'Good\'","race == \'Dorn\'"',
  // Sorcery & Shadow
  'Blood-Channeler':
    'Type=General Require="constitution >= 15","Sum \'features.Magecraft\' >= 1"',
  'Craft Rune Of Power':
    'Type="Item Creation" Require="Sum \'features.Magecraft\' >= 1","Sum \'features.Spellcasting\' >= 1","level >= 3"',
  'Flexible Recovery':
    'Type=General Require="constitution >= 13","Sum \'features.Magecraft\' >= 1"',
  'Improved Flexible Recovery':
    'Type=General Require="constitution >= 15","features.Flexible Recovery","Sum \'features.Magecraft\' >= 1"',
  'Knack For Charms':
    'Type="Item Creation" Require="skills.Knowledge (Arcana) >= 4","skills.Knowledge (Nature) >= 4"',
  'Living Talisman':
    'Type=General Require="Sum \'features.Magecraft\' >= 1","Sum \'features.Spellcasting\' >= 1","level >= 5","skills.Knowledge (Arcana) >= 6"',
  'Power Reservoir':'Type=General Require="Sum \'features.Magecraft\' >= 1"',
  'Sense Power':'Type=General Require="wisdom >= 15"',
  'Subtle Caster':'Type=General Require="Sum \'features.Magecraft\' >= 1"',

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
  'Ability Boost':'Section=ability Note="%V to distribute"',
  'Ability Recovery':'Section=combat Note="Regain 1 point ability damage/hr"',
  'Aid Another':'Section=combat Note="Aid another as a move action"',
  'Aided Combat Bonus':'Section=combat Note="Aided ally +%V attack or AC"',
  'Ambush':'Section=skill Note="Allies use self Hide for ambush"',
  'Animal Companion':
    'Section=feature Note="Special bond and abilities w/up to %V animals"',
  'Animal Friend':
    'Section=combat,skill ' +
    'Note="Animals DC %V Will save to attack",' +
         '"+4 Handle Animal"',
  'Aquatic Adaptation':
    'Section=skill Note="Breathe through gills, no underwater pressure damage"',
  'Aquatic Ally':
    'Section=magic Note="Aquatic <i>Summon Nature\'s Ally %V</i> %V/dy"',
  'Aquatic Blindsight':
    'Section=skill Note="R%V\' Detect creatures in opaque water"',
  'Aquatic Emissary':'Section=skill Note="Speak to all aquatic animals"',
  'Assist Allies':
    'Section=skill Note="Allies move in water at full speed, share oxygen"',
  'Aura Of Courage':'Section=save Note="Immune fear, +4 to allies w/in 30\'"',
  'Aura Of Warmth':'Section=magic Note="R10\' Allies +4 Fortitude vs cold"',
  'Battle Cry':'Section=combat Note="+%V hit points until damaged %1/dy"',
  'Bestial Aura':
    'Section=combat,skill ' +
    'Note="Turn animals",' +
         '"-10 Handle Animal, no Wild Empathy"',
  'Big':'Section=combat,skill Note="Use Large weapons","-4 Hide"',
  'Blindsense':
     'Section=feature Note="R30\' Other senses detect unseen objects"',
  'Blindsight':
    'Section=feature Note="R30\' Other senses compensate for loss of vision"',
  'Blood Of Kings':
    'Section=skill ' +
    'Note="Daily +%V Cha skills in Shadow or resistance interactions"',
  'Blood Of The Planes':'Section=skill Note="+%V Cha skills with outsiders"',
  'Bolster Spell':'Section=magic Note="Add 1 to DC of %V chosen spells"',
  'Bonus Spell Energy':'Section=magic Note="+%V"',
  'Bonus Spells':'Section=magic Note="%V additional Channeler spells"',
  'Burst Of Speed':
    'Section=combat ' +
    'Note="Extra attack or move action for %V rd %1/dy; fatigued afterward"',
  'Charisma Bonus':'Section=ability Note="+%V Charisma"',
  'Cold Immunity':
    'Section=save Note="No damage from cold, x1.5 damage from fire"',
  'Cold Resistance':'Section=save Note="Ignore first %V points cold damage"',
  'Combat Overview':
    'Section=combat ' +
    'Note="R60\' Ally avoid AOO and flat-footed, foe flat-footed %V/dy"',
  'Constitution Bonus':'Section=ability Note="+%V Constitution"',
  'Coordinated Initiative':
    'Section=combat Note="R30\' Allies use self initiative %V/dy"',
  'Damage Reduction':'Section=combat Note="Subtract %V from damage taken"',
  'Death Ward':
    'Section=save Note="Immune to negative energy and death effects"',
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
  'Elemental Friend':
    'Section=combat,skill ' +
    'Note="Elementals DC %V Will save to attack",' +
         '"+4 Diplomacy (elementals)"',
  'Enhanced Bestial Aura':
    'Section=feature Note="R15\' Animals act negatively, cannot ride"',
  'Extended Darkvision':'Section=feature Note="+30\' b/w vision in darkness"',
  'Extra Reach':'Section=combat Note="15\' reach"',
  'Fast Movement':'Section=ability Note="+%V Speed"',
  'Fearsome Charge':
    'Section=combat Note="+%V damage, -1 AC for every 10\' in charge"',
  'Feat Bonus':'Section=feature Note="+%V General Feat"',
  'Ferocity':'Section=combat Note="Continue fighting below 0 HP"',
  'Fey Vision':'Section=magic Note="Detect %V auras at will"',
  'Fortitude Bonus':'Section=save Note="+%V Fortitude"',
  'Frightful Presence':
    'Section=magic ' +
    'Note="Casting panics or shakes foes of lesser level 4d6 rd (DC %V Will neg)"',
  'Frost Weapon':
    'Section=combat Note="+d6 cold damage on hit for %V rd %1/dy"',
  'Greater Frost Weapon':
    'Section=combat Note="+d10 cold damage, extra hit die on critical hit"',
  'Hide In Plain Sight':'Section=skill Note="Hide even when observed"',
  'Howling Winds':
    'Section=magic Note="<i>Commune With Nature</i> (winds) %V/dy"',
  'Improved Ambush':
    'Section=combat ' +
    'Note="Allies +2 damage vs. flat-footed foes on surprise and 1st melee rd"',
  'Improved Battle Cry':'Section=combat Note="+1 attack and damage after cry"',
  'Improved Healing':'Section=combat Note="Regain %V HP/hr"',
  'Improved Resist Spells':'Section=save Note="+%V vs. spells"',
  'Improved Retributive Rage':
    'Section=combat Note="+%V damage next rd after suffering ${level*2} HP damage"',
  'Improved Spell Penetration':
    'Section=magic Note="+%V checks to overcome spell resistance"',
  'Improved Spellcasting':
    'Section=magic ' +
    'Note="Reduce energy cost of spells from %V chosen schools by 1"',
  'Improved Stonecunning':
    'Section=skill Note="R5\' Automatic Search for concealed stone door"',
  'Improved Untouchable':
    'Section=combat ' +
    'Note="No foe AOO from move, standard, and full-round actions"',
  'Increased Damage Threshold':
    'Section=combat Note="Continue fighting until -%V HP"',
  'Indefatigable':'Section=save Note="Immune %V effects"',
  'Inspire Valor':
    'Section=feature ' +
    'Note="R30\' Allies extra attack, +%V fear saves for %1 rd %2/dy"',
  'Inspiring Oration':
    'Section=magic ' +
    'Note="R60\' Speech applies spell-like ability to allies %V/dy"',
  'Intelligence Bonus':'Section=ability Note="+%V Intelligence"',
  'Intimidating Size':'Section=skill Note="+%V Intimidate"',
  'Ironborn Resilience':'Section=combat Note="Improved hit die"',
  'Joint Attack':
    'Section=combat ' +
    'Note="R30\' Allies attack same foe at +1/participant (max +5) %V/dy"',
  'Language Savant':
    'Section=skill ' +
    'Note="Fluent in any language after listening for 10 minutes"',
  'Large':
    'Section=combat ' +
    'Note="+4 bull rush, disarm, and grapple, -1 AC and attack"',
  'Last Stand':
    'Section=combat ' +
    'Note="1 minute of %V spell resistance, 15 damage reduction, 30 energy resistance; near death afterward %1/dy"',
  'Lay On Hands':'Section=magic Note="Harm undead or heal %V HP/dy"',
  'Leadership':'Section=feature Note="Attract followers"',
  'Long Rock Throwing':'Section=combat Note="Debris range %V\'"',
  'Luck Of Heroes':'Section=feature Note="Add %V to any d20 roll 1/dy"',
  'Magical Darkvision':'Section=feature Note="See perfectly in any darkness"',
  'Master Adventurer':'Section=skill Note="+%V on three chosen non-Cha skills"',
  'Metamagic Aura':
    'Section=magic Note="R30\' %V others\' spells of up to level %1 %2/dy"',
  'Miss Chance':'Section=combat Note="%V% chance of foe miss"',
  'Mountain Survival':'Section=skill Note="+%V Survival (mountains)"',
  'Mountaineer':'Section=skill Note="+%V Balance/+%V Climb/+%V Jump"',
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
  'Persistence':
    'Section=feature ' +
    'Note="Defensive Roll, Evasion, Slippery Mind, or Uncanny Dodge %V/dy"',
  'Persuasive Speaker':'Section=skill Note="+%V verbal Cha skills"',
  'Plant Friend':
    'Section=combat,skill ' +
    'Note="Plants DC %V Will save to attack",' +
         '"+4 Diplomacy (plants)"',
  'Power Words':
    'Section=magic Note="R60\' DC %2+spell level <i>Word of %V</i> %1/dy"',
  'Quick Ambush':'Section=skill Note="Hide allies for ambush in half time"',
  'Quickened Counterspelling':
    'Section=magic Note="Counterspell as move action 1/rd"',
  'Rage':
    'Section=combat Note="+4 Str, +4 Con, +2 Will, -2 AC for %V rd %1/dy"',
  'Rallying Cry':
    'Section=combat Note="Allies not flat-footed, +4 vs. surprise %V/dy"',
  'Resist Elements':
    'Section=save Note="%V resistance to acid, cold, electricity, and fire"',
  'Retributive Rage':
    'Section=combat ' +
    'Note="+%V attack 1 rd after suffering ${level*2} HP  damage"',
  'Righteous Fury':
    'Section=combat ' +
    'Note="Overcome %V points of evil foe melee damage reduction"',
  'Rock Throwing':'Section=combat Note="Use debris as ranged weapon"',
  'Save Boost':'Section=save Note="%V to distribute"',
  'Scent':
    'Section=feature Note="R30\' Detect creatures\' presence, track by smell"',
  'See Invisible':'Section=feature Note="See invisible creatures"',
  'Seer Sight':
    'Section=magic Note="Discern ${level}-%1 history of touched object %V/dy"',
  'Sense The Dead':'Section=magic Note="R%V\' <i>Detect Undead</i> at will"',
  'Shadow Jump':'Section=feature Note="R%V\' Move between shadows"',
  'Shadow Veil':'Section=skill Note="+%V Hide"',
  'Skill Boost':'Section=skill Note="+4 to %V chosen skills"',
  'Skill Mastery':
    'Section=skill Note="Take 10 despite distraction on %V chosen skills"',
  'Skilled Warrior':
    'Section=combat ' +
    'Note="Half penalty from %V choices of Fighting Defensively, Grapple Attack, Non-proficient Weapon, Two-Weapon Fighting"',
  'Smite Evil':
    'Section=combat Note="+%1 attack, +%2 damage vs. evil foe %V/dy"',
  'Sniping Ambush':
    'Section=combat Note="Reduced Hide penalty for using ranged weapons"',
  'Spell Choice':
    'Section=magic Note="Use chosen %V spell as spell-like ability 1/dy"',
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
  'Unearthly Defense':'Section=combat Note="+%V AC"',
  'Unearthly Dexterity':'Section=ability Note="+%V Dexterity"',
  'Unearthly Fortitude':'Section=save Note="+%V Fortitude"',
  'Unearthly Reflexes':'Section=save Note="+%V Reflex"',
  'Unearthly Will':'Section=save Note="+%V Will"',
  'Unfettered':'Section=magic Note="<i>Freedom Of Movement</i> %V rd/dy"',
  'Untapped Potential':
    'Section=magic Note="R30\' Contribute %V points ally spells"',
  'Untouchable':'Section=combat Note="No foe AOO from special attacks"',
  'Vicious Assault':'Section=combat Note="Two claw attacks at %V each"',
  'Ward Of Life':'Section=save Note="Immune to undead %V"',
  'Wild Empathy':'Section=skill Note="+%V Diplomacy (animals)"',
  'Wild Shape':'Section=magic Note="Change into creature of size %V %1/dy"',
  'Wisdom Bonus':'Section=ability Note="+%V Wisdom"',

  // Feats
  'Blood-Channeler':
    'Section=magic Note="Dbl spell energy for first two Con points lost"',
  'Born Of Duty':
    'Section=magic ' +
    'Note="R100\' Cry shakes undead (DC %V Will neg), Dorn +2 vs fear, enchant 1/dy"',
  'Born Of The Grave':'Section=magic Note="R15\' <i>Deathwatch</i> at will"',
  'Canny Strike':'Section=combat Note="+%Vd4 finesse weapon damage"',
  'Caste Status':'Section=feature Note="Benefits of caste level"',
  'Clear-Eyed':
    'Section=feature,skill ' +
    'Note="Half penalty for distance sight, x2 normal vision in dim light on plains",' +
         '"Spot is a class skill"',
  'Clever Fighting':'Section=combat Note="+%V finesse weapon damage"',
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
    'Note="Delay effect of failed Fort, Will save for 1 rd, dbl fail effect"',
  'Devastating Mounted Assault':
    'Section=combat Note="Full attack after mount moves"',
  'Drive It Deep':
    'Section=combat Note="Trade up to -%V attack for equal damage bonus"',
  'Dwarvencraft':'Section=feature Note="Know %V Dwarvencraft techniques"',
  'Extra Gift':
    'Section=feature Note="Use Mastery or Force Of Personality +4 times/dy"',
  'Fanatic':
    'Section=combat ' +
    'Note="+1 attack, divine spell benefit within 60\' of Izrador servant"',
  'Flexible Recovery':
    'Section=magic Note="Recover 1 spell energy per hr rest"',
  'Friendly Agent':
    'Section=skill ' +
    'Note="+4 Diplomacy (convince allegiance)/+4 Sense Motive (determine allegiance)"',
  'Giant Fighter':
    'Section=combat Note="+4 AC, dbl critical range w/in 30\' vs. giants"',
  'Greater Spell Focus (Greater Conjuration)':
    'Section=magic Note="+1 Spell DC (Greater Conjuration)"',
  'Greater Spell Focus (Greater Evocation)':
    'Section=magic Note="+1 Spell DC (Greater Evocation)"',
  'Hardy':'Section=feature Note="Functional on half food, sleep"',
  'Herbalist':'Section=magic Note="Create herbal concoctions"',
  'Huntsman':
    'Section=combat ' +
    'Note="+1 attack and damage for ea 5 above track DC vs. prey tracked for 5 mi"',
  'Improved Flexible Recovery':
    'Section=magic ' +
    'Note="DC 30 Concentration to recover %V spell energy per hr meditating"',
  'Improvised Weapon':
    'Section=combat ' +
    'Note="No penalty for improvised weapon, -2 for non-proficient weapon"',
  'Inconspicuous':
    'Section=skill ' +
    'Note="+2 Bluff (shadow)/+2 Diplomacy (shadow)/+2 Hide (shadow)/+2 Sense Motive (shadow)"',
  'Innate Magic':'Section=magic Note="%V %1 spells as at-will innate ability"',
  'Knack For Charms':'Section=skill Note="+4 Craft for charm-making"',
  'Knife Thrower':
    'Section=combat Note="+1 ranged attack and Quickdraw w/racial knife"',
  'Living Talisman':
    'Section=magic Note="Chosen spell costs 1 fewer spell energy to cast"',
  'Lucky':'Section=save Note="+1 from luck charms and spells"',
  'Magic Hardened':'Section=save Note="+2 vs. spells"',
  'Natural Healer':
    'Section=skill ' +
    'Note="Successful Heal raises patient to 1 HP/triple normal healing rate"',
  'Orc Slayer':
    'Section=combat,skill ' +
    'Note="+1 AC and damage vs. orcs and dworgs",' +
         '"-4 Cha skills (orcs and dworgs)"',
  'Pikeman':'Section=combat Note="Receive charge as move action"',
  'Plains Warfare':
    'Section=combat,save,skill ' +
    'Note="+1 AC when mounted on plains",' +
         '"+1 Reflex when mounted on plains",' +
         '"+2 Spot vs. surprise when mounted on plains"',
  'Power Reservoir':
    'Section=magic Note="Store +%V siphoned spell energy points"',
  'Powerful Throw':'Section=combat Note="+10 range, use Str bonus for attack"',
  'Quickened Donning':'Section=feature Note="No penalty for hastened donning"',
  'Resigned To Death':
     'Section=save Note="+4 vs. fear, fail 1 step less intense"',
  'Ritual Magic':'Section=magic Note="Learn and lead magic rituals"',
  'Sarcosan Pureblood':
    'Section=combat,skill ' +
    'Note="+2 AC (horsed)",' +
         '"Use Diplomacy w/horses, +2 Cha skills (horses and Sarcosans)"',
  'Sense Nexus':'Section=magic Note="DC 15 Wis to sense nexus w/in 5 miles"',
  'Sense Power':
    'Section=magic Note="<i>Detect Magic</i> %V/dy, DC 13 Wis check w/in 20\'"',
  'Shield Mate':
    'Section=combat ' +
    'Note="Allies +2 AC when self fighting defensively or -2 Combat Expertise"',
  'Slow Learner':'Section=feature Note="Replace later with another feat"',
  'Spell Focus (Greater Conjuration)':
    'Section=magic Note="+1 Spell DC (Greater Conjuration)"',
  'Spell Focus (Greater Evocation)':
    'Section=magic Note="+1 Spell DC (Greater Evocation)"',
  'Spell Knowledge':'Section=magic Note="+2 Spell Slots Bonus"',
  'Spellcasting (Abjuration)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Conjuration)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Divination)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Enchantment)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Evocation)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Illusion)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Necromancy)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Transmutation)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Greater Conjuration)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Spellcasting (Greater Evocation)':
    'Section=magic Note="May learn school spells/+1 school spell"',
  'Stalwart':
    'Section=save Note="Delay negative HP for 1 rd, dbl heal required"',
  'Stealthy Rider':
    'Section=companion Note="Mount use rider Hide, Move Silently"',
  'Subtle Caster':
    'Section=skill ' +
    'Note="+2 Bluff or Sleight Of Hand to disguise spell casting"',
  'Thick Skull':'Section=save Note="DC 10 + damage save to stay at 1 HP"',
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
    'Section=combat Note="Substitute %V rd of +%1 damage for Turn Undead use"',
  'Well-Aimed Strike':
    'Section=combat Note="Canny Strike and Clever Fighting apply to all foes"',
  'Whirlwind Charge':
    'Section=combat Note="Attack all adjacent foes after charge"',
  'Whispering Awareness':
    'Section=feature Note="DC 12 Wis to hear Whispering Wood"',

  // Classes
  'Adapter':
    'Section=skill Note="+%V skill points or %1 additional class skills"',
  'Armor Class Bonus':'Section=combat Note="+%V AC"',
  'Art Of Magic':'Section=magic Note="+1 character level for max spell level"',
  'Astirax Companion':'Section=feature Note="Special bond/abilities"',
  'Confident Effect':'Section=combat Note="+4 Mastery checks"',
  'Counterattack':'Section=combat Note="AOO on foe miss 1/rd"',
  'Cover Ally':'Section=combat Note="Take hit for ally w/in 5\' 1/rd"',
  'Danger Sense':'Section=skill Note="+%V Listen/+%V Spot"',
  'Defender Abilities':
    'Section=combat ' +
    'Note="Counterattack, Cover Ally, Defender Stunning Fist, Devastating Strike, Rapid Strike, Retaliatory Strike, Strike And Hold, or Weapon Trap %V/dy"',
  'Defender Stunning Fist':
    'Section=combat Note="Struck foe stunned (DC %V Fort neg)"',
  'Defensive Mastery':'Section=save Note="+%V Fortitude/+%V Reflex/+%V Will"',
  'Devastating Strike':
    'Section=combat ' +
    'Note="Bull Rush stunned opponent as free action w/out foe AOO"',
  'Dodge Training':'Section=combat Note="+%V AC"',
  'Flurry Attack':
    'Section=combat Note="Two-weapon off hand penalty reduced by %V"',
  'Foe Specialty':
    'Section=skill ' +
    'Note="Each day choose a creature type to take 10 on Knowledge checks"',
  'Force Of Personality':
    'Section=magic ' +
    'Note="Inspire Confidence, Fascination, Fury, or Suggestion %V/dy"',
  'Furious Grapple':
    'Section=combat Note="Extra grapple attack at highest attack bonus 1/rd"',
  'Grappling Training':
    'Section=combat Note="Disarm, sunder, and trip attacks use grapple check"',
  'Greater Confidence':
    'Section=magic ' +
    'Note="<i>Break Enchantment</i> 1/5 rd during Inspire Confidence"',
  'Greater Fury':
    'Section=magic Note="Ally gains 2d10 hit points, +2 attack, +1 Fort"',
  'Hated Foe':
    'Section=combat ' +
    'Note="Additional Hunter\'s Strike vs. Master Hunter creature"',
  'Heightened Effect':
    'Section=combat Note="+2 level for Mastery checks"',
  'Hunted By The Shadow':
    'Section=combat Note="No surprise by servant of shadow"',
  "Hunter's Strike":'Section=combat Note="x2 damage %V/dy"',
  'Improved Confidence':
    'Section=magic ' +
    'Note="Allies failing enchantment saves affected for half duration; fear reduced"',
  'Improved Fury':
    'Section=magic ' +
    'Note="+1 Initiative, attack, and damage during Ispire Fury"',
  'Improved Woodland Stride':
    'Section=feature Note="Normal movement through enchanted terrain"',
  'Incredible Resilience':'Section=combat Note="+%V HP"',
  'Incredible Speed':'Section=ability Note="+%V Speed"',
  'Initiative Bonus':'Section=combat Note="+%V Initiative"',
  'Insire Confidence':
    'Section=magic ' +
    'Note="R60\' Allies +4 save vs. enchantment and fear for %V rd"',
  'Inspire Fascination':
    'Section=magic ' +
    'Note="R120\' %V creatures enthralled %2 rd (DC %1 Will neg)"',
  'Inspire Fury':
    'Section=magic Note="R60\' Allies +1 Initiative, attack, and damage %V rd"',
  'Instinctive Response':'Section=combat Note="Re-roll Initiative"',
  'Knowledge Specialty':
    'Section=skill Note="Each day Choose a Knowledge Skill Focus"',
  'Lorebook':
    'Section=skill ' +
    'Note="Study 1 minute for knowledge of situation; scan at -10"',
  'Magecraft (Charismatic)':
    'Section=magic Note="4 spells, %V spell energy points"',
  'Magecraft (Hermetic)':
    'Section=magic Note="4 spells, %V spell energy points"',
  'Magecraft (Spiritual)':
    'Section=magic Note="4 spells, %V spell energy points"',
  'Mass Suggestion':
    'Section=magic Note="<i>Suggestion</i> to %V fascinated creatures"',
  'Master Hunter':
    'Section=combat,skill ' +
    'Note="+2 or more damage vs. selected creature type(s)",' +
         '"+2 or more Bluff, Listen, Sense Motive, Spot, Survival vs. chosen creature type(s)"',
  'Masterful Strike':'Section=combat Note="%V unarmed damage"',
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
    'Note="Masterful Strike, Precise Strike, Stunning Fist w/chosen weapon"',
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
  'Practiced Skills':'Section=skill Note="+3 on %V chosen skills"',
  'Specific Effect':'Section=combat Note="Choose individuals to affect"',
  'Speed Training':'Section=combat Note="Extra move action each rd"',
  'Spell Specialty':'Section=skill Note="Each day choose a spell for +1 DC"',
  'Spontaneous Legate Spell':
    'Section=magic Note="Cast <i>Inflict</i> in place of known spell"',
  'Strike And Hold':'Section=combat Note="Extra unarmed attack to grab foe"',
  'Suggestion':
    'Section=magic Note="<i>Suggestion</i> to 1 fascinated creature"',
  'Temple Dependency':
    'Section=magic Note="Must participate at temple to receive spells"',
  'True Aim':'Section=combat Note="x3 damage on Hunter\'s Strike"',
  // Turn Undead as heroic path
  'Universal Effect':
    'Section=combat Note="Use multiple mastery powers simultaneously"',
  'Weapon Trap':
    'Section=combat ' +
    'Note="Attack to catch foe weapon for disarm, damage, AOO 1/rd"',
  'Wilderness Trapfinding':
    'Section=skill Note="Search to find and Survival to remove DC 20+ traps"',
  'Woodslore':
    'Section=skill Note="Automatic Search vs. trap or concealed door w/in 5\'"',

  // Races
  'Alert Senses':'Section=skill Note="+2 Listen/+2 Spot"',
  'Bound To The Beast':'Section=feature Note="Mounted Combat"',
  'Bound To The Spirit':'Section=feature Note="Magecraft (Spiritual)"',
  'Brotherhood':
    'Section=combat Note="+1 attack when fighting alongside 4+ Dorns"',
  'Cold Fortitude':'Section=save Note="+5 cold, half nonlethal damage"',
  // Deep Lungs as heroic path
  'Dextrous':'Section=skill Note="+2 Craft (non-metal or wood)"',
  'Dodge Orcs':'Section=combat Note="+1 AC vs. orc"',
  'Dorn Ability Adjustment':
    'Section=ability Note="+2 Strength/-2 Intelligence"',
  'Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Dwarf Enmity':'Section=combat Note="+1 attack vs. orc"',
  'Dwarf Favored Weapon':'Section=combat Note="+1 attack w/axes and hammers"',
  'Dwarrow Ability Adjustment':'Section=ability Note="+2 Charisma"',
  'Dworg Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Constitution/-2 Intelligence/-2 Charisma"',
  'Dworg Enmity':'Section=combat Note="+2 attack vs. orc"',
  'Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Constitution"',
  'Elfling Ability Adjustment':
    'Section=ability Note="+4 Dexterity/-2 Strength/-2 Constitution"',
  'Erenlander Ability Adjustment':'Section=ability Note="+2 any/-2 any"',
  'Favored Region (Aruun)':
     'Section=skill ' +
     'Note="Knowledge (Local (Aruun)) is a class skill/+2 Survival (within Aruun)/+2 Knowledge (Nature) (within Aruun)"',
  'Favored Region (Caraheen)':
     'Section=skill ' +
     'Note="Knowledge (Local (Caraheen)) is a class skill/+2 Survival (within Caraheen)/+2 Knowledge (Nature) (within Caraheen)"',
  'Favored Region (Central Erenland)':
     'Section=skill ' +
     'Note="Knowledge (Local (Central Erenland)) is a class skill/+2 Survival (within Central Erenland)/+2 Knowledge (Nature) (within Central Erenland)"',
  'Favored Region (Erenland region)':
     'Section=skill ' +
     'Note="Knowledge (Local (Erenland Region)) is a class skill/+2 Survival (within Erenland region)/+2 Knowledge (Nature) (within Erenland region)"',
  'Favored Region (Erethor)':
     'Section=skill ' +
     'Note="Knowledge (Local (Erethor)) is a class skill/+2 Survival (within Erethor)/+2 Knowledge (Nature) (within Erethor)"',
  'Favored Region (Kaladrun Mountains)':
     'Section=skill ' +
     'Note="Knowledge (Local (Kaladrun Mounts)) is a class skill/+2 Survival (within Kaladrun Mountains)/+2 Knowledge (Nature) (within Kaladrun Mountains)"',
  'Favored Region (Miraleen)':
     'Section=skill ' +
     'Note="Knowledge (Local (Miraleen)) is a class skill/+2 Survival (within Miraleen)/+2 Knowledge (Nature) (within Miraleen)"',
  'Favored Region (Northern Reaches)':
     'Section=skill ' +
     'Note="Knowledge (Local (Northern Reaches)) is a class skill/+2 Survival (within Northern Reaches)/+2 Knowledge (Nature) (within Northern Reaches)"',
  'Favored Region (Northlands)':
     'Section=skill ' +
     'Note="Knowledge (Local (Northlands)) is a class skill/+2 Survival (within Northlands)/+2 Knowledge (Nature) (within Northlands)"',
  'Favored Region (Southern Erenland)':
     'Section=skill ' +
     'Note="Knowledge (Local (Southern Erenland)) is a class skill/+2 Survival (within Southern Erenland)/+2 Knowledge (Nature) (within Southern Erenland)"',
  'Favored Region (Subterranean Kaladruns)':
     'Section=skill ' +
     'Note="Knowledge (Local (Subterranean Kaladruns)) is a class skill/+2 Survival (within Subterranean Kaladruns)/+2 Knowledge (Nature) (within Subterranean Kaladruns)"',
  'Favored Region (Surface Kaladruns)':
     'Section=skill ' +
     'Note="Knowledge (Local (Surface Kaladruns)) is a class skill/+2 Survival (within Surface Kaladruns)/+2 Knowledge (Nature) (within Surface Kaladruns)"',
  'Favored Region (Urban)':
    'Section=skill ' +
     'Note="+2 Gather Information (urban), untrained Knowledge use in urban areas"',
  'Favored Region (Veradeeen)':
     'Section=skill ' +
     'Note="Knowledge (Local (Veradeeen)) is a class skill/+2 Survival (within Veradeeen)/+2 Knowledge (Nature) (within Veradeeen)"',
  'Fierce':'Section=combat Note="+1 attack w/two-handed weapons"',
  'Fortunate':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Gifted Healer':'Section=skill Note="+2 Heal"',
  'Gnome Ability Adjustment':'Section=ability Note="+4 Charisma/-2 Strength"',
  'Graceful':'Section=skill Note="+2 Climb/+2 Jump/+2 Move Silently/+2 Tumble"',
  'Halfling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Strength"',
  'Heartlander':'Section=skill Note="+4 chosen Craft or Profession"',
  'Illiteracy':
    'Section=skill Note="Must spend 2 skill points to read and write"',
  'Improved Cold Fortitude':'Section=save Note="Immune non-lethal/half lethal"',
  'Improved Innate Magic':'Section=magic Note="+1 Innate Magic spell"',
  'Improved Keen Senses':'Section=skill Note="+2 Listen/+2 Search/+2 Spot"',
  'Improved Natural Channeler':'Section=magic Note="+1 spell energy"',
  'Improved Natural Swimmer':
    'Section=skill ' +
     'Note="+8 special action or avoid hazard, always take 10, run"',
  'Improved Tree Climber':
    'Section=skill Note="+2 Balance (trees)/+2 Climb (trees)"',
  'Interactive':'Section=skill Note="+2 Bluff/+2 Diplomacy/+2 Sense Motive"',
  'Keen Senses':'Section=skill Note="+2 Listen/+2 Search/+2 Spot"',
  'Know Depth':'Section=feature Note="Intuit approximate depth underground"',
  'Light Sensitivity':'Section=combat Note="-1 attack in daylight"',
  'Minor Light Sensitivity':
    'Section=combat Note="DC 15 Fortitude save in sunlight to avoid -1 attack"',
  'Natural Channeler':'Section=magic Note="+2 spell energy"',
  'Natural Horseman':
    'Section=combat,skill ' +
     'Note="+1 melee damage (horseback), half ranged penalty (horseback)",' +
          '"+4 Handle Animal (horse)/+4 Ride (horse)/+4 Concentration (horseback)"',
  'Natural Mountaineer':
    'Section=ability,skill ' +
    'Note="Unimpeded movement in mountainous terrain",' +
         '"+2 Climb"',
  'Natural Preditor':'Section=skill Note="+%V Intimidate"',
  'Natural Riverfolk':
    'Section=skill ' +
    'Note="+2 Perform/+2 Profession (Sailor)/+2 Swim/+2 Use Rope"',
  'Natural Sailor':
    'Section=skill ' +
    'Note="+2 Craft (ship)/+2 Profession (ship)/+2 Use Rope (ship)"',
  'Natural Swimmer':'Section=ability Note="%V swim as move action"',
  'Natural Trader':
    'Section=skill ' +
    'Note="+4 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading"',
  'Night Fighter':'Section=combat Note="+1 attack in darkness"',
  'Nimble':'Section=skill Note="+2 Climb/+2 Hide"',
  'Orc Ability Adjustment':
    'Section=ability Note="+4 Strength/-2 Intelligence/-2 Charisma"',
  'Orc Enmity':'Section=combat Note="+1 damage vs. dwarves"',
  'Orc Frenzy':'Section=combat Note="+1 attack when fighting among 10+ Orcs"',
  'Quick':
    'Section=combat,save Note="+1 attack w/light weapons","+1 Reflex"',
  'Resilient':'Section=combat Note="+2 AC"',
  'Resist Enchantment':'Section=save Note="+2 vs. enchantments"',
  'Resist Poison':'Section=save Note="+2 vs. poison"',
  'Resist Spells':'Section=magic,save Note="-2 Spell Energy","+2 vs. spells"',
  'Robust':'Section=save Note="+1 Fortitude"',
  'Rugged':'Section=save Note="+2 Fortitude/+2 Reflex/+2 Will"',
  'Sarcosan Ability Adjustment':
    'Section=ability Note="+2 Charisma/+2 Intelligence/-2 Wisdom"',
  'Sarcosan Feat Bonus':'Section=feature Note="+1 General Feat"',
  'Skilled Rider':
    'Section=skill ' +
    'Note="+2 Handle Animal (wogren)/+2 Ride (wogren)/+2 Concentration (wogrenback)"',
  'Skilled Trader':
    'Section=skill ' +
    'Note="+2 Appraise, Bluff, Diplomacy, Forgery, Gather Information, Profession when smuggling or trading"',
  'Spirit Foe':
    'Section=save,skill ' +
    'Note="+2 vs. outsiders",' +
          '"+4 Hide (nature)/+4 Move Silently (nature)"',
  'Stability':'Section=save Note="+4 vs. Bull Rush and Trip"',
  'Stone Knowledge':
    'Section=skill Note="+2 Appraise (stone, metal)/+2 Craft (stone, metal)"',
  'Stout':'Section=feature Note="Endurance and Toughness"',
  'Studious':'Section=feature Note="Magecraft (Hermetic)"',
  'Sturdy':'Section=combat Note="+1 AC"',
  'Tree Climber':'Section=skill Note="+4 Balance (trees)/+4 Climb (trees)"',
  'Unafraid':'Section=save Note="+2 vs. fear"',

  // Animal Companions
  'Companion Empathy':
    'Section=companion Note="Continuous emotional link w/no range limit"',
  'Enhanced Sense':
    'Section=companion Note="+%V mile channeled event detection"',
  'Telepathy':
    'Section=companion Note="R100\' Companion-controlled telepathic communication"'

};
LastAge.FEATURES = Object.assign({}, SRD35.FEATURES, LastAge.FEATURES_ADDED);
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
      'Beast4:19=1 ' +
    'Spells=' +
      '"Beast1:Magic Fang",' +
      '"Beast2:Bear\'s Endurance;Cat\'s Grace;Bull\'s Strength",' +
      '"Beast3:Greater Magic Fang",' +
      '"Beast4:Freedom Of Movement"',
  'Chanceborn':
    'Group=Chanceborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Luck Of Heroes",3:Unfettered,"4:Miss Chance",6:Persistence,' +
      '"9:Take Ten","19:Take Twenty" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Chanceborn0:2=1,' +
      'Chanceborn1:7=1,' +
      'Chanceborn2:12=1,' +
      'Chanceborn3:17=1 ' +
    'Spells=' +
      '"Chanceborn0:Resistance",' +
      '"Chanceborn1:True Strike",' +
      '"Chanceborn2:Aid",' +
      '"Chanceborn3:Prayer"',
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
      'Charismatic6:17=1 ' +
    'Spells=' +
      '"Charismatic1:Charm Person;Hypnotism;Remove Fear",' +
      '"Charismatic2:Aid;Daze Monster",' +
      '"Charismatic3:Heroism;Suggestion",' +
      '"Charismatic4:Charm Monster",' +
      '"Charismatic6:Greater Heroism"',
  'Dragonblooded':
    'Group=Dragonblooded ' +
    'Level=level ' +
    'Features=' +
      '"1:Bolster Spell","2:Bonus Spells","3:Bonus Spell Energy",' +
      '"4:Quickened Counterspelling","6:Improved Spellcasting",' +
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
      'Earthbonded8:19=1 ' +
    'Spells=' +
      '"Earthbonded1:Hold Portal",' +
      '"Earthbonded2:Make Whole;Soften Earth And Stone",' +
      '"Earthbonded3:Meld Into Stone",' +
      '"Earthbonded4:Spike Stones;Stone Shape;Stoneskin",' +
      '"Earthbonded5:Transmute Rock To Mud",' +
      '"Earthbonded6:Move Earth;Stone Tell",' +
      '"Earthbonded8:Earthquake"',
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
      'Faithful8:18=1 ' +
    'Spells=' +
      '"Faithful1:Bless;Bless Weapon;Divine Favor;Protection From Evil",' +
      '"Faithful2:Aid;Consecrate",' +
      '"Faithful3:Daylight;Magic Circle Against Evil;Prayer",' +
      '"Faithful4:Holy Smite",' +
      '"Faithful5:Dispel Evil",' +
      '"Faithful8:Holy Aura"',
  'Fellhunter':
    'Group=Fellhunter ' +
    'Level=level ' +
    'Features=' +
      '"1:Sense The Dead","2:Touch Of The Living","3:Ward Of Life",' +
      '"5:Disrupting Attack" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Fellhunter1:1=1 ' +
    'Spells=' +
      '"Fellhunter1:Detect Undead"',
  'Feyblooded':
    'Group=Feyblooded ' +
    'Level=level ' +
    'Features=' +
      '"1:Low-Light Vision","7:Fey Vision" ' +
    'Selectables=' +
      '"Unearthly Defense","Unearthly Dexterity","Unearthly Fortitude",' +
      '"Unearthly Reflexes","Unearthly Will" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Feyblooded1:2=1;3=2;5=3,' +
      'Feyblooded2:6=1,' +
      'Feyblooded3:9=1;10=2;11=3,' +
      'Feyblooded4:15=1,' +
      'Feyblooded5:14=1;18=2,' +
      'Feyblooded6:17=1 ' +
    'Spells=' +
      '"Feyblooded1:Disguise Self;Magic Aura;Ventriloquism",' +
      '"Feyblooded2:Invisibility",' +
      '"Feyblooded3:Deep Slumber;Glibness;Nondetection",' +
      '"Feyblooded4:Rainbow Pattern",' +
      '"Feyblooded5:False Vision;Seeming",' +
      '"Feyblooded6:Mislead"',
  'Giantblooded':
    'Group=Giantblooded ' +
    'Level=level ' +
    'Features=' +
      '1:Big,"2:Rock Throwing","3:Intimidating Size","4:Fast Movement",' +
      '"5:Strength Bonus","6:Long Rock Throwing","8:Fearsome Charge",' +
      '10:Large,"20:Extra Reach"',
  'Guardian':
    'Group=Guardian ' +
    'Level=level ' +
    'Features=' +
      '"1:Inspire Valor","2:Detect Evil","3:Righteous Fury","4:Smite Evil",' +
      '"5:Constitution Bonus","6:Lay On Hands","12:Aura Of Courage",' +
      '"16:Death Ward" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Guardian1:2=1,' +
      'Guardian4:16=1 ' +
    'Spells=' +
      '"Guardian1:Detect Evil",' +
      '"Guardian4:Death Ward"',
  'Healer':
    'Group=Healer ' +
    'Level=level ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Healer1:1=1;3=2,' + // Cure Light 2/dy
      'Healer2:2=1;4=2;6=3,' + // Cure Moderate 2/dy
      'Healer3:5=1;7=2;8=3;9=4,' + // Cure Serious 2/dy
      'Healer4:10=1;11=2;12=3;14=4;17=5,' + // Cure Critical, Restoration 2/dy, 
      'Healer5:13=1;15=2;20=3,' + // Mass Cure Light 2/dy
      'Healer6:16=1;18=2,' + // Heal 2/dy
      'Healer7:19=1 ' +
    'Spells=' +
      '"Healer1:Cure Light Wounds",' +
      '"Healer2:Cure Moderate Wounds;Lesser Restoration",' +
      '"Healer3:Cure Serious Wounds;Remove Blindness/Deafness;Remove Disease",'+
      '"Healer4:Cure Critical Wounds;Neutralize Poison;Restoration",' +
      '"Healer5:Mass Cure Light Wounds;Raise Dead",' +
      '"Healer6:Heal",' +
      '"Healer7:Regenerate"',
  'Ironborn':
    'Group=Ironborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Ironborn Resilience","2:Fortitude Bonus","3:Natural Armor",' +
      '"4:Improved Healing","5:Damage Reduction","6:Resist Elements",' +
      '9:Indefatigable,"14:Ability Recovery"',
  'Jack-Of-All-Trades':
    'Group=Jack-Of-All-Trades ' +
    'Level=level ' +
    'Features=' +
      '"1:Spell Choice","2:Spontaneous Spell","3:Skill Boost",' +
      '"4:Ability Boost","5:Save Boost","7:Feat Bonus" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Jack0:1=1;2=2,' +
      'Jack1:6=1;13=2,' +
      'Jack2:10=1;19=2,' +
      'Jack3:16=1 ' +
    'Spells=' +
      '"Jack0:Create Water;Cure Minor Wounds;Dancing Lights;Daze;Detect Magic;'+
      'Detect Poison;Disrupt Undead;Flare;Ghost Sound;Guidance;' +
      'Know Direction;Light;Lullaby;Mage Hand;Mending;Message;Open/Close;' +
      'Ray Of Frost;Read Magic;Resistance;Summon Instrument;' +
      'Touch Of Fatigue;Virtue",' +
      '"Jack1:Alarm;Animate Rope;Assist;Burial;Burning Hands;Calm Animals;' +
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
      'Stone Soup;Summon Monster I;Summon Nature\'s Ally I;True Strike;' +
      'Undetectable Alignment;Unseen Servant;Ventriloquism;Woeful Speech",' +
      '"Jack2:Acid Arrow;Alter Self;Animal Messenger;Animal Trance;' +
      'Arcane Lock;Barkskin;Bear\'s Endurance;Bleed Power;Blindness/Deafness;' +
      'Blur;Bull\'s Strength;Cat\'s Grace;Chill Metal;Command Undead;' +
      'Confer Power;Continual Flame;Cure Moderate Wounds;Darkness;Darkvision;' +
      'Daze Monster;Delay Poison;Detect Chaos;Detect Evil;Detect Good;' +
      'Detect Law;Detect Thoughts;Disguise Ally;Eagle\'s Splendor;' +
      'False Life;Fell Forbiddance;Fey Fire;Fey Hearth;Flame Blade;' +
      'Flaming Sphere;Fog Cloud;Fox\'s Cunning;Ghoul Touch;Glitterdust;' +
      'Greenshield;Gust Of Wind;Heat Metal;Hideous Laughter;Hold Animal;' +
      'Hypnotic Pattern;Invisibility;Knock;Lesser Restoration;Levitate;' +
      'Lifetrap;Locate Object;Magic Mouth;Memorial;Minor Image;' +
      'Mirror Image;Misdirection;Nature\'s Revelation;Obscure Object;' +
      'Owl\'s Wisdom;Pacify;Phantom Trap;Protection From Arrows;' +
      'Pyrotechnics;Reduce Animal;Resist Energy;Scare;Scorching Ray;' +
      'Scryer\'s Mark;See Invisibility;Shatter;Silence;Silver Blood;' +
      'Soften Earth And Stone;Sound Burst;Spectral Hand;Spider Climb;' +
      'Summon Monster II;Summon Nature\'s Ally II;Summon Swarm;' +
      'Touch Of Idiocy;Tree Shape;Warp Wood;Weather;Web;Whispering Wind;' +
      'Withering Speech;Wood Shape",' +
      '"Jack3:Arcane Impotence;Arcane Sight;Call Lightning;Charm Repair;' +
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
      'Summon Monster III;Summon Nature\'s Ally III;Tiny Hut;Tongues;' +
      'Vampiric Touch;Water Breathing;Water Walk;Willful Stand;Wind Wall"',
  'Mountainborn':
    'Group=Mountainborn ' +
    'Level=level ' +
    'Features=' +
      '1:Mountaineer,"1:Mountain Survival",3:Ambush,"4:Rallying Cry",' +
      '"5:Constitution Bonus","8:Improved Ambush","13:Quick Ambush",' +
      '"18:Sniping Ambush" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Mountainborn1:2=1;7=2,' +
      'Mountainborn3:12=1,' +
      'Mountainborn6:17=1 ' +
    'Spells=' +
      '"Mountainborn1:Endure Elements;Pass Without Trace",' +
      '"Mountainborn3:Meld Into Stone",' +
      '"Mountainborn6:Stone Tell"',
  'Naturefriend':
    'Group=Naturefriend ' +
    'Level=level ' +
    'Features=' +
      '"1:Natural Bond","1:Wild Empathy","5:Animal Friend","10:Plant Friend",' +
      '"15:Elemental Friend","20:One With Nature" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Naturefriend1:2=1;3=2;4=3;9=4,' +
      'Naturefriend2:6=1;8=2,' +
      'Naturefriend3:7=1;11=2;12=3;13=4;14=5;16=6,' +
      'Naturefriend4:17=1;18=2;19=3,' +
      'Naturefriend5:20=1 ' +
    'Spells=' +
      '"Naturefriend1:Calm Animals;Entangle;Obscuring Mist;' +
      'Speak With Animals",' +
      '"Naturefriend2:Animal Messenger;Gust Of Wind",' +
      '"Naturefriend3:Call Lightning;Dominate Animal;Sleet Storm;' +
      'Speak With Plants;Spike Growth;Wood Shape",' +
      '"Naturefriend4:Command Plants;Ice Storm;Summon Nature\'s Ally IV",' +
      '"Naturefriend5:Commune With Nature"',
  'Northblooded':
    'Group=Northblooded ' +
    'Level=level ' +
    'Features=' +
      '1:Northborn,"1:Wild Empathy","2:Cold Resistance","3:Battle Cry",' +
      '"4:Howling Winds","5:Constitution Bonus","6:Aura Of Warmth",' +
      '"11:Improved Battle Cry","13:Frost Weapon","16:Cold Immunity",' +
      '"18:Greater Frost Weapon" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Northborn1:4=1;8=2;12=3 ' +
    'Spells=' +
      '"Northborn1:Commune With Nature"',
  'Painless':
    'Group=Painless ' +
    'Level=level ' +
    'Features=' +
      '1:Painless,"2:Nonlethal Damage Reduction","3:Uncaring Mind",' +
      '"4:Retributive Rage",5:Ferocity,"9:Last Stand",' +
      '"10:Increased Damage Threshold","14:Improved Retributive Rage"',
  'Pureblood':
    'Group=Pureblood ' +
    'Level=level ' +
    'Features=' +
      '"1:Master Adventurer","2:Blood Of Kings","3:Feat Bonus",' +
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
      'Seaborn2:4=1;5=2;9=3,' +
      'Seaborn3:8=2;13=3,' +
      'Seaborn4:12=3,' +
      'Seaborn5:16=4,' +
      'Seaborn6:20=5 ' +
    'Spells=' +
      '"Seaborn2:Blur;Fog Cloud;Summon Nature\'s Ally II",' +
      '"Seaborn3:Displacement;Summon Nature\'s Ally III",' +
      '"Seaborn4:Summon Nature\'s Ally IV",' +
      '"Seaborn5:Summon Nature\'s Ally V",' +
      '"Seaborn6:Summon Nature\'s Ally VI"',
  'Seer':
    'Group=Seer ' +
    'Level=level ' +
    'Features=' +
      '"3:Seer Sight" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Seer1:1=1,' +
      'Seer2:2=1,' +
      'Seer3:4=1;5=2;8=3,' +
      'Seer4:7=1;10=2;11=3;13=4,' +
      'Seer5:16=1;19=2,' +
      'Seer6:14=1;17=2,' +
      'Seer7:20=1 ' +
    'Spells=' +
      '"Seer1:Alarm",' +
      '"Seer2:Augury",' +
      '"Seer3:Clairaudience/Clairvoyance;Locate Object;Speak With Dead",' +
      '"Seer4:Arcane Eye;Divination;Locate Creature;Scrying",' +
      '"Seer5:Commune;Prying Eyes",' +
      '"Seer6:Find The Path;Legend Lore",' +
      '"Seer7:Vision"',
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
      'Speaker4:8=1;12=2,' +
      'Speaker8:18=1 ' +
    'Spells=' +
      '"Speaker1:Comprehend Languages",' +
      '"Speaker2:Whispering Wind",' +
      '"Speaker4:Shout;Tongues",' +
      '"Speaker8:Greater Shout"',
  'Spellsoul':
    'Group=Spellsoul ' +
    'Level=level ' +
    'Features=' +
      '"1:Untapped Potential","2:Metamagic Aura","3:Improved Resist Spells",' +
      '"4:Bonus Spell Energy"',
  'Shadow Walker':
    'Group="Shadow Walker" ' +
    'Level=level ' +
    'Features=' +
      '1:Darkvision,"2:Shadow Veil","4:Shadow Jump","11:Hide In Plain Sight" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Shadow1:3=1;13=2,' + // Expeditious Retreat 2/dy
      'Shadow2:5=1;7=2;15=3,' + // Blur 2/dy
      'Shadow3:9=1;19=2 ' + // Displacement 2/dy
    'Spells=' +
      '"Shadow1:Expeditious Retreat",' +
      '"Shadow2:Blur;Undetectable Alignment",' +
      '"Shadow3:Displacement"',
  'Steelblooded':
    'Group=Steelblooded ' +
    'Level=level ' +
    'Features=' +
      '"2:Offensive Tactics","3:Strategic Blow","4:Skilled Warrior",' +
      '14:Untouchable,"19:Improved Untouchable"',
  'Sunderborn':
    'Group=Sunderborn ' +
    'Level=level ' +
    'Features=' +
      '"1:Detect Outsider","2:Blood Of The Planes","4:Planar Fury",' +
      '7:Darkvision,"13:Magical Darkvision","19:See Invisible" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Sunderborn1:1=1;3=2,' +
      'Sunderborn2:6=1,' +
      'Sunderborn3:9=1,' +
      'Sunderborn4:12=1,' +
      'Sunderborn5:15=1,' +
      'Sunderborn6:18=1 ' +
    'Spells=' +
      '"Sunderborn1:Detect Outsider;Summon Monster I",' +
      '"Sunderborn2:Summon Monster II",' +
      '"Sunderborn3:Summon Monster III",' +
      '"Sunderborn4:Summon Monster IV",' +
      '"Sunderborn5:Summon Monster V",' +
      '"Sunderborn6:Summon Monster VI"',
  'Tactician':
    'Group=Tactician ' +
    'Level=level ' +
    'Features=' +
      '"1:Aid Another","2:Combat Overview","3:Coordinated Initiative",' +
      '"4:Joint Attack","5:Aided Combat Bonus","13:Directed Attack",' +
      '"18:Telling Blow","20:Perfect Assault"',
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
      'Warg1:4=1;7=2;12=3;17=4 ' + // Charm Animal 2/dy; Speak w/Animals 2/dy
    'Spells=' +
      '"Warg1:Charm Animal;Speak With Animals"'
};
LastAge.RACES = {
  'Agrarian Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Alert Senses","Dextrous Hands",Fortunate,"Gifted Healer",Graceful,' +
      '"Innate Magic","Low-Light Vision",Slow,Small,"Resist Fear" ' +
    'Selectables=' +
      'Stout,Studious ' +
    'Languages=Colonial,Halfling',
  'Clan Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",' +
      '"Favored Region (Kaladrun Mountains/Subterranean Kaladruns)",' +
      'Darkvision,"Dodge Orcs","Dwarf Enmity","Dwarf Favored Weapon",' +
      '"Know Depth",Resilient,"Resist Poison","Resist Spells",Slow,Stability,' +
      '"Stone Knowledge",Stonecunning ' +
    'Languages="Clan Dwarven","Old Dwarven"',
  'Clan-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      '"Favored Region (Kaladrun Mountains)",' +
      'Darkvision,"Dodge Orcs","Resist Poison","Resist Spells",Small,Slow,' +
      '"Stone Knowledge",Stonecunning,Sturdy ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue"',
  'Clan-Raised Dworg':
    'Features=' +
      '"Dworg Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      '"Favored Region (Kaladrun Mountains)",' +
      'Darkvision,"Dworg Enmity","Minor Light Sensitivity",Rugged,' +
      '"Resist Spells",Stonecunning ' +
    'Languages="Clan Dwarven","Old Dwarven",Orcish',
  'Danisil-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Sepi)",' +
      '"Favored Region (Aruun)",' +
      'Fortunate,"Gifted Healer","Innate Magic","Keen Senses",' +
      '"Low-Light Vision",Nimble,Small ' +
    'Languages=Halfling,"High Elven","Jungle Mouth"',
  'Dorn':
    'Features=' +
      '"Dorn Ability Adjustment",' +
      '"Weapon Familiarity (Bastard Sword/Dornish Horse Spear)",' +
      '"Favored Region (Northlands)",' +
      'Brotherhood,"Cold Fortitude",Fierce,Robust ' +
    'Languages=Erenlander,Norther',
  'Erenlander':
    'Features=' +
      '"Erenlander Ability Adjustment",' +
      '"Weapon Familiarity (Bastard Sword/Cedeku/Dornish Horse Spear/Sarcosan Lance)",' +
      '"Favored Region (Erenland region)",' +
      'Heartlander ' +
    'Languages=Erenlander',
  'Gnome':
    'Features=' +
      '"Gnome Ability Adjustment",' +
      '"Weapon Familiarity (Hand Crossbow)",' +
      '"Favored Region (Central Erenland)",' +
      '"Deep Lungs","Low-Light Vision","Natural Riverfolk","Natural Swimmer",' +
      '"Natural Trader","Resist Spells",Robust,Slow,Small ' +
    'Languages="Trader\'s Tongue",any,any',
  'Gnome-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      '"Weapon Familiarity (Hand Crossbow/Inutek)",' +
      '"Favored Region (Central Erenland)",' +
      'Darkvision,"Deep Lungs","Natural Riverfolk","Natural Swimmer",' +
      '"Resist Poison","Resist Spells",Small,Slow,"Skilled Trader",Sturdy ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue",any,any',
  'Halfling-Raised Elfling':
    'Features=' +
      '"Elfling Ability Adjustment",' +
      '"Weapon Familiarity (Atharak/Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Bound To The Beast",Fortunate,"Gifted Healer","Innate Magic",' +
      '"Keen Senses","Low-Light Vision",Nimble,Small ' +
    'Languages=Erenlander,Halfling,"Jungle Mouth"',
  'Jungle Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Sepi)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Aruun/Erethor)",' +
      '"Improved Innate Magic","Improved Keen Senses",' +
      '"Improved Tree Climber","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Resist Enchantment",' +
      '"Spirit Foe","Tree Climber" ' +
    'Languages="Jungle Mouth"',
  'Kurgun Dwarf':
    'Features=' +
      '"Dwarf Ability Adjustment",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",'+
      '"Favored Region (Kaladrun Mountains/Surface Kaladruns)",' +
      'Darkvision,"Dwarf Enmity","Dwarf Favored Weapon",' +
      '"Natural Mountaineer",Resilient,"Resist Poison","Resist Spells",Slow,' +
      '"Stone Knowledge" ' +
    'Languages="Clan Dwarven","Old Dwarven"',
  'Kurgun-Raised Dwarrow':
    'Features=' +
      '"Dwarrow Ability Adjustment",' +
      // Choice of one of these three weapons
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",'+
      '"Favored Region (Kaladrun Mountains)",' +
      'Darkvision,"Dodge Orcs","Natural Mountaineer","Resist Poison",' +
      '"Resist Spells",Small,Slow,"Stone Knowledge",Sturdy ' +
    'Languages="Clan Dwarven","Old Dwarven","Trader\'s Tongue"',
  'Kurgun-Raised Dworg':
    'Features=' +
      '"Dworg Ability Adjustment",' +
      '"Favored Region (Kaladrun Mountains)",' +
      '"Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe/Urutuk Hatchet)",' +
      'Darkvision,"Dworg Enmity",' +
      '"Minor Light Sensitivity","Natural Mountaineer","Resist Spells",Rugged '+
    'Languages="Clan Dwarven","Old Dwarven",Orcish',
  'Nomadic Halfling':
    'Features=' +
      '"Halfling Ability Adjustment",' +
      '"Weapon Familiarity (Halfling Lance)",' +
      '"Favored Region (Central Erenland)",' +
      '"Alert Senses","Focused Rider",Fortunate,Graceful,"Innate Magic",' +
      '"Low-Light Vision","Resist Fear","Skilled Rider",Slow,Small ' +
    'Selectables=' +
      '"Bound To The Beast","Bound To The Spirits" ' +
    'Languages=Colonial,Halfling',
  'Orc':
    'Features=' +
      '"Orc Ability Adjustment",' +
      '"Weapon Familiarity (Vardatch)",' +
      '"Favored Region (Northern Reaches)",' +
      'Darkvision,"Improved Cold Fortitude","Light Sensitivity",' +
      '"Natural Predator","Night Fighter","Orc Enmity","Orc Frenzy",' +
      '"Resist Spells" ' +
    'Languages="Black Tongue","Old Dwarven","High Elven",Orcish',
  'Plains Sarcosan':
    'Features=' +
      '"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      '"Favored Region (Southern Erenland)",' +
      '"Natural Horseman",Quick,"Sarcosan Feat Bonus" ' +
    'Languages=Colonial,Erenlander',
  'Sea Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Net)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Weapon Proficiency (Guisarme/Ranseur/Tident)",' +
      '"Favored Region (Erathor/Miraleen)",' +
      '"Deep Lungs","Improved Natural Swimmer","Innate Magic","Keen Senses",' +
      '"Low-Light Vision","Natural Channeler","Natural Sailor",' +
      '"Natural Swimmer","Resist Enchantment","Tree Climber" ' +
    'Languages="High Elven","Jungle Mouth"',
  'Snow Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Familiarity (Fighting Knife)",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Favored Region (Erathor/Veradeen)",' +
      '"Cold Fortitude","Innate Magic","Keen Senses","Low-Light Vision",' +
      '"Natural Channeler","Resist Enchantment",Robust,"Tree Climber" ' +
    'Languages="High Elven",Orcish,"Patrol Sign"',
  'Urban Sarcosan':
    'Features=' +
      '"Sarcosan Ability Adjustment",' +
      '"Weapon Familiarity (Cedeku/Sarcosan Lance)",' +
      '"Favored Region (Urban)",' +
      'Interactive,Quick,"Sarcosan Feat Bonus" ' +
    'Languages=Colonial,Erenlander',
  'Wood Elf':
    'Features=' +
      '"Elf Ability Adjustment",' +
      '"Weapon Proficiency (Composite Longbow/Composite Shortbow/Longbow/Shortbow)",' +
      '"Weapon Proficiency (Longsword/Short Sword)",' +
      '"Favored Region (Caraheen/Erethor)",' +
      '"Improved Innate Magic","Improved Natural Channeler","Innate Magic",' +
      '"Keen Senses","Low-Light Vision","Natural Channeler",' +
      '"Resist Enchantment","Tree Climber" ' +
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
  'Transmutation':'',
  'Universal':''
};
LastAge.SHIELDS = Object.assign({}, SRD35.SHIELDS);
LastAge.SKILLS_ADDED = {
  'Knowledge (Local)':
    'Ability=intelligence Untrained=n ' +
    'Synergy="Knowledge (Shadow) (bureaucracy)"',
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
  // Sunderborn heroic path
  'Detect Outsider':
    'School=Divination ' +
    'Description="R60\' cone info on outsiders for $L10 min"',
  'Disguise Ally':
    'School=Illusion ' +
    'Description="Change touched appearance/+10 disguise for $L10 min (Will disbelieve)"',
  'Disguise Weapon':
    'School=Illusion ' +
    'Description="$L touched weapons look benign for $L hr"',
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
    'Description="10\' radius from touched +2 AC, +2 saves, extra save vs. mental control, no contact vs. Izrador agents for $L10 min (Will neg)"',
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
  // Shard Arrow ignored--Quilvyn doesn't list ammo
  'Staghorn':'Level=3 Category=1h Damage=d6',
  'Tack Whip':'Level=1 Category=Li Damage=d4',
  'Urutuk Hatchet':'Level=3 Category=1h Damage=d8 Crit=3 Range=20',
  'Vardatch':'Level=3 Category=1h Damage=d12',
  // Debris for Giantblooded heroic path
  'Debris':'Level=0 Category=R Damage=d10 Range=30'
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
      '"3:Inspire Fury","3:Mass Suggestion",3:Suggestion ' +
    'CasterLevelArcane="levels.Charismatic Channeler" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Ch0:1=0 ' +
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
      'Magic Weapon;Mount;Obscuring Mist;Pass Without Trace;Peasant\'s Rest;' +
      'Phantom Edge;Produce Flame;Protection From Chaos;' +
      'Protection From Evil;Protection From Good;Protection From Law;' +
      'Ray Of Enfeeblement;Reduce Person;Remove Fear;Shield;Shillelagh;' +
      'Shocking Grasp;Silent Image;Sleep;Speak With Animals;Spider Climb;' +
      'Stone Soup;Summon Monster I;Summon Nature\'s Ally I;True Strike;' +
      'Undetectable Alignment;Unseen Servant;Ventriloquism;Woeful Speech",' +
      '"Ch2:Acid Arrow;Alter Self;Animal Messenger;Animal Trance;Arcane Lock;' +
      'Barkskin;Bear\'s Endurance;Bleed Power;Blindness/Deafness;Blur;' +
      'Bull\'s Strength;Cat\'s Grace;Chill Metal;Command Undead;Confer Power;' +
      'Continual Flame;Cure Moderate Wounds;Darkness;Darkvision;' +
      'Daze Monster;Delay Poison;Detect Chaos;Detect Evil;Detect Good;' +
      'Detect Law;Detect Thoughts;Disguise Ally;Eagle\'s Splendor;' +
      'False Life;Fell Forbiddance;Fey Fire;Fey Hearth;Flame Blade;' +
      'Flaming Sphere;Fog Cloud;Fox\'s Cunning;Ghoul Touch;Glitterdust;' +
      'Greenshield;Gust Of Wind;Heat Metal;Hideous Laughter;Hold Animal;' +
      'Hypnotic Pattern;Invisibility;Knock;Lesser Restoration;Levitate;' +
      'Lifetrap;Locate Object;Magic Mouth;Memorial;Minor Image;' +
      'Mirror Image;Misdirection;Nature\'s Revelation;Obscure Object;' +
      'Owl\'s Wisdom;Pacify;Phantom Trap;Protection From Arrows;' +
      'Pyrotechnics;Reduce Animal;Resist Energy;Scare;Scorching Ray;' +
      'Scryer\'s Mark;See Invisibility;Shatter;Silence;Silver Blood;' +
      'Soften Earth And Stone;Sound Burst;Spectral Hand;Spider Climb;' +
      'Summon Monster II;Summon Nature\'s Ally II;Summon Swarm;' +
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
      'Summon Monster III;Summon Nature\'s Ally III;Tiny Hut;Tongues;' +
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
      'Stone Shape;Stoneskin;Summon Monster IV;Summon Nature\'s Ally IV;' +
      'Wall Of Fire;Wall Of Ice;Zone Of Silence",' +
      '"Ch5:Animal Growth;Arcane Interference;Atonement;Awaken;' +
      'Baleful Polymorph;Break Enchantment;Call Lightning Storm;Cloudkill;' +
      'Commune With Nature;Cone Of Cold;Contact Other Plane;' +
      'Control Winds;Death Ward;Dismissal;Dominate Person;Dream;Fabricate;' +
      'False Vision;Feeblemind;Hallow;Hold Monster;Insect Plague;' +
      'Interposing Hand;Lesser Planar Binding;Mage\'s Faithful Hound;' +
      'Mage\'s Private Sanctum;Magic Circle Against Shadow;Magic Jar;' +
      'Major Creation;Mass Cure Light Wounds;Mind Fog;Mirage Arcana;' +
      'Nexus Fuel;Nightmare;Overland Flight;Passwall;Persistent Image;' +
      'Prying Eyes;Secret Chest;Seeming;Sending;Shadow Evocation;' +
      'Song Of Discord;Summon Monster V;Summon Nature\'s Ally V;' +
      'Symbol Of Pain;Symbol Of Sleep;Telekinesis;Telepathic Bond;' +
      'Transmute Mud To Rock;Transmute Rock To Mud;Unhallow;Wall Of Force;' +
      'Wall Of Stone;Wall Of Thorns;Waves Of Fatigue",' +
      '"Ch6:Acid Fog;Analyze Dweomer;Animate Objects;Antilife Shell;' +
      'Antimagic Field;Chain Lightning;Circle Of Death;Contingency;' +
      'Create Undead;Disintegrate;Eyebite;Find The Path;Fire Seeds;' +
      'Flesh To Stone;Forceful Hand;Freezing Sphere;Geas/Quest;' +
      'Globe Of Invulnerability;Greater Dispel Magic;Greater Heroism;' +
      'Greater Questing Bird;Guards And Wards;Heroes\' Feast;Ironwood;' +
      'Legend Lore;Liveoak;Mage\'s Lucubration;Mass Bear\'s Endurance;' +
      'Mass Bull\'s Strength;Mass Cat\'s Grace;Mass Cure Moderate Wounds;' +
      'Mass Eagle\'s Splendor;Mass Fox\'s Cunning;Mass Owl\'s Wisdom;' +
      'Mass Suggestion;Mislead;Move Earth;Permanent Image;Planar Binding;' +
      'Programmed Image;Repel Wood;Repulsion;Spellstaff;Stone Tell;' +
      'Stone To Flesh;Summon Monster VI;Summon Nature\'s Ally VI;' +
      'Symbol Of Fear;Symbol Of Persuasion;Sympathetic Vibration;' +
      'Transformation;True Seeing;Undeath To Death;Veil;Wall Of Iron",' +
      '"Ch7:Animate Plants;Banishment;Changestaff;Control Undead;' +
      'Control Weather;Creeping Doom;Delayed Blast Fireball;' +
      'Finger Of Death;Fire Storm;Forcecage;Grasping Hand;' +
      'Greater Arcane Sight;Greater Restoration;Greater Scrying;' +
      'Greater Shadow Conjuration;Heal;Insanity;Mage\'s Sword;' +
      'Mass Cure Serious Wounds;Mass Hold Person;Mass Invisibility;' +
      'Power Word Blind;Prismatic Spray;Project Image;Reverse Gravity;' +
      'Sequester;Simulacrum;Spell Turning;Statue;Summon Monster VII;' +
      'Summon Nature\'s Ally VII;Sunbeam;Symbol Of Stunning;' +
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
      'Summon Nature\'s Ally VIII;Sunburst;Symbol Of Death;' +
      'Symbol Of Insanity;Sympathy;Telekinetic Sphere;Temporal Stasis;' +
      'Trap The Soul;Whirlwind",' +
      '"Ch9:Astral Projection;Crushing Hand;Dominate Monster;' +
      'Elemental Swarm;Energy Drain;Foresight;Freedom;Gate;Imprisonment;' +
      'Mage\'s Disjunction;Mass Hold Monster;Meteor Swarm;Power Word Kill;' +
      'Prismatic Sphere;Regenerate;Shades;Shambler;Shapechange;Soul Bind;' +
      'Storm Of Vengeance;Summon Monster IX;Summon Nature\'s Ally IX;' +
      'Time Stop;Wail Of The Banshee;Weird"',
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
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,"Knowledge (Shadow)",' +
      'Profession,Ride,"Speak Language",Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)" ' +
    'Selectables=' +
      '4:Adapter,4:Improviser,"4:Leader Of Men",4:Survivor,' +
      '"4:Improved Grapple","4:Improved Unarmed Strike",' +
      '"4:Improvised Weapon","4:Stunning Fist","4:Iron Will",4:Leadership,' +
      '"4:Skill Focus (Diplomacy)","4:Skill Focus (Profession (Soldier))",' +
      '"4:Combat Expertise",4:Dodge,4:Endurance',
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
    'CasterLevelArcane="levels.Hermetic Channeler" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Ch0:1=0',
  'Legate':
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      '"Knowledge (Arcana)","Knowledge (Shadow)","Knowledge (Spirits)",' +
      'Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Spontaneous Legate Spell","1:Temple Dependency","1:Turn Undead",' +
      '"3:Astirax Companion" ' +
    'Selectables=' +
      QuilvynUtils.getKeys(LastAge.PATHS).filter(x => x.match(/Domain$/)).map(x => '"deityDomains =~ \'' + x.replace(' Domain', '') + '\' ? 1:' + x + '"').join(',') + ' ' +
    'CasterLevelDivine=levels.Legate ' +
    'SpellAbility=charisma ' +
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
      'Domain9:17=1 ' +
    // Cleric spells added by choiceRules method
    'Spells=' +
      '"C3:Boil Blood;Speak With Fell"',
  'Rogue':SRD35.CLASSES['Rogue'],
  'Spiritual Channeler':
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Handle Animal",Heal,' +
      '"Knowledge (Arcana)","Knowledge (Spirits)",Profession,Ride,Search,' +
      'Diplomacy,"Knowledge (Nature)","Sense Motive",Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Art Of Magic","2:Familiar","1:Magecraft (Spiritual)" ' +
    'Selectables=' +
      '"3:Confident Effect","3:Heightened Effect","3:Mastery Of Nature",' +
      '"3:Mastery Of Spirits","3:Mastery Of The Unnatural",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Powerful Effect",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Precise Effect",' +
      '"features.Mastery Of Nature || features.Mastery Of Spirits || features.Mastery Of Nature ? 3:Specific Effect",' +
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
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '1:Track,"3:Danger Sense","3:Initiative Bonus","4:Hunter\'s Strike" ' +
    'Selectables=' +
      '1:Alertness,"1:Animal Companion",1:Camouflage,"1:Danger Sense",' +
      '1:Evasion,"1:Hated Foe","1:Hide In Plain Sight",' +
      '"1:Hunted By The Shadow","1:Improved Evasion","1:Improved Initiative",' +
      '"1:Improved Woodland Stride","1:Initiative Bonus",' +
      '"1:Instinctive Response","1:Master Hunter","1:Overland Stride",' +
      '"1:Practiced Skills","1:Quick Stride","1:Sense Dark Magic",' +
      '"1:Slippery Mind","1:Trackless Step","1:True Aim","1:Wild Empathy",' +
      '"1:Wilderness Trapfinding","1:Woodland Stride",1:Woodslore'
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

/* Defines the rules related to goodies included in character notes. */
LastAge.goodiesRules = function(rules) {
  LastAge.basePlugin.goodiesRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
LastAge.identityRules = function(
  rules, alignments, classes, deities, paths, races
) {

  if(LastAge.basePlugin == window.Pathfinder)
    Pathfinder.identityRules
      (rules, alignments, classes, deities, {}, paths, races,
       Pathfinder.TRACKS, Pathfinder.TRAITS);
  else
    SRD35.identityRules(rules, alignments, classes, deities, paths, races)

  rules.defineRule('features.Illiteracy', '', '=', '1');
  rules.defineRule
    ('skillModifier.Speak Language', 'skillNotes.illiteracy', '+', '-2');

  rules.defineRule('maxSpellLevel',
    'casterLevels.Ch', '?', null,
    'level', '=', 'source / 2',
    'features.Art Of Magic', '+', '1/2'
  );
  for(var i = 0; i < 10; i++) {
    rules.defineRule('spellSlots.Ch' + i,
      'maxSpellLevel', '?', 'Math.floor(source) == ' + i,
      'spellSlotsBonus', '=', null
    );
  }

  // Remove Deity from editor and sheet; add heroic path and spell energy
  rules.defineEditorElement('deity');
  rules.defineSheetElement('Deity');
  rules.defineSheetElement('Deity Alignment');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'experience');
  rules.defineSheetElement('Heroic Path', 'Alignment');
  rules.defineSheetElement('Spell Energy', 'Spell Slots');

};

/* Defines rules related to magic use. */
LastAge.magicRules = function(rules, schools, spells) {
  LastAge.basePlugin.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
LastAge.talentRules = function(rules, feats, features, languages, skills) {
  LastAge.basePlugin.talentRules(rules, feats, features, languages, skills);
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
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
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
    var spells = QuilvynUtils.getAttrValueArray(attrs, 'Spells');
    if(name == 'Legate')
      spells = spells.concat(QuilvynUtils.getAttrValueArray(LastAge.basePlugin.CLASSES['Cleric'], 'Spells'));
    else if(name == 'Barbarian' || name == 'Rogue')
      attrs = LastAge.basePlugin.CLASSES[name];
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      spells,
      LastAge.SPELLS
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
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Feat') {
    LastAge.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    LastAge.featRulesExtra(rules, name, LastAge.SPELLS);
  } else if(type == 'Feature')
    LastAge.featureRules(rules, name,
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      LastAge.SPELLS
    );
    LastAge.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    LastAge.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      LastAge.SPELLS
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
  } else if(type == 'Spell')
    LastAge.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Track')
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
  if(type != 'Feature' && (type != 'Path' || name.indexOf('Domain') < 0)) {
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
 * character level attribute 'level'. #spellAbility#, if specified, names the
 * ability for computing spell difficulty class. #spellSlots# lists the
 * number of spells per level per day granted by the class, and #spells# lists
 * spells defined by the class. #spellDict# is the dictionary of all spells,
 * used to look up individual spell attributes.
 */
LastAge.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots, spells, spellDict
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
    casterLevelDivine, spellAbility, spellSlots, spells, spellDict
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
    rules.defineRule('familiarMasterLevel', 'channelerLevels', '^=', null);
    rules.defineRule('featCount.' + name,
      classLevel, '=', 'source >= 4 ? Math.floor((source - 1) / 3) : null'
    );
    rules.defineRule('featCount.Spellcasting',
      'channelerLevels', '+=', 'source>=2 ? Math.floor((source + 1) / 3) : null'
    );
    rules.defineRule
      ('magicNotes.channelerSpellEnergy', 'channelerLevels', '=', null);
    rules.defineRule('magicNotes.channelerSpellSlots',
      'channelerLevels', '=', '(source - 1) * 2'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.channelerSpellEnergy', '+', null);
    rules.defineRule
      ('spellSlotsBonus', 'magicNotes.channelerSpellSlots', '+', null);
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
      rules.defineRule('combatNotes.masteryOfNature.1',
        'turningLevel', '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfNature.2',
        'turningLevel', '=', 'source * 3 - 10',
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
      rules.defineRule('combatNotes.masteryOfTheUnnatural.1',
        'turningLevel', '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfTheUnnatural.2',
        'turningLevel', '=', 'source * 3 - 10',
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
      rules.defineRule('combatNotes.masteryOfSpirits.1',
        'turningLevel', '=', null,
        'wisdomModifier', '+', null
      );
      rules.defineRule('combatNotes.masteryOfSpirits.2',
        'turningLevel', '=', 'source * 3 - 10',
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
      rules.defineRule('magicNotes.forceOfPersonality',
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
      rules.defineRule('selectableFeatureCount.Hermetic Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('skillNotes.quickReference',
        'hermeticChannelerFeatures.Quick Reference', '=', '5 * source'
      );
    } else if(name == 'Spiritual Channeler') {
      for(var feat in allFeats) {
        if(feat == 'Extra Gift' || feat == 'Spell Knowledge' ||
           allFeats[feat].indexOf('Item Creation') >= 0) {
          allFeats[feat] =
            allFeats[feat].replace('Type=', 'Type="' + name + '",');
        }
      }
      rules.defineRule('selectableFeatureCount.Spiritual Channeler',
        classLevel, '=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('turningLevel', 'levels.Spiritual Channeler', '=', null);
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
    rules.defineRule('selectableFeatureCount.Defender',
      classLevel, '=',
      'source < 2 ? null : (Math.floor((source + 1) / 3) + ' +
                           '(source < 6 ? 0 : Math.floor((source - 3) / 3)))'
    );
    rules.defineRule
      ('unarmedDamageDice', 'combatNotes.masterfulStrike', '=', null);

  } else if(name == 'Fighter') {

    rules.defineRule
      ('featCount.Fighter', classLevel, '=', '1 + Math.floor(source / 2)');
    rules.defineRule('selectableFeatureCount.Fighter',
      classLevel, '=', 'source>=4 ? 1 + Math.floor((source+2)/6) : null'
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
    rules.defineRule('deity', 'levels.Legate', '=', '"Izrador"');
    rules.defineRule
      ('selectableFeatureCount.Legate', classLevel, '=', '2');
    rules.defineRule('turningLevel', classLevel, '+=', null);
    // Use animal companion stats and features for astirax abilities
    var features = [
      '3:Empathic Link', '6:Telepathy', '9:Enhanced Sense',
      '12:Companion Evasion', '18:Companion Empathy'
    ];
    QuilvynRules.featureListRules
      (rules, features, 'Animal Companion', classLevel, false);
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
    rules.defineRule('combatNotes.initiativeBonus',
      classLevel, '+=', 'source >= 3 ? 1 : null',
      'wildlanderFeatures.Initiative Bonus', '+', null
    );
    rules.defineRule('featureNotes.animalCompanion',
      'wildlanderFeatures.Animal Companion', '+=', null
    );
    rules.defineRule('selectableFeatureCount.Wildlander',
      classLevel, '=',
      '1 + Math.floor((source + 1) / 3) + ' +
      '(source < 6 ? 0 : Math.floor((source - 3) / 3))'
    );
    rules.defineRule('skillNotes.dangerSense',
      classLevel, '+=', 'source >= 3 ? 1 : null',
      'wildlanderFeatures.Danger Sense', '+', null
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
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  LastAge.basePlugin.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level
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
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  LastAge.basePlugin.familiarRules
    (rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level);
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
 * derived directly from the abilties passed to featRules.
 */
LastAge.featRulesExtra = function(rules, name, spellDict) {

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
    rules.defineRule
      ('magicNotes.forceOfPersonality', 'featureNotes.extraGift', '+', '4');
  } else if(name == 'Innate Magic') {
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
    // Pick up basePlugin level 0/1 spells of the appropriate class.
    var spells =
      QuilvynUtils.getAttrValueArray(LastAge.basePlugin.CLASSES[spellClass], 'Spells').filter(x => x.match(new RegExp('^' + spellCode + '[01]')));
    QuilvynRules.spellListRules(rules, spells, spellDict);
  } else if((matchInfo = name.match(/^Spellcasting\s\((.*)\)/)) != null) {
    var note = 'magicNotes.spellcasting('+matchInfo[1].replaceAll(' ', '')+')';
    rules.defineRule('spellSlotsBonus', note, '+=', '1');
    rules.defineRule
      ('spellcastingFeatureCount', /^features.Spellcasting/, '+=', '1');
    rules.defineRule(
      'casterLevels.Spellcasting', 'spellcastingFeatureCount', '?', null,
      'level', '=', null
    );
    rules.defineRule('casterLevels.Ch', 'casterLevels.Spellcasting', '=', null);
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
  } else if(name == 'Born Of Duty') {
    rules.defineRule('magicNotes.bornOfDuty',
      'level', '=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
  } else if(name == 'Improved Flexible Recovery') {
    rules.defineRule('magicNotes.improvedFlexibleRecovery',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
  } else if(name == 'Power Reservoir') {
    rules.defineRule('magicNotes.powerReservoir',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
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

/* Defines in #rules# the rules associated with language #name#. */
LastAge.languageRules = function(rules, name) {
  LastAge.basePlugin.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features and spells listed in #features#
 * and #spells#. #spellAbility#, if specified, names the ability for computing
 * spell difficulty class. #spellDict# is the dictionary of all spells used to
 * look up individual spell attributes.
 */
LastAge.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots, spells, spellDict
) {
  if(LastAge.basePlugin == window.Pathfinder)
    LastAge.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots, spells, spellDict
    );
  else
    LastAge.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots, spells, spellDict
    );
  // No changes needed to the rules defined by base method
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
    rules.defineRule('featureNotes.persistence',
      pathLevel, '+=', 'Math.floor((source - 1) / 5)'
    );
    rules.defineRule
      ('features.Defensive Roll', 'features.Persistence', '=', '1');
    rules.defineRule('features.Evasion', 'features.Persistence', '=', '1');
    rules.defineRule
      ('features.Slippery Mind', 'features.Persistence', '=', '1');
    rules.defineRule
      ('features.Uncanny Dodge', 'features.Persistence', '=', '1');
    rules.defineRule('magicNotes.unfettered',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );

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
      pathLevel, '=', 'source>=16 ? 8 : source>=11 ? 6 : source>=7 ? 4 : source>=3 ? 2 : null'
    );
    rules.defineRule('magicNotes.bonusSpells',
      pathLevel, '=', 'source>=14 ? 3 : source>=8 ? 2 : source>=2 ? 1 : null'
    );
    rules.defineRule('magicNotes.frightfulPresence',
      pathLevel, '+=', '10 + Math.floor(source / 2)',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.improvedSpellPenetration',
      pathLevel, '+=', 'Math.floor((source - 5) / 4)'
    );
    rules.defineRule('magicNotes.improvedSpellcasting',
      pathLevel, '+=', 'Math.floor(source / 6)'
    );
    rules.defineRule('spellEnergy', 'magicNotes.bonusSpellEnergy', '+', null);
    rules.defineRule('spellSlotsBonus', 'magicNotes.bonusSpells', '+', null);

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
      pathLevel, 'v', 'Math.floor((source + 1) / 5)'
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
    rules.defineRule('saveNotes.wardOfLife',
      pathLevel, '=',
      '"extraordinary special attacks" + ' +
      '(source >= 8 ? ", ability damage" : "") + ' +
      '(source >= 13 ? ", ability drain" : "") + ' +
      '(source >= 18 ? ", energy drain" : "")'
    );

  } else if(name == 'Feyblooded') {

    rules.defineRule('abilityNotes.unearthlyDexterity',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('combatNotes.unearthlyDefense',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyFortitude',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyReflexes',
      'charismaModifier', '=', null,
      pathLevel, 'v', 'Math.floor(source / 4)'
    );
    rules.defineRule('saveNotes.unearthlyWill',
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
    rules.defineRule('combatNotes.longRockThrowing',
      pathLevel, '^=', 'source>=19?120 : source>=13?90 : source>=6?60 : 30'
    );
    rules.defineRule('debrisDamageDice',
      pathLevel, '=', 'source >= 16 ? "2d8" : source >= 9 ? "2d6" : null'
    );
    rules.defineRule('debrisRange', 'combatNotes.longRockThrowing', '^=', null);
    rules.defineRule('skillNotes.intimidatingSize',
      pathLevel, '+=', 'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
    );
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
    rules.defineRule('combatNotes.smiteEvil.1', 'charismaModifier', '=', null);
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
    rules.defineRule('saveNotes.resistElements',
      pathLevel, '+=', 'Math.floor((source - 1) / 5) * 3'
    );
    rules.defineRule('saveNotes.fortitudeBonus',
      pathLevel, '+=', 'Math.floor((source + 3) / 5)'
    );
    rules.defineRule('saveNotes.indefatigable',
      pathLevel, '=', 'source < 19 ? "fatigue" : "fatigue and exhaustion"'
    );

  } else if(name == 'Jack-Of-All-Trades') {

    rules.defineRule
      ('featureNotes.featBonus', pathLevel, '=', 'Math.floor(source / 7)');
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
    rules.defineRule('skillNotes.mountainSurvival',
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
    rules.defineRule('magicNotes.howlingWinds',
      pathLevel, '+=', 'source >= 12 ? 3 : source >= 8 ? 2 : 1'
    );
    rules.defineRule
      ('saveNotes.coldResistance', pathLevel, '+=', 'source >= 9 ? 15 : 5');
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(name == 'Painless') {

    rules.defineRule
      ('combatNotes.improvedRetributiveRage', pathLevel, '+=', null);
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
    rules.defineRule('saveNotes.uncaringMind',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('saveNotes.painless',
      pathLevel, '=', 'Math.floor((source + 4) / 5) * 5'
    );

  } else if(name == 'Pureblood') {

    rules.defineRule
      ('abilityNotes.abilityBoost', pathLevel, '+=', 'Math.floor(source / 5)');
    rules.defineRule('featureNotes.featBonus',
      pathLevel, '+=', 'Math.floor((source + 2) / 5)'
    );
    rules.defineRule('skillNotes.skillMastery',
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

    rules.defineRule('highestMagicModifier',
      'charismaModifier', '=', null,
      'intelligenceModifier', '^', null,
      'wisdomModifier', '^', null
    );
    rules.defineRule('magicNotes.bonusSpellEnergy',
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
    rules.defineRule
      ('magicNotes.metamagicAura.1', pathLevel, '=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.metamagicAura.2',
      pathLevel, '=', 'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
    );
    rules.defineRule('magicNotes.untappedPotential',
      'highestMagicModifier', '=', 'source + 1',
      pathLevel, '+',
        'source>=18 ? 8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : 0'
    );
    rules.defineRule('saveNotes.improvedResistSpells',
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

    rules.defineRule('combatNotes.aidedCombatBonus',
      pathLevel, '+=', 'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : null'
    );
    rules.defineRule('combatNotes.combatOverview',
      pathLevel, '+=', 'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
    );
    rules.defineRule('combatNotes.coordinatedInitiative',
      pathLevel, '+=', 'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
    );
    rules.defineRule('combatNotes.jointAttack',
      pathLevel, '+=', 'source>=17 ? 4 : source==16 ? 3 : Math.floor(source/4)'
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
      pathLevel, '=', 'source >= 16 ? 3 : source >= 9 ? 2 : 1'
    );
    rules.defineRule('skillNotes.wildEmpathy', pathLevel, '+=', null);

  } else if(LastAge.basePlugin.pathRulesExtra) {

    LastAge.basePlugin.pathRulesExtra(rules, name);

  }

};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. #spells# lists
 * any natural spells, for which #spellAbility# is used to compute the save DC.
 * #spellSlots# lists the number of spells per level per day granted by the
 * race, and #spells# lists spells defined by the race. #spellDict# is the
 * dictionary of all spells, used to look up individual spell attributes.
 */
LastAge.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spells, spellSlots, spellDict
) {
  LastAge.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spells, spellSlots, spellDict);
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

  if(name == 'Dorn') {

    rules.defineRule
      ('featCount.Fighter', 'featureNotes.dornFeatCountBonus', '+=', null);
    rules.defineRule('featureNotes.dornFeatCountBonus',
      'race', '=', 'source == "Dorn" ? 1 : null'
    );
    rules.defineRule
      ('skillNotes.dornSkillPointsBonus', raceLevel, '=', 'source + 3');

  } else if(name.indexOf(' Dwarf') >= 0) {

    rules.defineRule('abilityNotes.armorSpeedAdjustment',
      'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
    );
    if(name == 'Clan Dwarf') {
      rules.defineRule('skillNotes.stonecunning',
        'clanDwarfFeatures.Stonecunning', '+=', '2'
      );
    }

  } else if(name.indexOf(' Dwarrow') >= 0) {

    if(name == 'Clan-Raised Dwarrow') {
      rules.defineRule('skillNotes.stonecunning',
        'clanRaisedDwarrowFeatures.Stonecunning', '+=', '2'
      );
    } else if(name == 'Gnome-Raised Dwarrow') {
      rules.defineRule('deepLungsMultiplier',
        'gnomeRaisedDwarrowFeatures.Deep Lungs', '=', '3'
      );
      rules.defineRule('skillNotes.deepLungs',
        'deepLungsMultiplier', '=', null,
        'constitution', '*', 'source'
      );
      rules.defineRule('abilityNotes.naturalSwimmer',
        'speed', '=', 'Math.floor(source / 2)'
      );
    }

  } else if(name.indexOf(' Dworg') >= 0) {

    if(name == 'Clan-Raised Dworg') {
      rules.defineRule('skillNotes.stonecunning',
        'clanRaisedDworgFeatures.Stonecunning', '+=', '2'
      );
    }

  } else if(name.indexOf(' Elfling') >= 0) {

    if(name == 'Halfling-Raised Elfling') {
      rules.defineRule
        ('features.Mounted Combat', 'featureNotes.boundToTheBeast', '=', '1');
    }

  } else if(name.indexOf(' Elf') >= 0) {

    if(name == 'Jungle Elf') {
      rules.defineRule
        ('magicNotes.innateMagic', 'magicNotes.improvedInnateMagic', '+', '1');
      rules.defineRule
        ('skillNotes.feralElfFeature2', 'features.Feral Elf', '=', '1');
    } else if(name == 'Sea Elf') {
      rules.defineRule
        ('deepLungsMultiplier', 'seaElfFeatures.Deep Lungs', '=', '6');
      rules.defineRule('skillNotes.deepLungs',
        'deepLungsMultiplier', '=', null,
        'constitution', '*', 'source'
      );
      rules.defineRule
        ('abilityNotes.naturalSwimmer', 'speed', '=', 'Math.floor(source / 2)');
    } else if(name == 'Wood Elf') {
      rules.defineRule
        ('magicNotes.innateMagic', 'magicNotes.improvedInnateMagic', '+', '1');
      rules.defineRule
        ('skillNotes.woodElfSkillPointsBonus', raceLevel, '=', 'source');
    }

  } else if(name == 'Erenlander') {

    rules.defineRule('abilityNotes.erenlanderAbilityAdjustment',
      'race', '=', 'source == "Erenlander" ? 1 : null'
    );
    rules.defineRule('featureNotes.erenlanderFeatCountBonus',
      'race', '=', 'source == "Erenlander" ? 2 : null'
    );
    rules.defineRule('skillNotes.erenlanderSkillPointsBonus',
      raceLevel, '=', '(source + 3) * 2'
    );

  } else if(name == 'Gnome') {

    rules.defineRule
      ('deepLungsMultiplier', 'gnomeFeatures.Deep Lungs', '=', '3');
    rules.defineRule('skillNotes.deepLungs',
      'deepLungsMultiplier', '=', null,
      'constitution', '*', 'source'
    );
    rules.defineRule
      ('abilityNotes.naturalSwimmer', 'speed', '=', 'Math.floor(source / 2)');

  } else if(name.indexOf(' Halfling') >= 0) {

    if(name == 'Agrarian Halfling') {
      rules.defineRule
        ('agrarianHalflingFeatures.Endurance', 'featureNotes.stout', '=', '1');
      rules.defineRule
        ('agrarianHalflingFeatures.Toughness', 'featureNotes.stout', '=', '1');
      rules.defineRule('agrarianHalflingFeatures.Magecraft (Hermetic)',
        'featureNotes.studious', '=', '1'
      );
      rules.defineRule
        ('features.Endurance', 'agrarianHalflingFeatures.Endurance', '=', '1');
      rules.defineRule('features.Magecraft (Hermetic)',
        'agrarianHalflingFeatures.Magecraft (Hermetic)', '=', '1'
      );
      rules.defineRule
        ('features.Toughness', 'agrarianHalflingFeatures.Toughness', '=', '1');
      rules.defineRule('selectableFeatureCount.Agrarian Halfling',
        'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
      );
    } else if(name == 'Nomadic Halfling') {
      rules.defineRule('features.Magecraft (Spiritual)',
        'nomadicHalflingFeatures.Magecraft (Spiritual)', '=', '1'
      );
      rules.defineRule('features.Mounted Combat',
        'nomadicHalflingFeatures.Mounted Combat', '=', '1'
      );
      rules.defineRule('nomadicHalflingFeatures.Magecraft (Spiritual)',
        'featureNotes.boundToTheSpirits', '=', '1'
      );
      rules.defineRule('nomadicHalflingFeatures.Mounted Combat',
        'featureNotes.boundToTheBeast', '=', '1'
      );
      rules.defineRule('selectableFeatureCount.Nomadic Halfling',
        'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
      );
    }

  } else if(name == 'Orc') {

    rules.defineRule
      ('skillNotes.naturalPreditor', 'strengthModifier', '=', null);

  } else if(name.indexOf(' Sarcosan') >= 0) {

    rules.defineRule
      ('skillNotes.sarcosanSkillPointsBonus', raceLevel, '=', 'source + 3');

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
  rules, name, school, casterGroup, level, description
) {
  LastAge.basePlugin.spellRules
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
  LastAge.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
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
    '    Legates feature); Wildlander "Skill Mastery" (renamed "Practiced\n' +
    '    Skills" to distinguish from the Pureblood feature); Spellsoul\n' +
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
    '    feature is replaced by "Big" at level 1, "Large" at level 10,\n' +
    '    and "Extra Reach" at level 20.  Other instances: Ironborn level\n' +
    '    14 "Improved Healing" becomes "Ability Recovery"; Mountaineer\n' +
    '    "Ambush" becomes "Improved Ambush", "Quick Ambush", and "Sniping\n' +
    '    Ambush" at levels 8, 13, and 18; Painless "Retributive Rage"\n' +
    '    becomes "Improved Retributive Rage" at level 14; Steelborn\n' +
    '    "Untouchable" becomes "Improved Untouchable" at level 19;\n' +
    '    Sunderborn "Spirit Sight" becomes "Darkvision", "Magical\n' +
    '    Darkvision", and "See Invisible" at levels 7, 13, and 19;\n' +
    '    Tactician "Aid Another" becomes "Aided Combat Bonus" at level 5;\n' +
    '    Aradil\'s Eye "Alter Ego" becomes "Quick Alteration" and\n' +
    '    "Nonmagical Alteration" at levels 5 and 9; Whisper Adept "Whisper\n' +
    '    Sense" becomes "Whisper Initiative", "Whisper Surprise", "Whisper\n' +
    '    Clairaudience", "Whisper Clairvoyance", and "Whisper Commune" at\n' +
    '    levels 2, 4, 6, 8, and 10.\n' +
    '  </li><li>\n' +
    '    The rule book incorrectly lists Bear\'s Endurance as a spell\n' +
    '    acquired at the level 4 Beast heroic path.  Quilvyn corrects this\n' +
    '    to Bull\'s Endurance.\n' +
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
    '  </li><li>\n' +
    '    Quilvyn removes the racial requirement (Elf or Halfling) from the\n' +
    '     Innate Magic feat. Since these races automatically receive thist\n' +
    '     feat, enforcing the requirement would eliminate the possibility\n' +
    '     of any character taking the feat.\n' +
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

/* Returns an array of plugins upon which this one depends. */
LastAge.getPlugins = function() {
  return LastAge.basePlugin.rules.getPlugins().concat([LastAge.basePlugin]);
};
