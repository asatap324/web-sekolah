import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/animate-ui/components/radix/accordion";

export function FaqsSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mx-4 grid h-full min-md:h-[calc(100vh-2rem)] grid-cols-1  md:mx-0 md:grid-cols-2 md:border-x-0">
        <div className="space-y-4 px-4 pt-12 pb-4 md:border-r">
          <h2 className="font-bold text-3xl md:text-4xl">
            Pertanyaan Paling Populer
          </h2>
          <p className="text-muted-foreground">
            Berikut adalah beberapa pertanyaan umum dan jawabannya yang mungkin
            Anda temui saat ingin mendapatkan informasi tentang sekolah.
          </p>
        </div>
        <div className="place-content-center">
          <Accordion collapsible defaultValue="item-2" type="single">
            {questions.map((item) => (
              <AccordionItem
                className="first:border-t last:border-b data-[state=open]:bg-sidebar"
                key={item.id}
                value={item.id}
              >
                <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground bg-sidebar">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className=" h-14 border-t hidden md:block"></div>
    </div>
  );
}

const questions = [
  {
    id: "item-1",
    title: "Dimana lokasi sekolah SMP Negeri 04 Muncar Satu Atap?",
    content: (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.163294438647!2d114.34385955550741!3d-8.457971865361145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd3e4ac947d6715%3A0xb218dfb9b0ea39d!2sSMP%20Negeri%204%20Muncar%20Satu%20Atap!5e1!3m2!1sen!2sid!4v1763358340206!5m2!1sen!2sid"
        width="600"
        height="450"
        style={{ border: "0" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    ),
  },
  {
    id: "item-2",
    title: "Kapan biasanya pelaksanaan PPDB SMP Negeri 04 Muncar Satu Atap?",
    content:
      "PPDB biasanya dilaksanakan setelah pengumuman kelulusan SD/sederajat, sekitar bulan Juni-Juli. Jadwal dan tahapan resmi akan diumumkan melalui website sekolah, papan pengumuman, dan media sosial resmi sekolah.",
  },
];
