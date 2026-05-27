import { createClient } from "@supabase/supabase-js";
import { defaultHomepageContent, HomepageContent } from "@/lib/homepage-content";

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

export interface LyricLine {
  time: number;
  text: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  youtube_url?: string;
  audio_url?: string;
  language_tags: string[];
  track_number: number;
  plays_count?: number;
  downloads_count?: number;
  cover_image_url?: string;
  lyrics?: LyricLine[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

function sanitizeFilenamePart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// 4 Real Theological Writings from Draft Content
export const MOCK_WRITINGS: Writing[] = [
  {
    id: "writing-1",
    title: "The Doctrine of the Trinity: Biblical Foundations and Historical Development",
    slug: "doctrine-of-the-trinity",
    excerpt: "A comprehensive exploration of Trinitarian theology from Scripture through the Nicene Council, examining key heresies, Eastern and Western traditions, and the doctrine's practical significance for the Church today.",
    category: "Doctrine",
    published: true,
    published_at: "2026-05-15T08:00:00Z",
    reading_time: 8,
    cover_image_url: "/images/Bindura1960s.jpeg",
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
    cover_image_url: "/images/laxon.jpeg",
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
    cover_image_url: "/images/writings1.jpeg",
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
    cover_image_url: "/images/Bindura1960s.jpeg",
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

// 6 Gospel Songs from public/music Directory
export const MOCK_MUSIC: MusicTrack[] = [
  {
    id: "music-1",
    title: "Jesu Akandida",
    description: "A soul-stirring Shona praise song celebrating the unconditional love of Jesus Christ.",
    audio_url: "/music/Jesu Akandida.mp3",
    language_tags: ["Shona"],
    track_number: 1,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 14, text: "Jesu wangu ndomuda" },
      { time: 21, text: "Jesu uyu akandida" },
      { time: 27, text: "Ndisingamuzive" },
      { time: 33, text: "Rudo rwake rukuru" },
      { time: 37, text: "Ndodada naye" },
      { time: 40, text: "Jesu ndiye ndiye" },
      { time: 43, text: "Zuro nanhasi neusingaperi" },
      { time: 47, text: "Helelele ne, akandida zvisinei" },
      { time: 52, text: "Nezvandaiva" },
      { time: 55, text: "Rudo rwake" },
      { time: 58, text: "Haruna basa kuti" },
      { time: 62, text: "Ndiwe ani" },
      { time: 65, text: "Anokuda wakadaro" },
      { time: 70, text: "Muri mutadzi" },
      { time: 77, text: "Huya kwaari" },
      { time: 83, text: "Uchida kwa..." },
      { time: 90, text: "Achakuregerera" },
      { time: 96, text: "Zvakaoma nekutambura" },
      { time: 102, text: "Anoregerera" },
      { time: 107, text: "Helelele ne, akandida zvisinei" },
      { time: 113, text: "Nezvandaiva" },
      { time: 116, text: "Rudo rwake" },
      { time: 119, text: "Haruna basa kuti" },
      { time: 123, text: "Ndiwe ani" },
      { time: 126, text: "Anokuda wakadaro" },
      { time: 131, text: "[Instrumental Dance Section]" },
      { time: 161, text: "Masingamuzive" },
      { time: 165, text: "Huya kwaari" },
      { time: 168, text: "Anokangamwira zvivi zvenyu" },
      { time: 175, text: "Nyasha dzake dzakadzama" },
      { time: 180, text: "Helelele ne, akandida zvisinei" },
      { time: 186, text: "Nezvandaiva" },
      { time: 189, text: "Rudo rwake" },
      { time: 192, text: "Haruna basa kuti" },
      { time: 196, text: "Ndiwe ani" },
      { time: 199, text: "Anokuda wakadaro" },
      { time: 204, text: "Jesu uyu akanaka" },
      { time: 211, text: "Ukamuda achakuda" },
      { time: 217, text: "Nerudo rwakadzama" },
      { time: 223, text: "Uchafunga kuti rudo urwu rwaivepi" },
      { time: 230, text: "Mwari achakuchengeta" },
      { time: 236, text: "Nekuti wakadiwa naJesu" },
      { time: 242, text: "Tenda rudo mumoyo wako kudiwa" },
      { time: 246, text: "Uchafara nemufaro mukuru-kuru" },
      { time: 252, text: "Helelele ne, akandida zvisinei" },
      { time: 257, text: "Nezvandaiva" },
      { time: 260, text: "Rudo rwake" },
      { time: 263, text: "Haruna basa kuti" },
      { time: 267, text: "Ndiwe ani" },
      { time: 270, text: "Anokuda wakadaro" },
      { time: 275, text: "Helelele ne, akandida zvisinei" },
      { time: 280, text: "Nezvandaiva" },
      { time: 283, text: "Rudo rwake" },
      { time: 286, text: "Haruna basa kuti" },
      { time: 290, text: "Ndiwe ani" },
      { time: 293, text: "Anokuda wakadaro" },
      { time: 298, text: "[Instrumental Outro]" }
    ]
  },
  {
    id: "music-2",
    title: "Messiah Wangu",
    description: "A heartfelt worship song dedicating our lives and service to our Savior and Messiah.",
    audio_url: "/music/Messiah wangu.mp3",
    language_tags: ["Shona"],
    track_number: 2,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 25, text: "Ndiye mutendane Messiah wangu" },
      { time: 31, text: "Ndiye mutendane Messiah wangu" },
      { time: 37, text: "Ndiye mutendane Messiah wangu" },
      { time: 43, text: "Ndiye mutendane Messiah wangu" },
      { time: 50, text: "Zvaakanditira zvikuru" },
      { time: 56, text: "Ndichamuitirawo kwakandipisa mwoyo" },
      { time: 62, text: "Ndakapinda nemakaoma, ndava nemarwadzo" },
      { time: 69, text: "Ndiye mutendane Messiah wangu" },
      { time: 75, text: "Ndiye mutendane Messiah wangu" },
      { time: 81, text: "Ndiye mutendane Messiah wangu" },
      { time: 89, text: "Ndichamupa chimba iro chekurumbidza" },
      { time: 95, text: "Ndichamunamata manguva dzose" },
      { time: 101, text: "Ndichapupura zita rake kumarudzi ose" },
      { time: 107, text: "Ndichamupa zvegumi nezvipo, ndichamutevera mazuva ose eupenyu wangu" },
      { time: 114, text: "[Instrumental Solo]" },
      { time: 164, text: "Ndichamupa chimba iro chekurumbidza" },
      { time: 170, text: "Ndichamunamata manguva dzose" },
      { time: 176, text: "Ndichapupura zita rake kumarudzi ose" },
      { time: 182, text: "Ndichamupa zvegumi nezvipo, ndichamutevera mazuva ose eupenyu wangu" },
      { time: 190, text: "[Instrumental Outro]" }
    ]
  },
  {
    id: "music-3",
    title: "Ndichaimbira Mwari",
    description: "A powerful declaration of worship: 'I will sing to God as long as I live.'",
    audio_url: "/music/Ndichaimbira Mwari.mp3",
    language_tags: ["Shona"],
    track_number: 3,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro with vocal ad-libs]" },
      { time: 35, text: "Ndichaimbira Mwari wekudenga, nekuti akandiponesa" },
      { time: 46, text: "Ndichaimbira Mwari wekudenga, nekuti akandiponesa" },
      { time: 57, text: "Ndichaimbira Mwari wekudenga, nekuti akandiponesa" },
      { time: 68, text: "Akandiponesa" },
      { time: 74, text: "Akandiponesa" },
      { time: 80, text: "Akandiponesa" },
      { time: 85, text: "Akandiponesa" },
      { time: 91, text: "Ndichatambira Mwari wekudenga, nekuti akandiponesa" },
      { time: 102, text: "Ndichatambira Mwari wekudenga, nekuti akandiponesa" },
      { time: 113, text: "Ndichatambira Mwari wekudenga, nekuti akandiponesa" },
      { time: 124, text: "Akandiponesa" },
      { time: 130, text: "Akandiponesa" },
      { time: 136, text: "Akandiponesa" },
      { time: 141, text: "Akandiponesa" },
      { time: 147, text: "Ndichashandira Mwari wekudenga, nekuti akandiponesa" },
      { time: 158, text: "Ndichashandira Mwari wekudenga, nekuti akandiponesa" },
      { time: 169, text: "Ndichashandira Mwari wekudenga, nekuti akandiponesa" },
      { time: 180, text: "Ndichashandira Mwari wekudenga, nekuti akandiponesa" },
      { time: 190, text: "[Instrumental Outro / Fade out]" }
    ]
  },
  {
    id: "music-4",
    title: "Tichamumbira Hosanna",
    description: "A celebratory Congolese-style rhumba praise song lifting up the name of the Lord.",
    audio_url: "/music/Tichamumbira Hossana.mp3",
    language_tags: ["Shona", "Lingala"],
    track_number: 4,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 22, text: "Toimba Hozana" },
      { time: 29, text: "Toimba Hozana" },
      { time: 36, text: "Toimba Hozana" },
      { time: 43, text: "Toimba Hozana" },
      { time: 50, text: "Jesus is my savior" },
      { time: 57, text: "Jesus is my savior" },
      { time: 64, text: "Jesus is my savior" },
      { time: 71, text: "Jesus is my savior" },
      { time: 78, text: "[Instrumental Bridge Section]" },
      { time: 92, text: "Toimba Hozana" },
      { time: 99, text: "Toimba Hozana" },
      { time: 106, text: "Toimba Hozana" },
      { time: 113, text: "Toimba Hozana" },
      { time: 120, text: "He is my healer" },
      { time: 127, text: "He is my healer" },
      { time: 134, text: "He is my healer" },
      { time: 141, text: "He is my healer" },
      { time: 148, text: "[Instrumental Transition]" },
      { time: 162, text: "I will praise Him" },
      { time: 169, text: "I will praise Him" },
      { time: 176, text: "I will praise Him" },
      { time: 183, text: "I will praise Him" },
      { time: 190, text: "I will sing glory" },
      { time: 197, text: "I will sing glory" },
      { time: 204, text: "I will sing glory" },
      { time: 211, text: "I will sing glory" },
      { time: 218, text: "[Instrumental Solo / Dance Section]" },
      { time: 232, text: "Tichamumbira" },
      { time: 239, text: "Tichamumbira" },
      { time: 246, text: "Tichamumbira" },
      { time: 253, text: "Tichamumbira" },
      { time: 260, text: "Jesus is my savior" },
      { time: 267, text: "Jesus is my savior" },
      { time: 274, text: "Jesus is my savior" },
      { time: 281, text: "Jesus is my savior" }
    ]
  },
  {
    id: "music-5",
    title: "Timurumbidze",
    description: "A call to the congregation to lift hands and praise the name of our King.",
    audio_url: "/music/Timurumbidze.mp3",
    language_tags: ["Shona"],
    track_number: 5,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 18, text: "Makanaka Mwari" },
      { time: 22, text: "Makanaka Ishe" },
      { time: 26, text: "Hakuna akaita semi" },
      { time: 30, text: "Marudzi ose anokupfugamira" },
      { time: 35, text: "Kwamuri Mambo" },
      { time: 39, text: "We madzimambo" },
      { time: 43, text: "We madzimambo" },
      { time: 48, text: "Vafundisi paridzai" },
      { time: 52, text: "Vavhangeri pamberi" },
      { time: 56, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 64, text: "Vafundisi paridzai" },
      { time: 68, text: "Vavhangeri pamberi" },
      { time: 72, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 80, text: "Vatungamiri fambai" },
      { time: 84, text: "Mungandinzwe mose" },
      { time: 88, text: "Shoko raMwari fambai naro" },
      { time: 93, text: "Dzidzisai vanhu kururama" },
      { time: 98, text: "Titsvake utano" },
      { time: 102, text: "Mweya waMwari" },
      { time: 106, text: "Uvandutse mwoyo yedu" },
      { time: 110, text: "Timbe Hosana" },
      { time: 114, text: "Mazuva mose" },
      { time: 119, text: "Vafundisi paridzai" },
      { time: 123, text: "Vavhangeri pamberi" },
      { time: 127, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 135, text: "Vafundisi paridzai" },
      { time: 139, text: "Vavhangeri pamberi" },
      { time: 143, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 152, text: "[Instrumental Solo / Dance Section]" },
      { time: 181, text: "Ngatikutendei Jesu" },
      { time: 185, text: "Wakauya panyika" },
      { time: 189, text: "Kuzotiponesa, nyasha dzedu dzofara" },
      { time: 193, text: "Murudo rwaMwari" },
      { time: 197, text: "Kure kure" },
      { time: 201, text: "Kure kure kwatabva" },
      { time: 205, text: "Zvaisava zvanyore" },
      { time: 209, text: "Mwari akatiratidza nyasha" },
      { time: 213, text: "Kure kure" },
      { time: 217, text: "Kure kure kwatabva" },
      { time: 221, text: "Zvaisava zvanyore" },
      { time: 225, text: "Mwari akatiratidza nyasha" },
      { time: 229, text: "Kure kure" },
      { time: 233, text: "Kure kure kwatabva" },
      { time: 237, text: "Zvaisava zvanyore" },
      { time: 241, text: "Mwari akatiratidza nyasha" },
      { time: 245, text: "Vafundisi paridzai" },
      { time: 249, text: "Vavhangeri pamberi" },
      { time: 253, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 262, text: "Vafundisi paridzai" },
      { time: 266, text: "Vavhangeri pamberi" },
      { time: 270, text: "Vaimbi tipirei nziyo, timurumbidze Ishe" },
      { time: 279, text: "[Instrumental Outro]" }
    ]
  },
  {
    id: "music-6",
    title: "Vana Vangu",
    description: "A pastoral message and prayer set to music, dedicated to shepherding the family and youth.",
    audio_url: "/music/Vana vangu.mp3",
    language_tags: ["Shona"],
    track_number: 6,
    cover_image_url: "/images/laxon.jpeg",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 22, text: "Ana anga nditsogolera bwino" },
      { time: 27, text: "Mwana wanga usasiye Mulungu wa tate" },
      { time: 34, text: "Yangana kumwamba ndokusankha Mulungu uyu" },
      { time: 42, text: "Zinavuta koma Mulungu adakuendetsa ndicho somo" },
      { time: 48, text: "Kondwera m'malamulo a Yehova masiku onse" },
      { time: 54, text: "Usatsatatsate anthu opanda nzeru" },
      { time: 59, text: "The future is bright, usataye mtima ngakhale zikuoneka ngati" },
      { time: 65, text: "Palibe chikuyenda, ndi nyengo chabe" },
      { time: 70, text: "Yangana, yangana kwa Yesu, Woyambitsa ndiponso Wotsiriza" },
      { time: 76, text: "Wachikulu kupilira chotero, musawope musachite mantha" },
      { time: 81, text: "Mulungu ali nanu" },
      { time: 85, text: "Ana anga" },
      { time: 88, text: "Mulungu ali nanu" },
      { time: 91, text: "Ana anga" },
      { time: 94, text: "Yangana, yangana kwa Yesu, Woyambitsa ndiponso Wotsiriza" },
      { time: 100, text: "Wachikulu kupilira chotero, musawope musachite mantha" },
      { time: 105, text: "Mulungu ali nanu" },
      { time: 109, text: "Ana anga" },
      { time: 112, text: "Mulungu ali nanu" },
      { time: 115, text: "Ana anga" },
      { time: 118, text: "Ethel, providence, and praise" },
      { time: 124, text: "Ulanji kuti mukwanitse kweza dzina la Mulungu, Iye ali nanu" },
      { time: 130, text: "Usatembenucheko kumanja kapena kumanzere, Iye..." },
      { time: 140, text: "...adzakutsogolerani inu" },
      { time: 147, text: "Yendani ndi Mulungu, usiku ndi usana" },
      { time: 155, text: "Adzakusungani masiku onse a moyo wanu" },
      { time: 165, text: "Musamsiye" },
      { time: 168, text: "Musamsiye, musamsiye" },
      { time: 172, text: "Yangana, yangana kwa Yesu, Woyambitsa ndiponso Wotsiriza" },
      { time: 178, text: "Wachikulu kupilira chotero, musawope musachite mantha" },
      { time: 183, text: "Mulungu ali nanu" },
      { time: 187, text: "Ana anga" },
      { time: 190, text: "Mulungu ali nanu" },
      { time: 192, text: "Ana anga" },
      { time: 196, text: "Yangana, yangana kwa Yesu, Woyambitsa ndiponso Wotsiriza" },
      { time: 202, text: "Wachikulu kupilira chotero, musawope musachite mantha" },
      { time: 207, text: "Mulungu ali nanu" },
      { time: 211, text: "Ana anga" },
      { time: 214, text: "Mulungu ali nanu" },
      { time: 217, text: "Ana anga" },
      { time: 222, text: "[Choir hums softly with instrumental]" },
      { time: 255, text: "[Pastor Laxon Nyamadzawo offers a prayer]" },
      { time: 285, text: "\"Baba, tinoropafadza vana vedu...\"" },
      { time: 315, text: "\"Ndinonyengetera kuti vave musoro kwete muswe...\"" },
      { time: 345, text: "\"Kudzivirira kwenyu ngakuve pamusoro pavo...\"" },
      { time: 390, text: "[Choir continues in worship]" },
      { time: 450, text: "[Soprano and acoustic guitar flow]" },
      { time: 510, text: "[Strings and keyboard pad]" },
      { time: 600, text: "[Congregation in soft prayer]" },
      { time: 720, text: "[Pastoral Benediction]" },
      { time: 832, text: "[Outro Acoustic Fade]" }
    ]
  }
]

// Memory database for message submissions (in-memory mock store)
const mockMessagesStore: ContactMessage[] = [];

// Exported high-fidelity data services
export const databaseService = {
  async uploadPublicFile(bucket: string, file: File, folder = "uploads"): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
    }

    const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "";
    const baseName = sanitizeFilenamePart(file.name.replace(/\.[^.]+$/, "")) || "file";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}${fileExt ? `.${fileExt}` : ""}`;
    const objectPath = `${sanitizeFilenamePart(folder) || "uploads"}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return data.publicUrl;
  },

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
    let baseTracks = MOCK_MUSIC;
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("music")
        .select("*")
        .order("track_number", { ascending: true });
      if (!error && data) {
        baseTracks = data as MusicTrack[];
      } else {
        console.warn("Supabase fetch failed, falling back to mock music:", error);
      }
    }

    if (typeof window !== "undefined") {
      try {
        const statsStr = localStorage.getItem("laxon_music_stats") || "{}";
        const stats = JSON.parse(statsStr);
        return baseTracks.map((t) => ({
          ...t,
          plays_count: stats[t.id]?.plays || 0,
          downloads_count: stats[t.id]?.downloads || 0,
        }));
      } catch (e) {
        console.error("Failed to parse music stats:", e);
      }
    }
    return baseTracks.map((t) => ({ ...t, plays_count: 0, downloads_count: 0 }));
  },

  async trackPlay(trackId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // If live database, we would run a rpc function or increment query here:
      // await supabase.rpc('increment_track_plays', { track_id: trackId });
    }
    if (typeof window !== "undefined") {
      try {
        const statsStr = localStorage.getItem("laxon_music_stats") || "{}";
        const stats = JSON.parse(statsStr);
        if (!stats[trackId]) stats[trackId] = { plays: 0, downloads: 0 };
        stats[trackId].plays += 1;
        localStorage.setItem("laxon_music_stats", JSON.stringify(stats));
      } catch (e) {
        console.error("Failed to track play:", e);
      }
    }
  },

  async trackDownload(trackId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // If live database:
      // await supabase.rpc('increment_track_downloads', { track_id: trackId });
    }
    if (typeof window !== "undefined") {
      try {
        const statsStr = localStorage.getItem("laxon_music_stats") || "{}";
        const stats = JSON.parse(statsStr);
        if (!stats[trackId]) stats[trackId] = { plays: 0, downloads: 0 };
        stats[trackId].downloads += 1;
        localStorage.setItem("laxon_music_stats", JSON.stringify(stats));
      } catch (e) {
        console.error("Failed to track download:", e);
      }
    }
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
  },

  // --- Writings Admin Operations ---
  async createWriting(writing: Omit<Writing, "id" | "published_at">): Promise<Writing> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("writings")
        .insert([writing])
        .select()
        .single();
      if (!error && data) return data as Writing;
      throw error || new Error("Failed to create writing");
    }
    const newWriting: Writing = {
      ...writing,
      id: `writing-${Math.random().toString(36).substr(2, 9)}`,
      published_at: new Date().toISOString()
    };
    MOCK_WRITINGS.unshift(newWriting);
    return newWriting;
  },

  async updateWriting(id: string, writing: Partial<Writing>): Promise<Writing> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("writings")
        .update(writing)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as Writing;
      throw error || new Error("Failed to update writing");
    }
    const idx = MOCK_WRITINGS.findIndex(w => w.id === id);
    if (idx >= 0) {
      MOCK_WRITINGS[idx] = { ...MOCK_WRITINGS[idx], ...writing };
      return MOCK_WRITINGS[idx];
    }
    throw new Error("Writing not found");
  },

  async deleteWriting(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("writings")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return;
    }
    const idx = MOCK_WRITINGS.findIndex(w => w.id === id);
    if (idx >= 0) MOCK_WRITINGS.splice(idx, 1);
  },

  // --- Music Admin Operations ---
  async createTrack(track: Omit<MusicTrack, "id" | "plays_count" | "downloads_count">): Promise<MusicTrack> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("music")
        .insert([track])
        .select()
        .single();
      if (!error && data) return data as MusicTrack;
      throw error || new Error("Failed to create track");
    }
    const newTrack: MusicTrack = {
      ...track,
      id: `track-${Math.random().toString(36).substr(2, 9)}`,
      plays_count: 0,
      downloads_count: 0
    };
    MOCK_MUSIC.push(newTrack);
    return newTrack;
  },

  async updateTrack(id: string, track: Partial<MusicTrack>): Promise<MusicTrack> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("music")
        .update(track)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as MusicTrack;
      throw error || new Error("Failed to update track");
    }
    const idx = MOCK_MUSIC.findIndex(t => t.id === id);
    if (idx >= 0) {
      MOCK_MUSIC[idx] = { ...MOCK_MUSIC[idx], ...track };
      return MOCK_MUSIC[idx];
    }
    throw new Error("Track not found");
  },

  async deleteTrack(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("music")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return;
    }
    const idx = MOCK_MUSIC.findIndex(t => t.id === id);
    if (idx >= 0) MOCK_MUSIC.splice(idx, 1);
  },

  // --- Page Content Admin Operations ---
  async getPageContent<T>(key: string, fallback: T): Promise<T> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("page_content")
          .select("content")
          .eq("key", key)
          .single();
        if (!error && data?.content) return data.content as T;
      } catch (e) {
        console.warn("Failed to get page content from Supabase:", e);
      }
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`laxon_page_content_${key}`);
        if (stored) return JSON.parse(stored) as T;
      } catch {}
    }
    return fallback;
  },

  async updatePageContent<T>(key: string, content: T): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("page_content")
        .upsert({ key, content }, { onConflict: "key" });
      if (!error) return;
      console.warn("Supabase upsert for page_content failed:", error);
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`laxon_page_content_${key}`, JSON.stringify(content));
      } catch (e) {
        console.error("Local storage page content save failed:", e);
      }
    }
  },

  async migrateCurrentContent(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.");
    }

    for (const writing of MOCK_WRITINGS) {
      const payload = {
        title: writing.title,
        slug: writing.slug,
        excerpt: writing.excerpt,
        content: writing.content,
        category: writing.category,
        published: writing.published,
        published_at: writing.published_at,
        cover_image_url: writing.cover_image_url,
        reading_time: writing.reading_time,
      };

      const { data: existingWriting, error: lookupError } = await supabase
        .from("writings")
        .select("id")
        .eq("slug", writing.slug)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existingWriting?.id) {
        const { error } = await supabase.from("writings").update(payload).eq("id", existingWriting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("writings").insert(payload);
        if (error) throw error;
      }
    }

    for (const track of MOCK_MUSIC) {
      const payload = {
        title: track.title,
        description: track.description,
        youtube_url: track.youtube_url,
        audio_url: track.audio_url,
        language_tags: track.language_tags,
        track_number: track.track_number,
        plays_count: track.plays_count || 0,
        downloads_count: track.downloads_count || 0,
        cover_image_url: track.cover_image_url,
        lyrics: track.lyrics || [],
      };

      const { data: existingTrack, error: lookupError } = await supabase
        .from("music")
        .select("id")
        .eq("title", track.title)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existingTrack?.id) {
        const { error } = await supabase.from("music").update(payload).eq("id", existingTrack.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("music").insert(payload);
        if (error) throw error;
      }
    }

    const homepagePayload: HomepageContent = defaultHomepageContent;
    const { error: homepageError } = await supabase
      .from("page_content")
      .upsert({ key: "homepage_content", content: homepagePayload }, { onConflict: "key" });

    if (homepageError) throw homepageError;
  },

  // --- Messages Inbox Admin Operations ---
  async updateMessageStatus(id: string, status: ContactMessage["status"]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("messages")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      return;
    }
    const msg = mockMessagesStore.find(m => m.id === id);
    if (msg) msg.status = status;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("laxon_website_messages");
        if (stored) {
          const parsed = JSON.parse(stored) as ContactMessage[];
          const m = parsed.find(item => item.id === id);
          if (m) m.status = status;
          localStorage.setItem("laxon_website_messages", JSON.stringify(parsed));
        }
      } catch {}
    }
  },

  async deleteMessage(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return;
    }
    const idx = mockMessagesStore.findIndex(m => m.id === id);
    if (idx >= 0) mockMessagesStore.splice(idx, 1);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("laxon_website_messages");
        if (stored) {
          const parsed = JSON.parse(stored) as ContactMessage[];
          const filtered = parsed.filter(item => item.id !== id);
          localStorage.setItem("laxon_website_messages", JSON.stringify(filtered));
        }
      } catch {}
    }
  }
};
