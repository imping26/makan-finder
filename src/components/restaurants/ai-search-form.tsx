"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aiSearch } from "@/lib/actions/ai-search";
import type { AiSearchState } from "@/lib/validations/ai-search";

const initialState: AiSearchState = {};

export function AiSearchForm() {
  const [state, formAction, pending] = useActionState(aiSearch, initialState);
  return (
    <form className="mb-6 grid gap-2 rounded-lg border p-4" action={formAction}>
      <Label htmlFor="ai-query">Describe what you feel like eating</Label>
      <div className="flex gap-2">
        <Input
          id="ai-query"
          name="query"
          placeholder="e.g. cheap halal breakfast in Penang"
          required
          minLength={3}
          maxLength={200}
          defaultValue={state.query}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Thinking…" : "Ask AI"}
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
