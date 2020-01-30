let podaci = []; 
let smjerSortiranjaASC = 1; 

function popuniSezone(){
    for(var i=1960; i<=2019;i++){
        document.getElementById("select").innerHTML += "<option value="
            +i +">" + i + "</option>"
    }
}

function prikaziPodatke(sezona) {

    document.getElementById("rezultati").innerHTML = "";
    if (sezona == null || sezona == "") {
        return;
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(request.readyState == 4 && request.status == 200) {
            var json = JSON.parse(request.responseText);
           
            podaci = json.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(element => {
                return { 
                    nacija: element.Driver.nationality,
                    ime: element.Driver.givenName,
                    prezime: element.Driver.familyName,
                    bodovi: Number(element.points),
                    konstruktor: element.Constructors[0].name,
                    link: element.Driver.url
                };
            });
            
            popuniTabelu();
        }
    }

    request.open("GET", "https://ergast.com/api/f1/" + sezona + "/driverStandings.json");
   
    request.send();
}

function sortiraj(kolona) {
    podaci.sort(function (a, b) {
        if (a[kolona] > b[kolona]) {
            return smjerSortiranjaASC; 
        }
        if (a[kolona] < b[kolona]) {
            return -1 * smjerSortiranjaASC; 
        }
        return 0;
    });
    smjerSortiranjaASC = -1 * smjerSortiranjaASC; 
    popuniTabelu();
}

function popuniTabelu() {
    let tabela = document.getElementById("rezultati");
    tabela.innerHTML = "";

    podaci.forEach((element, index) => {
        let red = tabela.insertRow(index);
        let drzava = red.insertCell(0);
        let ime = red.insertCell(1);
        let prezime = red.insertCell(2);
        let bodovi = red.insertCell(3);
        let konstruktor = red.insertCell(4);
        let link = red.insertCell(5);

        drzava.innerHTML = "<img height=\"40\" src=\"" + pronadjiZastavu(element.nacija) + "\"/> ";
        ime.innerHTML = element.ime;
        prezime.innerHTML = element.prezime;
        bodovi.innerHTML = element.bodovi;
        konstruktor.innerHTML = element.konstruktor;
        link.innerHTML = "<a href=\"" + element.link + "\" target=\"_blank\">Link</a>";
    });
}

