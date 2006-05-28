/* $Id: LastAge.js,v 1.13 2006/05/28 06:23:32 Jim Exp $ */

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
];
MN2E.LANGUAGES = [
];
MN2E.PATHS = [
  'Beast', 'Chanceborn', 'Charismatic', 'Dragonblooded', 'Earthbonded',
  'Faithful', 'Fellhunter', 'Feyblooded', 'Giantblooded', 'Guardian', 'Healer',
  'Ironborn', 'Jack-Of-All-Trades', 'Mountainborn', 'Naturefriend',
  'Northblooded', 'Quickened', 'Painless', 'Pureblood', 'Seaborn', 'Seer',
  'Speaker', 'Spellsoul', 'Shadow Walker', 'Steelblooded', 'Sunderborn',
  'Tactician', 'Warg'
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
  'Retailiatory Strike', 'Weapon Trap',
  /* Wildlander Traits (MN 88) */
  'Animal Companion', 'Camouflage', 'Evasion', 'Hated Foe',
  'Hide In Plain Sight', 'Hunted By The Shadow', 'Improved Evasion',
  'Improved Woodland Stride', 'Instinctive Response', 'Master Hunter',
  'Overland Stride', 'Quick Stride', 'Rapid Response', 'Sense Dark Magic',
  'Skill Mastery', 'Slippery Mind', 'Trackless Step', 'True Aim',
  'Wild Empathy', 'Wilderness Trapfinding', 'Woodland Stride'
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

  /* TODO Fighter's Warrior Ways */
  ScribeCustomRules('classSkills.Knowledge (Shadow)', 'levels.Rogue', '=', '1');
  ScribeCustomRules('classSkills.Speak Language', 'levels.Rogue', '=', '1');

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
        'featureNotes.traditionGiftFeature:%V tradition gift feats',
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
        'combatNotes.incredibleResilienceFeature:Add up to %V HP',
        'combatNotes.masterfulStrikeFeature:' +
           'Improved Unarmed Strike/extra unarmed damage',
        'combatNotes.preciseStrikeFeature:' +
          'Ignore %V points of damage resistance',
        'featureNotes.defenderAbilityFeature:%V defender ability feats'
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
      ScribeCustomRules('abilityNotes.incredibleResilienceFeature',
        'levels.Defender', '=', '3 * Math.floor((source - 4) / 3)'
      );
      ScribeCustomRules('combatNotes.preciseStrikeFeature',
        'levels.Defender', '=', 'Math.floor((source + 2) / 6)'
      );
      ScribeCustomRules
        ('featCount', 'featureNotes.defenderAbilityFeature', '+', null);
      ScribeCustomRules('featureNotes.defenderAbilityFeature',
        'levels.Defender', '=', 'Math.floor((source + 1) / 3)'
      );
      ScribeCustomRules('features.Improved Unarmed Strike',
        'features.Masterful Strike', '=', '1'
      );
      ScribeCustomRules('weaponDamage.Unarmed',
        'levels.Defender', '=', '(1 + Math.floor(source / 6)) + "d6"'
      );

    } else if(klass == 'Wildlander') {

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
      ('features.' + MN2E.FEATS[i], 'feats.' + MN2E.FEATS[i], '=', '1');
  }
  ScribeCustomChoices('selectableFeatures', MN2E.SELECTABLE_FEATURES);
  for(var i = 0; i < MN2E.SELECTABLE_FEATURES.length; i++) {
    ScribeCustomRules('features.' + MN2E.SELECTABLE_FEATURES[i],
      'selectableFeatures.' + MN2E.SELECTABLE_FEATURES[i], '=', '1'
    );
  }

};

MN2E.HeroicPathRules = function() {

  ScribeCustomChoices('heroicPaths', MN2E.PATHS);

  ScribeCustomRules('featCount', 'featureNotes.bonusFeatFeature', '+', null);

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
        3, 'Magic Fang', 4, 'Bear\'s Endurance', 8, 'Greater Magic Fang',
        9, 'Cat\'s Grace', 13, 'Magic Fang', 14, 'Bull\'s Strength',
        17, 'Greater Magic Fang', 19, 'Freedom Of Movement'
      ];
      notes = [
        'abilityNotes.strOrConBonusFeature:Add %V to strength or constitution',
        'abilityNotes.dexOrWisBonusFeature:Add %V to dexterity or wisdom',
        'combatNotes.beastialAuraFeature:Turn animals as cleric %V/day',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'combatNotes.viciousAssaultFeature:Two claw attacks at %V each',
        'featureNotes.wildSenseFeature:%V choices of Low Light Vision/Sense'
      ];
      ScribeCustomRules
        ('abilityNotes.dexOrWisBonusFeature', 'level', '=', 'source>=20?2:1');
      ScribeCustomRules
        ('abilityNotes.strOrConBonusFeature', 'level', '=', 'source>=15?2:1');
      ScribeCustomRules('beastTurningLevel',
        'combatNotes.beastialAuraFeature', '?', null,
        'level', '=', null
      );
      ScribeCustomRules
        ('combatNotes.beastialAuraFeature', 'level', '=', 'source>=12 ? 6 : 3');
      ScribeCustomRules
        ('combatNotes.rageFeature', 'level', '+=', 'source >= 17 ? 2 : 1');
      ScribeCustomRules('combatNotes.viciousAssaultFeature',
        'mediumViciousAssault', '=', null,
        'smallViciousAssault', '=', null
      );
      ScribeCustomRules
        ('featureNotes.wildSenseFeature', 'level', '=', 'source >= 16 ? 2 : 1');
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
        'combatNotes.missChanceFeature:%V% chance of foe miss',
        'featureNotes.luckOfHeroesFeature:Add %V to any d20 roll 1/day',
        'featureNotes.survivorFeature:' +
          'Defensive Roll/Evasion/Slippery Mind/Uncanny Dodge %V/day',
        'featureNotes.takeTenFeature:Take 10 on any d20 roll 1/day',
        'featureNotes.takeTwentyFeature:Take 20 on any d20 roll 1/day',
        'magicNotes.unfetteredFeature:<i>Freedom Of Movement</i> %V rounds/day'
      ];
      ScribeCustomRules('combatNotes.missChanceFeature',
        'level', '=', 'source >= 14 ? 10 : 5'
      );
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
        'combatNotes.naturalArmorFeature:+%V AC',
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door'
      ];
      /* TODO Tremorsense, Blindsense, Blindsight */
      ScribeCustomRules
        ('armorClass', 'combatNotes.naturalArmorFeature', '+', null);
      ScribeCustomRules('combatNotes.naturalArmorFeature',
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
        'combatNotes.disruptingAttackFeature:' +
           'Undead %V Will save or destroyed level/5/day',
        'combatNotes.senseTheDeadFeature:Detect undead %V ft at will',
        'combatNotes.touchOfTheLivingFeature:+%V damage vs. undead',
        'combatNotes.wardOfLifeFeature:Immune to undead %V'
      ];
      ScribeCustomRules('combatNotes.disruptingAttackFeature',
        'level', '=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      /* TODO fix computation */
      ScribeCustomRules('combatNotes.senseTheDeadFeature',
        'level', '=', '10 * Math.floor((source + 2) / 2.5)'
      );
      ScribeCustomRules('combatNotes.touchOfTheLivingFeature',
        'level', '=', 'Math.floor((source + 3) / 5)'
      );
      ScribeCustomRules('combatNotes.wardOfLifeFeature',
        'level', '=',
        '"extraordinary special attacks" + ' +
        '(source >= 8 ? "/ability damage" : "") + ' +
        '(source >= 13 ? "/ability drain" : "") + ' +
        '(source >= 18 ? "/energy drain" : "")'
      );

    } else if(path == 'Feyblooded') {

      features = [
        1, 'Fey Vision', 4, 'Unearthly Grace'
      ];
      spellFeatures = [
        2, 'Disguise Self', 3, 'Ventriloquism', 5, 'Magic Aura',
        6, 'Invisibility', 9, 'Nondetection', 10, 'Glibness',
        11, 'Deep Slumber', 14, 'False Vision', 15, 'Rainbow Pattern',
        17, 'Mislead', 18, 'Seeming'
      ];
      notes = [
        'featureNotes.unearthlyGraceFeature:' +
          '+%V bonus points distributed to AC/saving throw/dexterity checks',
        'magicNotes.feyVisionFeature:Detect %V auras at will'
      ];
      ScribeCustomRules('featureNotes.unearthlyGraceFeature',
        'level', '=', 'Math.floor(source / 4)'
      );
      ScribeCustomRules
        ('features.Low Light Vision', 'features.Fey Vision', '=', '1');
      ScribeCustomRules('magicNotes.feyVisionFeature',
        'level', '=', 'source >= 19 ? "all magic" : ' +
                      'source >= 13 ? "enchantment/illusion" : ' +
                      'source >= 7 ? "enchantment" : null'
      );

    } else if(path == 'Giantblooded') {

      features = [
        1, 'Obvious', 2, 'Rock Throwing', 3, 'Intimidating Size',
        4, 'Fast Movement', 5, 'Str Bonus', 8, 'Fearsome Charge', 10, 'Large',
        20, 'Extra Reach'
      ];
      spellFeatures = null;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'abilityNotes.strBonusFeature:Add %V to strength',
        'combatNotes.extraReachFeature:15 ft reach',
        'combatNotes.fearsomeChargeFeature:' +
           '+%V damage/-1 AC for every 10 ft in charge',
        'combatNotes.rockThrowingFeature:Use boulders as ranged weapons',
        'skillNotes.intimidatingSizeFeature:+%V Intimidate',
        'skillNotes.obviousFeature:-4 Hide'
      ];
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'level', '=', 'Math.floor((source + 4) / 8) * 5'
      );
      ScribeCustomRules('abilityNotes.strBonusFeature',
        'level', '=', 'Math.floor((source + 5) / 10)'
      );
      ScribeCustomRules('combatNotes.fearsomeChargeFeature',
        'level', '=', 'Math.floor((source + 2) / 10)'
      );
      ScribeCustomRules('skillNotes.intimidatingSizeFeature',
        'level', '=', 'source >= 17 ? 10 : source >= 14 ? 8 : ' +
                      '(Math.floor((source + 1) / 4) * 2)'
      );
      ScribeCustomChoices('weapons', 'Boulder:d10 R30');
      ScribeCustomRules
        ('weapons.Boulder', 'combatNotes.rockThrowingFeatures', '=', '1');
      ScribeCustomRules('weaponDamage.Boulder',
        'level', '=', 'source >= 16 ? "2d8" : source >= 9 ? "2d6" : "d10"'
      );

    } else if(path == 'Guardian') {

      features = [
        1, 'Inspire Valor', 2, 'Detect Evil', 3, 'Righteous Fury',
        4, 'Smite Evil', 5, 'Con Bonus', 6, 'Lay On Hands',
        12, 'Aura Of Courage', 16, 'Death Ward'
      ];
      spellFeatures = null;
      notes = [
        'abilityNotes.strBonusFeature:Add %V to constitution',
        'combatNotes.righteousFuryFeature:' +
          'Ignore %V points melee damage reduction',
        'combatNotes.smiteEvilFeature:' +
          '%V/day add conMod to attack, level to damage vs. evil',
        'featureNotes.inspireValorFeature:' +
          'Allies w/in 30 ft +1 attack/fear saves 1 round/level %V/day',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'saveNotes.auraOfCourageFeature:' +
          'Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.deathWardFeature:Immune to negative energy/death effects'
      ];
      ScribeCustomRules('abilityNotes.conBonusFeature',
        'level', '=', 'Math.floor((source + 5) / 10)'
      );
      ScribeCustomRules('combatNotes.righteousFuryFeature',
        'level', '=', 'source >= 17 ? 12 : (Math.floor((source + 1) / 4) * 3)'
      );
      ScribeCustomRules('combatNotes.smiteEvilFeature',
        'level', '=', 'Math.floor((source - (source <= 8 ? 0 : 2)) / 4)'
      );
      ScribeCustomRules('featureNotes.inspireValorFeature',
        'level', '=', 'source >= 19 ? 3 : source >= 9 ? 2 : 1'
      );
      ScribeCustomRules('magicNotes.layOnHandsFeature',
        'level', '+=', null,
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
        1, 'Incredible Resilience', 2, 'Fort Bonus', 3, 'Natural Armor',
        4, 'Improved Healing', 5, 'Damage Reduction',
        6, 'Elemental Resistance', 9, 'Improved Indefatigable',
        14, 'Greater Improved Healing'
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
        'saveNotes.fortBonusFeature:%V added to fortitude saves',
        'saveNotes.indefatigableFeature:Immune fatigue effects',
        'saveNotes.improvedIndefatigableFeature:Immune exhaustion effects'
      ];
      ScribeCustomRules('combatNotes.damageReductionFeature',
        'level', '+=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('combatNotes.improvedHealingFeature',
        'level', '+=', 'Math.floor(source / 2)'
      );
      ScribeCustomRules
        ('armorClass', 'combatNotes.naturalArmorFeature', '+', null);
      /* TODO Differs from Earthbonded */
      ScribeCustomRules('combatNotes.naturalArmorFeature',
        'level', '+=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules('saveNotes.elementalResistanceFeature',
        'level', '=', 'Math.floor((source - 1) / 5) * 3'
      );
      ScribeCustomRules('saveNotes.fortBonusFeature',
        'level', '=', 'Math.floor((source + 3) / 5)'
      );

    } else if(path == 'Jack-Of-All-Trades') {

      /* TODO */

    } else if(path == 'Mountainborn') {

      features = [
        1, 'Mountaineer', 3, 'Ambush', 4, 'Rallying Cry', 5, 'Con Bonus'
      ];
      spellFeatures = [
        2, 'Endure Elements', 7, 'Pass Without Trace', 12, 'Meld Into Stone',
        17, 'Stone Tell'
      ];
      notes = [
        'combatNotes.rallyingCryFeature:' +
          'Allies not flat-footed/+4 vs. surprise %V/day',
        'skillNotes.ambushFeature:Use Hide to conceal allies for ambush',
        'skillNotes.mountaineerFeature:+%V Balance/Climb/Jump',
        'skillNotes.mountaineerFeature2:+%V Survival (mountains)'
      ];
      ScribeCustomRules('combatNotes.rallyingCryFeature',
        'level', '=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('skillNotes.mountaineerFeature',
        'level', 'Math.floor((source + 4) / 2) * 2'
      );
      ScribeCustomRules('skillNotes.mountaineerFeature2',
        'features.Mountaineer', '?', null,
        'level', 'Math.floor((source + 4) / 2) * 2'
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
        /* TODO Only if otherwise class skill */
        'skillNotes.animalFriendFeature:+2 Handle Animal',
        'skillNotes.elementalFriendFeature:+2 Diplomacy (elementals)',
        'skillNotes.naturalBondFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.plantFriendFeature:+2 Diplomacy (plants)'
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
        4, 'Howling Winds', 5, 'Con Bonus', 6, 'Aura Of Warmth',
        11, 'Improved Battle Cry', 13, 'Frost Weapon', 16, 'Cold Immunity',
        18, 'Greater Frost Weapon'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.battleCryFeature:' +
          '%V bonus hit points after cry/+1 attack/damage starting at level 11',
        'combatNotes.frostWeaponFeature:' +
          'Weapon gains frost quality %V rounds',
        'combatNotes.greaterFrostWeaponFeature:' +
          'Weapon gains icy burst quality %V rounds',
        'featureNotes.northbornFeature:Wild Empathy (cold)',
        'magicNotes.auraOfWarmthFeature:Allies +4 Fortitude vs cold',
        'magicNotes.howlingWindsFeature:' +
          '<i>Commune With Nature</i> (winds) %V/day',
        'saveNotes.coldResistanceFeature:%V',
        'saveNotes.northbornFeature:Immune to non-lethal cold/exposure',
        'skillNotes.northbornFeature:+2 Survival (cold)'
      ];
      ScribeCustomRules('combatNotes.battleCryFeature', 'level', '=', null);
      ScribeCustomRules('combatNotes.frostWeaponFeature', 'level', '=', null);
      ScribeCustomRules
        ('combatNotes.greaterFrostWeaponFeature', 'level', '=', null);
      ScribeCustomRules
        ('features.Wild Empathy', 'featureNotes.northbornFeature', '=', '1');
      ScribeCustomRules('magicNotes.howlingWindsFeature',
        'level', 'source >= 12 ? 3 : Math.floor(source / 4)'
      );
      ScribeCustomRules('saveNotes.coldResistanceFeature',
        'level', '=', 'source >= 9 ? 15 : 5'
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
          '+%V damage after suffering 2 * level damage',
        'combatNotes.increasedDamageThresholdFeature:' +
          'Continue fighting until -%V HP',
        'combatNotes.nonlethalDamageReductionFeature:%V',
        'combatNotes.painlessFeature:+%V HP',
        'combatNotes.retributiveRageFeature:' +
          '+%V attack after suffering 2 * level damage',
        'saveNotes.painlessFeature:+%V vs. pain effects',
        'saveNotes.uncaringMindFeature:+%V vs. enchantment'
      ];
      ScribeCustomRules('combatNotes.increasedDamageThresholdFeature',
        'level', '=', '15 + Math.floor((source - 10) / 5) * 5'
      );
      ScribeCustomRules
        ('combatNotes.nonlethalDamageReductionFeature', 'level', '=', null);
      ScribeCustomRules('combatNotes.painlessFeature', 'level', '=', null);
      ScribeCustomRules('hitPoints', 'combatNotes.painlessFeature', '+', null);
      ScribeCustomRules('saveNotes.uncaringMindFeature',
        'level', '=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules('saveNotes.painlessFeature', 'level', '=', null);

    } else if(path == 'Pureblood') {

      features = [
        1, 'Master Adventurer', 2, 'Blood Of Kings', 3, 'Bonus Feat',
        4, 'Skill Mastery', 5, 'Ability Bonus'
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
        'level', '=', 'Math.floor(source / 5)'
      );
      ScribeCustomRules('featCount',
        'featureNotes.skillMasteryFeature', '+', null
      );
      ScribeCustomRules('featureNotes.bonusFeatFeature',
        'level', '=', 'Math.floor((source + 2) / 5)'
      );
      ScribeCustomRules('featureNotes.skillMasteryFeature',
        'level', '=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('skillNotes.bloodOfKingsFeature',
        'level', '=', 'Math.floor((source + 3) / 5) * 2'
      );
      ScribeCustomRules('skillNotes.masterAdventurerFeature',
        'level', '=', 'Math.floor((source + 4) / 5) * 2'
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
      ScribeCustomRules
        ('armorClass', 'combatNotes.dodgeBonusFeature', '+', null);
      ScribeCustomRules
        ('initiative', 'combatNotes.initiativeBonusFeature', '+', null);
      ScribeCustomRules
        ('speed', 'abilityNotes.fastMovementFeature', '+', null);
      ScribeCustomRules('abilityNotes.fastMovementFeature',
        'level', '=', 'Math.floor((source + 3) / 5) * 5'
      );
      ScribeCustomRules('combatNotes.burstOfSpeedFeature',
        'level', '=', 'Math.floor((source + 1) / 5)'
      );
      ScribeCustomRules('combatNotes.initiativeBonusFeature',
        'level', '=', 'Math.floor((source + 4) / 5) * 2'
      );
      ScribeCustomRules('combatNotes.dodgeBonusFeature',
        'level', '=', 'Math.floor((source + 3) / 5) * 2'
      );

    } else if(path == 'Seaborn') {

      features = [
        1, 'Dolphin\'s Grace', 2, 'Deep Lungs', 3, 'Aquatic Blindsight',
        10, 'Aquatic Adaptation', 14, 'Cold Resistance',
        17, 'Aquatic Emissary', 18, 'Assist Allies'
      ];
      spellFeatures = [
        4, 'Aquatic Ally II', 5, 'Blur', 8, 'Aquatic Ally III', 9, 'Fog Cloud',
        12, 'Aquatic Ally IV', 13, 'Displacement', 16, 'Aquatic Ally V',
        20, 'Aquatic Ally VI'
      ];
      notes = [
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
      ScribeCustomRules('skillNotes.aquaticBlindsightFeature',
        'level', '=', 'Math.floor((source + 5) / 8) * 30'
      );
      ScribeCustomRules('skillNotes.deepLungsFeature',
        'level', '=', 'source >= 6 ? 3 : 2',
        'constitution', '*', null
      );
      ScribeCustomRules('skillNotes.dolphin\'sGraceFeature',
        'level', '=', '(source >= 15 ? 3 : source >= 7 ? 2 : 1) * 20'
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
        'level', '=', 'Math.floor((source + 6) / 6)'
      );

    } else if(path == 'Speaker') {

      features = [
        2, 'Persuasive Speaker', 3, 'Power Words', 5, 'Cha Bonus',
        14, 'Language Savant'
      ];
      spellFeatures = [
        1, 'Comprehend Languages', 4, 'Whispering Wind', 8, 'Tongues',
        12, 'Shout', 18, 'Greater Shout'
      ];
      notes = [
        'abilityNotes.chaBonusFeature:Add %V to charisma',
        'magicNotes.powerWordsFeature:%V 3+conMod/day',
        'skillNotes.languageSavantFeature:' +
          'Fluent in any language after listening for 10 minutes',
        'skillNotes.persuasiveSpeakerFeature:+%V on verbal charisma skills'
      ];
      ScribeCustomRules
        ('abilityNotes.chaBonusFeature', 'level', '=', 'Math.floor(source/5)');
      ScribeCustomFeatures('level', 'magicNotes.powerWordsFeature', [
        3, 'Opening', 6, 'Shattering', 9, 'Silence', 13, 'Slumber',
        16, 'Charming', 19, 'Holding'
      ]);
      ScribeCustomRules('skillNotes.persuasiveSpeakerFeature',
        'level', '=', 'source == 2 ? 2 : (Math.floor((source + 1) / 4) * 2)'
      );

    } else if(path == 'Spellsoul') {

      features = [
        1, 'Untapped Potential', 2, 'Metamagic Aura', 3, 'Resistance',
        4, 'Bonus Raw Energy'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.metamagicAuraFeature:Affect spells w/in 30 ft %V/day',
        'magicNotes.untappedPotentialFeature:' +
          'Contribute %V points to others\' spells w/in 30 ft',
        'saveNotes.resistanceFeature:+%V vs spells'
      ];
      ScribeCustomFeatures('level', 'magicNotes.metamagicAuraFeature', [
        2, 'Enlarge', 5, 'Extend', 8, 'Reduce', 11, 'Attract', 14, 'Empower',
        17, 'Maximize', 20, 'Redirect'
      ]);
      ScribeCustomRules('magicNotes.metamagicAuraFeature',
        'level', '=', 'source>=15?4:source>=10?3:source>=6?2:1'
      );
      ScribeCustomRules('magicNotes.untappedPotentialFeature',
        'level', '=', 'source>=18?8:source>=13?6:source>=9?4:source>=2?2:0',
        'charismaModifier', '^', 'source + 1',
        'intelligenceModifier', '^', 'source + 1',
        'wisdomModifier', '^', 'source + 1'
      );
      ScribeCustomRules('saveNotes.resistanceFeature',
        'level', 'source>=19?5:source>=16?4:source>=12?3:source>=7?2:1'
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
        'level', '=', 'Math.floor(source / 4) * 10'
      );
      ScribeCustomRules('skillNotes.shadowVeilFeature',
        'level', '=', 'Math.floor((source + 2) / 4) * 2'
      );

    } else if(path == 'Stellblooded') {

      features = [
        1, 'Bonus Feat', 2, 'Offensive Tactic', 3, 'Strategic Blow',
        4, 'Skilled Warrior', 14, 'Untouchable', 19, 'Improved Untouchable'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.improvedUntouchableFeature:' +
           'No foe AOO from move/standard/full-round actions',
        'combatNotes.offensiveTacticFeature:' +
          '+%V to first attack or all damage when using full attack action',
        'combatNotes.skilledWarriorFeature:' +
           'Half penalty from %V choices of Fighting Defensively/Grapple ' +
           'Attack/Non-proficient Weapon/Two-Weapon Fighting',
        'combatNotes.strategicBlowFeature:Ignore %V points of damage reduction',
        'combatNotes.untouchableFeature:No foe AOO from special attacks'
      ];
      ScribeCustomRules('combatNotes.offensiveTacticFeature',
        'level', '=', 'source>=17 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.skilledWariorFeature',
        'level', '=', 'source>=18 ? 4 : source>=13 ? 3 : source>=8 ? 2 : 1'
      );
      ScribeCustomRules('combatNotes.stategicBlowFeature',
        'level', '=', 'source>=16?15 : source==15?12 : (Math.floor(source/3)*3)'
      );
      ScribeCustomRules('featureNotes.bonusFeatFeature',
        'level', '=', '1 + Math.floor(source / 5)'
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
        'level', '=', 'Math.floor((source + 2) / 6)'
      );
      ScribeCustomRules('skillNotes.bloodOfThePlanesFeature',
        'level', '=', 'Math.floor((source + 1) / 3) * 2'
      );

    } else
      continue;

    var noteName = path.substring(0, 1).toLowerCase() + path.substring(1);
    noteName = noteName.replace(/ /g, '');
    if(features != null) {
      ScribeCustomFeatures
        ('level', 'featureNotes.' + noteName + 'Features', features);
      ScribeCustomRules('featureNotes.' + noteName + 'Features',
        'heroicPath', '?', 'source == "' + path + '"'
      );
    }
    if(spellFeatures != null) {
      for(var j = 1; j < spellFeatures.length; j += 2)
        spellFeatures[j] = '<i>' + spellFeatures[j] + '</i>';
      ScribeCustomFeatures
        ('level', 'magicNotes.' + noteName + 'Spells', spellFeatures);
      ScribeCustomRules('magicNotes.' + noteName + 'Spells',
        'heroicPath', '?', 'source == "' + path + '"'
      );
      ScribeCustomNotes('magicNotes.' + noteName + 'Spells:%V 1/day');
    }
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
    'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
    'featureNotes.boundToTheBeastFeature:Mounted Combat feat',
    'saveNotes.coldHardy:+5 cold/half damage',
    'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
    'magicNotes.naturalChannelerFeature:Innate Magic',
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
        'combatNotes.brotherhoodFeature:' +
          '+1 attack when fighting alongside 4+ Dorns',
        'combatNotes.strongFeature:+1 attack w/two-handed weapons'
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
        'combatNotes.toughFeature:+1 AC'
      ];
      ScribeCustomRules('armorClass', 'combatNotes.toughFeature', '+', '1');
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
        'combatNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'combatNotes.minorLightSensitivityFeature:DC 15 Fortitude save in sunlight to avoid -1 attack',
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
        'combatNotes.lightSensitivityFeature:+1 attack in daylight',
        'combatNotes.nightFighterFeature:+1 attack in darkness',
        'saveNotes.coldResistanceFeature:immune non-lethal/half lethal',
        'skillNotes.naturalPreditorFeature:+%V Indimidate'
      ];

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
