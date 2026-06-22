export interface LocalRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  strTags: string;
}

export const indonesianRecipes: LocalRecipe[] = [
  {
    idMeal: "LOCAL_001",
    strMeal: "Soto Ayam Lamongan",
    strCategory: "Soup",
    strArea: "Indonesian",
    strInstructions: `1. Rebus ayam kampung bersama serai, daun jeruk, dan jahe hingga empuk. 
2. Haluskan bumbu (bawang merah, bawang putih, kunyit bakar, kemiri, ketumbar, merica, garam).
3. Tumis bumbu halus hingga harum dan matang. Masukkan ke dalam kaldu ayam rebusan tadi.
4. Angkat ayam, tiriskan, lalu goreng sebentar dan suwir-suwir dagingnya.
5. Siapkan mangkuk, tata soun/bihun, tauge, kol iris, telur rebus, dan ayam suwir.
6. Siram dengan kuah soto panas.
7. Taburi koya kerupuk udang, seledri, dan bawang goreng. Sajikan dengan sambal kemiri dan jeruk nipis.`,
    strMealThumb: "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Soto,Chicken,Traditional,Soup",
  },
  {
    idMeal: "LOCAL_002",
    strMeal: "Rawon Setan Surabaya",
    strCategory: "Beef",
    strArea: "Indonesian",
    strInstructions: `1. Rebus daging sapi (sandung lamur) hingga agak empuk. Potong dadu, lalu saring kaldunya.
2. Rendam kluwek dengan air panas, haluskan isinya.
3. Haluskan bumbu: bawang merah, putih, ketumbar, kemiri, kunyit, jahe, dan kluwek.
4. Tumis bumbu halus bersama serai, lengkuas, dan daun jeruk hingga harum pekat.
5. Masukkan potongan daging sapi ke dalam tumisan bumbu, aduk hingga bumbu meresap.
6. Tuang tumisan daging ke dalam panci berisi kaldu. Masak dengan api kecil hingga daging sangat empuk dan kuah menghitam.
7. Sajikan panas bersama nasi putih, tauge pendek, telur asin, sambal terasi, dan kerupuk udang.`,
    strMealThumb: "https://images.unsplash.com/photo-1626844131082-256783844137?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Rawon,Beef,BlackSoup,Traditional",
  },
  {
    idMeal: "LOCAL_003",
    strMeal: "Gudeg Jogja Komplit",
    strCategory: "Vegetarian",
    strArea: "Indonesian",
    strInstructions: `1. Rebus nangka muda sebentar untuk menghilangkan getahnya, tiriskan.
2. Haluskan bumbu: bawang merah, bawang putih, kemiri, ketumbar.
3. Siapkan panci alas daun jati (opsional untuk warna merah). Masukkan nangka muda, telur rebus, daun salam, lengkuas, gula merah (sisir), dan bumbu halus.
4. Tuang santan cair, masak dengan api kecil selama beberapa jam hingga nangka empuk dan warna berubah cokelat kemerahan.
5. Masukkan santan kental, masak kembali hingga kuah menyusut dan gudeg mengering (Gudeg Kering).
6. Sajikan bersama opor ayam, sambal goreng krecek, dan nasi hangat.`,
    strMealThumb: "https://images.unsplash.com/photo-1604543501064-28b9d363b9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Gudeg,Jackfruit,Sweet,Traditional",
  },
  {
    idMeal: "LOCAL_004",
    strMeal: "Sate Ayam Madura",
    strCategory: "Chicken",
    strArea: "Indonesian",
    strInstructions: `1. Potong daging ayam fillet bentuk dadu. Tusuk dengan tusukan sate (4-5 potong per tusuk).
2. Buat bumbu kacang: Goreng kacang tanah, bawang merah, bawang putih, dan cabai merah. Haluskan semua bahan.
3. Masak bumbu kacang dengan tambahan air, kecap manis, gula merah, dan sedikit garam hingga mengental dan mengeluarkan minyak.
4. Lumuri sate ayam mentah dengan sedikit bumbu kacang dan kecap sebelum dibakar.
5. Bakar sate di atas bara api sambil sesekali diolesi sisa bumbu/kecap hingga matang dan harum.
6. Sajikan sate dengan siraman bumbu kacang pekat, perasan jeruk limau, irisan bawang merah, dan lontong/nasi.`,
    strMealThumb: "https://images.unsplash.com/photo-1555507036-ab1f40ce88cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Satay,Chicken,Peanut,Grill",
  },
  {
    idMeal: "LOCAL_005",
    strMeal: "Bakso Sapi Kuah Segar",
    strCategory: "Beef",
    strArea: "Indonesian",
    strInstructions: `1. Kuah Kaldu: Rebus tulang lutut sapi bersama seledri, daun bawang, dan bawang putih geprek yang sudah digoreng hingga kaldu harum.
2. Pentol Bakso: Giling daging sapi segar bersama es batu, garam, bawang putih goreng, dan sedikit tepung sagu/tapioka hingga sangat halus dan kenyal.
3. Cetak adonan menjadi bola-bola, cemplungkan ke dalam air panas (bukan mendidih) hingga mengapung. Angkat dan tiriskan.
4. Tata mi kuning, bihun, tahu bakso, dan sawi di mangkuk.
5. Masukkan pentol bakso, lalu siram dengan kuah kaldu sapi panas.
6. Taburi seledri, bawang goreng. Beri saus, sambal, dan kecap sesuai selera.`,
    strMealThumb: "https://images.unsplash.com/photo-1617056637318-62c7b508dcc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Meatball,Beef,Soup,Popular",
  },
  {
    idMeal: "LOCAL_006",
    strMeal: "Pempek Kapal Selam Palembang",
    strCategory: "Seafood",
    strArea: "Indonesian",
    strInstructions: `1. Cuko: Rebus air bersama gula batok, asam jawa, bawang putih halus, dan cabai rawit halus hingga mendidih dan sedikit mengental. Saring.
2. Adonan Pempek: Campur daging ikan tenggiri giling dengan air es dan garam hingga lengket. Masukkan tepung sagu sedikit demi sedikit, uleni ringan.
3. Bentuk adonan menjadi kantung, isi dengan telur bebek/ayam mentah, tutup rapat tepinya.
4. Rebus pempek di air mendidih yang diberi sedikit minyak hingga mengapung dan matang. Tiriskan.
5. Goreng pempek dalam minyak panas hingga kuning keemasan dan renyah di luar.
6. Potong-potong, sajikan dengan mie kuning, potongan timun, ebi bubuk, dan siram dengan kuah cuko pedas manis.`,
    strMealThumb: "https://images.unsplash.com/photo-1626200419188-f56b06385d85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    strYoutube: "",
    strTags: "Pempek,Fish,Snack,Traditional",
  }
];
