import { IconBrandInstagram, IconMail, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center text-primary hover:text-primary/90"
            >
              <Image
                src="/assets/logo-smp.png"
                className="w-[80px] h-auto shrink-0"
                alt="Logo"
                width={100}
                height={100}
              />
              <span className="text-xs font-semibold text-foreground">
                SMP Negeri 04 Muncar Satu Atap <br /> Muncar Banyuwangi
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-2">
              Mewujudkan pengembangan bakat minat peserta didik sesuai dengan
              kemampuan dasarnya dalam bidang kegiatan ekstrakurikuler.
            </p>
            <p className="text-sm text-muted-foreground">
              Mewujudkan Pembelajaran yang bertumpu pada kompetensi peserta
              didik.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-6">
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl tracking-tight">
                  Quick Links
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Profile Kami
                  </Link>
                  <Link
                    href="/articles"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Berita & Article
                  </Link>
                  <Link
                    href="https://spmb.id/"
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    PPDB Online {new Date().getFullYear()}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-2xl tracking-tight">
                  Hubungi Kami
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    href="https://www.instagram.com/smpn4muncar_satuatap?utm_source=ig_web_button_share_sheet&igsh=NXRpZ280b2xoeTJv"
                    className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <IconBrandInstagram className="w-4 h-4 mr-2" />
                    <span>Instagram</span>
                  </Link>
                  <Link
                    href="mailto:smpn4muncar_satuatap@yahoo.com"
                    className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <IconMail className="w-4 h-4 mr-2" />
                    <span>Email</span>
                  </Link>
                  <Link
                    href="#"
                    className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <IconPhone className="w-4 h-4 mr-2" />
                    <span>Phone</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.054730583022!2d114.3429659739515!3d-8.457968085496402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd3e4ac947d6715%3A0xb218dfb9b0ea39d!2sSMP%20Negeri%204%20Muncar%20Satu%20Atap!5e1!3m2!1sen!2sid!4v1758795934934!5m2!1sen!2sid"
            loading="lazy"
            allowFullScreen={true}
            style={{
              border: 0,
            }}
            className="px-1 w-full h-96 col-span-1"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <p className="text-sm text-muted-foreground mt-3.5">
          &copy; {new Date().getFullYear()} SMP Negeri 04 Muncar Satu Atap. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
