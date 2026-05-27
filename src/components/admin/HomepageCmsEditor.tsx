"use client";

import type React from "react";
import Image from "next/image";
import { Globe, RefreshCw, Save } from "lucide-react";
import { defaultHomepageContent, HomepageContent, HomepageFamilyProfile } from "@/lib/homepage-content";

type Props = {
  draft: HomepageContent;
  saving: boolean;
  migrating: boolean;
  onSave: (event: React.FormEvent) => void;
  onMigrate: () => void;
  onUploadImage: (file: File, folder: string) => Promise<string>;
  setDraft: React.Dispatch<React.SetStateAction<HomepageContent>>;
  uploadingField: string | null;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#7d2cc0]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#7d2cc0]"
      />
    </label>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  return (
    <div className="space-y-3">
      <Field label={label} value={value} onChange={onChange} />
      <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/8">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            await onUpload(file);
            event.target.value = "";
          }}
        />
        {uploading ? "Uploading image..." : "Upload from images bucket"}
      </label>
    </div>
  );
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value: string[]) {
  return value.join("\n");
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-white/[0.03] p-4 sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/45">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HomepageCmsEditor({ draft, saving, migrating, onSave, onMigrate, onUploadImage, setDraft, uploadingField }: Props) {
  const updateProfile = (key: "parents" | "ethel" | "providence" | "praise", updater: (profile: HomepageFamilyProfile) => HomepageFamilyProfile) => {
    setDraft((current) => ({
      ...current,
      family: {
        ...current.family,
        [key]: updater(current.family[key]),
      },
    }));
  };

  const previewProfiles: Array<{ key: "parents" | "ethel" | "providence" | "praise"; label: string }> = [
    { key: "parents", label: "Parents" },
    { key: "ethel", label: "Ethel" },
    { key: "providence", label: "Providence" },
    { key: "praise", label: "Praise" },
  ];

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-black/20 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#7d2cc0]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c58cff]">
            <Globe size={14} />
            Homepage CMS
          </div>
          <h2 className="mt-3 text-2xl font-serif font-bold text-white">Edit every homepage section from one document</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/45">
            This editor writes to `page_content.homepage_content`, and the public homepage reads the same structured payload.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onMigrate}
            disabled={migrating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={migrating ? "animate-spin" : ""} />
            {migrating ? "Migrating..." : "Migrate Current Content"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5b1d8f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6b25a8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Homepage"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <SectionCard title="Hero" description="Top-of-page messaging and primary CTAs.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={draft.hero.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, eyebrow: value } }))} />
              <Field label="Highlight" value={draft.hero.highlight} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, highlight: value } }))} />
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title" value={draft.hero.title} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, title: value } }))} />
              <TextAreaField label="Description" rows={3} value={draft.hero.description} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, description: value } }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary CTA" value={draft.hero.primaryCtaLabel} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, primaryCtaLabel: value } }))} />
                <Field label="Secondary CTA" value={draft.hero.secondaryCtaLabel} onChange={(value) => setDraft((current) => ({ ...current, hero: { ...current.hero, secondaryCtaLabel: value } }))} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Feature Cards" description="Three quick-value cards below the hero.">
            <div className="space-y-4">
              {draft.featureCards.map((card, index) => (
                <div key={`${card.title}-${index}`} className="rounded-3xl border border-white/8 bg-black/15 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Card {index + 1}</p>
                  <div className="grid gap-4">
                    <Field
                      label="Title"
                      value={card.title}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          featureCards: current.featureCards.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, title: value } : item,
                          ),
                        }))
                      }
                    />
                    <TextAreaField
                      label="Description"
                      rows={3}
                      value={card.description}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          featureCards: current.featureCards.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, description: value } : item,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Music Preview Strip" description="Homepage promo just above the main sections.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={draft.musicPreview.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, eyebrow: value } }))} />
              <Field label="Highlight" value={draft.musicPreview.highlight} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, highlight: value } }))} />
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title" value={draft.musicPreview.title} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, title: value } }))} />
              <TextAreaField label="Description" rows={3} value={draft.musicPreview.description} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, description: value } }))} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary CTA" value={draft.musicPreview.primaryCtaLabel} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, primaryCtaLabel: value } }))} />
                <Field label="Secondary CTA" value={draft.musicPreview.secondaryCtaLabel} onChange={(value) => setDraft((current) => ({ ...current, musicPreview: { ...current.musicPreview, secondaryCtaLabel: value } }))} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="About Section" description="Biography copy, bullets, and image.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={draft.about.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, eyebrow: value } }))} />
              <Field label="Highlight" value={draft.about.highlight} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, highlight: value } }))} />
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title" value={draft.about.title} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, title: value } }))} />
              <TextAreaField label="Narrative" rows={6} value={draft.about.narrative} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, narrative: value } }))} />
              <TextAreaField
                label="Bullet points (one per line)"
                rows={4}
                value={joinLines(draft.about.bulletPoints)}
                onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, bulletPoints: splitLines(value) } }))}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="CTA label" value={draft.about.ctaLabel} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, ctaLabel: value } }))} />
                <ImageUploadField
                  label="Image URL"
                  value={draft.about.image}
                  uploading={uploadingField === "homepage-about"}
                  onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, image: value } }))}
                  onUpload={async (file) => {
                    const url = await onUploadImage(file, "homepage-about");
                    setDraft((current) => ({ ...current, about: { ...current.about, image: url } }));
                  }}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Years value" value={draft.about.yearsValue} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, yearsValue: value } }))} />
                <Field label="Years label" value={draft.about.yearsLabel} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, yearsLabel: value } }))} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Family Section" description="Section heading and all four profile cards.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={draft.family.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, family: { ...current.family, eyebrow: value } }))} />
              <Field label="Highlight" value={draft.family.highlight} onChange={(value) => setDraft((current) => ({ ...current, family: { ...current.family, highlight: value } }))} />
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title" value={draft.family.title} onChange={(value) => setDraft((current) => ({ ...current, family: { ...current.family, title: value } }))} />
              <TextAreaField label="Description" rows={4} value={draft.family.description} onChange={(value) => setDraft((current) => ({ ...current, family: { ...current.family, description: value } }))} />
            </div>
            <div className="mt-5 space-y-4">
              {previewProfiles.map(({ key, label }) => {
                const profile = draft.family[key];
                return (
                  <div key={key} className="rounded-3xl border border-white/8 bg-black/15 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Name" value={profile.name} onChange={(value) => updateProfile(key, (current) => ({ ...current, name: value }))} />
                      <Field label="Badge" value={profile.badge} onChange={(value) => updateProfile(key, (current) => ({ ...current, badge: value }))} />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <Field label="Role / headline" value={profile.role} onChange={(value) => updateProfile(key, (current) => ({ ...current, role: value }))} />
                      <Field label="Credentials" value={profile.credentials} onChange={(value) => updateProfile(key, (current) => ({ ...current, credentials: value }))} />
                      <ImageUploadField
                        label="Image URL"
                        value={profile.image}
                        uploading={uploadingField === `homepage-${key}`}
                        onChange={(value) => updateProfile(key, (current) => ({ ...current, image: value }))}
                        onUpload={async (file) => {
                          const url = await onUploadImage(file, `homepage-${key}`);
                          updateProfile(key, (current) => ({ ...current, image: url }));
                        }}
                      />
                      <TextAreaField label="Description" rows={4} value={profile.description} onChange={(value) => updateProfile(key, (current) => ({ ...current, description: value }))} />
                      <TextAreaField
                        label="Features (one per line)"
                        rows={4}
                        value={joinLines(profile.features)}
                        onChange={(value) => updateProfile(key, (current) => ({ ...current, features: splitLines(value) }))}
                      />
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Primary stat value" value={profile.statPrimaryValue} onChange={(value) => updateProfile(key, (current) => ({ ...current, statPrimaryValue: value }))} />
                      <Field label="Primary stat label" value={profile.statPrimaryLabel} onChange={(value) => updateProfile(key, (current) => ({ ...current, statPrimaryLabel: value }))} />
                      <Field label="Secondary stat value" value={profile.statSecondaryValue} onChange={(value) => updateProfile(key, (current) => ({ ...current, statSecondaryValue: value }))} />
                      <Field label="Secondary stat label" value={profile.statSecondaryLabel} onChange={(value) => updateProfile(key, (current) => ({ ...current, statSecondaryLabel: value }))} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Ministry Section" description="Section heading and ministry cards.">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Eyebrow" value={draft.ministry.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, ministry: { ...current.ministry, eyebrow: value } }))} />
                <Field label="Title" value={draft.ministry.title} onChange={(value) => setDraft((current) => ({ ...current, ministry: { ...current.ministry, title: value } }))} />
              </div>
              <TextAreaField label="Description" rows={3} value={draft.ministry.description} onChange={(value) => setDraft((current) => ({ ...current, ministry: { ...current.ministry, description: value } }))} />
              {draft.ministry.items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-3xl border border-white/8 bg-black/15 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Ministry Card {index + 1}</p>
                  <div className="grid gap-4">
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          ministry: {
                            ...current.ministry,
                            items: current.ministry.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, title: value } : entry,
                            ),
                          },
                        }))
                      }
                    />
                    <ImageUploadField
                      label="Image URL"
                      value={item.img}
                      uploading={uploadingField === `homepage-ministry-${index + 1}`}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          ministry: {
                            ...current.ministry,
                            items: current.ministry.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, img: value } : entry,
                            ),
                          },
                        }))
                      }
                      onUpload={async (file) => {
                        const url = await onUploadImage(file, `homepage-ministry-${index + 1}`);
                        setDraft((current) => ({
                          ...current,
                          ministry: {
                            ...current.ministry,
                            items: current.ministry.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, img: url } : entry,
                            ),
                          },
                        }));
                      }}
                    />
                    <TextAreaField
                      label="Description"
                      rows={3}
                      value={item.text}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          ministry: {
                            ...current.ministry,
                            items: current.ministry.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, text: value } : entry,
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Music + Writings Sections" description="Headings and CTA labels for the lower content bands.">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-3xl border border-white/8 bg-black/15 p-4">
                <h4 className="text-sm font-semibold text-white">Music Section</h4>
                <Field label="Eyebrow" value={draft.musicSection.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, musicSection: { ...current.musicSection, eyebrow: value } }))} />
                <Field label="Title" value={draft.musicSection.title} onChange={(value) => setDraft((current) => ({ ...current, musicSection: { ...current.musicSection, title: value } }))} />
                <TextAreaField label="Description" rows={3} value={draft.musicSection.description} onChange={(value) => setDraft((current) => ({ ...current, musicSection: { ...current.musicSection, description: value } }))} />
                <Field label="CTA label" value={draft.musicSection.ctaLabel} onChange={(value) => setDraft((current) => ({ ...current, musicSection: { ...current.musicSection, ctaLabel: value } }))} />
              </div>
              <div className="space-y-4 rounded-3xl border border-white/8 bg-black/15 p-4">
                <h4 className="text-sm font-semibold text-white">Writings Section</h4>
                <Field label="Eyebrow" value={draft.writingsSection.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, writingsSection: { ...current.writingsSection, eyebrow: value } }))} />
                <Field label="Title" value={draft.writingsSection.title} onChange={(value) => setDraft((current) => ({ ...current, writingsSection: { ...current.writingsSection, title: value } }))} />
                <TextAreaField label="Description" rows={3} value={draft.writingsSection.description} onChange={(value) => setDraft((current) => ({ ...current, writingsSection: { ...current.writingsSection, description: value } }))} />
                <Field label="CTA label" value={draft.writingsSection.ctaLabel} onChange={(value) => setDraft((current) => ({ ...current, writingsSection: { ...current.writingsSection, ctaLabel: value } }))} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contact Section" description="Contact copy, cards, and form messaging.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={draft.contact.eyebrow} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, eyebrow: value } }))} />
              <Field label="Highlight" value={draft.contact.highlight} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, highlight: value } }))} />
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Title" value={draft.contact.title} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, title: value } }))} />
              <TextAreaField label="Description" rows={3} value={draft.contact.description} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, description: value } }))} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Form title" value={draft.contact.formTitle} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, formTitle: value } }))} />
                <Field label="Success title" value={draft.contact.successTitle} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, successTitle: value } }))} />
                <Field label="Success message" value={draft.contact.successMessage} onChange={(value) => setDraft((current) => ({ ...current, contact: { ...current.contact, successMessage: value } }))} />
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {draft.contact.items.map((item, index) => (
                <div key={`${item.label}-${index}`} className="rounded-3xl border border-white/8 bg-black/15 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Contact Item {index + 1}</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field
                      label="Icon"
                      value={item.icon}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          contact: {
                            ...current.contact,
                            items: current.contact.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, icon: value } : entry,
                            ),
                          },
                        }))
                      }
                    />
                    <Field
                      label="Label"
                      value={item.label}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          contact: {
                            ...current.contact,
                            items: current.contact.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, label: value } : entry,
                            ),
                          },
                        }))
                      }
                    />
                    <Field
                      label="Value"
                      value={item.value}
                      onChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          contact: {
                            ...current.contact,
                            items: current.contact.items.map((entry, entryIndex) =>
                              entryIndex === index ? { ...entry, value: value } : entry,
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <SectionCard title="Live Preview" description="A compact mobile-first preview of the current homepage content.">
            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#06020c]">
              <div className="relative aspect-[9/16]">
                <Image
                  src={draft.about.image || defaultHomepageContent.about.image}
                  alt="Homepage preview"
                  fill
                  sizes="360px"
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/75 to-black" />
                <div className="absolute inset-0 overflow-y-auto p-4">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">{draft.hero.eyebrow}</p>
                    <h4 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">
                      {draft.hero.title} <span className="text-gold-300">{draft.hero.highlight}</span>
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{draft.hero.description}</p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {draft.featureCards.map((card, index) => (
                      <div key={`${card.title}-${index}`} className="rounded-3xl border border-white/8 bg-white/[0.05] p-4">
                        <p className="text-sm font-semibold text-white">{card.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/55">{card.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.05] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">{draft.about.eyebrow}</p>
                    <h5 className="mt-2 font-serif text-xl text-white">
                      {draft.about.title} <span className="text-gold-300">{draft.about.highlight}</span>
                    </h5>
                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-white/60">{draft.about.narrative}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draft.about.bulletPoints.map((item) => (
                        <span key={item} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/70">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.05] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">{draft.family.eyebrow}</p>
                    <h5 className="mt-2 font-serif text-xl text-white">
                      {draft.family.title} <span className="text-gold-300">{draft.family.highlight}</span>
                    </h5>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">{draft.family.description}</p>
                    <div className="mt-3 space-y-2">
                      {previewProfiles.map(({ key }) => {
                        const profile = draft.family[key];
                        return (
                          <div key={key} className="rounded-2xl border border-white/8 bg-black/20 p-3">
                            <p className="text-sm font-semibold text-white">{profile.name}</p>
                            <p className="mt-1 text-[11px] text-white/55">{profile.role}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/8 bg-white/[0.05] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">{draft.contact.eyebrow}</p>
                    <h5 className="mt-2 font-serif text-xl text-white">
                      {draft.contact.title} <span className="text-gold-300">{draft.contact.highlight}</span>
                    </h5>
                    <p className="mt-2 text-xs leading-relaxed text-white/60">{draft.contact.description}</p>
                    <div className="mt-3 space-y-2">
                      {draft.contact.items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2 rounded-2xl bg-black/20 px-3 py-2 text-xs text-white/70">
                          <span>{item.icon}</span>
                          <span>{item.label}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </aside>
      </div>
    </form>
  );
}
