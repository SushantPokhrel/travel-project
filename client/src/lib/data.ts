export const localities = [
  "Kathmandu",
  "Dharan",
  "Ilam",
  "Pokhara",
  "Chitwan",
  "Lumbini",
  "Everest Region",
  "Annapurna Region",
];

export const guides = [
  {
    id: "1",
    name: "Pemba Sherpa",
    avatarUrl:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/1542038/pexels-photo-1542038.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Everest Region",
    expertise: ["Trekking", "Photography"],
    gender: "Male",
    languages: ["English", "Nepali", "Sherpa"],
    bio: "Born at the foot of Khumbu, I have guided trekkers to Everest Base Camp for over a decade. My passion is sharing the mountains safely while telling the stories of the Sherpa people. I hold a certified wilderness first responder qualification.",
    pricePerDay: 85,
    rating: 4.9,
    reviewCount: 128,
    yearsExperience: 12,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Sarah M.",
        rating: 5,
        date: "2026-07-15",
        comment:
          "Pemba made our EBC trek unforgettable. Incredibly knowledgeable and always put safety first.",
      },
      {
        id: "r2",
        authorName: "James K.",
        rating: 5,
        date: "2026-06-02",
        comment:
          "Best guide we could have asked for. Felt like family by the end.",
      },
      {
        id: "r3",
        authorName: "Lina T.",
        rating: 4,
        date: "2026-05-18",
        comment:
          "Very professional and patient. The photography tips were a bonus!",
      },
    ],
  },
  {
    id: "2",
    name: "Anjali Rai",
    avatarUrl:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Ilam",
    expertise: ["Culture", "City Tour"],
    gender: "Female",
    languages: ["English", "Nepali", "Hindi"],
    bio: "I am a cultural guide from the tea gardens of Ilam. I specialize in immersive experiences — tea estates, local villages, and the living traditions of eastern Nepal. I love connecting travelers with local families.",
    pricePerDay: 45,
    rating: 4.8,
    reviewCount: 86,
    yearsExperience: 7,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Emma R.",
        rating: 5,
        date: "2026-07-20",
        comment:
          "Anjali opened doors to places we would never have found. The tea garden visit was magical.",
      },
      {
        id: "r2",
        authorName: "Tom B.",
        rating: 5,
        date: "2026-06-10",
        comment:
          "Warm, knowledgeable, and genuinely passionate about her region.",
      },
    ],
  },
  {
    id: "3",
    name: "Bikash Limbu",
    avatarUrl:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Dharan",
    expertise: ["Trekking", "Wildlife"],
    gender: "Male",
    languages: ["English", "Nepali", "Limbu"],
    bio: "Dharan-born adventurer with deep knowledge of the eastern Himalayan trails and the wildlife of Koshi Tappu. I lead treks that blend mountain views with rare bird-watching experiences.",
    pricePerDay: 55,
    rating: 4.7,
    reviewCount: 64,
    yearsExperience: 9,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Grace L.",
        rating: 5,
        date: "2026-07-01",
        comment:
          "Bikash found us rare birds we had only seen in books. An amazing experience.",
      },
      {
        id: "r2",
        authorName: "Nathan P.",
        rating: 4,
        date: "2026-04-12",
        comment: "Great trek with stunning views. Highly recommend.",
      },
    ],
  },
  {
    id: "4",
    name: "Sushma Gurung",
    avatarUrl:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Pokhara",
    expertise: ["Trekking", "Culture"],
    gender: "Female",
    languages: ["English", "Nepali", "Gurung", "French"],
    bio: "I grew up in the hills above Pokhara and have been guiding on the Annapurna circuit for eight years. I love showing travelers both the grand mountain views and the rich Gurung culture of my home.",
    pricePerDay: 60,
    rating: 4.9,
    reviewCount: 95,
    yearsExperience: 8,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Olivia W.",
        rating: 5,
        date: "2026-07-25",
        comment:
          "Sushma is the best guide we have had in Nepal. Thoughtful, strong, and a great cook!",
      },
      {
        id: "r2",
        authorName: "Marc D.",
        rating: 5,
        date: "2026-06-15",
        comment: "Elle parle français couramment. Expérience magnifique!",
      },
      {
        id: "r3",
        authorName: "Priya S.",
        rating: 4,
        date: "2026-05-09",
        comment: "Wonderful cultural insights along the trek.",
      },
    ],
  },
  {
    id: "5",
    name: "Ramesh Thapa",
    avatarUrl:
      "https://images.pexels.com/photos/1216533/pexels-photo-1216533.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Chitwan",
    expertise: ["Wildlife", "Photography"],
    gender: "Male",
    languages: ["English", "Nepali", "Tharu"],
    bio: "A naturalist guide based in Chitwan National Park. I specialize in wildlife safaris — rhinos, tigers, and exotic birds — and know the best spots for photography at dawn and dusk.",
    pricePerDay: 50,
    rating: 4.6,
    reviewCount: 73,
    yearsExperience: 11,
    verified: false,
    reviews: [
      {
        id: "r1",
        authorName: "Chris H.",
        rating: 5,
        date: "2026-06-28",
        comment:
          "Spotted a tiger thanks to Ramesh! His tracking skills are unmatched.",
      },
      {
        id: "r2",
        authorName: "Hannah J.",
        rating: 4,
        date: "2026-03-15",
        comment: "Great safari experience with amazing photo opportunities.",
      },
    ],
  },
  {
    id: "6",
    name: "Kabita Maharjan",
    avatarUrl:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/278866/pexels-photo-278866.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Kathmandu",
    expertise: ["City Tour", "Culture", "Photography"],
    gender: "Female",
    languages: ["English", "Nepali", "Newari"],
    bio: "A licensed heritage guide for the Kathmandu Valley. I bring the ancient cities of Kathmandu, Patan, and Bhaktapur to life with stories of kings, artisans, and living goddesses. I also know the best rooftop cafes.",
    pricePerDay: 40,
    rating: 4.8,
    reviewCount: 112,
    yearsExperience: 10,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Daniel F.",
        rating: 5,
        date: "2026-07-30",
        comment:
          "Kabita made the temples come alive with her stories. Worth every rupee.",
      },
      {
        id: "r2",
        authorName: "Yuki N.",
        rating: 5,
        date: "2026-06-22",
        comment:
          "The best city tour I have had anywhere. Her photography eye is great too.",
      },
      {
        id: "r3",
        authorName: "Carlos M.",
        rating: 4,
        date: "2026-05-11",
        comment: "Very knowledgeable about Newari culture and architecture.",
      },
    ],
  },
  {
    id: "7",
    name: "Dawa Tamang",
    avatarUrl:
      "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/3082032/pexels-photo-3082032.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Annapurna Region",
    expertise: ["Trekking"],
    gender: "Male",
    languages: ["English", "Nepali", "Tamang"],
    bio: "Strong high-altitude trekking guide with multiple summits on the Annapurna circuit. I prioritize acclimatization and safety while making sure you have the adventure of a lifetime.",
    pricePerDay: 70,
    rating: 4.8,
    reviewCount: 58,
    yearsExperience: 15,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Sophie L.",
        rating: 5,
        date: "2026-07-05",
        comment:
          "Dawa got us over the Thorong La pass safely. A mountain goat of a man!",
      },
      {
        id: "r2",
        authorName: "Ravi P.",
        rating: 4,
        date: "2026-04-20",
        comment: "Excellent guide, very experienced at altitude.",
      },
    ],
  },
  {
    id: "8",
    name: "Gita Shrestha",
    avatarUrl:
      "https://images.pexels.com/photos/789822/pexels-photo-789822.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverUrl:
      "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=800",
    locality: "Lumbini",
    expertise: ["Culture", "City Tour"],
    gender: "Female",
    languages: ["English", "Nepali", "Japanese"],
    bio: "I guide pilgrims and travelers through Lumbini, the birthplace of Buddha. With a background in Buddhist philosophy, I offer a deeply spiritual and educational journey through the sacred gardens and monasteries.",
    pricePerDay: 35,
    rating: 4.9,
    reviewCount: 67,
    yearsExperience: 6,
    verified: true,
    reviews: [
      {
        id: "r1",
        authorName: "Kenji T.",
        rating: 5,
        date: "2026-07-12",
        comment:
          "Gita-san wa subarashii gaido desu. Very peaceful and insightful tour.",
      },
      {
        id: "r2",
        authorName: "Anna B.",
        rating: 5,
        date: "2026-06-01",
        comment:
          "A deeply spiritual experience. Gita has a calming presence and deep knowledge.",
      },
    ],
  },
];

