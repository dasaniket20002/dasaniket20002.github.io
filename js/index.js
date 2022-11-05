var intro = document.querySelectorAll(".intro-container .intro h1");
var time = 150;
const num_languages = intro.length;

var lang_index = 0;

function intro_play() {
	lang_index++;

	if (num_languages - lang_index == 9) time += 25;
	if (num_languages - lang_index == 7) time += 50;
	if (num_languages - lang_index == 5) time += 50;

	if (lang_index < num_languages) {
		setTimeout(intro_play, time);
		intro[lang_index - 1].classList.remove("active");
		intro[lang_index].classList.add("active");
	} else {
		intro[lang_index - 1].classList.add("active");
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

document.getElementById("set_year").innerHTML =
	"&#169;" + new Date().getFullYear();

var skill_list = document.querySelectorAll(
	".about-container .about .skills ul li"
);
for (let i = 0; i < skill_list.length; i++) {
	skill_list[i].addEventListener("click", (event) => {
		handleClick(i);
	});
}

function handleClick(i) {
	skill_list[i].classList.add("active");
	skill_list[i].style.fontSize = "3.5vh";
	for (let j = 0; j < skill_list.length; j++) {
		if (i == j) continue;
		skill_list[j].classList.remove("active");
		skill_list[j].style.fontSize = "1.75vh";
	}
}

const anim_texts = ["GET IN TOUCH", "LET ME KNOW", "LET'S HAVE A CHAT"];
let form_anim_index = 0;
var form_anim_element = document.querySelector(
	".form-container form section h1 span"
);
function form_anim() {
	form_anim_element.innerHTML = anim_texts[form_anim_index];
	form_anim_index = (form_anim_index + 1) % anim_texts.length;
}
setInterval(form_anim, 7000);
