import { SettingsList } from "@/app/settings/components/settings-list";
import { SettingsForm } from "@/app/settings/components/settings-form";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Lấy danh sách settings của user
  const { data: settings } = await supabase
    .from("settings")
    .select()
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("inserted_at", { ascending: false });

  return (
    <section className="p-3 pt-6 max-w-2xl w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Cài đặt
        </h1>
        <p className="text-muted-foreground">
          Quản lý các cài đặt của bạn
        </p>
      </div>

      <Separator className="w-full" />

      {/* Form thêm setting mới */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Thêm cài đặt mới</h2>
        <SettingsForm />
      </div>

      <Separator className="w-full" />

      {/* Danh sách settings */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Danh sách cài đặt</h2>
        <SettingsList settings={settings ?? []} />
      </div>
    </section>
  );
}
