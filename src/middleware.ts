import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/i18n/config";

/**
 * Dil yonlendirmesi + <html lang/dir> icin baslik.
 *
 * ONEMLI: middleware Edge runtime'da calisir, bu yuzden burada VERITABANI
 * OKUNMAZ. Hangi dillerin acik oldugu sunucu tarafinda ([locale]/page.tsx)
 * kontrol edilir; burada sadece slug'in bicimsel gecerliligine bakilir.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1] ?? "";

  // Zaten dil onekli bir yol: sadece basligi ekle.
  if (isLocale(firstSegment)) {
    const response = NextResponse.next();
    response.headers.set("x-locale", firstSegment);
    return response;
  }

  // Dil oneki yok -> tarayici tercihine gore yonlendir.
  const accept = request.headers.get("accept-language");
  const preferred = pickFromHeader(accept);

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

/** config.ts'teki pickLocale'in DB'siz, edge-uyumlu surumu. */
function pickFromHeader(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0] ?? "";
    if ((LOCALES as readonly string[]).includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export const config = {
  /*
   * /admin, /api, /_next ve uzantili dosyalar disinda her yerde calisir.
   *
   * opengraph-image DISLANMALI: uzantisi olmadigi icin bu kalibin icine
   * giriyor, dile yonlendiriliyor (/tr/opengraph-image) ve orada boyle bir
   * rota olmadigi icin 404 donuyordu — yani WhatsApp/X/LinkedIn onizlemesi
   * hicbir sitede calismiyordu. Ayni sey apple-icon icin de gecerli.
   *
   * `icon` (uzantisiz) da ayni sebeple burada: favicon artik statik bir
   * icon.svg degil, marka renklerinden uretilen bir ROTA (src/app/icon.tsx).
   * Listede eski dosya adi (icon.svg) kaldigi surece /icon dile yonlendirilip
   * 404 donuyor ve sekmede hic ikon gorunmuyordu.
   */
  matcher: [
    "/((?!admin|api|_next/static|_next/image|icon|opengraph-image|apple-icon|placeholders|.*\\..*).*)",
  ],
};
