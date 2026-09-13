sound_card_id = 1

-- ======================================
--
-- functions to control volume
--
-- ======================================

function check_volume()
	local fd = io.popen("amixer -c " .. sound_card_id .. " sget Master")
	local tmpStr = fd:read("*all")
	fd:close()
	local status = string.match(tmpStr, "%[(o[^%]]*)%]")
	local volume = tonumber(string.match(tmpStr, "(%d?%d?%d)%%"))
	return status, volume
end

function incr_volume()
	awful.util.spawn("amixer -c " .. sound_card_id .. " set Master 5%+")
end

function decr_volume()
	awful.util.spawn("amixer -c " .. sound_card_id .. " set Master 5%-")
end

function togg_volume()
	-- TODO: have error cannot un-Mute
	-- awful.util.spawn("amixer -c " .. sound_card_id .. " set Master toggle")
end

-- ======================================
--
-- volume widgit
--
-- ======================================
-- Create a volume control
volume_widget = widget({ type = "textbox", name = "tb_volume", align = "right" })
-- widgit key bind
-- sound increase : mouse wheel up
-- sound decrease : mouse wheel down
-- toggle mute: mouse left click
volume_widget:buttons(awful.util.table.join(
	awful.button({ }, 1, function () togg_volume() end),
	awful.button({ }, 4, function () incr_volume() end),
	awful.button({ }, 5, function () decr_volume() end)
))

-- ======================================
--
-- show current volume
-- correct output of tool `amixer -c <sound_card_id> sget Master` should like:
--
-- amixerResult = "Simple mixer control 'Master',0\n"
-- amixerResult = amixerResult ..  "Capabilities: pvolume pvolume-joined pswitch pswitch-joined\n"
-- amixerResult = amixerResult ..  "Playback channels: Mono\n"
-- amixerResult = amixerResult ..  "Limits: Playback 0 - 87\n"
-- amixerResult = amixerResult ..  "Mono: Playback 70 [80%] [-12.75dB] [on]\n"
--
-- ======================================
function update_volume(widget)
	local result = "Sound-Widgit-Err"
	local status, volume = check_volume()

	if ((volume == nil or status == nil) and sound_card_id < 3) then
		sound_card_id = sound_card_id + 1
		status, volume = check_volume()
	end

	if (volume ~= nil and status ~= nil) then
		-- volume = volume / 100
		-- volume = string.format("% 3d", volume)
		-- starting colour
		local sr, sg, sb = 0x3F, 0x3F, 0x3F
		-- ending colour
		local er, eg, eb = 0xDC, 0xDC, 0xCC
		result = "003"
		-- trans color
		local br = sr + volume * (er - sr)
		local bg = sg + volume * (eg - sg)
		local bb = sb + volume * (eb - sb)
		local bgc = string.format("%.2x%.2x%.2x", br, bg, bb)
		-- better use icon &#x1F507 - &#x1F50A
		if string.find(status, "on", 1, true) then
			result = " <span color='#00FFFF'> &#x266B; " .. volume .. "%</span><span color='blue' background='#" .. bgc .. "'> </span>"
		else
			result = " <span color='#00FFFF'> &#x266B; mute<span color='red'  background='#" .. bgc .. "'> </span>"
		end
	end
	
widget.text = result
end

update_volume(volume_widget)
awful.hooks.timer.register(1, function () update_volume(volume_widget) end)
