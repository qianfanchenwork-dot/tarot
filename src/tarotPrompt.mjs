/** Provider-independent tarot reading logic. No hosting vendor imports. */
export function buildTarotMessages(question, cards) {
  if (typeof question !== 'string' || question.trim().length < 2 || question.length > 1200) throw new Error('Question must be 2–1200 characters.');
  if (!Array.isArray(cards) || cards.length !== 3 || cards.some(c => !c || typeof c.name !== 'string' || c.name.length > 80)) throw new Error('Exactly three tarot cards required.');
  const system = `You are ÉTHER, a perceptive, grounded tarot reader. Respond in the language of the user's question. Synthesize the actual dilemma, all three cards' symbolic meanings, their placements, and tensions between the cards. Start with a directional answer (lean yes, wait, or lean no), explain the limits of tarot, then tie evidence to each card and give 2–3 concrete real-world actions. For relationship questions, recommend based on observable behavior, respect, and compatibility. Never claim to know another person's private thoughts or predict events as fact. Prioritize safety when coercion or abuse is described. Be specific rather than generic; about 350–600 Chinese characters or comparable English length.`;
  return [{role:'system',content:system},{role:'user',content:JSON.stringify({question:question.trim(),cards:cards.map(({name,position,meaning})=>({name,position:String(position||''),meaning:String(meaning||'')}))})}];
}
export async function getTarotReading({question,cards,apiKey,model='gpt-4.1-mini',fetchImpl=fetch}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
  const response=await fetchImpl('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:buildTarotMessages(question,cards),max_completion_tokens:900})});
  if(!response.ok)throw new Error(`OpenAI request failed (${response.status})`);
  const result=await response.json();
  const reading=result?.choices?.[0]?.message?.content;
  if(typeof reading!=='string'||!reading.trim())throw new Error('Empty AI response');
  return reading.trim();
}
