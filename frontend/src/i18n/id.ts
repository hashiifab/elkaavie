export const id = {
  paymentGuide: {
    navigation: {
      paymentGuide: 'Panduan Pembayaran'
    },
    uploadForm: {
      title: 'Unggah Bukti Pembayaran',
      description: 'Unggah gambar yang jelas dari bukti pembayaran Anda',
      dragDrop: {
        title: 'Klik untuk mengunggah atau seret & lepas',
        format: 'JPG atau PNG (Maks 2MB)'
      },
      fileInfo: {
        size: 'MB'
      },
      uploading: 'Mengunggah...',
      important: {
        title: 'Penting',
        message: 'Pastikan detail pembayaran (ID transaksi, jumlah, tanggal) terlihat jelas pada gambar.'
      },
      buttons: {
        cancel: 'Batal',
        uploading: 'Mengunggah...',
        send: 'Kirim Bukti Pembayaran'
      }
    },
    guide: {
      title: 'Panduan Pembayaran',
      description: 'Ikuti langkah-langkah ini untuk menyelesaikan pembayaran Anda',
      bankAccount: {
        title: 'Detail Rekening Bank',
        bankName: 'Bank Central Asia (BCA)',
        accountNumber: '1234567890',
        accountName: 'Elkaavie Residence',
        copy: 'Salin',
        copied: 'Tersalin!',
      },
      steps: {
        transfer: {
          title: 'Transfer Pembayaran',
          description: 'Transfer jumlah pembayaran ke rekening bank kami'
        },
        screenshot: {
          title: 'Ambil Screenshot',
          description: 'Ambil tangkapan layar dari konfirmasi pembayaran Anda'
        },
        upload: {
          title: 'Unggah Bukti',
          description: 'Unggah bukti pembayaran Anda melalui formulir'
        },
        notify: {
          title: 'Kirim Notifikasi',
          description: 'Beritahu admin tentang pembayaran Anda'
        },
        wait: {
          title: 'Tunggu Verifikasi',
          description: 'Admin akan memverifikasi pembayaran Anda dalam 24 jam'
        }
      },
      support: 'Untuk bantuan, silakan hubungi dukungan kami.'
    },
    notifications: {
      authRequired: {
        title: 'Autentikasi diperlukan',
        message: 'Silakan masuk untuk mengunggah bukti pembayaran'
      },
      fileTooLarge: {
        title: 'File terlalu besar',
        message: 'Silakan pilih file yang lebih kecil dari 2MB'
      },
      invalidFileType: {
        title: 'Jenis file tidak valid',
        message: 'Silakan pilih file gambar (JPEG, PNG)'
      },
      uploadSuccess: {
        title: 'Bukti pembayaran diunggah',
        message: 'Admin akan memverifikasi pembayaran Anda dalam 24 jam.'
      },
      uploadFailed: {
        title: 'Gagal mengunggah',
        message: 'Gagal mengunggah bukti pembayaran. Silakan coba lagi.'
      },
      notificationFailed: {
        title: 'Notifikasi gagal',
        message: 'Gagal mengirim notifikasi WhatsApp. Silakan hubungi dukungan.'
      },
      verificationPending: {
        title: 'Verifikasi Pembayaran Dalam Proses',
        message: 'Bukti pembayaran Anda telah diunggah dan sedang menunggu verifikasi. Kami akan memberi tahu Anda setelah diverifikasi.'
      }
    }
  },
  home: {
    hero: {
      title: 'Kos Eksklusif di Jogja',
      subtitle: 'Nyaman, Tenang, dan Strategis',
      description: 'Temukan hunian kos premium dengan fasilitas lengkap, suasana tenang, dan lokasi strategis di tengah kota Jogja.',
      cta: {
        inquire: 'Pesan Sekarang',
        viewFacilities: 'Lihat Fasilitas'
      }
    },
    room: {
      available: 'Tersedia',
      title: 'Kamar Eksklusif',
      size: '3x3 meter Luas Kamar & Kamar Mandi Dalam',
      details: 'Detail Kamar',
      subtitle: 'Kamar Eksklusif dengan Fasilitas Lengkap',
      description: 'Nikmati kenyamanan kamar berukuran 3x3 meter dengan fasilitas premium untuk memenuhi kebutuhan Anda.',
      specifications: {
        title: 'Spesifikasi Kamar',
        size: 'Ukuran Kamar',
        sizeValue: '3 x 3 meter',
        electricity: 'Listrik',
        electricityValue: 'Token (di luar biaya sewa)',
        type: 'Tipe Kamar',
        typeValue: 'Eksklusif'
      },
      amenities: {
        title: 'Fasilitas Kamar',
        items: {
          ac: 'AC',
          bed: 'Kasur Nyaman',
          deskChair: 'Meja & Kursi',
          tv: 'TV',
          wardrobe: 'Lemari Baju',
          pillows: 'Bantal & Guling',
          window: 'Jendela'
        }
      },
      bathroom: {
        title: 'Fasilitas Kamar Mandi',
        items: {
          private: 'Kamar mandi dalam',
          toilet: 'Kloset duduk',
          shower: 'Shower'
        }
      },
      rules: {
        title: 'Peraturan Kamar',
        items: {
          maxOccupancy: 'Maksimal 1 orang/kamar',
          noUnmarried: 'Tidak menerima pasangan yang belum menikah',
          noChildren: 'Tidak boleh membawa anak',
          occupationType: 'Untuk karyawan dan mahasiswa',
          parking: 'Parkir motor & mobil tersedia',
        }
      }
    },
    facilities: {
      title: 'Fasilitas Lengkap untuk Kenyamanan Anda',
      subtitle: 'Elkaavie menyediakan berbagai fasilitas yang akan membuat penghuni merasa nyaman dan betah.',
      general: {
        title: 'Fasilitas Umum',
        subtitle: 'Dirancang untuk memenuhi kebutuhan sehari-hari Anda',
        items: {
          wifi: 'WiFi kencang',
          laundry: 'Ruang cuci',
          fridge: 'Kulkas bersama',
          security: 'Penjaga kos',
          diningRoom: 'Ruang makan',
          dryingArea: 'Ruang jemur',
          kitchen: 'Dapur bersama',
          balcony: 'Balkon',
          cctv: 'CCTV',
          clothesline: 'Jemuran pakaian'
        }
      },
      parking: {
        title: 'Fasilitas Parkir',
        items: {
          car: 'Parkir mobil',
          motorcycle: 'Parkir motor',
          bicycle: 'Parkir sepeda'
        }
      },
      rules: {
        title: 'Peraturan Kos',
        items: {
          access: 'Akses 24 jam',
          noPets: 'Dilarang membawa hewan',
          noOpposite: 'Lawan jenis dilarang masuk kamar',
          maxOccupancy: 'Maksimal 1 orang/kamar'
        }
      }
    },
    location: {
      badge: 'Lokasi',
      title: 'Lokasi Strategis di Pusat Kota',
      subtitle: 'Elkaavie berlokasi strategis di tengah kota dengan akses mudah ke berbagai fasilitas penting.',
      address: 'Mlati, Kabupaten Sleman, Jogja',
      description: 'Lokasi strategis di tengah kota dengan suasana tenang & nyaman. Dekat dengan UGM, UTY, RS Sarjito, serta berbagai fasilitas umum seperti masjid, warung makan, warmindo, toko kelontong, dan laundry.',
      nearbyPlaces: {
        title: 'Tempat Terdekat',
        seeMore: 'Lihat Lebih Banyak',
        seeLess: 'Lihat Lebih Sedikit',
        places: [
          { name: 'Sekolah Budi Utama', distance: '0.1 km', type: 'education' },
          { name: 'TVRI Yogyakarta', distance: '0.2 km', type: 'landmark' },
          { name: 'Masjid Al-Ikhlas', distance: '0.3 km', type: 'worship' },
          { name: 'Warmindo Latanza', distance: '0.4 km', type: 'restaurant' },
          { name: 'Sakinah Mart', distance: '0.5 km', type: 'store' },
          { name: 'RS Umum Sakinah Idaman', distance: '1.2 km', type: 'hospital' },
          { name: 'RS dr. Sardjito', distance: '1.5 km', type: 'hospital' },
          { name: 'Universitas Gadjah Mada', distance: '1.5 km', type: 'education' },
          { name: 'Hotel Tentrem', distance: '1.8 km', type: 'hotel' },
          { name: 'MAN 3 Sleman', distance: '2.0 km', type: 'education' },
          { name: 'Warteg Al Rizki', distance: '2.4 km', type: 'restaurant' },
          { name: 'Indomaret Godean', distance: '2.9 km', type: 'store' },
        ]
      },

      fullAddress: 'KOS EXCLUSIVE ELKAAVIE\nKutu Dukuh, Sinduadi, Mlati, Sleman Regency, Special Region of Yogyakarta 55284'
    },
    reviews: {
      title: 'Apa Kata Penghuni Kami',
      subtitle: 'Lihat ulasan dari penghuni yang telah merasakan kenyamanan tinggal di Elkaavie.',
      overallRating: 'Berdasarkan 6 review',
      categories: {
        cleanliness: 'Kebersihan',
        comfort: 'Kenyamanan',
        security: 'Keamanan',
        price: 'Harga',
        roomFacilities: 'Fasilitas Kamar',
        generalFacilities: 'Fasilitas Umum'
      },
      testimonials: {
        anonymous: {
          name: 'Anonim',
          time: '1 tahun lalu',
          comment: 'Kamarnya bersih dan fasilitas lumayan lengkap.'
        },
        sutejo: {
          name: 'Sutejo Heru',
          time: '1 tahun lalu',
          comment: 'Kosan Elkaavie sangat bagus, fasilitas seperti hotel tapi serasa di rumah.',
          ownerReply: 'Alhamdulillah, terima kasih. Semoga sukses dan bahagia selalu, Kak.'
        },
        rieqy: {
          name: 'Rieqy Muwachid Erysya',
          time: '2 tahun lalu',
          comment: 'Kamar mandinya bersih, AC masih sejuk di kamar saya.'
        }
      }
    },
    cta: {
      title: 'Tertarik Untuk Booking?',
      subtitle: 'Hunian nyaman dengan fasilitas lengkap ini bisa jadi rumah baru Anda. Hubungi kami untuk informasi ketersediaan dan pemesanan.',
      buttons: {
        inquire: 'Tanya tanya Dulu',
        whatsapp: 'Chat via WhatsApp'
      }
    }
  },
  common: {
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    success: 'Berhasil',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    view: 'Lihat',
    close: 'Tutup',
    back: 'Kembali',
    next: 'Selanjutnya',
    previous: 'Sebelumnya',
    search: 'Cari',
    filter: 'Filter',
    sort: 'Urutkan',
    clear: 'Bersihkan',
    apply: 'Terapkan',
    reset: 'Atur Ulang',
    submit: 'Kirim',
    confirm: 'Konfirmasi',
    yes: 'Ya',
    no: 'Tidak',
    or: 'atau',
    and: 'dan',
    all: 'Semua',
    none: 'Tidak Ada',
    select: 'Pilih',
    choose: 'Pilih',
    other: 'Lainnya',
    more: 'Lainnya',
    less: 'Lebih Sedikit',
    show: 'Tampilkan',
    hide: 'Sembunyikan',
    optional: 'Opsional',
    required: 'Wajib',
    loading_text: 'Mohon tunggu sementara kami memproses permintaan Anda...',
    error_text: 'Terjadi kesalahan. Silakan coba lagi.',
    success_text: 'Operasi berhasil diselesaikan.',
    no_results: 'Tidak ada hasil ditemukan',
    try_again: 'Coba Lagi',
    learn_more: 'Pelajari Lebih Lanjut',
    see_all: 'Lihat Semua',
    show_more: 'Tampilkan Lebih Banyak',
    show_less: 'Tampilkan Lebih Sedikit',
  },

  navigation: {
    home: 'Beranda',
    rooms: 'Kamar',
    gallery: 'Galeri',
    profile: 'Profil',
    settings: 'Pengaturan',
    helpCenter: 'Pusat Bantuan',
    language: 'Bahasa',
  },
  rooms: {
    title: 'Kamar Tersedia',
    book: 'Pesan Sekarang',
    details: 'Detail Kamar',
    price: 'Harga',
    perNight: 'per malam',
    facilities: 'Fasilitas',
    description: 'Deskripsi',
    availability: 'Ketersediaan',
    available: 'Tersedia',
    notAvailable: 'Tidak Tersedia',
    perMonth: 'per bulan',
    loginToBook: 'Login untuk Memesan',
    youveBooked: 'Kamar yang Sudah Anda Pesan',
    selected: 'Terpilih',
    hero: {
      title: 'Temukan Kamar Sempurna Anda',
      description: 'Kamar nyaman dan tenang di pusat kota, dekat kampus, kuliner, dan fasilitas publik—ideal untuk tempat tinggal praktis yang terasa seperti rumah sendiri.',
      features: {
        modernComfort: 'Kenyamanan Modern',
        primeLocations: 'Lokasi Strategis',
        excellentService: 'Layanan Terbaik'
      }
    },
    booking: {
      refresh: 'Segarkan Kamar',
      refreshing: 'Menyegarkan...',
      howToBook: 'Cara Memesan',
      steps: {
        step1: {
          title: 'Pilih Kamar',
          description: 'Klik pada kamar yang tersedia (hijau) dari tata letak lantai kami'
        },
        step2: {
          title: 'Tinjau Detail',
          description: 'Periksa detail kamar dan harga'
        },
        step3: {
          title: 'Selesaikan Pemesanan',
          description: 'Klik "Pesan Sekarang" untuk menyelesaikan reservasi Anda'
        }
      }
    },
    legend: {
      title: 'Ketersediaan Kamar',
      available: 'Tersedia',
      unavailable: 'Tidak Tersedia',
      booked: 'Kamar yang Sudah Anda Pesan',
      selected: 'Terpilih'
    },
    floor: {
      title: 'Lantai',
      hallway: 'Koridor',
      laundryArea: {
        title: 'Area Laundry',
        description: 'Area penjemuran dan cuci pakaian untuk penghuni'
      }
    },
    error: {
      title: 'Ups! Terjadi kesalahan',
      tryAgain: 'Coba Lagi'
    },
    alreadyBooked: {
      title: 'Kamar {number} sudah menjadi milik Anda',
      description: 'Periksa pemesanan Anda untuk detailnya'
    }
  },
  booking: {
    title: 'Detail Pemesanan',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    guests: 'Tamu',
    nights: 'Malam',
    totalPrice: 'Total Harga',
    paymentMethod: 'Metode Pembayaran',
    bookNow: 'Pesan Sekarang',
    status: {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
      canceled: 'Dibatalkan',
      completed: 'Selesai',
    },
  },
  profile: {
    title: 'Profil Saya',
    editProfile: 'Ubah Profil',
    bookingHistory: 'Riwayat Pemesanan',
    notifications: 'Notifikasi',
    changePassword: 'Ubah Kata Sandi',
  },
  settings: {
    title: 'Pengaturan',
    theme: 'Tema',
    notifications: 'Notifikasi',
    language: 'Bahasa',
    privacy: 'Privasi',
    help: 'Bantuan',
    deleteAccount: 'Hapus Akun',
    deleteAccountConfirm: {
      title: 'Hapus Akun Anda?',
      message: 'Tindakan ini tidak dapat dibatalkan. Semua data Anda termasuk pemesanan akan dihapus secara permanen.',
      confirm: 'Ya, Hapus Akun Saya',
      deleting: 'Menghapus...'
    }
  },
  footer: {
    description: 'Kos eksklusif dengan lokasi strategis di tengah kota. Nyaman, tenang, dan dekat dengan berbagai fasilitas.',
    quickLinks: 'Tautan Cepat',
    contact: 'Kontak',
    copyright: '© {year} Elkaavie. All rights reserved.',
  },
  gallery: {
    title: 'Jelajahi Tempat Menarik di Sekitar',
    description: 'Temukan situs budaya dan tempat nongkrong populer di sekitar kost Elkaavie',
    categories: {
      all: 'Semua Tempat',
      cultural: 'Wisata Budaya',
      culinary: 'Kuliner & Nongkrong'
    },
    descriptions: {
      all: 'Jelajahi situs budaya dan tempat nongkrong populer di sekitar kost Elkaavie.',
      cultural: 'Kunjungi landmark ikonik seperti Tugu Jogja, Malioboro, Keraton, dan Taman Sari - semua dalam jarak 30 menit dari Elkaavie.',
      culinary: 'Nikmati kafe dan restoran populer di dekat Elkaavie, cocok untuk belajar, bersantai, atau bertemu teman.'
    },
    viewButton: 'Lihat',
    lightbox: {
      close: 'Tutup',
      next: 'Selanjutnya',
      previous: 'Sebelumnya'
    },
    imageDescriptions: {
      luxuryBedroom: 'Kamar tidur king mewah dengan desain luas',
      modernBathroom: 'Kamar mandi modern dengan shower hujan',
      cozyLivingArea: 'Ruang tamu yang nyaman dengan perabotan kontemporer',
      fullyEquippedKitchen: 'Dapur lengkap dengan peralatan stainless steel',
      elegantDiningArea: 'Ruang makan elegan dengan pencahayaan alami',
      modernBuilding: 'Eksterior bangunan modern dengan pintu masuk yang indah',
      deluxeRoom: 'Kamar deluxe dengan balkon dan pemandangan kota',
      swimmingPool: 'Kolam renang menyegarkan dengan kursi berjemur',
      tranquilGarden: 'Taman tenang dengan area duduk',
      premiumBedroom: 'Kamar tidur twin premium dengan area meja kerja',
      rooftopTerrace: 'Teras rooftop dengan pemandangan panorama',
      fineDining: 'Restoran mewah dengan dekorasi elegan',
      wellnessCenter: 'Pusat kebugaran dengan peralatan gym',
      breakfastBuffet: 'Sarapan prasmanan dengan pilihan segar',
      nightView: 'Pemandangan malam fasad bangunan'
    }
  },
  helpCenter: {
    hero: {
      title: 'Bagaimana Kami Dapat Membantu?',
      description: 'Temukan jawaban untuk pertanyaan umum atau hubungi tim dukungan kami',
      searchPlaceholder: 'Cari jawaban...'
    },
    popularQuestions: {
      title: 'Pertanyaan Populer',
      readMore: 'Baca selengkapnya →'
    },
    faqCategories: {
      all: 'Semua Pertanyaan',
      booking: 'Reservasi',
      payment: 'Pembayaran',
      policies: 'Kebijakan',
      facilities: 'Fasilitas',
      location: 'Lokasi'
    },
    faqSection: {
      title: 'Pertanyaan yang Sering Diajukan',
      result: 'hasil',
      results: 'hasil',
      noQuestionsFound: 'Tidak ada pertanyaan yang cocok dengan pencarian Anda',
      clearFilters: 'Hapus filter',
      wasHelpful: 'Apakah ini membantu?',
      yes: 'Ya',
      no: 'Tidak'
    },
    contactForm: {
      title: 'Masih Butuh Bantuan?',
      description: 'Isi formulir di bawah ini dan tim dukungan kami akan menghubungi Anda dalam waktu 24 jam.',
      fullName: 'Nama Lengkap',
      fullNamePlaceholder: 'Nama lengkap Anda',
      whatsappNumber: 'Nomor WhatsApp',
      whatsappNumberPlaceholder: 'mis., 081234567890',
      subject: 'Subjek',
      subjectPlaceholder: 'Pilih topik',
      message: 'Pesan',
      messagePlaceholder: 'Jelaskan pertanyaan Anda secara detail...',
      sendMessage: 'Kirim Pesan',
      sending: 'Mengirim...',
      successMessage: 'Terima kasih! Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda.',
      topics: {
        bookingInquiry: 'Pertanyaan Pemesanan',
        cancellation: 'Pembatalan',
        paymentIssue: 'Masalah Pembayaran',
        feedback: 'Umpan Balik',
        other: 'Lainnya'
      }
    },
    otherContact: {
      title: 'Cara Lain untuk Menghubungi Kami',
      email: 'Email',
      emailAddress: 'dbayuaji@gmail.com',
      phone: 'Telepon',
      phoneNumber: '+62 817-9370-631',
      visit: 'Kunjungi Kami',
      address: 'Mlati, Kabupaten Sleman, Jogja'
    },
    faqs: {
      reservation: {
        question: 'Bagaimana cara melakukan pemesanan?',
        answer: 'Anda dapat melakukan pemesanan dengan menelusuri kamar yang tersedia, memilih tanggal yang diinginkan, dan mengisi formulir pemesanan. Pembayaran dapat dilakukan melalui sistem pembayaran aman kami. Setelah pemesanan Anda dikonfirmasi, Anda akan menerima email konfirmasi dengan semua detail.'
      },
      checkInOut: {
        question: 'Berapa waktu check-in dan check-out?',
        answer: 'Waktu check-in adalah pukul 14:00, dan waktu check-out adalah pukul 12:00. Jika Anda memerlukan check-in lebih awal atau check-out lebih lambat, silakan hubungi kami sebelumnya, dan kami akan berusaha sebaik mungkin untuk mengakomodasi permintaan Anda, tergantung ketersediaan.'
      },
      cancellation: {
        question: 'Apakah ada biaya pembatalan?',
        answer: 'Pembatalan yang dilakukan setidaknya 48 jam sebelum tanggal check-in akan mendapatkan pengembalian dana penuh. Pembatalan yang dilakukan dalam waktu 48 jam dari check-in akan dikenakan biaya setara dengan satu malam menginap. No-show akan dikenakan biaya penuh dari reservasi.'
      },
      airport: {
        question: 'Apakah Anda menyediakan layanan antar-jemput bandara?',
        answer: 'Ya, kami menawarkan layanan antar-jemput bandara dengan biaya tambahan. Silakan hubungi kami setidaknya 24 jam sebelum kedatangan Anda untuk mengatur layanan ini. Pengemudi kami akan menjemput Anda di terminal kedatangan dengan papan nama.'
      },
      wifi: {
        question: 'Apakah Wi-Fi tersedia?',
        answer: 'Ya, Wi-Fi kecepatan tinggi tersedia gratis di seluruh properti untuk semua tamu kami. Nama jaringan dan kata sandi akan diberikan saat check-in.'
      },
      pets: {
        question: 'Apakah hewan peliharaan diperbolehkan?',
        answer: 'Kami memiliki beberapa kamar yang ramah hewan peliharaan. Harap beri tahu kami sebelumnya jika Anda akan membawa hewan peliharaan, karena biaya tambahan dan pembatasan mungkin berlaku. Hewan peliharaan harus diikat di area umum.'
      },
      payment: {
        question: 'Metode pembayaran apa yang Anda terima?',
        answer: 'Kami menerima semua kartu kredit utama (Visa, MasterCard, American Express), kartu debit, dan transfer bank. Pembayaran tunai diterima saat check-in untuk layanan tambahan.'
      },
      breakfast: {
        question: 'Apakah sarapan termasuk dalam tarif kamar?',
        answer: 'Sarapan termasuk dalam sebagian besar paket kamar kami. Silakan periksa detail pemesanan spesifik Anda untuk mengonfirmasi apakah sarapan termasuk dalam reservasi Anda. Sarapan prasmanan kami disajikan dari pukul 06:30 hingga 10:30 setiap hari.'
      },
      cityCenter: {
        question: 'Berapa jauh properti dari pusat kota?',
        answer: 'Properti kami terletak strategis hanya 2 kilometer dari pusat kota. Dibutuhkan sekitar 10 menit dengan mobil atau 20 menit dengan transportasi umum untuk mencapai sebagian besar atraksi kota.'
      },
      parking: {
        question: 'Apakah Anda menyediakan fasilitas parkir?',
        answer: 'Ya, kami menyediakan parkir gratis untuk tamu kami. Area parkir aman kami tersedia 24/7 dan dipantau oleh kamera CCTV.'
      },
      roomView: {
        question: 'Bisakah saya meminta kamar dengan pemandangan tertentu?',
        answer: 'Ya, Anda dapat meminta kamar dengan pemandangan tertentu (kota, taman, atau kolam renang) saat pemesanan. Meskipun kami berusaha sebaik mungkin untuk mengakomodasi semua permintaan, mereka tergantung pada ketersediaan dan tidak dapat dijamin.'
      },
      deposit: {
        question: 'Apakah ada deposit yang diperlukan saat pemesanan?',
        answer: 'Ya, deposit setara dengan satu malam menginap diperlukan untuk mengamankan pemesanan Anda. Jumlah ini akan dikurangkan dari tagihan akhir Anda saat check-out.'
      }
    }
  },
  auth: {
    login: {
      title: 'Selamat Datang Kembali',
      subtitle: 'Masuk ke akun Anda untuk melanjutkan',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'Masukkan email Anda',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: 'Masukkan kata sandi Anda',
      forgotPassword: 'Lupa kata sandi?',
      googleContinue: 'Lanjutkan dengan Google',
      signIn: 'Masuk',
      signingIn: 'Sedang masuk...',
      loginToCompleteBooking: 'Masuk untuk Menyelesaikan Pemesanan',
      noAccount: 'Belum punya akun?',
      signUp: 'Daftar',
      pendingBooking: {
        title: 'Pemesanan Tertunda',
        description: 'Silakan masuk untuk menyelesaikan reservasi Anda',
        room: 'Kamar',
        floor: 'Lantai'
      },
      errors: {
        title: 'Gagal Masuk',
        emailPasswordRequired: 'Silakan masukkan email dan kata sandi',
        invalidCredentials: 'Email atau kata sandi salah. Silakan periksa kredensial Anda dan coba lagi.',
        generalError: 'Gagal masuk. Silakan coba lagi.',
        googleLoginFailed: 'Login Google gagal. Silakan coba lagi.'
      },
      verification: {
        resend: 'Kirim ulang email verifikasi',
        sending: 'Mengirim...',
        success: 'Email verifikasi berhasil dikirim. Silakan periksa kotak masuk Anda.'
      }
    },
    register: {
      title: 'Buat Akun',
      subtitle: 'Bergabunglah dengan kami untuk memulai perjalanan Anda',
      fullNameLabel: 'Nama Lengkap',
      fullNamePlaceholder: 'Masukkan nama lengkap Anda',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'Masukkan email Anda',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: 'Buat kata sandi',
      confirmPasswordLabel: 'Konfirmasi Kata Sandi',
      confirmPasswordPlaceholder: 'Konfirmasi kata sandi Anda',
      createAccount: 'Buat Akun',
      creatingAccount: 'Membuat akun...',
      haveAccount: 'Sudah punya akun?',
      signIn: 'Masuk',
      success: {
        title: 'Pendaftaran Berhasil!',
        subtitle: 'Silakan periksa email Anda untuk verifikasi',
        message: 'Kami telah mengirimkan email verifikasi ke {email}. Silakan periksa kotak masuk Anda dan klik tautan verifikasi untuk mengaktifkan akun Anda.',
        noEmail: 'Tidak menerima email?',
        tryLogin: 'Coba masuk'
      }
    },
    forgotPassword: {
      title: 'Lupa Kata Sandi',
      subtitle: 'Masukkan email Anda untuk mengatur ulang kata sandi',
      emailLabel: 'Alamat Email',
      emailPlaceholder: 'Masukkan email Anda',
      sendButton: 'Kirim Tautan Reset',
      sending: 'Mengirim...',
      rememberPassword: 'Ingat kata sandi Anda?',
      signIn: 'Masuk',
      errors: {
        title: 'Kesalahan',
        generalError: 'Gagal mengirim tautan reset. Silakan coba lagi.'
      },
      success: {
        title: 'Berhasil',
        message: 'Tautan reset kata sandi telah dikirim ke alamat email Anda.'
      }
    },
    roomBooking: {
      navigation: {
        backToRoomSelection: 'Kembali ke Pemilihan Kamar',
        backToRooms: 'Kembali ke Kamar',
        viewMyBookings: 'Lihat Pemesanan Saya',
        returnToHome: 'Kembali ke Beranda'
      },
      pageTitle: 'Selesaikan Pemesanan Anda',
      errors: {
        noRoomSelected: 'Tidak ada kamar yang dipilih. Silakan pilih kamar terlebih dahulu.',
        roomUnavailable: 'Kamar ini tidak tersedia lagi. Silakan pilih kamar lain.',
        bookingFailed: 'Gagal memproses pemesanan Anda. Silakan coba lagi nanti.',
        errorTitle: 'Ups! Terjadi kesalahan',
        fileTypeError: 'Silakan unggah file gambar',
        fileSizeError: 'Ukuran file harus kurang dari 2MB',
        identityCardRequired: 'Kartu identitas diperlukan. Silakan unggah KTP Anda.'
      },
      loading: {
        processing: 'Memproses...'
      },
      success: {
        title: 'Pemesanan Diajukan untuk Persetujuan',
        message: 'Permintaan pemesanan Anda telah diajukan dan menunggu persetujuan admin. Kami akan meninjau aplikasi Anda dan segera menghubungi Anda dengan hasilnya.'
      },
      form: {
        bookingDetails: 'Detail Pemesanan',
        checkInDate: 'Tanggal Check-in',
        checkOutDate: 'Tanggal Check-out',
        durationMonths: 'Durasi (Bulan)',
        month: 'Bulan',
        months: 'Bulan',
        numberOfGuests: 'Jumlah Tamu',
        guest: 'Tamu',
        guests: 'Tamu',
        guestLimitMessage: 'Maksimal 1 orang per kamar. Untuk penambahan penghuni, silakan hubungi admin terlebih dahulu.',
        phoneNumber: 'Nomor Telepon',
        phoneNumberPlaceholder: 'Masukkan nomor telepon Anda',
        identityCard: 'Kartu Identitas',
        uploadTitle: 'Klik untuk mengunggah atau seret & lepas',
        uploadFormat: 'JPG atau PNG (Maks 2MB)',
        uploadInfo: 'Unggah foto jelas kartu identitas Anda (KTP/SIM/Paspor)',
        specialRequests: 'Permintaan Khusus',
        specialRequestsPlaceholder: 'Beri tahu kami jika Anda memiliki permintaan atau kebutuhan khusus',
        paymentMethod: 'Metode Pembayaran',
        creditCard: 'Kartu Kredit (Pembayaran di hotel)',
        bankTransfer: 'Transfer Bank',
        submitButton: 'Ajukan untuk Persetujuan'
      },
      summary: {
        title: 'Ringkasan Pemesanan',
        room: 'Kamar',
        floor: 'Lantai',
        maxCapacity: 'Kapasitas maksimal',
        month: 'Bulan',
        months: 'Bulan',
        monthlyRate: 'Tarif Bulanan',
        numberOfMonths: 'Jumlah Bulan',
        extraGuests: 'Tamu Tambahan',
        total: 'Total',
        taxesIncluded: 'Pajak dan biaya layanan sudah termasuk',
        cancellationPolicy: 'Kebijakan Pembatalan',
        cancellationInfo: 'Pembatalan gratis hingga 24 jam sebelum check-in. Pembatalan setelah waktu ini mungkin dikenakan biaya.'
      }
    },
    profile: {
      navigation: {
        profile: 'Profil',
        backToHome: 'Kembali ke Beranda'
      },
      actions: {
        refreshData: 'Segarkan Data',
        refreshing: 'Menyegarkan...',
        editProfile: 'Edit Profil',
        viewDetails: 'Lihat Detail',
        continuePayment: 'Lanjutkan Pembayaran',
        browseRooms: 'Jelajahi Kamar'
      },
      userInfo: {
        email: 'Email',
        memberSince: 'Anggota Sejak',
        guest: 'Tamu'
      },
      bookings: {
        title: 'Pemesanan Saya',
        filters: {
          all: 'Semua',
          pending: 'Tertunda',
          approved: 'Disetujui',
          rejected: 'Ditolak',
          cancelled: 'Dibatalkan',
          completed: 'Selesai'
        },
        details: {
          bookingId: 'ID Pemesanan',
          checkInOut: 'Check-in / Check-out',
          roomDetails: 'Detail Kamar',
          guests: 'Tamu',
          guest: 'Tamu',
          bookedOn: 'Dipesan Pada',
          specialRequests: 'Permintaan Khusus',
          total: 'Total',
          paymentDueIn: 'Pembayaran jatuh tempo dalam',
          paymentDeadlineExpired: 'Batas waktu pembayaran telah berakhir'
        },
        empty: {
          title: 'Tidak Ada Pemesanan Ditemukan',
          noBookingsYet: 'Anda belum melakukan pemesanan. Mulai jelajahi kamar kami dan pesan penginapan Anda.',
          noFilteredBookings: 'Anda tidak memiliki pemesanan {status}.'
        }
      },
      errors: {
        title: 'Ups! Terjadi kesalahan',
        failedToLoad: 'Gagal memuat informasi profil Anda.'
      }
    },
    bookingDetails: {
      navigation: {
        bookingDetails: 'Detail Pemesanan',
        backToProfile: 'Kembali ke Profil'
      },
      errors: {
        title: 'Ups! Terjadi kesalahan',
        failedToLoad: 'Gagal memuat detail pemesanan.',
        bookingNotFound: 'Pemesanan tidak ditemukan'
      },
      status: {
        pending: 'Tertunda',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        cancelled: 'Dibatalkan',
        completed: 'Selesai',
        paid: 'Dibayar'
      },
      details: {
        bookingId: 'ID Pemesanan',
        checkInOut: 'Check-in / Check-out',
        roomDetails: 'Detail Kamar',
        room: 'Kamar',
        floor: 'Lantai',
        guests: 'Tamu',
        guest: 'Tamu',
        bookedOn: 'Dipesan Pada',
        specialRequests: 'Permintaan Khusus',
        total: 'Total',
        month: 'Bulan',
        months: 'Bulan'
      },
      actions: {
        continuePayment: 'Lanjutkan Pembayaran',
        submitNewBooking: 'Ajukan Pemesanan Baru'
      },
      statusMessages: {
        pending: {
          title: 'Hubungi Admin',
          message: 'Pemesanan Anda sedang menunggu persetujuan. Silakan hubungi admin kami di {phone} untuk mempercepat proses.'
        },
        approved: {
          title: 'Pembayaran Diperlukan',
          message: 'Pemesanan Anda telah disetujui. Silakan selesaikan pembayaran untuk mengonfirmasi reservasi Anda.'
        },
        paid: {
          title: 'Pembayaran Terverifikasi',
          message: 'Pembayaran Anda telah diverifikasi. Anda sekarang dapat melanjutkan check-in pada {date}. Harap bawa kartu identitas dan bukti pembayaran untuk verifikasi.'
        },
        rejected: {
          title: 'Pemesanan Ditolak',
          message: 'Pemesanan Anda telah ditolak. Anda dapat mengajukan permintaan pemesanan baru atau menghubungi admin kami untuk bantuan.'
        },
        cancelled: {
          title: 'Pemesanan Dibatalkan',
          message: 'Pemesanan Anda telah dibatalkan. Anda dapat mengajukan permintaan pemesanan baru atau menghubungi admin kami untuk bantuan.'
        },
        completed: {
          title: 'Pemesanan Selesai',
          message: 'Masa menginap Anda telah selesai. Terima kasih telah memilih layanan kami!'
        }
      }
    }
  }
}