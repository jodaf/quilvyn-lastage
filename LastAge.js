/* $Id: LastAge.js,v 1.80 2007/06/26 06:03:15 Jim Exp $ */

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
 * This module loads the rules from the Midnight Second Edition core rule book.
 * The MN2E function contains methods that load rules for particular
 * parts/chapters of the rule book; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the MN2E rules.  Similarly, the constant fields of MN2E
 * (FEATS, HEROIC_PATHS, etc.) can be manipulated to modify the choices.
 */
function MN2E() {

  var rules = new ScribeRules('Midnight 2nd Edition');
  rules.editorElements = PH35.initialEditorElements();
  rules.defineEditorElement('deity'); // Remove from editor
  rules.defineEditorElement('specialize');
  rules.defineEditorElement('prohibit');
  MN2E.viewer = new ObjectViewer();
  PH35.createViewer(MN2E.viewer);
  rules.defineSheetElement('Deity'); // Remove from sheet
  rules.defineViewer("Standard", MN2E.viewer);
  PH35.abilityRules(rules);
  // MN2E doesn't use the PH35 languages or races, but we call PH35.raceRules
  // anyway to pick up any other rules it defines (e.g., languageCount)
  PH35.raceRules(rules, [], []);
  PH35.classRules(rules, ['Barbarian', 'Rogue']);
  PH35.companionRules(rules, ['Familiar']);
  PH35.skillRules(rules, PH35.SKILLS, PH35.SUBSKILLS);
  PH35.featRules(rules, PH35.FEATS, PH35.SUBFEATS);
  PH35.descriptionRules(rules, PH35.ALIGNMENTS, MN2E.DEITIES, PH35.GENDERS);
  PH35.equipmentRules
    (rules, PH35.ARMORS, PH35.GOODIES, PH35.SHIELDS, PH35.WEAPONS);
  PH35.combatRules(rules);
  PH35.adventuringRules(rules);
  // Hack: PH35.deitiesFavoredWeapons needs to have a setting for Izrador
  // when PH35.magicRules is called to get War domain feature rules correct
  PH35.deitiesFavoredWeapons['Izrador (NE)'] = 'Longsword';
  PH35.magicRules(rules, MN2E.DOMAINS, MN2E.SCHOOLS, []);
  if(window.DMG35 != null && DMG35.npcClassRules != null) {
    DMG35.npcClassRules(rules, DMG35.NPC_CLASSES);
  }

  MN2E.raceRules(rules, MN2E.LANGUAGES, MN2E.RACES);
  MN2E.heroicPathRules(rules, MN2E.HEROIC_PATHS);
  MN2E.classRules(rules, MN2E.CLASSES);
  MN2E.companionRules(rules, MN2E.COMPANIONS);
  MN2E.skillRules(rules, MN2E.SKILLS, MN2E.SUBSKILLS);
  MN2E.featRules(rules, MN2E.FEATS, MN2E.SUBFEATS);
  MN2E.equipmentRules(rules, MN2E.WEAPONS);
  MN2E.magicRules(rules, MN2E.DOMAINS, MN2E.SCHOOLS, MN2E.SPELLS, PH35.SPELLS);
  rules.defineChoice('preset', 'race', 'heroicPath', 'levels');
  for(var i = 0; i < MN2E.RANDOMIZABLE_ATTRIBUTES.length; i++) {
    if(MN2E.RANDOMIZABLE_ATTRIBUTES[i] == 'deity') {
      MN2E.RANDOMIZABLE_ATTRIBUTES = MN2E.RANDOMIZABLE_ATTRIBUTES.slice(0, i).
        concat(MN2E.RANDOMIZABLE_ATTRIBUTES.slice(i + 1));
      break;
    }
  }
  rules.defineChoice('random', MN2E.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = MN2E.randomizeOneAttribute;
  Scribe.addRuleSet(rules);
  MN2E.rules = rules;

}

// Arrays of choices passed to Scribe.
MN2E.CLASSES = [
  'Barbarian', 'Charismatic Channeler', 'Defender', 'Fighter',
  'Hermetic Channeler', 'Legate', 'Rogue', 'Spiritual Channeler', 'Wildlander'
];
MN2E.COMPANIONS = ['Animal Companion', 'Astirax'];
MN2E.DOMAINS = [
  'Death:De', 'Destruction:Dn', 'Evil:Ev', 'Magic:Ma', 'War:Wr'
];
MN2E.DEITIES = ['Izrador (NE):Death/Destruction/Evil/Magic/War', 'None:'];
MN2E.FEATS = [
  'Craft Charm:Item Creation', 'Craft Greater Spell Talisman:Item Creation',
  'Craft Spell Talisman:Item Creation',
  'Devastating Mounted Assault:Fighter Bonus', 'Drive It Deep:Fighter Bonus',
  'Extra Gift:', 'Friendly Agent:', 'Giant Fighter:Fighter Bonus',
  'Herbalist:Item Creation', 'Improvised Weapon:Fighter Bonus',
  'Innate Magic:', 'Inconspicuous:', 'Knife Thrower:Fighter Bonus', 'Lucky:',
  'Magecraft:Channeling', 'Magic Hardened:', 'Natural Healer:',
  'Orc Slayer:Fighter Bonus', 'Quickened Donning:Fighter Bonus',
  'Ritual Magic:Channeling', 'Sarcosan Pureblood:', 'Sense Nexus:',
  'Spellcasting:Channeling/Spellcasting', 'Skill Focus:', 'Spell Knowledge:',
  'Thick Skull:', 'Warrior Of Shadow:', 'Weapon Focus:Fighter',
  'Whispering Awareness:'
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
  'Black Tongue', 'Clan Dwarven', 'Colonial', 'Courtier', 'Erenlander',
  'Halfling', 'High Elven', 'Jungle Mouth', 'Norther', 'Old Dwarven', 'Orcish',
  'Patrol Sign', 'Sylvan', 'Trader\'s Tongue'
];
MN2E.RACES = [
  'Agrarian Halfling', 'Clan Dwarf', 'Clan Raised Dwarrow', 'Clan Raised Dworg',
  'Danisil Raised Elfling', 'Dorn', 'Erenlander', 'Gnome',
  'Gnome Raised Dwarrow', 'Halfling Raised Elfling', 'Jungle Elf',
  'Kurgun Dwarf', 'Kurgun Raised Dwarrow', 'Kurgun Raised Dworg',
  'Nomadic Halfling', 'Orc', 'Plains Sarcosan', 'Sea Elf', 'Snow Elf',
  'Urban Sarcosan', 'Wood Elf'
];
MN2E.RANDOMIZABLE_ATTRIBUTES =
  PH35.RANDOMIZABLE_ATTRIBUTES.concat(['heroicPath']);
MN2E.SCHOOLS = [
  'Abjuration:Abju', 'Conjuration:Conj', 'Divination:Divi', 'Enchantment:Ench',
  'Evocation:Evoc', 'Greater Conjuration:GrCo', 'Greater Evocation:GrEv',
  'Illusion:Illu', 'Necromancy:Necr', 'Transmutation:Tran'
];
MN2E.SKILLS = [
  'Knowledge:int/trained', 'Profession:wis/trained'
];
MN2E.SPELLS = [
  'Acid Fog:C6/Conjuration',
  'Air Walk:C4/Transmutation',
  'Alarm:C1/Abjuration',
  'Alter Self:C2/Transmutation',
  'Analyze Dweomer:C6/Divination',
  'Animal Growth:C5/Transmutation',
  'Animal Messenger:C2/Enchantment',
  'Animal Shapes:C8/Transmutation',
  'Animal Trance:C2/Enchantment',
  'Animate Dead:C4/Necromancy',
  'Animate Objects:C6/Transmutation',
  'Animate Plants:C7/Transmutation',
  'Animate Rope:C1/Transmutation',
  'Antilife Shell:C6/Abjuration',
  'Antimagic Field:C6/Abjuration',
  'Antipathy:C8/Enchantment',
  'Antiplant Shell:C4/Abjuration',
  'Arcane Eye:C4/Divination',
  'Arcane Lock:C2/Abjuration',
  'Arcane Sight:C3/Divination',
  'Assist:C1/Enchantment',
  'Astral Projection:C9/Necromancy',
  'Atonement:C5/Abjuration',
  'Awaken:C5/Transmutation',
  'Baleful Polymorph:C5/Transmutation',
  'Banishment:C7/Abjuration',
  'Barkskin:C2/Transmutation',
  'Bear\'s Endurance:C2/Transmutation',
  'Bestow Curse:C4/Necromancy',
  'Bestow Curse:C4/Transmutation',
  'Bestow Spell:C4/Evocation',
  'Bigby\'s Clenched Fist:C8/Greater Evocation',
  'Bigby\'s Crushing Hand:C9/Greater Evocation',
  'Bigby\'s Forceful Hand:C6/Greater Evocation',
  'Bigby\'s Grasping Hand:C7/Greater Evocation',
  'Bigby\'s Interposing Hand:C5/Greater Evocation',
  'Binding:C8/Enchantment',
  'Blight:C4/Necromancy',
  'Blindness/Deafness:C2/Necromancy',
  'Blur:C2/Illusion',
  'Break Enchantment:C5/Abjuration',
  'Bull\'s Strength:C2/Transmutation',
  'Burial:C1/Transmutation',
  'Burning Hands:C1/Greater Evocation',
  'Call Lightning Storm:C5/Greater Evocation',
  'Call Lightning:C3/Greater Evocation',
  'Calm Animals:C1/Enchantment',
  'Cat\'s Grace:C2/Transmutation',
  'Cause Fear:C1/Necromancy',
  'Chain Lightning:C6/Greater Evocation',
  'Changestaff:C7/Transmutation',
  'Channel Might:C1/Evocation',
  'Charm Animal:C1/Enchantment',
  'Charm Monster:C4/Enchantment',
  'Charm Person:C1/Enchantment',
  'Charm Repair:C3/Transmutation',
  'Chill Metal:C2/Transmutation',
  'Chill Touch:C1/Necromancy',
  'Circle Of Death:C6/Necromancy',
  'Clairaudience/Clairvoyance:C3/Divination',
  'Clone:C8/Necromancy',
  'Cloudkill:C5/Conjuration',
  'Color Spray:C1/Illusion',
  'Command Plants:C4/Transmutation',
  'Command Undead:C2/Necromancy',
  'Commune With Nature:C5/Divination',
  'Comprehend Languages:C1/Divination',
  'Cone Of Cold:C5/Greater Evocation',
  'Confer Power:C2/Transmutation',
  'Confusion:C4/Enchantment',
  'Contact Other Plane:C5/Divination',
  'Contagion:C3/Necromancy',
  'Contingency:C6/Evocation',
  'Continual Flame:C2/Evocation',
  'Control Plants:C8/Transmutation',
  'Control Undead:C7/Necromancy',
  'Control Water:C4/Transmutation',
  'Control Weather:C7/Transmutation',
  'Control Winds:C5/Transmutation',
  'Create Greater Undead:C8/Necromancy',
  'Create Undead:C6/Necromancy',
  'Create Water:C0/Conjuration',
  'Creeping Doom:C7/Greater Conjuration',
  'Crushing Despair:C4/Enchantment',
  'Cure Critical Wounds:C4/Conjuration',
  'Cure Light Wounds:C1/Conjuration',
  'Cure Minor Wounds:C0/Conjuration',
  'Cure Moderate Wounds:C2/Conjuration',
  'Cure Serious Wounds:C3/Conjuration',
  'Dancing Lights:C0/Evocation',
  'Darkness:C2/Evocation',
  'Darkvision:C2/Transmutation',
  'Daylight:C3/Evocation',
  'Daze Monster:C2/Enchantment',
  'Daze:C0/Enchantment',
  'Death Ward:C5/Necromancy',
  'Deep Slumber:C3/Enchantment',
  'Delay Poison:C2/Conjuration',
  'Delayed Blast Fireball:C7/Greater Evocation',
  'Demand:C8/Enchantment',
  'Detect Animals Or Plants:C1/Divination',
  'Detect Astirax:C1/Divination',
  'Detect Chaos:C2/Divination',
  'Detect Evil:C2/Divination',
  'Detect Good:C2/Divination',
  'Detect Law:C2/Divination',
  'Detect Magic:C0/Divination',
  'Detect Poison:C0/Divination',
  'Detect Scrying:C4/Divination',
  'Detect Secret Doors:C1/Divination',
  'Detect Snares And Pits:C1/Divination',
  'Detect Thoughts:C2/Divination',
  'Detect Undead:C1/Divination',
  'Dimensional Anchor:C4/Abjuration',
  'Diminish Plants:C3/Transmutation',
  'Discern Location:C8/Divination',
  'Disguise Ally:C2/Illusion',
  'Disguise Self:C1/Illusion',
  'Disguise Weapon:C1/Illusion',
  'Disintegrate:C6/Transmutation',
  'Dismissal:C5/Abjuration',
  'Dispel Magic:C3/Abjuration',
  'Displacement:C3/Illusion',
  'Disrupt Undead:C0/Necromancy',
  'Dominate Animal:C3/Enchantment',
  'Dominate Monster:C9/Enchantment',
  'Dominate Person:C5/Enchantment',
  'Dream:C5/Illusion',
  'Eagle\'s Splendor:C2/Transmutation',
  'Earthquake:C8/Greater Evocation',
  'Elemental Swarm:C9/Greater Conjuration',
  'Endure Elements:C1/Abjuration',
  'Energy Drain:C9/Necromancy',
  'Enervation:C4/Necromancy',
  'Enlarge Person:C1/Transmutation',
  'Entangle:C1/Transmutation',
  'Erase:C1/Transmutation',
  'Evard\'s Black Tentacles:C4/Conjuration',
  'Expeditious Retreat:C1/Transmutation',
  'Explosive Runes:C3/Abjuration',
  'Eyebite:C6/Necromancy',
  'Fabricate:C5/Transmutation',
  'Faerie Fire:C1/Evocation',
  'False Life:C2/Necromancy',
  'False Vision:C5/Illusion',
  'Far Whisper:C1/Divination',
  'Fear:C4/Necromancy',
  'Feather Fall:C1/Transmutation',
  'Feeblemind:C5/Enchantment',
  'Find The Path:C6/Divination',
  'Finger Of Death:C7/Necromancy',
  'Fire Seeds:C6/Conjuration',
  'Fire Shield:C4/Greater Evocation',
  'Fire Storm:C7/Greater Evocation',
  'Fire Trap:C4/Abjuration',
  'Fireball:C3/Greater Evocation',
  'Flame Arrow:C3/Transmutation',
  'Flame Blade:C2/Greater Evocation',
  'Flame Strike:C4/Greater Evocation',
  'Flaming Sphere:C2/Greater Evocation',
  'Flare:C0/Evocation',
  'Flesh To Stone:C6/Transmutation',
  'Fly:C3/Transmutation',
  'Fog Cloud:C2/Conjuration',
  'Forcecage:C7/Greater Evocation',
  'Foresight:C9/Divination',
  'Fox\'s Cunning:C2/Transmutation',
  'Freedom Of Movement:C4/Abjuration',
  'Freedom Of Movement:C4/Transmutation',
  'Freedom:C9/Abjuration',
  'Gaseous Form:C3/Transmutation',
  'Gate:C9/Greater Conjuration',
  'Geas/Quest:C6/Enchantment',
  'Gentle Repose:C3/Necromancy',
  'Ghost Sound:C0/Illusion',
  'Ghoul Touch:C2/Necromancy',
  'Giant Vermin:C4/Transmutation',
  'Glibness:C3/Transmutation',
  'Glitterdust:C2/Conjuration',
  'Globe Of Invulnerability:C6/Abjuration',
  'Good Hope:C3/Enchantment',
  'Goodberry:C1/Transmutation',
  'Grease:C1/Conjuration',
  'Greater Arcane Sight:C7/Divination',
  'Greater Dispel Magic:C6/Abjuration',
  'Greater Heroism:C6/Enchantment',
  'Greater Invisibility:C4/Illusion',
  'Greater Magic Fang:C3/Transmutation',
  'Greater Magic Weapon:C3/Transmutation',
  'Greater Planar Binding:C8/Greater Conjuration',
  'Greater Prying Eyes:C8/Divination',
  'Greater Restoration:C7/Conjuration',
  'Greater Scrying:C7/Divination',
  'Greater Shadow Conjuration:C7/Illusion',
  'Greater Shadow Evocation:C8/Illusion',
  'Greater Shout:C8/Evocation',
  'Greenshield:C2/Illusion',
  'Guards And Wards:C6/Abjuration',
  'Guidance:C0/Divination',
  'Gust Of Wind:C2/Greater Evocation',
  'Gust Of Wind:C3/Greater Evocation',
  'Halfling Burrow:C3/Transmutation',
  'Hallow:C5/Greater Evocation',
  'Hallucinatory Terrain:C4/Illusion',
  'Halt Undead:C3/Necromancy',
  'Haste:C3/Transmutation',
  'Heal:C7/Conjuration',
  'Heat Metal:C2/Transmutation',
  'Heroes\' Feast:C6/Conjuration',
  'Heroism:C3/Enchantment',
  'Hide From Animals:C1/Abjuration',
  'Hold Animal:C2/Enchantment',
  'Hold Monster:C5/Enchantment',
  'Hold Person:C3/Enchantment',
  'Hold Portal:C1/Abjuration',
  'Horrid Wilting:C8/Necromancy',
  'Hypnotic Pattern:C2/Illusion',
  'Hypnotism:C1/Enchantment',
  'Ice Storm:C4/Greater Evocation',
  'Identify:C1/Divination',
  'Illusory Script:C3/Illusion',
  'Illusory Wall:C4/Illusion',
  'Imprisonment:C9/Abjuration',
  'Incendiary Cloud:C8/Conjuration',
  'Insanity:C7/Enchantment',
  'Insect Plague:C5/Greater Conjuration',
  'Invisibility Sphere:C3/Illusion',
  'Invisibility:C2/Illusion',
  'Iron Body:C8/Transmutation',
  'Ironwood:C6/Transmutation',
  'Jump:C1/Transmutation',
  'Keen Edge:C3/Transmutation',
  'Knock:C2/Transmutation',
  'Know Direction:C0/Divination',
  'Legend Lore:C6/Divination',
  'Leomund\'s Secret Chest:C5/Greater Conjuration',
  'Leomund\'s Secure Shelter:C4/Conjuration',
  'Leomund\'s Tiny Hut:C3/Greater Evocation',
  'Leomund\'s Trap:C2/Illusion',
  'Lesser Confusion:C1/Enchantment',
  'Lesser Geas:C4/Enchantment',
  'Lesser Globe Of Invulnerability:C4/Abjuration',
  'Lesser Planar Binding:C5/Greater Conjuration',
  'Lesser Restoration:C2/Conjuration',
  'Levitate:C2/Transmutation',
  'Lie:C1/Transmutation',
  'Lifetrap:C2/Transmutation',
  'Light:C0/Evocation',
  'Lightning Bolt:C3/Greater Evocation',
  'Liveoak:C6/Transmutation',
  'Locate Creature:C4/Divination',
  'Locate Object:C2/Divination',
  'Lullaby:C0/Enchantment',
  'Mage Armor:C1/Conjuration',
  'Mage Hand:C0/Transmutation',
  'Magic Circle Against Chaos:C3/Abjuration',
  'Magic Circle Against Evil:C3/Abjuration',
  'Magic Circle Against Good:C3/Abjuration',
  'Magic Circle Against Law:C3/Abjuration',
  'Magic Circle Against Shadow:C5/Abjuration',
  'Magic Fang:C1/Transmutation',
  'Magic Jar:C5/Necromancy',
  'Magic Missile:C1/Greater Evocation',
  'Magic Mouth:C1/Illusion',
  'Magic Mouth:C2/Illusion',
  'Magic Stone:C1/Transmutation',
  'Magic Weapon:C1/Transmutation',
  'Major Creation:C5/Conjuration',
  'Major Image:C3/Illusion',
  'Mass Bear\'s Endurance:C6/Transmutation',
  'Mass Bull\'s Strength:C6/Transmutation',
  'Mass Cat\'s Grace:C6/Transmutation',
  'Mass Charm Monster:C8/Enchantment',
  'Mass Cure Critical Wounds:C8/Conjuration',
  'Mass Cure Light Wounds:C5/Conjuration',
  'Mass Cure Moderate Wounds:C6/Conjuration',
  'Mass Cure Serious Wounds:C7/Conjuration',
  'Mass Eagle\'s Splendor:C6/Transmutation',
  'Mass Enlarge Person:C4/Transmutation',
  'Mass Fox\'s Cunning:C6/Transmutation',
  'Mass Hold Monster:C9/Enchantment',
  'Mass Hold Person:C7/Enchantment',
  'Mass Invisibility:C7/Illusion',
  'Mass Owl\'s Wisdom:C6/Transmutation',
  'Mass Reduce Person:C4/Transmutation',
  'Mass Suggestion:C6/Enchantment',
  'Meld Into Stone:C3/Transmutation',
  'Melf\'s Acid Arrow:C2/Conjuration',
  'Mending:C0/Transmutation',
  'Message:C0/Transmutation',
  'Meteor Swarm:C9/Greater Evocation',
  'Mind Blank:C8/Abjuration',
  'Mind Fog:C5/Enchantment',
  'Minor Creation:C4/Conjuration',
  'Minor Image:C2/Illusion',
  'Mirage Arcana:C5/Illusion',
  'Mirror Image:C2/Illusion',
  'Misdirection:C2/Illusion',
  'Mislead:C6/Illusion',
  'Modify Memory:C4/Enchantment',
  'Moment Of Prescience:C8/Divination',
  'Mordenkainen\'s Disjunction:C9/Abjuration',
  'Mordenkainen\'s Faithful Hound:C5/Conjuration',
  'Mordenkainen\'s Lucubration:C6/Transmutation',
  'Mordenkainen\'s Private Sanctum:C5/Abjuration',
  'Mordenkainen\'s Sword:C7/Greater Evocation',
  'Mount:C1/Greater Conjuration',
  'Move Earth:C6/Transmutation',
  'Nature\'s Revelation:C2/Transmutation',
  'Neutralize Poison:C3/Conjuration',
  'Nexus Fuel:C5/Necromancy',
  'Nightmare:C5/Illusion',
  'Nondetection:C3/Abjuration',
  'Nystul\'s Magic Aura:C1/Illusion',
  'Obscure Object:C2/Abjuration',
  'Obscuring Mist:C1/Conjuration',
  'Open/Close:C0/Transmutation',
  'Otiluke\'s Freezing Sphere:C6/Greater Evocation',
  'Otiluke\'s Resilient Sphere:C4/Greater Evocation',
  'Otiluke\'s Telekinetic Sphere:C8/Greater Evocation',
  'Otto\'s Irresistible Dance:C8/Enchantment',
  'Overland Flight:C5/Transmutation',
  'Owl\'s Wisdom:C2/Transmutation',
  'Pass Without Trace:C1/Transmutation',
  'Passwall:C5/Transmutation',
  'Permanent Image:C6/Illusion',
  'Persistent Image:C5/Illusion',
  'Phantasmal Killer:C4/Illusion',
  'Phantom Edge:C1/Transmutation',
  'Phantom Steed:C3/Conjuration',
  'Planar Binding:C6/Greater Conjuration',
  'Plant Growth:C3/Transmutation',
  'Poison:C3/Necromancy',
  'Polar Ray:C8/Greater Evocation',
  'Polymorph Any Object:C8/Transmutation',
  'Polymorph:C4/Transmutation',
  'Power Word, Blind:C7/Enchantment',
  'Power Word, Kill:C9/Enchantment',
  'Power Word, Stun:C8/Enchantment',
  'Prismatic Sphere:C9/Abjuration',
  'Prismatic Spray:C7/Evocation',
  'Prismatic Wall:C8/Abjuration',
  'Produce Flame:C1/Greater Evocation',
  'Programmed Image:C6/Illusion',
  'Project Image:C7/Illusion',
  'Protection From Arrows:C2/Abjuration',
  'Protection From Chaos:C1/Abjuration',
  'Protection From Energy:C3/Abjuration',
  'Protection From Evil:C1/Abjuration',
  'Protection From Good:C1/Abjuration',
  'Protection From Law:C1/Abjuration',
  'Protection From Spells:C8/Abjuration',
  'Prying Eyes:C5/Divination',
  'Pyrotechnics:C2/Transmutation',
  'Rage:C3/Enchantment',
  'Rainbow Pattern:C4/Illusion',
  'Rary\'s Mnemonic Enhancer:C4/Transmutation',
  'Rary\'s Telepathic Bond:C5/Divination',
  'Ray Of Enfeeblement:C1/Necromancy',
  'Ray Of Exhaustion:C3/Necromancy',
  'Ray Of Frost:C0/Conjuration',
  'Read Magic:C0/Divination',
  'Reduce Animal:C2/Transmutation',
  'Reduce Person:C1/Transmutation',
  'Regenerate:C9/Conjuration',
  'Regeneration:C7/Conjuration',
  'Reincarnate:C4/Transmutation',
  'Remove Curse:C4/Abjuration',
  'Remove Disease:C3/Conjuration',
  'Remove Fear:C1/Abjuration',
  'Repel Metal Or Stone:C8/Abjuration',
  'Repel Vermin:C4/Abjuration',
  'Repel Wood:C6/Transmutation',
  'Repulsion:C6/Abjuration',
  'Resist Energy:C2/Abjuration',
  'Resistance:C0/Abjuration',
  'Restoration:C4/Conjuration',
  'Reverse Gravity:C7/Transmutation',
  'Reverse Gravity:C8/Transmutation',
  'Rusting Grasp:C4/Transmutation',
  'Scare:C2/Necromancy',
  'Scintillating Pattern:C8/Illusion',
  'Scorching Ray:C2/Greater Evocation',
  'Screen:C8/Illusion',
  'Scryer\'s Magic:C2/Divination',
  'Scrying:C4/Divination',
  'Sculpt Sound:C3/Transmutation',
  'Secret Page:C3/Transmutation',
  'See Invisibility:C2/Divination',
  'Seeming:C5/Illusion',
  'Sending:C5/Evocation',
  'Sepia Snake Sigil:C3/Conjuration',
  'Sequester:C7/Abjuration',
  'Shades:C9/Illusion',
  'Shadow Conjuration:C4/Illusion',
  'Shadow Evocation:C5/Illusion',
  'Shambler:C9/Conjuration',
  'Shapechange:C9/Transmutation',
  'Shatter:C2/Evocation',
  'Shield:C1/Abjuration',
  'Shillelagh:C1/Transmutation',
  'Shocking Grasp:C1/Greater Evocation',
  'Shout:C4/Evocation',
  'Shrink Item:C3/Transmutation',
  'Silence:C2/Illusion',
  'Silent Image:C1/Illusion',
  'Silver Blood:C2/Transmutation',
  'Silver Storm:C4/Transmutation',
  'Silver Wind:C3/Conjuration',
  'Simulacrum:C7/Illusion',
  'Sleep:C1/Enchantment',
  'Sleet Storm:C3/Conjuration',
  'Slow:C3/Transmutation',
  'Snare:C3/Transmutation',
  'Soften Earth And Stone:C2/Transmutation',
  'Solid Fog:C4/Conjuration',
  'Song Of Discord:C5/Enchantment',
  'Soul Bind:C9/Necromancy',
  'Sound Burst:C2/Evocation',
  'Speak With Animals:C1/Divination',
  'Speak With Plants:C3/Divination',
  'Spectral Hand:C2/Necromancy',
  'Spell Turning:C7/Abjuration',
  'Spellstaff:C6/Transmutation',
  'Spider Climb:C1/Transmutation',
  'Spider Climb:C2/Transmutation',
  'Spike Growth:C3/Transmutation',
  'Spike Stones:C4/Transmutation',
  'Statue:C7/Transmutation',
  'Stinking Cloud:C3/Conjuration',
  'Stone Shape:C4/Transmutation',
  'Stone Soup:C1/Transmutation',
  'Stone Tell:C6/Divination',
  'Stone To Flesh:C6/Transmutation',
  'Stoneskin:C4/Abjuration',
  'Storm Of Vengeance:C9/Greater Conjuration',
  'Suggestion:C3/Enchantment',
  'Summon Instrument:C0/Greater Conjuration',
  'Summon Monster I:C1/Greater Conjuration',
  'Summon Monster II:C2/Greater Conjuration',
  'Summon Monster III:C3/Greater Conjuration',
  'Summon Monster IV:C4/Greater Conjuration',
  'Summon Monster IX:C9/Greater Conjuration',
  'Summon Monster V:C5/Greater Conjuration',
  'Summon Monster VI:C6/Greater Conjuration',
  'Summon Monster VII:C7/Greater Conjuration',
  'Summon Monster VIII:C8/Greater Conjuration',
  'Summon Nature\'s Ally I:C1/Greater Conjuration',
  'Summon Nature\'s Ally II:C2/Greater Conjuration',
  'Summon Nature\'s Ally III:C3/Greater Conjuration',
  'Summon Nature\'s Ally IV:C4/Greater Conjuration',
  'Summon Nature\'s Ally IX:C9/Greater Conjuration',
  'Summon Nature\'s Ally V:C5/Greater Conjuration',
  'Summon Nature\'s Ally VI:C6/Greater Conjuration',
  'Summon Nature\'s Ally VII:C7/Greater Conjuration',
  'Summon Nature\'s Ally VIII:C8/Greater Conjuration',
  'Summon Swarm:C2/Greater Conjuration',
  'Sunbeam:C7/Evocation',
  'Sunburst:C8/Evocation',
  'Symbol Of Death:C8/Necromancy',
  'Symbol Of Fear:C6/Necromancy',
  'Symbol Of Insanity:C8/Enchantment',
  'Symbol Of Pain:C5/Necromancy',
  'Symbol Of Persuasion:C6/Enchantment',
  'Symbol Of Sleep:C5/Enchantment',
  'Symbol Of Stunning:C7/Enchantment',
  'Symbol Of Weakness:C7/Necromancy',
  'Sympathetic Vibration:C6/Evocation',
  'Sympathy:C8/Enchantment',
  'Tasha\'s Hideous Laughter:C2/Enchantment',
  'Telekinesis:C5/Transmutation',
  'Temporal Stasis:C8/Transmutation',
  'Tenser\'s Floating Disk:C1/Greater Evocation',
  'Tenser\'s Transformation:C6/Transmutation',
  'Time Stop:C9/Transmutation',
  'Tongues:C3/Divination',
  'Touch Of Fatigue:C0/Necromancy',
  'Touch Of Idiocy:C2/Enchantment',
  'Transmute Metal To Wood:C7/Transmutation',
  'Transmute Mud To Rock:C5/Transmutation',
  'Transmute Rock To Mud:C5/Transmutation',
  'Trap The Soul:C8/Greater Conjuration',
  'Tree Shape:C2/Transmutation',
  'True Seeing:C6/Divination',
  'True Strike:C1/Divination',
  'Undeath To Death:C6/Necromancy',
  'Undetectable Alignment:C1/Abjuration',
  'Unhallow:C5/Greater Evocation',
  'Unseen Servant:C1/Conjuration',
  'Vampiric Touch:C3/Necromancy',
  'Veil:C6/Illusion',
  'Ventriloquism:C1/Illusion',
  'Virtue:C0/Transmutation',
  'Vision:C7/Divination',
  'Wail Of The Banshee:C9/Necromancy',
  'Wall Of Fire:C4/Greater Evocation',
  'Wall Of Force:C5/Greater Evocation',
  'Wall Of Ice:C4/Greater Evocation',
  'Wall Of Iron:C6/Conjuration',
  'Wall Of Stone:C5/Conjuration',
  'Wall Of Thorns:C5/Conjuration',
  'Warp Wood:C2/Transmutation',
  'Water Breathing:C3/Transmutation',
  'Water Walk:C3/Transmutation',
  'Waves Of Exhaustion:C7/Necromancy',
  'Waves Of Fatigue:C5/Necromancy',
  'Web:C2/Conjuration',
  'Weird:C9/Illusion',
  'Whirlwind:C8/Greater Evocation',
  'Whispering Wind:C2/Transmutation',
  'Wind Walk:C7/Transmutation',
  'Wind Wall:C3/Greater Evocation',
  'Wood Shape:C2/Transmutation',
  'Zone Of Silence:C4/Enchantment'
];
MN2E.SUBFEATS = {
  'Magecraft':'Charismatic/Hermetic/Spiritual',
  // Skill Focus (Profession (Soldier)) available to Leader Of Men Fighters
  'Skill Focus':'Profession (Soldier)',
  'Spellcasting':MN2E.SCHOOLS.join('/').replace(/:[^\/]+/g, ''),
  // Legates w/War domain receive Weapon Focus (Longsword)
  'Weapon Focus':'Longsword'
};
MN2E.SUBSKILLS = {
  'Knowledge':'Old Gods/Shadow/Spirits',
  // Profession (Soldier) available to Leader Of Men Fighters
  'Profession':'Soldier'
};
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
MN2E.racesLanguages = {
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

/* Defines the rules related to MN2E Chapter 3, Core Classes. */
MN2E.classRules = function(rules, classes) {

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

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = ['1:Art Of Magic', '2:Summon Familiar'];
      hitDie = 6;
      notes = [
        'magicNotes.artOfMagicFeature:+1 character level for max spell level',
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
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
        var allSchools = rules.getChoices('schools');
        for(var j = 0; j < allSchools.length; j++) {
          var school = allSchools[j];
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
          'validationNotes.greaterConfidenceSelectableFeature:' +
            'Requires Improved Confidence',
          'validationNotes.greaterFurySelectableFeature:Requires Improved Fury',
          'validationNotes.improvedConfidenceSelectableFeature:' +
            'Requires Inspire Confidence',
          'validationNotes.improvedFurySelectableFeature:Requires Inspire Fury',
          'validationNotes.massSuggestionSelectableFeature:Requires Suggestion',
          'validationNotes.suggestionSelectableFeature:' +
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
        rules.defineRule('validationNotes.greaterConfidenceSelectableFeature',
          'selectableFeatures.Greater Confidence', '=', '-1',
          'features.Improved Confidence', '+', '1'
        );
        rules.defineRule('validationNotes.greaterFurySelectableFeature',
          'selectableFeatures.Greater Fury', '=', '-1',
          'features.Improved Fury', '+', '1'
        );
        rules.defineRule('validationNotes.improvedConfidenceSelectableFeature',
          'selectableFeatures.Improved Confidence', '=', '-1',
          'features.Inspire Confidence', '+', '1'
        );
        rules.defineRule('validationNotes.improvedFurySelectableFeature',
          'selectableFeatures.Improved Fury', '=', '-1',
          'features.Inspire Fury', '+', '1'
        );
        rules.defineRule('validationNotes.massSuggestionSelectableFeature',
          'selectableFeatures.Mass Suggestion', '=', '-1',
          'features.Suggestion', '+', '1'
        );
        rules.defineRule('validationNotes.suggestionSelectableFeature',
          'selectableFeatures.Suggestion', '=', '-1',
          'features.Inspire Fascination', '+', '1'
        );
      } else if(klass == 'Hermetic Channeler') {
        feats = ['Spell Knowledge'];
        var allFeats = PH35.FEATS.concat(MN2E.FEATS);
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
        var allFeats = PH35.FEATS.concat(MN2E.FEATS);
        for(var j = 0; j < allFeats.length; j++) {
          var pieces = allFeats[j].split(':');
          if(pieces[1].indexOf('Item Creation') > 0) {
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
          'validationNotes.confidentEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural',
          'validationNotes.heightenedEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural',
          'validationNotes.powerfulEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural',
          'validationNotes.preciseEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural',
          'validationNotes.specificEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural',
          'validationNotes.universalEffectSelectableFeature:' +
            'Requires Mastery Of Nature, Spirits, or The Unnatural'
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
        rules.defineRule('validationNotes.confidentEffectSelectableFeature',
          'selectableFeatures.Confident Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
        rules.defineRule('validationNotes.heightenedEffectSelectableFeature',
          'selectableFeatures.Heightened Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
        rules.defineRule('validationNotes.powerfulEffectSelectableFeature',
          'selectableFeatures.Powerful Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
        rules.defineRule('validationNotes.preciseEffectSelectableFeature',
          'selectableFeatures.Precise Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
        rules.defineRule('validationNotes.specificEffectSelectableFeature',
          'selectableFeatures.Specific Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
        rules.defineRule('validationNotes.universalEffectSelectableFeature',
          'selectableFeatures.Universal Effect', '=', '-1',
          /^features.Mastery Of (Nature|Spirits|The Unnatural)$/, '+', '1',
          '', 'v', '0'
        );
      }

    } else if(klass == 'Defender') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
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
        'validationNotes.counterattackSelectableFeature:' +
          'Requires Dodge Training/Offensive Training',
        'validationNotes.coverAllySelectableFeature:' +
          'Requires Dodge Training',
        'validationNotes.devastatingStrikeSelectableFeature:' +
          'Requires Grappling Training/Offensive Training',
        'validationNotes.furiousGrappleSelectableFeature:' +
          'Requires Grappling Training/Speed Training',
        'validationNotes.oneWithTheWeaponSelectableFeature:' +
          'Requires Offensive Training',
        'validationNotes.rapidStrikeSelectableFeature:' +
          'Requires Speed Training',
        'validationNotes.retaliatoryStrikeSelectableFeature:' +
          'Requires Dodge Training/Speed Training',
        'validationNotes.strikeAndHoldSelectableFeature:' +
          'Requires Grappling Training',
        'validationNotes.weaponTrapSelectableFeature:' +
          'Requires Dodge Training/Grappling Training'
      ];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
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
      rules.defineRule('validationNotes.counterattackSelectableFeature',
        'selectableFeatures.Counterattack', '=', '-2',
        'features.Dodge Training', '+', '1',
        'features.Offensive Training', '+', '1'
      );
      rules.defineRule('validationNotes.coverAllySelectableFeature',
        'selectableFeatures.Cover Ally', '=', '-1',
        'features.Dodge Training', '+', '1'
      );
      rules.defineRule('validationNotes.devastatingStrikeSelectableFeature',
        'selectableFeatures.Devastating Strike', '=', '-2',
        'features.Grappling Training', '+', '1',
        'features.Offensive Training', '+', '1'
      );
      rules.defineRule('validationNotes.furiousGrappleSelectableFeature',
        'selectableFeatures.Furious Grapple', '=', '-2',
        'features.Grappling Training', '+', '1',
        'features.Speed Training', '+', '1'
      );
      rules.defineRule('validationNotes.oneWithTheWeaponSelectableFeature',
        'selectableFeatures.One With The Weapon', '=', '-1',
        'features.Offensive Training', '+', '1'
      );
      rules.defineRule('validationNotes.rapidStrikeSelectableFeature',
        'selectableFeatures.Rapid Strike', '=', '-1',
        'features.Speed Training', '+', '1'
      );
      rules.defineRule('validationNotes.retaliatoryStrikeSelectableFeature',
        'selectableFeatures.Retaliatory Strike', '=', '-2',
        'features.Dodge Training', '+', '1',
        'features.Speed Training', '+', '1'
      );
      rules.defineRule('validationNotes.strikeAndHoldSelectableFeature',
        'selectableFeatures.Strike And Hold', '=', '-1',
        'features.Grappling Training', '+', '1'
      );
      rules.defineRule('validationNotes.weaponTrapSelectableFeature',
        'selectableFeatures.Weapon Trap', '=', '-2',
        'features.Dodge Training', '+', '1',
        'features.Grappling Training', '+', '1'
      );

    } else if(klass == 'Fighter') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      feats = null;
      features = null;
      hitDie = 10;
      notes = ['skillNotes.adapterFeature:+%V skill points'];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_TOWER;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
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

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
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
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
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

      baseAttack = PH35.ATTACK_BONUS_GOOD;
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
        'skillNotes.trackFeature:Survival to follow creatures at 1/2 speed',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals',
        'skillNotes.wildernessTrapfindingFeature:' +
          'Search to find/Survival to remove DC 20+ traps',
        'validationNotes.animalCompanionSelectableFeature:' +
          'Requires Wild Empathy',
        'validationNotes.camouflageSelectableFeature:' +
          'Requires Skill Mastery/Trackless Step',
        'validationNotes.evasionSelectableFeature:' +
          'Requires Quick Stride/Instinctive Response',
        'validationNotes.hatedFoeSelectableFeature:' +
          'Requires Master Hunter',
        'validationNotes.hideInPlainSightSelectableFeature:Requires Camouflage',
        'validationNotes.huntedByTheShadowSelectableFeature:' +
          'Requires Rapid Response/Sense Dark Magic',
        'validationNotes.improvedEvasionSelectableFeature:Requires Evasion',
        'validationNotes.improvedWoodlandStrideSelectableFeature:' +
          'Requires Woodland Stride/Overland Stride',
        'validationNotes.instinctiveResponseSelectableFeature:' +
          'Requires Rapid Response',
        'validationNotes.overlandStrideSelectableFeature:' +
          'Requires Quick Stride',
        'validationNotes.senseDarkMagicSelectableFeature:' +
          'Requires Master Hunter',
        'validationNotes.slipperyMindSelectableFeature:' +
          'Requires Hunted By The Shadow',
        'validationNotes.tracklessStepSelectableFeature:' +
          'Requires Woodland Stride',
        'validationNotes.trueAimSelectableFeature:' +
          'Requires Skill Mastery/Hated Foe',
        'validationNotes.woodsloreSelectableFeature:' +
          'Requires Wilderness Trapfinding'
      ];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
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
      rules.defineRule('validationNotes.animalCompanionSelectableFeature',
        'selectableFeatures.Animal Companion', '=', '-1',
        'features.Wild Empathy', '+', '1'
      );
      rules.defineRule('validationNotes.camouflageSelectableFeature',
        'selectableFeatures.Camouflage', '=', '-2',
        'features.Skill Mastery', '+', '1',
        'features.Trackless Step', '+', '1'
      );
      rules.defineRule('validationNotes.evasionSelectableFeature',
        'selectableFeatures.Evasion', '=', '-2',
        'features.Quick Stride', '+', '1',
        'features.Instinctive Response', '+', '1'
      );
      rules.defineRule('validationNotes.hatedFoeSelectableFeature',
        'selectableFeatures.Hated Foe', '=', '-1',
        'features.Master Hunter', '+', '1'
      );
      rules.defineRule('validationNotes.hideInPlainSightSelectableFeature',
        'selectableFeatures.Hide In Plain Sight', '=', '-1',
        'features.Camouflage', '+', '1'
      );
      rules.defineRule('validationNotes.huntedByTheShadowSelectableFeature',
        'selectableFeatures.Hunted By The Shadow', '=', '-2',
        'features.Rapid Response', '+', '1',
        'features.Sense Dark Magic', '+', '1'
      );
      rules.defineRule('validationNotes.improvedEvasionSightSelectableFeature',
        'selectableFeatures.Improved Evasion', '=', '-1',
        'features.Evasion', '+', '1'
      );
      rules.defineRule(
        'validationNotes.improvedWoodlandStrideSelectableFeature',
        'selectableFeatures.Improved Woodland Stride', '=', '-2',
        'features.Woodland Stride', '+', '1',
        'features.Overland Stride', '+', '1'
      );
      rules.defineRule('validationNotes.instinctiveResponseSelectableFeature',
        'selectableFeatures.Instinctive Response', '=', '-1',
        'features.Rapid Response', '+', '1'
      );
      rules.defineRule('validationNotes.overlandStrideSelectableFeature',
        'selectableFeatures.Overland Stride', '=', '-1',
        'features.Quick Stride', '+', '1'
      );
      rules.defineRule('validationNotes.senseDarkMagicSelectableFeature',
        'selectableFeatures.Sense Dark Magic', '=', '-1',
        'features.Master Hunter', '+', '1'
      );
      rules.defineRule('validationNotes.slipperyMindSelectableFeature',
        'selectableFeatures.Slippery Mind', '=', '-1',
        'features.Hunted By The Shadow', '+', '1'
      );
      rules.defineRule('validationNotes.tracklessStepSelectableFeature',
        'selectableFeatures.Trackless Step', '=', '-1',
        'features.Woodland Stride', '+', '1'
      );
      rules.defineRule('validationNotes.trueAimSelectableFeature',
        'selectableFeatures.True Aim', '=', '-2',
        'features.Skill Mastery', '+', '1',
        'features.Hated Foe', '+', '1'
      );
      rules.defineRule('validationNotes.woodsloreSelectableFeature',
        'selectableFeatures.Woodslore', '=', '-1',
        'features.Wilderness Trapfinding', '+', '1'
      );

    } else
      continue;

    PH35.defineClass
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
MN2E.companionRules = function(rules, companions) {

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

/*
 * Defines the rules related to MN2E Chapter 5, Player Options/Starting
 * Equipment.
 */
MN2E.equipmentRules = function(rules, weapons) {
  rules.defineChoice('weapons', weapons);
};

/* Defines the rules related to MN2E Chapter 5, Player Options/Feats. */
MN2E.featRules = function(rules, feats, subfeats) {

  // Let PH35 handle the basics, then add MN-specific notes and rules
  PH35.featRules(rules, feats, subfeats);

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
        'validationNotes.craftCharmFeat:Requires Craft 4'
      ];
      rules.defineRule('validationNotes.craftCharmFeat',
        'feats.Craft Charm', '=', '-1',
        /^skillModifier.Craft/, '+', 'source >= 4 ? + 1 : null',
        '', 'v', '0'
      );
    } else if(feat == 'Craft Greater Spell Talisman') {
      notes = [
        'magicNotes.craftGreaterSpellTalismanFeature:' +
          'Talisman reduces spell energy cost of selected school spells by 1',
        'validationNotes.craftGreaterSpellTalismanFeat:' +
          'Requires character level 12/Magecraft/3 Channeling feats'
      ];
      rules.defineRule('validationNotes.craftGreaterSpellTalismanFeat',
        'feats.Craft Greater Spell Talisman', '=', '-113',
        'level', '+', 'source >= 12 ? 100 : null',
        // NOTE: False valid w/multiple Magecraft feats; Magecraft counts as
        // a Channeling feat as well
        /^features\.Magecraft/, '+', '11',
        // 3 Channeling feats
        /^features\.(Ritual Magic|(Greater )?Spellcasting)/, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Craft Spell Talisman') {
      notes = [
        'magicNotes.craftSpellTalismanFeature:' +
          'Talisman reduces spell energy cost of selected spell by 1',
        'validationNotes.craftSpellTalismanFeat:' +
          'Requires Magecraft/Spellcasting/character level 3'
      ];
      rules.defineRule('validationNotes.craftSpellTalismanFeat',
        'feats.Craft Spell Talisman', '=', '-3',
        'levels.Charismatic Channeler', '+', 'source >= 3 ? 1 : null',
        'subfeatCount.Magecraft', '+', '1',
        'subfeatCount.Spellcasting', '+', '1'
      );
    } else if(feat == 'Devastating Mounted Assault') {
      notes = [
       'combatNotes.devastatingMountedAssaultFeature:' +
         'Full attack after mount moves',
       'validationNotes.devastatingMountedAssaultFeat:' +
         'Requires Mounted Combat/Ride 10'
      ];
      rules.defineRule('validationNotes.devastatingMountedAssaultFeat',
        'feats.Devastating Mounted Assault', '=', '-2',
        'feats.Mounted Combat', '+', '1',
        'skillModifier.Ride', '+', 'source >= 10 ? 1 : null'
      );
    } else if(feat == 'Drive It Deep') {
      notes = [
        'combatNotes.driveItDeepFeature:Attack base -attack/+damage',
        'validationNotes.driveItDeepFeat:Requires base attack 1'
      ];
      rules.defineRule('validationNotes.driveItDeepFeat',
        'feats.Drive It Deep', '=', '-1',
        'baseAttack', '+', 'source >= 1 ? 1 : null'
      );
    } else if(feat == 'Extra Gift') {
      notes = [
        'featureNotes.extraGiftFeature:' +
          'Use Master Of Two Worlds/Force Of Personality +4 times/day',
        'validationNotes.extraGiftFeat:' +
          'Requires Charismatic or Spiritual Channeler 4'
      ];
      rules.defineRule('combatNotes.masterOfTwoWorldsFeature',
        'featureNotes.extraGiftFeature', '+', '4'
      );
      rules.defineRule('magicNotes.forceOfPersonalityFeature',
        'featureNotes.extraGiftFeature', '+', '4'
      );
      rules.defineRule('validationNotes.extraGiftFeat',
        'feats.Extra Gift', '=', '-1',
        'levels.Charismatic Channeler', '+', 'source >= 4 ? 1 : null',
        'levels.Spiritual Channeler', '+', 'source >= 4 ? 1 : null',
        '', 'v', '0'
      );
    } else if(feat == 'Friendly Agent') {
      notes = [
        'skillNotes.friendlyAgentFeature:' +
          '+4 Diplomacy (convince allegiance)/Sense Motive (determine ' +
          'allegiance)',
        'validationNotes.friendlyAgentFeat:' +
         'Requires Gnome or Human race/Good alignment'
      ];
      rules.defineRule('validationNotes.friendlyAgentFeat',
        'feats.Friendly Agent', '=', '-2',
        'alignment', '+', 'source.indexOf("Good") >= 0 ? 1 : null',
        'race', '+', 'source.match(/Gnome|Dorn|Erenlander|Sarcosan/) ? 1 : null'
      );
    } else if(feat == 'Giant Fighter') {
      notes = [
        'combatNotes.giantFighterFeature:' +
          '+4 AC/double critical range w/in 30 ft vs. giants',
        'validationNotes.giantFighterFeat:Requires Dodge/Weapon Focus'
      ];
      rules.defineRule('validationNotes.giantFighterFeat',
        'feats.Giant Fighter', '=', '-2',
        'features.Dodge', '+', '1',
        'subfeatCount.Weapon Focus', '+', '1'
      );
    } else if(feat == 'Herbalist') {
      notes = [
        'magicNotes.herbalistFeature:Create herbal concoctions',
        'validationNotes.herbalistFeat:Requires Profession (Herbalist) 4'
      ];
      rules.defineRule('validationNotes.herbalistFeat',
        'feats.Herbalist', '=', '-1',
        'skillModifier.Profession (Herbalist)', '+', 'source >= 4 ? 1 : null'
      );
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
        'validationNotes.innateMagicFeat:Requires Elf or Halfling race'
      ];
      rules.defineRule('highestMagicModifier',
        'charismaModifier', '^=', null,
        'intelligenceModifier', '^=', null,
        'wisdomModifier', '^=', null
      );
      rules.defineRule
        ('magicNotes.innateMagicFeature', 'highestMagicModifier', '=', null);
      rules.defineRule('validationNotes.innateMagicFeat',
        'feats.Innate Magic', '=', '-1',
        'race', '+', 'source.match(/Halfling|Elf/) ? 1 : null'
      );
    } else if(feat == 'Knife Thrower') {
      notes = [
        'combatNotes.knifeThrowerFeature:' +
          '+1 ranged attack/Quickdraw w/racial knife',
        'validationNotes.knifeThrowerFeat:Requires Jungle or Snow Elf race'
      ];
      rules.defineRule('validationNotes.knifeThrowerFeat',
        'feats.Knife Thrower', '=', '-1',
        'race', '+', 'source.match(/(Jungle|Snow) Elf/) ? 1 : null'
      );
    } else if(feat == 'Lucky') {
      notes = ['saveNotes.luckyFeature:+1 from luck charms/spells'];
    } else if((matchInfo = feat.match(/^Magecraft \((.*)\)/)) != null) {
      var tradition = matchInfo[1];
      var note = 'magicNotes.magecraft(' + tradition + ')Feature';
      var ability = tradition == 'Charismatic' ? 'charisma' :
                    tradition == 'Hermetic' ? 'intelligence' : 'wisdom';
      var spellCode = tradition == 'Charismatic' ? 'B' :
                      tradition == 'Hermetic' ? 'W' : 'D';
      notes = [note + ':4 spells/%V spell energy points'];
      rules.defineRule(note, ability + 'Modifier', '=', null);
      rules.defineRule('spellEnergy', note, '+=', null);
      rules.defineRule('spellsKnown.' + spellCode + '0', note, '+=', '3');
      rules.defineRule('spellsKnown.' + spellCode + '1', note, '+=', '1');
    } else if(feat == 'Magic Hardened') {
      notes = [
        'saveNotes.magicHardenedFeature:+2 spell resistance',
        'validationNotes.magicHardenedFeat:Requires Dwarf, Dworg, or Orc race'
      ];
      rules.defineRule
        ('resistance.Spells', 'saveNotes.magicHardenedFeature', '+=', '2');
      rules.defineRule('validationNotes.magicHardenedFeat',
        'feats.Magic Hardened', '=', '-1',
        'race', '+', 'source.match(/Dwarf|Dworg|Orc/) ? 1 : null'
      );
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
        'validationNotes.ritualMagicFeat:Requires Magecraft/Spellcasting'
      ];
      rules.defineRule('validationNotes.ritualMagicFeat',
        'feats.Ritual Magic', '=', '-2',
        'subfeatCount.Magecraft', '+', '1',
        'subfeatCount.Spellcasting', '+', '1'
      );
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
      var note = 'magicNotes.spellcasting(' + school + ')Feature';
      notes = [note + ':May learn school spells/+1 school spell'];
      rules.defineRule('spellsKnownBonus', note, '+=', '1');
      if(school.indexOf('Greater ') == 0) {
        var validNote = 'validationNotes.spellcasting(' + school + ')Feat';
        school = school.replace(/Greater /, '');
        notes = notes.concat([
          validNote + ':Requires Spellcasting (' + school + ')'
        ]);
        rules.defineRule(validNote,
          'feats.' + feat, '=', '-1',
          'features.Spellcasting (' + school + ')', '+', '1'
        );
      }
    } else if(feat == 'Spell Knowledge') {
      notes = [
        'magicNotes.spellKnowledgeFeature:+2 spells',
        'validationNotes.spellKnowledgeFeat:Requires Spellcasting'
      ];
      rules.defineRule('validationNotes.spellKnowledgeFeat',
        'feats.Spell Knowledge', '=', '-1',
        'subfeatCount.Spellcasting', '+', '1'
      );
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
        'validationNotes.warriorOfShadowFeat:Requires Legate 5/charisma 12'
      ];
      rules.defineRule
        ('combatNotes.warriorOfShadowFeature', 'charismaModifier', '=', null);
      rules.defineRule
        ('combatNotes.warriorOfShadowFeature.1', 'charismaModifier', '=', null);
      rules.defineRule('validationNotes.warriorOfShadowFeat',
        'feats.Warrior Of Shadow', '=', '-2',
        'charisma', '+', 'source >= 12 ? 1 : null',
        'levels.Legate', '+', 'source >= 5 ? 1 : null'
      );
    } else if(feat == 'Whispering Awareness') {
      notes = [
        'featureNotes.whisperingAwarenessFeature:' +
          'DC 12 wisdom check to hear Whispering Wood',
        'validationNotes.whisperingAwarenessFeat:' +
         'Requires Elfling or Elf race/wisdom 15'
      ];
      rules.defineRule('validationNotes.whisperingAwarenessFeat',
        'feats.Whispering Awareness', '=', '-2',
        'race', '+', 'source.match(/Elf/) ? 1 : null',
        'wisdom', '+', 'source >= 15 ? 1 : null'
      );
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null) {
      rules.defineNote(notes);
    }
  }

};

/* Defines the rules related to MN2E Chapter 2, Heroic Paths. */
MN2E.heroicPathRules = function(rules, paths) {

  rules.defineChoice('heroicPaths', paths, 'None');
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
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'featureNotes.scentFeature:' +
          'Detect creatures\' presence w/in 30 ft/track by smell',
        'skillNotes.beastialAuraFeature:-10 Handle Animal/no Wild Empathy'
      ];
      selectableFeatures = [
        'Low Light Vision', 'Scent', 'Strength Bonus', 'Constitution Bonus',
        'Dexterity Bonus', 'Wisdom Bonus'
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
      rules.defineRule('mediumViciousAssault',
        'pathLevels.Beast', '=', 'source>=11 ? "d8" : source>=6 ? "d6" : "d4"'
      );
      rules.defineRule('selectableFeatureCount.Beast',
        'pathLevels.Beast', '=',
        'Math.floor(source / 5) + ((source >= 16) ? 2 : 1)'
      );
      rules.defineRule('smallViciousAssault',
        'features.Small', '?', null,
        'mediumViciousAssault', '=', 'PH35.weaponsSmallDamage[source]'
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
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'featureNotes.improvedStonecunningFeature:' +
          'Automatic Search w/in 5 ft of concealed stone door',
        'featureNotes.tremorsenseFeature:' +
          'Detect creatures in contact w/ground w/in 30 ft',
        'skillNotes.stonecunningFeature:' +
          '+2 Search involving stone or metal/automatic check w/in 10 ft'
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
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
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
        '4:Improved Healing', '5:Damage Reduction', '6:Elemental Resistance',
        '9:Indefatigable', '14:Ability Recovery'
      ];
      notes = [
        'combatNotes.abilityRecoveryFeature:Regain 1 point ability damage/hour',
        'combatNotes.damageReductionFeature:%V subtracted from damage taken',
        'combatNotes.improvedHealingFeature:Regain %V HP/hour',
        'combatNotes.ironbornResilienceFeature:Improved hit die',
        'combatNotes.naturalArmorFeature:+%V AC',
        'saveNotes.elementalResistanceFeature:' +
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
        ('resistance.Acid', 'saveNotes.elementalResistanceFeature', '+=', null);
      rules.defineRule
        ('resistance.Cold', 'saveNotes.elementalResistanceFeature', '+=', null);
      rules.defineRule('resistance.Electricity',
        'saveNotes.elementalResistanceFeature', '+=', null
      );
      rules.defineRule
        ('resistance.Fire', 'saveNotes.elementalResistanceFeature', '+=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.fortitudeBonusFeature', '+', null);
      rules.defineRule('saveNotes.elementalResistanceFeature',
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
        'validationNotes.purebloodPath:Requires Erenlander'
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
      rules.defineRule('validationNotes.purebloodPath',
        'pathLevels.Pureblood', '=', '-1',
        'race', '+', 'source == "Erenlander" ? 1 : null'
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
        '1:Dolphin\'s Grace', '2:Deep Lungs', '3:Aquatic Blindsight',
        '4:Aquatic Ally', '10:Aquatic Adaptation', '14:Cold Resistance',
        '17:Aquatic Emissary', '18:Assist Allies'
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
      selectableFeatures = null;
      spellFeatures = [
        '4:Aquatic Ally II', '5:Blur', '8:Aquatic Ally III', '9:Fog Cloud',
        '12:Aquatic Ally IV', '13:Displacement', '16:Aquatic Ally V',
        '20:Aquatic Ally VI'
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
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
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
        'magicNotes.powerWordsFeature:<i>Word of %V</i> %1/day',
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
        'constitutionModifier', '=', 'source + 3'
      );
      rules.defineRule('skillNotes.persuasiveSpeakerFeature',
        'pathLevels.Speaker', '=',
        'source >= 17 ? 8 : source >= 11 ? 6 : source >= 7 ? 4 : 2'
      );

    } else if(path == 'Spellsoul') {

      feats = null;
      features = [
        '1:Untapped Potential', '2:Metamagic Aura',
        '3:Improved Spell Resistance'
      ];
      notes = [
        'magicNotes.metamagicAuraFeature:' +
          '%V others\' spells of up to level %1 w/in 30 ft',
        'magicNotes.untappedPotentialFeature:' +
          'Contribute %V points to others\' spells w/in 30 ft',
        'saveNotes.improvedSpellResistanceFeature:+%V vs. spells'
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
        'saveNotes.improvedSpellResistanceFeature', '+=', null
      );
      rules.defineRule('saveNotes.improvedSpellResistanceFeature',
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
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
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
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
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
  rules.defineEditorElement
    ('heroicPath', 'Heroic Path', 'select-one', 'heroicPaths', 'experience');
  rules.defineSheetElement('Heroic Path', 'Alignment');

};

/* Defines the rules related to MN2E Chapter 5, Player Options/Magic. */
MN2E.magicRules = function(rules, domains, schools, spells, coreSpells) {

  schools = rules.getChoices('schools');
  for(var i = 0; i < spells.length; i++) {
    var pieces = spells[i].split(':');
    var codes = pieces[1].split('/');
    var school = codes[codes.length - 1];
    school = schools[school] != null ? schools[school] : school.substring(0, 4);
    for(var j = 0; j < codes.length - 1; j++) {
      var spell =
        pieces[0] + '(' + codes[j] + ' ' + school + ')';
      rules.defineChoice('spells', spell);
    }
  }
  var domainCodes = {};
  for(var i = 0; i < domains.length; i++) {
    var domainInfo = domains[i].split(':');
    if(domainInfo.length == 2) {
      domainCodes[domainInfo[1]] = ''
    }
  }
  for(var i = 0; i < coreSpells.length; i++) {
    var pieces = coreSpells[i].split(':');
    // Change Cleric spells to Legate
    pieces[1] = pieces[1].replace(/C(\d)/, 'L$1');
    var codes = pieces[1].split('/');
    var school = codes[codes.length - 1];
    school = schools[school] != null ? schools[school] : school.substring(0, 4);
    for(var j = 0; j < codes.length - 1; j++) {
      var code = codes[j];
      // Ignore Bard/Druid/Wizard spells > level 1, all Paladin/Ranger spells
      if(code.match(/(B|D|W)[2-9]|(P|R)\d/))
        continue;
      // Ignore domain spells for domains other than Izrador's
      if(code.match(/..\d/) && domainCodes[code.substring(0, 2)] == null)
        continue;
      var spell =
        pieces[0] + '(' + codes[j] + ' ' + school + ')';
      rules.defineChoice('spells', spell);
    }
  }
  rules.defineRule('casterLevelArcane', 'spellEnergy', '^=', '1');
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

/* Defines the rules related to MN2E Chapter 1, Races of Midnight. */
MN2E.raceRules = function(rules, languages, races) {

  for(var i = 0; i < languages.length; i++) {
    var language = languages[i];
    rules.defineRule('languages.' + language,
      'race', '+=',
      'MN2E.racesLanguages[source] == null ? null : ' +
      'MN2E.racesLanguages[source].indexOf("' + language + ':3") >= 0 ? 3 : ' +
      'MN2E.racesLanguages[source].indexOf("' + language + ':2") >= 0 ? 2 : ' +
      'MN2E.racesLanguages[source].indexOf("' + language + ':1") >= 0 ? 1 : ' +
      'null'
    );
  }
  rules.defineChoice('languages', languages);
  rules.defineRule('languageCount',
    'race', '=',
      'MN2E.racesLanguages[source] == null ? 0 : ' +
      'eval(MN2E.racesLanguages[source].replace(/\\D+/g, "+"))',
    'intelligenceModifier', '+', 'source > 0 ? source : null',
    'skillModifier.Speak Language', '+', '2 * source'
  );
  rules.defineRule('validationNotes.totalLanguages',
    'languageCount', '+=', '-source',
    /^languages\./, '+=', null
  );

  var notes = [
    'skillNotes.favoredRegion:' +
      '%V; Knowledge (Local) is a class skill/+2 Survival/Knowledge (Nature)',
    'skillNotes.illiteracyFeature:Must spend 2 skill points to read/write',
    'validationNotes.totalLanguages:Allocated languages differ from ' +
      'language total by %V'
  ];
  rules.defineNote(notes);
  rules.defineRule('skillNotes.favoredRegion',
    'race', '=', 'MN2E.racesFavoredRegions[source]'
  );
  rules.defineRule('features.Illiteracy', '', '=', '1');
  rules.defineRule
    ('skillModifier.Speak Language', 'skillNotes.illiteracyFeature', '+', '-2');

  for(var i = 0; i < races.length; i++) {

    var race = races[i];
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
      rules.defineRule('featCount.Fighter Bonus',
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
        'Poison Resistance', 'Resilient', 'Slow', 'Spell Resistance',
        'Stone Knowledge'
      ];
      notes = [
        'combatNotes.dwarfFavoredEnemyFeature:+1 attack vs. orc',
        'combatNotes.dwarfFavoredWeaponFeature:+1 attack with axes/hammers',
        'combatNotes.resilientFeature:+2 AC',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'magicNotes.spellResistanceFeature:-2 spell energy',
        'saveNotes.poisonResistanceFeature:+2 vs. poison',
        'saveNotes.spellResistanceFeature:+2 vs. spells',
        'skillNotes.stoneKnowledgeFeature:' +
           '+2 Appraise/Craft involving stone or metal'
      ];
      selectableFeatures = null;
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'race', '^', 'source.indexOf("Dwarf") >= 0 ? 0 : null'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.resilientFeature', '+', '2');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.poisonResistanceFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');
      if(race == 'Clan Dwarf') {
        features = features.concat([
          'Dodge Orcs', 'Know Depth', 'Stability', 'Stonecunning'
        ]);
        notes = notes.concat([
          'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
          'featureNotes.knowDepthFeature:Intuit approximate depth underground',
          'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
          'skillNotes.stonecunningFeature:' +
            '+2 Search involving stone or metal/automatic check w/in 10 ft'
        ]);
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
        'Darkvision', 'Poison Resistance', 'Small', 'Slow', 'Spell Resistance',
        'Sturdy'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'combatNotes.sturdyFeature:+1 AC',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'magicNotes.spellResistanceFeature:-2 spell energy',
        'saveNotes.poisonResistanceFeature:+2 vs. poison',
        'saveNotes.spellResistanceFeature:+2 vs. spells',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass',
        'combatNotes.smallFeature', '+', '1',
        'combatNotes.sturdyFeature', '+', '1'
      );
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.poisonResistanceFeature', '+=', '2');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');
      if(race == 'Clan Raised Dwarrow') {
        features = features.concat([
          'Dodge Orcs', 'Stonecunning', 'Stone Knowledge'
        ]);
        notes = notes.concat([
          'combatNotes.dodgeOrcsFeature:+1 AC vs. orc',
          'skillNotes.stonecunningFeature:' +
            '+2 Search involving stone or metal/automatic check w/in 10 ft',
          'skillNotes.stoneKnowledgeFeature:' +
             '+2 Appraise/Craft involving stone or metal'
        ]);
      } else if(race == 'Gnome Raised Dwarrow') {
        features = features.concat([
          'Natural Riverfolk', 'Natural Swimmer', 'Skilled Trader'
        ]);
        notes = [
          'skillNotes.naturalSwimmerFeature:' +
             'Swim at half speed as move action/hold breath for %V rounds',
          'skillNotes.naturalRiverfolkFeature:' +
            '+2 Perform/Profession (Sailor)/Swim/Use Rope',
          'skillNotes.skilledTraderFeature:' +
            '+2 Appraise/Bluff/Diplomacy/Forgery/Gather Information/' +
            'Profession when smuggling/trading'
        ];
        rules.defineRule
          ('holdBreathMultiplier', 'race', '=', 'source == "Sea Elf" ? 6 : 3');
        rules.defineRule('skillNotes.naturalSwimmerFeature',
          'constitution', '=', 'source',
          'holdBreathMultiplier', '*', null
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
        'Rugged', 'Spell Resistance'
      ];
      notes = [
        'combatNotes.dworgFavoredEnemyFeature:+2 attack vs. orc',
        'combatNotes.minorLightSensitivityFeature:' +
          'DC 15 Fortitude save in sunlight to avoid -1 attack',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'magicNotes.spellResistanceFeature:-2 spell energy',
        'saveNotes.ruggedFeature:+2 all saves',
        'saveNotes.spellResistanceFeature:+2 vs. spells'
      ];
      selectableFeatures = null;
      rules.defineRule
        ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
      rules.defineRule('save.Fortitude', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Reflex', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule('save.Will', 'saveNotes.ruggedFeature', '+', '2');
      rules.defineRule
        ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');
      if(race == 'Clan Raised Dworg') {
        features = features.concat(['Stonecunning']);
        notes = notes.concat([
          'skillNotes.stonecunningFeature:' +
            '+2 Search involving stone or metal/automatic check w/in 10 ft'
        ]);
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
        'Enchantment Resistance', 'Innate Magic', 'Keen Senses',
        'Low Light Vision', 'Natural Channeler', 'Tree Climber'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'magicNotes.innateMagicFeature:' +
          '%V level 0 spells as at-will innate ability',
        'magicNotes.naturalChannelerFeature:+2 spell energy',
        'saveNotes.enchantmentResistanceFeature:+2 vs. enchantments',
        'skillNotes.keenSensesFeature:+2 Listen/Search/Spot',
        'skillNotes.treeClimberFeature:+4 Balance (trees)/Climb (trees)'
      ];
      selectableFeatures = null;
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
          'Improved Natural Swimmer', 'Natural Sailor', 'Natural Swimmer'
        ]);
        notes = notes.concat([
          'skillNotes.improvedNaturalSwimmerFeature:' +
             '+8 special action or avoid hazard/always take 10/run',
          'skillNotes.naturalSailorFeature:' +
            '+2 Craft (ship/sea)/Profession (ship/sea)/Use Rope (ship/sea)',
          'skillNotes.naturalSwimmerFeature:' +
             'Swim at half speed as move action/hold breath for %V rounds'
        ]);
        rules.defineRule
          ('holdBreathMultiplier', 'race', '=', 'source == "Sea Elf" ? 6 : 3');
        rules.defineRule('skillNotes.naturalSwimmerFeature',
          'constitution', '=', 'source',
          'holdBreathMultiplier', '*', null
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
        'Hardy', 'Low Light Vision', 'Natural Riverfolk', 'Natural Swimmer',
        'Natural Trader', 'Slow', 'Small', 'Spell Resistance'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'magicNotes.spellResistanceFeature:-2 spell energy',
        'saveNotes.hardyFeature:+1 Fortitude',
        'saveNotes.spellResistanceFeature:+2 vs. spells',
        'skillNotes.naturalRiverfolkFeature:' +
          '+2 Perform/Profession (Sailor)/Swim/Use Rope',
        'skillNotes.naturalSwimmerFeature:' +
           'Swim at half speed as move action/hold breath for %V rounds',
        'skillNotes.naturalTraderFeature:' +
          '+4 Appraise/Bluff/Diplomacy/Forgery/Gather Information/' +
          'Profession when smuggling/trading',
        'skillNotes.smallFeature:+4 Hide'
      ];
      selectableFeatures = null;
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
      rules.defineRule('save.Fortitude', 'saveNotes.hardyFeature', '+', '1');
      rules.defineRule
        ('holdBreathMultiplier', 'race', '=', 'source == "Sea Elf" ? 6 : 3');
      rules.defineRule('skillNotes.naturalSwimmerFeature',
        'constitution', '=', 'source',
        'holdBreathMultiplier', '*', null
      );
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule
        ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');

    } else if(race.indexOf(' Halfling') >= 0) {

      adjustment = '+2 dexterity/-2 strength';
      features = [
        'Alert Senses', 'Fortunate', 'Graceful', 'Innate Magic',
        'Low Light Vision', 'Slow', 'Small', 'Unafraid'
      ];
      notes = [
        'combatNotes.smallFeature:+1 AC/attack',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
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
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Fear', 'saveNotes.unafraidFeature', '+=', '2');
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
        'Orc Frenzy', 'Spell Resistance'
      ];
      notes = [
        'combatNotes.lightSensitivityFeature:-1 attack in daylight',
        'combatNotes.nightFighterFeature:+1 attack in darkness',
        'combatNotes.orcFrenzyFeature:+1 attack when fighting among 10+ Orcs',
        'combatNotes.orcFavoredEnemyFeature:+1 damage vs. dwarves',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'magicNotes.spellResistanceFeature:-2 spell energy',
        'saveNotes.improvedColdHardyFeature:Immune non-lethal/half lethal',
        'saveNotes.spellResistanceFeature:+2 vs. spells',
        'skillNotes.naturalPredatorFeature:+%V Intimidate'
      ];
      selectableFeatures = null;
      rules.defineRule
        ('resistance.Spell', 'saveNotes.spellResistanceFeature', '+=', '2');
      rules.defineRule
        ('skillNotes.naturalPredatorFeature', 'strengthModifier', '=', null);
      rules.defineRule
        ('spellEnergy', 'magicNotes.spellResistanceFeature', '+', '-2');

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

    PH35.defineRace(rules, race, adjustment, features);
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

/* Defines the rules related to MN2E Chapter 5, Player Options/Skills. */
MN2E.skillRules = function(rules, skills, subskills) {

  // Let PH35 handle the basics, then add MN-specific notes and rules
  PH35.skillRules(rules, skills, subskills);
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
MN2E.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'languages') {
    var attrs = this.applyRules(attributes);
    var choices;
    var howMany =
      attrs.languageCount - ScribeUtils.sumMatching(attrs, /^languages\./);
    if(attrs.race == null || MN2E.racesLanguages[attrs.race] == null) {
      // Allow any non-restricted language
      choices = ScribeUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/)) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else if(MN2E.racesLanguages[attrs.race].indexOf('Any') >= 0) {
      // Allow (at least) any non-restricted language
      choices = ScribeUtils.getKeys(this.getChoices('languages'));
      for(var i = choices.length - 1; i >= 0; i--) {
        if(choices[i].match(/Patrol Sign|Sylvan/) &&
           MN2E.racesLanguages[attrs.race].indexOf(choices[i]) < 0) {
          choices = choices.slice(0, i).concat(choices.slice(i + 1));
        }
      }
    } else {
      // Allow only those listed for this race
      choices = MN2E.racesLanguages[attrs.race].replace(/:\d*/g, '').split('/');
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
    PH35.randomizeOneAttribute.apply(this, [attributes, attribute]);
    // Find out if the character has any bonus spells
    var attrs = this.applyRules(attributes);
    var spellsKnownBonus = attrs.spellsKnownBonus;
    if(spellsKnownBonus != null) {
      var maxSpellLevel = Math.floor(attrs.maxSpellLevel);
      // Temporarily set prohibit.* attributes to keep PH35 from assigning
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
      // Let PH35 pick spells
      PH35.randomizeOneAttribute.apply(this, [attributes, attribute]);
      // Now get rid of the temporary attribute assignments
      for(var a in this.getChoices('schools')) {
        delete attributes['prohibit.' + a];
      }
      for(var spellLevel = 0; spellLevel <= maxSpellLevel; spellLevel++) {
        delete attributes['spellsKnown.C' + spellLevel];
      }
    }
  } else {
    PH35.randomizeOneAttribute.apply(this, [attributes, attribute]);
  }
}

/* Convenience functions that invoke ScribeRules methods on the MN2E rules. */
MN2E.defineChoice = function() {
  return MN2E.rules.defineChoice.apply(MN2E.rules, arguments);
};

MN2E.defineEditorElement = function() {
  return MN2E.rules.defineEditorElement.apply(MN2E.rules, arguments);
};

MN2E.defineNote = function() {
  return MN2E.rules.defineNote.apply(MN2E.rules, arguments);
};

MN2E.defineRule = function() {
  return MN2E.rules.defineRule.apply(MN2E.rules, arguments);
};

MN2E.defineSheetElement = function() {
  return MN2E.rules.defineSheetElement.apply(MN2E.rules, arguments);
};

MN2E.getChoices = function() {
  return MN2E.rules.getChoices.apply(MN2E.rules, arguments);
};

MN2E.isSource = function() {
  return MN2E.rules.isSource.apply(MN2E.rules, arguments);
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
