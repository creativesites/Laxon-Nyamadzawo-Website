import { createClient } from "@supabase/supabase-js";

// Retrieve database environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Initialize real Supabase client if credentials are provided
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// High-fidelity Mock Datasets to ensure premium runtime without credentials
export interface Writing {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "Doctrine" | "Ministry" | "Resources" | "Reflection";
  published: boolean;
  published_at: string;
  cover_image_url?: string;
  reading_time: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  youtube_url?: string;
  audio_url?: string;
  language_tags: string[];
  track_number: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

// 4 Real Theological Writings from Draft Content
const MOCK_WRITINGS: Writing[] = [
  {
    id: "writing-1",
    title: "The Doctrine of the Trinity: Biblical Foundations and Historical Development",
    slug: "doctrine-of-the-trinity",
    excerpt: "A comprehensive exploration of Trinitarian theology from Scripture through the Nicene Council, examining key heresies, Eastern and Western traditions, and the doctrine's practical significance for the Church today.",
    category: "Doctrine",
    published: true,
    published_at: "2026-05-15T08:00:00Z",
    reading_time: 8,
    content: `
## Biblical Foundations

The doctrine of the Trinity is the heart of Christian revelation. While the term *Trinity* itself is not found in the pages of the Holy Scripture, the reality of one God eternally existing in three co-equal and co-eternal Persons—Father, Son, and Holy Spirit—is woven throughout the entire biblical narrative.

In the Old Testament, we see subtle foreshadowings. In Genesis 1:26, God speaks in the plural: *"Let us make mankind in our image, in our likeness."* The priestly blessing of Numbers 6:24-26 invokes the divine name three times, and the threefold "Holy, Holy, Holy" of Isaiah 6:3 points to a profound depth within the unity of the Godhead.

In the New Testament, this mystery is unveiled. At the baptism of Jesus (Matthew 3:16-17), we witness all three Persons simultaneously: the Son is baptized, the Spirit descends like a dove, and the Father speaks from heaven, saying, *"This is my Son, whom I love; with him I am well pleased."* Jesus explicitly instructs His disciples in Matthew 28:19 to baptize *"in the name [singular] of the Father and of the Son and of the Holy Spirit."*

## Historical Development & Patristic Reflections

As the Gospel spread into the Greco-Roman world, the Church faced the urgent challenge of articulating this profound mystery in the face of intellectual scrutiny and internal misconceptions.

1. **Arianism**: Arius of Alexandria argued that the Son was a created being, subordinate to the Father, famously asserting, *"There was a time when he was not."*
2. **Modalism (Sabellianism)**: This heresy claimed that Father, Son, and Holy Spirit are not distinct Persons, but merely three temporary "modes" or masks that the single divine Person wore at different times.

To defend the biblical witness, the early Church Fathers gathered at the **Nicene Council (A.D. 325)**. Led by the theological brilliance of Athanasius, the council declared that the Son is *homoousios*—of the exact "same substance"—with the Father. The Nicene Creed stands today as a monumental pillar of Christian orthodoxy, affirming the full deity of both the Son and the Holy Spirit.

## Practical Significance for the Church Today

The Trinity is not an abstract mathematical puzzle or a dry academic dogma; it is the ultimate foundation of all relationship, worship, and community.

* **God is Love**: Because God is triune, God has eternally been in a relationship of perfect love and fellowship. Love did not begin when the universe was created; love is the very essence of who God is.
* **The Model for the Church**: The Church is called to mirror the relational unity of the Trinity. As the Apostle Paul writes, we are many members but one body, called to dwell in perfect harmony, reflecting the mutual self-giving love of the Father, Son, and Holy Spirit to a fragmented world.
    `
  },
  {
    id: "writing-2",
    title: "Pastors and Chaplains: Distinct Callings, One Kingdom",
    slug: "pastors-and-chaplains",
    excerpt: "An academic examination of the ministerial distinctions between pastoral and chaplaincy roles — their theological foundations, ecclesiastical contexts, and complementary contributions to God's mission.",
    category: "Ministry",
    published: true,
    published_at: "2026-05-18T09:00:00Z",
    reading_time: 6,
    content: `
## Introduction

In the broad scope of Christian ministry, God raises up diverse callings to serve His Kingdom. Two of the most vital—yet frequently misunderstood—roles are those of the **Local Church Pastor** and the **Institutional Chaplain**. While both offices flow from the shepherding heart of Jesus Christ, they operate in distinct ecclesiastical contexts, employ different methodologies, and serve unique missionary functions.

Understanding these distinctions is essential for equipping ministers and ensuring that the body of Christ serves both the gathered congregation and the scattered world effectively.

## The Local Church Pastor: Shepherding the Gathered Flock

The pastor's calling is primarily situated within the covenant community of the local church. This role is rooted in the biblical office of *elder* or *overseer* (Titus 1:5-9, 1 Peter 5:1-4).

* **Context**: A defined community of believers who voluntarily gather for worship, instruction, sacraments, and mutual discipleship.
* **Focus**: Long-term discipleship, sound expository preaching, maintaining ecclesiastical discipline, and building a sustainable church culture. The pastor is a spiritual father and architect of the community's spiritual health.
* **Methodology**: Operates with spiritual authority recognized by the congregation. The pastoral message is explicitly theological, direct, and call-to-action oriented, leading people deeper into covenant membership and local witness.

## The Chaplain: Presence in the Borderlands

Unlike the pastor, the chaplain is sent *out* into secular institutions—hospitals, military units, prisons, corporate spaces, and emergency services. The chaplain's ministry is rooted in the theology of *presence* and *incarnation*.

* **Context**: Highly pluralistic, secular, and often high-stress environments. The people served may belong to different faith traditions or hold no faith at all.
* **Focus**: Meeting individuals at their point of crisis, providing non-judgmental spiritual care, counseling, and crisis intervention. The chaplain is a bridge-builder who provides a ministry of "being there" in life's most intense margins.
* **Methodology**: Must navigate institutional rules and serve without coercion. The chaplain's approach is often highly relational, pastoral rather than dogmatic, utilizing active listening and empathy to bring the comforting peace of God into dark and challenging moments.

## Complementary Callings for One Kingdom

Rather than being in competition, the pastor and the chaplain are essential partners in the *Missio Dei* (Mission of God).

| Dimension | Local Church Pastor | Institutional Chaplain |
| :--- | :--- | :--- |
| **Primary Location** | The Sanctuary / Church Building | The Hospital, Prison, Battlefield, Office |
| **Audience** | The Gathered Covenant Congregation | The Pluralistic Public in Secular Spheres |
| **Core Method** | Expository Preaching & Discipleship | Ministry of Presence & Empathetic Care |
| **Spiritual Stance** | Shepherding & Building Community | Crisis Comfort & Bridge-Building |

Ultimately, the pastor prepares the saints to go out into the world, and the chaplain stands in the world to welcome, comfort, and guide the broken back toward the light of Christ. Together, they demonstrate that Jesus is Lord of both the sacred sanctuary and the secular square.
    `
  },
  {
    id: "writing-3",
    title: "Biblical Resources Guide on the Trinity",
    slug: "trinity-resources-guide",
    excerpt: "A curated guide to Scripture passages, commentaries, and patristic sources for deep engagement with the Trinitarian nature of God — designed for ministers, students, and serious disciples.",
    category: "Resources",
    published: true,
    published_at: "2026-05-20T10:00:00Z",
    reading_time: 5,
    content: `
## Scriptural Foundations Checklist

For study, teaching, or contemplation of the Trinity, these key biblical anchors are essential:

### 1. Old Testament Foreshadowings
* **Genesis 1:1-3**: God creates, the Spirit hovers over the waters, and God *speaks* (the Word).
* **Genesis 18:1-3**: The Lord appears to Abraham as three men by the oaks of Mamre.
* **Isaiah 6:3**: The Seraphim cry *"Holy, Holy, Holy"*—a triadic declaration of the divine glory.

### 2. New Testament Revelations
* **Matthew 3:16-17**: The Baptism of Jesus (the active convergence of Father, Son, and Spirit).
* **Matthew 28:19**: The Great Commission (Baptizing in the *Name* [singular] of the Father, Son, and Holy Spirit).
* **2 Corinthians 13:14**: The apostolic benediction: *"May the grace of the Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit be with you all."*

---

## Recommended Theological Works

To go deeper into the history and theology of the Triune God, prioritize these classical and modern books:

1. **Patristic Era**:
   * *On the Incarnation* by Athanasius of Alexandria.
   * *On the Holy Spirit* by Basil the Great.
   * *On the Trinity* by Augustine of Hippo (a profound Western theological masterpiece).
2. **Reformation & Classical**:
   * *Institutes of the Christian Religion* (Book I, Chapter 13) by John Calvin.
3. **Modern Academic**:
   * *The Trinity* by Karl Rahner.
   * *The Triune God* by Fred Sanders (highly recommended for a clear, modern evangelical approach).

---

## Preaching Outlines & Small Group Tips

* **Focus on Mystery, Not Math**: Do not try to explain the Trinity using flawed physical analogies (like water, ice, and steam, which leads to Modalism; or a three-leaf clover, which leads to Tritheism). Emphasize that the Trinity is a mystery of personal communion.
* **Link to Salvation**: Remind your students that salvation is Trinitarian: the Father planned it, the Son accomplished it on the cross, and the Holy Spirit applies it to our hearts.
    `
  },
  {
    id: "writing-4",
    title: "Faith, Family, and the African Christian Witness",
    slug: "faith-family-african-witness",
    excerpt: "Reflections on embodying Christian discipleship within the richness of Zimbabwean and Congolese cultural heritage — and what the African church contributes to global Christianity.",
    category: "Reflection",
    published: true,
    published_at: "2026-05-24T12:00:00Z",
    reading_time: 7,
    content: `
## Introduction

Living as a Christian in contemporary Africa is a beautiful, dynamic, and complex calling. As a minister of the Gospel rooted in the rich heritage of Zimbabwe, and deeply influenced by the vibrant Congolese Christian expression, I am constantly reminded of the profound synergy between our cultural heritage and our heavenly citizenship.

The African Christian witness is not a secondary offshoot of Western theology; it is a powerful, distinct, and vital voice that is reshaping the landscape of global Christianity.

## The Sanctity of Family: The African Domestic Church

In many traditional African societies, family is not merely an isolated nuclear unit, but a vast, interconnected community. When this relational depth is baptized into Christ, it becomes a powerful canvas for the Gospel.

* **Ubuntu in the Home**: *"I am because we are, and since we are, therefore I am."* This philosophical framework aligns beautifully with the New Testament's description of the church as the body of Christ. In the home, it translates into mutual support, intergenerational discipleship, and hospitality.
* **Family Worship**: In our household, worship is a shared, daily reality. Mixing Shona and Lingala praise songs, we teach our daughters—Ethel, Providence, and Makanaka Praise—that faith is not a Sunday event but the atmosphere of our home.
* **Shepherding the Next Generation**: Our families are the primary training grounds for Christian character. In Zimbabwe and across the continent, passing down a legacy of resilient, active faith to our children is the most critical mission we have.

## Music as Theology: The Congolese Gospel Tradition

Nowhere is the joy and theological depth of African Christianity more evident than in its music—especially in the Congolese *rhumba* worship tradition.

In many Western settings, theology is primarily written in text; in Africa, theology is often **sung, danced, and celebrated**. A song like *Bolingo Na Nzambe* (The Love of God) in Lingala is not just emotional; it is a deep meditation on the unconditional, sovereign love of the Creator. Through polyphonic rhythms, bright electric guitars, and celebratory vocal arrangements, the Congolese tradition captures a vital truth: that the Gospel is a message of liberation, joy, and profound victory over darkness.

## The Global Contribution of the African Church

As Christianity's center of gravity continues to shift decisively toward the Global South, the African church stands poised to lead. We bring invaluable treasures to the global body:
1. **Unwavering Faith in the Supernatural**: A deep, biblical understanding that the spiritual world is real, and that prayer has actual, transformative power.
2. **Vibrant Relational Community**: A rejection of hyper-individualism in favor of genuine, shared life in Christ.
3. **Resilient Joy**: The capacity to praise God and preach hope even in the midst of economic and social trials.

To God be the glory as we carry this rich witness forward—honoring our heritage, loving our families, and lifting up the name of Jesus Christ across the nations.
    `
  }
];

// 4 Gospel Songs from Draft Content
const MOCK_MUSIC: MusicTrack[] = [
  {
    id: "music-1",
    title: "Bolingo Na Nzambe",
    description: "Original Lingala Worship Song · Congolese Gospel Tradition. A deep, celebratory reflection on the perfect, eternal, and sovereign love of God that shepherds us through all seasons.",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with real links when provided
    language_tags: ["Lingala"],
    track_number: 1
  },
  {
    id: "music-2",
    title: "Nyika Yedu Zimbabwe",
    description: "Trilingual Celebration of Zimbabwe's Heritage & Faith. Seamlessly blending Shona, Lingala, and English to offer a beautiful prayer of blessing, peace, and revival over the nation of Zimbabwe.",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    language_tags: ["Lingala", "Shona", "English"],
    track_number: 2
  },
  {
    id: "music-3",
    title: "Balandeli Ba Yesu",
    description: "The Disciples of Jesus · Congolese Rhumba Gospel. A high-energy, rhythmic rhumba track calling all believers to leave everything behind, take up their cross, and follow the Savior.",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    language_tags: ["Lingala", "English"],
    track_number: 3
  },
  {
    id: "music-4",
    title: "Nyamadzawo Family Praise",
    description: "Personal Family Worship · Personalized Lingala Verses. A heartfelt, intimate recording designed for home worship, celebrating God's faithfulness over the Nyamadzawo family.",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    language_tags: ["Lingala"],
    track_number: 4
  }
];

// Memory database for message submissions (in-memory mock store)
const mockMessagesStore: ContactMessage[] = [];

// Exported high-fidelity data services
export const databaseService = {
  // --- Writings Operations ---
  async getWritings(): Promise<Writing[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("writings")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data) return data as Writing[];
      console.warn("Supabase fetch failed, falling back to mock writings:", error);
    }
    return MOCK_WRITINGS;
  },

  async getWritingBySlug(slug: string): Promise<Writing | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("writings")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as Writing;
      console.warn(`Supabase fetch failed for slug ${slug}, checking mock writings:`, error);
    }
    return MOCK_WRITINGS.find(w => w.slug === slug) || null;
  },

  // --- Music Operations ---
  async getMusicTracks(): Promise<MusicTrack[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("music")
        .select("*")
        .order("track_number", { ascending: true });
      if (!error && data) return data as MusicTrack[];
      console.warn("Supabase fetch failed, falling back to mock music:", error);
    }
    return MOCK_MUSIC;
  },

  // --- Contact Messages Operations ---
  async submitMessage(name: string, email: string, message: string): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      message,
      status: "unread",
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { name, email, message, status: "unread" }
        ])
        .select()
        .single();
      
      if (!error && data) {
        return data as ContactMessage;
      }
      console.warn("Supabase message insert failed, saving to mock memory:", error);
    }

    mockMessagesStore.push(newMessage);
    // Simulate persistent local storage if in browser
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("laxon_website_messages") || "[]";
        const parsed = JSON.parse(stored);
        parsed.push(newMessage);
        localStorage.setItem("laxon_website_messages", JSON.stringify(parsed));
      } catch (err) {
        console.error("Local storage save failed:", err);
      }
    }
    return newMessage;
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as ContactMessage[];
      console.warn("Supabase messages fetch failed, reading mock memory:", error);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("laxon_website_messages");
        if (stored) return JSON.parse(stored) as ContactMessage[];
      } catch (err) {
        console.error("Local storage load failed:", err);
      }
    }
    return mockMessagesStore;
  }
};
