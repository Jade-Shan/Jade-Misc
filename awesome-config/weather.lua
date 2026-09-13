-- find city code in : http://weather.rap.ucar.edu/surface/stations.txt
--Create a weather widget
weatherwidget = widget({ type = "textbox" })
weatherwidget.text = awful.util.pread(
  "weather -i ZSSS --headers=Temperature --quiet -m | awk '{print $2, $3}'"
) -- replace ZSSS with the metar ID for your area. This uses metric. If you prefer Fahrenheit remove the "-m" in "--quiet -m".
weathertimer = timer(
  { timeout = 900 } -- Update every 15 minutes. 
) 
weathertimer:add_signal(
  "timeout", function() 
     weatherwidget.text = awful.util.pread(
     "weather -i ZSSS --headers=Temperature --quiet -m | awk '{print $2, $3}' &"
   ) --replace ZSSS and remove -m if you want Fahrenheit
 end)

weathertimer:start() -- Start the timer
weatherwidget:add_signal(
"mouse::enter", function() 
  weather = naughty.notify(
    {title="Weather",text=awful.util.pread("weather -i ZSSS -m")})
  end) -- this creates the hover feature. replace ZSSS and remove -m if you want Fahrenheit
weatherwidget:add_signal(
  "mouse::leave", function() 
    naughty.destroy(weather) 
  end)
-- I added some spacing because on my computer it is right next to my clock.
awful.widget.layout.margins[weatherwidget] = { right = 5 } 
