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
      additional_tasks: {
        Row: {
          assigned_to: string
          created_at: string | null
          description: string
          drawing: string
          from_deviation_id: string | null
          id: string
          materials: string
          price: number
          project_id: string | null
          status: string
          task_id: string
          time_required: string
          title: string
        }
        Insert: {
          assigned_to: string
          created_at?: string | null
          description: string
          drawing: string
          from_deviation_id?: string | null
          id?: string
          materials: string
          price: number
          project_id?: string | null
          status: string
          task_id: string
          time_required: string
          title: string
        }
        Update: {
          assigned_to?: string
          created_at?: string | null
          description?: string
          drawing?: string
          from_deviation_id?: string | null
          id?: string
          materials?: string
          price?: number
          project_id?: string | null
          status?: string
          task_id?: string
          time_required?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "additional_tasks_from_deviation_id_fkey"
            columns: ["from_deviation_id"]
            isOneToOne: false
            referencedRelation: "deviations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "additional_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deviation_comments: {
        Row: {
          author: string
          created_at: string | null
          deviation_id: string | null
          id: string
          text: string
        }
        Insert: {
          author: string
          created_at?: string | null
          deviation_id?: string | null
          id?: string
          text: string
        }
        Update: {
          author?: string
          created_at?: string | null
          deviation_id?: string | null
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "deviation_comments_deviation_id_fkey"
            columns: ["deviation_id"]
            isOneToOne: false
            referencedRelation: "deviations"
            referencedColumns: ["id"]
          },
        ]
      }
      deviations: {
        Row: {
          approver_role: string
          assigned_to: string
          created_at: string | null
          description: string
          deviation_id: string
          drawing: string
          id: string
          image_url: string | null
          project_id: string | null
          status: string
          title: string
        }
        Insert: {
          approver_role: string
          assigned_to: string
          created_at?: string | null
          description: string
          deviation_id: string
          drawing: string
          id?: string
          image_url?: string | null
          project_id?: string | null
          status: string
          title: string
        }
        Update: {
          approver_role?: string
          assigned_to?: string
          created_at?: string | null
          description?: string
          deviation_id?: string
          drawing?: string
          id?: string
          image_url?: string | null
          project_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "deviations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      drawing_annotation_markers: {
        Row: {
          color: string
          drawing_id: string | null
          id: string
          position: string
        }
        Insert: {
          color: string
          drawing_id?: string | null
          id?: string
          position: string
        }
        Update: {
          color?: string
          drawing_id?: string | null
          id?: string
          position?: string
        }
        Relationships: [
          {
            foreignKeyName: "drawing_annotation_markers_drawing_id_fkey"
            columns: ["drawing_id"]
            isOneToOne: false
            referencedRelation: "drawings"
            referencedColumns: ["id"]
          },
        ]
      }
      drawings: {
        Row: {
          additional_tasks: number | null
          deviations: number | null
          id: string
          image_url: string
          project_id: string | null
          title: string
          updated_days_ago: number | null
          version: string
        }
        Insert: {
          additional_tasks?: number | null
          deviations?: number | null
          id?: string
          image_url: string
          project_id?: string | null
          title: string
          updated_days_ago?: number | null
          version: string
        }
        Update: {
          additional_tasks?: number | null
          deviations?: number | null
          id?: string
          image_url?: string
          project_id?: string | null
          title?: string
          updated_days_ago?: number | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "drawings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_communication_tools: {
        Row: {
          employee_id: string | null
          id: string
          tool: string
        }
        Insert: {
          employee_id?: string | null
          id?: string
          tool: string
        }
        Update: {
          employee_id?: string | null
          id?: string
          tool?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_communication_tools_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          id: string
          initials: string
          name: string
          phone: string | null
          project: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          initials: string
          name: string
          phone?: string | null
          project?: string | null
          role: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          initials?: string
          name?: string
          phone?: string | null
          project?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          description: string
          icon_type: string
          id: string
          read: boolean
          time: string
          title: string
          user_id: string | null
        }
        Insert: {
          description: string
          icon_type: string
          id?: string
          read?: boolean
          time?: string
          title: string
          user_id?: string | null
        }
        Update: {
          description?: string
          icon_type?: string
          id?: string
          read?: boolean
          time?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      project_communication_tools: {
        Row: {
          id: string
          project_id: string | null
          tool: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          tool: string
        }
        Update: {
          id?: string
          project_id?: string | null
          tool?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_communication_tools_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          count: number | null
          id: string
          priority: string
          project_id: string | null
        }
        Insert: {
          count?: number | null
          id?: string
          priority: string
          project_id?: string | null
        }
        Update: {
          count?: number | null
          id?: string
          priority?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stats: {
        Row: {
          additions: number | null
          deviations: number | null
          id: string
          project_id: string | null
          quality_assurance: number | null
        }
        Insert: {
          additions?: number | null
          deviations?: number | null
          id?: string
          project_id?: string | null
          quality_assurance?: number | null
        }
        Update: {
          additions?: number | null
          deviations?: number | null
          id?: string
          project_id?: string | null
          quality_assurance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stats_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          color: string
          id: string
          initials: string
          name: string
          project_id: string | null
          role: string
        }
        Insert: {
          color: string
          id?: string
          initials: string
          name: string
          project_id?: string | null
          role: string
        }
        Update: {
          color?: string
          id?: string
          initials?: string
          name?: string
          project_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_updates: {
        Row: {
          activity: string
          alert: boolean | null
          days_left: number | null
          id: string
          last_update: string | null
          progress: number
          project_id: string | null
          status: string
          team_size: number | null
          updated_by: string
        }
        Insert: {
          activity: string
          alert?: boolean | null
          days_left?: number | null
          id?: string
          last_update?: string | null
          progress: number
          project_id?: string | null
          status: string
          team_size?: number | null
          updated_by: string
        }
        Update: {
          activity?: string
          alert?: boolean | null
          days_left?: number | null
          id?: string
          last_update?: string | null
          progress?: number
          project_id?: string | null
          status?: string
          team_size?: number | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          budget: number | null
          category: string
          contact_person: string | null
          created_at: string | null
          customer: string | null
          description: string | null
          end_date: string | null
          id: string
          is_pinned: boolean | null
          name: string
          priority: string | null
          progress: number
          project_id: string
          project_name: string | null
          start_date: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          budget?: number | null
          category: string
          contact_person?: string | null
          created_at?: string | null
          customer?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_pinned?: boolean | null
          name: string
          priority?: string | null
          progress?: number
          project_id: string
          project_name?: string | null
          start_date?: string | null
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          budget?: number | null
          category?: string
          contact_person?: string | null
          created_at?: string | null
          customer?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_pinned?: boolean | null
          name?: string
          priority?: string | null
          progress?: number
          project_id?: string
          project_name?: string | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          due_date: string
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          due_date: string
          id?: string
          priority: string
          project_id?: string | null
          status: string
          title: string
        }
        Update: {
          created_at?: string | null
          due_date?: string
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          last_visited: string | null
          pinned_projects: string[] | null
          theme: string | null
          user_id: string
        }
        Insert: {
          id?: string
          last_visited?: string | null
          pinned_projects?: string[] | null
          theme?: string | null
          user_id: string
        }
        Update: {
          id?: string
          last_visited?: string | null
          pinned_projects?: string[] | null
          theme?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
