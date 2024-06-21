// ==UserScript==
// @name        Geckium - Appearance
// @author		AngelBruni
// @description	Settings the desired appearance chosen by the user accordingly.
// @loadorder   2
// @include		main
// @include		about:preferences*
// @include		about:addons*
// ==/UserScript==

if (parseInt(Services.appinfo.version.split(".")[0]) >= 117)
	document.documentElement.setAttribute("is117Plus", true);

let previousChoice;

const appearanceChanged = new CustomEvent("appearanceChanged");

class gkVisualStyles {

	/**
	 * getVisualStyles - Gets a list of the available visual styles.
	 * 
	 * @style: If specified, it gets a list of visual styles of only a specific thing.
	 */

	static getVisualStyles(style) {
		const visualStyles = [
			/**
			 * int	  - The number used in the preference.
			 * 
			 * number - The identifier used in the style attribute.
			 * 
			 * styles - "chrome": browser UI
			 * 		    "page":   browser internal pages. Examples: "about:newtab", "about:flags", etc...
			 */

			{
				id: 0,
				int: 1,
				basedOnVersion: "1.0.154.59",
				year: [2008],
				number: "one",
				styles: ["chrome", "page"],
			},
			{
				id: 1,
				int: 3,
				basedOnVersion: "3.0.195.4",
				year: [2009],
				number: "three",
				styles: ["page"],
			},
			{
				id: 2,
				int: 4,
				basedOnVersion: "4.0.223.11",
				year: [2009],
				number: "four",
				styles: ["chrome", "page"],
			},
			{
				id: 3,
				int: 5,
				basedOnVersion: "5.0.375.125",
				year: [2009],
				number: "five",
				styles: ["chrome", "page"],
			},
			{
				id: 4,
				int: 6,
				basedOnVersion: "6.0.453.1",
				year: [2010],
				number: "six",
				styles: ["chrome", "page"],
			},
			{
				id: 5,
				int: 11,
				basedOnVersion: "11.0.696.77",
				year: [2011],
				number: "eleven",
				styles: ["chrome", "page"],
			},
			{
				id: 6,
				int: 21,
				basedOnVersion: "21.0.1180.89",
				year: [2012],
				number: "twentyone",
				styles: ["chrome", "page"],
			},
			{
				id: 7,
				int: 25,
				basedOnVersion: "25.0.1364.84",
				year: [2013],
				number: "twentyfive",
				styles: ["chrome"],
			},
			/*{
				id: 0,
				int: 30,
				basedOnVersion: "33.0.1750.3",
				year: [2013],
				number: "thirty",
				styles: ["chrome"],
			},*/
			{
				id: 8,
				int: 47,
				basedOnVersion: "47.0.2526.111",
				year: [2015],
				number: "fortyseven",
				styles: ["chrome", "page"],
			},
			{
				id: 9,
				int: 68,
				number: "sixtyeight",
				basedOnVersion: "68.0.3440.84",
				year: [2018],
				styles: ["chrome", "page"],
			},
		]

		if (style == "chrome" || style == "page")
			return Object.values(visualStyles).filter(item => item.styles.includes(style));
		else
			return visualStyles;
	}


	/**
	 * setVisualStyle - Sets the specified visual styles.
	 * 
	 * @vSInt: If not null it sets the specified visual styles, otherwise, it default to 0.
	 */

	static setVisualStyle(vSInt) {
		if (!document.URL.includes("about:g")) {
			let prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;

			if (document.URL == "about:newtab" || document.URL == "about:home" || document.URL == "about:apps") {
				switch (gkPrefUtils.tryGet("Geckium.newTabHome.overrideStyle").bool) {
					case true:
						prefChoice = gkPrefUtils.tryGet("Geckium.newTabHome.style").int;
						break;
					default:
						prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;
						break;
				}
			} else if (document.URL == "about:preferences" || document.URL == "about:addons") {
				// Prepare setting for forcing the style for these pages individually
				prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;
			} else {
				switch (gkPrefUtils.tryGet("Geckium.main.overrideStyle").bool) {
					case true:
						prefChoice = gkPrefUtils.tryGet("Geckium.main.style").int;
						break;
					default:
						prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;
						break;
				}
			}

			if (!prefChoice)
				prefChoice = 0;

			if (document.URL == "chrome://browser/content/browser.xhtml") {
				if (prefChoice == previousChoice) {
					console.log("Choice same as previous choice, ignoring.", prefChoice, previousChoice)
					return;
				} else {
					console.log("Choice not the same as previous choice, continuing.", prefChoice, previousChoice)
				}
			}

			// bruni: We get the first and last available keys so
			//		  we don't hardcode the values in the code.
			const mapKeys = Object.keys(gkVisualStyles.getVisualStyles()).map(Number);
			const firstKey = Math.min(...mapKeys);
			const lastKey = Math.max(...mapKeys);

			// bruni: Let's remove all appearance attributes first.
			const pastAttrs = document.documentElement.getAttributeNames();
			pastAttrs.forEach((attr) => {
				if (attr.startsWith("geckium-") && !attr.includes("chrflag"))
					document.documentElement.removeAttribute(attr);
			});

			// bruni: Let's apply the correct appearance attributes.
			if (typeof vSInt === "number") {
				if (prefChoice > lastKey) {
					vSInt = lastKey;
				} else if (prefChoice < firstKey || prefChoice == null) {
					vSInt = firstKey;
				}
				console.log(vSInt)
			} else {
				vSInt = prefChoice;
			}

			for (let i = 0; i <= vSInt; i++) {
				if (gkVisualStyles.getVisualStyles()[i]) {
					const attr = "geckium-" + gkVisualStyles.getVisualStyles()[i].number;
					document.documentElement.setAttribute(attr, "");
				}
			}

			// bruni: Let's also apply the attribute specific to the
			//		  user choice so we can make unique styles for it.
			document.documentElement.setAttribute("geckium-choice", gkVisualStyles.getVisualStyles()[vSInt].number);

			previousChoice = prefChoice;
			
			if (isBrowserWindow)
				dispatchEvent(appearanceChanged);
		}
	}
}

window.addEventListener("load", gkVisualStyles.setVisualStyle);

// FIXME: Find the correct event instead of using a timeout initially.
setTimeout(gkVisualStyles.setVisualStyle, 50);

class gkChromiumFrame {
	static get getApplyMode() {
		switch (gkPrefUtils.tryGet("Geckium.appearance.forceChromiumFrame").int) {
			case 0:
				return "Automatic"
			case 1:
				return "Force Disable"
			case 2:
				return "Force Enable"
		}
	}

	static async applyMode(int) {
		if (int <= 0)
			int = 0;		// Automatic
		else if (int >= 2)
			int = 2;		// Force Enable
		else
			int = 1;		// Force Disable

		gkPrefUtils.set("Geckium.appearance.forceChromiumFrame").int(int);

		await gkChromiumFrame.automatic();
	}

	static async automatic() {
		switch (gkPrefUtils.tryGet("Geckium.appearance.forceChromiumFrame").int) {
			case 0:		// Automatic
				if (isBrowserWindow) {
					if (AppConstants.platform !== "win") {
						document.documentElement.setAttribute("chromemargin", "0,0,0,0");
					} else {
						// If compositor is inactive.
						if (!window.matchMedia("(-moz-windows-compositor: 1)").matches) {
							document.documentElement.setAttribute("chromemargin", "0,0,0,0");
						} else {
							const isChromeTheme = gkPrefUtils.tryGet("Geckium.chrTheme.status").bool;
							if (isChromeTheme) {
								const themeData = await chrTheme.getCurrentTheme();

								let themeFrame = themeData.theme.images.theme_frame;
								// If Chromium Theme has frame image, enable Chromium Frame isBrowserPopUpWindow
								if (themeFrame) {
									document.documentElement.setAttribute("chromemargin", "0,0,0,0");
								} else {
									if (isBrowserPopUpWindow) {
										document.documentElement.removeAttribute("chromemargin");
									} else {
										document.documentElement.setAttribute("chromemargin", "0,3,3,3");
									}
								}
									
							} else {
								const isDefaultTheme = gkPrefUtils.tryGet("extensions.activeThemeID").string.includes("default-theme");
								const isCompactLightLWTheme = gkPrefUtils.tryGet("extensions.activeThemeID").string.includes("compact-light");
								const isDefaultDarkLWTheme = gkPrefUtils.tryGet("extensions.activeThemeID").string.includes("firefox-compact");
								const isGTKPlus = gkPrefUtils.tryGet("extensions.activeThemeID").string.includes("{9fe1471f-0c20-4756-bb5d-6e857a74cf9e}");
								
								if (isDefaultTheme || isCompactLightLWTheme || isDefaultDarkLWTheme || isGTKPlus) {
									if (isBrowserPopUpWindow) {
										document.documentElement.removeAttribute("chromemargin");
									} else {
										document.documentElement.setAttribute("chromemargin", "0,3,3,3");
									}
								} else {
									document.documentElement.setAttribute("chromemargin", "0,0,0,0");
								}
							}
						}
					}
				}
				break;
			case 1:		// Force Disable
				if (isBrowserWindow)
					document.documentElement.setAttribute("chromemargin", "0,0,0,0");
				break;
			case 2:		// Force Enable
				if (isBrowserWindow) {
					if (AppConstants.platform !== "win") {
						document.documentElement.setAttribute("chromemargin", "0,0,0,0");
					} else {
						if (isBrowserPopUpWindow) {
							document.documentElement.removeAttribute("chromemargin");
						} else {
							document.documentElement.setAttribute("chromemargin", "0,3,3,3");
						}
					}
				}
				break;
		}

		gkChromiumFrame.setCaptionButtonsStyle();
	}

	static setCaptionButtonsStyle(style) {
		const preference = "Geckium.appearance.classicCaptionButtonsStyle";

		if (style == "auto" || style == "windows" || style == "linux" || style == "macos")
			gkPrefUtils.set(preference).string(style);
		else if (!gkPrefUtils.tryGet(preference).string)
			gkPrefUtils.set(preference).string("auto");

		document.documentElement.setAttribute("gkforcecaptionbuttonstyle", gkPrefUtils.tryGet(preference).string);
	}
}

class gkLWTheme {
	static get getCustomThemeMode() {
		const customThemeModePref = gkPrefUtils.tryGet("Geckium.customtheme.mode").int;
		let customThemeMode;

		if (customThemeModePref <= 0)
			customThemeMode = 0;
		else if (customThemeModePref == 1)
			customThemeMode = 1;
		else if (customThemeModePref >= 2)
			customThemeMode = 2;

		return customThemeMode;
	}

	static setCustomThemeModeAttrs() {
		if (typeof document.documentElement !== "undefined") {	
			setTimeout(async () => {
				document.documentElement.setAttribute("lwtheme-id", gkPrefUtils.tryGet("extensions.activeThemeID").string);
				document.documentElement.setAttribute("customthememode", gkLWTheme.getCustomThemeMode);

				const toolbarBgColor = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-bgcolor'); 

				// if color is rgba
				if (toolbarBgColor.includes("rgba")) {
					document.documentElement.setAttribute("toolbar-bgcolor-transparent", true);

					const toolbarBgColorClean = toolbarBgColor.replace("rgba(", "").replace(")", "");
					const toolbarBgColorToArray = toolbarBgColorClean.replace(" ", "").split(",");

					// if alpha is not opaque
					if (toolbarBgColorToArray[3] == 0 || toolbarBgColorToArray[3].includes(".")) {
						document.documentElement.style.setProperty("--gktoolbar-bgcolor", `rgb(${toolbarBgColorToArray[0]}, ${toolbarBgColorToArray[1]}, ${toolbarBgColorToArray[2]})`);
					} else {
						document.documentElement.style.setProperty("--toolbar-bgcolor", `rgb(${toolbarBgColorToArray[0]}, ${toolbarBgColorToArray[1]}, ${toolbarBgColorToArray[2]})`);
					}
				} else {
					document.documentElement.setAttribute("toolbar-bgcolor-transparent", false);

					document.documentElement.style.removeProperty("--gktoolbar-bgcolor");
				}
				
				await gkChromiumFrame.automatic();
			}, 0);
		}
	}
}

window.addEventListener("load", gkLWTheme.setCustomThemeModeAttrs);
Services.obs.addObserver(gkLWTheme.setCustomThemeModeAttrs, "lightweight-theme-styling-update");

// GTK+
class gkGTK {
	static setVariables() {
		var colorDiv = document.createElement("div");
		document.head.appendChild(colorDiv);
		//ActiveCaption
		colorDiv.style.backgroundColor="ActiveCaption";
		var rgb = window.getComputedStyle(colorDiv)["background-color"].match(/\d+/g);
		document.documentElement.style.setProperty(
			`--activecaption-shine`,
			`rgb(${ColorUtils.HSLShift(rgb, [-1, -1, 0.58])})`
		);
		//Background Tab background
		document.documentElement.style.setProperty(
			`--bgtab-background`,
			`rgb(${ColorUtils.HSLShift(rgb, [-1, 0.5, 0.75])})`
		);
		//Incognito (active)
		var rgbb = ColorUtils.HSLShift(rgb, [-1, 0.2, 0.35]);
		document.documentElement.style.setProperty(
			`--incognito-active`,
			`rgb(${rgbb})`
		);
		document.documentElement.style.setProperty(
			`--incognito-active-shine`,
			`rgb(${ColorUtils.HSLShift(rgbb, [-1, -1, 0.58])})`
		);
		//Background Tab background (Incognito)
		document.documentElement.style.setProperty(
			`--incognito-bgtab-background`,
			`rgb(${ColorUtils.HSLShift(rgbb, [-1, 0.5, 0.75])})`
		);
		//Incognito (inactive)
		rgb = ColorUtils.HSLShift(rgb, [-1, 0.3, 0.6]);
		document.documentElement.style.setProperty(
			`--incognito-inactive`,
			`rgb(${rgb})`
		);
		document.documentElement.style.setProperty(
			`--incognito-inactive-shine`,
			`rgb(${ColorUtils.HSLShift(rgb, [-1, -1, 0.58])})`
		);
		//InactiveCaption
		colorDiv.style.backgroundColor="InactiveCaption";
		rgb = window.getComputedStyle(colorDiv)["background-color"].match(/\d+/g);
		document.documentElement.style.setProperty(
			`--inactivecaption-shine`,
			`rgb(${ColorUtils.HSLShift(rgb, [-1, -1, 0.58])})`
		);
		//Pre-6.0 toolbar icon fill colour
		colorDiv.style.backgroundColor="AccentColor";
		rgb = window.getComputedStyle(colorDiv)["background-color"].match(/\d+/g);
		colorDiv.style.backgroundColor="-moz-dialog";
		rgbb = window.getComputedStyle(colorDiv)["background-color"].match(/\d+/g);
		if (Math.abs(ColorUtils.ColorToHSL(rgb)[2] - ColorUtils.ColorToHSL(rgbb)[2]) < 0.1) {
			// Not enough contrast - use foreground
			document.documentElement.style.setProperty(
				`--gtk-toolbarbutton-icon-fill`,
				`-moz-dialogtext`
			);
		} else {
			document.documentElement.style.setProperty(
				`--gtk-toolbarbutton-icon-fill`,
				`AccentColor`
			);
		}
		document.head.removeChild(colorDiv);
	}

	static apply() {
		console.log(window.location.href);
		console.log(document.querySelector(`#main-window`).getAttribute("windowtype"));
		console.log(isBrowserWindow);
		if (isBrowserWindow) {
			//TODO: only apply if on GTK+, otherwise remove variables
			gkGTK.setVariables();
		}
	}
}
window.addEventListener("load", gkGTK.apply);


/* bruni: Automatically apply appearance and theme
		  attributes when it detecs changes in the pref. */
const appearanceObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			gkVisualStyles.setVisualStyle();
			gkLWTheme.setCustomThemeModeAttrs();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.choice", appearanceObserver, false);
Services.prefs.addObserver("Geckium.main.overrideStyle", appearanceObserver, false);
Services.prefs.addObserver("Geckium.main.style", appearanceObserver, false);
Services.prefs.addObserver("Geckium.appearance.forceChromiumFrame", appearanceObserver, false);

function changePrivateBadgePos() {
	if (typeof document.documentElement !== "undefined") {
		if (document.documentElement.hasAttribute("privatebrowsingmode")) {
			const privateBrowsingIndicatorWithLabel = document.getElementById("private-browsing-indicator-with-label");
			const titlebarSpacer = document.querySelector(".titlebar-spacer");
	
			gkInsertElm.before(privateBrowsingIndicatorWithLabel, titlebarSpacer);
		}
	}
}
window.addEventListener("load", changePrivateBadgePos);

function customThemeColorizeTabGlare() {
	document.documentElement.setAttribute("customthemecolorizetabglare", gkPrefUtils.tryGet("Geckium.appearance.customThemeColorizeTabGlare").bool)
}
const customThemeModeObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			gkLWTheme.setCustomThemeModeAttrs();
			customThemeColorizeTabGlare();
		}
	},
};
window.addEventListener("load", gkLWTheme.setCustomThemeModeAttrs);
window.addEventListener("load", customThemeColorizeTabGlare);
Services.prefs.addObserver("Geckium.customtheme.mode", customThemeModeObserver, false);
Services.prefs.addObserver("Geckium.appearance.customThemeColorizeTabGlare", customThemeModeObserver, false);

function lwThemeApplyBackgroundCaptionButtons() {
	document.documentElement.setAttribute("captionbuttonbackground", gkPrefUtils.tryGet("Geckium.lwtheme.captionButtonBackground").bool)
}
const lwThemeApplyBackgroundCaptionButtonsObs = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			lwThemeApplyBackgroundCaptionButtons();
		}
	},
};
window.addEventListener("load", lwThemeApplyBackgroundCaptionButtons);
Services.prefs.addObserver("Geckium.lwtheme.captionButtonBackground", lwThemeApplyBackgroundCaptionButtonsObs, false);

function enableMoreGTKIcons() {
	document.documentElement.setAttribute("moregtkicons", gkPrefUtils.tryGet("Geckium.appearance.moreGTKIcons").bool);
}
window.addEventListener("load", enableMoreGTKIcons);
const moreGTKIconsObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			enableMoreGTKIcons();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.moreGTKIcons", moreGTKIconsObserver, false);

window.addEventListener("load", gkChromiumFrame.setCaptionButtonsStyle);
const classicCaptionBtnsStyleObs = {
	observe: async function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			await gkChromiumFrame.automatic();
			gkChromiumFrame.setCaptionButtonsStyle();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.classicCaptionButtonsStyle", classicCaptionBtnsStyleObs, false);