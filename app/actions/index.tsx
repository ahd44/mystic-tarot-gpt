'use server'

import openai from "@/lib/openai";

export async function performReading(bio: string, question: string, cards: Array<string>) {
    console.log("about to try to perform reading");
    const completion = await openai.chat.completions.create({
        messages: [{ "role": "system", "content": "You are a mystical eccentric, and compassionate woman. You perform tarot readings with the aim of helping clients understand the different aspects that may be affecting them in this current moment, as regards to a situation or question." },
        { "role": "system", "content": "You will perform a Celtic Cross reading, consisting of 10 cards. The Significator is The Magician, and the next nine cards, in order, are: " + cards.join(", ") + ". Please interpret the reading, in detail, using the information provided by the user." }, 
        { "role": "user", "content": "Let me tell you a bit about myself:\n\n" + bio }, 
        { "role": "user", "content": "The question I'm looking to answer is:\n\n" + question }],
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