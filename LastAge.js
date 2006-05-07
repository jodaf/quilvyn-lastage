/* $Id: LastAge.js,v 1.5 2006/05/07 06:28:37 Jim Exp $ */

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
}
/* Choice lists */
MN2E.CLASSES = [
  'Channeler', 'Defender', 'Wildlander'
];
MN2E.FEATS = [
  /* Agrarian Halfling Features (MN 46) */
  'Stout', 'Studious',
  /* Nomadic Halfling Features (MN 46) */
  'Bound To The Beast', 'Bound To The Spirits',
  /* Fighter Warrior's Ways (MN 85) */
  'Adapter', 'Improviser', 'Leader Of Men', 'Survivor'
];
MN2E.LANGUAGES = [
];
MN2E.PATHS = [
  'Beast', 'Chanceborn', 'Charismatic', 'Dragonblooded', 'Earthbonded',
  'Faithful', 'Giantblooded', 'Guardian', 'Healer', 'Ironborn',
  'Jack-Of-All-Trades', 'Mountainborn', 'Naturefriend', 'Northblooded',
  'Quickened', 'Painless', 'Pureblood', 'Seaborn', 'Seer', 'Speaker',
  'Spellsoul', 'Shadow Walker', 'Steelblooded', 'Sunderborn', 'Tactician',
  'Warg'
];
MN2E.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Danisil Raised Elfling', 'Dorn',
  'Dwarf Raised Dwarrow', 'Dworg', 'Erenlander', 'Gnome',
  'Gnome Raised Dwarrow', 'Halfling Raised Elfling', 'Jungle Elf',
  'Kurgun Dwarf', 'Nomadic Halfling', 'Orc', 'Plains Sarcosan', 'Sea Elf',
  'Snow Elf', 'Urban Sarcosan', 'Wood Elf'
];
MN2E.SKILLS = [
];
MN2E.SPELLS = [
];
MN2E.WEAPONS = [
];

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

    if(klass == 'Channeler') {

    } else if(klass == 'Defender') {

    } else if(klass == 'Wildlander') {

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

};

MN2E.HeroicPathRules = function() {

  ScribeCustomChoices('heroicPaths', MN2E.PATHS);

};

MN2E.MagicRules = function() {

};

MN2E.RaceRules = function() {

  var features = null;
  var notes = null;

  for(var i = 0; i < MN2E.RACES.length; i++) {

    var race = MN2E.RACES[i];

    if(race == 'Dorn') {

      features = [
        1, 'Brotherhood', 1, 'Dorn Ability Adjustment', 1, 'Hardy'
      ];
      notes = [
        'abilityNotes.dornAbilityAdjustmentFeature:' +
          '+2 strength/-2 intelligence',
        'meleeNotes.brotherhoodFeature:' +
          '+1 attack when fighting with 4 more Dorns',
        'saveNotes.hardyFeature:+1 Fortitude',
        'saveNotes.hardyFeature2:+1 code/half damage'
      ];
      ScribeCustomRules
        ('featCount', 'featureNotes.dornFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.dornFeatCountBonus',
        'race', '=', 'source == "Dorn" ? 1 : null'
      );
      ScribeCustomRules('intelligence',
        'abilityNotes.dornfAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('saveFortitude', 'saveNotes.hardyFeature', '+', '1');
      ScribeCustomRules('saveNotes.hardyFeature2', 'features.Hardy', '=', '1');
      ScribeCustomRules('skillNotes.dornSkillPointsBonus',
        'race', '?', 'source == "Dorn"',
        'level', '=', 'source + 3'
      );
      ScribeCustomRules
        ('skillPoints', 'skillNotes.dornSkillPointsBonus', '+', null);
      ScribeCustomRules
        ('strength', 'abilityNotes.dornAbilityAdjustmentFeature', '+', '2');

    } else if(race.indexOf('Dwarrow') >= 0) {

      features = [
        1, 'Darkvision', 1, 'Dwarrow Ability Adjustment', 1, 'Small', 1, 'Slow',
        1, 'Spell Resistance'
      ];
      notes = [
        'abilityNotes.dwarrowAbilityAdjustmentFeature:+2 charisma',
        'saveNotes.spellResistanceFeature:+2 vs. spells'
      ];
      if(race == 'Dwarf Raised Dwarrow') {
        features = features.concat([
          1, 'Dwarrow Dodge', 1, 'Stone Familiarity'
        ]);
        notes = notes.concat([
          'meleeNotes.dwarrowDodgeFeature:+1 AC vs. orc',
          'skillNotes.stoneFamiliarityFeature:' +
            '+2 Appraise/Craft involving stone or metal'
        ]);
      } else if(race == 'Gnome Raised Dwarrow') {
        features = features.concat([
          1, 'Natural Riverfolk', 1, 'Natural Swimmer', 1, 'Skilled Trader'
        ]);
        notes = notes.concat([
          'skillNotes.naturalRiverfolkFeature:' +
            '+2 Perform/Profession (Boater And Sailor)/Swim/UseRope',
          'skillNotes.naturalSwimmerFeature:' +
            'Swim at half speed as move action/hold breath for %V rounds',
          'skillNotes.naturalTraderFeature:' +
            '+2 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
        ]);
        ScribeCustomRules
          ('skillNotes.naturalSwimmerFeature', 'constitution', '=', null);
      }
      ScribeCustomRules
        ('charisma', 'abilityNotes.dwarrowAbilityAdjustmentFeature', '+', '2');

    } else if(race.indexOf('Dwarf') >= 0) {

      features = [
        1, 'Darkvision', 1, 'Dwarf Ability Adjustment',
        1, 'Dwarf Favored Enemy', 1, 'Dwarf Favored Weapon',
        1, 'Resilient', 1, 'Slow', 1, 'Spell Resistance',
        1, 'Stone Familiarity'
      ];
      notes = [
        'abilityNotes.dwarfAbilityAdjustmentFeature:' +
          '+2 constitution/-2 charisma',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'meleeNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'meleeNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'meleeNotes.resilientFeature:+2 AC',
        'saveNotes.resilientFeature:+2 vs. poison',
        'saveNotes.spellResistanceFeature:+2 vs. spells',
        'skillNotes.stoneFamiliarityFeature:' +
          '+2 Appraise/Craft involving stone or metal'
      ];
      ScribeCustomRules('armorClass', 'meleeNotes.resilientFeature', '+', '2');
      ScribeCustomRules('constitution',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('charisma',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('meleeNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      if(race == 'Clan Dwarf') {
        features = features.concat([
          1, 'Dwarf Dodge', 1, 'Know Depth', 1, 'Stability'
        ]);
        notes = notes.concat([
          'featureNotes.knowDepthFeature:Intuit approximate depth underground',
          'meleeNotes.dwarfDodgeFeature:+1 AC vs. orc',
          'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
          'skillNotes.stonecunningFeature:' +
            '+2 Search involving stone or metal/automatic check w/in 10 ft'
        ]);
      }

    } else if(race == 'Dworg') {

      features = [
        1, 'Darkvision', 1, 'Dworg Ability Adjustment',
        1, 'Dworg Favored Enemy', 1, 'Minor Light Sensitivity', 1, 'Rugged',
        1, 'Spell Resistance'
      ];
      notes = [
        'abilityNotes.dworgAbilityAdjustmentFeature:' +
          '+2 strength/+2 constitution/-2 intelligence/-2 charisma',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'meleeNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'meleeNotes.minorLightSensitivityFeature:DC 15 Fortitude save in sunlight to avoid -1 attack',
        'saveNotes.ruggedFeature:+2 all saves',
        'saveNotes.spellResistanceFeature:+2 vs. spells'
      ];
      ScribeCustomRules('charisma',
        'abilityNotes.dworgAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('constitution',
        'abilityNotes.dworgAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('intelligence',
        'abilityNotes.dworgAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules
        ('saveFortitude', 'abilityNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('saveReflex', 'abilityNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('saveWill', 'abilityNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('strength',
        'abilityNotes.dworgAbilityAdjustmentFeature', '+', '2'
      );

    } else if(race.indexOf('Elf') >= 0) {

      if(race == 'Jungle Elf') {
      } else if(race == 'Sea Elf') {
      } else if(race == 'Snow Elf') {
      } else if(race == 'Wood Elf') {
      }

    } else if(race.indexOf('Elfling') >= 0) {

      features = [
        1, 'Dextrous Hands', 1, 'Elfling Ability Adjustment', 1, 'Keen Senses',
        1, 'Low Light Vision', 1, 'Natural Channeler', 1, 'Small'
      ];
      notes = [
        'abilityNotes.elflingAbilityAdjustmentFeature:' +
          '+4 dexterity/-2 strength/-2 constitution',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'featureNotes.naturalChannelerFeature:Innate Magic is a bonus feat',
        'saveNotes.luckyFeature:+1 all saves',
        'skillNotes.dextrousHandsFeature:+2 Heal',
        'skillNotes.keenSensesFeature:+2 Listen/Spot',
      ];
      ScribeCustomRules('constitution',
        'abilityNotes.elflingAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('dexterity',
        'abilityNotes.elflingAbilityAdjustmentFeature', '+', '4'
      );
      ScribesCustomRules('features.Innate Magic',
        'featureNotes.naturalChannelerFeature', '=', '1'
      );
      ScribeCustomRules('saveFortitude', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveReflex', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveWill', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('strength',
        'abilityNotes.elflingAbilityAdjustmentFeature', '+', '-2'
      );
      if(race == 'Halfling Raised Elfling') {
        features = features.concat([1, 'Bound To The Beast']);
        ScribeCustomRules
          ('features.Mounted Combat', 'features.Bound To The Beast', '=', '1');
      }

    } else if(race == 'Erenlander') {

      features = [1, 'Erenlander Ability Adjustment'];
      notes = [
        'abilityNotes.erenlanderAbilityAdjustmentFeature:+2 any/-2 any'
      ];
      ScribeCustomRules
        ('featCount', 'featureNotes.erenlanderFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.erenlanderFeatCountBonus',
        'race', '=', 'source == "Erenlander" ? 2 : null'
      );
      ScribeCustomRules('skillNotes.erenlanderSkillPointsBonus',
        'race', '?', 'source == "Erenlander"',
        'level', '=', '(source + 3) * 2'
      );
      ScribeCustomRules
        ('skillPoints', 'skillNotes.erenlanderSkillPointsBonus', '+', null);

    } else if(race.indexOf('Gnome') >= 0) {

      features = [
        1, 'Dwarven Kin', 1, 'Gnome Ability Adjustment',
        1, 'Low Light Vision', 1, 'Natural Riverfolk', 1, 'Natural Swimmer',
        1, 'Natural Trader', 1, 'Slow', 1, 'Small'
      ];
      notes = [
        'abilityNotes.gnomeAbilityAdjustmentFeature:+4 charisma/-2 strength',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'saveNotes.dwarvenKinFeature:+1 Fortitude',
        'saveNotes.dwarvenKinFeature2:+2 spells',
        'skillNotes.naturalRiverfolkFeature:' +
          '+2 Perform/Profession (Boater And Sailor)/Swim/UseRope',
        'skillNotes.naturalSwimmerFeature:' +
          'Swim at half speed as move action/hold breath for %V rounds',
        'skillNotes.naturalTraderFeature:' +
          '+4 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
      ];
      ScribeCustomRules('charisma',
        'abilityNotes.gnomeAbilityAdjustmentFeature', '+', '4'
      );
      ScribeCustomRules
        ('skillNotes.naturalSwimmerFeature', 'constitution', '=', null);
      ScribeCustomRules('strength',
        'abilityNotes.gnomeAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules
        ('saveFortitude', 'saveNotes.dwarvenKinFeature', '+', '1');
      ScribeCustomRules
        ('skillNotes.dwarvenKinFeature2', 'features.Dwarven Kin', '=', '1');

    } else if(race.indexOf('Halfling') >= 0) {

      features = [
        1, 'Dextrous Hands', 1, 'Graceful', 1, 'Halfling Ability Adjustment',
        1, 'Keen Senses', 1, 'Low Light Vision', 1, 'Lucky', 1, 'Slow',
        1, 'Small', 1, 'Unafraid'
      ];
      notes = [
        'abilityNotes.halflingAbilityAdjustmentFeature:' +
          '+2 dexterity/-2 strength',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'featureNotes.stoutFeature:Endurance/Toughness feats',
        'featureNotes.studiousFeature:Magecraft feat',
        'saveNotes.luckyFeature:+1 all saves',
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.dextrousHandsFeature:+2 Heal',
        'skillNotes.dextrousHandsFeature2:+2 Craft (non-metal/non-wood)',
        'skillNotes.keenSensesFeature:+2 Listen/Spot',
        'skillNotes.gracefulFeature:+2 Climb/Jump/Move Silently/Tumble'
      ];
      ScribeCustomRules('dexterity',
        'abilityNotes.halflingAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('strength',
        'abilityNotes.halflingAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('saveFortitude', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveReflex', 'saveNotes.luckyFeature', '+', '1');
      ScribeCustomRules('saveWill', 'saveNotes.luckyFeature', '+', '1');

      if(race == 'Agrarian Halfling') {
        ScribeCustomRules('features.Endurance', 'features.Stout', '=', '1');
        ScribeCustomRules('features.Magecraft', 'features.Studious', '=', '1');
        ScribeCustomRules('features.Toughness', 'features.Stout', '=', '1');
      } else if(race == 'Nomadic Halfling') {
        ScribeCustomRules
          ('features.Magecraft', 'features.Bound To The Spirits', '=', '1');
        ScribeCustomRules
          ('features.Mounted Combat', 'features.Bound To The Beast', '=', '1');
      }

    } else if(race == 'Orc') {

    } else if(race.indexOf('Sarcosan') >= 0) {

      features = [
        1, 'Quick', 1, 'Sarcosan Ability Adjustment'
      ];
      notes = [
        'abilityNotes.sarcosanAbilityAdjustmentFeature:' +
          '+2 charisma/+2 intelligence/-2 wisdom',
        'meleeNotes.quickFeature:+1 attack w/light weapons',
        'saveNotes.quickFeature:+1 Reflex'
      ];
      if(race == 'Plains Sarcosan') {
        features = features.concat([1, 'Horseman']);
        notes = notes.concat([
          'meleeNotes.horsemanFeature:+1 melee damage/half ranged penalty',
          'skillNotes.horsemanFeature:' +
            '+2 Concentration (mounted)/Handle Animal (horse)/Ride (horse)'
        ]);
      } else if(race == 'Urban Sarcosan') {
        features = features.concat([1, 'Interactive']);
        notes = notes.concat
          (['skillNotes.interactiveFeature:+2 Bluff/Diplomacy/Sense Motive']);
      }
      ScribeCustomRules('charisma',
        'abilityNotes.sarcosanAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules
        ('featCount', 'featureNotes.sarcosanFeatCountBonus', '+', null);
      ScribeCustomRules('featureNotes.sarcosanFeatCountBonus',
        'race', '=', 'source.indexOf("Sarcosan") >= 0 ? 1 : null'
      );
      ScribeCustomRules('intelligence',
        'abilityNotes.sarcosanAbilityAdjustmentFeature', '+', '2'
      );
      ScribeCustomRules('skillNotes.dornSkillPointsBonus',
        'race', '?', 'source.indexOf("Sarcosan") >= 0',
        'level', '=', 'source + 3'
      );
      ScribeCustomRules
        ('skillPoints', 'skillNotes.sarcosanSkillPointsBonus', '+', null);
      ScribeCustomRules('wisdom',
        'abilityNotes.sarcosanAbilityAdjustmentFeature', '+', '-2'
      );

    } else
      continue;

/*
        'meleeNotes.dodgeGiantsFeature:+4 AC vs. giant creatures',
      ];
      ScribeCustomRules('charisma',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '-2'
      );
      ScribeCustomRules('constitution',
        'abilityNotes.dwarfAbilityAdjustmentFeature', '+', '2'
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
*/

    ScribeCustomRace(race, features);
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

  /* Returns a random key of the object #o#. */
  function RandomKey(o) {
    var keys = Scribe.GetKeys(o);
    return keys[Scribe.Random(0, keys.length - 1)];
  }

  if(attribute == 'heroicPath') {
    attributes[attribute] = RandomKey(Scribe.heroicPaths);
  }

}
