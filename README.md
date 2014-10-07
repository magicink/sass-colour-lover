# sass-colour-lover

Auto-magically generate Sass color variables using palettes from COLOURLovers.

### Installation

**Notice:** The installation process will change once this module is made available over NPM.

#### NPM (recommended)

``` bash
npm install -g sass-colour-lover
```

#### Git

Clone from Github:

``` bash
git clone git@github.com:magicink/sass-colour-lover.git
```

Navigate into the project directory and the build dependencies:

```bash
npm install
```

Build

``` bash
grunt
```

Make global

``` bash
npm link
```

At this point, the `sass-colour-lover` command will be available from your command prompt.

### Usage

There are two ways to use `sass-colour-lover`. The easiest way is go to [COLOURLovers][cl] and copy the address of a palette you like. After that, simply paste the url in as a parameter.

``` bash
sass-colour-lover http://www.colourlovers.com/palette/3508876/Jujubee
```

This produces the following

``` sass
// Palette: Jujubee
// Author: jaymepollock
// http://www.colourlovers.com/palette/3508876/Jujubee

$pomegranate-posey:   rgb(201,11,78);
$down-by-the-sea:     rgb(8,20,52);
$oj:                  rgb(201,132,11);
$royale:              rgb(61,16,96);
$purple-day:          rgb(136,12,114);
```

[cl]: http://www.colourlovers.com