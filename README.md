# sass-colour-lover

Auto-magically generate Sass color variables using palettes from COLOURLovers.

### Installation

#### NPM (recommended)

```
npm install -g sass-colour-lover
```

#### Git

Clone from Github:

```
git clone git@github.com:magicink/sass-colour-lover.git
```

Navigate into the project directory and the build dependencies:

```bash
npm install
```

Build

```
grunt
```

Make global

```
npm link
```

At this point, the `sass-colour-lover` command will be available from your command prompt.

### Usage

There are two ways to use `sass-colour-lover`. The easiest way is go to [COLOURLovers][cl] and copy the address of a palette you like. After that, simply paste the url in as a parameter.

```
sass-colour-lover http://www.colourlovers.com/palette/3508876/Jujubee
```

This generates a Sass file called `_palette.scss` in the current working directory. The contents of this file appear like this:

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

If you would like to generate Sass variables from multiple palettes, you can use the `--ids=` parameter. Pass the IDs as a comma seperated list.

```
sass-colour-lover --ids=649208,32049,12345
```

The contents of the generated file appear like so:

``` sass
// Palette: Spavian
// Author: Spammy
// http://www.colourlovers.com/palette/12345/Spavian

$ex8at:     rgb(104,119,128);
$phi0phi:   rgb(80,87,91);
$yum:       rgb(88,98,103);
$won7phi:   rgb(104,113,117);
$ine8ey:    rgb(152,164,169);

// Palette: my front porch
// Author: realitybites
// http://www.colourlovers.com/palette/32049/my_front_porch

$codex:                rgb(177,62,31);
$red-light-district:   rgb(140,35,50);
$satisfying-auburn:    rgb(171,72,0);
$spyglass:             rgb(189,124,32);
$doormat:              rgb(113,56,13);

// Palette: thrill worth seeking
// Author: lesaint
// http://www.colourlovers.com/palette/649208/thrill_worth_seeking

$cetiedil:             rgb(115,75,6);
$love-pink:            rgb(186,48,87);
$disposition:          rgb(160,173,62);
$cotyl:                rgb(236,255,92);
$green-clay:           rgb(140,125,28);
```

[cl]: http://www.colourlovers.com