"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { uploadPublicImage, validateImageFile } from "@/lib/supabase-client";

type PriceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
};

type ShopRow = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  specs: string;
  status: "AVAILABLE" | "SOLD" | "RESERVED";
};

type ProjectRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
};

const priceSchema = z.object({
  id: z.string().min(1),
  price: z.number().int().positive(),
});

const shopSchema = z.object({
  name: z.string().min(3),
  price: z.number().int().positive(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED"]),
  specs: z.string().min(5),
});

const projectSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(3),
  description: z.string().min(8),
});

type Props = {
  labels: {
    title: string;
    priceManagement: string;
    shopInventory: string;
    projectManagement: string;
    save: string;
    create: string;
    delete: string;
    update?: string;
    edit?: string;
  };
  initialPrices: PriceRow[];
  initialShop: ShopRow[];
  initialProjects: ProjectRow[];
};

export function AdminDashboard({ labels, initialPrices, initialShop, initialProjects }: Props) {
  const [prices, setPrices] = useState(initialPrices);
  const [shop, setShop] = useState(initialShop);
  const [projects, setProjects] = useState(initialProjects);
  const [projectQuery, setProjectQuery] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
  const [editingShopId, setEditingShopId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [shopImageUrl, setShopImageUrl] = useState<string>("");
  const [projectImageUrl, setProjectImageUrl] = useState<string>("");
  const [uploadingShop, setUploadingShop] = useState(false);
  const [uploadingProject, setUploadingProject] = useState(false);
  const [uploadProgressShop, setUploadProgressShop] = useState(0);
  const [uploadProgressProject, setUploadProgressProject] = useState(0);
  const [shopUploadError, setShopUploadError] = useState<string | null>(null);
  const [projectUploadError, setProjectUploadError] = useState<string | null>(null);

  const priceForm = useForm<z.infer<typeof priceSchema>>({
    resolver: zodResolver(priceSchema),
    defaultValues: { id: initialPrices[0]?.id ?? "", price: initialPrices[0]?.price ?? 0 },
  });

  const shopForm = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: { name: "", price: 0, status: "AVAILABLE", specs: "" },
  });

  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", category: "", description: "" },
  });

  async function refreshAll() {
    const [pricesRes, shopRes, projRes] = await Promise.all([
      fetch("/api/admin/prices", { cache: "no-store" }),
      fetch("/api/admin/shop", { cache: "no-store" }),
      fetch("/api/admin/projects", { cache: "no-store" }),
    ]);

    if (pricesRes.ok) {
      setPrices(await pricesRes.json());
    }
    if (shopRes.ok) {
      setShop(await shopRes.json());
    }
    if (projRes.ok) {
      setProjects(await projRes.json());
    }
  }

  async function savePrice(values: z.infer<typeof priceSchema>) {
    await fetch("/api/admin/prices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    await refreshAll();
  }

  async function uploadShopImage(file: File) {
    setShopUploadError(null);
    setUploadingShop(true);
    setUploadProgressShop(15);
    try {
      validateImageFile(file);
      const url = await uploadPublicImage(file, "shop");
      setUploadProgressShop(100);
      setShopImageUrl(url);
    } catch (error) {
      setShopUploadError(error instanceof Error ? error.message : "Upload failed.");
      setUploadProgressShop(0);
    } finally {
      setUploadingShop(false);
    }
  }

  async function uploadProjectImage(file: File) {
    setProjectUploadError(null);
    setUploadingProject(true);
    setUploadProgressProject(15);
    try {
      validateImageFile(file);
      const url = await uploadPublicImage(file, "projects");
      setUploadProgressProject(100);
      setProjectImageUrl(url);
    } catch (error) {
      setProjectUploadError(error instanceof Error ? error.message : "Upload failed.");
      setUploadProgressProject(0);
    } finally {
      setUploadingProject(false);
    }
  }

  async function saveShop(values: z.infer<typeof shopSchema>) {
    const imageUrl = shopImageUrl || shop.find((item) => item.id === editingShopId)?.imageUrl;
    if (!imageUrl) {
      setShopUploadError("Please upload an image first.");
      return;
    }

    const method = editingShopId ? "PUT" : "POST";
    const endpoint = editingShopId ? `/api/admin/shop/${editingShopId}` : "/api/admin/shop";

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, imageUrl }),
    });

    setEditingShopId(null);
    setShopImageUrl("");
    setUploadProgressShop(0);
    setShopUploadError(null);
    shopForm.reset();
    await refreshAll();
  }

  async function deleteShop(id: string) {
    await fetch(`/api/admin/shop/${id}`, { method: "DELETE" });
    await refreshAll();
  }

  async function saveProject(values: z.infer<typeof projectSchema>) {
    const imageUrl = projectImageUrl || projects.find((item) => item.id === editingProjectId)?.imageUrl;
    if (!imageUrl) {
      setProjectUploadError("Please upload an image first.");
      return;
    }

    const method = editingProjectId ? "PUT" : "POST";
    const endpoint = editingProjectId ? `/api/admin/projects/${editingProjectId}` : "/api/admin/projects";

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, imageUrl }),
    });

    setEditingProjectId(null);
    setProjectImageUrl("");
    setUploadProgressProject(0);
    setProjectUploadError(null);
    projectForm.reset();
    await refreshAll();
  }

  async function deleteProject(id: string) {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    await refreshAll();
  }

  function editShop(item: ShopRow) {
    setEditingShopId(item.id);
    setShopImageUrl(item.imageUrl);
    setShopUploadError(null);
    setUploadProgressShop(100);
    shopForm.reset({
      name: item.name,
      price: item.price,
      status: item.status,
      specs: item.specs,
    });
  }

  function editProject(item: ProjectRow) {
    setEditingProjectId(item.id);
    setProjectImageUrl(item.imageUrl);
    setProjectUploadError(null);
    setUploadProgressProject(100);
    projectForm.reset({
      title: item.title,
      category: item.category,
      description: item.description,
    });
  }

  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(projects.map((project) => project.category.trim()).filter(Boolean)))],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = projectCategoryFilter === "ALL" || project.category === projectCategoryFilter;
      const query = projectQuery.trim().toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [projectCategoryFilter, projectQuery, projects]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <h1 className="font-headline text-4xl font-black tracking-tight text-text">{labels.title}</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-text/55">Service Prices</p>
          <p className="mt-2 font-headline text-2xl font-black text-primary">{prices.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-text/55">Shop Items</p>
          <p className="mt-2 font-headline text-2xl font-black text-primary">{shop.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-text/55">Portfolio Projects</p>
          <p className="mt-2 font-headline text-2xl font-black text-primary">{projects.length}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-headline text-xl font-black text-text">{labels.priceManagement}</h2>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {prices.map((row) => (
                <tr key={row.id} className="border-t border-gray-100">
                  <td className="py-2">{row.title}</td>
                  <td className="py-2 text-right text-primary">Rp {row.price.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form className="mt-4 space-y-3" onSubmit={priceForm.handleSubmit(savePrice)}>
            <select className="w-full rounded border border-gray-200 p-2 text-sm" {...priceForm.register("id")}>
              {prices.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.title}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded border border-gray-200 p-2 text-sm"
              type="number"
              {...priceForm.register("price", { valueAsNumber: true })}
            />
            <button className="w-full rounded bg-primary py-2 text-xs font-bold uppercase tracking-widest text-white" type="submit">
              {labels.save}
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-headline text-xl font-black text-text">{labels.shopInventory}</h2>
          <form className="mt-4 space-y-3" onSubmit={shopForm.handleSubmit(saveShop)}>
            <input className="w-full rounded border border-gray-200 p-2 text-sm" placeholder="Name" {...shopForm.register("name")} />
            <label className="block text-xs font-semibold uppercase tracking-wider text-text/70">
              Upload Image (.jpg .png .webp, max 2MB)
              <input
                className="mt-2 w-full rounded border border-gray-200 p-2 text-sm"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  await uploadShopImage(file);
                }}
              />
            </label>
            {uploadingShop ? (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded bg-gray-100">
                  <div className="h-2 animate-pulse bg-primary transition-all" style={{ width: `${uploadProgressShop}%` }} />
                </div>
                <p className="text-xs text-text/60">Uploading image...</p>
              </div>
            ) : null}
            {shopImageUrl ? <p className="truncate text-xs text-green-700">Image ready: {shopImageUrl}</p> : null}
            {shopUploadError ? <p className="text-xs text-red-600">{shopUploadError}</p> : null}
            <input
              className="w-full rounded border border-gray-200 p-2 text-sm"
              type="number"
              placeholder="Price"
              {...shopForm.register("price", { valueAsNumber: true })}
            />
            <select className="w-full rounded border border-gray-200 p-2 text-sm" {...shopForm.register("status")}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RESERVED">RESERVED</option>
              <option value="SOLD">SOLD</option>
            </select>
            <textarea className="w-full rounded border border-gray-200 p-2 text-sm" placeholder="Specs" {...shopForm.register("specs")} />
            <button className="w-full rounded bg-primary py-2 text-xs font-bold uppercase tracking-widest text-white" type="submit">
              {editingShopId ? (labels.update ?? "Update") : labels.create}
            </button>
          </form>
          <div className="mt-5 space-y-2 text-sm">
            {shop.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded border border-gray-100 p-2">
                <span>{item.name}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => editShop(item)}
                    className="text-xs font-bold uppercase text-blue-700"
                    type="button"
                  >
                    {labels.edit ?? "Edit"}
                  </button>
                  <button onClick={() => deleteShop(item.id)} className="text-xs font-bold uppercase text-red-600" type="button">
                    {labels.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-headline text-xl font-black text-text">{labels.projectManagement}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              className="w-full rounded border border-gray-200 p-2 text-sm"
              placeholder="Search project..."
              value={projectQuery}
              onChange={(event) => setProjectQuery(event.target.value)}
            />
            <select
              className="w-full rounded border border-gray-200 p-2 text-sm"
              value={projectCategoryFilter}
              onChange={(event) => setProjectCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <form className="mt-4 space-y-3" onSubmit={projectForm.handleSubmit(saveProject)}>
            <input className="w-full rounded border border-gray-200 p-2 text-sm" placeholder="Title" {...projectForm.register("title")} />
            <input className="w-full rounded border border-gray-200 p-2 text-sm" placeholder="Category" {...projectForm.register("category")} />
            <label className="block text-xs font-semibold uppercase tracking-wider text-text/70">
              Upload Image (.jpg .png .webp, max 2MB)
              <input
                className="mt-2 w-full rounded border border-gray-200 p-2 text-sm"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }
                  await uploadProjectImage(file);
                }}
              />
            </label>
            {uploadingProject ? (
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded bg-gray-100">
                  <div className="h-2 animate-pulse bg-primary transition-all" style={{ width: `${uploadProgressProject}%` }} />
                </div>
                <p className="text-xs text-text/60">Uploading image...</p>
              </div>
            ) : null}
            {projectImageUrl ? <p className="truncate text-xs text-green-700">Image ready: {projectImageUrl}</p> : null}
            {projectUploadError ? <p className="text-xs text-red-600">{projectUploadError}</p> : null}
            <textarea className="w-full rounded border border-gray-200 p-2 text-sm" placeholder="Description" {...projectForm.register("description")} />
            <button className="w-full rounded bg-primary py-2 text-xs font-bold uppercase tracking-widest text-white" type="submit">
              {editingProjectId ? (labels.update ?? "Update") : labels.create}
            </button>
          </form>
          <div className="mt-5 space-y-2 text-sm">
            {filteredProjects.map((project) => (
              <div key={project.id} className="rounded border border-gray-100 p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-xs text-text/60">{project.category}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-text/55">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => editProject(project)}
                      className="text-xs font-bold uppercase text-blue-700"
                      type="button"
                    >
                      {labels.edit ?? "Edit"}
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-xs font-bold uppercase text-red-600"
                      type="button"
                    >
                      {labels.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 ? <p className="text-xs text-text/55">No project matched your filter.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
