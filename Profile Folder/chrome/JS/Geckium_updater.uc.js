// ==UserScript==
// @name        Geckium - Updater
// @author		AngelBruni
// @description	Checks for Geckium updates.
// @loadorder   2
// @include		main
// ==/UserScript==

const { gkUpdater } = ChromeUtils.importESModule("chrome://modules/content/GeckiumUpdater.sys.mjs");

(async () => {
    if (gkPrefUtils.tryGet("Geckium.version.current").string !== await gkUpdater.getVersion()) {
        console.warn("MISMATCHED VERSION! Updating...");

		gkPrefUtils.set("Geckium.version.current").string(await gkUpdater.getVersion());
		_ucUtils.restart(true);
    }
})();

document.documentElement.setAttribute("gksystheme", "gtk"); //TEMP
document.documentElement.setAttribute("gkhasgaps", "false"); //TEMP
document.documentElement.setAttribute("gktitnative", "false"); //TEMP
document.documentElement.setAttribute("gktitstyle", "win10"); //TEMP
document.documentElement.setAttribute("gktitbuttons", "win10"); //TEMP