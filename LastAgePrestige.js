/*
Copyright 2005, James J. Hayes

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

function MN2EPrestige() {

  if(MN2EPrestige.prestigeClassRules != null)
    MN2EPrestige.prestigeClassRules();
  var allSelectable = {};
  for(var a in MN2EPrestige.selectableFeatures) {
    var prefix = a.substring(0, 1).toLowerCase() +
                 a.substring(1).replace(/ /g, '');
    var features = MN2EPrestige.selectableFeatures[a].split('/');
    for(var i = 0; i < features.length; i++) {
      selectable = features[i];
      MN2E.defineRule('features.' + selectable,
        'selectableFeatures.' + selectable, '+=', null
      );
      allSelectable[selectable] = '';
    }
  }
  MN2E.defineChoice('selectableFeatures', ScribeUtils.getKeys(allSelectable));
  var existingSpells = MN2E.getChoices('spells');
  for(var i = 0; i < MN2EPrestige.spells.length; i++) {
    var spell = MN2EPrestige.spells[i].split(/:/);
    var name = spell[0];
    var level = spell[1];
    if(existingSpells[name] != null) {
      level = existingSpells[name] + '/' + level;
    }
    MN2E.defineChoice('spells', name + ':' + level);
  }

}

MN2EPrestige.PRESTIGE_CLASSES = [
  'Ancestral Bladebearer', 'Aradil\'s Eye', 'Avenging Knife',
  'Bane Of Legates', 'Druid', 'Elven Raider', 'Freerider', 'Haunted One',
  'Insurgent Spy', 'Smuggler', 'Warrior Arcanist', 'Whisper Adept', 'Wizard',
  'Wogren Rider'
];

// Filled in by the classes that define selectable features/spells.
MN2EPrestige.selectableFeatures = { };
MN2EPrestige.spells = [
];

MN2EPrestige.prestigeClassRules = function() {

  for(var i = 0; i < MN2EPrestige.PRESTIGE_CLASSES.length; i++) {

    var baseAttack, features, hitDie, notes, prerequisites, profArmor,
        profShield, profWeapon, saveFortitude, saveReflex, saveWill,
        skillPoints, skills, spellsKnown, spellsPerDay, spellsPerDayAbility;
    var klass = MN2EPrestige.PRESTIGE_CLASSES[i];

    if(klass == 'Ancestral Bladebearer') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Unbreakable Blade', '2:Advance Ancestral Blade',
        '3:Ancestral Watcher', '4:Immovable Blade', '5:Ancestral Advisor',
        '7:Ancestral Guide', '8:Unwavering Blade', '9:Ancestral Protector',
        '10:Awaken Ancestral Blade'
      ];
      hitDie = 10;
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
          '<i>Detect Secret Doors</i> via weapon at will',
        'magicNotes.ancestralProtectorFeature:' +
          'Continuous <i>Protection From Arrows</i> via weapon',
        'magicNotes.ancestralWatcherFeature:Weapon has continuous <i>Alarm</i>'
      ];
      prerequisites = [
        '{baseAttack} >= 6',
        '+/{^features.Weapon Focus} > 0',
        '+/{^features.Weapon Specialization} > 0'
        // Also: ancestral covenant weapon used exclusively for one level prior
      ];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_TOWER;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Climb', 'Handle Animal', 'Intimidate', 'Jump', 'Ride',
        'Speak Language', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('combatNotes.advanceAncestralBladeFeature',
        'levels.Ancestral Bladebearer', '=', 'Math.floor((source + 2) / 4)'
      );
      MN2E.defineRule('featCount',
        'featureNotes.ancestralBladebearerFeatCountBonus', '+', null
      );
      MN2E.defineRule('featureNotes.ancestralBladebearerFeatCountBonus',
        'levels.Ancestral Bladebearer', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('magicNotes.ancestralAdvisorFeature',
        'charismaModifier', '=', 'source > 1 ? source : 1'
      );

    } else if(klass == 'Aradil\'s Eye') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Alter Ego', '1:Mindbond', '2:Spy Initiate', '4:Closed Mind',
        '5:Quick Change Alter Ego', '5:Spy', '6:Hide In Plain Sight',
        '7:Slippery Mind', '8:Undetectable Alignment',
        '9:Nonmagical Alter Ego', '10:Master Spy'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.alterEgoFeature:Transform into %V alter ego',
        'featureNotes.masterSpyFeature:' +
          'Mindbond to all known Master Spies and those in homeland at will',
        'featureNotes.mindbondFeature:Telepathic link to mentor 1/day',
        'featureNotes.nonmagicalAlterEgoFeature:' +
          'Transform to alter ego as a extraordinary ability',
        'featureNotes.quickChangeAlterEgoFeature:' +
          'Change to alter ego as a full round action',
        'featureNotes.spyFeature:' +
          '%V% chance of help from d3 Aradil\'s Eyes in dire need',
        'featureNotes.spyInitiateFeature:Services from elven contacts',
        'magicNotes.undetectableAlignmentFeature:' +
          'Continuous <i>Undetectable Alignment</i>',
        'saveNotes.closedMindFeature:Second +4 Will save to reveal spy network',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.spyInitiateFeature:+%V Diplomacy (elves/allies)'
      ];
      prerequisites = [
        '{features.Inconspicuous} != null',
        '{race} == "Wood Elf"',
        '{skills.Bluff} >= 8',
        '{skills.Disguise} >= 5',
        '{skills.Gather Information} >= 8',
        '{skills.Hide} >= 8',
        '{skills.Move Silently} >= 5',
        '{skills.Sense Motive} >= 5',
        '{skills.Spot} >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 8;
      skills = [
        'Balance', 'Bluff', 'Climb', 'Decipher Script', 'Diplomacy',
        'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Listen',
        'Move Silently', 'Open Lock', 'Search', 'Sense Motive',
        'Sleight Of Hand', 'Speak Language', 'Spot', 'Survival', 'Swim',
        'Tumble', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('featureNotes.alterEgoFeature',
        'levels.Aradil\'s Eye', '=',
        'source >= 7 ? "any" : source >= 3 ? "2 selected" : "1 selected"'
      );
      MN2E.defineRule
        ('featureNotes.spyFeature', 'levels.Aradil\'s Eye', '=', 'source * 10');
      MN2E.defineRule('skillNotes.spyInitiateFeature',
        'levels.Aradil\'s Eye', '=', 'source >= 10 ? 10 : source >= 5 ? 8 : 4'
      );

    } else if(klass == 'Avenging Knife') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:The Drop', '2:Security Breach', '3:Sneak Attack', '4:Target Study',
        '5:Fast Hands', '6:Cover Story', '7:Stunning Sneak Attack',
        '8:Improved Coup De Grace', '9:Still As Stone', '10:Death Attack'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.deathAttackFeature:' +
          'DC %V save on sneak attack after 3 rounds of study or die/paralyzed',
        'combatNotes.fastHandsFeature:+4 initiative/-2 first round attack',
        'combatNotes.improvedCoupDeGraceFeature:' +
          'Max damage from standard action coup de grace',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.stunningSneakAttackFeature:' +
          'Foe DC %V on sneak attack or stunned one round 3/day',
        'combatNotes.theDropFeature:+%V attack/damage vs. flat-footed foe',
        'skillNotes.coverStoryFeature:' +
          'DC 20 Bluff four consecutive days to establish alibi',
        'skillNotes.securityBreachFeature:' +
          'Gather Information to discover chinks in site security',
        'skillNotes.stillAsStoneFeature:+10 Hide during infiltration',
        'skillNotes.targetStudyFeature:' +
          'Gather Information yields +2 attack/damage or +4 AC vs. selected foe'
      ];
      prerequisites = [
        '{alignment}.indexOf("Evil") < 0',
        '{features.Improved Initiative} != null',
        '{features.Inconspicuous} != null',
        '{features.Sneak Attack} != null',
        '{skills.Bluff} >= 5',
        '{skills.Gather Information} >= 5',
        '{skills.Hide} >= 8',
        '{skills.Move Silently} >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 6;
      skills = [
        'Balance', 'Bluff', 'Decipher Script', 'Disguise', 'Escape Artist',
        'Gather Information', 'Hide', 'Jump', 'Listen', 'Move Silently',
        'Open Lock', 'Search', 'Sense Motive', 'Speak Language', 'Spot',
        'Swim', 'Tumble', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      PH35.defineRule('combatNotes.deathAttackFeature',
        'levels.Avenging Knife', '+=', '10 + source',
        'intelligenceModifier', '+', null
      );
      MN2E.defineRule('combatNotes.sneakAttackFeature',
        'levels.Avenging Knife', '+=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('combatNotes.stunningSneakAttackFeature',
        'levels.Avenging Knife', '=', '10 + source',
        'intelligenceModifier', '+', null
      );
      MN2E.defineRule('combatNotes.theDropFeature',
        'levels.Avenging Knife', '=', 'Math.floor((source + 2) / 3)'
      );

    } else if(klass == 'Bane Of Legates') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        // TODO Improved spellcasting
        '1:Improved Spellcasting', '1:Resist Izrador\'s Will', '3:See Astirax',
        '4:Counter Izrador\'s Will', '5:Bonus Spellcasting', '6:Bind Astirax',
        '8:Conceal Magic', '10:Sundered Spirit'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'featureNotes.seeAstirax:See astirax as shadowy form',
          'Reduce energy cost of spells from %V chosen schools by 1',
        'magicNotes.bindAstiraxFeature:' +
          'Astirax w/in 60 ft Will save or bound to current form for %V hours',
        'magicNotes.concealMagicFeature:' +
          'Spells considered half level for purposes of astirax detection',
        'magicNotes.sunderedSpiritFeature:' +
          'Radiates <i>Antimagic Field</i> for divine magic',
        'magicNotes.counterIzrador\'sWillFeature:' +
          '<i>Dispel Magic</i> vs. legates',
        'magicNotes.improvedSpellcastingFeature:' +
          'Reduce energy cost of spells from %V chosen schools by 1',
        'saveNotes.resistIzrador\'sWillFeature:+10 vs. legate magic'
      ];
      prerequisites = [
        '{features.Iron Will} != null',
        '+/{^features.Magecraft} > 0',
        '{skills.Knowledge (Arcana)} >= 13',
        '{skills.Knowledge (Shadow)} >= 8',
        '{skills.Spellcraft} >= 10',
        '{spellEnergy} >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Bluff', 'Concentration', 'Gather Information', 'Handle Animal',
        'Intimidate', 'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
        'Knowledge (Engineering)', 'Knowledge (Geography)',
        'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
        'Knowledge (Nobility)', 'Knowledge (Old Gods)', 'Knowledge (Planes)',
        'Knowledge (Religion)', 'Knowledge (Shadow)', 'Knowledge (Spirits)',
        'Sense Motive', 'Spellcraft', 'Survival'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('featCount',
        'featureNotes.baneOfLegatesFeatCountBonus', '+', null,
        'featureNotes.bonusSpellcastingFeature', '+', null
      );
      MN2E.defineRule('featureNotes.baneOfLegatesFeatCountBonus',
        'levels.Bane Of Legates', '=', 'Math.floor((source + 3) / 5)'
      );
      MN2E.defineRule('featureNotes.bonusSpellcastingFeature',
        'levels.Bane Of Legates', '+=', 'Math.floor((source - 1) / 4)'
      );
      MN2E.defineRule
        ('magicNotes.bindAstiraxFeature', 'levels.Bane Of Legates', '=', null);

    } else if(klass == 'Druid') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        // TODO Improved spellcasting
        '1:Mastery Of Nature', '1:Animal Companion', '2:Druidcraft',
        '2:Nature Sense', '3:Commune With Nature', '5:Find The Way',
        '8:Venom Immunity'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.masteryOfNatureFeature:Turn animals/plants as cleric',
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'magicNotes.communeWithNatureFeature:<i>Commune With Nature</i> %V/day',
        'magicNotes.druidcraftFeature:Energy cost of Druid spells reduced by 1',
        'saveNotes.venomImmunityFeature:Immune to poisons',
        'skillNotes.natureSenseFeature:' +
          'Identify animals/plants/unsafe food/drink'
        // TODO: Find The Way: Woodland Stride, Trackless Step, Pass w/out Trace
      ];
      prerequisites = [
        '{features.Magecraft (Spiritual)} != null',
        '{features.Mastery Of Nature} != null || ' +
        '{features.Wild Empathy} != null',
        '+/{^features.Spellcasting} >= 2',
        '{skills.Knowledge (Nature)} >= 8',
        '{skills.Survival} >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Handle Animal', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (Geography)', 'Knowledge (Nature)', 'Knowledge (Spirits)',
        'Speak Language', 'Spellcraft', 'Survival'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('magicNotes.communeWithNatureFeature',
        'levels.Druid', '=', 'Math.floor(source / 3)'
      );

    } else if(klass == 'Elven Raider') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Ranged Sneak Attack', '2:Improved Sneak Attack', '3:Meticulous Aim',
        '4:Intimidating Shot', '6:Leaf Reader', '7:Disarming Shot',
        '9:Close Combat Archery'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.closeCombatArchery:' +
          'Use bow w/out foe AOO; use arrows as light weapons',
        'combatNotes.disarmingShotFeature:' +
          'Ranged touch attack to attempt disarm',
        'combatNotes.improvedSneakAttackFeature:' +
          'Ranged sneak attack up to %V ft',
        'combatNotes.intimidatingShotFeature:' +
          'Intimidate check after attack w/bonus of 1/2 damage',
        'combatNotes.leafReaderFeature:' +
          'Spot check to eliminate vegetation concealment',
        'combatNotes.meticulousFeature:' +
          '+1 critical range for every 2 rounds aiming; +%V max',
        'combatNotes.rangedSneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking w/in 30 ft',
      ];
      prerequisites = [
        '{baseAttack} >= 5',
        '{features.Point Blank Shot} != null',
        '{features.Rapid Shot} != null',
        '{features.Weapon Focus (Longbow)} != null || ' +
        '{features.Weapon Focus (Composite Longbow)} != null',
        '{race}.indexOf("Elf") >= 0',
        '{skills.Hide} >= 8',
        '{skills.Move Silently} >= 8',
        '{skills.Survival} >= 8'
      ];
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 4;
      skills = [
        'Balance', 'Climb', 'Heal', 'Hide', 'Intimidate', 'Jump', 'Listen',
        'Move Silently', 'Ride', 'Search', 'Speak Language', 'Spot',
        'Survival', 'Swim', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('combatNotes.improvedSneakAttackFeature',
        'levels.Elven Raider', '+=', '30 + Math.floor((source + 1) / 3) * 15'
      );
      MN2E.defineRule('combatNotes.meticulousFeature',
        'levels.Elven Raider', '+=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('combatNotes.rangedSneakAttackFeature',
        'levels.Elven Raider', '+=', 'Math.floor((source + 2) / 3)',
        'combatNotes.sneakAttackFeature', '+', null
      );

    } else if(klass == 'Freerider') {

      MN2EPrestige.selectableFeatures[klass] =
        'Deft Dodging/Dismounting Cut/Erratic Attack/Hit And Run/Wheel About';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Horse Lord', '1:Special Mount', '2:Mounted Maneuver', '4:Spur On',
        '7:Devastating Mounted Assault', '10:Sweeping Strike'
      ];
      hitDie = 10;
      notes = [
        // TODO No attack penalty if already has DMA feat
        'combatNotes.devastatingMountedAssaultFeature:' +
          'Full attack after mount moves',
        'combatNotes.sweepingStrikeFeature:' +
          'Attack all threatened foes during mount\'s move',
        'featureNotes.specialMountFeature:Special bond/abilities',
        'featureNotes.spurOnFeature:' +
          'Double mount speed during charge/double move',
        'skillNotes.horseLord:+1 Handle Animal (horse)/Ride (horse)'
      ];
      prerequisites = [
        '{baseAttack} >= 6',
        '{features.Mounted Combat} != null',
        '{features.Ride By Attack} != null',
        '{features.Spirited Charge} != null',
        '{race}.indexOf("Sarcosan") >= 0 || {race} == "Erenlander"',
        '{skills.Handle Animal} >= 4',
        '{skills.Ride} >= 8',
        '{skills.Survival} >= 4'
      ];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_MEDIUM;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Climb', 'Diplomacy', 'Handle Animal', 'Jump', 'Ride',
        'Speak Language', 'Spot', 'Survival', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('featCount',
        'featureNotes.freeriderFeatCountBonus', '+', null
      );
      MN2E.defineRule('featureNotes.freeriderFeatCountBonus',
        'levels.Freerider', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('selectableFeatureCount.Freerider',
        'levels.Freerider', '=', 'Math.floor((source + 1) / 3)'
      );

    } else if(klass == 'Haunted One') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        //TODO Improved spellcasting
        '1:Seance', '2:Spiritcraft', '2:Spirit Manipulation', '3:Ghost Sight',
        '5:Spell Focus (Divination)', '9:Spell Focus (Necromancy)'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.ghostSightFeature:' +
          'See invisible/incorporeal creates at will',
        'magicNotes.seanceFeature:' +
          '<i>Augury</i>/<i>Legend Lore</i> via spirits %V/day',
        'magicNotes.spellFocus(Divination)Feature:+1 DC on Divination spells',
        'magicNotes.spellFocus(Necromancy)Feature:+1 DC on Necromancy spells',
        'magicNotes.spiritcraftFeature:' +
          'Divination/Necromancy spell energy cost reduced by 1',
        'magicNotes.spiritManipulationFeature:' +
          '%V chosen Divination/Necromancy spells as spell-like ability 1/day'
      ];
      prerequisites = [
        '+/{^features.Magecraft} > 0',
        '{features.Spellcasting (Divination)} != null',
        '{features.Spellcasting (Necromancy)} != null',
        '{skills.Knowledge (Arcana)} >= 8',
        '{skills.Knowledge (Spirits)} >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Concentration', 'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
        'Knowledge (Engineering)', 'Knowledge (Geography)',
        'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
        'Knowledge (Nobility)', 'Knowledge (Old Gods)', 'Knowledge (Planes)',
        'Knowledge (Religion)', 'Knowledge (Shadow)', 'Knowledge (Spirits)',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('magicNotes.seanceFeature',
        'levels.Haunted One', '=', 'Math.floor((source + 2) / 3)'
      );
      MN2E.defineRule('magicNotes.spiritManipulationFeature',
        'levels.Haunted One', '=', 'Math.floor(source / 2)'
      );

    } else if(klass == 'Insurgent Spy') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Conceal Magic', '1:Shadow Contacts', '2:Shadow Speak',
        '3:Sneak Attack'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'featureNotes.concealMagicFeature:Conceal %V magical auras',
        'skillNotes.shadowContactsFeature:' +
          'Gather Information to obtain favor from Shadow minion',
        'skillNotes.shadowSpeakFeature:' +
          '+%V Bluff/Diplomacy/Intimidate/Sense Motive w/Shadow minions'
      ];
      prerequisites = [
        '{features.Inconspicuous} != null',
        '{skills.Bluff} >= 8',
        '{skills.Diplomacy} >= 5',
        '{skills.Gather Information} >= 8',
        '{skills.Sense Motive} >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Shadow)', 'Listen', 'Move Silently', 'Open Lock',
        'Perform (Act)', 'Perform (Comedy)', 'Perform (Dance)',
        'Perform (Keyboard)', 'Perform (Oratory)', 'Perform (Percussion)',
        'Perform (Sing)', 'Perform (String)', 'Perform (Wind)', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Speak Language', 'Spot', 'Swim',
        'Tumble', 'Use Magic Device', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('combatNotes.sneakAttackFeature',
        'levels.Insurgent Spy', '+=', 'Math.floor((source - 1) / 2)'
      );
      MN2E.defineRule
        ('featureNotes.concealMagicFeature', 'levels.Insurgent Spy', '=', null);
      MN2E.defineRule('skillNotes.shadowSpeakFeature',
        'levels.Insurgent Spy', '=', 'Math.floor(source / 2)'
      );

    } else if(klass == 'Smuggler') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Smuggler\'s Trade', '2:Dominant Will', '3:Mystifying Speech',
        '4:Information Network', '5:Disguise Contraband', '10:Slippery Mind'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.disguiseContrabandFeature:' +
          '<i>Misdirection</i> on 1 cu ft/level of contraband 1 hour/level',
        // TODO Mystifying speech 2/day @ level 7
        'magicNotes.mystifyingSpeechFeature:DC %V <i>Modify Memory</i> 1/day',
        'saveNotes.dominantWillFeature:' +
          '+%V Will vs. detection/compulsion spells to reveal activities',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.informationNetworkFeature:' +
          'One hour to take %V on Gather Information in new locale',
        'skillNotes.smuggler\'sTradeFeature:' +
          '+%V or take 10 on Bluff/Disguise/Forgery/Gather Information ' +
          'when smuggling'
      ];
      prerequisites = [
        '{features.Friendly Agent} != null',
        '{skills.Bluff} >= 8',
        '{skills.Forgery} >= 5',
        '{skills.Gather Information} >= 8',
        '{skills.Hide} >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Jump', 'Listen', 'Move Silently',
        'Open Lock', 'Perform (Act)', 'Perform (Comedy)', 'Perform (Dance)',
        'Perform (Keyboard)', 'Perform (Oratory)', 'Perform (Percussion)',
        'Perform (Sing)', 'Perform (String)', 'Perform (Wind)', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Spot', 'Swim', 'Tumble',
        'Use Magic Device', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('magicNotes.mystifyingSpeechFeature',
        'levels.Smuggler', '=', '10 + source',
        'charismaModifier', '+', null
      );
      MN2E.defineRule('saveNotes.dominantWillFeature',
        'levels.Smuggler', '=', 'source >= 6 ? 4 : 2'
      );
      MN2E.defineRule('skillNotes.informationNetworkFeature',
        'levels.Smuggler', '=', 'source >= 7 ? 20 : 10'
      );
      MN2E.defineRule('skillNotes.smuggler\'sTradeFeature',
        'levels.Smuggler', '=', 'Math.floor((source + 1) / 2) * 2'
      );

    } else if(klass == 'Warrior Arcanist') {

      // TODO Improved spellcasting
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Armored Casting', '1:Channeled Combat (Attack)',
        '4:Channeled Combat (Armor Class)', '6:Melee Caster',
        '8:Channeled Combat (Damage)', '10:Regenerative Strike'
      ];
      hitDie = 8;
      notes = [
        'magicNotes.armoredCastingFeature:Reduce arcane casting penalty by %V%',
        'magicNotes.channeledCombat(Armor Class)Feature:' +
          'Use 1 spell energy point to gain +%V AC for 1 round',
        'magicNotes.channeledCombat(Attack)Feature:' +
          'Use 1 spell energy point to gain +%V attack for 1 round',
        'magicNotes.channeledCombat(Damage)Feature:' +
          'Use 1 spell energy point to gain +%V damage for 1 round',
        'magicNotes.meleeCasterFeature:Deliver spell via weapon',
        'magicNotes.regenerativeStrikeFeature:' +
          'Recover spell energy equal to 2*weapon multiplier on critical hit'
      ];
      prerequisites = [
        '{baseAttack} >= 4',
        '+/{^features.Magecraft} > 0',
        '+/{^features.Spellcasting} != null',
        '+/{^features.Weapon Focus} >= 1',
        '{skills.Spellcraft} >= 8'
        // TODO Proficiency
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Concentration', 'Intimidate', 'Jump', 'Knowledge (Arcana)', 'Ride',
        'Speak Language', 'Spellcraft', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('magicNotes.arcaneSpellFailure',
        'magicNotes.armoredCastingFeature', '+', '-source',
        null, '^', '0'
      );
      MN2E.defineRule('magicNotes.armoredCastingFeature',
        'levels.Warrior Arcanist', '=', 'Math.floor((source + 1) / 2) * 5'
      );
      MN2E.defineRule('magicNotes.channeledCombat(Armor Class)Feature',
        'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.channeledCombat(Attack)Feature',
        'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.channeledCombat(Damage)Feature',
        'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
      );

    } else if(klass == 'Whisper Adept') {

      // TODO Improved spellcasting
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Whisper Sense', '2:Whisper Sense (Initiative)', '3:Fell Touch',
        '4:Whisper Sense (Surprise)', '5:Tree Meld',
        '6:Whisper Sense (Clairaudience)', '7:Strength Of The Wood',
        '8:Whisper Sense (Clairvoyance)', '9:Whisper\'s Ward',
        '10:Whisper Sense (Commune)'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.whisperSense(Initiative)Feature:+2 Initiative',
        'combatNotes.whisperSense(Surprise)Feature:Cannot be surprised',
        'featureNotes.whisperSenseFeature:No wisdom check to sense voices',
        'magicNotes.fellTouchFeature:Prevent fallen from becoming Fell/Lost',
        'magicNotes.strengthOfTheWoodFeature:' +
          'Recover 1 spell energy point/round while inside tree',
        'magicNotes.treeMeldFeature:Merge into tree',
        'magicNotes.whisperSense(Clairaudience)Feature:' +
          '<i>Clairaudience</i> w/in wood',
        'magicNotes.whisperSense(Clairvoyance)Feature:' +
          '<i>Clairvoyance</i> w/in wood',
        'magicNotes.whisperSense(Commune)Feature:' +
          '<i>Commune With Nature</i> w/in wood',
        'saveNotes.whisper\'sWardFeature:Immune to mind-affecting effects'
      ];
      prerequisites = [
        '+/{^features.Magecraft} >= 1',
        '+/{^features.Spellcraft} >= 2',
        '{race}.indexOf("Elf") >= 0',
        '{skills.Knowledge (Nature)} >= 8',
        '{skills.Knowledge (Spirits)} >= 10',
        '{skills.Survival} >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Handle Animal', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (Dungeoneering)', 'Knowledge (Engineering)',
        'Knowledge (Geography)', 'Knowledge (History)', 'Knowledge (Local)',
        'Knowledge (Nature)', 'Knowledge (Nobility)', 'Knowledge (Old Gods)',
        'Knowledge (Planes)', 'Knowledge (Religion)', 'Knowledge (Shadow)',
        'Knowledge (Spirits)', 'Speak Language', 'Spellcraft', 'Survival'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule
        ('initiative', 'combatNotes.whisperSense(Initiative)Feature', '+', '2');

    } else if(klass == 'Wizard') {

      // TODO Improved spellcasting
      MN2EPrestige.selectableFeatures[klass] =
        'Spellcasting (Abjuration)/Spellcasting (Conjuration)/' +
        'Spellcasting (Divination)/Spellcasting (Enchantment)/' +
        'Spellcasting (Evocation)/Spellcasting (Illusion)/' +
        'Spellcasting (Necromancy)/Spellcasting (Transmutation)';
      baseAttack = PH35.ATTACK_BONUS_POOR;
      features = [
        '1:Wizardcraft', '2:Efficient Study'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.efficientStudyFeature:' +
          'XP cost for learning spells/creating magic items reduced by %V%',
        'magicNotes.wizardcraftFeature:' +
          'Prepare spells ahead of time for half energy cost'
      ];
      prerequisites = [
        // TODO 1 item creation, 1 metamagic feat
        '{features.Magecraft (Hermetic)} != null',
        '+/{^features.Spellcraft} >= 2',
        '{skills.Knowledge (Arcana)} >= 10',
        '{skills.Spellcraft} >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Concentration', 'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
        'Knowledge (Engineering)', 'Knowledge (Geography)',
        'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
        'Knowledge (Nobility)', 'Knowledge (Old Gods)', 'Knowledge (Planes)',
        'Knowledge (Religion)', 'Knowledge (Shadow)', 'Knowledge (Spirits)',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('featureNotes.efficientStudyFeature',
        'levels.Wizard', '=', 'Math.floor((source + 1) / 3) * 10'
      );
      MN2E.defineRule
        ('featCount', 'featureNotes.wizardFeatCountBonus', '+', null);
      MN2E.defineRule('featureNotes.wizardFeatCountBonus',
        'levels.Wizard', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('selectableFeatureCount.Wizard',
        'levels.Wizard', '=', 'Math.floor((source - 1) / 3)'
      );

    } else if(klass == 'Wogren Rider') {

      MN2EPrestige.selectableFeatures[klass] =
        'Improved Mounted Archery/Improved Mounted Combat/' +
        'Improved Ride By Attack/Improved Spirited Charge/Improved Trample/'
        'Ride By Attack/Trample';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Coordinated Attack', '1:Special Mount', '3:Speed Mount',
        '5:Mounted Hide', '7:Wogren Dodge', '9:Wogren\'s Sight'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.coordinatedAttackFeature:' +
          'Rider/mount +2 attack on same target when other hits',
        'combatNotes.improvedMountedArcheryFeature:' +
          'No ranged attack penalty when mounted/mounted Rapid Shot',
        'combatNotes.improvedMountedCombatFeature:Mounted Combat %V/round',
        'combatNotes.improvedRideByAttackFeature:Charge in any direction',
        'combatNotes.improvedTrampleFeature:No foe AOO during overrun',
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'combatNotes.rideByAttackFeature:Move before and after mounted attack',
        'combatNotes.speedMountFeature:Dis/mount as free action',
        'combatNotes.trampleFeature:' +
          'Mounted overrun unavoidable/bonus hoof attack',
        'combatNotes.wogrenDodgeFeature:+2 AC during mounted move',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.specialMountFeature:Special bond/abilities',
        'featureNotes.wogren\'sSightFeature:Blindsense while mounted',
        'skillNotes.mountedHideFeature:Hide while mounted'
      ];
      prerequisites = [
        '{features.Mounted Archery} != null',
        '{features.Mounted Combat} != null',
        '{race}.indexOf("Halfling") >= 0',
        '{skills.Ride} >= 8',
        '{skills.Survival} >= 4'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 4;
      skills = [
        'Climb', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Listen',
        'Move Silently', 'Ride', 'Speak Language', 'Spot', 'Survival', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('combatNotes.improvedMountedCombatFeature',
        'dexterityModifier', '=', null
      );
      MN2E.defineRule
        ('features.Blindsense', 'features.Wogren\'s Sight', '=', '1');
      MN2E.defineRule
        ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
      MN2E.defineRule('selectableFeatureCount.Wogren Rider',
        'levels.Wogren Rider', '=', 'Math.floor(source / 2)'
      );

    } else
      continue;

    MN2E.defineClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites, spellsKnown, spellsPerDay, spellsPerDayAbility);
    if(notes != null)
      MN2E.defineNote(notes);

  }

};
