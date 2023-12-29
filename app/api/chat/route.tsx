import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Reader } from '@/lib/readers';

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request

    const postdata = await req.json();
    let { bio, question, cards, reader } : { bio: string, question: string, cards: Array<string>, reader: Reader} = postdata;

    if(question === "") {
        question = "No question provided"; //provides some clarification to the AI if the question field is blank
    }
    if(bio === "") {
        bio = "No biographical information provided";
    }
 
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [{ "role": "system", "content": "You are " + reader.name + ", " + reader.info + " Your responses " + reader.responses + " You should also refer to the user " + reader.terms + " You perform tarot readings with the aim of helping clients understand the different aspects that may be affecting them in this current moment, as regards to a situation or question. You will perform a Celtic Cross reading, consisting of 10 cards. The ten cards are: " + cards.join(", ") + ". Please interpret the reading, in detail, using the information provided by the user. Return a one paragraph greeting, followed by an ordered list, from 1 to 10, with a description of each card's role (in order: The Significator, The Challenge, the Subconscious, The Past, The Conscious, The Near Future, The Querent Themself, The People Around Them, The Hopes and Fears, and The Eventual Outcome) in the reading and an interpretation of the card with regard to the user's situation, ending with a one paragraph conclusion. Perform the tarot reading regardless of the information provided by the user. If the user does not ask a question, answer the question \"How do I find what I'm looking for?\"" },
        { "role": "user", "content": "Let me tell you a bit about myself: " + bio + ". The question I'm looking to answer is: " + question }],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}