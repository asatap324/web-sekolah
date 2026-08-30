import {
  ImageIcon,
  TypeIcon,
  LayoutTemplateIcon,
  TagsIcon,
  ArchiveIcon,
} from "lucide-react";

export default function TutorialPage() {
  return (
    <div className="min-h-[100dvh] w-full max-w-7xl mx-auto p-6 md:p-10 lg:p-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        {/* Left Sidebar - Sticky */}
        <aside className="lg:w-1/3 lg:sticky lg:top-12 h-fit">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            SOP Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-balance">
            Panduan Menulis Berita
          </h1>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            Ikuti standar operasional prosedur ini agar artikel yang Anda tulis
            tampil maksimal, rapi, dan mudah dibaca oleh siswa maupun wali
            murid.
          </p>
        </aside>

        {/* Right Content - Editorial Steps */}
        <main className="lg:w-2/3 space-y-16">
          {/* Step 1 */}
          <section className="relative group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl border border-border/50 bg-muted/20 items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300">
                <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    01. Thumbnail (Cover Berita)
                  </h2>
                  <p className="text-muted-foreground mt-1.5">
                    Gambar utama yang merepresentasikan isi artikel.
                  </p>
                </div>
                <div className="grid gap-4 bg-muted/20 p-6 rounded-3xl border border-border/50">
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Gunakan gambar beresolusi baik, disarankan berbentuk{" "}
                      <strong className="text-foreground font-medium">
                        Landscape (mendatar)
                      </strong>
                      .
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Ukuran file maksimal yang disarankan adalah{" "}
                      <strong className="text-foreground font-medium">
                        2MB
                      </strong>{" "}
                      agar cepat dimuat.
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      Jika tidak diisi, area gambar pada berita akan terlihat
                      kosong dan kurang menarik.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="relative group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl border border-border/50 bg-muted/20 items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300">
                <TypeIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    02. Penulisan Judul
                  </h2>
                  <p className="text-muted-foreground mt-1.5">
                    Buat kesan pertama yang jelas dan spesifik.
                  </p>
                </div>
                <div className="grid gap-4 bg-muted/20 p-6 rounded-3xl border border-border/50">
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Gunakan{" "}
                      <strong className="text-foreground font-medium">
                        Huruf Kapital
                      </strong>{" "}
                      di setiap awal kata (Title Case).
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Contoh judul yang baik:{" "}
                      <em className="text-foreground font-medium bg-muted px-1.5 py-0.5 rounded ml-1">
                        Peringatan Hari Kemerdekaan di SMPN 4 Muncar
                      </em>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="relative group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl border border-border/50 bg-muted/20 items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300">
                <LayoutTemplateIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    03. Format Editor Teks
                  </h2>
                  <p className="text-muted-foreground mt-1.5">
                    Tips menyusun konten agar rapi dibaca di HP maupun Laptop.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-colors">
                    <h3 className="font-medium mb-2">Pemformatan Dasar</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Gunakan{" "}
                      <strong className="text-foreground font-medium">
                        Bold
                      </strong>{" "}
                      untuk kata kunci, dan <em className="italic">Italic</em>{" "}
                      untuk istilah asing. Hindari menebalkan satu paragraf
                      penuh.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-colors">
                    <h3 className="font-medium mb-2">Paragraf Pendek</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Batasi paragraf maksimal 4-5 kalimat. Tekan{" "}
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                        Enter
                      </code>{" "}
                      untuk memecah blok teks yang terlalu panjang.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-colors">
                    <h3 className="font-medium mb-2">Sisip Gambar</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Anda bisa mengunggah gambar pendukung langsung ke dalam
                      area teks atau{" "}
                      <span className="italic">drag-and-drop</span> dari
                      perangkat Anda.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-6 rounded-3xl border border-border/50 hover:bg-muted/40 transition-colors">
                    <h3 className="font-medium mb-2">Gunakan List</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Untuk daftar langkah atau nama, selalu gunakan fitur{" "}
                      <em className="italic">bullet points</em> agar mudah
                      di-scan mata.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section className="relative group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl border border-border/50 bg-muted/20 items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300">
                <TagsIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    04. Kategori Topik
                  </h2>
                  <p className="text-muted-foreground mt-1.5">
                    Pengelompokan artikel untuk mempermudah pencarian siswa.
                  </p>
                </div>
                <div className="bg-muted/20 p-6 rounded-3xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    Ketik nama kategori lalu tekan{" "}
                    <code className="text-xs bg-muted/80 px-1.5 py-0.5 rounded text-foreground">
                      Enter
                    </code>
                    . Setiap artikel wajib memiliki minimal 1 kategori spesifik:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {["Prestasi", "Pengumuman", "Kegiatan Siswa", "OSIS"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-background border border-border/60 rounded-xl text-xs font-medium shadow-sm"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 5 */}
          <section className="relative group">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="hidden sm:flex shrink-0 w-14 h-14 rounded-2xl border border-border/50 bg-muted/20 items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-300">
                <ArchiveIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="space-y-5 w-full">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    05. Manajemen Arsip
                  </h2>
                  <p className="text-muted-foreground mt-1.5">
                    Menyembunyikan artikel usang tanpa menghapusnya.
                  </p>
                </div>
                <div className="grid gap-4 bg-muted/20 p-6 rounded-3xl border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
                    Gunakan fitur arsip khusus untuk artikel yang sudah
                    kedaluwarsa{" "}
                    <span className="italic">
                      (misal: Info Pendaftaran Tahun Lalu)
                    </span>
                    .
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Artikel tidak akan tampil lagi di web publik.
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Data beserta medianya tetap aman di database sistem.
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">
                      Dapat dipulihkan kapan saja via tombol{" "}
                      <em className="text-foreground font-medium bg-muted px-1.5 py-0.5 rounded ml-1">
                        Kembalikan
                      </em>{" "}
                      di tabel dashboard.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
