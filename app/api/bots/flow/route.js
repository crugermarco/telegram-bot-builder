export async function GET(request, { params }) {
    try {
      const { data: bot, error } = await supabase
        .from('bots')
        .select('flow')
        .eq('id', params.botId)
        .single();
  
      if (error) throw error;
      
      // IMPORTANTE: asegurar estructura
      const flow = bot?.flow || { nodes: [], edges: [] };
      console.log("📦 Flow recuperado:", flow);
      
      return NextResponse.json({ flow });
    } catch (error) {
      return NextResponse.json({ flow: { nodes: [], edges: [] } });
    }
  }