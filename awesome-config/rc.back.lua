-- Standard awesome library
require("awful")
require("awful.autofocus")
require("awful.rules")

-- require("power")           -- Battery Power Control
-- require("volume")          -- Volume contrl
-- require("weather")      -- Weather forecast





-- Create a systray
mysystray = widget({ type = "systray" })

-- Create a wibox for each screen and add it
mywibox = {}
mypromptbox = {}
mylayoutbox = {}
mytaglist = {}
mytaglist.buttons = awful.util.table.join(
                    awful.button({ }, 1, awful.tag.viewonly),
                    awful.button({ modkey }, 1, awful.client.movetotag),
                    awful.button({ }, 3, awful.tag.viewtoggle),
                    awful.button({ modkey }, 3, awful.client.toggletag),
                    awful.button({ }, 4, awful.tag.viewnext),
                    awful.button({ }, 5, awful.tag.viewprev)
                    )
mytasklist = {}
mytasklist.buttons = awful.util.table.join(
                     awful.button({ }, 1, function (c)
                                              if c == client.focus then
                                                  c.minimized = true
                                              else
                                                  if not c:isvisible() then
                                                      awful.tag.viewonly(c:tags()[1])
                                                  end
                                                  -- This will also un-minimize
                                                  -- the client, if needed
                                                  client.focus = c
                                                  c:raise()
                                              end
                                          end),
                     awful.button({ }, 3, function ()
                                              if instance then
                                                  instance:hide()
                                                  instance = nil
                                              else
                                                  instance = awful.menu.clients({ width=250 })
                                              end
                                          end),
                     awful.button({ }, 4, function ()
                                              awful.client.focus.byidx(1)
                                              if client.focus then client.focus:raise() end
                                          end),
                     awful.button({ }, 5, function ()
                                              awful.client.focus.byidx(-1)
                                              if client.focus then client.focus:raise() end
                                          end))

for s = 1, screen.count() do
    -- Create a promptbox for each screen
    mypromptbox[s] = awful.widget.prompt({ layout = awful.widget.layout.horizontal.leftright })
    -- Create an imagebox widget which will contains an icon indicating which layout we're using.
    -- We need one layoutbox per screen.
    mylayoutbox[s] = awful.widget.layoutbox(s)
    mylayoutbox[s]:buttons(awful.util.table.join(
                           awful.button({ }, 1, function () awful.layout.inc(layouts, 1) end),
                           awful.button({ }, 3, function () awful.layout.inc(layouts, -1) end),
                           awful.button({ }, 4, function () awful.layout.inc(layouts, 1) end),
                           awful.button({ }, 5, function () awful.layout.inc(layouts, -1) end)))
    -- Create a taglist widget
    mytaglist[s] = awful.widget.taglist(s, awful.widget.taglist.label.all, mytaglist.buttons)

    -- Create a tasklist widget
    mytasklist[s] = awful.widget.tasklist(function(c)
                                              return awful.widget.tasklist.label.currenttags(c, s)
                                          end, mytasklist.buttons)

    -- Create the wibox
    mywibox[s] = awful.wibox({ position = "top", screen = s })
    -- Add widgets to the wibox - order matters
    mywibox[s].widgets = {
        {
            mylauncher,
            mytaglist[s],
            mypromptbox[s],
            layout = awful.widget.layout.horizontal.leftright
        },
        mylayoutbox[s],
        mytextclock,
				battery_widget,            -- TODO: battery
				-- volume_widget,             -- TODO: volume control
				-- weatherwidget,             -- TODO: weather 
        s == 1 and mysystray or nil,
        mytasklist[s],
        layout = awful.widget.layout.horizontal.rightleft
    }
end
-- }}}

-- {{{ Mouse bindings
root.buttons(awful.util.table.join(
    awful.button({ }, 3, function () mymainmenu:toggle() end),
    awful.button({ }, 4, awful.tag.viewnext),
    awful.button({ }, 5, awful.tag.viewprev)
))
-- }}}

-- {{{ Key bindings
globalkeys = awful.util.table.join(
    awful.key({ modkey,           }, "Left",   awful.tag.viewprev       ),
    awful.key({ modkey,           }, "Right",  awful.tag.viewnext       ),
    awful.key({ modkey,           }, "Escape", awful.tag.history.restore),

    awful.key({ modkey,           }, "j",
        function ()
            awful.client.focus.byidx( 1)
            if client.focus then client.focus:raise() end
        end),
    awful.key({ modkey,           }, "k",
        function ()
            awful.client.focus.byidx(-1)
            if client.focus then client.focus:raise() end
        end),
    awful.key({ modkey,           }, "w", function () mymainmenu:show({keygrabber=true}) end),

    -- Layout manipulation
    awful.key({ modkey, "Shift"   }, "j", function () awful.client.swap.byidx(  1)    end),
    awful.key({ modkey, "Shift"   }, "k", function () awful.client.swap.byidx( -1)    end),
    awful.key({ modkey, "Control" }, "j", function () awful.screen.focus_relative( 1) end),
    awful.key({ modkey, "Control" }, "k", function () awful.screen.focus_relative(-1) end),
    awful.key({ modkey,           }, "u", awful.client.urgent.jumpto),
    awful.key({ modkey,           }, "Tab",
        function ()
            awful.client.focus.history.previous()
            if client.focus then
                client.focus:raise()
            end
        end),

    -- Standard program
    awful.key({ modkey,           }, "Return", function () awful.util.spawn(terminal) end),
    awful.key({ modkey, "Control" }, "r", awesome.restart),
    awful.key({ modkey, "Shift"   }, "q", awesome.quit),

    awful.key({ modkey,           }, "l",     function () awful.tag.incmwfact( 0.05)    end),
    awful.key({ modkey,           }, "h",     function () awful.tag.incmwfact(-0.05)    end),
    awful.key({ modkey, "Shift"   }, "h",     function () awful.tag.incnmaster( 1)      end),
    awful.key({ modkey, "Shift"   }, "l",     function () awful.tag.incnmaster(-1)      end),
    awful.key({ modkey, "Control" }, "h",     function () awful.tag.incncol( 1)         end),
    awful.key({ modkey, "Control" }, "l",     function () awful.tag.incncol(-1)         end),
    awful.key({ modkey,           }, "space", function () awful.layout.inc(layouts,  1) end),
    awful.key({ modkey, "Shift"   }, "space", function () awful.layout.inc(layouts, -1) end),

    awful.key({ modkey, "Control" }, "n", awful.client.restore),

		-- TODO:

		-- lock screen
    awful.key({ modkey,           }, "l",     function () awful.util.spawn("gnome-screensaver-command -a") end),

		-- volume control
		-- awful.key({ }, "XF86AudioMute",        function () togg_volume() end),
		-- awful.key({ }, "XF86AudioRaiseVolume", function () incr_volume() end),
		-- awful.key({ }, "XF86AudioLowerVolume", function () decr_volume() end),

    -- Prompt
    awful.key({ modkey },            "r",     function () mypromptbox[mouse.screen]:run() end),

    awful.key({ modkey }, "x",
              function ()
                  awful.prompt.run({ prompt = "Run Lua code: " },
                  mypromptbox[mouse.screen].widget,
                  awful.util.eval, nil,
                  awful.util.getdir("cache") .. "/history_eval")
              end)
)

clientkeys = awful.util.table.join(
    awful.key({ modkey,           }, "f",      function (c) c.fullscreen = not c.fullscreen  end),
    awful.key({ modkey, "Shift"   }, "c",      function (c) c:kill()                         end),
    awful.key({ modkey, "Control" }, "space",  awful.client.floating.toggle                     ),
    awful.key({ modkey, "Control" }, "Return", function (c) c:swap(awful.client.getmaster()) end),
    awful.key({ modkey,           }, "o",      awful.client.movetoscreen                        ),
    awful.key({ modkey, "Shift"   }, "r",      function (c) c:redraw()                       end),
    awful.key({ modkey,           }, "t",      function (c) c.ontop = not c.ontop            end),
    awful.key({ modkey,           }, "n",
        function (c)
            -- The client currently has the input focus, so it cannot be
            -- minimized, since minimized clients can't have the focus.
            c.minimized = true
        end),
    awful.key({ modkey,           }, "m",
        function (c)
            c.maximized_horizontal = not c.maximized_horizontal
            c.maximized_vertical   = not c.maximized_vertical
        end)
)

-- Compute the maximum number of digit we need, limited to 9
keynumber = 0
for s = 1, screen.count() do
   keynumber = math.min(9, math.max(#tags[s], keynumber));
end

-- Bind all key numbers to tags.
-- Be careful: we use keycodes to make it works on any keyboard layout.
-- This should map on the top row of your keyboard, usually 1 to 9.
for i = 1, keynumber do
    globalkeys = awful.util.table.join(globalkeys,
        awful.key({ modkey }, "#" .. i + 9,
                  function ()
                        local screen = mouse.screen
                        if tags[screen][i] then
                            awful.tag.viewonly(tags[screen][i])
                        end
                  end),
        awful.key({ modkey, "Control" }, "#" .. i + 9,
                  function ()
                      local screen = mouse.screen
                      if tags[screen][i] then
                          awful.tag.viewtoggle(tags[screen][i])
                      end
                  end),
        awful.key({ modkey, "Shift" }, "#" .. i + 9,
                  function ()
                      if client.focus and tags[client.focus.screen][i] then
                          awful.client.movetotag(tags[client.focus.screen][i])
                      end
                  end),
        awful.key({ modkey, "Control", "Shift" }, "#" .. i + 9,
                  function ()
                      if client.focus and tags[client.focus.screen][i] then
                          awful.client.toggletag(tags[client.focus.screen][i])
                      end
                  end))
end

clientbuttons = awful.util.table.join(
    awful.button({ }, 1, function (c) client.focus = c; c:raise() end),
    awful.button({ modkey }, 1, awful.mouse.client.move),
    awful.button({ modkey }, 3, awful.mouse.client.resize))

-- Set keys
root.keys(globalkeys)
-- }}}

-- {{{ Rules
awful.rules.rules = {
    -- All clients will match this rule.
    { rule = { },
      properties = { border_width = beautiful.border_width,
                     border_color = beautiful.border_normal,
                     focus = true,
                     keys = clientkeys,
                     buttons = clientbuttons } },
    -- Set Firefox to always map on tags number 2 of screen 1.
    -- { rule = { class = "Firefox" }, properties = { tag = tags[1][2] } },
    -- Set Firefox to always map on tags number 2 of screen 1.
    -- { rule = { class = "Firefox" }, properties = { tag = tags[screen.count()][2] } },
    -- Set VBox always floating and map on tags number 2 of screen 1.
    -- Set Pidgin to always map on tags number 1 of screen 1.
    -- { rule = { class = "Pidgin" },properties = { tag = tags[screen.count()][1] } },
    -- Set Chrome to always map on tags number 1 of screen 1.
    -- { rule = { class = "google-chrome" }, properties = { tag = tags[screen.count()][1] } },
		-- 设定哪些窗口固定为浮动
    { rule = { class = "Tilda" },     properties = { floating = true } },
    { rule = { class = "Totem" },     properties = { floating = true } },
    { rule = { class = "Smplayer" },  properties = { floating = true } },
    { rule = { class = "MPlayer" },   properties = { floating = true } },
    { rule = { class = "pinentry" },  properties = { floating = true } },
    { rule = { class = "gimp" },      properties = { floating = true } },
    { rule = { class = "Download" },  properties = { floating = true } },
    { rule = { class = "Downloads" }, properties = { floating = true } },
    { rule = { class = "DTA" },       properties = { floating = true } },
    { rule = { class = "Nautilus" },  properties = { floating = true } },
    { rule = { class = "Nautilus" },  properties = { tag = tags[1][3] } },
    { rule = { class = "Pidgin" },    properties = { tag = tags[1][2] } },
    { rule = { class = "google-chrome" }, properties = { tag = tags[1][1] } },
    { rule = { class = "VirtualBox" }, properties = { floating = true } },
    { rule = { class = "VirtualBox" }, properties = { tag = tags[screen.count()][9] } },
}
-- }}}

-- {{{ Signals
-- Signal function to execute when a new client appears.
client.add_signal("manage", function (c, startup)
    -- Add a titlebar
    -- awful.titlebar.add(c, { modkey = modkey })

    -- Enable sloppy focus
    c:add_signal("mouse::enter", function(c)
        if awful.layout.get(c.screen) ~= awful.layout.suit.magnifier
            and awful.client.focus.filter(c) then
            client.focus = c
        end
    end)

    if not startup then
        -- Set the windows at the slave,
        -- i.e. put it at the end of others instead of setting it master.
        -- awful.client.setslave(c)

        -- Put windows in a smart way, only if they does not set an initial position.
        if not c.size_hints.user_position and not c.size_hints.program_position then
            awful.placement.no_overlap(c)
            awful.placement.no_offscreen(c)
        end
    end
end)

client.add_signal("focus", function(c) c.border_color = beautiful.border_focus end)
client.add_signal("unfocus", function(c) c.border_color = beautiful.border_normal end)
-- }}}


-- Autorun programs
autorun = true
autorunApps = 
{ 
	-- "/usr/lib/at-spi/at-spi-registryd", -- AT SPI Registry
	-- "/usr/lib/vino/vino-server --sm-disable", -- Remote Destop Server
	-- "/usr/lib/gnome-user-share/gnome-user-share", -- Personal File Sharing
	-- "/usr/lib/evolution/2.30/evolution-alarm-notify",
	-- "/usr/lib/gnome-disk-utility/gdu-notification-daemon",
	-- "/usr/lib/gnome-session/helpers/gnome-settings-daemon-helper", -- GNOME Settings Daemon Helper
	-- "/usr/bin/gnome-keyring-daemon --start --components=ssh", -- GNOME Keyring: SSH Agent
	-- "/usr/bin/gnome-keyring-daemon --start --components=pkcs11", -- Certificate and Key Storage
	-- "/usr/bin/gnome-keyring-daemon --start --components=secrets", -- GNOME Keyring: Secret Service
	-- "/usr/lib/policykit-1-gnome/polkit-gnome-authentication-agent-1", -- PolicyKit Authentication Agent
	-- "/usr/lib/policykit-1-gnome/polkit-gnome-authentication-agent-1", -- PolicyKit Authentication Agent
	-- Start the preferred visual assistive technology
	-- "gnome-at-visual -s",
	-- "gnome-power-manager",
	-- "xdg-user-dirs-gtk-update",   -- User folders update
	-- "bluetooth-applet",
	-- "system-config-printer-applet" -- Print Queue Applet
	--
	--
	--
	--
	--
	-- "init --user",
	-- "ssh-agent",
	-- "upstart-event-bridge",
	-- "/usr/lib/x86_64-linux-gnu/hud/window-stack-bridge",
	   "/usr/lib/x86_64-linux-gnu/bamf/bamfdaemon",
	   "upstart-file-bridge --daemon --user",
	   "/usr/lib/at-spi2-core/at-spi-bus-launcher",
	   "/usr/lib/at-spi2-core/at-spi2-registryd --use-gnome-session",
	   "/usr/lib/dconf/dconf-service",
	   "/usr/lib/x86_64-linux-gnu/gconf/gconfd-2",
	   "syndaemon -i 1.0 -t -K -R",
	-- "/usr/lib/evolution/evolution-source-registry",
	-- "/usr/lib/telepathy/mission-control-5",
	   "/usr/lib/udisks2/udisksd --no-debug",
	-- "nautilus -n",
	-- "/usr/lib/tracker/tracker-extract",
	-- "/usr/lib/tracker/tracker-miner-fs",
	-- "/usr/lib/tracker/tracker-store",
	-- "/usr/lib/x86_64-linux-gnu/indicator-bluetooth/indicator-bluetooth-service",
	-- "/usr/lib/x86_64-linux-gnu/indicator-power/indicator-power-service",
	-- "/usr/lib/evolution/evolution-calendar-factory",
	-- "/usr/lib/evolution/3.10/evolution-alarm-notify",
	-- "/usr/lib/x86_64-linux-gnu/deja-dup/deja-dup-monitor",
	-- "/usr/bin/seahorse --no-window",
	-- ======================
	-- zeitgeist -- log user operation
	-- ======================
	-- "zeitgeist-datahub",
	-- "/usr/bin/zeitgeist-daemon",
	-- "/usr/lib/x86_64-linux-gnu/zeitgeist-fts",
	-- ======================
	-- dbus
	-- ======================
	"/bin/dbus-daemon --config-file=/etc/at-spi2/accessibility.conf --nofork --print-address 3",
	"dbus-daemon --fork --session --address=unix:abstract=/tmp/dbus-ThWbQUm52X",
	"upstart-dbus-bridge --daemon --system --user --bus-name system",
	"upstart-dbus-bridge --daemon --session --user --bus-name session",
	-- ======================
	-- gvfs
	-- ======================
	-- "/usr/lib/gvfs/gvfsd",
	-- "/usr/lib/gvfs/gvfsd-fuse /run/user/1000/gvfs -f -o big_writes",
	-- "/usr/lib/gvfs/gvfsd-metadata",
	-- "/usr/lib/gvfs/gvfsd-trash --spawner :1.4 /org/gtk/gvfs/exec_spaw/0",
	-- "/usr/lib/gvfs/gvfsd-burn --spawner :1.4 /org/gtk/gvfs/exec_spaw/1",
	-- "/usr/lib/gvfs/gvfs-udisks2-volume-monitor",
	-- "/usr/lib/gvfs/gvfs-afc-volume-monitor",
	-- "/usr/lib/gvfs/gvfs-gphoto2-volume-monitor",
	-- "/usr/lib/gvfs/gvfs-mtp-volume-monitor",
	-- ======================
	-- gnome
	-- ======================
	-- "gnome-session --session=gnome",
	-- "/usr/bin/gnome-shell",
	-- "/usr/lib/gnome-shell/gnome-shell-calendar-server",
	-- "/usr/lib/gnome-online-accounts/goa-daemon",
	"/usr/lib/gnome-settings-daemon/gnome-settings-daemon",  -- "theme open this"
	-- ======================
	-- ibus
	-- ======================
	"/usr/bin/ibus-daemon --daemonize --xim",
	"/usr/lib/ibus/ibus-dconf",
	"/usr/lib/ibus/ibus-ui-gtk3",
	"/usr/lib/ibus/ibus-x11 --kill-daemon",
	"/usr/lib/ibus/ibus-engine-simple",
	"/usr/bin/python /usr/share/ibus-table/engine/main.py --ibus",
	-- ======================
	-- applet
	-- ======================
	-- "gnome-sound-applet",
	"nm-applet --sm-disable",
	"sleep 15; gnome-screensaver",
	-- ======================
	-- programe
	-- ======================
	-- "update-notifier",
	"mail-notification",
	"blueman-applet",              -- bluetooth manager
  "pidgin",                      -- Pidgin
	"tilda",
	"shutter --min_at_startup",
	"nautilus",
	"bash /opt/quickstart/conky.sh",
	"/opt/quickstart/changwallpaper.sh", -- change wallpaper random
}

function run_once(cmd)
  findme = cmd
  firstspace = cmd:find(" ")
  if firstspace then
    findme = cmd:sub(0, firstspace-1)
  end
  awful.util.spawn_with_shell("pgrep -u $USER -x " .. findme .. " > /dev/null || (" .. cmd .. ")")
end
if autorun then
    for app = 1, #autorunApps do
        run_once(autorunApps[app])
    end
end

-- }}}
