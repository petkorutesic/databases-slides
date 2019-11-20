// If the query includes 'print-pdf', include the PDF print sheet
if (window.location.search.match(/print-pdf/gi)) {
	console.log("Print version requested");

	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'node_modules/reveal.js/css/print/pdf.css';
	document.getElementsByTagName('head')[0].appendChild(link);

	link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'reveal/dhbw-print.css';
	document.getElementsByTagName('head')[0].appendChild(link);

}

function toggleDisplaySolutionsKeyHandler(e) {
	let showAllKey = "T"
	let showThisSlideKey = "t"

	var rootElement = ((e.key === showThisSlideKey) ? document : undefined) || Reveal.getCurrentSlide() || document;

	if (e.key === showThisSlideKey || e.key === showAllKey) {
		// Try to toggle elements of the current slide. If not, use the document

		for (e of rootElement.querySelectorAll('.solution,.solutionvisible')) {
			e.classList.toggle('solutionvisible');
			e.classList.toggle('solution');
		}
	}
}

function getPackageJson(cb) {
	let req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			cb(JSON.parse(this.responseText) || {})
		}
	}
	req.open("GET", "package.json", true);
	req.send();
}

let showLinkToSlidesAndQrCodeUrl = undefined

function showLinkToSlidesAndQrCode() {
	if (showLinkToSlidesAndQrCodeUrl === undefined)
		return

	for (let qrel of document.getElementsByClassName('qrcodeforslides')) {
		QRCode.toCanvas(qrel, showLinkToSlidesAndQrCodeUrl, { scale: 15, margin: 0 }, function (error) {
			if (error) console.error(error)
		});
	}

	for (let linkel of document.getElementsByClassName('urlforslides')) {
		linkel.href = showLinkToSlidesAndQrCodeUrl;
		linkel.text = showLinkToSlidesAndQrCodeUrl.replace("https://", "").replace("http://", "");
	}

}

function init(urlToSlides) {
	document.removeEventListener('keyup', toggleDisplaySolutionsKeyHandler);
	document.addEventListener('keyup', toggleDisplaySolutionsKeyHandler);

	if (urlToSlides !== undefined)
		showLinkToSlidesAndQrCodeUrl = urlToSlides
	Reveal.addEventListener('slidechanged', showLinkToSlidesAndQrCode)

	Reveal.initialize({
		// Display controls in the bottom right corner
		controls: false,
		// Display a presentation progress bar
		progress: true,
		// Display the page number of the current slide
		slideNumber: true,
		// Push each slide change to the browser history
		history: true,
		// none/fade/slide/convex/concave/zoom
		transition: 'slide',
		// Transition speed // default/fast/slow
		transitionSpeed: 'default',
		// Vertical centering of slides
		center: false,
		//Markdown config
		markdown: {
			smartypants: true,
		},
		keyboard: {
			33: function () { Reveal.left(); }, // Don't go up using the presenter
			34: function () { Reveal.right(); }, // Don't go down using the presenter
			65: function () { window.location.assign("./#/agenda") } //Go to the agenda (./#agenda) when 'a' is pressed
		},
		// Bounds for smallest/largest possible scale to apply to content
		minScale: 0.1,
		maxScale: 3,

		// Factor of the display size that should remain empty around the content
		margin: 0.05,
		dependencies: [
			// Cross-browser shim that fully implements classList - https://github.com/eligrey/classList.js/
			{
				src: 'node_modules/reveal.js/lib/js/classList.js',
				condition: function () {
					return !document.body.classList;
				}
			},

			// Interpret Markdown in <section> elements
			{
				src: 'node_modules/reveal.js/plugin/markdown/marked.js',
				condition: function () {
					return !!document.querySelector('[data-markdown]');
				}
			},
			{
				src: 'node_modules/reveal.js/plugin/markdown/markdown.js',
				condition: function () {
					return !!document.querySelector('[data-markdown]');
				}
			},

			// Syntax highlight for <code> elements
			{
				src: 'node_modules/reveal.js/plugin/highlight/highlight.js',
				async: true,
				callback: function () {
					hljs.initHighlightingOnLoad();
				}
			},

			// Zoom in and out with Alt+click
			{
				src: 'node_modules/reveal.js/plugin/zoom-js/zoom.js',
				async: true
			},

			// Speaker notes
			{
				src: 'node_modules/reveal.js/plugin/notes/notes.js',
				async: true
			},
			// MathJax
			{
				src: 'node_modules/reveal.js/plugin/math/math.js',
				async: true
			}
		]
	});

}

setTimeout(function () {

	//console.log("Adding credits tag");

	var credits = document.createElement("attribution");
	credits.setAttribute("id", "attribution");
	document.querySelector('div.reveal').appendChild(credits);

	//console.log("Adding event listener");

	Reveal.addEventListener('slidechanged', function (event) {
		//This will set the current credits correctly
		var creditsTag = document.getElementById("attribution");
		var creditsText = "";

		if (event.currentSlide != null &&
			event.currentSlide.getElementsByTagName("credits") != null &&
			event.currentSlide.getElementsByTagName("credits")[0] != null) {

			var currentCredits = event.currentSlide.getElementsByTagName("credits")[0];
			creditsText = currentCredits.innerHTML;
		}

		//console.log("Setting credits to" + creditsText);
		if ("" !== creditsText)
			creditsTag.innerHTML = "<span>" + creditsText + "</span>";
		else
			creditsTag.innerHTML = "";

	});

}, 1000);


function loadDocumentFromUriAndSetTitle(indexDocument) {
	var doc = indexDocument
	var decoded = decodeURI(window.location.search);
	//console.log("Decoded [" + decoded + "]")

	var match = decoded.match(/\?([\w\s-]+.md)/);
	//console.log("match ", match)

	if (match && match[1]) {
		//console.log("match!", match)
		doc = match[1];
	}

	//console.log("Loading ", doc)
	document.writeln('<section data-markdown="' + doc + '" data-separator="^---" data-separator-vertical="^vvv" data-charset="utf-8"></section>');

	init();

	getPackageJson(packageJson => {
		let description = packageJson.description
		let title = (description !== undefined) ? description + " - " : ""
		title += doc.replace(".md", "");
		//console.log(`Setting title to '${title}', description = '${description}'`)
		document.title = title;
	});
}
