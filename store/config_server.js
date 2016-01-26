$(function(){
	Config.runConfig();
});

var Config = {
	//szerverrel kommunikáló configok
	url: "http://81.2.236.67:5000",
	//url: "../server/",
	registrationPage: "/userRegistration/",
	//loginPage: "userLogin.php",
	loginPage: "/userLogin/",
	userDataPage: "/userData/",
	getDataPage: "/getData/",
	songDataPage: "/songData/",
	songbookDataPage: "/songbookData/",

	//stringek
	usernameExists: "Már létezik ilyen nevű felhasználónév!",
	notEqualPasswords: "Nem egyezik a két jelszó!",
	registrationUnsuccesful: "Valamilyen hibás adat miatt nem sikerült a regisztráció!",
	registrationSuccesful: "Sikerült a regisztráció!",
	registrationTitle: "Regisztráció",

	loginTitle: "Belépés",
	loginUnsuccesful: "Nem sikerült a bejelentkezés - a felhasználónév vagy a jelszó nem megfelelő",
	notLoggedIn: "Nem vagy bejelentkezve",
	unsuccesfulStep: "Sikertelen művelet",

	giveTitle: "Cím megadása",
	newSongSuccessful: "A mentés sikeres",
	verse: "Versszak",
	refrain: "Refrén",
	bridge: "Átvezető",


	edit: "Módosítás",
	editRequest: "Módosítás kérése",
	delete: "Törlés",
	deleteRequest: "Törlés kérése",
	fork: "Új verzió",
	songs: "ének",
	rename: 'Átnevezés',
	share: 'Megosztás',
	download: 'Letöltés',
	exit: "Befejezés",
	User:"Felhasználó",
	Owner:"Tulajdonos",
	Shared:"Megosztott",
	Admin:"Admin",

	//témákhoz tartozó stringek
	searchBarBg: "Kereső háttér",
	background: "Háttér",
	circleButtonBg: "Kör gomb háttér",
	cardBg: "Kártya háttér",

	//témaszerkesztés
	missingTitle: "Hiányzik a név!",

	runConfig: function() {
		//Statikus stringek
		$(".conf-login").html("Bejelentkezés");
		$(".conf-registration").html("Regisztráció");
		$(".conf-create-songbook").html("Énekeskönyv létrehozása");
		$(".conf-my-songbooks").html("Énekeskönyveim");
		$(".conf-add-new-song").html("Új ének hozzáadása");
		$(".conf-all-songbook").html("Összes énekeskönyv");
		$(".conf-log-out").html("Kijelentkezés");
		$(".conf-lastname").html("Vezetéknév");
		$(".conf-firstname").html("Keresztnév");
		$(".conf-username").html("Felhasználónév");
		$(".conf-email").html("E-mail cím");
		$(".conf-password").html("Jelszó");
		$(".conf-password-re").html("Jelszó még egyszer");
		$(".conf-ok").html("OK");
		$(".conf-cancel").html("Mégse");
		$(".conf-text").html("Szöveg");
		$(".conf-editor").html("Szerkesztő");
		$(".conf-title").html("Cím");
		$(".conf-chord").html("Akkord");
		$(".conf-verse").html("Versszak");
		$(".conf-chorus").html("Refrén");
		$(".conf-bridge").html("Átvezető");
		$(".conf-text-textarea").html("Ének szövege");
		$(".conf-preview").html("Előnézet");
		$(".conf-notes").html("Kotta");
		$(".conf-settings").html("Beállítások");
		$(".conf-choose-one").html("Válassz egyet");
		$(".conf-language").html("Nyelv");
		$(".conf-other-language").html("Más nyelven");
		$(".conf-no").html("Nem");
		$(".conf-labels").html("Címkék");
		$(".conf-comment").html("Megjegyzés");
		$(".conf-labels-details").html("Szöveg, link, kép, videó");
		$(".conf-themes").html("Témák");
		$(".conf-choosen-theme").html("Választott téma");
		$(".conf-custom").html("Egyedi");
		$(".conf-choosen-theme-name").html("Név");
		$(".conf-choosen-theme-public").html("Publikus");
		$(".conf-public").html("Publikus");
		//$(".conf-default").html("Alapbeállítás");
		$(".config-footer-tooltip-download").attr("data-tooltip",Config.download);
		$(".config-footer-tooltip-close").attr("data-tooltip",Config.exit);
	}
};