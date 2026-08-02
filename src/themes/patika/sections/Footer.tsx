import { placeStamp } from "@/themes/_shared/data";
import { pillLine, shell, surface } from "@/themes/patika/parts";
import type { SectionProps } from "@/themes/types";

/** Rozet baglantilarinin ortak hali: kunye rozeti + neon hover. */
const metaLink = `${pillLine} pk-meta transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]`;

/**
 * Kapanis: INCE BIR KUNYE SATIRI.
 *
 * Tasarimda footer diye ayri bir kat yok; lime blogun altinda 11px'lik, genis
 * harf arali, soluk tek bir satir var: solda marka, ortada mekanin tarifi,
 * sagda telif. Onceki turda burada sayfayi ikinci kez acan DEV bir marka adi
 * vardi — marka zaten ust seritte ve hero'da geciyor, ucuncu kez tekrarlanmasi
 * kapanisi agirlastiriyordu. Ust kenarlik da kaldirildi: lime blok zaten
 * sayfayi kapatan ayrac.
 *
 * SOSYAL BAGLANTILAR IKON DEGIL METIN: bu temanin dili tipografi; kucuk ikon
 * setleri afisin kalin harfleri yaninda cerezlesirdi. Platform adlari zaten
 * rozet formunda ve nav ile ayni sekli tasiyor.
 */
export default function Footer({ content }: SectionProps) {
  const { name, tagline, contact, socialLinks, t } = content;
  const year = new Date().getFullYear();
  const coords = placeStamp(content);

  /*
   * Instagram iki yerden gelebiliyor: iletisim alani (kullanici adi) ve sosyal
   * baglanti listesi. Ikisi de doluysa alttaki kunye satirinda ayni hesap iki
   * kez rozet olurdu; sosyal listede varsa kunye rozeti basilmaz.
   */
  const hasSocialInstagram = socialLinks.some(
    (link) => link.platform === "instagram",
  );
  const showInstagramMeta =
    !hasSocialInstagram && Boolean(contact.instagram && contact.instagramHref);

  return (
    <footer className={surface}>
      {/*
        Ust bosluk 26px: tasarimda kunye, sayfayi kapatan lime blogun hemen
        altinda duruyor — bolum araligi (96px) kadar acilirsa yeniden ayri bir
        kat gibi okunur. 44px'lik alt bosluk sayfanin sonu (tasarimda da oyle).
      */}
      <div className={`${shell} pt-[1.625rem] pb-11`}>
        {socialLinks.length > 0 || showInstagramMeta ? (
          <nav aria-labelledby="footer-social-title">
            <h2 id="footer-social-title" className="sr-only">
              {t.social.title}
            </h2>

            <ul className="flex flex-wrap items-center gap-2.5">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={metaLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}

              {showInstagramMeta ? (
                <li>
                  <a
                    href={contact.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={metaLink}
                    dir="ltr"
                  >
                    @{contact.instagram}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        ) : null}

        {/*
          Uc parcali kunye satiri (tasarim: justify-content:space-between).
          Renk govde metninden de soluk — satir sayfayi kapatir, dikkat cekmez.
        */}
        <div
          className={`pk-meta flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[var(--brand-ink-faint)] ${
            socialLinks.length > 0 || showInstagramMeta ? "mt-8" : ""
          }`}
        >
          <span>{name}</span>

          {/*
            Ortada tasarimin "mekani bir cirpida tarif eden" satiri: slogan.
            Slogan yoksa koordinat ayni isi gorur (her zaman soldan saga).
          */}
          {tagline ? (
            <span className="text-pretty">{tagline}</span>
          ) : coords ? (
            <span dir="ltr">{coords}</span>
          ) : null}

          <span>&copy; {year}</span>
        </div>
      </div>
    </footer>
  );
}
