// ==UserScript==
// @name        Geckium - Titlebar Manager
// @author      Dominic Hayes
// @loadorder   2
// @include		main
// @include		about:addons*
// @include		about:preferences*
// ==/UserScript==

// Titlebar style information
class gkTitlebars {
    static titlebars = {
        /**
         * - titlebar ID
         *      - era ID - determines which settings to use based on currently selected era - each era's settings stack up to the selected era
         */
        "win": {
            /**
             * border   -   ID of the titlebar to apply
             * 
             * buttons  -   ID of the titlebar buttons to apply
             * 
             * hasnativegaps   -    If True, border gaps are added around the browser in native mode
             * 
             * hasgaps   -  If True, border gaps are added around the browser in non-native mode
             * 
             * chromemargin   -  (optional) Override chromemargin's value in non-native mode
             * 
             * native - Whether to enable native titlebars if set to Automatic
             * 
             * popupnative - Whether to enable native titlebars in popup windows if set to Automatic
             * 
             * cannative    -   If False, the titlebar will always be in non-native mode regardless of preferences
             * 
             * tabstyle -    0: Windows
             *                  1: Linux
             *                  2: macOS
             * 
             * systheme -   ID of the System Theme to apply if set to Automatic (based on platform)
             * 
             * systhemefallback -   ID of the System Theme to apply, for fallback values, when in a theme
             */
            1: { //Chromium 1
                border: "win",
                buttons: "win",
                hasnativegaps: true,
                hasgaps: true,
                native: true,
                popupnative: true,
                cannative: true,
                tabstyle: 0,
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            }
        },
        "winnogaps": {
            1: {
                border: "win",
                buttons: "win",
                hasnativegaps: false,
                hasgaps: true,
                native: true,
                popupnative: true,
                cannative: true,
                tabstyle: 0,
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            }
        },
        "win10": {
            1: {
                border: "win10",
                buttons: "win10",
                hasnativegaps: false,
                hasgaps: false,
                chromemargin: "0,2,2,2",
                native: true,
                popupnative: true,
                cannative: true,
                tabstyle: 0,
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            },
            68: {
                native: false,
                nativetheme: false
            }
        },
        "linuxog": {
            1: {
                border: "win",
                buttons: "linuxog",
                hasnativegaps: false,
                hasgaps: true,
                native: false,
                popupnative: true,
                cannative: true,
                tabstyle: 1,
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            },
            11: {
                systheme: {
                    linux: "gtk",
                    win: "classic",
                    macos: "macosx"
                }
            },
            47: {
                systheme: {
                    linux: "gtk",
                    win: "classic",
                    macos: "macos"
                }
            },
            68: {
                buttons: "linux"
            }
        },
        "linux": {
            1: {
                border: "win",
                buttons: "linux",
                hasnativegaps: false,
                hasgaps: true,
                native: false,
                popupnative: true,
                cannative: true,
                tabstyle: 1,
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            },
            11: {
                systheme: {
                    linux: "gtk",
                    win: "classic",
                    macos: "macosx"
                }
            },
            47: {
                systheme: {
                    linux: "gtk",
                    win: "classic",
                    macos: "macos"
                }
            }
        },
        "macosx": {
            1: {
                border: "macos",
                buttons: "macosx",
                hasnativegaps: false,
                hasgaps: false,
                native: false,
                popupnative: false,
                cannative: false,
                tabstyle: 2,
                systheme: {
                    linux: "macosx",
                    win: "macosx",
                    macos: "macosx"
                }
            },
            68: {
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            }
        },
        "macos": {
            1: {
                border: "macos",
                buttons: "macos",
                hasnativegaps: false,
                hasgaps: false,
                native: false,
                popupnative: false,
                cannative: false,
                tabstyle: 2,
                systheme: {
                    linux: "macos",
                    win: "macos",
                    macos: "macos"
                }
            },
            68: {
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            }
        },
        "chromiumos": {
            1: {
                border: "chromiumos",
                buttons: "linuxog",
                hasnativegaps: false,
                hasgaps: true,
                native: false,
                popupnative: false,
                cannative: false,
                tabstyle: 1,
                systheme: {
                    linux: "chromiumos",
                    win: "chromiumos",
                    macos: "chromiumos"
                }
            },
            4: {
                buttons: "linux"
            },
            21: {
                buttons: "chromiumos",
                hasnativegaps: false,
                hasgaps: false,
                tabstyle: 0
            },
            68: {
                systheme: {
                    linux: "classic",
                    win: "classic",
                    macos: "classic"
                }
            }
        }
    }

    /**
     * getTitlebarSpec - Collates and returns the chosen titlebar's specifications
     * 
     * @era: Maximum era for titlebar style settings
     * 
     * @style: ID of the titlebar style to use - throws an exception if invalid
     */

    static getTitlebarSpec(era, style) {
        if (!era) {
            era = gkEras.getBrowserEra();
        }
        if (!style) {
            style = gkTitlebars.getTitlebar(era);
        }
        var result = {};
        if (!Object.keys(gkTitlebars.titlebars).includes(style)) {
            throw new Error(style + " is not a valid titlebar style");
        }
        for (const i of Object.keys(gkTitlebars.titlebars[style])) {
            if (i <= era) {
                for (const ii of Object.keys(gkTitlebars.titlebars[style][i])) {
                    result[ii] = gkTitlebars.titlebars[style][i][ii];
                }
            } else {
                break;
            }
        }
        return result;
    }

    /**
     * getPreferredTitlebar - Gets the era's preferred titlebar for your platform
     * 
     * @era: The currently selected era
     */

    static getPreferredTitlebar(era) {
        // Get titlebar preferences from nearest era
        var titlebars = {};
        for (const i of Object.keys(eras)) {
            if (i <= era) {
                if (Object.keys(eras[i]).includes("titlebar")) {
                    titlebars = eras[i].titlebar;
                }
            } else {
                break;
            }
        }
        // Return the appropriate titlebar style
        switch (AppConstants.platform) {
            case "macosx":
                return titlebars.macos;
            case "linux":
                return titlebars.linux;
            default: //Fallback to Windows
                if (window.matchMedia("(-moz-platform: windows-win10)").matches || parseInt(Services.appinfo.version.split(".")[0]) >= 117) {
                    return titlebars.win10;
                }
            return titlebars.win;
        }
	}

    /** getTitlebar - Gets the currently set titlebar from about:config
     * 
     * If not found, or the value is invalid, the era's preferred titlebar will be used.
     * @era: The currently selected era
     */

    static getTitlebar(era) {
        let prefChoice = gkPrefUtils.tryGet("Geckium.appearance.titlebarStyle").string;
        if (Object.keys(gkTitlebars.titlebars).includes(prefChoice)) {
            return prefChoice;
        }
        return gkTitlebars.getPreferredTitlebar(era);
    }

    /**
     * getNative - Returns True if the titlebar should be native
     * 
     * @spec: Titlebar specification to reference in checks
     * @ispopup: Is the window a popup window?
     * @systbar: Is Firefox's titlebar option enabled?
     */

    static getNative(spec, ispopup) {
        // FIXME: This one needs to default to True
        if (!gkPrefUtils.prefExists("Geckium.appearance.titlebarThemedNative")) {
		    gkPrefUtils.set("Geckium.appearance.titlebarThemedNative").bool(true);
	    }
        // Check if titlebar blocks being native
        if (spec.cannative == false) {
            return false;
        }
        // Check if user blocked native titlebar or is Automatic
        switch (gkPrefUtils.tryGet("Geckium.appearance.titlebarNative").int) {
            case 1: //Enabled
                break;
            case 2: //Disabled
                return false;
            default: //Automatic
                // Check if titlebar is automatically native
                if (!ispopup && spec.native == false) {
                    return false;
                } else if (ispopup && spec.popupnative == false) {
                    return false;
                }
                // If on Windows, check the compositor is turned off (before 117)
                if (AppConstants.platform == "win") {
                    if (window.matchMedia("(-moz-windows-compositor: 0)").matches || window.matchMedia("(-moz-windows-classic)").matches) {
                        return false;
                    }
                } else if (AppConstants.platform == "macosx") {
                    return false; // Always return auto=non-native on macOS
                }
                break;
        }
        if (!ispopup) { // Themes don't affect popups being native
            // If in a theme...
            if (isThemed == true) {
                if (!isChromeThemed) {
                    return false; // Firefox themes are never native
                } else {
                    if (!isChrThemeNative) {
                        return false; // Current Chrome Theme isn't native
                    }
                    // Check if user blocked native in-theme titlebar
                    if (!gkPrefUtils.tryGet("Geckium.appearance.titlebarThemedNative").bool) {
                        return false;
                    }
                }
            }
            // If System Theme is set to GTK+ but Light or Dark is in use...
            let prefChoice = gkPrefUtils.tryGet("extensions.activeThemeID").string;
            if (gkSysTheme.getTheme(spec) == "gtk" && (prefChoice.startsWith("firefox-compact-light@") || prefChoice.startsWith("firefox-compact-dark@"))) {
                return false;
            }
        }
        return true;
    }

    /**
     * getIsPopup - Returns True if the window is a popup window.
     */

    static getIsPopup() {
        let chromehidden = document.documentElement.getAttribute("chromehidden");
        let hidden = chromehidden.split(" ");
        return (hidden.includes("toolbar"));
    }

    /**
     * applyTitlebar - Applies the current titlebar from getTitlebar(), and applies
     *  the specifications of the titlebar style.
     * 
     * @era: The currently selected era - if not specified, sources era from styles's variable
     */

    static applyTitlebar(era) {
        if (!isBrowserWindow) {
            return;
        }
        if (!era) {
            era = gkEras.getBrowserEra();
        }
        // Get spec about the current titlebar
        let titlebar = gkTitlebars.getTitlebar(era);
        let spec = gkTitlebars.getTitlebarSpec(era, titlebar);
        // Redirect to specialised functions if specific window-types
        if (gkTitlebars.getIsPopup()) { //  Popups
            gkTitlebars.applyPopupTitlebar(spec);
            return;
        }
        if (gkPrefUtils.tryGet("browser.tabs.inTitlebar").int == 0) { //  Titlebar enabled
            gkTitlebars.applyNativeTitlebar(spec);
            return;
        }
        // Apply titlebar and button style
        document.documentElement.setAttribute("gktitstyle", spec.border);
        document.documentElement.setAttribute("gktitbuttons", spec.buttons);
        document.documentElement.setAttribute("gktabstyle", spec.tabstyle);
        // Check native titlebar mode eligibility
        if (gkTitlebars.getNative(spec)) {
            // Base Geckium CSS flag
            document.documentElement.setAttribute("gktitnative", "true");
            // chromemargin (border type)
            document.documentElement.setAttribute("chromemargin", "0,2,2,2");
            // Gaps
            if (AppConstants.platform == "linux") {
                document.documentElement.setAttribute("gkhasgaps", "false"); // Linux Native CANNOT have gaps
            } else {
                document.documentElement.setAttribute("gkhasgaps", spec.hasnativegaps ? "true" : "false");
            }
        } else {
            document.documentElement.setAttribute("gktitnative", "false");
            if (Object.keys(spec).includes("chromemargin")) { // Special case for Windows 10 style
                document.documentElement.setAttribute("chromemargin", spec.chromemargin);
            } else {
                document.documentElement.setAttribute("chromemargin", "0,0,0,0");
            }
            document.documentElement.setAttribute("gkhasgaps", spec.hasgaps ? "true" : "false");
        }
    }

    /**
     * applyPopupTitlebar - A variation of applyTitlebar for popup windows
     * 
     * @spec: The currently selected titlebar's specifications
     */

    static applyPopupTitlebar(spec) {
        let systitlebar = (gkPrefUtils.tryGet("browser.tabs.inTitlebar").int == 0);
        // Apply titlebar and button style
        if (systitlebar) {
            document.documentElement.removeAttribute("gktitstyle");
            document.documentElement.removeAttribute("gktitbuttons");
        } else {
            document.documentElement.setAttribute("gktitstyle", spec.border);
            document.documentElement.setAttribute("gktitbuttons", spec.buttons);
        }
        document.documentElement.setAttribute("gktabstyle", spec.tabstyle);
        // Check native titlebar mode eligibility (or force if Titlebar is enabled)
        if (systitlebar || gkTitlebars.getNative(spec, true)) {
            // Base Geckium CSS flag
            document.documentElement.setAttribute("gktitnative", "true");
            // chromemargin (border type)
            document.documentElement.removeAttribute("chromemargin"); //popups DON'T have chromemargin normally
            // Gaps
            document.documentElement.setAttribute("gkhasgaps", "false");
        } else {
            document.documentElement.setAttribute("gktitnative", "false");
            if (Object.keys(spec).includes("chromemargin")) { // Special case for Windows 10 style
                document.documentElement.setAttribute("chromemargin", spec.chromemargin);
            } else {
                document.documentElement.setAttribute("chromemargin", "0,0,0,0");
            }
            document.documentElement.setAttribute("gkhasgaps", spec.hasgaps ? "true" : "false");
        }
    }

    /**
     * applyNativeTitlebar - A variation of applyTitlebar for windows with titlebar enabled
     * 
     * @spec: The currently selected titlebar's specifications
     */

    static applyNativeTitlebar(spec) {
        // Apply titlebar and button style
        document.documentElement.removeAttribute("gktitstyle");
        document.documentElement.removeAttribute("gktitbuttons");
        document.documentElement.setAttribute("gktabstyle", spec.tabstyle);
        document.documentElement.setAttribute("gkhasgaps", "false");
        document.documentElement.setAttribute("gktitnative", (AppConstants.platform == "win" && gkTitlebars.getNative(spec)) ?
            "true" :
            "false"
        );
    }
}
window.addEventListener("load", () => gkTitlebars.applyTitlebar());

// Automatically change the titlebar when the setting changes
const titObserver = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			gkTitlebars.applyTitlebar();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.choice", titObserver, false);
Services.prefs.addObserver("Geckium.main.overrideStyle", titObserver, false);
Services.prefs.addObserver("Geckium.main.style", titObserver, false);
Services.prefs.addObserver("Geckium.appearance.titlebarStyle", titObserver, false);
Services.prefs.addObserver("Geckium.appearance.titlebarNative", titObserver, false);
Services.prefs.addObserver("Geckium.appearance.titlebarThemedNative", titObserver, false);
Services.prefs.addObserver("browser.tabs.inTitlebar", titObserver, false);