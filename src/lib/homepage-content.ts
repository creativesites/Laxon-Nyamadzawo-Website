export interface HomepageFeatureCard {
  title: string;
  description: string;
}

export interface HomepageFamilyProfile {
  name: string;
  role: string;
  credentials: string;
  image: string;
  description: string;
  badge: string;
  features: string[];
  statPrimaryValue: string;
  statPrimaryLabel: string;
  statSecondaryValue: string;
  statSecondaryLabel: string;
}

export interface HomepageMinistryItem {
  title: string;
  text: string;
  img: string;
}

export interface HomepageContactItem {
  label: string;
  value: string;
  icon: string;
}

export interface HomepageContent {
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  featureCards: HomepageFeatureCard[];
  musicPreview: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    highlight: string;
    narrative: string;
    bulletPoints: string[];
    ctaLabel: string;
    yearsValue: string;
    yearsLabel: string;
    image: string;
  };
  family: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    parents: HomepageFamilyProfile;
    ethel: HomepageFamilyProfile;
    providence: HomepageFamilyProfile;
    praise: HomepageFamilyProfile;
  };
  ministry: {
    eyebrow: string;
    title: string;
    description: string;
    items: HomepageMinistryItem[];
  };
  musicSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  writingsSection: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    items: HomepageContactItem[];
    formTitle: string;
    successTitle: string;
    successMessage: string;
  };
}

export const defaultHomepageContent: HomepageContent = {
  hero: {
    eyebrow: "Welcome",
    title: "Seek First the",
    highlight: "Kingdom of God",
    description:
      "The ministry of Pastor Laxson Nyamadzawo — shepherding hearts in Zambia and Zimbabwe through pastoral care, theological wisdom, and gospel praise.",
    primaryCtaLabel: "Discover More",
    secondaryCtaLabel: "Watch Ezekiel TV",
  },
  featureCards: [
    {
      title: "Pastoral Care",
      description: "Shepherding communities with compassion, prayer, and the healing Word of God.",
    },
    {
      title: "Chaplaincy",
      description: "Providing spiritual counsel and support across institutions and organizations.",
    },
    {
      title: "Theological Teaching",
      description: "Academic exploration of scripture, doctrine, and the African Christian witness.",
    },
  ],
  musicPreview: {
    eyebrow: "Gospel Music",
    title: "Shona & Lingala",
    highlight: "Praise & Worship",
    description:
      "Gospel tracks by Pastor Laxson Nyamadzawo. Stream directly in your browser — music continues even when your screen is locked.",
    primaryCtaLabel: "Open Full Music Player",
    secondaryCtaLabel: "Play First Track",
  },
  about: {
    eyebrow: "About Pastor Laxson",
    title: "A Life Dedicated to",
    highlight: "God's Purpose",
    narrative:
      "Pastor Laxson Nyamadzawo is a dedicated shepherding minister within ZAOGA Forward in Faith Ministries International. Currently serving as the District Pastor for Chilenje District in Lusaka, Zambia, his calling encompasses pastoral care, hospital and institutional chaplaincy, academic theological writing, and Congolese rhumba gospel songwriting.\n\nBlessed with his partner Runako and daughters Ethel, Providence, and Makanaka Praise, he serves the people of Zambia and Zimbabwe with a heart anchored in Matthew 6:33.",
    bulletPoints: ["Peace of Mind", "Open Hearts", "Faithful Service", "Community Care"],
    ctaLabel: "Explore Ministry",
    yearsValue: "25+",
    yearsLabel: "Years of Ministry",
    image: "/images/laxson-and-rutendo2.jpeg",
  },
  family: {
    eyebrow: "The Domestic Church",
    title: "Designed for",
    highlight: "worship.",
    description:
      "For Pastor Laxson, the first altar of shepherding is the family home. Center-stage under Joshua 24:15, their household is built on relational depth, daily prayer, and the harmonious melodies of Congolese rhumba.",
    parents: {
      name: "Pastor Laxson & Runako",
      role: "A shared calling, a shepherding union.",
      credentials: "District Shepherds · Chilenje",
      image: "/images/laxson-and-runako.jpg",
      description:
        "Partners in life and shepherding. Leading Forward in Faith Ministries Chilenje District with dedicated shepherding grace, prayer, and deep spiritual counseling for families across Zambia and Zimbabwe.",
      badge: "Anchored in Matthew 6:33",
      features: ["Marriage Counseling", "Community Care", "District Prayers"],
      statPrimaryValue: "25+",
      statPrimaryLabel: "Years Married",
      statSecondaryValue: "1000+",
      statSecondaryLabel: "Families Counseled",
    },
    ethel: {
      name: "Ethel Nyamadzawo",
      role: "Pursuing truth, anchored in Scripture.",
      credentials: "Bachelor of Economics (UNZA), Masters in Actuarial Science",
      image: "/images/ethel.jpg",
      description:
        "Ethel graduated with a Bachelor of Economics from UNZA and recently completed a Masters in Actuarial Science. She carries the family legacy forward with scholarly research and continuous theological exploration.",
      badge: "Scholarly Milestone",
      features: ["Theological Research", "Scripture Study", "Academic Excellence"],
      statPrimaryValue: "UNZA",
      statPrimaryLabel: "Bachelor's Alma Mater",
      statSecondaryValue: "MSc",
      statSecondaryLabel: "Actuarial Science",
    },
    providence: {
      name: "Providence Nyamadzawo",
      role: "Serving the body, spreading pure joy.",
      credentials: "Bachelor of Laws (UNILUS), Candidate for Zambia Bar",
      image: "/images/popo.jpg",
      description:
        "Providence graduated from UNILUS with an Accounting degree and brings shepherding warmth and supportive energy directly to the Chilenje District youth fellowship and church community.",
      badge: "Legal Advocate Milestone",
      features: ["Youth Fellowship", "Church Community", "Supportive Leadership"],
      statPrimaryValue: "UNILUS",
      statPrimaryLabel: "Alma Mater",
      statSecondaryValue: "LLB",
      statSecondaryLabel: "Law Track",
    },
    praise: {
      name: "Makanaka Praise Nyamadzawo",
      role: "Joyful worship, vibrant expression.",
      credentials: "BSc in Business Computing (UNZA)",
      image: "/images/praise.jpg",
      description:
        "Makanaka Praise — 'You are good' in Shona — represents the lively atmosphere of daily song. Her name celebrates the family's fusion of Congolese rhumba and African gospel worship.",
      badge: "Creative Praise Milestone",
      features: ["Creative Direction", "Youth Energy", "Musical Expression"],
      statPrimaryValue: "UNZA",
      statPrimaryLabel: "Current Study",
      statSecondaryValue: "BSc",
      statSecondaryLabel: "Business Computing",
    },
  },
  ministry: {
    eyebrow: "Service",
    title: "Areas of Ministry",
    description:
      "Serving the body of Christ in Zambia and Zimbabwe through diverse and impactful areas of spiritual ministry.",
    items: [
      {
        img: "/images/laxson2.jpeg",
        title: "Pastoral Care",
        text: "Walking alongside believers through seasons of joy and trial with prayer, counsel, and unwavering presence.",
      },
      {
        img: "/images/6-26Completed-30.jpg",
        title: "Chaplaincy Services",
        text: "Providing spiritual support across hospitals, institutions, and organizations where comfort and guidance are needed most.",
      },
      {
        img: "/ministry_bible.png",
        title: "Theological Research",
        text: "Academic exploration of scripture, the doctrine of the Trinity, and the intersection of faith with the African Christian experience.",
      },
    ],
  },
  musicSection: {
    eyebrow: "Now Playing",
    title: "Gospel Praise",
    description:
      "Listen to original Shona and Lingala gospel songs composed by Pastor Laxson Nyamadzawo.",
    ctaLabel: "Open Full Music App",
  },
  writingsSection: {
    eyebrow: "Blog",
    title: "Theological Writings",
    description: "Academic articles, doctrine summaries, and reflections shaped for church life.",
    ctaLabel: "View All Articles",
  },
  contact: {
    eyebrow: "Get In Touch",
    title: "Let's",
    highlight: "Connect",
    description:
      "Whether you have questions about ministry, seek pastoral counsel, or would like to connect, please reach out.",
    items: [
      { icon: "📍", label: "Location", value: "Lusaka, Zambia" },
      { icon: "✉️", label: "Email", value: "info@laxsonnyamadzawo.com" },
      { icon: "⛪", label: "Church", value: "ZAOGA Forward in Faith Ministries" },
    ],
    formTitle: "Send a Message",
    successTitle: "Message Sent",
    successMessage: "Thank you for reaching out. Pastor Laxson will respond shortly.",
  },
};
