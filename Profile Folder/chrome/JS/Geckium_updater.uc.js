// ==UserScript==
// @name        Geckium - Updater
// @author		AngelBruni
// @description	Checks for Geckium updates.
// @loadorder   2
// @include		main
// ==/UserScript==

const { gkUpdater } = ChromeUtils.importESModule("chrome://modules/content/GeckiumUpdater.sys.mjs");
const versionIteration = 1;

(async () => {
    let ver = gkPrefUtils.tryGet("Geckium.version.current").string;
    let iter = gkPrefUtils.tryGet("Geckium.version.iteration").int;
    if (ver !== await gkUpdater.getVersion() || iter < versionIteration) {
        console.warn("MISMATCHED VERSION OR ITERATION! Updating...");
        
        updateSettings(iter);
		gkPrefUtils.set("Geckium.version.current").string(await gkUpdater.getVersion());
		_ucUtils.restart(true);
    }
})();

function updateSettings(iteration) {
    if (iteration < 1) {
        if (AppConstants.platform == "win") {
            gkPrefUtils.set("widget.ev-native-controls-patch.override-win-version").int(7);		// Force aero
            gkPrefUtils.set("gfx.webrender.dcomp-win.enabled").bool(false);						// Disable dcomp
            gkPrefUtils.set("browser.display.windows.non_native_menus").int(0);
            gkPrefUtils.set("browser.startup.blankWindow").bool(false);                         // Disable Firefox's splash screen
        }
	    gkPrefUtils.set("browser.urlbar.showSearchTerms.enabled").bool(false);				    // Show URL after a search in URLbar
        gkPrefUtils.set("browser.urlbar.trimURLs").bool(false);                                 // Show protocol in URL in URLbar
	    gkPrefUtils.set("browser.newtab.preload").bool(false)									// Disable New Tab preload to prevent new data from not loading
        gkPrefUtils.set("browser.theme.dark-private-windows").bool(false);						// Disable incognito dark mode
        gkPrefUtils.set("widget.gtk.overlay-scrollbars.enabled").bool(false);                   // Disable GTK3's overlay scrollbars (Linux)
        gkPrefUtils.set("widget.gtk.non-native-titlebar-buttons.enabled").bool(false);          // Disable non-native titlebar buttons in Light and Dark (Linux, 128+)

	    if (!gkPrefUtils.tryGet("Geckium.newTabHome.appsList").string) {
		    gkPrefUtils.set("Geckium.newTabHome.appsList").string(`
            {
                "0": {
                    "pos": 0,
                    "favicon": "chrome://userchrome/content/pages/newTabHome/assets/chrome-11/imgs/IDR_PRODUCT_LOGO_16.png",
                    "oldIcon": "",
                    "newIcon": "chrome://userchrome/content/pages/newTabHome/assets/chrome-21/imgs/1.png",
                    "oldName": "Web Store",
                    "newName": "Web Store",
                    "url": "https://chromewebstore.google.com",
                    "type": 0
                }
            }
            `);																			    // Add default apps if the apps list is empty
	    }
    }
    // put future settings changes down here as < 2, and so on.

    if (iteration < versionIteration)
        gkPrefUtils.set("Geckium.version.iteration").int(versionIteration);
}