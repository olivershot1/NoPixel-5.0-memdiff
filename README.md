np_memdiff

A memory diff hacking minigame for FiveM with a React UI. Two hex dumps sit side by side, a few bytes differ in Image B, and the player has to find them before time or strikes run out.

Standalone: it does not need ESX, QBCore or ox_lib.

Install
Put the np_memdiff folder in your server's resources folder.
Add this line to server.cfg:
   ensure np_memdiff
Restart the server (or run refresh then ensure np_memdiff in the console).

The UI is already built in the html folder, so you do not need Node.js or npm to use it.

If you have the older np_memdiff resource, remove it first. Both register the same command.

Test it in game

Type /memdiff in chat.

You can pass settings after the command, in this order:

/memdiff [find] [strikes] [seconds] [columns] [rows]

Example: /memdiff 6 3 40 10 8 means find 6 differences, allow 3 wrong marks, 40 seconds, 10 columns, 8 rows. Anything you leave off uses the defaults in config.lua.

Controls
Key	Action
W A S D or arrow keys	Move the cursor
Enter or Space	Mark the byte
Esc	Disconnect (counts as a fail, closes instantly)
Mouse click	Mark a byte in Image B

A correct mark turns amber in both images. A wrong mark is a strike. You win by finding every difference. You lose on running out of strikes or time, and the "CHALLENGE FAILED" screen counts down 6 seconds before closing.

Config

Edit config.lua:

Setting	Default	Range	Meaning
Config.Command	'memdiff'	name or false	Chat command. Set false to remove it.
Config.CommandRestricted	false	true/false	If true, only players with ace permission command.memdiff can use it.
Defaults.diffs	4	1 to 40	Differences to find to win
Defaults.strikes	2	1 to 20	Wrong marks allowed
Defaults.seconds	26	5 to 300	Time limit
Defaults.columns	8	3 to 16	Bytes per row
Defaults.rows	10	3 to 16	Number of rows

On a live server, set Config.Command = false or Config.CommandRestricted = true, otherwise any player can open the hack.

Use it from other scripts

Call the export from any client script. It waits until the hack ends and returns true for success, or false for a fail, timeout or Esc.

lua
-- with a table (anything left out uses config.lua defaults)
local success = exports['np_memdiff']:MemDiff({
    diffs = 5, strikes = 3, seconds = 30, columns = 10, rows = 8
})

-- or in order: diffs, strikes, seconds, columns, rows
local success = exports['np_memdiff']:MemDiff(5, 3, 30, 10, 8)

if success then
    -- open the door, give the reward, etc.
else
    -- fail
end

If a hack is already open, a second call returns false straight away.

Change the UI (optional)

You only need this if you want to edit the design.

Install Node.js.
Open a terminal in the web folder.
Run npm install once.
Edit files in web/src.
Run npm run build. This writes the new UI into html, which is what FiveM loads.

To preview in your browser with a settings bar, run npm run dev instead.

Do not edit the files in html by hand, because the next build overwrites them.

Files
np_memdiff/
  fxmanifest.lua   resource manifest
  config.lua       command and default settings
  client.lua       export, command and UI hookup
  html/            built UI (what FiveM loads)
  web/             React source
Troubleshooting
Nothing opens: check the server console for errors, and make sure the folder is named np_memdiff and the html folder is inside it.
WASD does not move: FiveM can sometimes grab those keys before the UI gets them. Arrow keys still work.
Blank page in a browser: open it through npm run dev or Live Server, not by double-clicking the file.# NoPixel-5.0-memdiff