"use client"

import { deleteSetting, updateSetting } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/types/supabase";
import { useEffect, useState } from "react";

type Setting = Database['public']['Tables']['settings']['Row'];

interface SettingsListProps {
  settings: Setting[];
}

export function SettingsList({ settings }: SettingsListProps) {
  // const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [buyRate, setBuyRate] = useState<string>("");
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  useEffect(() => {
    // Lấy tỉ giá từ localStorage
    const savedRate = localStorage.getItem('exchangeRate');
    if (savedRate) {
      const rateData = JSON.parse(savedRate);
      setBuyRate(rateData._attributes.Buy);
      
      // Tính toán giá trị khi có tỉ giá và setting
      if (settings.length > 0) {
        const percentage = Number(settings[0].value);
        const rate = Number(rateData._attributes.Buy.replace(/,/g, ''));
        const calculated = (rate * percentage) / 100;
        setCalculatedValue(calculated);
      }
    }
  }, [settings]);

  async function handleUpdate(setting: Setting) {
    try {
      // Validate percentage value
      const numValue = Number(editValue);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        throw new Error("Giá trị phải từ 0 đến 100");
      }

      const updatedSetting = {
        id: setting.id,
        key: setting.key,
        value: editValue,
      };

      await updateSetting(updatedSetting);
      setEditingId(null);
      // toast({
      //   title: "Thành công",
      //   description: "Đã cập nhật cài đặt",
      // });
    } catch (error) {
      console.error("Error updating setting:", error);
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
        Chưa có cài đặt tỷ lệ phần trăm
      </div>
    );
  }

  // Only show the first setting (percentage)
  const setting = settings[0];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">Tỷ lệ phần trăm</span>
          </div>

          {editingId === setting.id ? (
            <div className="relative w-20">
              <Input
                type="number"
                min="0"
                max="100"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="pr-6 bg-white focus:ring-2 focus:ring-blue-500 border-blue-200"
                placeholder="0-100"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          ) : (
            <div className="min-w-[80px]">
              <span className="text-2xl font-bold text-blue-600">{setting.value}%</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tỉ giá mua:</span>
            <span className="text-base font-medium text-gray-900">
              {Number(buyRate.replace(/,/g, '')).toLocaleString('vi-VN')} VND
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Kết quả:</span>
            <span className="text-base font-medium text-green-600">
              {calculatedValue.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 