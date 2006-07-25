/* $Id: LastAge.js,v 1.20 2006/07/25 20:43:02 Jim Exp $ */

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


/* Loads the rules from Midnight Second Edition. */
function MN2E() {
  if(MN2E.RaceRules != null) MN2E.RaceRules();
  if(MN2E.HeroicPathRules != null) MN2E.HeroicPathRules();
  if(MN2E.ClassRules != null) MN2E.ClassRules();
  if(MN2E.SkillRules != null) MN2E.SkillRules();
  if(MN2E.FeatRules != null) MN2E.FeatRules();
  if(MN2E.EquipmentRules != null) MN2E.EquipmentRules();
  if(MN2E.CombatRules != null) MN2E.CombatRules();
  if(MN2E.MagicRules != null) MN2E.MagicRules();
  if(MN2E.Randomize != null)
    ScribeCustomRandomizers(MN2E.Randomize, 'heroicPath');
  MN2E.RaceRules = null;
  MN2E.HeroicPathRules = null;
  MN2E.ClassRules = null;
  MN2E.SkillRules = null;
  MN2E.FeatRules = null;
  MN2E.EquipmentRules = null;
  MN2E.CombatRules = null;
  MN2E.MagicRules = null;
  ScribeCustomEditor
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'experience');
  ScribeCustomChoices('heroicPaths', 'Null Path');
  ScribeCustomChoices('races', 'Null Race');
}
/* Choice lists */
MN2E.CLASSES = [
  'Charismatic Channeler', 'Defender', 'Fighter', 'Hermetic Channler', 
  'Rogue', 'Spiritual Channeler', 'Wildlander'
];
MN2E.FEATS = [
];
MN2E.HEROIC_PATHS = [
  'Beast', 'Chanceborn', 'Charismatic', 'Dragonblooded', 'Earthbonded',
  'Faithful', 'Fellhunter', 'Feyblooded', 'Giantblooded', 'Guardian', 'Healer',
  'Ironborn', 'Jack-Of-All-Trades', 'Mountainborn', 'Naturefriend',
  'Northblooded', 'Painless', 'Pureblood', 'Quickened', 'Seaborn', 'Seer',
  'Speaker', 'Spellsoul', 'Shadow Walker', 'Steelblooded', 'Sunderborn',
  'Tactician', 'Warg'
];
MN2E.LANGUAGES = [
];
MN2E.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Clan Raised Dwarrow', 'Clan Raised Dworg',
  'Danisil Raised Elfling', 'Dorn', 'Erenlander', 'Gnome',
  'Gnome Raised Dwarrow', 'Halfling Raised Elfling', 'Jungle Elf',
  'Kurgun Dwarf', 'Kurgun Raised Dwarrow', 'Kurgun Raised Dworg',
  'Nomadic Halfling', 'Orc', 'Plains Sarcosan', 'Sea Elf', 'Snow Elf',
  'Urban Sarcosan', 'Wood Elf'
];
MN2E.SELECTABLE_FEATURES = [
];
MN2E.SKILLS = [
];
MN2E.SPELLS = [
];
MN2E.WEAPONS = [
];

MN2E.ClassRules = function() {

  var baseAttack, features, hitDie, notes, profArmor,
      profShield, profWeapon, saveFortitude, saveReflex, saveWill,
      skillPoints, skills;
  var prerequisites = null;  /* No base class has prerequisites */

  for(var i = 0; i < MN2E.CLASSES.length; i++) {

    var klass = MN2E.CLASSES[i];

    if(klass.indexOf(' Channeler') >= 0) {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Art Of Magic', 1, 'Bonus Spell Energy', 1, 'Magecraft',
        2, 'Bonus Spellcasting', 2, 'Bonus Spells', 2, 'Summon Familiar',
        3, 'Tradition Gift', 4, 'Bonus Feats'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.bonusFeatsFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellEnergyFeature:%V extra spell energy points',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
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
      ScribeCustomRules('featCount',
        'featureNotes.bonusFeatsFeature', '+', null,
        'featureNotes.bonusSpellcastingFeature', '+', null
      );
      ScribeCustomRules('featureNotes.bonusFeatsFeature',
        'channelerLevels', '=', 'Math.floor((source - 1) / 3)'
      );
      ScribeCustomRules('featureNotes.bonusSpellcastingFeature',
        'channelerLevels', '=', 'Math.floor((source + 1) / 3)'
      );
      ScribeCustomRules
        ('magicNotes.bonusSpellEnergyFeature', 'channelerLevels', '+=', null);
      ScribeCustomRules('magicNotes.bonusSpellsFeature',
        'channelerLevels', '+=', '(source - 1) * 2'
      );
      ScribeCustomRules
        ('spellEnergy', 'magicNotes.bonusSpellEnergyFeature', '+', null);

      if(klass == 'Charismatic Channeler') {
        MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
          'Charismatic Channeler:Greater Confidence/Greater Fury/' +
          'Improved Confidence/Improved Fury/Inspire Confidence/' +
          'Inspire Facination/Inspire Fury/Mass Suggestion/Suggestion';
        skills = skills.concat([
          'Bluff', 'Diplomacy', 'Gather Information', 'Intimidate',
          'Sense Motive'
        ]);
        features = features.concat([3, 'Force Of Personality']);
        notes = notes.concat([
          'magicNotes.forceOfPersonalityFeature:' +
            'Inspire Confidence/Fascination/Fury/Suggestion %V/day',
          'magicNotes.greaterConfidenceFeature:' +
            '<i>Break Enchantment</i> 1/5 rounds during Inspire Confidence',
          'magicNotes.greaterFuryFeature:' +
            'Ally gains 2d10 hit points/+2 attack/+1 Fortitude save',
          'magicNotes.improvedConfidenceFeature:' +
            'Allies failing enchantment saves affected for half duration; ' +
            'fear reduced',
          'magicNotes.improvedFuryFeature:' +
            'Additional +%V initiative/attack/damage',
          'magicNotes.inspireConfidenceFeature:' +
            'Allies w/in 60 ft +4 save vs. enchantment/fear for %V rounds',
          'magicNotes.inspireFascinationFeature:' +
            '1 creature/level w/in 120 ft make %V DC Will save or enthralled ' +
            '1 round/level',
          'magicNotes.inspireFuryFeature:' +
            'Allies w/in 60 ft +1 initiative/attack/damage %V rounds',
          'magicNotes.massSuggestionFeature:' +
            'Make suggestion to %V fascinated creatures',
          'magicNotes.suggestionFeature:Make suggestion to fascinated creature'
        ]);
        ScribeCustomRules
          ('channelerLevels', 'levels.Charismatic Channeler', '+=', null);
        ScribeCustomRules('magicNotes.forceOfPersonalityFeature',
          'charismaModifier', '=', '3 + source'
        );
        ScribeCustomRules('magicNotes.inspireConfidenceFeature',
          'levels.Charismatic Channeler', '=', null
        );
        ScribeCustomRules('magicNotes.inspireFascinationFeature',
          'levels.Charismatic Channeler', '=', '10 + Math.floor(source / 2)',
          'charismaModifier', '+', null
        );
        ScribeCustomRules('magicNotes.inspireFuryFeature',
          'levels.Charismatic Channeler', '=', 'source + 5'
        );
        ScribeCustomRules('magicNotes.massSuggestionFeature',
          'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
        );
        ScribeCustomRules('selectableFeatureCount.Charismatic Channeler',
          'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
        );
      } else if(klass == 'Hermetic Channeler') {
        MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
          'Hermetic Channeler:Foe Specialty/Knowledge Specialty/' +
          'Quick Reference/Spell Specialty';
        skills = skills.concat([
          'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
          'Knowledge (Engineering)', 'Knowledge (Geography)',
          'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
          'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)'
        ]);
        features = features.concat([3, 'Lorebook']);
        notes = notes.concat([
          'skillNotes.foeSpecialtyFeature:' +
            'Each day choose a creature type to take 10 on Knowledge checks',
          'skillNotes.knowledgeSpecialtyFeature:' +
            'Each day Choose a Knowledge Skill Focus',
          'skillNotes.lorebookFeature:' +
            'Study 1 minute for knowledge of situation; scan at -10',
          'skillNotes.quickReferenceFeature:Reduce Lorebook scan penalty to -5',
          'skillNotes.spellSpecialtyFeature:Each day choose a spell for +1 DC'
        ]);
        ScribeCustomRules('selectableFeatureCount.Hermetic Channeler',
          'levels.Hermetic Channeler', '=', 'Math.floor(source / 3)'
        );
        ScribeCustomRules
          ('channelerLevels', 'levels.Hermetic Channeler', '+=', null);
      } else if(klass == 'Spiritual Channeler') {
        MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
          'Spiritual Channeler:Confident Effect/Heightened Effect/'+
          'Mastery Of Nature/Mastery Of Spirits/Mastery Of The Unnatural/' +
          'Powerful Effect/Precise Effect/Specific Effect/Universal Effect';
        features = features.concat([3, 'Master Of Two Worlds']);
        notes = notes.concat([
          'combatNotes.confidentEffectFeature:+4 Master of Two Worlds checks',
          'combatNotes.heightenedEffectFeature:' +
            '+2 level for Master of Two Worlds checks',
          'combatNotes.masteryOfNatureFeature:Turn animals/plants as cleric',
          'combatNotes.masteryOfSpiritsFeature:Turn exorcises spirits',
          'combatNotes.masteryOfTheUnnaturalFeature:' +
            'Turn constructs/outsiders (double hit die) as cleric',
          'combatNotes.masterOfTwoWorldsFeature:' +
            'Mastery of Nature/Spirits/The Unnatural %V/day',
          'combatNotes.powerfulEffectFeature:+1d6 mastery damage',
          'combatNotes.preciseEffectFeature:Choose type of creature to affect',
          'combatNotes.specificEffectFeature:Choose individuals to affect',
          'combatNotes.universalEffectFeature:' +
            'Use multiple mastery powers simultaneously'
        ]);
        skills = skills.concat([
          'Diplomacy', 'Knowledge (Nature)', 'Sense Motive', 'Survival', 'Swim'
        ]);
        ScribeCustomRules
          ('channelerLevels', 'levels.Spiritual Channeler', '+=', null);
        ScribeCustomRules('featureNotes.masterOfTwoWorldsFeature',
          'levels.Spiritual Channeler', '?', 'source >= 3',
          'wisdomModifier', '=', '3 + source'
        );
        ScribeCustomRules('selectableFeatureCount.Spiritual Channeler',
          'levels.Spiritual Channeler', '=', 'Math.floor(source / 3)'
        );
        ScribeCustomRules
          ('turningLevel', 'levels.Spiritual Channeler', '+=', null);
      }

    } else if(klass == 'Defender') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
       'Defender:Defensive Mastery/Dodge Training/Flurry Attack/' +
       'Grappling Training/Offensive Training/Speed Training/Cover Ally/' +
       'One With The Weapon/Rapid Strike/Strike And Hold/Counterattack/' +
       'Devastating Strike/Furious Grapple/Retailiatory Strike/Weapon Trap';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Masterful Strike', 2, 'Defender Abilities',
        2, 'Defender Stunning Fist', 3, 'Improved Grapple',
        4, 'Precise Strike', 5, 'Incredible Resilience', 5, 'Incredible Speed',
        6, 'Masterful Strike'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.incredibleSpeedFeature:Add up to %V speed',
        'combatNotes.dodgeTrainingFeature:+%V AC',
        'combatNotes.counterattackFeature:AOO on foe miss 1/round',
        'combatNotes.coverAllyFeature:Take hit for ally w/in 5 ft 1/round',
        'combatNotes.defenderAbilitiesFeature:' +
          'Counterattack/Cover Ally/Defender Stunning Fist/Devastating ' +
          'Strike/Rapid Strike/Retaliatory Strike/Strike And Hold/Weapon ' +
          'Trap %V/day',
        'combatNotes.defenderStunningFistFeature:' +
          'Foe %V Fortitude save or stunned',
        'combatNotes.devastativeAttackFeature:' +
          'Bull Rush stunned opponent as free action w/out AOO',
        'combatNotes.flurryAttackFeature:' +
          'Two-weapon off hand penalty reduced by %V',
        'combatNotes.furiousGrappleFeature:' +
          'Extra grapple attack at highest attack bonus 1/round',
        'combatNotes.grapplingTrainingFeature:' +
          'Disarm/sunder/trip attacks use grapple check',
        'combatNotes.incredibleResilienceFeature:Add up to %V HP',
        'combatNotes.masterfulStrikeFeature:' +
           'Improved Unarmed Strike/extra unarmed damage',
        'combatNotes.offensiveTrainingFeature:' +
           'Stunned foe %V DC save to avoid blinding/deafening',
        'combatNotes.oneWithTheWeaponFeature:' +
          'Masterful Strike/Precise Strike/Stunning Fist w/chosen weapon',
        'combatNotes.preciseStrikeFeature:' +
          'Ignore %V points of damage resistance',
        'combatNotes.rapidStrikeFeature:' +
          'Extra attack at highest attack bonus 1/round',
        'combatNotes.retaliatoryStrikeFeature:' +
          'AOO vs. foe that strikes ally 1/round',
        'combatNotes.speedTrainingFeature:Extra move action each round',
        'combatNotes.strikeAndHoldFeature:' +
          'Extra unarmed attack to grab foe',
        'combatNotes.weaponTrapFeature:' +
          'Attack to catch foe\'s weapon for disarm/damage/AOO 1/round',
        'saveNotes.defensiveMasteryFeature:+%V all saves'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 4;
      skills = [
        'Balance', 'Bluff', 'Climb', 'Escape Artist', 'Handle Animal', 'Hide',
        'Jump', 'Knowledge (Local)', 'Knowledge (Shadow)', 'Listen',
        'Move Silently', 'Sense Motive', 'Speak Language', 'Swim', 'Tumble'
      ];
      ScribeCustomRules('abilityNotes.incredibleSpeedFeature',
        'levels.Defender', '=', '10 * Math.floor((source - 4) / 3)'
      );
      ScribeCustomRules('combatNotes.defenderAbilitiesFeature',
        'levels.Defender', '=', 'source * 3 / 4',
        'level', '+', 'source / 4'
      );
      ScribeCustomRules('combatNotes.defenderStunningFistFeature',
        'levels.Defender', '=', '10 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      ScribeCustomRules
        ('armorClass', 'combatNotes.dodgeTrainingFeature', '+', null);
      ScribeCustomRules('combatNotes.incredibleResilienceFeature',
        'levels.Defender', '=', '3 * Math.floor((source - 4) / 3)'
      );
      ScribeCustomRules('combatNotes.offensiveTrainingFeature',
        'levels.Defender', '=', '14 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      ScribeCustomRules('combatNotes.preciseStrikeFeature',
        'levels.Defender', '=', 'Math.floor((source + 2) / 6)'
      );
      ScribeCustomRules('features.Improved Unarmed Strike',
        'features.Masterful Strike', '=', '1'
      );
      ScribeCustomRules('selectableFeatureCount.Defender',
        'levels.Defender', '=', 'Math.floor((source + 1) / 3)'
      );
      ScribeCustomRules('weaponDamage.Unarmed',
        'levels.Defender', '=', '(1 + Math.floor(source / 6)) + "d6"'
      );
      ScribeCustomRules
        ('save.Fortitude', 'saveNotes.defensiveMasteryFeature', '+', null);
      ScribeCustomRules
        ('save.Reflex', 'saveNotes.defensiveMasteryFeature', '+', null);
      ScribeCustomRules
        ('save.Will', 'saveNotes.defensiveMasteryFeature', '+', null);

    } else if(klass == 'Fighter') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
        'Fighter:Adapter/Improviser/Leader Of Men/Survivor';
      ScribeCustomRules('selectableFeatureCount.Fighter',
       'levels.Fighter', '=', 'source >= 4 ? 1 : null'
      );
      // TODO: Description of warrior's way effects

    } else if(klass == 'Rogue') {

      ScribeCustomRules
        ('classSkills.Knowledge (Shadow)', 'levels.Rogue', '=', '1');
      ScribeCustomRules('classSkills.Speak Language', 'levels.Rogue', '=', '1');

    } else if(klass == 'Wildlander') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
        'Wildlander:Animal Companion/Camouflage/Evasion/Hated Foe/' +
        'Hide In Plain Sight/Hunted By The Shadow/Improved Evasion/' +
        'Improved Woodland Stride/Instinctive Response/Master Hunter/' +
        'Overland Stride/Quick Stride/Rapid Response/Sense Dark Magic/' +
        'Skill Mastery/Slippery Mind/Trackless Step/True Aim/Wild Empathy/' +
        'Wilderness Trapfinding/Woodland Stride';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Track', 1, 'Wildlander Trait', 3, 'Danger Sense',
        4, 'Hunter\'s Strike'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.dangerSenseFeature:Up to %V initiative bonus',
        'combatNotes.hunter\'sStrikeFeature:Double damage %V/day',
        'featureNotes.wildlanderTraitFeature:%V wildlander feats',
        'skillNotes.dangerSenseFeature:Up to %V Listen/Spot bonus'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 6;
      skills = [
        'Balance', 'Climb', 'Handle Animal', 'Heal', 'Hide', 'Jump',
        'Knowledge (Geography)', 'Knowledge (Nature)', 'Listen',
        'Move Silently', 'Ride', 'Search', 'Speak Language', 'Spot',
        'Survival', 'Swim', 'Use Rope'
      ];
      ScribeCustomRules('combatNotes.dangerSenseFeature',
        'levels.Wildlander', '=', 'Math.floor(source / 3)'
      );
      ScribeCustomRules('combatNotes.hunter\'sStrikeFeature',
        'levels.Wildlander', '=', 'Math.floor(source / 4)'
      );
      ScribeCustomRules('featureNotes.wildlanderTraitFeature',
        'levels.Wildlander', '=', '1 + Math.floor((source + 1) / 3)'
      );

    } else
      continue;

    ScribeCustomClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites);
    if(notes != null)
      ScribeCustomNotes(notes);

  }

};

MN2E.CombatRules = function() {

};

MN2E.EquipmentRules = function() {

};

MN2E.FeatRules = function() {

  ScribeCustomChoices('feats', MN2E.FEATS);
  for(var i = 0; i < MN2E.FEATS.length; i++) {
    ScribeCustomRules
      ('features.' + MN2E.FEATS[i], 'feats.' + MN2E.FEATS[i], '=', null);
  }
  ScribeCustomChoices('selectableFeatures', MN2E.SELECTABLE_FEATURES);
  for(var i = 0; i < MN2E.SELECTABLE_FEATURES.length; i++) {
    var pieces = MN2E.SELECTABLE_FEATURES[i].split(':');
    var prefix = pieces[0].substring(0, 1).toLowerCase() +
                 pieces[0].substring(1).replace(/ /g, '');
    var selectables = pieces[1].split('/');
    for(var j = 0; j < selectables.length; j++) {
      var selectable = selectables[j];
      ScribeCustomRules('features.' + selectable,
        'selectableFeatures.' + selectable, '=', null
      );
      ScribeCustomRules(prefix + 'Features.' + selectable,
        'selectableFeatures.' + selectable, '=', null
      );
    }
  }
  ScribeCustomRules('armorClass', 'combatNotes.naturalArmorFeature', '+', null);
  ScribeCustomRules('charisma', 'features.Charisma Bonus', '+', null);
  ScribeCustomRules('constitution', 'features.Constitution Bonus', '+', null);
  ScribeCustomRules('dexterity', 'features.Dexterity Bonus', '+', null);
  ScribeCustomRules('featCount', 'featureNotes.bonusFeatFeature', '+', null);
  ScribeCustomRules('intelligence', 'features.Intelligence Bonus', '+', null);
  ScribeCustomRules('speed', 'abilityNotes.fastMovementFeature', '+', null);
  ScribeCustomRules('strength', 'features.Strength Bonus', '+', null);
  ScribeCustomRules('wisdom', 'features.Wisdom Bonus', '+', null);

};

MN2E.HeroicPathRules = function() {

  ScribeCustomChoices('heroicPaths', MN2E.HEROIC_PATHS);

  // In general on bonuses (strength, fortitude, etc.), Scribe will
  // automatically set the bonus to 1 when the appropriate level is reached.
  // Computations below add additional bonuses for level advances.

  for(var i = 0; i < MN2E.HEROIC_PATHS.length; i++) {

    var features = null;
    var notes = null;
    var path = MN2E.HEROIC_PATHS[i];
    var spellFeatures = null;

    if(path == 'Beast') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
        'Beast:Low Light Vision/Scent/Strength Bonus/Constitution Bonus/' +
        'Dexterity Bonus/Wisdom Bonus';
      features = [
        1, 'Vicious Assault', 2, 'Beastial Aura', 7, 'Rage', 12, 'Repel Animals'
      ];
      spellFeatures = [
        3, 'Magic Fang', 4, 'Bear\'s Endurance', 8, 'Greater Magic Fang',
        9, 'Cat\'s Grace', 13, 'Magic Fang', 14, 'Bull\'s Strength',
        17, 'Greater Magic Fang', 19, 'Freedom Of Movement'
      ];
      notes = [
        'combatNotes.beastialAuraFeature:Turn animals as cleric %V/day',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'combatNotes.viciousAssaultFeature:Two claw attacks at %V each',
        'featureNotes.repelAnimalsFeature:' +
          'Animals w/in 15 ft act negatively/cannot ride',
        'skillNotes.beastialAuraFeature:-10 Handle Animal'
      ];
      ScribeCustomRules('combatNotes.beastialAuraFeature',
        'pathLevels.Beast', '+=', 'source >= 12 ? 6 : 3'
      );
      ScribeCustomRules('combatNotes.rageFeature',
        'pathLevels.Beast', '+=', 'source >= 17 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.viciousAssaultFeature',
        'mediumViciousAssault', '=', null,
        'smallViciousAssault', '=', null
      );
      ScribeCustomRules('mediumViciousAssault',
        'pathLevels.Beast', '=', 'source>=11 ? "d8" : source>=6 ? "d6" : "d4"'
      );
      ScribeCustomRules('selectableFeatureCount.Beast',
        'pathLevels.Beast', '=',
        'Math.floor(source / 5) + ((source >= 16) ? 2 : 1)'
      );
      ScribeCustomRules('smallViciousAssault',
        'features.Small', '?', null,
        'mediumViciousAssault', '=', 'Scribe.smallDamage[source]'
      );
      ScribeCustomRules
        ('turningLevel', 'pathLevels.Beast', '+=', 'source>=2 ? source : null');

    } else if(path == 'Chanceborn') {

      features = [
        1, 'Luck Of Heroes', 3, 'Unfettered', 4, 'Miss Chance', 6, 'Survivor',
        9, 'Take Ten', 19, 'Take Twenty'
      ];
      spellFeatures = [
        2, 'Resistance', 7, 'True Strike', 12, 'Aid', 17, 'Prayer'
      ];
      notes = [
        'combatNotes.missChanceFeature:%V% chance of foe miss',
        'featureNotes.luckOfHeroesFeature:Add %V to any d20 roll 1/day',
        'featureNotes.survivorFeature:' +
          'Defensive Roll/Evasion/Slippery Mind/Uncanny Dodge %V/day',
        'featureNotes.takeTenFeature:Take 10 on any d20 roll 1/day',
        'featureNotes.takeTwentyFeature:Take 20 on any d20 roll 1/day',
        'magicNotes.unfetteredFeature:<i>Freedom Of Movement</i> %V rounds/day'
      ];
      ScribeCustomRules('combatNotes.missChanceFeature',
        'pathLevels.Chanceborn', '+=', 'source >= 14 ? 10 : 5'
      );
      ScribeCustomRules('featureNotes.luckOfHeroesFeature',
        'pathLevels.Chanceborn', '=',
        '"d4" + (source >= 5 ? "/d6" : "") + (source >= 10 ? "/d8" : "") + ' +
        '(source >= 15 ? "/d10" : "") + (source >= 20 ? "/d12" : "")'
      );
      ScribeCustomRules('featureNotes.survivorFeature',
        'pathLevels.Chanceborn', '+=', 'Math.floor((source - 1) / 5)'
      );
      ScribeCustomRules
        ('features.Defensive Roll', 'features.Survivor', '=', '1');
      ScribeCustomRules('features.Evasion', 'features.Survivor', '=', '1');
      ScribeCustomRules
        ('features.Slippery Mind', 'features.Survivor', '=', '1');
      ScribeCustomRules
        ('features.Uncanny Dodge', 'features.Survivor', '=', '1');
      ScribeCustomRules('magicNotes.unfetteredFeature',
        'pathLevels.Chanceborn', '+=', 'Math.floor((source + 2) / 5)'
      );

    } else if(path == 'Charismatic') {

      features = [
        4, 'Inspiring Oration', 5, 'Charisma Bonus', 6, 'Leadership',
        12, 'Natural Leader',
      ];
      spellFeatures = [
        1, 'Charm Person', 2, 'Remove Fear', 3, 'Hypnotism', 7, 'Aid',
        8, 'Daze Monster', 11, 'Heroism', 13, 'Charm Monster',
        16, 'Suggestion', 17, 'Greater Heroism'
      ];
      notes = [
        'featureNotes.naturalLeaderFeature: +%V Leadership score',
        'magicNotes.inspiringOrationFeature:' +
          'Give speech to apply spell-like ability to allies w/in 60 ft %V/day'
      ];
      ScribeCustomRules('featureNotes.naturalLeaderFeature',
        'pathLevels.Charismatic', '=', 'source >= 18 ? 2 : 1'
      );
      ScribeCustomRules('features.Charisma Bonus',
        'pathLevels.Charismatic', '+', 'Math.floor((source - 5) / 5)'
      );
      ScribeCustomRules('magicNotes.inspiringOrationFeature',
        'pathLevels.Charismatic', '+=', 'Math.floor((source + 1) / 5)'
      );

    } else if(path == 'Dragonblooded') {

      features = [
        1, 'Bolster Spell', 2, 'Bonus Spells', 3, 'Bonus Spell Energy',
        4, 'Quickened Counterspelling', 6, 'Improved Spellcasting',
        9, 'Spell Penetration', 19, 'Frightful Presence'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.bolsterSpellFeature:Add 1 to DC of %V chosen spells',
        'magicNotes.bonusSpellEnergyFeature:%V extra spell energy points',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.frightfulPresenceFeature:' +
          'Casting panics/shakes foes of lesser level 4d6 rounds failing DC %V Will save',
        'magicNotes.improvedSpellcastingFeature:' +
          'Reduce energy cost of spells from %V chosen schools by 1',
        'magicNotes.quickenedCounterspellingFeature:' +
          'Counterspell as move action 1/round',
        'magicNotes.spellPenetrationFeature:Add %V to spell penetration checks'
      ];
      ScribeCustomRules('magicNotes.bolsterSpellFeature',
        'pathLevels.Dragonblooded', '+=', '1 + Math.floor(source / 5)'
      );
      ScribeCustomRules('magicNotes.bonusSpellEnergyFeature',
        'pathLevels.Dragonblooded', '+=',
        '2 * (source>=16 ? 4 : source>=15 ? 3 : Math.floor((source + 1) / 4))'
      );
      ScribeCustomRules('magicNotes.bonusSpellsFeature',
        'pathLevels.Dragonblooded', '+=', 'source>=14 ? 3 : source>=8 ? 2 : 1'
      );
      ScribeCustomRules('magicNotes.frightfulPresenceFeature',
        'pathLevels.Dragonblooded', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      ScribeCustomRules('magicNotes.improvedSpellcastingFeature',
        'pathLevels.Dragonblooded', '+=', 'Math.floor(source / 6)'
      );
      ScribeCustomRules('magicNotes.spellPenetrationFeature',
        'pathLevels.Dragonblooded', '+=', 'Math.floor((source - 5) / 4)'
      );
      ScribeCustomRules
        ('spellEnergyPoints', 'magicNotes.bonusSpellEnergyFeature', '+', null);

    } else if(path == 'Earthbonded') {

      features = [
        1, 'Darkvision', 3, 'Natural Armor', 4, 'Stonecunning',
        8, 'Improved Stonecunning', 12, 'Tremorsense', 16, 'Blindsense',
        20, 'Blindsight'
      ];
      spellFeatures = [
        2, 'Hold Portal', 5, 'Soften Earth And Stone', 6, 'Make Whole',
        7, 'Spike Stones', 9, 'Stone Shape', 11, 'Meld Into Stone',
        13, 'Transmute Rock To Mud', 14, 'Stoneskin', 15, 'Move Earth',
        17, 'Stone Tell', 19, 'Earthquake'
      ];
      notes = [
        'combatNotes.naturalArmorFeature:+%V AC',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.blindsightFeature:' +
          'Other senses compensate for loss of vision w/in 30 ft',
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door',
        'featureNotes.tremorsenseFeature:' +
          'Detect creatures in contact w/ground w/in 30 ft'
      ];
      ScribeCustomRules('combatNotes.naturalArmorFeature',
        'pathLevels.Earthbonded', '+=', 'source>=18 ? 3 : source>=10 ? 2 : 1'
      );

    } else if(path == 'Faithful') {

      features = [
        4, 'Turn Undead', 5, 'Wisdom Bonus'
      ];
      spellFeatures = [
        1, 'Bless', 2, 'Protection From Evil', 3, 'Divine Favor', 6, 'Aid',
        7, 'Bless Weapon', 8, 'Consecrate', 11, 'Daylight',
        12, 'Magic Circle Against Evil', 13, 'Prayer', 16, 'Holy Smite',
        17, 'Dispel Evil', 18, 'Holy Aura'
      ];
      notes = null;
      ScribeCustomRules('turningLevel',
        'pathLevels.Faithful', '+=', 'source >= 4 ? source : null'
      );
/* TODO Cleric computation overrides this
      ScribeCustomRules('turningFrequency',
        'pathLevels.Faithful', '=', 'Math.floor((source + 1) / 5)'
      );
*/
      ScribeCustomRules('features.Wisdom Bonus',
        'pathLevels.Faithful', '+', 'Math.floor((source - 5) / 5)'
      );

    } else if(path == 'Fellhunter') {

      features = [
        1, 'Sense The Dead', 2, 'Touch Of The Living', 3, 'Ward Of Life',
        5, 'Disrupting Attack'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.disruptingAttackFeature:' +
           'Undead %V Will save or destroyed level/5/day',
        'combatNotes.touchOfTheLivingFeature:+%V damage vs. undead',
        'magicNotes.senseTheDeadFeature:Detect undead %V ft at will',
        'saveNotes.wardOfLifeFeature:Immune to undead %V'
      ];
      ScribeCustomRules('combatNotes.disruptingAttackFeature',
        'pathLevels.Fellhunter', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      ScribeCustomRules('combatNotes.touchOfTheLivingFeature',
        'pathLevels.Fellhunter', '+=', 'Math.floor((source + 3) / 5)'
      );
      ScribeCustomRules('magicNotes.senseTheDeadFeature',
        'pathLevels.Fellhunter', '+=',
          '10 * (Math.floor((source + 4) / 5) + Math.floor((source + 1) / 5))'
      );
      ScribeCustomRules('saveNotes.wardOfLifeFeature',
        'pathLevels.Fellhunter', '=',
        '"extraordinary special attacks" + ' +
        '(source >= 8 ? "/ability damage" : "") + ' +
        '(source >= 13 ? "/ability drain" : "") + ' +
        '(source >= 18 ? "/energy drain" : "")'
      );

    } else if(path == 'Feyblooded') {

      features = [
        1, 'Low Light Vision', 4, 'Unearthly Grace', 7, 'Fey Vision'
      ];
      spellFeatures = [
        2, 'Disguise Self', 3, 'Ventriloquism', 5, 'Magic Aura',
        6, 'Invisibility', 9, 'Nondetection', 10, 'Glibness',
        11, 'Deep Slumber', 14, 'False Vision', 15, 'Rainbow Pattern',
        17, 'Mislead', 18, 'Seeming'
      ];
      notes = [
        'featureNotes.unearthlyGraceFeature:' +
           'Charisma bonus to AC/saving throw/dexterity checks %V times',
        'magicNotes.feyVisionFeature:Detect %V auras at will'
      ];
      // TODO See MN 56.  Probably no good way to encode this.
      ScribeCustomRules('featureNotes.unearthlyGraceFeature',
        'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)'
      );
      ScribeCustomRules('magicNotes.feyVisionFeature',
        'pathLevels.Feyblooded', '=',
        'source >= 19 ? "all magic" : ' +
        'source >= 13 ? "enchantment/illusion" : "enchantment"'
      );

    } else if(path == 'Giantblooded') {

      features = [
        1, 'Obvious', 2, 'Rock Throwing', 3, 'Intimidating Size',
        4, 'Fast Movement', 5, 'Strength Bonus', 8, 'Fearsome Charge',
        10, 'Large', 20, 'Extra Reach'
      ];
      spellFeatures = null;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.extraReachFeature:15 ft reach',
        'combatNotes.fearsomeChargeFeature:' +
           '+%V damage/-1 AC for every 10 ft in charge',
        'combatNotes.largeFeature:+4 bull rush/disarm/grapple/-1 AC/attack',
        'combatNotes.rockThrowingFeature:Use boulders as %V ft ranged weapons',
        'skillNotes.intimidatingSizeFeature:+%V Intimidate',
        'skillNotes.obviousFeature:-4 Hide'
      ];
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 4) / 8) * 5'
      );
      ScribeCustomRules('armorClass', 'combatNotes.largeFeature', '+', '-1');
      ScribeCustomRules('baseAttack', 'combatNotes.largeFeature', '+', '-1');
      ScribeCustomRules('combatNotes.fearsomeChargeFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 2) / 10)'
      );
      ScribeCustomRules('combatNotes.rockThrowingFeature',
        'pathLevels.Giantblooded', '=',
        'source >= 19 ? 120 : source >= 13 ? 90 : source >= 6 ? 60 : 30'
      );
      ScribeCustomRules('features.Strength Bonus',
        'pathLevels.Giantblooded', '+', 'Math.floor((source - 5) / 5)'
      );
      ScribeCustomRules('skillNotes.intimidatingSizeFeature',
        'pathLevels.Giantblooded', '+=',
        'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
      );
      ScribeCustomRules
        ('skills.Intimidate', 'skillNotes.intimidatingSizeFeature', '+', null);
      ScribeCustomChoices('weapons', 'Boulder:d10 R30');
      ScribeCustomRules
        ('weapons.Boulder', 'combatNotes.rockThrowingFeature', '=', '1');
      ScribeCustomRules('weaponDamage.Boulder',
        'pathLevels.Giantblooded', '=',
        'source >= 16 ? "2d8" : source >= 9 ? "2d6" : "d10"'
      );

    } else if(path == 'Guardian') {

      features = [
        1, 'Inspire Valor', 2, 'Detect Evil', 3, 'Righteous Fury',
        4, 'Smite Evil', 5, 'Constitution Bonus', 6, 'Lay On Hands',
        12, 'Aura Of Courage', 16, 'Death Ward'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.righteousFuryFeature:' +
          'Ignore %V points melee damage reduction vs. evil foe',
        'combatNotes.smiteEvilFeature:' +
          '%V/day add conMod to attack, level to damage vs. evil foe',
        'featureNotes.inspireValorFeature:' +
          'Allies w/in 30 ft bonus attack/fear saves 1 round/level %V',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'saveNotes.auraOfCourageFeature:' +
          'Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.deathWardFeature:Immune to negative energy/death effects'
      ];
      ScribeCustomRules('features.Constitution Bonus',
        'pathLevels.Guardian', '+', 'Math.floor((source - 5) / 5)'
      );
      ScribeCustomRules('combatNotes.righteousFuryFeature',
        'pathLevels.Guardian', '+=',
        'source >= 17 ? 12 : source >= 12 ? 9 : ' +
        '(Math.floor((source + 1) / 4) * 3)'
      );
      ScribeCustomRules('combatNotes.smiteEvilFeature',
        'pathLevels.Guardian', '+=',
        'source >= 18 ? 4 : source >= 14 ? 3 : source >= 8 ? 2 : 1'
      );
      ScribeCustomRules('featureNotes.inspireValorFeature',
        'pathLevels.Guardian', '=',
        'source >= 19 ? "+2 3/day" : source >= 13 ? "+2 2/day" : ' +
        'source >= 9 ? "+1 2/day" : "+1 1/day"'
      );
      ScribeCustomRules('magicNotes.layOnHandsFeature',
        'pathLevels.Guardian', '+=', null,
        'charismaModifier', '*', null
      );

    } else if(path == 'Healer') {

      features = null;
      spellFeatures = [
        1, 'Cure Light Wounds', 2, 'Restoration', 3, 'Cure Light Wounds',
        4, 'Cure Moderate Wounds', 5, 'Remove Disease',
        6, 'Cure Moderate Wounds', 7, 'Cure Serious Wounds',
        8, 'Remove Blindness/Deafness', 9, 'Cure Serious Wounds',
        10, 'Cure Critical Wounds', 11, 'Neutralize Poison',
        12, 'Cure Critical Wounds', 13, 'Mass Cure Light Wounds',
        14, 'Restoration', 15, 'Mass Cure Light Wounds', 16, 'Heal',
        17, 'Restoration', 18, 'Heal', 19, 'Regenerate', 20, 'Raise Dead'
      ];
      notes = null;

    } else if(path == 'Ironborn') {

      features = [
        1, 'Incredible Resilience', 2, 'Fortitude Bonus', 3, 'Natural Armor',
        4, 'Improved Healing', 5, 'Damage Reduction',
        6, 'Elemental Resistance', 9, 'Indefatigable',
        14, 'Greater Improved Healing', 9, 'Improved Indefatigable',
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.naturalArmorFeature:+%V AC',
        'combatNotes.greaterImprovedHealingFeature:' +
          'Regain 1 point ability damage/hour',
        'combatNotes.improvedHealingFeature:Regain %V HP/hour',
        'combatNotes.incredibleResisilenceFeature:Improved hit die',
        'saveNotes.elementalResistanceFeature:' +
          '%V resistance to acid/cold/electricity/fire',
        'saveNotes.fortitudeBonusFeature:%V added to fortitude saves',
        'saveNotes.indefatigableFeature:Immune fatigue effects',
        'saveNotes.improvedIndefatigableFeature:Immune exhaustion effects'
      ];
      ScribeCustomRules('combatNotes.damageReductionFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('combatNotes.improvedHealingFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 2)'
      );
      ScribeCustomRules('combatNotes.naturalArmorFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules('features.Fortitude Bonus',
        'pathLevels.Ironborn', '+=', 'Math.floor((source - 2) / 5)'
      );
      ScribeCustomRules('saveNotes.elementalResistanceFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor((source - 1) / 5) * 3'
      );

    } else if(path == 'Jack-Of-All-Trades') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
        'Jack-Of-All-Trades:Strength Bonus/Intelligence Bonus/Wisdom Bonus/' +
        'Dexterity Bonus/Constitution Bonus/Charisma Bonus';
      features = [
        2, 'Spontaneous Spell', 3, 'Skill Boost', 4, 'Ability Boost',
        5, 'Save Boost', 7, 'Bonus feat'
      ];
      spellFeatures = [
        1, 'W0', 6, 'W1', 10, 'W2', 13, 'W1', 19, 'W2'
      ];
      notes = [
        'magicNotes.spontaneousSpellFeature:' +
          'Use %V spell as spell like ability 1/day',
        'skillNotes.skillBoostFeature:+4 to %V chosen skills'
      ];
      ScribeCustomRules('features.Bonus Feat',
        'pathLevels.Jack-Of-All-Trades', '+=', 'source >= 14 ? 1 : null'
      );
      ScribeCustomRules('magicNotes.spontaneousSpellFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 19 ? "W0/W1/W2" : source >= 13 ? "W0/W1" : "W0"'
      );
      ScribeCustomRules('selectableFeatureCount.Jack-Of-All-Trades',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 18 ? 7 : source >= 15 ? 6 : source >= 12 ? 5 : ' +
        'source >= 9 ? 4 : source >= 8 ? 3 : source >= 5 ? 2 : 1'
      );
      ScribeCustomRules('skillNotes.skillBoostFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 20 ? 4 : source >= 17 ? 3 : source >= 11 ? 2 : 1'
      );

    } else if(path == 'Mountainborn') {

      features = [
        1, 'Mountaineer', 3, 'Ambush', 4, 'Rallying Cry',
        5, 'Constitution Bonus', 8, 'Improved Ambush', 18, 'Greater Ambush'
      ];
      spellFeatures = [
        2, 'Endure Elements', 7, 'Pass Without Trace', 12, 'Meld Into Stone',
        17, 'Stone Tell'
      ];
      notes = [
        'combatNotes.greaterAmbushFeature:' +
          'Reduced Hide penalty for using ranged weapons',
        'combatNotes.improvedAmbushFeature:' +
           'Allies +2 damage vs. flat-footed foes on surprise/1st melee rounds',
        'combatNotes.rallyingCryFeature:' +
          'Allies not flat-footed/+4 vs. surprise %V/day',
        'skillNotes.ambushFeature:Allies use character\'s Hide for ambush',
        'skillNotes.mountaineerFeature:+%V Balance/Climb/Jump',
        'skillNotes.mountaineerFeature2:+%V Survival (mountains)'
      ];
      ScribeCustomRules('combatNotes.rallyingCryFeature',
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('features.Constitution Bonus',
        'pathLevels.Mountainborn', '+', 'Math.floor((source - 5) / 5)'
      );
      ScribeCustomRules('skillNotes.mountaineerFeature',
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 2) * 2'
      );
      ScribeCustomRules('skillNotes.mountaineerFeature2',
        'features.Mountaineer', '?', null,
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 2) * 2'
      );

    } else if(path == 'Naturefriend') {

      features = [
        1, 'Natural Bond', 5, 'Animal Friend', 10, 'Plant Friend',
        15, 'Elemental Friend', 20, 'One With Nature'
      ];
      spellFeatures = [
        2, 'Calm Animals', 3, 'Entangle', 4, 'Obscuring Mist',
        6, 'Animal Messenger', 7, 'Wood Shape', 8, 'Gust Of Wind',
        9, 'Speak With Animals', 11, 'Speak With Plants', 12, 'Call Lightning',
        13, 'Dominate Animal', 14, 'Spike Growth', 16, 'Sleet Storm',
        17, 'Summon Nature\'s Ally IV', 18, 'Command Plants', 19, 'Ice Storm'
      ];
      notes = [
        'combatNotes.animalFriendFeature:Animals DC %V Will save to attack',
        'combatNotes.elementalFriendFeature:' +
          'Elementals DC %V Will save to attack',
        'combatNotes.plantFriendFeature:Plants DC %V Will save to attack',
        'featureNotes.naturalBondFeature:' +
          'Wild Empathy/Knowledge (Nature) and Survival are class skills',
        'magicNotes.oneWithNatureFeature:<i>Commune With Nature</i> at will',
        'skillNotes.animalFriendFeature:+4 Handle Animal',
        'skillNotes.elementalFriendFeature:+4 Diplomacy (elementals)',
        /* TODO Only if otherwise class skill */
        'skillNotes.naturalBondFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.plantFriendFeature:+4 Diplomacy (plants)'
      ];
      ScribeCustomRules('combatNotes.animalFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      ScribeCustomRules('combatNotes.elementalFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      ScribeCustomRules('combatNotes.plantFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      ScribeCustomRules
        ('features.Wild Empathy', 'featureNotes.naturalBondFeature', '=', '1');
      ScribeCustomRules('classSkills.Knowledge (Nature)',
        'featureNotes.naturalBondFeature', '=', '1'
      );
      ScribeCustomRules
        ('classSkills.Survival', 'featureNotes.naturalBondFeature', '=', '1');

    } else if(path == 'Northblooded') {

      features = [
        1, 'Northborn', 2, 'Cold Resistance', 3, 'Battle Cry',
        4, 'Howling Winds', 5, 'Constitution Bonus', 6, 'Aura Of Warmth',
        11, 'Improved Battle Cry', 13, 'Frost Weapon', 16, 'Cold Immunity',
        18, 'Icy Burst Weapon'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.battleCryFeature:%V bonus hit points after cry',
        'combatNotes.frostWeaponFeature:Additional d6 cold damage on hit',
        'combatNotes.improvedBattleCryFeature:+1 attack/damage',
        'combatNotes.icyBurstWeaponFeature:' +
          'Additional d10 cold damage/critical hit die on critical hit',
        'featureNotes.northbornFeature:Wild Empathy (cold)',
        'magicNotes.auraOfWarmthFeature:Allies w/in 10 ft +4 Fortitude vs cold',
        'magicNotes.howlingWindsFeature:' +
          '<i>Commune With Nature</i> (winds) %V/day',
        'saveNotes.coldResistanceFeature:ignore first %V cold damage',
        'saveNotes.northbornFeature:Immune to non-lethal cold/exposure',
        'skillNotes.northbornFeature:' +
          '+2 Survival (cold)/Wild Empathy (cold natives)'
      ];
      ScribeCustomRules
        ('combatNotes.battleCryFeature', 'pathLevels.Northblooded', '=', null);
      ScribeCustomRules('combatNotes.frostWeaponFeature',
        'pathLevels.Northblooded', '=', null
      );
      ScribeCustomRules('combatNotes.greaterFrostWeaponFeature',
        'pathLevels.Northblooded', '=', null
      );
      ScribeCustomRules
        ('features.Wild Empathy', 'featureNotes.northbornFeature', '=', '1');
      ScribeCustomRules('magicNotes.howlingWindsFeature',
        'pathLevels.Northblooded', '+=',
        'source >= 12 ? 3 : source >= 8 ? 2 : 1'
      );
      ScribeCustomRules('saveNotes.coldResistanceFeature',
        'pathLevels.Northblooded', '+=', 'source >= 9 ? 15 : 5'
      );

    } else if(path == 'Painless') {

      features = [
        1, 'Painless', 2, 'Nonlethal Damage Reduction', 3, 'Uncaring Mind',
        4, 'Retributive Rage', 5, 'Ferocity', 9, 'Last Stand',
        10, 'Increased Damage Threshold', 14, 'Improved Retributive Rage'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.ferocityFeature:Remain conscious below 0 HP',
        'combatNotes.improvedRetributiveRageFeature:' +
          '+%V next round damage after suffering 2 * level damage',
        'combatNotes.increasedDamageThresholdFeature:' +
          'Continue fighting until -%V HP',
        'combatNotes.nonlethalDamageReductionFeature:%V',
        'combatNotes.painlessFeature:+%V HP',
        'combatNotes.retributiveRageFeature:' +
          '+%V attack next round after suffering 2 * level damage',
        'saveNotes.painlessFeature:+%V vs. pain effects',
        'saveNotes.uncaringMindFeature:+%V vs. enchantment'
      ];
      ScribeCustomRules('combatNotes.increasedDamageThresholdFeature',
        'pathLevels.Painless', '+=',
        'source >= 20 ? 25 : source >= 15 ? 20 : 15'
      );
      ScribeCustomRules('combatNotes.nonlethalDamageReductionFeature',
        'pathLevels.Painless', '+=', 'Math.floor((source + 3) / 5) * 3'
      );
      ScribeCustomRules
        ('combatNotes.painlessFeature', 'pathLevels.Painless', '+=', null);
      ScribeCustomRules('hitPoints', 'combatNotes.painlessFeature', '+', null);
      ScribeCustomRules
        ('resistance.Enchantment', 'saveNotes.uncaringMindFeature', '+=', null);
      ScribeCustomRules
        ('resistance.Pain', 'saveNotes.painlessFeature', '+=', null);
      ScribeCustomRules('saveNotes.uncaringMindFeature',
        'pathLevels.Painless', '+=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules('saveNotes.painlessFeature',
        'pathLevels.Painless', '=', 'Math.floor((source + 4) / 5) * 5'
      );

    } else if(path == 'Pureblood') {

      MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
        'Pureblood:Strength Bonus/Intelligence Bonus/Wisdom Bonus/' +
        'Dexterity Bonus/Constitution Bonus/Charisma Bonus';
      features = [
        1, 'Master Adventurer', 2, 'Blood Of Kings', 3, 'Bonus Feat',
        4, 'Skill Mastery'
      ];
      spellFeatures = null;
      notes =[
        'abilityNotes.abilityBonusFeature:+1 to %V different abilities',
        'featureNotes.skillMasteryFeature:Skill Mastery with %V chosen skills',
        'skillNotes.bloodOfKingsFeature:' +
          'Daily +%V on charisma skills in shadow or resistance interactions',
        'skillNotes.masterAdventurerFeature:+%V on three selected skills'
      ];
      ScribeCustomRules('abilityNotes.abilityBonusFeature',
        'pathLevels.Pureblooded', '+=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('featCount',
        'featureNotes.skillMasteryFeature', '+', null
      );
      ScribeCustomRules('features.Bonus Feat',
        'pathLevels.Pureblooded', '+=', 'Math.floor((source - 3) / 5)'
      );
      ScribeCustomRules('featureNotes.skillMasteryFeature',
        'pathLevels.Pureblooded', '+=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('selectableFeatureCount.Pureblooded',
        'pathLevels.Pureblooded', '=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('skillNotes.bloodOfKingsFeature',
        'pathLevels.Pureblooded', '+=', 'Math.floor((source + 3) / 5) * 2'
      );
      ScribeCustomRules('skillNotes.masterAdventurerFeature',
        'pathLevels.Pureblooded', '+=', 'Math.floor((source + 4) / 5) * 2'
      );

    } else if(path == 'Quickened') {

      features = [
        1, 'Initiative Bonus', 2, 'Dodge Bonus', 3, 'Fast Movement',
        4, 'Burst Of Speed', 5, 'Dex Bonus'
      ];
      spellFeatures = null;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.burstOfSpeedFeature:' +
          'Extra attack/move action for 3+conMod rounds %V/day',
        'combatNotes.dodgeBonusFeature:+%V AC',
        'combatNotes.initiativeBonusFeature:+%V initiative'
      ];
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 3) / 5) * 5'
      );
      ScribeCustomRules
        ('armorClass', 'combatNotes.dodgeBonusFeature', '+', null);
      ScribeCustomRules('combatNotes.burstOfSpeedFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('combatNotes.dodgeBonusFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 3) / 5)'
      );
      ScribeCustomRules('combatNotes.initiativeBonusFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 4) / 5) * 2'
      );
      ScribeCustomRules
        ('initiative', 'combatNotes.initiativeBonusFeature', '+', null);

    } else if(path == 'Seaborn') {

      features = [
        1, 'Dolphin\'s Grace', 2, 'Deep Lungs', 3, 'Aquatic Blindsight',
        4, 'Aquatic Ally', 10, 'Aquatic Adaptation', 14, 'Cold Resistance',
        17, 'Aquatic Emissary', 18, 'Assist Allies'
      ];
      spellFeatures = [
        4, 'Aquatic Ally II', 5, 'Blur', 8, 'Aquatic Ally III', 9, 'Fog Cloud',
        12, 'Aquatic Ally IV', 13, 'Displacement', 16, 'Aquatic Ally V',
        20, 'Aquatic Ally VI'
      ];
      notes = [
        'magicNotes.aquaticAllyFeature:Cast <i>Aquatic Ally</i> spells %V/day',
        'skillNotes.aquaticAdaptationFeature:' +
           'Breathe through gills/no underwater pressure damage',
        'skillNotes.aquaticBlindsightFeature:' +
           'Detect creatures in opaque water up to %V feet',
        'skillNotes.aquaticEmmisaryFeature:Speak to all aquatic animals',
        'skillNotes.assistAlliesFeature:' +
          'Allies move through water at full speed/give oxygen to allies',
        'skillNotes.dolphin\'sGraceFeature:+%V Swim speed/+8 Swim hazards',
        'skillNotes.deepLungsFeature:Hold breath for %V rounds'
      ];
      ScribeCustomRules('magicNotes.aquaticAllyFeature',
        'pathLevels.Seaborn', '+=', 'Math.floor(source / 4)'
      );
      ScribeCustomRules('skillNotes.aquaticBlindsightFeature',
        'pathLevels.Seaborn', '+=', 'Math.floor((source + 5) / 8) * 30'
      );
      ScribeCustomRules('skillNotes.deepLungsFeature',
        'pathLevels.Seaborn', '+=', 'source >= 6 ? 4 : 3',
        'constitution', '*', null
      );
      ScribeCustomRules('skillNotes.dolphin\'sGraceFeature',
        'pathLevels.Seaborn', '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
      );

    } else if(path == 'Seer') {

      features = [3, 'Seer Sight'];
      spellFeatures = [
        1, 'Alarm', 2, 'Augury', 4, 'Clairaudience/Clairvoyance',
        5, 'Locate Object', 7, 'Locate Creature', 8, 'Speak With Dead',
        10, 'Divination', 11, 'Scrying', 13, 'Arcane Eye', 14, 'Divincation',
        16, 'Prying Eyes', 17, 'Legend Lore', 19, 'Commune', 20, 'Vision'
      ];
      notes = [
        'magicNotes.seerSightFeature:' +
          'Discern recent history of touched object %V/day'
      ];
      ScribeCustomRules('magicNotes.seerSightFeature',
        'pathLevels.Seer', '=', 'Math.floor((source + 6) / 6)'
      );

    } else if(path == 'Speaker') {

      features = [
        2, 'Persuasive Speaker', 3, 'Power Words', 5, 'Charisma Bonus',
        14, 'Language Savant'
      ];
      spellFeatures = [
        1, 'Comprehend Languages', 4, 'Whispering Wind', 8, 'Tongues',
        12, 'Shout', 18, 'Greater Shout'
      ];
      notes = [
        'magicNotes.powerWordsFeature:%V 3+conMod/day',
        'skillNotes.languageSavantFeature:' +
          'Fluent in any language after listening for 10 minutes',
        'skillNotes.persuasiveSpeakerFeature:+%V on verbal charisma skills'
      ];
      ScribeCustomRules('features.Charisma Bonus',
        'pathLevels.Speaker', '+', 'Math.floor((source - 5) / 5)'
      );
/* TODO
      ScribeCustomFeatures('pathLevels.Speaker', 'magicNotes.powerWordsFeature',
        [3, 'Opening', 6, 'Shattering', 9, 'Silence', 13, 'Slumber',
         16, 'Charming', 19, 'Holding']
      );
*/
      ScribeCustomRules('skillNotes.persuasiveSpeakerFeature',
        'pathLevels.Speaker', '=',
        'source >= 17 ? 8 : source >= 11 ? 6 : source >= 7 ? 4 : 2'
      );

    } else if(path == 'Spellsoul') {

      features = [
        1, 'Untapped Potential', 2, 'Metamagic Aura',
        3, 'Improved Spell Resistance', 4, 'Bonus Raw Energy'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.metamagicAuraFeature:Affect spells w/in 30 ft %V/day',
        'magicNotes.metamagicAuraFeature2:%V to spells up to 1/2 level',
        'magicNotes.untappedPotentialFeature:' +
          'Contribute %V points to others\' spells w/in 30 ft',
        'saveNotes.improvedSpellResistanceFeature:+%V vs. spells'
      ];
/*
      ScribeCustomFeatures(
        'pathLevels.Spellsoul', 'magicNotes.metamagicAuraFeature2',
        [2, 'Enlarge', 5, 'Extend', 8, 'Reduce', 11, 'Attract', 14, 'Empower',
         17, 'Maximize', 20, 'Redirect']
      );
*/
      ScribeCustomRules('untappedPotentialHighestModifier',
        'features.Untapped Potential', '?', null,
        'charismaModifier', '^=', null,
        'intelligenceModifier', '^=', null,
        'wisdomModifier', '^=', null
      );
      ScribeCustomRules('magicNotes.metamagicAuraFeature',
        'pathLevels.Spellsoul', '+=', 'source>=15?4:source>=10?3:source>=6?2:1'
      );
      ScribeCustomRules('magicNotes.untappedPotentialFeature',
        'untappedPotentialHighestModifier', '=', 'source + 1',
        'pathLevels.Spellsoul', '+',
          'source>=18 ? 8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : 0'
      );
      ScribeCustomRules('resistance.Spell',
        'saveNotes.improvedSpellResistanceFeature', '+=', null
      );
      ScribeCustomRules('saveNotes.improvedSpellResistanceFeature',
        'pathLevels.Spellsoul', '=',
        'source>=19 ? 5 : source>=16 ? 4 : source>=12 ? 3 : source>=7 ? 2 : ' +
        'source >= 3 ? 1 : 0'
      );

    } else if(path == 'Shadow Walker') {

      features = [
        1, 'Improved Darkvision', 2, 'Shadow Veil', 4, 'Shadow Jump',
        11, 'Hide In Plain Sight'
      ];
      spellFeatures = [
        3, 'Expeditious Retreat', 5, 'Blur', 7, 'Undetectable Alignment',
        9, 'Displacement', 13, 'Expeditious Retreat', 15, 'Blur',
        17, 'Undectable Alignment', 19, 'Displacement'
      ];
      notes = [
        'featureNotes.improvedDarkvisionFeature:+60 ft',
        'featureNotes.shadowJumpFeature:Move %V ft between shadows',
        'skillNotes.shadowVeilFeature:+%V Hide'
      ];
      ScribeCustomRules('featureNotes.shadowJumpFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor(source / 4) * 10'
      );
      ScribeCustomRules('skillNotes.shadowVeilFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor((source + 2) / 4) * 2'
      );

    } else if(path == 'Steelblooded') {

      features = [
        1, 'Bonus Feat', 2, 'Offensive Tactics', 3, 'Strategic Blow',
        4, 'Skilled Warrior', 14, 'Untouchable', 19, 'Improved Untouchable'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.improvedUntouchableFeature:' +
           'No foe AOO from move/standard/full-round actions',
        'combatNotes.offensiveTacticsFeature:' +
          '+%V to first attack or all damage when using full attack action',
        'combatNotes.skilledWarriorFeature:' +
           'Half penalty from %V choices of Fighting Defensively/Grapple ' +
           'Attack/Non-proficient Weapon/Two-Weapon Fighting',
        'combatNotes.strategicBlowFeature:Ignore %V points of damage reduction',
        'combatNotes.untouchableFeature:No foe AOO from special attacks'
      ];
      ScribeCustomRules('combatNotes.offensiveTacticFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=17 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.skilledWariorFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=18 ? 4 : source>=13 ? 3 : source>=8 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.stategicBlowFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=16 ? 15 : source>=12 ? 12 : source>=9 ? 9 : source>=6 ? 6 : 3'
      );
      ScribeCustomRules('features.Bonus Feat',
        'pathLevels.Steelblooded', '+=', 'Math.floor(source / 5)'
      );

    } else if(path == 'Sunderborn') {

      features = [
        1, 'Detect Outsider', 2, 'Blood Of The Planes', 4, 'Planar Fury',
        7, 'Darkvision', 13, 'Magical Darkvision', 19, 'Invisibility Vision'
      ];
      spellFeatures = [
        3, 'Summon Monster I', 6, 'Summon Monster II', 9, 'Summon Monster III',
        12, 'Summon Monster IV', 15, 'Summon Monster V', 18, 'Summon Monster VI'
      ];
      notes = [
        'combatNotes.planarFuryFeature:' +
          '+2 strength/constitution/+1 Will save/-1 AC 5+conMod rounds %V/day',
        'featureNotes.magicalDarkvisionFeature:See perfectly in any darkness',
        'featureNotes.invisibilityVision:See invisible creatures',
        'magicNotes.detectOutsiderFeature:Detect outsiders at will',
        'skillNotes.bloodOfThePlanesFeature:' +
          '+%V on charisma skills when dealing with outsiders'
      ];
      ScribeCustomRules('combatNotes.planarFuryFeature',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 2) / 6)'
      );
      ScribeCustomRules('skillNotes.bloodOfThePlanesFeature',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 1) / 3) * 2'
      );

    } else if(path == 'Tactician') {

      features = [
        1, 'Aid Another', 2, 'Combat Overview', 3, 'Coordinated Initiative',
        4, 'Coordinated Attack', 13, 'Directed Attack', 18, 'Telling Blow',
        20, 'Perfect Assault'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.aidAnotherFeature:' +
          'Aid another as a move action; +%V bonus to ally attack or AC',
        'combatNotes.combatOverviewFeature:' +
          'Ally w/in 60 ft avoid AOO/flat-footed or foe flat-footed %V/day',
        'combatNotes.coordinatedAttackFeature:' +
          'Allies w/in 30 ft attack single foe at +1/participant (+5 max) ' +
          '%V/day',
        'combatNotes.coordinatedInitiativeFeature:' +
          'Allies w/in 30 ft use character\'s initiative %V/day',
        'combatNotes.directedAttackFeature:' +
          'Allies w/in 30 ft add 1/2 character\'s base attack 1/day',
        'combatNotes.perfectAssaultFeature:' +
          'Allies w/in 30 ft threaten critical on any hit 1/day',
        'combatNotes.tellingBlowFeature:Allies w/in 30 ft re-roll damage 1/day'
      ];
      ScribeCustomRules('combatNotes.aidAnotherFeature',
        'pathLevels.Tactician', '+=',
        'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : 0'
      );
      ScribeCustomRules('combatNotes.combatOverviewFeature',
        'pathLevels.Tactician', '+=',
        'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.coordinatedAttackFeature',
        'pathLevels.Tactician', '+=',
        'source>=17 ? 4 : source==16 ? 3 : Math.floor(source / 4)'
      );
      ScribeCustomRules('combatNotes.coordinatedInitiativeFeature',
        'pathLevels.Tactician', '+=',
        'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );

    } else if(path == 'Warg') {

      features = [
        1, 'Wild Empathy', 2, 'Animal Companion', 3, 'Wild Sense',
        5, 'Wild Shape', 13, 'Ferocity', 20, 'Blindsense'
      ];
      spellFeatures = [
        4, 'Charm Animal', 7, 'Speak With Animals', 12, 'Charm Animal',
        17, 'Speak With Animals'
      ];
      notes = null;
      ScribeCustomRules('features.Animal Companion',
        'pathLevels.Warg', '+', 'Math.floor((source - 2) / 4)'
      );
      ScribeCustomRules('magicNotes.wildShapeFeature',
        'pathLevels.warg', '=',
        'source >= 19 ? "Medium-huge 3/day" : ' +
        'source >= 15 ? "Medium-large 3/day" : ' +
        'source >= 11 ? "Medium-large 2/day" : ' +
        'source >= 8 ? "Medium 2/day" : ' +
        'source >= 5 ? "Medium 1/day" : null'
      );
      ScribeCustomRules('selectableFeatureCount.Warg',
        'pathLevels.Warg', '=', 'source >= 16 ? 3 : source >= 9 ? 2 : 1'
      );

    } else
      continue;

    var prefix =
      name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
    if(features != null) {
      for(var j = 1; j < features.length; j += 2) {
        var feature = features[j];
        var level = features[j - 1];
        ScribeCustomRules(prefix + 'Features.' + feature,
          'heroicPath', '?', 'source == "' + name + '"',
          'level', '=', 'source >= ' + level
        );
        ScribeCustomRules
          ('features.' + feature, prefix + 'Features.' + feature, '=', '1');
      }
      ScribeCustomSheet
        (name + ' Features', 'FeaturesAndSkills', null, 'Feats', ' * ');
    }
    if(spellFeatures != null) {
      for(var j = 1; j < spellFeatures.length; j += 2) {
        var spell = '<i>' + spellFeatures[j] + '</i>';
        var level = spellFeatures[j - 1];
        ScribeCustomRules(prefix + 'Spells.' + spell,
          'heroicPath', '?', 'source == "' + name + '"',
          'level', '=', 'source >= ' + level
        );
      }
      ScribeCustomSheet(name + ' Spells', 'Magic', null, 'Spells', ' * ');
    }
    if(notes != null)
      ScribeCustomNotes(notes);
    ScribeCustomRules('pathLevels.' + path,
      'heroicPath', '?', 'source == "' + path + '"',
      'level', '=', null
    );

  }
  ScribeCustomSheet('Heroic Path', 'Description', null, 'Alignment');

};

MN2E.MagicRules = function() {

  ScribeCustomSheet
    ('Spell Energy Points', 'SpellStats', '<b>Spell Energy Points</b>: %V',
     'Spells Per Day');

};

MN2E.RaceRules = function() {

  /* Notes and rules that apply to multiple races */
  var notes = [
    'abilityNotes.naturalMountaineerFeature:' +
       'Unimpeded movement in mountainous terrain',
    'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
    'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
    'featureNotes.naturalChannelerFeature:Innate Magic',
    'magicNotes.spellResistanceFeature:-2 spell energy',
    'saveNotes.coldHardyFeature:+5 cold/half nonlethal damage',
    'saveNotes.hardyFeature:+1 Fortitude',
    'saveNotes.luckyFeature:+1 all saves',
    'saveNotes.poisonResistanceFeature:+2 vs. poison',
    'saveNotes.spellResistanceFeature:+2 vs. spells',
    'skillNotes.dextrousHandsFeature:+2 Heal',
    'skillNotes.dextrousHandsFeature2:+2 Craft (non-metal/non-wood)',
    'skillNotes.improvedNaturalSwimmerFeature:' +
       '+8 special action or avoid hazard/always take 10/run',
    'skillNotes.keenSensesFeature:+2 Listen/Search/Spot',
    'skillNotes.naturalMountaineerFeature:+2 Climb',
    'skillNotes.naturalSwimmerFeature:' +
       'Swim at half speed as move action/hold breath for %V rounds',
    'skillNotes.naturalRiverfolkFeature:' +
      '+2 Perform/Profession (Sailor)/Swim/Use Rope',
    'skillNotes.stonecunningFeature:' +
      '+2 Search involving stone or metal/automatic check w/in 10 ft',
    'skillNotes.stoneFamiliarityFeature:' +
       '+2 Appraise/Craft involving stone or metal',

    'skillNotes.favoredRegion:' +
      'Knowledge (local) is a class skill/+2 Survival/Knowldedge (Nature)'

  ];
  ScribeCustomNotes(notes);
  ScribeCustomRules
    ('resistance.Poison', 'saveNotes.poisonResistanceFeature', '+=', '2');
  ScribeCustomRules
    ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');

  ScribeCustomRules
    ('features.Innate Magic', 'featureNotes.naturalChannelerFeature', '=', '1');
  ScribeCustomRules
    ('holdBreathMultiplier', 'race', '=', 'source == "Sea Elf" ? 6 : 3');
  ScribeCustomRules
    ('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
  ScribeCustomRules
    ('skillNotes.dextrousHandsFeature2', 'features.Dextrous Hands', '=', '1');
  ScribeCustomRules
    ('spellEnergyPoints', 'magicNotes.spellResistanceFeature', '+', '-2');
  ScribeCustomRules('skillNotes.naturalSwimmerFeature',
    'constitution', '=', 'source',
    'holdBreathMultiplier', '*', null
  );
  ScribeCustomRules('save.Fortitude', 'saveNotes.luckyFeature', '+', '1');
  ScribeCustomRules('save.Reflex', 'saveNotes.luckyFeature', '+', '1');
  ScribeCustomRules('save.Will', 'saveNotes.luckyFeature', '+', '1');

  for(var i = 0; i < MN2E.RACES.length; i++) {

    var adjustment;
    var features = null;
    var notes = null;
    var race = MN2E.RACES[i];

    if(race == 'Dorn') {

      adjustment = '+2 strength/-2 intelligence';
      features = [1, 'Brotherhood', 1, 'Cold Hardy', 1, 'Fierce', 1, 'Hardy'];
      notes = [
        'combatNotes.brotherhoodFeature:' +
          '+1 attack when fighting alongside 4+ Dorns',
        'combatNotes.fierceFeature:+1 attack w/two-handed weapons'
      ];
      ScribeCustomRules
        ('featCount', 'featureNotes.dornFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.dornFeatCountBonus',
        'race', '=', 'source == "Dorn" ? 1 : null'
      );
      ScribeCustomRules('skillNotes.dornSkillPointsBonus',
        'race', '?', 'source == "Dorn"',
        'level', '=', 'source + 3'
      );
      ScribeCustomRules
        ('skillPoints', 'skillNotes.dornSkillPointsBonus', '+', null);

    } else if(race.indexOf(' Dwarf') >= 0) {

      adjustment = '+2 constitution/-2 charisma';
      features = [
        1, 'Darkvision', 1, 'Dwarf Favored Enemy', 1, 'Dwarf Favored Weapon',
        1, 'Poison Resistance', 1, 'Resilient', 1, 'Slow',
        1, 'Spell Resistance', 1, 'Stone Familiarity'
      ];
      notes = [
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'combatNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'combatNotes.resilientFeature:+2 AC'
      ];
      ScribeCustomRules('abilityNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      ScribeCustomRules('armorClass', 'combatNotes.resilientFeature', '+', '2');
      if(race == 'Clan Dwarf') {
        features = features.concat([
          1, 'Dodge Orcs', 1, 'Know Depth', 1, 'Stability', 1, 'Stonecunning'
        ]);
        notes = notes.concat([
          'featureNotes.knowDepthFeature:Intuit approximate depth underground',
          'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
        ]);
      } else if(race == 'Kurgun Dwarf') {
        features = features.concat([
          1, 'Natural Mountaineer'
        ]);
      }

    } else if(race.indexOf(' Dwarrow') >= 0) {

      adjustment = '+2 charisma';
      features = [
        1, 'Darkvision', 1, 'Poison Resistance', 1, 'Small', 1, 'Slow',
        1, 'Spell Resistance', 1, 'Sturdy'
      ];
      notes = [
        'combatNotes.sturdyFeature:+1 AC'
      ];
      ScribeCustomRules('armorClass', 'combatNotes.sturdyFeature', '+', '1');
      if(race == 'Clan Raised Dwarrow') {
        features = features.concat([
          1, 'Dodge Orcs', 1, 'Stonecunning', 1, 'Stone Familiarity'
        ]);
      } else if(race == 'Gnome Raised Dwarrow') {
        features = features.concat([
          1, 'Natural Riverfolk', 1, 'Natural Swimmer', 1, 'Skilled Trader'
        ]);
        notes = [
          'skillNotes.skilledTraderFeature:' +
            '+2 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
        ];
      } else if(race == 'Kurgun Raised Dwarrow') {
        features = features.concat([
          1, 'Dodge Orcs', 1, 'Natural Mountaineer', 1, 'Stone Familiarity'
        ]);
      }

    } else if(race.indexOf(' Dworg') >= 0) {

      adjustment = '+2 strength/+2 constitution/-2 intelligence/-2 charisma';
      features = [
        1, 'Darkvision', 1, 'Dworg Favored Enemy',
        1, 'Minor Light Sensitivity', 1, 'Rugged', 1, 'Spell Resistance'
      ];
      notes = [
        'combatNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'combatNotes.minorLightSensitivityFeature:DC 15 Fortitude save in sunlight to avoid -1 attack',
        'saveNotes.ruggedFeature:+2 all saves'
      ];
      ScribeCustomRules('save.Fortitude', 'saveNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('save.Reflex', 'saveNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('save.Will', 'saveNotes.ruggedFeature', '+', '2');
      if(race == 'Clan Raised Dworg') {
        features = features.concat([1, 'Stonecunning']);
      } else if(race == 'Kurgun Raised Dworg') {
        features = features.concat([1, 'Natural Mountaineer']);
      }

    } else if(race.indexOf(' Elfling') >= 0) {

      adjustment = '+4 dexterity/-2 strength/-2 constitution';
      features = [
        1, 'Dextrous Hands', 1, 'Keen Senses', 1, 'Low Light Vision',
        1, 'Lucky', 1, 'Natural Channeler', 1, 'Nimble', 1, 'Small'
      ];
      notes = [
        'skillNotes.nimbleFeature:+2 Climb/Hide'
      ];
      if(race == 'Halfling Raised Elfling') {
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat'
        ]);
        features = features.concat([1, 'Bound To The Beast']);
        ScribeCustomRules('features.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
        );
      }

    } else if(race.indexOf(' Elf') >= 0) {

      adjustment = '+2 dexterity/-2 constitution';
      features = [
        1, 'Enchantment Resistance', 1, 'Gifted Channeler', 1, 'Keen Senses',
        1, 'Low Light Vision', 1, 'Natural Channeler', 1, 'Tree Climber'
      ];
      notes = [
        'magicNotes.giftedChannelerFeature:+2 spell energy',
        'magicNotes.improvedNaturalChannelerFeature:Bonus spell',
        'saveNotes.enchantmentResistanceFeature:+2 vs. enchantments',
        'skillNotes.treeClimberFeature:+4 Balance (trees)/Climb (trees)'
      ];
      ScribeCustomRules('resistance.Enchantment',
        'saveNotes.enchantmentResistanceFeature', '+=', '2'
      );
      ScribeCustomRules
        ('spellEnergyPoints', 'magicNotes.giftedChannelerFeature', '+', '2');

      if(race == 'Jungle Elf') {
        features = features.concat([
          1, 'Feral Elf', 1, 'Improved Natural Channeler', 1, 'Spirit Foe'
        ]);
        notes = notes.concat([
          'saveNotes.spiritFoeFeature:+2 vs. outsiders',
          'skillNotes.feralElfFeature:+2 Listen/Search/Spot',
          'skillNotes.feralElfFeature2:+2 Balance (trees)/Climb (trees)',
          'skillNotes.spiritFoeFeature:+4 Hide (nature)/Move Silently (nature)'
        ]);
        ScribeCustomRules
          ('skillNotes.feralElfFeature2', 'features.Feral Elf', '=', '1');
      } else if(race == 'Sea Elf') {
        features = features.concat(
          [1, 'Improved Natural Swimmer', 1, 'Natural Sailor',
           1, 'Natural Swimmer']
        );
        notes = notes.concat([
          'skillNotes.naturalSailorFeature:' +
            '+2 Craft (ship/sea)/Profession (ship/sea)/Use Rope (ship/sea)'
        ]);
      } else if(race == 'Snow Elf') {
        features = features.concat([1, 'Cold Hardy', 1, 'Hardy']);
      } else if(race == 'Wood Elf') {
        features = features.concat([
          1, 'Improved Gifted Channeler', 1, 'Improved Natural Channeler'
        ]);
        notes = notes.concat([
          'magicNotes.improvedGiftedChannelerFeature:+1 spell energy'
        ]);
        ScribeCustomRules('skillNotes.woodElfSkillPointsBonus',
          'race', '?', 'source == "Wood Elf"',
          'level', '=', 'source'
        );
        ScribeCustomRules
          ('skillPoints', 'skillNotes.woodElfSkillPointsBonus', '+', null);
        ScribeCustomRules('spellEnergyPoints',
          'magicNotes.improvedGiftedChannelerFeature', '+', '1'
        );
      }

    } else if(race == 'Erenlander') {

      adjustment = null;
      features = [1, 'Heartlander'];
      notes = [
        'abilityNotes.erenlanderAbilityAdjustment:+2 any/-2 any',
        'skillNotes.heartlanderFeature:+4 Craft/Profession ranks'
      ];
      ScribeCustomRules('abilityNotes.erenlanderAbilityAdjustment',
        'race', '=', 'source == "Erenlander" ? 1 : null'
      );
      ScribeCustomRules
        ('featCount', 'featureNotes.erenlanderFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.erenlanderFeatCountBonus',
        'race', '=', 'source == "Erenlander" ? 2 : null'
      );
      ScribeCustomRules('skillNotes.erenlanderSkillPointsBonus',
        'race', '?', 'source == "Erenlander"',
        'level', '=', '(source + 3) * 2'
      );
      ScribeCustomRules('skillPoints',
        'skillNotes.heartlanderFeature', '+', '4',
        'skillNotes.erenlanderSkillPointsBonus', '+', null
      );

    } else if(race == 'Gnome') {

      adjustment = '+4 charisma/-2 strength';
      features = [
        1, 'Hardy', 1, 'Low Light Vision', 1, 'Natural Riverfolk',
        1, 'Natural Swimmer', 1, 'Natural Trader', 1, 'Slow', 1, 'Small',
        1, 'Spell Resistance'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'skillNotes.naturalTraderFeature:' +
          '+4 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
      ];

    } else if(race.indexOf(' Halfling') >= 0) {

      adjustment = '+2 dexterity/-2 strength';
      features = [
        1, 'Alert Senses', 1, 'Graceful', 1, 'Low Light Vision', 1, 'Lucky',
        1, 'Natural Channeler', 1, 'Slow', 1, 'Small', 1, 'Unafraid'
      ];
      notes = [
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.alertSensesFeature:+2 Listen/Spot',
        'skillNotes.gracefulFeature:+2 Climb/Jump/Move Silently/Tumble'
      ];
      ScribeCustomRules
        ('resistance.Fear', 'saveNotes.unafraidFeature', '+=', '2');

      if(race == 'Agrarian Halfling') {
        MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
          'Agrarian Halfling:Stout/Studious';
        features = features.concat([1, 'Dextrous Hands']);
        notes = notes.concat([
          'featureNotes.stoutFeature:Endurance/Toughness',
          'featureNotes.studiousFeature:Magecraft'
        ]);
        ScribeCustomRules('selectableFeatureCount.Agrarian Halfling',
          'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
        );
        ScribeCustomRules
          ('features.Endurance', 'featureNotes.stoutFeature', '=', '1');
        ScribeCustomRules
          ('features.Magecraft', 'featureNotes.studiousFeature', '=', '1');
        ScribeCustomRules
          ('features.Toughness', 'featureNotes.stoutFeature', '=', '1');
      } else if(race == 'Nomadic Halfling') {
        MN2E.SELECTABLE_FEATURES[MN2E.SELECTABLE_FEATURES.length] =
          'Nomadic Halfling:Bound To The Beast/Bound To The Spirits';
        features = features.concat([1, 'Skilled Rider']);
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat',
          'featureNotes.boundToTheSpiritsFeature:Magecraft',
          'skillNotes.skilledRiderFeature:+2 Handle Animal/Ride',
          'skillNotes.skilledRiderFeature2:+2 Concentration (wogrenback)'
        ]);
        ScribeCustomRules('selectableFeatureCount.Nomadic Halfling',
          'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
        );
        ScribeCustomRules('features.Magecraft',
          'featureNotes.boundToTheSpiritsFeature', '=', '1'
        );
        ScribeCustomRules('features.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
        );
        ScribeCustomRules('skillNotes.skilledRiderFeature2',
          'features.Skilled Rider', '=', '1'
        );
      }

    } else if(race == 'Orc') {

      adjustment = '+4 strength/-2 intelligence/-2 charisma';
      features = [1, 'Cold Resistance', 1, 'Darkvision',
                  1, 'Light Sensitivity', 1, 'Natural Preditor',
                  1, 'Night Fighter', 1, 'Orc Favored Enemy', 1, 'Orc Valor',
                  1, 'Spell Resistance'
      ];
      notes = [
        'combatNotes.lightSensitivityFeature:-1 attack in daylight',
        'combatNotes.nightFighterFeature:+1 attack in darkness',
        'combatNotes.orcValorFeature:' +
          '+1 attack when fighting alongside 9+ Orcs',
        'combatNotes.orcFavoredEnemyFeature:+1 damage vs. dwarves',
        'saveNotes.coldResistanceFeature:Immune non-lethal/half lethal',
        'skillNotes.naturalPreditorFeature:+%V Intimidate'
      ];
      ScribeCustomRules
        ('skillNotes.naturalPreditorFeature', 'strengthModifier', '=', null);
      ScribeCustomRules
        ('skills.Intimidate', 'skillNotes.naturalPreditorFeature', '+', null);

    } else if(race.indexOf(' Sarcosan') >= 0) {

      adjustment = '+2 charisma/+2 intelligence/-2 wisdom';
      features = [1, 'Quick'];
      notes = [
        'combatNotes.quickFeature:+1 attack w/light weapons',
        'saveNotes.quickFeature:+1 Reflex'
      ];
      ScribeCustomRules
        ('featCount', 'featureNotes.sarcosanFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.sarcosanFeatCountBonus',
        'race', '=', 'source.indexOf("Sarcosan") >= 0 ? 1 : null'
      );
      ScribeCustomRules('skillNotes.sarcosanSkillPointsBonus',
        'race', '?', 'source.indexOf("Sarcosan") >= 0',
        'level', '=', 'source + 3'
      );
      ScribeCustomRules('saveReflex', 'saveNotes.quickFeature', '+', '1');
      ScribeCustomRules
        ('skillPoints', 'skillNotes.sarcosanSkillPointsBonus', '+', null);
      if(race == 'Plains Sarcosan') {
        features = features.concat([1, 'Natural Horseman']);
        notes = notes.concat([
          'combatNotes.naturalHorsemanFeature:' +
            '+1 melee damage (horseback)/half ranged penalty (horseback)',
          'skillNotes.naturalHorsemanFeature:' +
            '+4 Concentration (horseback)/Handle Animal (horse)/Ride (horse)'
        ]);
      } else if(race == 'Urban Sarcosan') {
        features = features.concat([1, 'Interactive', 1, 'Urban']);
        notes = notes.concat([
          'skillNotes.urbanFeature:' +
            '+2 Gather Information (urban)/untrained Knowledge (urban)',
          'skillNotes.interactiveFeature:+2 Bluff/Diplomacy/Sense Motive'
        ]);
      }

    } else
      continue;

    ScribeCustomRace(race, adjustment, features);
    if(notes != null)
      ScribeCustomNotes(notes);

  }

};

MN2E.SkillRules = function() {

};

/*
 * Sets the character's #attribute# attribute to a random value.  #rules# is
 * the RuleEngine used to produce computed values; the function sometimes needs
 * to apply the rules to determine valid values for some attributes.
 */
MN2E.Randomize = function(rules, attributes, attribute) {
  if(attribute == 'heroicPath') {
    attributes[attribute] = ScribeUtils.RandomKey(Scribe.heroicPaths);
  }
}
