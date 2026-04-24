#!/usr/bin/env node
// Bijaksana — Quote seed data + cleaning pipeline
// Scraped from JagoKata.com, cleaned and normalized

const RAW_QUOTES = [
  // === TOP POPULAR ===
  { q: "Aku sudah pernah merasakan semua kepahitan dalam hidup dan yang paling pahit ialah berharap kepada manusia.", a: "Ali bin Abi Thalib", c: "kehidupan" },
  { q: "Janganlah engkau mengucapkan perkataan yang engkau sendiri tak suka mendengarnya jika orang lain mengucapkannya kepadamu.", a: "Ali bin Abi Thalib", c: "nasihat" },
  { q: "Kesabaran itu ada dua macam: sabar atas sesuatu yang tidak kau ingin dan sabar menahan diri dari sesuatu yang kau ingini.", a: "Ali bin Abi Thalib", c: "kesabaran" },
  { q: "Cinta itu perang, yakni perang yang hebat dalam rohani manusia.", a: "Buya Hamka", c: "cinta" },
  { q: "Cinta selalu saja misterius. Jangan diburu-buru, atau kau akan merusak jalan ceritanya sendiri.", a: "Tere Liye", c: "cinta" },
  { q: "Jangan menjelaskan tentang dirimu kepada siapapun, karena yang menyukaimu tidak butuh itu.", a: "Ali bin Abi Thalib", c: "nasihat" },
  { q: "Jadilah kamu manusia yang pada kelahiranmu semua orang tertawa bahagia, tetapi hanya kamu sendiri yang menangis.", a: "Mahatma Gandhi", c: "kehidupan" },
  { q: "Cinta adalah perbuatan. Kata-kata dan tulisan indah adalah omong kosong.", a: "Tere Liye", c: "cinta" },
  { q: "Daun yang jatuh tak pernah membenci angin. Dia membiarkan dirinya jatuh begitu saja.", a: "Tere Liye", c: "keikhlasan" },
  { q: "Bukankah hidup ini sebetulnya mudah? Jika rindu, datangi. Jika tidak senang, ungkapkan.", a: "Fiersa Besari", c: "kehidupan" },
  { q: "Jika saatnya tiba, sedih akan menjadi tawa, perih akan menjadi cerita, kenangan akan menjadi guru.", a: "Fiersa Besari", c: "kehidupan" },
  { q: "Bersabar dan diam lebih baik. Jika memang jodoh akan terbuka sendiri jalan terbaiknya.", a: "Tere Liye", c: "kesabaran" },
  { q: "Berusahalah untuk tidak menjadi manusia yang berhasil tapi berusahalah menjadi manusia yang berguna.", a: "Albert Einstein", c: "sukses" },
  { q: "Hanya karena seseorang itu sabar tingkat langit, maka bukan berarti dia lantas bisa disakiti, diinjak begitu saja.", a: "Tere Liye", c: "kesabaran" },
  { q: "Pengecut terbesar adalah pria yang membangunkan cinta seorang wanita tanpa bermaksud untuk balas mencintainya.", a: "Bob Marley", c: "cinta" },
  { q: "Meskipun aku diam tenang bagai ikan, tapi aku gelisah pula bagai ombak dalam lautan.", a: "Jalaluddin Rumi", c: "kehidupan" },
  { q: "Belajar tanpa berpikir itu tidaklah berguna, tapi berpikir tanpa belajar itu sangatlah berbahaya!", a: "Soekarno", c: "pendidikan" },
  { q: "Ketahuilah bahwa sabar, jika dipandang dalam permasalahan seseorang adalah ibarat kepala dari suatu tubuh.", a: "Ali bin Abi Thalib", c: "kesabaran" },
  { q: "Beberapa rindu memang harus sembunyi-sembunyi. Bukan untuk disampaikan, hanya untuk dikirimkan lewat doa.", a: "Fiersa Besari", c: "rindu" },

  // === CINTA ===
  { q: "Bagaimana mungkin engkau menjelaskan fenomena biologis yang sedemikian penting seperti cinta pertama dalam pengertian kimia dan fisika?", a: "Albert Einstein", c: "cinta" },
  { q: "Cinta adalah keinginan tak tertahankan untuk tertahankan yang diinginkan.", a: "Robert Frost", c: "cinta" },
  { q: "Ketika Anda jatuh cinta, kebahagiaan akan membuat Anda sulit tertidur karena kenyataan lebih baik dibandingkan mimpi Anda.", a: "Dr. Seuss", c: "cinta" },
  { q: "Cinta itu ga pake itung-itungan. Kalo udah mulai mikir pengorbanan itu namanya kalkulasi.", a: "Sujiwo Tejo", c: "cinta" },
  { q: "Lepaskanlah. Maka esok lusa, jika dia adalah cinta sejatimu, dia pasti akan kembali.", a: "Tere Liye", c: "cinta" },
  { q: "Cinta adalah sabar. Orang-orang yang sabar akan memperoleh cinta yang istimewa.", a: "Tere Liye", c: "cinta" },
  { q: "Cinta itu tidak selalu melekat pada kebersamaan, tapi melekat pada doa-doa yang disebutkan dalam senyap.", a: "Tere Liye", c: "cinta" },
  { q: "Cinta bukan mengajar kita lemah, tetapi membangkitkan kekuatan.", a: "Buya Hamka", c: "cinta" },
  { q: "Cinta datang dari mata ke hati. Selanjutnya dari hati ke air mata.", a: "Raditya Dika", c: "cinta" },
  { q: "Tidak menahanmu pergi bukan berarti tidak cinta lagi. Hanya saja terkadang lebih baik melepaskan.", a: "Boy Candra", c: "cinta" },
  { q: "Cinta bukan melepas tapi merelakan. Bukan memaksa tapi memperjuangkan.", a: "Fiersa Besari", c: "cinta" },
  { q: "Cinta tidak berupa tatapan satu sama lain, tetapi memandang keluar bersama ke arah yang sama.", a: "Bacharuddin Jusuf Habibie", c: "cinta" },
  { q: "Cinta adalah satu-satunya kebebasan di dunia karena ia begitu tinggi mengangkat jiwa.", a: "Khalil Gibran", c: "cinta" },
  { q: "Orang yang suka berkata jujur mendapatkan tiga hal: kepercayaan, cinta dan rasa hormat.", a: "Ali bin Abi Thalib", c: "kejujuran" },
  { q: "Barangkali Tuhan sedang tidak ingin kamu jatuh cinta. Agar kamu bisa mencintai dirimu lebih lama.", a: "Boy Candra", c: "cinta" },
  { q: "Cinta mengubah kekasaran menjadi kelembutan, mengubah orang tak berpendirian menjadi teguh berpendirian.", a: "Jalaluddin Rumi", c: "cinta" },

  // === KEHIDUPAN ===
  { q: "Hidup ini tidak seperti novel, yang kita bisa mengulang halaman pertama kapanpun kita mau.", a: "Tere Liye", c: "kehidupan" },
  { q: "Kepedulian kita hari ini akan memberikan perbedaan berarti pada masa depan.", a: "Tere Liye", c: "kehidupan" },
  { q: "Kesedihan adalah bab penting dalam buku kehidupan yang tidak mau dibaca oleh banyak orang.", a: "Gede Prama", c: "kehidupan" },
  { q: "Kehidupan itu laksana lautan. Orang yang tiada berhati-hati dalam mengayuh perahu, maka karamlah ia.", a: "Buya Hamka", c: "kehidupan" },
  { q: "Dan alangkah indah kehidupan tanpa merangkak-rangkak di hadapan orang lain.", a: "Pramoedya Ananta Toer", c: "kehidupan" },
  { q: "Tiada awan di langit yang tetap selamanya. Tiada mungkin akan terus-menerus terang cuaca.", a: "Raden Adjeng Kartini", c: "kehidupan" },
  { q: "Beri nilai dari usahanya jangan dari hasilnya. Baru kita bisa mengerti kehidupan.", a: "Albert Einstein", c: "kehidupan" },
  { q: "Dunia itu seluas langkah kaki. Jelajahilah dan jangan pernah takut melangkah.", a: "Soe Hok Gie", c: "keberanian" },
  { q: "Kehidupan ini seimbang, Tuan. Barangsiapa hanya memandang pada keceriannya saja, dia orang gila.", a: "Pramoedya Ananta Toer", c: "kehidupan" },
  { q: "Bukankah kehidupan sendiri adalah bahagia dan sedih? Bahagia karena napas mengalir dan jantung berdetak.", a: "W.S. Rendra", c: "kehidupan" },
  { q: "Kehidupan yang baik adalah sebuah proses, bukan suatu keadaan yang ada dengan sendirinya.", a: "Carl Rogers", c: "kehidupan" },
  { q: "Berterimakasihlah pada segala yang memberi kehidupan.", a: "Pramoedya Ananta Toer", c: "kehidupan" },
  { q: "Tetap sabar, semangat, dan tersenyum. Karena kamu sedang menimba ilmu di Universitas Kehidupan.", a: "Dahlan Iskan", c: "motivasi" },
  { q: "Kehidupan adalah perubahan yang alami dan spontan. Jangan menolaknya, karena akan menimbulkan kesedihan.", a: "Lao-Zu", c: "kehidupan" },
  { q: "Hakikat hidup bukanlah apa yang kita ketahui, bukan buku-buku yang kita baca atau kalimat-kalimat yang kita pidatokan.", a: "Emha Ainun Nadjib", c: "kehidupan" },
  { q: "Anak kalian bukanlah anak kalian. Mereka putra-putri kehidupan yang merindu pada dirinya sendiri.", a: "Khalil Gibran", c: "keluarga" },

  // === MOTIVASI ===
  { q: "Rahasia kedisiplinan adalah motivasi. Ketika seseorang telah termotivasi cukup, kedisiplinan akan datang.", a: "Tung Desem Waringin", c: "motivasi" },
  { q: "Kejujuran adalah batu penjuru dari segala kesuksesan, pengakuan adalah motivasi terkuat.", a: "Mary Kay Ash", c: "motivasi" },
  { q: "Kondisi kepepet adalah motivasi terbesar di dunia!", a: "Jaya Setiabudi", c: "motivasi" },
  { q: "Kemampuan adalah apa yang mampu Anda lakukan. Motivasi menentukan apa yang Anda lakukan.", a: "Lou Holtz", c: "motivasi" },
  { q: "Motivasi adalah sesuatu yang membuat Anda mulai melangkah. Kebiasaan adalah yang membuat Anda tetap melangkah.", a: "Tung Desem Waringin", c: "motivasi" },
  { q: "Motivasi seperti makanan bergizi! Dengan lauk disiplin, kerja keras, mental akan menjadi sehat dan berkualitas.", a: "Andrie Wongso", c: "motivasi" },

  // === PERSAHABATAN ===
  { q: "Bukan karena kurangnya cinta, tapi kurangnya persahabatan yang membuat pernikahan tidak bahagia.", a: "Friedrich Nietzsche", c: "persahabatan" },
  { q: "Persahabatan meningkatkan kebahagiaan, dan mengurangi kesengsaraan, dengan menggandakan kesenangan kita, dan membagi kesedihan kita.", a: "Joseph Addison", c: "persahabatan" },
  { q: "Dan bukankah harta yang paling tak ternilai adalah persahabatan?", a: "Fiersa Besari", c: "persahabatan" },
  { q: "Keindahan persahabatan adalah bahwa kamu tahu kepada siapa kamu dapat mempercayakan rahasia.", a: "Albert Einstein", c: "persahabatan" },
  { q: "Persahabatan adalah satu pikiran dalam dua tubuh.", a: "Mencius", c: "persahabatan" },
  { q: "Persahabatan itu tidak terbuat dari sesuatu yang besar. Melainkan dari hal-hal kecil yang menjadi besar.", a: "Tere Liye", c: "persahabatan" },
  { q: "Ingin menjadi teman adalah pekerjaan cepat, tetapi persahabatan merupakan pematangan buah yang lambat.", a: "Aristoteles", c: "persahabatan" },
  { q: "Persahabatan lebih kuat daripada panasnya permusuhan.", a: "Pramoedya Ananta Toer", c: "persahabatan" },
  { q: "Persahabatan sering berakhir dengan cinta, tetapi cinta kadang berakhir bukan dengan persahabatan.", a: "Bacharuddin Jusuf Habibie", c: "persahabatan" },
  { q: "Minta maaf tidak selalu berarti kita salah. Itu bisa berarti kita lebih menghargai persahabatan di atas ego.", a: "Merry Riana", c: "persahabatan" },

  // === KEBERANIAN ===
  { q: "Jarang orang mau mengakui, kesederhanaan adalah kekayaan yang terbesar di dunia ini: suatu karunia alam. Dan yang terpenting diatas segala-galanya ialah keberaniannya.", a: "Pramoedya Ananta Toer", c: "keberanian" },
  { q: "Kegagalan bukanlah sesuatu yang penting. Perlu keberanian untuk melakukan kebodohan pada diri sendiri.", a: "Charlie Chaplin", c: "keberanian" },
  { q: "Kesadaran adalah matahari, Kesabaran adalah bumi, Keberanian menjadi cakrawala, dan Perjuangan adalah pelaksanaan kata-kata.", a: "W.S. Rendra", c: "keberanian" },
  { q: "Berani menegakkan keadilan, walaupun mengenai diri sendiri, adalah puncak segala keberanian.", a: "Buya Hamka", c: "keberanian" },
  { q: "Kalau mati, dengan berani; kalau hidup, dengan berani. Kalau keberanian tidak ada, itulah sebabnya setiap bangsa asing bisa jajah kita.", a: "Pramoedya Ananta Toer", c: "keberanian" },
  { q: "Tidak adanya tindakan melahirkan keraguan dan ketakutan. Tindakan melahirkan keyakinan dan keberanian.", a: "Dale Carnegie", c: "keberanian" },
  { q: "Saya belajar bahwa keberanian tidak akan pernah absen dari ketakutan. Tetapi mereka berhasil menang atas itu.", a: "Nelson Mandela", c: "keberanian" },
  { q: "Keberanian seseorang sesuai dengan kadar penolakannya terhadap perbuatan jahat.", a: "Ali bin Abi Thalib", c: "keberanian" },
  { q: "Anda tidak dapat menyeberangi lautan sampai Anda mempunyai keberanian untuk melupakan pantai.", a: "Andre Gide", c: "keberanian" },
  { q: "Hidup adalah keberanian menghadapi tanda tanya.", a: "Soe Hok Gie", c: "keberanian" },
  { q: "Saat ketidakadilan merajalela, keberanian menjadi berkah bagi semesta.", a: "Najwa Shihab", c: "keberanian" },
  { q: "Kekuatan dan kepintaran adalah modal. Tapi tidak ada yang lebih dahsyat dari keberanian dan ketekunan.", a: "Merry Riana", c: "keberanian" },

  // === EXTRA HIGH-VALUE QUOTES ===
  { q: "Bangsa yang besar adalah bangsa yang menghormati jasa pahlawannya.", a: "Soekarno", c: "kehidupan" },
  { q: "Gantungkan cita-citamu setinggi langit! Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.", a: "Soekarno", c: "mimpi" },
  { q: "Perjuanganku lebih mudah karena mengusir penjajah, tapi perjuanganmu akan lebih sulit karena melawan bangsamu sendiri.", a: "Soekarno", c: "perjuangan" },
  { q: "Setiap orang boleh bercita-cita, tapi tidak semua orang bisa merealisasikan cita-citanya.", a: "Soekarno", c: "mimpi" },
  { q: "Habis gelap terbitlah terang.", a: "Raden Adjeng Kartini", c: "harapan" },
  { q: "Kita minta hak kita, hak atas pendidikan dan ilmu pengetahuan yang seluas-luasnya.", a: "Raden Adjeng Kartini", c: "pendidikan" },
  { q: "Jangan pernah menyerah ketika kamu masih mampu berusaha lagi. Tidak ada kata berakhir sampai kamu berhenti mencoba.", a: "Brian Dyson", c: "motivasi" },
  { q: "Hiduplah seolah-olah kamu akan mati besok. Belajarlah seolah-olah kamu akan hidup selamanya.", a: "Mahatma Gandhi", c: "pendidikan" },
  { q: "Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan, Anda dapat mengubah dunia.", a: "Nelson Mandela", c: "pendidikan" },
  { q: "Kamu tidak perlu menjadi hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.", a: "Zig Ziglar", c: "motivasi" },
  { q: "Jika kamu tidak bisa terbang, berlarilah. Jika tidak bisa berlari, berjalanlah. Jika tidak bisa berjalan, merangkaklah.", a: "Martin Luther King Jr.", c: "motivasi" },
  { q: "Sukses bukanlah kunci kebahagiaan. Kebahagiaan adalah kunci kesuksesan.", a: "Albert Schweitzer", c: "sukses" },
  { q: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah mencintai apa yang kamu lakukan.", a: "Steve Jobs", c: "sukses" },
  { q: "Waktu yang paling baik untuk menanam pohon adalah dua puluh tahun yang lalu. Waktu terbaik berikutnya adalah sekarang.", a: "Peribahasa Tiongkok", c: "waktu" },
  { q: "Di dalam kesulitan ada kemudahan.", a: "Al-Quran, QS. Al-Insyirah: 6", c: "harapan" },
  { q: "Ilmu itu lebih baik daripada harta. Ilmu menjaga engkau dan engkau menjaga harta.", a: "Ali bin Abi Thalib", c: "pendidikan" },
  { q: "Sesungguhnya sesudah kesulitan itu ada kemudahan.", a: "Al-Quran, QS. Al-Insyirah: 5", c: "harapan" },
  { q: "Orang-orang hebat di bidang apapun bukan baru bekerja karena mereka terinspirasi, namun mereka menjadi terinspirasi karena mereka lebih suka bekerja.", a: "Ernest Newman", c: "motivasi" },
  { q: "Mengetahui saja tidak cukup, kita harus menerapkan. Berkeinginan saja tidak cukup, kita harus melakukan.", a: "Johann Wolfgang von Goethe", c: "motivasi" },
  { q: "Kebahagiaan itu datangnya dari hati, bukan dari keadaan.", a: "Buya Hamka", c: "kebahagiaan" },
  { q: "Mimpi besar dimulai dari pemimpi kecil.", a: "Tan Malaka", c: "mimpi" },
  { q: "Berikan aku 1.000 orang tua, niscaya akan kucabut Semeru dari akarnya. Berikan aku 10 pemuda, niscaya akan kuguncangkan dunia.", a: "Soekarno", c: "keberanian" },
];

// ── Cleaning Pipeline ──────────────────────────────────────────

const CATEGORY_MAP = {
  'cinta': { name: 'Cinta', icon: '❤️', desc: 'Kata-kata bijak tentang cinta, kasih sayang, dan hubungan yang mendalam.' },
  'kehidupan': { name: 'Kehidupan', icon: '🌱', desc: 'Kata-kata bijak tentang makna hidup, perjalanan, dan pengalaman.' },
  'motivasi': { name: 'Motivasi', icon: '🔥', desc: 'Kata-kata motivasi untuk semangat dan inspirasi setiap hari.' },
  'kesabaran': { name: 'Kesabaran', icon: '🧘', desc: 'Kata-kata bijak tentang kesabaran, ketenangan, dan ketabahan.' },
  'keberanian': { name: 'Keberanian', icon: '⚔️', desc: 'Kata-kata bijak tentang keberanian, keteguhan, dan tekad.' },
  'persahabatan': { name: 'Persahabatan', icon: '🤝', desc: 'Kata-kata bijak tentang persahabatan, kesetiaan, dan ikatan.' },
  'pendidikan': { name: 'Pendidikan', icon: '📚', desc: 'Kata-kata bijak tentang pendidikan, ilmu pengetahuan, dan belajar.' },
  'sukses': { name: 'Sukses', icon: '🏆', desc: 'Kata-kata bijak tentang kesuksesan, pencapaian, dan kerja keras.' },
  'nasihat': { name: 'Nasihat', icon: '💡', desc: 'Kata-kata nasihat bijak untuk menjalani hidup lebih baik.' },
  'keikhlasan': { name: 'Keikhlasan', icon: '🕊️', desc: 'Kata-kata bijak tentang keikhlasan, memaafkan, dan merelakan.' },
  'rindu': { name: 'Rindu', icon: '🌙', desc: 'Kata-kata bijak tentang rindu, kerinduan, dan kenangan indah.' },
  'kejujuran': { name: 'Kejujuran', icon: '⚖️', desc: 'Kata-kata bijak tentang kejujuran, integritas, dan kebenaran.' },
  'keluarga': { name: 'Keluarga', icon: '👨‍👩‍👧‍👦', desc: 'Kata-kata bijak tentang keluarga, orang tua, dan kasih sayang.' },
  'harapan': { name: 'Harapan', icon: '🌅', desc: 'Kata-kata bijak tentang harapan, optimisme, dan masa depan.' },
  'mimpi': { name: 'Mimpi', icon: '✨', desc: 'Kata-kata bijak tentang mimpi, cita-cita, dan impian besar.' },
  'waktu': { name: 'Waktu', icon: '⏳', desc: 'Kata-kata bijak tentang waktu, kesempatan, dan perubahan.' },
  'kebahagiaan': { name: 'Kebahagiaan', icon: '😊', desc: 'Kata-kata bijak tentang kebahagiaan dan kegembiraan hidup.' },
  'perjuangan': { name: 'Perjuangan', icon: '💪', desc: 'Kata-kata bijak tentang perjuangan, semangat pantang menyerah.' },
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function cleanQuoteText(q) {
  return q
    .replace(/\u201c|\u201d|\u201e|\u201f/g, '"')  // smart quotes
    .replace(/\u2018|\u2019|\u201a|\u201b/g, "'")  // smart apostrophes
    .replace(/\u2026/g, '...')      // ellipsis
    .replace(/\u2014/g, ' -- ')     // em dash
    .replace(/\u2013/g, ' - ')      // en dash
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAuthor(name) {
  const ALIASES = {
    'buya hamka': 'Buya Hamka',
    'hamka': 'Buya Hamka',
    'prof. dr. hamka': 'Buya Hamka',
    'ali bin abi thalib': 'Ali bin Abi Thalib',
    'ali bin abu thalib': 'Ali bin Abi Thalib',
    'imam ali': 'Ali bin Abi Thalib',
    'tere liye': 'Tere Liye',
    'fiersa besari': 'Fiersa Besari',
    'ir. soekarno': 'Soekarno',
    'bung karno': 'Soekarno',
    'sukarno': 'Soekarno',
    'pramoedya ananta toer': 'Pramoedya Ananta Toer',
    'pram': 'Pramoedya Ananta Toer',
    'r.a. kartini': 'Raden Adjeng Kartini',
    'ra kartini': 'Raden Adjeng Kartini',
    'kartini': 'Raden Adjeng Kartini',
    'b.j. habibie': 'Bacharuddin Jusuf Habibie',
    'bj habibie': 'Bacharuddin Jusuf Habibie',
    'habibie': 'Bacharuddin Jusuf Habibie',
    'w.s. rendra': 'W.S. Rendra',
    'rendra': 'W.S. Rendra',
    'jalaluddin rumi': 'Jalaluddin Rumi',
    'rumi': 'Jalaluddin Rumi',
    'khalil gibran': 'Khalil Gibran',
    'kahlil gibran': 'Khalil Gibran',
    'albert einstein': 'Albert Einstein',
    'einstein': 'Albert Einstein',
    'mahatma gandhi': 'Mahatma Gandhi',
    'gandhi': 'Mahatma Gandhi',
    'nelson mandela': 'Nelson Mandela',
    'andre gide': 'Andre Gide',
    'andré gide': 'Andre Gide',
    'soe hok gie': 'Soe Hok Gie',
    'raditya dika': 'Raditya Dika',
    'boy candra': 'Boy Candra',
    'najwa shihab': 'Najwa Shihab',
    'merry riana': 'Merry Riana',
    'emha ainun nadjib': 'Emha Ainun Nadjib',
    'cak nun': 'Emha Ainun Nadjib',
    'gede prama': 'Gede Prama',
    'dahlan iskan': 'Dahlan Iskan',
    'joko widodo': 'Joko Widodo',
    'jokowi': 'Joko Widodo',
    'tan malaka': 'Tan Malaka',
    'lao-zu': 'Lao Tzu',
    'lao tzu': 'Lao Tzu',
    'laozi': 'Lao Tzu',
  };
  const key = name.toLowerCase().trim();
  return ALIASES[key] || name.trim();
}

const AUTHOR_NATIONALITIES = {
  'Ali bin Abi Thalib': 'Arab',
  'Buya Hamka': 'Indonesia',
  'Tere Liye': 'Indonesia',
  'Fiersa Besari': 'Indonesia',
  'Soekarno': 'Indonesia',
  'Pramoedya Ananta Toer': 'Indonesia',
  'Raden Adjeng Kartini': 'Indonesia',
  'Bacharuddin Jusuf Habibie': 'Indonesia',
  'W.S. Rendra': 'Indonesia',
  'Soe Hok Gie': 'Indonesia',
  'Raditya Dika': 'Indonesia',
  'Boy Candra': 'Indonesia',
  'Najwa Shihab': 'Indonesia',
  'Merry Riana': 'Indonesia',
  'Emha Ainun Nadjib': 'Indonesia',
  'Gede Prama': 'Indonesia',
  'Dahlan Iskan': 'Indonesia',
  'Sujiwo Tejo': 'Indonesia',
  'Joko Widodo': 'Indonesia',
  'Tan Malaka': 'Indonesia',
  'Andrie Wongso': 'Indonesia',
  'Andrea Hirata': 'Indonesia',
  'Chairul Tanjung': 'Indonesia',
  'Tung Desem Waringin': 'Indonesia',
  'Jaya Setiabudi': 'Indonesia',
  'Mario Teguh': 'Indonesia',
  'Albert Einstein': 'Jerman',
  'Mahatma Gandhi': 'India',
  'Jalaluddin Rumi': 'Persia',
  'Khalil Gibran': 'Lebanon',
  'Nelson Mandela': 'Afrika Selatan',
  'Bob Marley': 'Jamaika',
  'Charlie Chaplin': 'Inggris',
  'Mark Twain': 'Amerika',
  'Steve Jobs': 'Amerika',
  'Martin Luther King Jr.': 'Amerika',
  'Dale Carnegie': 'Amerika',
  'Zig Ziglar': 'Amerika',
  'Friedrich Nietzsche': 'Jerman',
  'Aristoteles': 'Yunani',
  'Lao Tzu': 'Tiongkok',
  'Robert Frost': 'Amerika',
  'Dr. Seuss': 'Amerika',
  'Carl Rogers': 'Amerika',
};

// ── Clean & Deduplicate ────────────────────────────────────────

function processQuotes() {
  const seen = new Set();
  const cleaned = [];

  for (const raw of RAW_QUOTES) {
    const text = cleanQuoteText(raw.q);
    const author = normalizeAuthor(raw.a);
    const category = raw.c.toLowerCase();

    // Dedupe by first 50 chars of quote
    const key = text.substring(0, 50).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    // Skip very short quotes
    if (text.length < 20) continue;

    const slug = slugify(text.substring(0, 60));
    if (!slug || slug.length < 5) continue;

    cleaned.push({
      text,
      author,
      author_slug: slugify(author),
      category,
      slug,
      nationality: AUTHOR_NATIONALITIES[author] || '',
      source: 'jagokata.com',
      word_count: text.split(/\s+/).length,
    });
  }

  return cleaned;
}

// ── Generate SQL ──────────────────────────────────────────────

function generateSQL(quotes) {
  const lines = [];

  // Insert categories
  const cats = Object.entries(CATEGORY_MAP);
  for (const [slug, cat] of cats) {
    const desc = cat.desc.replace(/'/g, "''");
    lines.push(`INSERT OR IGNORE INTO categories (name, slug, description, icon) VALUES ('${cat.name}', '${slug}', '${desc}', '${cat.icon}');`);
  }
  lines.push('');

  // Collect unique authors
  const authors = new Map();
  for (const q of quotes) {
    if (!authors.has(q.author)) {
      authors.set(q.author, { slug: q.author_slug, nationality: q.nationality });
    }
  }

  for (const [name, info] of authors) {
    const safeName = name.replace(/'/g, "''");
    lines.push(`INSERT OR IGNORE INTO authors (name, slug, nationality) VALUES ('${safeName}', '${info.slug}', '${info.nationality}');`);
  }
  lines.push('');

  // Insert quotes
  for (const q of quotes) {
    const safeText = q.text.replace(/'/g, "''");
    const safeAuthor = q.author.replace(/'/g, "''");
    lines.push(`INSERT OR IGNORE INTO quotes (text, author_id, category_id, slug, word_count, source) VALUES ('${safeText}', (SELECT id FROM authors WHERE name='${safeAuthor}'), (SELECT id FROM categories WHERE slug='${q.category}'), '${q.slug}', ${q.word_count}, '${q.source}');`);
  }
  lines.push('');

  // Update counts
  lines.push("UPDATE categories SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.category_id = categories.id);");
  lines.push("UPDATE authors SET quote_count = (SELECT COUNT(*) FROM quotes WHERE quotes.author_id = authors.id);");

  return lines.join('\n');
}

// ── Run ───────────────────────────────────────────────────────

const quotes = processQuotes();
console.log(`Cleaned ${quotes.length} unique quotes from ${RAW_QUOTES.length} raw entries`);
console.log(`Categories: ${Object.keys(CATEGORY_MAP).length}`);
console.log(`Unique authors: ${new Set(quotes.map(q => q.author)).size}`);

const sql = generateSQL(quotes);
const fs = require('fs');
fs.writeFileSync('/home/ucok/web/bijaksana.com/worker-cf/seed-data.sql', sql);
console.log(`SQL written to seed-data.sql (${sql.length} chars)`);
