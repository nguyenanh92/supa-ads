"use client"

import { createSetting } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsForm() {
  // const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      await createSetting(formData);
      // toast({
      //   title: "Thành công",
      //   description: "Đã thêm cài đặt mới",
      // });
    } catch (error) {
      // toast({
      //   title: "Lỗi",
      //   description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
      //   variant: "destructive",
      // });
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="key">Key</label>
          <Input
            id="key"
            name="key"
            placeholder="Nhập key..."
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="value">Giá trị</label>
          <Input
            id="value"
            name="value"
            placeholder="Nhập giá trị..."
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Thêm cài đặt
      </Button>
    </form>
  );
} 