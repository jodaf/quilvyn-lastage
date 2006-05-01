/* $Id: LastAge.js,v 1.1 2006/05/01 05:14:01 Jim Exp $ */

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
  if(MN2E.AbilityRules != null) MN2E.AbilityRules();
  if(MN2E.RaceRules != null) MN2E.RaceRules();
  if(MN2E.ClassRules != null) MN2E.ClassRules();
  if(MN2E.SkillRules != null) MN2E.SkillRules();
  if(MN2E.FeatRules != null) MN2E.FeatRules();
  if(MN2E.DescriptionRules != null) MN2E.DescriptionRules();
  if(MN2E.EquipmentRules != null) MN2E.EquipmentRules();
  if(MN2E.CombatRules != null) MN2E.CombatRules();
  if(MN2E.MagicRules != null) MN2E.MagicRules();
  if(MN2E.Randomize != null)
    ScribeCustomRandomizers(MN2E.Randomize,
      'alignment', 'armor', 'charisma', 'constitution', 'deity', 'dexterity',
      'domains', 'feats', 'gender', 'hitPoints', 'intelligence', 'languages',
      'levels', 'name', 'race', 'shield', 'skills', 'specialization', 'spells',
      'strength', 'weapons', 'wisdom'
    );
  MN2E.AbilityRules = null;
  MN2E.RaceRules = null;
  MN2E.ClassRules = null;
  MN2E.SkillRules = null;
  MN2E.FeatRules = null;
  MN2E.DescriptionRules = null;
  MN2E.EquipmentRules = null;
  MN2E.CombatRules = null;
  MN2E.MagicRules = null;
}
/* Choice lists */
MN2E.CLASSES = [
  'Channeler', 'Defender', 'Wildlander'
];
MN2E.FEATS = [
  /* Figher Warrior's Ways (MN 85) */
  'Adapter', 'Improviser', 'Leader Of Men', 'Survivor'
];
MN2E.LANGUAGES = [
];
MN2E.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Dorn', 'Dwarrow', 'Dworg', 'Elfling',
  'Erenlander', 'Gnome', 'Jungle Elf', 'Kurgun Dwarf', 'Nomadic Halfling',
  'Orc', 'Sarcosan', 'Sea Elf', 'Snow Elf', 'Wood Elf'
];
MN2E.SKILLS = [
];
MN2E.SPELLS = [
];
MN2E.WEAPONS = [
];

MN2E.AbilityRules = function() {

};

MN2E.ClassRules = function() {

  var tests = [
    '{levels.Barbarian} == null || "{alignment}".indexOf("Lawful") < 0',
    '{levels.Bard} == null || "{alignment}".indexOf("Lawful") < 0',
    '{levels.Druid} == null || "{alignment}".indexOf("Neutral") >= 0',
    '{levels.Monk} == null || "{alignment}".indexOf("Lawful") >= 0',
    '{levels.Paladin} == null || "{alignment}" == "Lawful Good"'
  ];
  ScribeCustomTests(tests);

  var baseAttack, features, hitDie, notes, profArmor,
      profShield, profWeapon, saveFortitude, saveReflex, saveWill,
      skillPoints, skills;
  var prerequisites = null;  /* No base class has prerequisites */

  for(var i = 0; i < PH35.CLASSES.length; i++) {

    var klass = PH35.CLASSES[i];

    if(klass == 'Barbarian') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Fast Movement', 1, 'Rage', 2, 'Uncanny Dodge', 3, 'Trap Sense',
        5, 'Improved Uncanny Dodge', 7, 'Damage Reduction', 11, 'Greater Rage',
        14, 'Indomitable Will', 17, 'Tireless Rage', 20, 'Mighty Rage'
      ];
      hitDie = 12;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'meleeNotes.damageReductionFeature:%V subtracted from damage taken',
        'meleeNotes.greaterRageFeature:+6 strength/constitution; +3 Will',
        'meleeNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'meleeNotes.mightyRageFeature:+8 strength/constitution; +4 Will save',
        'meleeNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'meleeNotes.tirelessRageFeature:Not exhausted after rage',
        'meleeNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'saveNotes.indomitableWillFeature:+4 Will save while raging',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_MEDIUM;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_MARTIAL;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 4;
      skills = [
        'Climb', 'Handle Animal', 'Intimidate', 'Jump', 'Listen', 'Ride',
        'Survival', 'Swim'
      ];
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'levels.Barbarian', '+=', '10'
      );
      ScribeCustomRules('meleeNotes.rageFeature',
        'levels.Barbarian', '+=', '1 + Math.floor(source / 4)'
      );
      ScribeCustomRules('meleeNotes.damageReductionFeature',
        'levels.Barbarian', '+=', 'source>=7 ? Math.floor((source-4)/3) : null'
      );
      ScribeCustomRules('saveNotes.trapSenseFeature',
        'levels.Barbarian', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );
      ScribeCustomRules('speed', 'abilityNotes.fastMovementFeature', '+', null);

    } else if(klass == 'Bard') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Bardic Knowledge', 1, 'Countersong', 1, 'Fascinate',
        1, 'Inspire Courage', 3, 'Inspire Competence', 6, 'Suggestion',
        9, 'Inspire Greatness', 12, 'Song Of Freedom', 15, 'Inspire Heroics',
        18, 'Mass Suggestion'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.inspireCompetenceFeature:' +
          '+2 allies skill checks while performing',
        'featureNotes.inspireCourageFeature:' +
          '+%V morale/attack/damage to allies while performing',
        'featureNotes.inspireGreatnessFeature:' +
           '%V allies get +2 HD/attack/+1 Fortitude save while performing',
        'featureNotes.inspireHeroicsFeature:' +
          'Single ally +4 morale/AC while performing',
        'magicNotes.countersongFeature:' +
          'Perform check vs. sonic magic within 30 ft',
        'magicNotes.fascinateFeature:' +
          'Hold %V creatures within 90 ft spellbound',
        'magicNotes.songOfFreedomFeature:' +
          'Break enchantment through performing',
        'magicNotes.massSuggestionFeature:' +
          'Make suggestion to all fascinated creatures',
        'magicNotes.suggestionFeature:' +
          'Make suggestion to a fascinated creature',
        'skillNotes.bardicKnowledgeFeature:' +
          '+%V Knowledge checks on local history'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_LIGHT;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_SIMPLE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 6;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration',
        'Decipher Script', 'Diplomacy', 'Disguise', 'Escape Artist',
        'Gather Information', 'Hide', 'Jump', 'Knowledge (Arcana)',
        'Knowledge (Architecture)', 'Knowledge (Engineering)',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
        'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)',
        'Listen', 'Move Silently', 'Perform (Act)', 'Perform (Comedy)',
        'Perform (Dance)', 'Perform (Keyboard)', 'Perform (Oratory)',
        'Perform (Percussion)', 'Perform (Sing)', 'Perform (String)',
        'Perform (Wind)', 'Sense Motive', 'Sleight Of Hand', 'Speak Language',
        'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'
      ];
      ScribeCustomRules
        ('casterLevelArcane', 'spellsPerDayLevels.Bard', '^=', null);
      ScribeCustomRules
        ('features.Countersong', 'performRanks', '?', 'source >= 3');
      ScribeCustomRules
        ('features.Fascinate', 'performRanks', '?', 'source >= 3');
      ScribeCustomRules
        ('features.Inspire Competence', 'performRanks', '?', 'source >= 6');
      ScribeCustomRules
        ('features.Inspire Courage', 'performRanks', '?', 'source >= 3');
      ScribeCustomRules
        ('features.Inspire Greatness', 'performRanks', '?', 'source >= 12');
      ScribeCustomRules
        ('features.Inspire Heroics', 'performRanks', '?', 'source >= 18');
      ScribeCustomRules
        ('features.Mass Suggestion', 'performRanks', '?', 'source >= 21');
      ScribeCustomRules
        ('features.Song Of Freedom', 'performRanks', '?', 'source >= 15');
      ScribeCustomRules
        ('features.Suggestion', 'performRanks', '?', 'source >= 9');
      ScribeCustomRules('featureNotes.inspireCourageFeature',
        'levels.Bard', '+=', 'source >= 8 ? Math.floor((source + 4) / 6) : 1'
      );
      ScribeCustomRules('featureNotes.inspireGreatnessFeature',
        'levels.Bard', '+=', 'source >= 12 ? Math.floor((source - 6) / 3) : 1'
      );
      ScribeCustomRules('magicNotes.fascinateFeature',
        'levels.Bard', '+=', 'Math.floor((source + 2) / 3)'
      );
      ScribeCustomRules('performRanks',
        'skills.Perform (Act)', '^=', null,
        'skills.Perform (Comedy)', '^=', null,
        'skills.Perform (Dance)', '^=', null,
        'skills.Perform (Keyboard)', '^=', null,
        'skills.Perform (Oratory)', '^=', null,
        'skills.Perform (Percussion)', '^=', null,
        'skills.Perform (Sing)', '^=', null,
        'skills.Perform (String)', '^=', null,
        'skills.Perform (Wind)', '^=', null
      );
      ScribeCustomRules('skillNotes.bardicKnowledgeFeature',
        'features.Bardic Knowledge', '?', null,
        'levels.Bard', '+=', null,
        'intelligenceModifier', '+', null
      );
      ScribeCustomRules('spellsPerDay.B0',
        'spellsPerDayLevels.Bard', '=', 'source == 1 ? 2 : source < 14 ? 3 : 4'
      );
      for(var j = 1; j <= 6; j++) {
        var none = (j - 1) * 3 + (j == 1 ? 1 : 0);
        var n2 = j == 1 || j == 6 ? 1 : 2;
        var n3 = j == 6 ? 1 : ((6 - j) * 2);
        ScribeCustomRules('spellsPerDay.B' + j,
          'spellsPerDayLevels.Bard', '=',
             'source <= ' + none + ' ? null : ' +
             'source <= ' + (none + 1) + ' ? 0 : ' +
             'source <= ' + (none + 2) + ' ? 1 : ' +
             'source <= ' + (none + 2 + n2) + ' ? 2 : ' +
             'source <= ' + (none + 2 + n2 + n3) + ' ? 3 : 4',
          'charismaModifier', '+',
             'source >= ' + j + ' ? Math.floor((source+' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelArcane', 'spellsPerDay.B' + j, '^=', j);
      }
      ScribeCustomRules('spellsPerDayLevels.Bard', 'levels.Bard', '=', null);

    } else if(klass == 'Cleric') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [1, 'Spontaneous Cleric Spell', 1, 'Turn Undead'];
      hitDie = 8;
      notes = [
        'magicNotes.spontaneousClericSpellFeature:%V',
        'meleeNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_HEAVY;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_SIMPLE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Concentration', 'Diplomacy', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (History)', 'Knowledge (Planes)', 'Knowledge (Religion)',
        'Spellcraft'
      ];
      ScribeCustomRules
        ('casterLevelDivine', 'spellsPerDayLevels.Cleric', '^=', null);
      ScribeCustomRules('magicNotes.spontaneousClericSpellFeature',
        'alignment', '=', 'source.indexOf("Evil") >= 0 ? "Inflict" : "Heal"'
      );
      ScribeCustomRules('spellsPerDay.C0',
        'spellsPerDayLevels.Cleric', '=',
          'source == 1 ? 3 : source <= 3 ? 4 : source <= 6 ? 5 : 6'
      );
      for(var j = 1; j <= 9; j++) {
        var none = (j - 1) * 2;
        ScribeCustomRules('spellsPerDay.C' + j,
          'spellsPerDayLevels.Cleric', '=',
             'source<=' + none + ' ? null : source<=' + (none+1) + ' ? 1 : ' +
             'source<=' + (none+3) + ' ? 2 : source<=' + (none+6) + ' ? 3 : ' +
             'source<=' + (none+10) + ' ? 4 : 5',
          'wisdomModifier', '+',
             'source>=' + j + ' ? Math.floor((source+' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelDivine', 'spellsPerDay.C' + j, '^=', j);
        ScribeCustomRules
          ('spellsPerDay.Dom' + j, 'spellsPerDay.C' + j, '=', '1');
      }
      ScribeCustomRules
        ('spellsPerDayLevels.Cleric', 'levels.Cleric', '=', null);
      ScribeCustomRules('turningLevel', 'levels.Cleric', '+=', null);

    } else if(klass == 'Druid') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Animal Companion', 1, 'Nature Sense', 1, 'Spontaneous Druid Spell',
        1, 'Wild Empathy', 2, 'Woodland Stride', 3, 'Trackless Step',
        4, 'Resist Nature', 5, 'Wild Shape', 9, 'Venom Immunity',
        13, 'Thousand Faces', 15, 'Timeless Body'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'magicNotes.spontaneousDruidSpellFeature:' +
          '<i>Summon Nature\'s Ally</i>',
        'magicNotes.thousandFacesFeature:<i>Alter Self</i> at will',
        'saveNotes.resistNatureFeature:+4 vs. spells of feys',
        'saveNotes.venomImmunityFeature:Immune to organic poisons',
        'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_MEDIUM;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Diplomacy', 'Handle Animal', 'Heal',
        'Knowledge (Nature)', 'Listen', 'Ride', 'Spellcraft', 'Spot',
        'Survival', 'Swim'
      ];
      ScribeCustomRules
        ('casterLevelDivine', 'spellsPerDayLevels.Druid', '^=', null);
      ScribeCustomRules('magicNotes.wildShapeFeature',
        'levels.Druid', '=',
          'source <  5 ? null : ' +
          'source == 5 ? "Small-medium 1/day" : ' +
          'source == 6 ? "Small-medium 2/day" : ' +
          'source == 7 ? "Small-medium 3/day" : ' +
          'source <  10 ? "Small-large 3/day" : ' +
          'source == 10 ? "Small-large 4/day" : ' +
          'source == 11 ? "Tiny-large 4/day" : ' +
          'source <  14 ? "Tiny-large/plant 4/day" : ' +
          'source == 14 ? "Tiny-large/plant 5/day" : ' +
          'source == 15 ? "Tiny-huge/plant 5/day" : ' +
          'source <  18 ? "Tiny-huge/plant 5/day; elemental 1/day" : ' +
          'source <  20 ? "Tiny-huge/plant 6/Day; elemental 2/day" : ' +
          '"Tiny-huge/plant 6/day; elemental 3/day"'
      );
      ScribeCustomRules('languageCount', 'levels.Druid', '+', '1');
      ScribeCustomRules('languages.Druidic', 'levels.Druid', '=', '1');
      ScribeCustomRules('skillNotes.wildEmpathyFeature',
        'levels.Druid', '+=', null,
        'charismaModifier', '+', null
      );
      ScribeCustomRules('spellsPerDay.D0',
        'spellsPerDayLevels.Druid', '=',
          'source == 1 ? 3 : source <= 3 ? 4 : source <= 6 ? 5 : 6'
      );
      for(var j = 1; j <= 9; j++) {
        var none = (j - 1) * 2;
        ScribeCustomRules('spellsPerDay.D' + j,
          'spellsPerDayLevels.Druid', '=',
             'source<=' + none + ' ? null : source<=' + (none+1) + ' ? 1 : ' +
             'source<=' + (none+3) + ' ? 2 : source<=' + (none+6) + ' ? 3 : ' +
             'source<=' + (none+10) + ' ? 4 : 5',
          'wisdomModifier', '+',
             'source>=' + j + ' ? Math.floor((source+' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelDivine', 'spellsPerDay.D' + j, '^=', j);
      }
      ScribeCustomRules('spellsPerDayLevels.Druid', 'levels.Druid', '=', null);

    } else if(klass == 'Fighter') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = null;
      hitDie = 10;
      notes = null;
      profArmor = PH35.ARMOR_PROFICIENCY_HEAVY;
      profShield = PH35.SHIELD_PROFICIENCY_TOWER;
      profWeapon = PH35.WEAPON_PROFICIENCY_MARTIAL;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Climb', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'
      ];
      ScribeCustomRules('featureNotes.classFeatCountBonus',
        'levels.Fighter', '+=', '1 + Math.floor(source / 2)'
      );

    } else if(klass == 'Monk') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Flurry Of Blows', 1, 'Improved Unarmed Strike', 2, 'Evasion',
        3, 'Fast Movement', 3, 'Still Mind', 4, 'Ki Strike', 4, 'Slow Fall',
        5, 'Purity Of Body', 7, 'Wholeness Of Body', 9, 'Improved Evasion',
        11, 'Diamond Body', 11, 'Greater Flurry', 12, 'Abundant Step',
        13, 'Diamond Soul', 15, 'Quivering Palm', 17, 'Timeless Body',
        17, 'Tongue Of The Sun And Moon', 19, 'Empty Body', 20, 'Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tongueOfTheSunAndMoonFeature:Speak w/any creature',
        'magicNotes.abundantStepFeature:' +
          '<i>Dimension Door</i> at level %V 1/day',
        'magicNotes.emptyBodyFeature:Ethereal %V rounds/day',
        'magicNotes.wholenessOfBodyFeature:Heal %V damage to self/day',
        'meleeNotes.flurryOfBlowsFeature:Take %V penalty for extra attack',
        'meleeNotes.greaterFlurryFeature:Extra attack',
        'meleeNotes.kiStrikeFeature:Treat unarmed attacks as magic weapons',
        'meleeNotes.perfectSelfFeature:' +
          'Ignore first 10 points of non-magical damage',
        'meleeNotes.quiveringPalmFeature:' +
          'Foe makes DC %V Fortitude save or dies 1/week',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:DC %V spell resistance',
        'saveNotes.evasionFeature:Save yields no damage instead of 1/2',
        'saveNotes.perfectSelfFeature:Treat as outsider for magic saves',
        'saveNotes.purityOfBodyFeature:Immune to disease',
        'saveNotes.slowFallFeature:' +
          'Subtract %V ft from falling distance damage:',
        'saveNotes.stillMindFeature:+2 vs. enchantments'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_NONE;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Balance', 'Climb', 'Concentration', 'Diplomacy', 'Escape Artist',
        'Hide', 'Jump', 'Knowledge (Arcana)', 'Knowledge (Religion)', 'Listen',
        'Move Silently', 'Perform (Act)', 'Perform (Comedy)',
        'Perform (Dance)', 'Perform (Keyboard)', 'Perform (Oratory)',
        'Perform (Percussion)', 'Perform (Sing)', 'Perform (String)',
        'Perform (Wind)', 'Sense Motive', 'Spot', 'Swim', 'Tumble'
      ];
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'levels.Monk', '+=', '10 * Math.floor(source / 3)'
      );
      ScribeCustomRules('armorClass',
        'meleeNotes.classArmorClassAdjustment', '+', null,
        'meleeNotes.wisdomArmorClassAdjustment', '+', null
      );
      ScribeCustomRules('featureNotes.classFeatCountBonus',
        'levels.Monk', '+=', 'source < 2 ? 1 : source < 6 ? 2 : 3'
      );
      ScribeCustomRules('magicNotes.abundantStepFeature',
        'levels.Monk', '+=', 'Math.floor(source / 2)'
      );
      ScribeCustomRules
        ('magicNotes.emptyBodyFeature', 'levels.Monk', '+=', null);
      ScribeCustomRules('meleeNotes.classArmorClassAdjustment',
        'levels.Monk', '+=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('meleeNotes.flurryOfBlowsFeature',
        'levels.Monk', '=', 'source < 5 ? -2 : source < 9 ? -1 : 0'
      );
      ScribeCustomRules('meleeNotes.quiveringPalmFeature',
        'levels.Monk', '+=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      ScribeCustomRules
        ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '+=', '2*source');
      ScribeCustomRules('meleeNotes.wisdomArmorClassAdjustment',
        'levels.Monk', '?', null,
        'wisdomModifier', '+=', 'source <= 0 ? 0 : source'
      );
      ScribeCustomRules
        ('saveNotes.diamondSoulFeature', 'levels.Monk', '+=', '10 + source');
      ScribeCustomRules('saveNotes.slowFallFeature',
        'levels.Monk', '=', 'source < 20 ? Math.floor(source / 2) * 10 : "all"'
      );
      ScribeCustomRules('speed', 'abilityNotes.fastMovementFeature', '+', null);
      ScribeCustomRules('unarmedDamageMedium',
        'levels.Monk', '=',
          'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
          '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))'
      );

    } else if(klass == 'Paladin') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Aura Of Good', 1, 'Detect Evil', 1, 'Smite Evil',
        2, 'Divine Grace', 2, 'Lay On Hands', 3, 'Aura Of Courage',
        3, 'Divine Health', 4, 'Turn Undead', 5, 'Special Mount',
        6, 'Remove Disease'
      ];
      hitDie = 10;
      notes = [
        'featureNotes.specialMountFeature:Magical mount w/special abilities',
        'magicNotes.auraOfGoodFeature:Visible to <i>Detect Good</i>',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'magicNotes.removeDiseaseFeature:<i>Remove Disease</i> %V/week',
        'meleeNotes.smiteEvilFeature:' +
          '%V/day add conMod to attack, paladin level to damage vs. evil',
        'meleeNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures',
        'saveNotes.auraOfCourageFeature:' +
          'Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.divineGraceFeature:Add %V to saves',
        'saveNotes.divineHealthFeature:Immune to disease'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_HEAVY;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_MARTIAL;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Concentration', 'Diplomacy', 'Handle Animal', 'Heal',
        'Knowledge (Nobility)', 'Knowledge (Religion)', 'Ride', 'Sense Motive'
      ];
      ScribeCustomRules('casterLevelDivine',
        'spellsPerDayLevels.Paladin', '^=',
        'source < 4 ? null : Math.floor(source / 2)'
      );
      ScribeCustomRules('magicNotes.layOnHandsFeature',
        'levels.Paladin', '+=', null,
        'charismaModifier', '*', null
      );
      ScribeCustomRules('magicNotes.removeDiseaseFeature',
        'levels.Paladin', '+=', 'Math.floor((source - 3) / 3)'
      );
      ScribeCustomRules('meleeNotes.smiteEvilFeature',
        'levels.Paladin', '=', '1 + Math.floor(source / 5)'
      );
      ScribeCustomRules
        ('saveNotes.divineGraceFeature', 'charismaModifier', '=', null);
      ScribeCustomRules
        ('saveFortitude', 'saveNotes.divineGraceFeature', '+', null);
      ScribeCustomRules
        ('saveReflex', 'saveNotes.divineGraceFeature', '+', null);
      ScribeCustomRules('saveWill', 'saveNotes.divineGraceFeature', '+', null);
      for(var j = 1; j <= 4; j++) {
        none = 3 * j + (j == 1 ? 0 : 1);
        var n0 = j <= 2 ? 2 : 1;
        var n1 = 8 - j + (j == 1 ? 1 : 0);
        var n2 = 5 - j;
        ScribeCustomRules('spellsPerDay.P' + j,
          'spellsPerDayLevels.Paladin', '=',
            'source<=' + none + ' ? null : source<=' + (none+n0) + ' ? 0 : ' +
            'source<=' + (none + n0 + n1) + ' ? 1 : ' +
            'source<=' + (none + n0 + n1 + n2) + ' ? 2 : 3',
          'wisdomModifier', '+',
             'source>=' + j + ' ? Math.floor((source + ' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelDivine', 'spellsPerDay.P' + j, '^=', j);
      }
      ScribeCustomRules
        ('spellsPerDayLevels.Paladin', 'levels.Paladin', '=', 'source');
      ScribeCustomRules
        ('turningLevel', 'levels.Paladin', '+=', 'source>3 ? source-3 : null');

    } else if(klass == 'Ranger') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Favored Enemy', 1, 'Track', 1, 'Wild Empathy', 3, 'Endurance',
        4, 'Animal Companion', 7, 'Woodland Stride', 8, 'Swift Tracker',
        9, 'Evasion', 13, 'Camouflage', 17, 'Hide In Plain Sight'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.combatStyle(Archery)Features:%V (light armor)',
        'featureNotes.combatStyle(TwoWeaponCombat)Features:%V (light armor)',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'meleeNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'saveNotes.evasionFeature:Save yields no damage instead of 1/2',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more vs. %V type(s) of creatures on Bluff/Listen/Sense Motive/Spot/Survival',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.swiftTrackerFeature:Track at full speed',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_LIGHT;
      profShield = PH35.SHIELD_PROFICIENCY_HEAVY;
      profWeapon = PH35.WEAPON_PROFICIENCY_MARTIAL;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 6;
      skills = [
        'Climb', 'Concentration', 'Handle Animal', 'Heal', 'Hide', 'Jump',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (Nature)', 'Listen', 'Move Silently', 'Ride', 'Search',
        'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      ScribeCustomRules('casterLevelDivine',
        'spellsPerDayLevels.Ranger', '^=',
        'source < 4 ? null : Math.floor(source / 2)'
      );
      ScribeCustomRules('featureNotes.classFeatCountBonus',
        'levels.Ranger', '+=', 'source >= 2 ? 1 : null'
      );
      ScribeCustomRules('featureNotes.combatStyle(Archery)Features',
        'feats.Combat Style (Archery)', '?', null,
        'levels.Ranger', '=',
        '["Rapid Shot"].concat(source >= 6 ? ["Manyshot"] : []).concat' +
        '(source >= 11 ? ["Improved Precise Shot"] : []).sort().join("/")'
      );
      ScribeCustomRules('featureNotes.combatStyle(TwoWeaponCombat)Features',
        'feats.Combat Style (Two Weapon Combat)', '?', null,
        'levels.Ranger', '=',
        '["Two WeaponFighting"].concat' +
        '(source >= 6 ? ["Improved Two Weapon Fighting"] : []).concat' +
        '(source >= 11 ? ["Greater Two Weapon Fighting"] : []).sort().join("/")'
      );
      ScribeCustomRules('features.Improved Precise Shot',
        'featureNotes.combatStyle(Archery)Features', '=',
        'source.indexOf("Improved Precise Shot") >= 0 ? 1 : null'
      );
      ScribeCustomRules('features.Manyshot',
        'featureNotes.combatStyle(Archery)Features', '=',
        'source.indexOf("Manyshot") >= 0 ? 1 : null'
      );
      ScribeCustomRules('features.Rapid Shot',
        'featureNotes.combatStyle(Archery)Features', '=',
        'source.indexOf("Rapid Shot") >= 0 ? 1 : null'
      );
      ScribeCustomRules('features.Greater Two Weapon Fighting',
        'featureNotes.combatStyle(TwoWeaponCombat)Features', '=',
        'source.indexOf("Greater Two Weapon Fighting") >= 0 ? 1 : null'
      );
      ScribeCustomRules('features.Improved Two Weapon Fighting',
        'featureNotes.combatStyle(TwoWeaponCombat)Features', '=',
        'source.indexOf("Improved Two Weapon Fighting") >= 0 ? 1 : null'
      );
      ScribeCustomRules('features.Two Weapon Fighting',
        'featureNotes.combatStyle(TwoWeaponCombat)Features', '=',
        'source.indexOf("Two Weapon Fighting") >= 0 ? 1 : null'
      );
/* TODO
  Evasion only if unencumbered
*/
      ScribeCustomRules('meleeNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      ScribeCustomRules('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      ScribeCustomRules('skillNotes.wildEmpathyFeature',
        'levels.Ranger', '+=', null,
        'charismaModifier', '+', null
      );
      for(var j = 1; j <= 4; j++) {
        var none = 3 * j + (j == 1 ? 0 : 1);
        var n0 = j <= 2 ? 2 : 1;
        var n1 = 8 - j + (j == 1 ? 1 : 0);
        var n2 = 5 - j;
        ScribeCustomRules('spellsPerDay.R' + j,
          'spellsPerDayLevels.Ranger', '=',
            'source<=' + none + ' ? null : source<=' + (none+n0) + ' ? 0 : ' +
            'source<=' + (none + n0 + n1) + ' ? 1 : ' +
            'source<=' + (none + n0 + n1 + n2) + ' ? 2 : 3',
          'wisdomModifier', '+',
             'source>=' + j + ' ? Math.floor((source + ' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelDivine', 'spellsPerDay.R' + j, '^=', j);
      }
      ScribeCustomRules
        ('spellsPerDayLevels.Ranger', 'levels.Ranger', '=', null);

    } else if(klass == 'Rogue') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Sneak Attack', 1, 'Trapfinding', 2, 'Evasion', 3, 'Trap Sense',
        4, 'Uncanny Dodge', 8, 'Improved Uncanny Dodge'
      ];
      hitDie = 6;
      notes = [
        'meleeNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'meleeNotes.uncannyDodgeFeature:' +
          'Always adds dexterity modifier to AC',
        'meleeNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'saveNotes.evasionFeature:Save yields no damage instead of 1/2',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'skillNotes.trapfindingFeature:Search to find/remove DC 20+ traps'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_LIGHT;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_SIMPLE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Local)', 'Listen', 'Move Silently', 'Open Lock',
        'Perform (Act)', 'Perform (Comedy)', 'Perform (Dance)',
        'Perform (Keyboard)', 'Perform (Oratory)', 'Perform (Percussion)',
        'Perform (Sing)', 'Perform (String)', 'Perform (Wind)', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Spot', 'Swim', 'Tumble',
        'Use Magic Device', 'Use Rope'
      ];
      ScribeCustomRules('featureNotes.classFeatCountBonus',
        'levels.Rogue', '+=', 'source>=10 ? Math.floor((source-7)/3) : null'
      );
      ScribeCustomRules('meleeNotes.sneakAttackFeature',
        'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
      );
      ScribeCustomRules('saveNotes.trapSenseFeature',
        'levels.Rogue', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );

    } else if(klass == 'Sorcerer') {

      baseAttack = PH35.ATTACK_BONUS_POOR;
      features = [1, 'Summon Familiar'];
      hitDie = 4;
      notes = [
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_NONE;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_SIMPLE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Bluff', 'Concentration', 'Knowledge (Arcana)', 'Spellcraft'
      ];
      ScribeCustomRules
        ('casterLevelArcane', 'spellsPerDayLevels.Sorcerer', '^=', null);
      ScribeCustomRules('spellsPerDay.S0',
        'spellsPerDayLevels.Sorcerer', '=', 'source == 1 ? 5 : 6'
      );
      for(var j = 1; j <= 9; j++) {
        var none = (j - 1) * 2 + (j == 1 ? 0 : 1);
        ScribeCustomRules('spellsPerDay.S' + j,
          'spellsPerDayLevels.Sorcerer', '=',
             'source<=' + none + ' ? null : source>=' + (none + 5) + ' ? 6 : ' +
             '(source - ' + none + ' + 2)',
          'charismaModifier', '+',
             'source>=' + j + ' ? Math.floor((source+' + (4-j) + ')/4) : null'
        );
        ScribeCustomRules('maxSpellLevelArcane', 'spellsPerDay.S' + j, '^=', j);
      }
      ScribeCustomRules
        ('spellsPerDayLevels.Sorcerer', 'levels.Sorcerer', '=', null);

    } else if(klass == 'Wizard') {

      baseAttack = PH35.ATTACK_BONUS_POOR;
      features = [1, 'Scribe Scroll', 1, 'Summon Familiar'];
      hitDie = 4;
      notes = [
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_NONE;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Concentration', 'Decipher Script', 'Knowledge (Arcana)',
        'Knowledge (Dungeoneering)', 'Knowledge (Engineering)',
        'Knowledge (Geography)', 'Knowledge (History)', 'Knowledge (Local)',
        'Knowledge (Nature)', 'Knowledge (Nobility)', 'Knowledge (Planes)',
        'Knowledge (Religion)', 'Spellcraft'
      ];
      ScribeCustomRules
        ('casterLevelArcane', 'spellsPerDayLevels.Wizard', '^=', null);
      ScribeCustomRules('featureNotes.classFeatCountBonus',
        'levels.Wizard', '+=', 'source >= 5 ? Math.floor(source / 5) : null'
      );
      ScribeCustomRules('spellsPerDay.W0',
        'spellsPerDayLevels.Wizard', '=', 'source == 1 ? 3 : 4',
        'magicNotes.wizardSpecialization', '+', '1'
      );
      for(var j = 1; j <= 9; j++) {
        var none = (j - 1) * 2;
        ScribeCustomRules('spellsPerDay.W' + j,
          'spellsPerDayLevels.Wizard', '=',
             'source<=' + none + ' ? null : source<=' + (none+1) + ' ? 1 : ' +
             'source<=' + (none+3) + ' ? 2 : source<=' + (none+6) + ' ? 3 : 4',
          'intelligenceModifier', '+',
             'source>=' + j + ' ? Math.floor((source+' + (4-j) + ')/4) : null',
          'magicNotes.wizardSpecialization', '+', '1'
        );
        ScribeCustomRules('maxSpellLevelArcane', 'spellsPerDay.W' + j, '^=', j);
      }
      ScribeCustomRules
        ('spellsPerDayLevels.Wizard', 'levels.Wizard', '=', null);

    } else
      continue;

    ScribeCustomClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites);
    if(notes != null)
      ScribeCustomNotes(notes);

  }

  ScribeCustomRules
    ('featCount', 'featureNotes.classFeatCountBonus', '+', null);

};

MN2E.CombatRules = function() {

};

MN2E.DescriptionRules = function() {

};

MN2E.EquipmentRules = function() {

};

MN2E.FeatRules = function() {

};

MN2E.MagicRules = function() {

};

MN2E.RaceRules = function() {

  var features = null;
  var notes = null;

  for(var i = 0; i < MN2E.RACES.length; i++) {

    var race = MN2E.RACES[i];

    if(race == 'Agrarian Halfling') {

      features = [
        1, 'Dextrous Hands', 1, 'Graceful', 1, 'Halfling Ability Adjustment', 1, 'Keen Senses', 1, 'Low Light Vision', 1, 'Lucky', 1, 'Slow', 1, 'Small', 1, 'Unafraid'
      ];
      notes = [
        'abilityNotes.halflingAbilityAdjustmentFeature:' +
          '+2 dexterity/-2 strength',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'saveNotes.luckyFeature:+1 all saves',
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.dextrousHandsFeature:+2 Heal',
        'skillNotes.dextrousHandsFeature2:+2 Craft (non-metal or -wood)',
        'skillNotes.keenSensesFeature:+2 Listen/Spot',
        'skillNotes.gracefulFeature:+2 Climb/Jump/Move Silently/Tumble'
      ];

    } else if(race == 'Clan Dwarf') {
    } else if(race == 'Dorn') {
    } else if(race == 'Dwarrow') {
    } else if(race == 'Dworg') {
    } else if(race == 'Elfling') {
    } else if(race ==
    'Erenlander') {
    } else if(race == 'Gnome') {
    } else if(race == 'Jungle Elf') {
    } else if(race == 'Kurgun Dwarf') {
    } else if(race == 'Nomadic Halfling') {
    } else if(race ==
    'Orc') {
    } else if(race == 'Sarcosan') {
    } else if(race == 'Sea Elf') {
    } else if(race == 'Snow Elf') {
    } else if(race == 'Wood Elf') {
    } else {
      continue;
    }

        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'featureNotes.knowDepthFeature:Intuit approximate depth underground',
        'meleeNotes.dodgeGiantsFeature:+4 AC vs. giant creatures',
        'meleeNotes.dwarfFavoredEnemyFeature:' +
          '+1 vs. bugbear/goblin/hobgoblin/orc',
        'saveNotes.hardinessFeature:+2 vs. poison',
        'saveNotes.magicResistanceFeature:+2 vs. spells',
        'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
        'skillNotes.stonecunningFeature:' +
          '+2 Appraise/Craft/Search involving stone or metal'
      ];
      ScribeCustomRules('charisma',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('constitution',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('meleeNotes.armorSpeedAdjustment',
        'race', '^', 'source == "Dwarf" ? 0 : null'
      );

    } else if(race == 'Elf') {

      features = [
        1, 'Elf Ability Adjustment', 1, 'Enchantment Resistance',
        1, 'Keen Senses', 1, 'Low Light Vision', 1, 'Sense Secret Doors'
      ];
      notes = [
        'abilityNotes.elfAbilityAdjustmentFeature:' +
          '+2 dexterity/-2 constitution',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'featureNotes.senseSecretDoorsFeature:' +
          'Automatic Search when within 5 ft',
        'saveNotes.enchantmentResistanceFeature:' +
          '+2 vs. enchantments; immune sleep',
        'skillNotes.keenSensesFeature:+2 Listen/Search/Spot'
      ];
      ScribeCustomRules('constitution',
        'abilityNotes.elfAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('dexterity',
        'abilityNotes.elfAbilityAdjustmentFeature', '+', '2'
      );

    } else if(race == 'Gnome') {

      features = [
        1, 'Dodge Giants', 1, 'Gnome Ability Adjustment',
        1, 'Gnome Favored Enemy', 1, 'Gnome Spells', 1, 'Illusion Resistance',
        1, 'Keen Ears', 1, 'Keen Nose', 1, 'Low Light Vision', 1, 'Slow',               1, 'Small'
      ];
      notes = [
        'abilityNotes.gnomeAbilityAdjustmentFeature:' +
          '+2 constitution/-2 strength',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'magicNotes.gnomeSpellsFeature:' +
          '<i>Dancing Lights</i>/<i>Ghost Sound</i>/<i>Prestidigitation</i>/' +
          '<i>Speak With Animals</i> 1/day',
        'meleeNotes.dodgeGiantsFeature:+4 AC vs. giant creatures',
        'meleeNotes.gnomeFavoredEnemyFeature:' +
           '+1 vs. bugbear/goblin/hobgoblin/kobold',
        'saveNotes.illusionResistanceFeature:+2 vs. illusions',
        'skillNotes.keenEarsFeature:+2 Listen',
        'skillNotes.keenNoseFeature:+2 Craft (Alchemy)'
      ];
      ScribeCustomRules('constitution',
        'abilityNotes.gnomeAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules
        ('magicNotes.gnomeSpellsFeature', 'charisma', '?', 'source >= 10');
      ScribeCustomRules('strength',
        'abilityNotes.gnomeAbilityAdjustmentFeature', '+', '-2'
      );

    } else if(race == 'Half Elf') {

      features = [
          1, 'Alert Senses', 1, 'Enchantment Resistance',
          1, 'Low Light Vision', 1, 'Tolerance'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'saveNotes.enchantmentResistanceFeature:' +
          '+2 vs. enchantments; immune sleep',
        'skillNotes.alertSensesFeature:+1 Listen/Search/Spot',
        'skillNotes.toleranceFeature:+2 Diplomacy/Gather Information'
      ];

    } else if(race == 'Half Orc') {

      features = [1, 'Darkvision', 1, 'Half Orc Ability Adjustment'];
      notes = [
        'abilityNotes.halfOrcAbilityAdjustmentFeature:' +
          '+2 strength/-2 intelligence/-2 charisma',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
      ];
      ScribeCustomRules('charisma',
        'abilityNotes.halfOrcAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('intelligence',
        'abilityNotes.halfOrcAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('strength',
        'abilityNotes.halfOrcAbilityAdjustmentFeature', '+', '2'
      );

    } else if(race == 'Halfling') {

      features = [
        1, 'Accurate', 1, 'Halfling Ability Adjustment', 1, 'Keen Ears',
        1, 'Lucky', 1, 'Slow', 1, 'Small', 1, 'Spry', 1, 'Unafraid'
      ];
      notes = [
        'abilityNotes.halflingAbilityAdjustmentFeature:' +
          '+2 dexterity/-2 strength',
        'meleeNotes.accurateFeature:+1 attack with slings/thrown',
        'skillNotes.spryFeature:+2 Climb/Jump/Listen/Move Silently'
      ];
      ScribeCustomRules('dexterity',
        'abilityNotes.halflingAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('saveFortitude', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveReflex', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveWill', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('strength',
        'abilityNotes.halflingAbilityAdjustmentFeature', '+', '-2'
      );

    } else if(race == 'Human') {

      features = null;
      notes = null;
      ScribeCustomRules('featCount',
        'featureNotes.humanFeatCountBonus', '+', null
      );
      ScribeCustomRules('featureNotes.humanFeatCountBonus',
        'race', '+=', 'source == "Human" ? 1 : null'
      );
      ScribeCustomRules('skillNotes.humanSkillPointsBonus',
        'race', '?', 'source == "Human"',
        'level', '=', 'source + 3'
      );
      ScribeCustomRules
        ('skillPoints', 'skillNotes.humanSkillPointsBonus', '+', null);

    } else
      continue;

    ScribeCustomRace(race, features);
    if(notes != null)
      ScribeCustomNotes(notes);

  }

  ScribeCustomRules('speed', null, '=', '30');
  ScribeCustomRules('speed', 'features.Slow', '+', '-10');
  ScribeCustomRules('runSpeed', 'speed', '=', null);
  ScribeCustomRules('runSpeedMultiplier', null, '=', '4');

};

MN2E.SkillRules = function() {

};
