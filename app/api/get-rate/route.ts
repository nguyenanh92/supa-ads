import { NextResponse } from "next/server";
import convert from "xml-js";
import { createClient } from "@/utils/supabase/server";

const baseUrl = process.env.BANK_URL;

export async function GET() {
  try {
    if (!baseUrl) {
      throw new Error("BANK_URL environment variable is not defined");
    }

    // Lấy tỉ giá từ ngân hàng
    const rateResponse = await fetch(baseUrl);
    if (!rateResponse.ok) {
      throw new Error(`HTTP error! status: ${rateResponse.status}`);
    }

    const xmlData = await rateResponse.text();
    const rateData = JSON.parse(convert.xml2json(xmlData, { compact: true, spaces: 2 }));

    // Lấy setting từ database với public client
    const supabase = await createClient();
    const { data: settings, error } = await supabase.from("settings").select("*").eq("key", "PERCENT").single();

    console.log("🚀 ~ GET ~ settings:", settings)
    if (error) {
      throw error;
    }

    // Tìm tỉ giá USD
    const usdRate = rateData.ExrateList.Exrate.find((rate: any) => rate._attributes.CurrencyCode === "USD");

    if (!usdRate) {
      throw new Error("Không tìm thấy tỉ giá USD");
    }

    // // Tính toán giá trị
    const percentage = Number(settings?.value || 0);
    const rate = Number(usdRate._attributes.Buy.replace(/,/g, ""));
    const calculated = (rate * percentage) / 100;

    // Trả về object chứa đầy đủ thông tin
    return NextResponse.json(
      {
        percentage: settings?.value || 0,
        exchangeRate: {
          buy: usdRate._attributes.Buy,
          transfer: usdRate._attributes.Transfer,
          sell: usdRate._attributes.Sell,
        },
        calculated: calculated,
        lastUpdate: rateData.ExrateList.DateTime._text,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
