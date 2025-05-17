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
      account_categories: {
        Row: {
          account_type: string
          code: string
          company_id: number
          created_at: string | null
          id: number
          name: string
          subgroup_id: number
          type: string
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          code: string
          company_id: number
          created_at?: string | null
          id?: number
          name: string
          subgroup_id: number
          type: string
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          code?: string
          company_id?: number
          created_at?: string | null
          id?: number
          name?: string
          subgroup_id?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_categories_subgroup_id_fkey"
            columns: ["subgroup_id"]
            isOneToOne: false
            referencedRelation: "account_subgroups"
            referencedColumns: ["id"]
          },
        ]
      }
      account_groups: {
        Row: {
          account_type: string
          code: string
          company_id: number
          created_at: string | null
          id: number
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          code: string
          company_id: number
          created_at?: string | null
          id?: number
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          code?: string
          company_id?: number
          created_at?: string | null
          id?: number
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      account_subgroups: {
        Row: {
          account_type: string
          code: string
          company_id: number
          created_at: string | null
          group_id: number
          id: number
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          code: string
          company_id: number
          created_at?: string | null
          group_id: number
          id?: number
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          code?: string
          company_id?: number
          created_at?: string | null
          group_id?: number
          id?: number
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_subgroups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_subgroups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "account_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          balance: number
          bank: string
          company_id: number
          created_at: string | null
          id: number
          name: string
          number: string
          updated_at: string | null
        }
        Insert: {
          balance?: number
          bank: string
          company_id: number
          created_at?: string | null
          id?: never
          name: string
          number: string
          updated_at?: string | null
        }
        Update: {
          balance?: number
          bank?: string
          company_id?: number
          created_at?: string | null
          id?: never
          name?: string
          number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          account_type: string
          code: string
          company_id: number
          created_at: string | null
          id: number
          name: string
          parent_id: number | null
          type: Database["public"]["Enums"]["category_type"]
          updated_at: string | null
        }
        Insert: {
          account_type?: string
          code?: string
          company_id: number
          created_at?: string | null
          id?: never
          name: string
          parent_id?: number | null
          type: Database["public"]["Enums"]["category_type"]
          updated_at?: string | null
        }
        Update: {
          account_type?: string
          code?: string
          company_id?: number
          created_at?: string | null
          id?: never
          name?: string
          parent_id?: number | null
          type?: Database["public"]["Enums"]["category_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cnpj: string
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          id?: never
          name: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          id?: never
          name?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_id: string
          created_at: string | null
          email: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          auth_id: string
          created_at?: string | null
          email: string
          id?: never
          name: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string
          created_at?: string | null
          email?: string
          id?: never
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_users: {
        Row: {
          active: boolean
          created_at: string | null
          email: string
          id: number
          invited_by: number
          role: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          email: string
          id?: number
          invited_by: number
          role: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          active?: boolean
          created_at?: string | null
          email?: string
          id?: number
          invited_by?: number
          role?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "system_users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_category_id: number | null
          amount: number
          bank_account_id: number
          category_id: number | null
          created_at: string | null
          date: string
          description: string
          id: number
          reconciled: boolean
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          account_category_id?: number | null
          amount: number
          bank_account_id: number
          category_id?: number | null
          created_at?: string | null
          date: string
          description: string
          id?: never
          reconciled?: boolean
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          account_category_id?: number | null
          amount?: number
          bank_account_id?: number
          category_id?: number | null
          created_at?: string | null
          date?: string
          description?: string
          id?: never
          reconciled?: boolean
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_category_id_fkey"
            columns: ["account_category_id"]
            isOneToOne: false
            referencedRelation: "account_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      category_type: "income" | "expense" | "transfer" | "asset" | "liability"
      transaction_type: "income" | "expense" | "transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      category_type: ["income", "expense", "transfer", "asset", "liability"],
      transaction_type: ["income", "expense", "transfer"],
    },
  },
} as const
