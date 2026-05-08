import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FileText, ImagePlus, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { SidebarShell } from "@/components/layout/SidebarShell";
import { TiltCard } from "@/components/ui/Card";
import { FloatingInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Dropzone } from "@/components/forms/Dropzone";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import { Stepper } from "@/components/ui/Stepper";
import { PageHeader } from "@/components/ui/PageHeader";
import * as itemsApi from "@/api/itemsApi";

export function ReportLostPage() {
  return (
    <SidebarShell activeHref="/report-lost">
      <ReportForm kind="Lost" />
    </SidebarShell>
  );
}

export function ReportFoundPage() {
  return (
    <SidebarShell activeHref="/report-found">
      <ReportForm kind="Found" />
    </SidebarShell>
  );
}

function ReportForm({ kind }: { kind: "Lost" | "Found" }) {
  const router = useRouter();
  const { push } = useToast();
  const steps = ["Basics", "Details", "Photos & Preview"];
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [exactLocation, setExactLocation] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [colour, setColour] = useState("");
  const [details, setDetails] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const [uniqueMarks, setUniqueMarks] = useState("");
  const [reward, setReward] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [lastSeenTime, setLastSeenTime] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [foundTime, setFoundTime] = useState("");
  const [whereStored, setWhereStored] = useState("");
  const [handoverLocation, setHandoverLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (title && title.trim().length < 3) e.title = "Add a more descriptive title.";
    if (location && location.trim().length < 3) e.location = "Add a specific location.";
    if (exactLocation && exactLocation.trim().length < 3) e.exactLocation = "Add an exact location (landmark, gate, etc.).";
    if (colour && colour.trim().length < 2) e.colour = "Add a colour.";
    if (details && details.trim().length < 10) e.details = "Add a few more details.";
    if (step === 2 && files.length === 0) e.images = "Please upload at least one clear item photo.";
    return e;
  }, [colour, details, exactLocation, files.length, location, step, title]);

  const canSubmit =
    title.trim().length >= 3 &&
    location.trim().length >= 3 &&
    exactLocation.trim().length >= 3 &&
    category &&
    colour.trim().length >= 2 &&
    date &&
    details.trim().length >= 10 &&
    files.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        kicker={`Report ${kind} Item`}
        title={kind === "Lost" ? "Let’s help you find it." : "Let’s help return it."}
        subtitle="Multi-step form, drag & drop upload, live preview, and calm premium interactions."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.42fr] lg:items-start">
        <div className="space-y-4">
          <Stepper steps={steps} current={step} />

          <TiltCard className="p-5 sm:p-6">
            <form
              className="grid gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!files.length) {
                  setStep(2);
                  push({ type: "warning", title: "Image required", message: "Please upload at least one clear item photo." });
                  return;
                }
                try {
                  setLoading(true);
                  const fd = new FormData();
                  fd.append("title", title);
                  fd.append("description", details);
                  fd.append("category", category);
                  fd.append("colour", colour);
                  fd.append("location", location);
                  fd.append("exactLocation", exactLocation);
                  fd.append("date", date);
                  if (brand) fd.append("brand", brand);
                  if (model) fd.append("model", model);
                  if (size) fd.append("size", size);
                  if (uniqueMarks) fd.append("uniqueMarks", uniqueMarks);
                  if (reward) fd.append("reward", reward);
                  if (preferredContactMethod) fd.append("preferredContactMethod", preferredContactMethod);
                  if (additionalNotes) fd.append("additionalNotes", additionalNotes);
                  if (contactName) fd.append("contactName", contactName);
                  if (contactEmail) fd.append("contactEmail", contactEmail);
                  if (contactPhone) fd.append("contactPhone", contactPhone);
                  if (kind === "Lost") {
                    if (lastSeenLocation) fd.append("lastSeenLocation", lastSeenLocation);
                    if (lastSeenTime) fd.append("lastSeenTime", lastSeenTime);
                  } else {
                    if (foundLocation) fd.append("foundLocation", foundLocation);
                    if (foundTime) fd.append("foundTime", foundTime);
                    if (whereStored) fd.append("whereStored", whereStored);
                    if (handoverLocation) fd.append("handoverLocation", handoverLocation);
                  }
                  files.forEach((f) => fd.append("images", f));
                  await itemsApi.reportItem(kind.toLowerCase(), fd);
                  push({ type: "success", title: "Item reported successfully", message: "Item reported successfully and is now publicly visible." });
                  router.push("/search");
                } catch (err: any) {
                  push({ type: "warning", title: "Submit failed", message: err?.message || "Please try again." });
                } finally {
                  setLoading(false);
                }
              }}
            >
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FloatingInput label="Item title" value={title} onChange={setTitle} error={errors.title} />
                    <FloatingInput label="Location" value={location} onChange={setLocation} error={errors.location} />
                    <FloatingInput label="Exact location" value={exactLocation} onChange={setExactLocation} error={errors.exactLocation} />
                    <FloatingInput label="Colour" value={colour} onChange={setColour} error={errors.colour} />
                    <FloatingInput label={kind === "Lost" ? "Date lost" : "Date found"} type="date" value={date} onChange={setDate} />
                    <Select
                      label="Category"
                      value={category}
                      onChange={setCategory}
                      options={[
                        { label: "Documents", value: "Documents" },
                        { label: "Electronics", value: "Electronics" },
                        { label: "Accessories", value: "Accessories" },
                        { label: "Keys", value: "Keys" },
                        { label: "Other", value: "Other" }
                      ]}
                    />
                  </div>
                ) : null}

                {step === 1 ? (
                  <div>
                    <div className="mb-2 text-xs font-semibold text-white">Details</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FloatingInput label="Brand (optional)" value={brand} onChange={setBrand} />
                      <FloatingInput label="Model (optional)" value={model} onChange={setModel} />
                      <FloatingInput label="Size (optional)" value={size} onChange={setSize} />
                      <FloatingInput label="Reward (optional)" value={reward} onChange={setReward} />
                      <FloatingInput label="Unique marks (optional)" value={uniqueMarks} onChange={setUniqueMarks} />
                      <FloatingInput label="Preferred contact method (optional)" value={preferredContactMethod} onChange={setPreferredContactMethod} />
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {kind === "Lost" ? (
                        <>
                          <FloatingInput label="Last seen location (optional)" value={lastSeenLocation} onChange={setLastSeenLocation} />
                          <FloatingInput label="Last seen time (optional)" value={lastSeenTime} onChange={setLastSeenTime} />
                        </>
                      ) : (
                        <>
                          <FloatingInput label="Found location (optional)" value={foundLocation} onChange={setFoundLocation} />
                          <FloatingInput label="Found time (optional)" value={foundTime} onChange={setFoundTime} />
                          <FloatingInput label="Where stored (optional)" value={whereStored} onChange={setWhereStored} />
                          <FloatingInput label="Handover location (optional)" value={handoverLocation} onChange={setHandoverLocation} />
                        </>
                      )}
                    </div>
                    <div className="glass rounded-2xl shadow-soft transition-shadow focus-within:shadow-glow">
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        rows={9}
                        className="w-full resize-none rounded-2xl bg-transparent px-4 py-4 text-sm outline-none"
                        placeholder="Add identifying details, color, brand, unique marks…"
                      />
                    </div>
                    {errors.details ? <div className="mt-2 text-xs font-medium text-white">{errors.details}</div> : null}
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <Dropzone label="Photos (required)" onFiles={setFiles} />
                      <div className="mt-2 text-xs text-white">
                        {files.length ? `${files.length} file(s) selected.` : "No files selected."}
                      </div>
                      {errors.images ? <div className="mt-2 text-xs font-semibold text-white">{errors.images}</div> : null}
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <FloatingInput label="Contact name (optional)" value={contactName} onChange={setContactName} />
                        <FloatingInput label="Contact email (optional)" value={contactEmail} onChange={setContactEmail} />
                        <FloatingInput label="Contact phone (optional)" value={contactPhone} onChange={setContactPhone} />
                        <FloatingInput label="Additional notes (optional)" value={additionalNotes} onChange={setAdditionalNotes} />
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-4 shadow-soft">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white">Live preview</div>
                      <div className="mt-2 font-display text-lg font-extrabold tracking-tight text-white">
                        {title || "Item title"}
                      </div>
                      <div className="mt-1 text-sm text-white">{location || "Location"} · {date || "Date"}</div>
                      <div className="mt-3 line-clamp-4 text-sm text-white">
                        {details || "Add details to help someone verify and return your item safely."}
                      </div>
                      <div className="mt-4 rounded-2xl bg-white/10 p-3 text-xs text-white">
                        Photos help matching. Avoid posting sensitive info publicly.
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-white">
                  Tip: Avoid posting sensitive info publicly. Use verification questions.
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                      disabled={(step === 0 && (!title || !location || !date || !category)) || (step === 1 && details.trim().length < 10) || Object.keys(errors).length > 0}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!canSubmit || loading || Object.keys(errors).length > 0}>
                      {loading ? "Submitting…" : `Submit ${kind} Report`}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </TiltCard>
        </div>

        <div className="space-y-4">
          <TiltCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Safety tips</div>
                <div className="mt-1 text-xs text-white">
                  Verify with unique details before meeting. Prefer public locations.
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Better matches</div>
                <div className="mt-1 text-xs text-white">
                  Add a precise location and distinctive description.
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Location hint</div>
                <div className="mt-1 text-xs text-white">
                  Use landmarks (metro station, mall, gate number) when possible.
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
