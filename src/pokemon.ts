const PATH_TO_SPRITES = 'sprites/normal/';
const PATH_TO_SHINY_SPRITES = 'sprites/shiny/';
const SPRITE_EXTENTION = '.png';

interface Pokemon {
	/** National Pokédex number. */
	id: number;
	/** The display name of this Pokémon. */
	name: string;
	/** This Pokémon's type(s) (lowecased). */
	types: string[];
	/** Whether this Pokémon is not fully evolved. Defaults to false. */
	isNfe?: boolean;
	/** Whether this Pokémon is legendary. Defaults to false. */
	isLegendary?: boolean;
	/** Whether this Pokémon can be rented in Stadium 1 or 2. Defaults to true. */
	isStadiumRental?: boolean;
	/** Alternate forms for this Pokémon, if any. */
	forms?: Form[];
}

interface Form {
	/** Display name for this form. */
	name: string;
	/** Type(s) of this form (lowercased). */
	types: string[];
	/** An optional suffix added to the sprite's filename (between a hyphen and the extension). */
	spriteSuffix?: string;
	/** Whether this form is a Mega Evolution. Defaults to false. */
	isMega?: boolean;
	/** Whether this form is a Gigantamax. Defaults to false. */
	isGigantamax?: boolean;
}

class GeneratedPokemon {
	/** National Pokédex number. */
	readonly id: number;
	/** The name of this Pokémon, not including what form it is. */
	readonly baseName: string;
	/** The name of this Pokémon, including what form it is. */
	readonly name: string;
	/** An optional suffix added to the sprite's filename (between a hyphen and the extension). */
	private readonly spriteSuffix?: string;
	/** This Pokémon's nature, if generated. */
	readonly nature?: string;
	/** Whether this Pokémon is shiny. */
	readonly shiny: boolean;
	/** When this Pokémon was generated. */
	readonly date: Date;

	private constructor(pokemon?: Pokemon, form?: Form, options?: Options) {
		if (!pokemon) {
			return;
		}
		this.id = pokemon.id;
		this.baseName = pokemon.name;
		this.name = form?.name ?? pokemon.name;
		this.spriteSuffix = form?.spriteSuffix;
		if (options.natures) {
			this.nature = generateNature();
		}
		// http://bulbapedia.bulbagarden.net/wiki/Shiny_Pok%C3%A9mon#Generation_VI
		this.shiny = Math.floor(Math.random() * 65536) < 16;
		this.date = new Date();
	}

	static generate(pokemon: Pokemon, form: Form | undefined, options: Options): GeneratedPokemon {
		return new GeneratedPokemon(pokemon, form, options);
	}

	static fromJson(parsed: Object): GeneratedPokemon {
		const pokemon = new GeneratedPokemon();
		Object.assign(pokemon, parsed);
		return pokemon;
	}

	/** Converts JSON for a single Pokémon into an HTML list item. */
	toHtml(includeSprite: boolean): string {
		let classes = "";
		if (this.shiny) {
			classes += "shiny ";
		}
		if (!includeSprite) {
			classes += "imageless ";
		}
		return `<li class="${classes}">
			${includeSprite ? this.toImage() : ""}
			${this.toText()}
		</li>`;
	}

	toText(): string {
		return `
			${this.nature ? `<span class="nature">${this.nature}</span>` : ""}
			${this.name}
			${this.shiny ? `<span class="star">&starf;</span>` : ""}
		`;
	}

	toImage(): string {
		const altText = (this.shiny ? "Shiny " : "") + this.name;
		return `<img src="${this.getSpritePath()}" alt="${altText}" title="${altText}" />`;
	}

	private getSpritePath(): string {
		const path = this.shiny ? PATH_TO_SHINY_SPRITES : PATH_TO_SPRITES;
		let name = this.normalizeName();
		if (this.spriteSuffix) {
			name += "-" + this.spriteSuffix;
		}
		return path + name + SPRITE_EXTENTION;
	}

	private normalizeName(): string {
		return (this.baseName ?? this.name)
			.toLowerCase()
			.replaceAll("é", "e")
			.replaceAll("♀", "f")
			.replaceAll("♂", "m")
			.replaceAll(/['.:% -]/g, "");
	}
}

function generateNature(): string {
	return getRandomElement(NATURES);
}

const NATURES = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle", "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Na&iuml;ve", "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"];
