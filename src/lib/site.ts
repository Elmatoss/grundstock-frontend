// Interim constants — become CMS siteSettings in Phase 2 (docs/PLAN.md §6)
export const site = {
	baseUrl: "https://grundstock-festival.de",
	// Program starts Thursday; Sunday is teardown & departure only
	festivalStart: "2026-08-13T14:00:00+02:00",
	festivalEndDate: "2026-08-16",
	ticketUrl:
		"https://eventfrog.de/de/p/festivals/weitere-festivals/grundstock-2026-7440753604112179814.html",
	helfertoolUrl:
		"https://airtable.com/appo2wY2SKFOd6ZeL/pagGiBBo6j2Yfpfl2/form",
	mittelgschaftlerUrl:
		"https://airtable.com/appo2wY2SKFOd6ZeL/pagay1nyKPcPULWaM/form",
	contactEmail: "info@neues-brett.de",
	recapYoutubeId: "sACZxjbCPls",
	donation: {
		accountHolder: "Neues Brett e.V.",
		iban: "DE36 4306 0967 1355 5742 00",
	},
	// Cloudflare Web Analytics: create the site in the CF dashboard and paste
	// the beacon token here — the script is only injected when non-empty
	cfBeaconToken: "2f403d1780b94f6aaa8a92c2c27531a8",
} as const;

export const shuttles = [
	{ direction: "hin", day: "Do", times: ["13:00", "15:30", "18:00"] },
	{ direction: "hin", day: "Fr", times: ["10:00", "12:00", "14:00"] },
	{
		direction: "zurueck",
		day: "So",
		times: ["10:00", "12:00", "15:00", "17:00"],
	},
] as const;

export const genres = [
	"Hip-Hop",
	"Indie",
	"Latin",
	"DnB",
	"Rock",
	"Disco",
	"Techno",
] as const;
