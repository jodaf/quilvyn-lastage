/* $Id: LastAge.js,v 1.104 2008/04/04 05:33:20 Jim Exp $ */

/*
Copyright 2008, James J. Hayes

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
 * This module loads the rules from the Second Edition core rule book.
 * The LastAge function contains methods that load rules for particular
 * parts/chapters of the rule book; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the LastAge rules.  Similarly, the constant fields of
 * LastAge (FEATS, HEROIC_PATHS, etc.) can be manipulated to modify the choices.
 */
function LastAge() {

  if(window.SRD35 == null) {
    alert('The LastAge module requires use of the SRD35 module');
    return;
  }

  // Define a new rule set w/the same editor and standard viewer as SRD35
  var rules = new ScribeRules('Last Age');
  rules.editorElements = SRD35.initialEditorElements();
  SRD35.createViewers(rules, SRD35.VIEWERS);
  // Remove some editor and character sheet elements that don't apply
  rules.defineEditorElement('deity');
  rules.defineEditorElement('specialize');
  rules.defineEditorElement('prohibit');
  rules.defineSheetElement('Deity');
  // Pick up applicable SRD35 rules
  SRD35.abilityRules(rules);
  // LastAge doesn't use the SRD35 languages or races, but we call
  // SRD35.raceRules to pick up any other rules it defines (e.g., languageCount)
  SRD35.raceRules(rules, [], []);
  // Fighter in LastAge is sufficiently changed from the SRD to be considered a
  // different class
  SRD35.classRules(rules, ['Barbarian', 'Rogue']);
  SRD35.companionRules(rules, ['Familiar']);
  SRD35.skillRules(rules, SRD35.SKILLS, SRD35.SUBSKILLS);
  SRD35.featRules(rules, SRD35.FEATS, SRD35.SUBFEATS);
  SRD35.descriptionRules
    (rules, SRD35.ALIGNMENTS, LastAge.DEITIES, SRD35.GENDERS);
  SRD35.equipmentRules
    (rules, SRD35.ARMORS, SRD35.GOODIES, SRD35.SHIELDS, SRD35.WEAPONS);
  SRD35.combatRules(rules);
  SRD35.movementRules(rules);
  SRD35.magicRules(rules, [], LastAge.DOMAINS, LastAge.SCHOOLS);
  // Pick up the NPC rules, if available
  if(window.SRD35NPC != null) {
    SRD35NPC.classRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.companionRules(rules, SRD35NPC.COMPANIONS);
  }
  // Add LastAge-specific rules
  LastAge.raceRules(rules, LastAge.LANGUAGES, LastAge.RACES);
  LastAge.heroicPathRules(rules, LastAge.HEROIC_PATHS);
  LastAge.classRules(rules, LastAge.CLASSES);
  LastAge.companionRules(rules, LastAge.COMPANIONS);
  LastAge.skillRules(rules, LastAge.SKILLS, LastAge.SUBSKILLS);
  LastAge.featRules(rules, LastAge.FEATS, LastAge.SUBFEATS);
  LastAge.equipmentRules(rules, LastAge.WEAPONS);
  LastAge.magicRules(rules, LastAge.CLASSES);
  // Slight mods to SRD35 creation procedures
  rules.defineChoice('preset', 'race', 'heroicPath', 'level', 'levels');
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  delete rules.getChoices('random').deity;
  rules.randomizeOneAttribute = LastAge.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  rules.ruleNotes = LastAge.ruleNotes;
  // Let Scribe know we're here
  Scribe.addRuleSet(rules);
  LastAge.rules = rules;

}

// Arrays of choices passed to Scribe.
LastAge.CLASSES = [
  'Barbarian', 'Charismatic Channeler', 'Defender', 'Fighter',
  'Hermetic Channeler', 'Legate', 'Rogue', 'Spiritual Channeler', 'Wildlander'
];
LastAge.COMPANIONS = ['Animal Companion', 'Astirax'];
LastAge.DOMAINS = [
  'Death', 'Destruction', 'Evil', 'Magic', 'War'
];
LastAge.DEITIES =
  ['The Dark God (NE):Death/Destruction/Evil/Magic/War', 'None:'];
LastAge.FEATS = [
  'Craft Charm:Item Creation', 'Craft Greater Spell Talisman:Item Creation',
  'Craft Spell Talisman:Item Creation', 'Devastating Mounted Assault:Fighter',
  'Drive It Deep:Fighter', 'Extra Gift:', 'Friendly Agent:',
  'Giant Fighter:Fighter', 'Herbalist:Item Creation',
  'Improvised Weapon:Fighter', 'Innate Magic:', 'Inconspicuous:',
  'Knife Thrower:Fighter', 'Lucky:', 'Magecraft:', 'Magic Hardened:',
  'Natural Healer:', 'Orc Slayer:Fighter', 'Quickened Donning:Fighter',
  'Ritual Magic:', 'Sarcosan Pureblood:', 'Sense Nexus:',
  'Spellcasting:Spellcasting', 'Skill Focus:', 'Spell Knowledge:',
  'Thick Skull:', 'Warrior Of Shadow:', 'Weapon Focus:Fighter',
  'Whispering Awareness:'
];
LastAge.HEROIC_PATHS = [
  'Beast', 'Chanceborn', 'Charismatic', 'Dragonblooded', 'Earthbonded',
  'Faithful', 'Fellhunter', 'Feyblooded', 'Giantblooded', 'Guardian', 'Healer',
  'Ironborn', 'Jack-Of-All-Trades', 'Mountainborn', 'Naturefriend',
  'Northblooded', 'Painless', 'Pureblood', 'Quickened', 'Seaborn', 'Seer',
  'Speaker', 'Spellsoul', 'Shadow Walker', 'Steelblooded', 'Sunderborn',
  'Tactician', 'Warg', 'None'
];
LastAge.LANGUAGES = [
  'Black Tongue', 'Clan Dwarven', 'Colonial', 'Courtier', 'Erenlander',
  'Halfling', 'High Elven', 'Jungle Mouth', 'Norther', 'Old Dwarven', 'Orcish',
  'Patrol Sign', 'Sylvan', 'Trader\'s Tongue'
];
LastAge.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Clan Raised Dwarrow', 'Clan Raised Dworg',
  'Danisil Raised Elfling', 'Dorn', 'Erenlander', 'Gnome',
  'Gnome Raised Dwarrow', 'Halfling Raised Elfling', 'Jungle Elf',
  'Kurgun Dwarf', 'Kurgun Raised Dwarrow', 'Kurgun Raised Dworg',
  'Nomadic Halfling', 'Orc', 'Plains Sarcosan', 'Sea Elf', 'Snow Elf',
  'Urban Sarcosan', 'Wood Elf'
];
LastAge.SCHOOLS = [
  'Abjuration:Abju', 'Conjuration:Conj', 'Divination:Divi', 'Enchantment:Ench',
  'Evocation:Evoc', 'Greater Conjuration:GrCo', 'Greater Evocation:GrEv',
  'Illusion:Illu', 'Necromancy:Necr', 'Transmutation:Tran'
];
LastAge.SKILLS = [
  'Knowledge:int/trained', 'Profession:wis/trained'
];
LastAge.SUBFEATS = {
  'Magecraft':'Charismatic/Hermetic/Spiritual',
  // Skill Focus (Profession (Soldier)) available to Leader Of Men Fighters
  'Skill Focus':'Profession (Soldier)',
  'Spellcasting':LastAge.SCHOOLS.join('/').replace(/:[^\/]+/g, ''),
  // Legates w/War domain receive Weapon Focus (Longsword)
  'Weapon Focus':'Longsword'
};
LastAge.SUBSKILLS = {
  'Knowledge':'Old Gods/Shadow/Spirits',
  // Profession (Soldier) available to Leader Of Men Fighters
  'Profession':'Soldier'
};
LastAge.WEAPONS = [
  'Atharak:d6', 'Cedeku:d6@19', 'Crafted Vardatch:d10@19',
  'Dornish Horse Spear:d10x3', 'Farmer\'s Rope:d2', 'Fighting Knife:d6@19x3',
  'Great Sling:d6r60', 'Greater Vardatch:2d8', 'Halfling Lance:d8x3',
  'Icewood Longbow:d8x3r120', 'Inutek:d3r20', 'Sarcosan Lance:d8x3',
  'Sepi:d6@18', 'Shard Arrow:d6@16x1', 'Staghorn:d6', 'Tack Whip:d4',
  'Urutuk Hatchet:d8x3r20', 'Vardatch:d12'
];

// Related information used internally by LastAge
LastAge.spellsSchools = {
  // New spells
  'Charm Repair':'Transmutation', 'Detect Astirax':'Divination',
  'Disguise Ally':'Illusion', 'Disguise Weapon':'Illusion',
  'Far Whisper':'Divination', 'Greenshield':'Illusion',
  'Halfling Burrow':'Transmutation', 'Lifetrap':'Transmutation',
  'Nature\'s Revelation':'Transmutation', 'Nexus Fuel':'Necromancy',
  'Silver Blood':'Transmutation', 'Silver Storm':'Transmutation',
  'Silver Wind':'Conjuration', 'Stone Soup':'Transmutation',
  // SRD spells placed in Greater Conjuration/Evocation
  'Burning Hands':'Greater Evocation', 'Call Lightning':'Greater Evocation',
  'Call Lightning Storm':'Greater Evocation',
  'Chain Lightning':'Greater Evocation', 'Clenched Fist':'Greater Evocation',
  'Cone Of Cold':'Greater Evocation', 'Creeping Doom':'Greater Conjuration',
  'Crushing Hand':'Greater Evocation',
  'Delayed Blast Fireball':'Greater Evocation',
  'Earthquake':'Greater Evocation', 'Elemental Swarm':'Greater Conjuration',
  'Fire Shield':'Greater Evocation', 'Fire Storm':'Greater Evocation',
  'Fireball':'Greater Evocation', 'Flame Blade':'Greater Evocation',
  'Flame Strike':'Greater Evocation', 'Flaming Sphere':'Greater Evocation',
  'Floating Disk':'Greater Evocation', 'Forcecage':'Greater Evocation',
  'Forceful Hand':'Greater Evocation', 'Freezing Sphere':'Greater Evocation',
  'Gate':'Greater Conjuration', 'Grasping Hand':'Greater Evocation',
  'Greater Planar Binding':'Greater Conjuration',
  'Gust Of Wind':'Greater Evocation', 'Hallow':'Greater Evocation',
  'Ice Storm':'Greater Evocation', 'Insect Plague':'Greater Conjuration',
  'Interposing Hand':'Greater Evocation',
  'Lesser Planar Binding':'Greater Conjuration',
  'Lightning Bolt':'Greater Evocation', 'Mage\'s Sword':'Greater Evocation',
  'Magic Missile':'Greater Evocation', 'Meteor Swarm':'Greater Evocation',
  'Mount':'Greater Conjuration', 'Planar Binding':'Greater Conjuration',
  'Polar Ray':'Greater Evocation', 'Produce Flame':'Greater Evocation',
  'Resilient Sphere':'Greater Evocation', 'Scorching Ray':'Greater Evocation',
  'Secret Chest':'Greater Conjuration', 'Shocking Grasp':'Greater Evocation',
  'Storm Of Vengeance':'Greater Conjuration',
  'Summon Instrument':'Greater Conjuration',
  'Summon Monster I':'Greater Conjuration',
  'Summon Monster II':'Greater Conjuration',
  'Summon Monster III':'Greater Conjuration',
  'Summon Monster IV':'Greater Conjuration',
  'Summon Monster IX':'Greater Conjuration',
  'Summon Monster V':'Greater Conjuration',
  'Summon Monster VI':'Greater Conjuration',
  'Summon Monster VII':'Greater Conjuration',
  'Summon Monster VIII':'Greater Conjuration',
  'Summon Nature\'s Ally I':'Greater Conjuration',
  'Summon Nature\'s Ally II':'Greater Conjuration',
  'Summon Nature\'s Ally III':'Greater Conjuration',
  'Summon Nature\'s Ally IV':'Greater Conjuration',
  'Summon Nature\'s Ally IX':'Greater Conjuration',
  'Summon Nature\'s Ally V':'Greater Conjuration',
  'Summon Nature\'s Ally VI':'Greater Conjuration',
  'Summon Nature\'s Ally VII':'Greater Conjuration',
  'Summon Nature\'s Ally VIII':'Greater Conjuration',
  'Summon Swarm':'Greater Conjuration',
  'Telekinetic Sphere':'Greater Evocation', 'Tiny Hut':'Greater Evocation',
  'Trap The Soul':'Greater Conjuration', 'Unhallow':'Greater Evocation',
  'Wall Of Fire':'Greater Evocation', 'Wall Of Force':'Greater Evocation',
  'Wall Of Ice':'Greater Evocation', 'Whirlwind':'Greater Evocation',
  'Wind Wall':'Greater Evocation',
  // Other SRD spells w/different school
  'Ray Of Frost':'Conjuration', 'Zone Of Silence':'Enchantment',
  // On the Channeler spell list--dunno where they came from
  'Assist':'Enchantment', 'Bestow Spell':'Evocation', 'Burial':'Transmutation',
  'Channel Might':'Evocation', 'Confer Power':'Transmutation', 
  'Lie':'Transmutation', 'Magic Circle Against Shadow':'Abjuration',
  'Phantom Edge':'Transmutation', 'Scryer\'s Mark':'Divination'
};
LastAge.racesFavoredRegions = {
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
LastAge.racesLanguages = {
  "Agrarian Halfling":
    "Colonial:3/Halfling:3/" +
    "Black Tongue:0/Courtier:0/Erenlander:0/Jungle Mouth:0/Orcish:0/" +
    "Trader's Tongue:0",
  "Clan Dwarf":
    "Clan Dwarven:3/Old Dwarven:3/" +
    "Clan Dwarven:0/Orcish:0",
  "Clan Raised Dwarrow":
    "Clan Dwarven:3/Old Dwarven:3/Trader's Tongue:1/" +
    "Clan Dwarven:0/Orcish:0",
  "Clan Raised Dworg":
    "Clan Dwarven:3/Old Dwarven:1/Orcish:1/" +
    "Clan Dwarven:0/Trader's Tongue:0",
  "Danisil Raised Elfling":
    "Halfling:1/High Elven:3/Jungle Mouth:3/" +
    "Colonial:0/Erenlander:0/Orcish:0/Trader's Tongue:0",
  "Dorn":
    "Erenlander:3/Norther:3/" +
    "Colonial:0/High Elven:0/Orcish:0/Trader's Tongue:0",
  "Erenlander":
    "Erenlander:3/" +
    "Any:0",
  "Gnome":
    "Trader's Tongue:3/Any:2/Any:1" +
    "Any:0",
  "Gnome Raised Dwarrow":
    "Clan Dwarven:2/Old Dwarven:1/Trader's Tongue:1/Any:1/Any:1/" +
    "Any:0",
  "Halfling Raised Elfling":
    "Erenlander:3/Halfling:3/Jungle Mouth:1/" +
    "Colonial:0/Orcish:0/Trader's Tongue:0",
  "Jungle Elf":
    "Jungle Mouth:3/" +
    "Colonial:0/Erenlander:0/Halfling:0/High Elven:0/Sylvan:0/" +
    "Trader's Tongue:0",
  "Kurgun Dwarf":
    "Clan Dwarven:3/Old Dwarven:3/" +
    "Clan Dwarven:0/Orcish:0/Trader's Tongue:0",
  "Kurgun Raised Dwarrow":
    "Clan Dwarven:3/Old Dwarven:3/Trader's Tongue:1/" +
    "Clan Dwarven:0/Orcish:0",
  "Kurgun Raised Dworg":
    "Clan Dwarven:3/Old Dwarven:1/Orcish:1/" +
    "Clan Dwarven:0/Trader's Tongue:0",
  "Nomadic Halfling":
    "Colonial:3/Halfling:3/" +
    "Black Tongue:0/Courtier:0/Erenlander:0/Jungle Mouth:0/Orcish:0/" +
    "Trader's Tongue:0",
  "Orc":
    "Black Tongue:1/Old Dwarven:1/High Elven:1/Orcish:3/" +
    "Any:0",
  "Plains Sarcosan":
    "Colonial:3/Erenlander:3/" +
    "Courtier:0/Halfling:0/Norther:0/Orcish:0/Trader's Tongue:0",
  "Sea Elf":
    "High Elven:3/Jungle Mouth:3/" +
    "Halfling:0/Sylvan:0/Trader's Tongue:0",
  "Snow Elf":
    "High Elven:3/Orcish:1/Patrol Sign:1/" +
    "Black Tongue:0/Erenlander:0/Norther:0/Sylvan:0/Trader's Tongue:0",
  "Urban Sarcosan":
    "Colonial:3/Erenlander:3/" +
    "Courtier:0/Halfling:0/Norther:0/Orcish:0/Trader's Tongue:0",
  "Wood Elf":
    "High Elven:3/" +
    "Colonial:0/Erenlander:0/Halfling:0/Jungle Mouth:0/Old Dwarven:0/" +
    "Orcish:0/Sylvan:0/Trader's Tongue:0"
};

/* Defines the rules related to core classes. */
LastAge.classRules = function(rules, classes) {

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Barbarian') {

      rules.defineRule
        ('classSkills.Speak Language', 'levels.Barbarian', '=', '1');
      continue; // Not defining a new class

    } else if(klass.indexOf(' Channeler') >= 0) {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = ['1:Art Of Magic', '2:Summon Familiar'];
      hitDie = 6;
      notes = [
        'featureNotes.summonFamiliarFeature:Special bond/abilities',
        'magicNotes.artOfMagicFeature:+1 character level for max spell level'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Concentration', 'Craft', 'Decipher Script', 'Handle Animal', 'Heal',
        'Knowledge (Arcana)', 'Knowledge (Spirits)', 'Profession', 'Ride',
        'Search', 'Speak Language', 'Spellcraft'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('familiarLevel',
        'channelerLevels', '+=', 'source >= 2 ? Math.floor(source / 2) : null'
      );
      rules.defineRule('familiarMasterLevel', 'channelerLevels', '+=', null);
      rules.defineRule('featCount.' + klass,
        'levels.' + klass, '=',
        'source >= 4 ? Math.floor((source - 1) / 3) : null'
      );
      rules.defineRule('featCount.Spellcasting',
        'channelerLevels', '+=',
        'source >= 2 ? Math.floor((source + 1) / 3) : null'
      );
      rules.defineRule
        ('magicNotes.channelerSpellEnergy', 'channelerLevels', '=', null);
      rules.defineRule('magicNotes.channelerSpellsKnown',
        'channelerLevels', '=', '(source - 1) * 2'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.channelerSpellEnergy', '+', null);
      rules.defineRule
        ('spellsKnownBonus', 'magicNotes.channelerSpellsKnown', '+', null);

      if(klass == 'Charismatic Channeler') {
        feats = ['Extra Gift', 'Spell Knowledge'];
        for(var j = 0; j < LastAge.SCHOOLS.length; j++) {
          var school = LastAge.SCHOOLS[j].split(':')[0];
          feats[feats.length] = 'Greater Spell Focus (' + school + ')';
          feats[feats.length] = 'Spell Focus (' + school + ')';
        }
        features = features.concat([
          '1:Magecraft (Charismatic)', '3:Force Of Personality'
        ]);
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
            'Additional +1 initiative/attack/damage',
          'magicNotes.inspireConfidenceFeature:' +
            'Allies w/in 60 ft +4 save vs. enchantment/fear for %V rounds',
          'magicNotes.inspireFascinationFeature:' +
            '%V creatures w/in 120 ft make %1 DC Will save or enthralled ' +
            '%2 rounds',
          'magicNotes.inspireFuryFeature:' +
            'Allies w/in 60 ft +1 initiative/attack/damage %V rounds',
          'magicNotes.magecraft(Charismatic)Feature:' +
            '4 spells/%V spell energy points',
          'magicNotes.massSuggestionFeature:' +
            'Make suggestion to %V fascinated creatures',
          'magicNotes.suggestionFeature:Make suggestion to fascinated creature',
          'validationNotes.greaterConfidenceSelectableFeatureFeatures:' +
            'Requires Improved Confidence',
          'validationNotes.greaterFurySelectableFeatureFeatures:' +
            'Requires Improved Fury',
          'validationNotes.improvedConfidenceSelectableFeatureFeatures:' +
            'Requires Inspire Confidence',
          'validationNotes.improvedFurySelectableFeatureFeatures:' +
            'Requires Inspire Fury',
          'validationNotes.massSuggestionSelectableFeatureFeatures:' +
            'Requires Suggestion',
          'validationNotes.suggestionSelectableFeatureFeatures:' +
            'Requires Inspire Fascination'
        ]);
        selectableFeatures = [
          'Greater Confidence', 'Greater Fury', 'Improved Confidence',
          'Improved Fury', 'Inspire Confidence', 'Inspire Fascination',
          'Inspire Fury', 'Mass Suggestion', 'Suggestion'
        ];
        skills = skills.concat([
          'Bluff', 'Diplomacy', 'Gather Information', 'Intimidate',
          'Sense Motive'
        ]);
        spellAbility = 'charisma';
        rules.defineRule
          ('channelerLevels', 'levels.Charismatic Channeler', '+=', null);
        rules.defineRule('magicNotes.forceOfPersonalityFeature',
          'charismaModifier', '=', '3 + source'
        );
        rules.defineRule('magicNotes.inspireConfidenceFeature',
          'levels.Charismatic Channeler', '=', null
        );
        rules.defineRule('magicNotes.inspireFascinationFeature',
          'levels.Charismatic Channeler', '=', null
        );
        rules.defineRule('magicNotes.inspireFascinationFeature.1',
          'levels.Charismatic Channeler', '=', '10 + Math.floor(source / 2)',
          'charismaModifier', '+', null
        );
        rules.defineRule('magicNotes.inspireFascinationFeature.2',
          'levels.Charismatic Channeler', '=', null
        );
        rules.defineRule('magicNotes.inspireFuryFeature',
          'levels.Charismatic Channeler', '=', 'source + 5'
        );
        rules.defineRule('magicNotes.magecraft(Charismatic)Feature',
          'charismaModifier', '=', null
        );
        rules.defineRule('magicNotes.massSuggestionFeature',
          'levels.Charismatic Channeler', '=', 'Math.floor(source / 3)'
        );
        rules.defineRule('selectableFeatureCount.Charismatic Channeler',
          'levels.Charismatic Channeler', '=',
          'source < 3 ? null : Math.floor(source / 3)'
        );
        rules.defineRule('spellEnergy',
          'magicNotes.magecraft(Charismatic)Feature', '+=', null
        );
        rules.defineRule('spellsKnown.B0',
          'magicNotes.magecraft(Charismatic)Feature', '+=', '3'
        );
        rules.defineRule('spellsKnown.B1',
          'magicNotes.magecraft(Charismatic)Feature', '+=', '1'
        );
      } else if(klass == 'Hermetic Channeler') {
        feats = ['Spell Knowledge'];
        var allFeats = SRD35.FEATS.concat(LastAge.FEATS);
        for(var j = 0; j < allFeats.length; j++) {
          var pieces = allFeats[j].split(':');
          if(pieces[1].match(/Item Creation|Metamagic/)) {
            feats[feats.length] = pieces[0];
          }
        }
        features = features.concat(['1:Magecraft (Hermetic)', '3:Lorebook']);
        notes = notes.concat([
          'magicNotes.magecraft(Hermetic)Feature:' +
            '4 spells/%V spell energy points',
          'skillNotes.foeSpecialtyFeature:' +
            'Each day choose a creature type to take 10 on Knowledge checks',
          'skillNotes.knowledgeSpecialtyFeature:' +
            'Each day Choose a Knowledge Skill Focus',
          'skillNotes.lorebookFeature:' +
            'Study 1 minute for knowledge of situation; scan at -10',
          'skillNotes.quickReferenceFeature:Reduce Lorebook scan penalty by %V',
          'skillNotes.spellSpecialtyFeature:Each day choose a spell for +1 DC'
        ]);
        selectableFeatures = [
          'Foe Specialty', 'Knowledge Specialty', 'Quick Reference',
          'Spell Specialty'
        ];
        skills = skills.concat(['Knowledge']);
        spellAbility = 'intelligence';
        rules.defineRule
          ('channelerLevels', 'levels.Hermetic Channeler', '+=', null);
        rules.defineRule('magicNotes.magecraft(Hermetic)Feature',
          'intelligenceModifier', '=', null
        );
        rules.defineRule('selectableFeatureCount.Hermetic Channeler',
          'levels.Hermetic Channeler', '=',
          'source < 3 ? null : Math.floor(source / 3)'
        );
        rules.defineRule('skillNotes.quickReferenceFeature',
          'selectableFeatures.Quick Reference', '=', '5 * source'
        );
        rules.defineRule('spellEnergy',
          'magicNotes.magecraft(Charismatic)Feature', '+=', null
        );
        rules.defineRule('spellsKnown.W0',
          'magicNotes.magecraft(Hermetic)Feature', '+=', '3'
        );
        rules.defineRule('spellsKnown.W1',
          'magicNotes.magecraft(Hermetic)Feature', '+=', '1'
        );
      } else if(klass == 'Spiritual Channeler') {
        feats = ['Extra Gift', 'Spell Knowledge'];
        var allFeats = SRD35.FEATS.concat(LastAge.FEATS);
        for(var j = 0; j < allFeats.length; j++) {
          var pieces = allFeats[j].split(':');
          if(pieces[1].indexOf('Item Creation') >= 0) {
            feats[feats.length] = pieces[0];
          }
        }
        features = features.concat([
          '1:Magecraft (Spiritual)', '3:Master Of Two Worlds'
        ]);
        notes = notes.concat([
          'combatNotes.confidentEffectFeature:+4 Master of Two Worlds checks',
          'combatNotes.heightenedEffectFeature:' +
            '+2 level for Master of Two Worlds checks',
          'combatNotes.masteryOfNatureFeature:Turn animals/plants',
          'combatNotes.masteryOfSpiritsFeature:Turn to exorcise spirits',
          'combatNotes.masteryOfTheUnnaturalFeature:' +
            'Turn constructs/outsiders (double hit die)',
          'combatNotes.masterOfTwoWorldsFeature:' +
            'Mastery of Nature/Spirits/The Unnatural %V/day',
          'combatNotes.powerfulEffectFeature:+1d6 mastery damage',
          'combatNotes.preciseEffectFeature:Choose type of creature to affect',
          'combatNotes.specificEffectFeature:Choose individuals to affect',
          'combatNotes.universalEffectFeature:' +
            'Use multiple mastery powers simultaneously',
          'magicNotes.magecraft(Spiritual)Feature:' +
            '4 spells/%V spell energy points',
          'validationNotes.confidentEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural',
          'validationNotes.heightenedEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural',
          'validationNotes.powerfulEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural',
          'validationNotes.preciseEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural',
          'validationNotes.specificEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural',
          'validationNotes.universalEffectSelectableFeatureFeatures:' +
            'Requires Mastery Of Nature||Mastery Of Spirits||' +
            'Mastery Of The Unnatural'
        ]);
        selectableFeatures = [
          'Confident Effect', 'Heightened Effect', 'Mastery Of Nature',
          'Mastery Of Spirits', 'Mastery Of The Unnatural', 'Powerful Effect',
          'Precise Effect', 'Specific Effect', 'Universal Effect'
        ];
        skills = skills.concat([
          'Diplomacy', 'Knowledge (Nature)', 'Sense Motive', 'Survival', 'Swim'
        ]);
        spellAbility = 'wisdom';
        rules.defineRule
          ('channelerLevels', 'levels.Spiritual Channeler', '+=', null);
        rules.defineRule('combatNotes.masterOfTwoWorldsFeature',
          'levels.Spiritual Channeler', '?', 'source >= 3',
          'wisdomModifier', '=', '3 + source'
        );
        rules.defineRule('magicNotes.magecraft(Spiritual)Feature',
          'wisdomModifier', '=', null
        );
        rules.defineRule('selectableFeatureCount.Spiritual Channeler',
          'levels.Spiritual Channeler', '=',
          'source < 3 ? null : Math.floor(source / 3)'
        );
        rules.defineRule('spellEnergy',
          'magicNotes.magecraft(Charismatic)Feature', '+=', null
        );
        rules.defineRule('spellsKnown.D0',
          'magicNotes.magecraft(Spiritual)Feature', '+=', '3'
        );
        rules.defineRule('spellsKnown.D1',
          'magicNotes.magecraft(Spiritual)Feature', '+=', '1'
        );
        var turningTargets = {
          'Nature':'Nature', 'Spirits':'Spirit', 'The Unnatural':'Unnatural'
        };
        for(var a in turningTargets) {
          var prefix = 'turn' + turningTargets[a];
          rules.defineRule(prefix + '.level',
            'features.Mastery Of ' + a, '?', null,
            'levels.Spiritual Channeler', '+=', null
          );
          rules.defineRule(prefix + '.damageModifier',
            prefix + '.level', '=', null,
            'wisdomModifier', '+', null
          );
          rules.defineRule(prefix + '.frequency',
            prefix + '.level', '=', '3',
            'wisdomModifier', '+', null
          );
          rules.defineRule(prefix + '.maxHitDice',
            prefix + '.level', '=', 'source * 3 - 10',
            'wisdomModifier', '+', null
          );
          rules.defineNote([
            prefix + '.damageModifier:2d6 + %V',
            prefix + '.frequency:%V/day',
            prefix + '.maxHitDice:(d20 + %V) / 3'
          ]);
          rules.defineSheetElement
            ('Turn ' + turningTargets[a], 'Turn Undead', null, ' * ');
        }
      }

    } else if(klass == 'Defender') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Improved Unarmed Strike', '1:Masterful Strike',
        '2:Defender Abilities', '2:Defender Stunning Fist',
        '3:Improved Grapple', '4:Precise Strike'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.incredibleSpeedFeature:+%V speed',
        'combatNotes.counterattackFeature:AOO on foe miss 1/round',
        'combatNotes.coverAllyFeature:Take hit for ally w/in 5 ft 1/round',
        'combatNotes.defenderAbilitiesFeature:' +
          'Counterattack/Cover Ally/Defender Stunning Fist/Devastating ' +
          'Strike/Rapid Strike/Retaliatory Strike/Strike And Hold/Weapon ' +
          'Trap %V/day',
        'combatNotes.defenderStunningFistFeature:' +
          'Foe %V Fortitude save or stunned',
        'combatNotes.devastatingStrikeFeature:' +
          'Bull Rush stunned opponent as free action w/out foe AOO',
        'combatNotes.dodgeTrainingFeature:+%V AC',
        'combatNotes.flurryAttackFeature:' +
          'Two-weapon off hand penalty reduced by %V',
        'combatNotes.furiousGrappleFeature:' +
          'Extra grapple attack at highest attack bonus 1/round',
        'combatNotes.grapplingTrainingFeature:' +
          'Disarm/sunder/trip attacks use grapple check',
        'combatNotes.improvedGrappleFeature:Grapple w/out foe AOO; +4 grapple',
        'combatNotes.improvedUnarmedStrikeFeature:Unarmed attack w/out foe AOO',
        'combatNotes.incredibleResilienceFeature:+%V HP',
        'combatNotes.masterfulStrikeFeature:%V unarmed damage',
        'combatNotes.offensiveTrainingFeature:' +
           'Stunned foe %V DC save to avoid blinding/deafening',
        'combatNotes.oneWithTheWeaponFeature:' +
          'Masterful Strike/Precise Strike/Stunning Fist w/chosen weapon',
        'combatNotes.preciseStrikeFeature:' +
          'Overcome %V points of foe damage reduction',
        'combatNotes.rapidStrikeFeature:' +
          'Extra attack at highest attack bonus 1/round',
        'combatNotes.retaliatoryStrikeFeature:' +
          'AOO vs. foe that strikes ally 1/round',
        'combatNotes.speedTrainingFeature:Extra move action each round',
        'combatNotes.strikeAndHoldFeature:Extra unarmed attack to grab foe',
        'combatNotes.weaponTrapFeature:' +
          'Attack to catch foe\'s weapon for disarm/damage/AOO 1/round',
        'saveNotes.defensiveMasteryFeature:+%V all saves',
        'validationNotes.counterattackSelectableFeatureFeatures:' +
          'Requires Dodge Training/Offensive Training',
        'validationNotes.coverAllySelectableFeatureFeatures:' +
          'Requires Dodge Training',
        'validationNotes.devastatingStrikeSelectableFeatureFeatures:' +
          'Requires Grappling Training/Offensive Training',
        'validationNotes.furiousGrappleSelectableFeatureFeatures:' +
          'Requires Grappling Training/Speed Training',
        'validationNotes.oneWithTheWeaponSelectableFeatureFeatures:' +
          'Requires Offensive Training',
        'validationNotes.rapidStrikeSelectableFeatureFeatures:' +
          'Requires Speed Training',
        'validationNotes.retaliatoryStrikeSelectableFeatureFeatures:' +
          'Requires Dodge Training/Speed Training',
        'validationNotes.strikeAndHoldSelectableFeatureFeatures:' +
          'Requires Grappling Training',
        'validationNotes.weaponTrapSelectableFeatureFeatures:' +
          'Requires Dodge Training/Grappling Training'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
       'Counterattack', 'Cover Ally', 'Defensive Mastery', 'Devastating Strike',
       'Dodge Training', 'Flurry Attack', 'Furious Grapple',
       'Grappling Training', 'Incredible Resilience', 'Incredible Speed',
       'Offensive Training', 'One With The Weapon', 'Rapid Strike',
       'Retaliatory Strike', 'Speed Training', 'Strike And Hold', 'Weapon Trap'
      ];
      skillPoints = 4;
      skills = [
        'Balance', 'Bluff', 'Climb', 'Craft', 'Escape Artist', 'Handle Animal',
        'Hide', 'Jump', 'Knowledge (Local)', 'Knowledge (Shadow)', 'Listen',
        'Move Silently', 'Profession', 'Ride', 'Sense Motive',
        'Speak Language', 'Swim', 'Tumble'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('abilityNotes.incredibleSpeedFeature',
        'selectableFeatures.Incredible Speed', '=', '10 * source'
      );
      rules.defineRule('armorClass',
        'combatNotes.defenderArmorClassAdjustment', '+', null,
        'combatNotes.dodgeTrainingFeature', '+', null
      );
      rules.defineRule('combatNotes.defenderAbilitiesFeature',
        'levels.Defender', '=', '3 + source * 3 / 4',
        'level', '+', 'source / 4'
      );
      rules.defineRule('combatNotes.defenderArmorClassAdjustment',
        'levels.Defender', '=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('combatNotes.defenderStunningFistFeature',
        'levels.Defender', '=', '10 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      rules.defineRule('combatNotes.dodgeTrainingFeature',
        'selectableFeatures.Dodge Training', '=', null
      );
      rules.defineRule('combatNotes.flurryAttackFeature',
        'selectableFeatures.Flurry Attack', '=', null
      );
      rules.defineRule('combatNotes.incredibleResilienceFeature',
        'selectableFeatures.Incredible Resilience', '=', '3 * source'
      );
      rules.defineRule('combatNotes.masterfulStrikeFeature',
        'defenderUnarmedDamageLarge', '=', null,
        'defenderUnarmedDamageMedium', '=', null,
        'defenderUnarmedDamageSmall', '=', null
      );
      rules.defineRule('combatNotes.offensiveTrainingFeature',
        'levels.Defender', '=', '14 + Math.floor(source / 2)',
        'strengthModifier', '+', null
      );
      rules.defineRule('combatNotes.preciseStrikeFeature',
        'levels.Defender', '=', '3 * Math.floor((source + 2) / 6)'
      );
      rules.defineRule('defenderUnarmedDamageLarge',
        'features.Large', '?', null,
        'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "8")'
      );
      rules.defineRule('defenderUnarmedDamageMedium',
        'levels.Defender', '=',
        '"1d6" + (source < 7 ? "" : ("+" + Math.floor((source-1) / 6) + "d6"))'
      );
      rules.defineRule('defenderUnarmedDamageSmall',
        'features.Small', '?', null,
        'defenderUnarmedDamageMedium', '=', 'source.replace(/6/, "4")'
      );
      rules.defineRule
        ('hitPoints', 'combatNotes.incredibleResilienceFeature', '+', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.defensiveMasteryFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.defensiveMasteryFeature', '+', null);
      rules.defineRule
        ('save.Will', 'saveNotes.defensiveMasteryFeature', '+', null);
      rules.defineRule('saveNotes.defensiveMasteryFeature',
        'selectableFeatures.Defensive Mastery', '=', null
      );
      rules.defineRule('selectableFeatureCount.Defender',
        'levels.Defender', '=',
        'source < 2 ? null : (Math.floor((source + 1) / 3) + ' +
                             '(source < 6 ? 0 : Math.floor((source - 3) / 3)))'
      );
      rules.defineRule
        ('speed', 'abilityNotes.incredibleSpeedFeature', '+', null);
      rules.defineRule('weaponDamage.Unarmed',
        'combatNotes.masterfulStrikeFeature', '=', null
      );

    } else if(klass == 'Fighter') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = null;
      hitDie = 10;
      notes = ['skillNotes.adapterFeature:+%V skill points'];
      profArmor = SRD35.PROFICIENCY_HEAVY;
      profShield = SRD35.PROFICIENCY_TOWER;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Adapter', 'Improviser', 'Leader Of Men', 'Survivor'
      ];
      skillPoints = 2;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Intimidate', 'Jump',
        'Knowledge (Shadow)', 'Profession', 'Ride', 'Speak Language', 'Swim'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineChoice('feats',
        'Improved Grapple:Improviser', 'Improved Unarmed Strike:Improviser',
        'Improvised Weapon:Improviser', 'Stunning Fist:Improviser',
        'Iron Will:Leader Of Men', 'Leadership:Leader Of Men',
        'Skill Focus (Diplomacy):Leader Of Men',
        'Skill Focus (Profession (Soldier)):Leader Of Men',
        'Combat Expertise:Survivor', 'Dodge:Survivor', 'Endurance:Survivor'
      );
      rules.defineRule('featCount.Fighter',
        'levels.Fighter', '=', '1 + Math.floor(source / 2)'
      );
      rules.defineRule('featCount.Improviser',
        'features.Improviser', '?', null,
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('featCount.Leader Of Men',
        'features.Leader Of Men', '?', null,
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('featCount.Survivor',
        'features.Survivor', '?', null,
        'levels.Fighter', '=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('selectableFeatureCount.Fighter',
       'levels.Fighter', '=', 'source >= 4 ? 1 : null'
      );
      // TODO adapter may alternately make a cross-class skill a class one
      rules.defineRule('skillNotes.adapterFeature',
        'levels.Fighter', '=',
        'source < 4 ? null : ' +
        '(source - 3 + (source >= 10 ? source - 9 : 0) + ' +
        '(source >= 16 ? source - 15 : 0))'
      );
      rules.defineRule('skillPoints', 'skillNotes.adapterFeature', '+', null);

    } else if(klass == 'Legate') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Spontaneous Legate Spell', '1:Temple Dependency', '1:Turn Undead',
        '3:Astirax Companion'
      ];
      hitDie = 8;
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures',
        'featureNotes.astiraxCompanionFeature:Special bond/abilities',
        'magicNotes.spontaneousLegateSpellFeature:Inflict',
        'magicNotes.templeDependencyFeature:' +
          'Must participate at temple to receive spells'
      ];
      profArmor = SRD35.PROFICIENCY_HEAVY;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        'Concentration', 'Craft', 'Diplomacy', 'Handle Animal', 'Heal',
        'Intimidate', 'Knowledge (Arcana)', 'Knowledge (Shadow)',
        'Knowledge (Spirits)', 'Profession', 'Speak Language', 'Spellcraft'
      ];
      spellAbility = 'wisdom';
      spellsKnown = [
        'L0:1:"all"', 'L1:1:"all"', 'L2:3:"all"', 'L3:5:"all"',
        'L4:7:"all"', 'L5:9:"all"', 'L6:11:"all"', 'L7:13:"all"',
        'L8:15:"all"', 'L9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
      spellsPerDay = [
        'L0:1:3/2:4/4:5/7:6',
        'L1:1:1/2:2/4:3/7:4/11:5',
        'L2:3:1/4:2/6:3/9:4/13:5',
        'L3:5:1/6:2/8:3/11:4/15:5',
        'L4:7:1/8:2/10:3/13:4/17:5',
        'L5:9:1/10:2/12:3/15:4/19:5',
        'L6:11:1/12:2/14:3/17:4',
        'L7:13:1/14:2/16:3/19:4',
        'L8:15:1/16:2/18:3/20:4',
        'L9:17:1/18:2/19:3/20:4'
      ];
      rules.defineRule('astiraxLevel',
        'levels.Legate', '+=', 'source < 3 ? null : Math.floor(source / 3)'
      );
      rules.defineRule('astiraxMasterLevel', 'levels.Legate', '+=', null);
      rules.defineRule('casterLevelDivine', 'levels.Legate', '+=', null);
      rules.defineRule('domainCount', 'levels.Legate', '+=', '2');
      for(var j = 1; j < 10; j++) {
        rules.defineRule('spellsPerDay.Dom' + j,
          'levels.Legate', '=',
          'source >= ' + (j * 2 - 1) + ' ? 1 : null');
      }
      rules.defineRule('turnUndead.level', 'levels.Legate', '+=', null);

    } else if(klass == 'Rogue') {

      rules.defineRule
        ('classSkills.Knowledge (Shadow)', 'levels.Rogue', '=', '1');
      rules.defineRule
        ('classSkills.Speak Language', 'levels.Rogue', '=', '1');
      continue; // Not defining a new class

    } else if(klass == 'Wildlander') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Track', '3:Danger Sense', '3:Initiative Bonus', '4:Hunter\'s Strike'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.quickStrideFeature:+%V speed',
        'combatNotes.huntedByTheShadowFeature:No surprise by servant of shadow',
        'combatNotes.hunter\'sStrikeFeature:x2 damage %V/day',
        'combatNotes.hatedFoeFeature:' +
          'Additional Hunter\'s Strike vs. Master Hunter creature',
        'combatNotes.improvedInitiativeFeature:+4 initiative',
        'combatNotes.instinctiveResponseFeature:Re-roll initiative check',
        'combatNotes.masterHunterFeature:' +
          '+2 or more damage vs. selected creature type(s)',
        'combatNotes.trueAimFeature:x3 damage on Hunter\'s Strike',
        'featureNotes.animalCompanionFeature:' +
          'Special bond/abilities w/up to %V animals',
        'featureNotes.improvedWoodlandStrideFeature:' +
          'Normal movement through enchanted terrain',
        'featureNotes.overlandStrideFeature:' +
          'Normal movement while using Survival',
        'featureNotes.senseDarkMagicFeature:Scent vs. legate/outsider',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'featureNotes.woodsloreFeature:' +
          'Automatic Search vs. trap/concealed door w/in 5 ft',
        'magicNotes.senseDarkMagicFeature:' +
          '<i>Detect Magic</i> vs. legate/outsider at will',
        'saveNotes.evasionFeature:Save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'skillNotes.alertnessFeature:+2 Listen/Spot',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.dangerSenseFeature:+%V Listen/Spot',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.masterHunterFeature:' +
          '+2 or more Bluff/Listen/Sense Motive/Spot/Survival vs. selected ' +
          'creature types',
        'skillNotes.skillMasteryFeature:' +
          '+3 bonus/take 10 despite distraction on %V designated skills',
        'skillNotes.trackFeature:Survival to follow creatures\' trail',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'skillNotes.wildernessTrapfindingFeature:' +
          'Search to find/Survival to remove DC 20+ traps',
        'validationNotes.animalCompanionSelectableFeatureFeatures:' +
          'Requires Wild Empathy',
        'validationNotes.camouflageSelectableFeatureFeatures:' +
          'Requires Skill Mastery/Trackless Step',
        'validationNotes.evasionSelectableFeatureFeatures:' +
          'Requires Quick Stride/Instinctive Response',
        'validationNotes.hatedFoeSelectableFeatureFeatures:' +
          'Requires Master Hunter',
        'validationNotes.hideInPlainSightSelectableFeatureFeatures:' +
          'Requires Camouflage',
        'validationNotes.huntedByTheShadowSelectableFeatureFeatures:' +
          'Requires Rapid Response/Sense Dark Magic',
        'validationNotes.improvedEvasionSelectableFeatureFeatures:' +
          'Requires Evasion',
        'validationNotes.improvedWoodlandStrideSelectableFeatureFeatures:' +
          'Requires Woodland Stride/Overland Stride',
        'validationNotes.instinctiveResponseSelectableFeatureFeatures:' +
          'Requires Rapid Response',
        'validationNotes.overlandStrideSelectableFeatureFeatures:' +
          'Requires Quick Stride',
        'validationNotes.senseDarkMagicSelectableFeatureFeatures:' +
          'Requires Master Hunter',
        'validationNotes.slipperyMindSelectableFeatureFeatures:' +
          'Requires Hunted By The Shadow',
        'validationNotes.tracklessStepSelectableFeatureFeatures:' +
          'Requires Woodland Stride',
        'validationNotes.trueAimSelectableFeatureFeatures:' +
          'Requires Skill Mastery/Hated Foe',
        'validationNotes.woodsloreSelectableFeatureFeatures:' +
          'Requires Wilderness Trapfinding'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = [
        'Alertness', 'Animal Companion', 'Camouflage', 'Danger Sense',
        'Evasion', 'Hated Foe', 'Hide In Plain Sight', 'Hunted By The Shadow',
        'Improved Evasion', 'Improved Initiative', 'Improved Woodland Stride',
        'Initiative Bonus', 'Instinctive Response', 'Master Hunter',
        'Overland Stride', 'Quick Stride', 'Sense Dark Magic', 'Skill Mastery',
        'Slippery Mind', 'Trackless Step', 'True Aim', 'Wild Empathy',
        'Wilderness Trapfinding', 'Woodland Stride', 'Woodslore'
      ];
      skillPoints = 6;
      skills = [
        'Balance', 'Climb', 'Craft', 'Handle Animal', 'Heal', 'Hide', 'Jump',
        'Knowledge (Geography)', 'Knowledge (Nature)', 'Listen',
        'Move Silently', 'Profession', 'Ride', 'Search', 'Speak Language',
        'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      spellAbility = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('abilityNotes.quickStrideFeature',
        'selectableFeatures.Quick Stride', '=', '10 * source'
      );
      rules.defineRule('animalCompanionLevel',
        'featureNotes.animalCompanionFeature', '+=', null
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'levels.Wildlander', '+=', null);
      rules.defineRule('combatNotes.hunter\'sStrikeFeature',
        'levels.Wildlander', '=', 'Math.floor(source / 4)'
      );
      rules.defineRule('combatNotes.initiativeBonusFeature',
        'levels.Wildlander', '+=', 'source >= 3 ? 1 : null',
        'selectableFeatures.Initiative Bonus', '+', null
      );
      rules.defineRule('featureNotes.animalCompanionFeature',
        'selectableFeatures.Animal Companion', '+=', null
      );
      rules.defineRule('initiative',
        'combatNotes.improvedInitiativeFeature', '+', '4',
        'combatNotes.initiativeBonusFeature', '+', null
      );
      rules.defineRule('selectableFeatureCount.Wildlander',
        'levels.Wildlander', '=',
        '1 + Math.floor((source + 1) / 3) + ' +
        '(source < 6 ? 0 : Math.floor((source - 3) / 3))'
      );
      rules.defineRule('skillNotes.dangerSenseFeature',
        'levels.Wildlander', '+=', 'source >= 3 ? 1 : null',
        'selectableFeatures.Danger Sense', '+', null
      );
      rules.defineRule('skillNotes.skillMasteryFeature',
        'selectableFeatures.Skill Mastery', '+=', null
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Wildlander', '+=', 'source',
        'charismaModifier', '+', null
      );
      rules.defineRule('speed', 'abilityNotes.quickStrideFeature', '+', null);

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    }
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

/* Defines the rules related to companion creatures. */
LastAge.companionRules = function(rules, companions) {

  for(var i = 0; i < companions.length; i++) {

    var features, notes, prefix;
    var companion = companions[i];

    if(companion == 'Animal Companion') {
      features = [
        '1:Devotion', '2:Magical Beast', '3:Companion Evasion',
        '4:Improved Speed', '5:Empathic Link'
      ];
      notes = [
        'animalCompanionStats.armorClass:+%V',
        'animalCompanionStats.dexterity:+%V',
        'animalCompanionStats.hitDice:+%Vd8',
        'animalCompanionStats.strength:+%V',
        'animalCompanionStats.tricks:+%V',
        'companionNotes.companionEvasionFeature:' +
          'Reflex save yields no damage instead of 1/2',
        'companionNotes.devotionFeature:+4 Will vs. enchantment',
        'companionNotes.empathicLinkFeature:Share emotions up to 1 mile',
        'companionNotes.improvedSpeedFeature:+10 speed',
        'companionNotes.magicalBeastFeature:' +
          'Treated as magical beast for type-based effects'
      ];
      prefix = 'animalCompanion';
      rules.defineRule('animalCompanionStats.armorClass',
        'animalCompanionLevel', '=', '(source - 1) * 2'
      );
      rules.defineRule('animalCompanionStats.dexterity',
        'animalCompanionLevel', '=', 'source - 1'
      );
      rules.defineRule('animalCompanionStats.hitDice',
        'animalCompanionLevel', '=', '(source - 1) * 2'
      );
      rules.defineRule('animalCompanionStats.strength',
        'animalCompanionLevel', '=', 'source * 2'
      );
      rules.defineRule('animalCompanionStats.tricks',
       'animalCompanionLevel', '=', 'source + 1'
      );
    } else if(companion == 'Astirax') {
      features = [
        '2:Telepathy', '3:Enhanced Sense', '4:Companion Evasion',
        '6:Companion Empathy'
      ];
      notes = [
        'astiraxStats.charisma:+%V',
        'astiraxStats.hitDice:+%Vd8',
        'astiraxStats.intelligence:+%V',
        'companionNotes.companionEmpathyFeature:' +
          'Continuous emotional link w/no range limit',
        'companionNotes.companionEvasionFeature:' +
          'Reflex save yields no damage instead of 1/2',
        'companionNotes.enhancedSenseFeature:' +
          '+%V mile channeled event detection',
        'companionNotes.telepathyFeature:' +
          'Companion-controlled telepathic communication up to 100 ft'
      ];
      prefix = 'astirax';
      rules.defineRule
        ('astiraxStats.charisma', 'astiraxLevel', '=', 'source - 1');
      rules.defineRule
        ('astiraxStats.hitDice', 'astiraxLevel', '=', '(source - 1) * 2');
      rules.defineRule
        ('astiraxStats.intelligence', 'astiraxLevel', '=', 'source - 1');
      rules.defineRule('companionNotes.enhancedSenseFeature',
        'astiraxLevel', '+=', 'source < 5 ? 5 : 10'
      );
    } else
      continue;

    for(var j = 0; j < features.length; j++) {
      var levelAndFeature = features[j].split(/:/);
      var feature = levelAndFeature[levelAndFeature.length == 1 ? 0 : 1];
      var level = levelAndFeature.length == 1 ? 1 : levelAndFeature[0];
      rules.defineRule(prefix + 'Features.' + feature,
        prefix + 'Level', '=', 'source >= ' + level + ' ? 1 : null'
      );
      rules.defineRule
        ('features.' + feature, prefix + 'Features.' + feature, '=', '1');
    }

    if(notes != null)
      rules.defineNote(notes);

    rules.defineSheetElement
      (companion + ' Features', 'Companion Notes', null, ' * ');
    rules.defineSheetElement
      (companion + ' Stats', companion + ' Features', null, ' * ');

  }

};

/* Defines the rules related to PC equipment. */
LastAge.equipmentRules = function(rules, weapons) {
  rules.defineChoice('weapons', weapons);
};

/* Defines the rules related to PC feats. */
LastAge.featRules = function(rules, feats, subfeats) {

  // Let SRD35 handle the basics, then add setting-specific notes and rules
  SRD35.featRules(rules, feats, subfeats);

  var allFeats = [];
  for(var i = 0; i < feats.length; i++) {
    var pieces = feats[i].split(/:/);
    var feat = pieces[0];
    var featSubfeats = subfeats[feat];
    if(featSubfeats == null) {
      allFeats[allFeats.length] = feat + ':' + pieces[1];
    } else if(featSubfeats != '') {
      featSubfeats = featSubfeats.split(/\//);
      for(var j = 0; j < featSubfeats.length; j++) {
        allFeats[allFeats.length] =
          feat + ' (' + featSubfeats[j] + '):' + pieces[1];
      }
    }
  }

  for(var i = 0; i < allFeats.length; i++) {
    var pieces = allFeats[i].split(/:/);
    var feat = pieces[0];
    var matchInfo;
    var notes;
    if(feat == 'Craft Charm') {
      notes = [
        'magicNotes.craftCharmFeature:' +
          'Use Craft to create single-use magic item',
        'validationNotes.craftCharmFeatSkills:Requires Max Craft >= 4'
      ];
    } else if(feat == 'Craft Greater Spell Talisman') {
      notes = [
        'magicNotes.craftGreaterSpellTalismanFeature:' +
          'Talisman reduces spell energy cost of selected school spells by 1',
        'validationNotes.craftGreaterSpellTalismanFeatFeats:' +
          'Requires Max Magecraft >= 1/Ritual Magic/any 2 Spellcasting',
        'validationNotes.craftGreaterSpellTalismanFeatLevel:' +
          'Requires Level >= 12'
      ];
      rules.defineRule('validationNotes.craftGreaterSpellTalismanFeatFeats',
        'feats.Craft Greater Spell Talisman', '=', '-112',
        // NOTE: False valid w/multiple Magecraft
        /^features\.Magecraft/, '+', '100',
        'features.Ritual Magic', '+', '10',
        /^features\.Spellcasting/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Craft Spell Talisman') {
      notes = [
        'magicNotes.craftSpellTalismanFeature:' +
          'Talisman reduces spell energy cost of selected spell by 1',
        'validationNotes.craftSpellTalismanFeatFeats:' +
          'Requires Max Magecraft >= 1/Max Spellcasting >= 1',
         // JJH: character level or charismatic channeler level?
        'validationNotes.craftSpellTalismanFeatLevel:Requires Level >= 3'
      ];
    } else if(feat == 'Devastating Mounted Assault') {
      notes = [
       'combatNotes.devastatingMountedAssaultFeature:' +
         'Full attack after mount moves',
       'validationNotes.devastatingMountedAssaultFeatFeats:' +
          'Requires Mounted Combat',
       'validationNotes.devastatingMountedAssaultFeatSkills:Requires Ride >= 10'
      ];
    } else if(feat == 'Drive It Deep') {
      notes = [
        'combatNotes.driveItDeepFeature:Attack base -attack/+damage',
        'validationNotes.driveItDeepFeatBaseAttack:Requires Base Attack >= 1'
      ];
    } else if(feat == 'Extra Gift') {
      notes = [
        'featureNotes.extraGiftFeature:' +
          'Use Master Of Two Worlds/Force Of Personality +4 times/day',
        'validationNotes.extraGiftFeatLevels:' +
          'Requires Charismatic Channeler >= 4||Spiritual Channeler >= 4'
      ];
      rules.defineRule('combatNotes.masterOfTwoWorldsFeature',
        'featureNotes.extraGiftFeature', '+', '4'
      );
      rules.defineRule('magicNotes.forceOfPersonalityFeature',
        'featureNotes.extraGiftFeature', '+', '4'
      );
    } else if(feat == 'Friendly Agent') {
      notes = [
        'skillNotes.friendlyAgentFeature:' +
          '+4 Diplomacy (convince allegiance)/Sense Motive (determine ' +
          'allegiance)',
        'validationNotes.friendlyAgentFeatAlignment:Requires Alignment =~ Good',
        'validationNotes.friendlyAgentFeatRace:' +
          'Requires Race =~ Gnome|Dorn|Erenander|Sarcosan'
      ];
    } else if(feat == 'Giant Fighter') {
      notes = [
        'combatNotes.giantFighterFeature:' +
          '+4 AC/double critical range w/in 30 ft vs. giants',
        'validationNotes.giantFighterFeatFeats:' +
          'Requires Dodge/Max Weapon Focus >= 1'
      ];
    } else if(feat == 'Herbalist') {
      notes = [
        'magicNotes.herbalistFeature:Create herbal concoctions',
        'validationNotes.herbalistFeatSkills:' +
          'Requires Profession (Herbalist) >= 4'
      ];
    } else if(feat == 'Improvised Weapon') {
      notes = [
        'combatNotes.improvisedWeaponFeature:' +
          'No penalty for improvised weapon/-2 for non-proficient weapon'
      ];
    } else if(feat == 'Inconspicuous') {
      notes = [
        'skillNotes.inconspicuousFeature:' +
          '+2 Bluff/Diplomacy/Hide/Sense Motive (shadow)'
      ];
    } else if(feat == 'Innate Magic') {
      notes = [
        'magicNotes.innateMagicFeature:' +
          '%V level 0 spells as at-will innate ability',
        'validationNotes.innateMagicFeatRace:' +
          'Requires Race =~ Elf|Halfling'
      ];
      rules.defineRule('highestMagicModifier',
        'charismaModifier', '^=', null,
        'intelligenceModifier', '^=', null,
        'wisdomModifier', '^=', null
      );
      rules.defineRule
        ('magicNotes.innateMagicFeature', 'highestMagicModifier', '=', null);
    } else if(feat == 'Knife Thrower') {
      notes = [
        'combatNotes.knifeThrowerFeature:' +
          '+1 ranged attack/Quickdraw w/racial knife',
        'validationNotes.knifeThrowerFeatRace:' +
          'Requires Race =~ Jungle Elf|Snow Elf'
      ];
    } else if(feat == 'Lucky') {
      notes = ['saveNotes.luckyFeature:+1 from luck charms/spells'];
    } else if((matchInfo = feat.match(/^Magecraft \((.*)\)/)) != null) {
      var tradition = matchInfo[1];
      var note = 'magicNotes.magecraft(' + tradition + ')Feature';
      var ability = tradition == 'Charismatic' ? 'charisma' :
                    tradition == 'Hermetic' ? 'intelligence' : 'wisdom';
      var spellClass = tradition == 'Charismatic' ? 'Bard' :
                       tradition == 'Hermetic' ? 'Wizard' : 'Druid';
      var spellCode = spellClass.substring(0, 1);
      notes = [note + ':4 spells/%V spell energy points'];
      rules.defineRule(note, ability + 'Modifier', '=', null);
      rules.defineRule('spellEnergy', note, '+=', null);
      rules.defineRule('spellsKnown.' + spellCode + '0', note, '+=', '3');
      rules.defineRule('spellsKnown.' + spellCode + '1', note, '+=', '1');
      // Pick up SRD35 level 0/1 spells of the appropriate class.
      var classRules = new ScribeRules('');
      SRD35.magicRules(classRules, [spellClass], [], []);
      var schools = rules.getChoices('schools');
      for(var s in classRules.getChoices('spells')) {
        var matchInfo = s.match('^(.*)\\((' + spellCode + '[01])');
        if(matchInfo == null) {
          continue;
        }
        var spell = matchInfo[1];
        var school = LastAge.spellsSchools[spell];
        if(school == null && (school = SRD35.spellsSchools[spell]) == null) {
          continue;
        }
        spell += '(' + matchInfo[2] + ' ' +
                 (school == 'Universal' ? 'None' : schools[school]) + ')';
        rules.defineChoice('spells', spell);
      }
    } else if(feat == 'Magic Hardened') {
      notes = [
        'saveNotes.magicHardenedFeature:+2 spell resistance',
        'validationNotes.magicHardenedFeatRace:Requires Race =~ Dwarf|Dworg|Orc'
      ];
      rules.defineRule
        ('resistance.Spells', 'saveNotes.magicHardenedFeature', '+=', '2');
    } else if(feat == 'Natural Healer') {
      notes = [
        'skillNotes.naturalHealerFeature:' +
          'Successful Heal raises patient to 1 HP/triple normal healing rate'
      ];
    } else if(feat == 'Orc Slayer') {
      notes = [
        'combatNotes.orcSlayerFeature:+1 AC/damage vs. orcs/dworgs',
        'skillNotes.orcSlayerFeature:-4 charisma skills vs. orcs/dworgs'
      ];
    } else if(feat == 'Quickened Donning') {
      notes = [
        'featureNotes.quickenedDonningFeature:No penalty for hastened donning'
      ];
    } else if(feat == 'Ritual Magic') {
      notes = [
        'magicNotes.ritualMagicFeature:Learn and lead magic rituals',
        'validationNotes.ritualMagicFeatFeats:' +
          'Requires Max Magecraft >= 1/Max Spellcasting >= 1'
      ];
    } else if(feat == 'Sarcosan Pureblood') {
      notes = [
        'combatNotes.sarcosanPurebloodFeature:+2 AC (horsed)',
        'skillNotes.sarcosanPurebloodFeature:' +
         'Diplomacy w/horses/+2 charisma skills (horses/Sarcosans)'
      ];
    } else if(feat == 'Sense Nexus') {
      notes = [
        'magicNotes.senseNexusFeature:' +
          'DC 15 wisdom check to sense nexus w/in 5 miles'
      ];
    } else if((matchInfo = feat.match(/^Spellcasting \((.*)\)/)) != null) {
      var school = matchInfo[1];
      var schoolNoSpace = school.replace(/ /g, '');
      var note = 'magicNotes.spellcasting(' + schoolNoSpace + ')Feature';
      notes = [note + ':May learn school spells/+1 school spell'];
      if(school.indexOf('Greater ') == 0) {
        notes[notes.length] =
          'validationNotes.spellcasting(' + schoolNoSpace + ')FeatFeats:' +
            'Requires Spellcasting (' + school.substring(8) + ')';
      }
      rules.defineRule('spellsKnownBonus', note, '+=', '1');
    } else if(feat == 'Spell Knowledge') {
      notes = [
        'magicNotes.spellKnowledgeFeature:+2 spells',
        'validationNotes.spellKnowledgeFeatFeats:Requires Max Spellcasting >= 1'
      ];
      rules.defineRule
        ('spellsKnownBonus', 'magicNotes.spellKnowledgeFeature', '+', '2');
    } else if(feat == 'Thick Skull') {
      notes = [
        'saveNotes.thickSkullFeature:DC 10 + damage save to stay at 1 hit point'
      ];
    } else if(feat == 'Warrior Of Shadow') {
      notes = [
        'combatNotes.warriorOfShadowFeature:' +
          'Substitute %V rounds of +%1 damage for Turn Undead use',
        'validationNotes.warriorOfShadowFeatAbility:Requires Charisma >= 12',
        'validationNotes.warriorOfShadowFeatLevels:Requires Legate >= 5'
      ];
      rules.defineRule
        ('combatNotes.warriorOfShadowFeature', 'charismaModifier', '=', null);
      rules.defineRule
        ('combatNotes.warriorOfShadowFeature.1', 'charismaModifier', '=', null);
    } else if(feat == 'Whispering Awareness') {
      notes = [
        'featureNotes.whisperingAwarenessFeature:' +
          'DC 12 wisdom check to hear Whispering Wood',
        'validationNotes.whisperingAwarenessFeatAbility:Requires Wisdom >= 15',
        'validationNotes.whisperingAwarenessFeatRace:' +
          'Requires Race =~ Elfling|Elf'
      ];
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null) {
      rules.defineNote(notes);
    }
  }

};

/* Defines the rules related heroic paths. */
LastAge.heroicPathRules = function(rules, paths) {

  rules.defineChoice('heroicPaths', paths);
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
    ('charisma', 'abilityNotes.charismaBonusFeature', '+', null);
  rules.defineRule
    ('constitution', 'abilityNotes.constitutionBonusFeature', '+', null);
  rules.defineRule
    ('dexterity', 'abilityNotes.dexterityBonusFeature', '+', null);
  rules.defineRule
    ('intelligence', 'abilityNotes.intelligenceBonusFeature', '+', null);
  rules.defineRule('strength', 'abilityNotes.strengthBonusFeature', '+', null);
  rules.defineRule('wisdom', 'abilityNotes.wisdomBonusFeature', '+', null);

  for(var i = 0; i < paths.length; i++) {

    var path = paths[i];
    var feats, features, notes, selectableFeatures, spellFeatures;

    if(path == 'Beast') {

      feats = null;
      features = [
        '1:Vicious Assault', '2:Beastial Aura', '7:Rage',
        '12:Enhanced Beastial Aura'
      ];
      notes = [
        'combatNotes.beastialAuraFeature:Turn animals',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC for %V rounds %1/day',
        'combatNotes.viciousAssaultFeature:Two claw attacks at %V each',
        'featureNotes.enhancedBeastialAuraFeature:' +
          'Animals w/in 15 ft act negatively/cannot ride',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'featureNotes.scentFeature:' +
          'Detect creatures\' presence w/in 30 ft/track by smell',
        'skillNotes.beastialAuraFeature:-10 Handle Animal/no Wild Empathy'
      ];
      selectableFeatures = [
        'Constitution Bonus', 'Dexterity Bonus', 'Low Light Vision', 'Scent',
        'Strength Bonus', 'Wisdom Bonus'
      ];
      spellFeatures = [
        '3:Magic Fang', '4:Bear\'s Endurance', '8:Greater Magic Fang',
        '9:Cat\'s Grace', '13:Magic Fang', '14:Bull\'s Strength',
        '17:Greater Magic Fang', '19:Freedom Of Movement'
      ];
      rules.defineRule('combatNotes.rageFeature',
        'constitutionModifier', '=', '5 + source'
      );
      rules.defineRule('combatNotes.rageFeature.1',
        'pathLevels.Beast', '+=', 'source >= 17 ? 2 : 1'
      );
      rules.defineRule('combatNotes.viciousAssaultFeature',
        'mediumViciousAssault', '=', null,
        'smallViciousAssault', '=', null
      );
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        'selectableFeatures.Low Light Vision', '+', null
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
        'mediumViciousAssault', '=', 'SRD35.weaponsSmallDamage[source]'
      );
      rules.defineRule('turnAnimal.damageModifier',
        'turnAnimal.level', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('turnAnimal.frequency',
        'pathLevels.Beast', '+=', 'source >= 12 ? 6 : 3'
      );
      rules.defineRule('turnAnimal.level',
        'pathLevels.Beast', '^=', 'source >= 2 ? source : null'
      );
      rules.defineRule('turnAnimal.maxHitDice',
        'turnAnimal.level', '=', 'source * 3 - 10',
        'charismaModifier', '+', null
      );
      rules.defineNote([
        'turnAnimal.damageModifier:2d6 + %V',
        'turnAnimal.frequency:%V/day',
        'turnAnimal.maxHitDice:(d20 + %V) / 3'
      ]);

    } else if(path == 'Chanceborn') {

      feats = null;
      features = [
        '1:Luck Of Heroes', '3:Unfettered', '4:Miss Chance', '6:Persistence',
        '9:Take Ten', '19:Take Twenty'
      ];
      notes = [
        'combatNotes.missChanceFeature:%V% chance of foe miss',
        'featureNotes.luckOfHeroesFeature:Add %V to any d20 roll 1/day',
        'featureNotes.persistenceFeature:' +
          'Defensive Roll/Evasion/Slippery Mind/Uncanny Dodge %V/day',
        'featureNotes.takeTenFeature:Take 10 on any d20 roll 1/day',
        'featureNotes.takeTwentyFeature:Take 20 on any d20 roll 1/day',
        'magicNotes.unfetteredFeature:<i>Freedom Of Movement</i> %V rounds/day'
      ];
      selectableFeatures = null;
      spellFeatures = ['2:Persistence', '7:True Strike', '12:Aid', '17:Prayer'];
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

      feats = null;
      features = [
        '4:Inspiring Oration', '5:Charisma Bonus', '6:Leadership',
        '12:Natural Leader'
      ];
      notes = [
        'featureNotes.leadershipFeature:Attract followers',
        'featureNotes.naturalLeaderFeature: +%V Leadership score',
        'magicNotes.inspiringOrationFeature:' +
          'Give speech to apply spell-like ability to allies w/in 60 ft %V/day'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '1:Charm Person', '2:Remove Fear', '3:Hypnotism', '7:Aid',
        '8:Daze Monster', '11:Heroism', '13:Charm Monster', '16:Suggestion',
        '17:Greater Heroism'
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

      feats = null;
      features = [
        '1:Bolster Spell', '4:Quickened Counterspelling',
        '6:Improved Spellcasting', '9:Spell Penetration',
        '19:Frightful Presence'
      ];
      notes = [
        'magicNotes.bolsterSpellFeature:Add 1 to DC of %V chosen spells',
        'magicNotes.frightfulPresenceFeature:' +
          'Casting panics/shakes foes of lesser level 4d6 rounds failing ' +
          'DC %V Will save',
        'magicNotes.improvedSpellcastingFeature:' +
          'Reduce energy cost of spells from %V chosen schools by 1',
        'magicNotes.quickenedCounterspellingFeature:' +
          'Counterspell as move action 1/round',
        'magicNotes.spellPenetrationFeature:Add %V to spell penetration checks'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('magicNotes.bolsterSpellFeature',
        'pathLevels.Dragonblooded', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('magicNotes.dragonbloodedSpellEnergy',
        'pathLevels.Dragonblooded', '=',
        'source>=16 ? 8 : source>=11 ? 6 : source>=7 ? 4 : source>=3 ? 2 : null'
      );
      rules.defineRule('magicNotes.dragonbloodedSpellsKnown',
        'pathLevels.Dragonblooded', '=',
        'source>=14 ? 3 : source>=8 ? 2 : source>=2 ? 1 : null'
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
      rules.defineRule
        ('spellEnergy', 'magicNotes.dragonbloodedSpellEnergy', '+', null);
      rules.defineRule
        ('spellsKnownBonus', 'magicNotes.dragonbloodedSpellsKnown', '+', null);

    } else if(path == 'Earthbonded') {

      feats = null;
      features = [
        '1:Darkvision', '3:Natural Armor', '4:Stonecunning',
        '8:Improved Stonecunning', '12:Tremorsense', '16:Blindsense',
        '20:Blindsight'
      ];
      notes = [
        'combatNotes.naturalArmorFeature:+%V AC',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.blindsightFeature:' +
          'Other senses compensate for loss of vision w/in 30 ft',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door',
        'featureNotes.tremorsenseFeature:' +
          'Detect creatures in contact w/ground w/in 30 ft',
        'skillNotes.stonecunningFeature:' +
          '+%V Search involving stone or metal/automatic check w/in 10 ft'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '2:Hold Portal', '5:Soften Earth And Stone', '6:Make Whole',
        '7:Spike Stones', '9:Stone Shape', '11:Meld Into Stone',
        '13:Transmute Rock To Mud', '14:Stoneskin', '15:Move Earth',
        '17:Stone Tell', '19:Earthquake'
      ];
      rules.defineRule
        ('armorClass', 'combatNotes.naturalArmorFeature', '+', null);
      rules.defineRule('combatNotes.naturalArmorFeature',
        'earthbondedFeatures.Natural Armor', '+=', null
      );
      rules.defineRule('earthbondedFeatures.Natural Armor',
        'level', '+', 'source >= 18 ? 2 : source >= 10 ? 1 : null'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'earthbondedFeatures.Darkvision', '+=', '30'
      );
      rules.defineRule('skillNotes.stonecunningFeature',
        'earthbondedFeatures.Stonecunning', '+=', '2'
      );

    } else if(path == 'Faithful') {

      feats = null;
      features = ['4:Turn Undead'];
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '1:Bless', '2:Protection From Evil', '3:Divine Favor', '6:Aid',
        '7:Bless Weapon', '8:Consecrate', '11:Daylight',
        '12:Magic Circle Against Evil', '13:Prayer', '16:Holy Smite',
        '17:Dispel Evil', '18:Holy Aura'
      ];
      rules.defineRule('faithfulFeatures.Wisdom Bonus',
        'pathLevels.Faithful', '=', 'source<5 ? null : Math.floor(source/5)'
      );
      rules.defineRule('features.Wisdom Bonus',
       'faithfulFeatures.Wisdom Bonus', '+=', null
      );
      rules.defineRule
        ('turnUndead.damageModifier', 'pathLevels.Faithful', '^=', null);
      rules.defineRule
        ('turnUndead.frequency', 'turnUndeadFaithfulFrequency', '+=', null);
      rules.defineRule
        ('turnUndead.maxHitDice', 'pathLevels.Faithful', '^=', 'source*3-10');
      rules.defineRule('turnUndeadFaithfulFrequency',
        'pathLevels.Faithful', '=',
        'source >= 4 ? Math.floor((source + 1) / 5) : null',
        'charismaModifier', '+', '-source'
      );

    } else if(path == 'Fellhunter') {

      feats = null;
      features = [
        '1:Sense The Dead', '2:Touch Of The Living', '3:Ward Of Life',
        '5:Disrupting Attack'
      ];
      notes = [
        'combatNotes.disruptingAttackFeature:' +
           'Undead %V Will save or destroyed %1/day',
        'combatNotes.touchOfTheLivingFeature:+%V damage vs. undead',
        'magicNotes.senseTheDeadFeature:Detect undead %V ft at will',
        'saveNotes.wardOfLifeFeature:Immune to undead %V'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('combatNotes.disruptingAttackFeature',
        'pathLevels.Fellhunter', '+=', '10 + Math.floor(source / 2)',
        'charismaModifier', '+', null
      );
      rules.defineRule('combatNotes.disruptingAttackFeature.1',
        'pathLevels.Fellhunter', '+=', 'Math.floor(source / 5)'
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

      feats = null;
      features = ['1:Low Light Vision', '7:Fey Vision'];
      notes = [
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.feyVisionFeature:Detect %V auras at will'
      ];
      selectableFeatures = [
        'Armor Class Bonus', 'Dexterity Bonus', 'Fortitude Bonus',
        'Reflex Bonus', 'Will Bonus'
      ];
      spellFeatures = [
        '2:Disguise Self', '3:Ventriloquism', '5:Magic Aura',
        '6:Invisibility', '9:Nondetection', '10:Glibness',
        '11:Deep Slumber', '14:False Vision', '15:Rainbow Pattern',
        '17:Mislead', '18:Seeming'
      ];
      rules.defineRule('armorClass',
        'combatNotes.armorClassBonusFeature', '+', null
      );
      rules.defineRule('combatNotes.armorClassBonusFeature',
        'features.Armor Class Bonus', '=', null
      );
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        'feybloodedFeatures.Low Light Vision', '+', null
      );
      rules.defineRule
        ('save.Fortitude', 'saveNotes.fortitudeBonusFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.reflexBonusFeature', '+', null);
      rules.defineRule('save.Will', 'saveNotes.willBonusFeature', '+', null);
      rules.defineRule('saveNotes.fortitudeBonusFeature',
        'features.Fortitude Bonus', '=', null 
      );
      rules.defineRule
        ('saveNotes.reflexBonusFeature', 'features.Reflex Bonus', '=', null);
      rules.defineRule
        ('saveNotes.willBonusFeature', 'features.Will Bonus', '=', null);
      rules.defineRule('selectableFeatureCount.Feyblooded',
        'unearthlyMaxBonusCount', '=',
          'source > 0 ? (source * (source + 1)) / 2 : null',
        'unearthlyChaModTotalBonus', '+', 'source > 0 ? source : null'
      );
      rules.defineRule('magicNotes.feyVisionFeature',
        'pathLevels.Feyblooded', '=',
        'source >= 19 ? "all magic" : ' +
        'source >= 13 ? "enchantment/illusion" : "enchantment"'
      );
      rules.defineRule('unearthlyMaxBonusCount',
        'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)',
        'charismaModifier', 'v', null
      );
      rules.defineRule('unearthlyChaModTotalBonus',
        'pathLevels.Feyblooded', '=', 'Math.floor(source / 4)',
        'unearthlyMaxBonusCount', '+', '-source',
        'charismaModifier', '*', null
      );

    } else if(path == 'Giantblooded') {

      feats = null;
      features = [
        '1:Obvious', '2:Rock Throwing', '3:Intimidating Size',
        '4:Fast Movement', '5:Strength Bonus', '8:Fearsome Charge', '10:Large',
        '20:Extra Reach'
      ];
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.extraReachFeature:15 ft reach',
        'combatNotes.fearsomeChargeFeature:' +
           '+%V damage/-1 AC for every 10 ft in charge',
        'combatNotes.largeFeature:+4 bull rush/disarm/grapple/-1 AC/attack',
        'combatNotes.rockThrowingFeature:Use debris as ranged weapon',
        'skillNotes.intimidatingSizeFeature:+%V Intimidate',
        'skillNotes.obviousFeature:-4 Hide'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('abilityNotes.fastMovementFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 4) / 8) * 5'
      );
      rules.defineRule('armorClass', 'combatNotes.largeFeature', '+', '-1');
      rules.defineRule('baseAttack', 'combatNotes.largeFeature', '+', '-1');
      rules.defineRule('combatNotes.fearsomeChargeFeature',
        'pathLevels.Giantblooded', '+=', 'Math.floor((source + 2) / 10)'
      );
      rules.defineRule('giantbloodedFeatures.Strength Bonus',
        'level', '+', 'source >= 15 ? 1 : null'
      );
      rules.defineRule('skillNotes.intimidatingSizeFeature',
        'pathLevels.Giantblooded', '+=',
        'source>=17 ? 10 : source>=14 ? 8 : (Math.floor((source + 1) / 4) * 2)'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
      rules.defineRule
        ('weapons.Debris', 'combatNotes.rockThrowingFeature', '=', '1');
      // NOTE: damage skewed to allow for Large adjustment starting level 10
      rules.defineRule('weaponDamage.Debris',
        'pathLevels.Giantblooded', '=',
        'source>=16 ? "d10" : source>=10 ? "d8" : source>=9 ? "2d6" : "d10"'
      );
      rules.defineRule('weaponRange.Debris',
        'pathLevels.Giantblooded', '=',
        'source >= 19 ? 120 : source >= 13 ? 90 : source >= 6 ? 60 : 30'
      );

    } else if(path == 'Guardian') {

      feats = null;
      features = [
        '1:Inspire Valor', '2:Detect Evil', '3:Righteous Fury', '4:Smite Evil',
        '5:Constitution Bonus', '6:Lay On Hands', '12:Aura Of Courage',
        '16:Death Ward'
      ];
      notes = [
        'combatNotes.righteousFuryFeature:' +
          'Overcome %V points of evil foe melee damage reduction',
        'combatNotes.smiteEvilFeature:' +
          '%V/day add %1 to attack, %2 to damage vs. evil foe',
        'featureNotes.inspireValorFeature:' +
          'Allies w/in 30 ft extra attack/+%V fear saves for %1 rounds %2/day',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'saveNotes.auraOfCourageFeature:' +
          'Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.deathWardFeature:Immune to negative energy/death effects'
      ];
      selectableFeatures = null;
      spellFeatures = null;
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
      rules.defineRule
        ('combatNotes.smiteEvilFeature.1', 'charismaModifier', '=', null);
      rules.defineRule
        ('combatNotes.smiteEvilFeature.2', 'pathLevels.Guardian', '=', null);
      rules.defineRule('featureNotes.inspireValorFeature',
        'pathLevels.Guardian', '=', 'source >= 13 ? 2 : 1'
      );
      rules.defineRule('featureNotes.inspireValorFeature.1',
        'pathLevels.Guardian', '=', null
      );
      rules.defineRule('featureNotes.inspireValorFeature.2',
        'pathLevels.Guardian', '=', 'source >= 19 ? 3 : source >= 9 ? 2 : 1'
      );
      rules.defineRule('magicNotes.layOnHandsFeature',
        'pathLevels.Guardian', '+=', null,
        'charismaModifier', '*', null
      );

    } else if(path == 'Healer') {

      feats = null;
      features = null;
      notes = null;
      selectableFeatures = null;
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

    } else if(path == 'Ironborn') {

      feats = null;
      features = [
        '1:Ironborn Resilience', '2:Fortitude Bonus', '3:Natural Armor',
        '4:Improved Healing', '5:Damage Reduction', '6:Resist Elements',
        '9:Indefatigable', '14:Ability Recovery'
      ];
      notes = [
        'combatNotes.abilityRecoveryFeature:Regain 1 point ability damage/hour',
        'combatNotes.damageReductionFeature:%V subtracted from damage taken',
        'combatNotes.improvedHealingFeature:Regain %V HP/hour',
        'combatNotes.ironbornResilienceFeature:Improved hit die',
        'combatNotes.naturalArmorFeature:+%V AC',
        'saveNotes.resistElementsFeature:' +
          '%V resistance to acid/cold/electricity/fire',
        'saveNotes.indefatigableFeature:Immune %V effects'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule
        ('armorClass', 'combatNotes.naturalArmorFeature', '+', null);
      rules.defineRule('combatNotes.damageReductionFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 5)'
      );
      rules.defineRule('combatNotes.improvedHealingFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.naturalArmorFeature',
        'ironbornFeatures.Natural Armor', '+=', null
      );
      rules.defineRule('ironbornFeatures.Fortitude Bonus',
        'level', '+', 'Math.floor((source - 2) / 5)'
      );
      rules.defineRule('ironbornFeatures.Natural Armor',
        'level', '+', 'Math.floor((source - 3) / 5)'
      );
      rules.defineRule
        ('resistance.Acid', 'saveNotes.resistElementsFeature', '+=', null);
      rules.defineRule
        ('resistance.Cold', 'saveNotes.resistElementsFeature', '+=', null);
      rules.defineRule
        ('resistance.Electricity','saveNotes.resistElementsFeature','+=',null);
      rules.defineRule
        ('resistance.Fire', 'saveNotes.resistElementsFeature', '+=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.fortitudeBonusFeature', '+', null);
      rules.defineRule('saveNotes.resistElementsFeature',
        'pathLevels.Ironborn', '+=', 'Math.floor((source - 1) / 5) * 3'
      );
      rules.defineRule('saveNotes.fortitudeBonusFeature',
        'features.Fortitude Bonus', '=', null 
      );
      rules.defineRule('saveNotes.indefatigableFeature',
        'pathLevels.Ironborn', '=',
         'source < 9 ? null : source < 19 ? "fatigue" : "fatigue/exhaustion"'
      );

    } else if(path == 'Jack-Of-All-Trades') {

      feats = null;
      features = [
        '1:Spell Choice', '2:Spontaneous Spell', '3:Skill Boost', '7:Feat Bonus'
      ];
      notes = [
        'magicNotes.spellChoiceFeature:' +
          'Use chosen %V spell as spell-like ability 1/day',
        'magicNotes.spontaneousSpellFeature:' +
          'Use any %V spell as spell-like ability 1/day',
        'skillNotes.skillBoostFeature:+4 to %V chosen skills'
      ];
      selectableFeatures = [
        'Charisma Bonus', 'Constitution Bonus', 'Dexterity Bonus',
        'Intelligence Bonus', 'Strength Bonus', 'Wisdom Bonus'
      ];
      spellFeatures = null;
      rules.defineRule('featCount.General',
       'jack-Of-All-TradesFeatures.Feat Bonus', '+', null
      );
      rules.defineRule('jack-Of-All-TradesFeatures.Feat Bonus',
        'level', '+', 'source >= 14 ? 1 : null'
      );
      rules.defineRule('magicNotes.spellChoiceFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source>=16 ? "C0/C1/C2/C3" : source>=10 ? "C0/C1/C2" : ' +
        'source>=6 ? "C0/C1" : "C0"'
      );
      rules.defineRule('magicNotes.spontaneousSpellFeature',
        'pathLevels.Jack-Of-All-Trades', '=',
        'source >= 19 ? "C0/C1/C2" : source >= 13 ? "C0/C1" : "C0"'
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

      feats = null;
      features = [
        '1:Mountaineer', '1:Mountain Survival', '3:Ambush', '4:Rallying Cry',
        '5:Constitution Bonus', '8:Improved Ambush', '13:Quick Ambush',
        '18:Sniping Ambush'
      ];
      notes = [
        'combatNotes.improvedAmbushFeature:' +
           'Allies +2 damage vs. flat-footed foes on surprise/1st melee rounds',
        'combatNotes.rallyingCryFeature:' +
          'Allies not flat-footed/+4 vs. surprise %V/day',
        'combatNotes.snipingAmbushFeature:' +
          'Reduced Hide penalty for using ranged weapons',
        'skillNotes.ambushFeature:Allies use character\'s Hide for ambush',
        'skillNotes.quickAmbushFeature:Hide allies for ambush in half time',
        'skillNotes.mountaineerFeature:+%V Balance/Climb/Jump',
        'skillNotes.mountainSurvivalFeature:+%V Survival (mountains)'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '2:Endure Elements', '7:Pass Without Trace', '12:Meld Into Stone',
        '17:Stone Tell'
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

      feats = null;
      features = [
        '1:Natural Bond', '1:Wild Empathy', '5:Animal Friend',
        '10:Plant Friend', '15:Elemental Friend', '20:One With Nature'
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
        'skillNotes.plantFriendFeature:+4 Diplomacy (plants)',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '2:Calm Animals', '3:Entangle', '4:Obscuring Mist',
        '6:Animal Messenger', '7:Wood Shape', '8:Gust Of Wind',
        '9:Speak With Animals', '11:Speak With Plants', '12:Call Lightning',
        '13:Dominate Animal', '14:Spike Growth', '16:Sleet Storm',
        '17:Summon Nature\'s Ally IV', '18:Command Plants', '19:Ice Storm'
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

      feats = null;
      features = [
        '1:Northborn', '1:Wild Empathy', '2:Cold Resistance', '3:Battle Cry',
        '4:Howling Winds', '5:Constitution Bonus', '6:Aura Of Warmth',
        '11:Improved Battle Cry', '13:Frost Weapon', '16:Cold Immunity',
        '18:Greater Frost Weapon'
      ];
      notes = [
        'combatNotes.battleCryFeature:+%V hit points after cry %1/day',
        'combatNotes.frostWeaponFeature:' +
           '+d6 cold damage on hit for %V rounds %1/day',
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
          '+2 Survival (cold)/Wild Empathy (cold natives)',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule
        ('combatNotes.battleCryFeature', 'pathLevels.Northblooded', '=', null);
      rules.defineRule('combatNotes.battleCryFeature.1',
        'pathLevels.Northblooded', '=',
        'source >= 17 ? 4 : source >= 14 ? 3 : source >= 7 ? 2 : 1'
      );
      rules.defineRule('combatNotes.frostWeaponFeature',
        'pathLevels.Northblooded', '=', null
      );
      rules.defineRule('combatNotes.frostWeaponFeature.1',
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

      feats = null;
      features = [
        '1:Painless', '2:Nonlethal Damage Reduction', '3:Uncaring Mind',
        '4:Retributive Rage', '5:Ferocity', '9:Last Stand',
        '10:Increased Damage Threshold', '14:Improved Retributive Rage'
      ];
      notes = [
        'combatNotes.ferocityFeature:Continue fighting below 0 HP',
        'combatNotes.improvedRetributiveRageFeature:' +
          '+%V damage next round after suffering double level damage',
        'combatNotes.increasedDamageThresholdFeature:' +
          'Continue fighting until -%V HP',
        'combatNotes.lastStandFeature:' +
           '1 minute of %V spell resistance/15 damage reduction/30 energy ' +
           'resistance/near death afterward %1/day',
        'combatNotes.nonlethalDamageReductionFeature:' +
          'Ignore first %V points of non-lethal damage',
        'combatNotes.painlessFeature:+%V HP',
        'combatNotes.retributiveRageFeature:' +
          '+%V attack next round after suffering double level damage',
        'saveNotes.painlessFeature:+%V vs. pain effects',
        'saveNotes.uncaringMindFeature:+%V vs. enchantment'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('combatNotes.improvedRetributiveRageFeature',
        'pathLevels.Painless', '+=', null
      );
      rules.defineRule('combatNotes.increasedDamageThresholdFeature',
        'pathLevels.Painless', '+=',
        'source >= 20 ? 25 : source >= 15 ? 20 : 15'
      );
      rules.defineRule('combatNotes.lastStandFeature',
        'pathLevels.Painless', '+=', '10 + source'
      );
      rules.defineRule('combatNotes.lastStandFeature.1',
        'pathLevels.Painless', '+=', 'source >= 19 ? 2 : 1'
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

      feats = null;
      features = [
        '1:Master Adventurer', '2:Blood Of Kings', '3:Feat Bonus',
        '4:Skill Fixation'
      ];
      notes = [
        'skillNotes.bloodOfKingsFeature:' +
          'Daily +%V on charisma skills in shadow or resistance interactions',
        'skillNotes.masterAdventurerFeature:' +
          '+%V on three selected non-charisma skills',
        'skillNotes.skillFixationFeature:' +
          'Take 10 despite distraction on %V designated skills',
        'validationNotes.purebloodHeroicPathRace:Requires Race =~ Erenlander'
      ];
      selectableFeatures = [
        'Charisma Bonus', 'Constitution Bonus', 'Dexterity Bonus',
        'Intelligence Bonus', 'Strength Bonus', 'Wisdom Bonus'
      ];
      spellFeatures = null;
      rules.defineRule
        ('featCount.General', 'purebloodFeatures.Feat Bonus', '+', null);
      rules.defineRule('purebloodFeatures.Feat Bonus',
        'level', '+', 'Math.floor((source - 3) / 5)'
      );
      rules.defineRule('selectableFeatureCount.Pureblood',
        'pathLevels.Pureblood', '=', 'source>=5 ? Math.floor(source / 5) : null'
      );
      rules.defineRule('skillNotes.skillFixationFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 1) / 5)'
      );
      rules.defineRule('skillNotes.bloodOfKingsFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 3) / 5) * 2'
      );
      rules.defineRule('skillNotes.masterAdventurerFeature',
        'pathLevels.Pureblood', '+=', 'Math.floor((source + 4) / 5) * 2'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.masterAdventurerFeature', '+', '3*source');
      rules.defineRule('validationNotes.purebloodHeroicPathRace',
        'pathLevels.Pureblood', '=', '-1',
        'race', '+', 'source.match(/Erenlander/) ? 1 : null'
      );

    } else if(path == 'Quickened') {

      feats = null;
      features = [
        '1:Initiative Bonus', '2:Armor Class Bonus', '3:Fast Movement',
        '4:Burst Of Speed', '5:Dexterity Bonus'
      ];
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.burstOfSpeedFeature:' +
          'Extra attack/move action for %V rounds %1/day/fatigued afterward'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('abilityNotes.fastMovementFeature',
        'pathLevels.Quickened', '+=', 'Math.floor((source + 2) / 5) * 5'
      );
      rules.defineRule('armorClass',
        'combatNotes.armorClassBonusFeature', '+', null
      );
      rules.defineRule('combatNotes.armorClassBonusFeature',
        'features.Armor Class Bonus', '=', null
      );
      rules.defineRule('combatNotes.burstOfSpeedFeature',
        'constitutionModifier', '+=', 'source + 3'
      );
      rules.defineRule('combatNotes.burstOfSpeedFeature.1',
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
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);

    } else if(path == 'Seaborn') {

      feats = null;
      features = [
        '1:Dolphin\'s Grace', '1:Natural Swimmer', '2:Deep Lungs',
        '3:Aquatic Blindsight', '4:Aquatic Ally', '10:Aquatic Adaptation',
        '14:Cold Resistance', '17:Aquatic Emissary', '18:Assist Allies'
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
        'skillNotes.deepLungsFeature:Hold breath for %V rounds',
        'skillNotes.dolphin\'sGraceFeature:+8 swim hazards',
        'skillNotes.naturalSwimmerFeature:%V swim as move action'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '4:Aquatic Ally II', '5:Blur', '8:Aquatic Ally III', '9:Fog Cloud',
        '12:Aquatic Ally IV', '13:Displacement', '16:Aquatic Ally V',
        '20:Aquatic Ally VI'
      ];
      rules.defineRule('deepLungsMultiplier',
        'seabornFeatures.Deep Lungs', '^=', '2',
        'pathLevels.Seaborn', '+', 'source >= 6 ? 2 : 1'
      );
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
        'deepLungsMultiplier', '=', null,
        'constitution', '*', null
      );
      rules.defineRule('skillNotes.naturalSwimmerFeature',
        'pathLevels.Seaborn', '+=', 'source >= 15 ? 60 : source >= 7 ? 40 : 20'
      );

    } else if(path == 'Seer') {

      feats = null;
      features = ['3:Seer Sight'];
      notes = [
        'magicNotes.seerSightFeature:' +
          'Discern recent history of touched object %V/day'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '1:Alarm', '2:Augury', '4:Clairaudience/Clairvoyance',
        '5:Locate Object', '7:Locate Creature', '8:Speak With Dead',
        '10:Divination', '11:Scrying', '13:Arcane Eye', '14:Find The Path',
        '16:Prying Eyes', '17:Legend Lore', '19:Commune', '20:Vision'
      ];
      rules.defineRule('magicNotes.seerSightFeature',
        'pathLevels.Seer', '=', 'Math.floor((source + 6) / 6)'
      );

    } else if(path == 'Shadow Walker') {

      feats = null;
      features = [
        '1:Darkvision', '2:Shadow Veil', '4:Shadow Jump',
        '11:Hide In Plain Sight'
      ];
      notes = [
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.shadowJumpFeature:Move %V ft between shadows',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.shadowVeilFeature:+%V Hide'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '3:Expeditious Retreat', '5:Blur', '7:Undetectable Alignment',
        '9:Displacement', '13:Expeditious Retreat', '15:Blur',
        '17:Undetectable Alignment', '19:Displacement'
      ];
      rules.defineRule('featureNotes.darkvisionFeature',
        'shadowWalkerFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('featureNotes.shadowJumpFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor(source / 4) * 10'
      );
      rules.defineRule('skillNotes.shadowVeilFeature',
        'pathLevels.Shadow Walker', '+=', 'Math.floor((source + 2) / 4) * 2'
      );

    } else if(path == 'Speaker') {

      feats = null;
      features = [
        '2:Persuasive Speaker', '3:Power Words', '5:Charisma Bonus',
        '14:Language Savant'
      ];
      notes = [
        'magicNotes.powerWordsFeature:' +
          'DC %2+spell level <i>Word of %V</i> %1/day',
        'skillNotes.languageSavantFeature:' +
          'Fluent in any language after listening for 10 minutes',
        'skillNotes.persuasiveSpeakerFeature:+%V on verbal charisma skills'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '1:Comprehend Languages', '4:Whispering Wind', '8:Tongues', '12:Shout',
        '18:Greater Shout'
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
      rules.defineRule('magicNotes.powerWordsFeature.1',
        'charismaModifier', '=', 'source + 3'
      );
      rules.defineRule('magicNotes.powerWordsFeature.2',
        'charismaModifier', '=', 'source + 10'
      );
      rules.defineRule('skillNotes.persuasiveSpeakerFeature',
        'pathLevels.Speaker', '=',
        'source >= 17 ? 8 : source >= 11 ? 6 : source >= 7 ? 4 : 2'
      );

    } else if(path == 'Spellsoul') {

      feats = null;
      features = [
        '1:Untapped Potential', '2:Metamagic Aura', '3:Improved Resist Spells'
      ];
      notes = [
        'magicNotes.metamagicAuraFeature:' +
          '%V others\' spells of up to level %1 w/in 30 ft',
        'magicNotes.untappedPotentialFeature:' +
          'Contribute %V points to others\' spells w/in 30 ft',
        'saveNotes.improvedResistSpellsFeature:+%V vs. spells'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('highestMagicModifier',
        'charismaModifier', '^=', null,
        'intelligenceModifier', '^=', null,
        'wisdomModifier', '^=', null
      );
      rules.defineRule('magicNotes.metamagicAuraFeature',
        'pathLevels.Spellsoul', '=',
        '(source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1) + "/day " + ' +
        '["enlarge"].concat(source >= 5 ? ["extend"] : [])' +
                   '.concat(source >= 8 ? ["reduce"] : [])' +
                   '.concat(source >= 11 ? ["attract"] : [])' +
                   '.concat(source >= 14 ? ["empower"] : [])' +
                   '.concat(source >= 17 ? ["maximize"] : [])' +
                   '.concat(source >= 20 ? ["redirect"] : []).sort().join("/")'
      );
      rules.defineRule('magicNotes.metamagicAuraFeature',
        'pathLevels.Spellsoul', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.untappedPotentialFeature',
        'highestMagicModifier', '=', 'source + 1',
        'level', '+',
          'source>=18 ? 8 : source>=13 ? 6 : source>=9 ? 4 : source>=4 ? 2 : 0'
      );
      rules.defineRule('resistance.Spell',
        'saveNotes.improvedResistSpellsFeature', '+=', null
      );
      rules.defineRule('saveNotes.improvedResistSpellsFeature',
        'pathLevels.Spellsoul', '=',
        'source>=19 ? 5 : source>=16 ? 4 : source>=12 ? 3 : source>=7 ? 2 : ' +
        'source>=3 ? 1 : null'
      );

    } else if(path == 'Steelblooded') {

      feats = [];
      for(var feat in rules.getChoices('feats')) {
        if(feat.match(/Weapon (Focus|Proficiency|Specialization) \(/)) {
          feats[feats.length] = feat;
        }
      }
      features = [
        '2:Offensive Tactics', '3:Strategic Blow', '4:Skilled Warrior',
        '14:Untouchable', '19:Improved Untouchable'
      ];
      notes = [
        'combatNotes.improvedUntouchableFeature:' +
           'No foe AOO from move/standard/full-round actions',
        'combatNotes.offensiveTacticsFeature:' +
          '+%V to first attack or all damage when using full attack action',
        'combatNotes.skilledWarriorFeature:' +
           'Half penalty from %V choices of Fighting Defensively/Grapple ' +
           'Attack/Non-proficient Weapon/Two-Weapon Fighting',
        'combatNotes.strategicBlowFeature:' +
          'Overcome %V points of foe damage reduction',
        'combatNotes.untouchableFeature:No foe AOO from special attacks'
      ];
      selectableFeatures = null;
      spellFeatures = null;
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
      rules.defineRule('featCount.Steelblooded',
        'pathLevels.Steelblooded', '=', '1 + Math.floor(source / 5)'
      );

    } else if(path == 'Sunderborn') {

      feats = null;
      features = [
        '1:Detect Outsider', '2:Blood Of The Planes', '4:Planar Fury',
        '7:Darkvision', '13:Magical Darkvision', '19:See Invisible'
      ];
      notes = [
        'combatNotes.planarFuryFeature:' +
          '+2 strength/constitution/+1 Will save/-1 AC for %V rounds %1/day',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.magicalDarkvisionFeature:See perfectly in any darkness',
        'featureNotes.seeInvisibleFeature:See invisible creatures',
        'magicNotes.detectOutsiderFeature:Detect outsiders at will',
        'skillNotes.bloodOfThePlanesFeature:' +
          '+%V on charisma skills when dealing with outsiders'
      ];
      selectableFeatures = null;
      spellFeatures = [
        '3:Summon Monster I', '6:Summon Monster II', '9:Summon Monster III',
        '12:Summon Monster IV', '15:Summon Monster V', '18:Summon Monster VI'
      ];
      rules.defineRule('combatNotes.planarFuryFeature',
        'constitutionModifier', '+=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('combatNotes.planarFuryFeature.1',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 2) / 6)'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'sunderbornFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('skillNotes.bloodOfThePlanesFeature',
        'pathLevels.Sunderborn', '+=', 'Math.floor((source + 1) / 3) * 2'
      );

    } else if(path == 'Tactician') {

      feats = null;
      features = [
        '1:Aid Another', '2:Combat Overview', '3:Coordinated Initiative',
        '4:Joint Attack', '5:Aided Combat Bonus', '13:Directed Attack',
        '18:Telling Blow', '20:Perfect Assault'
      ];
      notes = [
        'combatNotes.aidAnotherFeature:Aid another as a move action',
        'combatNotes.aidedCombatBonusFeature:Aided ally +%V to attack or AC',
        'combatNotes.combatOverviewFeature:' +
          'Ally w/in 60 ft avoid AOO/avoid flat-footed/foe flat-footed %V/day',
        'combatNotes.coordinatedInitiativeFeature:' +
          'Allies w/in 30 ft use character\'s initiative %V/day',
        'combatNotes.directedAttackFeature:' +
          'Ally w/in 30 ft add 1/2 character\'s base attack 1/day',
        'combatNotes.jointAttackFeature:' +
          'Allies w/in 30 ft attack single foe at +1/participant (+5 max) ' +
          '%V/day',
        'combatNotes.perfectAssaultFeature:' +
          'Allies w/in 30 ft threaten critical on any hit 1/day',
        'combatNotes.tellingBlowFeature:Allies w/in 30 ft re-roll damage 1/day'
      ];
      selectableFeatures = null;
      spellFeatures = null;
      rules.defineRule('combatNotes.aidedCombatBonusFeature',
        'pathLevels.Tactician', '+=',
        'source>=19 ? 4 : source>=14 ? 3 : source>=9 ? 2 : source>=5 ? 1 : 0'
      );
      rules.defineRule('combatNotes.combatOverviewFeature',
        'pathLevels.Tactician', '+=',
        'source>=15 ? 4 : source>=10 ? 3 : source>=6 ? 2 : 1'
      );
      rules.defineRule('combatNotes.coordinatedInitiativeFeature',
        'pathLevels.Tactician', '+=',
        'source>=16 ? 4 : source>=11 ? 3 : source>=7 ? 2 : 1'
      );
      rules.defineRule('combatNotes.jointAttackFeature',
        'pathLevels.Tactician', '+=',
        'source>=17 ? 4 : source==16 ? 3 : Math.floor(source / 4)'
      );

    } else if(path == 'Warg') {

      feats = null;
      features = [
        '1:Wild Empathy', '2:Animal Companion', '5:Wild Shape', '13:Ferocity',
        '20:Blindsense'
      ];
      notes = [
        'combatNotes.ferocityFeature:Continue fighting below 0 HP',
        'featureNotes.animalCompanionFeature:' +
          'Special bond/abilities w/up to %V animals',
        'featureNotes.blindsenseFeature:' +
          'Other senses allow detection of unseen objects w/in 30 ft',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'featureNotes.scentFeature:' +
          'Detect creatures\' presence w/in 30 ft/track by smell',
        'magicNotes.wildShapeFeature:Change into creature of size %V %1/day',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      selectableFeatures = ['Low Light Vision', 'Scent'];
      spellFeatures = [
        '4:Charm Animal', '7:Speak With Animals', '12:Charm Animal',
        '17:Speak With Animals'
      ];
      rules.defineRule('animalCompanionLevel',
        'featureNotes.animalCompanionFeature', '+=', null
      );
      rules.defineRule
        ('animalCompanionMasterLevel', 'pathLevels.Warg', '+=', null);
      rules.defineRule('featureNotes.animalCompanionFeature',
        'wargFeatures.Animal Companion', '+=', null
      );
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        'selectableFeatures.Low Light Vision', '+', null
      );
      rules.defineRule('wargFeatures.Animal Companion',
        'level', '+', 'Math.floor((source - 2) / 4)'
      );
      rules.defineRule('magicNotes.wildShapeFeature',
        'pathLevels.Warg', '=',
        'source >= 19 ? "medium-huge" : ' +
        'source >= 11 ? "medium-large" : ' +
        'source >= 5 ? "medium" : null'
      );
      rules.defineRule('magicNotes.wildShapeFeature.1',
        'pathLevels.Warg', '=', 'source >= 15 ? 3 : source >= 8 ? 2 : 1'
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
    rules.defineRule('pathLevels.' + path,
      'heroicPath', '?', 'source == "' + path + '"',
      'level', '=', null
    );
    rules.defineSheetElement(path + ' Features', 'Feats', null, ' * ');
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + path);
      }
    }
    if(features != null) {
      for(var j = 0; j < features.length; j++) {
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
    if(notes != null)
      rules.defineNote(notes);
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + path);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }
    if(spellFeatures != null) {
      var spellLevels = {};
      for(var j = 0; j < spellFeatures.length; j++) {
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
      rules.defineSheetElement(path + ' Spells', 'Spells', null, ' * ');
    }

  }
  rules.defineChoice('random', 'heroicPath');
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'levels');
  rules.defineSheetElement('Heroic Path', 'Alignment');

};

/* Defines the rules related to PC spells and caster level. */
LastAge.magicRules = function(rules, classes) {

  var channelerDone = false;
  var schools = rules.getChoices('schools');
  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass.indexOf("Channeler") >= 0 && !channelerDone) {
      spells = [
        'C0:Create Water:Cure Minor Wounds:Dancing Lights:Daze:Detect Magic:' +
        'Detect Poison:Disrupt Undead:Flare:Ghost Sound:Guidance:' +
        'Know Direction:Light:Lullaby:Mage Hand:Mending:Message:Open/Close:' +
        'Ray Of Frost:Read Magic:Resistance:Summon Instrument:' +
        'Touch Of Fatigue:Virtue',
        'C1:Alarm:Animate Rope:Assist:Burial:Burning Hands:Calm Animals:' +
        'Cause Fear:Channel Might:Charm Animal:Charm Person:Chill Touch:' +
        'Color Spray:Comprehend Languages:Cure Light Wounds:' +
        'Detect Animals Or Plants:Detect Astirax:Detect Secret Doors:' +
        'Detect Snares And Pits:Detect Undead:Disguise Self:Disguise Weapon:' +
        'Endure Elements:Enlarge Person:Entangle:Erase:Expeditious Retreat:' +
        'Faerie Fire:Far Whisper:Feather Fall:Floating Disk:Goodberry:Grease:' +
        'Hide From Animals:Hold Portal:Hypnotism:Identify:Jump:' +
        'Lesser Confusion:Lie:Mage Armor:Magic Aura:Magic Fang:Magic Missile:' +
        'Magic Mouth:Magic Stone:Magic Weapon:Mount:Obscuring Mist:' +
        'Pass Without Trace:Phantom Edge:Produce Flame:' +
        'Protection From Chaos:Protection From Evil:Protection From Good:' +
        'Protection From Law:Ray Of Enfeeblement:Reduce Person:Remove Fear:' +
        'Shield:Shillelagh:Shocking Grasp:Silent Image:Sleep:' +
        'Speak With Animals:Spider Climb:Stone Soup:Summon Monster I:' +
        'Summon Nature\'s Ally I:True Strike:Undetectable Alignment:' +
        'Unseen Servant:Ventriloquism',
        'C2:Acid Arrow:Alter Self:Animal Messenger:Animal Trance:Arcane Lock:' +
        'Barkskin:Bear\'s Endurance:Blindness/Deafness:Blur:Bull\'s Strength:' +
        'Cat\'s Grace:Chill Metal:Command Undead:Confer Power:' +
        'Continual Flame:Cure Moderate Wounds:Darkness:Darkvision:' +
        'Daze Monster:Delay Poison:Detect Chaos:Detect Evil:Detect Good:' +
        'Detect Law:Detect Thoughts:Disguise Ally:Eagle\'s Splendor:' +
        'False Life:Flame Blade:Flaming Sphere:Fog Cloud:Fox\'s Cunning:' +
        'Ghoul Touch:Glitterdust:Greenshield:Gust Of Wind:Heat Metal:' +
        'Hideous Laughter:Hold Animal:Hypnotic Pattern:Invisibility:Knock:' +
        'Lesser Restoration:Levitate:Lifetrap:Locate Object:Magic Mouth:' +
        'Minor Image:Mirror Image:Misdirection:Nature\'s Revelation:' +
        'Obscure Object:Owl\'s Wisdom:Phantom Trap:Protection From Arrows:' +
        'Pyrotechnics:Reduce Animal:Resist Energy:Scare:Scorching Ray:' +
        'Scryer\'s Mark:See Invisibility:Shatter:Silence:Silver Blood:' +
        'Soften Earth And Stone:Sound Burst:Spectral Hand:Spider Climb:' +
        'Summon Monster II:Summon Nature\'s Ally II:Summon Swarm:' +
        'Touch Of Idiocy:Tree Shape:Warp Wood:Web:Whispering Wind:Wood Shape',
        'C3:Arcane Sight:Call Lightning:Charm Repair:' +
        'Clairaudience/Clairvoyance:Contagion:Cure Serious Wounds:Daylight:' +
        'Deep Slumber:Diminish Plants:Dispel Magic:Displacement:' +
        'Dominate Animal:Explosive Runes:Fireball:Flame Arrow:Fly:' +
        'Gaseous Form:Gentle Repose:Glibness:Good Hope:Greater Magic Fang:' +
        'Greater Magic Weapon:Gust Of Wind:Halfling Burrow:Halt Undead:Haste:' +
        'Heroism:Hold Person:Illusory Script:Invisibility Sphere:Keen Edge:' +
        'Lightning Bolt:Magic Circle Against Chaos:' +
        'Magic Circle Against Evil:Magic Circle Against Good:' +
        'Magic Circle Against Law:Major Image:Meld Into Stone:' +
        'Neutralize Poison:Nondetection:Phantom Steed:Plant Growth:Poison:' +
        'Protection From Energy:Rage:Ray Of Exhaustion:Remove Disease:' +
        'Sculpt Sound:Secret Page:Sepia Snake Sigil:Shrink Item:Silver Wind:' +
        'Sleet Storm:Slow:Snare:Speak With Plants:Spike Growth:' +
        'Stinking Cloud:Suggestion:Summon Monster III:' +
        'Summon Nature\'s Ally III:Tiny Hut:Tongues:Vampiric Touch:' +
        'Water Breathing:Water Walk:Wind Wall',
        'C4:Air Walk:Animate Dead:Antiplant Shell:Arcane Eye:Bestow Curse:' +
        'Bestow Curse:Bestow Spell:Black Tentacles:Blight:Charm Monster:' +
        'Command Plants:Confusion:Control Water:Crushing Despair:' +
        'Cure Critical Wounds:Detect Scrying:Dimensional Anchor:Enervation:' +
        'Fear:Fire Shield:Fire Trap:Flame Strike:Freedom Of Movement:' +
        'Giant Vermin:Greater Invisibility:Hallucinatory Terrain:Ice Storm:' +
        'Illusory Wall:Lesser Geas:Lesser Globe Of Invulnerability:' +
        'Locate Creature:Mass Enlarge Person:Mass Reduce Person:' +
        'Minor Creation:Mnemonic Enhancer:Modify Memory:Phantasmal Killer:' +
        'Polymorph:Rainbow Pattern:Reincarnate:Remove Curse:Repel Vermin:' +
        'Resilient Sphere:Restoration:Scrying:Secure Shelter:' +
        'Shadow Conjuration:Shout:Silver Storm:Solid Fog:Spike Stones:' +
        'Stone Shape:Stoneskin:Summon Monster IV:Summon Nature\'s Ally IV:' +
        'Wall Of Fire:Wall Of Ice:Zone Of Silence',
        'C5:Animal Growth:Atonement:Awaken:Baleful Polymorph:' +
        'Break Enchantment:Call Lightning Storm:Cloudkill:' +
        'Commune With Nature:Cone Of Cold:Contact Other Plane:' +
        'Control Winds:Death Ward:Dismissal:Dominate Person:Dream:Fabricate:' +
        'False Vision:Feeblemind:Hallow:Hold Monster:Insect Plague:' +
        'Interposing Hand:Lesser Planar Binding:Mage\'s Faithful Hound:' +
        'Mage\'s Private Sanctum:Magic Circle Against Shadow:Magic Jar:' +
        'Major Creation:Mass Cure Light Wounds:Mind Fog:Mirage Arcana:' +
        'Nexus Fuel:Nightmare:Overland Flight:Passwall:Persistent Image:' +
        'Prying Eyes:Secret Chest:Seeming:Sending:Shadow Evocation:' +
        'Song Of Discord:Summon Monster V:Summon Nature\'s Ally V:' +
        'Symbol Of Pain:Symbol Of Sleep:Telekinesis:Telepathic Bond:' +
        'Transmute Mud To Rock:Transmute Rock To Mud:Unhallow:Wall Of Force:' +
        'Wall Of Stone:Wall Of Thorns:Waves Of Fatigue',
        'C6:Acid Fog:Analyze Dweomer:Animate Objects:Antilife Shell:' +
        'Antimagic Field:Chain Lightning:Circle Of Death:Contingency:' +
        'Create Undead:Disintegrate:Eyebite:Find The Path:Fire Seeds:' +
        'Flesh To Stone:Forceful Hand:Freezing Sphere:Geas/Quest:' +
        'Globe Of Invulnerability:Greater Dispel Magic:Greater Heroism:' +
        'Guards And Wards:Heroes\' Feast:Ironwood:Legend Lore:Liveoak:' +
        'Mage\'s Lucubration:Mass Bear\'s Endurance:Mass Bull\'s Strength:' +
        'Mass Cat\'s Grace:Mass Cure Moderate Wounds:Mass Eagle\'s Splendor:' +
        'Mass Fox\'s Cunning:Mass Owl\'s Wisdom:Mass Suggestion:Mislead:' +
        'Move Earth:Permanent Image:Planar Binding:Programmed Image:' +
        'Repel Wood:Repulsion:Spellstaff:Stone Tell:Stone To Flesh:' +
        'Summon Monster VI:Summon Nature\'s Ally VI:Symbol Of Fear:' +
        'Symbol Of Persuasion:Sympathetic Vibration:Transformation:' +
        'True Seeing:Undeath To Death:Veil:Wall Of Iron',
        'C7:Animate Plants:Banishment:Changestaff:Control Undead:' +
        'Control Weather:Creeping Doom:Delayed Blast Fireball:' +
        'Finger Of Death:Fire Storm:Forcecage:Grasping Hand:' +
        'Greater Arcane Sight:Greater Restoration:Greater Scrying:' +
        'Greater Shadow Conjuration:Heal:Insanity:Mage\'s Sword:' +
        'Mass Cure Serious Wounds:Mass Hold Person:Mass Invisibility:' +
        'Power Word Blind:Prismatic Spray:Project Image:Regeneration:' +
        'Reverse Gravity:Sequester:Simulacrum:Spell Turning:Statue:' +
        'Summon Monster VII:Summon Nature\'s Ally VII:Sunbeam:' +
        'Symbol Of Stunning:Symbol Of Weakness:Transmute Metal To Wood:' +
        'Vision:Waves Of Exhaustion:Wind Walk',
        'C8:Animal Shapes:Antipathy:Binding:Clenched Fist:Clone:' +
        'Control Plants:Create Greater Undead:Demand:Discern Location:' +
        'Earthquake:Greater Planar Binding:Greater Prying Eyes:' +
        'Greater Shadow Evocation:Greater Shout:Horrid Wilting:' +
        'Incendiary Cloud:Iron Body:Irresistible Dance:Mass Charm Monster:' +
        'Mass Cure Critical Wounds:Mind Blank:Moment Of Prescience:' +
        'Polar Ray:Polymorph Any Object:Power Word Stun:Prismatic Wall:' +
        'Protection From Spells:Repel Metal Or Stone:Reverse Gravity:' +
        'Scintillating Pattern:Screen:Summon Monster VIII:' +
        'Summon Nature\'s Ally VIII:Sunburst:Symbol Of Death:' +
        'Symbol Of Insanity:Sympathy:Telekinetic Sphere:Temporal Stasis:' +
        'Trap The Soul:Whirlwind',
        'C9:Astral Projection:Crushing Hand:Dominate Monster:' +
        'Elemental Swarm:Energy Drain:Foresight:Freedom:Gate:Imprisonment:' +
        'Mage\'s Disjunction:Mass Hold Monster:Meteor Swarm:Power Word Kill:' +
        'Prismatic Sphere:Regenerate:Shades:Shambler:Shapechange:Soul Bind:' +
        'Storm Of Vengeance:Summon Monster IX:Summon Nature\'s Ally IX:' +
        'Time Stop:Wail Of The Banshee:Weird'
      ];
      channelerDone = true;
    } else if(klass == 'Legate') {
      // Change SRD35 Cleric spells to Legate
      var clericRules = new ScribeRules('');
      SRD35.magicRules(clericRules, ['Cleric'], [], []);
      spells = [];
      for(var j = 0; j < 10; j++) {
        spells[j] = 'L' + j;
      }
      for(var s in clericRules.getChoices('spells')) {
        var matchInfo = s.match(/^(.*)\(C([0-9])/);
        if(matchInfo == null) {
          continue;
        }
        spells[matchInfo[2]] += ':' + matchInfo[1];
      }
    } else
      continue;

    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = LastAge.spellsSchools[spell];
          if(school == null && (school = SRD35.spellsSchools[spell]) == null) {
            continue;
          }
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'None' : schools[school]) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  rules.defineRule('casterLevelArcane',
    'spellEnergy', '?', null,
    'level', '=', null
  );
  rules.defineRule('maxSpellLevel',
    'level', '=', 'source / 2',
    'features.Art Of Magic', '+', '1/2'
  );
  for(var i = 0; i < 10; i++) {
    rules.defineRule('spellsKnown.C' + i,
      'maxSpellLevel', '?', 'source >= ' + i,
      'spellsKnownBonus', '+=', '0'
    );
  }
  rules.defineSheetElement('Spell Energy', 'Spells Per Day');
  rules.defineSheetElement('Spells Known Bonus', 'Spell Energy');

};

/* Defines the rules related to PC races. */
LastAge.raceRules = function(rules, languages, races) {

  for(var i = 0; i < languages.length; i++) {
    var language = languages[i];
    rules.defineRule('languages.' + language,
      'race', '+=',
      'LastAge.racesLanguages[source] == null ? null : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':3")>=0 ? 3 : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':2")>=0 ? 2 : ' +
      'LastAge.racesLanguages[source].indexOf("' + language + ':1")>=0 ? 1 : ' +
      'null'
    );
  }
  rules.defineChoice('languages', languages);
  rules.defineRule('languageCount',
    'race', '=',
      'LastAge.racesLanguages[source] == null ? 0 : ' +
      'eval(LastAge.racesLanguages[source].replace(/\\D+/g, "+"))',
    'intelligenceModifier', '+', 'source > 0 ? source : null',
    'skillModifier.Speak Language', '+', '2 * source'
  );
  rules.defineRule('validationNotes.languagesTotal',
    'languageCount', '+=', '-source',
    /^languages\./, '+=', null
  );

  var notes = [
    'skillNotes.favoredRegion:' +
      '%V; Knowledge (Local) is a class skill/+2 Survival/Knowledge (Nature)',
    'skillNotes.illiteracyFeature:Must spend 2 skill points to read/write',
    'validationNotes.languagesTotal:' +
      'Allocated languages differ from language total by %V'
  ];
  rules.defineNote(notes);
  rules.defineRule('skillNotes.favoredRegion',
    'race', '=', 'LastAge.racesFavoredRegions[source]'
  );
  rules.defineRule('features.Illiteracy', '', '=', '1');
  rules.defineRule
    ('skillModifier.Speak Language', 'skillNotes.illiteracyFeature', '+', '-2');

  for(var i = 0; i < races.length; i++) {

    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');
    var adjustment, features, notes, selectableFeatures;

    if(race == 'Dorn') {

      adjustment = '+2 strength/-2 intelligence';
      features = ['Brotherhood', 'Cold Hardy', 'Fierce', 'Hardy'];
      notes = [
        'combatNotes.brotherhoodFeature:' +
          '+1 attack when fighting alongside 4+ Dorns',
        'combatNotes.fierceFeature:+1 attack w/two-handed weapons',
        'saveNotes.coldHardyFeature:+5 cold/half nonlethal damage',
        'saveNotes.hardyFeature:+1 Fortitude'
      ];
      selectableFeatures = null;
      rules.defineRule('featCount.Fighter',
        'featureNotes.dornFeatCountBonus', '+=', null
      );
      rules.defineRule('featureNotes.dornFeatCountBonus',
        'race', '=', 'source == "Dorn" ? 1 : null'
      );
      rules.defineRule('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
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
        'Resist Poison', 'Resilient', 'Slow', 'Resist Spells',
        'Stone Knowledge'
      ];
      notes = [
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'combatNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'combatNotes.resilientFeature:+2 AC',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.resistSpellsFeature:-2 spell energy',
        'saveNotes.resistPoisonFeature:+2 vs. poison',
        'saveNotes.resistSpellsFeature:+2 vs. spells',
        'skillNotes.stoneKnowledgeFeature:' +
           '+2 Appraise/Craft involving stone or metal'
      ];
      selectableFeatures = null;
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.resilientFeature', '+', '2');
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('resistance.Poison', 'saveNotes.resistPoisonFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.resistSpellsFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.resistSpellsFeature', '+', '-2');
      if(race == 'Clan Dwarf') {
        features = features.concat([
          'Dodge Orcs', 'Know Depth', 'Stability', 'Stonecunning'
        ]);
        notes = notes.concat([
          'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
          'featureNotes.knowDepthFeature:Intuit approximate depth underground',
          'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
          'skillNotes.stonecunningFeature:' +
            '+%V Search involving stone or metal/automatic check w/in 10 ft'
        ]);
        rules.defineRule('skillNotes.stonecunningFeature',
          'clanDwarfFeatures.Stonecunning', '+=', '2'
        );
      } else if(race == 'Kurgun Dwarf') {
        features = features.concat(['Natural Mountaineer']);
        notes = notes.concat([
          'abilityNotes.naturalMountaineerFeature:' +
             'Unimpeded movement in mountainous terrain',
          'skillNotes.naturalMountaineerFeature:+2 Climb'
        ]);
      }

    } else if(race.indexOf(' Dwarrow') >= 0) {

      adjustment = '+2 charisma';
      features = [
        'Darkvision', 'Resist Poison', 'Small', 'Slow', 'Resist Spells',
        'Sturdy'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'combatNotes.sturdyFeature:+1 AC',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.resistSpellsFeature:-2 spell energy',
        'saveNotes.resistPoisonFeature:+2 vs. poison',
        'saveNotes.resistSpellsFeature:+2 vs. spells',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass',
        'combatNotes.smallFeature', '+', '1',
        'combatNotes.sturdyFeature', '+', '1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.resistPoisonFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.resistSpellsFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.resistSpellsFeature', '+', '-2');
      if(race == 'Clan Raised Dwarrow') {
        features = features.concat([
          'Dodge Orcs', 'Stonecunning', 'Stone Knowledge'
        ]);
        notes = notes.concat([
          'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
          'skillNotes.stonecunningFeature:' +
            '+%V Search involving stone or metal/automatic check w/in 10 ft',
          'skillNotes.stoneKnowledgeFeature:' +
             '+2 Appraise/Craft involving stone or metal'
        ]);
        rules.defineRule('skillNotes.stonecunningFeature',
          'clanRaisedDwarrowFeatures.Stonecunning', '+=', '2'
        );
      } else if(race == 'Gnome Raised Dwarrow') {
        features = features.concat([
          'Deep Lungs', 'Natural Riverfolk', 'Natural Swimmer',
          'Skilled Trader'
        ]);
        notes = [
          'skillNotes.deepLungsFeature:Hold breath for %V rounds',
          'skillNotes.naturalRiverfolkFeature:' +
            '+2 Perform/Profession (Sailor)/Swim/Use Rope',
          'skillNotes.naturalSwimmerFeature:%V swim as move action',
          'skillNotes.skilledTraderFeature:' +
            '+2 Appraise/Bluff/Diplomacy/Forgery/Gather Information/' +
            'Profession when smuggling/trading'
        ];
        rules.defineRule('deepLungsMultiplier',
          'gnomeRaisedDwarrowFeatures.Deep Lungs', '=', '3'
        );
        rules.defineRule('skillNotes.deepLungsFeature',
          'deepLungsMultiplier', '=', null,
          'constitution', '*', 'source'
        );
        rules.defineRule('skillNotes.naturalSwimmerFeature',
          'speed', '=', 'Math.floor(source / 2)'
        );
      } else if(race == 'Kurgun Raised Dwarrow') {
        features = features.concat([
          'Dodge Orcs', 'Natural Mountaineer', 'Stone Knowledge'
        ]);
        notes = notes.concat([
          'abilityNotes.naturalMountaineerFeature:' +
             'Unimpeded movement in mountainous terrain',
          'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
          'skillNotes.naturalMountaineerFeature:+2 Climb',
          'skillNotes.stoneKnowledgeFeature:' +
             '+2 Appraise/Craft involving stone or metal'
        ]);
      }

    } else if(race.indexOf(' Dworg') >= 0) {

      adjustment = '+2 strength/+2 constitution/-2 intelligence/-2 charisma';
      features = [
        'Darkvision', 'Dworg Favored Enemy', 'Minor Light Sensitivity',
        'Rugged', 'Resist Spells'
      ];
      notes = [
        'combatNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'combatNotes.minorLightSensitivityFeature:' +
          'DC 15 Fortitude save in sunlight to avoid -1 attack',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.resistSpellsFeature:-2 spell energy',
        'saveNotes.ruggedFeature:+2 all saves',
        'saveNotes.resistSpellsFeature:+2 vs. spells'
      ];
      selectableFeatures = null;
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('resistance.Spell', 'saveNotes.resistSpellsFeature', '+=', '2');
      rules.defineRule('save.Fortitude', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Reflex', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Will', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule
        ('spellEnergy', 'magicNotes.resistSpellsFeature', '+', '-2');
      if(race == 'Clan Raised Dworg') {
        features = features.concat(['Stonecunning']);
        notes = notes.concat([
          'skillNotes.stonecunningFeature:' +
            '+%V Search involving stone or metal/automatic check w/in 10 ft'
        ]);
        rules.defineRule('skillNotes.stonecunningFeature',
          'clanRaisedDworgFeatures.Stonecunning', '+=', '2'
        );
      } else if(race == 'Kurgun Raised Dworg') {
        features = features.concat(['Natural Mountaineer']);
        notes = notes.concat([
          'abilityNotes.naturalMountaineerFeature:' +
             'Unimpeded movement in mountainous terrain',
          'skillNotes.naturalMountaineerFeature:+2 Climb'
        ]);
      }

    } else if(race.indexOf(' Elfling') >= 0) {

      adjustment = '+4 dexterity/-2 strength/-2 constitution';
      features = [
        'Fortunate', 'Gifted Healer', 'Innate Magic', 'Keen Senses',
        'Low Light Vision', 'Nimble', 'Small'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'magicNotes.innateMagicFeature:' +
          '%V level 0 spells as at-will innate ability',
        'saveNotes.fortunateFeature:+1 all saves',
        'skillNotes.giftedHealerFeature:+2 Heal',
        'skillNotes.keenSensesFeature:+2 Listen/Search/Spot',
        'skillNotes.nimbleFeature:+2 Climb/Hide',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('save.Fortitude', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('save.Reflex', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('save.Will', 'saveNotes.fortunateFeature', '+', '1');
      if(race == 'Danisil Raised Elfling') {
      } else if(race == 'Halfling Raised Elfling') {
        features = features.concat(['Bound To The Beast']);
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat'
        ]);
        rules.defineRule('features.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
        );
      }

    } else if(race.indexOf(' Elf') >= 0) {

      adjustment = '+2 dexterity/-2 constitution';
      features = [
        'Resist Enchantment', 'Innate Magic', 'Keen Senses',
        'Low Light Vision', 'Natural Channeler', 'Tree Climber'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.innateMagicFeature:' +
          '%V level 0 spells as at-will innate ability',
        'magicNotes.naturalChannelerFeature:+2 spell energy',
        'saveNotes.resistEnchantmentFeature:+2 vs. enchantments',
        'skillNotes.keenSensesFeature:+2 Listen/Search/Spot',
        'skillNotes.treeClimberFeature:+4 Balance (trees)/Climb (trees)'
      ];
      selectableFeatures = null;
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('resistance.Enchantment',
        'saveNotes.resistEnchantmentFeature', '+=', '2'
      );
      rules.defineRule
        ('spellEnergy', 'magicNotes.naturalChannelerFeature', '+', '2');

      if(race == 'Jungle Elf') {
        features = features.concat([
          'Improved Innate Magic', 'Improved Keen Senses',
          'Improved Tree Climber', 'Spirit Foe'
        ]);
        notes = notes.concat([
          'magicNotes.improvedInnateMagicFeature:+1 Innate Magic spell',
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
          'Deep Lungs', 'Improved Natural Swimmer', 'Natural Sailor',
          'Natural Swimmer'
        ]);
        notes = notes.concat([
          'skillNotes.deepLungsFeature:Hold breath for %V rounds',
          'skillNotes.improvedNaturalSwimmerFeature:' +
             '+8 special action or avoid hazard/always take 10/run',
          'skillNotes.naturalSailorFeature:' +
            '+2 Craft (ship/sea)/Profession (ship/sea)/Use Rope (ship/sea)',
          'skillNotes.naturalSwimmerFeature:%V swim as move action'
        ]);
        rules.defineRule('deepLungsMultiplier',
          'seaElfFeatures.Deep Lungs', '=', '6'
        );
        rules.defineRule('skillNotes.deepLungsFeature',
          'deepLungsMultiplier', '=', null,
          'constitution', '*', 'source'
        );
        rules.defineRule('skillNotes.naturalSwimmerFeature',
          'speed', '=', 'Math.floor(source / 2)'
        );
      } else if(race == 'Snow Elf') {
        features = features.concat(['Cold Hardy', 'Hardy']);
        notes = notes.concat([
          'saveNotes.coldHardyFeature:+5 cold/half nonlethal damage',
          'saveNotes.hardyFeature:+1 Fortitude'
        ]);
        rules.defineRule('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
      } else if(race == 'Wood Elf') {
        features = features.concat([
          'Improved Innate Magic', 'Improved Natural Channeler'
        ]);
        notes = notes.concat([
          'magicNotes.improvedInnateMagicFeature:+1 Innate Magic spell',
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
        'skillNotes.heartlanderFeature:+4 one Craft or Profession'
      ];
      selectableFeatures = null;
      rules.defineRule('abilityNotes.erenlanderAbilityAdjustment',
        'race', '=', 'source == "Erenlander" ? 1 : null'
      );
      rules.defineRule('featCount.General',
        'featureNotes.erenlanderFeatCountBonus', '+=', null
      );
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
        'Deep Lungs', 'Hardy', 'Low Light Vision', 'Natural Riverfolk',
        'Natural Swimmer', 'Natural Trader', 'Slow', 'Small', 'Resist Spells'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.resistSpellsFeature:-2 spell energy',
        'saveNotes.hardyFeature:+1 Fortitude',
        'saveNotes.resistSpellsFeature:+2 vs. spells',
        'skillNotes.deepLungsFeature:Hold breath for %V rounds',
        'skillNotes.naturalRiverfolkFeature:' +
          '+2 Perform/Profession (Sailor)/Swim/Use Rope',
        'skillNotes.naturalSwimmerFeature:%V swim as move action',
        'skillNotes.naturalTraderFeature:' +
          '+4 Appraise/Bluff/Diplomacy/Forgery/Gather Information/' +
          'Profession when smuggling/trading',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('deepLungsMultiplier', 'gnomeFeatures.Deep Lungs', '=', '3');
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.resistSpellsFeature', '+=', '2');
      rules.defineRule('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
      rules.defineRule('skillNotes.deepLungsFeature',
        'deepLungsMultiplier', '=', null,
        'constitution', '*', 'source'
      );
      rules.defineRule('skillNotes.naturalSwimmerFeature',
        'speed', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.resistSpellsFeature', '+', '-2');

    } else if(race.indexOf(' Halfling') >= 0) {

      adjustment = '+2 dexterity/-2 strength';
      features = [
        'Alert Senses', 'Fortunate', 'Graceful', 'Innate Magic',
        'Low Light Vision', 'Slow', 'Small', 'Resist Fear'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'featureNotes.lowLightVisionFeature:x%V normal distance in poor light',
        'magicNotes.innateMagicFeature:' +
          '%V level 0 spells as at-will innate ability',
        'saveNotes.fortunateFeature:+1 all saves',
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.alertSensesFeature:+2 Listen/Spot',
        'skillNotes.gracefulFeature:+2 Climb/Jump/Move Silently/Tumble',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('featureNotes.lowLightVisionFeature',
        '', '=', '1',
        raceNoSpace + 'Features.Low Light Vision', '+', null
      );
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Fear', 'saveNotes.resistFearFeature', '+=', '2');
      rules.defineRule
        ('save.Fortitude', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('save.Reflex', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('save.Will', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('speed', 'features.Slow', '+', '-10');

      if(race == 'Agrarian Halfling') {
        selectableFeatures = ['Stout', 'Studious'];
        features = features.concat(['Dextrous Hands', 'Gifted Healer']);
        notes = notes.concat([
          'featureNotes.stoutFeature:Endurance/Toughness',
          'featureNotes.studiousFeature:Magecraft (Hermetic)',
          'skillNotes.dextrousHandsFeature:+2 Craft (non-metal/non-wood)',
          'skillNotes.giftedHealerFeature:+2 Heal'
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
        selectableFeatures = ['Bound To The Beast', 'Bound To The Spirits'];
        features = features.concat(['Focused Rider', 'Skilled Rider']);
        notes = notes.concat([
          'featureNotes.boundToTheBeastFeature:Mounted Combat',
          'featureNotes.boundToTheSpiritsFeature:Magecraft (Spiritual)',
          'skillNotes.skilledRiderFeature:' +
            '+2 Concentration (wogrenback)/+2 Handle Animal (wogren)/' +
            'Ride (wogren)'
        ]);
        rules.defineRule('features.Magecraft (Spiritual)',
          'nomadicHalflingFeatures.Magecraft (Spiritual)', '=', '1'
        );
        rules.defineRule('features.Mounted Combat',
          'nomadicHalflingFeatures.Mounted Combat', '=', '1'
        );
        rules.defineRule('nomadicHalflingFeatures.Magecraft (Spiritual)',
          'featureNotes.boundToTheSpiritsFeature', '=', '1'
        );
        rules.defineRule('nomadicHalflingFeatures.Mounted Combat',
          'featureNotes.boundToTheBeastFeature', '=', '1'
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
        'Orc Frenzy', 'Resist Spells'
      ];
      notes = [
        'combatNotes.lightSensitivityFeature:-1 attack in daylight',
        'combatNotes.nightFighterFeature:+1 attack in darkness',
        'combatNotes.orcFrenzyFeature:+1 attack when fighting among 10+ Orcs',
        'combatNotes.orcFavoredEnemyFeature:+1 damage vs. dwarves',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.resistSpellsFeature:-2 spell energy',
        'saveNotes.improvedColdHardyFeature:Immune non-lethal/half lethal',
        'saveNotes.resistSpellsFeature:+2 vs. spells',
        'skillNotes.naturalPredatorFeature:+%V Intimidate'
      ];
      selectableFeatures = null;
      rules.defineRule('featureNotes.darkvisionFeature',
        raceNoSpace + 'Features.Darkvision', '+=', '60'
      );
      rules.defineRule
        ('resistance.Spell', 'saveNotes.resistSpellsFeature', '+=', '2');
      rules.defineRule
        ('skillNotes.naturalPredatorFeature', 'strengthModifier', '=', null);
      rules.defineRule
        ('spellEnergy', 'magicNotes.resistSpellsFeature', '+', '-2');

    } else if(race.indexOf(' Sarcosan') >= 0) {

      adjustment = '+2 charisma/+2 intelligence/-2 wisdom';
      features = ['Quick'];
      notes = [
        'combatNotes.quickFeature:+1 attack w/light weapons',
        'saveNotes.quickFeature:+1 Reflex'
      ];
      selectableFeatures = null;
      rules.defineRule
        ('featCount.General', 'featureNotes.sarcosanFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.sarcosanFeatCountBonus',
        'race', '=', 'source.indexOf("Sarcosan") >= 0 ? 1 : null'
      );
      rules.defineRule('skillNotes.sarcosanSkillPointsBonus',
        'race', '?', 'source.indexOf("Sarcosan") >= 0',
        'level', '=', 'source + 3'
      );
      rules.defineRule('save.Reflex', 'saveNotes.quickFeature', '+', '1');
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

    SRD35.defineRace(rules, race, adjustment, features);
    if(notes != null)
      rules.defineNote(notes);
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        rules.defineChoice('selectableFeatures', selectable + ':' + race);
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + selectable, '+=', null
        );
      }
    }

  }

};

/*
 * Defines the rules related to PC skills. */
LastAge.skillRules = function(rules, skills, subskills) {

  // Let SRD35 handle the basics, then add setting-specific notes and rules
  SRD35.skillRules(rules, skills, subskills);
  var notes = [
    'skillNotes.knowledge(Local)Synergy2:' +
       '+2 Knowledge (Shadow) (local bureaucracy)',
    'skillNotes.knowledge(Nature)Synergy2:+2 Knowledge (Spirits)',
    'skillNotes.knowledge(Spirits)Synergy:+2 Knowledge (Nature)'
  ];
  rules.defineNote(notes);
  rules.defineRule('skillNotes.knowledge(Local)Synergy2',
    'skillModifier.Knowledge (Local)', '=', 'source >= 5 ? 1 : null'
  );
  rules.defineRule('skillNotes.knowledge(Nature)Synergy2',
    'skillModifier.Knowledge (Nature)', '=', 'source >= 5 ? 1 : null'
  );
  rules.defineRule('skillModifier.Knowledge (Spirits)',
    'skillNotes.knowledge(Nature)Synergy2', '+', '2'
  );

};

/* Sets #attributes#'s #attribute# attribute to a random value. */
LastAge.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'languages') {
    var attrs = this.applyRules(attributes);
    var choices;
    var howMany =
      attrs.languageCount - ScribeUtils.sumMatching(attrs, /^languages\./);
    if(attrs.race == null || LastAge.racesLanguages[attrs.race] == null) {
      // Allow any non-restricted language
      choices = ScribeUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/)) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else if(LastAge.racesLanguages[attrs.race].indexOf('Any') >= 0) {
      // Allow (at least) any non-restricted language
      choices = ScribeUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/) &&
           LastAge.racesLanguages[attrs.race].indexOf(choices[i]) < 0) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else {
      // Allow only those listed for this race
      choices =
        LastAge.racesLanguages[attrs.race].replace(/:\d*/g, '').split('/');
    }
    while(howMany > 0 && choices.length > 0) {
      var i = ScribeUtils.random(0, choices.length - 1);
      var language = choices[i];
      var attr = 'languages.' + language;
      var currentPoints = attrs[attr] == null ? 0 : attrs[attr];
      var maxPoints = 'Black Tongue/Patrol Sign'.indexOf(language) < 0 ? 3 : 1;
      if(currentPoints < maxPoints) {
        // Maximize half the time; otherwise, randomize
        var addedPoints = ScribeUtils.random(0, 99) < 50 ?
                          maxPoints - currentPoints:
                          ScribeUtils.random(1, maxPoints - currentPoints);
        if(addedPoints > howMany)
          addedPoints = howMany;
        attrs[attr] = currentPoints + addedPoints;
        attributes[attr] =
          (attributes[attr] == null ? 0 : attributes[attr]) + addedPoints;
        howMany -= addedPoints;
      } else {
        choices = choices.slice(0, i).concat(choices.slice(i + 1));
      }
    }
  } else if(attribute == 'spells') {
    // First, take care of fixed spells from, e.g., Magecraft
    SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
    // Find out if the character has any bonus spells
    var attrs = this.applyRules(attributes);
    var spellsKnownBonus = attrs.spellsKnownBonus;
    if(spellsKnownBonus != null) {
      var maxSpellLevel = Math.floor(attrs.maxSpellLevel);
      // Temporarily set prohibit.* attributes to keep SRD35 from assigning
      // spells from schools where the character doesn't have Spellcasting
      for(var a in this.getChoices('schools')) {
        if(attributes['feats.Spellcasting (' + a + ')'] == null)
          attributes['prohibit.' + a] = 1;
      }
      // Allocate bonus spells round-robin among all possible spell levels
      for(var spellLevel = 0; spellLevel <= maxSpellLevel; spellLevel++) {
        attributes['spellsKnown.C' + spellLevel] = 0;
      }
      for(var spellLevel = maxSpellLevel;
          spellsKnownBonus > 0;
          spellLevel = spellLevel > 0 ? spellLevel - 1 : maxSpellLevel,
          spellsKnownBonus--) {
        attributes['spellsKnown.C' + spellLevel] += 1;
      }
      // Let SRD35 pick spells
      SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
      // Now get rid of the temporary attribute assignments
      for(var a in this.getChoices('schools')) {
        delete attributes['prohibit.' + a];
      }
      for(var spellLevel = 0; spellLevel <= maxSpellLevel; spellLevel++) {
        delete attributes['spellsKnown.C' + spellLevel];
      }
    }
  } else {
    SRD35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
};

/* Returns HTML body content for user notes associated with this rule set. */
LastAge.ruleNotes = function() {
  return '' +
    '<h2>LastAge Scribe Module Notes</h2>\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Racial origin choices (e.g., Plains/Urban Sarcosan, Clan/Kurgun\n' +
    '    Dwarf) are absorbed into the list of races.\n' +
    '  </li><li>\n' +
    '    Scribe lists Greater Conjuration and Greater Evocation as separate\n' +
    '    schools and uses Conjuration and Evocation to represent the\n' +
    '    lesser variety.  This simplfies the spell list and treats legate\n' +
    '    and druid spells from these schools as the lesser variety.  It\n' +
    '    also makes the Greater Spellcasting feat moot; use Spellcasting\n' +
    '    (Greater Conjuration) or Spellcasting (Greater Evocation) instead.\n' +
    '  </li><li>\n' +
    '    The rule book uses several feature names multiple times with\n' +
    '    different effects.  For example, the Orc "Cold Resistance" feature\n' +
    '    grants immunity to non-lethal damage and half damage from lethal\n' +
    '    cold, while the Northblooded and Seaborn feature of the same name\n' +
    '    grants damage reduction.  In these cases Scribe uses a different\n' +
    '    name for one of the features in order to remove the ambiguity.\n' +
    '    The renamed features are: Orc "Cold Resistance" (renamed\n' +
    '    "Improved Cold Hardy" to distinguish from the Northblooded and\n' +
    '    Seaborn feature); Chanceborn "Survivor" (renamed "Persistence" to\n' +
    '    distinguish from the Fighter feature); Insurgent Spy "Conceal\n' +
    '    Magic" (renamed "Conceal Aura" to distinguish from the Bane Of\n' +
    '    Legates feature); Pureblood "Skill Mastery" (renamed "Skill\n' +
    '    Fixation" to distinguish from the Wildlander feature); Spellsoul\n' +
    '    "Resistance" (renamed "Improved Spell Resistance" to distinguish\n' +
    '    from other resistance features); Tactician "Coordinated Attack"\n' +
    '    (renamed "Joint Attack" to distinguish from the Wogren Rider\n' +
    '    feature); prestige class "Improved Spellcasting" (split into "Art\n' +
    '    Of Magic" and bonus spells and points to distinguish from the\n' +
    '    Dragonblooded feature).  Also, the Survival bonus granted by the\n' +
    '    Mountainborn "Mountaineer" feature is treated as a separate\n' +
    '    feature ("Mountain Survival") for consistency with the Dwarf\n' +
    '    "Mountaineer" feature.\n' +
    '  </li><li>\n' +
    '    In situations where a feature has very different effects at\n' +
    '    different character levels, Scribe uses a different feature name\n' +
    '    for each effect.  For example, the Giantblooded "Size Features"\n' +
    '    feature is replaced by "Obvious" at level 1, "Large" at level 10,\n' +
    '    and "Extra Reach" at level 20.  Other instances: Ironborn level\n' +
    '    14 "Improved Healing" becomes "Ability Recovery"; Mountaineer\n' +
    '    "Ambush" becomes "Improved Ambush", "Quick Ambush", and "Sniping\n' +
    '    Ambush" at levels 8, 13, and 18; Painless "Retributive Rage"\n' +
    '    becomes "Improved Retributive Rage" at level 14; Steelborn\n' +
    '    "Untouchable" becomes "Improved Untouchable" at level 19;\n' +
    '    Sunderborn "Spirit Sight" becomes "Darkvision", "Magical\n' +
    '    Darkvision", and "See Invisible" at levels 7, 13, and 19;\n' +
    '    Tactician "Aid Another" becomes "Aided Combat Bonus" at level 5;\n' +
    '    Aradil\'s Eye "Alter Ego" becomes "Quick Alteration" and\n' +
    '    "Nonmagical Alteration" at levels 5 and 9; Whisper Adept "Whisper\n' +
    '    Sense" becomes "Whisper Initiative", "Whisper Surprise", "Whisper\n' +
    '    Clairaudience", "Whisper Clairvoyance", and "Whisper Commune" at\n' +
    '    levels 2, 4, 6, 8, and 10.\n' +
    '  </li><li>\n' +
    '    The rule book incorrectly lists Bear\'s Endurance as a spell\n' +
    '    acquired at the level 4 Beast heroic path.  Scribe corrects this\n' +
    '    to Bull\'s Endurance".\n' +
    '  </li><li>\n' +
    '    The Wogren Rider selectable features "Improved Ride By Attack",\n' +
    '    "Improved Spirited Charge", and "Improved Trample" only apply if\n' +
    '    the character already has the corresponding unimproved feat.\n' +
    '    Select the "Ride By Attack", "Spirited Charge", and "Trample"\n' +
    '    selectable features otherwise.\n' +
    '  </li><li>\n' +
    '    The selectable feature list includes "Alertness" and "Improved\n' +
    '    Initiative" directly, instead of the Wildlander "Rapid Response"\n' +
    '    trait that allows a choice between these two feats.  Similarly,\n' +
    '    the selectable feature list separates "Initiative Bonus" from\n' +
    '    "Danger Sense", since "Danger Sense" requires choosing between\n' +
    '    initiative and listen/spot bonuses after level 1.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>\n' +
    '\n' +
    '<h3>Limitations</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Language synergy is not reported.\n' +
    '  </li><li>\n' +
    '    Scribe does not report a validation error for a character with\n' +
    '    pidgin language competence in Courtier or High Elven.  Note that\n' +
    '    the rule book violates this rule by specifying that Orcs have\n' +
    '    pidgin competence in High Elven.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>';
};

// Language synergies:
// Pidgin Colonial or Norther -> Pidgin Erenlander
// Basic Colonial and Norther -> Basic Erenlander
// Basic High Elven -> Pidgin Jungle Mouth
// Basic Halfling -> Pidgin Jungle Mouth
// Basic Jungle Mouth -> Pidgin Halfling
// Basic Colonial -> Pidgin Trader's Tongue
// Basic Erenlander -> Pidgin Trader's Tongue
// Basic Halfling -> Pidgin Trader's Tongue
// Basic High Elven -> Pidgin Trader's Tongue
// Basic Norther -> Pidgin Trader's Tongue
// Basic Old Dwarven -> Pidgin Trader's Tongue
