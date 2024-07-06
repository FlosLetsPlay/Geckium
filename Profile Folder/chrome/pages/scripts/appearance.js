function appearance() {
	let previousChoice;
	let prefChoice;

	if (document.URL == "about:newtab" || document.URL == "about:home" || document.url == "about:apps") {
		switch (gkPrefUtils.tryGet("Geckium.newTabHome.overrideStyle").bool) {
			case true:
				prefChoice = gkEras.getEra("Geckium.newTabHome.style");
				break;
			default:
				prefChoice = gkEras.getEra("Geckium.appearance.choice");
				break;
		}
	} else {
		prefChoice = gkEras.getEra("Geckium.appearance.choice");
	}
	
	if (!prefChoice)
		prefChoice = 0;

	if (prefChoice == previousChoice) {
		console.log("TAB PAGE: Choice same as previous choice, ignoring.", prefChoice, previousChoice)
	} else {
		console.log("TAB PAGE: Choice not the same as previous choice, continuing.", prefChoice, previousChoice)

		if (document.URL == "about:newtab" || document.URL == "about:home" || document.url == "about:apps") {
			gkBranding.load();
			gkEras.applyEra();
			createMainLayout();
			retrieveFrequentSites();
			getRecentBookmarks();
			createRecentlyClosed();
			setUpPages();
			setUpApps();
		} else if (document.URL == "about:flags") {
			setUpExperiments();
		} else if (document.URL == "about:privatebrowsing" || document.URL == "about:about") {
			gkBranding.load();
			createMainLayout();
		}
	}
}
document.addEventListener("DOMContentLoaded", appearance)

/* bruni: Automatically apply appearance and theme
		  attributes when it detecs changes in the pref. */
const appearanceObs = {
	observe: function (subject, topic, data) {
		if (topic == "nsPref:changed") {
			appearance();
		}
	},
};
Services.prefs.addObserver("Geckium.appearance.choice", appearanceObs, false);
Services.prefs.addObserver("Geckium.main.overrideStyle", appearanceObs, false);
Services.prefs.addObserver("Geckium.main.style", appearanceObs, false);
Services.prefs.addObserver("Geckium.newTabHome.overrideStyle", appearanceObs, false);
Services.prefs.addObserver("Geckium.newTabHome.style", appearanceObs, false);
Services.prefs.addObserver("Geckium.branding.choice", appearanceObs, false);