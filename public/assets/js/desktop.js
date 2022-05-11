moment.locale('pt-br');
function dop(){

    // create new element
    const elem = document.createElement('div');
    elem.classList.add('dop');
    // add text
    elem.innerHTML = `
    <div class="threcons">
                <div class="icon"><img src="assets/img/SVG/Dock_left.svg"></div>
            </div>
            <div class="threcons">
                <div class="icon"><img src="assets/img/SVG/Merge.svg"></div>
            </div>
            <div class="threcons">
                <div class="icon"><img src="assets/img/SVG/Dock_right.svg"></div>
            </div>
    `;
    
    // grab target element reference
    const target = document.querySelector('.wb-title');
    
    // insert the element before target element
    target.parentNode.insertBefore(elem, target);
            }

            var hiop = document.getElementById("hiop");
            var startmenu = document.getElementById("startmenu");

            var date = moment().format('MMMM Do YYYY'); 
            document.getElementById("date").innerHTML = date[0].toUpperCase() + date.substr(1);
            document.getElementById("time").innerHTML = moment().format('h:mm a');
            setInterval(() => {
                var date = moment().format('MMMM Do YYYY'); 
                document.getElementById("date").innerHTML = date[0].toUpperCase() + date.substr(1);
                document.getElementById("time").innerHTML = moment().format('h:mm a');
            }, 1000);
            


            function hidefun(){
                startmenu.style.display = "none";
                hiop.style.display = "none";
            }


            function strtmenu(){
                    if (startmenu.style.display === "block") {
                    startmenu.style.display = "none";
                    hiop.style.display = "none";
    
        }
     else {
            startmenu.style.display = "block";
            hiop.style.display = "block";
      }
            }
    
            function vscode() {
                new WinBox("VS Code", {
    
                    url: "https://vscode.dev/",
                    bottom: 80,
                    background: "#252526",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
            function yt() {
                window.open(
                  "https://www.youtube.com/channel/UCQX3joIy_dVHl4v7A8mNWqQ?sub_confirmation=1", "_blank");
            }
    
            function browser() {
                new WinBox("Chrome", {
    
                    url: "pages/navegador.html",
                    top: 28.8,
                    bottom: 95,
                    background: "",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
            function calculator() {
                new WinBox("Calculator", {
    
                    url: "apps/calc.html",
                    bottom: 80,
                    background: "#1f1c3d",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "30%",
                    height: "100%"
                });
                dop();
            }
    
            function files() {
                new WinBox("Files", {
    
                    url: "comingsoon.html",
                    bottom: 80,
                    background: "",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
    
            function games() {
                new WinBox("Games", {
    
                    url: "comingsoon.html",
                    bottom: 80,
                    background: "#1e608d",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
    
            function mail() {
                new WinBox("mail", {
    
                    url: "apps/mail.html",
                    bottom: 80,
                    background: "#1e608d",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
            function music() {
                new WinBox("Spotify(Not real)", {
    
                    url: "apps/spotify.html",
                    bottom: 80,
                    background: "#121212",
                    max: false,
                    class: ["no-full"],
                    x: "center",
                    y: "center",
                    width: "60%",
                    height: "65%"
                });
                dop();
            }
    
    
    
    
    // create new element
    const elem = document.createElement('div');
    elem.classList.add('dop');
    // add text
    elem.innerText = 'test';
    
    // grab target element reference
    const target = document.querySelector('.wb-title');
    
    // insert the element before target element
    // target.parentNode.insertBefore(elem, target);