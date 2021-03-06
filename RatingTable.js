
function RatingTable(miembros)
{
    var self = this;
    this.Members = miembros;
    this.MembersObjs = [];
    this.ChessComApi = new ChessDotCom();

    this.GetMembersData = function(onfinish)
    {
        var miembros = this.Members;
        var membersCount = 0;
        miembros.forEach(function (member) {
            GetUserData(member, function (data) {

                membersCount++;
                AppendUserData(data);

                if (membersCount == miembros.length)
                {
                    if(onfinish instanceof Function)
                        onfinish();
                }

            });
        }, function () {
            membersCount++;

            if (membersCount == miembros.length)
            {
                if (onfinish instanceof Function)
                    onfinish();
            }
        });
    }

    function GetUserData(username, success, error) {
        self.ChessComApi.GetUserData(username, function (data) {
            GetStats(username, function (stats) {

                var member = new Member();
                member.Name = data.name;
                member.UserName = data.username;
                member.DailyRating = stats.chess_daily != undefined && stats.chess_daily.last != undefined ? stats.chess_daily.last.rating : 0;
                member.TacticsRating = stats.tactics.highest == undefined ? 0 : stats.tactics.highest.rating;
                member.LastConnection = new Date(data.last_online * 1000);
                member.BlitzRating = stats.chess_blitz == undefined || stats.chess_blitz.last == undefined ? 0 : stats.chess_blitz.last.rating;
                member.DailyRating960 = stats.chess960_daily == undefined || stats.chess960_daily.last == undefined ? 0 : stats.chess960_daily.last.rating;

                GetGames(username, function (games) {
                    member.Games = games.games;

                    if (success instanceof Function)
                        success(member);

                }, error);
            });
        });
    }

    function GetStats(username, success, error) {
        self.ChessComApi.GetStats(username, success, error);
    }

    function GetGames(username, success, error) {
        self.ChessComApi.GetGames(username, success, error);
    }

    function AppendUserData(data) {
        self.MembersObjs.push(data);
    }
}

function Member() {
    this.Name = "";
    this.UserName = "";
    this.DailyRating = "";
    this.TacticsRating = null;
    this.BlitzRating = null;
    this.DailyRating960 = null;
    this.LastConnection = null;
    this.Games = [];
}
