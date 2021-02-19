/*
Copyright 2020, James J. Hayes

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

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the prestige class rules from the Midnight 2E rule book.
 * Member methods can be called independently in order to use a subset of the
 * rules. Similarly, the constant fields of LastAgePrestige (CLASSES,
 * FEATURES, SPELLS) can be manipulated to modify the choices.
 */
function LastAgePrestige() {
  if(window.LastAge == null) {
    alert('The LastAgePrestige module requires the LastAge module');
    return;
  }
  LastAgePrestige.identityRules(LastAge.rules, LastAgePrestige.CLASSES);
  LastAgePrestige.magicRules(LastAge.rules, LastAgePrestige.SPELLS);
  LastAgePrestige.talentRules(LastAge.rules, LastAgePrestige.FEATURES);
}

LastAgePrestige.CLASSES = {
  'Ancestral Bladebearer':
    'Require=' +
      '"baseAttack >= 6","Sum \'features.Weapon Focus\' >= 1",' +
      '"Sum \'features.Weapon Specialization\' >= 1" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Intimidate,Jump,Profession,Ride,' +
      '"Speak Language",Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Tower)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Unbreakable Blade","2:Advance Ancestral Blade",' +
      '"3:Ancestral Watcher","4:Immovable Blade","5:Ancestral Advisor",' +
      '"7:Ancestral Guide","8:Unwavering Blade","9:Ancestral Protector",' +
      '"10:Awaken Ancestral Blade" ' +
    'CasterLevelArcane="levels.Ancestral Bladebearer" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Bladebearer1:3=1;7=2,' +
      'Bladebearer2:5=1;9=2',
  "Aradil's Eye":
    'Require=' +
      'features.Inconspicuous,"race == \'Wood Elf\'","skills.Bluff >= 8",' +
      '"skills.Disguise >= 5","skills.Gather Information >= 8",' +
      '"skills.Hide >= 8","skills.Move Silently >= 5",' +
      '"skills.Sense Motive >= 5","skills.Spot >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,Listen,"Move Silently",' +
      '"Open Lock",Profession,Search,"Sense Motive","Sleight Of Hand",' +
      '"Speak Language",Spot,Survival,Swim,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Alter Ego",1:Mindbond,"2:Spy Initiate","4:Closed Mind",' +
      '"5:Quick Alteration",5:Spy,"6:Hide In Plain Sight","7:Slippery Mind",' +
      '"8:Undetectable Alignment","9:Nonmagical Alteration","10:Master Spy"',
  'Avenging Knife':
    'Require=' +
     '"alignment !~ \'Evil\'","features.Improved Initiative",' +
     'features.Inconspicuous,"features.Sneak Attack","skills.Bluff >= 5",' +
     '"skills.Gather Information >= 5","skills.Hide >= 8",' +
     '"skills.Move Silently >= 8" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,"Decipher Script",Disguise,"Escape Artist",' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently","Open Locak",' +
      'Profession,Search,"Sense Motive","Speak Language",Spot,Swim,Tumble,' +
      '"Use Rope" ' +
    'Features=' +
      '"1:The Drop","2:Security Breach","3:Sneak Attack","4:Target Study",' +
      '"5:Fast Hands","6:Cover Story","7:Stunning Sneak Attack",' +
      '"8:Improved Coup De Grace","9:Still As Stone","10:Death Attack"',
  'Bane Of Legates':
    'Require=' +
      '"features.Iron Will","Sum \'features.Magecraft\' >= 1",' +
      '"skills.Knowledge (Arcana) >= 13","skills.Knowledge (Shadow) >= 8",' +
      '"skills.Spellcraft >= 10","spellEnergy >= 10" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Bluff,Concentration,Craft,Diplomacy,"Handle Animal",Heal,Intimidate,' +
      'Knowledge,Profession,"Sense Motive",Spellcraft,Survival ' +
    'Features=' +
      '"1:Art Of Magic","1:Resist Legate\'s Will","3:See Astirax",' +
      '"4:Counter Legate\'s Will","5:Bonus Spellcasting","6:Bind Astirax",' +
      '"8:Conceal Magic","10:Sundered Spirit"',
  'Druid':
    'Require=' +
      '"features.Magecraft (Spiritual)","Sum \'features.Spellcasting\' >= 1",' +
      '"features.Mastery Of Nature||features.Wild Empathy",' +
      '"skills.Knowledge (Nature) >= 8","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Geography)","Knowledge (Nature)","Knowledge (Spirits)",' +
      'Profession,"Speak Language",Spellcraft,Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Club/Dagger/Longbow/Shortbow/Quarterstaff)",' +
      '"1:Art Of Magic","1:Mastery Of Nature","1:Animal Companion",' +
      '2:Druidcraft,"2:Nature Sense","3:Commune With Nature",' +
      '"5:Find The Way","8:Venom Immunity"',
  'Elven Raider':
    'Require=' +
      '"baseAttack >= 5","features.Point-Blank Shot","features.Rapid Shot",' +
      '"features.Weapon Focus (Composite Longbow)||features.Weapon Focus (Longbow)",' +
      '"race =~ /Elf/","skills.Hide >= 8","skills.Move Silently >= 8",' +
      '"skills.Survival >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Craft,Heal,Hide,Intimidate,Jump,Listen,"Move Silently",' +
      'Profession,Ride,Search,"Speak Language",Spot,Survival,Swim,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)","1:Weapon Proficiency (Simple)",' +
      '"1:Ranged Sneak Attack","2:Improved Sneak Attack","3:Meticulous Aim",' +
      '"4:Intimidating Shot","6:Leaf Reader","7:Disarming Shot",' +
      '"9:Close Combat Archery"',
  'Freerider':
    'Require=' +
      '"baseAttack >= 6","features.Mounted Combat","features.Ride-By Attack",' +
      '"features.Spirited Charge","race =~ /Erenlander|Sarcosan/",' +
      '"skills.Handle Animal >= 4","skills.Ride >= 8","skills.Survival >= 4" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,Diplomacy,"Handle Animal",Jump,Profession,Ride,' +
      '"Speak Language",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Horse Lord","1:Special Mount","2:Mounted Maneuver","4:Spur On",' +
      '"7:Devastating Mounted Assault","7:Improved Mounted Assault",' +
      '"10:Sweeping Strike" ' +
    'Selectables=' +
      '"2:Deft Dodging","2:Dismounting Cut","2:Erratic Attack",' +
      '"2:Hit And Run","2:Wheel About"',
  'Haunted One':
    'Require=' +
      '"Sum \'features.Magecraft\' >= 1",' +
      '"features.Spellcasting (Divination)",' +
      '"features.Spellcasting (Necromancy)","skills.Knowledge (Arcana) >= 8",' +
      '"skills.Knowledge (Spirits) >= 10" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Art Of Magic",1:Seance,2:Spiritcraft,"2:Spirit Manipulation",' +
      '"3:Ghost Sight","5:Spell Focus (Divination)",' +
      '"9:Spell Focus (Necromancy)"',
  'Insurgent Spy':
    'Require=' +
      'features.Inconspicuous,"skills.Bluff >= 8","skills.Diplomacy >= 5",' +
      '"skills.Gather Information >= 8","skills.Sense Motive >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Intimidate,Jump,"Knowledge (Shadow)",' +
      'Listen,"Move Silently","Open Lock",Perform,Profession,Search,' +
      '"Sense Motive","Sleight Of Hand","Speak Language",Spot,Swim,Tumble,' +
      '"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Conceal Aura","1:Shadow Contacts","2:Shadow Speak","3:Sneak Attack"',
  'Smuggler':
    'Require=' +
      '"features.Friendly Agent","skills.Bluff >= 8","skills.Forgery >= 5",' +
      '"skills.Gather Information >= 8","skills.Hide >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=8 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information",Hide,Jump,Listen,"Move Silently","Open Lock",' +
      'Perform,Profession,Search,"Sense Motive","Sleight Of Hand",Spot,' +
      'Swim,Tumble,"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Smuggler\'s Trade","2:Dominant Will","3:Mystifying Speech",' +
      '"4:Information Network","5:Disguise Contraband","10:Slippery Mind" ' +
    'CasterLevelArcane=levels.Smuggler ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Smuggler2:5=1,' +
      'Smuggler4:3=1',
  'Warrior Arcanist':
    'Require=' +
      '"baseAttack >= 4","Sum \'features.Magecraft\' >= 1",' +
      '"Sum \'features.Spellcasting\' >= 1",' +
      '"Sum \'features.Weapon Focus\' >= 1",' +
      '"features.Weapon Proficiency (Medium)","skills.Spellcraft >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Concentration,Craft,Intimidate,Jump,"Knowledge (Arcana)",' +
      'Profession,Ride,"Speak Language",Spellcraft,Swim ' +
    'Features=' +
      '"1:Art Of Magic","1:Armored Casting","1:Channeled Attack",' +
      '"4:Channeled Armor Class","6:Melee Caster","8:Channeled Damage",' +
      '"10:Regenerative Strike"',
  'Whisper Adept':
    'Require=' +
      '"Sum \'features.Magecraft\' >= 1",' +
      '"Sum \'features.Spellcasting\' >= 2",' +
      '"race =~ /Elf/","skills.Knowledge (Nature) >= 8",' +
      '"skills.Knowledge (Spirits) >= 10","skills.Survival >= 8" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Handle Animal",Heal,Knowledge,Profession,' +
      '"Speak Language",Spellcraft,Survival ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Art Of Magic","1:Whisper Sense","2:Whisper Initiative",' +
      '"3:Fell Touch","4:Whisper Surprise","5:Tree Meld",' +
      '"6:Whisper Clairaudience","7:Strength Of The Wood",' +
      '"8:Whisper Clairvoyance","9:Whisper\'s Ward","10:Whisper Commune"',
  'Wizard':
    'Require=' +
      '"features.Magecraft (Hermetic)","Sum \'features.Spellcasting\' >= 2",' +
      '"skills.Knowledge (Arcana) >= 10","skills.Spellcraft >= 10",' +
      '"sumItemCreationFeats >= 1","sumMetamagicFeats >= 1" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Knowledge,Profession,"Speak Language",Spellcraft ' +
    'Features=' +
      '"1:Art Of Magic",1:Wizardcraft,"2:Efficient Study",' +
      '"4:Bonus Spellcasting"',
  'Wogren Rider':
    'Require=' +
      '"features.Mounted Archery","features.Mounted Combat",' +
      '"race =~ /Halfling/","skills.Ride >= 8","skills.Survival >= 4" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Heal,Hide,Jump,Listen,"Move Silently",' +
      'Profession,Ride,"Speak Language",Spot,Survival,Swim ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Weapon Proficiency (Martial)",' +
      '"1:Coordinated Attack","1:Special Mount","3:Speed Mount",' +
      '"5:Mounted Hide","7:Wogren Dodge","9:Wogren\'s Sight" ' +
    'Selectables=' +
      '"2:Improved Mounted Archery","2:Improved Mounted Combat",' +
      '"2:Improved Ride-By Attack","2:Improved Spirited Charge",' +
      '"2:Improved Trample","2:Ride-By Attack","2:Spirited Charge",2:Trample'
};
LastAgePrestige.FEATURES = {
  'Advance Ancestral Blade':
    'Section=combat Note="Unlock %V powers of covenant weapon"',
  'Alter Ego':'Section=feature Note="Transform into %V alter ego"',
  'Ancestral Advisor':'Section=magic Note="<i>Augury</i> via weapon %V/dy"',
  'Ancestral Guide':
    'Section=magic Note="R10\' <i>Detect Secret Doors</i> via weapon at will"',
  'Ancestral Protector':
    'Section=magic Note="Continuous <i>Protection From Arrows</i> via weapon"',
  'Ancestral Watcher':'Section=magic Note="Weapon has continuous <i>Alarm</i>"',
  'Armored Casting':'Section=magic Note="Reduce arcane casting penalty by %V%"',
  'Awaken Ancestral Blade':'Section=combat Note="Weapon becomes intelligent"',
  'Bind Astirax':
    'Section=magic ' +
    'Note="R60\' Astirax bound to current form for %V hr (DC %1 Will neg)"',
  'Channeled Armor Class':
    'Section=magic Note="Use 1 spell energy point to gain +%V AC for 1 rd"',
  'Channeled Attack':
    'Section=magic Note="Use 1 spell energy point to gain +%V attack for 1 rd"',
  'Channeled Damage':
    'Section=magic Note="Use 1 spell energy point to gain +%V damage for 1 rd"',
  'Close Combat Archery':
    'Section=combat Note="Use bow w/out foe AOO; use arrows as light weapons"',
  'Closed Mind':'Section=save Note="Second +4 Will save to reveal spy network"',
  'Commune With Nature':
    'Section=magic Note="<i>Commune With Nature</i> %V/dy"',
  'Conceal Aura':'Section=feature Note="Conceal %V magical auras"',
  'Conceal Magic':
    'Section=magic ' +
    'Note="Spells considered half level for purposes of astirax detection"',
  'Coordinated Attack':
    'Section=combat ' +
    'Note="Rider and mount +2 attack on same target when other hits"',
  "Counter Legate's Will":
    'Section=magic Note="<i>Dispel Magic</i> vs. legates"',
  'Cover Story':
    'Section=skill Note="DC 20 Bluff four consecutive dy to establish alibi"',
  'Death Attack':
    'Section=combat ' +
    'Note="Sneak attack after 3 rd of study causes death or paralysis d6+%1 rd (DC %V Fort neg)"',
  'Deft Dodging':
    'Section=combat Note="+4 self and mount AC on full rd mounted move"',
  'Disarming Shot':'Section=combat Note="Disarm via ranged touch attack"',
  'Disguise Contraband':
    'Section=magic ' +
    'Note="<i>Misdirection</i> on 1\' cu/level of contraband 1 hr/level"',
  'Dismounting Cut':
    'Section=combat Note="Trip attack w/weapon to dismount opponent"',
  'Dominant Will':
    'Section=save ' +
    'Note="+%V Will vs. detection and compulsion spells to reveal activities"',
  'Druidcraft':'Section=magic Note="Energy cost of Druid spells reduced by 1"',
  'Efficient Study':
    'Section=feature ' +
    'Note="XP cost for learning spells and creating magic items reduced by %V%"',
  'Erratic Attack':
    'Section=combat Note="+2 self and mount AC when either attacks"',
  'Fast Hands':'Section=combat Note="+4 Initiative/-2 first rd attack"',
  'Fell Touch':'Section=magic Note="Prevent fallen from becoming Fell or Lost"',
  'Find The Way':'Section=feature Note="%V"',
  'Ghost Sight':'Section=magic Note="<i>See Invisible</i> at will"',
  'Hit And Run':
    'Section=combat Note="Move away from foe after attack w/out foe AOO"',
  'Horse Lord':
    'Section=skill Note="+1 Handle Animal (horse)/+1 Ride (horseback)"',
  'Immovable Blade':'Section=combat Note="Cannot be involuntarily disarmed"',
  'Improved Coup De Grace':
    'Section=combat Note="Max damage from standard action coup de grace"',
  'Improved Mounted Archery':
    'Section=combat ' +
    'Note="No ranged attack penalty when mounted, mounted Rapid Shot"',
  'Improved Mounted Assault':
    'Section=combat Note="No penalty for additional mounted attacks"',
  'Improved Mounted Combat':
    'Section=combat Note="Mounted Combat additional %V times/rd"',
  'Improved Ride-By Attack':'Section=combat Note="Charge in any direction"',
  'Improved Sneak Attack':'Section=combat Note="R%V\' Ranged sneak attack"',
  'Improved Spirited Charge':
    'Section=combat Note="Improved Critical w/charging weapon"',
  'Improved Trample':'Section=combat Note="No foe AOO during overrun"',
  'Information Network':
    'Section=skill ' +
    'Note="Take %V on Gather Information after 1 hr in new locale"',
  'Intimidating Shot':
    'Section=combat ' +
    'Note="Intimidate check after attack w/bonus of half damage"',
  'Leaf Reader':
    'Section=combat ' +
    'Note="DC 10 Spot check to eliminate vegetation concealment"',
  'Master Spy':
    'Section=feature ' +
    'Note="Mindbond to all known Master Spies and those in homeland at will"',
  'Melee Caster':'Section=magic Note="Deliver spell via weapon"',
  'Meticulous Aim':
    'Section=combat Note="+1 critical range for every 2 rd aiming; +%V max"',
  'Mindbond':'Section=feature Note="Telepathic link to mentor 1/dy"',
  'Mounted Hide':'Section=skill Note="Hide while mounted"',
  'Mystifying Speech':'Section=magic Note="DC %V <i>Modify Memory</i> %1/dy"',
  'Nature Sense':
    'Section=skill Note="Identify animals, plants, unsafe food and drink"',
  'Nonmagical Alteration':
    'Section=feature Note="Transform to alter ego as a extraordinary ability"',
  'Quick Alteration':
    'Section=feature Note="Change to alter ego as a full rd action"',
  'Ranged Sneak Attack':
    'Section=combat ' +
    'Note="%Vd6 extra damage when surprising or flanking w/in 30\'"',
  'Regenerative Strike':
    'Section=magic ' +
    'Note="Recover spell energy equal to 2*weapon multiplier on critical hit"',
  "Resist Legate's Will":'Section=save Note="+10 vs. legate magic"',
  'Seance':
    'Section=magic Note="<i>Augury</i>, <i>Legend Lore</i> via spirits %V/dy"',
  'Security Breach':
    'Section=skill Note="Gather Information uncovers chinks in site security"',
  'See Astirax':'Section=feature Note="See astirax as shadowy form"',
  'Shadow Contacts':
    'Section=skill ' +
    'Note="Gather Information obtains %V favor from Shadow minion"',
  'Shadow Speak':
    'Section=skill ' +
    'Note="+%V Bluff, Diplomacy, Intimidate, Sense Motive w/Shadow minions"',
  "Smuggler's Trade":
    'Section=skill ' +
    'Note="+%V or take 10 on Bluff, Disguise, Forgery, Gather Information when smuggling"',
  'Speed Mount':'Section=combat Note="Dismount, mount as free action"',
  'Spirit Manipulation':
    'Section=magic ' +
    'Note="%V chosen Divination or Necromancy spells as spell-like ability 1/dy"',
  'Spiritcraft':
    'Section=magic ' +
    'Note="Divination and Necromancy spell energy cost reduced by 1"',
  'Spur On':'Section=feature Note="Dbl mount speed during charge or dbl move"',
  'Spy':
    'Section=feature ' +
    'Note="%V% chance of help from d3 Aradil\'s Eyes in dire need"',
  'Spy Initiate':
    'Section=feature,skill ' +
    'Note="Services from Elven contacts","+%V Diplomacy (Elves, allies)"',
  'Still As Stone':'Section=skill Note="+10 Hide (infiltration)"',
  'Strength Of The Wood':
    'Section=magic Note="Recover 1 spell energy point/hr while inside tree"',
  'Stunning Sneak Attack':
    'Section=combat Note="Sneak attack stuns foe 1 rd 3/dy (DC %V neg)"',
  'Sundered Spirit':
    'Section=magic Note="Radiates <i>Antimagic Field</i> for divine magic"',
  'Sweeping Strike':
    'Section=combat Note="Attack all threatened foes during mount move"',
  'Target Study':
    'Section=combat ' +
    'Note="Gather Information yields +2 attack and damage or +4 AC vs. chosen foe"',
  'The Drop':'Section=combat Note="+%V attack and damage vs. flat-footed foe"',
  'Tree Meld':'Section=magic Note="Merge into tree"',
  'Unbreakable Blade':'Section=combat Note="Ancestral weapon cannot be harmed"',
  'Undetectable Alignment':
    'Section=magic Note="Continuous <i>Undetectable Alignment</i>"',
  'Unwavering Blade':
    'Section=combat ' +
    'Note="Detect weapon if separated; if unconscious, weapon fights"',
  'Venom Immunity':'Section=save Note="Immune to organic poisons"',
  'Wheel About':
    'Section=combat Note="May make 90 degree turn during mounted charge"',
  "Whisper's Ward":'Section=save Note="Immune to mind-affecting effects"',
  'Whisper Clairaudience':'Section=magic Note="<i>Clairaudience</i> w/in wood"',
  'Whisper Clairvoyance':'Section=magic Note="<i>Clairvoyance</i> w/in wood"',
  'Whisper Commune':'Section=magic Note="<i>Commune With Nature</i> w/in wood"',
  'Whisper Initiative':'Section=combat Note="+2 Initiative"',
  'Whisper Sense':'Section=feature Note="No wisdom check to sense voices"',
  'Whisper Surprise':'Section=combat Note="Cannot be surprised"',
  'Wizardcraft':
    'Section=magic Note="Prepare spells ahead of time for half energy cost"',
  'Wogren Dodge':'Section=combat Note="+2 AC during mounted move"',
  "Wogren's Sight":'Section=feature Note="Blindsense while mounted"'
};
LastAgePrestige.SPELLS = {
  'Alarm':'Level=Bladebearer1',
  'Augury':'Level=Bladebearer2',
  'Detect Secret Doors':'Level=Bladebearer1',
  'Misdirection':'Level=Smuggler2',
  'Modify Memory':'Level=Smuggler5',
  'Protection From Arrows':'Level=Bladebearer2'
};

/* Defines rules related to basic character identity. */
LastAgePrestige.identityRules = function(rules, classes) {
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots']);
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    LastAgePrestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to magic use. */
LastAgePrestige.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules(rules, 'Spell', s, LastAge.SPELLS[s] + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
LastAgePrestige.talentRules = function(rules, features) {
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
LastAgePrestige.classRulesExtra = function(rules, name) {

  var prefix =
    name.substring(0,1).toLowerCase() + name.substring(1).replaceAll(' ', '');

  if(name == 'Ancestral Bladebearer') {

    rules.defineRule('casterLevels.Ancesral Bladebearer',
      'levels.Ancestral Bladebearer', '?', 'source >= 3',
      'level', '=', null
    );
    rules.defineRule('combatNotes.advanceAncestralBlade',
      'levels.Ancestral Bladebearer', '=', 'Math.floor((source + 2) / 4)'
    );
    rules.defineRule('featCount.Fighter',
      'levels.Ancestral Bladebearer', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('magicNotes.ancestralAdvisor',
      'charismaModifier', '=', 'Math.max(source, 1)'
    );

  } else if(name == "Aradil's Eye") {

    rules.defineRule('featureNotes.alterEgo',
      "levels.Aradil's Eye", '=',
      'source >= 7 ? "any" : source >= 3 ? "2 selected" : "1 selected"'
    );
    rules.defineRule
      ('featureNotes.spy', "levels.Aradil's Eye", '=', 'source * 10');
    rules.defineRule('skillNotes.spyInitiate',
      "levels.Aradil's Eye", '=', 'source >= 10 ? 10 : source >= 5 ? 8 : 4'
    );

  } else if(name == 'Avenging Knife') {

    rules.defineRule('combatNotes.deathAttack',
      'levels.Avenging Knife', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.deathAttack.1', 'levels.Avenging Knife', '+=', null);
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Avenging Knife', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('combatNotes.stunningSneakAttack',
      'levels.Avenging Knife', '=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule('combatNotes.theDrop',
      'levels.Avenging Knife', '=', 'Math.floor((source + 2) / 3)'
    );

  } else if(name == 'Bane Of Legates') {

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
      ('magicNotes.bindAstirax', 'levels.Bane Of Legates', '=', null);
    rules.defineRule('magicNotes.bindAstirax.1',
      // 15 + ability modifier; spellDifficultyClass is 10 + abilityModifier
      'features.Bind Astirax', '?', null,
      'spellDifficultyClass.B', '^=', 'source + 5',
      'spellDifficultyClass.D', '^=', 'source + 5',
      'spellDifficultyClass.W', '^=', 'source + 5'
    );
    rules.defineRule('magicNotes.baneOfLegatesSpellsKnown',
      'levels.Bane Of Legates', '=', null
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.baneOfLegatesSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.baneOfLegatesSpellsKnown', '+', null);

  } else if(name == 'Druid') {

    rules.defineRule
      ('combatNotes.masteryOfNature.1', 'druidTurningLevel', '+', null);
    rules.defineRule
      ('combatNotes.masteryOfNature.2', 'druidTurningLevel', '+', null);
    rules.defineRule('companionMasterLevel', 'levels.Druid', '+=', null);
    rules.defineRule('druidTurningLevel',
      'levels.Druid', '+=', 'source / 2',
      'levels.Spiritual Channeler', '*', '2'
    );
    rules.defineRule('featureNotes.findTheWay',
      '', '=', '"Normal movement through undergrowth"',
      'features.Woodland Stride', '=', '"Untrackable outdoors"',
      'features.Trackless Step', '=', '"Continuous <i>Pass Without Trace</i>"'
    );
    rules.defineRule('featureNotes.animalCompanion',
      'levels.Druid', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.communeWithNature',
      'levels.Druid', '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('magicNotes.druidSpellEnergy', 'levels.Druid', '=', null);
    rules.defineRule
      ('magicNotes.druidSpellsKnown', 'levels.Druid', '=', null);
    rules.defineRule('spellEnergy', 'magicNotes.druidSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.druidSpellsKnown', '+', null);
    rules.defineChoice('spells', "Peasant's Rest(D1 Conj)");
    rules.defineChoice('spells', 'Fey Fire(D2 Conj)');

  } else if(name == 'Elven Raider') {

    rules.defineRule('combatNotes.improvedSneakAttack',
      'levels.Elven Raider', '+=', '30 + Math.floor((source + 1) / 3) * 15'
    );
    rules.defineRule('combatNotes.meticulousAim',
      'levels.Elven Raider', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('combatNotes.rangedSneakAttack',
      'levels.Elven Raider', '+=', 'Math.floor((source + 2) / 3)',
      'combatNotes.sneakAttack', '+', null
    );

  } else if(name == 'Freerider') {

    var allFeats = rules.getChoices('feats');
    var feats = [
      'Mounted Archery', 'Sarcosan Pureblood', 'Skill Focus (Ride)',
      'Trample', 'Weapon Focus (Composite Longbow)',
      'Weapon Focus (Sarcosan Lance)', 'Weapon Focus (Scimitar)',
      'Weapon Specialization (Composite Longbow)',
      'Weapon Specialization (Sarcosan Lance)',
      'Weapon Specialization (Scimitar)'
    ];
    for(var i = 0; i < feats.length; i++) {
      var feat = feats[i];
      if(feat in allFeats)
        allFeats[feat] =
          allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
    rules.defineRule('combatNotes.improvedMountedAssault',
      'feats.Devastating Mounted Assault', '?', null
    );
    rules.defineRule('featCount.Freerider',
      'levels.Freerider', '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('selectableFeatureCount.Freerider',
      'levels.Freerider', '=', 'Math.floor((source + 1) / 3)'
    );

  } else if(name == 'Haunted One') {

    rules.defineRule
      ('magicNotes.hauntedOneSpellEnergy', 'levels.Haunted One', '=', null);
    rules.defineRule
      ('magicNotes.hauntedOneSpellsKnown', 'levels.Haunted One', '=', null);
    rules.defineRule('magicNotes.seance',
      'levels.Haunted One', '=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.spiritManipulation',
      'levels.Haunted One', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule
      ('spellEnergy', 'magicNotes.hauntedOneSpellEnergy', '+', null);
    rules.defineRule
      ('spellsKnownBonus', 'magicNotes.hauntedOneSpellsKnown', '+', null);

  } else if(name == 'Insurgent Spy') {

    rules.defineRule('combatNotes.sneakAttack',
      'levels.Insurgent Spy', '+=', 'Math.floor((source - 1) / 2)'
    );
    rules.defineRule
      ('featureNotes.concealAura', 'levels.Insurgent Spy', '=', null);
    rules.defineRule('skillNotes.shadowContacts',
      'levels.Insurgent Spy', '=',
      'source >= 5 ? "incredible" : source >= 3 ? "major" : "minor"'
    );
    rules.defineRule('skillNotes.shadowSpeak',
      'levels.Insurgent Spy', '=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Smuggler') {

    rules.defineRule('magicNotes.mystifyingSpeech',
      'levels.Smuggler', '=', '10 + source',
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.mystifyingSpeech.1',
      'features.Mystifying Speech', '?', null,
      'levels.Smuggler', '=', 'source >= 7 ? 2 : 1'
    );
    rules.defineRule('saveNotes.dominantWill',
      'levels.Smuggler', '=', 'source >= 6 ? 4 : 2'
    );
    rules.defineRule('skillNotes.informationNetwork',
      'levels.Smuggler', '=', 'source >= 7 ? 20 : 10'
    );
    rules.defineRule("skillNotes.smuggler'sTrade",
      'levels.Smuggler', '=', 'Math.floor((source + 1) / 2) * 2'
    );

  } else if(name == 'Warrior Arcanist') {

    rules.defineRule('magicNotes.arcaneSpellFailure',
      'magicNotes.armoredCasting', '+', '-source',
      null, '^', '0'
    );
    rules.defineRule('magicNotes.armoredCasting',
      'levels.Warrior Arcanist', '=', 'Math.floor((source + 1) / 2) * 5'
    );
    rules.defineRule('magicNotes.channeledArmorClass',
      'level', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.channeledAttack',
      'level', '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.channeledDamage',
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

  } else if(name == 'Whisper Adept') {

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

  } else if(name == 'Wizard') {

    rules.defineRule('featCount.Spellcasting',
      'levels.Wizard', '+=', 'source<4 ? null : Math.floor((source - 1) / 3)'
    );
    rules.defineRule('featCount.Wizard',
      'levels.Wizard', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule('featureNotes.efficientStudy',
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

  } else if(name == 'Wogren Rider') {

    rules.defineRule('combatNotes.improvedMountedCombat',
      'dexterityModifier', '=', 'source > 0 ? source : 1'
    );
    rules.defineRule
      ('features.Blindsense', "features.Wogren's Sight", '=', '1');
    rules.defineRule
      ('features.Rapid Shot', 'features.Improved Mounted Archery', '=', '1');
    rules.defineRule('selectableFeatureCount.Wogren Rider',
      'levels.Wogren Rider', '=', 'Math.floor(source / 2)'
    );

  }

};
