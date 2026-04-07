"use client";

import { useEffect, useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type Category = {
  id: string;
  name: string;
};

export function CategoryCombobox() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/categories?search=${query}`);
      const data = await res.json();
      setCategories(data);
    };

    fetchCategories();
  }, [query]);

  return (
      <Combobox<Category>
        items={categories}
        itemToStringValue={(item) => item.name}
      >
      <ComboboxInput
        placeholder="Search category..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <ComboboxContent>
        <ComboboxEmpty>No category found.</ComboboxEmpty>

        <ComboboxList>
            {(category: Category) => (
                <ComboboxItem key={category.id} value={category}>
                {category.name}
                </ComboboxItem>
            )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}