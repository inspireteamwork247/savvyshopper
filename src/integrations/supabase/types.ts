export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crawler_tasks: {
        Row: {
          created_at: string
          id: string
          index_urls: string[] | null
          last_run: string | null
          schedule_times: string[] | null
          scraper_type: Database["public"]["Enums"]["scraper_type"]
          selectors: Json | null
          sitemap_url: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          store_id: string
          updated_at: string
          url_pattern: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          index_urls?: string[] | null
          last_run?: string | null
          schedule_times?: string[] | null
          scraper_type: Database["public"]["Enums"]["scraper_type"]
          selectors?: Json | null
          sitemap_url?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          store_id: string
          updated_at?: string
          url_pattern?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          index_urls?: string[] | null
          last_run?: string | null
          schedule_times?: string[] | null
          scraper_type?: Database["public"]["Enums"]["scraper_type"]
          selectors?: Json | null
          sitemap_url?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          store_id?: string
          updated_at?: string
          url_pattern?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawler_tasks_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      retailers: {
        Row: {
          countries: string[]
          created_at: string
          id: string
          integration_type: Database["public"]["Enums"]["integration_type"]
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          countries: string[]
          created_at?: string
          id?: string
          integration_type?: Database["public"]["Enums"]["integration_type"]
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          countries?: string[]
          created_at?: string
          id?: string
          integration_type?: Database["public"]["Enums"]["integration_type"]
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      store_branches: {
        Row: {
          branch_id: string
          branch_url: string | null
          city: string
          country: string
          created_at: string
          house_number: string | null
          id: string
          last_updated: string
          latitude: number | null
          longitude: number | null
          offers_url: string | null
          retailer_id: string
          store_id: string
          street: string
          zip_code: string
        }
        Insert: {
          branch_id: string
          branch_url?: string | null
          city: string
          country: string
          created_at?: string
          house_number?: string | null
          id?: string
          last_updated?: string
          latitude?: number | null
          longitude?: number | null
          offers_url?: string | null
          retailer_id: string
          store_id: string
          street: string
          zip_code: string
        }
        Update: {
          branch_id?: string
          branch_url?: string | null
          city?: string
          country?: string
          created_at?: string
          house_number?: string | null
          id?: string
          last_updated?: string
          latitude?: number | null
          longitude?: number | null
          offers_url?: string | null
          retailer_id?: string
          store_id?: string
          street?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_branches_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_branches_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          country: string
          created_at: string
          id: string
          last_updated: string
          retailer_id: string
          store_name: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          last_updated?: string
          retailer_id: string
          store_name: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          last_updated?: string
          retailer_id?: string
          store_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      integration_type: "API" | "SCRAPER" | "MANUAL"
      scraper_type: "INDEXER" | "SCRAPE_PRODUCT_CSS" | "SCRAPE_PRODUCT_LLM"
      task_status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILURE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
