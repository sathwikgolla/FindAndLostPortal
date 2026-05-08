import { useMemo, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Dropzone({
  label,
  onFiles
}: {
  label: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);

  return (
    <div className="w-full">
      <div className="mb-2 text-xs font-semibold text-white">{label}</div>
      <div
        className={cn(
          "glass group relative overflow-hidden rounded-2xl p-4 shadow-soft transition hover:shadow-glow"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const list = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith("image/"));
          setFiles(list);
          onFiles(list);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const list = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
            setFiles(list);
            onFiles(list);
          }}
        />
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-2 py-2 text-left text-white"
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[rgba(6,182,212,0.14)]">
              <UploadCloud className="h-5 w-5 text-white" />
            </span>
            <div>
              <div className="text-sm font-semibold">Drag & drop images</div>
              <div className="text-xs text-white">or click to upload (JPG/PNG/WebP)</div>
            </div>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Browse
          </span>
        </button>

        {previews.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.slice(0, 6).map((p) => (
              <div key={p.url} className="relative overflow-hidden rounded-2xl bg-white/5">
                <img src={p.url} alt={p.file.name} className="h-28 w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/70"
                  onClick={() => {
                    const next = files.filter((f) => f !== p.file);
                    setFiles(next);
                    onFiles(next);
                  }}
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
