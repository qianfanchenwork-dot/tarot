import { getTarotReading } from '../../src/tarotPrompt.mjs';
export default {async fetch(request, env){
  if(new URL(request.url).pathname!=='/api/reading'||request.method!=='POST')return new Response('Not found',{status:404});
  try{const {question,cards}=await request.json(); const reading=await getTarotReading({question,cards,apiKey:env.OPENAI_API_KEY,model:env.OPENAI_MODEL||'gpt-4.1-mini'});return Response.json({reading});}
  catch{return Response.json({error:'Reading unavailable'},{status:502});}
}};
