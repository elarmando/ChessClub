
function CrossTable(membersList)
{
    var self = this;
    this.Members = membersList;
    this.Create = function()
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
        }

        console.log(table);
        var games = [];

        this.GetHistory(members[0], function(history){
            self.DownloadGames(0, history, function(index, partialGames){
                games.push(partialGames.games);

                console.log(index + "/" + history.length);
                console.log(games);
            });
        });
    }

    this.DownloadGames = function(index, history, finish)
    {
        if(index >= history.archives.length)
            return;
        
        var url = history.archives[index];

        this.GetGames(url, function(games){
            finish(index, games);
            setTimeout(function(){
                self.DownloadGames(index+1, history,finish)
            },0);
        })
    
    }

    this.GetHistory = function(username, success, error) 
    {
        var r = new XMLHttpRequest();
        
        r.onload = function(){
            var data = JSON.parse(r.responseText);

            if(success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET","https://api.chess.com/pub/player/" + username +"/games/archives",false );
        r.send();
    }

    this.GetGames = function(url, success, error)
    {
        var r = new XMLHttpRequest();
        
        r.onload = function(){
            var data = JSON.parse(r.responseText);

            if(success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET",url,false );
        r.send();
    }

    
}

function CrossTableItem()
{
    this.WonGames = 0;
    this.LostGames = 0;
}