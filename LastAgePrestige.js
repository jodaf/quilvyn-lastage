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
  'Insurgent Spy', 'Smuggler', 'Warrior Alchemist', 'Whisper Adept', 'Wizard',
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
      MN2E.defineRule('combatNotesadvanceAncestralBladeFeature',
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
        'Sleight Of Hand', 'Speak Language', 'Spot', 'Survivial', 'Swim',
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
        '{features.Magecraft} != null',
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
        '{feats.Point Blank Shot} != null',
        '{feats.Rapid Shot} != null',
        '{feats.Weapon Focus (Longbow)} != null || ' +
        '{feats.Weapon Focus (Componsite Longbow)} != null',
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

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Haunted One') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Insurgent Spy') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Smuggler') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Warrior Alchemist') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Whisper Adept') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Wizard') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

    } else if(klass == 'Wogren Rider') {

      continue; // TODO
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Art Of Magic', '1:Bonus Spell Energy', '2:Bonus Spellcasting',
        '2:Bonus Spells', '2:Summon Familiar', '4:Arcane Feat Bonus'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.arcaneFeatBonusFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Ride', 'Search',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;

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
