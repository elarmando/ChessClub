
function ChessDotCom()
{
    this.GetGames = function(username, success, error)
    {
        var r = new XMLHttpRequest();

        r.onload = function () {
            var data = JSON.parse(r.responseText);
            if (success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET", "https://api.chess.com/pub/player/" + username + "/games", false);
        r.send();
    }

    this.GetStats = function(username, success, error)
    {
        var r = new XMLHttpRequest();

        r.onload = function () {
            var data = JSON.parse(r.responseText);

            if (success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET", "https://api.chess.com/pub/player/" + username + "/stats", false);
        r.send();
    }

    this.GetUserData = function(username, success, error)
    {
        var r = new XMLHttpRequest();

        r.onload = function () {
            var data = JSON.parse(r.responseText);
            if (success instanceof Function)
                success(data);
        }

        r.onerror = error;
        r.open("GET", "https://api.chess.com/pub/player/" + username, false);
        r.send();
    }

    this.GetArchives = function(username, success, error)
    {
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
}