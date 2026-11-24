import "server-only";
import { Groq } from "groq-sdk";

const apiKey = process.env.groq_key;
if (!apiKey) {
  throw new Error("GROQ_KEY is missing in .env.local");
}

export const groq = new Groq({ apiKey });