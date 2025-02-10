"use client"

import { createSetting, updateSetting, getSetting } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";

export function SettingsForm() {
  // const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    try {
      // First get existing setting
      const existingSetting = await getSetting("PERCENT");
      
      // Then create settingData using existingSetting
      const value = formData.get("value");
      const settingData = {
        key: "PERCENT",
        value: value?.toString() || "",
        ...(existingSetting && { id: existingSetting.id })
      };

      if (existingSetting) {
        await updateSetting(settingData);
      } else {
        await createSetting(settingData);
      }
      // toast({
      //   title: "Thành công",
      //   description: "Đã cập nhật tỷ lệ phần trăm",
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
    <form action={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="value" 
          className="text-lg font-medium"
        >
          Tỷ lệ phần trăm (%)
        </label>
        <Input
          id="value"
          name="value"
          type="number"
          min="0"
          max="100"
          placeholder="Nhập tỷ lệ phần trăm..."
          required
          className="text-lg"
        />
        <p className="text-sm text-gray-500">
          Nhập giá trị từ 0 đến 100
        </p>
      </div>
      <Button 
        type="submit" 
        className="w-full text-lg py-6"
      >
        Cập nhật tỷ lệ
      </Button>
    </form>
  );
} 