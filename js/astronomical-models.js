(function () {

	'use strict';

	var TAU = Math.PI * 2;
	var GOLD = '#f0d477';
	var GOLD_RGB = '212,175,55';
	var IVORY_RGB = '247,241,223';
	var EARTH = '#7f9fd6';

	/* ---------- ابزارهای رسم ---------- */

	function ring(ctx, x, y, r, style, lw, dash) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, TAU);
		ctx.strokeStyle = style;
		ctx.lineWidth = lw || 1;
		ctx.setLineDash(dash || []);
		ctx.stroke();
		ctx.setLineDash([]);
	}

	function seg(ctx, x1, y1, x2, y2, style, lw) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.strokeStyle = style;
		ctx.lineWidth = lw || 1;
		ctx.stroke();
	}

	function dot(ctx, x, y, r, fill, glow) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, TAU);
		ctx.fillStyle = fill;
		if (glow) {
			ctx.shadowColor = glow;
			ctx.shadowBlur = 8;
		}
		ctx.fill();
		ctx.shadowBlur = 0;
	}

	function trail(ctx, posFn, t, n, dt, rgb) {
		var prev = posFn(t - n * dt);
		for (var k = n - 1; k >= 0; k--) {
			var cur = posFn(t - k * dt);
			var a = (1 - k / n) * 0.85;
			seg(ctx, prev[0], prev[1], cur[0], cur[1], 'rgba(' + rgb + ',' + a.toFixed(3) + ')', 1.2);
			prev = cur;
		}
	}

	var defStyle = 'rgba(' + IVORY_RGB + ',0.30)';
	var epiStyle = 'rgba(' + IVORY_RGB + ',0.5)';
	var lineStyle = 'rgba(' + GOLD_RGB + ',0.45)';

	/* ---------- ۱) افلاک هم‌مرکز (اودوکسوس) ---------- */

	function eudoxus(ctx, w, h, t) {

		var cx = w / 2, cy = h / 2, R = w * 0.43;

		/* کرات هم‌مرکز و ثوابت */
		ring(ctx, cx, cy, R, 'rgba(' + GOLD_RGB + ',0.55)', 1);
		ring(ctx, cx, cy, R * 0.78, defStyle, 0.8, [3, 3]);
		ring(ctx, cx, cy, R * 0.56, defStyle, 0.8, [3, 3]);

		var spin = t * 0.08;
		for (var i = 0; i < 12; i++) {
			var a = spin + i * TAU / 12;
			seg(ctx,
				cx + Math.cos(a) * R * 0.93, cy + Math.sin(a) * R * 0.93,
				cx + Math.cos(a) * R,        cy + Math.sin(a) * R,
				'rgba(' + GOLD_RGB + ',0.7)', 1);
		}

		/* سیاره روی هیپوپِد (هشت‌گون): مرکز آن را کره‌ی بیرونی می‌برد */
		function pos(tt) {
			var a = 0.3 * tt;
			var s = 1.5 * tt;
			var rc = R * 0.78;
			var tang = R * 0.2 * Math.sin(s);
			var rad = R * 0.07 * Math.sin(2 * s);
			var ux = Math.cos(a), uy = Math.sin(a);
			return [
				cx + ux * (rc + rad) - uy * tang,
				cy + uy * (rc + rad) + ux * tang
			];
		}

		trail(ctx, pos, t, 70, 0.07, GOLD_RGB);
		var p = pos(t);
		dot(ctx, cx, cy, 2.6, EARTH, 'rgba(127,159,214,0.8)');
		dot(ctx, p[0], p[1], 2.8, GOLD, 'rgba(240,212,119,0.9)');
	}

	/* ---------- ۲) بطلمیوس: خارج‌مرکز، تدویر، معدل‌المسیر ---------- */

	function ptolemy(ctx, w, h, t) {

		var cx = w / 2, cy = h / 2;
		var Rd = w * 0.29, e = w * 0.045, r = w * 0.10;
		var ox = cx - e;                 /* زمین کمی چپ‌تر تا کل شکل وسط بماند */
		var Cx = ox + e, Ex = ox + 2 * e;

		function epiCenter(tt) {
			var al = 0.35 * tt;
			var ux = Math.cos(al), uy = Math.sin(al);
			var dx = Ex - Cx;            /* بردار از مرکز فلک حامل تا معدل */
			var du = dx * ux;
			var s = -du + Math.sqrt(du * du - dx * dx + Rd * Rd);
			return [Ex + s * ux, cy + s * uy];
		}

		function pos(tt) {
			var c = epiCenter(tt);
			var b = 1.7 * tt;
			return [c[0] + Math.cos(b) * r, c[1] + Math.sin(b) * r];
		}

		ring(ctx, Cx, cy, Rd, defStyle, 0.9);

		var c = epiCenter(t);
		var p = pos(t);

		trail(ctx, pos, t, 150, 0.06, GOLD_RGB);

		ring(ctx, c[0], c[1], r, epiStyle, 0.9, [2.5, 2.5]);
		seg(ctx, Ex, cy, c[0], c[1], lineStyle, 0.8);       /* خط از معدل */
		seg(ctx, ox, cy, p[0], p[1], 'rgba(127,159,214,0.4)', 0.8);

		/* مرکز فلک حامل (×) و معدل‌المسیر (◦) */
		seg(ctx, Cx - 2.5, cy - 2.5, Cx + 2.5, cy + 2.5, defStyle, 1);
		seg(ctx, Cx - 2.5, cy + 2.5, Cx + 2.5, cy - 2.5, defStyle, 1);
		ring(ctx, Ex, cy, 2.4, 'rgba(' + GOLD_RGB + ',0.95)', 1);

		dot(ctx, ox, cy, 2.8, EARTH, 'rgba(127,159,214,0.8)');
		dot(ctx, p[0], p[1], 2.8, GOLD, 'rgba(240,212,119,0.9)');
	}

	/* ---------- ۳) زوج طوسی ---------- */

	function tusi(ctx, w, h, t) {

		var cx = w / 2, cy = h / 2, R = w * 0.40;
		var th = 0.9 * t;

		ring(ctx, cx, cy, R, 'rgba(' + GOLD_RGB + ',0.55)', 1);

		/* محورهای نوسان خطی */
		seg(ctx, cx - R, cy, cx + R, cy, 'rgba(' + IVORY_RGB + ',0.14)', 0.8);
		seg(ctx, cx, cy - R, cx, cy + R, 'rgba(' + IVORY_RGB + ',0.14)', 0.8);

		var rs = R / 2;
		var sx = cx + rs * Math.cos(th), sy = cy + rs * Math.sin(th);

		ring(ctx, sx, sy, rs, epiStyle, 0.9);

		var px = sx + rs * Math.cos(-th), py = sy + rs * Math.sin(-th);             /* روی قطر افقی */
		var qx = sx + rs * Math.cos(-th + Math.PI), qy = sy + rs * Math.sin(-th + Math.PI); /* روی قطر عمودی */

		seg(ctx, px, py, qx, qy, lineStyle, 0.8);

		dot(ctx, sx, sy, 1.8, 'rgba(' + IVORY_RGB + ',0.7)');
		dot(ctx, px, py, 2.8, GOLD, 'rgba(240,212,119,0.9)');
		dot(ctx, qx, qy, 2.8, '#dbe6ff', 'rgba(180,205,255,0.9)');
	}

	/* ---------- ۴) ابن‌شاطر: دو فلک تدویر ---------- */

	function shatir(ctx, w, h, t) {

		var cx = w / 2, cy = h / 2;
		var R1 = w * 0.27, r1 = w * 0.12, r2 = w * 0.05;

		function parts(tt) {
			var a = 0.3 * tt, b = 1.25 * tt, c = -2.9 * tt;
			var e1 = [cx + Math.cos(a) * R1, cy + Math.sin(a) * R1];
			var e2 = [e1[0] + Math.cos(b) * r1, e1[1] + Math.sin(b) * r1];
			var p = [e2[0] + Math.cos(c) * r2, e2[1] + Math.sin(c) * r2];
			return { e1: e1, e2: e2, p: p };
		}

		function pos(tt) { return parts(tt).p; }

		ring(ctx, cx, cy, R1, defStyle, 0.9);

		var q = parts(t);

		trail(ctx, pos, t, 150, 0.06, GOLD_RGB);

		ring(ctx, q.e1[0], q.e1[1], r1, epiStyle, 0.9, [2.5, 2.5]);
		ring(ctx, q.e2[0], q.e2[1], r2, epiStyle, 0.8);
		seg(ctx, cx, cy, q.e1[0], q.e1[1], lineStyle, 0.8);
		seg(ctx, q.e1[0], q.e1[1], q.e2[0], q.e2[1], lineStyle, 0.8);
		seg(ctx, cx, cy, q.p[0], q.p[1], 'rgba(127,159,214,0.4)', 0.8);

		dot(ctx, cx, cy, 2.8, EARTH, 'rgba(127,159,214,0.8)');
		dot(ctx, q.p[0], q.p[1], 2.8, GOLD, 'rgba(240,212,119,0.9)');
	}

	var MODELS = { eudoxus: eudoxus, ptolemy: ptolemy, tusi: tusi, shatir: shatir };

	/* ---------- راه‌اندازی هر سکشن ---------- */

	function init(sec) {

		if (sec.getAttribute('data-uts-init')) {
			return;
		}
		sec.setAttribute('data-uts-init', '1');

		var starCanvas = sec.querySelector('.uts-stars');
		var items = [];
		var stars = [];
		var sctx = null, sw = 0, sh = 0;
		var running = false, visible = true, raf = 0, t0 = 0;

		var reduce = window.matchMedia &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		function setup() {

			var dpr = Math.min(window.devicePixelRatio || 1, 2);

			items = [];
			Array.prototype.forEach.call(sec.querySelectorAll('canvas[data-model]'), function (c) {
				var r = c.getBoundingClientRect();
				var w = Math.round(r.width), h = Math.round(r.height);
				if (w < 10 || h < 10) { return; }
				c.width = w * dpr;
				c.height = h * dpr;
				var ctx = c.getContext('2d');
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				items.push({ ctx: ctx, w: w, h: h, fn: MODELS[c.getAttribute('data-model')] });
			});

			if (starCanvas) {
				var rr = sec.getBoundingClientRect();
				sw = Math.round(rr.width);
				sh = Math.round(rr.height);
				starCanvas.width = sw * dpr;
				starCanvas.height = sh * dpr;
				sctx = starCanvas.getContext('2d');
				sctx.setTransform(dpr, 0, 0, dpr, 0, 0);

				var n = Math.min(130, Math.round((sw * sh) / 4500));
				stars = [];
				for (var i = 0; i < n; i++) {
					stars.push({
						x: Math.random() * sw,
						y: Math.random() * sh,
						r: Math.random() * 1.1 + 0.3,
						ph: Math.random() * TAU,
						sp: Math.random() * 1.6 + 0.5,
						gold: Math.random() < 0.18
					});
				}
			}
		}

		function draw(ms) {

			var t = ms / 1000;

			if (sctx) {
				sctx.clearRect(0, 0, sw, sh);
				for (var i = 0; i < stars.length; i++) {
					var s = stars[i];
					var a = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
					sctx.globalAlpha = reduce ? 0.6 : a;
					sctx.fillStyle = s.gold ? '#f0d477' : '#ffffff';
					sctx.beginPath();
					sctx.arc(s.x, s.y, s.r, 0, TAU);
					sctx.fill();
				}
				sctx.globalAlpha = 1;
			}

			items.forEach(function (it) {
				it.ctx.clearRect(0, 0, it.w, it.h);
				it.fn(it.ctx, it.w, it.h, t);
			});
		}

		function loop(now) {
			if (!running) { return; }
			if (!t0) { t0 = now; }
			draw(now - t0 + 4000);
			raf = requestAnimationFrame(loop);
		}

		function start() {
			if (reduce || running || !visible || document.hidden) { return; }
			running = true;
			raf = requestAnimationFrame(loop);
		}

		function stop() {
			running = false;
			cancelAnimationFrame(raf);
		}

		setup();
		draw(6000);
		start();

		if ('IntersectionObserver' in window) {
			new IntersectionObserver(function (entries) {
				visible = entries[0].isIntersecting;
				visible ? start() : stop();
			}).observe(sec);
		}

		document.addEventListener('visibilitychange', function () {
			document.hidden ? stop() : start();
		});

		var timer = 0;
		function onResize() {
			clearTimeout(timer);
			timer = setTimeout(function () { setup(); draw(6000); }, 150);
		}

		if ('ResizeObserver' in window) {
			new ResizeObserver(onResize).observe(sec);
		} else {
			window.addEventListener('resize', onResize);
		}
	}

	function boot() {
		Array.prototype.forEach.call(document.querySelectorAll('.uts-sky'), init);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}

})();
