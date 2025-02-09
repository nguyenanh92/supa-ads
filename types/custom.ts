import { Database } from "./supabase";


export type Todo = Database["public"]["Tables"]["todos"]["Row"]
export type Settings = Database["public"]["Tables"]["settings"]["Row"]
