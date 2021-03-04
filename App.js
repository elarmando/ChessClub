
(function Main(){
    var miembros = [
        "armando_s",
        "pardo11pbc",
        /*"igniz16",*/
        "Reshesvsky",
        "isaacruizc",
        /*"luis_d2709",*/
        "vkruz",
        "r-barrera",
        "Zenemyj",
        "jherrera64",
        "danwro",
        "yaird09",
        "ricardotenorio28",
        /*"romerovh",*/
      /*  "ivonnelima",*/
       /* "marlendf",*/
        "Jona1302",
        "romulo119",
        "OzzyMG",
        "eutiquior",
        "allDmnz",
        "marco_winchester",
        "marcusgtz",
        "Any301",
        "JCix6"
        
        
    ];

    var grupos = 
    {
        "ReportLoop": ["armando_s", "isaacruizc","jherrera64", "ricardotenorio28","eutiquior"],
        "DataLoop Web": ["Reshesvsky", "vkruz", "r-barrera", "Zenemyj", "danwro", "Jona1302", "OzzyMG"],
        "DataLoop Mobile":["yaird09", "allDmnz"],
        "AR":["pardo11pbc", "romulo119"],
        "Practicantes":["marco_winchester", "marcusgtz"]
    }


    var memberObjs = [];

    function Member(){
        this.Name = "";
        this.UserName = "";
        this.DailyRating = "";
        this.TacticsRating = null;
        this.BlitzRating = null;
        this.DailyRating960 = null;
        this.LastConnection = null;
        this.Games = [];
    }

   

    function Start()
    {
        var membersCount = 0;

        miembros.forEach(function(member ){
            GetUserData(member, function(data){
                
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

       /*  var crossTable = new CrossTable(miembros);
        crossTable.InitTable(); */
        
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
                member.DailyRating = stats.chess_daily != undefined && stats.chess_daily.last != undefined ? stats.chess_daily.last.rating : 0;
                member.TacticsRating = stats.tactics.highest == undefined ? 0 : stats.tactics.highest.rating ;
                member.LastConnection = new Date(data.last_online * 1000);
                member.BlitzRating = stats.chess_blitz == undefined || stats.chess_blitz.last == undefined? 0: stats.chess_blitz.last.rating;
                member.DailyRating960 = stats.chess960_daily == undefined || stats.chess960_daily.last == undefined?0 :stats.chess960_daily.last.rating;

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

    function CreateTacticsRatingTable( membersActive, memberUnactive)
    {
        var unActive = [];
        var active = [];
       
                            
        active = membersActive.sort(function(a,b){
            return b.TacticsRating - a.TacticsRating;
        });
        
        unActive = memberUnactive.sort(function(a,b){
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

    function CreateDailyRatingTable(membersActive, memberUnactive)
    {
        var unActive = [];
        var active = [];


        active = membersActive.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });
        
        unActive = memberUnactive.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });

       
        var header = "<thead><tr><th>Position</th><th>User</th><th>Name</th><th>Daily Rating</th><th>Current Games</th><th>Last Connection</th></tr></thead>";
       
        var body = "";
        var position = 0;

        active.forEach(function(data, index){
            var dateString = (data.LastConnection == null || data.LastConnection == undefined)? "": data.LastConnection.toDateString();
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+dateString+"</td>"+"</tr>";          
           
        });

        unActive.forEach(function(data, index){
            var dateString = (data.LastConnection == null || data.LastConnection == undefined)? "": data.LastConnection.toDateString();
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+dateString+ (" (Unactive)") +"</td>"+"</tr>";          
        });
        
        body = "<tbody>"+ body +"</tbody>";

        return "<table class='pure-table'>" + header + body + "</table>";
    }

    function CreateBlitzRatingTable(membersActive, memberUnactive)
    {
        var unActive = [];
        var active = [];

        active = membersActive.sort(function(a,b){
            return b.BlitzRating - a.BlitzRating;
        });
        
        unActive = memberUnactive.sort(function(a,b){
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
    function Create960RatingTable(membersActive, memberUnactive)
    {
        var unActive = [];
        var active = [];

        active = membersActive.sort(function(a,b){
            return b.DailyRating960 - a.DailyRating960;
        });
        
        unActive = memberUnactive.sort(function(a,b){
            return b.DailyRating960 - a.DailyRating960;
        });

       
        var header = "<thead><tr><th>Position</th><th>User</th><th>Name</th><th>960 Rating</th><th>Current Games</th><th>Last Connection</th></tr></thead>";
       
        var body = "";
        var position = 0;

        active.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating960+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+"</td>"+"</tr>";          
           
        });

        unActive.forEach(function(data, index){
            position++;
            body+= "<tr>"+"<td>"+(position )+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating960+"</td>"+ "<td>"+data.Games.length+"</td>"+"<td>"+data.LastConnection.toDateString()+ (" (Unactive)") +"</td>"+"</tr>";          
        });
        
        body = "<tbody>"+ body +"</tbody>";

        return "<table class='pure-table'>" + header + body + "</table>";
    }

    function CreateGruops(members, grupos)
    {
        debugger;

        var userGroup = [];
        for(var grupo in grupos)
        {
            if(grupos.hasOwnProperty(grupo))
            {
                var groupList = grupos[grupo];
                var groupUser = new Member();

                groupUser.Name = grupo;
                groupUser.UserName = grupo;
                groupUser.DailyRating = 0;
                groupUser.TacticsRating = 0;
                groupUser.BlitzRating = 0;
                groupUser.DailyRating960 = 0;
                groupUser.LastConnection = null;

                var dailysum = 0;
                var count = 0;

                console.log("Grupo: " + grupo);
                var miembrosStr = "";

                members.forEach(function(mem){

                    var exists = false;

                    groupList.forEach(function(userInList){
                        if(mem.UserName == userInList.toLowerCase())
                        {
                            miembrosStr+= mem.UserName+ ",";
                            exists = true;
                            return false;
                        }
                    });

                    if(exists)
                    {
                        count++;

                        if(mem.DailyRating != undefined && mem.DailyRating != null)
                        {
                            dailysum += mem.DailyRating;
                        }
                    }

                });

                console.log(miembrosStr);

                if(count > 0)
                    groupUser.DailyRating = dailysum / count;

                userGroup.push(groupUser);
            }
        }

        return userGroup;
    }

   

    function CreateList()
    {
        var dayTime = 1000*60*60*24;
        var twoWeekTime = dayTime * 14;
        var currentDateTime = new Date().getTime();
        var thresholdTime = twoWeekTime;
       
        var unActive = [];
        var active = [];
        var teamRatingDaily = 0;

        memberObjs.forEach(function(e){
            var timeElapsed = currentDateTime - e.LastConnection.getTime();

            if(timeElapsed > thresholdTime)
                unActive.push(e);
            else
                active.push(e);
        });

        var countMembers = 0;
        var sumRating = 0;
        active.forEach(function(e){

          if(e.DailyRating != undefined && e.DailyRating != null)
          {
              sumRating += e.DailyRating;
            countMembers++;
          }

        });

        teamRatingDaily = (countMembers > 0)? sumRating / countMembers : 0;
        teamRatingDaily = teamRatingDaily.toFixed(2);

        var membersGroup = CreateGruops(active, grupos);

       
        var html1 = CreateDailyRatingTable(active, unActive);
        var html2 = CreateTacticsRatingTable(active, unActive);
        var html3 = CreateBlitzRatingTable(active, unActive);
        var html4 = Create960RatingTable(active, unActive);

        var html5 = CreateDailyRatingTable(membersGroup, []);

        var html = "<div>Daily Rating. (Team rating average: "+teamRatingDaily + ")</div>" + html1 + "<div>Tactics Rating</div>" + html2 + "<div>Blitz Rating</div>" + html3 + "<div>chess 960 Rating</div>" + html4+ "<div>projects Rating</div>"+ html5; 

        window.document.body.innerHTML = html;
    }

    window.onload = Start;
    
}());

