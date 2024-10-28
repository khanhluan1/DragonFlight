"use strict";

const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

window.addEventListener(
	"pointermove",
	(e) => {
		pointer.x = e.clientX;
		pointer.y = e.clientY;
		rad = 0;
	},
	false
);

const resize = () => {
	width = window.innerWidth;
	height = window.innerHeight;
};

let width, height;
window.addEventListener("resize", () => resize(), false);
resize();

class Dragon {
	constructor(id, startX, startY) {
		this.id = id;
		this.elems = [];
		this.pointer = { x: startX, y: startY };
		this.rad = 0;
		this.frm = Math.random();
		this.speed = 3;

		for (let i = 0; i < N; i++) {
			this.elems[i] = { use: null, x: startX, y: startY };
		}

		this.createDragon();
	}

	createDragon() {
		for (let i = 1; i < N; i++) {
			if (i === 1) this.prepend("Cabeza", i);
			else if (i === 8 || i === 14) this.prepend("Aletas", i);
			else this.prepend("Espina", i);
		}
	}

	prepend(use, i) {
		const elem = document.createElementNS(xmlns, "use");
		this.elems[i].use = elem;
		elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
		screen.prepend(elem);
	}

	update() {
		let e = this.elems[0];
		const ax = (Math.cos(3 * this.frm) * this.rad * width) / height;
		const ay = (Math.sin(4 * this.frm) * this.rad * height) / width;
		e.x += ((ax + this.pointer.x - e.x) / 10) * this.speed;
		e.y += ((ay + this.pointer.y - e.y) / 10) * this.speed;
		for (let i = 1; i < N; i++) {
			let e = this.elems[i];
			let ep = this.elems[i - 1];
			const a = Math.atan2(e.y - ep.y, e.x - ep.x);
			e.x += ((ep.x - e.x + (Math.cos(a) * (100 - i)) / 5) / 4) * this.speed;
			e.y += ((ep.y - e.y + (Math.sin(a) * (100 - i)) / 5) / 4) * this.speed;
			const s = (162 + 4 * (1 - i)) / 50;
			e.use.setAttributeNS(
				null,
				"transform",
				`translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
					(180 / Math.PI) * a
				}) translate(${0},${0}) scale(${s},${s})`
			);
		}
		if (this.rad < radm) this.rad++;
		this.frm += 0.003 * this.speed;
		if (this.rad > 60) {
			this.pointer.x += (width / 2 - this.pointer.x) * 0.05 * this.speed;
			this.pointer.y += (height / 2 - this.pointer.y) * 0.05 * this.speed;
		}
	}
}

const N = 40;
const radm = Math.min(width / 2, height / 2) - 20;

const dragons = [];


dragons.push(new Dragon(1, width / 4, height / 4));
dragons.push(new Dragon(2, 3 * width / 4, height / 4));
dragons.push(new Dragon(3, width / 4, 3 * height / 4));
dragons.push(new Dragon(4, 3 * width / 4, 3 * height / 4));
dragons.push(new Dragon(5, width / 2, height / 2)); 

dragons[0].speed = 1;
dragons[1].speed = 1.2;
dragons[2].speed = 0.8;
dragons[3].speed = 1.5;
dragons[4].speed = 1.3; 

window.addEventListener(
	"pointermove",
	(e) => {
		dragons.forEach(dragon => {
			dragon.pointer.x = e.clientX;
			dragon.pointer.y = e.clientY;
			dragon.rad = 0;
		});
	},
	false
);

const speedControl = document.getElementById("speedControl");

speedControl.addEventListener("click", () => {
	dragons.forEach(dragon => {
		dragon.speed = dragon.speed === 1 ? 2 : 1;
	});
	speedControl.textContent = dragons[0].speed === 1 ? "Tăng tốc" : "Giảm tốc";
});

const run = () => {
	requestAnimationFrame(run);
	dragons.forEach(dragon => dragon.update());
};

run();
