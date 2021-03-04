
function CrossTable(membersList)
{
    var self = this;
    this.Members = membersList;
    this.MembersIndex = {};
    this.Table = null;

    this.InitTable = function()
    {
        var members = this.Members;
        var table = [];

        for(var x = 0; x < members.length; x++)
        {
            var row = [];
            for(var y = 0; y < members.length; y++)
            {
                row.push(new CrossTableItem());
            }

            table.push(row);
            this.MembersIndex[members[x]] = x;
        }

        this.Table = table;

        console.log(this.MembersIndex);
        this.Create();
    }

    this.Create = function () 
    {
        var members = this.Members;

        var finish = function (games) {
            console.log(games);
            self.UpdateTable(members[0], games);
            console.log(self.Table);
        }

        var progress = function (progress, total, games) {
            console.log("progress " + progress + "/" + total);
        }

        this.DownloadHistory(members[0], 2019, finish, progress);
    }

    this.UpdateTable = function (member, games) {
        var members = this.Members;

        for (var i = 0; i < games.length; i++) {
            var game = games[i];

            for (var j = 0; j < members.length; j++) {
                var imember = members[j];
                var toUpperMember = imember.toUpperCase();

                if (imember != member) {
                    if (toUpperMember == game.white.username.toUpperCase()) {
                        //oponent played white
                        var memberWon = game.black.result == "win";
                        this.UpdateCell(member, imember, memberWon);
                    }
                    else if (toUpperMember == game.black.username.toUpperCase()) {
                        //oponent played black
                        var memberWon = game.white.result == "win";
                        this.UpdateCell(member, imember, memberWon);
                    }
                }
            }
        }

    }

    this.UpdateCell = function(member1, member2, won1)
    {
        var indexMember1 = this.MembersIndex[member1];
        var indexMember2 = this.MembersIndex[member2];

        var cell1 = this.Table[indexMember1][indexMember2];
        var cell2 = this.Table[indexMember2][indexMember1];

        if(won1)
        {
            cell1.Won();
            cell2.Lost();
        }
        else
        {
            cell1.Lost();
            cell2.Won();
        }
    }
  
    this.FilterArchivesFrom = function (archives, yearSince) {
        var filtered = [];

        for (var i = 0; i < archives.length; i++) {
            var url = archives[i];
            var split = url.split("/");
            //url format is like this: http://chess.com/user/games/2007/03
            var year = parseInt(split[split.length - 2])

            if (year >= yearSince)
                filtered.push(url);
        }
        return filtered;
    }

    this.DownloadHistory = function (member, fromYear, finish, progress) {
        var games = [];

        this.GetHistory(member, function (history) {
            var archives = history.archives;
            archives = self.FilterArchivesFrom(archives, fromYear);//im only interested in games from 2019 to present

            self.DownloadGames(0, archives, function (index, partialGames) {
                for (var i = 0; i < partialGames.games.length; i++)
                    games.push(partialGames.games[i]);

                if (progress instanceof Function)
                    progress(index + 1, archives.length, games);

                if (index + 1 == archives.length)
                    finish(games);
            });
        });
    }

    this.DownloadGames = function (index, archives, finish) {
        if (index >= archives.length)
            return;

        var url = archives[index];

        this.GetGames(url, function (games) {
            finish(index, games);
            setTimeout(function () {
                self.DownloadGames(index + 1, archives, finish)
            }, 0);
        })

    }

    this.GetHistory = function (username, success, error) {
        var r = new XMLHttpRequest();

        r.onload = function () {
            var data = JSON.parse(r.responseText);

            if (success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET", "https://api.chess.com/pub/player/" + username + "/games/archives", false);
        r.send();
    }

    this.GetGames = function (url, success, error) {
        var r = new XMLHttpRequest();

        r.onload = function () {
            var data = JSON.parse(r.responseText);

            if (success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET", url, false);
        r.send();
    }


}

function CrossTableItem() {
    this.WonGames = 0;
    this.LostGames = 0;
    this.Total = 0;

    this.Won = function () {
        this.WonGames++;
        this.Total++;
    }

    this.Lost = function () {
        this.LostGames++;
        this.Total++;
    }
}