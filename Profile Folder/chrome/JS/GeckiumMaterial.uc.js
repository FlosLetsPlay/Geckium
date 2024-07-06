// ==UserScript==
// @name        GeckiumMaterial - Temporary Functions
// @author      AngelBruni
// @loadorder   2
// @include     *
// ==/UserScript==

function openZoo() {
	const url = "about:gmzoo";

	if (gkPrefUtils.tryGet("Geckium.gmWindow.newTab").bool) {
		openTrustedLinkIn(url, "tab")
	} else {
		for (let win of Services.wm.getEnumerator("geckiummaterial:zoo")) {
			if (win.closed)
				continue;
			else
				win.focus();
			return;
		}
		
		const gmWindow = window.openDialog(url, "", "centerscreen");
		gmWindow.onload = () => {
			gmWindow.document.documentElement.setAttribute("containertype", "window");
		}	
	}
}

function openGSplash() {
	const url = "about:gsplash";

	for (let win of Services.wm.getEnumerator("geckiummaterial:gsplash")) {
		if (win.closed)
			continue;
		else
			win.focus();
		return;
	}
	
	const gmWindow = window.openDialog(url, "", "centerscreen");
	gmWindow.onload = () => {
		gmWindow.document.documentElement.setAttribute("containertype", "window");
	}
}

function openGWizard() {
	const url = "about:gwizard";

	for (let win of Services.wm.getEnumerator("geckiummaterial:gwizard")) {
		if (win.closed)
			continue;
		else
			win.focus();
		return;
	}
	
	const gmWindow = window.openDialog(url, "", "centerscreen");
	gmWindow.onload = () => {
		gmWindow.document.documentElement.setAttribute("containertype", "window");
	}
}

function openGSettings(mode) {
	const url = "about:gsettings";

	if (gkPrefUtils.tryGet("Geckium.gmWindow.newTab").bool && mode !== "wizard") {
		openTrustedLinkIn(url, "tab")
	} else {
		for (let win of Services.wm.getEnumerator("geckiummaterial:gsettings")) {
			if (win.closed)
				continue;
			else
				win.focus();
			return;
		}
		
		const gmWindow = window.openDialog(url, "", "centerscreen");
		gmWindow.onload = () => {
			gmWindow.document.documentElement.setAttribute("containertype", "window");

			if (mode)
				gmWindow.document.documentElement.setAttribute("contentmode", mode);
		}
	}
}

function openAbout() {
	if (gkEras.getEra("Geckium.appearance.choice") <= 21)
		window.openDialog("about:about", "", "centerscreen");
	else
		openTrustedLinkIn("about:preferences#about", "tab");
}