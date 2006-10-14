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

function MN2EPrestige() {

  if(MN2E.prestigeClassRules != null)
    MN2E.prestigeClassRules();
  var allSelectable = {};
  for(var a in MN2EPrestige.selectableFeatures) {
    var prefix = a.substring(0, 1).toLowerCase() +
                 a.substring(1).replace(/ /g, '');
    var features = MN2EPrestige.selectableFeatures[a].split('/');
    for(var i = 0; i < features.length; i++) {
      selectable = features[i];
      MN2E.defineRule('features.' + selectable,
        'selectableFeatures.' + selectable, '+=', null
      );
      allSelectable[selectable] = '';
    }
  }
  MN2E.defineChoice('selectableFeatures', ScribeUtils.getKeys(allSelectable));
  var existingSpells = MN2E.getChoices('spells');
  for(var i = 0; i < MN2EPrestige.spells.length; i++) {
    var spell = MN2EPrestige.spells[i].split(/:/);
    var name = spell[0];
    var level = spell[1];
    if(existingSpells[name] != null) {
      level = existingSpells[name] + '/' + level;
    }
    MN2E.defineChoice('spells', name + ':' + level);
  }

}

MN2EPrestige.PRESTIGE_CLASSES = [
  'Ancestral Bladebearer', 'Aradil\'s Eye', 'Avenging Knife',
  'Bane Of Legates', 'Druid', 'Elven Raider', 'Freerider', 'Haunted One',
  'Insurgent Spy', 'Smuggler', 'Warrior Alchemist', 'Whisper Adept', 'Wizard',
  'Wogren Rider'
];

// Filled in by the classes that define selectable features/spells.
MN2EPrestige.selectableFeatures = { };
MN2EPrestige.spells = [
];

MN2EPrestige.prestigeClassRules = function() {

  for(var i = 0; i < MN2EPrestige.PRESTIGE_CLASSES.length; i++) {

    var baseAttack, features, hitDie, notes, prerequisites, profArmor,
        profShield, profWeapon, saveFortitude, saveReflex, saveWill,
        skillPoints, skills, spellsKnown, spellsPerDay, spellsPerDayAbility;
    var klass = MN2EPrestige.PRESTIGE_CLASSES[i];

    if(klass == 'Ancestral Bladebearer') {
      continue; // TODO
    } else if(klass == 'Aradil\'s Eye') {
      continue; // TODO
    } else if(klass == 'Avenging Knife') {
      continue; // TODO
    } else if(klass == 'Bane Of Legates') {
      continue; // TODO
    } else if(klass == 'Druid') {
      continue; // TODO
    } else if(klass == 'Elven Raider') {
      continue; // TODO
    } else if(klass == 'Freerider') {
      continue; // TODO
    } else if(klass == 'Haunted One') {
      continue; // TODO
    } else if(klass == 'Insurgent Spy') {
      continue; // TODO
    } else if(klass == 'Smuggler') {
      continue; // TODO
    } else if(klass == 'Warrior Alchemist') {
      continue; // TODO
    } else if(klass == 'Whisper Adept') {
      continue; // TODO
    } else if(klass == 'Wizard') {
      continue; // TODO
    } else if(klass == 'Wogren Rider') {
      continue; // TODO
    } else
      continue;

    MN2E.defineClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites, spellsKnown, spellsPerDay, spellsPerDayAbility);
    if(notes != null)
      MN2E.defineNote(notes);

  }

};
