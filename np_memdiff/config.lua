Config = {}

-- Command players use to open the hack. Set to false to disable the command entirely.
Config.Command = 'memdiff'
-- true = only players with ace permission "command.<Command>" can use it (recommended for live servers)
Config.CommandRestricted = false

-- Used for any value you don't pass in.
Config.Defaults = {
    diffs   = 4,   -- differences to find to win          (1 - 40)
    strikes = 2,   -- wrong marks allowed before failing  (1 - 20)
    seconds = 26,  -- time limit                          (5 - 300)
    columns = 8,   -- bytes per row                       (3 - 16)
    rows    = 10   -- number of rows                      (3 - 16)
}
