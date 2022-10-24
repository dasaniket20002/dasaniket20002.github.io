var intro = document.querySelectorAll(".intro h1");
var time = 150;
const num_languages = intro.length;

var i = 0;

function intro_play() {
	i++;

	if (num_languages - i == 9) time += 25;
	if (num_languages - i == 7) time += 50;
	if (num_languages - i == 5) time += 50;

	if (i < num_languages) {
		setTimeout(intro_play, time);
		intro[i - 1].classList.remove("active");
		intro[i].classList.add("active");
	} else {
		intro[i - 1].classList.add("active");
		document.querySelector(".intro").classList.add("exit");
		setTimeout(function () {
			document.querySelector(".intro-container").classList.add("exit");
		}, 2000);
		setTimeout(function () {
			document.querySelector(".intro-container").classList.add("exited");
		}, 2500);
	}
}
setTimeout(intro_play, time);
