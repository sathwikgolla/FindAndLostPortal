import { Select } from "@/components/ui/Select";

export function FiltersRow({
  category,
  setCategory,
  location,
  setLocation,
  type,
  setType,
  status,
  setStatus,
  colour,
  setColour,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo
}: {
  category: string;
  setCategory: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  status: "active" | "solved";
  setStatus: (v: "active" | "solved") => void;
  colour: string;
  setColour: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select
        label="Category"
        value={category}
        onChange={setCategory}
        options={[
          { label: "All", value: "All" },
          { label: "Documents", value: "Documents" },
          { label: "Electronics", value: "Electronics" },
          { label: "Accessories", value: "Accessories" },
          { label: "Keys", value: "Keys" },
          { label: "Other", value: "Other" }
        ]}
      />
      <Select
        label="Location"
        value={location}
        onChange={setLocation}
        options={[
          { label: "Anywhere", value: "Anywhere" },
          { label: "Delhi", value: "Delhi" },
          { label: "Bengaluru", value: "Bengaluru" },
          { label: "Mumbai", value: "Mumbai" }
        ]}
      />
      <Select
        label="Type"
        value={type}
        onChange={setType}
        options={[
          { label: "All", value: "All" },
          { label: "Lost", value: "lost" },
          { label: "Found", value: "found" }
        ]}
      />
      <Select
        label="Status"
        value={status}
        onChange={(v) => setStatus(v as "active" | "solved")}
        options={[
          { label: "Active", value: "active" },
          { label: "Solved", value: "solved" }
        ]}
      />
      <Select
        label="Colour"
        value={colour}
        onChange={setColour}
        options={[
          { label: "All", value: "All" },
          { label: "Black", value: "Black" },
          { label: "Blue", value: "Blue" },
          { label: "Brown", value: "Brown" },
          { label: "Green", value: "Green" },
          { label: "Red", value: "Red" },
          { label: "White", value: "White" },
          { label: "Other", value: "Other" }
        ]}
      />
      <div className="glass relative rounded-2xl shadow-soft transition-shadow focus-within:shadow-glow">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-14 w-full rounded-2xl bg-transparent px-4 text-sm text-white outline-none"
          placeholder="From"
        />
      </div>
      <div className="glass relative rounded-2xl shadow-soft transition-shadow focus-within:shadow-glow">
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-14 w-full rounded-2xl bg-transparent px-4 text-sm text-white outline-none"
          placeholder="To"
        />
      </div>
    </div>
  );
}
