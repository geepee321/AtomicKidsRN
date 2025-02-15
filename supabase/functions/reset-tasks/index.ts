import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Sydney's current date
    const sydneyDate = new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
    const sydneyDateOnly = new Date(sydneyDate).toISOString().split('T')[0]

    // First, get all children and their tasks
    const { data: children, error: childrenError } = await supabaseClient
      .from('children')
      .select(`
        id,
        streak,
        last_completed_at,
        tasks (
          id,
          completed,
          completed_at
        )
      `)

    if (childrenError) throw childrenError

    // Process each child
    for (const child of children) {
      const allTasksCompleted = child.tasks.length > 0 && 
        child.tasks.every((task: any) => task.completed)
      
      // If tasks are not all completed, reset streak
      if (!allTasksCompleted) {
        const { error: updateError } = await supabaseClient
          .from('children')
          .update({
            streak: 0,
            last_completed_at: null
          })
          .eq('id', child.id)

        if (updateError) throw updateError
      }
    }

    // Reset all completed tasks
    const { error: updateError } = await supabaseClient
      .from('tasks')
      .update({
        completed: false,
        completed_at: null
      })
      .eq('completed', true)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ message: 'Tasks and streaks reset successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 