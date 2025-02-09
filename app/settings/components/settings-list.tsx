  "use client"

import { deleteSetting, updateSetting } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/types/supabase";
import { useState } from "react";

type Setting = Database['public']['Tables']['settings']['Row'];

interface SettingsListProps {
  settings: Setting[];
}

export function SettingsList({ settings }: SettingsListProps) {
  // const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  async function handleUpdate(setting: Setting) {
    try {
      await updateSetting({
        ...setting,
        value: editValue
      });
      setEditingId(null);
      // toast({
      //   title: "Thành công",
      //   description: "Đã cập nhật cài đặt",
      // });
    } catch (error) {
      // toast({
      //   title: "Lỗi",
      //   description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
      //   variant: "destructive",
      // });
    }
  }

  async function handleDelete(key: string) {
    try {
      await deleteSetting(key);
      // toast({
      //   title: "Thành công",
      //   description: "Đã xóa cài đặt",
      // });
    } catch (error) {
      // toast({
      //   title: "Lỗi",
      //   description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
      //   variant: "destructive",
      // });
    }
  }

  if (settings.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Chưa có cài đặt nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div
          key={setting.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex-1">
            <p className="font-medium">{setting.key}</p>
            {editingId === setting.id ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="mt-2"
              />
            ) : (
              <p className="text-muted-foreground">{setting.value}</p>
            )}
          </div>
          <div className="flex gap-2">
            {editingId === setting.id ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => handleUpdate(setting)}
                >
                  Lưu
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(setting.id);
                    setEditValue(setting.value || "");
                  }}
                >
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(setting.key)}
                >
                  Xóa
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 