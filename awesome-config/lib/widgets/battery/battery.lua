-- Battery widget

local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")

local timer = gears.timer or timer
local watch = awful.spawn and awful.spawn.with_line_callback

-- string.lower
------------------------------------------
-- file utils
------------------------------------------

function get_current_path()
   local path = debug.getinfo(2, "S").source:sub(2)
   return path:match("(.*/)")
end

function isempty(str)
  return str == nil or str == ""
end

function file_exists(command)
    local f = io.open(command)
    if f then f:close() end
    return f and true or false
end

function readfile(command)
    local file = io.open(command)
    if not file then return nil end
    local text = file:read('*all')
    file:close()
    return text
end

------------------------------------------
-- String utils
------------------------------------------

function color_tags(color)
    if color
        then return '<span color="' .. color .. '">', '</span>'
        else return '', ''
    end
end

function colorTag(color, str)
    if color
        then return '<span color="' .. color .. '">' .. str .. '</span>'
        else return '<span>' .. str .. '</span>'
    end
end

function trim(s)
    if not s then return nil end
    return (s:gsub("^%s*(.-)%s*$", "%1"))
end

------------------------------------------
-- Math utils
------------------------------------------

function round(value)
    return math.floor(value + 0.5)
end

------------------------------------------
-- Battery widget interface
------------------------------------------

local function parseAcpiTool(data, line)
	data["rawData"] = data["rawData"] .. line .. "\n";
--AC adapter     : on-line 
--AC adapter     : off-line 
	if (nil ~= string.match(line, "(AC%s+adapter)")) then
		if (nil ~= string.match(line, "(on%-?line)")) then
			data["isAc"] = true;
		else
			data["isAc"] = false;
		end
--Battery #1     : charged, 100.0%
--Battery #1     : discharging, 99.67%, 03:21:40
--Battery #1     : charging, 94.05%, 00:08:14
	elseif (nil ~= string.match(line, "Battery #(%d+)")) then
		if (nil ~= string.match(line, "(charged)")) then
		 	data["battery.status"] = "charged";
		 	data["battery.load"] = 100;
			data["battery.time"] = "";
		elseif (nil ~= string.match(line, "(charging)")) then
		 	data["battery.status"] = "charging";
		 	data["battery.load"] = tonumber(string.match(line, " (%d*.%d+)%%"))
			data["battery.time"] = string.match(line, "(%d+:%d+):%d+");
		else
			data["battery.status"] = "discharging";
		 	data["battery.load"] = tonumber(string.match(line, " (%d*.%d+)%%"))
			data["battery.time"] = string.match(line, "(%d+:%d+):%d+");
		end
	end

	return data
end

local function getPowerInfo()
	local data = {};
	data["rawData"] = "";
	data["isAc"] = false;
	data["battery.status"] = "";
	data["battery.load"] = 0;
	data["battery.time"] = 0;
	local fd = io.popen("acpitool", "r") --list present batteries
	local line = fd:read()
	while line do --there might be several batteries.
		data = parseAcpiTool(data, line)
		line = fd:read() --read next line
	end
	fd:close()

	if data["battery.load"] > 99 then
		data["battery.status"] = "charged";
		data["battery.load"] = 100;
		data["battery.time"] = "";
	end

	if "charging" ~= data["battery.status"] and data["isAc"] then
		data["battery.status"] = "charged";
		data["battery.load"] = 100;
		data["battery.time"] = "";
	end

	-- print("isAc: ", data["isAc"], 
	-- 	"battery.status: ", data["battery.status"], 
	-- 	"battery.load:", data["battery.load"], 
	-- 	"battery.time:", data["battery.time"])
	return data;
end

local function randerPowerInfo(data)
	local html = "";
	if data["isAc"] then  -- charging
		-- html = "&#128268;";
		-- html = "&#x26A1;";
	else                  -- battery
		-- html = "&#128267;";
		-- html = "&#x26A1;";
	end
	html = html .. data["battery.load"] .. "% " .. data["battery.time"]
	--
	local color = "#CC7777";
	if data["isAc"] then
		color = "#77CC77";
	elseif data["battery.load"] > 80 then
		color = "#77CC77";
	elseif data["battery.load"] > 50 then
		color = "#7777CC";
	elseif data["battery.load"] > 20 then
		color = "#FF0000";
	end
	return colorTag(color, html);
end

function getBatteryIcon(data)
	local value = data["battery.load"];
	local icon = "plugin.png"
  if data["isAc"] then
		if "charged" == data["battery.status"] then
			icon = "plugin.png"
		elseif "charging" == data["battery.status"] then
			icon = "bat_c.png"
		end
  elseif value > 99 then
    icon = "bat_5.png"
  elseif value > 80 then
    icon = "bat_4.png"
  elseif value > 60 then
    icon = "bat_3.png"
  elseif value > 40 then
    icon = "bat_2.png"
  elseif value > 20 then
    icon = "bat_1.png"
  else
    icon = "bat_0.png"
  end
  return get_current_path() .. "/icons/" .. icon
end


local batteryIcon = wibox.widget.imagebox()

local batteryInfo = wibox.widget.textbox()
batteryInfo:set_align("right")

batteryWidget = wibox.layout.fixed.horizontal()
batteryWidget:add(batteryIcon)
batteryWidget:add(batteryInfo)
tooltip = awful.tooltip({objects={batteryWidget}})

function updateBatteryWidget()
	local data = getPowerInfo();
	local icon = getBatteryIcon(data);
	local html = randerPowerInfo(data);
	batteryIcon:set_image(icon)
	batteryInfo:set_markup(html)
	tooltip:set_text(data["rawData"])
end

updateBatteryWidget()

local mytimer = timer({ timeout = 20 })
mytimer:connect_signal("timeout", function () updateBatteryWidget() end)
mytimer:start()

