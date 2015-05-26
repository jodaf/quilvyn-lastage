## Midnight plugin for Scribe RPG character sheet generator

The scribe-lastage package bundles modules that extend Scribe to work with
the Midnight campaign setting, applying the rules of the
<a href="http://darknessfalls.leaderdesslok.com/">2nd edition Core Rulebook</a>.

### Requirements

scribe-lastage relies on the core and srd35 modules installed by the
scribe-core package.

### Installation

To use scribe-lastage, unbundle the release package into a plugins/
subdirectory within the Scribe installation directory, then add or uncomment
the 'plugins/LastAge.js' entry in the CUSTOMIZATION_URLS definition in
scribe.html. An entry for 'plugins/LastAgePrestige.js' can also be added or
uncommented to use the Core Rulebook prestige classes. 

### Usage

Once the Pathfinder plugin is installed as described above, start Scribe and
choose Last Age from the Rules menu in the editor window.
