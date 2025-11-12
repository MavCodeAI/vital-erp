import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface QueryOptions {
  select?: string;
  filter?: Record<string, unknown>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

interface MutationVariables {
  id?: string;
  [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseTable = any;

export function useSupabaseQuery<T = unknown>(
  table: string,
  options?: QueryOptions
) {
  return useQuery({
    queryKey: [table, options],
    queryFn: async (): Promise<T[]> => {
      // Bypass strict typing for dynamic table access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseClient = supabase as any;
      let query = supabaseClient.from(table).select(options?.select || '*');
      
      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as T[];
    },
  });
}

export function useSupabaseMutation<T = unknown>(
  table: string,
  operation: 'insert' | 'update' | 'delete'
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (variables: MutationVariables) => {
      // Bypass strict typing for dynamic table access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseClient = supabase as any;
      let result;
      
      switch (operation) {
        case 'insert': {
          result = await supabaseClient.from(table).insert(variables);
          break;
        }
        case 'update': {
          const { id, ...updateData } = variables;
          result = await supabaseClient.from(table).update(updateData).eq('id', id);
          break;
        }
        case 'delete': {
          result = await supabaseClient.from(table).delete().eq('id', variables.id);
          break;
        }
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });
}
