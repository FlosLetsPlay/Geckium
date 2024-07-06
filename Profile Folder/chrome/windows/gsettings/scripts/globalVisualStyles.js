function insertGlobalVisualStyles() {
	// Get the container element where you want to insert the HTML
	var container = document.getElementById("global-appearance-container");

	// Initialize the HTML string
	let chromeAppearanceCard = ``;

	for (var i = 0; i < 10; i++) {
		// Get the appearance details from the map
		var appearance = gkEras.getEras()[i];

		// Construct the HTML for the button using template literals
		chromeAppearanceCard += `
		<html:button data-appearance="${appearance.id}"
				class="link chrome-appearance ripple-enabled" 
				for="chrome-${appearance.int}" 
				style="background-image: url('chrome://userchrome/content/windows/gsettings/imgs/main/chrome-${appearance.int}.png');">
			<html:label class="wrapper" chrome="${appearance.int}">
				<div class="year">${appearance.year[0]}</div>
				<div class="identifier">
					<div class="radio-parent">
						<html:input data-appearance="${appearance.id}" class="radio" type="radio" name="global-visual-style" id="chrome-${appearance.int}"></html:input>
						<div class="gutter" for="checked_check"></div>
						<html:label for="chrome-${appearance.int}" class="label">Chrome ${appearance.int}</html:label>
					</div>
				</div>
			</html:label>
		</html:button>
		`;
	}

	// Set the innerHTML of the container to the constructed HTML
	container.appendChild(MozXULElement.parseXULToFragment(chromeAppearanceCard))

	document.querySelectorAll(`#global-appearance-container input[data-appearance]`).forEach(appearance => {
		appearance.addEventListener("click", function() {
			gkPrefUtils.set("Geckium.appearance.choice").int(appearance.dataset.appearance);
		})
	})

	document.querySelector(`#global-appearance-container input[data-appearance="${gkEras.getEra("Geckium.appearance.choice")}"]`).checked = true;
}
document.addEventListener("DOMContentLoaded", insertGlobalVisualStyles);

function disableOverrides() {
	document.querySelector('input[data-pref="Geckium.main.overrideStyle"]').checked = false;
	gkPrefUtils.set("Geckium.main.overrideStyle").bool(false);
	document.querySelector('input[data-pref="Geckium.newTabHome.overrideStyle"]').checked = false;
	gkPrefUtils.set("Geckium.newTabHome.overrideStyle").bool(false);
}