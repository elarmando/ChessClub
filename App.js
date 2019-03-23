
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

        miembros.forEach(function(member ){
            GetUserData(member, function(data){
                debugger;
                AppendUserData(data);
                console.log(data);
            });
        });
        
    }

    function AppendUserData(data)
    {
        memberObjs.push(data);

        memberObjs = memberObjs.sort(function(a,b){
            return b.DailyRating - a.DailyRating;
        });
        

        var html = "";

        memberObjs.forEach(function(data, index){
            html+=index +"," + data.Name + ", " + data.UserName + ","+data.DailyRating + "<br>";
        });
        

        window.document.body.innerHTML = html;
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
        r.open("GET","https://api.chess.com/pub/player/" + username );
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
        r.open("GET","https://api.chess.com/pub/player/" + username +"/stats" );
        r.send();
    }

    window.onload = Start;

    

}());

