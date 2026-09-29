import { FadeInView } from "@/components/FadeInView";
import { FaqList } from "@/components/FaqList";
import { HOME_FAQ } from "@/lib/faq";

export function FAQ() {
  return (
    <section id="faq" className="bg-primary py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <FadeInView className="text-center">
          <h2 className="mt-3 font-display text-section font-bold text-balance text-background">
            Perguntas frequentes
          </h2>
        </FadeInView>

        <div className="mt-10">
          <FaqList entries={HOME_FAQ} tone="dark" />
        </div>
      </div>
    </section>
  );
}
