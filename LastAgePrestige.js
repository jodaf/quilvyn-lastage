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

/*
 * This module loads the rules from the Midnight Second Edition core rule book,
 * Chapter 4, Prestige Classes.  The MN2EPrestige.PRESTIGE_CLASSES constant
 * fields can be manipulated in order to trim the choices offered.
 */
function MN2EPrestige() {
  if(MN2EPrestige.prestigeClassRules != null) MN2EPrestige.prestigeClassRules();
}

MN2EPrestige.PRESTIGE_CLASSES = [
  'Ancestral Bladebearer', 'Aradil\'s Eye', 'Avenging Knife',
  'Bane Of Legates', 'Druid', 'Elven Raider', 'Freerider', 'Haunted One',
  'Insurgent Spy', 'Smuggler', 'Warrior Arcanist', 'Whisper Adept', 'Wizard',
  'Wogren Rider'
];

MN2EPrestige.prestigeClassRules = function() {

  for(var i = 0; i < MN2EPrestige.PRESTIGE_CLASSES.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellsKnown, spellsPerDay, spellsPerDayAbility;
    var klass = MN2EPrestige.PRESTIGE_CLASSES[i];

    if(klass == 'Ancestral Bladebearer') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = null;
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
          '<i>Detect Secret Doors</i> w/in 10 ft via weapon at will',
        'magicNotes.ancestralProtectorFeature:' +
          'Continuous <i>Protection From Arrows</i> via weapon',
        'magicNotes.ancestralWatcherFeature:Weapon has continuous <i>Alarm</i>',
        'validationNotes.ancestralBladebearerCombat:' +
          'Requires base attack 6/use weapon exclusively for prior level',
        'validationNotes.ancestralBladebearerFeatures:' +
          'Requires Weapon Focus/Weapon Specialization'
      ];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_TOWER;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatues = null;
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
      MN2E.defineRule('featCount.Fighter Bonus',
        'levels.Ancestral Bladebearer', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('magicNotes.ancestralAdvisorFeature',
        'charismaModifier', '=', 'source > 1 ? source : 1'
      );
      MN2E.defineRule('validationNotes.ancestralBladebearerCombat',
        'levels.Ancestral Bladebearer', '=', '-1',
        'baseAttack', '+', 'source > 6 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.ancestralBladebearerFeatures',
        'levels.Ancestral Bladebearer', '=', '-2',
        'subfeatCount.Weapon Focus', '+', 'source >= 1 ? 1 : null',
        'subfeatCount.Weapon Specialization', '+', 'source >= 1 ? 1 : null'
      );

    } else if(klass == 'Aradil\'s Eye') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Alter Ego', '1:Mindbond', '2:Spy Initiate', '4:Closed Mind',
        '5:Quick Alteration', '5:Spy', '6:Hide In Plain Sight',
        '7:Slippery Mind', '8:Undetectable Alignment',
        '9:Nonmagical Alteration', '10:Master Spy'
      ];
      hitDie = 6;
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
          '%V% chance of help from d3 Aradil\'s Eyes in dire need',
        'featureNotes.spyInitiateFeature:Services from elven contacts',
        'magicNotes.undetectableAlignmentFeature:' +
          'Continuous <i>Undetectable Alignment</i>',
        'saveNotes.closedMindFeature:Second +4 Will save to reveal spy network',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.spyInitiateFeature:+%V Diplomacy (elves/allies)',
        'validationNotes.aradil\'sEyeFeatures:Requires Inconspicuous',
        'validationNotes.aradil\'sEyeRace:Requires Wood Elf',
        'validationNotes.aradil\'sEyeSkills:Requires Bluff 8/Disguise 5/' +
          'Gather Information 8/Hide 8/Move Silently 5/Sense Motive 5/Spot 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
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
      MN2E.defineRule('validationNotes.aradil\'sEyeFeatures',
        'levels.Aradil\'s Eye', '=', '-1',
        'features.Inconspicuous', '+', '1'
      );
      MN2E.defineRule('validationNotes.aradil\'sEyeRace',
        'levels.Aradil\'s Eye', '=', '-1',
        'race', '+', 'source == "Wood Elf" ? 1 : null'
      );
      MN2E.defineRule('validationNotes.aradil\'sEyeSkills',
        'levels.Aradil\'s Eye', '=', '-7',
        'skills.Bluff', '+', 'source >= 8 ? 1 : null',
        'skills.Disguise', '+', 'source >= 5 ? 1 : null',
        'skills.Gather Informaiton', '+', 'source >= 8 ? 1 : null',
        'skills.Hide', '+', 'source >= 8 ? 1 : null',
        'skills.Move Silently', '+', 'source >= 5 ? 1 : null',
        'skills.Sense Motive', '+', 'source >= 5 ? 1 : null',
        'skills.Spot', '+', 'source >= 5 ? 1 : null'
      );

    } else if(klass == 'Avenging Knife') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
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
          'Gather Information yields +2 attack/damage or +4 AC vs. chosen foe',
        'validationNotes.avengingKnifeAlignment:Requires non-Evil',
        'validationNotes.avengingKnifeFeatures:' +
          'Requires Improved Initiative/Inconspicuous/Sneak Attack',
        'validationNotes.avengingKnifeSkills:' +
          'Requires Bluff 5/Gather Information 5/Hide 8/Move Silently 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatues = null;
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
      MN2E.defineRule('combatNotes.deathAttackFeature',
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
      MN2E.defineRule('validationNotes.avengingKnifeAlignment',
        'levels.Avenging Knife', '=', '-1',
        'alignment', '+', '!source.match(/Evil/) ? 1 : null'
      );
      MN2E.defineRule('validationNotes.avengingKnifeFeatures',
        'levels.Avenging Knife', '=', '-3',
        'features.Improved Initiative', '+', '1',
        'features.Inconspicuous', '+', '1',
        'features.Sneak Attack', '+', '1'
      );
      MN2E.defineRule('validationNotes.avengingKnifeSkills',
        'levels.Avenging Knife', '=', '-4',
        'skills.Bluff', '+', 'source >= 5 ? 1 : null',
        'skills.Gather Information', '+', 'source >= 5 ? 1 : null',
        'skills.Hide', '+', 'source >= 8 ? 1 : null',
        'skills.Move Silently', '+', 'source >= 8 ? 1 : null'
      );

    } else if(klass == 'Bane Of Legates') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Resist Izrador\'s Will', '3:See Astirax',
        '4:Counter Izrador\'s Will', '5:Bonus Spellcasting', '6:Bind Astirax',
        '8:Conceal Magic', '10:Sundered Spirit'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.seeAstiraxFeature:See astirax as shadowy form',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bindAstiraxFeature:' +
          'Astirax w/in 60 ft Will save or bound to current form for %V hours',
        'magicNotes.concealMagicFeature:' +
          'Spells considered half level for purposes of astirax detection',
        'magicNotes.sunderedSpiritFeature:' +
          'Radiates <i>Antimagic Field</i> for divine magic',
        'magicNotes.counterIzrador\'sWillFeature:' +
          '<i>Dispel Magic</i> vs. legates',
        'saveNotes.resistIzrador\'sWillFeature:+10 vs. legate magic',
        'validationNotes.baneOfLegatesFeatures:Requires Iron Will/Magecraft',
        'validationNotes.baneOfLegatesMagic:Requires spell energy 10',
        'validationNotes.baneOfLegatesSkills:' +
          'Requires Knowledge (Arcana) 13/Knowledge (Shadow) 8/Spellcraft 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
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
      MN2E.defineRule('featCount.Spellcasting',
        'levels.Bane Of Legates', '+=', 'Math.floor((source - 1) / 4)'
      );
      MN2E.defineRule('featCount.Wizard Bonus',
        'levels.Bane Of Legates', '=', 'Math.floor((source + 3) / 5)'
      );
      MN2E.defineRule('magicNotes.baneOfLegatesSpellEnergy',
        'levels.Bane Of Legates', '=', null
      );
      MN2E.defineRule
        ('magicNotes.bindAstiraxFeature', 'levels.Bane Of Legates', '=', null);
      MN2E.defineRule('magicNotes.baneOfLegatesSpellsKnown',
        'levels.Bane Of Legates', '=', null
      );
      MN2E.defineRule
        ('spellEnergy', 'magicNotes.baneOfLegatesSpellEnergy', '+', null);
      MN2E.defineRule
        ('spellsKnownBonus', 'magicNotes.baneOfLegatesSpellsKnown', '+', null);
      MN2E.defineRule('validationNotes.baneOfLegatesFeatures',
        'levels.Bane Of Legates', '=', '-2',
        'features.Iron Will', '+', '1',
        'subfeatCount.Magecraft', '+', 'source >= 1 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.baneOfLegatesMagic',
        'levels.Bane Of Legates', '=', '-1',
        'spellEnergy', '+', 'source >= 10 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.baneOfLegatesSkills',
        'levels.Bane Of Legates', '=', '-3',
        'skills.Knowledge (Arcana)', '+', 'source >= 13 ? 1 : null',
        'skills.Knowledge (Shadow)', '+', 'source >= 8 ? 1 : null',
        'skills.Spellcraft', '+', 'source >= 10 ? 1 : null'
      );

    } else if(klass == 'Druid') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Mastery Of Nature', '1:Animal Companion',
        '2:Druidcraft', '2:Nature Sense', '3:Commune With Nature',
        '5:Find The Way', '8:Venom Immunity'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.masteryOfNatureFeature:Turn animals/plants as cleric',
        'featureNotes.animalCompanionFeature:' +
          'Special bond/abilities w/up to %V animals',
        'featureNotes.findTheWayFeature:%V',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.communeWithNatureFeature:<i>Commune With Nature</i> %V/day',
        'magicNotes.druidcraftFeature:Energy cost of Druid spells reduced by 1',
        'saveNotes.venomImmunityFeature:Immune to organic poisons',
        'skillNotes.natureSenseFeature:' +
          'Identify animals/plants/unsafe food/drink',
        'validationNotes.druidFeatures:' +
           'Requires Magecraft (Spiritual)/Mastery Of Nature/Spellcasting/' +
           'Wild Empathy',
        'validationNotes.druidSkills:Requires Knowledge (Nature) 8/Survival 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
      skillPoints = 4;
      skills = [
        'Concentration', 'Handle Animal', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (Geography)', 'Knowledge (Nature)', 'Knowledge (Spirits)',
        'Speak Language', 'Spellcraft', 'Survival'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('druidTurningLevel',
        'levels.Druid', '+=', 'source / 2',
        'levels.Charismatic Channeler', '*', '2',
        'levels.Hermetic Channeler', '*', '2',
        'levels.Spiritual Channeler', '*', '2'
      );
      MN2E.defineRule('featureNotes.findTheWayFeature',
        '', '=', '"Normal movement through undergrowth"',
        'features.Woodland Stride', '=', '"Untrackable outdoors"',
        'features.Trackless Step', '=', '"Continuous <i>Pass Without Trace</i>"'
      );
      MN2E.defineRule('featureNotes.animalCompanionFeature',
        'levels.Druid', '+=', 'Math.floor((source + 2) / 3)'
      );
      MN2E.defineRule('magicNotes.communeWithNatureFeature',
        'levels.Druid', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('magicNotes.druidSpellEnergy', 'levels.Druid', '=', null);
      MN2E.defineRule('magicNotes.druidSpellsKnown', 'levels.Druid', '=', null);
      MN2E.defineRule('spellEnergy', 'magicNotes.druidSpellEnergy', '+', null);
      MN2E.defineRule
        ('spellsKnownBonus', 'magicNotes.druidSpellsKnown', '+', null);
      MN2E.defineRule('turningLevel', 'druidTurningLevel', '+=', null);
      MN2E.defineRule('validationNotes.druidFeatures',
        'levels.Druid', '=', '-4',
        'features.Magecraft (Spiritual)', '+', '1',
        'features.Mastery Of Nature', '+', '1',
        'features.Wild Empathy', '+', '1',
        'subfeatCount.Spellcasting', '+', 'source >= 1 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.druidSkills',
        'levels.Druid', '=', '-2',
        'skills.Knowledge (Nature)', '+', 'source >= 8 ? 1 : null',
        'skills.Survival', '+', 'source >= 8 ? 1 : null'
      );

    } else if(klass == 'Elven Raider') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Ranged Sneak Attack', '2:Improved Sneak Attack', '3:Meticulous Aim',
        '4:Intimidating Shot', '6:Leaf Reader', '7:Disarming Shot',
        '9:Close Combat Archery'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.closeCombatArcheryFeature:' +
          'Use bow w/out foe AOO; use arrows as light weapons',
        'combatNotes.disarmingShotFeature:' +
          'Ranged touch attack to attempt disarm',
        'combatNotes.improvedSneakAttackFeature:' +
          'Ranged sneak attack up to %V ft',
        'combatNotes.intimidatingShotFeature:' +
          'Intimidate check after attack w/bonus of 1/2 damage',
        'combatNotes.leafReaderFeature:' +
          'DC 10 Spot check to eliminate vegetation concealment',
        'combatNotes.meticulousAimFeature:' +
          '+1 critical range for every 2 rounds aiming; +%V max',
        'combatNotes.rangedSneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking w/in 30 ft',
        'validationNotes.elvenRaiderCombat:Requires base attack 5',
        'validationNotes.elvenRaiderFeatures:Requires Point Blank Shot/' +
          'Rapid Shot/Weapon Focus (Composite Longbow/Longbow)',
        'validationNotes.elvenRaiderElf:Requires Elf',
        'validationNotes.elvenRaiderSkills:' +
          'Requires Hide 8/Move Silently 8/Survival 8'
      ];
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatues = null;
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
      MN2E.defineRule('combatNotes.meticulousAimFeature',
        'levels.Elven Raider', '+=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('combatNotes.rangedSneakAttackFeature',
        'levels.Elven Raider', '+=', 'Math.floor((source + 2) / 3)',
        'combatNotes.sneakAttackFeature', '+', null
      );
      MN2E.defineRule('validationNotes.elvenRaiderCombat',
        'levels.Elven Raider', '=', '-1',
        'baseAttack', '+', 'source >= 5 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.elvenRaiderFeatures',
        'levels.Elven Raider', '=', '-3',
        'features.Point Blank Shot', '+', '1',
        'features.Rapid Shot', '+', '1',
        'features.Weapon Focus (Composite Longbow)', '+', '1',
        'features.Weapon Focus (Longbow)', '+', '1',
        '', 'v', '0'
      );
      MN2E.defineRule('validationNotes.elvenRaiderRace',
        'levels.Elven Raider', '=', '-1',
        'race', '+', 'source.match(/Elf$/) ? 1 : null'
      );
      MN2E.defineRule('validationNotes.elvenRaiderSkills',
        'levels.Elven Raider', '=', '-3',
        'skills.Hide', '+', 'source >= 8 ? 1 : null',
        'skills.Move Silently', '+', 'source >= 8 ? 1 : null',
        'skills.Survival', '+', 'source >= 8 ? 1 : null'
      );

    } else if(klass == 'Freerider') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = [
        'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
        'Trample', 'Weapon Focus (Composite Longbow)',
        'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
        'Weapon Specialization (Composite Longbow)',
        'Weapon Specialization (Sarcosan Lance)',
        'Weapon Specialization (Scimitar)'
      ];
      features = [
        '1:Horse Lord', '1:Special Mount', '2:Mounted Maneuver', '4:Spur On',
        '7:Devastating Mounted Assault', '10:Sweeping Strike'
      ];
      hitDie = 10;
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
        'combatNotes.sweepingStrikeFeature:' +
          'Attack all threatened foes during mount\'s move',
        'combatNotes.wheelAboutFeature:' +
          'May make 90 degree turn during mounted charge',
        'featureNotes.specialMountFeature:Special bond/abilities',
        'featureNotes.spurOnFeature:' +
          'Double mount speed during charge/double move',
        'skillNotes.horseLordFeature:+1 Handle Animal (horse)/Ride (horseback)',
        'validationNotes.freeriderCombat:Requires base attack 6',
        'validationNotes.freeriderFeatures:' +
          'Requires Mounted Combat/Ride By Attack/Spirited Charge',
        'validationNotes.freeriderRace:Requires Erenlander or Sarcosan',
        'validationNotes.freeriderSkills:' +
          'Requires Handle Animal 4/Ride 8/Survival 4'
      ];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_MEDIUM;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Deft Dodging', 'Dismounting Cut', 'Erratic Attack', 'Hit And Run',
        'Wheel About'
      ]
      skillPoints = 2;
      skills = [
        'Climb', 'Diplomacy', 'Handle Animal', 'Jump', 'Ride',
        'Speak Language', 'Spot', 'Survival', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('featCount.Freerider',
        'levels.Freerider', '=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('selectableFeatureCount.Freerider',
        'levels.Freerider', '=', 'Math.floor((source + 1) / 3)'
      );
      MN2E.defineRule('validationNotes.freeriderCombat',
        'levels.Freerider', '=', '-1',
        'baseAttack', '+', 'source >= 6 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.freeriderFeatures',
        'levels.Freerider', '=', '-3',
        'features.Mounted Combat', '+', '1',
        'features.Ride By Attack', '+', '1',
        'features.Spirited Charge', '+', '1'
      );
      MN2E.defineRule('validationNotes.freeriderRace',
        'levels.Freerider', '=', '-1',
        'race', '+', 'source.match(/Erenlander|Sarcosan/) ? 1 : null'
      );
      MN2E.defineRule('validationNotes.freeriderSkills',
        'levels.Freerider', '=', '-3',
        'skills.Handle Animal', '+', 'source >= 4 ? 1 : null',
        'skills.Ride', '+', 'source >= 8 ? 1 : null',
        'skills.Survival', '+', 'source >= 4 ? 1 : null'
      );

    } else if(klass == 'Haunted One') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Seance', '2:Spiritcraft', '2:Spirit Manipulation',
        '3:Ghost Sight', '5:Spell Focus (Divination)',
        '9:Spell Focus (Necromancy)'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.ghostSightFeature:<i>See Invisible</i> at will',
        'magicNotes.seanceFeature:' +
          '<i>Augury</i>/<i>Legend Lore</i> via spirits %V/day',
        'magicNotes.spellFocus(Divination)Feature:+1 DC on Divination spells',
        'magicNotes.spellFocus(Necromancy)Feature:+1 DC on Necromancy spells',
        'magicNotes.spiritcraftFeature:' +
          'Divination/Necromancy spell energy cost reduced by 1',
        'magicNotes.spiritManipulationFeature:' +
          '%V chosen Divination/Necromancy spells as spell-like ability 1/day',
        'validationNotes.hauntedOneFeatures:' +
          'Requires Magecraft/Spellcasting (Divination)/' +
          'Spellcasting (Necromancy)',
        'validationNotes.hauntedOneSkills:' +
          'Requires Knowledge (Arcana) 8/Knowledge (Spirits) 10'
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
      selectableFeatues = null;
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
      MN2E.defineRule
        ('magicNotes.hauntedOneSpellEnergy', 'levels.Haunted One', '=', null);
      MN2E.defineRule
        ('magicNotes.hauntedOneSpellsKnown', 'levels.Haunted One', '=', null);
      MN2E.defineRule('magicNotes.seanceFeature',
        'levels.Haunted One', '=', 'Math.floor((source + 2) / 3)'
      );
      MN2E.defineRule('magicNotes.spiritManipulationFeature',
        'levels.Haunted One', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule
        ('spellEnergy', 'magicNotes.hauntedOneSpellEnergy', '+', null);
      MN2E.defineRule
        ('spellsKnownBonus', 'magicNotes.hauntedOneSpellsKnown', '+', null);
      MN2E.defineRule('validationNotes.hauntedOneFeatures',
        'levels.Haunted One', '=', '-3',
        'features.Spellcasting (Divination)', '+', '1',
        'features.Spellcasting (Necromancy)', '+', '1',
        'subfeatCount.Magecraft', '+', 'source >= 1 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.hauntedOneSkills',
        'levels.Haunted One', '=', '-2',
        'skills.Knowledge (Arcana)', '+', 'source >= 8 ? 1 : null',
        'skills.Knowledge (Spirits)', '+', 'source >= 10 ? 1 : null'
      );

    } else if(klass == 'Insurgent Spy') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Conceal Aura', '1:Shadow Contacts', '2:Shadow Speak',
        '3:Sneak Attack'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'featureNotes.concealAuraFeature:Conceal %V magical auras',
        'skillNotes.shadowContactsFeature:' +
          'Gather Information to obtain %V favor from Shadow minion',
        'skillNotes.shadowSpeakFeature:' +
          '+%V Bluff/Diplomacy/Intimidate/Sense Motive w/Shadow minions',
        'validationNotes.insurgentSpyFeatures:Requires Inconspicuous',
        'validationNotes.insurgentSpySkills:' +
          'Requires Bluff 8/Diplomacy 5/Gather Information 8/Sense Motive 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatues = null;
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
        ('featureNotes.concealAuraFeature', 'levels.Insurgent Spy', '=', null);
      MN2E.defineRule('skillNotes.shadowContactsFeature',
        'levels.Insurgent Spy', '=',
        'source >= 5 ? "incredible" : source >= 3 ? "major" : "minor"'
      );
      MN2E.defineRule('skillNotes.shadowSpeakFeature',
        'levels.Insurgent Spy', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('validationNotes.insurgentSpyFeatures',
        'levels.Insurgent Spy', '=', '-1',
        'features.Inconspicuous', '+', '1'
      );
      MN2E.defineRule('validationNotes.insurgentSpySkills',
        'levels.Insurgent Spy', '=', '-4',
        'skills.Bluff', '+', 'source >= 8 ? 1 : null',
        'skills.Diplomacy', '+', 'source >= 5 ? 1 : null',
        'skills.Gather Information', '+', 'source >= 8 ? 1 : null',
        'skills.Sense Motive', '+', 'source >= 5 ? 1 : null'
      );

    } else if(klass == 'Smuggler') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Smuggler\'s Trade', '2:Dominant Will', '3:Mystifying Speech',
        '4:Information Network', '5:Disguise Contraband', '10:Slippery Mind'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.disguiseContrabandFeature:' +
          '<i>Misdirection</i> on 1 cu ft/level of contraband 1 hour/level',
        'magicNotes.mystifyingSpeechFeature:DC %V <i>Modify Memory</i>',
        'saveNotes.dominantWillFeature:' +
          '+%V Will vs. detection/compulsion spells to reveal activities',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.informationNetworkFeature:' +
          'One hour to take %V on Gather Information in new locale',
        'skillNotes.smuggler\'sTradeFeature:' +
          '+%V/take 10 on Bluff/Disguise/Forgery/Gather Information when ' +
          'smuggling',
        'validationNotes.smugglerFeatures:Requires Friendly Agent',
        'validationNotes.smugglerSkills:' +
          'Requires Bluff 8/Forgery 5/Gather Information 8/Hide 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
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
      // TODO 1/day < level 7; 2/day >= 7
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
      MN2E.defineRule('validationNotes.smugglerFeatures',
        'levels.Smuggler', '=', '-1',
        'features.Friendly Agent', '+', '1'
      );
      MN2E.defineRule('validationNotes.smugglerSkills',
        'levels.Smuggler', '=', '-4',
        'skills.Bluff', '+', 'source >= 8 ? 1 : null',
        'skills.Forgery', '+', 'source >= 5 ? 1 : null',
        'skills.Gather Information', '+', 'source >= 8 ? 1 : null',
        'skills.Hide', '+', 'source >= 5 ? 1 : null'
      );

    } else if(klass == 'Warrior Arcanist') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Armored Casting', '1:Channeled Attack',
        '4:Channeled Armor Class', '6:Melee Caster', '8:Channeled Damage',
        '10:Regenerative Strike'
      ];
      hitDie = 8;
      notes = [
        'magicNotes.armoredCastingFeature:Reduce arcane casting penalty by %V%',
        'magicNotes.channeledArmorClassFeature:' +
          'Use 1 spell energy point to gain +%V AC for 1 round',
        'magicNotes.channeledAttackFeature:' +
          'Use 1 spell energy point to gain +%V attack for 1 round',
        'magicNotes.channeledDamageFeature:' +
          'Use 1 spell energy point to gain +%V damage for 1 round',
        'magicNotes.meleeCasterFeature:Deliver spell via weapon',
        'magicNotes.regenerativeStrikeFeature:' +
          'Recover spell energy equal to 2*weapon multiplier on critical hit',
        'validationNotes.warriorArcanistCombat:' +
          'Requires base attack 4/martial weapon proficiency',
        'validationNotes.warriorArcanistFeatures:' +
          'Requires Magecraft/Spellcasting/WeaponFocus',
        'validationNotes.warriorArcanistSkills:Requires Spellcraft 8'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatues = null;
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
      MN2E.defineRule('magicNotes.channeledArmorClassFeature',
        'level', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.channeledAttackFeature',
        'level', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.channeledDamageFeature',
        'level', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.warriorArcanistSpellEnergy',
        'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('magicNotes.warriorArcanistSpellsKnown',
        'levels.Warrior Arcanist', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule
        ('spellEnergy', 'magicNotes.warriorArcanistSpellEnergy', '+', null);
      MN2E.defineRule('spellsKnownBonus',
        'magicNotes.warriorArcanistSpellsKnown', '+', null
      );
      MN2E.defineRule('validationNotes.warriorArcanistCombat',
        'levels.Warrior Arcanist', '=', '-2',
        'baseAttack', '+', 'source >= 4 ? 1 : null',
        'weaponProficiencyLevel', '+',
          'source >= ' + PH35.PROFICIENCY_MEDIUM + ' ? 1 : null'
      );
      MN2E.defineRule('validationNotes.warriorArcanistFeatures',
        'levels.Warrior Arcanist', '=', '-3',
        'subfeatCount.Magecraft', '+', 'source >= 1 ? 1 : null',
        'subfeatCount.Spellcasting', '+', 'source >= 1 ? 1 : null',
        'subfeatCount.Weapon Focus', '+', 'source >= 1 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.warriorArcanistSkills',
        'levels.Warrior Arcanist', '=', '-1',
        'skills.Spellcraft', '+', 'source >= 8 ? 1 : null'
      );

    } else if(klass == 'Whisper Adept') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Whisper Sense', '2:Whisper Initiative',
        '3:Fell Touch', '4:Whisper Surprise', '5:Tree Meld',
        '6:Whisper Clairaudience', '7:Strength Of The Wood',
        '8:Whisper Clairvoyance', '9:Whisper\'s Ward', '10:Whisper Commune'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.whisperInitiativeFeature:+2 Initiative',
        'combatNotes.whisperSurpriseFeature:Cannot be surprised',
        'featureNotes.whisperSenseFeature:No wisdom check to sense voices',
        'magicNotes.fellTouchFeature:Prevent fallen from becoming Fell/Lost',
        'magicNotes.strengthOfTheWoodFeature:' +
          'Recover 1 spell energy point/hour while inside tree',
        'magicNotes.treeMeldFeature:Merge into tree',
        'magicNotes.whisperClairaudienceFeature:<i>Clairaudience</i> w/in wood',
        'magicNotes.whisperClairvoyanceFeature:<i>Clairvoyance</i> w/in wood',
        'magicNotes.whisperCommuneFeature:<i>Commune With Nature</i> w/in wood',
        'saveNotes.whisper\'sWardFeature:Immune to mind-affecting effects',
        'validationNotes.whiperAdeptFeatures:Requires Magecraft/2 Spellcraft',
        'validationNotes.whiperAdeptRace:Requires Elf',
        'validationNotes.whiperAdeptSkills:' +
          'Requires Knowledge (Nature) 8/Knowledge (Spirits) 10/Survival 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
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
        ('initiative', 'combatNotes.whisperInitiativeFeature', '+', '2');
      MN2E.defineRule('magicNotes.whisperAdeptSpellEnergy',
        'levels.Whisper Adept', '=', null
      );
      MN2E.defineRule('magicNotes.whisperAdeptSpellsKnown',
        'levels.Whisper Adept', '=', null
      );
      MN2E.defineRule
        ('spellEnergy', 'magicNotes.whisperAdeptSpellEnergy', '+', null);
      MN2E.defineRule
        ('spellsKnownBonus', 'magicNotes.whisperAdeptSpellsKnown', '+', null);
      MN2E.defineRule('validationNotes.whisperAdeptFeatures',
        'levels.Whisper Adept', '=', '-2',
        'subfeatCount.Magecraft', '+', 'source >= 1 ? 1 : null',
        'subfeatCount.Spellcraft', '+', 'source >= 2 ? 1 : null'
      );
      MN2E.defineRule('validationNotes.whisperAdeptRace',
        'levels.Whisper Adept', '=', '-1',
        'race', '+', 'source.match(/Elf$/) ? 1 : null'
      );
      MN2E.defineRule('validationNotes.whisperAdeptSkills',
        'levels.Whisper Adept', '=', '-3',
        'skills.Knowledge (Nature)', '+', 'source >= 8 ? 1 : null',
        'skills.Knowledge (Spirits)', '+', 'source >= 10 ? 1 : null',
        'skills.Survival', '+', 'source >= 8 ? 1 : null'
      );

    } else if(klass == 'Wizard') {

      baseAttack = PH35.ATTACK_BONUS_POOR;
      feats = null;
      features = [
        '1:Art Of Magic', '1:Wizardcraft', '2:Efficient Study',
        '4:Bonus Spellcasting'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.efficientStudyFeature:' +
          'XP cost for learning spells/creating magic items reduced by %V%',
        'magicNotes.wizardcraftFeature:' +
          'Prepare spells ahead of time for half energy cost',
        'validationNotes.wizardFeatures:' +
          'Requires Magecraft (Hermetic)/2 Spellcasting/1 item creation/' +
          '1 metamagic',
        'validationNotes.wizardSkills:' +
          'Requires Knowledge (Arcana) 10/Spellcraft 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatues = null;
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
      MN2E.defineRule('featCount.Spellcasting',
        'levels.Wizard', '+=', 'source<4 ? null : Math.floor((source - 1) / 3)'
      );
      MN2E.defineRule('featCount.Wizard Bonus',
        'levels.Wizard', '+=', 'Math.floor(source / 3)'
      );
      MN2E.defineRule('featureNotes.efficientStudyFeature',
        'levels.Wizard', '=', 'Math.floor((source + 1) / 3) * 10'
      );
      MN2E.defineRule
        ('magicNotes.wizardSpellEnergy', 'levels.Wizard', '=', null);
      MN2E.defineRule
        ('magicNotes.wizardSpellsKnown', 'levels.Wizard', '=', null);
      MN2E.defineRule('spellEnergy', 'magicNotes.wizardSpellEnergy', '+', null);
      MN2E.defineRule
        ('spellsKnownBonus', 'magicNotes.wizardSpellsKnown', '+', null);
      MN2E.defineRule('validationNotes.wizardFeatures',
        'levels.Wizard', '=', '-2',
        'features.Magecraft (Hermetic)', '+', '1',
        'subfeatCount.Spellcasting', '+', 'source >= 2 ? 1 : null'
        // TODO 1 item creation/1 metamagic
      );
      MN2E.defineRule('validationNotes.wizardSkills',
        'levels.Wizard', '=', '-2',
        'skills.Knowledge (Arcana)', '+', 'source >= 10 ? 1 : null',
        'skills.Spellcraft', '+', 'source >= 10 ? 1 : null'
      );

    } else if(klass == 'Wogren Rider') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = null;
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
        'combatNotes.improvedMountedCombatFeature:' +
          'Use Mounted Combat additional %V times/round',
        'combatNotes.improvedRideByAttackFeature:Charge in any direction',
        'combatNotes.improvedSpiritedChargeFeature:' +
          'Improved Critical w/charging weapon',
        'combatNotes.improvedTrampleFeature:No foe AOO during overrun',
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'combatNotes.rideByAttackFeature:Move before and after mounted attack',
        'combatNotes.speedMountFeature:Dis/mount as free action',
        'combatNotes.spiritedChargeFeature:' +
          'x2 damage (x3 lance) from mounted charge',
        'combatNotes.trampleFeature:' +
          'Mounted overrun unavoidable/bonus hoof attack',
        'combatNotes.wogrenDodgeFeature:+2 AC during mounted move',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.specialMountFeature:Special bond/abilities',
        'featureNotes.wogren\'sSightFeature:Blindsense while mounted',
        'skillNotes.mountedHideFeature:Hide while mounted',
        'validationNotes.wogrenRiderFeatures:' +
          'Requires Mounted Archery/Mounted Combat',
        'validationNotes.wogrenRiderRace:Requires Halfling',
        'validationNotes.wogrenRiderSkills:Requires Ride 8/Survival 4'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Improved Mounted Archery', 'Improved Mounted Combat',
        'Improved Ride By Attack', 'Improved Spirited Charge',
        'Improved Trample', 'Ride By Attack', 'Spirited Charge', 'Trample'
      ];
      skillPoints = 4;
      skills = [
        'Climb', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Listen',
        'Move Silently', 'Ride', 'Speak Language', 'Spot', 'Survival', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      MN2E.defineRule('combatNotes.improvedMountedCombatFeature',
        'dexterityModifier', '=', 'source > 0 ? source : 1'
      );
      MN2E.defineRule
        ('features.Blindsense', 'features.Wogren\'s Sight', '=', '1');
      MN2E.defineRule
        ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
      MN2E.defineRule('selectableFeatureCount.Wogren Rider',
        'levels.Wogren Rider', '=', 'Math.floor(source / 2)'
      );
      MN2E.defineRule('validationNotes.wogrenRiderFeatures',
        'levels.Wogren Rider', '=', '-2',
        'features.Mounted Archery', '+', '1',
        'features.Mounted Combat', '+', '1'
      );
      MN2E.defineRule('validationNotes.wogrenRiderRace',
        'levels.Wogren Rider', '=', '-1',
        'race', '+', 'source.match(/Halfling/) ? 1 : null'
      );
      MN2E.defineRule('validationNotes.wogrenRiderSkills',
        'levels.Wogren Rider', '=', '-2',
        'skills.Ride', '+', 'source >= 8 ? 1 : null',
        'skills.Survival', '+', 'source >= 4 ? 1 : null'
      );

    } else
      continue;

    MN2E.defineClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellsPerDayAbility);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        MN2E.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(notes != null)
      MN2E.defineNote(notes);
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        MN2E.defineChoice('selectableFeatures', selectable + ':' + klass);
        MN2E.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

};