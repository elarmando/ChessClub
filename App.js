
(function Main(){
    var miembros = [
        "armando_s",
        "pardo11pbc",
        "igniz16",
        "Reshesvsky",
        "isaacruizc",
        "luis_d2709",
        "vkruz",
        "r-barrera",
        "Zenemyj",
        "jherrera64",
        "ricardotenorio28",
        "marlendf",
        "jonacruz"    
    ];

    var memberObjs = [];

    function Member(){
        this.Name = "";
        this.UserName = "";
        this.DailyRating = "";
        this.TacticsRating = null;
        this.BlitzRating = null;
        this.LastConnection = null;
        this.Games = [];
    }

    function Start()
    {
        var membersCount = 0;

        miembros.forEach(function(member ){
            GetUserData(member, function(data){
                debugger;
                membersCount++;

                AppendUserData(data);
                                
                if(membersCount == miembros.length)                
                    CreateList();
                
            });
        },function(){
            membersCount++;

            if(membersCount == miembros.length)                
                CreateList();
        });
        
    }

    function AppendUserData(data)
    {
        memberObjs.push(data);     
    }


    function GetUserData(username, success, error)
    {
        var r = new XMLHttpRequest();
        
        r.onload = function(){
            var data = JSON.parse(r.responseText);

            GetStats(username, function(stats){
               
                var member = new Member();
                member.Name = data.name;
                member.UserName = data.username;
                member.DailyRating = stats.chess_daily.last.rating;
                member.TacticsRating = stats.tactics.highest == undefined ? 0 : stats.tactics.highest.rating ;
                member.LastConnection = new Date(data.last_online * 1000);
                member.BlitzRating = stats.chess_blitz == undefined || stats.chess_blitz.best == undefined? 0: stats.chess_blitz.best.rating;

                GetGames(username, function(games){
                    member.Games = games.games;

                    if(success instanceof Function)
                        success(member);

                }, error);

            

            }, error);         
        }

        r.onerror = error;
        r.open("GET","https://api.chess.com/pub/player/" + username, false );
        r.send();
    }

    function GetGames(username, success, error)
    {
        var r = new XMLHttpRequest();
        
        r.onload = function(){
            var data = JSON.parse(r.responseText);

            if(success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET","https://api.chess.com/pub/player/" + username +"/games",false );
        r.send();
    }

    function GetStats(username, success, error)
    {
        var r = new XMLHttpRequest();
        
        r.onload = function(){
            var data = JSON.parse(r.responseText);

            if(success instanceof Function)
                success(data);
        }
        r.onerror = error;

        r.open("GET","https://api.chess.com/pub/player/" + username +"/stats",false );
        r.send();
    }

    function CreateTacticsRatingTable()
    {
        var unActive = [];
        var active = [];
        var currentDateTime = new Date().getTime();
        var dayTime = 1000*60*60*24;
        var twoWeekTime = dayTime * 14;
        var thresholdTime = twoWeekTime;

        memberObjs.forEach(function(e){
            var timeElapsed = currentDateTime - e.LastConnection.getTime();

            if(timeElapsed > thresholdTime)
                unActive.push(e);
            else
                active.push(e);
        });


        active = active.sort(function(a,b){
            return b.TacticsRating - a.TacticsRating;
        });
        
        unActive = unActive.sort(function(a,b){
            return b.TacticsRating - a.TacticsRating;
        });

       
        var header = "<thead><tr><th>Position</th><th>User</th><th>Name</th><th>Highest Tactics Rating</th><th>Current Games</th><th>Last Connection</th></tr></thead>";
       
        var body = "";
        var position = 0;

        active.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.TacticsRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+"</td>"+"</tr>";          
           
        });

        unActive.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.TacticsRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+ (" (Unactive)") +"</td>"+"</tr>";          
        });
        
        body = "<tbody>"+ body +"</tbody>";

        return "<table class='pure-table'>" + header + body + "</table>";
    }

    function CreateDailyRatingTable()
    {
        var unActive = [];
        var active = [];
        var currentDateTime = new Date().getTime();
        var dayTime = 1000*60*60*24;
        var twoWeekTime = dayTime * 14;
        var thresholdTime = twoWeekTime;

        memberObjs.forEach(function(e){
            var timeElapsed = currentDateTime - e.LastConnection.getTime();

            if(timeElapsed > thresholdTime)
                unActive.push(e);
            else
                active.push(e);
        });


        active = active.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });
        
        unActive = unActive.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });

       
        var header = "<thead><tr><th>Position</th><th>User</th><th>Name</th><th>Daily Rating</th><th>Current Games</th><th>Last Connection</th></tr></thead>";
       
        var body = "";
        var position = 0;

        active.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+"</td>"+"</tr>";          
           
        });

        unActive.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+ (" (Unactive)") +"</td>"+"</tr>";          
        });
        
        body = "<tbody>"+ body +"</tbody>";

        return "<table class='pure-table'>" + header + body + "</table>";
    }

    function CreateBlitzRatingTable()
    {
        var unActive = [];
        var active = [];
        var currentDateTime = new Date().getTime();
        var dayTime = 1000*60*60*24;
        var twoWeekTime = dayTime * 14;
        var thresholdTime = twoWeekTime;

        memberObjs.forEach(function(e){
            var timeElapsed = currentDateTime - e.LastConnection.getTime();

            if(timeElapsed > thresholdTime)
                unActive.push(e);
            else
                active.push(e);
        });


        active = active.sort(function(a,b){
            return b.BlitzRating - a.BlitzRating;
        });
        
        unActive = unActive.sort(function(a,b){
            return b.BlitzRating - a.BlitzRating;
        });

       
        var header = "<thead><tr><th>Position</th><th>User</th><th>Name</th><th>Blitz Rating</th><th>Current Games</th><th>Last Connection</th></tr></thead>";
       
        var body = "";
        var position = 0;

        active.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.BlitzRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+"</td>"+"</tr>";          
           
        });

        unActive.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.BlitzRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+ (" (Unactive)") +"</td>"+"</tr>";          
        });
        
        body = "<tbody>"+ body +"</tbody>";

        return "<table class='pure-table'>" + header + body + "</table>";
    }

    function CreateList()
    {
       
        var html1 = CreateDailyRatingTable();
        var html2 = CreateTacticsRatingTable();
        var html3 = CreateBlitzRatingTable();

        var html = "<div>Daily Rating</div>" + html1 + "<div>Tactics Rating</div>" + html2 + "<div>Blitz Rating</div>" + html3;

        window.document.body.innerHTML = html;
    }

    window.onload = Start;
    
}());

