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

At a minimum, the ID of the palette needs to be passed to `sass-colour-lover`. There are two ways to do this.

The easiest way is go to [COLOURLovers][cl] and copy the address of a palette you like. After that, simply paste the url in as a parameter.

```
sass-colour-lover http://www.colourlovers.com/palette/3508876/Jujubee

# 
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

### Options

`--file=/path/to/file`

Specifies where you would like to save your file.

```
# This produces a file called '-colors.scss'

sass-colour-lover --ids=3143 --file=_colors.scss

# Same file, one directory up

sass-colour-lover --ids=3143 --file=../_colors.scss
```

`--color=(hex|rgb)`

Generate colors in either hexadecimal or RGB formats.

```
sass-colour-lover --ids=72313 --color=hex
```

Generates

``` sass
// Palette: cutty sark.
// Author: bijouloveshues
// http://www.colourlovers.com/palette/72313/cutty_sark.

$earl-grey:              #DBDADD;
$call-bradly:            #51524C;
$landmark-restoration:   #2D3336;
$full-english:           #DDBA47;
$maritime-relic:         #285E7E;
```

### Variable Names

[COLOURLovers][cl] Allows for some pretty gnarly naming conventions that sometimes do not mesh well with Sass. There are likely to be edge cases that haven't been caught. Here are some things that get sanitized by `sass-colour-lover`

#### Names with Leading Numbers

Numbers cannot be used as the first character of a variable name. If detected, an underscore (_) is appended to the start of the variable name.

#### Duplicate Names

If a duplicate name is detected, a simple counter is appended to the end of all variables that share the name.

``` sass
// Palette: That's Not Butter!?!
// Author: retsof
// http://www.colourlovers.com/palette/223567/Thats_Not_Butter!!

$buffered-toast:     rgb(223,162,70);
$buttered-toast:     rgb(253,205,10);
$buttered-toast-1:   rgb(240,240,83);
$buttered-toast-2:   rgb(209,158,102);
$buttered-toast-3:   rgb(216,173,63);
```

#### Names with No Value

Sometimes names are entirely comprised of invalid characters. In which case, the color name is changed to `color`.

#### Names that are crazy

They exist.

``` sass
// Palette: ๓๏ภ๏t๏ภ๏ยร * l๏שє
// Author: -Yonder-
// http://www.colourlovers.com/palette/3508899/๓๏ภ๏t๏ภ๏ยร_*_l๏שє

$turkwer:   rgb(200,214,186);
$anew:      rgb(169,166,157);
$l----l:    rgb(121,73,116);
$l:         rgb(168,203,166);
$l-1:       rgb(159,116,132);
```

[cl]: http://www.colourlovers.com