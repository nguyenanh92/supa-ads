"use server"

import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type Setting = Database['public']['Tables']['settings']['Row'];
type SettingInsert = Omit<Database['public']['Tables']['settings']['Insert'], 'user_id'> & {
  user_id?: string; // Make user_id optional in client-side types
};
type SettingUpdate = Database['public']['Tables']['settings']['Update'];

// Helper function để kiểm tra user và khởi tạo client
async function getAuthenticatedClient() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Người dùng chưa đăng nhập");
    }

    return { supabase, user };
}

// Xử lý lỗi chung
function handleDatabaseError(error: any, action: string) {
    console.error(`Lỗi ${action}:`, error);
    throw new Error(`Lỗi khi ${action}`);
}

// Lấy tất cả settings của user
export async function getSettings() {
    try {
        const { supabase, user } = await getAuthenticatedClient();
        
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);

        if (error) throw error;
        
        return data as Setting[];
    } catch (error) {
        handleDatabaseError(error, "lấy cài đặt");
    }
}

// Lấy một setting theo key
export async function getSetting(key: string) {
    try {
        const { supabase, user } = await getAuthenticatedClient();
        
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('user_id', user.id)
            .eq('key', key)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        
        return data as Setting;
    } catch (error) {
        handleDatabaseError(error, "lấy cài đặt");
    }
}

// Thêm setting mới
export async function createSetting(settingData: SettingInsert) {
    if (!settingData.key?.trim()) {
        throw new Error("Key không được để trống");
    }

    try {
        const { supabase, user } = await getAuthenticatedClient();

        const newSetting: SettingInsert = {
            ...settingData,
            user_id: user.id,
            is_active: true,
            inserted_at: new Date().toISOString()
        };
        
        const { error } = await supabase
            .from('settings')
            .insert(newSetting as Database['public']['Tables']['settings']['Insert']);

        if (error) throw error;

        revalidatePath("/settings");
    } catch (error) {
        handleDatabaseError(error, "tạo cài đặt");
    }
}

// Cập nhật setting
export async function updateSetting(setting: SettingUpdate) {
    if (!setting.key) {
        throw new Error("Key không được để trống");
    }

    try {
        const { supabase, user } = await getAuthenticatedClient();
        
        const { error } = await supabase
            .from('settings')
            .update({
                ...setting,
                inserted_at: new Date().toISOString()
            })
            .match({ 
                user_id: user.id, 
                key: setting.key 
            });

        if (error) throw error;

        revalidatePath("/settings");
    } catch (error) {
        handleDatabaseError(error, "cập nhật cài đặt");
    }
}

// Xóa setting (soft delete)
export async function deleteSetting(key: string) {
    try {
        const { supabase, user } = await getAuthenticatedClient();
        
        const { error } = await supabase
            .from('settings')
            .update({ 
                is_active: false,
                inserted_at: new Date().toISOString()
            })
            .match({ 
                user_id: user.id, 
                key: key 
            });

        if (error) throw error;

        revalidatePath("/settings");
    } catch (error) {
        handleDatabaseError(error, "xóa cài đặt");
    }
}