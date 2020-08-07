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

/*
 * This module loads the rules for the rule book Prestige Classes.  The
 * LastAgePrestige.PRESTIGE_CLASSES constant fields can be manipulated in order
 * to trim the choices offered.
 */
function LastAgePrestige() {
  if(window.SRD35 == null || window.LastAge == null) {
    alert('The LastAgePrestige module requires the SRD35 and LastAge modules');
    return;
  }
  LastAgePrestige.identityRules(LastAge.rules, LastAgePrestige.CLASSES);
  LastAgePrestige.talentRules(LastAge.rules, LastAgePrestige.FEATURES);
}

LastAgePrestige.CLASSES = {
  'Ancestral Bladebearer':
    'Require=' +
      '"baseAttack >= 6","Sum features.Weapon Focus >= 1",' +
      '"Sum features.Weapon Specialization >= 1"'
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,Profession,Ride,' +
      '"Speak Language",Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Unbreakable Blade","2:Advance Ancestral Blade",' +
      '"3:Ancestral Watcher","4:Immovable Blade","5:Ancestral Advisor",' +
      '"7:Ancestral Guide","8:Unwavering Blade","9:Ancestral Protector",' +
      '"10:Awaken Ancestral Blade"',
  "Aradil's Eye":
    'Require=' +
      'features.Inconspicuous,"race == \'Wood Elf\'","skills.Bluff >= 8",' +
      '"skills.Disguise >= 5","skills.Gather Information" >= 8",' +
      '"skills.Hide >= 8","skills.Move Silently >= 5",' +
      '"skills.Sense Motive >= 5","skills.Spot >= 5"'
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,Listen,"Move Silently",' +
      '"Open Lock",Profession,Search,"Sense Motive","Sleight Of Hand",' +
      '"Speak Language",Spot,Survival,Swim,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Alter Ego",1:Mindbond,"2:Spy Initiate","4:Closed Mind",' +
      '"5:Quick Alteration",5:Spy,"6:Hide In Plain Sight","7:Slippery Mind",' +
      '"8:Undetectable Alignment","9:Nonmagical Alteration","10:Master Spy"',
  'Avenging Knife':
    'Require=' +
     '"alignment !~ /Evil/","features.Improved Initiative",' +
     'features.Inconspicuous,"features.Sneak Attack","skills.Bluff >= 5",' +
     '"skills.Gather Information >= 5","skills.Hide >= 8",' +
     '"skills.Move Silently >= 8"'
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,"Decipher Script",Disguise,"Escape Artist",' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently","Open Locak",' +
      'Profession,Search,"Sense Motive","Speak Language",Spot,Swim,Tumble,' +
      '"Use Rope" ' +
    'Features=' +
      '"1:The Drop","2:Security Breach","3:Sneak Attack","4:Target Study",' +
      '"5:Fast Hands","6:Cover Story","7:Stunning Sneak Attack",' +
      '"8:Improved Coup De Grace","9:Still As Stone","10:Death Attack"',
  'Bane Of Legates':
    'Require=' +
      '"features.Iron Will","Sum features.Magecraft >= 1",' +
      '"skills.Knowledge (Arcana) >= 13","skills.Knowledge (Shadow) >= 8",' +
      '"skills.Spellcraft >= 10","spellEnergy >= 10"'
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Concentration,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      'Knowledge,Profession,"Sense Motive",Spellcraft,Survival ' +
    'Features=' +
      '"1:Art Of Magic","1:Resist Legate\'s Will","3:See Astirax",' +
      '"4:Counter Legate\'s Will","5:Bonus Spellcasting","6:Bind Astirax",' +
      '"8:Conceal Magic","10:Sundered Spirit"',
  'Druid':
    'Require=' +
      '"features.Magecraft (Spiritual)","Sum features.Spellcasting >= 1",' +
      '"features.Mastery Of Nature","features.Wild Empathy",' +
      '"skills.Knowledge (Nature) >= 8","skills.Survival >= 8"'
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Geography)","Knowledge (Nature)","Knowledge (Spirits)",' +
      'Profession,"Speak Language",Spellcraft,Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Longbow/Shortbow/Quarterstaff)",' +
      '"1:Art Of Magic","1:Mastery Of Nature","1:Animal Companion",' +
      '2:Druidcraft,"2:Nature Sense","3:Commune With Nature",' +
      '"5:Find The Way","8:Venom Immunity"',
  'Elven Raider':
    'Require=' +
      '"baseAttack >= 5","features.Point-Blank Shot","features.Rapid Shot",' +
      '"features.Weapon Focus (Composite Longbow)||features.Weapon Focus (Longbow)",' +
      '"race =~ /Elf/","skills.Hide >= 8","skills.Move Silently >= 8",' +
      '"skills.Survival >= 8"
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Craft,Heal,Hide,Intimidate,Jump,Listen,"Move Silently",' +
      'Profession,Ride,Search,"Speak Language",Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple)"' +
      '"1:Ranged Sneak Attack","2:Improved Sneak Attack","3:Meticulous Aim",' +
      '"4:Intimidating Shot","6:Leaf Reader","7:Disarming Shot",' +
      '"9:Close Combat Archery"',
  'Freerider':
    'Require=' +
      '"baseAttack >= 6","features.Mounted Combat","features.Ride-By Attack",' +
      '"features.Spirited Charge","race =~ /Erenlander|Sarcosan/",' +
      '"skills.Handle Animal >= 4","skills.Ride >= 8","skills.Survival >= 4" ' +
    'Implies=' +
      '"Weapons.Composite Longbow||weapons.Sarcosan Lance||weapons.Scimitar'
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,Diplomacy,"Handle Animal",Jump,Profession,Ride,' +
      '"Speak Language",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)"' +
      '"1:Horse Lord","1:Special Mount","2:Mounted Maneuver","4:Spur On",' +
      '"7:Devastating Mounted Assault","7:Improved Mounted Assault",' +
      '"10:Sweeping Strike" ' +
    'Selectables=' +
      '"2:Deft Dodging","2:Dismounting Cut","2:Erratic Attack",' +
      '"2:Hit And Run","2:Wheel About"',
  'Haunted One':
    'Require=' +
      '"Sum features.Magecraft >= 1","features.Spellcasting (Divination)",' +
      '"features.Spellcasting (Necromancy)","skills.Knowledge (Arcana) >= 8",' +
      '"skills.Knowledge (Spirits) >= 10"'
    'HitDie=d6 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Art Of Magic",1:Seance,2:Spiritcraft,"2:Spirit Manipulation",' +
      '"3:Ghost Sight","5:Spell Focus (Divination)",' +
      '"9:Spell Focus (Necromancy)"',
  'Insurgent Spy':
    'Require=' +
      'features.Inconspicuous,"skills.Bluff >= 8","skills.Diplomacy >= 5",' +
      '"skills.Gather Information >= 8","skills.Sense Motive >= 5"'
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,"Knowledge (Shadow)",' +
      'Listen,"Move Silently","Open Lock",Perform,Profession,Search,' +
      '"Sense Motive","Sleight Of Hand","Speak Language",Spot,Swim,Tumble,' +
      '"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Conceal Aura","1:Shadow Contacts","2:Shadow Speak","3:Sneak Attack"',
  'Smuggler':
    'Require=' +
      '"features.Friendly Agent","skills.Bluff >= 8","skills.Forgery >= 5",' +
      '"skills.Gather Information >= 8","skills.Hide >= 5"'
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently,"Open Lock",' +
      'Perform,Profession,Search,"Sense Motive","Sleight Of Hand",Spot,' +
      'Swim,Tumble,"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Smuggler\'s Trade","2:Dominant Will","3:Mystifying Speech",' +
      '"4:Information Network","5:Disguise Contraband",' +
      '"7:More Mystifying Speech","10:Slippery Mind"',
  'Warrior Arcanist':
    'Require=' +
      '"baseAttack >= 4","Sum features.Magecraft >= 1",' +
      '"Sum features.Spellcasting >= 1","Sum features.Weapon Focus >= 1",' +
      '"features.Weapon Proficiency (Medium)","skills.Spellcraft >= 8"'
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Intimidate,Jump,"Knowledge (Arcana)",' +
      'Profession,Ride,"Speak Language",Spellcraft,Swim ' +
    'Features=' +
      '"1:Art Of Magic","1:Armored Casting","1:Channeled Attack",' +
      '"4:Channeled Armor Class","6:Melee Caster","8:Channeled Damage",' +
      '"10:Regenerative Strike"',
  'Whisper Adept':
    'Require=' +
      '"Sum features.Magecraft >= 1","Sum features.Spellcasting >= 2",' +
      '"race =~ /Elf/","skills.Knowledge (Nature) >= 8",' +
      '"skills.Knowledge (Spirits) >= 10","skills.Survival >= 8"'
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,Knowledge,Profession,' +
      '"Speak Language",Spellcraft,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)"' +
      '"1:Art Of Magic","1:Whisper Sense","2:Whisper Initiative",' +
      '"3:Fell Touch","4:Whisper Surprise","5:Tree Meld",' +
      '"6:Whisper Clairaudience","7:Strength Of The Wood",' +
      '"8:Whisper Clairvoyance","9:Whisper\'s Ward","10:Whisper Commune"',
  'Wizard':
    'Require=' +
      '"features.Magecraft (Hermetic)","Sum features.Spellcasting >= 2",' +
      '"skills.Knowledge (Arcana) >= 10","skills.Spellcraft >= 10"'
      // TODO 1 Item Creation and 1 Metamagic feat
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Art Of Magic",1:Wizardcraft,"2:Efficient Study",' +
      '"4:Bonus Spellcasting"',
  'Wogren Rider':
    'Require=' +
      '"features.Mounted Archery","features.Mounted Combat",' +
      '"race =~ /Halfling/","skills.Ride >= 8","skills.Survival >= 4"
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Heal,Hide,Jump,Listen,"Move Silently",' +
      'Profession,Ride,"Speak Language,Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Weapon Proficiency (Martial)"' +
      '"1:Coordinated Attack","1:Special Mount","3:Speed Mount",' +
      '"5:Mounted Hide","7:Wogren Dodge","9:Wogren\'s Sight" ' +
    'Selectables=' +
      '"2:Improved Mounted Archery","2:Improved Mounted Combat",' +
      '"2:Improved Ride-By Attack","2:Improved Spirited Charge",' +
      '"2:Improved Trample","2:Ride-By Attack","2:Spirited Charge",2:Trample'
};

/* Defines the rules related to SRDv3.5 Prestige Classes. */
LastAgePrestige.identityRules = function(rules, classes) {
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    LastAgePrestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to character features. */
LastAgePrestige.talentRules = function(rules, features) {
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
 */
LastAgePrestige.classRulesExtra = function(rules, name) {

    var notes,
        spellAbility, spellsKnown, spellsPerDay;
    var prefix =
      name.substring(0,1).toLowerCase() + name.substring(1).replace(/ /g, '');

  if(klass == 'Ancestral Bladebearer') {

    notes = [
      'combatNotes.advanceAncestralBladeFeature:' +
        'Unlock %V powers of covenant weapon',
      'combatNotes.awakenAncestralBladeFeature:Weapon becomes intelligent',
      'combatNotes.immovableBladeFeature:Cannot be involuntarily disarmed',
      'combatNotes.unbreakableBladeFeature:Ancestral weapon cannot be harmed',
      'combatNotes.unwaveringBladeFeature:' +
        'Detect weapon if separated; if unconscious, weapon fights',
      'magicNotes.ancestralAdvisorFeature:<i>Augury</i> via weapon %V/day',
      'magicNotes.ancestralGuideFeature:' +
        "<i>Detect Secret Doors</i> w/in 10' via weapon at will",
      'magicNotes.ancestralProtectorFeature:' +
        'Continuous <i>Protection From Arrows</i> via weapon',
      'magicNotes.ancestralWatcherFeature:Weapon has continuous <i>Alarm</i>',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('casterLevels.Ancesral Bladebearer',
      'levels.Ancestral Bladebearer', '?', 'source >= 3',
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.Ch', 'casterLevels.Ancestral Bladebearer', '=', null);
    rules.defineRule('combatNotes.advanceAncestralBladeFeature',
      'levels.Ancestral Bladebearer', '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('featCount.Fighter',
      'levels.Ancestral Bladebearer', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.ancestralAdvisorFeature',
      'charismaModifier', '=', 'source > 1 ? source : 1'
    );

  } else if(klass == "Aradil's Eye") {

    notes = [
      'featureNotes.alterEgoFeature:Transform into %V alter ego',
      'featureNotes.masterSpyFeature:' +
        'Mindbond to all known Master Spies and those in homeland at will',
      'featureNotes.mindbondFeature:Telepathic link to mentor 1/day',
      'featureNotes.nonmagicalAlterationFeature:' +
        'Transform to alter ego as a extraordinary ability',
      'featureNotes.quickAlterationFeature:' +
        'Change to alter ego as a full round action',
      'featureNotes.spyFeature:' +
        "%V% chance of help from d3 Aradil's Eyes in dire need",
      'featureNotes.spyInitiateFeature:Services from elven contacts',
      'magicNotes.undetectableAlignmentFeature:' +
        'Continuous <i>Undetectable Alignment</i>',
      'saveNotes.closedMindFeature:Second +4 Will save to reveal spy network',
      'saveNotes.slipperyMindFeature:Second save vs. enchantment',
      'skillNotes.hideInPlainSightFeature:Hide even when observed',
      'skillNotes.spyInitiateFeature:+%V Diplomacy (elves, allies)',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule("casterLevels.Aradil's Eye",
      "levels.Aradil's Eye", '?', 'source >= 8',
      'level', '=', null
    );
    rules.defineRule
      ('casterLevels.Ch', "casterLevels.Aradil's Eye", '=', null);
    rules.defineRule('featureNotes.alterEgoFeature',
      "levels.Aradil's Eye", '=',
      'source >= 7 ? "any" : source >= 3 ? "2 selected" : "1 selected"'
    );
    rules.defineRule
      ('featureNotes.spyFeature', "levels.Aradil's Eye", '=', 'source * 10');
    rules.defineRule('skillNotes.spyInitiateFeature',
      "levels.Aradil's Eye", '=', 'source >= 10 ? 10 : source >= 5 ? 8 : 4'
    );

  } else if(klass == 'Avenging Knife') {

    notes = [
      'combatNotes.deathAttackFeature:' +
        'DC %V save on sneak attack after 3 rounds of study or die/paralyzed',
      'combatNotes.fastHandsFeature:+4 initiative/-2 first round attack',
      'combatNotes.improvedCoupDeGraceFeature:' +
        'Max damage from standard action coup de grace',
      'combatNotes.sneakAttackFeature:' +
        '%Vd6 HP extra when surprising or flanking',
      'combatNotes.stunningSneakAttackFeature:' +
        'Foe DC %V on sneak attack or stunned one round 3/day',
      'combatNotes.theDropFeature:+%V attack/damage vs. flat-footed foe',
      'skillNotes.coverStoryFeature:' +
        'DC 20 Bluff four consecutive days to establish alibi',
      'skillNotes.securityBreachFeature:' +
        'Gather Information to discover chinks in site security',
      'skillNotes.stillAsStoneFeature:+10 Hide (infiltration)',
      'skillNotes.targetStudyFeature:' +
        'Gather Information yields +2 attack/damage or +4 AC vs. chosen foe',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('combatNotes.deathAttackFeature',
      'levels.Avenging Knife', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Avenging Knife', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.stunningSneakAttackFeature',
      'levels.Avenging Knife', '=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.theDropFeature',
      'levels.Avenging Knife', '=', 'Math.floor((source + 2) / 3)'
    );

  } else if(klass == 'Bane Of Legates') {

    notes = [
      'featureNotes.seeAstiraxFeature:See astirax as shadowy form',
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.bindAstiraxFeature:' +
        "Astirax w/in 60' Will save or bound to current form for %V hours",
      'magicNotes.concealMagicFeature:' +
        'Spells considered half level for purposes of astirax detection',
      'magicNotes.sunderedSpiritFeature:' +
        'Radiates <i>Antimagic Field</i> for divine magic',
      "magicNotes.counterLegate'sWillFeature:<i>Dispel Magic</i> vs. legates",
      "saveNotes.resistLegate'sWillFeature:+10 vs. legate magic",
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('featCount.Spellcasting',
      'levels.Bane Of Legates', '+=', 'Math.floor((source - 1) / 4)'
    );
    rules.defineRule('featCount.Wizard',
      'levels.Bane Of Legates', '=', 'Math.floor((source + 3) / 5)'
    );
    rules.defineRule('magicNotes.baneOfLegatesSpellEnergy',
      'levels.Bane Of Legates', '=', null
    );
    rules.defineRule
      ('magicNotes.bindAstiraxFeature', 'levels.Bane Of Legates', '=', null);
    rules.defineRule('magicNotes.baneOfLegatesSpellsKnown',
      'levels.Bane Of Legates', '=', null
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.baneOfLegatesSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.baneOfLegatesSpellsKnown', '+', null);

  } else if(klass == 'Druid') {

    notes = [
      'combatNotes.masteryOfNatureFeature:Turn animals/plants',
      'featureNotes.animalCompanionFeature:' +
        'Special bond/abilities w/up to %V animals',
      'featureNotes.findTheWayFeature:%V',
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.communeWithNatureFeature:<i>Commune With Nature</i> %V/day',
      'magicNotes.druidcraftFeature:Energy cost of Druid spells reduced by 1',
      'saveNotes.venomImmunityFeature:Immune to organic poisons',
      'skillNotes.natureSenseFeature:' +
        'Identify animals/plants/unsafe food/drink',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('companionLevel',
      'featureNotes.animalCompanionFeature', '+=', null
    );
    rules.defineRule('companionMasterLevel', 'levels.Druid', '+=', null);
    rules.defineRule('druidTurningLevel',
      'levels.Druid', '+=', 'source / 2',
      'levels.Spiritual Channeler', '*', '2'
    );
    rules.defineRule('featureNotes.findTheWayFeature',
      '', '=', '"Normal movement through undergrowth"',
      'features.Woodland Stride', '=', '"Untrackable outdoors"',
      'features.Trackless Step', '=', '"Continuous <i>Pass Without Trace</i>"'
    );
    rules.defineRule('featureNotes.animalCompanionFeature',
      'levels.Druid', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.communeWithNatureFeature',
      'levels.Druid', '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('magicNotes.druidSpellEnergy', 'levels.Druid', '=', null);
    rules.defineRule
      ('magicNotes.druidSpellsKnown', 'levels.Druid', '=', null);
    rules.defineRule('spellEnergy', 'magicNotes.druidSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.druidSpellsKnown', '+', null);
    rules.defineRule('turnNature.level', 'druidTurningLevel', '+=', null);
    rules.defineChoice('spells', "Peasant's Rest(D1 Conj)");
    rules.defineChoice('spells', 'Fey Fire(D2 Conj)');

  } else if(klass == 'Elven Raider') {

    notes = [
      'combatNotes.closeCombatArcheryFeature:' +
        'Use bow w/out foe AOO; use arrows as light weapons',
      'combatNotes.disarmingShotFeature:' +
        'Ranged touch attack to attempt disarm',
      'combatNotes.improvedSneakAttackFeature:' +
        "Ranged sneak attack up to %V'",
      'combatNotes.intimidatingShotFeature:' +
        'Intimidate check after attack w/bonus of 1/2 damage',
      'combatNotes.leafReaderFeature:' +
        'DC 10 Spot check to eliminate vegetation concealment',
      'combatNotes.meticulousAimFeature:' +
        '+1 critical range for every 2 rounds aiming; +%V max',
      'combatNotes.rangedSneakAttackFeature:' +
        "%Vd6 extra damage when surprising or flanking w/in 30'",
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    // Make sure Weapon Focus (Composite Longbow) and Weapon Focus (Longbow)
    // are defined to meet prerequisite
    var subfeats = {'Weapon Focus' : 'Composite Longbow/Longbow'};
    SRD35.featRules(rules, ['Weapon Focus:'], subfeats);
    rules.defineRule('combatNotes.improvedSneakAttackFeature',
      'levels.Elven Raider', '+=', '30 + Math.floor((source + 1) / 3) * 15'
    );
    rules.defineRule('combatNotes.meticulousAimFeature',
      'levels.Elven Raider', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.rangedSneakAttackFeature',
      'levels.Elven Raider', '+=', 'Math.floor((source + 2) / 3)',
      'combatNotes.sneakAttackFeature', '+', null
    );

  } else if(klass == 'Freerider') {

    feats = [
      'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
      'Trample', 'Weapon Focus (Composite Longbow)',
      'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
      'Weapon Specialization (Composite Longbow)',
      'Weapon Specialization (Sarcosan Lance)',
      'Weapon Specialization (Scimitar)'
    ];
    notes = [
      'combatNotes.devastatingMountedAssaultFeature:' +
        'Full attack after mount moves',
      'combatNotes.deftDodgingFeature:' +
        '+4 self/mount AC on full round mounted move',
      'combatNotes.dismountingCutFeature:' +
        'Trip attack w/weapon to dismount opponent',
      'combatNotes.erraticAttackFeature:' +
        '+2 self/mount AC when either attacks',
      'combatNotes.hitAndRunFeature:' +
        'Move away from foe after attack w/out foe AOO',
      'combatNotes.improvedMountedAssaultFeature:' +
        'No penalty for additional mounted attacks',
      'combatNotes.sweepingStrikeFeature:' +
        'Attack all threatened foes during mount move',
      'combatNotes.wheelAboutFeature:' +
        'May make 90 degree turn during mounted charge',
      'featureNotes.specialMountFeature:Special bond/abilities',
      'featureNotes.spurOnFeature:' +
        'Double mount speed during charge/double move',
      'skillNotes.horseLordFeature:+1 Handle Animal (horse)/Ride (horseback)',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
      'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
      'Trample', 'Weapon Focus (Composite Longbow)',
      'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
      'Weapon Specialization (Composite Longbow)',
      'Weapon Specialization (Sarcosan Lance)',
      'Weapon Specialization (Scimitar)'
    // Make sure class-associated subfeats are defined
    var subfeats = {
      'Skill Focus':'Ride',
      'Weapon Focus':'Composite Longbow/Sarcosan Lance/Scimitar',
      'Weapon Specialization':'Composite Longbow/Sarcosan Lance/Scimitar'
    };
    SRD35.featRules(
      rules,
      ['Skill Focus:', 'Weapon Focus:', 'Weapon Specialization:'],
      subfeats
    );
    rules.defineRule('combatNotes.improvedMountedAssaultFeature',
      'feats.Devastating Mounted Assault', '?', null
    );
    rules.defineRule('featCount.Freerider',
      'levels.Freerider', '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('selectableFeatureCount.Freerider',
      'levels.Freerider', '=', 'Math.floor((source + 1) / 3)'
    );

  } else if(klass == 'Haunted One') {

    notes = [
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.ghostSightFeature:<i>See Invisible</i> at will',
      'magicNotes.seanceFeature:' +
        '<i>Augury</i>/<i>Legend Lore</i> via spirits %V/day',
      'magicNotes.spellFocus(Divination)Feature:+1 DC on Divination spells',
      'magicNotes.spellFocus(Necromancy)Feature:+1 DC on Necromancy spells',
      'magicNotes.spiritcraftFeature:' +
        'Divination/Necromancy spell energy cost reduced by 1',
      'magicNotes.spiritManipulationFeature:' +
        '%V chosen Divination/Necromancy spells as spell-like ability 1/day',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule
      ('magicNotes.hauntedOneSpellEnergy', 'levels.Haunted One', '=', null);
    rules.defineRule
      ('magicNotes.hauntedOneSpellsKnown', 'levels.Haunted One', '=', null);
    rules.defineRule('magicNotes.seanceFeature',
      'levels.Haunted One', '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.spiritManipulationFeature',
      'levels.Haunted One', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.hauntedOneSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.hauntedOneSpellsKnown', '+', null);

  } else if(klass == 'Insurgent Spy') {

    notes = [
      'combatNotes.sneakAttackFeature:' +
        '%Vd6 HP extra when surprising or flanking',
      'featureNotes.concealAuraFeature:Conceal %V magical auras',
      'skillNotes.shadowContactsFeature:' +
        'Gather Information to obtain %V favor from Shadow minion',
      'skillNotes.shadowSpeakFeature:' +
        '+%V Bluff, Diplomacy, Intimidate, Sense Motive w/Shadow minions',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('combatNotes.sneakAttackFeature',
      'levels.Insurgent Spy', '+=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule
      ('featureNotes.concealAuraFeature', 'levels.Insurgent Spy', '=', null);
    rules.defineRule('skillNotes.shadowContactsFeature',
      'levels.Insurgent Spy', '=',
      'source >= 5 ? "incredible" : source >= 3 ? "major" : "minor"'
    );
    rules.defineRule('skillNotes.shadowSpeakFeature',
      'levels.Insurgent Spy', '=', 'Math.floor(source / 2)'
    );

  } else if(klass == 'Smuggler') {

    notes = [
      'magicNotes.disguiseContrabandFeature:' +
        "<i>Misdirection</i> on 1' cu/level of contraband 1 hour/level",
      'magicNotes.moreMystifyingSpeechFeature:Mystifying Speech 2/day',
      'magicNotes.mystifyingSpeechFeature:DC %V <i>Modify Memory</i>',
      'saveNotes.dominantWillFeature:' +
        '+%V Will vs. detection/compulsion spells to reveal activities',
      'saveNotes.slipperyMindFeature:Second save vs. enchantment',
      'skillNotes.informationNetworkFeature:' +
        'One hour to take %V on Gather Information in new locale',
      "skillNotes.smuggler'sTradeFeature:" +
        '+%V/take 10 on Bluff, Disguise, Forgery, Gather Information when ' +
        'smuggling',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('casterLevels.Smuggler',
      'levels.Smuggler', '?', 'source >= 5',
      'level', '=', null
    );
    rules.defineRule('casterLevels.Ch', 'casterLevels.Smuggler', '=', null);
    rules.defineRule('magicNotes.mystifyingSpeechFeature',
      'levels.Smuggler', '=', '10 + source',
      'charismaModifier', '+', null
    );
    rules.defineRule('saveNotes.dominantWillFeature',
      'levels.Smuggler', '=', 'source >= 6 ? 4 : 2'
    );
    rules.defineRule('skillNotes.informationNetworkFeature',
      'levels.Smuggler', '=', 'source >= 7 ? 20 : 10'
    );
    rules.defineRule("skillNotes.smuggler'sTradeFeature",
      'levels.Smuggler', '=', 'Math.floor((source + 1) / 2) * 2'
    );

  } else if(klass == 'Warrior Arcanist') {

    notes = [
      'magicNotes.armoredCastingFeature:Reduce arcane casting penalty by %V%',
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.channeledArmorClassFeature:' +
        'Use 1 spell energy point to gain +%V AC for 1 round',
      'magicNotes.channeledAttackFeature:' +
        'Use 1 spell energy point to gain +%V attack for 1 round',
      'magicNotes.channeledDamageFeature:' +
        'Use 1 spell energy point to gain +%V damage for 1 round',
      'magicNotes.meleeCasterFeature:Deliver spell via weapon',
      'magicNotes.regenerativeStrikeFeature:' +
        'Recover spell energy equal to 2*weapon multiplier on critical hit',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.armoredCastingFeature', '+', '-source',
      null, '^', '0'
    );
    rules.defineRule('magicNotes.armoredCastingFeature',
      'levels.Warrior Arcanist', '=', 'Math.floor((source + 1) / 2) * 5'
    );
    rules.defineRule('magicNotes.channeledArmorClassFeature',
      'level', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.channeledAttackFeature',
      'level', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.channeledDamageFeature',
      'level', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.warriorArcanistSpellEnergy',
      'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.warriorArcanistSpellsKnown',
      'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.warriorArcanistSpellEnergy', '+', null);
    rules.defineRule('spellsKnownBonus',
      'magicNotes.warriorArcanistSpellsKnown', '+', null
    );

  } else if(klass == 'Whisper Adept') {

    notes = [
      'combatNotes.whisperInitiativeFeature:+2 Initiative',
      'combatNotes.whisperSurpriseFeature:Cannot be surprised',
      'featureNotes.whisperSenseFeature:No wisdom check to sense voices',
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.fellTouchFeature:Prevent fallen from becoming Fell/Lost',
      'magicNotes.strengthOfTheWoodFeature:' +
        'Recover 1 spell energy point/hour while inside tree',
      'magicNotes.treeMeldFeature:Merge into tree',
      'magicNotes.whisperClairaudienceFeature:<i>Clairaudience</i> w/in wood',
      'magicNotes.whisperClairvoyanceFeature:<i>Clairvoyance</i> w/in wood',
      'magicNotes.whisperCommuneFeature:<i>Commune With Nature</i> w/in wood',
      "saveNotes.whisper'sWardFeature:Immune to mind-affecting effects",
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule
      ('initiative', 'combatNotes.whisperInitiativeFeature', '+', '2');
    rules.defineRule('magicNotes.whisperAdeptSpellEnergy',
      'levels.Whisper Adept', '=', null
    );
    rules.defineRule('magicNotes.whisperAdeptSpellsKnown',
      'levels.Whisper Adept', '=', null
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.whisperAdeptSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.whisperAdeptSpellsKnown', '+', null);

  } else if(klass == 'Wizard') {

    notes = [
      'featureNotes.efficientStudyFeature:' +
        'XP cost for learning spells/creating magic items reduced by %V%',
      'magicNotes.artOfMagicFeature:+1 character level for max spell level',
      'magicNotes.wizardcraftFeature:' +
        'Prepare spells ahead of time for half energy cost',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('featCount.Spellcasting',
      'levels.Wizard', '+=', 'source<4 ? null : Math.floor((source - 1) / 3)'
    );
    rules.defineRule('featCount.Wizard',
      'levels.Wizard', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('featureNotes.efficientStudyFeature',
      'levels.Wizard', '=', 'Math.floor((source + 1) / 3) * 10'
    );
    rules.defineRule
      ('magicNotes.wizardSpellEnergy', 'levels.Wizard', '=', null);
    rules.defineRule
      ('magicNotes.wizardSpellsKnown', 'levels.Wizard', '=', null);
    rules.defineRule
      ('spellEnergy', 'magicNotes.wizardSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.wizardSpellsKnown', '+', null);

  } else if(klass == 'Wogren Rider') {

    notes = [
      'combatNotes.coordinatedAttackFeature:' +
        'Rider/mount +2 attack on same target when other hits',
      'combatNotes.improvedMountedArcheryFeature:' +
        'No ranged attack penalty when mounted/mounted Rapid Shot',
      'combatNotes.improvedMountedCombatFeature:' +
        'Use Mounted Combat additional %V times/round',
      'combatNotes.improvedRide-ByAttackFeature:Charge in any direction',
      'combatNotes.improvedSpiritedChargeFeature:' +
        'Improved Critical w/charging weapon',
      'combatNotes.improvedTrampleFeature:No foe AOO during overrun',
      'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
      'combatNotes.ride-ByAttackFeature:Move before and after mounted attack',
      'combatNotes.speedMountFeature:Dis/mount as free action',
      'combatNotes.spiritedChargeFeature:' +
        'x2 damage (x3 lance) from mounted charge',
      'combatNotes.trampleFeature:' +
        'Mounted overrun unavoidable, bonus hoof attack',
      'combatNotes.wogrenDodgeFeature:+2 AC during mounted move',
      'featureNotes.blindsenseFeature:' +
        "Other senses allow detection of unseen objects w/in 30'",
      'featureNotes.specialMountFeature:Special bond/abilities',
      "featureNotes.wogren'sSightFeature:Blindsense while mounted",
      'skillNotes.mountedHideFeature:Hide while mounted',
    ];
    spellAbility = null;
    spellsKnown = null;
    spellsPerDay = null;
    rules.defineRule('combatNotes.improvedMountedCombatFeature',
      'dexterityModifier', '=', 'source > 0 ? source : 1'
    );
    rules.defineRule
      ('features.Blindsense', "features.Wogren's Sight", '=', '1');
    rules.defineRule
      ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
    rules.defineRule('selectableFeatureCount.Wogren Rider',
      'levels.Wogren Rider', '=', 'Math.floor(source / 2)'
    );

  } else
    continue;

  if(LastAge.USE_PATHFINDER) {
    notes = LastAge.SRD35ToPathfinder(notes);
    skills = LastAge.SRD35ToPathfinder(skills);
  }
  SRD35.defineClass
    (rules, klass, spellsKnown, spellsPerDay, spellAbility);
  if(feats != null) {
    for(var j = 0; j < feats.length; j++) {
      rules.defineChoice('feats', feats[j] + ':' + klass);
    }
  }

};
