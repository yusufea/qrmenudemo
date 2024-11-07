import { useRouter } from "next/router";
import ar from "../../locales/ar";
import en from "../../locales/en";
import tr from "../../locales/tr";
export default function Welcome() {
  const router = useRouter();
  const { locale } = router;

  const t = locale === "tr" ? tr : locale === "en" ? en : ar;

  return (
    <div className="mt-8">
      <div className="flex justify-center">
        <div className="flex flex-col gap-4">
          <a href={`/${locale}/menu`} className="text-center bg-black text-white border border-black rounded-md shadow-[4px_4px_0_0_#fff,4px_4px_0_1px_#000] font-sans text-sm font-normal leading-5 py-3 px-10 hover:no-underline focus:no-underline transition-transform duration-100 ease-in-out active:translate-x-0.5 active:translate-y-0.5 bg-slate-800 md:px-12" role="button">{t.menu}</a>
          <a href={`/${locale}/menu`} className="text-center bg-black text-white border border-black rounded-md shadow-[4px_4px_0_0_#fff,4px_4px_0_1px_#000] font-sans text-sm font-normal leading-5 py-3 px-10 hover:no-underline focus:no-underline transition-transform duration-100 ease-in-out active:translate-x-0.5 active:translate-y-0.5 bg-slate-800 md:px-12" role="button">{t.opinions_suggestions}</a>
          <a href={`/${locale}/carkcevir`} className="text-center bg-black text-white border border-black rounded-md shadow-[4px_4px_0_0_#fff,4px_4px_0_1px_#000] font-sans text-sm font-normal leading-5 py-3 px-10 hover:no-underline focus:no-underline transition-transform duration-100 ease-in-out active:translate-x-0.5 active:translate-y-0.5 bg-slate-800 md:px-12" role="button">{t.spinwhell}</a>
        </div>
      </div>
    </div>
  )
}