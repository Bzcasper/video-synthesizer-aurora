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
      ai_embeddings: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: string | null
        }
        Relationships: []
      }
      api_endpoints: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          method: string
          model_id: string | null
          name: string
          path: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          method: string
          model_id?: string | null
          name: string
          path: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string
          model_id?: string | null
          name?: string
          path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_endpoints_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "data_models"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          status: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      content_model_fields: {
        Row: {
          created_at: string | null
          field_type: string
          id: string
          is_ai_generated: boolean | null
          model_id: string
          name: string
          required: boolean | null
        }
        Insert: {
          created_at?: string | null
          field_type: string
          id?: string
          is_ai_generated?: boolean | null
          model_id: string
          name: string
          required?: boolean | null
        }
        Update: {
          created_at?: string | null
          field_type?: string
          id?: string
          is_ai_generated?: boolean | null
          model_id?: string
          name?: string
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "content_model_fields_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "content_models"
            referencedColumns: ["id"]
          },
        ]
      }
      content_models: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      content_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          model_id: string
          name: string
          schedule: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          model_id: string
          name: string
          schedule?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          model_id?: string
          name?: string
          schedule?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_templates_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "content_models"
            referencedColumns: ["id"]
          },
        ]
      }
      data_models: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      diy_trending_projects: {
        Row: {
          created_at: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: never
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: never
          title?: string
        }
        Relationships: []
      }
      job_assets: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          type: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_assets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "video_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      modal_docs: {
        Row: {
          content: string
          embedding: string | null
          id: string
        }
        Insert: {
          content: string
          embedding?: string | null
          id?: string
        }
        Update: {
          content?: string
          embedding?: string | null
          id?: string
        }
        Relationships: []
      }
      model_fields: {
        Row: {
          created_at: string | null
          field_type: string
          id: string
          model_id: string
          name: string
          required: boolean | null
        }
        Insert: {
          created_at?: string | null
          field_type: string
          id?: string
          model_id: string
          name: string
          required?: boolean | null
        }
        Update: {
          created_at?: string | null
          field_type?: string
          id?: string
          model_id?: string
          name?: string
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "model_fields_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "data_models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      scraped_content: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          images: string[] | null
          keywords: string[] | null
          title: string | null
          url: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          keywords?: string[] | null
          title?: string | null
          url: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          images?: string[] | null
          keywords?: string[] | null
          title?: string | null
          url?: string
        }
        Relationships: []
      }
      scraped_data: {
        Row: {
          content: string
          id: number
          media_url: string | null
          platform: string
          snapshot_hash: string | null
          title: string
          url: string
        }
        Insert: {
          content: string
          id?: number
          media_url?: string | null
          platform: string
          snapshot_hash?: string | null
          title: string
          url: string
        }
        Update: {
          content?: string
          id?: number
          media_url?: string | null
          platform?: string
          snapshot_hash?: string | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      synthetic_data: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      trending_content: {
        Row: {
          content: string
          id: number
          image_hash: string | null
          image_url: string | null
          markdown: string
          platform: string
          title: string
          url: string
        }
        Insert: {
          content: string
          id?: number
          image_hash?: string | null
          image_url?: string | null
          markdown: string
          platform: string
          title: string
          url: string
        }
        Update: {
          content?: string
          id?: number
          image_hash?: string | null
          image_url?: string | null
          markdown?: string
          platform?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      video_jobs: {
        Row: {
          callback_metadata: Json | null
          created_at: string | null
          duration: number
          error_message: string | null
          id: string
          output_url: string | null
          processing_completed_at: string | null
          processing_started_at: string | null
          prompt: string
          resolution: Json
          status: Database["public"]["Enums"]["video_job_status"] | null
          style: string | null
          updated_at: string | null
          user_id: string | null
          webhook_url: string | null
        }
        Insert: {
          callback_metadata?: Json | null
          created_at?: string | null
          duration: number
          error_message?: string | null
          id?: string
          output_url?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          prompt: string
          resolution: Json
          status?: Database["public"]["Enums"]["video_job_status"] | null
          style?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Update: {
          callback_metadata?: Json | null
          created_at?: string | null
          duration?: number
          error_message?: string | null
          id?: string
          output_url?: string | null
          processing_completed_at?: string | null
          processing_started_at?: string | null
          prompt?: string
          resolution?: Json
          status?: Database["public"]["Enums"]["video_job_status"] | null
          style?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          actionable: string[] | null
          channel: string | null
          created_at: string
          description: string | null
          id: number
          keypoints: string[] | null
          quotes: string[] | null
          summary: string | null
          tags: string[] | null
          title: string | null
          transcript: string | null
          video_id: string | null
        }
        Insert: {
          actionable?: string[] | null
          channel?: string | null
          created_at?: string
          description?: string | null
          id?: number
          keypoints?: string[] | null
          quotes?: string[] | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          video_id?: string | null
        }
        Update: {
          actionable?: string[] | null
          channel?: string | null
          created_at?: string
          description?: string | null
          id?: number
          keypoints?: string[] | null
          quotes?: string[] | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          video_id?: string | null
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          response_body: string | null
          response_code: number | null
          status: string
          webhook_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          response_body?: string | null
          response_code?: number | null
          status: string
          webhook_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          response_body?: string | null
          response_code?: number | null
          status?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          events: Json
          id: string
          is_active: boolean | null
          model_id: string | null
          name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events?: Json
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: Json
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "data_models"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_agent_data: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string | null
          tags: string[] | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_any_json: {
        Args: {
          input_json: Json
        }
        Returns: Json
      }
      analyze_diy_trends: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["trend_analysis"][]
      }
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      embedding_input: {
        Args: {
          doc: unknown
        }
        Returns: string
      }
      get_date_ranges: {
        Args: Record<PropertyKey, never>
        Returns: {
          window_start: string
          window_end: string
        }[]
      }
      get_diy_trends: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: unknown
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: unknown
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      match_youtube_data: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      video_job_status: "pending" | "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
      trend_analysis: {
        trend_id: string | null
        title: string | null
        description: string | null
        engagement_score: number | null
        sentiment_score: number | null
        velocity_score: number | null
        cross_platform_score: number | null
        total_score: number | null
        sources: Json | null
        recommendations: Json | null
      }
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
