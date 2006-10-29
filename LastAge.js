/* $Id: LastAge.js,v 1.43 2006/10/29 13:31:19 Jim Exp $ */

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
  var rules = new ScribeRules('Midnight 2nd Edition');
  PH35.CLASSES = ['Barbarian', 'Fighter', 'Rogue'];
  PH35.DEITIES = ['Izrador (NE):Death/Destruction/Evil/Magic/War'];
  PH35.RACES = [];
  PH35.deitiesFavoredWeapons = {'Izrador (LE)': 'Longsword'};
  if(PH35.createViewer != null) {
    MN2E.viewer = new ObjectViewer();
    PH35.createViewer(MN2E.viewer);
    rules.defineViewer("Standard", MN2E.viewer);
  }
  if(PH35.abilityRules != null) PH35.abilityRules(rules);
  if(PH35.raceRules != null) PH35.raceRules(rules);
  if(PH35.classRules != null) PH35.classRules(rules);
  if(PH35.skillRules != null) PH35.skillRules(rules);
  if(PH35.featRules != null) PH35.featRules(rules);
  if(PH35.descriptionRules != null) PH35.descriptionRules(rules);
  if(PH35.equipmentRules != null) PH35.equipmentRules(rules);
  if(PH35.combatRules != null) PH35.combatRules(rules);
  if(PH35.adventuringRules != null) PH35.adventuringRules(rules);
  if(PH35.magicRules != null) PH35.magicRules(rules);
  if(PH35.randomize != null) {
    rules.defineRandomizer(PH35.randomize,
      'alignment', 'armor', 'charisma', 'constitution', 'deity', 'dexterity',
      'domains', 'feats', 'gender', 'hitPoints', 'intelligence', 'languages',
      'levels', 'name', 'race', 'selectableFeatures', 'shield', 'skills',
      'specialization', 'spells', 'strength', 'weapons', 'wisdom'
    );
  }
  // A rule for handling DM-only information
  rules.defineRule('dmNotes', 'dmonly', '?', null);
  if(MN2E.raceRules != null) MN2E.raceRules(rules);
  if(MN2E.heroicPathRules != null) MN2E.heroicPathRules(rules);
  if(MN2E.classRules != null) MN2E.classRules(rules);
  if(MN2E.skillRules != null) MN2E.skillRules(rules);
  if(MN2E.featRules != null) MN2E.featRules(rules);
  if(MN2E.equipmentRules != null) MN2E.equipmentRules(rules);
  if(MN2E.combatRules != null) MN2E.combatRules(rules);
  if(MN2E.magicRules != null) MN2E.magicRules(rules);
  if(MN2E.randomize != null)
    rules.defineRandomizer(MN2E.randomize, 'heroicPath');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'experience');
  // TODO Remove these null testing choices
  rules.defineChoice('heroicPaths', 'Null Path');
  rules.defineChoice('races', 'Null Race');
  Scribe.addRuleSet(rules);
  MN2E.rules = rules;
}

// Arrays of choices passed to Scribe.  Removing elements from these before
// calling the rules functions will limit the user's options and eliminate
// rules associated with the removed choices.
MN2E.CLASSES = [
  'Charismatic Channeler', 'Defender', 'Fighter', 'Hermetic Channeler', 
  'Legate', 'Rogue', 'Spiritual Channeler', 'Wildlander'
];
MN2E.FEATS = [
  'Craft Charm', 'Craft Greater Spell Talisman', 'Craft Spell Talisman',
  'Devastating Mounted Assault', 'Drive It Deep', 'Extra Gift',
  'Friendly Agent', 'Giant Fighter', 'Greater Spellcasting (Conjuration)',
  'Greater Spellcasting (Evocation)', 'Herbalist', 'Improvised Weapon',
  'Innate Magic', 'Inconspicuous', 'Knife Thrower', 'Lucky',
  'Magecraft (Charismatic)', 'Magecraft (Hermetic)', 'Magecraft (Spiritual)',
  'Magic Hardened', 'Natural Healer', 'Quickened Donning', 'Orc Slayer',
  'Ritual Magic', 'Sarcosan Pureblood', 'Sense Nexus',
  'Spellcasting (Abjuration)', 'Spellcasting (Conjuration)',
  'Spellcasting (Divination)', 'Spellcasting (Enchantment)',
  'Spellcasting (Evocation)', 'Spellcasting (Illusion)',
  'Spellcasting (Necromancy)', 'Spellcasting (Transmutation)',
  'Spell Knowledge', 'Thick Skull',
  'Warrior Of Shadow', 'Whispering Awareness'
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
  'Black Tongue', 'Colonial', 'Courtier', 'Danisil', 'Erenlander', 'Halfling',
  'High Elven', 'Norther', 'Old Dwarven', 'Orcish', 'Patrol Sign', 'Sylvan',
  'Trader\'s Tongue'
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
  'Knowledge (Old Gods):int/trained', 'Knowledge (Shadow):int/trained',
  'Knowledge (Spirits):int/trained'
];
MN2E.SPELLS = [
  'Charm Repair:W3', 'Detect Astirax:D1/W1', 'Disguise Ally:W2',
  'Disguise Weapon:W1', 'Far Whisper:D1/W1', 'Greenshield:D2/W2',
  'Halfling Burrow:D3/W3', 'Lifetrap:D2/W2', 'Nature\'s Revelation:D2/W2',
  'Nexus Fuel:C4/W5', 'Silver Blood:W2', 'Silver Storm:W4',
  'Silver Wand:W3', 'Stone Soup:D1/W1'
];
MN2E.WEAPONS = [
  'Atharak:d6', 'Cedeku:d6@19', 'Crafted Vardatch:d10@19',
  'Dornish Horse Spear:d10x3', 'Farmer\'s Rope:d2', 'Fighting Knife:d6@19x3',
  'Great Sling:d6r60', 'Greater Vardatch:2d8', 'Halfling Lance:d8x3',
  'Icewood Longbow:d8x3r120', 'Inutek:d3r20', 'Sarcosan Lance:d8x3',
  'Sepi:d6@18', 'Shard Arrow:d6@16x1', 'Staghorn:d6', 'Tack Whip:d4',
  'Urutuk Hatchet:d8x3r20', 'Vardatch:d12'
];

// Related information used internally by MN2E
MN2E.racesFavoredRegions = {
  'Agrarian Halfling':'Central Erenland',
  'Clan Dwarf':'Kaladrun Mountains/Subterranean',
  'Clan Raised Dwarrow':'Kaladrun Mountains',
  'Clan Raised Dworg':'Kaladrun Mountains',
  'Danisil Raised Elfling':'Aruun', 'Dorn':'Northlands',
  'Erenlander':'Erenland', 'Gnome':'Central Erenland',
  'Gnome Raised Dwarrow':'Central Erenland',
  'Halfling Raised Elfling':'Central Erenland', 'Jungle Elf':'Erethor/Aruun',
  'Kurgun Dwarf':'Kaladrun Mountains/Surface',
  'Kurgun Raised Dwarrow':'Kaladrun Mountains',
  'Kurgun Raised Dworg':'Kaladrun Mountains',
  'Nomadic Halfling':'Central Erenland', 'Orc':'Northern Reaches',
  'Plains Sarcosan':'Southern Erenland', 'Sea Elf':'Erethor/Miraleen',
  'Snow Elf':'Erethor/Veradeen', 'Urban Sarcosan':null,
  'Wood Elf':'Erethor/Caraheen'
};
MN2E.selectableFeatures = {
};

MN2E.classRules = function(rules) {

  for(var i = 0; i < MN2E.CLASSES.length; i++) {

    var baseAttack, features, hitDie, notes, prerequisites, profArmor,
        profShield, profWeapon, saveFortitude, saveReflex, saveWill,
        skillPoints, skills, spellsKnown, spellsPerDay, spellsPerDayAbility,
        tests;
    var klass = MN2E.CLASSES[i];

    if(klass.indexOf(' Channeler') >= 0) {

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
      rules.defineRule('featCount',
        'featureNotes.arcaneFeatBonusFeature', '+', null,
        'featureNotes.bonusSpellcastingFeature', '+', null
      );
      rules.defineRule('featureNotes.arcaneFeatBonusFeature',
        'channelerLevels', '+=', 'Math.floor((source - 1) / 3)'
      );
      rules.defineRule('featureNotes.bonusSpellcastingFeature',
        'channelerLevels', '+=', 'Math.floor((source + 1) / 3)'
      );
      rules.defineRule
        ('magicNotes.bonusSpellEnergyFeature', 'channelerLevels', '+=', null);
      rules.defineRule('magicNotes.bonusSpellsFeature',
        'channelerLevels', '+=', '(source - 1) * 2'
      );

      if(klass == 'Charismatic Channeler') {
        MN2E.selectableFeatures[klass] =
          'Greater Confidence/Greater Fury/Improved Confidence/Improved Fury/' +
          'Inspire Confidence/Inspire Fascination/Inspire Fury/' +
          'Mass Suggestion/Suggestion';
        features = features.concat(
          ['1:Magecraft (Charismatic)', '3:Force Of Personality']
        );
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
        skills = skills.concat([
          'Bluff', 'Diplomacy', 'Gather Information', 'Intimidate',
          'Sense Motive'
        ]);
        tests = [
          '{selectableFeatures.Improved Fury} == null || ' +
            '{selectableFeatures.Inspire Fury} != null',
          '{selectableFeatures.Improved Confidence} == null || ' +
            '{selectableFeatures.Inspire Confidence} != null',
          '{selectableFeatures.Suggestion} == null || ' +
            '{selectableFeatures.Inspire Fascination} != null',
          '{selectableFeatures.Greater Fury} == null || ' +
            '{selectableFeatures.Improved Fury} != null',
          '{selectableFeatures.Greater Confidence} == null || ' +
            '{selectableFeatures.Improved Confidence} != null',
          '{selectableFeatures.Mass Suggestion} == null || ' +
            '{selectableFeatures.Suggestion} != null'
        ];
        rules.defineRule
          ('channelerLevels', 'levels.Charismatic Channeler', '+=', null);
        rules.defineRule('magicNotes.forceOfPersonalityFeature',
          'charismaModifier', '=', '3 + source'
        );
        rules.defineRule('magicNotes.inspireConfidenceFeature',
          'levels.Charismatic Channeler', '=', null
        );
        rules.defineRule('magicNotes.inspireFascinationFeature',
          'levels.Charismatic Channeler', '=', '10 + Math.floor(source / 2)',
          'charismaModifier', '+', null
        );
        rules.defineRule('magicNotes.inspireFuryFeature',
          'levels.Charismatic Channeler', '=', 'source + 5'
        );
        rules.defineRule('magicNotes.massSuggestionFeature',
          'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
        );
        rules.defineRule('selectableFeatureCount.Charismatic Channeler',
          'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
        );
      } else if(klass == 'Hermetic Channeler') {
        MN2E.selectableFeatures[klass] =
          'Foe Specialty/Knowledge Specialty/Quick Reference/Spell Specialty';
        features = features.concat(['1:Magecraft (Hermetic)', '3:Lorebook']);
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
        skills = skills.concat([
          'Knowledge (Arcana)', 'Knowledge (Dungeoneering)',
          'Knowledge (Engineering)', 'Knowledge (Geography)',
          'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
          'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)'
        ]);
        tests = null;
        rules.defineRule('selectableFeatureCount.Hermetic Channeler',
          'levels.Hermetic Channeler', '=', 'Math.floor(source / 3)'
        );
        rules.defineRule
          ('channelerLevels', 'levels.Hermetic Channeler', '+=', null);
      } else if(klass == 'Spiritual Channeler') {
        MN2E.selectableFeatures[klass] =
          'Confident Effect/Heightened Effect/Mastery Of Nature/' +
          'Mastery Of Spirits/Mastery Of The Unnatural/Powerful Effect/' +
          'Precise Effect/Specific Effect/Universal Effect';
        features = features.concat(
          ['1:Magecraft (Spiritual)', '3:Master Of Two Worlds']
        );
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
        tests = [
          '{selectableFeatures.Confident Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null',
          '{selectableFeatures.Heightened Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null',
          '{selectableFeatures.Powerful Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null',
          '{selectableFeatures.Precise Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null',
          '{selectableFeatures.Specific Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null',
          '{selectableFeatures.Universal Effect} == null || ' +
            '{selectableFeatures.Mastery Of Nature} != null || ' +
            '{selectableFeatures.Mastery Of Spirits} != null || ' +
            '{selectableFeatures.Mastery Of The Unnatural} != null'
        ];
        rules.defineRule
          ('channelerLevels', 'levels.Spiritual Channeler', '+=', null);
        rules.defineRule('combatNotes.masterOfTwoWorldsFeature',
          'levels.Spiritual Channeler', '?', 'source >= 3',
          'wisdomModifier', '=', '3 + source'
        );
        rules.defineRule('selectableFeatureCount.Spiritual Channeler',
          'levels.Spiritual Channeler', '=', 'Math.floor(source / 3)'
        );
        rules.defineRule
          ('turningLevel', 'levels.Spiritual Channeler', '+=', null);
      }

    } else if(klass == 'Defender') {

      MN2E.selectableFeatures[klass] =
       'Defensive Mastery/Dodge Training/Flurry Attack/Grappling Training/' +
       'Offensive Training/Speed Training/Cover Ally/One With The Weapon/' +
       'Rapid Strike/Strike And Hold/Counterattack/Devastating Strike/' +
       'Furious Grapple/Retaliatory Strike/Weapon Trap';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Masterful Strike', '2:Defender Abilities',
        '2:Defender Stunning Fist', '3:Improved Grapple', '4:Precise Strike',
        '5:Incredible Resilience', '5:Incredible Speed', '6:Masterful Strike'
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
      prerequisites = null;
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
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      tests = [
        '{selectableFeatures.Cover Ally} == null || ' +
          '{selectableFeatures.Dodge Training} != null',
        '{selectableFeatures.One With The Weapon} == null || ' +
          '{selectableFeatures.Offensive Training} != null',
        '{selectableFeatures.Rapid Strike} == null || ' +
          '{selectableFeatures.Speed Training} != null',
        '{selectableFeatures.Strike And Hold} == null || ' +
          '{selectableFeatures.Grappling Training} != null',
        '{selectableFeatures.Counterattack} == null || ' +
          '({selectableFeatures.Dodge Training} != null && ' +
          '{selectableFeatures.Offensive Training} != null)',
        '{selectableFeatures.Devastating Strike} == null || ' +
          '({selectableFeatures.Grappling Training} != null && ' +
          '{selectableFeatures.Offensive Training} != null)',
        '{selectableFeatures.Furious Grapple} == null || ' +
          '({selectableFeatures.Grappling Training} != null && ' +
          '{selectableFeatures.Speed Training} != null)',
        '{selectableFeatures.Retaliatory Strike} == null || ' +
          '({selectableFeatures.Dodge Training} != null && ' +
          '{selectableFeatures.Speed Training} != null)',
        '{selectableFeatures.Weapon Trap} == null || ' +
          '({selectableFeatures.Dodge Training} != null && ' +
          '{selectableFeatures.Grappling Training} != null)'
      ];
      rules.defineRule('abilityNotes.incredibleSpeedFeature',
        'levels.Defender', '=', '10 * Math.floor((source - 4) / 3)'
      );
      rules.defineRule('combatNotes.defenderAbilitiesFeature',
        'levels.Defender', '=', 'source * 3 / 4',
        'level', '+', 'source / 4'
      );
      rules.defineRule('combatNotes.defenderStunningFistFeature',
        'levels.Defender', '=', '10 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      rules.defineRule
        ('armorClass', 'combatNotes.dodgeTrainingFeature', '+', null);
      rules.defineRule('combatNotes.incredibleResilienceFeature',
        'levels.Defender', '=', '3 * Math.floor((source - 4) / 3)'
      );
      rules.defineRule('combatNotes.offensiveTrainingFeature',
        'levels.Defender', '=', '14 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      rules.defineRule('combatNotes.preciseStrikeFeature',
        'levels.Defender', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('features.Improved Unarmed Strike',
        'features.Masterful Strike', '=', '1'
      );
      rules.defineRule('selectableFeatureCount.Defender',
        'levels.Defender', '=', 'Math.floor((source + 1) / 3)'
      );
      rules.defineRule('weaponDamage.Unarmed',
        'levels.Defender', '=', '(1 + Math.floor(source / 6)) + "d6"'
      );
      rules.defineRule
        ('save.Fortitude', 'saveNotes.defensiveMasteryFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.defensiveMasteryFeature', '+', null);
      rules.defineRule
        ('save.Will', 'saveNotes.defensiveMasteryFeature', '+', null);

    } else if(klass == 'Fighter') {

      MN2E.selectableFeatures[klass] =
        'Adapter/Improviser/Leader Of Men/Survivor';
      baseAttack = null;
      features = [];
      hitDie = null;
      notes = [
        'featureNotes.improviserFeature:%V bonus improvisation feats',
        'featureNotes.leaderOfMenFeature:%V bonus leadership feats',
        'featureNotes.survivorFeature:%V bonus survivor feats',
        'skillNotes.adapterFeature:+%V skill points'
      ];
      prerequisites = null;
      profArmor = profShield = profWeapon = null;
      saveFortitude = saveReflex = saveWill = null;
      skillPoints = null;
      skills = null;
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      tests = null;
      rules.defineRule('selectableFeatureCount.Fighter',
       'levels.Fighter', '=', 'source >= 4 ? 1 : null'
      );
      rules.defineRule('featCount',
        'featureNotes.improviserFeature', '+', null,
        'featureNotes.leaderOfMenFeature', '+', null,
        'featureNotes.survivorFeature', '+', null
      );
      rules.defineRule('featureNotes.improviserFeature',
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('featureNotes.leaderOfMenFeature',
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('featureNotes.survivorFeature',
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('skillNotes.adapterFeature',
        'levels.Fighter', '=', 'source - 3 + ' +
                               '(source >= 10 ? source - 9 : 0) + ' +
                               '(source >= 16 ? source - 15 : 0)'
      );
      // TODO adapter may alternately make a cross-class skill a class one
      rules.defineRule('skillPoints', 'skillNotes.adapterFeature', '+', null);

    } else if(klass == 'Legate') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Spontaneous Legate Spell', '1:Temple Dependency', '1:Turn Undead',
        '3:Astirax Companion'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures',
        'featureNotes.astiraxCompanion:Special bond/abilities',
        'magicNotes.spontaneousLegateSpellFeature:Inflict',
        'magicNotes.templeDependencyFeature:' +
          'Must participate at temple to receive spells'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Diplomacy', 'Handle Animal', 'Heal', 'Intimidate',
        'Knowledge (Arcana)', 'Knowledge (Shadow)', 'Knowledge (Spirits)',
        'Speak Language', 'Spellcraft'
      ];
      spellsKnown = [
        'C0:1:"all"', 'C1:1:"all"', 'C2:3:"all"', 'C3:5:"all"',
        'C4:7:"all"', 'C5:9:"all"', 'C6:11:"all"', 'C7:13:"all"',
        'C8:15:"all"', 'C9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
      spellsPerDay = [
        'C0:1:3/2:4/4:5/7:6',
        'C1:1:1/2:2/4:3/7:4/11:5',
        'C2:3:1/4:2/6:3/9:4/13:5',
        'C3:5:1/6:2/8:3/11:4/15:5',
        'C4:7:1/8:2/10:3/13:4/17:5',
        'C5:9:1/10:2/12:3/15:4/19:5',
        'C6:11:1/12:2/14:3/17:4',
        'C7:13:1/14:2/16:3/19:4',
        'C8:15:1/16:2/18:3/20:4',
        'C9:17:1/18:2/19:3/20:4'
      ];
      spellsPerDayAbility = 'wisdom';
      tests = null;
      rules.defineRule
        ('casterLevelDivine', 'spellsPerDayLevels.Legate', '^=', null);
      rules.defineRule('domainCount', 'levels.Legate', '+=', '2');
      rules.defineRule
        ('spellsPerDayLevels.Legate', 'levels.Legate', '=', null);
      for(var j = 1; j < 10; j++) {
        rules.defineRule('spellsPerDay.Dom' + j,
          'spellsPerDayLevels.Legate', '=',
          'source >= ' + (j * 2 - 1) + ' ? 1 : null');
      }
      rules.defineRule('turningLevel', 'levels.Legate', '+=', null);

    } else if(klass == 'Rogue') {

      rules.defineRule
        ('classSkills.Knowledge (Shadow)', 'levels.Rogue', '=', '1');
      rules.defineRule
        ('classSkills.Speak Language', 'levels.Rogue', '=', '1');
      continue; // Not defining a new class

    } else if(klass == 'Wildlander') {

      MN2E.selectableFeatures[klass] =
        'Animal Companion/Camouflage/Evasion/Hated Foe/Hide In Plain Sight/' +
        'Hunted By The Shadow/Improved Evasion/Improved Woodland Stride/' +
        'Instinctive Response/Master Hunter/Overland Stride/Quick Stride/' +
        'Rapid Response/Sense Dark Magic/Skill Mastery/Slippery Mind/' +
        'Trackless Step/True Aim/Wild Empathy/Wilderness Trapfinding/' +
        'Woodland Stride';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Track', '3:Danger Sense', '4:Hunter\'s Strike'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.quickStrideFeature:+%V * 10 speed',
        'combatNotes.dangerSenseFeature:Up to %V initiative bonus',
        'combatNotes.huntedByTheShadowFeature:No surprise by servant of shadow',
        'combatNotes.hunter\'sStrikeFeature:x2 damage %V/day',
        'combatNotes.hatedFoeFeature:' +
          'Additional Hunter\'s Strike vs. Master Hunter creature',
        'combatNotes.instinctiveResponseFeature:Re-roll initiative check',
        'combatNotes.masterHunterFeature:' +
          '+2 or more damage vs. selected creature types',
        'combatNotes.trueAimFeature:x3 damage on Hunter\'s Strike',
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.improvedWoodlandStrideFeature:' +
          'Normal movement through enchanted terrain',
        'featureNotes.overlandStrideFeature:' +
          'Normal movement while using Survival',
        'featureNotes.rapidResponseFeature:' +
          'Alertness or Improved Initiative feat',
        'featureNotes.senseDarkMagicFeature:Scent vs. legate/outsider',
        'featureNotes.skillMasteryFeature:Skill Mastery with %V chosen skills',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'featureNotes.woodsloreFeature:' +
          'Automatic Search vs. trap/concealed door w/in 5 ft',
        'magicNotes.senseDarkMagicFeature:' +
          '<i>Detect Magic</i> vs. legate/outsider',
        'saveNotes.evasionFeature:Save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.dangerSenseFeature:Up to %V Listen/Spot bonus',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.masterHunterFeature:' +
          '+2 or more Bluff/Listen/Sense Motive/Spot/Survival vs. selected creature types',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'skillNotes.wildernessTrapfindingFeature:' +
          'Search to find/Survival to remove DC 20+ traps'
      ];
      prerequisites = null;
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
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      tests = [
        '{selectableFeatures.Animal Companion} == null || ' +
          '{selectableFeatures.Wild Empathy} != null',
        '{selectableFeatures.Hated Foe} == null || ' +
          '{selectableFeatures.Master Hunter} != null',
        '{selectableFeatures.Instinctive Response} == null || ' +
          '{selectableFeatures.Rapid Response} != null',
        '{selectableFeatures.Overland Stride} == null || ' +
          '{selectableFeatures.Quick Stride} != null',
        '{selectableFeatures.Sense Dark Magic} == null || ' +
          '{selectableFeatures.Master Hunter} != null',
        '{selectableFeatures.Trackless Step} == null || ' +
          '{selectableFeatures.Woodland Stride} != null',
        '{selectableFeatures.Woodslore} == null || ' +
          '{selectableFeatures.Wilderness Trapfinding} != null',
        '{selectableFeatures.Camouflage} == null || ' +
          '({selectableFeatures.Skill Mastery} != null && ' +
          '{selectableFeatures.Trackless Step} != null)',
        '{selectableFeatures.Evasion} == null || ' +
          '({selectableFeatures.Quick Stride} != null && ' +
          '{selectableFeatures.Instinctive Response} != null)',
        '{selectableFeatures.Hunted By The Shadow} == null || ' +
          '({selectableFeatures.Rapid Response} != null && ' +
          '{selectableFeatures.Sense Dark Magic} != null)',
        '{selectableFeatures.Improved Woodland Stride} == null || ' +
          '({selectableFeatures.Woodland Stride} != null && ' +
          '{selectableFeatures.Overland Stride} != null)',
        '{selectableFeatures.True Aim} == null || ' +
          '({selectableFeatures.Skill Mastery} != null && ' +
          '{selectableFeatures.Hated Foe} != null)',
        '{selectableFeatures.Hide In Plain Sight} == null || ' +
          '{selectableFeatures.Camouflage} != null',
        '{selectableFeatures.Improved Evasion} == null || ' +
          '{selectableFeatures.Evasion} != null',
        '{selectableFeatures.Slippery Mind} == null || ' +
          '{selectableFeatures.Hunted By The Shadow} != null'
      ];
      rules.defineRule('combatNotes.dangerSenseFeature',
        'levels.Wildlander', '=', 'Math.floor(source / 3)'
      );
      rules.defineRule('combatNotes.hunter\'sStrikeFeature',
        'levels.Wildlander', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('featCount',
        'featureNotes.rapidResponseFeature', '+', null,
        'featureNotes.skillMasteryFeature', '+', null
      );
      rules.defineRule('selectableFeatureCount.Wildlander',
        'levels.Wildlander', '=', '1 + Math.floor((source + 1) / 3)'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Wildlander', '+=', 'source',
        'charismaModifier', '+', null
      );
      rules.defineRule
        ('speed', 'abilityNotes.quickStrideFeature', '+', '10 * source');

    } else
      continue;

    rules.defineClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites, spellsKnown, spellsPerDay, spellsPerDayAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(tests != null)
      rules.defineTest(tests);

  }

};

MN2E.combatRules = function(rules) {
  // empty
};

MN2E.equipmentRules = function(rules) {
  rules.defineChoice('weapons', MN2E.WEAPONS);
};

MN2E.featRules = function(rules) {

  var notes = [
    'combatNotes.devastatingMountedAssaultFeature:' +
      'Full attack after mount moves',
    'combatNotes.driveItDeepFeature:Attack base -attack/+damage',
    'combatNotes.giantFighterFeature:' +
      '+4 AC/double critical range w/in 30 ft vs. giants',
    'combatNotes.improvisedWeaponFeature:' +
      'No penalty for improvised weapon/-2 for non-proficient weapon',
    'combatNotes.knifeThrowerFeature:+1 ranged attack/Quickdraw w/racial knife',
    'combatNotes.orcSlayerFeature:+1 AC/damage vs. orcs/dworgs',
    'skillNotes.sarcosanPurebloodFeature:+2 AC (horsed)',
    'combatNotes.warriorOfShadowFeature:' +
      'Substitute chaMod rounds of +%V damage for Turn Undead use',
    'featureNotes.extraGiftFeature:' +
      'Use Master Of Two Worlds/Force Of Personality +4 times/day',
    'featureNotes.quickenedDonningFeature:No penalty for hastened donning',
    'featureNotes.whisperingAwarenessFeature:' +
      'DC 12 wisdom check to hear Whispering Wood',
    'magicNotes.craftCharmFeature:Use Craft to create single-use magic item',
    'magicNotes.craftGreaterSpellTalismanFeature:' +
      'Talisman reduces spell energy cost of selected school\'s spells by 1',
    'magicNotes.craftSpellTalismanFeature:' +
      'Talisman reduces spell energy cost of selected spell by 1',
    'magicNotes.greaterSpellcasting(Conjuration)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.greaterSpellcasting(Evocation)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.herbalistFeature:Create herbal concoctions',
    'magicNotes.innateMagicFeature:%V level 0 spells as at-will innate ability',
    'magicNotes.magecraft(Charismatic)Feature:%V spell energy points',
    'magicNotes.magecraft(Hermetic)Feature:%V spell energy points',
    'magicNotes.magecraft(Spiritual)Feature:%V spell energy points',
    'magicNotes.ritualMagicFeature:Learn and lead magic rituals',
    'magicNotes.senseNexusFeature:DC wisdom check to sense nexus w/in 5 miles',
    'magicNotes.spellKnowledgeFeature:2 bonus spells',
    'magicNotes.spellcasting(Abjuration)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Conjuration)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Divination)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Enchantment)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Evocation)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Illusion)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Necromancy)Feature:' +
      'May learn school spells/bonus school spell',
    'magicNotes.spellcasting(Transmutation)Feature:' +
      'May learn school spells/bonus school spell',
    'saveNotes.luckyFeature:+1 bonus from luck charms/spells',
    'saveNotes.magicHardenedFeature:+2 spell resistance',
    'saveNotes.thickSkullFeature:DC 10 + damage save to stay at 1 hit point',
    'skillNotes.friendlyAgentFeature:' +
      '+4 Diplomacy (convince allegiance)/Sense Motive (determine allegiance)',
    'skillNotes.inconspicuousFeature:' +
      '+2 Bluff/Diplomacy/Hide/Sense Motive (shadow)',
    'skillNotes.naturalHealerFeature:' +
      'Successful Heal raises patient to 1 HP/triple normal healing rate',
    'skillNotes.orcSlayerFeature:-4 charisma skills vs. orcs/dworgs',
    'skillNotes.sarcosanPurebloodFeature:' +
      'Diplomacy w/horses/+2 charisma skills (horses/Sarcosans)'
  ];
  rules.defineNote(notes);
  rules.defineRule
    ('combatNotes.warriorOfShadowFeature', 'charismaModifier', '=', null);
  rules.defineRule('combatNotes.masterOfTwoWorldsFeature',
    'featureNotes.extraGiftFeature', '+', '4'
  );
  rules.defineRule('highestMagicModifier',
    'charismaModifier', '^=', null,
    'intelligenceModifier', '^=', null,
    'wisdomModifier', '^=', null
  );
  rules.defineRule('magicNotes.forceOfPersonalityFeature',
    'featureNotes.extraGiftFeature', '+', '4'
  );
  rules.defineRule
    ('magicNotes.innateMagicFeature', 'highestMagicModifier', '=', null);
  rules.defineRule
    ('magicNotes.magecraft(Charismatic)Feature', 'charismaModifier', '=', null);
  rules.defineRule
    ('magicNotes.magecraft(Hermetic)Feature', 'intelligenceModifier', '=',null);
  rules.defineRule
    ('magicNotes.magecraft(Spiritual)Feature', 'wisdomModifier', '=', null);
  rules.defineRule('spellEnergy',
    'magicNotes.magecraft(Charismatic)Feature', '+=', null
  );
  rules.defineRule('spellEnergy',
    'magicNotes.magecraft(Hermetic)Feature', '+=', null
  );
  rules.defineRule('spellEnergy',
    'magicNotes.magecraft(Spiritual)Feature', '+=', null
  );
  rules.defineRule
    ('resistance.Spells', 'saveNotes.magicHardenedFeature', '+=', '2');
  rules.defineRule('spellsKnown.W0', 'features.Magecraft', '=', '3');
  rules.defineRule('spellsKnown.W1', 'features.Magecraft', '=', '1');
  var tests = [
    '{feats.Craft Charm} == null || +/{^skills.Craft} >= 4',
    '{feats.Craft Greater Spell Talisman} == null || +/{feats.Magecraft} > 0',
    // TODO Craft Greater Spell Talisman requires 3 Channeling feats
    '{feats.Craft Greater Spell Talisman} == null || {level} >= 12',
    '{feats.Craft Spell Talisman} == null || +/{feats.Magecraft} > 0',
    '{feats.Craft Spell Talisman} == null || +/{^feats.Spellcasting} > 0',
    '{feats.Craft Spell Talisman} == null || {level} >= 3',
    '{feats.Devastating Mounted Assault} == null || ' +
      '{feats.Mounted Combat} != null',
    '{feats.Devastating Mounted Assault} == null || {skills.Ride} >= 10',
    '{feats.Drive It Deep} == null || {baseAttack} >= 1',
    '{feats.Extra Gift} == null || ' +
       '{levels.Charismatic Channeler}>=4 || {levels.Spiritual Channeler}>=4',
    '{feats.Friendly Agent} == null || ' +
       '{race}.indexOf(" Gnome") >= 0 || {race}.indexOf("Human") >= 0',
    '{feats.Friendly Agent} == null || {alignment}.indexOf("Good") >= 0',
    '{feats.Giant Fighter} == null || {feats.Dodge} != null',
    '{feats.Giant Fighter} == null || +/{^feats.Weapon Focus} > 0',
    '{feats.Greater Spellcasting (Conjuration)} == null || ' +
      '{feats.Spellcasting (Conjuration)} != null',
    '{feats.Greater Spellcasting (Evocation)} == null || ' +
      '{feats.Spellcasting (Evocation)} != null',
    '{feats.Herbalist} == null || {skills.Profession (Herbalist)} >= 4',
    '{feats.Innate Magic} == null || ' +
      '{race}.indexOf("Elf") >= 0 || {race}.indexOf("Halfling") >= 0',
    '{feats.Knife Thrower} == null || ' +
      '{race} == "Jungle Elf" || {race} == "Snow Elf"',
    '{feats.Magic Hardened} == null || ' +
      '{race}.indexOf("Dwarf") >= 0 || {race}.indexOf("Dworg") >= 0 || ' +
      '{race} == "Orc"',
    '{feats.Ritual Magic} == null || +/{feats.Magecraft} > 0',
    '{feats.Ritual Magic} == null || +/{^feats.Spellcasting} > 0',
    '{feats.Spell Knowledge} == null || +/{^feats.Spellcasting} > 0',
    '{feats.Warrior Of Shadow} == null || {levels.Legate} >= 5',
    '{feats.Warrior Of Shadow} == null || {charisma} >= 12',
    '{feats.Whispering Awareness} == null || ' +
      '{race}.indexOf("Elfling") >= 0 || {race}.indexOf("Elf") < 0',
    '{feats.Whispering Awareness} == null || {wisdom} >= 15'
  ];
  rules.defineTest(tests);
  rules.defineChoice('feats', MN2E.FEATS);
  for(var i = 0; i < MN2E.FEATS.length; i++) {
    rules.defineRule
      ('features.' + MN2E.FEATS[i], 'feats.' + MN2E.FEATS[i], '=', null);
  }
  var allSelectable = {};
  for(var a in MN2E.selectableFeatures) {
    PH35.selectableFeatures[a] = MN2E.selectableFeatures[a]; // for randomize
    var prefix = a.substring(0, 1).toLowerCase() +
                 a.substring(1).replace(/ /g, '');
    var features = MN2E.selectableFeatures[a].split('/');
    for(var i = 0; i < features.length; i++) {
      selectable = features[i];
      rules.defineRule('features.' + selectable,
        'selectableFeatures.' + selectable, '+=', null
      );
      allSelectable[selectable] = '';
    }
  }
  rules.defineChoice
    ('selectableFeatures', ScribeUtils.getKeys(allSelectable));

};

MN2E.heroicPathRules = function(rules) {

  rules.defineChoice('heroicPaths', MN2E.HEROIC_PATHS);
  rules.defineRule
    ('abilityNotes.charismaBonusFeature', 'features.Charisma Bonus', '=', null);
  rules.defineRule('abilityNotes.constitutionBonusFeature',
    'features.Constitution Bonus', '=', null
  );
  rules.defineRule('abilityNotes.dexterityBonusFeature',
    'features.Dexterity Bonus', '=', null
  );
  rules.defineRule('abilityNotes.intelligenceBonusFeature',
    'features.Intelligence Bonus', '=', null
  );
  rules.defineRule
    ('abilityNotes.strengthBonusFeature', 'features.Strength Bonus', '=', null);
  rules.defineRule
    ('abilityNotes.wisdomBonusFeature', 'features.Wisdom Bonus', '=', null);
  rules.defineRule
    ('armorClass', 'combatNotes.armorClassBonusFeature', '+', null);
  rules.defineRule
    ('charisma', 'abilityNotes.charismaBonusFeature', '+', null);
  rules.defineRule('combatNotes.armorClassBonusFeature',
    'features.Armor Class Bonus', '=', null
  );
  rules.defineRule
    ('constitution', 'abilityNotes.constitutionBonusFeature', '+', null);
  rules.defineRule
    ('dexterity', 'abilityNotes.dexterityBonusFeature', '+', null);
  rules.defineRule('featCount', 'features.Feat Bonus', '+', null);
  rules.defineRule
    ('intelligence', 'abilityNotes.intelligenceBonusFeature', '+', null);
  rules.defineRule
    ('spellEnergy', 'magicNotes.bonusSpellEnergyFeature', '+', null);
  rules.defineRule
    ('save.Fortitude', 'saveNotes.fortitudeBonusFeature', '+', null);
  rules.defineRule
    ('save.Reflex', 'saveNotes.reflexBonusFeature', '+', null);
  rules.defineRule('save.Will', 'saveNotes.willBonusFeature', '+', null);
  rules.defineRule
    ('saveNotes.fortitudeBonusFeature', 'features.Fortitude Bonus', '=', null);
  rules.defineRule
    ('saveNotes.reflexBonusFeature', 'features.Reflex Bonus', '=', null);
  rules.defineRule
    ('saveNotes.willBonusFeature', 'features.Will Bonus', '=', null);
  rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
  rules.defineRule('strength', 'abilityNotes.strengthBonusFeature', '+', null);
  rules.defineRule('wisdom', 'abilityNotes.wisdomBonusFeature', '+', null);

  for(var i = 0; i < MN2E.HEROIC_PATHS.length; i++) {

    var features = null;
    var notes = null;
    var path = MN2E.HEROIC_PATHS[i];
    var spellFeatures = null;

    if(path == 'Beast') {

      MN2E.selectableFeatures[path] =
        'Low Light Vision/Scent/Strength Bonus/Constitution Bonus/' +
        'Dexterity Bonus/Wisdom Bonus';
      features = [
        '1:Vicious Assault', '2:Beastial Aura', '7:Rage', '12:Repel Animals'
      ];
      spellFeatures = [
        '3:Magic Fang', '4:Bear\'s Endurance', '8:Greater Magic Fang',
        '9:Cat\'s Grace', '13:Magic Fang', '14:Bull\'s Strength',
        '17:Greater Magic Fang', '19:Freedom Of Movement'
      ];
      notes = [
        'combatNotes.beastialAuraFeature:Turn animals as cleric %V/day',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'combatNotes.viciousAssaultFeature:Two claw attacks at %V each',
        'featureNotes.repelAnimalsFeature:' +
          'Animals w/in 15 ft act negatively/cannot ride',
        'featureNotes.scentFeature:' +
          'Detect creatures\' presence w/in 30 ft/track by smell',
        'skillNotes.beastialAuraFeature:-10 Handle Animal/no Wild Empathy'
      ];
      rules.defineRule('combatNotes.beastialAuraFeature',
        'pathLevels.Beast', '+=', 'source >= 12 ? 6 : 3'
      );
      rules.defineRule('combatNotes.rageFeature',
        'pathLevels.Beast', '+=', 'source >= 17 ? 2 : 1'
      );
      rules.defineRule('combatNotes.viciousAssaultFeature',
        'mediumViciousAssault', '=', null,
        'smallViciousAssault', '=', null
      );
      rules.defineRule('mediumViciousAssault',
        'pathLevels.Beast', '=', 'source>=11 ? "d8" : source>=6 ? "d6" : "d4"'
      );
      rules.defineRule('selectableFeatureCount.Beast',
        'pathLevels.Beast', '=',
        'Math.floor(source / 5) + ((source >= 16) ? 2 : 1)'
      );
      rules.defineRule('smallViciousAssault',
        'features.Small', '?', null,
        'mediumViciousAssault', '=', 'Scribe.smallDamage[source]'
      );
      rules.defineRule
        ('turningLevel', 'pathLevels.Beast', '+=', 'source>=2 ? source : null');

    } else if(path == 'Chanceborn') {

      features = [
        '1:Luck Of Heroes', '3:Unfettered', '4:Miss Chance', '6:Persistence',
        '9:Take Ten', '19:Take Twenty'
      ];
      spellFeatures = ['2:Resistance', '7:True Strike', '12:Aid', '17:Prayer'];
      notes = [
        'combatNotes.missChanceFeature:%V% chance of foe miss',
        'featureNotes.luckOfHeroesFeature:Add %V to any d20 roll 1/day',
        'featureNotes.persistenceFeature:' +
          'Defensive Roll/Evasion/Slippery Mind/Uncanny Dodge %V/day',
        'featureNotes.takeTenFeature:Take 10 on any d20 roll 1/day',
        'featureNotes.takeTwentyFeature:Take 20 on any d20 roll 1/day',
        'magicNotes.unfetteredFeature:<i>Freedom Of Movement</i> %V rounds/day'
      ];
      rules.defineRule('combatNotes.missChanceFeature',
        'pathLevels.Chanceborn', '+=', 'source >= 14 ? 10 : 5'
      );
      rules.defineRule('featureNotes.luckOfHeroesFeature',
        'pathLevels.Chanceborn', '=',
        '"d4" + (source >= 5 ? "/d6" : "") + (source >= 10 ? "/d8" : "") + ' +
        '(source >= 15 ? "/d10" : "") + (source >= 20 ? "/d12" : "")'
      );
      rules.defineRule('featureNotes.persistenceFeature',
        'pathLevels.Chanceborn', '+=', 'Math.floor((source - 1) / 5)'
      );
      rules.defineRule
        ('features.Defensive Roll', 'features.Survivor', '=', '1');
      rules.defineRule('features.Evasion', 'features.Survivor', '=', '1');
      rules.defineRule
        ('features.Slippery Mind', 'features.Survivor', '=', '1');
      rules.defineRule
        ('features.Uncanny Dodge', 'features.Survivor', '=', '1');
      rules.defineRule('magicNotes.unfetteredFeature',
        'pathLevels.Chanceborn', '+=', 'Math.floor((source + 2) / 5)'
      );

    } else if(path == 'Charismatic') {

      features = [
        '4:Inspiring Oration', '5:Charisma Bonus', '6:Leadership',
        '12:Natural Leader'
      ];
      spellFeatures = [
        '1:Charm Person', '2:Remove Fear', '3:Hypnotism', '7:Aid',
        '8:Daze Monster', '11:Heroism', '13:Charm Monster', '16:Suggestion',
        '17:Greater Heroism'
      ];
      notes = [
        'featureNotes.naturalLeaderFeature: +%V Leadership score',
        'magicNotes.inspiringOrationFeature:' +
          'Give speech to apply spell-like ability to allies w/in 60 ft %V/day'
      ];
      rules.defineRule('charismaticFeatures.Charisma Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );
      rules.defineRule('featureNotes.naturalLeaderFeature',
        'pathLevels.Charismatic', '=', 'source >= 18 ? 2 : 1'
      );
      rules.defineRule('magicNotes.inspiringOrationFeature',
        'pathLevels.Charismatic', '+=', 'Math.floor((source + 1) / 5)'
      );

    } else if(path == 'Dragonblooded') {

      features = [
        '1:Bolster Spell', '2:Bonus Spells', '3:Bonus Spell Energy',
        '4:Quickened Counterspelling', '6:Improved Spellcasting',
        '9:Spell Penetration', '19:Frightful Presence'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.bolsterSpellFeature:Add 1 to DC of %V chosen spells',
        'magicNotes.bonusSpellsFeature:%V extra spells',
        'magicNotes.frightfulPresenceFeature:' +
          'Casting panics/shakes foes of lesser level 4d6 rounds failing DC %V Will save',
        'magicNotes.improvedSpellcastingFeature:' +
          'Reduce energy cost of spells from %V chosen schools by 1',
        'magicNotes.quickenedCounterspellingFeature:' +
          'Counterspell as move action 1/round',
        'magicNotes.spellPenetrationFeature:Add %V to spell penetration checks'
      ];
      rules.defineRule('magicNotes.bolsterSpellFeature',
        'pathLevels.Dragonblooded', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('magicNotes.bonusSpellEnergyFeature',
        'pathLevels.Dragonblooded', '+=',
        '2 * (source>=16 ? 4 : source>=15 ? 3 : Math.floor((source + 1) / 4))'
      );
      rules.defineRule('magicNotes.bonusSpellsFeature',
        'pathLevels.Dragonblooded', '+=', 'source>=14 ? 3 : source>=8 ? 2 : 1'
      );
      rules.defineRule('magicNotes.frightfulPresenceFeature',
        'pathLevels.Dragonblooded', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('magicNotes.improvedSpellcastingFeature',
        'pathLevels.Dragonblooded', '+=', 'Math.floor(source / 6)'
      );
      rules.defineRule('magicNotes.spellPenetrationFeature',
        'pathLevels.Dragonblooded', '+=', 'Math.floor((source - 5) / 4)'
      );

    } else if(path == 'Earthbonded') {

      features = [
        '1:Darkvision', '3:Armor Class Bonus', '4:Stonecunning',
        '8:Improved Stonecunning', '12:Tremorsense', '16:Blindsense',
        '20:Blindsight'
      ];
      spellFeatures = [
        '2:Hold Portal', '5:Soften Earth And Stone', '6:Make Whole',
        '7:Spike Stones', '9:Stone Shape', '11:Meld Into Stone',
        '13:Transmute Rock To Mud', '14:Stoneskin', '15:Move Earth',
        '17:Stone Tell', '19:Earthquake'
      ];
      notes = [
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.blindsightFeature:' +
          'Other senses compensate for loss of vision w/in 30 ft',
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door',
        'featureNotes.tremorsenseFeature:' +
          'Detect creatures in contact w/ground w/in 30 ft'
      ];
      rules.defineRule('earthbondedFeatures.Armor Class Bonus',
        'level', '+', 'source >= 18 ? 2 : source >= 10 ? 1 : null'
      );

    } else if(path == 'Faithful') {

      features = ['4:Turn Undead'];
      spellFeatures = [
        '1:Bless', '2:Protection From Evil', '3:Divine Favor', '6:Aid',
        '7:Bless Weapon', '8:Consecrate', '11:Daylight',
        '12:Magic Circle Against Evil', '13:Prayer', '16:Holy Smite',
        '17:Dispel Evil', '18:Holy Aura'
      ];
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures'
      ];
      rules.defineRule('faithfulFeatures.Wisdom Bonus',
        'pathLevels.Faithful', '=', 'source<5 ? null : Math.floor(source/5)'
      );
      rules.defineRule('features.Wisdom Bonus',
       'faithfulFeatures.Wisdom Bonus', '+=', null
      );
      rules.defineRule('turningLevel',
        'pathLevels.Faithful', '+=', 'source >= 4 ? source : null'
      );
      // TODO turningLevel-based computation overrides this
      rules.defineRule('turningFrequency',
        'pathLevels.Faithful', '+=', 'Math.floor((source + 1) / 5)'
      );

    } else if(path == 'Fellhunter') {

      features = [
        '1:Sense The Dead', '2:Touch Of The Living', '3:Ward Of Life',
        '5:Disrupting Attack'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.disruptingAttackFeature:' +
           'Undead %V Will save or destroyed level/5/day',
        'combatNotes.touchOfTheLivingFeature:+%V damage vs. undead',
        'magicNotes.senseTheDeadFeature:Detect undead %V ft at will',
        'saveNotes.wardOfLifeFeature:Immune to undead %V'
      ];
      rules.defineRule('combatNotes.disruptingAttackFeature',
        'pathLevels.Fellhunter', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('combatNotes.touchOfTheLivingFeature',
        'pathLevels.Fellhunter', '+=', 'Math.floor((source + 3) / 5) * 2'
      );
      rules.defineRule('magicNotes.senseTheDeadFeature',
        'pathLevels.Fellhunter', '+=',
          '10 * (Math.floor((source + 4) / 5) + Math.floor((source + 1) / 5))'
      );
      rules.defineRule('saveNotes.wardOfLifeFeature',
        'pathLevels.Fellhunter', '=',
        '"extraordinary special attacks" + ' +
        '(source >= 8 ? "/ability damage" : "") + ' +
        '(source >= 13 ? "/ability drain" : "") + ' +
        '(source >= 18 ? "/energy drain" : "")'
      );

    } else if(path == 'Feyblooded') {

      MN2E.selectableFeatures[path] =
        'Armor Class Bonus/Dexterity Bonus/Fortitude Bonus/Reflex Bonus/' +
        'Will Bonus';
      features = ['1:Low Light Vision', '7:Fey Vision'];
      spellFeatures = [
        '2:Disguise Self', '3:Ventriloquism', '5:Magic Aura',
        '6:Invisibility', '9:Nondetection', '10:Glibness',
        '11:Deep Slumber', '14:False Vision', '15:Rainbow Pattern',
        '17:Mislead', '18:Seeming'
      ];
      notes = [
        'magicNotes.feyVisionFeature:Detect %V auras at will'
      ];
      rules.defineRule('selectableFeatureCount.Feyblooded',
        'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)',
        'charismaModifier', '*', null,
        'level', 'v', 'source<8 ? 1 : source<12 ? 3 : source<16 ? 6 : ' +
                      'source<20 ? 10 : 15'
      );
      rules.defineRule('magicNotes.feyVisionFeature',
        'pathLevels.Feyblooded', '=',
        'source >= 19 ? "all magic" : ' +
        'source >= 13 ? "enchantment/illusion" : "enchantment"'
      );

    } else if(path == 'Giantblooded') {

      features = [
        '1:Obvious', '2:Rock Throwing', '3:Intimidating Size',
        '4:Fast Movement', '5:Strength Bonus', '8:Fearsome Charge', '10:Large',
        '20:Extra Reach'
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
      rules.defineRule('abilityNotes.fastMovementFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 4) / 8) * 5'
      );
      rules.defineRule('armorClass', 'combatNotes.largeFeature', '+', '-1');
      rules.defineRule('baseAttack', 'combatNotes.largeFeature', '+', '-1');
      rules.defineRule('combatNotes.fearsomeChargeFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 2) / 10)'
      );
      rules.defineRule('combatNotes.rockThrowingFeature',
        'pathLevels.Giantblooded', '=',
        'source >= 19 ? 120 : source >= 13 ? 90 : source >= 6 ? 60 : 30'
      );
      rules.defineRule('giantbloodedFeatures.Strength Bonus',
        'level', '+', 'source >= 15 ? 1 : null'
      );
      rules.defineRule('skillNotes.intimidatingSizeFeature',
        'pathLevels.Giantblooded', '+=',
        'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
      );
      rules.defineChoice('weapons', 'Boulder:d10 R30');
      rules.defineRule
        ('weapons.Boulder', 'combatNotes.rockThrowingFeature', '=', '1');
      rules.defineRule('weaponDamage.Boulder',
        'pathLevels.Giantblooded', '=',
        'source >= 16 ? "2d8" : source >= 9 ? "2d6" : "d10"'
      );

    } else if(path == 'Guardian') {

      features = [
        '1:Inspire Valor', '2:Detect Evil', '3:Righteous Fury', '4:Smite Evil',
        '5:Constitution Bonus', '6:Lay On Hands', '12:Aura Of Courage',
        '16:Death Ward'
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
      rules.defineRule('guardianFeatures.Constitution Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );
      rules.defineRule('combatNotes.righteousFuryFeature',
        'pathLevels.Guardian', '+=',
        'source >= 17 ? 12 : source >= 12 ? 9 : ' +
        '(Math.floor((source + 1) / 4) * 3)'
      );
      rules.defineRule('combatNotes.smiteEvilFeature',
        'pathLevels.Guardian', '+=',
        'source >= 18 ? 4 : source >= 14 ? 3 : source >= 8 ? 2 : 1'
      );
      rules.defineRule('featureNotes.inspireValorFeature',
        'pathLevels.Guardian', '=',
        'source >= 19 ? "+2 3/day" : source >= 13 ? "+2 2/day" : ' +
        'source >= 9 ? "+1 2/day" : "+1 1/day"'
      );
      rules.defineRule('magicNotes.layOnHandsFeature',
        'pathLevels.Guardian', '+=', null,
        'charismaModifier', '*', null
      );

    } else if(path == 'Healer') {

      features = null;
      spellFeatures = [
        '1:Cure Light Wounds', '2:Lesser Restoration', '3:Cure Light Wounds',
        '4:Cure Moderate Wounds', '5:Remove Disease', '6:Cure Moderate Wounds',
        '7:Cure Serious Wounds', '8:Remove Blindness/Deafness',
        '9:Cure Serious Wounds', '10:Cure Critical Wounds',
        '11:Neutralize Poison', '12:Cure Critical Wounds',
        '13:Mass Cure Light Wounds', '14:Restoration',
        '15:Mass Cure Light Wounds', '16:Heal', '17:Restoration', '18:Heal',
        '19:Regenerate', '20:Raise Dead'
      ];
      notes = null;

    } else if(path == 'Ironborn') {

      features = [
        '1:Ironborn Resilience', '2:Fortitude Bonus', '3:Armor Class Bonus',
        '4:Improved Healing', '5:Damage Reduction', '6:Elemental Resistance',
        '9:Indefatigable', '14:Greater Improved Healing',
        '19:Improved Indefatigable',
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.greaterImprovedHealingFeature:' +
          'Regain 1 point ability damage/hour',
        'combatNotes.improvedHealingFeature:Regain %V HP/hour',
        'combatNotes.ironbornResilienceFeature:Improved hit die',
        'saveNotes.elementalResistanceFeature:' +
          '%V resistance to acid/cold/electricity/fire',
        'saveNotes.indefatigableFeature:Immune fatigue effects',
        'saveNotes.improvedIndefatigableFeature:Immune exhaustion effects'
      ];
      rules.defineRule('combatNotes.damageReductionFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 5)'
      );
      rules.defineRule('combatNotes.improvedHealingFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('ironbornFeatures.Fortitude Bonus',
        'level', '+', 'Math.floor((source - 2) / 5)'
      );
      rules.defineRule('ironbornFeatures.Armor Class Bonus',
        'level', '+', 'Math.floor((source - 3) / 5)'
      );
      rules.defineRule('saveNotes.elementalResistanceFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor((source - 1) / 5) * 3'
      );

    } else if(path == 'Jack-Of-All-Trades') {

      MN2E.selectableFeatures[path] =
        'Strength Bonus/Intelligence Bonus/Wisdom Bonus/Dexterity Bonus/' +
         'Constitution Bonus/Charisma Bonus';
      features = [
        '1:Spell Choice', '2:Spontaneous Spell', '3:Skill Boost', '7:Feat Bonus'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.spellChoiceFeature:' +
          'Use chosen %V spell as spell-like ability 1/day',
        'magicNotes.spontaneousSpellFeature:' +
          'Use any %V spell as spell-like ability 1/day',
        'skillNotes.skillBoostFeature:+4 to %V chosen skills'
      ];
      rules.defineRule('jack-Of-All-TradesFeatures.Feat Bonus',
        'level', '+', 'source >= 14 ? 1 : null'
      );
      rules.defineRule('magicNotes.spellChoiceFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source>=16 ? "W0/W1/W2/W3" : source>=10 ? "W0/W1/W2" : ' +
        'source>=6 ? "W0/W1" : "W0"'
      );
      rules.defineRule('magicNotes.spontaneousSpellFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 19 ? "W0/W1/W2" : source >= 13 ? "W0/W1" : "W0"'
      );
      rules.defineRule('selectableFeatureCount.Jack-Of-All-Trades',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source>=18 ? 7 : source>=15 ? 6 : source>=12 ? 5 : source>=9 ? 4 : ' +
        'source>=8 ? 3 : source>=5 ? 2 : source>=4 ? 1 : null'
      );
      rules.defineRule('skillNotes.skillBoostFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 20 ? 4 : source >= 17 ? 3 : source >= 11 ? 2 : 1'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.skillBoostFeature', '+', '4 * source');

    } else if(path == 'Mountainborn') {

      features = [
        '1:Mountaineer', '1:Mountain Survival', '3:Ambush', '4:Rallying Cry',
        '5:Constitution Bonus', '8:Improved Ambush', '13:Quick Ambush',
        '18:Greater Ambush'
      ];
      spellFeatures = [
        '2:Endure Elements', '7:Pass Without Trace', '12:Meld Into Stone',
        '17:Stone Tell'
      ];
      notes = [
        'combatNotes.greaterAmbushFeature:' +
          'Reduced Hide penalty for using ranged weapons',
        'combatNotes.improvedAmbushFeature:' +
           'Allies +2 damage vs. flat-footed foes on surprise/1st melee rounds',
        'combatNotes.rallyingCryFeature:' +
          'Allies not flat-footed/+4 vs. surprise %V/day',
        'skillNotes.ambushFeature:Allies use character\'s Hide for ambush',
        'skillNotes.quickAmbushFeature:Hide allies for ambush in half time',
        'skillNotes.mountaineerFeature:+%V Balance/Climb/Jump',
        'skillNotes.mountainSurvivalFeature:+%V Survival (mountains)'
      ];
      rules.defineRule('combatNotes.rallyingCryFeature',
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 1) / 5)'
      );
      rules.defineRule('mountainbornFeatures.Constitution Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );
      rules.defineRule('skillNotes.mountaineerFeature',
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 5) * 2'
      );
      rules.defineRule('skillNotes.mountainSurvivalFeature',
        'pathLevels.Mountainborn', '+=', 'Math.floor((source + 4) / 5) * 2'
      );

    } else if(path == 'Naturefriend') {

      features = [
        '1:Natural Bond', '1:Wild Empathy', '5:Animal Friend',
        '10:Plant Friend', '15:Elemental Friend', '20:One With Nature'
      ];
      spellFeatures = [
        '2:Calm Animals', '3:Entangle', '4:Obscuring Mist',
        '6:Animal Messenger', '7:Wood Shape', '8:Gust Of Wind',
        '9:Speak With Animals', '11:Speak With Plants', '12:Call Lightning',
        '13:Dominate Animal', '14:Spike Growth', '16:Sleet Storm',
        '17:Summon Nature\'s Ally IV', '18:Command Plants', '19:Ice Storm'
      ];
      notes = [
        'combatNotes.animalFriendFeature:Animals DC %V Will save to attack',
        'combatNotes.elementalFriendFeature:' +
          'Elementals DC %V Will save to attack',
        'combatNotes.plantFriendFeature:Plants DC %V Will save to attack',
        'featureNotes.naturalBondFeature:' +
          'Knowledge (Nature) and Survival are class skills',
        'magicNotes.oneWithNatureFeature:<i>Commune With Nature</i> at will',
        'skillNotes.animalFriendFeature:+4 Handle Animal',
        'skillNotes.elementalFriendFeature:+4 Diplomacy (elementals)',
        // TODO Only if otherwise class skill
        'skillNotes.naturalBondFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.plantFriendFeature:+4 Diplomacy (plants)'
      ];
      rules.defineRule('combatNotes.animalFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('combatNotes.elementalFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('combatNotes.plantFriendFeature',
        'charismaModifier', '=', '10 + source'
      );
      rules.defineRule('classSkills.Knowledge (Nature)',
        'featureNotes.naturalBondFeature', '=', '1'
      );
      rules.defineRule
        ('classSkills.Survival', 'featureNotes.naturalBondFeature', '=', '1');
      rules.defineRule
        ('skillNotes.wildEmpathyFeature','pathLevels.Naturefriend','+=',null);

    } else if(path == 'Northblooded') {

      features = [
        '1:Northborn', '1:Wild Empathy', '2:Cold Resistance', '3:Battle Cry',
        '4:Howling Winds', '5:Constitution Bonus', '6:Aura Of Warmth',
        '11:Improved Battle Cry', '13:Frost Weapon', '16:Cold Immunity',
        '18:Greater Frost Weapon'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.battleCryFeature:+Level hit points after cry %V/day',
        'combatNotes.frostWeaponFeature:' +
           '+d6 cold damage on hit for level rounds %V/day',
        'combatNotes.greaterFrostWeaponFeature:' +
          '+d10 cold damage/extra critical hit die on critical hit',
        'combatNotes.improvedBattleCryFeature:+1 attack/damage after cry',
        'magicNotes.auraOfWarmthFeature:Allies w/in 10 ft +4 Fortitude vs cold',
        'magicNotes.howlingWindsFeature:' +
          '<i>Commune With Nature</i> (winds) %V/day',
        'saveNotes.coldImmunityFeature:' +
          'No damage from cold/50% greater damage from fire',
        'saveNotes.coldResistanceFeature:Ignore first %V points cold damage',
        'saveNotes.northbornFeature:Immune to non-lethal cold/exposure',
        'skillNotes.northbornFeature:' +
          '+2 Survival (cold)/Wild Empathy (cold natives)'
      ];
      rules.defineRule('combatNotes.battleCryFeature',
        'pathLevels.Northblooded', '=',
        'source >= 17 ? 4 : source >= 14 ? 3 : source >= 7 ? 2 : 1'
      );
      rules.defineRule('combatNotes.frostWeaponFeature',
        'pathLevels.Northblooded', '=', 'source >= 19 ? 2 : 1'
      );
      rules.defineRule('northbloodedFeatures.Constitution Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );
      rules.defineRule('magicNotes.howlingWindsFeature',
        'pathLevels.Northblooded', '+=',
        'source >= 12 ? 3 : source >= 8 ? 2 : 1'
      );
      rules.defineRule('saveNotes.coldResistanceFeature',
        'pathLevels.Northblooded', '+=', 'source >= 9 ? 15 : 5'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'pathLevels.Northblooded', '+=', null
      );

    } else if(path == 'Painless') {

      features = [
        '1:Painless', '2:Nonlethal Damage Reduction', '3:Uncaring Mind',
        '4:Retributive Rage', '5:Ferocity', '9:Last Stand',
        '10:Increased Damage Threshold', '14:Improved Retributive Rage'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.ferocityFeature:Continue fighting below 0 HP',
        'combatNotes.improvedRetributiveRageFeature:' +
          '+%V damage next round after suffering double level damage',
        'combatNotes.increasedDamageThresholdFeature:' +
          'Continue fighting until -%V HP',
        'combatNotes.lastStandFeature:' +
           '1 minute of %V spell resistance/15 damage reduction/30 energy ' +
           'resistance/near death afterward',
        'combatNotes.nonlethalDamageReductionFeature:' +
          'Ignore first %V points of non-lethal damage',
        'combatNotes.painlessFeature:+%V HP',
        'combatNotes.retributiveRageFeature:' +
          '+%V attack next round after suffering double level damage',
        'saveNotes.painlessFeature:+%V vs. pain effects',
        'saveNotes.uncaringMindFeature:+%V vs. enchantment'
      ];
      rules.defineRule('combatNotes.improvedRetributiveRageFeature',
        'pathLevels.Painless', '+=', null
      );
      rules.defineRule('combatNotes.increasedDamageThresholdFeature',
        'pathLevels.Painless', '+=',
        'source >= 20 ? 25 : source >= 15 ? 20 : 15'
      );
      // TODO Twice/day at level 19
      rules.defineRule('combatNotes.lastStandFeature',
        'pathLevels.Painless', '+=', '10 + source'
      );
      rules.defineRule('combatNotes.nonlethalDamageReductionFeature',
        'pathLevels.Painless', '+=', 'Math.floor((source + 3) / 5) * 3'
      );
      rules.defineRule
        ('combatNotes.painlessFeature', 'pathLevels.Painless', '+=', null);
      rules.defineRule('combatNotes.retributiveRageFeature',
        'pathLevels.Painless', '+=', null
      );
      rules.defineRule
        ('hitPoints', 'combatNotes.painlessFeature', '+', null);
      rules.defineRule
        ('resistance.Enchantment', 'saveNotes.uncaringMindFeature', '+=', null);
      rules.defineRule
        ('resistance.Pain', 'saveNotes.painlessFeature', '+=', null);
      rules.defineRule('saveNotes.uncaringMindFeature',
        'pathLevels.Painless', '+=', 'Math.floor((source + 2) / 5)'
      );
      rules.defineRule('saveNotes.painlessFeature',
        'pathLevels.Painless', '=', 'Math.floor((source + 4) / 5) * 5'
      );

    } else if(path == 'Pureblood') {

      MN2E.selectableFeatures[path] =
        'Strength Bonus/Intelligence Bonus/Wisdom Bonus/Dexterity Bonus/' +
        'Constitution Bonus/Charisma Bonus';
      features = [
        '1:Master Adventurer', '2:Blood Of Kings', '3:Feat Bonus',
        '4:Skill Mastery'
      ];
      spellFeatures = null;
      notes =[
        'abilityNotes.abilityBonusFeature:+1 to %V different abilities',
        'featureNotes.skillMasteryFeature:' +
          'Skill Mastery feat with %V chosen skills',
        'skillNotes.bloodOfKingsFeature:' +
          'Daily +%V on charisma skills in shadow or resistance interactions',
        'skillNotes.masterAdventurerFeature:' +
          '+%V on three selected non-charisma skills'
      ];
      rules.defineRule
        ('featCount', 'featureNotes.skillMasteryFeature', '+', null);
      rules.defineRule('purebloodFeatures.Feat Bonus',
        'level', '+', 'Math.floor((source - 3) / 5)'
      );
      rules.defineRule('featureNotes.skillMasteryFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 1) / 5)'
      );
      rules.defineRule('selectableFeatureCount.Pureblood',
        'pathLevels.Pureblood', '=', 'source>=5 ? Math.floor(source / 5) : null'
      );
      rules.defineRule('skillNotes.bloodOfKingsFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 3) / 5) * 2'
      );
      rules.defineRule('skillNotes.masterAdventurerFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 4) / 5) * 2'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.masterAdventurerFeature', '+', '3*source');

    } else if(path == 'Quickened') {

      features = [
        '1:Initiative Bonus', '2:Armor Class Bonus', '3:Fast Movement',
        '4:Burst Of Speed', '5:Dexterity Bonus'
      ];
      spellFeatures = null;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.burstOfSpeedFeature:' +
          'Extra attack/move action for 3+conMod rounds %V/day/fatigued afterward'
      ];
      rules.defineRule('abilityNotes.fastMovementFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 2) / 5) * 5'
      );
      rules.defineRule('combatNotes.burstOfSpeedFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 1) / 5)'
      );
      rules.defineRule('combatNotes.initiativeBonusFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 4) / 5) * 2'
      );
      rules.defineRule
        ('initiative', 'combatNotes.initiativeBonusFeature', '+', null);
      rules.defineRule('quickenedFeatures.Armor Class Bonus',
        'level', '+', 'Math.floor((source - 2) / 5)'
      );
      rules.defineRule('quickenedFeatures.Dexterity Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );

    } else if(path == 'Seaborn') {

      features = [
        '1:Dolphin\'s Grace', '2:Deep Lungs', '3:Aquatic Blindsight',
        '4:Aquatic Ally', '10:Aquatic Adaptation', '14:Cold Resistance',
        '17:Aquatic Emissary', '18:Assist Allies'
      ];
      spellFeatures = [
        '4:Aquatic Ally II', '5:Blur', '8:Aquatic Ally III', '9:Fog Cloud',
        '12:Aquatic Ally IV', '13:Displacement', '16:Aquatic Ally V',
        '20:Aquatic Ally VI'
      ];
      notes = [
        'magicNotes.aquaticAllyFeature:Cast <i>Aquatic Ally</i> spells %V/day',
        'saveNotes.coldResistanceFeature:Ignore first %V points cold damage',
        'skillNotes.aquaticAdaptationFeature:' +
           'Breathe through gills/no underwater pressure damage',
        'skillNotes.aquaticBlindsightFeature:' +
           'Detect creatures in opaque water up to %V feet',
        'skillNotes.aquaticEmissaryFeature:Speak to all aquatic animals',
        'skillNotes.assistAlliesFeature:' +
          'Allies move through water at full speed/give oxygen to allies',
        'skillNotes.dolphin\'sGraceFeature:%V Swim speed/+8 Swim hazards',
        'skillNotes.deepLungsFeature:Hold breath for %V rounds'
      ];
      rules.defineRule('magicNotes.aquaticAllyFeature',
        'pathLevels.Seaborn', '+=', 'Math.floor(source / 4)'
      );
      rules.defineRule('saveNotes.coldResistanceFeature',
        'pathLevels.Seaborn', '+=', 'source >= 14 ? 5 : null'
      );
      rules.defineRule('skillNotes.aquaticBlindsightFeature',
        'pathLevels.Seaborn', '+=', 'Math.floor((source + 5) / 8) * 30'
      );
      rules.defineRule('skillNotes.deepLungsFeature',
        'pathLevels.Seaborn', '+=', 'source >= 6 ? 4 : 3',
        'constitution', '*', null
      );
      rules.defineRule('skillNotes.dolphin\'sGraceFeature',
        'pathLevels.Seaborn', '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
      );

    } else if(path == 'Seer') {

      features = ['3:Seer Sight'];
      spellFeatures = [
        '1:Alarm', '2:Augury', '4:Clairaudience/Clairvoyance',
        '5:Locate Object', '7:Locate Creature', '8:Speak With Dead',
        '10:Divination', '11:Scrying', '13:Arcane Eye', '14:Divination',
        '16:Prying Eyes', '17:Legend Lore', '19:Commune', '20:Vision'
      ];
      notes = [
        'magicNotes.seerSightFeature:' +
          'Discern recent history of touched object %V/day'
      ];
      rules.defineRule('magicNotes.seerSightFeature',
        'pathLevels.Seer', '=', 'Math.floor((source + 6) / 6)'
      );

    } else if(path == 'Shadow Walker') {

      features = [
        '1:Darkvision', '2:Shadow Veil', '4:Shadow Jump',
        '11:Hide In Plain Sight'
      ];
      spellFeatures = [
        '3:Expeditious Retreat', '5:Blur', '7:Undetectable Alignment',
        '9:Displacement', '13:Expeditious Retreat', '15:Blur',
        '17:Undetectable Alignment', '19:Displacement'
      ];
      notes = [
        'featureNotes.shadowJumpFeature:Move %V ft between shadows',
        'skillNotes.shadowVeilFeature:+%V Hide'
      ];
      rules.defineRule('featureNotes.shadowJumpFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor(source / 4) * 10'
      );
      rules.defineRule('skillNotes.shadowVeilFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor((source + 2) / 4) * 2'
      );

    } else if(path == 'Speaker') {

      features = [
        '2:Persuasive Speaker', '3:Power Words', '5:Charisma Bonus',
        '14:Language Savant'
      ];
      spellFeatures = [
        '1:Comprehend Languages', '4:Whispering Wind', '8:Tongues', '12:Shout',
        '18:Greater Shout'
      ];
      notes = [
        'magicNotes.powerWordsFeature:<i>Word of %V</i> 3+conMod/day',
        'skillNotes.languageSavantFeature:' +
          'Fluent in any language after listening for 10 minutes',
        'skillNotes.persuasiveSpeakerFeature:+%V on verbal charisma skills'
      ];
      rules.defineRule('speakerFeatures.Charisma Bonus',
        'level', '+', 'Math.floor((source - 5) / 5)'
      );
      rules.defineRule('magicNotes.powerWordsFeature',
        'pathLevels.Speaker', '=',
        '"Opening" + (source >= 6 ? "/Shattering" : "") + ' +
                    '(source >= 9 ? "/Silence" : "") + ' +
                    '(source >= 13  ? "/Slumber" : "") + ' +
                    '(source >= 16 ? "/Charming" : "") + ' +
                    '(source >= 19 ? "/Holding" : "")'
      );
      rules.defineRule('skillNotes.persuasiveSpeakerFeature',
        'pathLevels.Speaker', '=',
        'source >= 17 ? 8 : source >= 11 ? 6 : source >= 7 ? 4 : 2'
      );

    } else if(path == 'Spellsoul') {

      features = [
        '1:Untapped Potential', '2:Metamagic Aura',
        '3:Improved Spell Resistance', '4:Bonus Spell Energy'
      ];
      spellFeatures = null;
      notes = [
        'magicNotes.metamagicAuraFeature:' +
          '%V others\'spells up to 1/2 level w/in 30 ft',
        'magicNotes.metamagicAuraFeature2:%V/day',
        'magicNotes.untappedPotentialFeature:' +
          'Contribute %V points to others\' spells w/in 30 ft',
        'saveNotes.improvedSpellResistanceFeature:+%V vs. spells'
      ];
      rules.defineRule('magicNotes.bonusSpellEnergyFeature',
        'pathLevels.Spellsoul', '+=',
         'source>=18?8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : null'
      );
      rules.defineRule('magicNotes.metamagicAuraFeature',
        'pathLevels.Spellsoul', '=',
        '["Enlarge"].concat(source >= 5 ? ["Extend"] : [])' +
                   '.concat(source >= 8 ? ["Reduce"] : [])' +
                   '.concat(source >= 11 ? ["Attract"] : [])' +
                   '.concat(source >= 14 ? ["Empower"] : [])' +
                   '.concat(source >= 17 ? ["Maximize"] : [])' +
                   '.concat(source >= 20 ? ["Redirect"] : []).sort().join("/")'
      );
      rules.defineRule('magicNotes.metamagicAuraFeature2',
        'pathLevels.Spellsoul', '=',
        'source >=15?4 : source>=10?3 : source>=6?2 : source>=2?1 : null'
      );
      rules.defineRule('magicNotes.untappedPotentialFeature',
        'highestMagicModifier', '=', 'source + 1',
        'level', '+',
          'source>=18 ? 8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : 0'
      );
      rules.defineRule('resistance.Spell',
        'saveNotes.improvedSpellResistanceFeature', '+=', null
      );
      rules.defineRule('saveNotes.improvedSpellResistanceFeature',
        'pathLevels.Spellsoul', '=',
        'source>=19 ? 5 : source>=16 ? 4 : source>=12 ? 3 : source>=7 ? 2 : ' +
        'source>=3 ? 1 : null'
      );

    } else if(path == 'Steelblooded') {

      features = [
        '1:Feat Bonus', '2:Offensive Tactics', '3:Strategic Blow',
        '4:Skilled Warrior', '14:Untouchable', '19:Improved Untouchable'
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
      rules.defineRule('combatNotes.offensiveTacticsFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=17 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );
      rules.defineRule('combatNotes.skilledWarriorFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=18 ? 4 : source>=13 ? 3 : source>=8 ? 2 : 1'
      );
      rules.defineRule('combatNotes.strategicBlowFeature',
        'pathLevels.Steelblooded', '+=',
        'source>=16 ? 15 : source>=12 ? 12 : source>=9 ? 9 : source>=6 ? 6 : 3'
      );
      rules.defineRule('steelbloodedFeatures.Feat Bonus',
        'level', '+', 'Math.floor(source / 5)'
      );

    } else if(path == 'Sunderborn') {

      features = [
        '1:Detect Outsider', '2:Blood Of The Planes', '4:Planar Fury',
        '7:Darkvision', '13:Magical Darkvision', '19:Invisibility Vision'
      ];
      spellFeatures = [
        '3:Summon Monster I', '6:Summon Monster II', '9:Summon Monster III',
        '12:Summon Monster IV', '15:Summon Monster V', '18:Summon Monster VI'
      ];
      notes = [
        'combatNotes.planarFuryFeature:' +
          '+2 strength/constitution/+1 Will save/-1 AC 5+conMod rounds %V/day',
        'featureNotes.magicalDarkvisionFeature:See perfectly in any darkness',
        'featureNotes.invisibilityVisionFeature:See invisible creatures',
        'magicNotes.detectOutsiderFeature:Detect outsiders at will',
        'skillNotes.bloodOfThePlanesFeature:' +
          '+%V on charisma skills when dealing with outsiders'
      ];
      rules.defineRule('combatNotes.planarFuryFeature',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('skillNotes.bloodOfThePlanesFeature',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 1) / 3) * 2'
      );

    } else if(path == 'Tactician') {

      features = [
        '1:Aid Another', '2:Combat Overview', '3:Coordinated Initiative',
        '4:Coordinated Attack', '5:Aided Combat Bonus', '13:Directed Attack',
        '18:Telling Blow', '20:Perfect Assault'
      ];
      spellFeatures = null;
      notes = [
        'combatNotes.aidAnotherFeature:Aid another as a move action',
        'combatNotes.aidedCombatBonusFeature:Aided ally +%V to attack or AC',
        'combatNotes.combatOverviewFeature:' +
          'Ally w/in 60 ft avoid AOO/flat-footed or foe flat-footed %V/day',
        'combatNotes.coordinatedAttackFeature:' +
          'Allies w/in 30 ft attack single foe at +1/participant (+5 max) ' +
          '%V/day',
        'combatNotes.coordinatedInitiativeFeature:' +
          'Allies w/in 30 ft use character\'s initiative %V/day',
        'combatNotes.directedAttackFeature:' +
          'Ally w/in 30 ft add 1/2 character\'s base attack 1/day',
        'combatNotes.perfectAssaultFeature:' +
          'Allies w/in 30 ft threaten critical on any hit 1/day',
        'combatNotes.tellingBlowFeature:Allies w/in 30 ft re-roll damage 1/day'
      ];
      rules.defineRule('combatNotes.aidedCombatBonusFeature',
        'pathLevels.Tactician', '+=',
        'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : 0'
      );
      rules.defineRule('combatNotes.combatOverviewFeature',
        'pathLevels.Tactician', '+=',
        'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
      );
      rules.defineRule('combatNotes.coordinatedAttackFeature',
        'pathLevels.Tactician', '+=',
        'source>=17 ? 4 : source==16 ? 3 : Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.coordinatedInitiativeFeature',
        'pathLevels.Tactician', '+=',
        'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );

    } else if(path == 'Warg') {

      features = [
        '1:Wild Empathy', '2:Animal Companion', '5:Wild Shape', '13:Ferocity',
        '20:Blindsense'
      ];
      spellFeatures = [
        '4:Charm Animal', '7:Speak With Animals', '12:Charm Animal',
        '17:Speak With Animals'
      ];
      notes = [
        'combatNotes.ferocityFeature:Continue fighting below 0 HP',
        'magicNotes.wildShapeFeature:Change into creature of size %V'
      ];
      rules.defineRule('wargFeatures.Animal Companion',
        'level', '+', 'Math.floor((source - 2) / 4)'
      );
      rules.defineRule('magicNotes.wildShapeFeature',
        'pathLevels.Warg', '=',
        'source >= 19 ? "medium-huge 3/day" : ' +
        'source >= 15 ? "medium-large 3/day" : ' +
        'source >= 11 ? "medium-large 2/day" : ' +
        'source >= 8 ? "medium 2/day" : ' +
        'source >= 5 ? "medium 1/day" : null'
      );
      rules.defineRule('selectableFeatureCount.Warg',
        'pathLevels.Warg', '=', 'source >= 16 ? 3 : source >= 9 ? 2 : 1'
      );
      rules.defineRule
        ('skillNotes.wildEmpathyFeature', 'pathLevels.Warg', '+=', null);

    } else
      continue;

    var prefix =
      path.substring(0, 1).toLowerCase() + path.substring(1).replace(/ /g, '');
    if(features != null) {
      for(var j = 1; j < features.length; j += 2) {
        var levelAndFeature = features[j].split(/:/);
        var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
        var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
        rules.defineRule(prefix + 'Features.' + feature,
          'pathLevels.' + path, '=', 'source >= ' + level + ' ? 1 : null'
        );
        rules.defineRule
          ('features.' + feature, prefix + 'Features.' + feature, '+=', null);
      }
    }
    rules.defineSheetElement
      (path + ' Features', 'FeaturesAndSkills', null, 'Feats', ' * ');
    if(spellFeatures != null) {
      var spellLevels = {};
      for(var j = 1; j < spellFeatures.length; j += 2) {
        var levelAndSpell = spellFeatures[j].split(/:/);
        var level = levelAndSpell.length == 1 ? 1 : levelAndSpell[0];
        var spell = levelAndSpell[levelAndSpell.length == 1 ? 0 : 1];
        spell = '<i>' + spell + '</i>';
        if(spellLevels[spell] == null) {
          spellLevels[spell] = [level];
        } else {
          spellLevels[spell][spellLevels[spell].length] = level;
        }
      }
      for(spell in spellLevels) {
        var levels = spellLevels[spell];
        var rule = '';
        for(var j = levels.length - 1; j >= 0; j--) {
          rule += 'source >= ' + levels[j] + ' ? ' + (j + 1) + ' : ';
        }
        rule += 'null';
        rules.defineRule
          (prefix + 'Spells.' + spell, 'pathLevels.' + path, '=', rule);
      }
      rules.defineSheetElement
        (path + ' Spells', 'Magic', null, 'Spells', ' * ');
    }
    if(notes != null)
      rules.defineNote(notes);
    rules.defineRule('pathLevels.' + path,
      'heroicPath', '?', 'source == "' + path + '"',
      'level', '=', null
    );

  }
  rules.defineSheetElement('Heroic Path', 'Description', null, 'Alignment');
  rules.defineSheetElement('Deity', null, null, null);

};

MN2E.magicRules = function(rules) {

  rules.defineChoice('spells', MN2E.SPELLS);
  rules.defineSheetElement
    ('Spell Energy Points', 'SpellStats', '<b>Spell Energy Points</b>: %V',
     'Spells Per Day');

};

MN2E.raceRules = function(rules) {

  /* Notes and rules that apply to multiple races */
  var notes = [
    'abilityNotes.naturalMountaineerFeature:' +
       'Unimpeded movement in mountainous terrain',
    'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
    'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
    'magicNotes.spellResistanceFeature:-2 spell energy',
    'saveNotes.coldHardyFeature:+5 cold/half nonlethal damage',
    'saveNotes.fortunateFeature:+1 all saves',
    'saveNotes.hardyFeature:+1 Fortitude',
    'saveNotes.poisonResistanceFeature:+2 vs. poison',
    'saveNotes.spellResistanceFeature:+2 vs. spells',
    'skillNotes.dextrousHandsFeature:+2 Craft (non-metal/non-wood)',
    'skillNotes.favoredRegion:' +
      '%V; Knowledge (Local) is a class skill/+2 Survival/Knowledge (Nature)',
    'skillNotes.giftedHealerFeature:+2 Heal',
    'skillNotes.improvedFavoredRegion:%V; +2 Survival/Knowledge (Nature)',
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
    'skillNotes.stoneKnowledgeFeature:' +
       '+2 Appraise/Craft involving stone or metal'
  ];
  rules.defineNote(notes);
  rules.defineRule
    ('holdBreathMultiplier', 'race', '=', 'source == "Sea Elf" ? 6 : 3');
  rules.defineRule
    ('resistance.Poison', 'saveNotes.poisonResistanceFeature', '+=', '2');
  rules.defineRule
    ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
  rules.defineRule
    ('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
  rules.defineRule('skillNotes.favoredRegion',
    'race', '=', 'MN2E.racesFavoredRegions[source]'
  );
  rules.defineRule
    ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');
  rules.defineRule('skillNotes.naturalSwimmerFeature',
    'constitution', '=', 'source',
    'holdBreathMultiplier', '*', null
  );
  rules.defineRule
    ('save.Fortitude', 'saveNotes.fortunateFeature', '+', '1');
  rules.defineRule('save.Reflex', 'saveNotes.fortunateFeature', '+', '1');
  rules.defineRule('save.Will', 'saveNotes.fortunateFeature', '+', '1');

  for(var i = 0; i < MN2E.RACES.length; i++) {

    var adjustment;
    var features = null;
    var notes = null;
    var race = MN2E.RACES[i];

    if(race == 'Dorn') {

      adjustment = '+2 strength/-2 intelligence';
      features = ['Brotherhood', 'Cold Hardy', 'Fierce', 'Hardy'];
      notes = [
        'combatNotes.brotherhoodFeature:' +
          '+1 attack when fighting alongside 4+ Dorns',
        'combatNotes.fierceFeature:+1 attack w/two-handed weapons'
      ];
      // TODO Bonus feat must be fighter or weapon/armor/shield proficiency
      rules.defineRule
        ('featCount', 'featureNotes.dornFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.dornFeatCountBonus',
        'race', '=', 'source == "Dorn" ? 1 : null'
      );
      rules.defineRule('skillNotes.dornSkillPointsBonus',
        'race', '?', 'source == "Dorn"',
        'level', '=', 'source + 3'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.dornSkillPointsBonus', '+', null);

    } else if(race.indexOf(' Dwarf') >= 0) {

      adjustment = '+2 constitution/-2 charisma';
      features = [
        'Darkvision', 'Dwarf Favored Enemy', 'Dwarf Favored Weapon',
        'Poison Resistance', 'Resilient', 'Slow', 'Spell Resistance',
        'Stone Knowledge'
      ];
      notes = [
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'combatNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'combatNotes.resilientFeature:+2 AC'
      ];
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.resilientFeature', '+', '2');
      if(race == 'Clan Dwarf') {
        features = features.concat([
          'Dodge Orcs', 'Know Depth', 'Stability', 'Stonecunning'
        ]);
        notes = notes.concat([
          'featureNotes.knowDepthFeature:Intuit approximate depth underground',
          'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
        ]);
      } else if(race == 'Kurgun Dwarf') {
        features = features.concat(['Natural Mountaineer']);
      }

    } else if(race.indexOf(' Dwarrow') >= 0) {

      adjustment = '+2 charisma';
      features = [
        'Darkvision', 'Poison Resistance', 'Small', 'Slow', 'Spell Resistance',
        'Sturdy'
      ];
      notes = [
        'combatNotes.sturdyFeature:+1 AC'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.sturdyFeature', '+', '1');
      if(race == 'Clan Raised Dwarrow') {
        features = features.concat([
          'Dodge Orcs', 'Stonecunning', 'Stone Knowledge'
        ]);
      } else if(race == 'Gnome Raised Dwarrow') {
        features = features.concat([
          'Natural Riverfolk', 'Natural Swimmer', 'Skilled Trader'
        ]);
        notes = [
          'skillNotes.skilledTraderFeature:' +
            '+2 Appraise/Bluff/Diplomacy/Forgery/Gather Information/Profession when smuggling/trading'
        ];
      } else if(race == 'Kurgun Raised Dwarrow') {
        features = features.concat([
          'Dodge Orcs', 'Natural Mountaineer', 'Stone Knowledge'
        ]);
      }

    } else if(race.indexOf(' Dworg') >= 0) {

      adjustment = '+2 strength/+2 constitution/-2 intelligence/-2 charisma';
      features = [
        'Darkvision', 'Dworg Favored Enemy', 'Minor Light Sensitivity',
        'Rugged', 'Spell Resistance'
      ];
      notes = [
        'combatNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'combatNotes.minorLightSensitivityFeature:DC 15 Fortitude save in sunlight to avoid -1 attack',
        'saveNotes.ruggedFeature:+2 all saves'
      ];
      rules.defineRule('save.Fortitude', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Reflex', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Will', 'saveNotes.ruggedFeature', '+', '2');
      if(race == 'Clan Raised Dworg') {
        features = features.concat(['Stonecunning']);
      } else if(race == 'Kurgun Raised Dworg') {
        features = features.concat(['Natural Mountaineer']);
      }

    } else if(race.indexOf(' Elfling') >= 0) {

      adjustment = '+4 dexterity/-2 strength/-2 constitution';
      features = [
        'Fortunate', 'Gifted Healer', 'Innate Magic', 'Keen Senses',
        'Low Light Vision', 'Nimble', 'Small'
      ];
      notes = [
        'skillNotes.nimbleFeature:+2 Climb/Hide'
      ];
      if(race == 'Halfling Raised Elfling') {
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat'
        ]);
        features = features.concat(['Bound To The Beast']);
        rules.defineRule('features.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
        );
      }

    } else if(race.indexOf(' Elf') >= 0) {

      adjustment = '+2 dexterity/-2 constitution';
      features = [
        'Enchantment Resistance', 'Innate Magic', 'Keen Senses',
        'Low Light Vision', 'Natural Channeler', 'Tree Climber'
      ];
      notes = [
        'magicNotes.naturalChannelerFeature:+2 spell energy',
        'saveNotes.enchantmentResistanceFeature:+2 vs. enchantments',
        'skillNotes.treeClimberFeature:+4 Balance (trees)/Climb (trees)'
      ];
      rules.defineRule('resistance.Enchantment',
        'saveNotes.enchantmentResistanceFeature', '+=', '2'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.naturalChannelerFeature', '+', '2');

      if(race == 'Jungle Elf') {
        features = features.concat([
          'Improved Innate Magic', 'Improved Keen Senses',
          'Improved Tree Climber', 'Spirit Foe'
        ]);
        notes = notes.concat([
          'magicNotes.improvedInnateMagicFeature:Bonus Innate Magic spell',
          'saveNotes.spiritFoeFeature:+2 vs. outsiders',
          'skillNotes.improvedKeenSensesFeature:+2 Listen/Search/Spot',
          'skillNotes.improvedTreeClimberFeature:' +
            '+2 Balance (trees)/Climb (trees)',
          'skillNotes.spiritFoeFeature:+4 Hide (nature)/Move Silently (nature)'
        ]);
        rules.defineRule('magicNotes.innateMagicFeature',
          'magicNotes.improvedInnateMagicFeature', '+', '1'
        );
        rules.defineRule
          ('skillNotes.feralElfFeature2', 'features.Feral Elf', '=', '1');
      } else if(race == 'Sea Elf') {
        features = features.concat([
          'Improved Natural Swimmer', 'Natural Sailor', 'Natural Swimmer'
        ]);
        notes = notes.concat([
          'skillNotes.naturalSailorFeature:' +
            '+2 Craft (ship/sea)/Profession (ship/sea)/Use Rope (ship/sea)'
        ]);
      } else if(race == 'Snow Elf') {
        features = features.concat(['Cold Hardy', 'Hardy']);
      } else if(race == 'Wood Elf') {
        features = features.concat([
          'Improved Innate Magic', 'Improved Natural Channeler'
        ]);
        notes = notes.concat([
          'magicNotes.improvedInnateMagicFeature:Bonus Innate Magic spell',
          'magicNotes.improvedNaturalChannelerFeature:+1 spell energy'
        ]);
        rules.defineRule('magicNotes.innateMagicFeature',
          'magicNotes.improvedInnateMagicFeature', '+', '1'
        );
        rules.defineRule('skillNotes.woodElfSkillPointsBonus',
          'race', '?', 'source == "Wood Elf"',
          'level', '=', 'source'
        );
        rules.defineRule
          ('skillPoints', 'skillNotes.woodElfSkillPointsBonus', '+', null);
        rules.defineRule('spellEnergy',
          'magicNotes.improvedNaturalChannelerFeature', '+', '1'
        );
      }

    } else if(race == 'Erenlander') {

      adjustment = null;
      features = ['Heartlander'];
      notes = [
        'abilityNotes.erenlanderAbilityAdjustment:+2 any/-2 any',
        'skillNotes.heartlanderFeature:+4 Craft/Profession ranks'
      ];
      rules.defineRule('abilityNotes.erenlanderAbilityAdjustment',
        'race', '=', 'source == "Erenlander" ? 1 : null'
      );
      rules.defineRule
        ('featCount', 'featureNotes.erenlanderFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.erenlanderFeatCountBonus',
        'race', '=', 'source == "Erenlander" ? 2 : null'
      );
      rules.defineRule('skillNotes.erenlanderSkillPointsBonus',
        'race', '?', 'source == "Erenlander"',
        'level', '=', '(source + 3) * 2'
      );
      rules.defineRule('skillPoints',
        'skillNotes.heartlanderFeature', '+', '4',
        'skillNotes.erenlanderSkillPointsBonus', '+', null
      );

    } else if(race == 'Gnome') {

      adjustment = '+4 charisma/-2 strength';
      features = [
        'Hardy', 'Low Light Vision', 'Natural Riverfolk', 'Natural Swimmer',
        'Natural Trader', 'Slow', 'Small', 'Spell Resistance'
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
        'Alert Senses', 'Fortunate', 'Graceful', 'Innate Magic',
        'Low Light Vision', 'Slow', 'Small', 'Unafraid'
      ];
      notes = [
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.alertSensesFeature:+2 Listen/Spot',
        'skillNotes.gracefulFeature:+2 Climb/Jump/Move Silently/Tumble'
      ];
      rules.defineRule
        ('resistance.Fear', 'saveNotes.unafraidFeature', '+=', '2');

      if(race == 'Agrarian Halfling') {
        MN2E.selectableFeatures[race] = 'Stout/Studious';
        features = features.concat(['Dextrous Hands', 'Gifted Healer']);
        notes = notes.concat([
          'featureNotes.stoutFeature:Endurance/Toughness',
          'featureNotes.studiousFeature:Magecraft (Hermetic)'
        ]);
        rules.defineRule('agrarianHalflingFeatures.Endurance',
          'featureNotes.stoutFeature', '=', '1'
        );
        rules.defineRule('agrarianHalflingFeatures.Toughness',
          'featureNotes.stoutFeature', '=', '1'
        );
        rules.defineRule('agrarianHalflingFeatures.Magecraft (Hermetic)',
          'featureNotes.studiousFeature', '=', '1'
        );
        rules.defineRule('features.Endurance',
          'agrarianHalflingFeatures.Endurance', '=', '1'
        );
        rules.defineRule('features.Magecraft (Hermetic)',
          'agrarianHalflingFeatures.Magecraft (Hermetic)', '=', '1'
        );
        rules.defineRule('features.Toughness',
          'agrarianHalflingFeatures.Toughness', '=', '1'
        );
        rules.defineRule('selectableFeatureCount.Agrarian Halfling',
          'race', '=', 'source == "Agrarian Halfling" ? 1 : null'
        );
      } else if(race == 'Nomadic Halfling') {
        MN2E.selectableFeatures[race] =
          'Bound To The Beast/Bound To The Spirits';
        features = features.concat(['Focused Rider', 'Skilled Rider']);
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat',
          'featureNotes.boundToTheSpiritsFeature:Magecraft (Spiritual)',
          'skillNotes.focusedRiderFeature:+2 Concentration (wogrenback)',
          'skillNotes.skilledRiderFeature:' +
            '+2 Handle Animal (wogren)/Ride (wogren)'
        ]);
        rules.defineRule('features.Mounted Combat',
          'nomadicHalflingFeatures.Bound To The Beast', '=', '1'
        );
        rules.defineRule('features.Magecraft (Spiritual)',
          'nomadicHalflingFeatures.Bound To The Spirits', '=', '1'
        );
        rules.defineRule('nomadicHalflingFeatures.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
        );
        rules.defineRule('nomadicHalflingFeatures.Magecraft (Spiritual)',
          'featureNotes.boundToTheSpiritsFeature', '=', '1'
        );
        rules.defineRule('selectableFeatureCount.Nomadic Halfling',
          'race', '=', 'source == "Nomadic Halfling" ? 1 : null'
        );
      }

    } else if(race == 'Orc') {

      adjustment = '+4 strength/-2 intelligence/-2 charisma';
      features = [
        'Darkvision', 'Improved Cold Hardy', 'Light Sensitivity',
        'Natural Predator', 'Night Fighter', 'Orc Favored Enemy',
        'Orc Valor', 'Spell Resistance'
      ];
      notes = [
        'combatNotes.lightSensitivityFeature:-1 attack in daylight',
        'combatNotes.nightFighterFeature:+1 attack in darkness',
        'combatNotes.orcValorFeature:' +
          '+1 attack when fighting alongside 9+ Orcs',
        'combatNotes.orcFavoredEnemyFeature:+1 damage vs. dwarves',
        'saveNotes.improvedColdHardyFeature:Immune non-lethal/half lethal',
        'skillNotes.naturalPredatorFeature:+%V Intimidate'
      ];
      rules.defineRule
        ('skillNotes.naturalPredatorFeature', 'strengthModifier', '=', null);

    } else if(race.indexOf(' Sarcosan') >= 0) {

      adjustment = '+2 charisma/+2 intelligence/-2 wisdom';
      features = ['Quick'];
      notes = [
        'combatNotes.quickFeature:+1 attack w/light weapons',
        'saveNotes.quickFeature:+1 Reflex'
      ];
      rules.defineRule
        ('featCount', 'featureNotes.sarcosanFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.sarcosanFeatCountBonus',
        'race', '=', 'source.indexOf("Sarcosan") >= 0 ? 1 : null'
      );
      rules.defineRule('skillNotes.sarcosanSkillPointsBonus',
        'race', '?', 'source.indexOf("Sarcosan") >= 0',
        'level', '=', 'source + 3'
      );
      rules.defineRule('saveReflex', 'saveNotes.quickFeature', '+', '1');
      rules.defineRule
        ('skillPoints', 'skillNotes.sarcosanSkillPointsBonus', '+', null);
      if(race == 'Plains Sarcosan') {
        features = features.concat(['Natural Horseman']);
        notes = notes.concat([
          'combatNotes.naturalHorsemanFeature:' +
            '+1 melee damage (horseback)/half ranged penalty (horseback)',
          'skillNotes.naturalHorsemanFeature:' +
            '+4 Concentration (horseback)/Handle Animal (horse)/Ride (horse)'
        ]);
      } else if(race == 'Urban Sarcosan') {
        features = features.concat(['Interactive', 'Urban']);
        notes = notes.concat([
          'skillNotes.urbanFeature:' +
            '+2 Gather Information (urban)/untrained Knowledge in urban areas',
          'skillNotes.interactiveFeature:+2 Bluff/Diplomacy/Sense Motive'
        ]);
      }

    } else
      continue;

    rules.defineRace(race, adjustment, features);
    if(notes != null)
      rules.defineNote(notes);

  }

};

MN2E.skillRules = function(rules) {
  rules.defineChoice('languages', MN2E.LANGUAGES);
  rules.defineChoice('skills', MN2E.SKILLS);
  var notes = [
    'skillNotes.knowledge(Local)Synergy2:' +
       '+2 Knowledge (Shadow) (local bureaucracy)',
    'skillNotes.knowledge(Nature)Synergy2:+2 Knowledge (Spirits)',
    'skillNotes.knowledge(Spirits)Synergy:+2 Knowledge (Nature)'
  ];
  rules.defineRule('skillNotes.knowledge(Nature)Synergy2',
    'skills.Knowledge (Nature)', '=', 'source >= 5 ? 1 : null'
  );
  rules.defineRule('skills.Knowledge (Spirits)',
    'skillNotes.knowledge(Nature)Synergy2', '+', '2'
  );
};

/*
 * Sets the character's #attribute# attribute to a random value.  #rules# is
 * the RuleEngine used to produce computed values; the function sometimes needs
 * to apply the rules to determine valid values for some attributes.
 */
MN2E.randomize = function(rules, attributes, attribute) {
  if(attribute == 'heroicPath') {
    attributes[attribute] = ScribeUtils.randomKey(Scribe.heroicPaths);
  }
}

/* Convenience functions that invoke ScribeRules methods on the MN2E rules. */
MN2E.defineChoice = function() {
  return ScribeRules.prototype.defineChoice.apply(MN2E.rules, arguments);
};

MN2E.defineClass = function() {
  return ScribeRules.prototype.defineClass.apply(MN2E.rules, arguments);
};

MN2E.defineEditorElement = function() {
  return ScribeRules.prototype.defineEditorElement.apply(MN2E.rules, arguments);
};

MN2E.defineNote = function() {
  return ScribeRules.prototype.defineNote.apply(MN2E.rules, arguments);
};

MN2E.defineRace = function() {
  return ScribeRules.prototype.defineRace.apply(MN2E.rules, arguments);
};

MN2E.defineRandomizer = function() {
  return ScribeRules.prototype.defineRandomizer.apply(MN2E.rules, arguments);
};

MN2E.defineRule = function() {
  return ScribeRules.prototype.defineRule.apply(MN2E.rules, arguments);
};

MN2E.defineSheetElement = function() {
  return ScribeRules.prototype.defineSheetElement.apply(MN2E.rules, arguments);
};

MN2E.defineTest = function() {
  return ScribeRules.prototype.defineTest.apply(MN2E.rules, arguments);
};

MN2E.getChoices = function() {
  return ScribeRules.prototype.getChoices.apply(MN2E.rules, arguments);
};

MN2E.getTests = function() {
  return ScribeRules.prototype.getTests.apply(MN2E.rules, arguments);
};

MN2E.isSource = function() {
  return ScribeRules.prototype.isSource.apply(MN2E.rules, arguments);
};
