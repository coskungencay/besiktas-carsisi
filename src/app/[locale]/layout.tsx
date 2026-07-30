import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isLocale } from "@/i18n/config";
import { getEnabledLocales, getSiteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || !getEnabledLocales().includes(locale)) return {};
  return buildMetadata(getSiteContent(locale));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const { locale } = await params;

  // Bilinmeyen slug -> 404.
  if (!isLocale(locale)) notFound();

  // Gecerli ama panelde KAPALI bir dil -> varsayilan dile yonlendir.
  // (Middleware edge'de calistigi icin hangi dillerin acik oldugunu bilemez;
  // tarayicisi Almanca olan bir ziyaretci Almanca kapaliyken 404 gormemeli.)
  const enabled = getEnabledLocales();
  if (!enabled.includes(locale)) redirect(`/${enabled[0]}`);

  return <>{children}</>;
}
