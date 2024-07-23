// ==UserScript==
// @name        Geckium - Eras and Misc. Style Settings
// @author      AngelBruni, Dominic Hayes
// @description	Settings the desired appearance chosen by the user accordingly.
// @loadorder   2
// @include		main
// @include		about:preferences*
// @include		about:addons*
// ==/UserScript==

// Firefox version check
if (parseInt(Services.appinfo.version.split(".")[0]) >= 117)
	document.documentElement.setAttribute("is117Plus", true);

// Initial variables
let previousEra;
const appearanceChanged = new CustomEvent("appearanceChanged");

// Eras and era selection
const eras = {
    /**
     * id  - The number used in the about:config preference
     * 
     *      name - The version presented in Geckium Settings
     * 
     *      basedOnVersion   - The version shown in About
     * 
     *      year - The year shown in Geckium Settings
     * 
     *      number   - The style identifier used in this code to apply the correct stylesheets
     * 
     *      styles   - "chrome": browser UI
     *                 "page":   browser internal pages, including "about:newtab", "about:flags", etc.
     * 
     *      titlebar - Automatic titlebar style preference (if it includes "chrome" style)
     */

    1: {
        name: "1",
        basedOnVersion: "1.0.154.59",
        year: 2008,
        number: "one",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linuxog",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    3: {
        name: "3",
        basedOnVersion: "3.0.195.4",
        year: 2009,
        number: "three",
        styles: ["page"]
    },
    4: {
        name: "4",
        basedOnVersion: "4.0.223.11",
        year: 2009,
        number: "four",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    5: {
        name: "5",
        basedOnVersion: "5.0.375.125",
        year: 2009,
        number: "five",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    6: {
        name: "6 Dev",
        basedOnVersion: "6.0.453.1",
        year: 2010,
        number: "six",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    11: {
        name: "11",
        basedOnVersion: "11.0.696.77",
        year: 2011,
        number: "eleven",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    21: {
        name: "21",
        basedOnVersion: "21.0.1180.89",
        year: 2012,
        number: "twentyone",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    25: {
        name: "25",
        basedOnVersion: "25.0.1364.84",
        year: 2013,
        number: "twentyfive",
        styles: ["chrome"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win",
            "macos": "macosx"
        }
    },
    47: {
        name: "47",
        basedOnVersion: "47.0.2526.111",
        year: 2015,
        number: "fortyseven",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "winnogaps",
            "macos": "macos"
        }
    },
    68: {
        name: "68",
        basedOnVersion: "68.0.3440.84",
        year: 2018,
        number: "sixtyeight",
        styles: ["chrome", "page"],
        titlebar: {
            "linux": "linux",
            "win": "win",
            "win10": "win10",
            "macos": "macos"
        }
    }
}
class gkEras {

    /**
     * getEras - Gets a list of available design eras, including their automatic choices.
     * 
     * @style: If specified, only visual styles of a specific thing are returned.
     */

    static getEras(style) {
        if (style == "chrome" || style == "page")
			return Object.keys(eras).reduce(function (filtered, key) {
                if (eras[key]["styles"].includes(style)) {
                    filtered[key] = eras[key];
                }
                return filtered;
            }, {});
		else
			return eras;
    }

    /**
     * getEra - Gets the currently set era based on 'location'
     * 
     * If not found or invalid, returns Chromium 1 instead.
     */
    
    static getEra(location) {
        let prefChoice = gkPrefUtils.tryGet(location).int;
        if (!prefChoice || !Object.keys(eras).includes(prefChoice.toString())) {
            return 1;
        }
        return prefChoice;
    }

    /**
     * getBrowserEra - Gets the currently set era for the browser
     * 
     * If not found or invalid, returns Chromium 1 instead.
     */

    static getBrowserEra() {
        if (gkPrefUtils.tryGet("Geckium.main.overrideStyle").bool == true) {
            let override = gkPrefUtils.tryGet("Geckium.main.style").int;
            if (override && Object.keys(eras).includes(override.toString())) {
                return override;
            }
        }
        let prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;
        if (!prefChoice || !Object.keys(eras).includes(prefChoice.toString())) {
            return 1;
        }
        return prefChoice;
    }

    /**
     * getNTPEra - Gets the currently set era for the new tab page
     * 
     * If not found or invalid, returns Chromium 1 instead.
     */

    static getNTPEra() {
        if (gkPrefUtils.tryGet("Geckium.newTabHome.overrideStyle").bool == true) {
            let override = gkPrefUtils.tryGet("Geckium.newTabHome.style").int;
            if (override && Object.keys(eras).includes(override.toString())) {
                return override;
            }
        }
        let prefChoice = gkPrefUtils.tryGet("Geckium.appearance.choice").int;
        if (!prefChoice || !Object.keys(eras).includes(prefChoice.toString())) {
            return 1;
        }
        return prefChoice;
    }

    /**
     * applyEra - Applies the selected era to the browser and supported pages
     */

    static applyEra() {
        let prefChoice;
        if (document.URL == "about:newtab" || document.URL == "about:home" || document.URL == "about:apps") {
            prefChoice = gkEras.getNTPEra();
        } else {
            prefChoice = gkEras.getBrowserEra();
        }

        // Don't continue if acting on the browser and the prior era == the new era
        if (document.URL == "chrome://browser/content/browser.xhtml") {
            if (prefChoice == previousEra) {
                return;
            }
        }

        // Add and remove geckium-* values from documentElement based on new era's values
        for (const i of Object.keys(eras)) {
            const attr = "geckium-" + eras[i].number;
            if (i <= prefChoice) {
                document.documentElement.setAttribute(attr, "");
            } else {
                document.documentElement.removeAttribute(attr);
            }
        }

        // bruni: Let's also apply the attribute specific to the
        //		  user choice so we can make unique styles for it.
        document.documentElement.setAttribute("geckium-choice", eras[prefChoice].number);

        previousEra = prefChoice;
        
        if (isBrowserWindow) {
            dispatchEvent(appearanceChanged);
        }
    }
}
window.addEventListener("load", gkEras.applyEra);

// Automatically change Geckium eras when the setting changes
const eraObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			gkEras.applyEra();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.choice", eraObserver, false);
Services.prefs.addObserver("Geckium.main.overrideStyle", eraObserver, false);
Services.prefs.addObserver("Geckium.main.style", eraObserver, false);
Services.prefs.addObserver("Geckium.newTabHome.overrideStyle", eraObserver, false);
Services.prefs.addObserver("Geckium.newTabHome.style", eraObserver, false);


// Provide a way to let the CSS know if the menubar is visible 
class menuBarVisible {
	static toggled(newvalue) {
		if (newvalue == true) {
			document.documentElement.setAttribute("menubarvisible", "");
		} else {
			document.documentElement.removeAttribute("menubarvisible");
		}
	}
	static check() {
        if (isBrowserWindow) {
		    menuBarVisible.toggled(document.getElementById("toolbar-menubar").getAttribute("autohide") == "false");
        }
	}
}
window.addEventListener("load", menuBarVisible.check);
window.addEventListener("toolbarvisibilitychange", menuBarVisible.check);


// Custom tab glare colouring
class customTabGlare {
    static toggle() {
        if (isBrowserWindow) {
            document.documentElement.setAttribute("customthemecolorizetabglare", gkPrefUtils.tryGet("Geckium.appearance.customThemeColorizeTabGlare").bool);
        }
    }
}
window.addEventListener("load", customTabGlare.toggle);

// Automatically toggle when setting changes
const customTabGlareObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			customTabGlare.toggle();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.customThemeColorizeTabGlare", customTabGlareObserver, false);