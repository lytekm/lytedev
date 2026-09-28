export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      page_views: {
        Row: { event_id: string; path: string; viewed_at: string };
        Insert: { event_id: string; path: string; viewed_at?: string };
        Update: { event_id?: string; path?: string; viewed_at?: string };
        Relationships: [];
      };
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          content: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          content: string;
          created_at: string;
          featured: boolean;
          github_url: string | null;
          home_highlight: boolean;
          id: string;
          image_url: string | null;
          is_experiment: boolean;
          live_url: string | null;
          published: boolean;
          short_description: string;
          slug: string;
          sort_order: number;
          status: string;
          technologies: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          featured?: boolean;
          github_url?: string | null;
          home_highlight?: boolean;
          id?: string;
          image_url?: string | null;
          is_experiment?: boolean;
          live_url?: string | null;
          published?: boolean;
          short_description: string;
          slug: string;
          sort_order?: number;
          status: string;
          technologies?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          featured?: boolean;
          github_url?: string | null;
          home_highlight?: boolean;
          id?: string;
          image_url?: string | null;
          is_experiment?: boolean;
          live_url?: string | null;
          published?: boolean;
          short_description?: string;
          slug?: string;
          sort_order?: number;
          status?: string;
          technologies?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      record_page_view: {
        Args: { p_path: string; p_event_id: string };
        Returns: undefined;
      };
      get_page_view_report: {
        Args: { p_days: number };
        Returns: Json;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      project_status: "Active" | "Released" | "Experimental" | "Archived" | "In Development";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
