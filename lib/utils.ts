import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// conversation options
export const createConversationOptions = (
  API_KEY: string,
  replica_id: string,
  persona_id: string,
  conversation_name: string,
  conversational_context: string,
  custom_greeting: string
) => {
  const options = {
    method: "POST",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: `{"replica_id": ${replica_id},"persona_id": ${persona_id},"conversation_name": ${conversation_name},"conversational_context": ${conversational_context},"custom_greeting": ${custom_greeting},"properties":{"max_call_duration":3600,"participant_left_timeout":60,}}`,
  };

  return options;
};

// persona options
export const createPersona = (
  API_KEY: string,
  persona_name: string,
  system_prompt: string,
  context: string,
  default_replica_id: string,
  model: string,
  model_base_url: string,
  model_api_key: string,
  tts_api_key: string,
  tts_engine: string,
  external_voice_id: string,
  enable_vision: boolean
) => {
  const options = {
    method: "POST",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: `{
    "persona_name":${persona_name},
    "system_prompt":${system_prompt},
    "context":${context},
    "default_replica_id":${default_replica_id},
    "layers":
    {"llm":
    {"model":${model},
    "base_url": ${model_base_url},
    "api_key": ${model_api_key}
    },
    "tts":
    {
    "api_key": ${tts_api_key},
    "tts_engine": ${tts_engine},
    "external_voice_id": ${external_voice_id}
    },
    "vqa":{
    "enable_vision": ${enable_vision}
    }
    }
    }`,
  };

  return options;
};
