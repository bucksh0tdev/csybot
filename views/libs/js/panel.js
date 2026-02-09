if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js');
	});
}

$(document).ready(function() {
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

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

// show sidebar
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
})

// close sidebar
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
})