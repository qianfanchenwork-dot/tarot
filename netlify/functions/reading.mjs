import { getTarotReading } from '../../src/tarotPrompt.mjs';
export default async request => {
  if(request.method!=='POST') return Response.json({error:'Method not allowed'},{status:405});
  try {
    const size=Number(request.headers.get('content-length')||0);
    if(size>10000) return Response.json({error:'Request too large'},{status:413});
    const {question,cards}=await request.json();
    const reading=await getTarotReading({question,cards,apiKey:process.env.OPENAI_API_KEY,model:process.env.OPENAI_MODEL||'gpt-4.1-mini'});
    return Response.json({reading},{headers:{'Cache-Control':'no-store'}});
  } catch(err){
    const status=/configured/.test(err.message)?503:/Question|tarot cards/.test(err.message)?400:502;
    return Response.json({error:status===503?'AI service not configured':status===400?err.message:'AI reading is temporarily unavailable'},{status});
  }
};
export const config={path:'/.netlify/functions/reading'};
