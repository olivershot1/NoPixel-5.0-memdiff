fx_version 'cerulean'
game 'gta5'
lua54 'yes'

description 'Memory diff hacking minigame (standalone, React UI)'
version '2.0.0'

client_scripts { 'config.lua', 'client.lua' }
ui_page 'html/index.html'
files { 'html/index.html', 'html/assets/*' }
exports { 'MemDiff' }
