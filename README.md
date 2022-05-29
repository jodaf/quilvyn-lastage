## Midnight plugin for the Quilvyn RPG character sheet generator

The quilvyn-lastage package bundles modules that extend Quilvyn to work with
Fantasy Flight's Midnight campaign setting, applying the rules of the
<a href="https://www.drivethrurpg.com/product/2718/Midnight-2nd-Edition-Core-Rulebook">2nd edition Core Rulebook</a>
and the
<a href="https://www.drivethrurpg.com/product/369174/MIDNIGHT--Legacy-of-Darkness?src=hottest">Midnight Legacy of Shady</a> rule book.

### Requirements

quilvyn-lastage relies on the core and srd35 modules installed by the
quilvyn-core package. quilvyn-lastage can also work with the modules installed
by the quilvyn-pathfinder package.

### Installation

To use quilvyn-lastage, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['Midnight Campaign Setting using SRD v3.5 rules'] = {
      url:'plugins/LastAge.js',
      group:'v3.5',
      require:'SRD35.js'
    };
    RULESETS['Midnight Campaign Setting using Pathfinder 1E rules'] = {
      url:'plugins/LastAge.js',
      group:'Pathfinder 1E',
      require:'Pathfinder.js'
    };
    RULESETS['Midnight Legacy of Darkness'] = {
      url:'plugins/MidnightLegacy.js',
      group:'5E',
      require:'SRD5E.js'
    };


### Usage

Once the LastAge plugin is installed as described above, start Quilvyn and
check the box next to "Midnight Campaign Setting using SRD v3.5 rules" and/or
the box next to "Midnight Campaign Setting using Pathfinder 1E rules" from the
rule sets menu in the initial window.
