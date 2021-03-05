
function CrossTable(membersList)
{
    var self = this;
    this.Members = membersList;
    this.MembersIndex = {};
    this.Table = null;

    this.OnFinish = null;

    this.ResultCode =
    {
        Win: 1,
        Draw: 0,
        Lost: -1
    }

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
        //this.Create();
    }

    this.Create = function () 
    {
        var members = this.Members;
        this.ProcessAllMembers(0, members, this.OnFinish);
    }

    this.ProcessAllMembers = function(index, members, onfinish)
    {
        if(index >= members.length)
        {
            if(onfinish instanceof Function)
                onfinish();
            return;
        }

        this.ProcessMember(members[index], function(){
            setTimeout(function(){
               self.ProcessAllMembers(index + 1, members, onfinish); 
            },0);
        });

    }

    this.ProcessMember = function(member, onfinish)
    {
        var progress = function (progress, total, games) {
            console.log(member + " progress " + progress + "/" + total);
        };
        this.DownloadHistory(member, 2019, function(games){
            self.UpdateTable(member, games);
            if(onfinish instanceof Function)
                onfinish();
            console.log(self.Table);
        }, progress);
    }

    this.UpdateTable = function (member, games) {
        var members = this.Members;
        var memberUpper = member.toUpperCase();

        for (var i = 0; i < games.length; i++) {
            var game = games[i];

            for (var j = 0; j < members.length; j++) {
                var imember = members[j];
                var imemberUpper = imember.toUpperCase();

                if (imember != member) {

                    if(imemberUpper == game.white.username.toUpperCase() )//enemy is white
                    {
                        var code = this.ParseResultCode(game.black.result);
                        this.UpdateCell(member, imember, code);
                    }
                    else if( imemberUpper == game.black.username.toUpperCase()) //enemy is black
                    {
                        var code = this.ParseResultCode(game.white.result);
                        this.UpdateCell(member, imember, code);
                    }
                }
            }
        }

    }

    this.UpdateCell = function (member1, member2, resultCode) {
        var indexMember1 = this.MembersIndex[member1];
        var indexMember2 = this.MembersIndex[member2];

        var cell1 = this.Table[indexMember1][indexMember2];
        var cell2 = this.Table[indexMember2][indexMember1];

        if (resultCode == this.ResultCode.Win) {
            cell1.Won();
            cell2.Lost();
        }
        else if (resultCode == this.ResultCode.Lost) {
            cell1.Lost();
            cell2.Won();
        }
        else if (resultCode == this.ResultCode.Draw) {
            cell1.Draw();
            cell2.Draw();
        }
    }

    this.ParseResultCode = function (code) {
        /*
            Code	Description
            win	-> Win
            checkmated	-> Checkmated
            agreed -> 	Draw agreed
            repetition	-> Draw by repetition
            timeout	->Timeout
            resigned	->Resigned
            stalemate	->Stalemate
            lose	->Lose
            insufficient	->Insufficient material
            50move	->Draw by 50-move rule
            abandoned	->Abandoned
            kingofthehill	->Opponent king reached the hill
            threecheck	->Checked for the 3rd time
            timevsinsufficient	->Draw by timeout vs insufficient material
            bughousepartnerlose	->Bughouse partner lost
        */

        if ("win" == code)
            return this.ResultCode.Win;
        else if ("checkmated" == code || "timeout" == code || "resigned" == code
            || "lose" == code || "abandoned" == code || "kingofthehill" == code
            || "threecheck" == code)
            return this.ResultCode.Lost;
        else if ("agreed" == code || "repetition" == code
            || "stalemate" == code || "insufficient" == code
            || "50move" == code || "timevsinsufficient" == code
            || "bughousepartnerlose" == code)
            return this.ResultCode.Draw;

        return undefined;
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

            if(archives.length == 0)
            {
                finish([]);
                return;
            }
            
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
        {
            return;
        }
          

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
    this.DrawGames = 0;

    this.Won = function () {
        this.WonGames++;
    }

    this.Lost = function () {
        this.LostGames++;
    }

    this.Draw = function () {
        this.DrawGames++;
    }

    this.ToString = function()
    {
        return "Win:" + this.WonGames + ", Lost:" + this.LostGames + ", Draw:" + this.DrawGames;
    }
}