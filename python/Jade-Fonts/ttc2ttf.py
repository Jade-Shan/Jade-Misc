# coding=utf-8

import sys
import fontforge

fonts = fontforge.fontsInFile(sys.argv[1])
print(fonts)

for fontName in fonts:
    font = fontforge.open('%s(%s)'%(sys.argv[1], fontName))
    font.generate('%s.ttf'%fontName)
    font.close()
