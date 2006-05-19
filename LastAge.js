/* $Id: LastAge.js,v 1.9 2006/05/19 03:53:52 Jim Exp $ */

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
  'Charismatic Channeler', 'Defender', 'Hermetic Channler', 
  'Spiritual Channeler', 'Wildlander'
];
MN2E.FEATS = [
  /* Agrarian Halfling Features (MN 46) */
  'Stout', 'Studious',
  /* Nomadic Halfling Features (MN 46) */
  'Bound To The Beast', 'Bound To The Spirits',
  /* Fighter Warrior's Ways (MN 85) */
  'Adapter', 'Improviser', 'Leader Of Men', 'Survivor',
  /* Spiritual Channeler Gifts (MN 77) */
  'Confident Effect', 'Heightened Effect', 'Mastery Of Nature',
  'Mastery Of Spirits', 'Mastery Of The Unnatural', 'Powerful Effect',
  'Precise Effect', 'Specific Effect', 'Universal Effect',
  /* Hermetic Channeler Gifts (MN 78) */
  'Foe Specialty', 'Knowledge Specialty','Quick Reference', 'Spell Specialty',
  /* Charismatic Channeler Gifts (MN 79) */
  'Greater Confidence', 'Greater Fury', 'Improved Confidence', 'Improved Fury',
  'Inspire Confidence', 'Inspire Facination', 'Inspire Fury',
  'Mass Suggestion', 'Suggestion',
  /* Defender Abilities (MN 83) */
  'Defensive Mastery', 'Dodge Training', 'Flurry Attack', 'Grappling Training',
  'Offensive Training', 'Speed Training',
  'Cover Ally', 'One With The Weapon', 'Rapid Strike', 'Strike And Hold',
  'Counterattack', 'Devastating Strike', 'Furious Grapple',
  'Retailiatory Strike', 'Weapon Trap'
];
MN2E.LANGUAGES = [
];
MN2E.PATHS = [
  'Beast', 'Chanceborn', 'Charismatic', 'Dragonblooded', 'Earthbonded',
  'Faithful', 'Fellhunter', 'Giantblooded', 'Guardian', 'Healer', 'Ironborn',
  'Jack-Of-All-Trades', 'Mountainborn', 'Naturefriend', 'Northblooded',
  'Quickened', 'Painless', 'Pureblood', 'Seaborn', 'Seer', 'Speaker',
  'Spellsoul', 'Shadow Walker', 'Steelblooded', 'Sunderborn', 'Tactician',
  'Warg'
];
MN2E.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Clan Raised Dwarrow', 'Clan Raised Dworg',
  'Danisil Raised Elfling', 'Dorn', 'Erenlander', 'Gnome',
  'Gnome Raised Dwarrow', 'Halfling Raised Elfling', 'Jungle Elf',
  'Kurgun Dwarf', 'Kurgun Raised Dwarrow', 'Kurgun Raised Dworg',
  'Nomadic Halfling', 'Orc', 'Plains Sarcosan', 'Sea Elf', 'Snow Elf',
  'Urban Sarcosan', 'Wood Elf'
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

  for(var i = 0; i < MN2E.CLASSES.length; i++) {

    var klass = MN2E.CLASSES[i];

    if(klass.indexOf(' Channeler') >= 0) {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        1, 'Art Of Magic', 1, 'Bonus Spell Energy', 2, 'Bonus Spellcasting',
        2, 'Bonus Spells', 2, 'Summon Familiar', 3, 'Tradition Gift',
        4, 'Bonus Feats'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.bonusFeatsFeature:%V arcane feats',
        'featureNotes.bonusSpellcastingFeature:%V Spellcasting feats',
        'featureNotes.traditionGiftFeature:%V tradition gift feats',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.bonusSpellEnergyFeature:%V extra spell energy points',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_NONE;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_SIMPLE;
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
        'featureNotes.bonusSpellcastingFeature', '+', null,
        'featureNotes.traditionGiftFeature', '+', null
      );
      ScribeCustomRules('featureNotes.bonusFeatsFeature',
        'channelerLevels', '=', 'Math.floor((source - 1) / 3)'
      );
      ScribeCustomRules('featureNotes.bonusSpellcastingFeature',
        'channelerLevels', '=', 'Math.floor((source + 1) / 3)'
      );
      ScribeCustomRules('featureNotes.traditionGiftFeature',
        'channelerLevels', '=', 'Math.floor(source / 3)'
      );
      ScribeCustomRules('features.Magecraft', 'levels.Spellcaster', '=', '1');
      ScribeCustomRules
        ('magicNotes.bonusSpellEnergyFeature', 'channelerLevels', '+=', null);
      ScribeCustomRules('magicNotes.bonusSpellsFeature',
        'channelerLevels', '+=', '(source - 1) * 2'
      );
      ScribeCustomRules
        ('spellEnergy', 'magicNotes.bonusSpellEnergyFeature', '+', null);

      if(klass == 'Charismatic Channeler') {
        skills = skills.concat([
          'Bluff', 'Diplomacy', 'Gather Information', 'Intimidate',
          'Sense Motive'
        ]);
        ScribeCustomRules
          ('channelerLevels', 'levels.Charismatic Channeler', '+=', null);
      } else if(klass == 'Hermetic Channeler') {
        skills = skills.concat([
          'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
          'Knowledge (Engineering)', 'Knowledge (Geography)',
          'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
          'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)'
        ]);
        ScribeCustomRules
          ('channelerLevels', 'levels.Hermetic Channeler', '+=', null);
      } else if(klass == 'Spiritual Channeler') {
        skills = skills.concat([
          'Diplomacy', 'Knowledge (Nature)', 'Sense Motive', 'Survival', 'Swim'
        ]);
        ScribeCustomRules
          ('channelerLevels', 'levels.Spiritual Channeler', '+=', null);
      }

    } else if(klass == 'Defender') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        1, 'Masterful Strike', 2, 'Defender Ability', 2, 'Stunning Fist',
        3, 'Improved Grapple', 4, 'Precise Strike',
        5, 'Incredible Resilience', 5, 'Incredible Speed', 6, 'Masterful Strike'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.incredibleSpeedFeature:Add up to %V speed',
        'featureNotes.defenderAbilityFeature:%V defender ability feats',
        'meleeNotes.incredibleResilienceFeature:Add up to %V HP',
        'meleeNotes.masterfulStrikeFeature:' +
           'Improved Unarmed Strike/extra unarmed damage',
        'meleeNotes.preciseStrikeFeature:Ignore %V points of damage resistance'
      ];
      profArmor = PH35.ARMOR_PROFICIENCY_NONE;
      profShield = PH35.SHIELD_PROFICIENCY_NONE;
      profWeapon = PH35.WEAPON_PROFICIENCY_NONE;
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
      ScribeCustomRules
        ('featCount', 'featureNotes.defenderAbilityFeature', '+', null);
      ScribeCustomRules('featureNotes.defenderAbilityFeature',
        'levels.Defender', '=', 'Math.floor((source + 1) / 3)'
      );
      ScribeCustomRules('features.Improved Unarmed Strike',
        'features.Masterful Strike', '=', '1'
      );
      ScribeCustomRules('abilityNotes.incredibleResilienceFeature',
        'levels.Defender', '=', '3 * Math.floor((source - 4) / 3)'
      );
      ScribeCustomRules('meleeNotes.preciseStrikeFeature',
        'levels.Defender', '=', 'Math.floor((source + 2) / 6)'
      );
      ScribeCustomRules('weaponDamage.Unarmed',
        'levels.Defender', '=', '(1 + Math.floor(source / 6)) + "d6"'
      );

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
  for(var i = 0; i < MN2E.FEATS.length; i++) {
    ScribeCustomRules
      ('features.' + MN2E.FEATS[i], 'feats.' + MN2E.FEATS[i], '=', '1');
  }

};

MN2E.HeroicPathRules = function() {

  ScribeCustomChoices('heroicPaths', MN2E.PATHS);

  for(var i = 0; i < MN2E.PATHS.length; i++) {

    var features = null;
    var notes = null;
    var path = MN2E.PATHS[i];
    var spellFeatures = null;

    if(path == 'Beast') {

      features = [
        1, 'Vicious Assault', 1, 'Wild Sense', 2, 'Beastial Aura',
        5, 'Str Or Con Bonus', 7, 'Rage', 10, 'Dex Or Wis Bonus'
      ];
      spellFeatures = [
        3, 'Magic Fang%Vsource >= 13 ? 2 : 1', 4, 'Bear\'s Endurance',
        8, 'Greater Magic Fang%Vsource >= 17 ? 2 : 1', 9, 'Cat\'s Grace',
        14, 'Bull\'s Strength', 19, 'Freedom Of Movement'
      ];
      notes = [
        'abilityNotes.strOrConBonusFeature:Add %V to strength or constitution',
        'abilityNotes.dexOrWisBonusFeature:Add %V to dexterity or wisdom',
        'featureNotes.wildSenseFeature:%V choices of Low Light Vision/Sense',
        'meleeNotes.beastialAuraFeature:Turn animals as cleric %V/day',
        'meleeNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'meleeNotes.viciousAssaultFeature:Two claw attacks at %V each'
      ];
      ScribeCustomRules
        ('abilityNotes.dexOrWisBonusFeature', 'level', '=', 'source>=20?2:1');
      ScribeCustomRules
        ('abilityNotes.strOrConBonusFeature', 'level', '=', 'source>=15?2:1');
      ScribeCustomRules('beastTurningLevel',
        'meleeNotes.beastialAuraFeature', '?', null,
        'level', '=', null
      );
      ScribeCustomRules
        ('featureNotes.wildSenseFeature', 'level', '=', 'source >= 16 ? 2 : 1');
      ScribeCustomRules
        ('meleeNotes.beastialAuraFeature', 'level', '=', 'source>=12 ? 6 : 3');
      ScribeCustomRules
        ('meleeNotes.rageFeature', 'level', '+=', 'source >= 17 ? 2 : 1');
      ScribeCustomRules('meleeNotes.viciousAssaultFeature',
        'mediumViciousAssault', '=', null,
        'smallViciousAssault', '=', null
      );
      ScribeCustomRules('mediumViciousAssault',
        'level', '=', 'source >= 11 ? "d8" : source >= 6 ? "d6" : "d4"'
      );
      ScribeCustomRules('smallViciousAssault',
        'features.Small', '?', null,
        'mediumViciousAssault', '=', 'Scribe.smallDamage[source]'
      );
      ScribeCustomRules('turningLevel', 'beastTurningLevel', '+=', null);

    } else if(path == 'Chanceborn') {

      features = [
        1, 'Luck Of Heroes', 3, 'Unfettered', 4, 'Miss Chance', 6, 'Survivor',
        9, 'Take Ten', 19, 'Take Twenty'
      ];
      spellFeatures = [
        2, 'Resistance', 7, 'True Strike', 12, 'Aid', 17, 'Prayer'
      ];
      notes = [
        'featureNotes.luckOfHeroesFeature:Add %V to any d20 roll 1/day',
        'featureNotes.survivorFeature:' +
          'Defensive Roll/Evasion/Slippery Mind/Uncanny Dodge %V/day',
        'featureNotes.takeTenFeature:Take 10 on any d20 roll 1/day',
        'featureNotes.takeTwentyFeature:Take 20 on any d20 roll 1/day',
        'magicNotes.unfetteredFeature:<i>Freedom Of Movement</i> %V rounds/day',
        'meleeNotes.missChanceFeature:%V% chance of foe miss'
      ];
      ScribeCustomRules('featureNotes.luckOfHeroesFeature',
        'level', '=',
        '"d4" + (source >= 5 ? "/d6" : "") + (source >= 10 ? "/d8" : "") + ' +
        '(source >= 15 ? "/d10" : "") + (source >= 20 ? "/d12" : "")'
      );
      ScribeCustomRules('featureNotes.survivorFeature',
        'level', '=', 'Math.floor((source - 1) / 5)'
      );
      ScribeCustomRules
        ('features.Defensive Roll', 'features.Survivor', '=', '1');
      ScribeCustomRules('features.Evasion', 'features.Survivor', '=', '1');
      ScribeCustomRules
        ('features.Slippery Mind', 'features.Survivor', '=', '1');
      ScribeCustomRules
        ('features.Uncanny Dodge', 'features.Survivor', '=', '1');
      ScribeCustomRules('magicNotes.unfetteredFeature',
        'level', '=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules
        ('meleeNotes.missChanceFeature', 'level', '=', 'source >= 14 ? 10 : 5');

    } else if(path == 'Charismatic') {

      features = [
        4, 'Inspiring Oration', 5, 'Cha Bonus', 6, 'Leadership',
        12, 'Natural Leader',
      ];
      spellFeatures = [
        1, 'Charm Person', 2, 'Remove Fear', 3, 'Hypnotism', 7, 'Aid',
        8, 'Daze Monster', 11, 'Heroism', 13, 'Charm Monster',
        16, 'Suggestion', 17, 'Greater Heroism'
      ];
      notes = [
        'abilityNotes.chaBonusFeature:Add %V to charisma',
        'magicNotes.inspiringOrationFeature:' +
          'Give speech to apply spell-like ability to allies w/in 60 ft %V/day'
      ];
      /* TODO Natural Leader */
      ScribeCustomRules
        ('abilityNotes.chaBonusFeature', 'level', '=', 'Math.floor(source/5)');
      ScribeCustomRules('magicNotes.inspiringOrationFeature',
        'level', '=', 'Math.floor((source + 1) / 5)'
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
          'Reduce spell energy cost of spells from %V chosen schools by 1',
        'magicNotes.quickenedCounterspellingFeature:' +
          'Counterspell as move action 1/round',
        'magicNotes.spellPenetrationFeature:Add %V to spell penetration checks'
      ];
      ScribeCustomRules('magicNotes.bolsterSpellFeature',
        'level', '=', '1 + Math.floor(source / 5)'
      );
      ScribeCustomRules('magicNotes.bonusSpellEnergyFeature',
        'level', '+=', 'source >= 16 ? 8 : source >= 15 ? 6 : ' +
        '(Math.floor((source + 1) / 4) * 2)'
      );
      ScribeCustomRules('magicNotes.bonusSpellsFeature',
        'level', '+=', 'Math.floor((source + 4) / 6)'
      );
      ScribeCustomRules('magicNotes.frightfulPresenceFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      ScribeCustomRules('magicNotes.improvedSpellcastingFeature',
        'level', '+=', 'Math.floor(source / 6)'
      );
      ScribeCustomRules('magicNotes.spellPenetrationFeature',
        'level', '+=', 'Math.floor((source - 5) / 4)'
      );
      ScribeCustomRules
        ('spellEnergy', 'magicNotes.bonusSpellEnergyFeature', '+', null);

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
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door',
        'meleeNotes.naturalArmorFeature:+%V AC'
      ];
      /* TODO Tremorsense, Blindsense, Blindsight */
      ScribeCustomRules
        ('armorClass', 'meleeNotes.naturalArmorFeature', '+', null);
      ScribeCustomRules('meleeNotes.naturalArmorFeature',
        'level', '+=', 'source >= 18 ? 3 : source >= 10 ? 2 : 1'
      );

    } else if(path == 'Faithful') {

      features = [
        4, 'Turn Undead', 5, 'Wis Bonus'
      ];
      spellFeatures = [
        1, 'Bless', 2, 'Protection From Evil', 3, 'Divine Favor', 6, 'Aid',
        7, 'Bless Weapon', 8, 'Consecrate', 11, 'Daylight',
        12, 'Magic Circle Against Evil', 13, 'Prayer', 16, 'Holy Smite',
        17, 'Dispel Evil', 18, 'Holy Aura'
      ];
      notes = [
        'abilityNotes.wisBonusFeature:Add %V to charisma'
      ];
      /* TODO Turning frequency Math.floor((level + 1) / 5) */
      ScribeCustomRules
        ('abilityNotes.wisBonusFeature', 'level', '=', 'Math.floor(source/5)');

    } else if(path == 'Fellhunter') {

      features = [
        1, 'Sense The Dead', 2, 'Touch Of The Living', 3, 'Ward Of Life',
        5, 'Disrupting Attack'
      ];
      spellFeatures = null;
      notes = [
        'meleeNotes.disruptingAttackFeature:' +
           'Undead %V Will save or destroyed level/5/day',
        'meleeNotes.senseTheDeadFeature:Detect undead %V ft at will',
        'meleeNotes.touchOfTheLivingFeature:+%V damage vs. undead',
        'meleeNotes.wardOfLifeFeature:Immune to undead %V'
      ];
      ScribeCustomRules('meleeNotes.disruptingAttackFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      /* TODO fix computation */
      ScribeCustomRules('meleeNotes.senseTheDeadFeature',
        'level', '=', '10 * Math.floor((source + 2) / 2.5)'
      );
      ScribeCustomRules('meleeNotes.touchOfTheLivingFeature',
        'level', '=', 'Math.floor((source + 3) / 5)'
      );
      ScribeCustomRules('meleeNotes.wardOfLifeFeature',
        'level', '=',
        '"extraordinary special attacks" + ' +
        '(source >= 8 ? "/ability damage" : "") + ' +
        '(source >= 13 ? "/ability drain" : "") + ' +
        '(source >= 18 ? "/energy drain" : "")'
      );

    } else
      continue;

    var featureNote = path.substring(0, 1).toLowerCase() + path.substring(1);
    featureNote = 'featureNotes.' + featureNote.replace(/ /g, '') + 'Features';
    if(spellFeatures != null) {
      for(var j = 1; j < spellFeatures.length; j += 2) {
        var level = spellFeatures[j - 1];
        var pieces = spellFeatures[j].split(/%V/);
        var feature = pieces[0];
        var magicNote =
          feature.substring(0, 1).toLowerCase() + feature.substring(1);
        magicNote = 'magicNotes.' + magicNote.replace(/ /g, '') + 'Feature'; 
        var magicFormat = '<i>' + feature + '</i> 1/day';
        if(pieces.length > 1) {
          magicFormat = magicFormat.replace(/1.day/, '%V/day');
          ScribeCustomRules(magicNote, 'level', '=', pieces[1]);
        }
        features = features.concat([level, feature]);
        if(notes == null)
          notes = [];
        notes = notes.concat(magicNote + ':' + magicFormat);
      }
    }
    ScribeCustomFeatures('level', featureNote, features);
    ScribeCustomRules
      (featureNote, 'heroicPath', '?', 'source == "' + path + '"');
    if(notes != null)
      ScribeCustomNotes(notes);

  }
  ScribeCustomSheet('Heroic Path', 'Description', null, 'Alignment');

};

MN2E.MagicRules = function() {

};

MN2E.RaceRules = function() {

  /* Notes and rules that apply to multiple races */
  var notes = [
    'abilityNotes.naturalMountaineerFeature:' +
       'Unimpeded movement in mountainous terrain',
    'featureNotes.boundToTheBeastFeature:Mounted Combat feat',
    'saveNotes.coldHardy:+5 cold/half damage',
    'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
    'magicNotes.naturalChannelerFeature:Innate Magic',
    'meleeNotes.dodgeOrcsFeature:+1 AC vs. orc',
    'saveNotes.hardyFeature:+1 Fortitude',
    'saveNotes.luckyFeature:+1 all saves',
    'saveNotes.poisonResistanceFeature:+2 vs. poison',
    'saveNotes.spellResistanceFeature:+2 vs. spells',
    'skillNotes.dextrousHandsFeature:+2 Heal',
    'skillNotes.favoredRegion:' +
      'Knowledge (local) is a class skill/+2 Survival/Knowldedge (Nature)',
    'skillNotes.keenSensesFeature:+2 Listen/Search/Spot',
    'skillNotes.naturalMountaineerFeature:+2 Climb',
    'skillNotes.naturalRiverfolkFeature:' +
      '+2 Perform/Profession (Sailor)/Swim/Use Rope',
    'skillNotes.naturalSwimmerFeature:' +
       'Swim at half speed as move action/hold breath for %V rounds',
    'skillNotes.stonecunningFeature:' +
      '+2 Search involving stone or metal/automatic check w/in 10 ft',
    'skillNotes.stoneFamiliarityFeature:' +
       '+2 Appraise/Craft involving stone or metal'
  ];
  ScribeCustomNotes(notes);
  ScribeCustomRules
    ('features.Innate Magic', 'magicNotes.naturalChannelerFeature', '=', '1');
  ScribeCustomRules
    ('features.Mounted Combat', 'features.Bound To The Beast', '=', '1');
  ScribeCustomRules
    ('saveFortitude', 'saveNotes.hardyFeature', '+', '1');
  ScribeCustomRules('saveFortitude', 'saveNotes.luckyFeature', '+', '1');
  ScribeCustomRules('saveReflex', 'saveNotes.luckyFeature', '+', '1');
  ScribeCustomRules('saveWill', 'saveNotes.luckyFeature', '+', '1');
  ScribeCustomRules
    ('skillNotes.naturalSwimmerFeature', 'constitution', '=', 'source * 3');

  for(var i = 0; i < MN2E.RACES.length; i++) {

    var adjustment;
    var features = null;
    var notes = null;
    var race = MN2E.RACES[i];

    if(race == 'Dorn') {

      adjustment = '+2 strength/-2 intelligence';
      features = [1, 'Brotherhood', 1, 'Cold Hardy', 1, 'Hardy', 1, 'Strong'];
      notes = [
        'meleeNotes.brotherhoodFeature:' +
          '+1 attack when fighting alongside 4+ Dorns',
        'meleeNotes.strongFeature:+1 attack w/two-handed weapons'
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
        'meleeNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'meleeNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'meleeNotes.resilientFeature:+2 AC'
      ];
      ScribeCustomRules('abilityNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      ScribeCustomRules('armorClass', 'meleeNotes.resilientFeature', '+', '2');
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
        notes = notes.concat([
        ]);
      }

    } else if(race.indexOf(' Dwarrow') >= 0) {

      adjustment = '+2 charisma';
      features = [
        1, 'Darkvision', 1, 'Poison Resistance', 1, 'Small', 1, 'Slow',
        1, 'Spell Resistance', 1, 'Tough'
      ];
      notes = [
        'meleeNotes.toughFeature:+1 AC'
      ];
      ScribeCustomRules('armorClass', 'meleeNotes.toughFeature', '+', '1');
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

    } else if(race.indexOf('Dworg') >= 0) {

      adjustment = '+2 strength/+2 constitution/-2 intelligence/-2 charisma';
      features = [
        1, 'Darkvision', 1, 'Dworg Favored Enemy',
        1, 'Minor Light Sensitivity', 1, 'Rugged', 1, 'Spell Resistance'
      ];
      notes = [
        'meleeNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'meleeNotes.minorLightSensitivityFeature:DC 15 Fortitude save in sunlight to avoid -1 attack',
        'saveNotes.ruggedFeature:+2 all saves'
      ];
      ScribeCustomRules('saveFortitude', 'saveNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('saveReflex', 'saveNotes.ruggedFeature', '+', '2');
      ScribeCustomRules('saveWill', 'saveNotes.ruggedFeature', '+', '2');
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
        features = features.concat([1, 'Bound To The Beast']);
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

      if(race == 'Jungle Elf') {
        features = features.concat([
          1, 'Feral Elf', 1, 'Improved Natural Channeler', 1, 'Spirit Foe'
        ]);
        notes = notes.concat([
          'saveNotes.spiritFoeFeature2:+2 vs. outsiders',
          'skillNotes.feralElfFeature:+2 Listen/Search/Spot',
          'skillNotes.feralElfFeature2:+2 Balance (trees)/Climb (trees)',
          'skillNotes.spiritFoeFeature:+4 Hide (nature)/Move Silently (nature)'
        ]);
        ScribeCustomRules
          ('skillNotes.feralElfFeature2', 'features.Feral Elf', '=', '1');
      } else if(race == 'Sea Elf') {
        features = features.concat([1, 'Natural Sailor', 1, 'Natural Swimmer']);
        notes = notes.concat([
          'skillNotes.naturalSailorFeature:' +
            '+2 Craft/Profession/Use Rope (ship/sea)'
        ]);
        /* TODO +8 Swim check (special action/hazard)/"run" while swimming/hold breath * 6 (not 3) */
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
      }

    } else if(race == 'Erenlander') {

      adjustment = null;
      features = [1, 'Crafter'];
      notes = [
        'abilityNotes.erenlanderAbilityAdjustment:+2 any/-2 any',
        'skillNotes.crafterFeature:+4 ranks in Craft'
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
        'skillNotes.crafterFeature', '+', '4',
        'skillNotes.erenlanderSkillPointsBonus', '+', null
      );

    } else if(race.indexOf('Gnome') >= 0) {

      adjustment = '+4 charisma/-2 strength';
      features = [
        1, 'Dwarf Tough', 1, 'Gnome Ability Adjustment',
        1, 'Low Light Vision', 1, 'Natural Riverfolk', 1, 'Natural Swimmer',
        1, 'Natural Trader', 1, 'Slow', 1, 'Small', 1, 'Spell Resistance'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'saveNotes.dwarfToughFeature:+1 Fortitude',
        'skillNotes.naturalTraderFeature:' +
          '+4 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
      ];
      ScribeCustomRules
        ('saveFortitude', 'saveNotes.dwarfToughFeature', '+', '1');

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

      if(race == 'Agrarian Halfling') {
        features = features.concat([1, 'Dextrous Hands']);
        notes = notes.concat([
          'featureNotes.stoutFeature:Endurance/Toughness feats',
          'featureNotes.studiousFeature:Magecraft feat',
          'skillNotes.dextrousHandsFeature2:+2 Craft (non-metal/non-wood)'
        ]);
        ScribeCustomRules('featCount',
          'featureNotes.agrarianHalflingFeatCountBonus', '+', null
        );
        ScribeCustomRules('featureNotes.agrarianHalflingFeatCountBonus',
          'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
        );
        ScribeCustomRules
          ('features.Endurance', 'featureNotes.stoutFeature', '=', '1');
        ScribeCustomRules
          ('features.Magecraft', 'featureNotes.studiousFeature', '=', '1');
        ScribeCustomRules
          ('features.Toughness', 'featureNotes.stoutFeature', '=', '1');
        ScribeCustomRules('skillNotes.dextrousHandsFeature2',
          'features.Dextrous Hands', '=', '1'
        );
      } else if(race == 'Nomadic Halfling') {
        features = features.concat([1, 'Skilled Rider']);
        notes = notes.concat([
          'featureNotes.boundToTheSpiritsFeature:Magecraft feat',
          'skillNotes.skilledRiderFeature:+2 Handle Animal/Ride',
          'skillNotes.skilledRiderFeature2:+2 Concentration (mounted)'
        ]);
        ScribeCustomRules
          ('features.Magecraft', 'features.Bound To The Spirits', '=', '1');
        ScribeCustomRules('skillNotes.skilledRiderFeature2',
          'features.Skilled Rider', '=', '1'
        );
      }

    } else if(race == 'Orc') {

      adjustment = '+4 strength/-2 intelligence/-2 charisma';
      features = [1, 'Cold Resistance', 1, 'Darkvision',
                  1, 'Light Sensitivity', 1, 'Natural Preditor',
                  1, 'Night Fighter'
      ];
      notes = [
        'meleeNotes.lightSensitivityFeature:+1 attack in daylight',
        'meleeNotes.nightFighterFeature:+1 attack in darkness',
        'saveNotes.coldResistanceFeature:immune non-lethal/half lethal',
        'skillNotes.naturalPreditorFeature:+%V Indimidate'
      ];

    } else if(race.indexOf(' Sarcosan') >= 0) {

      adjustment = '+2 charisma/+2 intelligence/-2 wisdom';
      features = [1, 'Quick'];
      notes = [
        'meleeNotes.quickFeature:+1 attack w/light weapons',
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
          'meleeNotes.naturalHorsemanFeature:' +
            '+1 melee damage/half ranged penalty',
          'skillNotes.naturalHorsemanFeature:' +
            '+4 Concentration (mounted)/Handle Animal (horse)/Ride (horse)'
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

  /* Returns a random key of the object #o#. */
  function RandomKey(o) {
    var keys = Scribe.GetKeys(o);
    return keys[Scribe.Random(0, keys.length - 1)];
  }

  if(attribute == 'heroicPath') {
    attributes[attribute] = RandomKey(Scribe.heroicPaths);
  }

}
