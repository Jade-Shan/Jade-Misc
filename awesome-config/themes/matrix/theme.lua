-- matrix, awesome3 theme, by ShdB --

--{{{ Main
local awful = require("awful")
awful.util = require("awful.util")

home          = os.getenv("HOME")
config        = awful.util.getdir("config")
shared        = "/usr/share/awesome"
if not awful.util.file_readable(shared .. "/icons/awesome16.png") then
    shared    = "/usr/share/local/awesome"
end
sharedicons   = shared .. "/icons"
sharedthemes  = shared .. "/themes"
themes        = config .. "/themes"
themename     = "/matrix"
if not awful.util.file_readable(themes .. themename .. "/theme.lua") then
  themes = sharedthemes
end
themedir      = themes .. themename

theme = {}

-- 
-- -- You can use your own command to set your wallpaper
-- -- theme.wallpaper_cmd = { "awsetbg /usr/share/awesome/themes/default/background.png" }
-- theme.wallpaper_cmd = { "find $HOME/Pictures/wallpaper -type f -name '*' -print0 | shuf -n1 -z | xargs -0 awsetbg" }
-- 
-- theme.font          = "snap"
theme.font          = "sans 8"
-- 
-- theme.bg_normal     = "#222222"
-- theme.bg_focus      = "#535d6c"
-- theme.bg_urgent     = "#ff0000"
-- theme.bg_minimize   = "#444444"
theme.bg_normal     = "#171717"
theme.bg_focus      = "#171717"
theme.bg_urgent     = "#171717"
theme.bg_minimize   = "#171717"

theme.hilight       = "#ffcc44"

-- theme.fg_normal     = "#aaaaaa"
-- theme.fg_focus      = "#00FF00"
-- theme.fg_urgent     = "#ffffff"
-- theme.fg_minimize   = "#ffffff"
theme.fg_normal     = "#449900"
theme.fg_focus      = "#66FF00"
theme.fg_urgent     = "#cc0000"
theme.fg_minimize   = "#449900"
-- 
-- theme.border_width  = "1"
-- theme.border_normal = "#000000"
-- theme.border_focus  = "#535d6c"
-- theme.border_marked = "#91231c"
theme.border_width  = "1"
theme.border_normal = "#338000"
theme.border_focus  = "#66FF00"
theme.border_marked = "#66FF00"

theme.graph_bg      = "#333333"
theme.graph_center  = "#779900"
theme.graph_end     = "#ff9900"

-- There are other variable sets
-- overriding the default one when
-- defined, the sets are:
-- [taglist|tasklist]_[bg|fg]_[focus|urgent]
-- titlebar_[bg|fg]_[normal|focus]
-- tooltip_[font|opacity|fg_color|bg_color|border_width|border_color]
-- mouse_finder_[color|timeout|animate_timeout|radius|factor]
-- Example:
-- theme.taglist_bg_focus = "#ff0000"

-- Display the taglist squares
theme.taglist_squares = "true"
theme.taglist_squares_sel   = "/usr/share/awesome/themes/default/taglist/squarefw.png"
theme.taglist_squares_unsel = "/usr/share/awesome/themes/default/taglist/squarew.png"
theme.tasklist_floating_icon = "/usr/share/awesome/themes/default/tasklist/floatingw.png"

-- Variables set for theming the menu:
-- menu_[bg|fg]_[normal|focus]
-- menu_[border_color|border_width]
theme.menu_submenu_icon = "/usr/share/awesome/themes/default/submenu.png"
theme.menu_height = "15"
theme.menu_width  = "100"

-- You can add as many variables as
-- you wish and access them by using
-- beautiful.variable in your rc.lua
--theme.bg_widget = "#cc0000"

-- Define the image to load
theme.titlebar_close_button_normal = "/usr/share/awesome/themes/default/titlebar/close_normal.png"
theme.titlebar_close_button_focus  = "/usr/share/awesome/themes/default/titlebar/close_focus.png"

theme.titlebar_ontop_button_normal_inactive = "/usr/share/awesome/themes/default/titlebar/ontop_normal_inactive.png"
theme.titlebar_ontop_button_focus_inactive  = "/usr/share/awesome/themes/default/titlebar/ontop_focus_inactive.png"
theme.titlebar_ontop_button_normal_active = "/usr/share/awesome/themes/default/titlebar/ontop_normal_active.png"
theme.titlebar_ontop_button_focus_active  = "/usr/share/awesome/themes/default/titlebar/ontop_focus_active.png"

theme.titlebar_sticky_button_normal_inactive = "/usr/share/awesome/themes/default/titlebar/sticky_normal_inactive.png"
theme.titlebar_sticky_button_focus_inactive  = "/usr/share/awesome/themes/default/titlebar/sticky_focus_inactive.png"
theme.titlebar_sticky_button_normal_active = "/usr/share/awesome/themes/default/titlebar/sticky_normal_active.png"
theme.titlebar_sticky_button_focus_active  = "/usr/share/awesome/themes/default/titlebar/sticky_focus_active.png"

theme.titlebar_floating_button_normal_inactive = "/usr/share/awesome/themes/default/titlebar/floating_normal_inactive.png"
theme.titlebar_floating_button_focus_inactive  = "/usr/share/awesome/themes/default/titlebar/floating_focus_inactive.png"
theme.titlebar_floating_button_normal_active = "/usr/share/awesome/themes/default/titlebar/floating_normal_active.png"
theme.titlebar_floating_button_focus_active  = "/usr/share/awesome/themes/default/titlebar/floating_focus_active.png"

theme.titlebar_maximized_button_normal_inactive = "/usr/share/awesome/themes/default/titlebar/maximized_normal_inactive.png"
theme.titlebar_maximized_button_focus_inactive  = "/usr/share/awesome/themes/default/titlebar/maximized_focus_inactive.png"
theme.titlebar_maximized_button_normal_active = "/usr/share/awesome/themes/default/titlebar/maximized_normal_active.png"
theme.titlebar_maximized_button_focus_active  = "/usr/share/awesome/themes/default/titlebar/maximized_focus_active.png"

-- -- You can use your own layout icons like this:
-- theme.layout_fairh = "/usr/share/awesome/themes/default/layouts/fairhw.png"
-- theme.layout_fairv = "/usr/share/awesome/themes/default/layouts/fairvw.png"
-- theme.layout_floating  = "/usr/share/awesome/themes/default/layouts/floatingw.png"
-- theme.layout_magnifier = "/usr/share/awesome/themes/default/layouts/magnifierw.png"
-- theme.layout_max = "/usr/share/awesome/themes/default/layouts/maxw.png"
-- theme.layout_fullscreen = "/usr/share/awesome/themes/default/layouts/fullscreenw.png"
-- theme.layout_tilebottom = "/usr/share/awesome/themes/default/layouts/tilebottomw.png"
-- theme.layout_tileleft   = "/usr/share/awesome/themes/default/layouts/tileleftw.png"
-- theme.layout_tile = "/usr/share/awesome/themes/default/layouts/tilew.png"
-- theme.layout_tiletop = "/usr/share/awesome/themes/default/layouts/tiletopw.png"
-- theme.layout_spiral  = "/usr/share/awesome/themes/default/layouts/spiralw.png"
-- theme.layout_dwindle = "/usr/share/awesome/themes/default/layouts/dwindlew.png"
theme.layout_fairh = themedir .. "/layouts/fairh.png"
theme.layout_fairv = themedir .. "/layouts/fairv.png"
theme.layout_floating = themedir .. "/layouts/floating.png"
theme.layout_magnifier = themedir .. "/layouts/magnifier.png"
theme.layout_max = themedir .. "/layouts/max.png"
theme.layout_fullscreen= themedir .. "/layouts/max.png"
theme.layout_tileleft= themedir .. "/layouts/tileleft.png"
theme.layout_tiletop= themedir .. "/layouts/tiletop.png"
theme.layout_spiral = themedir .. "/layouts/spiral.png"
theme.layout_dwindle= themedir .. "/layouts/dwindle.png"
theme.layout_tilebottom = themedir .. "/layouts/tilebottom.png"
theme.layout_tile = themedir .. "/layouts/tile.png"

theme.awesome_icon = "/usr/share/awesome/icons/awesome16.png"

theme.battery = themes .. "/icons/matrix/battery.png"
theme.volume = themes .. "/icons/matrix/volume.png"
theme.muted = themes .. "/icons/matrix/muted.png"
theme.cpu = themes .. "/icons/matrix/cpu.png"
theme.temp = themes .. "/icons/matrix/temp.png"
theme.mail = themes .. "/icons/matrix/mail.png"
theme.mem = themes .. "/icons/matrix/mem.png"
theme.wireless = themes .. "/icons/matrix/wireless.png"
theme.network = themes .. "/icons/matrix/network.png"
theme.netdown = themes .. "/icons/him/down-green.png"
theme.netup = themes .. "/icons/him/up-green.png"
theme.mpd_play = themes .. "/icons/matrix/mpd_play.png"
theme.mpd_pause = themes .. "/icons/matrix/mpd_pause.png"
theme.mpd_stop = themes .. "/icons/matrix/mpd_stop.png"


return theme
