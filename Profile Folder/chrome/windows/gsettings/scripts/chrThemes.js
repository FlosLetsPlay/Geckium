const chrThemesList = document.getElementById("themes-grid");

async function populateChrThemesList() {
	const themes = await gkChrTheme.getThemes();

	chrThemesList.querySelectorAll("button[data-theme-name]").forEach(item => {
		item.remove();
	})

	for (const themeName in themes) {
		let theme = themes[themeName];

		let themeDescription;
		if (!themeDescription)
			themeDescription = "This theme has no description.";
		else
			themeDescription = theme.description.replace(/[&<>"']/g, match => specialCharacters[match]);


		const themeFile = theme.file.replace(".crx", "");

		let themeBanner = theme.banner;
		let themeBannerPath = `jar:${chrThemesFolder}/${themeFile}.crx!/${themeBanner}`;
		if (!themeBanner)
			themeBannerPath = "";

		let themeBannerColor = theme.color;
		if (!themeBannerColor)
			themeBannerColor = (themeBannerPath == "") ? "black" : "transparent";

		let themeIcon = theme.icon;
		let themeIconPath;
		if (themeIcon) {
			themeIconPath = `jar:${chrThemesFolder}/${themeFile}.crx!/${themeIcon}`;
		} else {
			themeIconPath = "chrome://userchrome/content/windows/gsettings/imgs/logo.svg";
		}
		
		const themeVersion = theme.version;
		
		let themeElm = `
		<html:button
				class="link geckium-appearance ripple-enabled"
				data-theme-name="${themeFile}"
				style="background-color: ${themeBannerColor}; background-image: url(${themeBannerPath})">
			<html:label class="wrapper">
				<div class="year">V${themeVersion}</div>
				<div class="icon"><image style="width: 48px; height: 48px; border-radius: 100%" src="${themeIconPath}" /></div>
				<div class="identifier">
					<vbox style="min-width: 0">
						<div class="radio-parent">
							<html:input id="theme-${themeFile}" class="radio" type="radio" name="gktheme"></html:input>
							<div class="gutter" for="checked_check"></div>
							<html:label class="name label">${themeName.replace(/[&<>"']/g, match => specialCharacters[match])}</html:label>
						</div>
						<html:label class="description">${themeDescription}</html:label>
					</vbox>
				</div>
			</html:label>
		</html:button>
		`

		chrThemesList.appendChild(MozXULElement.parseXULToFragment(themeElm));
	}

	chrThemesList.querySelectorAll("button[data-theme-name]").forEach(item => {
		item.addEventListener("click", () => {
			applyTheme(item.dataset.themeName);
		})
	})

	let prefChoice = gkPrefUtils.tryGet("Geckium.chrTheme.fileName").string;
	if (prefChoice) {
		chrThemesList.querySelector(`button[data-theme-name="${prefChoice}"] input[type="radio"]`).checked = true;
	}
}
document.addEventListener("DOMContentLoaded", populateChrThemesList);

async function applyTheme(themeid) {
	const lighttheme = await AddonManager.getAddonByID("firefox-compact-light@mozilla.org");
	await lighttheme.enable();
	gkPrefUtils.set("Geckium.chrTheme.fileName").string(themeid);
}

function openChrThemesDir() {
	const { FileUtils } = ChromeUtils.import("resource://gre/modules/FileUtils.jsm");

	// Specify the path of the directory you want to open
	const directoryPath = chrTheme.getFolderFileUtilsPath;

	try {
		// Create a file object representing the directory
		const directory = new FileUtils.File(directoryPath);

		// Open the directory
		directory.launch();
	} catch (e) {
		window.alert(`Could not open ${directoryPath} - ensure the directory exists before trying again.`);
	}
}