type NavItem = {
  href: string;
  label: string;
  description?: string;
  blank?: boolean;
  icon?: string; // kalau pakai icon component, ubah tipenya sesuai (React.ComponentType)
  comingSoon?: boolean; // <= tambahin optional property
};

export type NavGroup = {
  label: string;
  submenu: true;
  type: "description" | "icon";
  items: NavItem[];
};

export type SimpleLink = {
  href: string;
  label: string;
  comingSoon?: boolean; // support comingSoon di level atas juga kalau perlu
};

type NavLink = SimpleLink | NavGroup;

// Navigation links array to be used in both desktop and mobile menus
export const navigationLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    label: "Tentang Sekolah Kami",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/profile",
        label: "Profile Sekolah",

        description: "Lebih tahu tentang sekolah kami",
      },
      {
        href: "/profile",
        label: "Visi Misi",
        description: "Liat Visi dan Misi sekolah kami",
      },
      {
        href: "https://spmb.id/",
        label: "PPDB Online",
        blank: true,
        description: "Daftarkan anak anda di sekolah kami",
      },
    ],
  },
  {
    label: "Informasi Sekolah",
    submenu: true,
    type: "icon",
    items: [
      {
        href: "/articles",
        label: "Berita & Artikel",
        icon: "BookOpenIcon",
      },
      {
        href: "/daftar-guru",
        label: "Daftar Guru",
        icon: "IconUsers",
      },
      {
        href: "/gallery",
        label: "Gallery",
        icon: "IconLibraryPhoto",
      },
      {
        href: "#",
        label: "Ekstrakulikuler",
        icon: "IconPlayHandball",
        comingSoon: true,
      },
    ],
  },
  {
    label: "Lainnya",
    submenu: true,
    type: "icon",
    items: [
      {
        href: "#",
        label: "Pengumuman",
        icon: "InfoIcon",
        comingSoon: true, // contoh
      },
    ],
  },
];
