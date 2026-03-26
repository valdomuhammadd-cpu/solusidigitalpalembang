import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

type Todo = {
  id: string;
  name: string;
};

export default async function DebugSupabasePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <h1 className="font-headline text-3xl font-black tracking-tight text-text">Debug Supabase (Admin)</h1>
      <p className="mt-2 text-sm text-text/60">Testing ground for SSR Supabase queries.</p>

      {error ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error.message}</p>
      ) : null}

      <ul className="mt-6 space-y-2">
        {(todos as Todo[] | null)?.map((todo) => (
          <li key={todo.id} className="rounded border border-gray-200 bg-white p-3 text-sm">
            {todo.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
