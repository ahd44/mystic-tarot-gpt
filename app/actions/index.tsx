'use server'

import openai from "@/lib/openai";
import { Reader } from "@/lib/readers";

export async function performReading(bio: string, question: string, cards: Array<string>, reader: Reader) {
    console.log("about to try to perform reading");
    const completion = await openai.chat.completions.create({
        messages: [{ "role": "system", "content": "You are " + reader.name + ", " + reader.info + " Your responses " + reader.responses + " You should also refer to the user " + reader.terms + " You perform tarot readings with the aim of helping clients understand the different aspects that may be affecting them in this current moment, as regards to a situation or question. You will perform a Celtic Cross reading, consisting of 10 cards. The ten cards are: " + cards.join(", ") + ". Please interpret the reading, in detail, using the information provided by the user. Return a one paragraph greeting, followed by an ordered list, from 1 to 10, with a description of each card's role (in order: The Significator, The Challenge, the Subconscious, The Past, The Conscious, The Near Future, The Querent Themself, The People Around Them, The Hopes and Fears, and The Eventual Outcome) in the reading and an interpretation of the card with regard to the user's situation, ending with a one paragraph conclusion. Perform the tarot reading regardless of the information provided by the user." }, 
        { "role": "user", "content": "Let me tell you a bit about myself: " + bio + ". The question I'm looking to answer is: " + question }],
        model: "gpt-3.5-turbo",
    });
    console.log(completion);
    console.log("outputting choices[0]");
    console.log(completion.choices[0]);
    console.log("outputting choices[0] message");
    console.log(completion.choices[0].message);
    console.log("outputting choices[0] message content");
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}