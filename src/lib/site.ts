// Deliberately hardcoded — the CMS siteSettings singleton only carries the
// announcement banner. Ticketing & shift management become part of the site
// itself next year; these values change by deploy, not by CMS edit.
export const site = {
	baseUrl: "https://grundstock-festival.de",
	// Program starts Thursday; Sunday is teardown & departure only
	festivalStart: "2026-08-13T14:00:00+02:00",
	festivalEndDate: "2026-08-16",
	ticketUrl:
		"https://eventfrog.de/de/p/festivals/weitere-festivals/grundstock-2026-7440753604112179814.html",
	helfertoolUrl:
		"https://airtable.com/appo2wY2SKFOd6ZeL/pagGiBBo6j2Yfpfl2/form",
	mittelgschaftlerEmail: "grundstock2026@neues-brett.de",
	contactEmail: "info@neues-brett.de",
	instagramUrl: "https://www.instagram.com/grundstock.neuesbrett",
	instagramHandle: "grundstock.neuesbrett",
	recapYoutubeId: "sACZxjbCPls",
	// Travel logistics (An-/Abreise PDF 2026). The three WhatsApp groups are the
	// organisers' own channels for the bike tour, carpooling and the parking
	// shuttle — each one belongs to exactly one travel option below.
	anreise: {
		// Exact pin on the festival grounds — 49°17'31.0"N 11°56'43.4"E, Plus Code
		// 7WRW+Q5C Rieden. A coordinate query drops the pin precisely; the previous
		// "Vilswörth Rieden" text search only landed on the village.
		mapsUrl:
			"https://www.google.com/maps/search/?api=1&query=49.291944,11.945389",
		shuttlePriceEur: 5,
		shuttleStop: "Regensburg Hbf, Flixbus-Haltestelle",
		busLines: "454 & 451",
		busStop: "Vilswörth",
		bikeRoad: "St2165",
		parkingPlace: "Freiwillige Feuerwehr Vilshofen",
		nightExitRoute: "Am Lehmbühl",
		znasTimetableUrl: "https://www.znas.de/fahrplaene/",
		whatsappBikeTour:
			"https://chat.whatsapp.com/Gbp4NoXT6HaGtpCEBlhmp0?s=cl&p=i&ilr=1",
		whatsappCarpool: "https://chat.whatsapp.com/FRVTRAg7vTV7rf1T6K3K5Z",
		whatsappParkingShuttle:
			"https://chat.whatsapp.com/JPVh2Ows1Hx02C5d46mCO7?s=cl&p=i&ilr=1",
	},
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

// Curated from the genres actually tagged on artists in Sanity — a vibe strip,
// not an index, so near-duplicates are collapsed (Indie covers Indie Pop; House
// covers Deep/Space House; Trap covers Trapsoul; Hip-Hop covers Boom Bap) and
// the vague umbrella "Electronic" is dropped in favour of the specific scenes
// underneath it. Ordered by tag count first, then mixed so the scroll alternates
// between scenes instead of running three hip-hop entries together.
// NB: this drifts as artists are added. Re-check it against the CMS before the
// lineup is announced — "DnB" and "Rock" sat here for a while with no artist
// tagged with either.
export const genres = [
	"Hip-Hop",
	"Rap",
	"Techno",
	"Breakbeat",
	"House",
	"Trap",
	"Indie",
	"Punk",
	"Pop",
	"Disco",
	"Latin",
	"Afrobeats",
	"Reggae",
	"Jungle",
	"UK Garage",
	"Jazz",
] as const;
