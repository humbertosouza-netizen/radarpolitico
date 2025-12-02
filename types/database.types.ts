export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'usuario'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'usuario'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'usuario'
          created_at?: string
          updated_at?: string
        }
      }
      palavras_chaves: {
        Row: {
          id: number
          termo: string
          categoria: string
          created_at: string
        }
        Insert: {
          id?: number
          termo: string
          categoria: string
          created_at?: string
        }
        Update: {
          id?: number
          termo?: string
          categoria?: string
          created_at?: string
        }
      }
      investigador_mencoes: {
        Row: {
          id: number | string
          resumo?: string
          descricao?: string
          texto?: string
          prioridade?: 'alta' | 'media' | 'baixa' | string
          tipo?: string
          palavras_chave?: string[] | string
          grupo?: string
          fonte?: string
          origem?: string
          created_at?: string
          data?: string
          [key: string]: any
        }
        Insert: {
          id?: number | string
          resumo?: string
          descricao?: string
          texto?: string
          prioridade?: 'alta' | 'media' | 'baixa' | string
          tipo?: string
          palavras_chave?: string[] | string
          grupo?: string
          fonte?: string
          origem?: string
          created_at?: string
          data?: string
          [key: string]: any
        }
        Update: {
          id?: number | string
          resumo?: string
          descricao?: string
          texto?: string
          prioridade?: 'alta' | 'media' | 'baixa' | string
          tipo?: string
          palavras_chave?: string[] | string
          grupo?: string
          fonte?: string
          origem?: string
          created_at?: string
          data?: string
          [key: string]: any
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'usuario'
    }
  }
}

