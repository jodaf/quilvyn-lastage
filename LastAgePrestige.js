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
  MN2EPrestige.prestigeClassRules(MN2E.rules, MN2EPrestige.PRESTIGE_CLASSES);
}

MN2EPrestige.PRESTIGE_CLASSES = [
  'Ancestral Bladebearer', 'Aradil\'s Eye', 'Avenging Knife',
  'Bane Of Legates', 'Druid', 'Elven Raider', 'Freerider', 'Haunted One',
  'Insurgent Spy', 'Smuggler', 'Warrior Arcanist', 'Whisper Adept', 'Wizard',
  'Wogren Rider'
];

MN2EPrestige.prestigeClassRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

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
        'validationNotes.ancestralBladebearerClassBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.ancestralBladebearerClassFeats:' +
          'Requires Max Weapon Focus >= 1/Max Weapon Specialization >= 1'
      ];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_TOWER;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump', 'Profession',
        'Ride', 'Speak Language', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.advanceAncestralBladeFeature',
        'levels.Ancestral Bladebearer', '=', 'Math.floor((source + 2) / 4)'
      );
      rules.defineRule('featCount.Fighter',
        'levels.Ancestral Bladebearer', '+=', 'Math.floor(source / 3)'
      );
      rules.defineRule('magicNotes.ancestralAdvisorFeature',
        'charismaModifier', '=', 'source > 1 ? source : 1'
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
        'validationNotes.aradil\'sEyeClassFeats:Requires Inconspicuous',
        'validationNotes.aradil\'sEyeClassRace:Requires Race == Wood Elf',
        'validationNotes.aradil\'sEyeClassSkills:' +
          'Requires Bluff >= 8/Disguise >= 5/Gather Information >= 8/' +
          'Hide >= 8/Move Silently >= 5/Sense Motive >= 5/Spot >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 8;
      skills = [
        'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy',
        'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump', 'Listen',
        'Move Silently', 'Open Lock', 'Profession', 'Search', 'Sense Motive',
        'Sleight Of Hand', 'Speak Language', 'Spot', 'Survival', 'Swim',
        'Tumble', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featureNotes.alterEgoFeature',
        'levels.Aradil\'s Eye', '=',
        'source >= 7 ? "any" : source >= 3 ? "2 selected" : "1 selected"'
      );
      rules.defineRule
        ('featureNotes.spyFeature', 'levels.Aradil\'s Eye', '=', 'source * 10');
      rules.defineRule('skillNotes.spyInitiateFeature',
        'levels.Aradil\'s Eye', '=', 'source >= 10 ? 10 : source >= 5 ? 8 : 4'
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
        'validationNotes.avengingKnifeClassAlignment:' +
          'Requires Alignment !~ Evil',
        'validationNotes.avengingKnifeClassFeats:' +
          'Requires Improved Initiative/Inconspicuous/Sneak Attack',
        'validationNotes.avengingKnifeClassSkills:' +
          'Requires Bluff >= 5/Gather Information >= 5/Hide >= 8/' +
          'Move Silently >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 6;
      skills = [
        'Balance', 'Bluff', 'Decipher Script', 'Disguise', 'Escape Artist',
        'Gather Information', 'Hide', 'Jump', 'Listen', 'Move Silently',
        'Open Lock', 'Profession', 'Search', 'Sense Motive', 'Speak Language',
        'Spot', 'Swim', 'Tumble', 'Use Rope'
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
        'validationNotes.baneOfLegatesClassFeats:' +
          'Requires Iron Will/Max Magecraft >= 1',
        'validationNotes.baneOfLegatesClassSkills:' +
          'Requires Knowledge (Arcana) >= 13/Knowledge (Shadow) >= 8/' +
          'Spellcraft >= 10',
        'validationNotes.baneOfLegatesClassSpellEnergy:' +
          'Requires Spell Energy >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Bluff', 'Concentration', 'Craft', 'Diplomacy',
        'Handle Animal', 'Heal', 'Intimidate', 'Knowledge', 'Profession',
        'Sense Motive', 'Spellcraft', 'Survival'
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
        'validationNotes.druidClassFeats:' +
          'Requires Magecraft (Spiritual)/Max Spellcasting >= 1',
        'validationNotes.druidClassFeatures:' +
          'Requires Mastery Of Nature/Wild Empathy',
        'validationNotes.druidClassSkills:' +
          'Requires Knowledge (Nature) >= 8/Survival >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Concentration', 'Craft', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Geography)', 'Knowledge (Nature)',
        'Knowledge (Spirits)', 'Profession', 'Speak Language', 'Spellcraft',
        'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('animalCompanionLevel',
        'featureNotes.animalCompanionFeature', '+=', null
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Druid', '+=', null);
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
      // Pick up PH35 Druid level 2-9 spells.
      var classRules = new ScribeRules('');
      PH35.magicRules(classRules, ['Druid'], [], []);
      var schools = rules.getChoices('schools');
      for(var s in classRules.getChoices('spells')) {
        var matchInfo = s.match(/^(.*)\((D[2-9])/);
        if(matchInfo == null) {
          continue;
        }
        var spell = matchInfo[1];
        var school = MN2E.spellsSchools[spell];
        if(school == null && (school = PH35.spellsSchools[spell]) == null) {
          continue;
        }
        spell += '(' + matchInfo[2] + ' ' + schools[school] + ')';
        rules.defineChoice('spells', spell);
      }

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
        'validationNotes.elvenRaiderClassClassBaseAttack:' +
          'Requires Base Attack >= 5',
        'validationNotes.elvenRaiderClassFeats:' +
          'Requires Point Blank Shot/Rapid Shot/' +
          'Weapon Focus (Composite Longbow)||Weapon Focus (Longbow)',
        'validationNotes.elvenRaiderClassRace:Requires Race =~ Elf',
        'validationNotes.elvenRaiderClassSkills:' +
          'Requires Hide >= 8/Move Silently >= 8/Survival >= 8'
      ];
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Balance', 'Climb', 'Craft', 'Heal', 'Hide', 'Intimidate', 'Jump',
        'Listen', 'Move Silently', 'Profession', 'Ride', 'Search',
        'Speak Language', 'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
        'validationNotes.freeriderClassBaseAttack:' +
          'Requires Base Attack >= 6',
        'validationNotes.freeriderClassFeats:' +
          'Requires Mounted Combat/Ride By Attack/Spirited Charge',
        'validationNotes.freeriderClassRace:' +
          'Requires Race =~ Erenlander|Sarcosan',
        'validationNotes.freeriderClassSkills:' +
          'Requires Handle Animal >= 4/Ride >= 8/Survival >= 4'
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
        'Climb', 'Craft', 'Diplomacy', 'Handle Animal', 'Jump', 'Profession',
        'Ride', 'Speak Language', 'Spot', 'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featCount.Freerider',
        'levels.Freerider', '=', 'Math.floor(source / 3)'
      );
      rules.defineRule('selectableFeatureCount.Freerider',
        'levels.Freerider', '=', 'Math.floor((source + 1) / 3)'
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
        'validationNotes.hauntedOneClassFeats:' +
          'Requires Max Magecraft >= 1/Spellcasting (Divination)/' +
          'Spellcasting (Necromancy)',
        'validationNotes.hauntedOneClassSkills:' +
          'Requires Knowledge (Arcana) >= 8/Knowledge (Spirits) >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Knowledge', 'Profession', 'Speak Language',
        'Spellcraft'
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
        'validationNotes.insurgentSpyClassFeats:Requires Inconspicuous',
        'validationNotes.insurgentSpyClassSkills:' +
          'Requires Bluff >= 8/Diplomacy >= 5/Gather Information >= 8/' +
          'Sense Motive >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Shadow)', 'Listen', 'Move Silently', 'Open Lock',
        'Perform (Act)', 'Perform (Comedy)', 'Perform', 'Profession', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Speak Language', 'Spot', 'Swim',
        'Tumble', 'Use Magic Device', 'Use Rope'
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

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Smuggler\'s Trade', '2:Dominant Will', '3:Mystifying Speech',
        '4:Information Network', '5:Disguise Contraband',
        '7:More Mystifying Speech', '10:Slippery Mind'
      ];
      hitDie = 6;
      notes = [
        'magicNotes.disguiseContrabandFeature:' +
          '<i>Misdirection</i> on 1 cu ft/level of contraband 1 hour/level',
        'magicNotes.moreMystifyingSpeechFeature:Mystifying Speech 2/day',
        'magicNotes.mystifyingSpeechFeature:DC %V <i>Modify Memory</i>',
        'saveNotes.dominantWillFeature:' +
          '+%V Will vs. detection/compulsion spells to reveal activities',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.informationNetworkFeature:' +
          'One hour to take %V on Gather Information in new locale',
        'skillNotes.smuggler\'sTradeFeature:' +
          '+%V/take 10 on Bluff/Disguise/Forgery/Gather Information when ' +
          'smuggling',
        'validationNotes.smugglerClassFeats:Requires Friendly Agent',
        'validationNotes.smugglerClassSkills:' +
          'Requires Bluff >= 8/Forgery >= 5/Gather Information >= 8/Hide >= 5'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Craft', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Jump', 'Listen', 'Move Silently',
        'Open Lock', 'Perform', 'Profession', 'Search', 'Sense Motive',
        'Sleight Of Hand', 'Spot', 'Swim', 'Tumble', 'Use Magic Device',
        'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
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
      rules.defineRule('skillNotes.smuggler\'sTradeFeature',
        'levels.Smuggler', '=', 'Math.floor((source + 1) / 2) * 2'
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
        'validationNotes.warriorArcanistClassBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.warriorArcanistClassFeats:' +
          'Requires Max Magecraft >= 1/Max Spellcasting >= 1/' +
          'Max Weapon Focus >= 1',
        'validationNotes.warriorArcanistClassWeaponProficiencyLevel:' +
          'Requires Weapon Proficiency >= ' + PH35.PROFICIENCY_MEDIUM,
        'validationNotes.warriorArcanistClassSkills:Requires Spellcraft >= 8'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Concentration', 'Craft', 'Intimidate', 'Jump',
        'Knowledge (Arcana)', 'Profession', 'Ride', 'Speak Language',
        'Spellcraft', 'Swim'
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
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.fellTouchFeature:Prevent fallen from becoming Fell/Lost',
        'magicNotes.strengthOfTheWoodFeature:' +
          'Recover 1 spell energy point/hour while inside tree',
        'magicNotes.treeMeldFeature:Merge into tree',
        'magicNotes.whisperClairaudienceFeature:<i>Clairaudience</i> w/in wood',
        'magicNotes.whisperClairvoyanceFeature:<i>Clairvoyance</i> w/in wood',
        'magicNotes.whisperCommuneFeature:<i>Commune With Nature</i> w/in wood',
        'saveNotes.whisper\'sWardFeature:Immune to mind-affecting effects',
        'validationNotes.whisperAdeptClassFeats:' +
          'Requires Max Magecraft >= 1/any 2 Spellcasting',
        'validationNotes.whisperAdeptClassRace:Requires Race =~ Elf',
        'validationNotes.whisperAdeptClassSkills:' +
          'Requires Knowledge (Nature) >= 8/Knowledge (Spirits) >= 10/' +
          'Survival >= 8'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Concentration', 'Craft', 'Handle Animal', 'Heal', 'Knowledge',
        'Profession', 'Speak Language', 'Spellcraft', 'Survival'
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
      rules.defineRule('validationNotes.whisperAdeptClassFeats',
        'levels.Whisper Adept', '=', '-12',
        // NOTE: False valid w/multiple Magecraft
        /^features\.Magecraft/, '+', '10',
        /^features\.Spellcasting/, '+', '1',
        '', 'v', '0'
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
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.wizardcraftFeature:' +
          'Prepare spells ahead of time for half energy cost',
        'validationNotes.wizardClassFeats:' +
          'Requires Magecraft (Hermetic)/any 2 Spellcasting/' +
          'any Item Creation/any Metamagic',
        'validationNotes.wizardClassSkills:' +
          'Requires Knowledge (Arcana) >= 10/Spellcraft >= 10'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Knowledge', 'Profession', 'Speak Language',
        'Spellcraft'
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
      rules.defineRule('validationNotes.wizardClassFeats',
        'levels.Wizard', '=', '-302',
        'features.Magecraft (Hermetic)', '+', '100',
        // NOTE: False valid w/3 Spellcasting feats
        /^features\.Spellcasting/, '+', '100',
        // NOTE: Metamagic feat names all end in 'Spell'
        /^features\..*Spell$/, '+', '1',
        /^features\.(Brew|Craft|Forge)/, '+', '1',
        '', 'v', '0'
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
        'validationNotes.wogrenRiderClassFeats:' +
          'Requires Mounted Archery/Mounted Combat',
        'validationNotes.wogrenRiderClassRace:Requires Race =~ Halfling',
        'validationNotes.wogrenRiderClassSkills:' +
          'Requires Ride >= 8/Survival >= 4'
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
        'Climb', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump', 'Listen',
        'Move Silently', 'Profession', 'Ride', 'Speak Language', 'Spot',
        'Survival', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.improvedMountedCombatFeature',
        'dexterityModifier', '=', 'source > 0 ? source : 1'
      );
      rules.defineRule
        ('features.Blindsense', 'features.Wogren\'s Sight', '=', '1');
      rules.defineRule
        ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
      rules.defineRule('selectableFeatureCount.Wogren Rider',
        'levels.Wogren Rider', '=', 'Math.floor(source / 2)'
      );

    } else
      continue;

    PH35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude,
       saveReflex, saveWill, profArmor, profShield, profWeapon, skills,
       features, spellsKnown, spellsPerDay, spellAbility);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
    if(notes != null)
      rules.defineNote(notes);
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + klass);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

};
