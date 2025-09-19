import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function CategoryInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addCategory = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addCategory())
          }
          placeholder="Tambah kategori lalu Enter"
        />
        <Button type="button" onClick={addCategory}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((cat) => (
          <span
            key={cat}
            className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
          >
            {cat}
            <button
              type="button"
              onClick={() => onChange(value.filter((c) => c !== cat))}
              className="ml-1 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
