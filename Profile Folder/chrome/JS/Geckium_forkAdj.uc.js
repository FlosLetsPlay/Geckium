// ==UserScript==
// @name        Geckium - Fork Compatibility Adjuster
// @description Prevents forks from messing up Geckium by preventing breaking settings from being applied
// @author      Dominic Hayes
// @loadorder   2
// @include		main
// ==/UserScript==

// Firefox (Native Controls Patch) Adjustments
class gkNCPAdj {
    static checkNCP() {
        if (!isNCPatched) {
            if (gkPrefUtils.tryGet("Geckium.NCP.installed").bool == true) {
                _ucUtils.showNotification(
                {
                    label : "Firefox has stopped using Native Controls Patch. An update may have reverted it.",
                    type : "nativecontrolspatch-notification",
                    priority: "warning",
                    buttons: [{
                    label: "Redownload",
                    callback: (notification) => {
                        notification.ownerGlobal.openWebLinkIn(
                        "https://github.com/kawapure/firefox-native-controls/releases/latest",
                        "tab"
                        );
                        return false
                    }
                    },
                    {
                        label: "Don't show again",
                        callback: (notification) => {
                            gkPrefUtils.set("Geckium.NCP.installed").bool(false);
                            gkPrefUtils.set("Geckium.NCP.bannerDismissed").bool(true);
                            return false
                        }
                    }]
                }
                )
            } else if (gkPrefUtils.tryGet("Geckium.NCP.bannerDismissed").bool != true) { // true = Don't show again
                _ucUtils.showNotification(
                {
                    label : "This version of Firefox supports the Native Controls Patch, which provides native Windows titlebars.",
                    type : "nativecontrolspatch-notification",
                    priority: "info",
                    buttons: [{
                    label: "Learn more",
                    callback: (notification) => {
                        notification.ownerGlobal.openWebLinkIn(
                        "https://github.com/kawapure/firefox-native-controls",
                        "tab"
                        );
                        return false
                    }
                    },
                    {
                        label: "Don't show again",
                        callback: (notification) => {
                            gkPrefUtils.set("Geckium.NCP.bannerDismissed").bool(true);
                            return false
                        }
                    }]
                }
                )
            }
        } else if (gkPrefUtils.tryGet("Geckium.NCP.installed").bool != true) {
            gkPrefUtils.set("Geckium.NCP.installed").bool(true);
        }
    }
}
if ((AppConstants.MOZ_APP_NAME == "firefox" || AppConstants.MOZ_APP_NAME == "firefox-esr") && (parseInt(Services.appinfo.version.split(".")[0]) <= 115)) {
    if (window.matchMedia("(-moz-platform: windows-win10)").matches || isNCPatched) { // Only for Windows 10+
        window.addEventListener("load", gkNCPAdj.checkNCP);
    }
}

// Waterfox Adjustments
class gkWaterfoxAdj {
    /**
     * disableThemeCusto - Ensures Waterfox's theme customisations feature is turned off
     */

    static disableThemeCusto() {
        if (gkPrefUtils.tryGet("browser.theme.enableWaterfoxCustomizations").int != 2) {
            gkPrefUtils.set("browser.theme.enableWaterfoxCustomizations").int(2);
            _ucUtils.showNotification({
                label : "Waterfox theme customisations are not supported by Geckium and have been disabled.",
                type : "geckium-notification",
                priority: "critical"
            })
        }
	}
}
if (AppConstants.MOZ_APP_NAME == "waterfox") {
    window.addEventListener("load", gkWaterfoxAdj.disableThemeCusto);
    // Automatically change the titlebar when the setting changes
    const waterfoxObserver = {
        observe: function (subject, topic, data) {
            if (topic == "nsPref:changed") {
                gkWaterfoxAdj.disableThemeCusto();
            }
        },
    };
    Services.prefs.addObserver("browser.theme.enableWaterfoxCustomizations", waterfoxObserver, false);
}

// r3dfox Adjustments
//  Yes, we know... you don't need to tell us about it - we're only doing this out of neutrality.
class gkRfoxAdj {
    static blacklist = [
        "r3dfox.caption.text.color",
        "r3dfox.colors.enabled",
        "r3dfox.customizations.enabled",
        "r3dfox.force.transparency",
        "r3dfox.transparent.menubar",
        "r3dfox.translucent.navbar"
    ]

    /**
     * disableThemeCusto - Ensures R3dfox's theme customisation options are turned off
     */

    static disableThemeCusto() {
        var changes = 0;
        for (const i in gkRfoxAdj.blacklist) {
            if (gkPrefUtils.tryGet(gkRfoxAdj.blacklist[i]).bool != false) {
                gkPrefUtils.set(gkRfoxAdj.blacklist[i]).bool(false);
                changes += 1;
            }
        }
        if (changes >= 1) {
            _ucUtils.showNotification({
                label : "r3dfox theme customisations are not supported by Geckium and have been disabled.",
                type : "geckium-notification",
                priority: "critical"
            })
        }
	}
}
if (AppConstants.MOZ_APP_NAME == "r3dfox") {
    window.addEventListener("load", gkRfoxAdj.disableThemeCusto);
    // Automatically change the titlebar when the setting changes
    const rfoxObserver = {
        observe: function (subject, topic, data) {
            if (topic == "nsPref:changed") {
                gkRfoxAdj.disableThemeCusto();
            }
        },
    };
    for (const i in gkRfoxAdj.blacklist) {
        Services.prefs.addObserver(gkRfoxAdj.blacklist[i], rfoxObserver, false);
    }
}