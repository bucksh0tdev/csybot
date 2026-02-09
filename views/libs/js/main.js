if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js');
	});
}

function parser(count) {
  const lookup = [{
            value: 1,
            symbol: ""
        }, {
            value: 1e3,
            symbol: "k"
        }, {
            value: 1e6,
            symbol: "M"
        }, {
            value: 1e9,
            symbol: "G"
        }, {
            value: 1e12,
            symbol: "T"
        }, {
            value: 1e15,
            symbol: "P"
        }, {
            value: 1e18,
            symbol: "E"
        }];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(item => count >= item.value);
        return item ? (count / item.value).toFixed(1).replace(rx, "$1") + String(item.symbol) : "0";
 }    

function numberselect(now, target) {
  if(Number(target) > 100000) {

    if((Number(now) + 200000) > target) {
       if((Number(now) + 50000) > target) {
         return target;
       } else {
        return (Number(target) - Number(now));       
       }
    } else {
      return 100000; 
    }
  } else if(Number(target) > 1000) {
    if((Number(now) + 1000) > target) {
      if((Number(now) + 100) > target) {
        return (Number(target) - Number(now));
      } else {
        return 100;
      }
    } else {
      return 1000;
    }  
  } else if(Number(target) > 100) {
    return 10;
  } else {
    return 1;
  }
}

$(document).ready(function() {
  const counters = document.querySelectorAll("#counters");
      counters.forEach((counter)=>{
          let count = 0;
          const counttarget = parseInt(counter.getAttribute("data-count"));

          const updateCounter = () => {
              let msc = 0;
              if (counttarget > 100000) {
                 msc = 150;
              } else {
                msc = 100;
              }

              count = Number(count) + Number(numberselect(count, counttarget));
              counter.innerHTML = parser(count);
              if (count < counttarget) {
                  setTimeout(updateCounter, msc);
              }
          };
          updateCounter();
      });
  
	/* Download */
	const installButton = document.getElementById('install-app');

	let beforeInstallPromptEvent
	window.addEventListener("beforeinstallprompt", function (e) {
		e.preventDefault();
		beforeInstallPromptEvent = e
		installButton.style.display = 'block'
		installButton.addEventListener("click", function () {
			e.prompt();
		});
		installButton.hidden = false;
	});
	installButton.addEventListener("click", function () {
		beforeInstallPromptEvent.prompt();
	});

  /* Download */
  
});

    $("a[href='#']").click(function(a) {
        console.log(a);
        $("html, body").animate({ scrollTop: $("#invite").offset().top }, "slow");
        return false;
      });


      window.blanker = function (target) {
        $("html, body").animate({ scrollTop: $(`#${target}`).offset().top }, "slow");
        return false;
    }