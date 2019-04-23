var handle = null;
var now=0;
window.onload = start;

function start() {
	handler = self.setInterval(next, 3000);
}

function next() {
	var image = document.getElementById("slideshow").getElementsByTagName("img");
	var next = (now+1)%4;
	image[next].style.zIndex = 3;
	image[now].style.zIndex = 2;
	image[next].style.opacity = 1;
	image[now].style.zIndex = 1;
	image[now].style.opacity = 0;
	now = (now+1)%4;
}

