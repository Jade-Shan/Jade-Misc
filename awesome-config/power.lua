battery_widget = widget({ type = "textbox", name = "battery_widget", align = "right" })


local function parseAcpiTool(data, line)
	data["rawData"] = data["rawData"] .. line .. "\n";
--AC adapter     : on-line 
--AC adapter     : off-line 
	if (nil ~= string.match(line, "(AC%s+adapter)")) then
		if (nil ~= string.match(line, "(on%-line)")) then
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

	if data["battery.load"] > 99 then
		data["battery.status"] = "charged";
		data["battery.load"] = 100;
		data["battery.time"] = "";
	end

	-- print("power Info: ", data["isAc"], data["battery.status"], data["battery.load"], data["battery.time"])
	return data
end

local function getPowerInfo()
	local result = {};
	result["rawData"] = "";
	result["isAc"] = false;
	result["battery.status"] = "";
	result["battery.load"] = 0;
	result["battery.time"] = 0;
	local fd = io.popen("acpitool", "r") --list present batteries
	local line = fd:read()
	while line do --there might be several batteries.
		result = parseAcpiTool(result, line)
		line = fd:read() --read next line
	end
	fd:close()
	return result;
end

local function colorTag(color, str)
    if color
        then return '<span color="' .. color .. '">' .. str .. '</span>'
        else return '<span>' .. str .. '</span>'
    end
end

local function randerPowerInfo(data)
	local html = "";
	if data["isAc"] then  -- charging
		-- html = "&#128268;";
		html = "&#x26A1;";
	else                  -- battery
		-- html = "&#128267;";
		html = "&#x26A1;";
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

function battery_status(widget)
	local output = {} --output buffer
	table.insert(output, randerPowerInfo(getPowerInfo()))
	widget.text = "" .. table.concat(output, " ") .. ""
end

battery_status(battery_widget)
awful.hooks.timer.register(10, function () battery_status(battery_widget) end)
