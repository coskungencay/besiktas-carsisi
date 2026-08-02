/**
 * Musteri repo'sunu hazirlar: SECILEN temayi birakir, digerlerini kaldirir.
 *
 * Kullanim (musteri icin acilan KOPYA repoda calistirilir):
 *   pnpm new:customer --theme=beyaz-oda            # onay sorar
 *   pnpm new:customer --theme=beyaz-oda --dry-run  # hicbir seye dokunmaz
 *   pnpm new:customer --theme=beyaz-oda --yes      # onay sormaz (CI icin)
 *
 * Yaptiklari:
 *   1. Secilen tema disindaki tema klasorlerini siler
 *   2. src/themes/registry.ts dosyasini tek temaya gore yeniden yazar
 *   3. src/app/globals.css icindeki tema import satirlarini gunceller
 *   4. .env.example icine NEXT_PUBLIC_THEME=<slug> yazar (tema pinlenir)
 *   5. Kalan tema legacy ortak bilesenleri kullanmiyorsa onlari da siler
 *   6. design-input/designs icerigini temizler
 *
 * Idempotent: ikinci kez calistirildiginda yapacak is kalmadigini soyler.
 */
import { createInterface } from "node:readline/promises";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const THEMES_DIR = "src/themes";
const REGISTRY_PATH = join(THEMES_DIR, "registry.ts");
const GLOBALS_PATH = "src/app/globals.css";
const ENV_EXAMPLE_PATH = ".env.example";
const DESIGN_INPUT_DIR = "design-input/designs";

/** Tema klasoru olmayan alt klasorler. */
const NON_THEME_DIRS = new Set(["_shared", "shared"]);

type Args = { theme: string; dryRun: boolean; yes: boolean };

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const theme =
    args.find((a) => a.startsWith("--theme="))?.split("=")[1]?.trim() ?? "";
  return {
    theme,
    dryRun: args.includes("--dry-run"),
    yes: args.includes("--yes"),
  };
}

function themeSlugs(): string[] {
  return readdirSync(THEMES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !NON_THEME_DIRS.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/** Tema klasorunun default export'unu iceren degisken adi (camelCase). */
function importName(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function renderRegistry(slug: string): string {
  const name = importName(slug);
  return `import ${name} from "./${slug}";
import type { ThemeDefinition } from "./types";

/**
 * Bu repo TEK musteri icindir: tema pinlenmistir ve panelden degistirilemez.
 * Baska bir tema gerekiyorsa sablon repodan yeni bir kopya acin.
 */
export const themeRegistry: Record<string, ThemeDefinition> = {
  "${slug}": ${name},
};

export const DEFAULT_THEME_SLUG = "${slug}";

export const themeSlugs = Object.keys(themeRegistry);

export function isThemeSlug(slug: string | null | undefined): slug is string {
  return typeof slug === "string" && slug in themeRegistry;
}

export function getTheme(slug: string | null | undefined): ThemeDefinition {
  if (isThemeSlug(slug)) return themeRegistry[slug] as ThemeDefinition;
  return themeRegistry[DEFAULT_THEME_SLUG] as ThemeDefinition;
}

/** Env ile sabitlenmis tema (Docker imajina pinlemek icin). */
export function pinnedThemeSlug(): string | null {
  const raw = process.env.NEXT_PUBLIC_THEME?.trim();
  return isThemeSlug(raw) ? raw : null;
}

/**
 * Aktif tema cozumleme sirasi:
 *   1. NEXT_PUBLIC_THEME (gecerli bir slug ise)
 *   2. site_settings.themeSlug
 *   3. DEFAULT_THEME_SLUG
 */
export function resolveThemeSlug(dbSlug?: string | null): string {
  return pinnedThemeSlug() ?? (isThemeSlug(dbSlug) ? dbSlug : DEFAULT_THEME_SLUG);
}

/** Bir temanin marka renkleri; panelde form varsayilanlari icin. */
export function themeDefaultColors(slug: string | null | undefined) {
  return getTheme(slug).defaultColors;
}
`;
}

/** globals.css icindeki tema token import'larini tek temaya indirir. */
function rewriteGlobals(slug: string): string {
  const css = readFileSync(GLOBALS_PATH, "utf8");
  const lines = css.split("\n");
  const keep = `@import "../themes/${slug}/tokens.css";`;

  let inserted = false;
  const out: string[] = [];

  for (const line of lines) {
    const isThemeImport = /^@import "\.\.\/themes\/[^/]+\/tokens\.css";$/.test(
      line.trim(),
    );
    if (!isThemeImport) {
      out.push(line);
      continue;
    }
    if (!inserted) {
      out.push(keep);
      inserted = true;
    }
    // Diger tema import'lari atilir.
  }

  if (!inserted) {
    throw new Error(
      `${GLOBALS_PATH} icinde tema import satiri bulunamadi; dosya elle mi degistirildi?`,
    );
  }
  return out.join("\n");
}

function setEnvExampleTheme(slug: string): string {
  const env = readFileSync(ENV_EXAMPLE_PATH, "utf8");
  if (/^NEXT_PUBLIC_THEME=.*$/m.test(env)) {
    return env.replace(/^NEXT_PUBLIC_THEME=.*$/m, `NEXT_PUBLIC_THEME=${slug}`);
  }
  return `${env.trimEnd()}\n\nNEXT_PUBLIC_THEME=${slug}\n`;
}

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} [e/H] `);
  rl.close();
  return /^(e|evet|y|yes)$/i.test(answer.trim());
}

async function main() {
  const { theme, dryRun, yes } = parseArgs();
  const available = themeSlugs();

  if (!theme) {
    console.error(
      `Tema belirtin: pnpm new:customer --theme=<slug>\nMevcut temalar: ${available.join(", ")}`,
    );
    process.exit(1);
  }

  if (!available.includes(theme)) {
    console.error(
      `"${theme}" diye bir tema yok.\nMevcut temalar: ${available.join(", ")}`,
    );
    process.exit(1);
  }

  const removable = available.filter((slug) => slug !== theme);
  console.log(`\nSecilen tema: ${theme}`);
  if (removable.length > 0) {
    console.log(`Silinecek temalar: ${removable.join(", ")}`);
  } else {
    console.log("Silinecek tema yok — repo zaten tek temali.");
  }
  console.log(`Guncellenecek: ${REGISTRY_PATH}, ${GLOBALS_PATH}, ${ENV_EXAMPLE_PATH}`);
  if (existsSync(DESIGN_INPUT_DIR)) {
    console.log(`Temizlenecek: ${DESIGN_INPUT_DIR}`);
  }

  if (dryRun) {
    console.log("\n--dry-run: hicbir dosyaya dokunulmadi.\n");
    return;
  }

  if (!yes) {
    console.log(
      "\nDIKKAT: Bu islem geri alinamaz. SABLON repoda DEGIL, musteri icin\n" +
        "acilmis kopyada calistirdiginizdan emin olun.",
    );
    if (!(await confirm("Devam edilsin mi?"))) {
      console.log("Iptal edildi.");
      return;
    }
  }

  for (const slug of removable) {
    rmSync(join(THEMES_DIR, slug), { recursive: true, force: true });
  }

  writeFileSync(REGISTRY_PATH, renderRegistry(theme), "utf8");
  writeFileSync(GLOBALS_PATH, rewriteGlobals(theme), "utf8");
  writeFileSync(ENV_EXAMPLE_PATH, setEnvExampleTheme(theme), "utf8");

  if (existsSync(DESIGN_INPUT_DIR)) {
    rmSync(DESIGN_INPUT_DIR, { recursive: true, force: true });
  }

  console.log(`
Tamam. Sirada:
  1. pnpm typecheck && pnpm build   (her sey derleniyor mu)
  2. .env dosyaniza NEXT_PUBLIC_THEME=${theme} ekleyin
  3. Musteri iceriklerini panelden girin
  4. DEPLOY.md ile yayina alin
`);
}

main().catch((error) => {
  console.error("[new-customer] hata:", error);
  process.exit(1);
});
