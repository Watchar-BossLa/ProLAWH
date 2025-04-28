
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { task, inputs, model } = await req.json()
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    
    let result
    switch (task) {
      case 'text-generation':
        result = await hf.textGeneration({
          model: model || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.1
          }
        })
        break
      
      case 'image-to-text':
        result = await hf.imageToText({
          model: model || 'Salesforce/blip-image-captioning-large',
          data: inputs
        })
        break

      case 'text-to-image':
        result = await hf.textToImage({
          model: model || 'stabilityai/stable-diffusion-xl-base-1.0',
          inputs
        })
        break

      default:
        throw new Error(`Unsupported task: ${task}`)
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error in llm-inference:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
