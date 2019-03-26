
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

                if(success instanceof Function)
                    success(member);

            });         
        }

        r.onerror = error;
        r.open("GET","https://api.chess.com/pub/player/" + username, false );
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

    function CreateList()
    {
        memberObjs = memberObjs.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });
        
       
        var header = "<thead><tr><th>Position</th><th>Usuario</th><th>Nombre</th><th>Daily Rating</th></tr></thead>";
       
        var body = "";
        
        memberObjs.forEach(function(data, index){
            body+= "<tr>"+"<td>"+(index + 1)+"</td>" + "<td>"+data.UserName+"</td>"+ "<td>"+( (data.Name == undefined)? "" : data.Name) +"</td>"+ "<td>"+data.DailyRating+"</td>"+ "</tr>";
          
        });
        
        body = "<tbody>"+ body +"</tbody>"
          
        window.document.body.innerHTML = "<table class='pure-table'>" + header + body + "</table>";
    }

    window.onload = Start;
    
}());

