-- Standalone: no ESX / QBCore / ox_lib needed. Use the export or the command.
local p = nil

local function clamp(v, lo, hi, def)
    v = tonumber(v) or def
    return math.max(lo, math.min(hi, math.floor(v)))
end

-- Positional:  exports['np_memdiff_react']:MemDiff(diffs, strikes, seconds, columns, rows)
-- Table:       exports['np_memdiff_react']:MemDiff({ diffs = 5, strikes = 3, seconds = 30, columns = 10, rows = 8 })
-- Anything left out uses Config.Defaults. Returns true on success, false on fail/timeout/disconnect.
local function MemDiff(a, b, c, d, e)
    if p then return false end
    local o = type(a) == 'table' and a or { diffs = a, strikes = b, seconds = c, columns = d, rows = e }
    local D = Config.Defaults
    p = promise.new()
    SetNuiFocus(true, false)
    SendNUIMessage({
        action  = 'start',
        diffs   = clamp(o.diffs,   1, 40,  D.diffs),
        strikes = clamp(o.strikes, 1, 20,  D.strikes),
        seconds = clamp(o.seconds, 5, 300, D.seconds),
        columns = clamp(o.columns, 3, 16,  D.columns),
        rows    = clamp(o.rows,    3, 16,  D.rows)
    })
    local result = Citizen.Await(p)
    p = nil
    return result
end
exports('MemDiff', MemDiff)

RegisterNUICallback('result', function(data, cb)
    SetNuiFocus(false, false)
    if p then p:resolve(data.success and true or false) end
    cb('ok')
end)

-- /memdiff [diffs] [strikes] [seconds] [columns] [rows]   e.g. /memdiff 6 3 40 10 8
if Config.Command then
    RegisterCommand(Config.Command, function(_, args)
        local ok = MemDiff(args[1], args[2], args[3], args[4], args[5])
        print(('[np_memdiff] %s'):format(ok and 'success' or 'failed'))
    end, Config.CommandRestricted)
end
