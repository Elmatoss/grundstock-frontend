// Deliberately hardcoded. The festival's dates, its recap text and its
// aftermovie live in the CMS, because the countdown and the archive have to
// follow them without a deploy — everything below changes once a year at most,
// and a reviewed commit is a better place for an IBAN than a text field.
// See docs/MULTI-YEAR.md.
export const site = {
	baseUrl: "https://grundstock-festival.de",
	// Null until 2027's presale and shift sign-up exist — the in-house shop and
	// shift picker are due in January (grundstock-backend/docs/PLAN.md). Every
	// link to one of these renders "Infos folgen bald" instead, and the short
	// URLs /tickets and /helfen land on the homepage section that says so.
	ticketUrl: null as string | null,
	helfertoolUrl: null as string | null,
	mittelgschaftlerEmail: null as string | null,
	contactEmail: "info@neues-brett.de",
	instagramUrl: "https://www.instagram.com/grundstock.neuesbrett",
	instagramHandle: "grundstock.neuesbrett",
	// Travel logistics (An-/Abreise PDF 2026). The three WhatsApp groups are the
	// organisers' own channels for the bike tour, carpooling and the parking
	// shuttle — each one belongs to exactly one travel option below.
	anreise: {
		// Exact pin on the festival grounds — 49°17'31.0"N 11°56'43.4"E, Plus Code
		// 7WRW+Q5C Rieden. A coordinate query drops the pin precisely; the previous
		// "Vilswörth Rieden" text search only landed on the village.
		mapsUrl:
			"https://www.google.com/maps/search/?api=1&query=49.291944,11.945389",
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

type Shuttle = {
	direction: "hin" | "zurueck";
	day: "Do" | "Fr" | "So";
	times: readonly string[];
};

// Empty until 2027's departures are set; the shuttle tables show "Infos folgen
// bald" meanwhile. 2026 ran Do 13:00 · 15:30 · 18:00, Fr 10:00 · 12:00 · 14:00
// out and So 10:00 · 12:00 · 15:00 · 17:00 back, at 5 € a ticket.
export const shuttles: readonly Shuttle[] = [];

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
